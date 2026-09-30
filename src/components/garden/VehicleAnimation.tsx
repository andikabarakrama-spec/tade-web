import React, { useState } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';
import { Bus, Bike, Sparkles } from 'lucide-react';

export const VehicleAnimation: React.FC = () => {
  const { settings, isBatteryLow, isTabActive } = useLivingGarden();
  const [honkMsg, setHonkMsg] = useState<string | null>(null);

  if (!settings.vehiclesEnabled || settings.isQuietMode || !isTabActive || isBatteryLow) {
    return null;
  }

  const handleHonk = () => {
    setHonkMsg('🚌 Mobil Sekolah TK Asy Syifa: "Telolet! Beep Beep! Berangkat Sekolah!"');
    setTimeout(() => setHonkMsg(null), 3000);
  };

  return (
    <div className="relative w-full h-12 overflow-hidden bg-stone-200/50 border-y border-stone-300/40 my-4 flex items-center">
      {/* Honk Speech Bubble */}
      {honkMsg && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 font-extrabold text-xs px-3 py-1 rounded-full shadow-lg z-30 animate-pulse">
          {honkMsg}
        </div>
      )}

      {/* Road Lane */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-stone-400/60 w-full" />

      {/* Animated Vehicles Moving Across */}
      <div className="animate-vehicle flex items-center gap-12 pointer-events-auto">
        {/* Mobil Sekolah TK Asy Syifa */}
        <button
          onClick={handleHonk}
          className="bg-amber-400 text-stone-900 font-extrabold px-3 py-1.5 rounded-2xl border-2 border-stone-800 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
          title="Klik klakson mobil sekolah!"
        >
          <Bus className="w-5 h-5 text-emerald-800" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Mobil Sekolah Asy Syifa</span>
        </button>

        {/* Sepeda Cilik */}
        <div className="flex items-center gap-1 text-emerald-800 bg-white/90 px-2.5 py-1 rounded-full border border-stone-300 shadow-2xs">
          <Bike className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-slate-700">Sepeda Cilik</span>
        </div>
      </div>
    </div>
  );
};
