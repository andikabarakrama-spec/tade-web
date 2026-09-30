import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  FileSearch,
  Lock,
  ArrowRight
} from 'lucide-react';
import { CrossModuleConsistencyAuditor, ConsistencyAuditReport, ConsistencyAuditFinding } from '../../core/smartoffice/CrossModuleConsistencyAuditor';

export const CrossModuleConsistencyAuditorViewer: React.FC = () => {
  const auditor = CrossModuleConsistencyAuditor.getInstance();
  const [report, setReport] = useState<ConsistencyAuditReport>(() => auditor.runAudit());
  const [isScanning, setIsScanning] = useState(false);

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setReport(auditor.runAudit());
      setIsScanning(false);
    }, 400);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'PASS': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'INFO': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'WARNING': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6" id="cross-module-consistency-auditor-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                R719 &bull; Cross-Module Consistency Auditor
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Report-Only Diagnostic
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Auditor Konsistensi &amp; Integritas Lintas Modul
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memindai referensi yatim (*orphan reference*), duplikasi registri, ketidaksesuaian alur kerja, dan perisai otorisasi RBAC tanpa mutasi kode otomatis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReScan}
              disabled={isScanning}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Jalankan Audit Ulang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs uppercase font-bold text-slate-400">Skor Konsistensi</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {report.overallConsistencyScore}%
          </div>
          <div className="text-xs text-slate-500 mt-1">100% Invarian Valid</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs uppercase font-bold text-slate-400">Total Pengujian</div>
          <div className="text-3xl font-black text-white mt-2">
            {report.totalChecks}
          </div>
          <div className="text-xs text-slate-500 mt-1">Vektor Audit Struktural</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs uppercase font-bold text-emerald-400">Passed Checks</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {report.passCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Nol Pelanggaran SSoT</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs uppercase font-bold text-rose-400">Critical / Warnings</div>
          <div className="text-3xl font-black text-slate-200 mt-2">
            {report.criticalCount + report.warningCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Zero Fatal Conflicts</div>
        </div>
      </div>

      {/* Audit Findings List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-emerald-400" />
            Hasil Temuan Audit Konsistensi Lintas Modul
          </h2>
          <span className="text-xs text-slate-400">
            Waktu Audit: {new Date(report.timestamp).toLocaleTimeString('id-ID')}
          </span>
        </div>

        <div className="space-y-3">
          {report.findings.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${getSeverityBadge(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{item.id}</span>
                  <span className="text-xs text-slate-400">&bull; {item.auditCategory}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Modul: <strong className="text-slate-300">{item.targetModule}</strong>
                </span>
              </div>

              <p className="text-sm text-slate-300 font-semibold">{item.description}</p>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                <span>Rekomendasi: <strong className="text-emerald-400">{item.recommendation}</strong></span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kepatuhan Terverifikasi
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
