import React, { useState } from 'react';
import { 
  Sun, Moon, Cloud, Sparkles, Volume2, 
  Wind, ShieldCheck, BatteryCharging, Zap 
} from 'lucide-react';
import { SchoolEventTheme, livingEventEngine } from '../../services/livingEventEngine';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';

interface DynamicSkyViewProps {
  eventTheme: SchoolEventTheme;
  isEcoMode?: boolean;
  onPlayChime?: () => void;
}

export const DynamicSkyView: React.FC<DynamicSkyViewProps> = ({
  eventTheme,
  isEcoMode = false,
  onPlayChime
}) => {
  const [clickedDecor, setClickedDecor] = useState<string | null>(null);

  const handleDecorClick = (label: string) => {
    setClickedDecor(label);
    if (onPlayChime) {
      onPlayChime();
    } else {
      livingEventEngine.playEventChime();
    }
    setTimeout(() => setClickedDecor(null), 1800);
  };

  const sky = eventTheme.sky;

  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-700 bg-gradient-to-b ${sky.skyGradient} p-6 sm:p-8 min-h-[360px] flex flex-col justify-between`}
      id="tade-dynamic-sky-view"
    >
      {/* Sky Tint Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${sky.skyTint} pointer-events-none`} />

      {/* Floating Animated Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-4 left-6 opacity-80 ${!isEcoMode ? 'animate-dna-breathing' : ''}`}>
          <Cloud className={`w-24 h-24 ${sky.cloudStyle === 'GOLDEN_GLOW' ? 'text-amber-100/70' : sky.cloudStyle === 'TWILIGHT_PURPLE' ? 'text-purple-200/50' : sky.cloudStyle === 'EMERALD_MIST' ? 'text-emerald-100/50' : 'text-white/70'}`} />
        </div>
        <div className={`absolute top-12 right-16 opacity-70 ${!isEcoMode ? 'animate-pulse' : ''}`}>
          <Cloud className={`w-32 h-32 ${sky.cloudStyle === 'GOLDEN_GLOW' ? 'text-yellow-100/60' : 'text-white/60'}`} />
        </div>
        <div className={`absolute top-28 left-1/3 opacity-60 ${!isEcoMode ? 'animate-dna-breathing' : ''}`}>
          <Cloud className="w-20 h-20 text-white/50" />
        </div>
      </div>

      {/* Dynamic Celestial Body (Top Right) */}
      <div className="absolute top-6 right-8 z-10">
        {sky.celestialBody === 'MOON_CRESCENT' && (
          <button 
            type="button"
            onClick={() => handleDecorClick('Bulan Sabit Berkah')}
            className="group relative flex items-center justify-center p-3 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 hover:scale-110 transition-transform cursor-pointer"
            title="Klik untuk mendengar lonceng keberkahan"
          >
            <Moon className="w-12 h-12 text-amber-300 fill-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-dna-breathing" />
            <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
          </button>
        )}

        {sky.celestialBody === 'BRIGHT_SUN' && (
          <button 
            type="button"
            onClick={() => handleDecorClick('Matahari Ceria')}
            className="group relative flex items-center justify-center p-3 rounded-full bg-amber-400/30 backdrop-blur-md border border-amber-300/60 hover:scale-110 transition-transform cursor-pointer"
            title="Klik untuk menyapa matahari ceria"
          >
            <Sun className="w-14 h-14 text-amber-400 fill-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-[spin_20s_linear_infinite]" />
            <Sparkles className="w-5 h-5 text-white absolute -top-1 -left-1 animate-ping" />
          </button>
        )}

        {sky.celestialBody === 'GOLDEN_SUNSET' && (
          <button 
            type="button"
            onClick={() => handleDecorClick('Mentari Senja Emas')}
            className="group relative flex items-center justify-center p-4 rounded-full bg-orange-500/25 backdrop-blur-md border border-amber-400/50 hover:scale-110 transition-transform cursor-pointer"
            title="Klik untuk merasakan kehangatan senja"
          >
            <Sun className="w-12 h-12 text-amber-300 fill-amber-300 drop-shadow-[0_0_25px_rgba(249,115,22,0.9)]" />
          </button>
        )}

        {sky.celestialBody === 'RAINBOW_SKY' && (
          <button 
            type="button"
            onClick={() => handleDecorClick('Pelangi Ceria Taaruf')}
            className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/30 backdrop-blur-md border border-white/50 hover:scale-105 transition-transform cursor-pointer shadow-lg"
          >
            <span className="text-3xl animate-bounce">🌈</span>
            <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">Pelangi Indah</span>
          </button>
        )}

        {sky.celestialBody === 'STARRY_NIGHT' && (
          <button 
            type="button"
            onClick={() => handleDecorClick('Bintang Resolusi')}
            className="group relative flex items-center justify-center p-3 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-300/40 hover:scale-110 transition-transform cursor-pointer"
          >
            <Sparkles className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
          </button>
        )}

        {sky.celestialBody === 'FESTIVE_TWILIGHT' && (
          <button 
            type="button"
            onClick={() => handleDecorClick('Kembang Api Milad')}
            className="group relative flex items-center justify-center p-3 rounded-full bg-purple-500/30 backdrop-blur-md border border-purple-300/50 hover:scale-110 transition-transform cursor-pointer"
          >
            <Sparkles className="w-12 h-12 text-amber-300 animate-spin" />
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{eventTheme.badge}</span>
          <span className="text-white/40">•</span>
          <span className="text-amber-300">{eventTheme.dateRangeLabel}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight leading-tight">
          {eventTheme.title}
        </h2>
        <p className="text-sm sm:text-base text-white/90 font-medium mt-1 drop-shadow">
          {eventTheme.tagline}
        </p>

        {clickedDecor && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold animate-bounce shadow-lg">
            <Volume2 className="w-4 h-4" />
            <span>Harmoni Berbunyi: {clickedDecor}</span>
          </div>
        )}
      </div>

      {/* Floating Decorations (Max 4-5 items per mandate) */}
      <div className="relative z-10 py-6 flex flex-wrap items-center gap-3">
        {eventTheme.decorations.map((dec) => (
          <button
            key={dec.id}
            type="button"
            onClick={() => handleDecorClick(dec.label)}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${!isEcoMode ? dec.animationClass : ''}`}
          >
            <span className="text-xl group-hover:scale-125 transition-transform">{dec.icon}</span>
            <span className="text-xs font-bold drop-shadow">{dec.label}</span>
          </button>
        ))}
      </div>

      {/* Mascot Horizon with Costumes */}
      <div className="relative z-10 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <CartoonCharacterSvg 
              type="ASY" 
              size={76} 
              expression="SENYUM" 
              movement={isEcoMode ? 'DIAM' : 'LANGKAH_KECIL'} 
              className="drop-shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-[10px] font-black text-white shadow">
              Dek Asy
            </span>
          </div>

          <div className="relative group">
            <CartoonCharacterSvg 
              type="SYIFA" 
              size={76} 
              expression="SENYUM" 
              movement={isEcoMode ? 'DIAM' : 'ANGGUK_SANTUN'} 
              className="drop-shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-teal-600 text-[10px] font-black text-white shadow">
              Mbak Syifa
            </span>
          </div>

          <div className="hidden md:block pl-2 border-l border-white/20 max-w-sm">
            <p className="text-xs text-white/90 italic font-medium leading-snug">
              &ldquo;{eventTheme.mascotGreetingAsy}&rdquo;
            </p>
            <p className="text-[11px] text-amber-200 mt-0.5 font-bold">
              Kostum: {eventTheme.costumes.asy.title}
            </p>
          </div>
        </div>

        {/* Action button & Audio synthesizer trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onPlayChime) onPlayChime();
              else livingEventEngine.playEventChime();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl hover:bg-amber-100 active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Harmoni Suasana</span>
          </button>
        </div>
      </div>

      {/* Performance Governor Badge */}
      <div className="absolute bottom-2 right-4 text-[10px] text-white/60 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-300" />
        <span>Governor Animasi: &le; 5 Aktif (60 FPS)</span>
      </div>
    </div>
  );
};
