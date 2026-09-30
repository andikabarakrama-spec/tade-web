import React, { useState, useEffect } from 'react';
import { Award, FileCheck, CheckCircle2, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { GuardianPolicyEngine, ComplianceReadinessItem } from '../../core/governance/guardianPolicyEngine';

export const ComplianceReadinessCenterViewer: React.FC = () => {
  const [standards, setStandards] = useState<ComplianceReadinessItem[]>([]);

  useEffect(() => {
    const engine = GuardianPolicyEngine.getInstance();
    setStandards(engine.getComplianceStandards());
    return engine.subscribe(() => {
      setStandards(engine.getComplianceStandards());
    });
  }, []);

  return (
    <div id="compliance-readiness-center-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-widest">
              <Award className="w-4 h-4" /> R857 • Kesiapan Kepatuhan Regulasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Compliance Readiness Center</h1>
            <p className="text-slate-300 text-sm mt-1">
              Audit kesiapan kepatuhan akreditasi BAN-PAUD Standar 1-8, UU Perlindungan Data Pribadi (PDP), dan standar transparansi yayasan.
            </p>
          </div>
          <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 text-center">
            <div className="text-xs text-slate-300">Skor Kesiapan Audit Nasional</div>
            <div className="text-2xl font-black text-indigo-300">99.2%</div>
          </div>
        </div>
      </div>

      {/* Compliance Standards List */}
      <div className="space-y-4">
        {standards.map((std) => (
          <div
            key={std.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {std.id}
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {std.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{std.standardName}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{std.evaluatorNotes}</p>
              <div className="text-[11px] text-slate-400">
                Terverifikasi: {std.auditedEvidenceCount} Dokumen Bukti Fisik & Digital • Audit Terakhir: {std.lastAuditDate}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[200px] justify-center sm:justify-end">
              <div className="text-center sm:text-right">
                <div className="text-xs font-semibold text-slate-500">Skor Kepatuhan</div>
                <div className="text-2xl font-black text-emerald-600">{std.readinessScore}%</div>
              </div>
              <button
                onClick={() => alert(`Daftar 8 Standar & Portofolio Bukti ${std.standardName} berhasil diunduh!`)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Dokumen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
