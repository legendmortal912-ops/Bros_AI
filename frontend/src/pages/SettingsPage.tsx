import { useState } from "react";
import { Key, Bell, User, Shield, Check, Copy, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, taskDone: true, errors: false });
  const apiKey = "bai_sk_" + (user?.id?.replace(/-/g, "").slice(0, 24) ?? "••••••••••••••••••••••••");

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const card: React.CSSProperties = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "22px 24px",
    backdropFilter: "blur(10px)",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Settings</h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Manage your account and preferences</p>
      </div>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={18} color="#c4b5fd" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Profile</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 500 }}>{user?.email}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 4 }}>
              Free plan · {user?.id?.slice(0, 8)}…
            </p>
          </div>
        </div>
        <button
          type="button"
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "1px solid rgba(139,92,246,0.35)",
            background: "rgba(139,92,246,0.08)",
            color: "#c4b5fd",
            fontSize: 13,
            cursor: "default",
            opacity: 0.65,
          }}
        >
          Edit Profile
        </button>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(96,165,250,0.12)",
              border: "1px solid rgba(96,165,250,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Key size={18} color="#93c5fd" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>API Key</h3>
        </div>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 14 }}>
          Use this key to call Bros AI from your own apps.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          <code style={{ flex: 1, fontSize: 13, fontFamily: "monospace", color: "#ddd6fe", overflow: "hidden", textOverflow: "ellipsis" }}>
            {showKey ? apiKey : apiKey.slice(0, 10) + "••••••••••••••••••••"}
          </code>
          <button type="button" onClick={() => setShowKey(!showKey)} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer" }}>
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button type="button" onClick={copyKey} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer" }}>
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
          </button>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} color="#6ee7b7" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Notifications</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { key: "email" as const, label: "Email updates", desc: "Receive product updates and news" },
            { key: "taskDone" as const, label: "Task completed", desc: "Get notified when a task finishes" },
            { key: "errors" as const, label: "Error alerts", desc: "Get notified when a task fails" },
          ].map((n) => (
            <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ color: "#f5f3ff", fontSize: 14, fontWeight: 500 }}>{n.label}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>{n.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key] }))}
                style={{
                  position: "relative",
                  width: 44,
                  height: 24,
                  borderRadius: 999,
                  border: notifs[n.key] ? "none" : "1px solid rgba(139,92,246,0.35)",
                  background: notifs[n.key] ? "#7c3aed" : "rgba(0,0,0,0.35)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <motion.div
                  animate={{ x: notifs[n.key] ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    position: "absolute",
                    top: 4,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(248,113,113,0.12)",
              border: "1px solid rgba(248,113,113,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={18} color="#fca5a5" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Security</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#ddd6fe",
              fontSize: 13,
              cursor: "default",
              opacity: 0.75,
            }}
          >
            Change Password
          </button>
          <button
            type="button"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(248,113,113,0.2)",
              background: "rgba(248,113,113,0.06)",
              color: "#fecaca",
              fontSize: 13,
              cursor: "default",
              opacity: 0.75,
            }}
          >
            Delete Account
          </button>
        </div>
      </motion.section>

      <div
        style={{
          padding: "18px 20px",
          borderRadius: 16,
          background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(109,40,217,0.08))",
          border: "1px solid rgba(124,58,237,0.28)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e9d5ff", marginBottom: 6 }}>Pro Plan</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          Unlimited tasks · Integrations · Priority support (preview)
        </div>
      </div>
    </div>
  );
}
