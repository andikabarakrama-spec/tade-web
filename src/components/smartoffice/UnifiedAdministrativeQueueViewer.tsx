import React, { useState } from 'react';
import { 
  ListOrdered, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  ShieldAlert, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UnifiedAdministrativeQueue, UnifiedQueueItem } from '../../core/smartoffice/UnifiedAdministrativeQueue';
import { TaskPriorityLevel } from '../../core/smartoffice/IntelligentPriorityEngine';
import { useAuth } from '../../context/AuthContext';

export const UnifiedAdministrativeQueueViewer: React.FC<{ onNavigate?: (moduleCode: string) => void }> = ({ onNavigate }) => {
  const { activeRole } = useAuth();
  const queueEngine = UnifiedAdministrativeQueue.getInstance();

  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const allItems = queueEngine.getQueueItems();
  const summary = queueEngine.getQueueSummary();

  const filteredItems = allItems.filter(item => {
    if (filterDomain !== 'ALL' && item.sourceDomain !== filterDomain) return false;
    if (filterPriority !== 'ALL' && item.evaluation.priorityLevel !== filterPriority) return false;
    return true;
  });

  const getPriorityBadgeClass = (p: TaskPriorityLevel) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM': return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'LOW': return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6" id="unified-administrative-queue-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                R712 &amp; R713 &bull; Unified Administrative Queue &amp; Priority
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Orchestration Layer
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Antrean Administratif Terpadu &amp; Mesin Prioritas Cerdas
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Agregasi lintas domain (PPDB, Keuangan, Surat, Pengumuman) dengan kalkulasi skor prioritas komposit. Orkestrasi cerdas tanpa mutasi data otomatis.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Antrean</div>
              <div className="text-lg font-black text-white">{summary.total}</div>
            </div>
            <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-rose-400">Critical</div>
              <div className="text-lg font-black text-rose-400">{summary.critical}</div>
            </div>
            <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400">High</div>
              <div className="text-lg font-black text-amber-400">{summary.high}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1 mr-1" />
          <span className="text-xs font-bold text-slate-300">Domain:</span>
          {['ALL', 'PPDB', 'TABUNGAN', 'SURAT', 'PENGUMUMAN'].map((domain) => (
            <button
              key={domain}
              onClick={() => setFilterDomain(domain)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                filterDomain === domain
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Prioritas:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                filterPriority === p
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemId === item.id;
          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getPriorityBadgeClass(item.evaluation.priorityLevel)}`}>
                      {item.evaluation.priorityLevel} &bull; Skor {item.evaluation.compositeScore}/100
                    </span>
                    <span className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded text-xs font-bold border border-slate-800">
                      {item.sourceDomain}
                    </span>
                    <span className="text-xs text-slate-400">
                      SLA Target: ~{item.evaluation.suggestedSLAHours} Jam
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition flex items-center gap-1.5"
                  >
                    <span>Analisis Prioritas</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {item.directActionLink && (
                    <button
                      onClick={() => onNavigate && onNavigate(item.directActionLink!)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Buka Modul</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Priority Engine Calculation Breakdown (Expanded) */}
              {isExpanded && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-3 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Rasional Mesin Prioritas Cerdas (R713)
                    </span>
                    {item.evaluation.escalationRequired && (
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Eskalasi Pimpinan Direkomendasikan
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {item.evaluation.factors.map((f, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-300">{f.name}</span>
                          <span className="font-black text-emerald-400">{f.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${f.score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{f.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
