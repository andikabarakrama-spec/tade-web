import React, { useState } from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  AlertTriangle, 
  Bot, 
  ShieldAlert, 
  CreditCard, 
  Users, 
  FileText, 
  Video, 
  HardDrive, 
  Clock,
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const FounderExecutiveTimeline: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const timelineEvents = [
    { time: '14:30 WIB', type: 'GUARDIAN', title: 'Guardian Continuous Scan', desc: '8 probe keamanan terverifikasi 100% HEALTHY tanpa anomali.', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40' },
    { time: '14:00 WIB', type: 'BACKUP', title: 'Backup Otomatis Terjadwal', desc: 'Snapshot WORM immutable hash SHA-256 tersimpan aman.', icon: HardDrive, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { time: '13:15 WIB', type: 'SURAT', title: 'Penerbitan Surat Rekomendasi Lomba', desc: 'Surat No. 045/SK/TK-ABA/VIII/2026 ditandatangani digital QR.', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { time: '11:45 WIB', type: 'KEUANGAN', title: 'Rekonsiliasi Kas SPP Daring', desc: '14 transaksi pembayaran SPP terekam via Virtual Account.', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { time: '10:00 WIB', type: 'PPDB', title: 'Pendaftaran Siswa Baru (PPDB Online)', desc: 'Santri an. Muhammad Farhan berhasil mendaftar (Gelombang 1).', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { time: '08:30 WIB', type: 'CCTV', title: 'Integritas Aliran Perimeter & CCTV', desc: 'Semua 8 titik kamera perimeter melaporkan 60 FPS normal.', icon: Video, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/40' },
    { time: '06:00 WIB', type: 'ASY', title: 'AI Asy Taklimat Eksekutif Pagi', desc: 'Taklimat operasional harian terdistribusi ke Super Admin & Yayasan.', icon: Bot, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/40' }
  ];

  const filtered = filterType === 'ALL'
    ? timelineEvents
    : timelineEvents.filter(e => e.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 dark:bg-teal-400/10 rounded-2xl border border-teal-500/20 text-teal-600 dark:text-teal-400">
              <GitCommit className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 font-mono">
                  R521 &bull; EXECUTIVE TIMELINE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-mono">
                  LIVE AUDIT TRAIL
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Founder Executive Timeline
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Kronologi terintegrasi aktivitas harian sekolah (PPDB, Keuangan, Surat, Backup, CCTV, Asy &amp; Guardian).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Menampilkan <strong>{filtered.length} Peristiwa Hari Ini</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {['ALL', 'ASY', 'GUARDIAN', 'PPDB', 'KEUANGAN', 'SURAT', 'BACKUP', 'CCTV'].map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3.5 py-2 rounded-xl transition-all border ${
              filterType === f
                ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chronological Timeline Stream */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
          {filtered.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div key={idx} className="relative group">
                {/* Dot on line */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-teal-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${evt.bg} ${evt.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold">
                          {evt.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">{evt.desc}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {evt.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
