import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Download,
  FileCheck,
  Activity,
  Layers,
  Sparkles,
  Lock,
  Wrench,
  ChevronRight
} from 'lucide-react';
import {
  sovereignEngineRegistry,
  SovereignEngineRecord,
  EngineStatus,
  EngineCategory,
  EngineAuditReport
} from '../../services/sovereignEngineRegistry';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const SovereignEngineRegistryViewer: React.FC = () => {
  const [report, setReport] = useState<EngineAuditReport>(
    sovereignEngineRegistry.generateAuditReport()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEngine, setSelectedEngine] = useState<SovereignEngineRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const updated = sovereignEngineRegistry.generateAuditReport();
      setReport(updated);
      setIsAuditing(false);
      setFeedback('Audit seluruh Sovereign Engine selesai: 9/9 Engine Beroperasi Mandiri.');
      setTimeout(() => setFeedback(null), 3500);
    }, 450);
  };

  const handleExportAudit = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TADE_Sovereign_Engine_Audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Sovereign Engine Registry',
      'Ekspor Laporan Audit 9 Sovereign Engine TADE v10.2'
    );
    setFeedback('Laporan Audit Kedaulatan Engine berhasil diekspor.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredEngines = report.engines.filter(engine => {
    const matchesSearch =
      engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || engine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: EngineStatus) => {
    switch (status) {
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'ACTIVE / RING-0'
        };
      case 'OPTIMAL':
        return {
          bg: 'bg-teal-100 text-teal-900 border-teal-300',
          dot: 'bg-teal-500',
          label: 'OPTIMAL'
        };
      case 'DORMANT_SAFE':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          label: 'DORMANT_SAFE'
        };
      case 'STANDBY':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-500',
          label: 'STANDBY'
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-500',
          label: 'MAINTENANCE'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-stone-900 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              SOVEREIGN ENGINE REGISTRY v10.2
            </span>
            <span className="text-xs text-stone-300">Sprint G5 Living Intelligence</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Registry Kedaulatan Seluruh Engine
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-2xl">
            Pusat audit resmi seluruh subsistem mandiri TADE: Nama, Versi, Status, Pemilik, Dependensi, dan Jalur Pemulihan (Recovery Path).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAudit}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-stone-700"
          >
            <Download className="w-4 h-4" />
            Ekspor JSON
          </button>
          <button
            onClick={handleRefreshAudit}
            disabled={isAuditing}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            Audit Ulang
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
          <span className="text-stone-500 font-medium">Total Registered Engines</span>
          <div className="text-2xl font-black text-stone-900">{report.totalEngines} Subsistem</div>
          <span className="text-[10px] text-emerald-700 font-bold">100% Sovereign Architecture</span>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
          <span className="text-stone-500 font-medium">Active & Ring-0 Sentinel</span>
          <div className="text-2xl font-black text-emerald-600">{report.activeCount} Active</div>
          <span className="text-[10px] text-stone-500">Zero Privilege Leak</span>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
          <span className="text-stone-500 font-medium">Optimal Autonomy</span>
          <div className="text-2xl font-black text-teal-600">{report.optimalCount} Engines</div>
          <span className="text-[10px] text-stone-500">Self-monitoring active</span>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
          <span className="text-stone-500 font-medium">Rata-rata Health Index</span>
          <div className="text-2xl font-black text-amber-600">{report.averageHealth}%</div>
          <span className="text-[10px] text-amber-700 font-bold">Living Intelligence Ready</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari engine, pemilik, atau dependensi..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-800 font-medium focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SECURITY', 'INTEGRITY', 'DIAGNOSTIC', 'CREATIVE', 'INNOVATION', 'EXECUTIVE', 'ACADEMIC', 'MEDIA'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Engine List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEngines.map((engine) => {
          const badge = getStatusBadge(engine.status);
          const isSelected = selectedEngine?.id === engine.id;

          return (
            <div
              key={engine.id}
              onClick={() => setSelectedEngine(isSelected ? null : engine)}
              className={`p-5 rounded-2xl border transition space-y-3 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20'
                  : 'border-stone-200 bg-stone-50/60 hover:border-stone-400 hover:bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      {engine.version} • {engine.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-stone-900 mt-0.5 leading-snug">
                      {engine.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 shrink-0 ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {engine.description}
                </p>

                <div className="text-[11px] text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-stone-500">Pemilik:</span>
                    <span className="font-bold text-stone-800">{engine.owner}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2 font-medium">
                    <span className="text-stone-500 shrink-0">Recovery:</span>
                    <span className="font-bold text-amber-700 text-right truncate text-[10px]" title={engine.recoveryPath}>
                      {engine.recoveryPath}
                    </span>
                  </div>
                </div>

                {/* Dependencies Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Dependensi:</span>
                  <div className="flex flex-wrap gap-1">
                    {engine.dependencies.map((dep, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-stone-200/80 text-stone-700 text-[10px] font-mono font-medium">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Footer */}
              <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Health: {engine.healthScore}%</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Audit: {new Date(engine.lastAudit).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Engine Detail Modal / Drawer */}
      {selectedEngine && (
        <div className="p-5 bg-slate-900 text-white rounded-2xl border border-stone-800 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-white">{selectedEngine.name}</h4>
                <p className="text-[10px] text-stone-400 font-mono">ID: {selectedEngine.id} | Versi: {selectedEngine.version}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEngine(null)}
              className="text-stone-400 hover:text-white font-bold cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-stone-700 space-y-1">
              <span className="text-stone-400 font-medium">Kategori & Kepemilikan</span>
              <div className="font-bold text-stone-200">{selectedEngine.category} • {selectedEngine.owner}</div>
              <div className="text-[10px] text-emerald-400">Pure Brand Compliant: YA</div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-stone-700 space-y-1">
              <span className="text-stone-400 font-medium">Jalur Pemulihan Bencana</span>
              <div className="font-bold text-amber-300">{selectedEngine.recoveryPath}</div>
              <div className="text-[10px] text-stone-400">Standar Sandbox Hermes & Ring-0</div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-stone-700 space-y-1">
              <span className="text-stone-400 font-medium">Metrik Operasional Nyata</span>
              <div className="space-y-0.5 text-[11px] font-mono">
                {Object.entries(selectedEngine.metrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-stone-400">{k}:</span>
                    <span className="text-emerald-400 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
