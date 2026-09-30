import React, { useState } from 'react';
import { FreeTechnologyRadar, FreeTechnologyItem } from '../../core/intelligence/FreeTechnologyRadar';
import { DollarSign, ShieldCheck, CheckCircle2, XCircle, Search, Eye, Wrench } from 'lucide-react';

export const FreeTechnologyRadarViewer: React.FC = () => {
  const radar = FreeTechnologyRadar.getInstance();
  const [items] = useState<FreeTechnologyItem[]>(radar.getRadarItems());
  const [summary] = useState(radar.getSummary());
  const [filter, setFilter] = useState<'ALL' | 'ADOPT' | 'TEST' | 'WATCH' | 'REJECT'>('ALL');

  const filteredItems = filter === 'ALL' ? items : items.filter(i => i.decision === filter);

  return (
    <div className="space-y-6 font-sans">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1 font-mono">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Evaluasi</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalEvaluated}</div>
          <span className="text-[10px] text-slate-400">Free First Basis</span>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-1 font-mono">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300">Adopted</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{summary.adopted}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">100% Free Core</span>
        </div>

        <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 space-y-1 font-mono">
          <span className="text-[11px] text-blue-700 dark:text-blue-300">Testing Lab</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{summary.testing}</div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400">Sandbox Trial</span>
        </div>

        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 space-y-1 font-mono">
          <span className="text-[11px] text-amber-700 dark:text-amber-300">Watching</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{summary.watching}</div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">Maturity Horizon</span>
        </div>

        <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 space-y-1 font-mono">
          <span className="text-[11px] text-rose-700 dark:text-rose-300">Rejected</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{summary.rejected}</div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400">Vendor Lock-in</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ADOPT', 'TEST', 'WATCH', 'REJECT'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-2xl font-mono text-xs transition-all ${
              filter === tab
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {tab === 'ALL' ? 'Semua Teknologi' : tab}
          </button>
        ))}
      </div>

      {/* Technology List Grid */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
            {/* Title & Decision Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.id} &bull; {item.category} &bull; {item.license}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.name}</h4>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                item.decision === 'ADOPT'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : item.decision === 'TEST'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : item.decision === 'WATCH'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}>
                {item.decision === 'ADOPT' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {item.decision === 'TEST' && <Wrench className="w-3.5 h-3.5" />}
                {item.decision === 'WATCH' && <Eye className="w-3.5 h-3.5" />}
                {item.decision === 'REJECT' && <XCircle className="w-3.5 h-3.5" />}
                <span>DECISION: {item.decision}</span>
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {item.description}
            </p>

            {/* Cost Breakdown Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">7-Dimension Cost Breakdown:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div><span className="text-slate-400">Software:</span> <strong className="text-slate-800 dark:text-slate-200 block">{item.costs.softwareCost}</strong></div>
                <div><span className="text-slate-400">Model:</span> <strong className="text-slate-800 dark:text-slate-200 block">{item.costs.modelCost}</strong></div>
                <div><span className="text-slate-400">API Calls:</span> <strong className="text-slate-800 dark:text-slate-200 block">{item.costs.apiCost}</strong></div>
                <div><span className="text-slate-400">Hosting:</span> <strong className="text-slate-800 dark:text-slate-200 block">{item.costs.hostingCost}</strong></div>
                <div><span className="text-slate-400">Storage:</span> <strong className="text-slate-800 dark:text-slate-200 block">{item.costs.storageCost}</strong></div>
                <div><span className="text-slate-400">Maintenance:</span> <strong className="text-slate-800 dark:text-slate-200 block">{item.costs.maintenanceCost}</strong></div>
                <div><span className="text-slate-400">Operational TCO:</span> <strong className="text-emerald-600 dark:text-emerald-400 block">{item.costs.operationalCost}</strong></div>
                <div><span className="text-slate-400">Aggregate Score:</span> <strong className="text-indigo-600 dark:text-indigo-400 block">{item.scoring.aggregateScore} / 100</strong></div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-[11px] text-indigo-900 dark:text-indigo-200">
              <strong>Alasan Keputusan:</strong> {item.decisionRationale}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
