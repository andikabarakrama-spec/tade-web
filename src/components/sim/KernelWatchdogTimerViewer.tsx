import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Cpu, 
  RotateCcw, 
  Activity, 
  Zap,
  Play,
  Square
} from 'lucide-react';
import { kernelEventBus } from '../../core/kernel/KernelEventBus';
import { EngineId } from '../../core/kernel/GuardianKernelLayer';

interface WatchdogTarget {
  id: EngineId;
  name: string;
  heartbeatIntervalMs: number;
  lastPetMs: number;
  timeRemainingMs: number;
  status: 'ALIVE' | 'WARNING' | 'EXPIRED' | 'RESTARTING';
  restartCount: number;
}

export const KernelWatchdogTimerViewer: React.FC = () => {
  const [watchdogRunning, setWatchdogRunning] = useState<boolean>(true);
  const [watchdogTimeoutMs] = useState<number>(4000); // 4 seconds timeout window

  const [targets, setTargets] = useState<WatchdogTarget[]>([
    { id: 'GUARDIAN', name: 'Guardian Security Core', heartbeatIntervalMs: 1000, lastPetMs: Date.now(), timeRemainingMs: 4000, status: 'ALIVE', restartCount: 0 },
    { id: 'AI_ASY', name: 'AI Asy Subsystem', heartbeatIntervalMs: 1200, lastPetMs: Date.now(), timeRemainingMs: 4000, status: 'ALIVE', restartCount: 0 },
    { id: 'SESSION', name: 'Session Daemon', heartbeatIntervalMs: 1500, lastPetMs: Date.now(), timeRemainingMs: 4000, status: 'ALIVE', restartCount: 0 },
    { id: 'FIRESTORE', name: 'Database Connector', heartbeatIntervalMs: 1400, lastPetMs: Date.now(), timeRemainingMs: 4000, status: 'ALIVE', restartCount: 0 },
    { id: 'PPDB', name: 'PPDB Intake Daemon', heartbeatIntervalMs: 1800, lastPetMs: Date.now(), timeRemainingMs: 4000, status: 'ALIVE', restartCount: 0 },
    { id: 'CCTV', name: 'CCTV Stream Daemon', heartbeatIntervalMs: 2000, lastPetMs: Date.now(), timeRemainingMs: 4000, status: 'ALIVE', restartCount: 0 }
  ]);

  const [logs, setLogs] = useState<string[]>([
    'Kernel Hardware-Emulated Watchdog Timer active (Tick rate: 200ms).',
    'All 6 monitored critical daemons registered to pet watchdog.'
  ]);

  // Main Watchdog loop
  useEffect(() => {
    if (!watchdogRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setTargets(prev => prev.map(t => {
        // If restarting, keep as is until restart timer resolves
        if (t.status === 'RESTARTING') return t;

        const elapsed = now - t.lastPetMs;
        const remaining = Math.max(0, watchdogTimeoutMs - elapsed);

        // Auto-pet for healthy engines unless simulated hung
        if (remaining > 1500 && Math.random() > 0.4) {
          return {
            ...t,
            lastPetMs: now,
            timeRemainingMs: watchdogTimeoutMs,
            status: 'ALIVE'
          };
        }

        if (remaining === 0 && t.status !== 'EXPIRED') {
          // Watchdog Expired!
          handleWatchdogTriggered(t.id);
          return {
            ...t,
            timeRemainingMs: 0,
            status: 'EXPIRED'
          };
        }

        return {
          ...t,
          timeRemainingMs: remaining,
          status: remaining < 1200 ? 'WARNING' : 'ALIVE'
        };
      }));
    }, 300);

    return () => clearInterval(interval);
  }, [watchdogRunning, watchdogTimeoutMs]);

  const handlePetDaemon = (id: EngineId) => {
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          lastPetMs: Date.now(),
          timeRemainingMs: watchdogTimeoutMs,
          status: 'ALIVE'
        };
      }
      return t;
    }));
  };

  const handleSimulateEngineHang = (id: EngineId) => {
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          lastPetMs: Date.now() - (watchdogTimeoutMs - 500), // Push close to expiry
          timeRemainingMs: 500,
          status: 'WARNING'
        };
      }
      return t;
    }));

    const logEntry = `[${new Date().toLocaleTimeString()}] Simulated thread-lock hang on ${id}. Watchdog pet timer starving!`;
    setLogs(prev => [logEntry, ...prev.slice(0, 15)]);
  };

  const handleWatchdogTriggered = (id: EngineId) => {
    const logEntry = `[${new Date().toLocaleTimeString()}] WATCHDOG TIMEOUT on ${id}! Initiating kernel isolation & staged progressive restart.`;
    setLogs(prev => [logEntry, ...prev.slice(0, 15)]);

    kernelEventBus.publish({
      type: 'watchdog.triggered',
      sourceEngine: id,
      severity: 'CRITICAL',
      data: { message: `Watchdog expired on ${id}. Staged restart in progress.` },
      traceId: `TRC-WDOG-${Date.now().toString().slice(-4)}`
    });

    // Staged Restart Simulation
    setTimeout(() => {
      setTargets(prev => prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'RESTARTING',
            lastPetMs: Date.now()
          };
        }
        return t;
      }));

      setTimeout(() => {
        setTargets(prev => prev.map(t => {
          if (t.id === id) {
            return {
              ...t,
              status: 'ALIVE',
              restartCount: t.restartCount + 1,
              lastPetMs: Date.now(),
              timeRemainingMs: watchdogTimeoutMs
            };
          }
          return t;
        }));

        const finishLog = `[${new Date().toLocaleTimeString()}] ${id} successfully recovered by Kernel Watchdog. Clean state resumed.`;
        setLogs(prev => [finishLog, ...prev.slice(0, 15)]);

        kernelEventBus.publish({
          type: 'recovery.completed',
          sourceEngine: id,
          severity: 'NOTICE',
          data: { message: `Watchdog recovery completed for ${id}.` },
          traceId: `TRC-WDOG-DONE-${Date.now().toString().slice(-4)}`
        });
      }, 1000);
    }, 600);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600/20 rounded-2xl border border-amber-500/30 text-amber-400">
            <Timer className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                R580 &bull; KERNEL WATCHDOG TIMER
              </span>
              <span className="text-xs text-slate-400 font-mono">Hardware-Grade Kernel Hang Detection</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Kernel Watchdog Timer &amp; Progressive Auto-Restart</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWatchdogRunning(!watchdogRunning)}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 border ${
              watchdogRunning
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-600/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {watchdogRunning ? <Play className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            {watchdogRunning ? 'WATCHDOG ARMED' : 'WATCHDOG DISARMED'}
          </button>
        </div>
      </div>

      {/* Target Daemons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map((t) => {
          const percentRemaining = (t.timeRemainingMs / watchdogTimeoutMs) * 100;
          return (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition space-y-3 font-mono text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.id}</span>
                  <strong className="text-sm font-bold text-white block">{t.name}</strong>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    t.status === 'ALIVE'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : t.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                      : t.status === 'RESTARTING'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 animate-spin'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              {/* Progress Bar for Watchdog Timeout */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Watchdog Timeout:</span>
                  <span className="text-slate-200 font-bold">{t.timeRemainingMs} ms</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentRemaining < 30 ? 'bg-rose-500' : percentRemaining < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                <span>Restarts: {t.restartCount}</span>
                <span className="text-cyan-400">HB Window: {t.heartbeatIntervalMs}ms</span>
              </div>

              {/* Interactive Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handlePetDaemon(t.id)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold transition flex items-center justify-center gap-1"
                >
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Pet Daemon
                </button>
                <button
                  onClick={() => handleSimulateEngineHang(t.id)}
                  className="flex-1 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/40 text-rose-300 text-[10px] font-bold transition flex items-center justify-center gap-1"
                >
                  <Flame className="w-3 h-3 text-rose-400" />
                  Simulate Hang
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Watchdog Log Terminal */}
      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-amber-400" />
            Watchdog Supervisor Kernel Log
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Zero Deadlock Budget
          </span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1 text-slate-300 pr-1 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="p-1.5 rounded-lg bg-slate-900/60 text-[11px] flex items-center gap-2">
              <span className="text-amber-500 font-bold">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
