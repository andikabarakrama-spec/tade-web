import React, { useState } from 'react';
import { Sparkles, Heart, Star, Smile } from 'lucide-react';
import { LIVING_OBJECTS, LivingObject } from '../../services/tvAsySyifaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface LivingObjectsLayerProps {
  room: 'RUANG_TAMU' | 'GUDANG_MAINAN' | 'HALAMAN_DEPAN';
  onObjectTapped?: (object: LivingObject) => void;
}

export const LivingObjectsLayer: React.FC<LivingObjectsLayerProps> = ({ room, onObjectTapped }) => {
  const [activeSpeech, setActiveSpeech] = useState<{ id: string; text: string } | null>(null);
  const [wiggleId, setWiggleId] = useState<string | null>(null);

  const objects = LIVING_OBJECTS.filter(o => o.room === room);

  const handleTap = (obj: LivingObject) => {
    setWiggleId(obj.id);
    setActiveSpeech({ id: obj.id, text: obj.reactionMessage });
    tadeSoundEngine.playFx(obj.soundFx);

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G15-BENDA-HIDUP',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Benda Hidup disentuh: "${obj.name}" (${obj.iconEmoji}) di ${room}`
    });

    if (onObjectTapped) {
      onObjectTapped(obj);
    }

    setTimeout(() => {
      setWiggleId(null);
    }, 800);

    setTimeout(() => {
      setActiveSpeech(prev => prev?.id === obj.id ? null : prev);
    }, 3800);
  };

  if (objects.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-3">
      {objects.map(obj => {
        const isWiggling = wiggleId === obj.id;
        const isSpeaking = activeSpeech?.id === obj.id;

        return (
          <div key={obj.id} className="relative group">
            {/* Speech Bubble popup */}
            {isSpeaking && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 w-48 sm:w-56 bg-amber-300 text-slate-900 text-xs font-black p-2.5 rounded-2xl shadow-xl border-2 border-amber-500 animate-bounce text-center pointer-events-none">
                <div className="flex items-center justify-center gap-1 text-[10px] text-amber-900 font-extrabold uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  {obj.name}
                </div>
                <p className="leading-snug text-slate-900 text-[11px]">{obj.reactionMessage}</p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-amber-500" />
              </div>
            )}

            {/* Interactive Living Object Button */}
            <button
              onClick={() => handleTap(obj)}
              title={`${obj.name} — Ketuk untuk menyapa!`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-amber-300/80 shadow-md hover:shadow-lg transition-all duration-300 transform cursor-pointer text-slate-800 dark:text-slate-100 ${
                isWiggling ? 'scale-110 rotate-6 bg-amber-100 dark:bg-amber-950/60' : 'hover:scale-105'
              }`}
            >
              <div className="relative text-2xl">
                <span>{obj.iconEmoji}</span>
                {/* Micro-sparkle pulse */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping opacity-75" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black leading-tight flex items-center gap-1">
                  <span>{obj.name}</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" />
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Ketuk benda hidup</p>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};
