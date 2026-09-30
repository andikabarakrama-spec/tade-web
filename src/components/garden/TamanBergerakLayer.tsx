import React, { useState } from 'react';
import { Sparkles, Heart, Waves, Flower2, Feather } from 'lucide-react';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const TamanBergerakLayer: React.FC = () => {
  const [butterflyPos, setButterflyPos] = useState<number>(0);
  const [beeHovering, setBeeHovering] = useState<boolean>(false);
  const [pondRipple, setPondRipple] = useState<boolean>(false);
  const [duckStep, setDuckStep] = useState<number>(0);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const handleButterflyClick = () => {
    setButterflyPos(prev => (prev + 1) % 3);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    setActiveSpeech('Kupu-kupu hinggap di bunga melati yang harum! 🦋');
    
    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-TAMAN-BERGERAK',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Kupu-kupu disentuh dan berpindah kelopak bunga!'
    });

    setTimeout(() => setActiveSpeech(null), 3000);
  };

  const handleBeeClick = () => {
    setBeeHovering(true);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    setActiveSpeech('Lebah Mimi sedang mengumpulkan madu manis! 🐝');
    
    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-TAMAN-BERGERAK',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Lebah Mimi disentuh di pekarangan bunga!'
    });

    setTimeout(() => setBeeHovering(false), 1200);
    setTimeout(() => setActiveSpeech(null), 3000);
  };

  const handlePondClick = () => {
    setPondRipple(true);
    tadeSoundEngine.playFx('GENTLE_WATER');
    setActiveSpeech('Ikan koi merah berenang ceria di air jernih! 🐟');
    
    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-TAMAN-BERGERAK',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Kolam ikan disentuh, timbul riak air lembut.'
    });

    setTimeout(() => setPondRipple(false), 1200);
    setTimeout(() => setActiveSpeech(null), 3000);
  };

  const handleDuckClick = () => {
    setDuckStep(prev => (prev + 1) % 4);
    tadeSoundEngine.playFx('POP_WAGON');
    setActiveSpeech('Kwek! Bebek Dodo dan anaknya berjalan berbaris rapi! 🦆');
    
    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-TAMAN-BERGERAK',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Bebek Dodo disentuh dan melangkah tertib.'
    });

    setTimeout(() => setActiveSpeech(null), 3000);
  };

  return (
    <div className="relative w-full my-4 p-4 sm:p-5 bg-gradient-to-r from-emerald-950/60 via-teal-950/50 to-green-950/60 rounded-3xl border border-emerald-500/40 backdrop-blur-md space-y-3">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 flex items-center gap-1 shadow">
            <Feather className="w-3 h-3 text-emerald-950" />
            Taman Bergerak Asy & Syifa
          </span>
          <span className="text-xs text-emerald-200 font-bold">
            Kehidupan Alami Ceria
          </span>
        </div>
        <span className="text-[10px] text-amber-300 font-bold bg-emerald-900/60 px-2.5 py-0.5 rounded-xl border border-emerald-700">
          Sentuh makhluk taman untuk menyapa
        </span>
      </div>

      {/* Floating Active Speech Bubble */}
      {activeSpeech && (
        <div className="mx-auto max-w-sm p-2 rounded-2xl bg-amber-300 text-slate-950 text-xs font-black text-center border-2 border-amber-500 shadow-lg animate-bounce">
          {activeSpeech}
        </div>
      )}

      {/* Garden Creatures Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        
        {/* 1. Kupu-kupu flitting */}
        <div
          onClick={handleButterflyClick}
          className="p-3 rounded-2xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-600/40 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-between text-center group"
          title="Ketuk kupu-kupu"
        >
          <div className="h-10 flex items-center justify-center">
            <span 
              className={`text-3xl transition-transform duration-700 transform ${
                butterflyPos === 0 ? '-translate-x-3 -rotate-6' : butterflyPos === 1 ? 'translate-x-3 rotate-6' : 'translate-y-1 scale-110'
              }`}
            >
              🦋
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1">
              Kupu-kupu
            </span>
            <p className="text-[10px] text-emerald-200">Berpindah bunga</p>
          </div>
        </div>

        {/* 2. Lebah Mimi buzzing */}
        <div
          onClick={handleBeeClick}
          className="p-3 rounded-2xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-600/40 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-between text-center group"
          title="Ketuk lebah madu"
        >
          <div className="h-10 flex items-center justify-center">
            <span className={`text-3xl ${beeHovering ? 'animate-bounce scale-125' : 'group-hover:animate-pulse'}`}>
              🐝
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1">
              Lebah Mimi
            </span>
            <p className="text-[10px] text-emerald-200">Kelilingi bunga</p>
          </div>
        </div>

        {/* 3. Kolam Ikan Koi Berenang */}
        <div
          onClick={handlePondClick}
          className="p-3 rounded-2xl bg-teal-900/40 hover:bg-teal-800/60 border border-teal-600/40 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-between text-center group"
          title="Ketuk kolam ikan koi"
        >
          <div className="h-10 flex items-center justify-center relative w-full">
            <span className={`text-2xl transition-transform duration-500 ${pondRipple ? 'scale-125 rotate-12' : 'group-hover:translate-x-2'}`}>
              🐟
            </span>
            <span className="text-sm ml-1 opacity-80">🐠</span>
            {pondRipple && (
              <span className="absolute inset-0 rounded-full border-2 border-teal-300 animate-ping opacity-60 pointer-events-none" />
            )}
          </div>
          <div className="mt-1">
            <span className="text-xs font-black text-teal-300 flex items-center justify-center gap-1">
              Kolam Ikan Koi
            </span>
            <p className="text-[10px] text-teal-200">Berenang ceria</p>
          </div>
        </div>

        {/* 4. Bebek Berjalan */}
        <div
          onClick={handleDuckClick}
          className="p-3 rounded-2xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-600/40 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-between text-center group"
          title="Ketuk bebek berbaris"
        >
          <div className="h-10 flex items-center justify-center gap-1">
            <span className={`text-2xl transition-transform duration-300 ${duckStep % 2 === 0 ? 'rotate-3' : '-rotate-3'}`}>
              🦆
            </span>
            <span className="text-base animate-bounce">🐤</span>
          </div>
          <div className="mt-1">
            <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1">
              Bebek Dodo
            </span>
            <p className="text-[10px] text-emerald-200">Berjalan tertib</p>
          </div>
        </div>

      </div>
    </div>
  );
};
