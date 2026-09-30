import React, { useState, useEffect } from 'react';
import { 
  Clock, Sparkles, BookOpen, Heart, Volume2, Smile, Award, 
  Layers, CheckCircle, RefreshCw, Palette, Sun, Music
} from 'lucide-react';

export const LivingClassroomScene: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [timeString, setTimeString] = useState<string>('');
  const [activeSpot, setActiveSpot] = useState<string>('papan_tulis');
  const [isFanRotating, setIsFanRotating] = useState<boolean>(true);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const spots = [
    {
      id: 'papan_tulis',
      label: '📋 Papan Tulis & Ayat Hari Ini',
      icon: '✍️',
      title: 'Papan Tulis Pembelajaran Islami',
      desc: 'Di papan tulis ini, Ustadzah menuliskan Surah An-Naba, Doa Sebelum Belajar, dan Huruf Hijaiyah mingguan.',
      detail: '"Rabbi zidnii \'ilman warzuqnii fahman" (Ya Allah, tambahkanlah aku ilmu dan berilah aku pemahaman).'
    },
    {
      id: 'karya_anak',
      label: '🎨 Dinding Karya Anak',
      icon: '🖼️',
      title: 'Pameran Hasil Karya Motorik',
      desc: 'Setiap anak bangga melihat lukisan cap jari, kolase daun kering, dan susunan origami mereka dipajang rapi.',
      detail: 'Setiap pekan karya diganti agar ananda senantiasa percaya diri dan terinspirasi.'
    },
    {
      id: 'rak_tas',
      label: '🎒 Rak Tas & Disiplin Mandiri',
      icon: '🎒',
      title: 'Sudut Kemandirian Ananda',
      desc: 'Anak-anak melepas sepatu dan menata tas sekolah sendiri di rak bernomor warna-warni.',
      detail: 'Melatih kerapian, tanggung jawab, dan kemandirian sejak usia dini.'
    },
    {
      id: 'sentra_balok',
      label: '🧱 Meja Belajar & Sentra Balok',
      icon: '🧱',
      title: 'Area Eksplorasi Spasial & Matematika',
      desc: 'Meja kayu bundar ramah anak untuk diskusi kelompok kecil, meronce manik, dan bermain balok kayu.',
      detail: 'Terbuat dari bahan kayu jati belanda halus tanpa sudut tajam demi keamanan penuh.'
    },
    {
      id: 'tanaman_jendela',
      label: '🪴 Tanaman Hias Jendela',
      icon: '🌿',
      title: 'Edukasi Lingkungan & Siram Tanaman',
      desc: 'Pot lidah mertua dan sirih gading dipelihara piket kelas kecil setiap pagi.',
      detail: 'Mengajarkan ananda menyayangi makhluk hidup ciptaan Allah SWT.'
    }
  ];

  const currentSpotObj = spots.find(s => s.id === activeSpot) || spots[0];

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      {/* Living Classroom Container Frame */}
      <div className="bg-gradient-to-b from-amber-950 via-amber-900 to-emerald-950 text-amber-100 rounded-3xl p-6 sm:p-10 border-4 border-amber-400/90 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Header Header Info Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/40 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
              <BookOpen className="w-3.5 h-3.5 text-slate-950" /> SPRINT P3 • LIVING CLASSROOM SCENE v3.0
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight">
              Ruang Kelas Ceria TK Asy Syifa
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Suasana belajar aktif, hangat, dan Islami. Sentuh elemen di ruang kelas untuk menjelajahi aktivitas ananda!
            </p>
          </div>

          {/* Real-Time Classroom Clock & Ceiling Fan Control */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end bg-emerald-950/80 px-4 py-2.5 rounded-2xl border border-amber-400/50 shadow-inner">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Jam Kelas: {timeString || '08:00 WIB'}</span>
            </div>
            <button
              onClick={() => setIsFanRotating(!isFanRotating)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[10px] rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>💨 Kipas: {isFanRotating ? 'Nyala' : 'Mati'}</span>
            </button>
          </div>
        </div>

        {/* 2D Interactive Graphic Classroom Canvas */}
        <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-amber-100 via-amber-50 to-stone-200 rounded-2xl border-4 border-amber-300 shadow-inner overflow-hidden flex flex-col justify-between p-4 text-slate-900">
          
          {/* Ceiling Fan with Animation */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="w-1.5 h-6 bg-stone-700" />
            <div className={`w-24 h-4 bg-amber-800 rounded-full flex items-center justify-center shadow-md ${isFanRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '0.8s' }}>
              <div className="w-4 h-4 rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Classroom Back Wall (Chalkboard & Art) */}
          <div className="grid grid-cols-12 gap-3 z-10 pt-8">
            
            {/* Green Chalkboard */}
            <div 
              onClick={() => setActiveSpot('papan_tulis')}
              className={`col-span-7 bg-emerald-900 text-emerald-100 rounded-xl p-3 border-4 border-amber-800 shadow-md cursor-pointer transition transform hover:scale-[1.01] ${activeSpot === 'papan_tulis' ? 'ring-4 ring-amber-400' : ''}`}
            >
              <div className="flex items-center justify-between border-b border-emerald-700 pb-1 mb-2">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">✍️ Papan Tulis</span>
                <span className="text-[9px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-bold">An-Naba & Hijaiyah</span>
              </div>
              <p className="text-xs font-serif font-semibold text-amber-200 italic leading-snug">
                "Bismillahirahmanirrahim. Hari ini kita belajar huruf Hijaiyah 'Khaf' dan mengenal keindahan ciptaan Allah."
              </p>
            </div>

            {/* Artwork Gallery Wall */}
            <div 
              onClick={() => setActiveSpot('karya_anak')}
              className={`col-span-5 bg-amber-200/90 rounded-xl p-2.5 border-2 border-amber-400/80 shadow-md cursor-pointer transition transform hover:scale-[1.01] flex flex-col justify-between ${activeSpot === 'karya_anak' ? 'ring-4 ring-amber-400' : ''}`}
            >
              <span className="text-[10px] font-black text-amber-950 uppercase">🎨 Gallery Karya Anak</span>
              <div className="grid grid-cols-3 gap-1.5 my-1">
                <div className="h-10 bg-rose-300 rounded border border-rose-400 flex items-center justify-center text-xs">🌸</div>
                <div className="h-10 bg-sky-300 rounded border border-sky-400 flex items-center justify-center text-xs">🦋</div>
                <div className="h-10 bg-emerald-300 rounded border border-emerald-400 flex items-center justify-center text-xs">🌴</div>
              </div>
              <span className="text-[9px] font-bold text-amber-900 text-center">Tangan-Tangan Mungil Ceria</span>
            </div>
          </div>

          {/* Classroom Floor (Desks, Bag Rack, Plants) */}
          <div className="grid grid-cols-12 gap-3 items-end z-10 pt-2">
            
            {/* Bag Rack */}
            <div 
              onClick={() => setActiveSpot('rak_tas')}
              className={`col-span-3 bg-amber-800 text-amber-100 rounded-lg p-2 border-2 border-amber-900 shadow-md cursor-pointer transition transform hover:scale-[1.01] ${activeSpot === 'rak_tas' ? 'ring-4 ring-amber-400' : ''}`}
            >
              <span className="text-[10px] font-black text-amber-300 block">🎒 Rak Tas</span>
              <div className="flex gap-1 mt-1 text-sm">
                <span>🔴</span>
                <span>🔵</span>
                <span>🟢</span>
              </div>
            </div>

            {/* Wooden Study Table */}
            <div 
              onClick={() => setActiveSpot('sentra_balok')}
              className={`col-span-6 bg-amber-700 text-amber-100 rounded-xl p-3 border-2 border-amber-900 shadow-lg cursor-pointer transition transform hover:scale-[1.01] text-center ${activeSpot === 'sentra_balok' ? 'ring-4 ring-amber-400' : ''}`}
            >
              <span className="text-[10px] font-black text-amber-200">🧱 Meja Belajar & Balok Kayu</span>
              <div className="flex justify-center gap-2 mt-1 text-base">
                <span>🟨</span>
                <span>🟩</span>
                <span>🟦</span>
                <span>🟥</span>
              </div>
            </div>

            {/* Window Plant Pot */}
            <div 
              onClick={() => setActiveSpot('tanaman_jendela')}
              className={`col-span-3 bg-emerald-100 rounded-lg p-2 border-2 border-emerald-400 shadow-md cursor-pointer transition transform hover:scale-[1.01] text-center ${activeSpot === 'tanaman_jendela' ? 'ring-4 ring-amber-400' : ''}`}
            >
              <span className="text-xl block">🪴</span>
              <span className="text-[9px] font-black text-emerald-900">Tanaman Piket</span>
            </div>
          </div>
        </div>

        {/* Spot Details Card */}
        <div className="p-5 bg-amber-100/90 text-slate-900 rounded-2xl border-2 border-amber-300 shadow-lg space-y-2 animate-fade-in">
          <div className="flex items-center justify-between border-b border-amber-300/80 pb-2">
            <span className="text-sm font-black text-emerald-900 flex items-center gap-2">
              <span className="text-lg">{currentSpotObj.icon}</span>
              <span>{currentSpotObj.title}</span>
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-300 px-3 py-0.5 rounded-full">
              Ruang Kelas 1A
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
            {currentSpotObj.desc}
          </p>
          <p className="text-xs font-serif italic text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            "{currentSpotObj.detail}"
          </p>
        </div>

      </div>
    </section>
  );
};
