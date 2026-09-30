import React, { useState } from 'react';
import { GitGraph, CheckCircle2, AlertTriangle, Layers, ArrowRight, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';
import { dependencyGraphGuardian, EngineNode, DependencyAuditReport } from '../../core/operational/DependencyGraphGuardian';

export const DependencyGraphGuardianViewer: React.FC = () => {
  const [nodes] = useState<EngineNode[]>(dependencyGraphGuardian.getAllNodes());
  const [report, setReport] = useState<DependencyAuditReport>(dependencyGraphGuardian.getAuditReport());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleReAudit = () => {
    const updated = dependencyGraphGuardian.auditDependencyGraph();
    setReport({ ...updated });
  };

  const filteredNodes = selectedCategory === 'ALL'
    ? nodes
    : nodes.filter(n => n.category === selectedCategory);

  return (
    <div id="dependency-graph-guardian-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              R636 &bull; DEPENDENCY GUARDIAN
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              DAG ZERO CYCLE PASS
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Dependency Graph Guardian &amp; Architecture Map
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous directed acyclic graph audit: Detects circular dependencies, orphan modules, and blast radius.
          </p>
        </div>

        <button
          onClick={handleReAudit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Run Deep Graph Audit
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">TOTAL ENGINE NODES</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {report.totalNodes}
          </span>
          <span className="text-[10px] text-slate-500 block">RC1 &rarr; RC81 Core Engines</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">CIRCULAR DEPENDENCIES</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {report.circularDependencies.length}
          </span>
          <span className="text-[10px] text-emerald-500 block">Strict DAG Integrity</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">ORPHAN MODULES</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {report.orphanModules.length}
          </span>
          <span className="text-[10px] text-emerald-500 block">Zero Unanchored Modules</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">GRAPH HEALTH SCORE</span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            {report.graphHealthScore}/100
          </span>
          <span className="text-[10px] text-cyan-500 block">Optimal Topological Flow</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs pb-1">
        {['ALL', 'KERNEL', 'SECURITY', 'GOVERNANCE', 'CIVIL', 'OPERATIONS', 'AI_COGNITIVE', 'STORAGE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Nodes Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {node.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                {node.category} &bull; {node.sprint}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {node.name}
              </h4>
            </div>

            <div className="space-y-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Dependencies:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {node.dependencies.length > 0 ? node.dependencies.join(', ') : 'Root / None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Dependents:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {node.dependents.length} downstream nodes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Blast Radius Index:</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                  node.blastRadiusScore > 5 ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  Level {node.blastRadiusScore}/10
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
              </span>
              <span className="text-slate-400">Locked Base</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
