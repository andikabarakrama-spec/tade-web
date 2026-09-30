import React, { useState } from 'react';
import { Award, Trophy, Star, Medal, CheckCircle2, Sparkles, GraduationCap, Crown, Flame } from 'lucide-react';

interface Achievement {
  id: string;
  year: string;
  title: string;
  category: 'Siswa' | 'Guru' | 'Sekolah';
  level: string;
  organizer: string;
  recipient: string;
  badge: string;
  desc: string;
  bgGrad: string;
  borderColor: string;
  ribbonIcon: string;
}

export const AchievementWall: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Siswa' | 'Guru' | 'Sekolah'>('Semua');

  const achievements: Achievement[] = [
    {
      id: 'a1',
      year: '2026',
      title: 'Juara 1 Lomba Tahfidz Surah Pendek Cilik',
      category: 'Siswa',
      level: 'Tingkat Kecamatan Tanggul',
      organizer: 'IGTK - PGRI Tanggul',
      recipient: 'Ahmad Rayyan Al-Fatih (Kelompok B2)',
      badge: '🏆 Juara Utama',
      desc: 'Berhasil mengkhatamkan dan melantunkan 15 Surah Pendek Juz 30 dengan tartil dan tajwid sempurna.',
      bgGrad: 'from-amber-100 via-yellow-50 to-amber-200/50',
      borderColor: 'border-amber-400',
      ribbonIcon: '🎗️ Gold Medal',
    },
    {
      id: 'a2',
      year: '2025',
      title: 'Akreditasi A UNGGUL dari BAN-PAUD PNF',
      category: 'Sekolah',
      level: 'Nasional',
      organizer: 'Kementerian Pendidikan & Kebudayaan RI',
      recipient: 'TK Asy Syifa Tanggul',
      badge: '⭐ Akreditasi Unggul',
      desc: 'Meraih skor nilai 96 (Unggul) dalam 8 Standar Nasional Pendidikan Anak Usia Dini.',
      bgGrad: 'from-emerald-100 via-teal-50 to-emerald-200/50',
      borderColor: 'border-emerald-400',
      ribbonIcon: '👑 Trophy Nasional',
    },
    {
      id: 'a3',
      year: '2025',
      title: 'Guru PAUD Berprestasi & Inovatif',
      category: 'Guru',
      level: 'Tingkat Kabupaten Jember',
      organizer: 'Dinas Pendidikan Kabupaten Jember',
      recipient: 'Ustadzah Siti Maimunah, S.Pd',
      badge: '🥇 Pendidik Teladan',
      desc: 'Inovasi media pembelajaran Sains Cilik berbasis bahan alam dan permainan edukatif Islami.',
      bgGrad: 'from-sky-100 via-indigo-50 to-blue-200/50',
      borderColor: 'border-sky-400',
      ribbonIcon: '🌟 Educator Star',
    },
    {
      id: 'a4',
      year: '2025',
      title: 'Juara 2 Lomba Mewarnai & Kreasi Ibu-Anak',
      category: 'Siswa',
      level: 'Tingkat Kabupaten Jember',
      organizer: 'Festival Anak Soleh Indonesia (FASI)',
      recipient: 'Nayla Az-Zahra & Ibunda',
      badge: '🎨 Kreasi Ceria',
      desc: 'Kreativitas paduan warna dan kekompakan hubungan ibu dan anak dalam menggambar tema Islami.',
      bgGrad: 'from-pink-100 via-rose-50 to-pink-200/50',
      borderColor: 'border-pink-400',
      ribbonIcon: '🎨 Artist Badge',
    },
    {
      id: 'a5',
      year: '2024',
      title: 'Penghargaan Sekolah Ramah Anak (SRA) Terbaik',
      category: 'Sekolah',
      level: 'Tingkat Kabupaten Jember',
      organizer: 'Dinas PPPA Kabupaten Jember',
      recipient: 'TK Asy Syifa Tanggul',
      badge: '🛡️ Sekolah Safe-Zone',
      desc: 'Lingkungan bebas perundungan, arena bermain outdoor SNI, dan nutrisi gizi sehat terverifikasi.',
      bgGrad: 'from-purple-100 via-lavender-50 to-purple-200/50',
      borderColor: 'border-purple-400',
      ribbonIcon: '🎖️ Safe Shield',
    },
  ];

  const filtered = achievements.filter(
    (item) => activeCategory === 'Semua' || item.category === activeCategory
  );

  return (
    <section className="bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-yellow-50/90 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-lg space-y-8 relative overflow-hidden">
      {/* Museum Spot Lighting & Confetti Overlay */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-2 left-6 text-xl animate-bounce">✨</div>
      <div className="absolute top-3 right-8 text-xl animate-pulse">🎉</div>
      <div className="absolute bottom-3 left-8 text-xl">🏅</div>
      <div className="absolute bottom-3 right-10 text-xl">⭐</div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b-2 border-amber-200 pb-5 relative">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs border border-amber-300">
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>Museum Galeri Prestasi Siswa Cilik</span>
            <span className="text-base">🏆</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dinding Prestasi & Ukiran Piagam Juara
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-medium">
            Ruang pameran apresiasi bakat, keberanian, dan prestasi gemilang siswa serta pendidik TK Asy Syifa.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-amber-200 shadow-xs">
          {(['Semua', 'Siswa', 'Guru', 'Sekolah'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm border border-amber-600 scale-105'
                  : 'text-stone-700 hover:bg-amber-100/60'
              }`}
            >
              {cat === 'Semua' ? '🌈 Semua' : cat === 'Siswa' ? '👶 Siswa' : cat === 'Guru' ? '👩‍🏫 Guru' : '🏫 Sekolah'}
            </button>
          ))}
        </div>
      </div>

      {/* Museum Framed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-gradient-to-br ${item.bgGrad} rounded-3xl p-6 border-4 ${item.borderColor} shadow-md hover:shadow-2xl transition duration-300 space-y-3 relative overflow-hidden flex flex-col justify-between group`}
          >
            {/* Museum Frame Lighting Corner Effect */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-amber-300/40 rounded-full blur-xl"></div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-white/90 px-3 py-1 rounded-full text-slate-900 shadow-2xs border border-stone-200 flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.year}</span>
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-400/90 text-amber-950 shadow-xs">
                  {item.ribbonIcon}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  {item.category} • {item.level}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-900 transition">
                  {item.title}
                </h3>
              </div>

              <div className="p-3 bg-white/90 rounded-2xl border border-stone-200 shadow-2xs text-xs space-y-1">
                <p className="font-extrabold text-emerald-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{item.recipient}</span>
                </p>
                <p className="text-[11px] text-stone-700 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-300/60 text-[10px] text-amber-950 font-bold flex items-center justify-between">
              <span>Penyelenggara: {item.organizer}</span>
              <span className="bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-md font-black">
                {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
