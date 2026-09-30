import React, { useState, useEffect } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';
import { AIAsyCharacterState } from '../assistant/AIAsyCharacterAssetRegistry';
import { BookOpen, X, Sparkles } from 'lucide-react';

export const FloatingMascot: React.FC = () => {
  const { settings, timeOfDay } = useLivingGarden();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const getTimeBasedState = (): AIAsyCharacterState => {
    switch (timeOfDay) {
      case 'Pagi':
        return 'wave';
      case 'Siang':
        return 'reading';
      case 'Sore':
        return 'watering';
      case 'Malam':
        return 'pray';
      default:
        return 'idle';
    }
  };

  const currentCharacterState = getTimeBasedState();

  const mascotMessages = [
    {
      title: 'Assalamu’alaikum!',
      body: 'Selamat datang di Taman Belajar TK Asy Syifa Tanggul! Mari tumbuh cerdas & berakhlak mulia bersama AI Asy.',
      doa: 'Doa Sebelum Belajar: Rabbi zidni \'ilman warzuqni fahman',
      tip: 'Jelajahi Program Unggulan!',
    },
    {
      title: 'Hafalan Surah Pendek',
      body: 'Ananda diajarkan hafalan Surah An-Nas, Al-Falaq, dan Al-Ikhlas dengan pembiasaan yang menyenangkan.',
      doa: 'Doa Orang Tua: Rabbighfirli waliwalidayya warhamhuma kama rabbayani shaghira',
      tip: 'Lihat Galeri Kenangan Sekolah',
    },
    {
      title: 'Pendaftaran PPDB 2026/2027',
      body: 'PPDB Online resmi dibuka. Pendaftaran cepat, transparan, dan mudah untuk Ayah & Bunda.',
      doa: 'Doa Memohon Keberkahan: Allahumma bariklana fi ma razaqtana',
      tip: 'Isi Formulir PPDB Online',
    },
    {
      title: 'Lingkungan Aman & Ramah Anak',
      body: 'Ruang kelas ber-AC, taman bermain outdoor berstandar keamanan tinggi, dan tenaga pengajar tersertifikasi.',
      doa: 'Doa Kebaikan Dunia Akhirat: Rabbana atina fid-dunya hasanah',
      tip: 'Kunjungi Halaman Kontak',
    },
  ];

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    const autoMinimizeTimer = setTimeout(() => {
      setIsOpen(false);
    }, 8500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(autoMinimizeTimer);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % mascotMessages.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [mascotMessages.length]);

  if (!settings.mascotEnabled) return null;

  const currentMsg = mascotMessages[currentMessageIndex];

  return (
    <div className="relative pointer-events-auto transition-transform duration-700">
      {/* Compact Gentle Greeting Bubble when panel is closed */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="absolute bottom-20 right-0 w-64 bg-white/95 backdrop-blur-md border-2 border-emerald-500 rounded-2xl p-3 shadow-xl text-slate-800 z-40 text-xs cursor-pointer hover:border-emerald-600 transition group animate-fade-in"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-12 shrink-0">
              <AIAsyCharacterRenderer state={currentCharacterState} scale={0.7} />
            </div>
            <div className="space-y-0.5">
              <p className="font-extrabold text-emerald-950 text-[11px] flex items-center gap-1">
                <span>AI Asy</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                  {timeOfDay}
                </span>
              </p>
              <p className="text-[10px] text-stone-600 leading-snug font-medium">
                "Assalamu'alaikum Ayah & Bunda! Izinkan Asy menemani perjalanan ini."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Speech Bubble popup if open */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 sm:w-80 bg-white border-2 border-emerald-600 rounded-3xl p-5 shadow-2xl space-y-3 text-slate-800 z-50 animate-float-slow">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-12 shrink-0">
                <AIAsyCharacterRenderer state={currentCharacterState} scale={0.75} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-emerald-950 flex items-center gap-1">
                  <span>AI Asy</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-extrabold">
                    Resmi
                  </span>
                </h4>
                <p className="text-[10px] text-stone-500 font-medium">Penghuni Taman Belajar</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-emerald-900 text-sm flex items-center justify-between">
              <span>{currentMsg.title}</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Suasana {timeOfDay}
              </span>
            </p>
            <p className="text-stone-600 leading-relaxed font-medium">{currentMsg.body}</p>
          </div>

          {/* Pointing Menu Suggestion Tip */}
          <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-300 text-xs font-bold text-amber-950 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Petunjuk AI Asy:
            </span>
            <span className="text-emerald-900 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 text-[10px]">
              {currentMsg.tip}
            </span>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 font-medium space-y-1">
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-800">
              <BookOpen className="w-3 h-3 text-emerald-600" /> Doa Harian
            </span>
            <p className="italic">{currentMsg.doa}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCurrentMessageIndex((prev) => (prev + 1) % mascotMessages.length)}
              className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Pesan Berikutnya &rarr;
            </button>
            <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-full border border-stone-200">
              Suasana {timeOfDay}
            </span>
          </div>
        </div>
      )}

      {/* Mascot Icon Trigger Button with Official 3D AI Asy Character */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-20 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 border-2 border-emerald-300/80 flex items-center justify-center transition transform relative group cursor-pointer p-1"
        title="AI Asy - Maskot Resmi 3D TK Asy Syifa"
      >
        <AIAsyCharacterRenderer state={currentCharacterState} scale={0.8} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border border-white" />
      </button>
    </div>
  );
};
