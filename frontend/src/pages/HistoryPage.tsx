import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import HistoryPanel, { type HistoryTaskRow } from "../components/elegant-dashboard/HistoryPanel";

export default function HistoryPage() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<HistoryTaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      if (!session) return;
      setLoading(true);
      const { data } = await supabase
        .from("task_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!cancelled && data) {
        setTasks(
          data.map((row: Record<string, unknown>) => ({
            id: String(row.id),
            instruction: String(row.instruction ?? ""),
            status: String(row.status ?? ""),
            created_at: String(row.created_at ?? ""),
            duration_seconds: (row.duration_seconds as number | null | undefined) ?? null,
            tools_used: (row.tools_used as string[] | null | undefined) ?? [],
            steps: (row.steps as string[] | null | undefined) ?? [],
            result: (row.result as string | null | undefined) ?? null,
          }))
        );
      }
      if (!cancelled) setLoading(false);
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [session]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <HistoryPanel tasks={tasks} loading={loading} />
    </div>
  );
}
