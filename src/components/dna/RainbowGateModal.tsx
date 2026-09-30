import React, { useEffect, useState } from 'react';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';
import { Sparkles, X } from 'lucide-react';

interface RainbowGateModalProps {
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

export const RainbowGateModal: React.FC<RainbowGateModalProps> = ({
  onComplete,
  title = 'Selamat Datang di Dunia Asy Syifa',
  subtitle = 'Taman Belajar Islami Penuh Berkah, Keceriaan & Karakter Mulia'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = asySyifaDnaEngine.getConfig();

  useEffect(() => {
    if (!config.rainbowGateEnabled) {
      if (onComplete) onComplete();
      return;
    }

    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');

    const timer = setTimeout(() => {
      handleClose();
    }, (config.rainbowGateDurationSec || 3) * 1000);

    return () => clearTimeout(timer);
  }, [config.rainbowGateEnabled, config.rainbowGateDurationSec]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  if (!config.rainbowGateEnabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-dna-rainbow">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-white via-emerald-50/40 to-teal-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300/80 text-center overflow-hidden">
        {/* Rainbow Arch Top Visual */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none opacity-80">
          <svg viewBox="0 0 400 150" className="w-full h-full">
            <path d="M20 150 A180 140 0 0 1 380 150" stroke="#EF4444" strokeWidth="8" fill="none" opacity="0.9" />
            <path d="M30 150 A170 130 0 0 1 370 150" stroke="#F97316" strokeWidth="8" fill="none" opacity="0.9" />
            <path d="M40 150 A160 120 0 0 1 360 150" stroke="#FBBF24" strokeWidth="8" fill="none" opacity="0.9" />
            <path d="M50 150 A150 110 0 0 1 350 150" stroke="#10B981" strokeWidth="8" fill="none" opacity="0.9" />
            <path d="M60 150 A140 100 0 0 1 340 150" stroke="#06B6D4" strokeWidth="8" fill="none" opacity="0.9" />
            <path d="M70 150 A130 90 0 0 1 330 150" stroke="#6366F1" strokeWidth="8" fill="none" opacity="0.9" />
          </svg>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition"
          title="Lewati Gerbang"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gerbang Pelangi Asy Syifa</span>
        </div>

        {/* Characters Welcoming */}
        <div className="flex items-center justify-center gap-6 my-2">
          <div className="text-center">
            <CartoonCharacterSvg
              type="ASY"
              size={96}
              movement="LONCAT_GEMBIRA"
              expression="TERTAWA"
            />
            <span className="block mt-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Dek Asy
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-2">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center text-2xl animate-pulse">
              🌈
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1">3 Detik Sambutan</span>
          </div>

          <div className="text-center">
            <CartoonCharacterSvg
              type="SYIFA"
              size={96}
              movement="LAMBAIAN_TANGAN"
              expression="SENYUM"
            />
            <span className="block mt-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Mbak Syifa
            </span>
          </div>
        </div>

        {/* Welcoming Text */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-3 font-serif">
          {title}
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
          {subtitle}
        </p>

        {/* Dismiss prompt */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>DNA Animasi & Suara v20 (P5)</span>
          <button
            onClick={handleClose}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Masuk Langsung &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
