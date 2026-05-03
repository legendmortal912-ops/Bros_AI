import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface TaskInputProps {
  onRunTask: (task: string) => void;
  isRunning: boolean;
}

const suggestions = [
  'Prepare client meeting',
  'Summarise my inbox',
  'Research AI trends',
  'Draft weekly report',
];

export default function TaskInput({ onRunTask, isRunning }: TaskInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim() && !isRunning) {
      onRunTask(value.trim());
      setValue('');
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '20px',
        padding: '24px 26px',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(167,139,250,0.2))',
            border: '1px solid rgba(167,139,250,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={14} color="#c4b5fd" />
        </div>
        <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>
          What should I do for you today?
        </h2>
      </div>

      {/* Quick suggestions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => setValue(s)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(139,92,246,0.25)',
              background: 'rgba(139,92,246,0.08)',
              color: 'rgba(196,181,253,0.8)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.18)';
              (e.currentTarget as HTMLButtonElement).style.color = '#c4b5fd';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.45)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(196,181,253,0.8)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.25)';
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your task in plain English — I'll handle the rest autonomously..."
          rows={3}
          disabled={isRunning}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '12px',
            padding: '14px 52px 14px 16px',
            color: '#fff',
            fontSize: '14px',
            lineHeight: '1.6',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.5)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; }}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isRunning}
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: 'none',
            cursor: value.trim() && !isRunning ? 'pointer' : 'not-allowed',
            background: value.trim() && !isRunning
              ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
              : 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: value.trim() && !isRunning ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
          }}
        >
          <Send size={15} color={value.trim() && !isRunning ? '#fff' : 'rgba(255,255,255,0.25)'} />
        </button>
      </div>
      <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
        ⌘ + Enter to run
      </div>
    </div>
  );
}
