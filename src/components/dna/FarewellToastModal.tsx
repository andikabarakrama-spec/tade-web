import React, { useEffect, useState } from 'react';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';
import { Heart } from 'lucide-react';

interface FarewellToastModalProps {
  onComplete?: () => void;
  message?: string;
  durationMs?: number;
}

export const FarewellToastModal: React.FC<FarewellToastModalProps> = ({
  onComplete,
  message = 'Sampai jumpa, sahabat Asy Syifa! Barakallahu fiikum.',
  durationMs = 2200
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = asySyifaDnaEngine.getConfig();

  useEffect(() => {
    if (!config.farewellEnabled) {
      if (onComplete) onComplete();
      return;
    }

    asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [config.farewellEnabled, durationMs, onComplete]);

  if (!config.farewellEnabled || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-bounce duration-300">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-4">
        {/* Animated Mascots */}
        <div className="flex -space-x-4 shrink-0">
          <CartoonCharacterSvg
            type="ASY"
            size={56}
            movement="ANGGUKAN_KEPALA"
            expression="TERIMA_KASIH"
          />
          <CartoonCharacterSvg
            type="SYIFA"
            size={56}
            movement="LAMBAIAN_TANGAN"
            expression="SENYUM"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Asy & Syifa Berpamitan</span>
          </div>
          <p className="text-sm font-medium text-slate-100 mt-0.5 leading-snug">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
