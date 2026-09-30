import React, { useState } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';
import { Sparkles } from 'lucide-react';

interface GardenElementsProps {
  type?: 'full' | 'hero' | 'footer' | 'card' | 'night-footer' | 'page-decor';
}

export const LivingGardenElements: React.FC<GardenElementsProps> = ({ type = 'full' }) => {
  const { settings, timeOfDay, isBatteryLow, isTabActive } = useLivingGarden();
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [butterflyClicked, setButterflyClicked] = useState(false);
  const [frogClicked, setFrogClicked] = useState(false);

  // If Mode Tenang is active or tab is hidden, don't render heavy particle DOM nodes
  if (settings.isQuietMode || !isTabActive || isBatteryLow) {
    return null;
  }

  const handlePopBubble = (id: number) => {
    setPoppedBubbles((prev) => [...prev, id]);
    setTimeout(() => {
      setPoppedBubbles((prev) => prev.filter((b) => b !== id));
    }, 2000);
  };

  const isNight = timeOfDay === 'Malam' || (timeOfDay as any) === 'night' || type === 'night-footer';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {/* 1. Organic Sun / Moon & Rainbow Arc */}
      {(type === 'hero' || type === 'full' || type === 'page-decor') && (
        <>
          {!isNight ? (
            <div className="absolute -top-10 left-12 animate-pulse pointer-events-none flex items-center gap-2 opacity-90 transition-all duration-1000">
              <span className="text-3xl sm:text-4xl filter drop-shadow-md transition-transform duration-1000 hover:scale-110">☀️</span>
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                Taman Cerah
              </span>
            </div>
          ) : (
            <div className="absolute top-4 left-10 flex items-center gap-2 pointer-events-none opacity-95">
              <span className="text-3xl animate-pulse">🌙</span>
              <span className="text-xs font-bold text-amber-300/90 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400/30 shadow-md">
                Taman Malam Asy Syifa ⭐
              </span>
            </div>
          )}

          {/* Rainbow Arc */}
          {!isNight && (
            <div className="absolute -top-12 left-1/4 w-96 h-48 border-t-8 border-r-8 border-l-8 border-transparent rounded-t-full bg-gradient-to-r from-red-400/20 via-yellow-400/20 via-green-400/20 via-blue-400/20 to-purple-400/20 blur-2xs pointer-events-none" />
          )}
        </>
      )}

      {/* 2. Interactive Butterflies with organic flutter */}
      {settings.animalsEnabled && !isNight && (
        <div
          onClick={() => setButterflyClicked(!butterflyClicked)}
          className={`pointer-events-auto absolute top-12 right-16 cursor-pointer transition transform hover:scale-125 ${
            butterflyClicked ? 'animate-bounce' : 'animate-flutter'
          }`}
          style={{ animationDuration: '4.5s' }}
          title="Klik aku! Kupu-kupu Asy Syifa"
        >
          <div className="flex items-center gap-0.5 text-amber-500 drop-shadow-sm">
            <span className="text-xl">🦋</span>
          </div>
        </div>
      )}

      {/* 3. Floating Bees & Ladybugs with staggered delays */}
      {settings.animalsEnabled && !isNight && (
        <>
          <div
            className="absolute top-28 left-12 animate-float-slow pointer-events-auto cursor-pointer"
            style={{ animationDuration: '6s', animationDelay: '1s' }}
            title="Lebah Madu Taman"
          >
            <span className="text-lg hover:scale-125 transition inline-block">🐝</span>
          </div>
          <div
            className="absolute top-44 right-28 animate-pulse pointer-events-auto cursor-pointer"
            style={{ animationDuration: '3.2s', animationDelay: '0.5s' }}
            title="Kepik Taman"
          >
            <span className="text-base hover:scale-125 transition inline-block">🐞</span>
          </div>
        </>
      )}

      {/* 4. Floating Balloons & Birds */}
      {(type === 'hero' || type === 'page-decor') && !isNight && (
        <>
          <div
            className="absolute top-16 right-32 animate-float-slow pointer-events-none flex gap-2 opacity-90"
            style={{ animationDuration: '7s' }}
          >
            <span className="text-2xl drop-shadow-sm">🎈</span>
            <span className="text-xl drop-shadow-sm opacity-80" style={{ animationDelay: '1.2s' }}>🎈</span>
          </div>
          <div
            className="absolute top-8 left-1/3 animate-pulse pointer-events-none flex gap-3 text-emerald-600 opacity-70"
            style={{ animationDuration: '4s', animationDelay: '0.8s' }}
          >
            <span className="text-sm">🐦</span>
            <span className="text-xs">🐤</span>
          </div>
        </>
      )}

      {/* 5. Night Garden Fireflies & Moon */}
      {isNight && (
        <>
          {/* Fireflies */}
          <div className="absolute inset-0 pointer-events-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
              <div
                key={f}
                className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#fde047] animate-ping opacity-80"
                style={{
                  top: `${12 + (f * 11) % 70}%`,
                  left: `${6 + (f * 13) % 88}%`,
                  animationDuration: `${1.8 + (f % 3) * 0.7}s`,
                  animationDelay: `${(f * 0.4) % 2}s`,
                }}
              />
            ))}
          </div>

          {/* Lanterns */}
          <div className="absolute top-6 right-12 text-2xl animate-bounce duration-1000">🏮</div>
        </>
      )}

      {/* 6. Poppable Soap Bubbles */}
      {settings.bubblesEnabled && (
        <div className="absolute bottom-8 left-8 flex gap-6 pointer-events-auto">
          {[1, 2, 3].map((bId) => {
            const isPopped = poppedBubbles.includes(bId);
            return (
              <button
                key={bId}
                onClick={() => handlePopBubble(bId)}
                className={`w-8 h-8 rounded-full border border-sky-300/80 bg-sky-200/40 backdrop-blur-2xs shadow-inner flex items-center justify-center transition transform hover:scale-110 active:scale-95 cursor-pointer ${
                  isPopped ? 'scale-150 opacity-0 transition duration-300' : 'animate-float-slow'
                }`}
                style={{ animationDelay: `${bId * 0.8}s`, animationDuration: `${5 + bId}s` }}
                title="Klik untuk meletuskan gelembung!"
              >
                <Sparkles className="w-3 h-3 text-sky-500 opacity-70" />
              </button>
            );
          })}
        </div>
      )}

      {/* 7. Swaying Garden Grass & Flowers with Organic Motion */}
      {(type === 'footer' || type === 'night-footer' || type === 'full') && (
        <div className="absolute bottom-0 inset-x-0 h-8 flex items-end justify-between px-6 pointer-events-none opacity-90">
          <div className="flex items-end space-x-1.5">
            <span className="text-xl animate-sway" style={{ animationDuration: '3s' }}>🌷</span>
            <span className="text-base animate-sway" style={{ animationDuration: '3.5s', animationDelay: '0.4s' }}>
              🌱
            </span>
            <span className="text-2xl animate-sway" style={{ animationDuration: '4s', animationDelay: '0.8s' }}>
              🌻
            </span>
            <span className="text-base animate-sway" style={{ animationDuration: '3.2s', animationDelay: '1.2s' }}>
              🌿
            </span>
            <span
              onClick={() => setFrogClicked(!frogClicked)}
              className={`pointer-events-auto text-lg cursor-pointer transition transform ${
                frogClicked ? 'scale-150 -translate-y-2' : 'hover:scale-125'
              }`}
              title="Katak Taman Asy Syifa"
            >
              🐸
            </span>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-lg animate-sway" style={{ animationDuration: '3.8s', animationDelay: '0.3s' }}>
              🌺
            </span>
            <span className="text-xl animate-sway" style={{ animationDuration: '4.2s', animationDelay: '0.9s' }}>
              🌸
            </span>
            <span className="text-base animate-sway" style={{ animationDuration: '3.1s', animationDelay: '1.5s' }}>
              ☘️
            </span>
            <span className="text-lg hover:scale-125 transition cursor-pointer pointer-events-auto" title="Kelinci">🐇</span>
          </div>
        </div>
      )}
    </div>
  );
};


