import React, { useState } from 'react';
import { GitFork, ArrowDown, ArrowRight, Shield, AlertCircle, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { KernelBootManager, DependencyNode } from '../../core/kernel/KernelBootSequenceManager';
import { EngineId } from '../../core/kernel/GuardianKernelLayer';

export const EngineDependencyGraphViewer: React.FC = () => {
  const [nodes, setNodes] = useState<DependencyNode[]>(KernelBootManager.getDependencyGraph());
  const [selectedEngine, setSelectedEngine] = useState<EngineId>('GUARDIAN');
  const [simulatedFailure, setSimulatedFailure] = useState<EngineId | null>(null);

  const selectedNode = nodes.find(n => n.engineId === selectedEngine);

  const handleSimulateFailure = (engineId: EngineId) => {
    setSimulatedFailure(engineId);
    // Dynamic rerouting simulation
  };

  const handleRestore = () => {
    setSimulatedFailure(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
              R556 &bull; ENGINE DEPENDENCY GRAPH
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              SYSTEMD DEPENDENCY TREE &amp; DAG RESOLUTION
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            12-Engine Directed Acyclic Graph (DAG) &amp; Fail-Safe Dependency Routing
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Memetakan relasi ketergantungan antar-engine. Jika satu dependensi (misal Firestore) terputus, kernel mencari jalur fallback redundan tanpa mematikan engine di atasnya.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {simulatedFailure ? (
            <button
              onClick={handleRestore}
              className="py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
            >
              <RefreshCw className="w-4 h-4" />
              Restore Healthy Mesh
            </button>
          ) : (
            <button
              onClick={() => handleSimulateFailure('FIRESTORE')}
              className="py-2.5 px-4 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold border border-rose-300 dark:border-rose-800 transition"
            >
              Simulate Firestore Drop
            </button>
          )}
        </div>
      </div>

      {/* Simulated Alert if any */}
      {simulatedFailure && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span>
              <strong>FAIL-SAFE ACTIVATED:</strong> {simulatedFailure} is degraded. Downstream engines rerouted to local transactional queue &amp; WORM snapshot cache.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
            BLAST RADIUS CONTAINED
          </span>
        </div>
      )}

      {/* Grid: 6 Tiers of Engine Tree */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
          Hierarchical Dependency Tiers (Tier 1 Root &rarr; Tier 6 Leaf)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          {[1, 2, 3, 4, 5, 6].map(tier => {
            const tierNodes = nodes.filter(n => n.tier === tier);
            return (
              <div
                key={tier}
                className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">TIER {tier}</span>
                  <span className="text-[10px] text-slate-400">{tierNodes.length} Nodes</span>
                </div>

                <div className="space-y-2">
                  {tierNodes.map(node => {
                    const isSelected = selectedEngine === node.engineId;
                    const isFailed = simulatedFailure === node.engineId;
                    return (
                      <button
                        key={node.engineId}
                        onClick={() => setSelectedEngine(node.engineId)}
                        className={`w-full text-left p-2.5 rounded-2xl border transition-all ${
                          isFailed
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 animate-pulse'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{node.engineId}</span>
                          <span className={`w-2 h-2 rounded-full ${isFailed ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        </div>
                        <span className="text-[10px] opacity-80 block truncate font-sans">{node.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Inspector */}
      {selectedNode && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <span className="text-xs text-indigo-500 font-bold block">NODE INSPECTOR</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedNode.engineId} &bull; {selectedNode.name} (Tier {selectedNode.tier})
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              STATUS: {selectedNode.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-slate-400 font-bold block">DIRECT DEPENDENCIES (Depends On)</span>
              {selectedNode.dependsOn.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.dependsOn.map(dep => (
                    <span key={dep} className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                      &larr; {dep}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 text-[11px]">Root Anchor Node (Zero Upstream)</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-slate-400 font-bold block">DOWNSTREAM CONSUMERS (Required By)</span>
              {selectedNode.requiredBy.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.requiredBy.map(req => (
                    <span key={req} className="px-2 py-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-[11px]">
                      &rarr; {req}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 text-[11px]">Leaf Subsystem</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-slate-400 font-bold block">FAILOVER REDUNDANCY PARTNER</span>
              {selectedNode.redundancyPartner ? (
                <span className="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[11px] inline-block">
                  Mutual Aid: {selectedNode.redundancyPartner}
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">Self-Contained Isolation Unit</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
