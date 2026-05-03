import { CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { TaskRecord } from './RecentTasks';

interface HistoryPanelProps {
  tasks: TaskRecord[];
}

export default function HistoryPanel({ tasks }: HistoryPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Task History</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Search size={13} />
            Search
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Filter size={13} />
            Filter
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            gap: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
          }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>No task history yet</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            Run a task from the dashboard to get started
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.map(task => (
            <div
              key={task.id}
              style={{
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,92,246,0.06)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {task.status === 'done' ? (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(52,211,153,0.1)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={16} color="#34d399" />
                </div>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <XCircle size={16} color="#f87171" />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '4px',
                  }}
                >
                  {task.task}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{task.time}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Duration: {task.duration}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#a78bfa',
                    background: 'rgba(139,92,246,0.12)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    marginBottom: '4px',
                  }}
                >
                  {task.toolsUsed} tools
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: task.status === 'done' ? '#34d399' : '#f87171',
                  }}
                >
                  {task.status === 'done' ? 'Completed' : 'Failed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
