import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  FileCheck,
  Search,
  Sparkles,
  Volume2,
  Mic,
  TrendingUp,
  FolderLock,
  Compass,
  ArrowRight
} from 'lucide-react';

interface PendingApproval {
  id: string;
  title: string;
  category: 'SARPRAS' | 'ANGGARAN' | 'SURAT_TUGAS' | 'KERJASAMA';
  amount?: string;
  applicant: string;
  date: string;
  status: 'PENDING' | 'APPROVED';
}

export const LivingExecutiveWorld: React.FC = () => {
  const [approvals, setApprovals] = useState<PendingApproval[]>([
    {
      id: 'app_1',
      title: 'Pengadaan Peremajaan Balok Sentra & Karpet Puzzle EVA',
      category: 'SARPRAS',
      amount: 'Rp 4.850.000',
      applicant: 'Ustadzah Siti (Kepala Sentra)',
      date: '14 Agustus 2026',
      status: 'PENDING'
    },
    {
      id: 'app_2',
      title: 'Honorarium Narasumber Pelatihan Kurikulum Sentra 2026',
      category: 'ANGGARAN',
      amount: 'Rp 2.500.000',
      applicant: 'Bendahara Yayasan',
      date: '14 Agustus 2026',
      status: 'PENDING'
    },
    {
      id: 'app_3',
      title: 'Surat Tugas Delegasi Lomba Guru PAUD Berprestasi Tingkat Provinsi',
      category: 'SURAT_TUGAS',
      applicant: 'Kepala Sekolah',
      date: '13 Agustus 2026',
      status: 'APPROVED'
    }
  ]);

  const [voiceNavStatus, setVoiceNavStatus] = useState<string>('');

  const handleApprove = (id: string) => {
    setApprovals(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    );
  };

  const handleSimulateVoiceNav = (command: string) => {
    setVoiceNavStatus(`Navigasi Suara: "${command}" -> Menampilkan Data Terkait...`);
    setTimeout(() => setVoiceNavStatus(''), 3000);
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/40 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  SENIOR EXECUTIVE WORLD
                </span>
                <span className="text-xs text-slate-300">Ketua Yayasan Asy-Syifatan</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Executive Governance Cockpit & Smart Approvals
              </h1>
              <p className="text-sm text-amber-100/80 mt-0.5">
                Pengambilan keputusan strategis, penandatanganan berkas digital 1-klik, dan ringkasan eksekutif berstandar senior-friendly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3 text-center min-w-[140px]">
              <div className="text-[11px] text-slate-400">Berkas Menunggu Tanda Tangan</div>
              <div className="text-2xl font-black text-amber-400">{pendingCount} Pengajuan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Navigation Bar (Senior-Friendly) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Mic className="w-4 h-4 text-amber-500" />
          <span>Navigasi Suara Cepat (Voice Command):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'Buka Laporan Keuangan Bulan Ini',
            'Tampilkan Agenda Rapat Pleno',
            'Cek Rekap Presensi Guru',
            'Lihat Progres PPDB 2026'
          ].map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulateVoiceNav(cmd)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-900 transition"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>

      {voiceNavStatus && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-900 dark:text-amber-200 rounded-xl font-medium">
          {voiceNavStatus}
        </div>
      )}

      {/* Grid: Smart Approval Center & AI Letter Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Smart Approval List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  Antrean Persetujuan & Tanda Tangan Digital (Smart Approval)
                </h3>
                <p className="text-xs text-slate-500">Persetujuan terenkripsi RSA dengan stempel sah Yayasan</p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {pendingCount} Pending
              </span>
            </div>

            <div className="space-y-3">
              {approvals.map(app => (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl border transition ${
                    app.status === 'PENDING'
                      ? 'bg-amber-50/40 dark:bg-slate-800 border-amber-200 dark:border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {app.category}
                        </span>
                        <span className="text-xs text-slate-400">{app.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.title}</h4>
                      <div className="text-xs text-slate-500 mt-1">
                        Pemohon: <strong>{app.applicant}</strong>
                        {app.amount && <span> • Nilai: <strong className="text-emerald-600">{app.amount}</strong></span>}
                      </div>
                    </div>

                    <div>
                      {app.status === 'PENDING' ? (
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Setujui & Tanda Tangan
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          DISETUJUI
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (5 Cols): Ringkasan Surat Masuk AI & Governance Timeline */}
        <div className="lg:col-span-5 space-y-4">
          {/* Ringkasan Surat Masuk AI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Ringkasan Surat Masuk (AI Executive Summary)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Surat Dinas
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white">
                Surat Edaran Dinas Pendidikan No. 421/PAUD/VIII/2026:
              </div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside text-[11px]">
                <li>Verifikasi Dokumen Akreditasi BAN-PAUD dijadwalkan September 2026.</li>
                <li>Seluruh 8 Standar Pendidikan di Smart Vault Asy-Syifatan telah lengkap (100%).</li>
                <li>Tidak ada tindakan perbaikan fisik gedung yang mendesak.</li>
              </ul>
            </div>
          </div>

          {/* Governance Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              Timeline Tata Kelola Yayasan 2026
            </h3>

            <div className="space-y-2.5">
              {[
                { time: 'Q1 2026', title: 'Audit Keuangan Internal & Surplus Kas', status: 'SELESAI' },
                { time: 'Q2 2026', title: 'Penyelarasan Kurikulum Merdeka Sentra', status: 'SELESAI' },
                { time: 'Q3 2026', title: 'Akreditasi A BAN-PAUD Visitasi', status: 'BERJALAN' },
                { time: 'Q4 2026', title: 'Penyusunan Rencana Strategis 2027', status: 'TERJADWAL' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.time}</span>
                    <span className="text-slate-500 text-[11px] block">{item.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
