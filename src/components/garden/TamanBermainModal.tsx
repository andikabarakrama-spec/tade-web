import React, { useState } from 'react';
import { X, Sparkles, Star, Smile, Heart, Play, RefreshCw } from 'lucide-react';
import { PlaygroundRide, kampungCeriaService } from '../../services/kampungCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const TamanBermainModal: React.FC<Props> = ({ onClose }) => {
  const rides = kampungCeriaService.getPlaygroundRides();
  const [activeRideId, setActiveRideId] = useState<string | null>(null);
  const [playingMessage, setPlayingMessage] = useState<string>('Pilih salah satu wahana untuk bermain bersama sahabat!');

  const handlePlayRide = (ride: PlaygroundRide) => {
    setActiveRideId(ride.id);
    setPlayingMessage(`Asy & sahabat sedang ${ride.actionWord.toLowerCase()} di ${ride.name}! 🎠`);
    tadeSoundEngine.playFx('PLAYGROUND_SWING');

    if (ride.id === 'ride_perosotan') {
      kampungCeriaService.unlockSticker('stk_pelangi');
    }

    setTimeout(() => {
      setActiveRideId(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-50 to-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-sky-300 overflow-hidden">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Taman Bermain Pelangi (Sprint G17 P3)
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            Taman Bermain Ceria Asy & Syifa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Wahana bermain yang aman, bersih, dan menyenangkan untuk melatih ketangkasan serta kebersamaan santri.
          </p>
        </div>

        {/* Live Active Ride Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl animate-pulse">
              🎠
            </div>
            <div>
              <div className="text-xs text-sky-200 font-bold uppercase tracking-wide">Suasana Bermain Saat Ini</div>
              <div className="text-sm sm:text-base font-bold">{playingMessage}</div>
            </div>
          </div>
        </div>

        {/* Grid of 6 Rides */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {rides.map(ride => {
            const isSelected = activeRideId === ride.id;
            return (
              <div
                key={ride.id}
                onClick={() => handlePlayRide(ride)}
                className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50 shadow-lg scale-105 ring-2 ring-amber-300'
                    : 'border-sky-200 bg-white hover:border-sky-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl sm:text-4xl">{ride.emoji}</div>
                  <div className={`p-1.5 rounded-full ${isSelected ? 'bg-amber-400 text-slate-900 animate-spin' : 'bg-sky-100 text-sky-600'}`}>
                    <Play className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">{ride.name}</div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-tight line-clamp-2">{ride.description}</p>
                <div className="mt-2 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                  {ride.actionWord}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-sky-100">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-amber-500" />
            Bermain tertib & saling bergantian
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all"
          >
            Tutup Taman
          </button>
        </div>
      </div>
    </div>
  );
};
