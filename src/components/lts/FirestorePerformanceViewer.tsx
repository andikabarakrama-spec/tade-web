import React, { useState } from 'react';
import { 
  Database, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  FileText, 
  Copy,
  Search
} from 'lucide-react';
import { 
  firestorePerformanceOptimizer, 
  FirestorePerformanceReport 
} from '../../core/lts/FirestorePerformanceOptimizer';

export const FirestorePerformanceViewer: React.FC = () => {
  const [report, setReport] = useState<FirestorePerformanceReport>(() => firestorePerformanceOptimizer.getReport());
  const [copied, setCopied] = useState(false);

  const handleRefreshAudit = () => {
    const fresh = firestorePerformanceOptimizer.runAudit();
    setReport({ ...fresh });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(firestorePerformanceOptimizer.generateReportJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="firestore-performance-optimizer-panel" className="space-y-6">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-firestore-health" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Indeks Kesehatan Query</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.healthScore}%</p>
          <span className="text-xs text-emerald-400 font-medium">Optimal Execution Rating</span>
        </div>

        <div id="metric-firestore-queries" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Query Diaudit</span>
            <Search className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.totalQueriesAudited} Patterns</p>
          <span className="text-xs text-cyan-400 font-medium">{report.optimalQueriesCount} Optimal / {report.heavyQueriesCount} Advised</span>
        </div>

        <div id="metric-firestore-reads-saved" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Redundant Reads Saved</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.redundantReadsSaved.toLocaleString()}</p>
          <span className="text-xs text-indigo-400 font-medium">LRU Cache & Memory Buffer</span>
        </div>

        <div id="metric-firestore-reduction" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Proyeksi Penurunan Read</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.projectedMonthlyReadReductionPct}%</p>
          <span className="text-xs text-amber-400 font-medium">Efisiensi Biaya & Beban Server</span>
        </div>
      </div>

      {/* Query Pattern Audit Grid */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-slate-100">Firestore Query Audit & Latency Profile (R657)</h3>
              <p className="text-xs text-slate-400">Non-destructive evaluation of all database access paths.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAudit}
              id="btn-refresh-firestore-audit"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Jalankan Ulang Audit
            </button>
            <button
              onClick={handleCopyJson}
              id="btn-export-firestore-report"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin' : 'Ekspor JSON'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-2.5 px-3">Query ID & Collection</th>
                <th className="py-2.5 px-3">Pattern Syntax</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Rekomendasi Optimasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {report.queries.map((q) => (
                <tr key={q.queryId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono text-slate-200 font-semibold">{q.queryId}</div>
                    <div className="text-[10px] font-mono text-emerald-400">/{q.collection}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300 max-w-xs truncate">{q.queryPattern}</td>
                  <td className="py-3 px-3 font-mono text-slate-200">{q.avgExecutionMs} ms</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${q.status === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs">{q.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Composite Index Recommendations */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-slate-100">Rekomendasi Composite Indexing Firestore</h3>
            <p className="text-xs text-slate-400">Indeks komposit resmi untuk mempercepat query skala besar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.indexRecommendations.map((idx) => (
            <div key={idx.indexId} className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-300">{idx.indexId}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  +{idx.estimatedQuerySpeedupPct}% Kecepatan
                </span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                Collection: <span className="text-amber-400">{idx.collectionGroup}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-400">
                Fields: {idx.fields.map(f => `${f.fieldPath} (${f.order})`).join(' + ')}
              </div>
              <p className="text-xs text-slate-400">{idx.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
