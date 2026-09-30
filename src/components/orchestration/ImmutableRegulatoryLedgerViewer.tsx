import React, { useState } from 'react';
import { ImmutableRegulatoryLedger, RegulatoryComplianceBlock } from '../../core/orchestration/ImmutableRegulatoryLedger';
import { FileText, ShieldCheck, Award, Lock, CheckCircle2, Download, Layers } from 'lucide-react';

export const ImmutableRegulatoryLedgerViewer: React.FC = () => {
  const ledger = ImmutableRegulatoryLedger.getInstance();
  const [blocks] = useState<RegulatoryComplianceBlock[]>(ledger.getBlocks());
  const [certificate] = useState(ledger.generateComplianceCertificate());
  const [copiedCert, setCopiedCert] = useState(false);

  const handleCopyCertificate = () => {
    navigator.clipboard.writeText(JSON.stringify(certificate, null, 2));
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Compliance Score */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                R663 &bull; REGULATORY COMPLIANCE 2026
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Enterprise Audit Trail &amp; Immutable Regulatory Ledger
              </h3>
            </div>
          </div>

          <button
            onClick={handleCopyCertificate}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{copiedCert ? 'Tersalin ke Clipboard!' : 'Ekspor Sertifikat Kepatuhan (JSON)'}</span>
          </button>
        </div>

        {/* Certificate Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono">
              <Award className="w-5 h-5 text-amber-500" />
              <strong className="text-slate-900 dark:text-white text-sm">
                Sertifikat Kepatuhan Digital &bull; {certificate.certificateId}
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500 text-slate-950">
              SKOR INTEGRITAS {certificate.integrityScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-600 dark:text-slate-300">
            <div><strong>Lembaga:</strong> {certificate.institutionName} (NPSN: {certificate.npsn})</div>
            <div><strong>Tahun Ajaran:</strong> {certificate.academicYear}</div>
            <div><strong>Merkle Chain:</strong> {certificate.merkleChainLength} Blok Tersegel</div>
          </div>

          <div className="pt-2 border-t border-amber-500/20 text-xs font-mono space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-bold block">Invarian Terverifikasi:</span>
            <div className="flex flex-wrap gap-2">
              {certificate.verifiedInvariants.map((inv, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-amber-500/30 text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                  &bull; {inv}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Merkle Blocks Chain */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Daily Merkle Root Regulatory Ledger Blocks</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">Permendikbud &amp; Kemenag Ready</span>
        </div>

        <div className="space-y-3">
          {blocks.map((b) => (
            <div key={b.blockIndex} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    BLOK #{b.blockIndex}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{b.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {b.regulatoryStandard}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  b.status === 'SEALED'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {b.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Transaksi</div>
                  <strong className="text-slate-900 dark:text-white text-xs">{b.totalTransactions}</strong>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Presensi</div>
                  <strong className="text-slate-900 dark:text-white text-xs">{b.totalAttendanceRecords}</strong>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Nilai Raport</div>
                  <strong className="text-slate-900 dark:text-white text-xs">{b.totalAcademicEntries}</strong>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <div><strong>Merkle Root:</strong> {b.merkleRootHash}</div>
                <div><strong>Prev Hash:</strong> {b.previousBlockHash}</div>
                <div><strong>Sign-off:</strong> {b.auditorSignOff}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
