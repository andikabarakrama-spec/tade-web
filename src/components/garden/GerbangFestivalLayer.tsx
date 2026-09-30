import React from 'react';
import { Sparkles, Flag, Heart, Star, PartyPopper } from 'lucide-react';
import { festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onEnterFestival?: () => void;
}

export const GerbangFestivalLayer: React.FC<Props> = ({ onEnterFestival }) => {
  const details = festivalCeriaService.getGerbangDetails();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-sky-300 via-amber-100 to-emerald-100 p-6 sm:p-8" id="gerbang-festival-root">
      {/* Decorative Sky Streamers & Bunting Flags */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-around pointer-events-none opacity-90 overflow-hidden">
        {['🚩', '🎈', '🌸', '🚩', '🎀', '🎈', '🚩', '🌸', '🎈', '🚩'].map((flag, idx) => (
          <span 
            key={idx} 
            className="text-2xl sm:text-3xl animate-bounce"
            style={{ animationDelay: `${idx * 0.15}s`, animationDuration: '2.5s' }}
          >
            {flag}
          </span>
        ))}
      </div>

      {/* Main Gate Arch Structure */}
      <div className="relative z-10 max-w-3xl mx-auto mt-4 text-center">
        {/* Event Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 shadow-md border-2 border-amber-400 text-amber-900 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 animate-pulse">
          <PartyPopper className="w-4 h-4 text-amber-600" />
          {details.badge}
        </div>

        {/* Arch Header Title */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-4 border-amber-400 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
            <span>🎪</span>
            {details.title}
            <span>🎪</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 max-w-xl mx-auto">
            Selamat datang di gerbang perayaan sekolah TK Asy Syifa! Seluruh kampung bersolek menyambut hari penuh berkah dan kegembiraan.
          </p>

          {/* Gate Decoration Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {details.decorations.map((item, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-slate-700 text-xs font-bold shadow-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Asy & Syifa Welcoming Gatekeepers Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Asy Welcoming Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border-2 border-emerald-300 shadow-md text-left flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shrink-0 shadow-md ring-4 ring-white">
              👦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-emerald-950 text-base">Asy Menyambut</h4>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold">Tuan Rumah</span>
              </div>
              <p className="text-xs text-emerald-900 mt-1.5 italic font-medium leading-relaxed">
                {details.asyWelcome}
              </p>
            </div>
          </div>

          {/* Syifa Waving Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-300 shadow-md text-left flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-3xl shrink-0 shadow-md ring-4 ring-white">
              👧
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-pink-950 text-base">Syifa Melambaikan Tangan</h4>
                <span className="text-xs px-2 py-0.5 rounded-md bg-pink-200 text-pink-900 font-bold">Penuh Senyum</span>
              </div>
              <p className="text-xs text-pink-900 mt-1.5 italic font-medium leading-relaxed">
                {details.syifaGreeting}
              </p>
            </div>
          </div>
        </div>

        {/* Enter Festival Button */}
        {onEnterFestival && (
          <div className="mt-6">
            <button
              onClick={() => {
                tadeSoundEngine.playFx('MAGIC_SPARKLE');
                onEnterFestival();
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 border-2 border-white"
            >
              <Sparkles className="w-5 h-5" />
              Masuk & Nikmati Seluruh Pesta Festival!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
