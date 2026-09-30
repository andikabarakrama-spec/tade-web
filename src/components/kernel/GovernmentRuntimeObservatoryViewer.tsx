import React, { useState } from 'react';
import {
  Landmark,
  Shield,
  Briefcase,
  Users,
  GitPullRequest,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  governmentRuntimeObservatory,
  GovernmentNodeState,
  CrossTierEscalationRecord,
} from '../../core/kernel/GovernmentRuntimeObservatory';

export const GovernmentRuntimeObservatoryViewer: React.FC = () => {
  const [nodes, setNodes] = useState<GovernmentNodeState[]>(governmentRuntimeObservatory.getGovernmentNodes());
  const [escalations, setEscalations] = useState<CrossTierEscalationRecord[]>(governmentRuntimeObservatory.getEscalations());

  const handleRefresh = () => {
    setNodes(governmentRuntimeObservatory.getGovernmentNodes());
    setEscalations(governmentRuntimeObservatory.getEscalations());
  };

  return (
    <div id="government-runtime-observatory-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R632 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Government Runtime Observatory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Landmark className="w-8 h-8 text-indigo-400" />
              Government Runtime Observatory
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Real-time operational observability across Sovereign Executive Council, AI Asy Civilian Cabinet, Guardian Defense Regiments, and Swarms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              Refresh Observatory
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">OBSERVED NODES</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{nodes.length} Sectors</span>
            <span className="text-[9px] text-indigo-500 block">100% Online</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">AVERAGE SLA</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">99.8%</span>
            <span className="text-[9px] text-emerald-500 block">Zero SLA Breach</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CROSS-TIER ESCALATION</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{escalations.length} Events</span>
            <span className="text-[9px] text-cyan-500 block">Auto Resolved (&lt;50ms)</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CONSTITUTIONAL HARMONY</span>
            <span className="text-xl font-bold text-purple-400 font-mono">100%</span>
            <span className="text-[9px] text-purple-500 block">Zero Jurisdictional Conflict</span>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <div
            key={node.nodeId}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{node.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Leader: {node.leader} &bull; {node.nodeId}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                {node.category}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Transactions:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{node.activeTransactionsCount} Operations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SLA Compliance:</span>
                <span className="text-emerald-500 font-bold">{node.slaCompliancePct}%</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Last Action:</span>
                <span className="text-right text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={node.lastActionSummary}>
                  {node.lastActionSummary}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Tier Escalations Stream */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
            <GitPullRequest className="w-4 h-4 text-indigo-500" />
            Cross-Tier Autonomous Escalation Stream
          </h2>
          <span className="text-xs text-slate-400 font-mono">Autonomous Resolution Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-2.5 rounded-l-lg">ID</th>
                <th className="p-2.5">Origin Node</th>
                <th className="p-2.5">Escalated To</th>
                <th className="p-2.5">Reason</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 rounded-r-lg">Resolution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {escalations.map((esc) => (
                <tr key={esc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400">{esc.id}</td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-200">{esc.originNode}</td>
                  <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{esc.escalatedTo}</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">{esc.reason}</td>
                  <td className="p-2.5 text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {esc.status}
                  </td>
                  <td className="p-2.5 text-slate-400">{esc.resolutionTimeMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
