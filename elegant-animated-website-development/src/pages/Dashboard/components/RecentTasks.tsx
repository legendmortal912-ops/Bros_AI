import { Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export interface TaskRecord {
  id: string;
  task: string;
  status: 'done' | 'error';
  time: string;
  toolsUsed: number;
  duration: string;
}

interface RecentTasksProps {
  tasks: TaskRecord[];
  onSelect: (task: TaskRecord) => void;
}

export default function RecentTasks({ tasks, onSelect }: RecentTasksProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Clock size={14} color="#a78bfa" />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Recent Tasks</span>
        {tasks.length > 0 && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '11px',
              color: '#a78bfa',
              background: 'rgba(139,92,246,0.15)',
              padding: '2px 8px',
              borderRadius: '20px',
              fontWeight: 600,
            }}
          >
            {tasks.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {tasks.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '180px',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} color="rgba(167,139,250,0.4)" />
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.5 }}>
              No tasks yet.<br />Run your first task above!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => onSelect(task)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {task.status === 'done' ? (
                    <CheckCircle2 size={14} color="#34d399" style={{ marginTop: '1px', flexShrink: 0 }} />
                  ) : (
                    <XCircle size={14} color="#f87171" style={{ marginTop: '1px', flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      fontSize: '12.5px',
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.4,
                      fontWeight: 500,
                      flex: 1,
                    }}
                  >
                    {task.task.length > 55 ? task.task.slice(0, 55) + '…' : task.task}
                  </span>
                  <ChevronRight size={12} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: '1px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', paddingLeft: '22px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{task.time}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{task.duration}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <span style={{ fontSize: '11px', color: '#a78bfa' }}>{task.toolsUsed} tools</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
