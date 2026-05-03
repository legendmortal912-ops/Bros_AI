import { User, Bell, Shield, Palette, ChevronRight } from 'lucide-react';

const settingsSections = [
  {
    icon: User,
    label: 'Account',
    desc: 'Manage your profile and subscription',
    color: '#a78bfa',
  },
  {
    icon: Bell,
    label: 'Notifications',
    desc: 'Control when and how you get notified',
    color: '#60a5fa',
  },
  {
    icon: Shield,
    label: 'Security & Privacy',
    desc: 'Two-factor auth, sessions, and data',
    color: '#34d399',
  },
  {
    icon: Palette,
    label: 'Appearance',
    desc: 'Theme, language, and display settings',
    color: '#f472b6',
  },
];

export default function SettingsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Settings</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Configure your BrosAI experience
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {settingsSections.map(({ icon: Icon, label, desc, color }) => (
          <button
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '18px 20px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              width: '100%',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: `${color}14`,
                border: `1px solid ${color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} color={color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{label}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
          </button>
        ))}
      </div>

      {/* Plan info */}
      <div
        style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(109,40,217,0.08))',
          border: '1px solid rgba(124,58,237,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#c4b5fd', marginBottom: '4px' }}>Pro Plan</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
              Unlimited tasks · All integrations · Priority support
            </div>
          </div>
          <button
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
            }}
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
