import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  DollarSign,
  FileText,
  UserPlus,
  Users,
  HardDrive,
  Activity,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Sun
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const ExecutiveDashboardMorningBrief: React.FC = () => {
  const morningData = {
    cctv: '6/6 Kamera Aktif (Gerbang, Sentra Balok, Sentra Bahan Alam, Sentra Peran, Halaman, Parkir)',
    keuangan: 'Kas Operasional Rp 34.750.000 (Double Entry Balanced)',
    spp: '94% Siswa Telah Membayar SPP Agustus 2026',
    surat: '2 Surat Butuh Disposisi Kepala Sekolah / Ketua Yayasan',
    ppdb: '38 Calon Siswa Baru TA 2026/2027 (Kouta 85% Terisi)',
    guru: '100% Tenaga Pendidik & Kependidikan Hadir Tepat Waktu',
    santri: '124 Siswa Aktif Mengikuti Pembelajaran Sentra Pagi Ini',
    backup: 'Snapshot Terakhir 05:00 WIB (SHA-256 Valid 6.4 MB)',
    healthScore: '100 / 100 Sovereign Optimal',
    todayAgenda: '07:30 Apel Pagi Bersama Dek Asy &bull; 08:30 Pembelajaran Sentra Imtaq &bull; 13:00 Rapat Koordinasi Kurikulum PAUD'
  };

  return (
    <div id="executive-dashboard-morning-brief-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R423 &bull; EXECUTIVE DASHBOARD MORNING BRIEF
              </span>
              <span className="text-xs text-slate-400 font-mono">Asy Autonomous Daily Executive Briefing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sun className="w-8 h-8 text-amber-400" />
              Taklimat Pagi Eksekutif Dek Asy (Morning Brief)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Ringkasan otomatis setiap pagi untuk Pimpinan Yayasan dan Kepala Sekolah: CCTV, Keuangan, SPP, Surat, PPDB, Guru, Siswa, Backup, Health Score, dan Agenda hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center font-mono">
              <span className="text-[10px] text-amber-300 block">HEALTH SCORE</span>
              <span className="text-sm font-bold text-amber-400">{morningData.healthScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asy Speech Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 to-emerald-950/30 border border-amber-500/30 shadow-sm space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Salam Taklimat Pagi dari Dek Asy &amp; Ustadzah Syifa</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          &quot;Selamat pagi Ayahanda Ketua Yayasan &amp; Ibunda Kepala Sekolah. Berikut adalah ikhtisar operasional hari ini. Seluruh ekosistem digital dan fisik KB-TK-TPA Sentra Asy-Syifa siap menyambut siswa dan mendukung proses pembelajaran sentra dengan aman dan nyaman.&quot;
        </p>
      </div>

      {/* 9 Executive Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <Camera className="w-4 h-4 text-emerald-500" /> STATUS CCTV 6 TITIK
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.cctv}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <DollarSign className="w-4 h-4 text-amber-500" /> KAS &amp; POSISI KEUANGAN
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.keuangan}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <DollarSign className="w-4 h-4 text-emerald-500" /> PEMBAYARAN SPP SISWA
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.spp}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <FileText className="w-4 h-4 text-blue-500" /> DISPOSISI SURAT DINAS
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.surat}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <UserPlus className="w-4 h-4 text-indigo-500" /> PERKEMBANGAN PPDB ONLINE
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.ppdb}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <Users className="w-4 h-4 text-teal-500" /> PRESENSI GURU &amp; SISWA
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.guru} &bull; {morningData.santri}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <HardDrive className="w-4 h-4 text-purple-500" /> INTEGRITAS CADANGAN (BACKUP)
          </div>
          <strong className="text-slate-900 dark:text-white text-xs block">{morningData.backup}</strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <Calendar className="w-4 h-4 text-cyan-500" /> AGENDA UTAMA HARI INI
          </div>
          <p className="text-slate-800 dark:text-slate-200 text-xs font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: morningData.todayAgenda }} />
        </div>
      </div>
    </div>
  );
};
