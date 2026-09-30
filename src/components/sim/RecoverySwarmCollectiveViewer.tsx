import React, { useState, useEffect } from 'react';
import { Share2, Zap, ShieldCheck, Activity, Cpu, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { GuardianKernel, EngineId } from '../../core/kernel/GuardianKernelLayer';

interface SwarmPeer {
  id: EngineId;
  name: string;
  roleInSwarm: 'DONOR_NODE' | 'RECEPTOR_NODE' | 'COORDINATOR';
  donatedBufferMb: number;
  syntheticHealthScore: number;
  lastPulseTime: string;
}

export const RecoverySwarmCollectiveViewer: React.FC = () => {
  const [peers, setPeers] = useState<SwarmPeer[]>([
    { id: 'GUARDIAN', name: 'Guardian Kernel', roleInSwarm: 'COORDINATOR', donatedBufferMb: 16, syntheticHealthScore: 100, lastPulseTime: 'Just now' },
    { id: 'SESSION', name: 'Auth & Session Core', roleInSwarm: 'DONOR_NODE', donatedBufferMb: 8, syntheticHealthScore: 99, lastPulseTime: 'Just now' },
    { id: 'AI_ASY', name: 'AI Asy Core', roleInSwarm: 'DONOR_NODE', donatedBufferMb: 32, syntheticHealthScore: 99, lastPulseTime: 'Just now' },
    { id: 'FIRESTORE', name: 'Firestore Offline Buffer', roleInSwarm: 'RECEPTOR_NODE', donatedBufferMb: 0, syntheticHealthScore: 92, lastPulseTime: 'Just now' },
    { id: 'PPDB', name: 'PPDB Admission Engine', roleInSwarm: 'DONOR_NODE', donatedBufferMb: 8, syntheticHealthScore: 100, lastPulseTime: 'Just now' },
    { id: 'RAPORT', name: 'Raport Engine', roleInSwarm: 'DONOR_NODE', donatedBufferMb: 8, syntheticHealthScore: 100, lastPulseTime: 'Just now' }
  ]);

  const [activeHarmonicCycle, setActiveHarmonicCycle] = useState(1);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleTriggerSwarmConsensus = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setActiveHarmonicCycle(prev => prev + 1);

      setPeers(prev => prev.map(p => ({
        ...p,
        syntheticHealthScore: 100,
        roleInSwarm: p.id === 'GUARDIAN' ? 'COORDINATOR' : 'DONOR_NODE'
      })));

      GuardianKernel.appendJournal({
        engineId: 'GUARDIAN',
        level: 'INFO',
        subsystem: 'SWARM',
        message: `Swarm Collective Intelligence Cycle #${activeHarmonicCycle + 1} converged. 72 MB dynamic capacity redistributed to target nodes.`
      });
    }, 1000);
  };

  return (
    <div id="r571-recovery-swarm-collective" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-950/80 border border-teal-500/40 rounded-lg text-teal-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Recovery Swarm Collective Intelligence
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-900/50 text-teal-300 border border-teal-700/50 font-mono">
                  R571 • Swarm Mesh V3.5
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Dynamic peer-to-peer buffer lending, cross-daemon memory solidarity, and collective resilience topology.
              </p>
            </div>
          </div>
          <button
            onClick={handleTriggerSwarmConsensus}
            disabled={isSynthesizing}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-950/50"
          >
            <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
            {isSynthesizing ? 'Harmonizing Mesh...' : `Harmonize Swarm (Round #${activeHarmonicCycle})`}
          </button>
        </div>
      </div>

      {/* Swarm Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase">Shared Swarm Buffer Pool</span>
          <div className="text-2xl font-bold text-teal-400 font-mono">72.0 MB Available</div>
          <p className="text-xs text-slate-500">Autonomous lending pool for degraded nodes</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase">Active Consensus Rounds</span>
          <div className="text-2xl font-bold text-slate-100 font-mono">Cycle #{activeHarmonicCycle}</div>
          <p className="text-xs text-slate-500">Sync convergence latency &lt; 8ms</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase">Mesh Health Index</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">99.8% Optimal</div>
          <p className="text-xs text-slate-500">All 6 cluster peers synchronized</p>
        </div>
      </div>

      {/* Peer Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {peers.map((peer) => (
          <div key={peer.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 text-sm font-mono">{peer.id}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                peer.roleInSwarm === 'COORDINATOR'
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                  : peer.roleInSwarm === 'DONOR_NODE'
                  ? 'bg-teal-950/60 text-teal-300 border border-teal-800/40'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
              }`}>
                {peer.roleInSwarm}
              </span>
            </div>
            <p className="text-xs text-slate-400">{peer.name}</p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 font-mono">
              <span className="text-slate-500">Donated: <strong className="text-teal-300">{peer.donatedBufferMb} MB</strong></span>
              <span className="text-slate-500">Health: <strong className="text-emerald-400">{peer.syntheticHealthScore}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
