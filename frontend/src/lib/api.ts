const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiPost(path: string, body: unknown, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGet(path: string, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function createSSEConnection(
  path: string,
  token: string,
  onMessage: (data: unknown) => void,
  onDone: () => void,
  onError: (e: Event) => void
) {
  const url = `${API_BASE}${path}?token=${encodeURIComponent(token)}`;
  const es = new EventSource(url);
  es.onmessage = (e) => {
    try {
      onMessage(JSON.parse(e.data));
    } catch {
      onMessage(e.data);
    }
  };
  es.addEventListener("done", () => {
    es.close();
    onDone();
  });
  es.onerror = (e) => {
    es.close();
    onError(e);
  };
  return es;
}
