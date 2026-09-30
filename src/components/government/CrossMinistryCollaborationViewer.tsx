import React, { useState } from 'react';
import { crossMinistryCollaboration, CrossMinistryTransaction } from '../../core/government/CrossMinistryCollaborationEngine';
import { GitMerge, ArrowRight, CheckCircle2, Clock, Play, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const CrossMinistryCollaborationViewer: React.FC = () => {
  const [transactions, setTransactions] = useState<CrossMinistryTransaction[]>(() =>
    crossMinistryCollaboration.getTransactions()
  );

  const handleAdvance = (txId: string) => {
    crossMinistryCollaboration.advancePipelineStep(txId);
    setTransactions([...crossMinistryCollaboration.getTransactions()]);
  };

  return (
    <div id="r617-cross-ministry-collaboration" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <GitMerge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Cross-Ministry Collaboration Engine
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-500/20">
                  R617
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Alur kerja otonom antar-kementerian tanpa redundansi (Single-Source Payload Pipeline).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            Zero Double Input Guaranteed
          </div>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Pipeline Lintas Sektor</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{transactions.length} Alur Aktif</div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400">Atomic Orchestration</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Integritas Hash Transaksi</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">100% Valid</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">SHA-256 Tamper-Proof</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rata-rata Waktu Proses</span>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">&lt; 1.5 Detik</div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tanpa Verifikasi Manual Berulang</span>
          </div>
        </div>
      </div>

      {/* Pipeline List */}
      <div className="space-y-6">
        {transactions.map((tx) => (
          <div
            key={tx.transactionId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold">
                    {tx.transactionId}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Kategori: {tx.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {tx.title}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Shared Hash: {tx.sharedPayloadHash}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    tx.overallStatus === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                  }`}
                >
                  {tx.overallStatus === 'COMPLETED' ? 'SELESAI (COMPLETED)' : 'SEDANG BERJALAN'}
                </span>

                {tx.overallStatus !== 'COMPLETED' && (
                  <button
                    onClick={() => handleAdvance(tx.transactionId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Lanjutkan Langkah Berikutnya
                  </button>
                )}
              </div>
            </div>

            {/* Steps Visual Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {tx.steps.map((step, idx) => (
                <div
                  key={step.stepOrder}
                  className={`p-4 rounded-xl border relative transition-all ${
                    step.status === 'COMPLETED'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-slate-500">Step 0{step.stepOrder}</span>
                    {step.status === 'COMPLETED' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sukses
                      </span>
                    )}
                    {step.status === 'IN_PROGRESS' && (
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> Memproses...
                      </span>
                    )}
                    {step.status === 'PENDING' && (
                      <span className="text-slate-400 font-medium">Antrean</span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {step.ministryName}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    {step.executorName}
                  </p>

                  <div className="mt-3 p-2 bg-white dark:bg-slate-900 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    {step.actionTaken}
                  </div>

                  <div className="mt-2 space-y-1">
                    {step.outputDataKeys.map((key, kIdx) => (
                      <div
                        key={kIdx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate"
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
