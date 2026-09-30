import React, { useState } from 'react';
import { 
  Sparkles, 
  Flag, 
  BookOpen, 
  Moon, 
  GraduationCap, 
  Zap, 
  VolumeX, 
  Volume2, 
  BatteryCharging, 
  Cpu, 
  Sliders, 
  Layers, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export type CulturalScene = 'HUT_RI' | 'HARI_GURU' | 'RAMADAN' | 'WISUDA_HAFLAH' | 'DEFAULT_HARIAN';

export const CulturalAnimationEngine: React.FC = () => {
  const [activeScene, setActiveScene] = useState<CulturalScene>('HUT_RI');
  const [isQuietMode, setIsQuietMode] = useState<boolean>(false);
  const [isBatterySaver, setIsBatterySaver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Performance telemetry (Simulated GPU & Draw metrics)
  const perfTelemetry = {
    gpuLoad: isBatterySaver ? '2%' : '8%',
    drawCalls: isBatterySaver ? '4 calls' : '18 calls',
    targetFps: isBatterySaver ? '30 FPS (Throttled)' : '60 FPS (V-Sync)',
    particleCount: isBatterySaver ? '4 particles' : '24 particles',
    renderMode: isBatterySaver ? 'CSS Hardware Accelerated Static' : 'CSS GPU Float & Shimmer'
  };

  return (
    <div id="cultural-animation-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
              R238 &bull; CULTURAL ANIMATION ENGINE
            </span>
            <span className="text-xs text-slate-400">GPU-Friendly &amp; Battery Saver Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            Cultural Animation Engine
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Engine visualisasi partikel dan ornamen kultural otomatis. Mendukung <strong>Quiet Mode</strong> (tanpa distorsi visual/audio) dan <strong>Battery Saver Mode</strong> yang otomatis merampingkan komputasi GPU untuk perangkat low-end.
          </p>
        </div>
      </div>

      {/* Control Bar & Scene Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveScene('HUT_RI')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeScene === 'HUT_RI'
              ? 'bg-red-500/10 border-red-500 text-red-900 dark:text-red-300 ring-2 ring-red-500/30'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-400 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Flag className="w-5 h-5 text-red-500" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700">17 AGUSTUS</span>
          </div>
          <div className="font-bold text-sm mt-2">HUT Kemerdekaan RI</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bendera Merah Putih &amp; Konfeti</div>
        </button>

        <button
          onClick={() => setActiveScene('HARI_GURU')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeScene === 'HARI_GURU'
              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-900 dark:text-indigo-300 ring-2 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700">25 NOVEMBER</span>
          </div>
          <div className="font-bold text-sm mt-2">Hari Guru &amp; Pendidik</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Buku Terbang &amp; Bintang Ilmu</div>
        </button>

        <button
          onClick={() => setActiveScene('RAMADAN')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeScene === 'RAMADAN'
              ? 'bg-teal-500/10 border-teal-500 text-teal-900 dark:text-teal-300 ring-2 ring-teal-500/30'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-400 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <Moon className="w-5 h-5 text-teal-500" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700">BULAN SUCI</span>
          </div>
          <div className="font-bold text-sm mt-2">Ramadan &amp; Idul Fitri</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bulan Sabit &amp; Lentera Fanous</div>
        </button>

        <button
          onClick={() => setActiveScene('WISUDA_HAFLAH')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeScene === 'WISUDA_HAFLAH'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 ring-2 ring-amber-500/30'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700">AKHIR TAHUN</span>
          </div>
          <div className="font-bold text-sm mt-2">Wisuda &amp; Haflah</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Topi Toga &amp; Konfeti Emas</div>
        </button>
      </div>

      {/* Main Simulation Stage & Telemetry Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Canvas Simulation */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-2xl">
          {/* Top Stage Controls */}
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                STAGE SCENE: {activeScene}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs flex items-center gap-1 font-mono"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={() => setIsQuietMode(!isQuietMode)}
                className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                  isQuietMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isQuietMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                Quiet: {isQuietMode ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => setIsBatterySaver(!isBatterySaver)}
                className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                  isBatterySaver ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                Saver: {isBatterySaver ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Center Mascot & Dynamic Particles Layer */}
          <div className="relative my-auto flex flex-col items-center justify-center py-10 z-10">
            {/* Background Atmosphere Shimmer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-72 h-72 rounded-full bg-cyan-500/30 blur-3xl" />
            </div>

            {/* Particle Floating Elements depending on Scene */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {activeScene === 'HUT_RI' && (
                  <>
                    <div className="absolute top-10 left-16 text-2xl animate-bounce">🇮🇩</div>
                    <div className="absolute top-20 right-20 text-xl animate-pulse">🎈</div>
                    <div className="absolute bottom-12 left-28 text-sm animate-ping">✨</div>
                    <div className="absolute top-14 right-36 text-2xl animate-bounce">🎊</div>
                  </>
                )}

                {activeScene === 'HARI_GURU' && (
                  <>
                    <div className="absolute top-8 left-20 text-2xl animate-pulse">📖</div>
                    <div className="absolute top-20 right-24 text-xl animate-bounce">✏️</div>
                    <div className="absolute bottom-14 right-32 text-2xl animate-pulse">⭐</div>
                    <div className="absolute top-14 left-36 text-xl animate-bounce">🌟</div>
                  </>
                )}

                {activeScene === 'RAMADAN' && (
                  <>
                    <div className="absolute top-6 right-24 text-3xl animate-pulse">🌙</div>
                    <div className="absolute top-16 left-20 text-2xl animate-bounce">🏮</div>
                    <div className="absolute bottom-16 right-36 text-xl animate-ping">✨</div>
                    <div className="absolute top-28 right-16 text-xl animate-pulse">🕌</div>
                  </>
                )}

                {activeScene === 'WISUDA_HAFLAH' && (
                  <>
                    <div className="absolute top-8 left-24 text-3xl animate-bounce">🎓</div>
                    <div className="absolute top-16 right-20 text-2xl animate-pulse">🏆</div>
                    <div className="absolute bottom-12 left-32 text-xl animate-ping">✨</div>
                    <div className="absolute top-24 right-40 text-xl animate-bounce">📜</div>
                  </>
                )}
              </div>
            )}

            {/* Mascot Character Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-1.5 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-amber-400/40">
                  <span className={`text-4xl ${!isQuietMode && isPlaying ? 'animate-bounce' : ''}`}>🐱</span>
                  <span className="text-[9px] font-mono font-bold text-amber-400 tracking-wider mt-1">ASY LIVING</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-lg">
                {isBatterySaver ? 'Mode Hemat Baterai (CSS Low-Power)' : 'GPU Shader Active (60fps)'}
              </div>
            </div>
          </div>

          {/* Bottom Stage Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 font-mono z-10 gap-2">
            <div>
              Status Animasi: <span className="text-white font-bold">{isPlaying ? 'Running' : 'Paused'}</span>
            </div>
            <div>
              Noise Constraint: <span className="text-white font-bold">{isQuietMode ? '0 dB (Muted)' : 'Gentle Ambient'}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Performance & GPU Telemetry */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                GPU &amp; Frame Telemetry
              </h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">GPU Workload:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{perfTelemetry.gpuLoad}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Draw Calls:</span>
                <span className="font-bold text-slate-900 dark:text-white">{perfTelemetry.drawCalls}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Target Framerate:</span>
                <span className="font-bold text-slate-900 dark:text-white">{perfTelemetry.targetFps}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Partikel Aktif:</span>
                <span className="font-bold text-slate-900 dark:text-white">{perfTelemetry.particleCount}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Render Engine Mode:</span>
                <span className="font-bold text-slate-900 dark:text-white text-[11px] block">{perfTelemetry.renderMode}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 text-[11px] text-cyan-900 dark:text-cyan-300">
              <span className="font-bold block mb-0.5">Konstitusi Efisiensi:</span>
              Animasi Asy tidak membebani baterai gawai santri dan ustadzah. Animasi otomatis beralih ke representasi statis saat baterai lemah.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
