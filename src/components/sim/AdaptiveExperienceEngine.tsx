import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  CloudSun,
  BatteryCharging,
  Zap,
  Sliders,
  CheckCircle2,
  Eye,
  Feather,
  Shield
} from 'lucide-react';

export const AdaptiveExperienceEngine: React.FC = () => {
  const [quietMode, setQuietMode] = useState<boolean>(false);
  const [batterySaver, setBatterySaver] = useState<boolean>(false);
  const [activeTheme, setActiveTheme] = useState<'WARM_ISLAMIC' | 'MODERN_CLEAN' | 'TWILIGHT_OASIS'>('WARM_ISLAMIC');
  const [timeContext, setTimeContext] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');

  const greetingTexts = {
    MORNING: {
      title: 'Shabahul Khair (صباح الخير)',
      desc: 'Semoga hari penuh keberkahan dan kemudahan dalam mendidik generasi penerus bangsa.'
    },
    AFTERNOON: {
      title: 'Masa’ul Khair (مساء الخير)',
      desc: 'Alhamdulillah, kegiatan sentra dan pembelajaran ananda hari ini telah terlaksana dengan baik.'
    },
    EVENING: {
      title: 'Lailatuka Sa’idah (ليلتك سعيدة)',
      desc: 'Waktu beristirahat bersama keluarga dan mempersiapkan agenda esok hari.'
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Adaptive Experience Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Dynamic Ambient UX
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Mesin pengalaman adaptif: sapaan kontekstual islami, visual cuaca mikro, mode hening hemat baterai, dan adaptasi tema personal.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Ambient Preview Card */}
      <div
        className={`p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden space-y-4 ${
          activeTheme === 'WARM_ISLAMIC'
            ? 'bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50 border-amber-200 text-slate-800'
            : activeTheme === 'MODERN_CLEAN'
            ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-slate-200 text-slate-800'
            : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono">
            {timeContext === 'MORNING' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : timeContext === 'AFTERNOON' ? (
              <CloudSun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
            <span className="font-bold">
              {timeContext === 'MORNING' ? 'Pagi Hari (07:00 - 11:30)' : timeContext === 'AFTERNOON' ? 'Siang Hari (11:30 - 16:00)' : 'Malam Hari (16:00 - 06:00)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {quietMode && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-bold text-[10px] flex items-center gap-1">
                <Feather className="w-3 h-3" /> Quiet Mode Aktif
              </span>
            )}
            {batterySaver && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                <BatteryCharging className="w-3 h-3" /> Battery Optimized
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className={`text-2xl font-black ${activeTheme === 'TWILIGHT_OASIS' ? 'text-amber-300' : 'text-amber-900'}`}>
            {greetingTexts[timeContext].title}
          </h2>
          <p className={`text-sm leading-relaxed max-w-3xl ${activeTheme === 'TWILIGHT_OASIS' ? 'text-slate-300' : 'text-slate-600'}`}>
            {greetingTexts[timeContext].desc}
          </p>
        </div>
      </div>

      {/* Control Panels: Time Simulator, Themes, and Battery Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Simulator */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            Simulasi Waktu & Sapaan
          </h2>

          <div className="space-y-2">
            {(['MORNING', 'AFTERNOON', 'EVENING'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeContext(t)}
                className={`w-full p-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                  timeContext === t
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{t === 'MORNING' ? 'Pagi (Shabah)' : t === 'AFTERNOON' ? 'Siang (Masa’)' : 'Malam (Lailah)'}</span>
                {timeContext === t && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            Palet Suasana & Nuansa
          </h2>

          <div className="space-y-2">
            {[
              { id: 'WARM_ISLAMIC', label: 'Warm Islamic Oasis (Emas & Zamrud)' },
              { id: 'MODERN_CLEAN', label: 'Modern Clean Academy (Biru & Putih)' },
              { id: 'TWILIGHT_OASIS', label: 'Twilight Dark (Elegan & Nyaman di Mata)' }
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setActiveTheme(th.id as any)}
                className={`w-full p-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                  activeTheme === th.id
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{th.label}</span>
                {activeTheme === th.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Efficiency & Quiet Modes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            Efisiensi Perangkat Rendah
          </h2>

          <div className="space-y-3">
            <div
              onClick={() => setQuietMode(!quietMode)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 block">Quiet Mode (Matikan Animasi)</span>
                <span className="text-[10px] text-slate-500">Hemat CPU & stabil di ponsel low-end</span>
              </div>
              <input
                type="checkbox"
                checked={quietMode}
                readOnly
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
            </div>

            <div
              onClick={() => setBatterySaver(!batterySaver)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 block">Battery Saver (Optimasi Render)</span>
                <span className="text-[10px] text-slate-500">Pangkas interval polling background</span>
              </div>
              <input
                type="checkbox"
                checked={batterySaver}
                readOnly
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
