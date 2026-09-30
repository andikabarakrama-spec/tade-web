import React from 'react';
import { Sparkles, Moon, Heart, RotateCcw, X, Volume2 } from 'lucide-react';
import { bioskopLangitEngine } from '../../services/bioskopLangitEngine';

interface CelestialOutroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  isEcoMode?: boolean;
}

export const CelestialOutroModal: React.FC<CelestialOutroModalProps> = ({
  isOpen,
  onClose,
  onReplay,
  isEcoMode = false
}) => {
  if (!isOpen) return null;

  const playChime = () => {
    bioskopLangitEngine.playStarBell();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-amber-400/40 rounded-3xl p-6 text-white shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Background Constellation Star Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-4 left-6 text-xl animate-pulse">✨</div>
          <div className="absolute top-12 right-10 text-2xl animate-ping" style={{ animationDuration: '3s' }}>⭐</div>
          <div className="absolute bottom-8 left-12 text-lg animate-bounce" style={{ animationDuration: '4s' }}>🌟</div>
          <div className="absolute bottom-16 right-16 text-xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Moon Icon with soft glow */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-100 flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(251,191,36,0.6)]">
            🌙
          </div>
          <div className="absolute -top-1 -right-1 text-sm animate-spin" style={{ animationDuration: '8s' }}>
            ✨
          </div>
        </div>

        {/* P6: Constellation Formation: "TERIMA KASIH" */}
        <div className="relative mb-3 px-4 py-2 bg-indigo-950/80 border border-amber-400/40 rounded-2xl shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Rasi Bintang Membentuk Pesan (P6)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow">
            ✨ TERIMA KASIH ✨
          </h2>
          <p className="text-xs text-amber-200/80 font-medium">Jazakumullah Khairan Katsiran</p>
        </div>

        {/* Asy & Syifa Waving Warmly */}
        <div className="flex items-center justify-center gap-6 my-3 p-3 bg-slate-900/60 rounded-2xl border border-indigo-500/20 w-full">
          {/* Asy Mascot */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 border-2 border-sky-300 flex items-center justify-center text-2xl shadow-md">
              👦
            </div>
            <span className="text-xs font-bold text-sky-300 mt-1">Dek Asy</span>
            <span className="text-[10px] text-slate-300 italic">“Selamat Istirahat Sahabat!”</span>
          </div>

          {/* Syifa Mascot */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-400 to-purple-600 border-2 border-pink-300 flex items-center justify-center text-2xl shadow-md">
              👧
            </div>
            <span className="text-xs font-bold text-pink-300 mt-1">Mbak Syifa</span>
            <span className="text-[10px] text-slate-300 italic">“Semoga Mimpi Indah Penuh Berkah”</span>
          </div>
        </div>

        {/* Bedtime Prayer Card */}
        <div className="w-full bg-indigo-950/70 border border-indigo-400/30 rounded-xl p-3.5 mb-4 text-left">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              Doa Sebelum Tidur
            </span>
            <button
              onClick={playChime}
              className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3" /> Bunyikan Lonceng
            </button>
          </div>
          <p className="text-sm font-semibold text-amber-200 font-serif text-right mb-1">
            بِاسْمِكَ اللّٰهُمَّ اَحْيَا وَبِاسْمِكَ اَمُوْتُ
          </p>
          <p className="text-xs text-slate-200 italic mb-0.5">
            “Bismika Allahumma ahyaa wa bismika amuut.”
          </p>
          <p className="text-[11px] text-slate-400">
            Artinya: “Dengan nama-Mu ya Allah, aku hidup dan dengan nama-Mu aku mati.”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={onReplay}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Ulangi Cerita
          </button>
          <button
            onClick={onClose}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-indigo-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Heart className="w-4 h-4 fill-indigo-950" /> Selesai Nonton
          </button>
        </div>
      </div>
    </div>
  );
};
