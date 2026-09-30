import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Clock, 
  CheckCircle, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Copy, 
  RefreshCw 
} from 'lucide-react';
import { 
  memoryLeakSentinel, 
  MemoryHealthReport 
} from '../../core/lts/MemoryLeakSentinel';

export const MemorySentinelViewer: React.FC = () => {
  const [report, setReport] = useState<MemoryHealthReport>(() => memoryLeakSentinel.getReport());
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    const fresh = memoryLeakSentinel.runDiagnostics();
    setReport({ ...fresh });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(memoryLeakSentinel.generateReportJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="memory-leak-sentinel-panel" className="space-y-6">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-memory-health-score" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Memory Health Score</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.overallHealthScore}%</p>
          <span className="text-xs text-emerald-400 font-medium">Status: {report.systemHeapStatus}</span>
        </div>

        <div id="metric-memory-listeners" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Listeners</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.activeListenersCount} Bound</p>
          <span className="text-xs text-indigo-400 font-medium">Zero Orphan Event Handlers</span>
        </div>

        <div id="metric-memory-timers" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Timers & Loops</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.activeTimersCount} Timers</p>
          <span className="text-xs text-cyan-400 font-medium">Lifecycle-Bounded Hooks</span>
        </div>

        <div id="metric-memory-heap" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Heap Footprint</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.heapUtilizationEstimateMb} MB</p>
          <span className="text-xs text-amber-400 font-medium">Ultra-light SPA Memory Pool</span>
        </div>
      </div>

      {/* Tracked Listeners and Timers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Listeners */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-slate-100">Audited Event Listeners (R658)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{report.listeners.length} Tracked</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {report.listeners.map((l) => (
              <div key={l.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-indigo-300 font-bold">{l.id} • {l.target}.on('{l.eventType}')</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {l.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Origin: <span className="font-mono text-slate-300">{l.attachedInModule}</span> • Active: {l.lifetimeSeconds}s
                </div>
                <p className="text-slate-400 text-xs">{l.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timers & Retained Objects */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-slate-100">Retained Object Heap Audits</h3>
              </div>
              <button
                onClick={handleCopyJson}
                id="btn-export-memory-health"
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
              >
                {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin' : 'Export JSON'}
              </button>
            </div>

            <div className="space-y-2.5">
              {report.retainedObjectAudits.map((obj, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-200 font-semibold">{obj.targetObject}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {obj.verdict} ({Math.round(obj.estimatedRetainedBytes / 1024)} KB)
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{obj.referenceHoldingChain}</div>
                  <p className="text-slate-400 text-xs">{obj.recommendation}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{report.executiveSummary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
