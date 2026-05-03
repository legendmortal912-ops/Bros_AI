import { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Terminal } from 'lucide-react';

export interface LogEntry {
  time: string;
  type: 'planning' | 'tool' | 'success' | 'error' | 'info';
  message: string;
}

interface ExecutionLogProps {
  task: string;
  logs: LogEntry[];
  status: 'running' | 'done' | 'error' | 'idle';
  onReset: () => void;
}

const typeStyles: Record<LogEntry['type'], { color: string; prefix: string }> = {
  planning: { color: '#c084fc', prefix: '🧠' },
  tool:     { color: '#34d399', prefix: '⚙️' },
  success:  { color: '#4ade80', prefix: '✓' },
  error:    { color: '#f87171', prefix: '⊗' },
  info:     { color: '#60a5fa', prefix: '→' },
};

export default function ExecutionLog({ task, logs, status, onReset }: ExecutionLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  if (status === 'idle') return null;

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
      className="fade-in-up"
    >
      {/* Terminal header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={11} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
              bros_ai — agent execution
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {status === 'running' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Loader2 size={12} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '11px', color: '#a78bfa', fontFamily: 'monospace' }}>running</span>
            </div>
          )}
          {status === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle2 size={12} color="#34d399" />
              <span style={{ fontSize: '11px', color: '#34d399', fontFamily: 'monospace' }}>done</span>
            </div>
          )}
          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <AlertCircle size={12} color="#f87171" />
              <span style={{ fontSize: '11px', color: '#f87171', fontFamily: 'monospace' }}>error</span>
            </div>
          )}
        </div>
      </div>

      {/* Log area */}
      <div
        ref={logRef}
        style={{
          padding: '16px 20px',
          maxHeight: '240px',
          overflowY: 'auto',
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: '12.5px',
          lineHeight: '1.7',
        }}
      >
        {/* Task prompt */}
        <div style={{ marginBottom: '12px', color: '#c4b5fd' }}>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>&gt; </span>
          "{task}"
        </div>

        {logs.map((log, i) => {
          const style = typeStyles[log.type];
          return (
            <div
              key={i}
              className="slide-in-left"
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '6px',
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>
                {log.time}
              </span>
              <span style={{ fontSize: '12px' }}>{style.prefix}</span>
              <span style={{ color: style.color }}>{log.message}</span>
            </div>
          );
        })}

        {status === 'running' && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', paddingLeft: '70px' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#a78bfa',
                  animation: `pulse-ring 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {(status === 'done' || status === 'error') && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            onClick={onReset}
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.1)',
              color: '#c4b5fd',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.1)';
            }}
          >
            Run another task
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
