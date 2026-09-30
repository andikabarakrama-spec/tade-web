import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Layers, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Filter, 
  Cpu, 
  ShieldCheck, 
  Clock,
  Zap
} from 'lucide-react';
import { guardianControlPlane, KernelTraceSpan } from '../../core/kernel/GuardianControlPlane';

export const KernelTraceObservatoryViewer: React.FC = () => {
  const [traces, setTraces] = useState<KernelTraceSpan[]>(guardianControlPlane.getTraceSpans());
  const [filterStage, setFilterStage] = useState<string>('ALL');

  const refreshTraces = () => {
    setTraces(guardianControlPlane.getTraceSpans());
  };

  useEffect(() => {
    refreshTraces();
    const interval = setInterval(refreshTraces, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filterStage === 'ALL'
    ? traces
    : traces.filter(t => t.stage === filterStage);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                R600 &bull; KERNEL TRACE OBSERVATORY
              </span>
              <span className="text-xs text-slate-400 font-mono">eBPF-Inspired Asynchronous Event Tracing</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Kernel Trace Observatory &amp; Event Lifecycle Visualizer</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
          >
            <option value="ALL">All Trace Stages</option>
            <option value="EMIT">EMIT (Source Origin)</option>
            <option value="CONTROL_PLANE">CONTROL_PLANE (Router)</option>
            <option value="GUARDIAN_CHECK">GUARDIAN_CHECK (Ring 0)</option>
            <option value="EXECUTION">EXECUTION (Worker Core)</option>
            <option value="WAR_ROOM_SYNC">WAR_ROOM_SYNC (Telemetry)</option>
          </select>
          <button
            onClick={refreshTraces}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
          >
            <RefreshCw className="w-4 h-4" /> Trace Ping
          </button>
        </div>
      </div>

      {/* Visual Pipeline Stages */}
      <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3 font-mono text-xs">
        <span className="text-indigo-400 font-bold flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Perjalanan Aliran Event Kernel (End-to-End Pipeline):
        </span>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-center">
          <div className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
            1. Engine Event Emit
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
          <div className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-bold">
            2. Control Plane Route
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
          <div className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 font-bold">
            3. Guardian Ring 0
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
          <div className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-bold">
            4. Recovery/Execution
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
          <div className="flex-1 p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
            5. War Room Matrix
          </div>
        </div>
      </div>

      {/* Trace Spans Stream */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Live Trace Spans (/sys/kernel/debug/tracing/trace):
        </span>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filtered.map((span) => (
            <div
              key={span.spanId + span.traceId}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold border border-indigo-800 text-[10px]">
                    {span.traceId}
                  </span>
                  <strong className="text-white">{span.source} &rarr; {span.destination}</strong>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                    {span.stage}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Span: <code>{span.spanId}</code> &bull; Duration: <strong className="text-emerald-400">{span.durationMs}ms</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(span.timestamp).toLocaleTimeString()}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  CAPTURED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
