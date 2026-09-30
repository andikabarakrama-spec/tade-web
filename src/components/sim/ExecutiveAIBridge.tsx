import React from 'react';
import { 
  Crown, 
  Bot, 
  ShieldCheck, 
  DollarSign, 
  UserPlus, 
  Video, 
  FileText, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Flame,
  ArrowRight
} from 'lucide-react';

export const ExecutiveAIBridge: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R502 &bull; EXECUTIVE AI BRIDGE
          </span>
          <span className="text-xs text-slate-400 font-mono">Pusat Kendali Eksekutif Ketua Yayasan &bull; Single Screen</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-400" />
              Executive AI Bridge &bull; Jembatan Komando Eksekutif
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Panel terpadu satu layar untuk Ketua Yayasan dan Super Admin: menyatukan analisa proaktif AI Asy, perisai keamanan Guardian, rekonsiliasi keuangan kasir SPP, PPDB, CCTV kampus, legalitas persuratan, dan status War Room.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-800/80 text-center shrink-0">
            <span className="text-[10px] font-mono text-amber-300 block">EXECUTIVE STATUS</span>
            <span className="text-base font-bold text-white font-mono flex items-center justify-center gap-1.5 mt-0.5">
              100% OPERASIONAL PRIMA
            </span>
            <span className="text-[10px] text-emerald-400 block font-bold">Seluruh Sentra Normal</span>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">KAS SPP TERKUMPUL</span>
            <span className="text-base font-bold text-emerald-400 font-mono">Rp 48.500.000</span>
            <span className="text-[9px] text-emerald-500 block">Bank BSI Terverifikasi</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PPDB 2026/2027</span>
            <span className="text-base font-bold text-cyan-400 font-mono">42 / 45 Santri (93%)</span>
            <span className="text-[9px] text-cyan-500 block">3 Kursi Tersisa</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CCTV &amp; SECURITY MESH</span>
            <span className="text-base font-bold text-purple-400 font-mono">11 Feeds Live</span>
            <span className="text-[9px] text-purple-400 block">Zero Breach Event</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">WAR ROOM AUDIT</span>
            <span className="text-base font-bold text-emerald-400 font-mono">Suites A - AA PASS</span>
            <span className="text-[9px] text-emerald-500 block">100% Green Rating</span>
          </div>
        </div>
      </div>

      {/* 2 Main Executive Pillars: Asy & Guardian Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asy Insight Box */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-cyan-200 dark:border-cyan-900/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                RINGKASAN OPERASIONAL AI ASY
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              Living Intelligence
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block mb-1">Kurikulum Sentra &amp; Pembelajaran:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Penerapan tema mingguan <em>“Alam Semesta &amp; Ciptaan Allah”</em> berjalan serentak di 5 sentra dengan tingkat antusiasme santri 98%.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block mb-1">Persuratan &amp; Legalitas:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                142 dokumen resmi terindeks dengan stempel digital QR dan bebas kesalahan penomoran surat.
              </p>
            </div>
          </div>
        </div>

        {/* Guardian Security Box */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-200 dark:border-purple-900/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                PENGAWASAN KEAMANAN GUARDIAN
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Security Sentinel
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block mb-1">Integritas Database &amp; Snapshot:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Enkripsi WORM cadangan cloud tersinkronisasi 100% dengan checksum SHA-256 valid.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block mb-1">Status Pengawasan CCTV 11 Titik:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Semua feed video aktif dengan latensi rendah (&lt; 18ms), pos satpam siap siaga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
