import React, { useState } from 'react';
import {
  Compass,
  Layers,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  GitFork,
  Search,
  CheckCircle2,
  Cpu,
  Database
} from 'lucide-react';
import { CapabilityRegistry, SystemCapability, CapabilityCategory } from '../../core/contract/CapabilityRegistry';

interface Props {
  onNavigate?: (tabId: string) => void;
}

export const CapabilityRegistryViewer: React.FC<Props> = ({ onNavigate }) => {
  const capabilityRegistry = CapabilityRegistry.getInstance();
  const allCapabilities = capabilityRegistry.getAllCapabilities();
  const summary = capabilityRegistry.getSummary();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCapability, setSelectedCapability] = useState<SystemCapability | null>(null);

  const filtered = allCapabilities.filter(c => {
    const matchesCat = activeCategory === 'ALL' || c.category === activeCategory;
    const matchesQ = searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  const getMaturityBadge = (level: string) => {
    switch (level) {
      case 'PRODUCTION_LOCKED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'ENTERPRISE_READY':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'DORMANT_SAFE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            R729 Capability Registry
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
            Topologi Arsitektur 360°
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
          <Compass className="w-7 h-7 text-indigo-400" />
          Peta Kapabilitas Sistem & Relasi Antar-Modul
        </h2>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Visualisasi menyeluruh seluruh pilar kapabilitas kedaulatan TADE Enterprise beserta relasi dependensi,
          pemantauan Guardian, dan invariant operasionalnya.
        </p>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Total Kapabilitas</span>
            <span className="text-xl font-bold text-white font-mono">{summary.totalCapabilities} Kapabilitas</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Production Locked</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{summary.productionLockedCount}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Enterprise Ready</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{summary.enterpriseReadyCount}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Total Relasi Graf</span>
            <span className="text-xl font-bold text-purple-400 font-mono">{summary.totalRelations} Relasi</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'GUARDIAN', 'AI_ASY', 'HERMES', 'SMART_OFFICE', 'RECOVERY', 'KNOWLEDGE', 'GOVERNANCE'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kapabilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cap => {
          const isSelected = selectedCapability?.id === cap.id;
          return (
            <div
              key={cap.id}
              onClick={() => setSelectedCapability(isSelected ? null : cap)}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-lg">
                    {cap.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getMaturityBadge(cap.maturityLevel)}`}>
                    {cap.maturityLevel}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                  {cap.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
                  Owner: {cap.owner}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                  {cap.description}
                </p>

                <div className="space-y-1 mb-3">
                  {cap.relations.map((rel, rIdx) => (
                    <div key={rIdx} className="text-[11px] font-mono flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                        {rel.relationType}
                      </span>
                      <span className="truncate">{rel.targetCapabilityId}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-400 text-[10px]">
                  Modul: {cap.associatedModuleCodes.join(', ')}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                  Rincian <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Capability Modal/Detail */}
      {selectedCapability && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-indigo-600 text-white">
                {selectedCapability.id}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedCapability.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Engine Asosiasi: {selectedCapability.associatedEngineId} | Owner: {selectedCapability.owner}
              </p>
            </div>

            <button
              onClick={() => setSelectedCapability(null)}
              className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 font-mono cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-2">
                Relasi Graf Dependensi ({selectedCapability.relations.length})
              </h4>
              <div className="space-y-2">
                {selectedCapability.relations.map((r, i) => (
                  <div key={i} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[10px]">
                        {r.relationType}
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{r.targetCapabilityId}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-2">
                Invariant & Kedaulatan Sistem
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedCapability.invariants.map((inv, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
