import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Music, Wind } from 'lucide-react';
import { useLivingGarden } from '../../context/LivingGardenContext';

export const NatureAudioEngine: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { timeOfDay } = useLivingGarden();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);
  const chimeTimerRef = useRef<any>(null);

  const toggleAudio = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  const startSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      setIsPlaying(true);

      // Play soft bird chirps / chimes periodically based on timeOfDay
      timerRef.current = setInterval(() => {
        if (timeOfDay === 'Malam') {
          playCricketChirp();
        } else {
          playBirdChirp();
        }
      }, 3500);

      chimeTimerRef.current = setInterval(() => {
        playSoftWindChime();
      }, 7000);

      // Play initial sounds
      if (timeOfDay === 'Malam') {
        playCricketChirp();
      } else {
        playBirdChirp();
      }
      playSoftWindChime();
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  const stopSound = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (chimeTimerRef.current) {
      clearInterval(chimeTimerRef.current);
      chimeTimerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const playBirdChirp = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Gentle realistic bird frequency ramp
    osc.frequency.setValueAtTime(1900, now);
    osc.frequency.exponentialRampToValueAtTime(2700, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(2100, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  };

  const playCricketChirp = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(4200, now);
    osc.frequency.setValueAtTime(4500, now + 0.03);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.015, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  };

  const playSoftWindChime = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    const ctx = audioCtxRef.current;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // Pentatonic notes C, E, G, C
    const note = freqs[Math.floor(Math.random() * freqs.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(note, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (chimeTimerRef.current) clearInterval(chimeTimerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      title={
        isPlaying
          ? 'Matikan Suara Alam'
          : `Putar Suara Alam Taman (${timeOfDay === 'Malam' ? 'Kunang-kunang & Gemericik' : 'Kicau Burung & Angin Taman'})`
      }
      className={`fixed bottom-24 right-5 z-40 p-3 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 flex items-center gap-2 text-xs font-bold cursor-pointer ${
        isPlaying
          ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/80 animate-pulse'
          : 'bg-white/95 text-emerald-950 border-emerald-300 hover:bg-emerald-50'
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-stone-950 animate-bounce" />
          <span className="hidden sm:inline">Suara Alam Aktif</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Suara Alam</span>
        </>
      )}
    </button>
  );
};
