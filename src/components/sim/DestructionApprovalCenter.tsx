import React, { useState } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Users, 
  KeyRound, 
  Lock, 
  AlertTriangle, 
  Sparkles, 
  FileCheck2,
  Building,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export interface DestructionRequest {
  id: string;
  itemTitle: string;
  dataCategory: string;
  destructionReason: string;
  submittedAt: string;
  retentionExpiredDate: string;
  recordCount: number;
  itemSha256Before: string;
  // Triple Approvals:
  adminApproval: { approved: boolean; by: string | null; timestamp: string | null };
  kepalaSekolahApproval: { approved: boolean; by: string | null; timestamp: string | null };
  ketuaYayasanApproval: { approved: boolean; by: string | null; timestamp: string | null };
  status: 'PENDING_APPROVALS' | 'APPROVED_READY' | 'EXECUTED_DESTROYED' | 'REJECTED';
  destructionCertificateId: string | null;
  certificateHash: string | null;
}

export const DestructionApprovalCenter: React.FC = () => {
  const [requests, setRequests] = useState<DestructionRequest[]>([
    {
      id: 'DEST-2026-001',
      itemTitle: 'Draft Formulir Pendaftaran PPDB TA 2023/2024 (Batal & Tidak Lengkap)',
      dataCategory: 'Draft PPDB (Masa Retensi 2 Tahun Habis)',
      destructionReason: 'Retensi 2 tahun telah habis sesuai Kebijakan Perlindungan Data Pribadi (PDP) santri yang tidak jadi mendaftar.',
      submittedAt: '10 Agustus 2026, 09:00 WIB',
      retentionExpiredDate: '30 Juni 2026',
      recordCount: 14,
      itemSha256Before: '4a6b2c8e19f20d7382104598acb039478f192b0c12e987456d2a1b9472658190',
      adminApproval: {
        approved: true,
        by: 'Ustadzah Siti Aminah (Admin SIM)',
        timestamp: '10 Agustus 2026, 09:30 WIB'
      },
      kepalaSekolahApproval: {
        approved: true,
        by: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)',
        timestamp: '11 Agustus 2026, 14:00 WIB'
      },
      ketuaYayasanApproval: {
        approved: false,
        by: null,
        timestamp: null
      },
      status: 'PENDING_APPROVALS',
      destructionCertificateId: null,
      certificateHash: null
    },
    {
      id: 'DEST-2026-002',
      itemTitle: 'Temporary Cache & Raw Image Previews TA 2025/2026',
      dataCategory: 'Daily Temp Snapshot (30 Hari Kedaluwarsa)',
      destructionReason: 'Pembersihan rolling buffer temporary file sesuai kuota penyimpanan.',
      submittedAt: '01 Agustus 2026, 10:00 WIB',
      retentionExpiredDate: '31 Juli 2026',
      recordCount: 120,
      itemSha256Before: '9c8f12a345b678c9012d345e678f901a234b567c890d123e456f789a012b345c',
      adminApproval: {
        approved: true,
        by: 'Admin SIM',
        timestamp: '01 Agustus 2026, 10:15 WIB'
      },
      kepalaSekolahApproval: {
        approved: true,
        by: 'Kepala Sekolah',
        timestamp: '01 Agustus 2026, 11:00 WIB'
      },
      ketuaYayasanApproval: {
        approved: true,
        by: 'KH. Dr. Muhammad Zaki (Ketua Yayasan)',
        timestamp: '01 Agustus 2026, 11:30 WIB'
      },
      status: 'EXECUTED_DESTROYED',
      destructionCertificateId: 'BA-PEMUSNAHAN/2026/001',
      certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ]);

  const [activeCert, setActiveCert] = useState<DestructionRequest | null>(null);

  const handleApprove = (id: string, role: 'ADMIN' | 'KEPALA_SEKOLAH' | 'KETUA_YAYASAN') => {
    setRequests(prev => prev.map(req => {
      if (req.id !== id) return req;

      let admin = { ...req.adminApproval };
      let ks = { ...req.kepalaSekolahApproval };
      let ky = { ...req.ketuaYayasanApproval };

      const nowStr = '15 Agustus 2026, 13:10 WIB';

      if (role === 'ADMIN') {
        admin = { approved: true, by: 'Ustadzah Siti Aminah (Admin SIM)', timestamp: nowStr };
      } else if (role === 'KEPALA_SEKOLAH') {
        ks = { approved: true, by: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)', timestamp: nowStr };
      } else if (role === 'KETUA_YAYASAN') {
        ky = { approved: true, by: 'KH. Dr. Muhammad Zaki (Ketua Yayasan)', timestamp: nowStr };
      }

      const allApproved = admin.approved && ks.approved && ky.approved;

      return {
        ...req,
        adminApproval: admin,
        kepalaSekolahApproval: ks,
        ketuaYayasanApproval: ky,
        status: allApproved ? 'APPROVED_READY' : 'PENDING_APPROVALS'
      };
    }));
  };

  const handleExecuteDestruction = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        status: 'EXECUTED_DESTROYED',
        destructionCertificateId: `BA-PEMUSNAHAN/2026/${String(Math.floor(Math.random() * 900) + 100)}`,
        certificateHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
    }));
  };

  return (
    <div id="destruction-approval-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <AlertOctagon className="w-48 h-48 text-rose-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R234 &bull; CONTROLLED DESTRUCTION
              </span>
              <span className="text-xs text-slate-400">Triple Approval Quorum Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <AlertOctagon className="w-8 h-8 text-rose-400" />
              Destruction Approval Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Protokol pemusnahan rekaman data terkontrol. Data <strong>tidak boleh langsung dihapus</strong> dan wajib melewati <em>Triple Approval (Admin &bull; Kepala Sekolah &bull; Ketua Yayasan)</em>. Founder Layer tetap terisolasi penuh.
            </p>
          </div>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Antrean Pemusnahan</span>
            <span className="text-xl font-bold text-white font-mono">{requests.length} Berkas</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Metode Otorisasi</span>
            <span className="text-xl font-bold text-rose-400 font-mono">TRIPLE APPROVAL</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Founder Layer Security</span>
            <span className="text-xl font-bold text-purple-400 font-mono">AIR-GAP ISOLATED</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Bukti Berita Acara</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">SHA-256 SIGNED</span>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Klausul Kedaulatan TADE (Zero Arbitrary Deletion):</strong>
          Setiap byte data madrasah dilindungi dari penghapusan sepihak. Sebelum pemusnahan dieksekusi, sistem mengharuskan tiga tanda tangan elektronik terverifikasi dan menerbitkan Berita Acara Pemusnahan resmi bertanda tangan digital.
        </div>
      </div>

      {/* Destruction Request Cards */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {req.id}
                </span>
                <span className="text-xs text-slate-500 font-medium">{req.dataCategory}</span>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                req.status === 'EXECUTED_DESTROYED' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                req.status === 'APPROVED_READY' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                Status: {req.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {req.itemTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                <strong>Alasan Pemusnahan:</strong> {req.destructionReason}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono mt-2">
                <span>Retensi Habis: {req.retentionExpiredDate}</span>
                <span>Jumlah Rekaman: {req.recordCount} baris</span>
              </div>
            </div>

            {/* Triple Approval Status Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Admin Approval */}
              <div className={`p-3.5 rounded-xl border text-xs ${
                req.adminApproval.approved 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' 
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">1. Admin SIM</span>
                  {req.adminApproval.approved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <button
                      onClick={() => handleApprove(req.id, 'ADMIN')}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Setujui
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {req.adminApproval.approved ? (
                    <>
                      <div>{req.adminApproval.by}</div>
                      <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{req.adminApproval.timestamp}</div>
                    </>
                  ) : (
                    'Menunggu verifikasi admin data...'
                  )}
                </div>
              </div>

              {/* 2. Kepala Sekolah Approval */}
              <div className={`p-3.5 rounded-xl border text-xs ${
                req.kepalaSekolahApproval.approved 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' 
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">2. Kepala Sekolah</span>
                  {req.kepalaSekolahApproval.approved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <button
                      onClick={() => handleApprove(req.id, 'KEPALA_SEKOLAH')}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Setujui
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {req.kepalaSekolahApproval.approved ? (
                    <>
                      <div>{req.kepalaSekolahApproval.by}</div>
                      <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{req.kepalaSekolahApproval.timestamp}</div>
                    </>
                  ) : (
                    'Menunggu persetujuan Kepala Sekolah...'
                  )}
                </div>
              </div>

              {/* 3. Ketua Yayasan Approval */}
              <div className={`p-3.5 rounded-xl border text-xs ${
                req.ketuaYayasanApproval.approved 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' 
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">3. Ketua Yayasan</span>
                  {req.ketuaYayasanApproval.approved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <button
                      onClick={() => handleApprove(req.id, 'KETUA_YAYASAN')}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Setujui
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {req.ketuaYayasanApproval.approved ? (
                    <>
                      <div>{req.ketuaYayasanApproval.by}</div>
                      <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{req.ketuaYayasanApproval.timestamp}</div>
                    </>
                  ) : (
                    'Menunggu pengesahan Ketua Yayasan...'
                  )}
                </div>
              </div>
            </div>

            {/* Execution & Certificate Area */}
            {req.status === 'APPROVED_READY' && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-rose-900 dark:text-rose-200">
                  <strong>Triple Approval Lengkap!</strong> Berkas siap dimusnahkan secara permanen dan diterbitkan Berita Acara resmi.
                </div>
                <button
                  onClick={() => handleExecuteDestruction(req.id)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
                >
                  Eksekusi Pemusnahan Terkendali
                </button>
              </div>
            )}

            {req.status === 'EXECUTED_DESTROYED' && (
              <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-400">Nomor Berita Acara: </span>
                  <strong className="text-emerald-400">{req.destructionCertificateId}</strong>
                </div>
                <div className="truncate max-w-md">
                  <span className="text-slate-400">Hash Bukti: </span>
                  <span className="text-cyan-400">{req.certificateHash}</span>
                </div>
                <button
                  onClick={() => setActiveCert(req)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] border border-slate-700 shrink-0 font-sans font-bold"
                >
                  Lihat Berita Acara
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certificate Modal View */}
      {activeCert && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                Berita Acara Pemusnahan Rekaman Data
              </h3>
              <button
                onClick={() => setActiveCert(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono"
              >
                Tutup [ESC]
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="text-center font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
                Yayasan Asy-Syifa &bull; KB-TK-TPA Sentra
                <div className="text-[11px] font-normal text-slate-500 font-mono mt-0.5">{activeCert.destructionCertificateId}</div>
              </div>

              <p>
                Pada hari ini telah dilaksanakan pemusnahan rekaman data digital secara sah, terkontrol, dan tidak dapat dipulihkan (*irreversible crypto-shredding*) dengan rincian:
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1 font-mono text-[11px]">
                <div><strong>Nama Berkas:</strong> {activeCert.itemTitle}</div>
                <div><strong>Kategori:</strong> {activeCert.dataCategory}</div>
                <div><strong>Alasan:</strong> {activeCert.destructionReason}</div>
                <div><strong>SHA-256 Pre-Destruction:</strong> {activeCert.itemSha256Before}</div>
                <div><strong>Certificate Hash:</strong> {activeCert.certificateHash}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700 text-center text-[10px]">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-700/30">
                  <span className="font-bold block">1. Admin SIM</span>
                  <span className="text-emerald-600 font-mono">TERVERIFIKASI</span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-700/30">
                  <span className="font-bold block">2. Kepala Sekolah</span>
                  <span className="text-emerald-600 font-mono">DISETUJUI</span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-700/30">
                  <span className="font-bold block">3. Ketua Yayasan</span>
                  <span className="text-emerald-600 font-mono">DISAHKAN</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setActiveCert(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
