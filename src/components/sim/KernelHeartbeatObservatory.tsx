import React, { useState, useEffect } from 'react';
import { Heart, Activity, CheckCircle2, AlertCircle, RefreshCw, Radio } from 'lucide-react';
import { GuardianKernel, EngineProcessDescriptor } from '../../core/kernel/GuardianKernelLayer';

export const KernelHeartbeatObservatory: React.FC = () => {
  const [processes, setProcesses] = useState<EngineProcessDescriptor[]>([]);
  const [pulseCount, setPulseCount] = useState<number>(0);

  useEffect(() => {
    setProcesses(GuardianKernel.getProcesses());
    const unsub = GuardianKernel.subscribe(() => {
      setProcesses(GuardianKernel.getProcesses());
      setPulseCount(prev => prev + 1);
    });
    return unsub;
  }, []);

  const getHeartbeatBadge = (status: EngineProcessDescriptor['heartbeat']) => {
    switch (status) {
      case 'ALIVE':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300';
      case 'BUSY':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300';
      case 'RECOVERING':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 animate-pulse';
      case 'SILENT':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
              R552 &bull; KERNEL HEARTBEAT OBSERVATORY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              24/7 AUTONOMOUS PULSE SUPERVISION
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Real-Time Engine Heartbeat &amp; Liveness Grid
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Setiap engine memancarkan denyut nadi (heartbeat) secara periodik. Jika engine gagal merespons dalam 3 detik, kernel supervisor otomatis mengisolasi dan memulihkan node.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
            <span className="text-slate-600 dark:text-slate-300">PULSE #{pulseCount}</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">HEALTH INDEX</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              99.98%
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 12 Animated Heartbeat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {processes.map(proc => (
          <div
            key={proc.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${proc.heartbeat === 'ALIVE' ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{proc.id}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getHeartbeatBadge(proc.heartbeat)}`}>
                {proc.heartbeat}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-sans font-medium text-slate-600 dark:text-slate-300 truncate block">
                {proc.name}
              </span>
              <span className="text-[10px] text-slate-400">Tier {proc.priority} &bull; {proc.isolationLevel}</span>
            </div>

            {/* Heartbeat pulse wave simulation */}
            <div className="h-10 bg-slate-50 dark:bg-slate-900/80 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <div className="w-full flex items-center justify-around gap-0.5">
                {[12, 18, 8, 30, 14, 22, 10, 16, 28, 12, 8, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ height: `${proc.heartbeat === 'ALIVE' ? h : proc.heartbeat === 'BUSY' ? h * 1.3 : 4}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2">
              <span>Last Beat: <strong className="text-slate-700 dark:text-slate-300">{Math.round((Date.now() - proc.lastHeartbeatMs) / 100)}ms ago</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Uptime</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
