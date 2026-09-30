import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Cloud, CloudRain, Sparkles, Clock, Compass, 
  Wind, Eye, RotateCcw, Trophy, Volume2, ShieldCheck, Heart, Flag, Award, Gift
} from 'lucide-react';
import { 
  livingWorldEngine, TimePhase, CheerfulWeather, 
  TimePhaseConfig, WeatherConfig, SeasonalTreeConfig, GoldenSurprise 
} from '../../services/livingWorldEngine';
import { PohonMusimSekolah } from './PohonMusimSekolah';
import { TamanBergerakLayer } from './TamanBergerakLayer';
import { JamCeriaWidget } from './JamCeriaWidget';
import { GoldenSurpriseLayer } from './GoldenSurpriseLayer';
import { LivingEventEngine } from '../../services/livingEventEngine';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const DuniaAsyLivingEnvironment: React.FC = () => {
  const [timePhase, setTimePhase] = useState<TimePhase>(() => livingWorldEngine.getTimePhase());
  const [weather, setWeather] = useState<CheerfulWeather>(() => livingWorldEngine.getWeather());
  const [treeConfig, setTreeConfig] = useState<SeasonalTreeConfig>(() => livingWorldEngine.getSeasonalTreeConfig());
  const [kiteFlying, setKiteFlying] = useState<boolean>(false);
  const [dewSparkle, setDewSparkle] = useState<boolean>(false);

  useEffect(() => {
    const unsub = livingWorldEngine.subscribe(() => {
      setTimePhase(livingWorldEngine.getTimePhase());
      setWeather(livingWorldEngine.getWeather());
      setTreeConfig(livingWorldEngine.getSeasonalTreeConfig());
    });
    return unsub;
  }, []);

  const handleTimeChange = (phase: TimePhase) => {
    livingWorldEngine.setTimePhaseOverride(phase);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
  };

  const handleWeatherChange = (w: CheerfulWeather) => {
    livingWorldEngine.setWeatherOverride(w);
    tadeSoundEngine.playFx('WEATHER_BREEZE');
  };

  const handleResetToAuto = () => {
    livingWorldEngine.setTimePhaseOverride(null);
    livingWorldEngine.setWeatherOverride(null);
    tadeSoundEngine.playFx('TV_CLICK');
  };

  const handleTriggerGolden = () => {
    livingWorldEngine.triggerManualGoldenSurprise();
  };

  const timeConfig: TimePhaseConfig = livingWorldEngine.getTimePhaseConfig(timePhase);
  const weatherConfig: WeatherConfig = livingWorldEngine.getWeatherConfig(weather);
  const activeSchoolEvent = LivingEventEngine.getInstance().getActiveEvent();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-400/80 shadow-2xl transition-all duration-700 bg-slate-950">
      
      {/* Master Golden Surprise Layer */}
      <GoldenSurpriseLayer />

      {/* Dynamic Animated Sky Canvas (P1 & P2) */}
      <div className={`relative w-full p-6 sm:p-8 bg-gradient-to-b ${timeConfig.skyGradient} transition-all duration-1000 overflow-hidden`}>
        
        {/* Weather Specific Atmospheric Overlay (P2) */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${weatherConfig.overlayClass}`}>
          {weather === 'GERIMIS' && (
            <div className="absolute inset-0 flex justify-around opacity-40 text-blue-900 animate-pulse text-xs">
              <span>💧</span><span>💧</span><span>💧</span><span>💧</span><span>💧</span><span>💧</span><span>💧</span><span>💧</span>
            </div>
          )}
          {weather === 'HUJAN_PELAN' && (
            <div className="absolute inset-0 flex justify-around opacity-60 text-blue-950 text-sm animate-bounce">
              <span>🌧️</span><span>🌧️</span><span>🌧️</span><span>🌧️</span><span>🌧️</span><span>🌧️</span>
            </div>
          )}
          {weather === 'PELANGI' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-64 h-24 rounded-t-full border-t-8 border-red-500/70 border-x-8 border-yellow-400/60 opacity-90 shadow-xl pointer-events-none flex items-center justify-center">
              <span className="text-4xl animate-pulse">🌈</span>
            </div>
          )}
        </div>

        {/* P1 Celestial Elements (Matahari, Burung, Awan, Layang-layang, Bulan, Bintang) */}
        <div className="absolute top-4 right-6 pointer-events-none flex items-center gap-3">
          {timePhase === 'PAGI' && (
            <div className="flex items-center gap-2 animate-bounce">
              <span className="text-4xl filter drop-shadow-md">☀️</span>
              <div className="hidden sm:block text-[10px] font-black bg-white/90 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 shadow">
                Matahari Tersenyum
              </div>
            </div>
          )}
          {timePhase === 'SIANG' && (
            <div className="flex items-center gap-2">
              <span className="text-4xl filter drop-shadow-lg animate-spin-slow">🌞</span>
              <span className="text-2xl animate-pulse">☁️</span>
            </div>
          )}
          {timePhase === 'SORE' && (
            <div className="flex items-center gap-2">
              <span className="text-4xl filter drop-shadow-md">🌅</span>
              <span 
                onClick={() => setKiteFlying(!kiteFlying)} 
                className="text-2xl pointer-events-auto cursor-pointer animate-bounce hover:scale-125 transition-transform" 
                title="Layang-layang Sore"
              >
                🪁
              </span>
            </div>
          )}
          {timePhase === 'MALAM' && (
            <div className="flex items-center gap-2">
              <span className="text-4xl filter drop-shadow-lg text-amber-200">🌙</span>
              <div className="flex gap-1 text-xs animate-pulse text-yellow-300">
                <span>✨</span><span>⭐</span><span>✨</span>
              </div>
            </div>
          )}
        </div>

        {/* Header Title and Control Center */}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-amber-300 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow">
                  <Compass className="w-3 h-3" />
                  Sprint G16 • Dunia Asy yang Hidup
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {timeConfig.label} • Cuaca: {weatherConfig.name} {weatherConfig.emoji}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                {timeConfig.elementHighlights.join(' • ')}
              </p>
            </div>

            {/* Quick Trigger Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerGolden}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow transition cursor-pointer"
                title="Pancing Kejutan Emas Muncul Sekarang"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-900" />
                <span>Pancing Emas (P7)</span>
              </button>

              <button
                onClick={handleResetToAuto}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                title="Kembalikan Waktu & Cuaca ke Otomatis Sistem"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>
          </div>

          {/* Interactive P1 Time Phase Bar & P2 Weather Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* P1 Time Phase Selector */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-amber-300/80 space-y-1.5">
              <div className="text-[10px] uppercase font-black tracking-wider text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span>P1 • Pergantian Waktu</span>
                <span className="text-amber-600 font-extrabold">{timeConfig.hourRange}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['PAGI', 'SIANG', 'SORE', 'MALAM'] as TimePhase[]).map((phase) => (
                  <button
                    key={phase}
                    onClick={() => handleTimeChange(phase)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                      timePhase === phase
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-105 border-2 border-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
                    }`}
                  >
                    <span className="text-base">
                      {phase === 'PAGI' ? '☀️' : phase === 'SIANG' ? '🌞' : phase === 'SORE' ? '🌅' : '🌙'}
                    </span>
                    <span className="text-[10px] mt-0.5">{phase}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* P2 Weather Selector */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-amber-300/80 space-y-1.5">
              <div className="text-[10px] uppercase font-black tracking-wider text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span>P2 • Cuaca Ceria</span>
                <span className="text-emerald-600 font-extrabold">{weatherConfig.name}</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {(['CERAH', 'BERAWAN', 'GERIMIS', 'HUJAN_PELAN', 'PELANGI'] as CheerfulWeather[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => handleWeatherChange(w)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                      weather === w
                        ? 'bg-emerald-400 text-slate-950 shadow-md scale-105 border-2 border-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span className="text-sm">
                      {w === 'CERAH' ? '☀️' : w === 'BERAWAN' ? '⛅' : w === 'GERIMIS' ? '🌦️' : w === 'HUJAN_PELAN' ? '🌧️' : '🌈'}
                    </span>
                    <span className="truncate w-full text-center mt-0.5">{w === 'HUJAN_PELAN' ? 'Hujan' : w}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* P5 Jam Ceria Widget */}
          <JamCeriaWidget />

          {/* P6 Special Academic/Islamic Event Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-teal-900/80 via-emerald-900/80 to-slate-900/80 border border-teal-400/50 text-white backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-teal-400 text-slate-950">
                    P6 • Acara Spesial Aktif
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    {activeSchoolEvent.title}
                  </span>
                </div>
                <p className="text-[11px] text-teal-100 leading-snug">
                  Kostum Asy & Syifa, dekorasi panggung, dan tema TV otomatis bersolek sesuai {activeSchoolEvent.badge}!
                </p>
              </div>
            </div>
          </div>

          {/* Center Stage: P3 Pohon Musim & P4 Taman Bergerak */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
            
            {/* P3 Pohon Musim Sekolah (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <PohonMusimSekolah />
            </div>

            {/* P4 Taman Bergerak & Visual Story Living Layer (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <TamanBergerakLayer />

              {/* Rumah Asy Night Light / Day Glow Indicator */}
              <div className="p-4 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-100 backdrop-blur-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border-2 ${
                    timePhase === 'MALAM' ? 'bg-amber-400 text-slate-950 border-white animate-pulse' : 'bg-emerald-900 text-emerald-200 border-emerald-600'
                  }`}>
                    {timePhase === 'MALAM' ? '💡' : '🏡'}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">
                      {timePhase === 'MALAM' ? 'Lampu Rumah Asy Menyala Hangat' : 'Halaman Asri Rumah Asy & Syifa'}
                    </h4>
                    <p className="text-[11px] text-emerald-200">
                      {timePhase === 'MALAM'
                        ? 'Jendela memancarkan cahaya kuning hangat menyambut waktu istirahat dan tadarus malam.'
                        : 'Sinar mentari dan semilir angin menghidupkan bunga dan pepohonan di pekarangan sekolah.'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-800 text-amber-300 shrink-0">
                  {timePhase === 'MALAM' ? 'Mode Malam 🌙' : 'Mode Siang ☀️'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
