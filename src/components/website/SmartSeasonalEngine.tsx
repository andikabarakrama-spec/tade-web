import React from 'react';
import { Sparkles, Calendar, Heart, Award, Star } from 'lucide-react';
import { SeasonalPreset } from '../../types';

interface SmartSeasonalEngineProps {
  currentPreset?: SeasonalPreset;
}

export const SmartSeasonalEngine: React.FC<SmartSeasonalEngineProps> = ({ currentPreset = 'auto' }) => {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Determine active theme context
  let activeSeason = currentPreset;
  if (activeSeason === 'auto') {
    if (currentMonth === 8) activeSeason = 'agustus'; // August
    else if (currentMonth === 11) activeSeason = 'hari-guru'; // November
    else if (currentMonth === 7 || currentMonth === 6) activeSeason = 'awal-tahun'; // June/July
    else if (currentMonth >= 1 && currentMonth <= 4) activeSeason = 'ppdb';
    else activeSeason = 'normal';
  }

  const seasonConfigs = {
    agustus: {
      title: '🇮🇩 Semarak HUT RI ke-81 di TK Asy Syifa Tanggul!',
      subtitle: 'Menumbuhkan Cinta Tanah Air & Karakter Pancasila Sejak Dini di Sekolah Ceria.',
      bgGradient: 'from-red-800 via-rose-700 to-amber-600',
      badge: 'Merah Putih Semarak Kemerdekaan',
      icon: Star
    },
    ramadhan: {
      title: '🌙 Marhaban ya Ramadhan Suci di Kampus Ceria Qurani',
      subtitle: 'Program Pesantren Cilik, Senandung Shalawat & Amalan Doa Harian Siswa.',
      bgGradient: 'from-emerald-900 via-teal-900 to-indigo-950',
      badge: 'Suasana Ramadhan Penuh Berkah',
      icon: Heart
    },
    ppdb: {
      title: '🎒 PPDB Online Tahun Ajaran 2026/2027 Resmi Dibuka!',
      subtitle: 'Mari Bergabung Bersama Keluarga Besar TK Asy Syifa Tanggul. Kuota Terbatas!',
      bgGradient: 'from-teal-800 via-emerald-800 to-amber-700',
      badge: 'Pendaftaran Siswa Baru',
      icon: Calendar
    },
    'hari-guru': {
      title: '🍎 Selamat Hari Guru Nasional - Terima Kasih Pendidik PAUD Teladan!',
      subtitle: 'Mengabdi dengan Hati, Membimbing Langkah Pertama Generasi Rabbani.',
      bgGradient: 'from-amber-800 via-orange-800 to-stone-900',
      badge: 'Apresiasi Pendidik Teladan',
      icon: Award
    },
    'awal-tahun': {
      title: '✨ Selamat Datang Siswa Cilik Baru TK A & B!',
      subtitle: 'Selamat Memulai Petualangan Belajar Bermain di Taman Ceria Asy Syifa.',
      bgGradient: 'from-emerald-800 via-teal-800 to-sky-900',
      badge: 'Tahun Ajaran Baru Ceria',
      icon: Sparkles
    },
    normal: {
      title: '✨ Selamat Datang di Website Resmi TK Asy Syifa Tanggul',
      subtitle: 'Membentuk Generasi Cerdas, Kreatif & Berakhlak Qurani Sejak Dini.',
      bgGradient: 'from-emerald-900 via-teal-900 to-stone-900',
      badge: 'Kampus Ceria Berkarakter Qurani',
      icon: Sparkles
    }
  };

  const config = seasonConfigs[activeSeason] || seasonConfigs.normal;
  const IconComponent = config.icon;

  return (
    <div className={`bg-gradient-to-r ${config.bgGradient} text-white rounded-3xl p-5 sm:p-6 shadow-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 my-4`}>
      <div className="flex items-start gap-3">
        <div className="p-3 bg-white/15 rounded-2xl shrink-0 backdrop-blur-xs">
          <IconComponent className="w-6 h-6 text-amber-300" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-300 text-slate-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
            {config.badge}
          </span>
          <h3 className="text-base sm:text-lg font-black text-white">{config.title}</h3>
          <p className="text-stone-200 text-xs mt-0.5">{config.subtitle}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="text-[10px] text-emerald-200 font-mono bg-white/10 px-3 py-1 rounded-full border border-white/10">
          Smart Season Engine Active
        </span>
      </div>
    </div>
  );
};
