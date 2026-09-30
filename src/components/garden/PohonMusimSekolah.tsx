import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Star, Leaf, Award, Gift, Flag } from 'lucide-react';
import { livingWorldEngine, SeasonalTreeConfig } from '../../services/livingWorldEngine';
import { LivingEventEngine, SchoolEventType } from '../../services/livingEventEngine';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const PohonMusimSekolah: React.FC<{ onTreeInteract?: () => void }> = ({ onTreeInteract }) => {
  const [treeConfig, setTreeConfig] = useState<SeasonalTreeConfig>(() => livingWorldEngine.getSeasonalTreeConfig());
  const [isRustling, setIsRustling] = useState<boolean>(false);
  const [activeOrnamentPopup, setActiveOrnamentPopup] = useState<string | null>(null);

  useEffect(() => {
    const unsub = livingWorldEngine.subscribe(() => {
      setTreeConfig(livingWorldEngine.getSeasonalTreeConfig());
    });
    return unsub;
  }, []);

  const handleRustleTree = () => {
    setIsRustling(true);
    tadeSoundEngine.playFx('WEATHER_BREEZE');
    
    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-POHON-MUSIM',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Pohon Musim (${treeConfig.title}) digoyang perlahan oleh ananda santri!`
    });

    if (onTreeInteract) onTreeInteract();

    setTimeout(() => {
      setIsRustling(false);
    }, 1000);
  };

  const handleOrnamentClick = (ornament: { emoji: string; label: string; description: string }) => {
    setActiveOrnamentPopup(ornament.label);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    setTimeout(() => {
      setActiveOrnamentPopup(null);
    }, 3000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 bg-emerald-950/40 rounded-3xl border-2 border-emerald-500/40 backdrop-blur-md overflow-hidden">
      
      {/* Title Tag */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow">
          <Leaf className="w-3 h-3 text-emerald-950" />
          Pohon Musim Halaman
        </span>
        <span className="text-xs font-bold text-amber-200 truncate max-w-xs">
          {treeConfig.title}
        </span>
      </div>

      {/* Interactive Tree Graphic Area */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-end">
        
        {/* Animated Canopy */}
        <div 
          onClick={handleRustleTree}
          className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr ${treeConfig.leafColor} shadow-2xl border-4 ${treeConfig.trunkGlow} cursor-pointer transition-transform duration-500 flex items-center justify-center ${
            isRustling ? 'scale-105 rotate-3' : 'hover:scale-102'
          }`}
          title="Ketuk pohon untuk mendengarkan gemerisik daunnya!"
        >
          {/* Inner Botanical Depth Layers */}
          <div className="absolute inset-2 rounded-full bg-white/10 blur-[1px] pointer-events-none" />
          <div className="absolute top-3 left-6 w-12 h-12 rounded-full bg-white/20 blur-sm pointer-events-none" />
          <div className="absolute bottom-4 right-6 w-16 h-16 rounded-full bg-black/10 blur-sm pointer-events-none" />

          {/* Floating Seasonal Ornaments on the Tree */}
          <div className="absolute inset-0 p-3 flex flex-wrap items-center justify-around z-20">
            {treeConfig.ornaments.map((ornament, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrnamentClick(ornament);
                }}
                className="p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border border-amber-300 shadow-md hover:scale-125 transition-transform cursor-pointer relative group"
                title={`${ornament.label}: ${ornament.description}`}
              >
                <span className="text-xl sm:text-2xl">{ornament.emoji}</span>

                {/* Micro tooltip / badge on hover or tap */}
                {activeOrnamentPopup === ornament.label && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap bg-amber-300 text-slate-950 text-[10px] font-black px-2 py-1 rounded-xl shadow-lg border border-amber-500 animate-bounce pointer-events-none">
                    {ornament.label} ✨
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Center Mascot Leaf Sparkle */}
          <div className="text-3xl filter drop-shadow animate-pulse">
            🍃
          </div>
        </div>

        {/* Tree Trunk */}
        <div className="w-10 h-16 sm:w-12 sm:h-20 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-xl border-x-2 border-b-2 border-amber-900 shadow-inner relative z-0 -mt-3">
          {/* Bark texture grooves */}
          <div className="w-1 h-8 bg-amber-950/60 mx-auto mt-2 rounded-full" />
          <div className="w-1 h-5 bg-amber-950/60 ml-2 mt-1 rounded-full" />
        </div>

        {/* Ground Hill & Flowers */}
        <div className="w-full h-8 bg-gradient-to-t from-emerald-800 to-emerald-600 rounded-t-[100%] border-t-2 border-emerald-400 shadow-lg relative -mt-3 flex items-center justify-around px-4">
          <span className="text-xs">🌸</span>
          <span className="text-xs">🌱</span>
          <span className="text-[10px] text-emerald-100 font-bold hidden sm:inline">{treeConfig.groundDecoration}</span>
          <span className="text-xs">🌼</span>
          <span className="text-xs">🌺</span>
        </div>
      </div>

      {/* Tree Info Caption */}
      <div className="mt-3 text-center">
        <p className="text-[11px] text-emerald-200 font-medium">
          Dedaunan & perhiasan pohon selalu berganti otomatis mengikuti musim PPDB, Ramadhan, Wisuda, dan Milad!
        </p>
      </div>
    </div>
  );
};
