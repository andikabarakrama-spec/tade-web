import React, { useEffect, useState } from 'react';
import { Sparkles, X, Play, Square, Timer, Heart, Star, Flag } from 'lucide-react';
import { festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose?: () => void;
}

export const KarnavalKampungLayer: React.FC<Props> = ({ onClose }) => {
  const [status, setStatus] = useState(festivalCeriaService.getCarnivalStatus());

  useEffect(() => {
    const unsub = festivalCeriaService.subscribe(() => {
      setStatus(festivalCeriaService.getCarnivalStatus());
    });
    return () => unsub();
  }, []);

  const handleStart = () => {
    festivalCeriaService.startCarnival();
  };

  const handleStop = () => {
    festivalCeriaService.stopCarnival();
  };

  // Determine which carnival element is in focus based on progress (0-100%)
  // Phase 1 (0-20%): Kereta Cerita & Konduktor
  // Phase 2 (20-40%): Bus Sekolah Ceria
  // Phase 3 (40-60%): Balon Raksasa Pelangi & Kupu-kupu
  // Phase 4 (60-85%): Sahabat Berjalan Bergandengan Tangan
  // Phase 5 (85-100%): Finale Kembang Api Kartun & Tepuk Tangan
  let currentSegment = 'Menunggu Dimulai';
  let activeEmoji = '🎪';
  if (status.isRunning) {
    if (status.progress < 20) {
      currentSegment = '🚂 Kereta Cerita Melintas di Garis Depan';
      activeEmoji = '🚂💨';
    } else if (status.progress < 40) {
      currentSegment = '🚌 Bus Sekolah Ceria Membawa Santri Cilik';
      activeEmoji = '🚌✨';
    } else if (status.progress < 60) {
      currentSegment = '🎈 Balon Pelangi & 🦋 Kupu-kupu Menari di Angkasa';
      activeEmoji = '🎈🦋';
    } else if (status.progress < 85) {
      currentSegment = '👫 Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara Bergandengan';
      activeEmoji = '👦👧🐰🐻';
    } else {
      currentSegment = '🎉 Puncak Parade — Hujan Bunga & Lambaian Sahabat!';
      activeEmoji = '🎊🌟';
    }
  } else if (status.progress >= 100) {
    currentSegment = '🎉 Karnaval Selesai dengan Sempurna! (20 Detik Penuh Senyum)';
    activeEmoji = '🏆✨';
  }

  const remainingSeconds = Math.max(0, Math.ceil(20 * (1 - status.progress / 100)));

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-orange-500 p-6 sm:p-8 text-white" id="karnaval-kampung-root">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider mb-2">
            <Flag className="w-3.5 h-3.5" />
            Sprint G18 P3 — Karnaval 20 Detik
          </div>
          <h3 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
            Karnaval Kampung Asy & Syifa
            <span className="text-3xl">🎺</span>
          </h3>
          <p className="text-amber-100 text-xs sm:text-sm font-medium mt-0.5">
            Kereta Cerita, bus sekolah, balon ceria, kupu-kupu, dan seluruh sahabat berjalan berdampingan!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!status.isRunning ? (
            <button
              onClick={handleStart}
              className="px-5 py-2.5 rounded-2xl bg-white text-orange-600 font-black text-xs sm:text-sm shadow-xl hover:bg-amber-50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-orange-600" />
              Putar Karnaval (20s)
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-4 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-lg hover:bg-red-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              Hentikan
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 20-Second Progress Bar */}
      <div className="space-y-1.5 mb-6">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-amber-100 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" />
            {status.isRunning ? `Berlangsung... Sisa: ${remainingSeconds} detik` : 'Durasi Bersahabat (20 Detik Mandiri)'}
          </span>
          <span className="text-white font-black">{status.progress}%</span>
        </div>
        <div className="w-full h-3.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/30">
          <div
            className="h-full bg-gradient-to-r from-amber-200 to-white rounded-full transition-all duration-200"
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>

      {/* Animated Cartoon Parade Runway Canvas */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 border-4 border-white overflow-hidden shadow-inner p-4 flex flex-col justify-between">
        {/* Sky with Clouds & Balloons */}
        <div className="flex justify-between items-center px-4 pointer-events-none opacity-80">
          <span className="text-2xl animate-pulse">☁️</span>
          <span className="text-3xl animate-bounce">🎈</span>
          <span className="text-2xl animate-pulse">☁️</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🦋</span>
          <span className="text-2xl animate-pulse">☁️</span>
        </div>

        {/* Dynamic Moving Characters Track */}
        <div className="relative w-full h-20 flex items-center overflow-hidden">
          {/* Moving Group across track */}
          <div 
            className="absolute flex items-center gap-3 transition-all duration-300 select-none"
            style={{
              left: status.isRunning ? `${Math.min(85, Math.max(5, status.progress))}%` : '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Lead Mascot / Vehicle according to phase */}
            {status.progress < 25 && (
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 shadow-xl border-2 border-amber-400">
                <span className="text-3xl sm:text-4xl animate-bounce">🚂</span>
                <span className="text-xs font-black text-slate-800">Kereta Cerita</span>
              </div>
            )}

            {status.progress >= 25 && status.progress < 50 && (
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 shadow-xl border-2 border-amber-400">
                <span className="text-3xl sm:text-4xl animate-bounce">🚌</span>
                <span className="text-xs font-black text-slate-800">Bus Sekolah Ceria</span>
              </div>
            )}

            {status.progress >= 50 && status.progress < 75 && (
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/95 shadow-xl border-2 border-pink-400">
                <span className="text-3xl sm:text-4xl animate-pulse">🎈🦋</span>
                <span className="text-xs font-black text-slate-800">Karnaval Balon & Kupu</span>
              </div>
            )}

            {status.progress >= 75 && (
              <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-white/95 shadow-xl border-2 border-emerald-400">
                <span className="text-2xl animate-bounce">👦</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>👧</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🐰</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🐻</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🐝</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🦆</span>
                <span className="text-xs font-black text-emerald-900 ml-1">Pawai Sahabat!</span>
              </div>
            )}
          </div>
        </div>

        {/* Cobblestone Village Road Floor */}
        <div className="w-full h-7 rounded-xl bg-amber-200/90 border-t-2 border-amber-300 flex items-center justify-around px-2 text-xs text-amber-800 font-bold opacity-80">
          <span>🌸</span>
          <span>🌻</span>
          <span>🌿 Jalan Utama Kampung Ceria 🌿</span>
          <span>🌻</span>
          <span>🌸</span>
        </div>
      </div>

      {/* Current Parade Announcement Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-200" />
          {currentSegment}
        </span>
        <span className="text-2xl">{activeEmoji}</span>
      </div>
    </div>
  );
};
