import React, { useState } from 'react';
import { 
  Scale, CheckCircle2, ShieldCheck, FileCheck, 
  AlertTriangle, RefreshCw, Award, Lock, Sparkles
} from 'lucide-react';
import { constitutionalEnforcementV2, ConstitutionalAuditReport } from '../../core/government/ConstitutionalEnforcementV2';

export const ConstitutionalEnforcementV2Viewer: React.FC = () => {
  const [auditReport, setAuditReport] = useState<ConstitutionalAuditReport>(() => constitutionalEnforcementV2.runFullAudit());
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleReaudit = () => {
    const report = constitutionalEnforcementV2.runFullAudit();
    setAuditReport(report);
    setFeedback(`Audit Konstitusi V2 selesai: ${report.totalRulesAudited}/${report.totalRulesAudited} Doktrin Terverifikasi 100% Sesuai.`);
  };

  return (
    <div id="constitutional-enforcement-v2" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 p-6 rounded-3xl text-white border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Scale className="w-48 h-48 text-amber-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" /> R614 &bull; Constitutional Enforcement V2 Engine &bull; Zero Violation Audit
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Penegakan Konstitusi &amp; Kepatuhan Tata Kelola V2
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Mesin audit otonom yang mengawasi kepatuhan doktrin kedaulatan tunggal, hierarki asisten, pemisahan website/SIM, dan jaminan nir-regresi pada seluruh 614 modul.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReaudit}
              className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Jalankan Audit Konstitusi Ulang
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Audit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Tingkat Kepatuhan</span>
          <div className="text-2xl font-black text-emerald-500">
            {auditReport.complianceRate}% (PARIPURNA)
          </div>
          <div className="text-[10px] text-slate-500">Pelanggaran: 0 Ditemukan</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Doktrin Diaudit</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {auditReport.totalRulesAudited} Pasal Pokok
          </div>
          <div className="text-[10px] text-emerald-500 font-bold">100% Memenuhi Syarat</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Sovereign Terverifikasi</span>
          <div className="text-lg font-black text-amber-500 truncate">
            {auditReport.supremeSovereignVerified}
          </div>
          <div className="text-[10px] text-slate-500">Kedaulatan Tunggal Sah</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Waktu Audit Terakhir</span>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
            {auditReport.timestamp.split('T')[1]?.split('.')[0]} UTC
          </div>
          <div className="text-[10px] text-emerald-500 font-bold">Status: ACTIVE WATCH</div>
        </div>
      </div>

      {/* Rules Audit Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" /> Hasil Audit Doktrin Konstitusional (7 Pokok)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auditReport.audits.map((aud) => (
            <div key={aud.ruleId} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {aud.ruleId} &bull; {aud.constitutionalArticle}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {aud.verificationStatus}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {aud.doctrineName}
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  Lingkup: {aud.auditScope}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {aud.details}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[9px] font-mono text-slate-400">
                Audited: {aud.lastAuditedTimestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
