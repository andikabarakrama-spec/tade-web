import React, { useState } from 'react';
import { Building, Award, CheckCircle2, Sparkles, Heart, Users, Compass, History, ShieldCheck } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
}

export const FoundationShowcase: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<number>(4);

  const milestones: Milestone[] = [
    {
      year: '2010',
      title: 'Pendirian Yayasan Asy Syifa Tanggul',
      description: 'Didirikan oleh para tokoh agama dan masyarakat Tanggul - Jember untuk menyediakan pendidikan anak usia dini berbasis Al-Qur’an dan akhlakul karimah.',
      badge: 'Awal Perjalanan',
      icon: '🌱',
    },
    {
      year: '2015',
      title: 'Pembangunan Gedung & Kebun Edukasi',
      description: 'Perluasan sarana fisik mencakup ruang kelas ber-AC, taman bermain outdoor, musholla cilik, dan kebun edukasi tanaman buah.',
      badge: 'Pengembangan Sarana',
      icon: '🏫',
    },
    {
      year: '2018',
      title: 'Raihan Akreditasi A & Izin Resmi',
      description: 'Mendapat apresiasi resmi Kemendikbudristek sebagai Lembaga PAUD Terakreditasi Unggul di Kabupaten Jember.',
      badge: 'Kualitas Teruji',
      icon: '⭐',
    },
    {
      year: '2022',
      title: 'Implementasi Kurikulum Merdeka & 5 Sentra',
      description: 'Penerapan penuh Kurikulum Merdeka PAUD berpadu 5 Sentra Pembelajaran (Balok, IMTAQ, Seni, Alam, dan Bermain Peran).',
      badge: 'Inovasi Pembelajaran',
      icon: '🎨',
    },
    {
      year: '2026',
      title: 'Peluncuran Living Digital Kindergarten (TADE)',
      description: 'Transformasi ekosistem digital lengkap TADE (TK Asy Syifa Digital Ecosystem) dengan portal SIM Wali Murid R29 & website dunia anak interaktif.',
      badge: 'Modern & Islami',
      icon: '🚀',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-xl space-y-8 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 text-amber-300 font-extrabold text-xs border border-emerald-600/50">
          <Building className="w-3.5 h-3.5 text-amber-400" />
          Profil Yayasan Asy Syifa Tanggul
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Pena Naungan & Komitmen Pendidikan
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
          Berdiri teguh di bawah naungan Yayasan Asy Syifa Tanggul, berkomitmen mencetak generasi muslim cilik yang cerdas, berakhlak mulia, dan berjiwa kepemimpinan.
        </p>
      </div>

      {/* Yayasan Card Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative z-10">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
              alt="Gedung Yayasan Asy Syifa"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-stone-200">
              📍 Jl. Ahmad Yani No. 45, Tanggul - Jember, Jawa Timur
            </div>
          </div>

          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/30 text-xs space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Legalitas Resmi Yayasan
            </div>
            <p className="text-stone-300">Sk Menkumham No: AHU-0012893.AH.01.04 | NPSN PAUD: 20567812</p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-extrabold">Amanah Pendidikan Islami</span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-300 leading-snug">
              "Menuntun Langkah Pertama Ananda Menuju Ridho Allah SWT"
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Yayasan Asy Syifa Tanggul meyakini bahwa usia 3-6 tahun adalah masa emas (golden age) tempat pembentukan fondasi iman, adab, dan potensi intelektual anak. Melalui integrasi ilmu agama dan ilmu pengetahuan umum, kami menghadirkan ekosistem pembelajaran yang membahagiakan.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
              <div className="text-xl font-extrabold text-emerald-400">15+ Tahun</div>
              <div className="text-[11px] text-stone-300">Pengabdian Mendidik</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
              <div className="text-xl font-extrabold text-amber-300">1,200+</div>
              <div className="text-[11px] text-stone-300">Alumni Berprestasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Milestones Timeline */}
      <div className="space-y-4 pt-4 border-t border-emerald-800/80 relative z-10">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-amber-300 flex items-center justify-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            Jejak Langkah & Perkembangan Yayasan
          </h3>
          <p className="text-xs text-stone-300">Klik tahun di bawah untuk melihat sejarah perjalanan sekolah</p>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {milestones.map((m, idx) => {
            const isActive = activeMilestone === idx;
            return (
              <button
                key={m.year}
                onClick={() => setActiveMilestone(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-lg scale-105'
                    : 'bg-emerald-950/80 text-stone-300 hover:bg-emerald-800 border border-emerald-700/60'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.year}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Card */}
        <div className="bg-slate-950/80 rounded-2xl p-6 border border-amber-400/40 shadow-inner space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              {milestones[activeMilestone].badge} ({milestones[activeMilestone].year})
            </span>
            <span className="text-2xl">{milestones[activeMilestone].icon}</span>
          </div>
          <h4 className="text-lg font-bold text-white">{milestones[activeMilestone].title}</h4>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {milestones[activeMilestone].description}
          </p>
        </div>
      </div>
    </section>
  );
};
