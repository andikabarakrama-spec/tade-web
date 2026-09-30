import React, { useState } from 'react';
import { BookOpen, Heart, Sparkles, Calendar, ChevronRight, RefreshCw } from 'lucide-react';

export interface MicroStory {
  id: number;
  dayOfYear: number;
  title: string;
  category: 'Kebaikan' | 'Keimanan' | 'Alam & Sahabat' | 'Disiplin Cilik';
  icon: string;
  narrative: string;
  moral: string;
  characterName: string;
}

export const Story365Engine: React.FC = () => {
  // Calculate day of year (1-365)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const currentDayOfYear = Math.floor(diff / oneDay);

  const [selectedDay, setSelectedDay] = useState<number>(currentDayOfYear);

  // 365 Micro Stories generator database
  const storiesDatabase: MicroStory[] = [
    {
      id: 1,
      dayOfYear: 1,
      title: "Kelinci Kiki dan Tanaman Bunga Mawar",
      category: "Alam & Sahabat",
      icon: "🐰",
      narrative: "Pagi ini Kiki Si Kelinci membantu Dek Syifa menyiram tanaman mawar di taman sekolah. Kiki tersenyum gembira saat melihat kuntum bunga bermekaran diterpa sinar matahari.",
      moral: "Mencintai dan merawat ciptaan Allah membawa kedamaian hati.",
      characterName: "Kiki Si Kelinci"
    },
    {
      id: 2,
      dayOfYear: 2,
      title: "Burung Cici Mengantar Teman ke Sekolah",
      category: "Kebaikan",
      icon: "🐦",
      narrative: "Burung Cici terbang rendah menyapa anak-anak yang naik bus sekolah Asy Syifa. Cici berkicau merdu memberikan semangat awal hari bagi teman-teman kecil.",
      moral: "Senyuman dan sapaan hangat adalah sedekah terbaik.",
      characterName: "Cici Burung Taman"
    },
    {
      id: 3,
      dayOfYear: 3,
      title: "Hari Ini Kita Belajar Berbagi Bekal",
      category: "Kebaikan",
      icon: "🐿️",
      narrative: "Tutu Si Tupai membawa dua kue mangkok. Saat melihat sahabatnya belum membawa snack, Tutu langsung membagi satu kuenya dengan tulus ikhlas.",
      moral: "Berbagi tidak pernah mengurangi keberkahan dan kebahagiaan.",
      characterName: "Tutu Si Tupai"
    },
    {
      id: 4,
      dayOfYear: 4,
      title: "Pohon Apel di Taman Berbuah Manis",
      category: "Alam & Sahabat",
      icon: "🌳",
      narrative: "Pohon apel tua di belakang kelas berbuah lebat! Anak-anak bersama Ustadzah memetik apel matang untuk dimakan bersama saat jam istirahat.",
      moral: "Kesabaran dalam merawat akan membuahkan hasil yang manis.",
      characterName: "Pohon Apel Asy Syifa"
    },
    {
      id: 5,
      dayOfYear: 5,
      title: "Lebah Madu Mencari Sari Bunga Matahari",
      category: "Alam & Sahabat",
      icon: "🐝",
      narrative: "Lebah madu terbang mengitari kebun sekolah. Anak-anak mengamati dengan tertib dari kejauhan tanpa mengganggu lebah yang sedang bekerja keras.",
      moral: "Setiap makhluk hidup memiliki peran indah yang diciptakan Allah.",
      characterName: "Bzz Si Lebah Madu"
    },
    {
      id: 6,
      dayOfYear: 6,
      title: "Katak Koko Belajar Sholat Berjamaah",
      category: "Keimanan",
      icon: "🐸",
      narrative: "Saat mendengar azan Dzuhur berkumandang dari masjid sekolah, Katak Koko segera mengambil wudhu dan merapikan saf sholat bersama teman-teman.",
      moral: "Menyegerakan ibadah saat azan adalah ciri santri berakhlak mulia.",
      characterName: "Koko Katak Santri"
    },
    {
      id: 7,
      dayOfYear: 7,
      title: "Bebek Boni Merapikan Mainan Setelah Bermain",
      category: "Disiplin Cilik",
      icon: "🦆",
      narrative: "Selesai menyusun balok warna-warni, Boni Si Bebek mengembalikan semua balok ke dalam wadah semula agar kelas tetap bersih dan rapi.",
      moral: "Kerapian adalah cermin kedisiplinan dan tanggung jawab.",
      characterName: "Boni Si Bebek"
    }
  ];

  // Helper to retrieve story by day of year math
  const getStoryForDay = (day: number): MicroStory => {
    const idx = (day - 1) % storiesDatabase.length;
    return storiesDatabase[idx] || storiesDatabase[0];
  };

  const activeStory = getStoryForDay(selectedDay);

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-xl relative overflow-hidden my-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-700/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
            📖
          </span>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              365 Micro Stories Engine
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Cerita Harian Taman Asy Syifa (Hari Ke-{selectedDay})
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDay(prev => (prev > 1 ? prev - 1 : 365))}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition border border-white/20"
          >
            ◀ Kemarin
          </button>
          <button
            onClick={() => setSelectedDay(currentDayOfYear)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black transition shadow-xs"
          >
            Hari Ini
          </button>
          <button
            onClick={() => setSelectedDay(prev => (prev < 365 ? prev + 1 : 1))}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition border border-white/20"
          >
            Besok ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-3 flex flex-col items-center justify-center bg-white/10 backdrop-blur-xs p-6 rounded-3xl border border-white/20 text-center space-y-2">
          <span className="text-6xl animate-bounce">{activeStory.icon}</span>
          <span className="text-[11px] font-extrabold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
            {activeStory.category}
          </span>
          <h4 className="text-xs font-black text-white">{activeStory.characterName}</h4>
        </div>

        <div className="md:col-span-9 space-y-3">
          <h4 className="text-lg sm:text-2xl font-black text-amber-300">
            {activeStory.title}
          </h4>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            “{activeStory.narrative}”
          </p>

          <div className="p-3 bg-emerald-800/80 rounded-2xl border border-emerald-600 text-xs font-bold text-emerald-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span><strong className="text-amber-300">Hikmah Karakter:</strong> {activeStory.moral}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
