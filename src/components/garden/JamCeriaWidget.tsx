import React, { useState, useEffect } from 'react';
import { Clock, Bell, Sparkles, Heart, Sun, Moon } from 'lucide-react';
import { livingWorldEngine, TimePhase } from '../../services/livingWorldEngine';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const JamCeriaWidget: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('');
  const [timePhase, setTimePhase] = useState<TimePhase>(() => livingWorldEngine.getTimePhase());
  const [isChiming, setIsChiming] = useState<boolean>(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}`);
      setTimePhase(livingWorldEngine.getTimePhase());
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);

    const unsub = livingWorldEngine.subscribe(() => {
      setTimePhase(livingWorldEngine.getTimePhase());
    });

    return () => {
      clearInterval(interval);
      unsub();
    };
  }, []);

  const handleChime = () => {
    setIsChiming(true);
    setShowGreetingBubble(true);
    tadeSoundEngine.playFx('CLOCK_CHIME');

    const greeting = livingWorldEngine.getJamCeriaGreeting();

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G16-JAM-CERIA',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Jam Ceria berdentang: "${greeting.subtitle}" pada pukul ${timeString}`
    });

    setTimeout(() => {
      setIsChiming(false);
    }, 1500);

    setTimeout(() => {
      setShowGreetingBubble(false);
    }, 4500);
  };

  const phaseConfig = livingWorldEngine.getTimePhaseConfig(timePhase);

  return (
    <div className="relative flex items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-r from-amber-950/80 via-amber-900/70 to-amber-950/80 rounded-2xl border-2 border-amber-400/70 shadow-lg text-white">
      
      {/* Clock Icon & Pendulum */}
      <div 
        onClick={handleChime}
        className={`w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center cursor-pointer shadow-md border-2 border-white hover:scale-105 transition-transform shrink-0 ${
          isChiming ? 'animate-spin-slow scale-110 bg-yellow-300' : ''
        }`}
        title="Ketuk Jam Ceria untuk mendengarkan dentang lonceng & sapaan!"
      >
        <Clock className="w-6 h-6 text-slate-950" />
        <span className="text-[8px] font-black leading-none mt-0.5">DENTANG</span>
      </div>

      {/* Clock Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950 flex items-center gap-1">
            <span>{phaseConfig.sunOrMoonEmoji}</span>
            {phaseConfig.label}
          </span>
          <span className="text-xs font-black text-amber-200">
            {timeString} WIB
          </span>
        </div>
        <p className="text-xs text-amber-100 font-semibold leading-tight mt-0.5 truncate">
          "{phaseConfig.greetingText}"
        </p>
      </div>

      {/* Gentle Sound Chime Button */}
      <button
        onClick={handleChime}
        className="p-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-200 hover:text-white border border-amber-500/50 transition cursor-pointer shrink-0"
        title="Bunyikan Lonceng Jam Ceria"
      >
        <Bell className={`w-4 h-4 ${isChiming ? 'text-yellow-300 animate-bounce' : ''}`} />
      </button>

      {/* Pop-up Soft Greeting Bubble */}
      {showGreetingBubble && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 w-72 sm:w-80 bg-amber-300 text-slate-950 p-2.5 rounded-2xl shadow-xl border-2 border-amber-500 text-center animate-bounce pointer-events-none">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-black text-amber-900 mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-700" />
            Sapaan Lembut Jam Ceria ({timeString})
          </div>
          <p className="text-[11px] font-bold leading-tight">
            {phaseConfig.greetingText}
          </p>
        </div>
      )}
    </div>
  );
};
