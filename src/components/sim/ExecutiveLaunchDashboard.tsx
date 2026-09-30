import React, { useState } from 'react';
import {
  LayoutDashboard,
  Award,
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  UserPlus,
  Video,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  HardDrive,
  Activity,
  Calendar
} from 'lucide-react';

export const ExecutiveLaunchDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                EXECUTIVE MISSION COMMAND
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-300">
                Ketua Yayasan & Super Admin
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Executive Launch & School Health Command
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Satu layar terintegrasi untuk memantau kesehatan operasional, kehadiran, penerimaan SPP, progres PPDB, rapat eksekutif, dan status pengawalan Guardian 24/7.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4 min-w-[220px]">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-2xl">
              99.8%
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Indeks Kesehatan Sekolah</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                PRIMA & STABIL
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">TADE Constitution v3.2</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Asy Morning Executive Companion Briefing Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              AI Asy Executive Companion Briefing Hari Ini
            </h3>
          </div>
          <span className="text-xs text-slate-400">Pukul 07:15 WIB</span>
        </div>

        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
          "Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak Ketua Yayasan. Seluruh subsistem sekolah beroperasi 100% normal. Presensi guru pagi ini lengkap (100%), 30 siswa hadir tepat waktu di Sentra Balok & Sains. Kas yayasan berada pada posisi surplus dengan 0 catatan keterlambatan SPP kritis. Ada 2 berkas pengajuan sarpras yang menunggu tanda tangan digital Anda di Tab R63."
        </p>
      </div>

      {/* 6 High-Density Executive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Kehadiran Siswa & Guru */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Kehadiran Hari Ini</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">98.2%</div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+1.4% vs kemarin</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Siswa: <strong>30/31 Hadir</strong> (1 Izin) • Guru: <strong>14/14 Hadir (100%)</strong>
          </div>
        </div>

        {/* 2. Keuangan & Kas Yayasan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Penerimaan Kas & SPP Bulan Ini</span>
            <DollarSign className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp 48.500.000</div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">92% Target</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Zero financial drift • Rekonsiliasi otomatis H0-01 aktif
          </div>
        </div>

        {/* 3. Progres PPDB 2026/2027 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>PPDB Baru (Target: 40 Siswa)</span>
            <UserPlus className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">34 Terdaftar</div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">85% Kuota</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            28 Terverifikasi • 6 Menunggu Wawancara Psikologi
          </div>
        </div>

        {/* 4. Rapat & Keputusan Eksekutif */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rapat & Agenda Yayasan</span>
            <Video className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Pleno Yayasan</div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">14:00 WIB</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Ruang Digital Terenkripsi • Link QR Rapat Otomatis Aktif
          </div>
        </div>

        {/* 5. Guardian System Security */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Keamanan & Guardian Watchtower</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100% DEFENDED</div>
            <span className="text-xs font-semibold text-slate-500">0 Incidents</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            App Check attestation active • Database snapshot up to date
          </div>
        </div>

        {/* 6. Smart Vault & Arsip Akreditasi */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Arsip Akreditasi & Smart Vault</span>
            <HardDrive className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">248 Berkas</div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">SHA-256 Valid</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            10 Kategori Tata Kelola Lengkap & Siap Audit BAN-PAUD
          </div>
        </div>
      </div>
    </div>
  );
};
