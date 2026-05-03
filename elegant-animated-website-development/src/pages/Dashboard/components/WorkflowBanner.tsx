import { ArrowRight } from 'lucide-react';

const steps = [
  {
    num: '1',
    title: 'User Input',
    sub: 'Plain-language task',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(109,40,217,0.1) 100%)',
    border: 'rgba(124,58,237,0.35)',
    dot: '#a78bfa',
  },
  {
    num: '2',
    title: 'AI Planner',
    sub: 'LLM breaks into subtasks',
    color: '#0891b2',
    bg: 'linear-gradient(135deg, rgba(8,145,178,0.2) 0%, rgba(6,182,212,0.08) 100%)',
    border: 'rgba(8,145,178,0.35)',
    dot: '#22d3ee',
  },
  {
    num: '3',
    title: 'Tool Executor',
    sub: 'Calls APIs autonomously',
    color: '#059669',
    bg: 'linear-gradient(135deg, rgba(5,150,105,0.2) 0%, rgba(16,185,129,0.08) 100%)',
    border: 'rgba(5,150,105,0.35)',
    dot: '#34d399',
  },
  {
    num: '4',
    title: 'Output Delivery',
    sub: 'Finished result delivered',
    color: '#b45309',
    bg: 'linear-gradient(135deg, rgba(180,83,9,0.2) 0%, rgba(217,119,6,0.08) 100%)',
    border: 'rgba(180,83,9,0.35)',
    dot: '#fbbf24',
  },
];

export default function WorkflowBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '16px 20px',
      }}
    >
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
          }}
        >
          Autonomous Workflow
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {steps.map((step, i) => (
          <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                background: step.bg,
                border: `1px solid ${step.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: step.dot,
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <div
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: step.dot,
                    boxShadow: `0 0 6px ${step.dot}`,
                  }}
                />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{step.title}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{step.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ padding: '0 4px' }}>
                <ArrowRight size={12} color="rgba(255,255,255,0.2)" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
