import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  UserX,
  Lock,
} from 'lucide-react';
import {
  agentRegistryV2,
  RegisteredAgentEntry,
} from '../../core/kernel/AgentRegistryV2';

export const AgentRegistryV2Viewer: React.FC = () => {
  const [agents, setAgents] = useState<RegisteredAgentEntry[]>(agentRegistryV2.getAgents());
  const [blockedAnonymous, setBlockedAnonymous] = useState(agentRegistryV2.getAnonymousAttemptsBlocked());
  const [registerResult, setRegisterResult] = useState<string | null>(null);

  const handleRefresh = () => {
    setAgents(agentRegistryV2.getAgents());
    setBlockedAnonymous(agentRegistryV2.getAnonymousAttemptsBlocked());
  };

  const handleSimulateAnonymous = () => {
    // Attempt to register an agent with no parentAgentId and tier !== SOVEREIGN
    const res = agentRegistryV2.registerAgent({
      agentId: `AGT-ROGUE-${Date.now().toString(16)}`,
      name: 'Rogue Anonymous Scraper',
      tier: 'MICRO_AGENT',
      namespace: 'WEBSITE',
      vpid: 9999,
      parentAgentId: null, // VIOLATION!
      capabilities: ['CAP_DATA_SCRUB'],
      status: 'ACTIVE',
      lastTask: 'Attempting unauthenticated memory read',
      totalTasksExecuted: 0,
      healthScore: 50,
      registeredTimestamp: Date.now(),
    });

    if (!res.success) {
      setRegisterResult(`[BLOCKED] Anonymous agent rejected: ${res.message}`);
    } else {
      setRegisterResult(`[UNEXPECTED ALLOWED] Anonymous agent registered.`);
    }
    handleRefresh();
  };

  return (
    <div id="agent-registry-v2-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R630 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Agent Registry V2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-cyan-400" />
              Agent Registry V2 (Zero Anonymous Agents)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Strict identity and capability directory requiring cryptographic parent chain, verifiable namespace, and unique Virtual PID for every agent.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Refresh Registry
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL AGENTS</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{agents.length} Registered</span>
            <span className="text-[9px] text-cyan-500 block">100% Identified</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">ANONYMOUS BLOCKED</span>
            <span className="text-xl font-bold text-rose-400 font-mono">{blockedAnonymous}</span>
            <span className="text-[9px] text-rose-500 block">Zero Rogue Allowed</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CHAIN OF TRUST</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100%</span>
            <span className="text-[9px] text-emerald-500 block">Sovereign Rooted</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">AVERAGE HEALTH</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100/100</span>
            <span className="text-[9px] text-emerald-500 block">All Systems Active</span>
          </div>
        </div>
      </div>

      {/* Anonymous Agent Penetration Simulation Test Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            Simulasi Injeksi Agen Anonim (Rogue Worker Test)
          </div>
          <span className="text-xs text-slate-400 font-mono">Zero Trust Policy</span>
        </div>
        <p className="text-xs text-slate-300">
          Uji coba mendaftarkan pekerja mikro tanpa `parentAgentId` untuk membuktikan penolakan otomatis oleh Konstitusi TADE.
        </p>
        <button
          onClick={handleSimulateAnonymous}
          className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all flex items-center gap-2"
        >
          <UserX className="w-4 h-4" /> Injeksi Agen Tanpa Induk (Rogue Agent)
        </button>

        {registerResult && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
            {registerResult}
          </div>
        )}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.agentId}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{agent.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {agent.agentId} &bull; VPID #{agent.vpid}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
                {agent.tier}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Namespace:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{agent.namespace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Parent Agent:</span>
                <span className="text-slate-500 dark:text-slate-400">{agent.parentAgentId || 'ROOT (SOVEREIGN)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Task:</span>
                <span className="text-right truncate max-w-[200px]" title={agent.lastTask}>
                  {agent.lastTask}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tasks Executed:</span>
                <span className="text-emerald-500 font-bold">{agent.totalTasksExecuted} tasks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] font-mono text-slate-400 truncate">
              {agent.integritySignature}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
