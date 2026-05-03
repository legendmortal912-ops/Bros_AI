import {
  LayoutDashboard,
  History,
  Puzzle,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'history', label: 'History', icon: History },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, userEmail }: SidebarProps) {
  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        background: 'linear-gradient(180deg, #0d0a1a 0%, #0a0817 100%)',
        borderRight: '1px solid rgba(139, 92, 246, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(139, 92, 246, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #9d4edd 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            }}
          >
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-0.3px' }}>
            BrosAI
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(109, 40, 217, 0.15) 100%)'
                  : 'transparent',
                color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.45)',
                position: 'relative',
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '60%',
                    borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(180deg, #a78bfa, #7c3aed)',
                  }}
                />
              )}
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
              {isActive && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#a78bfa',
                    boxShadow: '0 0 6px #a78bfa',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(139, 92, 246, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: '#e9d5ff',
            flexShrink: 0,
          }}
        >
          {userEmail.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {userEmail}
          </div>
          <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '1px', fontWeight: 500 }}>Pro Plan</div>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
