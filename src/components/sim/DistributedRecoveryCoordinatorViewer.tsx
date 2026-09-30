import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  Activity, 
  Network,
  Share2
} from 'lucide-react';

interface SwarmRecoveryTask {
  id: string;
  targetEngine: string;
  helpingEngines: string[];
  priority: 'TIER_1_CRITICAL' | 'TIER_2_HIGH' | 'TIER_3_NORMAL';
  recoveryPhase: 'DETECT' | 'CONTAIN' | 'HEAL' | 'REJOIN' | 'REINFORCE';
  status: 'COORDINATING' | 'CONVERGED';
  progressPercent: number;
}

export const DistributedRecoveryCoordinatorViewer: React.FC = () => {
  const [tasks, setTasks] = useState<SwarmRecoveryTask[]>([
    {
      id: 'REC-MESH-01',
      targetEngine: 'FIRESTORE_GATEWAY',
      helpingEngines: ['IMMORTAL_STORAGE', 'OFFLINE_QUEUE', 'GUARDIAN_SUPERVISOR'],
      priority: 'TIER_1_CRITICAL',
      recoveryPhase: 'REINFORCE',
      status: 'CONVERGED',
      progressPercent: 100
    },
    {
      id: 'REC-MESH-02',
      targetEngine: 'ACADEMIC_RAPORT_VFS',
      helpingEngines: ['MEMORY_MAP_CACHE', 'WAL_ENGINE'],
      priority: 'TIER_2_HIGH',
      recoveryPhase: 'REINFORCE',
      status: 'CONVERGED',
      progressPercent: 100
    },
    {
      id: 'REC-MESH-03',
      targetEngine: 'PUBLIC_PORTAL_SANDBOX',
      helpingEngines: ['GUARDIAN_RING_0'],
      priority: 'TIER_3_NORMAL',
      recoveryPhase: 'REINFORCE',
      status: 'CONVERGED',
      progressPercent: 100
    }
  ]);

  const [isCoordinating, setIsCoordinating] = useState<boolean>(false);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);

  const handleSimulateMeshRecovery = () => {
    setIsCoordinating(true);
    setTimeout(() => {
      setTasks(prev => [
        {
          id: `REC-MESH-${Date.now().toString().slice(-4)}`,
          targetEngine: 'SESSION_RBAC_WATCHDOG',
          helpingEngines: ['GUARDIAN_SUPERVISOR', 'CONTROL_PLANE_DISPATCHER'],
          priority: 'TIER_1_CRITICAL',
          recoveryPhase: 'REINFORCE',
          status: 'CONVERGED',
          progressPercent: 100
        },
        ...prev
      ]);
      setIsCoordinating(false);
      setDispatchMsg('Distributed recovery coordinated: Swarm peers allocated memory and healed target engine.');
    }, 1200);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                R599 &bull; DISTRIBUTED RECOVERY COORDINATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">Multi-Directional Swarm Healing Mesh</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Distributed Swarm Recovery Coordinator &amp; Mesh Priority</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateMeshRecovery}
            disabled={isCoordinating}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCoordinating ? 'animate-spin' : ''}`} />
            {isCoordinating ? 'Coordinating Swarm...' : 'Trigger Swarm Peer Assist'}
          </button>
        </div>
      </div>

      {dispatchMsg && (
        <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800 text-purple-200 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{dispatchMsg}</span>
        </div>
      )}

      {/* 3 Coordination Directives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-1.5">
          <span className="text-purple-400 font-bold block">1. Siapa Membantu (Who)</span>
          <p className="text-slate-400 text-[11px] font-sans">
            Engine terdekat dengan kapasitas RAM dan CPU idle dipilih sebagai peer pendukung.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-1.5">
          <span className="text-cyan-400 font-bold block">2. Kapan Membantu (When)</span>
          <p className="text-slate-400 text-[11px] font-sans">
            Bantuan diaktifkan seketika heartbeat target engine melambat &gt; 1500ms.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-1.5">
          <span className="text-emerald-400 font-bold block">3. Prioritas Bantuan (Priority)</span>
          <p className="text-slate-400 text-[11px] font-sans">
            Data keuangan santri dan rapor diprioritaskan sebelum background telemetry sync.
          </p>
        </div>
      </div>

      {/* Active Swarm Recovery Tasks */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          Active Multi-Directional Recovery Mesh (/proc/tade_swarm_mesh):
        </span>

        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800 text-[10px]">
                    {t.id}
                  </span>
                  <strong className="text-white">{t.targetEngine}</strong>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                    {t.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Assisting Swarm Peers: <strong>{t.helpingEngines.join(', ')}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  {t.recoveryPhase} &bull; {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
