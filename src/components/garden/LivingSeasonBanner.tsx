import React from 'react';
import { Sparkles, Calendar, Flag, Award, Heart } from 'lucide-react';
import { useLivingGarden } from '../../context/LivingGardenContext';

export const LivingSeasonBanner: React.FC = () => {
  const { getHijriDate } = useLivingGarden();
  const currentMonth = new Date().getMonth(); // 0 = Jan, 7 = Aug, etc.
  const currentDay = new Date().getDate();

  let season = {
    title: 'Suasana Belajar Ceria & Islami 1448 H',
    badge: 'Tahun Ajaran 2026/2027',
    IconComponent: Sparkles,
    bgGradient: 'from-emerald-800 via-teal-800 to-emerald-900',
    accentText: 'Membangun Generasi Rabbani Cerdas & Mandiri',
    theme: 'Standard',
  };

  if (currentMonth === 7 && currentDay >= 10 && currentDay <= 20) {
    season = {
      title: 'Semarak HUT Kemerdekaan RI ke-81',
      badge: '17 Agustus Merdeka',
      IconComponent: Flag,
      bgGradient: 'from-rose-800 via-red-800 to-amber-800',
      accentText: 'Cinta Tanah Air & Bangsa Sejak Dini di TK Asy Syifa',
      theme: '17Agustus',
    };
  } else if (currentMonth === 10) {
    season = {
      title: 'Hari Guru Nasional & Apresiasi Pendidik',
      badge: 'Pahlawan Tanpa Tanda Jasa',
      IconComponent: Award,
      bgGradient: 'from-indigo-900 via-purple-800 to-slate-900',
      accentText: 'Terima Kasih Ustadz & Ustadzah Atas Bimbingan Tulusnya',
      theme: 'HariGuru',
    };
  }

  const IconComponent = season.IconComponent;

  return (
    <div className={`bg-gradient-to-r ${season.bgGradient} text-white py-2.5 px-4 shadow-sm border-b border-white/10`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-white/10 text-amber-300">
            <IconComponent className="w-4 h-4 animate-pulse" />
          </div>
          <span className="font-extrabold text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            {season.badge}
          </span>
          <span className="font-bold text-white hidden sm:inline">{season.title}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-emerald-100">
          <span className="hidden md:inline italic font-medium">{season.accentText}</span>
          <span className="flex items-center gap-1 font-bold bg-black/20 px-3 py-1 rounded-full border border-white/10 text-amber-200">
            <Calendar className="w-3 h-3 text-amber-300" /> {getHijriDate()}
          </span>
        </div>
      </div>
    </div>
  );
};
