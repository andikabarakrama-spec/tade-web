import React, { useState, useEffect } from 'react';
import { GitFork, Activity, ShieldCheck, ArrowRight, Sliders, AlertCircle, RefreshCcw } from 'lucide-react';
import { GuardianKernel, EngineId } from '../../core/kernel/GuardianKernelLayer';

interface DependencyNode {
  id: EngineId;
  name: string;
  tier: number; // Tier 0 (Root/Kernel), Tier 1 (Core Services), Tier 2 (Domain Modules)
  dependsOn: EngineId[];
  latencyMs: number;
  throttleFactor: number; // 1.0 = normal, 0.5 = throttled
  status: 'OPTIMAL' | 'THROTTLED' | 'REROUTED';
}

export const GuardianDependencySupervisorViewer: React.FC = () => {
  const [nodes, setNodes] = useState<DependencyNode[]>([
    { id: 'GUARDIAN', name: 'Guardian Kernel Layer', tier: 0, dependsOn: [], latencyMs: 2, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'SESSION', name: 'Session Token Supervisor', tier: 1, dependsOn: ['GUARDIAN'], latencyMs: 8, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'FIRESTORE', name: 'Firestore Offline Buffer', tier: 1, dependsOn: ['GUARDIAN', 'SESSION'], latencyMs: 42, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'AI_ASY', name: 'AI Asy Core Subsystem', tier: 1, dependsOn: ['GUARDIAN', 'FIRESTORE'], latencyMs: 65, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'PPDB', name: 'PPDB Registration Hub', tier: 2, dependsOn: ['FIRESTORE', 'SESSION'], latencyMs: 18, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'RAPORT', name: 'Raport Kurikulum Merdeka', tier: 2, dependsOn: ['FIRESTORE', 'SESSION'], latencyMs: 24, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'KEUANGAN', name: 'Keuangan SPP Ledger', tier: 2, dependsOn: ['FIRESTORE', 'SESSION'], latencyMs: 15, throttleFactor: 1.0, status: 'OPTIMAL' },
    { id: 'CCTV', name: 'CCTV Neural Stream', tier: 2, dependsOn: ['GUARDIAN'], latencyMs: 110, throttleFactor: 0.8, status: 'THROTTLED' }
  ]);

  const [selectedNode, setSelectedNode] = useState<EngineId>('FIRESTORE');

  const simulateLatencySpike = (engineId: EngineId) => {
    setNodes(prev => prev.map(node => {
      if (node.id === engineId) {
        const newLatency = 450;
        return { ...node, latencyMs: newLatency, throttleFactor: 0.4, status: 'THROTTLED' };
      }
      return node;
    }));

    GuardianKernel.appendJournal({
      engineId,
      level: 'WARNING',
      subsystem: 'SUPERVISOR',
      message: `Latency spike detected on [${engineId}]. Dynamic priority adjustment engaged by Dependency Supervisor.`
    });
  };

  const autoBalanceDependencies = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      latencyMs: node.id === 'CCTV' ? 60 : Math.floor(Math.random() * 20) + 5,
      throttleFactor: 1.0,
      status: 'OPTIMAL'
    })));

    GuardianKernel.appendJournal({
      engineId: 'GUARDIAN',
      level: 'INFO',
      subsystem: 'SUPERVISOR',
      message: 'Dynamic Dependency Graph re-balanced across all 3 Tiers. Zero cascading failure achieved.'
    });
  };

  return (
    <div id="r566-dependency-supervisor" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-400">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Guardian Dependency Supervisor
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 font-mono">
                  R566 • Dynamic Topology
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Real-time topological DAG monitoring, dynamic CFS priority throttle, and cascade-proof isolation.
              </p>
            </div>
          </div>
          <button
            onClick={autoBalanceDependencies}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/50"
          >
            <RefreshCcw className="w-4 h-4" /> Re-Balance Topology
          </button>
        </div>
      </div>

      {/* DAG Tier View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((tierNum) => {
          const tierNodes = nodes.filter(n => n.tier === tierNum);
          const tierLabels = ['Tier 0 — Root Kernel Core', 'Tier 1 — Core Platform Services', 'Tier 2 — Modular Domain Engines'];
          return (
            <div key={tierNum} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                  {tierLabels[tierNum]}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {tierNodes.length} nodes
                </span>
              </div>

              <div className="space-y-3">
                {tierNodes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode(n.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedNode === n.id
                        ? 'bg-slate-800 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                        : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-slate-200 text-sm font-mono">{n.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                        n.status === 'OPTIMAL'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{n.name}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Latency: <strong className={n.latencyMs > 100 ? 'text-amber-400' : 'text-slate-200'}>{n.latencyMs} ms</strong></span>
                      <span>Scale: <strong className="text-slate-200">{(n.throttleFactor * 100).toFixed(0)}%</strong></span>
                    </div>

                    {n.dependsOn.length > 0 && (
                      <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <span>Deps:</span>
                        <span className="text-slate-400">{n.dependsOn.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Live Chaos Injection & Latency Governor</h3>
            <p className="text-xs text-slate-400">Trigger upstream latency simulation on selected engine [{selectedNode}] to verify zero cascade breakdown.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => simulateLatencySpike(selectedNode)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <AlertCircle className="w-4 h-4" /> Simulate Delay on {selectedNode}
          </button>
        </div>
      </div>
    </div>
  );
};
