import React, { useState } from 'react';
import { FutureRadar, FutureRadarItem } from '../../core/intelligence/FutureRadar';
import { Compass, Clock, CheckCircle2, Bookmark, AlertTriangle, Eye, XCircle } from 'lucide-react';

export const FutureRadarViewer: React.FC = () => {
  const radar = FutureRadar.getInstance();
  const [items] = useState<FutureRadarItem[]>(radar.getFutureItems());
  const [summary] = useState(radar.getSummary());

  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-950 border border-purple-500/30 text-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-300 uppercase block">R671 &bull; 6–24 MONTH HORIZON</span>
              <h3 className="text-lg font-bold text-white">Future Radar: Pemantauan Tren Masa Depan</h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-mono font-bold">
            Auto-Implementation: STRICTLY BLOCKED
          </span>
        </div>
        <p className="text-xs text-purple-100/80 leading-relaxed font-mono">
          Radar pengawasan tren teknologi 6–24 bulan ke depan (Multi-Agent, Sovereign AI, Identity, On-Device Speech) untuk evaluasi terencana tanpa mengubah kode produksi sebelum otorisasi resmi.
        </p>
      </div>

      {/* Grid of Future Radar Items */}
      <div className="space-y-4 font-mono text-xs">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                    {item.id} &bull; {item.focusArea}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                    {item.timeHorizon}
                  </span>
                  <span className="text-[10px] text-slate-400">Kematangan: {item.maturity}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.trend}</h4>
              </div>

              <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                item.status === 'CORE CANDIDATE'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : item.status === 'RESERVED'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : item.status === 'EXPERIMENTAL'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : item.status === 'WATCH'
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}>
                STATUS: {item.status}
              </span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <p><strong>Bukti Lapangan:</strong> {item.evidence}</p>
              <p><strong>Relevansi terhadap TADE:</strong> {item.relevanceToTADE}</p>
              <p><strong>Penilaian Dampak:</strong> {item.impactAssessment}</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200">
              <strong>Rekomendasi AI Asy:</strong> {item.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
