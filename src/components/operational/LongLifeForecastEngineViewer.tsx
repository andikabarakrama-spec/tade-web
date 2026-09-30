import React, { useState } from 'react';
import { TrendingUp, Sparkles, CheckCircle2, Cpu, HardDrive, DollarSign, Calendar, Sliders } from 'lucide-react';
import { longLifeForecastEngine, LongLifeForecastProjection } from '../../core/operational/LongLifeForecastEngine';

export const LongLifeForecastEngineViewer: React.FC = () => {
  const [horizon, setHorizon] = useState<1 | 5 | 10>(5);
  const [customStudents, setCustomStudents] = useState<number>(300);

  const projection = longLifeForecastEngine.getForecast(horizon);
  const capacitySim = longLifeForecastEngine.calculateSimulatedCapacity(customStudents);

  return (
    <div id="long-life-forecast-engine-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              R644 &bull; LONG-LIFE FORECAST
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              AI ASY COGNITIVE PLANNER
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            AI Asy Long-Life Forecast Engine &amp; Capacity Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive modeling for 1-year, 5-year, and 10-year operational sustainability, storage growth, and quota runway.
          </p>
        </div>

        {/* Horizon Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-700 font-mono text-xs">
          {[1, 5, 10].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h as 1 | 5 | 10)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                horizon === h
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {h}-Year Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Projection Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-400 block">PROJECTED ENROLMENT</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {projection.projectedStudents} Students
          </span>
          <span className="text-[10px] text-slate-500 block">Organic Campus Growth</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-400 block">VFS / DB STORAGE</span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {projection.projectedStorageMB > 1024 ? `${(projection.projectedStorageMB / 1024).toFixed(1)} GB` : `${projection.projectedStorageMB} MB`}
          </span>
          <span className="text-[10px] text-cyan-500 block">IndexedDB + WAL Compaction</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-400 block">MONTHLY FIRESTORE COST</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${projection.firestoreMonthlyCostUSD} / mo
          </span>
          <span className="text-[10px] text-emerald-500 block">95% Local Caching Ratio</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-400 block">PROJECTED HEALTH SCORE</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {projection.projectedHealthScore}%
          </span>
          <span className="text-[10px] text-purple-500 block">Zero Performance Drift</span>
        </div>
      </div>

      {/* AI Asy Strategic Advisory Notes */}
      <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 shadow-sm space-y-4 font-mono">
        <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Asy Cognitive Planning Directives ({horizon}-Year Strategy)
        </div>

        <div className="space-y-2">
          {projection.aiAsyAdvisoryNotes.map((note, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Custom Capacity Simulator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-500" />
            Interactive Capacity Stress-Test Simulator
          </h3>
          <span className="text-xs text-slate-500">Live Computational Model</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Simulate Student Body Volume:</span>
            <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">{customStudents} Students</span>
          </div>

          <input
            type="range"
            min="50"
            max="1500"
            step="25"
            value={customStudents}
            onChange={(e) => setCustomStudents(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">ESTIMATED STORAGE</span>
              <strong className="text-sm text-slate-900 dark:text-white">{capacitySim.storageMB} MB</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">DAILY FIRESTORE OPS</span>
              <strong className="text-sm text-slate-900 dark:text-white">{capacitySim.dailyFirestoreOps} reads/writes</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">FEASIBILITY RATING</span>
              <strong className="text-sm text-emerald-600 dark:text-emerald-400">{capacitySim.feasibilityScore}% Optimal</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
