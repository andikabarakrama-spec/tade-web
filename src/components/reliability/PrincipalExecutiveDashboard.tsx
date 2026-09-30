import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const PrincipalExecutiveDashboard: React.FC = () => {
  return (
    <div className="space-y-6" id="principal-executive-dashboard">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                R848 &bull; Dashboard Eksekutif Kepala Sekolah
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                PIMPINAN SEKOLAH
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Ikhtisar Strategis & Kesiapan Operasional Sekolah
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Menyajikan visibilitas utuh bagi Kepala Sekolah: capaian kurikulum, presensi santri & guru, progres tahfidz, mutu dokumentasi, dan postur keamanan sekolah.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Kehadiran Santri</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">98.4% Hadir</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Guru Bertugas</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">12 / 12 Lengkap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Capaian Kurikulum RPPH</span>
          <div className="text-2xl font-black mt-1 text-emerald-400">96.2%</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Minggu ke-4 Agustus</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Tahfidz Juz 30</span>
          <div className="text-2xl font-black mt-1 text-amber-400">89.5%</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Mutabaah Terverifikasi</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dokumentasi Terbit</span>
          <div className="text-2xl font-black mt-1 text-cyan-400">48 Momen</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Tersebar ke Wali Murid</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status Keamanan</span>
          <div className="text-2xl font-black mt-1 text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-5 h-5" />
            100% AMAN
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Ring-0 & CCTV Terhubung</span>
        </div>
      </div>

      {/* Actionable Executive Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Academic & Spiritual Highlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Sorotan Akademik & Tahfidz Santri
            </h3>
            <span className="text-xs text-slate-400 font-mono">TK A & TK B</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Kelompok TK A (Al-Fatihah & An-Naas)', val: '98% Lulus Tasmi\'', color: 'text-emerald-400' },
              { label: 'Kelompok TK B (Al-Falaq s/d Al-Kafirun)', val: '92% Mutabaah Mandiri', color: 'text-emerald-400' },
              { label: 'Sentra Seni & Mewarnai Karakter Asy', val: '100% Portofolio Lengkap', color: 'text-cyan-400' },
              { label: 'Praktek Ibadah Sholat Dhuha & Adab Makan', val: 'Sempurna Tertib', color: 'text-amber-400' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className={`font-bold font-mono ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Operational Health & Staff Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Kesiapan Operasional & Kesejahteraan Guru
            </h3>
            <span className="text-xs text-slate-400 font-mono">100% READY</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Jurnal Harian Guru Terverifikasi', val: '12 / 12 Selesai', color: 'text-emerald-400' },
              { label: 'Pemberitahuan Wali Murid Terkirim', val: '142 Keluarga Terhubung', color: 'text-cyan-400' },
              { label: 'Kesiapan Tanggap Darurat 10 Menit Emas', val: 'Siap Siaga 100%', color: 'text-emerald-400' },
              { label: 'Infaq Jumat Berkah Terhimpun', val: 'Rp 2.450.000', color: 'text-amber-400' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className={`font-bold font-mono ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
