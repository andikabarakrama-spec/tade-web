import React from 'react';
import { Sparkles, Play, Pause, Zap } from 'lucide-react';

interface StarProjectorBeamProps {
  isOn: boolean;
  isPlaying: boolean;
  onTogglePower: () => void;
  isEcoMode?: boolean;
}

export const StarProjectorBeam: React.FC<StarProjectorBeamProps> = ({
  isOn,
  isPlaying,
  onTogglePower,
  isEcoMode = false
}) => {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Volumetric Soft Light Beam (Fanning upwards onto the celestial screen) */}
      {isOn && (
        <div className="relative w-full flex justify-center pointer-events-none mb-1 overflow-visible">
          <div
            className={`w-72 sm:w-96 md:w-[480px] h-36 sm:h-48 md:h-56 bg-gradient-to-t from-amber-300/40 via-amber-200/15 to-transparent rounded-t-[100px] blur-sm transition-all duration-700 transform origin-bottom ${
              isPlaying && !isEcoMode ? 'animate-pulse' : ''
            }`}
            style={{
              clipPath: 'polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%)'
            }}
          />

          {/* Stardust Shimmer inside beam */}
          {!isEcoMode && (
            <div className="absolute inset-0 flex items-center justify-center space-x-8 opacity-70">
              <span className="text-amber-200 text-xs animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
              <span className="text-yellow-100 text-sm animate-ping" style={{ animationDelay: '0.8s' }}>⭐</span>
              <span className="text-amber-300 text-xs animate-bounce" style={{ animationDelay: '0.5s' }}>✨</span>
            </div>
          )}
        </div>
      )}

      {/* Cute 3D Cartoon Star Projector Body */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing Lens Ring */}
        <div className="relative mb-[-8px]">
          <div
            className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              isOn
                ? 'bg-amber-300 border-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.8)]'
                : 'bg-slate-700 border-slate-600 shadow-none'
            }`}
          >
            {isOn ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-900 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800" />
            )}
          </div>
        </div>

        {/* Projector Box */}
        <div className="w-40 sm:w-48 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-3 shadow-xl flex items-center justify-between">
          {/* Film Reels (Spinning when playing) */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full border-2 border-amber-400/80 bg-indigo-950 flex items-center justify-center transition-transform ${
                isPlaying && !isEcoMode ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 border-amber-300/60 bg-indigo-950 flex items-center justify-center transition-transform ${
                isPlaying && !isEcoMode ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s', animationDirection: 'reverse' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            </div>
          </div>

          {/* Projector Label & Power Switch */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-amber-300 tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> PROYEKTOR G26
            </span>
            <button
              onClick={onTogglePower}
              className={`mt-1 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                isOn
                  ? 'bg-amber-400 text-indigo-950 hover:bg-amber-300 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isOn ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isOn ? 'Menyala' : 'Padam'}
            </button>
          </div>
        </div>

        {/* Projector Tripod Stand */}
        <div className="flex justify-center space-x-4 mt-[-2px]">
          <div className="w-1.5 h-6 bg-indigo-700 transform -rotate-12 rounded-b" />
          <div className="w-1.5 h-7 bg-indigo-600 rounded-b" />
          <div className="w-1.5 h-6 bg-indigo-700 transform rotate-12 rounded-b" />
        </div>
      </div>
    </div>
  );
};
