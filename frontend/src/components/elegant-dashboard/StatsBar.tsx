import { Zap, CheckCircle2, Clock, Wrench } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; className?: string }>;
  color: string;
  glow: string;
}

interface StatsBarProps {
  stats: { tasksRun: number; completed: number; hoursSaved: number; toolsUsed: number };
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items: Stat[] = [
    { label: "Tasks Run", value: stats.tasksRun, icon: Zap, color: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "#34d399", glow: "rgba(52,211,153,0.15)" },
    { label: "Hours Saved", value: stats.hoursSaved, icon: Clock, color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
    { label: "Tools Used", value: stats.toolsUsed, icon: Wrench, color: "#f472b6", glow: "rgba(244,114,182,0.15)" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "14px",
      }}
    >
      {items.map(({ label, value, icon: Icon, color, glow }) => (
        <div
          key={label}
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "all 0.2s ease",
            cursor: "default",
            backdropFilter: "blur(10px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = `1px solid ${color}30`;
            e.currentTarget.style.background = `linear-gradient(145deg, ${glow}, rgba(255,255,255,0.02))`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: `${glow}`,
                border: `1px solid ${color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={14} color={color} strokeWidth={2} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
                letterSpacing: "0.2px",
              }}
            >
              {label}
            </span>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
