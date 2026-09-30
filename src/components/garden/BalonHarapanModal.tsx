import React, { useState } from 'react';
import { Sparkles, X, Heart, Star, Send, RotateCcw } from 'lucide-react';
import { WishBalloon, festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const BalonHarapanModal: React.FC<Props> = ({ onClose }) => {
  const [balloons, setBalloons] = useState<WishBalloon[]>(festivalCeriaService.getWishBalloons());
  const [activeWish, setActiveWish] = useState<WishBalloon | null>(null);
  const [releasedIds, setReleasedIds] = useState<string[]>([]);

  const handleTapBalloon = (balloon: WishBalloon) => {
    if (releasedIds.includes(balloon.id)) return;

    setActiveWish(balloon);
    setReleasedIds(prev => [...prev, balloon.id]);
    festivalCeriaService.recordWishReleased(balloon);
  };

  const handleReset = () => {
    setReleasedIds([]);
    setActiveWish(null);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" id="balon-harapan-modal">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50 border-4 border-amber-400 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 hover:bg-amber-100 text-slate-700 flex items-center justify-center font-bold transition-all cursor-pointer shadow-xs z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Sprint G18 P4 — Balon Harapan Festival
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
            <span>🎈</span>
            Balon Harapan & Doa Ceria
            <span>✨</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            Ketuk balon warna-warni untuk mengungkap doa dan kalimat mutiara yang melambung tinggi ke angkasa!
          </p>
        </div>

        {/* Interactive Sky Canvas with Balloons */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 border-4 border-white shadow-xl overflow-hidden p-6 flex flex-col justify-between">
          {/* Gentle Floating Clouds */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-4 left-6 text-4xl animate-pulse">☁️</div>
            <div className="absolute top-12 right-8 text-5xl animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
            <div className="absolute top-36 left-1/3 text-3xl animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
          </div>

          {/* Balloon Grid */}
          <div className="relative z-10 grid grid-cols-4 gap-3 sm:gap-4 h-full items-center justify-items-center">
            {balloons.map((b, idx) => {
              const isReleased = releasedIds.includes(b.id);
              return (
                <div
                  key={b.id}
                  onClick={() => handleTapBalloon(b)}
                  className={`group cursor-pointer flex flex-col items-center transition-all duration-700 select-none ${
                    isReleased
                      ? '-translate-y-32 opacity-0 pointer-events-none scale-150'
                      : 'hover:scale-110 active:scale-95 animate-bounce'
                  }`}
                  style={{
                    animationDuration: `${2.5 + (idx % 3) * 0.5}s`,
                    animationDelay: `${(idx % 4) * 0.2}s`
                  }}
                >
                  <div className={`w-14 h-18 sm:w-16 sm:h-20 rounded-full bg-gradient-to-t ${b.color} shadow-xl flex flex-col items-center justify-center text-white border-2 border-white/60 relative`}>
                    <span className="text-2xl sm:text-3xl">{b.emoji}</span>
                    {/* Balloon String */}
                    <div className="absolute -bottom-4 w-0.5 h-4 bg-amber-800/40" />
                  </div>
                  <span className="mt-4 text-[10px] sm:text-xs font-black text-slate-800 bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-amber-200">
                    {b.author}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revealed Quote Card Display */}
        {activeWish && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl animate-fadeIn border-2 border-white flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center text-3xl shrink-0 shadow-md">
              {activeWish.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                  Untaian Harapan {activeWish.author}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                  Terbang ke Langit 🎈
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black mt-1">
                “{activeWish.quote}”
              </h4>
            </div>
          </div>
        )}

        {/* Footer info & Reset Action */}
        <div className="mt-6 pt-4 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-600 font-medium">
            Telah terbang: <strong className="text-amber-700">{releasedIds.length}</strong> dari {balloons.length} balon
          </span>

          {releasedIds.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Munculkan Kembali Semua Balon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
