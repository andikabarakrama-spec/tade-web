import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, CreditCard, Heart, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const ParentDashboardPreview: React.FC = () => {
  const [activePortal, setActivePortal] = useState<'wali' | 'guru' | 'kepsek'>('wali');

  return (
    <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/80 shadow-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-700/60 pb-5">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Teknologi Digital SIM Sekolah
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300">
            Pratinjau Portal Wali Murid & SIM Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            Orang tua dapat memantau perkembangan hafalan, laporan KMS kesehatan, serta riwayat SPP secara real-time dari HP.
          </p>
        </div>

        {/* Portal Switcher */}
        <div className="flex flex-wrap gap-1.5 bg-emerald-900/80 p-1.5 rounded-2xl border border-emerald-600/50">
          <button
            onClick={() => setActivePortal('wali')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activePortal === 'wali'
                ? 'bg-amber-400 text-stone-950 shadow-md scale-105'
                : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            📱 Portal Wali Murid
          </button>
          <button
            onClick={() => setActivePortal('guru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activePortal === 'guru'
                ? 'bg-amber-400 text-stone-950 shadow-md scale-105'
                : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            👩‍🏫 Portal Guru
          </button>
          <button
            onClick={() => setActivePortal('kepsek')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activePortal === 'kepsek'
                ? 'bg-amber-400 text-stone-950 shadow-md scale-105'
                : 'text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            📊 Portal Manajemen
          </button>
        </div>
      </div>

      {/* Interactive Mock Frame */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-emerald-600/60 shadow-2xl space-y-6">
        {/* Mock Topbar */}
        <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="font-extrabold text-emerald-300 ml-2">SIM TK Asy Syifa v15</span>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
            Simulasi Live Mode
          </span>
        </div>

        {/* Wali Murid View */}
        {activePortal === 'wali' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Status Kehadiran</span>
                <strong className="text-lg text-amber-300 font-black">Hadir (100% Bulan Ini)</strong>
                <p className="text-[11px] text-emerald-200">Terbaca via QR Presensi Otomatis</p>
              </div>

              <div className="bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Hafalan Surah</span>
                <strong className="text-lg text-white font-black">Surah An-Nas & Al-Falaq</strong>
                <p className="text-[11px] text-emerald-200">Kelompok B1 • Mutqin Mumtaz</p>
              </div>

              <div className="bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Status SPP Sekolah</span>
                <strong className="text-lg text-emerald-400 font-black">Lunas (Agustus 2026)</strong>
                <p className="text-[11px] text-emerald-200">Transfer Mandiri Auto Verified</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-700 space-y-2 text-xs">
              <h4 className="font-bold text-amber-300 flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-400" /> Catatan Perkembangan Ceria Ananda
              </h4>
              <p className="text-stone-300 leading-relaxed italic">
                "Rayyan hari ini sangat aktif di sentra bahan alam, mau membagi krayon dengan temannya, dan membaca doa sebelum makan dengan lancar."
              </p>
            </div>
          </div>
        )}

        {/* Guru View */}
        {activePortal === 'guru' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-300">
            <h4 className="font-extrabold text-amber-300 text-sm">Dashboard Input Jurnal Guru & Penilaian Anecdot</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700">
                ✅ Input Presensi Harian Kelompok A & B (1 Klik)
              </div>
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700">
                📖 Catatan Hafalan Surah & Doa Harian
              </div>
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700">
                🩺 Rekap Laporan KMS Kesehatan & Berat Badan
              </div>
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700">
                📝 Kirim Pengumuman & Foto Kegiatan ke Wali Murid
              </div>
            </div>
          </div>
        )}

        {/* Kepsek View */}
        {activePortal === 'kepsek' && (
          <div className="space-y-4 text-xs animate-in fade-in duration-300">
            <h4 className="font-extrabold text-amber-300 text-sm">Rekap Eksekutif Kinerja & Mutu Sekolah</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700">
                <span className="text-[10px] text-emerald-300 block">Total Siswa Aktif</span>
                <strong className="text-2xl text-amber-300 font-black">120 Siswa</strong>
              </div>
              <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700">
                <span className="text-[10px] text-emerald-300 block">Total Pendidik & Staf</span>
                <strong className="text-2xl text-white font-black">12 Ustadzah</strong>
              </div>
              <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700">
                <span className="text-[10px] text-emerald-300 block">Status Keuangan SPP</span>
                <strong className="text-2xl text-emerald-400 font-black">98.5% Lunas</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
