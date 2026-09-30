import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Footprints, 
  Smile, 
  Compass, 
  Navigation, 
  Building2,
  ChevronRight,
  Eye,
  Heart
} from 'lucide-react';
import { CAMPUS_ROOMS, CampusRoom } from './DigitalTwinCampusCenter';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

type AsyActionState = 'WAVING' | 'WALKING' | 'POINTING' | 'SPEAKING' | 'IDLE';

export const AsyLivingGuide: React.FC = () => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState<number>(0);
  const [actionState, setActionState] = useState<AsyActionState>('WAVING');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [speechText, setSpeechText] = useState<string>(
    'Assalamu’alaikum! Saya Dek Asy, pemandu hidup Digital Twin Kampus TK Asy Syifa. Mari berkeliling melihat seluruh sentra belajar kita!'
  );
  const [blinkState, setBlinkState] = useState<boolean>(false);

  const currentRoom = CAMPUS_ROOMS[currentRoomIndex];

  // Natural blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleWalkToRoom = (index: number) => {
    setActionState('WALKING');
    setSpeechText(`Sedang berjalan menuju ${CAMPUS_ROOMS[index].name}...`);

    setTimeout(() => {
      setCurrentRoomIndex(index);
      setActionState('POINTING');
      setSpeechText(
        `Kita sudah sampai di ${CAMPUS_ROOMS[index].name}! Di sini ada ${CAMPUS_ROOMS[index].studentsCount} santri bersama ${CAMPUS_ROOMS[index].teacherInCharge}. Ruangannya sejuk ${CAMPUS_ROOMS[index].temperature} dan sangat bersih!`
      );
      blackBoxRecorder.record({
        moduleCode: 'R477',
        eventType: 'ACTION',
        severity: 'INFO',
        details: `Asy Living Guide guided user to ${CAMPUS_ROOMS[index].code}`
      });
    }, 1000);
  };

  const handleWave = () => {
    setActionState('WAVING');
    setSpeechText('Halo semuanya! Senang sekali bisa mendampingi Ayah, Bunda, dan Guru hebat di TK Asy Syifa!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R477 &bull; ASY LIVING GUIDE
          </span>
          <span className="text-xs text-slate-400 font-mono">Interactive 3D Living Mascot Companion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Bot className="w-8 h-8 text-cyan-400" />
          Dek Asy Living Guide &bull; Pemandu Hidup Kampus
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Mascot cerdas dan ramah Dek Asy yang hidup di dalam ekosistem Digital Twin. Asy dapat berjalan dari satu ruangan ke ruangan lain, menunjuk area sentra, melambaikan tangan, dan memberikan narasi edukatif ramah anak secara interaktif.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mascot Interactive Visual Stage (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            {/* Header Stage Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  3D LIVING MASCOT STAGE &bull; STATUS: {actionState}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  title="Toggle Suara Asy"
                >
                  {isAudioEnabled ? <Volume2 className="w-4 h-4 text-cyan-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  onClick={handleWave}
                  className="px-3 py-1.5 rounded-xl bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-200 cursor-pointer"
                >
                  👋 Lambaikan Tangan
                </button>
              </div>
            </div>

            {/* Visual Living Asy Mascot Avatar in Virtual Campus */}
            <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-sky-100 via-indigo-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6">
              {/* Virtual Background Elements */}
              <div className="absolute top-4 left-6 text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                Lokasi Saat Ini: <span className="text-cyan-600 dark:text-cyan-400">{currentRoom.name}</span>
              </div>

              {/* Dek Asy Animated Character Mascot */}
              <div className={`transition-all duration-700 flex flex-col items-center ${
                actionState === 'WALKING' ? 'animate-pulse scale-95 translate-x-4' : 'scale-100'
              }`}>
                {/* Character Head with Hat and Glowing Eyes */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-400 shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center">
                  {/* Songkok / Muslim Cap Icon */}
                  <div className="absolute -top-3 px-3 py-1 rounded-full bg-indigo-900 text-white text-[9px] font-mono font-bold shadow-md">
                    TK ASY SYIFA
                  </div>

                  {/* Face details */}
                  <div className="flex flex-col items-center">
                    {/* Eyes */}
                    <div className="flex items-center gap-5 mt-2">
                      <div className={`w-3.5 h-3.5 rounded-full bg-slate-900 transition-all ${blinkState ? 'h-0.5 mt-3' : ''} flex items-center justify-center`}>
                        {!blinkState && <div className="w-1 h-1 rounded-full bg-white self-start ml-0.5 mt-0.5" />}
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full bg-slate-900 transition-all ${blinkState ? 'h-0.5 mt-3' : ''} flex items-center justify-center`}>
                        {!blinkState && <div className="w-1 h-1 rounded-full bg-white self-start ml-0.5 mt-0.5" />}
                      </div>
                    </div>

                    {/* Rosy Cheeks */}
                    <div className="flex items-center gap-9 mt-1">
                      <div className="w-2.5 h-1.5 rounded-full bg-rose-400/80" />
                      <div className="w-2.5 h-1.5 rounded-full bg-rose-400/80" />
                    </div>

                    {/* Cute Smile */}
                    <div className="w-4 h-2 border-b-2 border-slate-900 rounded-full mt-0.5" />
                  </div>
                </div>

                {/* Character Body / Clothes */}
                <div className="w-20 h-16 rounded-3xl bg-indigo-600 dark:bg-indigo-700 mt-1 shadow-md flex items-center justify-center relative">
                  <div className="w-1.5 h-8 bg-cyan-300 rounded-full" />
                  {/* Hands */}
                  <div className={`absolute -left-3 top-2 w-4 h-4 rounded-full bg-cyan-200 ${actionState === 'POINTING' ? '-rotate-45' : ''}`} />
                  <div className={`absolute -right-3 top-2 w-4 h-4 rounded-full bg-cyan-200 ${actionState === 'WAVING' ? 'animate-bounce' : ''}`} />
                </div>

                {/* Feet */}
                <div className="flex items-center gap-4 -mt-1">
                  <div className="w-5 h-3 rounded-full bg-slate-800" />
                  <div className="w-5 h-3 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Speech Bubble below mascot */}
              <div className="mt-6 max-w-lg w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-cyan-200 dark:border-cyan-800/60 shadow-lg text-center relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 rotate-45 border-t border-l border-cyan-200 dark:border-cyan-800/60" />
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                  "{speechText}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Navigation & Room Tour Selector (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-500" />
                  TUR KELILING BERSAMA ASY
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Pilih tujuan pemanduan</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-500">11 Ruangan</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {CAMPUS_ROOMS.map((room, idx) => {
                const isCurrent = currentRoomIndex === idx;
                return (
                  <button
                    key={room.id}
                    onClick={() => handleWalkToRoom(idx)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl text-xs font-bold font-mono ${
                        isCurrent ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {room.code}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {room.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate">
                          {room.teacherInCharge} &bull; {room.studentsCount} Santri
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-cyan-500' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
