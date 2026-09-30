import React, { useEffect, useState } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';

interface WowItem {
  id: number;
  type: 'butterfly' | 'balloon' | 'bird' | 'leaf' | 'bubble' | 'sparkle';
  icon: string;
  left: number; // percentage
  top: number; // percentage
}

export const FoundationWowSurprises: React.FC = () => {
  const { settings, isBatteryLow, isTabActive } = useLivingGarden();
  const [activeSurprise, setActiveSurprise] = useState<WowItem | null>(null);

  useEffect(() => {
    if (settings.isQuietMode || !isTabActive || isBatteryLow) return;

    const items: Array<{ type: WowItem['type']; icon: string }> = [
      { type: 'butterfly', icon: '🦋' },
      { type: 'balloon', icon: '🎈' },
      { type: 'bird', icon: '🐦' },
      { type: 'leaf', icon: '🍃' },
      { type: 'bubble', icon: '🫧' },
      { type: 'sparkle', icon: '✨' },
    ];

    const interval = setInterval(() => {
      const chosen = items[Math.floor(Math.random() * items.length)];
      const randomLeft = Math.floor(Math.random() * 80) + 10;
      const randomTop = Math.floor(Math.random() * 60) + 20;

      const newItem: WowItem = {
        id: Date.now(),
        type: chosen.type,
        icon: chosen.icon,
        left: randomLeft,
        top: randomTop,
      };

      setActiveSurprise(newItem);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        setActiveSurprise((curr) => (curr?.id === newItem.id ? null : curr));
      }, 4500);

    }, 22000); // Trigger every 22 seconds

    return () => clearInterval(interval);
  }, [settings.isQuietMode, isTabActive, isBatteryLow]);

  if (!activeSurprise) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div
        key={activeSurprise.id}
        className="absolute text-3xl animate-float-slow drop-shadow-md transition duration-1000"
        style={{
          left: `${activeSurprise.left}%`,
          top: `${activeSurprise.top}%`,
        }}
      >
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-300 shadow-lg text-xs font-black text-slate-900 animate-pulse">
          <span>{activeSurprise.icon}</span>
          <span className="text-[10px] text-emerald-800">Kejutan Taman Asy Syifa</span>
        </div>
      </div>
    </div>
  );
};
