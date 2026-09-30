import React, { useState } from 'react';
import {
  governmentIntelligenceBoard,
  IntelligenceBrief
} from '../../core/government/GovernmentIntelligenceBoard';
import { LineChart, Sparkles, TrendingUp, CheckCircle, ShieldCheck, DollarSign, Cpu } from 'lucide-react';

export const GovernmentIntelligenceBoardViewer: React.FC = () => {
  const [briefs] = useState<IntelligenceBrief[]>(() => governmentIntelligenceBoard.getBriefs());
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');

  const filteredBriefs = briefs.filter(
    b => selectedPeriod === 'ALL' || b.period === selectedPeriod
  );

  return (
    <div id="r622-government-intelligence-board" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl border border-cyan-500/20">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Government Intelligence Board (AI Asy Insights)
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded border border-cyan-500/20">
                  R622
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Laporan intelijen operasional harian, mingguan, wawasan strategis, dan prediksi tren otomatis untuk Sovereign.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Laporan Intelijen</option>
              <option value="DAILY">Harian (Daily)</option>
              <option value="WEEKLY">Mingguan (Weekly)</option>
              <option value="EXECUTIVE_INSIGHT">Executive Insight</option>
              <option value="TREND_PREDICTION">Trend Prediction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Briefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBriefs.map((b) => (
          <div
            key={b.briefId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {b.briefId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {b.period}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {b.title}
              </h3>

              {/* Highlights */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Temuan Pokok / Highlights:
                </span>
                <ul className="space-y-1.5">
                  {b.keyHighlights.map((hl, hIdx) => (
                    <li key={hIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1 flex-shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400">Efisiensi</span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{b.operationalEfficiencyPercent}%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400">Arus Finansial</span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {b.financialThroughputIdr > 0 ? `Rp ${(b.financialThroughputIdr / 1000000).toFixed(1)}M` : '-'}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400">Skor Integritas</span>
                  <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{b.securityIntegrityScore}/100</div>
                </div>
              </div>
            </div>

            {/* Sovereign Recommendation */}
            <div className="p-3 bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900 rounded-xl mt-4">
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Rekomendasi untuk Sovereign:
              </span>
              <p className="text-xs text-cyan-900 dark:text-cyan-200 font-medium mt-1">
                {b.recommendedSovereignAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
