import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  UserCheck, 
  Users, 
  Database, 
  AlertTriangle, 
  Sun, 
  Activity, 
  Flame, 
  Lock, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { CAMPUS_ROOMS } from './DigitalTwinCampusCenter';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const FounderCommandMap: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'FINANCE' | 'ACADEMIC' | 'SECURITY'>('OVERVIEW');

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R482 &bull; FOUNDER COMMAND MAP
          </span>
          <span className="text-xs text-slate-400 font-mono">Executive Supreme Overview &bull; TK Asy Syifa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Gauge className="w-8 h-8 text-cyan-400" />
          Founder Command Map &bull; Peta Kendali Eksekutif
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Pusat kendali komprehensif satu layar untuk Ketua Yayasan dan Super Admin: mengagregasi peta digital twin kampus, status keamanan Guardian, kesehatan database backup, rekonsiliasi SPP, penerbitan surat resmi, PPDB, hingga akses instan War Room.
        </p>

        {/* Executive 4 Quick Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">KESIAPAN KAMPUS</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% HIJAU</span>
            <span className="text-[9px] text-emerald-500 block">11 Ruangan Aktif</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">SETORAN SPP BULANAN</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">Rp 48.500.000</span>
            <span className="text-[9px] text-cyan-500 block">97.8% Tertagih</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PENDAFTAR PPDB 2026/2027</span>
            <span className="text-xl font-bold text-purple-400 font-mono">42 Calon Santri</span>
            <span className="text-[9px] text-purple-400 block">Target: 45 Santri</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS WAR ROOM Y</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">15/15 PASS</span>
            <span className="text-[9px] text-emerald-500 block">Enterprise Ready</span>
          </div>
        </div>
      </div>

      {/* Main Command Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Campus Miniature & Key Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Miniature Living Map */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  MINIATURE DIGITAL TWIN CAMPUS MONITOR
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-500">● 100% ONLINE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CAMPUS_ROOMS.slice(0, 6).map(room => (
                <div
                  key={room.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {room.code}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      {room.readinessScore}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {room.name.replace('Sentra ', '')}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>👥 {room.studentsCount} Anak</span>
                    <span>🌡️ {room.temperature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Executive Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SPP & Finance Pillar */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  REKONSILIASI KASIR &amp; SPP
                </h4>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">LUNAS</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Penerimaan kas harian tercatat realtime: Rp 4.250.000 (Kwitansi Digital Terverifikasi QR).
              </p>
              <div className="text-[10px] font-mono text-slate-400">
                Buku Kas Umum: Rekening BSI Yayasan Syifa
              </div>
            </div>

            {/* Official Letters & SK */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  PERSURATAN &amp; ARSIP WORM
                </h4>
                <span className="text-[10px] font-mono text-purple-500 font-bold">100% RESMI</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Format F4/A4, SHA-256 Hash, QR Telemetri, dan Stempel Digital Yayasan terverifikasi.
              </p>
              <div className="text-[10px] font-mono text-slate-400">
                Total Surat Terbit: 142 Dokumen (Zero Typo)
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Morning Brief & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                FOUNDER MORNING BRIEF
              </h3>
              <span className="text-xs font-mono text-amber-500 font-bold">Pagi Ini</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Pesan Ringkas untuk Ketua Yayasan:
              </h4>
              <p className="text-xs text-amber-900 dark:text-amber-300 font-serif leading-relaxed">
                “Alhamdulillah, KBM berjalan tertib di 5 sentra utama. Seluruh guru hadir tepat waktu. Presensi santri mencapai 98%. Setoran kas SPP dan pendaftaran PPDB tercatat otomatis tanpa selisih.”
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Database Firestore Cloud</span>
                <span className="text-emerald-500 font-bold">Sync Active (4ms)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Snapshot Backup Otomatis</span>
                <span className="text-cyan-500 font-bold">Tersimpan di Vault</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">CCTV Guardian Guard</span>
                <span className="text-purple-500 font-bold">11 Channels Recording</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
