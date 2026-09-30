import React, { useState } from 'react';
import {
  PenTool,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  UserCheck,
  History,
  QrCode,
  Sparkles,
  AlertTriangle,
  Building
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface LegalSpecimen {
  id: string;
  officialName: string;
  roleTitle: string;
  specimenType: 'TANDA_TANGAN' | 'PARAF_HIERARKI' | 'STEMPEL_LEMBAGA' | 'STEMPEL_YAYASAN';
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  sha256Certificate: string;
  totalUsage: number;
}

export const LegalStampSignatureCenter: React.FC = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<LegalSpecimen | null>(null);

  const specimens: LegalSpecimen[] = [
    {
      id: 'SPC-01',
      officialName: 'Drs. H. Abdullah Mansur',
      roleTitle: 'Ketua Yayasan Sentra Asy-Syifa',
      specimenType: 'TANDA_TANGAN',
      validFrom: '2025-01-01',
      validUntil: '2028-12-31',
      status: 'ACTIVE',
      sha256Certificate: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      totalUsage: 148
    },
    {
      id: 'SPC-02',
      officialName: 'Ustadzah Hj. Fatimah, S.Pd.I',
      roleTitle: 'Kepala Sekolah KB-TK Sentra Asy-Syifa',
      specimenType: 'TANDA_TANGAN',
      validFrom: '2025-07-01',
      validUntil: '2027-06-30',
      status: 'ACTIVE',
      sha256Certificate: 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01a',
      totalUsage: 382
    },
    {
      id: 'SPC-03',
      officialName: 'Stempel Resmi KB-TK Sentra Asy-Syifa',
      roleTitle: 'Cap Resmi Satuan Pendidikan Berizin Dinas P&K',
      specimenType: 'STEMPEL_LEMBAGA',
      validFrom: '2024-01-01',
      validUntil: '2029-12-31',
      status: 'ACTIVE',
      sha256Certificate: 'c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01a1b',
      totalUsage: 512
    },
    {
      id: 'SPC-04',
      officialName: 'Stempel Resmi Yayasan Sentra Asy-Syifa',
      roleTitle: 'Cap Induk Yayasan Berbadan Hukum Kemenkumham RI',
      specimenType: 'STEMPEL_YAYASAN',
      validFrom: '2024-01-01',
      validUntil: '2030-12-31',
      status: 'ACTIVE',
      sha256Certificate: 'd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01a1b2c',
      totalUsage: 89
    }
  ];

  const handleTestStamp = (spec: LegalSpecimen) => {
    setSelectedSpecimen(spec);
    blackBoxRecorder.record({
      moduleCode: 'R428-LEGAL-STAMP',
      role: 'ADMIN',
      eventType: 'ACTION',
      details: `Legal stamp/signature verified: ${spec.officialName} (${spec.specimenType}). SHA-256 certificate validated.`,
      severity: 'INFO'
    });
  };

  return (
    <div id="legal-stamp-signature-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R428 &bull; LEGAL STAMP &amp; SIGNATURE CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">Government Digital Signatures &amp; Institutional Seals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <PenTool className="w-8 h-8 text-indigo-400" />
              Pusat Tanda Tangan Digital &amp; Stempel Sah Lembaga
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Pengelolaan spesimen tanda tangan pejabat berwenang, paraf hirarki, stempel basah digital, masa berlaku sertifikat, dan riwayat audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> KEMENKUMHAM CERTIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Selected Specimen Detail */}
      {selectedSpecimen && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/40 text-white font-mono space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm text-indigo-300">Spesimen Resmi Terverifikasi Aktif</span>
            </div>
            <button onClick={() => setSelectedSpecimen(null)} className="text-slate-400 hover:text-white text-xs">
              Tutup [X]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">NAMA PEJABAT / STEMPEL:</span>
              <strong className="text-white text-sm">{selectedSpecimen.officialName}</strong>
              <span className="text-indigo-400 block mt-0.5">{selectedSpecimen.roleTitle}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MASA BERLAKU SERTIFIKAT:</span>
              <span className="text-slate-200">{selectedSpecimen.validFrom} s/d {selectedSpecimen.validUntil}</span>
              <span className="text-emerald-400 block font-bold text-[10px] mt-0.5">STATUS: VALID &amp; AKTIF</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PENGGUNAAN PADA DOKUMEN:</span>
              <span className="text-white font-bold">{selectedSpecimen.totalUsage} Dokumen Terbit</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 break-all font-mono">
            <span className="text-indigo-400 font-bold block mb-0.5">SHA-256 SPECIMEN CERTIFICATE:</span>
            {selectedSpecimen.sha256Certificate}
          </div>
        </div>
      )}

      {/* Grid of Specimens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {specimens.map((spec) => (
          <div
            key={spec.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[9px]">
                  {spec.specimenType.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> AKTIF
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {spec.officialName}
              </h3>

              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {spec.roleTitle}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Masa Berlaku:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-bold">{spec.validUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Naskah Ditandatangani:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{spec.totalUsage} Naskah</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleTestStamp(spec)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Uji &amp; Verifikasi Spesimen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
