import React, { useState } from 'react';
import { 
  Sparkles, X, Volume2, Award, Music, BookOpen, 
  Heart, Star, Mic, ThumbsUp, PartyPopper 
} from 'lucide-react';
import { StagePerformance, festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const PanggungCeriaModal: React.FC<Props> = ({ onClose }) => {
  const performances = festivalCeriaService.getStagePerformances();
  const [activePerf, setActivePerf] = useState<StagePerformance>(performances[0]);
  const [isPlayingAudienceApplause, setIsPlayingAudienceApplause] = useState<boolean>(false);

  const handleSelectPerf = (perf: StagePerformance) => {
    setActivePerf(perf);
    festivalCeriaService.recordStagePerformance(perf.id);
    if (perf.audioKey) {
      tadeSoundEngine.playFx(perf.audioKey as any);
    }
  };

  const handleGiveApplause = () => {
    setIsPlayingAudienceApplause(true);
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    setTimeout(() => {
      setIsPlayingAudienceApplause(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" id="panggung-ceria-modal">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-amber-50 via-white to-orange-50 border-4 border-amber-400 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold transition-all cursor-pointer shadow-xs z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Mic className="w-3.5 h-3.5" />
            Sprint G18 P2 — Panggung Ceria Festival
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
            <span>🎭</span>
            Panggung Ceria Asy & Syifa
            <span>🎪</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Asy memandu acara dengan santun, Syifa bertepuk tangan riang memberi semangat kepada seluruh penampil!
          </p>
        </div>

        {/* Performance Category Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {performances.map(perf => {
            const isSelected = activePerf.id === perf.id;
            return (
              <button
                key={perf.id}
                onClick={() => handleSelectPerf(perf)}
                className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-lg scale-102'
                    : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{perf.characterEmoji.split(' ')[0]}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {perf.category}
                  </span>
                </div>
                <span className="mt-2 text-xs font-black line-clamp-2 leading-snug">
                  {perf.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Stage Spotlight Visual Scene */}
        <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 border-4 border-amber-400 p-6 sm:p-8 text-white shadow-xl overflow-hidden mb-6">
          {/* Stage Curtains & Lights */}
          <div className="absolute -top-6 left-0 right-0 h-14 bg-gradient-to-b from-red-600 to-rose-800 rounded-b-3xl opacity-80 pointer-events-none shadow-md" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto pt-4">
            {/* Performer Avatar Spotlight */}
            <div className="relative mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl ring-8 ring-amber-300/40 animate-bounce" style={{ animationDuration: '3s' }}>
                {activePerf.characterEmoji}
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Live on Stage
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
              {activePerf.title}
            </h3>
            <p className="text-xs text-amber-100/90 font-bold mt-1">
              Oleh: {activePerf.performer}
            </p>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              {activePerf.description}
            </p>

            {/* Performance Dialogue Speech Bubble */}
            <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-sm sm:text-base font-bold italic shadow-inner">
              {activePerf.speechText}
            </div>

            {/* Syifa Clapping Action Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleGiveApplause}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>👏</span>
                Syifa Beri Tepuk Tangan Meriah!
                {isPlayingAudienceApplause && <Sparkles className="w-4 h-4 animate-spin" />}
              </button>
            </div>
          </div>
        </div>

        {/* Asy MC & Syifa Feedback Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Asy MC Speech */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl shrink-0 shadow">
              👦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-emerald-950 text-xs">Asy (Pembawa Acara)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-md bg-emerald-200 text-emerald-900 font-bold">MC</span>
              </div>
              <p className="text-xs text-emerald-900 mt-1 italic font-medium leading-relaxed">
                {activePerf.mcAnnouncement}
              </p>
            </div>
          </div>

          {/* Syifa Cheering */}
          <div className="p-4 rounded-2xl bg-pink-50 border-2 border-pink-300 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center text-2xl shrink-0 shadow">
              👧
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-pink-950 text-xs">Syifa (Penyemangat)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-md bg-pink-200 text-pink-900 font-bold">Tepuk Tangan</span>
              </div>
              <p className="text-xs text-pink-900 mt-1 italic font-medium leading-relaxed">
                “Subhanallah! Sungguh penampilan yang indah dan menginspirasi kita semua untuk terus belajar.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
