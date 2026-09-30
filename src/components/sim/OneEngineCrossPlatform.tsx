import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Shirt,
  Sun,
  Palette,
  Bell,
  CheckCircle2,
  Layers,
  ArrowRightLeft,
  Cpu,
  Monitor,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface SharedEngineService {
  id: string;
  name: string;
  category: 'ASY_AI' | 'CALENDAR' | 'WARDROBE' | 'ANIMATION' | 'WEATHER' | 'THEME' | 'NOTIFICATION';
  sharedLogicSource: string;
  webUsage: string;
  appUsage: string;
  status: 'UNIFIED_100%' | 'SINGLE_SOURCE_OF_TRUTH';
  syncLatencyMs: number;
}

export const OneEngineCrossPlatform: React.FC = () => {
  const [services] = useState<SharedEngineService[]>([
    {
      id: 'ENG-01',
      name: 'Persona & Voice Engine (Dek Asy & Ustadzah Syifa)',
      category: 'ASY_AI',
      sharedLogicSource: 'src/services/geminiService.ts & personaEngine',
      webUsage: 'Pemandu Virtual Publik & Interaktif PPDB',
      appUsage: 'Asisten Guru, Pengawas Keamanan & Evaluator Sentra',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    },
    {
      id: 'ENG-02',
      name: 'Kalender Pendidikan Hijriah & Masehi',
      category: 'CALENDAR',
      sharedLogicSource: 'src/components/sim/EducationCalendarEngine.tsx',
      webUsage: 'Jadwal Agenda Publik & Libur Nasional Madrasah',
      appUsage: 'Rencana Pelaksanaan Pembelajaran Harian (RPPH) Sentra',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    },
    {
      id: 'ENG-03',
      name: 'Simulasi Seragam & Busana Santri',
      category: 'WARDROBE',
      sharedLogicSource: 'src/components/sim/UniformWardrobeSimulator.tsx',
      webUsage: 'Informasi Seragam Calon Santri Baru (PPDB)',
      appUsage: 'Pengecekan Kerapihan Seragam Harian Santri',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    },
    {
      id: 'ENG-04',
      name: 'Animasi Budaya & Motion Interaktif',
      category: 'ANIMATION',
      sharedLogicSource: 'src/components/sim/CulturalAnimationEngine.tsx',
      webUsage: 'Animasi Halaman Beranda Publik & Efek Hujan Daun',
      appUsage: 'Badge Prestasi Sentra Santri & Stiker Apresiasi Guru',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    },
    {
      id: 'ENG-05',
      name: 'Cuaca Waktu Nyata & Waktu Sholat Tanggul',
      category: 'WEATHER',
      sharedLogicSource: 'src/components/sim/WeatherDaytimeEngine.tsx',
      webUsage: 'Indikator Cuaca & Jadwal Adzan Halaman Utama',
      appUsage: 'Penyesuaian Kegiatan Sentra Alam Luar Ruang',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    },
    {
      id: 'ENG-06',
      name: 'Sistem Tema Terpadu (Dark / Light / Emerald)',
      category: 'THEME',
      sharedLogicSource: 'src/context/ThemeContext.tsx & Tailwind Tokens',
      webUsage: 'Tampilan Publik Ramah Anak & High Contrast',
      appUsage: 'Dashboard Manajemen SIM & Mode Komando Keamanan',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    },
    {
      id: 'ENG-07',
      name: 'Notifikasi Multi-Kanal & Bell Toast',
      category: 'NOTIFICATION',
      sharedLogicSource: 'src/services/notificationService & BlackBox',
      webUsage: 'Pengumuman Penting & Peringatan PPDB Ditutup',
      appUsage: 'Alert Gerbang, Pengingat Rapat & Status Kas SIM',
      status: 'UNIFIED_100%',
      syncLatencyMs: 0
    }
  ]);

  return (
    <div id="one-engine-cross-platform-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R393 &bull; ONE ENGINE CROSS PLATFORM CONSTITUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Divergence &bull; Single Source of Truth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ArrowRightLeft className="w-8 h-8 text-cyan-400" />
              Satu Mesin Logika Terpadu Lintas Website &amp; Web App
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Website Publik dan Aplikasi Internal SIM berbagi 100% logika yang sama untuk Asy, Kalender, Seragam, Animasi, Cuaca, Tema, dan Notifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              7/7 ENGINE UNIFIED (100%)
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[10px] text-slate-400">{svc.id} &bull; {svc.category}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                {svc.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {svc.name}
            </h3>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="text-slate-400 block text-[9px]">Sumber Modul Tunggal:</span>
              <strong className="text-cyan-600 dark:text-cyan-400">{svc.sharedLogicSource}</strong>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-start gap-1">
                <span className="text-slate-400 shrink-0 font-bold">Web Publik:</span>
                <span className="text-slate-600 dark:text-slate-300">{svc.webUsage}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-slate-400 shrink-0 font-bold">App Internal:</span>
                <span className="text-slate-600 dark:text-slate-300">{svc.appUsage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
