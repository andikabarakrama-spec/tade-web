import React, { useState } from 'react';
import { X, Moon, Sun, Heart, Sparkles, Volume2, Calendar, BookOpen, Lamp } from 'lucide-react';
import { kampungCeriaService } from '../../services/kampungCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const MasjidKampungModal: React.FC<Props> = ({ onClose }) => {
  const masjidData = kampungCeriaService.getMasjidData();
  const [isNightLightOn, setIsNightLightOn] = useState<boolean>(false);
  const [showJumatMessage, setShowJumatMessage] = useState<boolean>(false);

  const handlePlayDoaVoice = () => {
    tadeSoundEngine.playFx('MASJID_BELL_DOA');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(masjidData.todayDoa.meaning);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleNightLight = () => {
    setIsNightLightOn(!isNightLightOn);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-4 transition-all overflow-hidden ${
        isNightLightOn 
          ? 'bg-slate-900 border-amber-400 text-amber-50 shadow-amber-500/20 ring-4 ring-amber-400/20' 
          : 'bg-gradient-to-b from-emerald-50 to-white border-emerald-300 text-slate-800'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all z-10 ${
            isNightLightOn ? 'bg-slate-800 text-amber-200 hover:bg-slate-700' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            isNightLightOn ? 'bg-amber-900/60 border border-amber-500/50 text-amber-300' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Masjid Kampung (Sprint G17 P5)
          </div>

          <div className="relative inline-block mx-auto mb-2">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 transition-all ${
              isNightLightOn 
                ? 'bg-emerald-950 border-amber-400 ring-4 ring-amber-400/30 text-amber-300' 
                : 'bg-emerald-600 border-emerald-200 text-white'
            }`}>
              🕌
            </div>
            {isNightLightOn && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black">{masjidData.name}</h3>
          <p className={`text-xs mt-0.5 font-medium ${isNightLightOn ? 'text-amber-200/70' : 'text-slate-500'}`}>
            Pusat Kedamaian, Sholawat & Doa Harian Santri
          </p>
        </div>

        {/* Doa Hari Ini Card */}
        <div className={`p-4 sm:p-5 rounded-2xl border-2 mb-4 transition-all ${
          isNightLightOn 
            ? 'bg-slate-800/90 border-amber-500/40 text-amber-100' 
            : 'bg-white border-emerald-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-3.5 h-3.5" />
              {masjidData.todayDoa.title}
            </div>
            <button
              onClick={handlePlayDoaVoice}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold shadow"
            >
              <Volume2 className="w-3 h-3" />
              Lantunkan Doa
            </button>
          </div>

          <div className="text-center my-3">
            <div className="text-xl sm:text-2xl font-serif text-emerald-700 dark:text-emerald-300 leading-relaxed font-bold">
              {masjidData.todayDoa.arabic}
            </div>
            <div className="text-xs italic text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {masjidData.todayDoa.latin}
            </div>
          </div>

          <p className="text-xs text-center font-medium leading-snug text-slate-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-slate-700/50 p-2.5 rounded-xl">
            {masjidData.todayDoa.meaning}
          </p>
        </div>

        {/* Interactive Features: Jumat Mubarak & Night Lights */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            onClick={() => {
              setShowJumatMessage(!showJumatMessage);
              tadeSoundEngine.playFx('MASJID_BELL_DOA');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              showJumatMessage
                ? 'border-emerald-500 bg-emerald-100/80 text-emerald-950 font-bold shadow'
                : isNightLightOn
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'border-emerald-200 bg-white hover:bg-emerald-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Pesan Hari Jumat
            </div>
            <p className="text-[10px] leading-tight opacity-80 line-clamp-2">
              {showJumatMessage ? masjidData.jumatMessage : 'Ketuk untuk membaca pesan sholawat & Jumat berkah.'}
            </p>
          </button>

          <button
            onClick={handleToggleNightLight}
            className={`p-3 rounded-2xl border text-left transition-all ${
              isNightLightOn
                ? 'border-amber-400 bg-amber-950 text-amber-200 font-bold shadow-md shadow-amber-500/20'
                : 'border-slate-200 bg-white hover:bg-amber-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
              <Lamp className="w-3.5 h-3.5 text-amber-500" />
              Lampu Kubah Malam
            </div>
            <p className="text-[10px] leading-tight opacity-80">
              {isNightLightOn ? '✨ Lampu kubah menyala hangat' : '🌙 Ketuk untuk menyalakan lampu malam'}
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-3 border-t text-xs ${
          isNightLightOn ? 'border-slate-700 text-slate-400' : 'border-emerald-100 text-slate-500'
        }`}>
          <span>Suasana damai Kampung Ceria</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs shadow transition-all ${
              isNightLightOn ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
