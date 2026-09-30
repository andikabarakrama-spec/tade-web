import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, X, Award, Shield, Star, Heart, CheckCircle2 } from 'lucide-react';

export const FoundationPresentationMode: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const presentationHighlights = [
    {
      title: "Visi & Keunggulan Utama Kampus Hijau",
      subtitle: "Memadukan Kurikulum Merdeka PAUD & Tahfidz Al-Qur'an Juz 30",
      icon: "🕌",
      stats: [
        { label: "Target Hafalan", val: "Surah Pendek & Doa" },
        { label: "Akreditasi Sekolah", val: "Predikat Terakreditasi" },
        { label: "Fasilitas Belajar", val: "Taman Asri & Kelas AC" }
      ],
      quote: "Menjadi sekolah ramah anak pilihan utama orang tua di Tanggul Jember."
    },
    {
      title: "Kenyamanan & Keamanan Lingkungan Belajar",
      subtitle: "Lingkungan Sehat, Ramah Anak, dan Berbasis Digital Ecosystem",
      icon: "🌿",
      stats: [
        { label: "CCTV Real-Time", val: "Pengawasan 24/7" },
        { label: "Layanan Antar Jemput", val: "Armada Bus Ber-AC" },
        { label: "Katering Gizi Sehat", val: "Menu Thoyyib Harian" }
      ],
      quote: "Setiap sudut dirancang untuk merangsang kognitif dan motorik anak secara alami."
    },
    {
      title: "Prestasi & Kepuasan Orang Tua (Wali Murid)",
      subtitle: "Transparansi SIM R1-R32 & Laporan Perkembangan Terintegrasi",
      icon: "⭐",
      stats: [
        { label: "Kepuasan Orang Tua", val: "99.8% Sangat Puas" },
        { label: "Laporan E-Rapor", val: "Lengkap & Real-Time" },
        { label: "Buku Penghubung Digital", val: "Terhubung Setiap Hari" }
      ],
      quote: "Kolaborasi erat sekolah dan orang tua melahirkan generasi Qur'ani yang cemerlang."
    }
  ];

  useEffect(() => {
    if (!isActive || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % presentationHighlights.length);
    }, 10000); // Auto slide every 10 seconds

    return () => clearInterval(interval);
  }, [isActive, isPlaying, presentationHighlights.length]);

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="fixed bottom-20 left-6 z-40 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce hover:scale-105 transition"
      >
        <Sparkles className="w-4 h-4 text-slate-950" />
        <span>Mode Presentasi Yayasan</span>
      </button>
    );
  }

  const current = presentationHighlights[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10 text-white animate-in fade-in duration-300">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
            ✨
          </span>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              Mode Presentasi Eksekutif Yayasan
            </span>
            <h2 className="text-base sm:text-lg font-black text-white">
              TK Asy Syifa Tanggul — Living Kindergarten World
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-2 border border-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? "Jeda Auto Play" : "Putar Otomatis"}</span>
          </button>

          <button
            onClick={() => setIsActive(false)}
            className="w-10 h-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center font-bold transition shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-8 text-center">
        <div className="space-y-2">
          <span className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 text-4xl flex items-center justify-center mx-auto shadow-xl animate-bounce">
            {current.icon}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight leading-tight">
            {current.title}
          </h1>
          <p className="text-sm sm:text-lg text-emerald-200 font-bold max-w-2xl mx-auto">
            {current.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {current.stats.map((st, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-xs p-6 rounded-3xl border border-white/20 shadow-lg space-y-1">
              <span className="text-xs text-stone-300 font-bold block">{st.label}</span>
              <span className="text-lg sm:text-xl font-black text-white block">{st.val}</span>
            </div>
          ))}
        </div>

        {/* Quote */}
        <p className="text-xs sm:text-base text-stone-200 font-medium italic bg-emerald-900/60 p-4 rounded-2xl border border-emerald-500/40">
          “{current.quote}”
        </p>
      </div>

      {/* Slide Navigation Indicator */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/20">
        {presentationHighlights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === idx ? 'bg-amber-400 w-8' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
