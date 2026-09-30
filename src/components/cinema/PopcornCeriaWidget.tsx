import React, { useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { bioskopLangitEngine, PopcornBurstItem } from '../../services/bioskopLangitEngine';

interface PopcornCeriaWidgetProps {
  popcornCount: number;
  onPop: () => void;
  isEcoMode?: boolean;
}

export const PopcornCeriaWidget: React.FC<PopcornCeriaWidgetProps> = ({
  popcornCount,
  onPop,
  isEcoMode = false
}) => {
  const [bursts, setBursts] = useState<PopcornBurstItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWiggling, setIsWiggling] = useState<boolean>(false);

  const handlePopClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onPop();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 300);

    const res = bioskopLangitEngine.popPopcorn();
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 2500);

    if (!isEcoMode) {
      // Spawn floating visual popcorn particles
      const rect = e.currentTarget.getBoundingClientRect();
      const newItems: PopcornBurstItem[] = Array.from({ length: 4 }).map((_, i) => ({
        id: `pop_${Date.now()}_${i}`,
        x: (Math.random() - 0.5) * 60,
        y: -20 - Math.random() * 40,
        emoji: ['🍿', '✨', '🍯', '🧈'][i % 4],
        size: 14 + Math.random() * 8,
        rotation: (Math.random() - 0.5) * 60
      }));

      setBursts(prev => [...prev.slice(-8), ...newItems]);
      setTimeout(() => {
        setBursts(prev => prev.filter(b => !newItems.some(n => n.id === b.id)));
      }, 1000);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 text-white shadow-xl flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
          <span className="text-lg">🍿</span>
          <span>Popcorn Ceria (P5)</span>
        </div>
        <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
          <Trophy className="w-3 h-3 text-amber-400" />
          {popcornCount * 5} XP Berkah
        </span>
      </div>

      <p className="text-xs text-slate-300 mb-3">
        Sentuh kotak popcorn untuk menghasilkan letupan renyah & aroma madu berkah!
      </p>

      {/* Interactive Popcorn Character Button */}
      <div className="relative flex flex-col items-center my-2">
        {/* Floating particles on click */}
        {bursts.map(b => (
          <div
            key={b.id}
            className="absolute pointer-events-none transition-all duration-700 ease-out z-20"
            style={{
              transform: `translate(${b.x}px, ${b.y}px) rotate(${b.rotation}deg)`,
              fontSize: `${b.size}px`,
              opacity: 0.9
            }}
          >
            {b.emoji}
          </div>
        ))}

        <button
          onClick={handlePopClick}
          className={`relative group p-3 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-yellow-400/20 border-2 border-amber-400/60 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all shadow-lg flex flex-col items-center cursor-pointer ${
            isWiggling ? 'animate-ping' : ''
          }`}
          title="Klik untuk letupkan popcorn!"
        >
          {/* Smiling Popcorn Cup Illustration */}
          <div className="relative flex flex-col items-center">
            {/* Popcorn Fluffs on top */}
            <div className="flex space-x-[-4px] mb-[-6px] z-10">
              <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🍿</span>
              <span className="text-xl animate-pulse" style={{ animationDelay: '0.4s' }}>✨</span>
              <span className="text-2xl animate-bounce" style={{ animationDuration: '2.4s' }}>🍿</span>
            </div>

            {/* Cup Body with Stripes and Cute Face */}
            <div className="w-20 h-16 bg-gradient-to-b from-red-600 to-red-700 border-2 border-white/80 rounded-b-xl rounded-t-sm shadow-md flex flex-col items-center justify-center relative overflow-hidden">
              {/* White Stripes */}
              <div className="absolute inset-0 flex justify-around opacity-30 pointer-events-none">
                <div className="w-2 h-full bg-white" />
                <div className="w-2 h-full bg-white" />
                <div className="w-2 h-full bg-white" />
              </div>

              {/* Cute Smile Face */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex space-x-2 text-white text-xs font-black">
                  <span>◕</span>
                  <span>◕</span>
                </div>
                <div className="w-3 h-1.5 bg-white rounded-b-full mt-0.5" />
                <span className="text-[9px] font-bold text-amber-200 mt-1">ASY POP</span>
              </div>
            </div>
          </div>

          <span className="mt-2 text-xs font-extrabold text-amber-300 group-hover:text-yellow-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Sentuh & Letupkan!
          </span>
        </button>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="mt-2 text-[11px] font-semibold text-yellow-300 bg-amber-950/90 border border-amber-400/50 rounded-lg px-2.5 py-1 animate-fade-in text-center shadow">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Popcorn Stats Footer */}
      <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-slate-400">
        <span>Total Letupan: <strong className="text-amber-300 font-bold">{popcornCount}</strong></span>
        <span className="text-amber-400/80">Rasa: Jagung Madu 🍯</span>
      </div>
    </div>
  );
};
