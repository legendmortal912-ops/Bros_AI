import Sidebar from "../elegant-dashboard/Sidebar";
import StatsBar from "../elegant-dashboard/StatsBar";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { DashboardStatsProvider } from "../../context/DashboardStatsContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { stats, refresh } = useDashboardStats();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        height: "100dvh",
        background: "#080612",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "20%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", height: "100%", minHeight: 0 }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
            minWidth: 0,
            paddingTop: "52px",
          }}
          className="md:!pt-0"
        >
          <div
            style={{
              padding: "20px 28px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              paddingBottom: "16px",
            }}
          >
            <StatsBar stats={stats} />
          </div>

          <main style={{ flex: 1, overflowY: "auto", padding: "20px 28px 24px", minHeight: 0 }}>
            <DashboardStatsProvider stats={stats} refresh={refresh}>
              {children}
            </DashboardStatsProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
