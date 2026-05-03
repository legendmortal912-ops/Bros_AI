import { CheckCircle2, Circle, Mail, Calendar, Search, FileText, MessageSquare, GitBranch } from 'lucide-react';

const integrations = [
  { id: 'gmail', name: 'Gmail', icon: Mail, connected: true, color: '#ea4335' },
  { id: 'calendar', name: 'Google Calendar', icon: Calendar, connected: true, color: '#4285f4' },
  { id: 'search', name: 'Web Search', icon: Search, connected: true, color: '#34d399' },
  { id: 'docs', name: 'Google Docs', icon: FileText, connected: false, color: '#4285f4' },
  { id: 'slack', name: 'Slack', icon: MessageSquare, connected: false, color: '#e01e5a' },
  { id: 'github', name: 'GitHub', icon: GitBranch, connected: false, color: '#fff' },
];

export default function IntegrationsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Integrations</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Connect your tools to unlock autonomous workflows
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {integrations.map(({ id, name, icon: Icon, connected, color }) => (
          <div
            key={id}
            style={{
              background: connected
                ? 'linear-gradient(145deg, rgba(52,211,153,0.06), rgba(255,255,255,0.02))'
                : 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
              border: connected ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${color}18`,
                  border: `1px solid ${color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={color} />
              </div>
              {connected ? (
                <CheckCircle2 size={16} color="#34d399" />
              ) : (
                <Circle size={16} color="rgba(255,255,255,0.2)" />
              )}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{name}</div>
              <div style={{ fontSize: '12px', color: connected ? '#34d399' : 'rgba(255,255,255,0.3)' }}>
                {connected ? 'Connected' : 'Not connected'}
              </div>
            </div>
            <button
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: connected ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(139,92,246,0.3)',
                background: connected ? 'rgba(52,211,153,0.08)' : 'rgba(139,92,246,0.12)',
                color: connected ? '#34d399' : '#c4b5fd',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
