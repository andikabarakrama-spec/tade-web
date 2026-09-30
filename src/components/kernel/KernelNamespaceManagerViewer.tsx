import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  HardDrive,
  Activity,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Lock,
} from 'lucide-react';
import { kernelNamespaceManager, VirtualNamespace } from '../../core/kernel/KernelNamespaceManager';

export const KernelNamespaceManagerViewer: React.FC = () => {
  const [rules, setRules] = useState(kernelNamespaceManager.getBoundaryRules());
  const [memories, setMemories] = useState(kernelNamespaceManager.getMemoryContexts());
  const [logs, setLogs] = useState(kernelNamespaceManager.getAccessLog());
  const [violations, setViolations] = useState(kernelNamespaceManager.getTotalViolationsPrevented());
  const [probeResult, setProbeResult] = useState<string | null>(null);

  const handleRefresh = () => {
    setRules(kernelNamespaceManager.getBoundaryRules());
    setMemories(kernelNamespaceManager.getMemoryContexts());
    setLogs(kernelNamespaceManager.getAccessLog());
    setViolations(kernelNamespaceManager.getTotalViolationsPrevented());
  };

  const handleSimulatePenetration = (source: VirtualNamespace, target: VirtualNamespace) => {
    const res = kernelNamespaceManager.testSimulateCrossBleed(source, target);
    if (res.blocked) {
      setProbeResult(`[BLOCKED SECURELY] ${source} -> ${target}: ${res.details}`);
    } else {
      setProbeResult(`[UNEXPECTED ALLOWED] ${source} -> ${target}`);
    }
    handleRefresh();
  };

  return (
    <div id="kernel-namespace-manager-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R625 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Virtual Namespace Manager</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Layers className="w-8 h-8 text-emerald-400" />
              Kernel Namespace Manager
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Enforces strict hardware-grade memory and execution isolation across 7 Virtual Namespaces with zero cross-boundary bleed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Refresh State
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL NAMESPACES</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">7 Isolated</span>
            <span className="text-[9px] text-emerald-500 block">Zero Memory Bleed</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">WEBSITE SANDBOX</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">READ-ONLY</span>
            <span className="text-[9px] text-cyan-500 block">Air-Gapped from SIM</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">VIOLATIONS PREVENTED</span>
            <span className="text-xl font-bold text-purple-400 font-mono">{violations}</span>
            <span className="text-[9px] text-purple-500 block">100% Intercepted</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">SECURITY STATUS</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">ENFORCED</span>
            <span className="text-[9px] text-emerald-500 block">MAC Strict Mode</span>
          </div>
        </div>
      </div>

      {/* Penetration Probe Simulation Test Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            Simulasi Penetrasi Boundary Isolation (Chaos Test)
          </div>
          <span className="text-xs text-slate-400 font-mono">Air-Gap Verification</span>
        </div>
        <p className="text-xs text-slate-300">
          Uji coba injeksi paksa mutasi memori dari Public Website ke SIM Sandbox atau Guardian Ring-0 untuk memverifikasi proteksi isolasi.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSimulatePenetration('WEBSITE', 'SIM')}
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all"
          >
            Probe: WEBSITE ➔ SIM (Illegal Write)
          </button>
          <button
            onClick={() => handleSimulatePenetration('WEBSITE', 'SYSTEM_KERNEL')}
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all"
          >
            Probe: WEBSITE ➔ KERNEL (Privilege Escalation)
          </button>
          <button
            onClick={() => handleSimulatePenetration('CIVIL_SERVICE', 'GUARDIAN')}
            className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all"
          >
            Probe: CIVIL_SERVICE ➔ GUARDIAN (Air-Gap Test)
          </button>
        </div>

        {probeResult && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
            {probeResult}
          </div>
        )}
      </div>

      {/* Grid of Namespaces & Memory Contexts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memories.map((mem) => {
          const rule = rules.find((r) => r.sourceNamespace === mem.namespace);
          return (
            <div
              key={mem.namespace}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  {mem.namespace}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {rule?.isolationLevel}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Allocated:</span>
                  <span>{Math.round(mem.allocatedBytes / 1024 / 1024)} MB / {Math.round(mem.maxBytes / 1024 / 1024)} MB</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(mem.allocatedBytes / mem.maxBytes) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Access Policy:</span>
                  <span className={mem.readOnly ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                    {mem.readOnly ? 'STRICT READ-ONLY' : 'READ / WRITE (MAC)'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Allowed Targets:</span>
                  <span className="text-right truncate max-w-[140px]" title={rule?.allowedTargets.join(', ')}>
                    {rule?.allowedTargets.join(', ')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] font-mono text-slate-400 truncate">
                {mem.integrityHash}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Access Audit Stream */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4 text-emerald-500" />
            Inter-Namespace IPC Audit Log (Live Verification)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Top 50 Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-2.5 rounded-l-lg">Timestamp</th>
                <th className="p-2.5">Source</th>
                <th className="p-2.5">Target</th>
                <th className="p-2.5">Op</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 rounded-r-lg">Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="p-2.5 text-slate-400">{log.timestamp.substring(11, 19)}</td>
                  <td className="p-2.5 font-bold text-slate-700 dark:text-slate-200">{log.source}</td>
                  <td className="p-2.5 font-bold text-slate-700 dark:text-slate-200">{log.target}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px]">
                      {log.operation}
                    </span>
                  </td>
                  <td className="p-2.5">
                    {log.status === 'ALLOWED' ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> ALLOWED
                      </span>
                    ) : (
                      <span className="text-rose-500 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> DENIED
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
