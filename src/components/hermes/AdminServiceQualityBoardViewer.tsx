import React, { useState } from 'react';
import { AdministrativeCompletionMetrics, AdministrativeQualityMetrics } from '../../core/hermes/AdministrativeCompletionMetrics';
import { AdministrativeActivityJournal, AdministrativeJournalEntry } from '../../core/hermes/AdministrativeActivityJournal';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  History, 
  FileText 
} from 'lucide-react';

export const AdminServiceQualityBoardViewer: React.FC = () => {
  const metricsEngine = AdministrativeCompletionMetrics.getInstance();
  const journal = AdministrativeActivityJournal.getInstance();

  const [metrics, setMetrics] = useState<AdministrativeQualityMetrics>(metricsEngine.getMetrics());
  const [entries] = useState<AdministrativeJournalEntry[]>(journal.getJournalEntries());
  const [showConfig, setShowConfig] = useState(false);
  const [thresholdConfig, setThresholdConfig] = useState(metrics.thresholdConfig);

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    metricsEngine.updateThresholds(thresholdConfig);
    setMetrics(metricsEngine.getMetrics());
    setShowConfig(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-mono font-bold text-xl text-indigo-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase block">
                R683 &bull; R685 &bull; R686 SERVICE QUALITY BOARD
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Administrative Completion &amp; Service Quality Board
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-xs font-mono text-indigo-200 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Konfigurasi Threshold</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Metrik penyelesaian tugas nyata, indeks reliabilitas eksekusi, serta log jurnal audit abadi seluruh operasi administratif Hermes.
        </p>
      </div>

      {/* Threshold Config Form */}
      {showConfig && (
        <form onSubmit={handleUpdateConfig} className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <strong className="text-slate-900 dark:text-white">Founder Threshold Configuration:</strong>
            <button type="button" onClick={() => setShowConfig(false)} className="text-slate-400">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-500 block mb-1">Min Completion Rate (%):</label>
              <input
                type="number"
                value={thresholdConfig.minAcceptableCompletionRate}
                onChange={(e) => setThresholdConfig({ ...thresholdConfig, minAcceptableCompletionRate: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Min Reliability Score (%):</label>
              <input
                type="number"
                value={thresholdConfig.minReliabilityScore}
                onChange={(e) => setThresholdConfig({ ...thresholdConfig, minReliabilityScore: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Max Failure Rate (%):</label>
              <input
                type="number"
                value={thresholdConfig.maxAllowableFailureRate}
                onChange={(e) => setThresholdConfig({ ...thresholdConfig, maxAllowableFailureRate: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700">
            Simpan Konfigurasi
          </button>
        </form>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Completion Rate</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.administrativeCompletionRate}%
          </div>
          <span className="text-[10px] text-slate-400">Target &ge; {metrics.thresholdConfig.minAcceptableCompletionRate}%</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Reliability Score</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {metrics.taskReliabilityScore}%
          </div>
          <span className="text-[10px] text-slate-400">Target &ge; {metrics.thresholdConfig.minReliabilityScore}%</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Completed Tasks</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.completedTasks} / {metrics.totalTasks}
          </div>
          <span className="text-[10px] text-slate-400">Avg Latency: {metrics.averageCompletionTimeSeconds}s</span>
        </div>

        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 space-y-1">
          <span className="text-[11px] text-amber-700 dark:text-amber-300">Human Handoffs</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {metrics.manualInterventions}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">{metrics.blockedTasks} Blocked &bull; {metrics.waitingApprovalTasks} Approval</span>
        </div>
      </div>

      {/* Activity Journal (R685) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <strong className="text-sm text-slate-900 dark:text-white">R685: Administrative Activity Journal (Immutable Audit)</strong>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            SHA-256 Verifiable
          </span>
        </div>

        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.entryId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">{entry.entryId} &bull; {entry.taskId}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[9px]">
                    {entry.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{entry.timestamp.replace('T', ' ').slice(0, 19)}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <strong className="text-slate-900 dark:text-white">{entry.action}</strong>
                <span className="text-slate-400">({entry.previousState} &rarr; <strong className={entry.resultingState === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}>{entry.resultingState}</strong>)</span>
              </div>

              {entry.resultSummary && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{entry.resultSummary}</p>
              )}

              {entry.recoveryNote && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">{entry.recoveryNote}</p>
              )}

              <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[9px] text-slate-400 flex items-center justify-between">
                <span>Integritas Hash: {entry.hashVerification}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">SEALED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
