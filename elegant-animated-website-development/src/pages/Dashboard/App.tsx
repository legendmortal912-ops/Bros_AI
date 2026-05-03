import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StatsBar from './components/StatsBar';
import WorkflowBanner from './components/WorkflowBanner';
import TaskInput from './components/TaskInput';
import ExecutionLog, { LogEntry } from './components/ExecutionLog';
import RecentTasks, { TaskRecord } from './components/RecentTasks';
import IntegrationsPanel from './components/IntegrationsPanel';
import HistoryPanel from './components/HistoryPanel';
import SettingsPanel from './components/SettingsPanel';

// ---------- Workflow simulation ----------
function buildWorkflowSteps(task: string): Array<{ delay: number; entry: LogEntry }> {
  const now = new Date();
  const fmt = (offset: number) => {
    const d = new Date(now.getTime() + offset * 1000);
    return d.toTimeString().slice(0, 8);
  };

  const lower = task.toLowerCase();
  const steps: Array<{ delay: number; entry: LogEntry }> = [
    {
      delay: 300,
      entry: { time: fmt(0), type: 'planning', message: `Planning: Breaking down your request — "${task.slice(0, 60)}${task.length > 60 ? '...' : ''}"` },
    },
    {
      delay: 900,
      entry: { time: fmt(1), type: 'info', message: 'Identifying required tools and services...' },
    },
  ];

  if (lower.includes('email') || lower.includes('gmail') || lower.includes('inbox') || lower.includes('meeting') || lower.includes('client')) {
    steps.push({ delay: 1500, entry: { time: fmt(2), type: 'tool', message: 'Reading Gmail inbox...' } });
    steps.push({ delay: 2200, entry: { time: fmt(3), type: 'tool', message: 'Summarising email thread...' } });
    steps.push({ delay: 3000, entry: { time: fmt(4), type: 'tool', message: 'Drafting follow-up email...' } });
  }

  if (lower.includes('calendar') || lower.includes('book') || lower.includes('slot') || lower.includes('meeting') || lower.includes('schedule')) {
    steps.push({ delay: 3700, entry: { time: fmt(5), type: 'tool', message: 'Checking calendar availability...' } });
    steps.push({ delay: 4400, entry: { time: fmt(6), type: 'tool', message: 'Booking 30-min slot at requested time...' } });
  }

  if (lower.includes('research') || lower.includes('trend') || lower.includes('search') || lower.includes('find')) {
    steps.push({ delay: 1800, entry: { time: fmt(2), type: 'tool', message: 'Querying web search API...' } });
    steps.push({ delay: 2600, entry: { time: fmt(3), type: 'tool', message: 'Aggregating top results...' } });
    steps.push({ delay: 3400, entry: { time: fmt(4), type: 'tool', message: 'Summarising findings...' } });
  }

  if (lower.includes('report') || lower.includes('draft') || lower.includes('write') || lower.includes('document')) {
    steps.push({ delay: 2000, entry: { time: fmt(3), type: 'tool', message: 'Gathering relevant data...' } });
    steps.push({ delay: 2800, entry: { time: fmt(4), type: 'tool', message: 'Drafting document structure...' } });
    steps.push({ delay: 3600, entry: { time: fmt(5), type: 'tool', message: 'Writing content sections...' } });
    steps.push({ delay: 4200, entry: { time: fmt(6), type: 'tool', message: 'Saving to Google Docs...' } });
  }

  const finalDelay = Math.max(...steps.map(s => s.delay)) + 700;
  steps.push({
    delay: finalDelay,
    entry: { time: fmt(Math.ceil(finalDelay / 1000)), type: 'success', message: 'Task completed successfully. Results ready for review.' },
  });

  return steps;
}

function nowStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function randomDuration() {
  const secs = Math.floor(Math.random() * 20) + 5;
  return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function countTools(logs: LogEntry[]) {
  return logs.filter(l => l.type === 'tool').length;
}

// ---------- Main App ----------
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [currentTask, setCurrentTask] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [stats, setStats] = useState({ tasksRun: 0, completed: 0, hoursSaved: 0, toolsUsed: 0 });

  const handleRunTask = useCallback((task: string) => {
    setCurrentTask(task);
    setLogs([]);
    setRunStatus('running');

    const steps = buildWorkflowSteps(task);
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ delay, entry }) => {
      const t = setTimeout(() => {
        setLogs(prev => [...prev, entry]);
      }, delay);
      timers.push(t);
    });

    const totalDelay = Math.max(...steps.map(s => s.delay)) + 1000;
    const finalTimer = setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success rate
      setRunStatus(isSuccess ? 'done' : 'error');

      const finalLogs = steps.map(s => s.entry);
      const tools = countTools(finalLogs);
      const duration = randomDuration();

      const newTask: TaskRecord = {
        id: Date.now().toString(),
        task,
        status: isSuccess ? 'done' : 'error',
        time: nowStr(),
        toolsUsed: tools,
        duration,
      };

      setTasks(prev => [newTask, ...prev]);
      setStats(prev => ({
        tasksRun: prev.tasksRun + 1,
        completed: isSuccess ? prev.completed + 1 : prev.completed,
        hoursSaved: prev.hoursSaved + Math.max(1, tools),
        toolsUsed: prev.toolsUsed + tools,
      }));
    }, totalDelay);
    timers.push(finalTimer);
  }, []);

  const handleReset = () => {
    setRunStatus('idle');
    setLogs([]);
    setCurrentTask('');
  };

  const renderMain = () => {
    switch (activeTab) {
      case 'integrations':
        return <IntegrationsPanel />;
      case 'history':
        return <HistoryPanel tasks={tasks} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#080612',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userEmail="legendmortal912@g..."
        />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top header */}
        <div
          style={{
            padding: '20px 28px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            paddingBottom: '16px',
          }}
        >
          {/* Stats bar */}
          <StatsBar stats={stats} />
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {/* Page title (non-dashboard) */}
          {activeTab !== 'dashboard' && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: '0.5px' }}>
                  BROSAI
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
                <span style={{ fontSize: '12px', color: 'rgba(167,139,250,0.7)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {activeTab}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: 0 }}>
              {/* Left column */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                <WorkflowBanner />
                <TaskInput onRunTask={handleRunTask} isRunning={runStatus === 'running'} />
                {runStatus !== 'idle' && (
                  <ExecutionLog
                    task={currentTask}
                    logs={logs}
                    status={runStatus}
                    onReset={handleReset}
                  />
                )}
              </div>

              {/* Right panel */}
              <div style={{ width: '290px', flexShrink: 0 }}>
                <RecentTasks
                  tasks={tasks}
                  onSelect={task => {
                    setCurrentTask(task.task);
                    setRunStatus('idle');
                    setLogs([]);
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              {renderMain()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
