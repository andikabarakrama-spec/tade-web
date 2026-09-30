import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  BatteryCharging,
  Sun,
  Moon,
  Heart,
  Smile,
  Leaf,
  CheckCircle2
} from 'lucide-react';

export const AdaptiveLearningExperience: React.FC = () => {
  const [quietMode, setQuietMode] = useState(false);
  const [batterySaver, setBatterySaver] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'alam' | 'adab' | 'ibadah'>('alam');

  const themes = {
    alam: {
      title: 'Tema Hari Ini: Sahabat Pohon & Bunga Ciptaan Allah',
      icon: Leaf,
      color: 'emerald',
      arabicQuote: 'إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ',
      quoteTranslation: '"Sesungguhnya Allah itu Maha Indah dan mencintai keindahan." (HR. Muslim)',
      morningMotivation: 'Awali pagi dengan senyuman dan rawat tanaman di halaman sekolah bersama teman!',
      dailyPill: 'Sentra Bahan Alam'
    },
    adab: {
      title: 'Tema Hari Ini: Senyum, Salam, dan Menyapa Santun',
      icon: Smile,
      color: 'amber',
      arabicQuote: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
      quoteTranslation: '"Senyummu di hadapan saudaramu adalah sedekah bagimu." (HR. Tirmidzi)',
      morningMotivation: 'Tebarkan senyuman tulus kepada guru, teman, dan orang tua saat tiba di gerbang madrasah.',
      dailyPill: 'Sentra Main Peran & Karakter'
    },
    ibadah: {
      title: 'Tema Hari Ini: Shalat Dhuha & Adab Membaca Al-Qur\'an',
      icon: Heart,
      color: 'violet',
      arabicQuote: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      quoteTranslation: '"Sebaik-baik kalian adalah yang mempelajari Al-Qur\'an dan mengajarkannya." (HR. Bukhari)',
      morningMotivation: 'Lantunkan ayat suci Al-Qur\'an dengan tartil dan penuh kecintaan.',
      dailyPill: 'Sentra Imtaq & Ibadah'
    }
  };

  const current = themes[activeTheme];
  const ThemeIcon = current.icon;

  return (
    <div className={`space-y-6 max-w-6xl mx-auto pb-16 transition-all ${batterySaver ? 'opacity-95' : 'animate-fadeIn'}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Adaptive Learning Experience</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold font-mono">
                Micro-UX Sentra
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengalaman belajar adaptif anak & guru: tema harian interaktif, mutiara hikmah nabawiyah, mode hening kelas, dan optimasi baterai HP.
            </p>
          </div>
        </div>

        {/* Adaptive Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuietMode(!quietMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              quietMode
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {quietMode ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400" />}
            {quietMode ? 'Quiet Mode (Aktif)' : 'Mode Suara Normal'}
          </button>

          <button
            onClick={() => setBatterySaver(!batterySaver)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              batterySaver
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BatteryCharging className={`w-3.5 h-3.5 ${batterySaver ? 'text-emerald-200' : 'text-slate-400'}`} />
            {batterySaver ? 'Hemat Baterai (Aktif)' : 'Visual Standar'}
          </button>
        </div>
      </div>

      {/* Theme Selector Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 font-mono">Pilih Tema Harian:</span>
        {(['alam', 'adab', 'ibadah'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTheme(key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTheme === key
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {key === 'alam' && 'Alam Semesta'}
            {key === 'adab' && 'Adab & Akhlak'}
            {key === 'ibadah' && 'Imtaq & Ibadah'}
          </button>
        ))}
      </div>

      {/* Main Adaptive Theme Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-mono font-bold">
            <ThemeIcon className="w-4 h-4" />
            {current.dailyPill}
          </div>

          <h2 className="text-2xl font-bold text-slate-800">{current.title}</h2>

          {/* Arabic Hadits / Quote Card */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
            <div className="font-serif text-2xl text-slate-800 leading-relaxed font-bold tracking-wide" dir="rtl">
              {current.arabicQuote}
            </div>
            <p className="text-xs text-slate-600 italic font-sans max-w-lg mx-auto">
              {current.quoteTranslation}
            </p>
          </div>

          <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl text-teal-900 text-xs font-medium leading-relaxed">
            <Sparkles className="w-4 h-4 text-teal-600 inline-block mr-1.5 -mt-0.5" />
            {current.morningMotivation}
          </div>
        </div>
      </div>

      {/* Micro-Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Suasana Belajar Adaptif
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Menyesuaikan tata cahaya layar dan animasi visual secara otomatis saat kelas sentra berlangsung agar santri tetap fokus.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-teal-600" />
            Optimalisasi Perangkat Murah
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Mode hemat daya mematikan rendering latar berat, menjaga konsumsi baterai smartphone wali murid tetap irit sepanjang hari.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <Heart className="w-4 h-4 text-teal-600" />
            Pendidikan Karakter Alami
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Setiap transisi modul menyematkan pengingat doa dan adab harian sesuai teladan Rasulullah SAW.
          </p>
        </div>
      </div>
    </div>
  );
};
