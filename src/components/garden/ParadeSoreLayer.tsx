import React, { useEffect, useState } from 'react';
import { Sparkles, Music, Heart, X, Award, Play } from 'lucide-react';
import { kampungCeriaService } from '../../services/kampungCeriaService';

interface Props {
  onClose?: () => void;
}

export const ParadeSoreLayer: React.FC<Props> = ({ onClose }) => {
  const [progress, setProgress] = useState<number>(kampungCeriaService.getParadeProgress());
  const [isActive, setIsActive] = useState<boolean>(kampungCeriaService.isParadeActive());

  useEffect(() => {
    const unsub = kampungCeriaService.subscribe(() => {
      setProgress(kampungCeriaService.getParadeProgress());
      setIsActive(kampungCeriaService.isParadeActive());
    });
    return () => unsub();
  }, []);

  if (!isActive && progress >= 100) {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl flex items-center justify-between animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🎉
          </div>
          <div>
            <div className="text-xs font-bold text-amber-100 uppercase tracking-wider">Parade Sore Selesai!</div>
            <div className="text-sm font-black">Semua 8 Sahabat telah menyelesaikan pawai sore dengan tertib.</div>
          </div>
        </div>
        <button
          onClick={() => {
            kampungCeriaService.startParadeSore();
          }}
          className="px-4 py-2 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-md hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          Pawai Lagi
        </button>
      </div>
    );
  }

  const characters = [
    { name: 'Asy', emoji: '👦', desc: 'Pemimpin Barisan' },
    { name: 'Syifa', emoji: '👧', desc: 'Penyapa Ceria' },
    { name: 'Bubu', emoji: '🐰', desc: 'Lompat Gembira' },
    { name: 'Gogo', emoji: '🦍', desc: 'Penjaga Kuat' },
    { name: 'Mimi', emoji: '🐝', desc: 'Penyebar Senyum' },
    { name: 'Dodo', emoji: '🐥', desc: 'Baris Rapi' },
    { name: 'Titi', emoji: '🐢', desc: 'Langkah Mantap' },
    { name: 'Rara', emoji: '🕊️', desc: 'Kicau Sholawat' }
  ];

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 p-4 shadow-xl border-4 border-amber-200 overflow-hidden text-slate-900">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-orange-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <Music className="w-3 h-3 text-orange-600 animate-bounce" />
            Parade Sore 15 Detik (Sprint G17 P6)
          </span>
          <span className="text-xs font-bold text-white drop-shadow-sm">
            Langkah: {progress}%
          </span>
        </div>
        <div className="text-[10px] font-bold text-white/90">
          8 Sahabat Kampung Berjalan Bersama
        </div>
      </div>

      {/* Walking Track */}
      <div className="relative h-28 bg-white/30 backdrop-blur-xs rounded-xl p-2 border border-white/50 overflow-hidden flex items-center">
        {/* Village Road Floor */}
        <div className="absolute bottom-2 left-0 right-0 h-3 bg-amber-600/30 rounded-full border-t border-amber-700/20" />

        {/* Characters Walking Squad container shifted by progress */}
        <div 
          className="absolute flex items-end gap-2.5 sm:gap-4 transition-all duration-150 ease-linear"
          style={{
            left: `${Math.max(2, Math.min(85, progress))}%`,
            transform: 'translateX(-50%)'
          }}
        >
          {characters.map((c, i) => (
            <div 
              key={c.name} 
              className="flex flex-col items-center select-none"
              style={{
                animation: `bounce 0.6s infinite alternate ${i * 0.08}s`
              }}
            >
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-white/90 text-slate-800 shadow-xs mb-0.5 whitespace-nowrap">
                {c.name}
              </span>
              <div className="text-2xl sm:text-3xl filter drop-shadow hover:scale-125 transition-transform">
                {c.emoji}
              </div>
            </div>
          ))}
        </div>

        {/* Floating musical notes */}
        <div className="absolute top-2 right-4 text-xs animate-pulse text-white font-bold flex gap-2">
          <span>🎵</span>
          <span>🎶</span>
          <span>✨</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/40 h-2 rounded-full mt-2 overflow-hidden">
        <div 
          className="bg-emerald-500 h-full rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
