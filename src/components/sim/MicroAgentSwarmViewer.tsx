import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, CheckCircle2, RefreshCw, Activity, ArrowRight, Layers, Sparkles 
} from 'lucide-react';
import { microAgentSwarm, MicroAgentInstance } from '../../core/government/MicroAgentSwarm';

export const MicroAgentSwarmViewer: React.FC = () => {
  const [agents, setAgents] = useState<MicroAgentInstance[]>(() => microAgentSwarm.getAgents());
  const [pulseCount, setPulseCount] = useState(0);

  const handlePulse = () => {
    microAgentSwarm.pulseAllAgents();
    setAgents([...microAgentSwarm.getAgents()]);
    setPulseCount(c => c + 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handlePulse();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="micro-agent-swarm" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-purple-950 p-6 rounded-3xl text-white border border-violet-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cpu className="w-48 h-48 text-violet-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" /> R610 &bull; Micro Agent Swarm &bull; Single-Responsibility Doctrine
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Kawanan Agen Mikro Otonom (Micro Agent Swarm)
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Setiap agen mikro hanya memiliki SATU tanggung jawab spesifik (Single Responsibility), beroperasi tanpa henti menjaga presisi data dan keselamatan sistem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePulse}
              className="px-4 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pulseCount > 0 ? 'animate-spin' : ''}`} />
              Pulse Detak Mikro ({pulseCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Micro Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((ag) => (
          <div key={ag.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:border-violet-500/50 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 mr-2">
                  {ag.id}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  ag.branch === 'CIVILIAN_CABINET'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                }`}>
                  {ag.branch === 'CIVILIAN_CABINET' ? 'KABINET SIPIL' : 'MILITER GUARDIAN'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {ag.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {ag.healthState}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {ag.duty}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-slate-500">
                <span>Induk Asisten:</span>
                <strong className="text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{ag.parentAssistant}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Interval Eksekusi:</span>
                <strong className="text-violet-600 dark:text-violet-400">{ag.executionIntervalMs}ms</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Total Eksekusi Sukses:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{ag.executionsCount}x (100%)</strong>
              </div>
            </div>

            <div className="text-[9px] font-mono text-slate-400 truncate">
              Last Pulse: {ag.lastExecutionTimestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
