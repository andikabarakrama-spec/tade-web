import React, { useState } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';

export const AnimalLifeEngine: React.FC = () => {
  const { settings, isBatteryLow, isTabActive } = useLivingGarden();
  const [animalSay, setAnimalSay] = useState<string | null>(null);

  if (!settings.animalsEnabled || settings.isQuietMode || !isTabActive || isBatteryLow) {
    return null;
  }

  const handleAnimalClick = (msg: string) => {
    setAnimalSay(msg);
    setTimeout(() => setAnimalSay(null), 3500);
  };

  return (
    <div className="relative w-full overflow-hidden pointer-events-none py-2 my-2">
      {/* Active Speech Bubble from Animal */}
      {animalSay && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-2xl shadow-md z-30 animate-bounce pointer-events-auto">
          {animalSay}
        </div>
      )}

      {/* Living Ground Vegetation & Animals Bar */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-2xl relative">
        {/* Swaying Grass & Blooming Flower Accent */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 opacity-60"></div>

        {/* Kelinci Hopping & Grass */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-emerald-700 animate-sway">🌱</span>
          <button
            onClick={() => handleAnimalClick('🐰 Kelinci: "Selamat Belajar Teman-teman!"')}
            className="pointer-events-auto hover:scale-130 transition transform animate-hop cursor-pointer"
            title="Kelinci Taman Asy Syifa"
          >
            🐇
          </button>
          <span className="text-xs text-pink-500 animate-pulse">🌸</span>
        </div>

        {/* Ayam, Bebek & Burung Hinggap */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAnimalClick('🐥 Anak Ayam: "Kukuruyuk! Pagi Ceria!"')}
            className="pointer-events-auto hover:scale-130 transition transform cursor-pointer"
            title="Anak Ayam Ceria"
          >
            🐥
          </button>
          <button
            onClick={() => handleAnimalClick('🦆 Bebek: "Kwek kwek! Mari Mengaji!"')}
            className="pointer-events-auto hover:scale-130 transition transform cursor-pointer"
            title="Bebek Taman"
          >
            🦆
          </button>
          <button
            onClick={() => handleAnimalClick('🐦 Burung Hinggap: "Cuit cuit di dahan pohon!"')}
            className="pointer-events-auto hover:scale-130 transition transform cursor-pointer hidden sm:inline"
            title="Burung Hinggap"
          >
            🐦
          </button>
        </div>

        {/* Tupai, Kupu & Lebah */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAnimalClick('🐿️ Tupai: "Jangan Lupa Baca Bismillah Ya!"')}
            className="pointer-events-auto hover:scale-130 transition transform animate-float-slow cursor-pointer"
            title="Tupai Pinter"
          >
            🐿️
          </button>
          <button
            onClick={() => handleAnimalClick('🦋 Kupu-kupu: "Menari berpindah bunga!"')}
            className="pointer-events-auto hover:scale-130 transition transform animate-sway cursor-pointer"
            title="Kupu-Kupu Taman"
          >
            🦋
          </button>
          <button
            onClick={() => handleAnimalClick('🐝 Lebah Madu: "Mencari sari bunga sehat!"')}
            className="pointer-events-auto hover:scale-130 transition transform animate-pulse cursor-pointer hidden sm:inline"
            title="Lebah Madu"
          >
            🐝
          </button>
        </div>

        {/* Katak, Capung & Ikan Kolam */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAnimalClick('🐸 Katak: "Alhamdulillah Hari Ini Cerah!"')}
            className="pointer-events-auto hover:scale-130 transition transform cursor-pointer"
            title="Katak Kolam"
          >
            🐸
          </button>
          <button
            onClick={() => handleAnimalClick('🐟 Ikan Koi: "Berenang di kolam bening!"')}
            className="pointer-events-auto hover:scale-130 transition transform cursor-pointer hidden sm:inline"
            title="Ikan Koi Kolam"
          >
            🐟
          </button>
          <button
            onClick={() => handleAnimalClick('🍃 Daun Tertiup Angin: "Bumi asri Kampus Hijau!"')}
            className="pointer-events-auto hover:scale-130 transition transform cursor-pointer"
            title="Daun Tertiup Angin"
          >
            🍃
          </button>
        </div>
      </div>
    </div>
  );
};
