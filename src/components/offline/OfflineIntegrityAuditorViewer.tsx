import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Lock
} from 'lucide-react';
import { offlineIntegrityAuditor } from '../../core/offline/offlineIntegrityAuditor';
import { OfflineAuditReport } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const OfflineIntegrityAuditorViewer: React.FC<Props> = ({ onNavigate }) => {
  const [report, setReport] = useState<OfflineAuditReport>(offlineIntegrityAuditor.runAudit());
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunAudit = () => {
    setLoading(true);
    setTimeout(() => {
      setReport(offlineIntegrityAuditor.runAudit());
      setLoading(false);
    }, 300);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R739 &bull; OFFLINE INTEGRITY AUDITOR
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              REPORT-ONLY &bull; NON-MUTATING
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Auditor Integritas &amp; Keutuhan Kontinuitas Offline
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit menyeluruh konsistensi cache snapshot, determinisme replay, keunikan fingerprint, dan jaminan anti-duplikasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Mengaudit...' : 'Jalankan Ulang Audit'}
          </button>
        </div>
      </div>

      {/* Overall Score Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">OVERALL AUDIT SCORE</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {report.overallScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {report.passCount} / {report.totalAudited} parameter lolos
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">CACHE CONSISTENCY</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {report.cacheConsistencyScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">TTL &amp; Checksum valid</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">FINGERPRINT INTEGRITY</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {report.fingerprintIntegrityScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero collision detected</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-500">REPLAY CONSISTENCY</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {report.replayConsistencyScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Idempotency certified</div>
        </div>
      </div>

      {/* Audit Items List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono">
            DETAIL TEMUAN AUDIT KONTINUITAS ({report.items.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Terakhir diaudit: {new Date(report.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="space-y-3">
          {report.items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.passed
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
                  : 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {item.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {item.description}
                    </p>
                    {item.remediation && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-900/30 text-[11px] text-amber-800 dark:text-amber-300 font-mono">
                        <strong>Rekomendasi: </strong>
                        {item.remediation}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${getSeverityBadge(item.severity)}`}>
                  {item.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
