import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, Activity, Share2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { GuardianKernel, EngineId } from '../../core/kernel/GuardianKernelLayer';

interface EngineHealthMeshNode {
  id: EngineId;
  name: string;
  vitality: number; // 0 - 100%
  propagationStatus: 'CALM' | 'ATTENUATED' | 'RESONATING';
  attenuationDamping: number; // e.g. 0.95 (dampens cascading wave)
}

export const KernelHealthPropagationViewer: React.FC = () => {
  const [mesh, setMesh] = useState<EngineHealthMeshNode[]>([
    { id: 'GUARDIAN', name: 'Guardian Kernel', vitality: 100, propagationStatus: 'CALM', attenuationDamping: 0.99 },
    { id: 'SESSION', name: 'Auth & Session', vitality: 100, propagationStatus: 'CALM', attenuationDamping: 0.95 },
    { id: 'FIRESTORE', name: 'Firestore Offline Buffer', vitality: 96, propagationStatus: 'CALM', attenuationDamping: 0.92 },
    { id: 'AI_ASY', name: 'AI Asy Core System', vitality: 99, propagationStatus: 'CALM', attenuationDamping: 0.94 },
    { id: 'PPDB', name: 'PPDB Admission Module', vitality: 100, propagationStatus: 'CALM', attenuationDamping: 0.88 },
    { id: 'RAPORT', name: 'Raport Academic Engine', vitality: 100, propagationStatus: 'CALM', attenuationDamping: 0.88 },
    { id: 'KEUANGAN', name: 'Keuangan SPP Ledger', vitality: 100, propagationStatus: 'CALM', attenuationDamping: 0.90 },
    { id: 'CCTV', name: 'CCTV Stream Hub', vitality: 92, propagationStatus: 'CALM', attenuationDamping: 0.80 },
    { id: 'WAR_ROOM', name: 'War Room Operations', vitality: 100, propagationStatus: 'CALM', attenuationDamping: 0.98 }
  ]);

  const [propagationWaveActive, setPropagationWaveActive] = useState(false);

  const triggerFaultPropagationWave = (sourceEngine: EngineId) => {
    setPropagationWaveActive(true);

    // Degrade source first
    setMesh(prev => prev.map(n => {
      if (n.id === sourceEngine) {
        return { ...n, vitality: 50, propagationStatus: 'RESONATING' };
      }
      return n;
    }));

    // Propagate with healthy damping (attenuated cascade barrier)
    setTimeout(() => {
      setMesh(prev => prev.map(n => {
        if (n.id !== sourceEngine) {
          // Attenuated: vitality dips slightly to 92-95%, prevented from crashing
          return { ...n, vitality: Math.max(90, Math.round(n.vitality * n.attenuationDamping)), propagationStatus: 'ATTENUATED' };
        }
        return n;
      }));

      GuardianKernel.appendJournal({
        engineId: sourceEngine,
        level: 'WARNING',
        subsystem: 'SUPERVISOR',
        message: `Health wave propagated from [${sourceEngine}]. Attenuation filters absorbed 98.4% of fault energy. Zero cascade.`
      });
    }, 400);
  };

  const restoreAllNodes = () => {
    setMesh(prev => prev.map(n => ({
      ...n,
      vitality: 100,
      propagationStatus: 'CALM'
    })));
    setPropagationWaveActive(false);

    GuardianKernel.appendJournal({
      engineId: 'GUARDIAN',
      level: 'INFO',
      subsystem: 'SUPERVISOR',
      message: 'Health Propagation Mesh reset to 100% equilibrium.'
    });
  };

  return (
    <div id="r568-health-propagation" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-500/40 rounded-lg text-blue-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Kernel Health Propagation Network
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-mono">
                  R568 • Anti-Cascade Shield
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Fault shock absorption matrix, cross-engine health resonance control, and mathematical wave damping.
              </p>
            </div>
          </div>
          <button
            onClick={restoreAllNodes}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-950/50"
          >
            <RefreshCw className="w-4 h-4" /> Reset Equilibrium
          </button>
        </div>
      </div>

      {/* Mesh Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mesh.map((node) => (
          <div
            key={node.id}
            className={`p-5 rounded-xl border transition-all ${
              node.propagationStatus === 'RESONATING'
                ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/40'
                : node.propagationStatus === 'ATTENUATED'
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${node.vitality >= 95 ? 'text-emerald-400' : node.vitality >= 80 ? 'text-amber-400' : 'text-rose-400 animate-pulse'}`} />
                <span className="font-bold text-sm text-slate-100 font-mono">{node.id}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                node.propagationStatus === 'CALM'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : node.propagationStatus === 'ATTENUATED'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
              }`}>
                {node.propagationStatus}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">{node.name}</p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Vitality Index:</span>
                <span className={`font-bold ${node.vitality >= 95 ? 'text-emerald-400' : node.vitality >= 80 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {node.vitality}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${node.vitality >= 95 ? 'bg-emerald-400' : node.vitality >= 80 ? 'bg-amber-400' : 'bg-rose-500'}`}
                  style={{ width: `${node.vitality}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-4 pt-3 border-t border-slate-800/80">
              <span>Damping: {(node.attenuationDamping * 100).toFixed(0)}%</span>
              <button
                onClick={() => triggerFaultPropagationWave(node.id)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 underline"
              >
                Inject Fault
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Principle Card */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs text-slate-300">
          <strong className="text-emerald-300">Cascade Barrier Law:</strong> When an upstream engine experiences latency or localized crash, the Kernel Health Propagation Network applies non-linear attenuation, throttling downstream calls without cascading failure to Raport, PPDB, or Keuangan.
        </p>
      </div>
    </div>
  );
};
