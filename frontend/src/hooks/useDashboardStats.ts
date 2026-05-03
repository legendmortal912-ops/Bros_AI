import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

export interface DashboardStats {
  tasksRun: number;
  completed: number;
  hoursSaved: number;
  toolsUsed: number;
}

export function useDashboardStats() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    tasksRun: 0,
    completed: 0,
    hoursSaved: 0,
    toolsUsed: 0,
  });

  const refresh = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from("task_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data && data.length > 0) {
      setStats({
        tasksRun: data.length,
        completed: data.filter((t: { status: string }) => t.status === "completed").length,
        hoursSaved: Math.floor(
          (data.reduce(
            (a: number, t: { duration_seconds?: number | null }) => a + (t.duration_seconds ?? 0),
            0
          ) /
            3600) *
            3
        ),
        toolsUsed: new Set(
          data.flatMap((t: { tools_used?: string[] | null }) => t.tools_used ?? [])
        ).size,
      });
    } else if (data && data.length === 0) {
      setStats({ tasksRun: 0, completed: 0, hoursSaved: 0, toolsUsed: 0 });
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, refresh };
}
