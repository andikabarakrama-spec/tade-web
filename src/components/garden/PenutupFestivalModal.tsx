import React, { useEffect, useState } from 'react';
import { Sparkles, X, Heart, Star, PartyPopper } from 'lucide-react';
import { festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const PenutupFestivalModal: React.FC<Props> = ({ onClose }) => {
  const [countdown, setCountdown] = useState<number>(6);
  const theme = festivalCeriaService.getCurrentTheme();

  useEffect(() => {
    tadeSoundEngine.playFx('CELEBRATION');
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" id="penutup-festival-modal">
      {/* Falling Confetti Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎊', '✨', '🌸', '🎉', '⭐', '🎈', '🎊', '✨', '🌸', '🎉', '⭐', '🎈'].map((confetti, idx) => (
          <span
            key={idx}
            className="absolute text-3xl sm:text-4xl animate-bounce"
            style={{
              left: `${(idx * 8.5) % 100}%`,
              top: `${(idx * 7) % 60}%`,
              animationDelay: `${idx * 0.2}s`,
              animationDuration: '2s'
            }}
          >
            {confetti}
          </span>
        ))}
      </div>

      {/* Main Closing Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-gradient-to-b from-amber-400 via-orange-400 to-rose-500 border-4 border-white shadow-2xl p-6 sm:p-10 text-white text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4 border border-white/30">
          <PartyPopper className="w-4 h-4 text-amber-200" />
          Sprint G18 P7 — Upacara Penutupan
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center justify-center gap-3">
          <span>🎉</span>
          Terima Kasih Banyak!
          <span>🎉</span>
        </h2>

        <p className="text-amber-100 text-sm sm:text-base font-medium mt-2 max-w-lg mx-auto leading-relaxed">
          Semoga kegembiraan dan berkah perayaan <strong>{theme.title}</strong> selalu menyertai kita semua!
        </p>

        {/* All Characters Gathering Visual */}
        <div className="my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-center gap-3">
          <span className="text-3xl animate-bounce">👦 Asy</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>👧 Syifa</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🐰 Bubu</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🐻 Gogo</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🐝 Mimi</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🦆 Dodo</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🐢 Titi</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.7s' }}>🦜 Rara</span>
        </div>

        <p className="text-xs text-amber-200 font-bold italic">
          “Sampai jumpa di perayaan sekolah ceria berikutnya. Mari kembali merawat kampung dan terus rajin belajar!”
        </p>

        <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-amber-100 font-bold">
          <span>Suasana kampung kembali normal dalam: {countdown}s</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-orange-600 font-black hover:bg-amber-50 cursor-pointer shadow-md transition-all"
          >
            Selesai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
