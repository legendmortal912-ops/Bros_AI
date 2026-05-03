import { useEffect, useState } from "react";
import { Mail, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import IntegrationsPanel, {
  type IntegrationUiItem,
} from "../components/elegant-dashboard/IntegrationsPanel";

interface IntegrationRow {
  id: string;
  provider: string;
  connected: boolean;
}

const META: IntegrationUiItem[] = [
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail,
    color: "#ea4335",
    connected: false,
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    icon: Calendar,
    color: "#4285f4",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    color: "#e01e5a",
    connected: false,
    comingSoon: true,
  },
];

export default function IntegrationsPage() {
  const { session } = useAuth();
  const [rows, setRows] = useState<IntegrationRow[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadIntegrations() {
    if (!session) return;
    const { data } = await supabase.from("user_integrations").select("*").eq("user_id", session.user.id);
    if (data) setRows(data as IntegrationRow[]);
  }

  useEffect(() => {
    loadIntegrations();
  }, [session]);

  function isConnected(provider: string) {
    return rows.some((i) => i.provider === provider && i.connected);
  }

  const items: IntegrationUiItem[] = META.map((m) => ({
    ...m,
    connected: isConnected(m.id),
  }));

  async function connect(provider: string) {
    if (!session) return;
    setConnecting(provider);
    setError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/integrations/${provider}/auth`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error("No auth URL returned");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Connection failed");
      setConnecting(null);
    }
  }

  async function disconnect(provider: string) {
    if (!session) return;
    setConnecting(provider);
    await supabase
      .from("user_integrations")
      .update({ connected: false })
      .eq("user_id", session.user.id)
      .eq("provider", provider);
    await loadIntegrations();
    setConnecting(null);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(248,113,113,0.35)",
            background: "rgba(248,113,113,0.08)",
            color: "#fecaca",
            fontSize: 13,
          }}
        >
          {error}
        </motion.div>
      )}
      <IntegrationsPanel
        items={items}
        connectingId={connecting}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </div>
  );
}
