import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { DashboardStats } from "../hooks/useDashboardStats";

interface Ctx {
  stats: DashboardStats;
  refresh: () => Promise<void>;
}

const DashboardStatsContext = createContext<Ctx | null>(null);

export function DashboardStatsProvider({
  stats,
  refresh,
  children,
}: {
  stats: DashboardStats;
  refresh: () => Promise<void>;
  children: ReactNode;
}) {
  return (
    <DashboardStatsContext.Provider value={{ stats, refresh }}>
      {children}
    </DashboardStatsContext.Provider>
  );
}

export function useDashboardStatsContext() {
  const v = useContext(DashboardStatsContext);
  if (!v) throw new Error("useDashboardStatsContext must be used within DashboardStatsProvider");
  return v;
}
