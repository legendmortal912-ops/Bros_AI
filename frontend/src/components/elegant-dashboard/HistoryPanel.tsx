import { useState } from "react";
import { CheckCircle2, XCircle, Search, Filter, ChevronDown, ChevronUp, Clock, Loader2 } from "lucide-react";

export interface HistoryTaskRow {
  id: string;
  instruction: string;
  status: string;
  created_at: string;
  duration_seconds: number | null;
  tools_used: string[];
  steps: string[];
  result: string | null;
}

interface HistoryPanelProps {
  tasks: HistoryTaskRow[];
  loading?: boolean;
}

export default function HistoryPanel({ tasks, loading }: HistoryPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Task History</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
            {loading ? "Loading…" : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} · ${completedCount} completed`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              cursor: "default",
              fontFamily: "inherit",
              opacity: 0.6,
            }}
          >
            <Search size={13} />
            Search
          </button>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              cursor: "default",
              fontFamily: "inherit",
              opacity: 0.6,
            }}
          >
            <Filter size={13} />
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            color: "rgba(255,255,255,0.35)",
            gap: 10,
          }}
        >
          <Loader2 size={22} className="elegant-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "300px",
            gap: "12px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
          }}
        >
          <Clock size={28} color="rgba(167,139,250,0.35)" />
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>No task history yet</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
            Run a task from the dashboard to get started
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tasks.map((task) => {
            const isOpen = expanded === task.id;
            const displayStatus =
              task.status === "completed" ? "done" : task.status === "failed" ? "error" : "pending";
            return (
              <div key={task.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : task.id)}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139,92,246,0.06)";
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  {displayStatus === "done" ? (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(52,211,153,0.1)",
                        border: "1px solid rgba(52,211,153,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={16} color="#34d399" />
                    </div>
                  ) : displayStatus === "error" ? (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <XCircle size={16} color="#f87171" />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(251,191,36,0.1)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Loader2 size={16} color="#fbbf24" className="elegant-spin" />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#fff",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "4px",
                      }}
                    >
                      {task.instruction}
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                        {new Date(task.created_at).toLocaleString()}
                      </span>
                      {task.duration_seconds != null && (
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                          {task.duration_seconds}s
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#a78bfa",
                          background: "rgba(139,92,246,0.12)",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          marginBottom: "4px",
                        }}
                      >
                        {(task.tools_used ?? []).length} tools
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color:
                            task.status === "completed"
                              ? "#34d399"
                              : task.status === "failed"
                                ? "#f87171"
                                : "#fbbf24",
                        }}
                      >
                        {task.status}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={16} color="rgba(255,255,255,0.25)" />
                    ) : (
                      <ChevronDown size={16} color="rgba(255,255,255,0.25)" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      marginTop: 8,
                      marginLeft: 8,
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(0,0,0,0.25)",
                    }}
                  >
                    {task.steps?.length > 0 && (
                      <div style={{ marginBottom: task.result ? 16 : 0 }}>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.35)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 8,
                          }}
                        >
                          Steps
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {task.steps.map((step, i) => (
                            <p key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", fontFamily: "monospace" }}>
                              {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {task.result && (
                      <div>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.35)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 8,
                          }}
                        >
                          Result
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.85)",
                            lineHeight: 1.6,
                            background: "rgba(139,92,246,0.06)",
                            border: "1px solid rgba(139,92,246,0.12)",
                            borderRadius: "10px",
                            padding: "12px 14px",
                          }}
                        >
                          {task.result}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
