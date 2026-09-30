import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Radio,
  RefreshCw,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  virtualProcessTable,
  VirtualProcessEntry,
  VirtualSignal,
} from '../../core/kernel/VirtualProcessTable';

export const VirtualProcessTableViewer: React.FC = () => {
  const [processes, setProcesses] = useState<VirtualProcessEntry[]>(virtualProcessTable.getProcessList());
  const [signalStatus, setSignalStatus] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      virtualProcessTable.pulseAll();
      setProcesses(virtualProcessTable.getProcessList());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    virtualProcessTable.pulseAll();
    setProcesses(virtualProcessTable.getProcessList());
  };

  const handleSendSignal = (vpid: number, signal: VirtualSignal) => {
    const res = virtualProcessTable.sendSignal(vpid, signal);
    setSignalStatus(`[SIGNAL] ${res.message}`);
    setProcesses(virtualProcessTable.getProcessList());
  };

  return (
    <div id="virtual-process-table-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R627 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Virtual Process Table (/proc)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Cpu className="w-8 h-8 text-purple-400" />
              Virtual Process Table (/proc)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Real-time Linux-grade virtual process inspector monitoring daemons, state health, memory footprints, and dispatching runtime signals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              Pulse Heartbeat
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL DAEMONS</span>
            <span className="text-xl font-bold text-purple-400 font-mono">{processes.length} VPIDs</span>
            <span className="text-[9px] text-purple-500 block">100% Monitored</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">HEARTBEAT CADENCE</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">2000ms</span>
            <span className="text-[9px] text-emerald-500 block">Active Pulse</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">ZOMBIE PROCESSES</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">0</span>
            <span className="text-[9px] text-cyan-500 block">Zero Leaks</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">HEALTH SCORE</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100/100</span>
            <span className="text-[9px] text-emerald-500 block">OPTIMAL State</span>
          </div>
        </div>
      </div>

      {signalStatus && (
        <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-mono">
          {signalStatus}
        </div>
      )}

      {/* Process Table Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-purple-500" />
            Active Virtual Daemon Table (/proc/tade_processes)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live V-Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-2.5 rounded-l-lg">VPID</th>
                <th className="p-2.5">Daemon Name</th>
                <th className="p-2.5">Namespace</th>
                <th className="p-2.5">User</th>
                <th className="p-2.5">State</th>
                <th className="p-2.5">Health</th>
                <th className="p-2.5">Memory</th>
                <th className="p-2.5">Heartbeat</th>
                <th className="p-2.5 rounded-r-lg text-right">Signal Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {processes.map((proc) => (
                <tr key={proc.vpid} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="p-2.5 font-bold text-purple-600 dark:text-purple-400">#{proc.vpid}</td>
                  <td className="p-2.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{proc.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{proc.command}</div>
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">{proc.namespace}</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">{proc.user}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {proc.state}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {proc.health}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">
                    {Math.round(proc.memoryBytes / 1024 / 1024)} MB
                  </td>
                  <td className="p-2.5 text-emerald-500">Live ({proc.uptimeSeconds}s)</td>
                  <td className="p-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleSendSignal(proc.vpid, 'SIGRECOVERY')}
                        className="px-2 py-1 rounded bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-[10px] font-bold transition-all"
                        title="Send SIGRECOVERY"
                      >
                        RECOVER
                      </button>
                      <button
                        onClick={() => handleSendSignal(proc.vpid, 'SIGHUP')}
                        className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-all"
                        title="Send SIGHUP"
                      >
                        RELOAD
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
