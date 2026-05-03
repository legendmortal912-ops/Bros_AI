import { useState, useRef, useEffect, useCallback } from "react";
import WorkflowBanner from "../components/elegant-dashboard/WorkflowBanner";
import TaskInput from "../components/elegant-dashboard/TaskInput";
import ExecutionLog, { type LogEntry } from "../components/elegant-dashboard/ExecutionLog";
import RecentTasks, { type TaskRecord } from "../components/elegant-dashboard/RecentTasks";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { useDashboardStatsContext } from "../context/DashboardStatsContext";

interface Step {
  type: "plan" | "tool" | "result" | "error";
  message: string;
  tool?: string;
  timestamp: number;
}

interface TaskHistory {
  id: string;
  instruction: string;
  status: string;
  created_at: string;
  tools_used: string[];
  duration_seconds: number | null;
}

function formatLogTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour12: false });
}

function stepToLog(step: Step): LogEntry {
  const time = formatLogTime(step.timestamp);
  switch (step.type) {
    case "plan":
      return { time, type: "planning", message: step.message };
    case "tool":
      return {
        time,
        type: "tool",
        message: step.tool ? `[${step.tool}] ${step.message}` : step.message,
      };
    case "result":
      return { time, type: "success", message: step.message };
    case "error":
      return { time, type: "error", message: step.message };
    default:
      return { time, type: "info", message: step.message };
  }
}

/** Prefer human-readable text when DB stores JSON / LangChain message shapes */
function formatTaskResultForChat(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  try {
    const j = JSON.parse(t) as unknown;
    if (Array.isArray(j) && j.length > 0 && typeof j[0] === "object" && j[0] !== null) {
      const row = j[0] as Record<string, unknown>;
      if (typeof row.text === "string") return row.text;
      if (typeof row.content === "string") return row.content;
    }
    if (typeof j === "object" && j !== null) {
      const o = j as Record<string, unknown>;
      if (typeof o.text === "string") return o.text;
      if (typeof o.content === "string") return o.content;
    }
  } catch {
    /* keep raw */
  }
  return t.length > 6000 ? `${t.slice(0, 6000)}…` : t;
}

function toSidebarTasks(rows: TaskHistory[]): TaskRecord[] {
  return rows.map((task) => ({
    id: task.id,
    task: task.instruction,
    status:
      task.status === "completed"
        ? "done"
        : task.status === "failed"
          ? "error"
          : "pending",
    time: new Date(task.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    toolsUsed: task.tools_used?.length ?? 0,
    duration: task.duration_seconds != null ? `${task.duration_seconds}s` : "—",
  }));
}

export default function DashboardPage() {
  const { session } = useAuth();
  const { refresh: refreshStats } = useDashboardStatsContext();

  const [instruction, setInstruction] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [errored, setErrored] = useState(false);
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [fillInstruction, setFillInstruction] = useState("");

  const esRef = useRef<EventSource | null>(null);

  const loadHistory = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from("task_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setHistory(data as TaskHistory[]);
  }, [session]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const runTaskFromParent = async (text: string) => {
    if (!text.trim() || running || !session) return;
    setInstruction(text.trim());
    setSteps([]);
    setDone(false);
    setErrored(false);
    setRunning(true);

    const token = session.access_token;
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

    let taskId: string;
    try {
      const res = await fetch(`${API_BASE}/api/tasks/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ instruction: text.trim() }),
      });
      const data = await res.json();
      taskId = data.task_id;
    } catch {
      setSteps([{ type: "error", message: "Failed to connect to backend. Make sure the server is running.", timestamp: Date.now() }]);
      setRunning(false);
      setErrored(true);
      return;
    }

    const es = new EventSource(`${API_BASE}/api/tasks/${taskId}/stream?token=${encodeURIComponent(token)}`);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as Omit<Step, "timestamp">;
        setSteps((prev) => [...prev, { ...data, timestamp: Date.now() }]);
      } catch {
        /* ignore */
      }
    };

    es.addEventListener("done", () => {
      es.close();
      setRunning(false);
      setDone(true);
      void (async () => {
        // Stream sometimes omits the final assistant text; DB row has authoritative result.
        try {
          const { data } = await supabase
            .from("task_history")
            .select("result")
            .eq("id", taskId)
            .single();
          const raw = data?.result as string | null | undefined;
          if (raw && String(raw).trim()) {
            const text = formatTaskResultForChat(String(raw));
            if (text) {
              setSteps((prev) => {
                const hasResult = prev.some((s) => s.type === "result");
                if (hasResult) return prev;
                return [...prev, { type: "result", message: `✅ ${text}`, timestamp: Date.now() }];
              });
            }
          }
        } catch {
          /* ignore */
        }
        loadHistory();
        refreshStats();
      })();
    });

    es.onerror = () => {
      es.close();
      setRunning(false);
      setErrored(true);
      setSteps((prev) => [...prev, { type: "error", message: "Stream connection lost.", timestamp: Date.now() }]);
    };
  };

  const reset = () => {
    esRef.current?.close();
    // Keep the last run visible in the chat panel; starting a new task clears steps in runTaskFromParent.
    setRunning(false);
    setDone(false);
    setErrored(false);
  };

  const logs: LogEntry[] = steps.map(stepToLog);
  const terminalStatus: "running" | "done" | "error" | "idle" = running
    ? "running"
    : errored
      ? "error"
      : done
        ? "done"
        : steps.length > 0
          ? "done"
          : "idle";

  const sidebarTasks = toSidebarTasks(history);

  return (
    <div style={{ display: "flex", flex: 1, gap: "20px", minHeight: 0, flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "20px",
          minHeight: 0,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
          <WorkflowBanner />
          <TaskInput
            fillInstruction={fillInstruction}
            onRunTask={(t) => void runTaskFromParent(t)}
            isRunning={running}
          />
          {(steps.length > 0 || running || done || errored) && terminalStatus !== "idle" && (
            <ExecutionLog
              task={instruction || "…"}
              logs={logs}
              status={terminalStatus}
              onReset={reset}
            />
          )}
        </div>

        <div style={{ width: "100%", maxWidth: "320px", flex: "1 1 260px" }}>
          <RecentTasks
            tasks={sidebarTasks}
            onSelect={(t) => setFillInstruction(t.task)}
          />
        </div>
      </div>
    </div>
  );
}