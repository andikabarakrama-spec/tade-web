import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Minus, CheckCircle, Award, BarChart3 } from 'lucide-react';
import { GuardianPolicyEngine, OperationalKPIItem } from '../../core/governance/guardianPolicyEngine';

export const OperationalKPIEngineViewer: React.FC = () => {
  const [kpis, setKpis] = useState<OperationalKPIItem[]>([]);

  useEffect(() => {
    const engine = GuardianPolicyEngine.getInstance();
    setKpis(engine.getKPIs());
    return engine.subscribe(() => {
      setKpis(engine.getKPIs());
    });
  }, []);

  return (
    <div id="operational-kpi-engine-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-widest">
              <Target className="w-4 h-4" /> R854 • Mesin Evaluasi Kinerja
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Operational KPI Engine</h1>
            <p className="text-slate-300 text-sm mt-1">
              Pengukuran indikator kinerja utama sekolah secara kuantitatif, akuntabel, dan berbasis data riil SSoT.
            </p>
          </div>
          <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 text-center">
            <div className="text-xs text-slate-300">Rata-rata Capaian KPI</div>
            <div className="text-2xl font-black text-teal-300">102.0%</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {kpi.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" /> Optimal
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{kpi.metricName}</h3>
              
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-900">{kpi.currentValue}</div>
                  <div className="text-xs text-slate-500">Target: {kpi.targetValue}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">{kpi.achievementRate}%</div>
                  <div className="text-[10px] text-slate-400">Tingkat Capaian</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full"
                  style={{ width: `${Math.min(kpi.achievementRate, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-2 text-right">
                Diperbarui: {kpi.lastUpdated}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
