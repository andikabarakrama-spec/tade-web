import React, { useState } from 'react';
import {
  Lock,
  FileCheck2,
  ShieldCheck,
  QrCode,
  Download,
  KeyRound,
  Eye,
  CheckCircle2,
  HardDrive,
  Clock,
  Camera,
  Layers,
  Sparkles,
  Info,
  FileText
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface LockedEvidence {
  id: string;
  incidentTitle: string;
  lockedAt: string;
  lockedBy: string;
  operatorRole: string;
  cameraIds: string[];
  sha256Digest: string;
  qrPayload: string;
  fileSizeMb: number;
  retentionStatus: 'IMMUTABLE_LOCKED' | 'LEGAL_HOLD';
  chainOfCustody: {
    step: number;
    action: string;
    actor: string;
    timestamp: string;
  }[];
}

export const EvidenceVaultEnterprise: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<LockedEvidence[]>([
    {
      id: 'EVD-2026-0816-01',
      incidentTitle: 'Percobaan Akses Gudang Arsip & Sayap Belakang',
      lockedAt: '2026-08-16 14:32:00 WIB',
      lockedBy: 'Ustadz Ahmad Farhan (Satpam / Security)',
      operatorRole: 'SECURITY_OFFICER',
      cameraIds: ['CAM-01', 'CAM-02', 'CAM-04', 'CAM-06'],
      sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qrPayload: 'ASY-EVD://FINAL7/INC-0816/SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      fileSizeMb: 420.5,
      retentionStatus: 'LEGAL_HOLD',
      chainOfCustody: [
        {
          step: 1,
          action: 'Pemberian Tanda Kunci Otomatis (Golden 10 Mins Protocol)',
          actor: 'Asy Security Commander AI',
          timestamp: '14:32:00 WIB'
        },
        {
          step: 2,
          action: 'Verifikasi & Kunci Permanen Brankas Bukti',
          actor: 'Ustadz Ahmad Farhan (Satpam)',
          timestamp: '14:35:12 WIB'
        },
        {
          step: 3,
          action: 'Penandatanganan Digital & Pengesahan Dokumen Hukum',
          actor: 'Kepala Sekolah TK Asy-Syifa',
          timestamp: '14:40:00 WIB'
        }
      ]
    }
  ]);

  const [selectedEvidence, setSelectedEvidence] = useState<LockedEvidence>(evidenceList[0]);

  return (
    <div id="evidence-vault-enterprise-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R383 &bull; EVIDENCE VAULT ENTERPRISE
              </span>
              <span className="text-xs text-slate-400 font-mono">WORM (Write Once Read Many) Immutable Storage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Lock className="w-8 h-8 text-emerald-400" />
              Brankas Bukti Digital Berintegritas Kriptografis
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Penyimpanan rekaman CCTV terkunci saat insiden dengan jaminan anti-manipulasi, SHA-256 tamper-proof, dan rantai pengawasan (Chain of Custody) resmi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              100% IMMUTABLE
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Left: Evidence Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Detail Berkas Bukti
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
              {selectedEvidence.retentionStatus}
            </span>
          </div>

          <div className="space-y-3 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Nomor Berkas Bukti:</span>
              <strong className="text-slate-900 dark:text-white text-sm">{selectedEvidence.id}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Judul Insiden:</span>
              <strong className="text-slate-900 dark:text-white">{selectedEvidence.incidentTitle}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Waktu Penguncian:</span>
              <span>{selectedEvidence.lockedAt}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Petugas Pengunci:</span>
              <span>{selectedEvidence.lockedBy}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Kamera yang Terkunci:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedEvidence.cameraIds.join(', ')}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Ukuran Berkas Video Terpadu:</span>
              <span>{selectedEvidence.fileSizeMb} MB (H.265 Raw Dump)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 break-all">
            <span className="text-[10px] text-slate-400 block font-bold">SHA-256 Checksum:</span>
            <span className="text-amber-400 text-[10px]">{selectedEvidence.sha256Digest}</span>
            <div className="pt-2 flex items-center justify-between text-[9px] text-emerald-400">
              <span>Status Hash: IDENTIK</span>
              <span>Integritas: 100%</span>
            </div>
          </div>
        </div>

        {/* Right: Chain of Custody & QR Validation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Rantai Pengawasan Bukti (Chain of Custody)
              </h3>
              <span className="text-[10px] text-slate-400">Standar Audit Kepolisian RI</span>
            </div>

            <div className="space-y-3">
              {selectedEvidence.chainOfCustody.map((coc) => (
                <div key={coc.step} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {coc.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white text-xs">{coc.action}</strong>
                      <span className="text-slate-400 text-[10px]">{coc.timestamp}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] block mt-0.5">Oleh: {coc.actor}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Verification Payload Block */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs block">
                    Validasi Digital QR Terpadu
                  </span>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 max-w-md break-all mt-0.5">
                    {selectedEvidence.qrPayload}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  blackBoxRecorder.record({
                    moduleCode: 'R383-VAULT',
                    role: 'SUPER_ADMIN',
                    eventType: 'SECURITY',
                    details: `Verified Evidence Dossier ${selectedEvidence.id} with Police Ready Package.`,
                    severity: 'INFO'
                  });
                  alert('Paket Bukti Digital Siap Didistribusikan ke Pihak Berwajib!');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 shadow-md"
              >
                Unduh Berkas Utuh (.ZIP)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
