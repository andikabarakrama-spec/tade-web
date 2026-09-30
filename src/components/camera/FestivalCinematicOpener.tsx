import React, { useEffect, useState } from 'react';
import { 
  FESTIVAL_CINEMATIC_PRESETS, 
  FestivalCinematicType, 
  magicCameraEngine 
} from '../../services/magicCameraEngine';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';
import { Sparkles, Heart, CheckCircle2, Play, PartyPopper } from 'lucide-react';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface FestivalCinematicOpenerProps {
  festivalType?: FestivalCinematicType;
  onComplete?: () => void;
  autoDismissMs?: number;
}

export const FestivalCinematicOpener: React.FC<FestivalCinematicOpenerProps> = ({
  festivalType = 'FESTIVAL_CERIA',
  onComplete,
  autoDismissMs = 3800
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const data = FESTIVAL_CINEMATIC_PRESETS[festivalType];

  useEffect(() => {
    const token = 'FESTIVAL_CINEMATIC_OPENER';
    tadeAnimationGovernor.startAnimation(token);

    asySyifaDnaEngine.playSignatureSound(data.themeSound);

    const timer = setTimeout(() => {
      setIsVisible(false);
      tadeAnimationGovernor.stopAnimation(token);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 400);
    }, autoDismissMs);

    return () => {
      clearTimeout(timer);
      tadeAnimationGovernor.stopAnimation(token);
    };
  }, [festivalType, autoDismissMs, onComplete, data.themeSound]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 text-white select-none animate-fade-in">
      
      {/* Background Animated Fireworks / Particle Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl text-center space-y-6">
        
        {/* Floating Decorative Emojis */}
        <div className="flex justify-center items-center gap-3 text-3xl sm:text-4xl animate-bounce">
          {data.decorations.slice(0, 5).map((dec, i) => (
            <span key={i} className="transform hover:scale-125 transition-transform">{dec}</span>
          ))}
        </div>

        {/* Festival Title Card */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Sinematik Pembuka Acara Resmi Asy Syifa</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight leading-tight">
            {data.title}
          </h1>

          <p className="text-sm font-semibold text-amber-200">
            {data.subtitle}
          </p>
        </div>

        {/* Characters Mascot Stage */}
        <div className="flex items-center justify-center -space-x-4 py-2">
          <div className="transform hover:scale-110 transition-transform">
            <CartoonCharacterSvg type="ASY" size={90} movement="LONCAT_GEMBIRA" expression="TERTAWA" />
          </div>
          <div className="transform hover:scale-110 transition-transform">
            <CartoonCharacterSvg type="SYIFA" size={90} movement="LAMBAIAN_TANGAN" expression="SENYUM" />
          </div>
        </div>

        {/* Greeting & Doa / Quote */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2 text-xs">
          <p className="text-sm font-bold text-amber-300 font-serif">
            “{data.greeting}”
          </p>
          <p className="text-slate-200 italic">
            {data.duaOrQuote}
          </p>
        </div>

        {/* Progress Bar / Skip Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400 font-medium">Memulai Suasana Ceria...</span>
          <button
            onClick={() => {
              setIsVisible(false);
              if (onComplete) onComplete();
            }}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <span>Masuk Sekarang</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
