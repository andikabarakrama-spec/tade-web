import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Cloud, Clock, Calendar, BookOpen, Heart, Volume2, ShieldCheck } from 'lucide-react';
import { useLivingGarden } from '../../context/LivingGardenContext';

export const LivingWidgetsBar: React.FC = () => {
  const { getHijriDate, timeOfDay } = useLivingGarden();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Assalamu\'alaikum! Selamat Pagi Ananda Ceria ☀️';
    if (hour >= 11 && hour < 15) return 'Assalamu\'alaikum! Selamat Siang & Semangat Belajar 🌤️';
    if (hour >= 15 && hour < 18) return 'Assalamu\'alaikum! Selamat Sore & Waktu Istirahat 🌇';
    return 'Assalamu\'alaikum! Selamat Malam & Istirahat Nyenyak 🌙';
  };

  const dailyQuote = '“Sebaik-baik kalian adalah yang mempelajari Al-Qur\'an dan mengajarkannya.” (HR. Bukhari)';
  const dailyDoa = 'Doa Sebelum Belajar: "Rabbi zidni \'ilman warzuqni fahman"';
  const dailyTahfidz = 'Tahfidz Hari Ini: Surah An-Nas & Al-Falaq (Kelompok B)';

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white py-2 px-4 shadow-sm border-b border-emerald-800/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        {/* Salam & Time */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-black text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            {getGreeting()}
          </span>
          <span className="hidden sm:inline-block text-emerald-400">|</span>
          <span className="flex items-center gap-1 font-mono font-bold text-emerald-200">
            <Clock className="w-3 h-3 text-emerald-400" /> {timeStr}
          </span>
        </div>

        {/* Weather & Hijriyah & Quote */}
        <div className="flex items-center gap-4 text-[11px] text-stone-300 overflow-x-auto scrollbar-none py-0.5">
          <span className="flex items-center gap-1 text-amber-200 font-bold shrink-0">
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Cuaca Tanggul: 28°C Cerah
          </span>
          <span className="text-emerald-500 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-300 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {getHijriDate()}
          </span>
          <span className="text-emerald-500 hidden lg:inline">•</span>
          <span className="hidden lg:inline italic text-amber-100 font-medium truncate max-w-md">
            {dailyQuote}
          </span>
        </div>
      </div>
    </div>
  );
};
