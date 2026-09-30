import React, { useState, useEffect, useMemo } from 'react';
import { Play, Sparkles, Activity, Eye, RefreshCw, Layers, Sliders } from 'lucide-react';
import { LivingAnimationEngine, MascotAnimationPose, LivingAnimationState } from '../../core/mascot3d/livingAnimationEngine';
import { Asy3DModelCanvas } from './Asy3DModelCanvas';

export const AsyAnimationViewer: React.FC = () => {
  const engine = useMemo(() => LivingAnimationEngine.getInstance(), []);
  const [animState, setAnimState] = useState<LivingAnimationState>(() => engine.getCurrentState());
  const [speed, setSpeed] = useState<number>(() => engine.getSpeedMultiplier());

  useEffect(() => {
    return engine.subscribe(setAnimState);
  }, [engine]);

  const poses: { pose: MascotAnimationPose; name: string; desc: string }[] = [
    { pose: 'IDLE_BREATHING', name: 'Gentle Breathing', desc: 'Siklus pernapasan alami gelombang sinus 3.5 detik.' },
    { pose: 'LOOK_AROUND', name: 'Look Around', desc: 'Menoleh santai dengan sudut pandang acak.' },
    { pose: 'FOOT_SWING', name: 'Foot Swing', desc: 'Ayunan kaki ceria saat duduk di sudut dock.' },
    { pose: 'PEEK', name: 'Curious Peek', desc: 'Mengintip ramah dengan kemiringan kepala +14°.' },
    { pose: 'WAVE', name: 'Happy Wave', desc: 'Melambaikan tangan kanan menyapa pengguna.' },
    { pose: 'SMALL_JUMP', name: 'Small Jump', desc: 'Lompatan kecil gembira saat menyambut keberhasilan.' },
    { pose: 'CELEBRATE', name: 'Celebrate Bounce', desc: 'Kedua tangan terangkat dengan senyum lebar.' },
    { pose: 'READING_DOA', name: 'Reading Doa', desc: 'Sikap tenang khusyuk melantunkan doa harian.' }
  ];

  const handleTrigger = (pose: MascotAnimationPose) => {
    engine.triggerPose(pose, 4000);
  };

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
    engine.setSpeedMultiplier(val);
  };

  return (
    <div id="r783-living-animation-engine" className="space-y-6">
      {/* Live Preview & Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-6 text-white flex flex-col items-center justify-center space-y-4 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            Realtime Canvas Preview
          </h4>

          <div className="p-4 bg-slate-800/80 rounded-3xl border border-slate-700/80">
            <Asy3DModelCanvas
              animState={animState}
              size={140}
            />
          </div>

          <div className="text-center space-y-1">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-mono text-xs font-bold border border-emerald-500/30">
              POSE: {animState.currentPose}
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              Eye: {animState.eyeOpening.toFixed(2)} • Breath: {animState.breathingScale.toFixed(3)}x
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Interactive Pose Trigger Deck
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-stone-500">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-24 accent-emerald-600 cursor-pointer"
              />
              <span className="font-bold text-emerald-700 w-8">{speed}x</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {poses.map(({ pose, name, desc }) => {
              const isActive = animState.currentPose === pose;
              return (
                <div
                  key={pose}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-2 ${
                    isActive
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{name}</span>
                      <span className="text-[10px] font-mono font-bold text-stone-400">{pose}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">{desc}</p>
                  </div>
                  <button
                    onClick={() => handleTrigger(pose)}
                    className="w-full py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3" /> Trigger Pose
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
