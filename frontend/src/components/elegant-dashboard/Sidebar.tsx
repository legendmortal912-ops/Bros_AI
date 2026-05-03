import {
  LayoutDashboard,
  History,
  Puzzle,
  Settings,
  LogOut,
  Zap,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const ROUTES: Record<string, string> = {
  dashboard: "/dashboard",
  history: "/dashboard/history",
  integrations: "/dashboard/integrations",
  settings: "/dashboard/settings",
};

function tabFromPath(pathname: string): string {
  if (pathname.startsWith("/dashboard/history")) return "history";
  if (pathname.startsWith("/dashboard/integrations")) return "integrations";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "dashboard";
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "history", label: "History", icon: History },
  { id: "integrations", label: "Integrations", icon: Puzzle },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const activeTab = tabFromPath(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  const email = user?.email ?? "you@example.com";

  const go = (id: string) => {
    navigate(ROUTES[id] ?? "/dashboard");
    setMobileOpen(false);
  };

  const Aside = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      style={{
        width: mobile ? 260 : 220,
        minWidth: mobile ? 260 : 220,
        background: "linear-gradient(180deg, #0d0a1a 0%, #0a0817 100%)",
        borderRight: "1px solid rgba(139, 92, 246, 0.12)",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        position: "relative",
        zIndex: 10,
        height: "100%",
      }}
    >
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(139, 92, 246, 0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed 0%, #9d4edd 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.4)",
            }}
          >
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "17px", color: "#fff", letterSpacing: "-0.3px" }}>
            BrosAI
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: isActive
                  ? "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(109, 40, 217, 0.15) 100%)"
                  : "transparent",
                color: isActive ? "#c4b5fd" : "rgba(255,255,255,0.45)",
                position: "relative",
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "60%",
                    borderRadius: "0 2px 2px 0",
                    background: "linear-gradient(180deg, #a78bfa, #7c3aed)",
                  }}
                />
              )}
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              <span style={{ fontSize: "14px", fontWeight: isActive ? 600 : 400 }}>{label}</span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#a78bfa",
                    boxShadow: "0 0 6px #a78bfa",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(139, 92, 246, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            color: "#e9d5ff",
            flexShrink: 0,
          }}
        >
          {email.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </div>
          <div style={{ fontSize: "11px", color: "#a78bfa", marginTop: "1px", fontWeight: 500 }}>Pro Plan</div>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
            padding: "4px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            transition: "color 0.2s",
          }}
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block h-full">
        <Aside />
      </div>

      {/* Mobile trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-[#0d0a1a]/95 border-b border-violet-900/30 backdrop-blur-md">
        <button
          type="button"
          className="text-violet-300 p-1"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>
        <span className="text-white font-bold text-lg tracking-tight">
          Bros<span className="text-violet-400">AI</span>
        </span>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 shadow-2xl"
            >
              <Aside mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}