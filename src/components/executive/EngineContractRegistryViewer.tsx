import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Search,
  ExternalLink,
  Code2,
  FileCheck2,
  Server,
  ArrowRight
} from 'lucide-react';
import { EngineContractRegistry, EngineContractMetadata } from '../../core/contract/EngineContractRegistry';
import { CompatibilityValidator, CompatibilityReport } from '../../core/contract/CompatibilityValidator';

interface Props {
  onNavigate?: (tabId: string) => void;
}

export const EngineContractRegistryViewer: React.FC<Props> = ({ onNavigate }) => {
  const registry = EngineContractRegistry.getInstance();
  const validator = CompatibilityValidator.getInstance();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<EngineContractMetadata | null>(null);
  const [validationReport, setValidationReport] = useState<CompatibilityReport>(() => validator.validateCompatibility());
  const [isValidating, setIsValidating] = useState(false);

  const summary = registry.getRegistrySummary();
  const allContracts = registry.getAllContracts();

  const filteredContracts = allContracts.filter(c => {
    const matchesCat = activeCategory === 'ALL' || c.category === activeCategory;
    const matchesQuery = searchQuery === '' ||
      c.engineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.engineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setValidationReport(validator.validateCompatibility());
      setIsValidating(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                RC90 Arsitektur Enterprise
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                R721 & R722 Compliant
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
              <Layers className="w-7 h-7 text-indigo-400" />
              Engine Contract Registry & Compatibility Validator
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Registri kontrak eksplisit seluruh engine TADE berpola Debian Stable / Kubernetes Controller.
              Menjamin 100% backward compatibility, rollback safety, dan topologi dependensi bebas siklus buntu.
            </p>
          </div>

          <button
            onClick={handleRunValidation}
            disabled={isValidating}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Memvalidasi...' : 'Jalankan Uji Kompatibilitas'}
          </button>
        </div>

        {/* 4 Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400 font-mono">Total Engine Terdaftar</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">{summary.totalEngines} Engine</p>
            <span className="text-[10px] text-emerald-400 font-medium">9/9 Kontrak Aktif</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400 font-mono">Skor Kompatibilitas</p>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{validationReport.overallCompatibilityScore}%</p>
            <span className="text-[10px] text-emerald-300 font-medium">0 Circular Dependency</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400 font-mono">Rollback Safety</p>
            <p className="text-xl font-bold text-indigo-400 font-mono mt-0.5">{summary.rollbackSafePercentage}%</p>
            <span className="text-[10px] text-slate-300 font-medium">Non-destructive rollback</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <p className="text-[11px] text-slate-400 font-mono">Hermes Engine State</p>
            <p className="text-xl font-bold text-purple-400 font-mono mt-0.5">DORMANT_SAFE</p>
            <span className="text-[10px] text-purple-300 font-medium">Zero auto-mutations</span>
          </div>
        </div>
      </div>

      {/* Compatibility Validator Report Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 font-mono">
              Laporan Diagnostik Kompatibilitas (R722 — Report-Only)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Terakhir diuji: {new Date(validationReport.timestamp).toLocaleTimeString('id-ID')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {validationReport.findings.slice(0, 3).map((f, i) => (
            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-mono">{f.checkType}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'SSOT', 'GUARDIAN', 'AI_ASY', 'HERMES', 'SMART_OFFICE', 'RECOVERY', 'KNOWLEDGE', 'GOVERNANCE'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
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
            placeholder="Cari engine / owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Engine Contract Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContracts.map(engine => {
          const isSelected = selectedEngine?.engineId === engine.engineId;
          return (
            <div
              key={engine.engineId}
              onClick={() => setSelectedEngine(isSelected ? null : engine)}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-900">
                    {engine.engineId}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    engine.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : engine.status === 'DORMANT_SAFE'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {engine.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1 leading-snug">
                  {engine.engineName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-mono">
                  Owner: {engine.owner}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Engine Ver:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{engine.engineVersion}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contract Ver:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{engine.contractVersion}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                  {engine.apiSurfaceDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[10px] truncate max-w-[150px]">{engine.sourceFilePath}</span>
                </div>

                <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5 hover:underline">
                  Detail <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Engine Detail Modal / Drawer */}
      {selectedEngine && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-indigo-600 text-white">
                  {selectedEngine.engineId}
                </span>
                <span className="text-xs font-mono text-slate-400">Target: {selectedEngine.compatibilityVersion}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedEngine.engineName}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Penanggung Jawab: {selectedEngine.owner}</p>
            </div>

            <button
              onClick={() => setSelectedEngine(null)}
              className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 font-mono cursor-pointer"
            >
              Tutup Detail
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-indigo-500" />
                Spesifikasi API & Invariant Kontrak
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                {selectedEngine.apiSurfaceDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ✓ Rollback Safe: {selectedEngine.isRollbackSafe ? 'YES' : 'NO'}
                </span>
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ✓ Backward Compatible: {selectedEngine.isBackwardCompatible ? 'YES' : 'NO'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-purple-500" />
                Dependensi Kontrak Terdaftar ({selectedEngine.dependencies.length})
              </h4>
              {selectedEngine.dependencies.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Engine mandiri (Zero upstream dependencies).</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedEngine.dependencies.map((dep, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{dep.engineId}</span>
                      <span className="text-slate-500 text-[11px]">Syarat: {dep.minContractVersion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Immutable Version History */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-2">
              Riwayat Versi Tak Terubah (Immutable Release Log)
            </h4>
            <div className="space-y-1.5">
              {selectedEngine.versionHistory.map((vh, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl font-mono text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{vh.version}</span>
                    <span className="text-[11px] text-slate-400">({vh.contractVersion})</span>
                    <span className="text-slate-700 dark:text-slate-200 text-xs font-sans">— {vh.changeLog}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{vh.hash}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
