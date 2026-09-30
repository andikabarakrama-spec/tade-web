import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  HardDrive,
  RefreshCw,
  Zap,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  resourceGovernorV3,
  CGroupQuota,
  ResourceGovernorMetrics,
} from '../../core/kernel/ResourceGovernorV3';
import { VirtualNamespace } from '../../core/kernel/KernelNamespaceManager';

export const ResourceGovernorViewer: React.FC = () => {
  const [cgroups, setCgroups] = useState<CGroupQuota[]>(resourceGovernorV3.getCgroups());
  const [metrics, setMetrics] = useState<ResourceGovernorMetrics>(resourceGovernorV3.getMetrics());
  const [burstResult, setBurstResult] = useState<string | null>(null);

  const handleRefresh = () => {
    setCgroups(resourceGovernorV3.getCgroups());
    setMetrics(resourceGovernorV3.getMetrics());
  };

  const handleSimulateBurst = (ns: VirtualNamespace) => {
    const res = resourceGovernorV3.simulateBurstRedistribution(ns);
    setBurstResult(`[BURST REDISTRIBUTION] ${res.details}`);
    handleRefresh();
  };

  return (
    <div id="resource-governor-viewer" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R633 &bull; DIGITAL STATE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-400">Resource Governor V3 (CFS & Cgroups)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sliders className="w-8 h-8 text-emerald-400" />
              Resource Governor V3 (CFS & Cgroups)
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Linux CFS-inspired fair resource allocator enforcing memory cgroups, fair CPU timeslicing, and active anti-starvation for background micro-workers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Refresh Quotas
            </button>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">FAIRNESS SCORE</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{metrics.overallFairnessScorePct}%</span>
            <span className="text-[9px] text-emerald-500 block">CFS Equilibrium</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">MEMORY CGROUP CAP</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{metrics.allocatedMemoryMB} / {metrics.totalMemoryCapMB} MB</span>
            <span className="text-[9px] text-cyan-500 block">Strictly Bound</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">BURST REDISTRIBUTIONS</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{metrics.burstRedistributionsCount}</span>
            <span className="text-[9px] text-amber-500 block">Zero Latency Spike</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STARVATION INCIDENTS</span>
            <span className="text-xl font-bold text-purple-400 font-mono">{metrics.starvationIncidentsCount}</span>
            <span className="text-[9px] text-purple-500 block">Anti-Starvation Active</span>
          </div>
        </div>
      </div>

      {/* Burst Load Simulator Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            Simulasi Lonjakan Beban (Burst CPU Redistribution)
          </div>
          <span className="text-xs text-slate-400 font-mono">CFS Dynamic Loaning</span>
        </div>
        <p className="text-xs text-slate-300">
          Uji coba injeksi beban spike ke modul PPDB atau Keuangan untuk melihat bagaimana CFS meminjamkan CPU slice menganggur secara adil.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSimulateBurst('SIM')}
            className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all"
          >
            Burst Test: SIM (School Admin Peak)
          </button>
          <button
            onClick={() => handleSimulateBurst('CIVIL_SERVICE')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all"
          >
            Burst Test: CIVIL_SERVICE (Raport Generation Batch)
          </button>
          <button
            onClick={() => handleSimulateBurst('GUARDIAN')}
            className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all"
          >
            Burst Test: GUARDIAN (Threat Defense Spike)
          </button>
        </div>

        {burstResult && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
            {burstResult}
          </div>
        )}
      </div>

      {/* Cgroups Quotas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cgroups.map((cg) => (
          <div
            key={cg.namespace}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {cg.namespace}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                {cg.cpuSharePct}% CPU Share
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Memory Cgroup:</span>
                <span>{cg.currentMemoryMB} MB / {cg.memoryCapMB} MB Cap</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(cg.currentMemoryMB / cg.memoryCapMB) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-slate-400">Min Guaranteed CPU:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{cg.minGuaranteedCpuPct}%</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Anti-Starvation Score:</span>
                <span className="text-emerald-500 font-bold">{cg.starvationPreventionScore}% (Healthy)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
