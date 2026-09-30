import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Sparkles, Volume2, ChevronRight, ChevronLeft, Star, Sun, Quote } from 'lucide-react';

interface StoryItem {
  id: string;
  childName: string;
  classGroup: string;
  avatar: string;
  storyTitle: string;
  storyBody: string;
  characterValue: string;
  doaOrHadith: string;
  bgColor: string;
  borderColor: string;
}

export const EmotionalStoryEngine: React.FC = () => {
  const stories: StoryItem[] = [
    {
      id: 'es-1',
      childName: 'Aisyah Humaira',
      classGroup: 'Kelompok B1',
      avatar: '👧',
      storyTitle: 'Aisyah & Doa Sebelum Makan',
      storyBody: 'Hari ini Aisyah tersenyum bangga! Saat jam bekal bersama, Aisyah memimpin membaca doa sebelum makan dengan suara fasih dan tenang. Teman-teman sekelas mengikutinya dengan khusyuk.',
      characterValue: 'Adab & Kemandirian Spiritual',
      doaOrHadith: '“Allahumma bariklana fi ma razaqtana wa qina \'adzabannar”',
      bgColor: 'from-amber-100 via-orange-50 to-amber-200/60',
      borderColor: 'border-amber-400',
    },
    {
      id: 'es-2',
      childName: 'Muhammad Rafi',
      classGroup: 'Kelompok A2',
      avatar: '👦',
      storyTitle: 'Rafi & Balok Istana Berbagi',
      storyBody: 'Saat bermain di Sentra Balok, Rafi melihat teman barunya bingung memilih balok kayu. Rafi dengan gembira memberikan balok berwarna kuningnya agar mereka bisa merancang istana bersama.',
      characterValue: 'Sikap Dermawan & Kepedulian',
      doaOrHadith: 'Hadits Berbagi: “Senyum & kebaikanmu adalah sedekah.” (HR. Tirmidzi)',
      bgColor: 'from-emerald-100 via-teal-50 to-emerald-200/60',
      borderColor: 'border-emerald-400',
    },
    {
      id: 'es-3',
      childName: 'Nabila Az-Zahra',
      classGroup: 'Kelompok B2',
      avatar: '👧',
      storyTitle: 'Nabila Menyiram Bunga Kebun',
      storyBody: 'Nabila mengambil penyiram air cilik lalu menyiram bunga bayam dan melati di kebun sekolah. Nabila bilang: “Tanaman juga butuh minum biar segar diciptakan AllahSWT!”',
      characterValue: 'Cinta Kebersihan & Alam',
      doaOrHadith: 'Mencintai lingkungan bagian dari iman.',
      bgColor: 'from-rose-100 via-pink-50 to-rose-200/60',
      borderColor: 'border-rose-400',
    },
    {
      id: 'es-4',
      childName: 'Faizan Al-Fatih',
      classGroup: 'Kelompok B1',
      avatar: '👦',
      storyTitle: 'Faizan Pemimpin Sholat Dhuha Cilik',
      storyBody: 'Faizan tampil percaya diri saat menjadi muadzin panggilan sholat Dhuha berjamaah di Musholla Al-Syifa. Suaranya lantang merdu dan melatih keberanian kepemimpinan.',
      characterValue: 'Keberanian & Kepemimpinan Robbani',
      doaOrHadith: 'Latihan sholat sejak dini penyejuk hati orang tua.',
      bgColor: 'from-sky-100 via-indigo-50 to-blue-200/60',
      borderColor: 'border-sky-400',
    },
    {
      id: 'es-5',
      childName: 'Siti Maryam',
      classGroup: 'Kelompok Playgroup',
      avatar: '👧',
      storyTitle: 'Maryam Gemar Makan Sayur Bayam',
      storyBody: 'Hari ini Maryam yang tadinya pemilih makanan berhasil menghabiskan mangkuk sup bayam wortel gizi sehat buatan sekolah! Maryam mengacungkan dua jempol gembira.',
      characterValue: 'Kesehatan & Apresiasi Nutrisi',
      doaOrHadith: 'Tubuh sehat untuk semangat beribadah.',
      bgColor: 'from-purple-100 via-lavender-50 to-purple-200/60',
      borderColor: 'border-purple-400',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Auto rotate stories every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [stories.length]);

  const activeStory = stories[currentIndex];

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeStory.storyBody);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 via-emerald-50/70 to-teal-50 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-xl space-y-6 relative overflow-hidden">
      {/* Decorative Hearts & Stars */}
      <div className="absolute top-3 left-6 text-xl animate-bounce">💖</div>
      <div className="absolute top-4 right-8 text-xl animate-pulse">⭐</div>
      <div className="absolute bottom-3 right-10 text-xl">🎈</div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-amber-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-300 text-slate-950 flex items-center justify-center text-2xl shadow-md border-2 border-white">
            📖
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Emotional Story Engine • Jurnal Kebaikan Santri
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Cerita Inspiratif Kebaikan Hari Ini
            </h3>
          </div>
        </div>

        {/* Audio Speech Button */}
        <button
          onClick={handleSpeak}
          className={`px-4 py-2 rounded-2xl font-black text-xs border shadow-sm transition flex items-center gap-2 cursor-pointer ${
            isPlayingAudio
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-white hover:bg-amber-100 text-slate-900 border-amber-300'
          }`}
          title="Dengarkan Narasi Suara Cerita"
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : 'text-amber-600'}`} />
          <span>{isPlayingAudio ? 'Sedang Membaca...' : 'Dengarkan Narasi Suara'}</span>
        </button>
      </div>

      {/* Featured Active Story Card */}
      <div className={`bg-gradient-to-br ${activeStory.bgColor} rounded-3xl p-6 sm:p-8 border-4 ${activeStory.borderColor} shadow-md space-y-4 relative overflow-hidden transition-all duration-500`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 bg-white/90 rounded-2xl border border-amber-200 shadow-2xs">
              {activeStory.avatar}
            </span>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900">{activeStory.childName}</h4>
              <p className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
                {activeStory.classGroup} • {activeStory.characterValue}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)}
              className="p-2 rounded-xl bg-white hover:bg-amber-200 text-slate-900 border border-stone-200 shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-amber-950 bg-amber-200 px-3 py-1 rounded-xl">
              {currentIndex + 1} / {stories.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % stories.length)}
              className="p-2 rounded-xl bg-white hover:bg-amber-200 text-slate-900 border border-stone-200 shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 bg-white/90 p-5 rounded-2xl border border-stone-200 shadow-xs">
          <h5 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Quote className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{activeStory.storyTitle}</span>
          </h5>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
            "{activeStory.storyBody}"
          </p>
        </div>

        <div className="p-3 bg-emerald-100/80 rounded-xl border border-emerald-300 text-xs text-emerald-950 font-bold flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
          <span>Hikmah Karakter: {activeStory.doaOrHadith}</span>
        </div>
      </div>
    </section>
  );
};
