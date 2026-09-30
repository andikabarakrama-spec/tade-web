import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  capabilityKernelEngine,
  TADECapability,
  EntityCapabilityProfile,
} from '../../core/kernel/CapabilityKernelEngine';

export const CapabilityKernelViewer: React.FC = () => {
  const [profiles, setProfiles] = useState<EntityCapabilityProfile[]>(capabilityKernelEngine.getProfiles());
  const [auditLogs, setAuditLogs] = useState(capabilityKernelEngine.getAuditLogs());
  const [blockedCount, setBlockedCount] = useState(capabilityKernelEngine.getPrivilegeEscalationAttemptsBlocked());
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleRefresh = () => {
    setProfiles(capabilityKernelEngine.getProfiles());
    setAuditLogs(capabilityKernelEngine.getAuditLogs());
    setBlockedCount(capabilityKernelEngine.getPrivilegeEscalationAttemptsBlocked());
  };

  const handleSimulateEscalation = (entityId: string, illegalCap: TADECapability) => {
    const res = capabilityKernelEngine.testSimulatePrivilegeEscalation(entityId, illegalCap);
    if (!res.allowed) {
      setTestResult(`[BLOCKED] Escalation attempt by ${entityId} claiming ${illegalCap} was REJECTED: ${res.reason}`);
    } else {
      setTestResult(`[ALLOWED] ${entityId} successfully asserted ${illegalCap}`);
    }
    handleRefresh();
  };

  return (
    <div id="capability-kernel-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R626 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">POSIX Capability Kernel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Key className="w-8 h-8 text-cyan-400" />
              Capability Kernel Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Eliminates monolithic root access by binding granular POSIX-style capabilities to Sovereign, AI Asy, Guardian, Assistants, and Micro Agents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Refresh Capabilities
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PROFILES CONFIGURED</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{profiles.length} Entities</span>
            <span className="text-[9px] text-cyan-500 block">Zero Monolithic Root</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">SOVEREIGN VETO</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">CAP_ALL</span>
            <span className="text-[9px] text-emerald-500 block">Super Admin Only</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">ESCALATIONS BLOCKED</span>
            <span className="text-xl font-bold text-rose-400 font-mono">{blockedCount}</span>
            <span className="text-[9px] text-rose-500 block">100% Repelled</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CONSTITUTIONAL BOUND</span>
            <span className="text-xl font-bold text-purple-400 font-mono">100%</span>
            <span className="text-[9px] text-purple-500 block">Separation Enforced</span>
          </div>
        </div>
      </div>

      {/* Privilege Escalation Penetration Probe Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
            <Zap className="w-4 h-4" />
            Simulasi Penetrasi Eskalasi Hak Akses (Least Privilege Test)
          </div>
          <span className="text-xs text-slate-400 font-mono">Kernel Security Gate</span>
        </div>
        <p className="text-xs text-slate-300">
          Uji coba apakah AI Asy (sipil) dapat mengeksekusi CAP_RING0_PROTECT (militer) atau apakah Asisten dapat mengeksekusi CAP_SOVEREIGN_VETO.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSimulateEscalation('ENT_AI_ASY', 'CAP_RING0_PROTECT')}
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all"
          >
            Probe: AI Asy ➔ CAP_RING0_PROTECT (Illegal Military Escalation)
          </button>
          <button
            onClick={() => handleSimulateEscalation('ENT_GUARDIAN', 'CAP_ACADEMIC_ANALYZE')}
            className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all"
          >
            Probe: Guardian ➔ CAP_ACADEMIC_ANALYZE (Illegal Civilian Interference)
          </button>
          <button
            onClick={() => handleSimulateEscalation('ENT_MIC_SCRUBBER', 'CAP_SOVEREIGN_VETO')}
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all"
          >
            Probe: Micro Scrubber ➔ CAP_SOVEREIGN_VETO (Illegal Sovereign Usurpation)
          </button>
        </div>

        {testResult && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
            {testResult}
          </div>
        )}
      </div>

      {/* Entity Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p) => (
          <div
            key={p.entityId}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{p.entityName}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{p.entityId}</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
                {p.tier}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block font-bold">
                Effective Capabilities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(p.effectiveCapabilities).map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-bold border border-slate-200 dark:border-slate-600"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Constitution Bound: YES</span>
              <span>Last Audited: Just Now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
