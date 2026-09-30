import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, ShieldCheck, AlertCircle, BarChart3 } from 'lucide-react';
import { ContinuityIntelligenceEngine, CapacityForecastMetric } from '../../core/continuity/continuityIntelligenceEngine';

export const CapacityForecastEngineViewer: React.FC = () => {
  const [forecasts, setForecasts] = useState<CapacityForecastMetric[]>([]);

  useEffect(() => {
    const engine = ContinuityIntelligenceEngine.getInstance();
    setForecasts(engine.getCapacityForecasts());
  }, []);

  return (
    <div id="r867-capacity-forecast-engine" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl border border-cyan-100">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-800 rounded">R867</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Predictive Growth</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Capacity Forecast Engine</h2>
              <p className="text-sm text-slate-500">
                Proyeksi kapasitas jangka menengah (santri, penyimpanan arsip portofolio, dan throughput transaksi SSoT).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            Proyeksi Horizon: 6 Bulan ke Depan
          </div>
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="space-y-4">
        {forecasts.map((f) => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{f.id}</span>
                <h3 className="font-semibold text-slate-800 text-base">{f.resourceName}</h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                Headroom: {f.headroomPercentage}% Tersedia
              </span>
            </div>

            {/* Metric Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Penggunaan Saat Ini:</span>
                <strong className="text-slate-800 text-sm">{f.currentUsage}</strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Proyeksi 6 Bulan:</span>
                <strong className="text-indigo-700 text-sm">{f.forecast6Months}</strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Batas Kapasitas Aman:</span>
                <strong className="text-slate-800 text-sm">{f.capacityLimit}</strong>
              </div>
            </div>

            {/* Progress Visual */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Pemanfaatan Kapasitas</span>
                <span className="font-semibold text-slate-700">{100 - f.headroomPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-cyan-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${100 - f.headroomPercentage}%` }}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="text-xs text-slate-600 bg-cyan-50/50 p-3 rounded-lg border border-cyan-100 flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-900 block font-semibold mb-0.5">Analisis &amp; Rekomendasi:</strong>
                {f.recommendation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
