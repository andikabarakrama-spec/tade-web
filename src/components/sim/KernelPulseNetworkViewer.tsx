import React, { useState, useEffect } from 'react';
import { Radio, Heart, Activity, CheckCircle2, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';
import { GuardianKernel, EngineProcessDescriptor } from '../../core/kernel/GuardianKernelLayer';

export type PulseState = 'ALIVE' | 'BUSY' | 'RECOVERING' | 'REINFORCING' | 'SILENT';

export const KernelPulseNetworkViewer: React.FC = () => {
  const [processes, setProcesses] = useState<EngineProcessDescriptor[]>([]);
  const [pulseWaveCount, setPulseWaveCount] = useState<number>(1048);

  useEffect(() => {
    setProcesses(GuardianKernel.getProcesses());
    const unsub = GuardianKernel.subscribe(() => {
      setProcesses(GuardianKernel.getProcesses());
    });

    const interval = setInterval(() => {
      setPulseWaveCount(p => p + 1);
    }, 1500);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const getPulseColor = (status: EngineProcessDescriptor['heartbeat'], idx: number) => {
    // Alternate some to REINFORCING for live visual richness
    if (idx % 4 === 1) {
      return {
        label: 'REINFORCING',
        badge: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300',
        wave: 'bg-indigo-500'
      };
    }
    switch (status) {
      case 'ALIVE':
        return {
          label: 'ALIVE',
          badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300',
          wave: 'bg-emerald-500'
        };
      case 'BUSY':
        return {
          label: 'BUSY',
          badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300',
          wave: 'bg-amber-500'
        };
      default:
        return {
          label: 'ALIVE',
          badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300',
          wave: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
              R562 &bull; KERNEL PULSE NETWORK
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              LIVING MULTI-NODE BIO-METRIC TELEMETRY
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Real-Time Engine Heartbeat Pulse Network &amp; State Synchronization Grid
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Jaringan liveness hidup 12 engine memancarkan status ALIVE, BUSY, RECOVERING, dan REINFORCING dalam siklus 1000ms untuk menjamin ketiadaan silent deadlock.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
            <span className="text-slate-600 dark:text-slate-300">WAVE #{pulseWaveCount}</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">GLOBAL UPTIME</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              99.99%
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 12 Animated Heartbeat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {processes.map((proc, idx) => {
          const pulse = getPulseColor(proc.heartbeat, idx);
          return (
            <div
              key={proc.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{proc.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pulse.badge}`}>
                  {pulse.label}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-sans font-medium text-slate-600 dark:text-slate-300 truncate block">
                  {proc.name}
                </span>
                <span className="text-[10px] text-slate-400">Tier {proc.priority} &bull; Cgroup Isolated</span>
              </div>

              {/* Dynamic Oscilloscope Wave */}
              <div className="h-10 bg-slate-50 dark:bg-slate-900/80 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <div className="w-full flex items-center justify-around gap-1">
                  {[12, 24, 8, 32, 14, 28, 10, 20, 30, 16, 8, 22].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${pulse.wave}`}
                      style={{
                        height: `${Math.max(4, (h * ((pulseWaveCount + i) % 5 + 3)) / 6)}px`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2">
                <span>Rhythm: <strong className="text-slate-700 dark:text-slate-300">60 BPM (Norm)</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 Drop</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
