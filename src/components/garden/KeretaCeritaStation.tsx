import React, { useState } from 'react';
import { 
  Sparkles, ChevronRight, BookOpen, Star, Volume2, Heart, 
  Smile, ShieldCheck, X, Check, Award, ArrowRight
} from 'lucide-react';
import { TRAIN_WAGONS, TrainWagon } from '../../services/tvAsySyifaService';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const KeretaCeritaStation: React.FC<{ onWagonSelect?: (wagon: TrainWagon) => void }> = ({ onWagonSelect }) => {
  const [selectedWagon, setSelectedWagon] = useState<TrainWagon | null>(null);
  const [isTrainWhistling, setIsTrainWhistling] = useState<boolean>(false);

  const handleWhistle = () => {
    setIsTrainWhistling(true);
    tadeSoundEngine.playFx('TRAIN_CHIME');

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G15-KERETA-CERITA',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Peluit Kereta Cerita dibunyikan oleh Masinis Asy!'
    });

    setTimeout(() => {
      setIsTrainWhistling(false);
    }, 1200);
  };

  const handleOpenWagon = (wagon: TrainWagon) => {
    setSelectedWagon(wagon);
    tadeSoundEngine.playFx('POP_WAGON');

    blackBoxRecorder.record({
      ring: 'RING_2',
      moduleCode: 'G15-KERETA-CERITA',
      role: 'SANTRI',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Gerbong Kereta dibuka: [Gerbong ${wagon.wagonNumber}] "${wagon.themeTitle}" (${wagon.highlightText})`
    });

    if (onWagonSelect) {
      onWagonSelect(wagon);
    }
  };

  return (
    <section className="w-full my-6">
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-green-950 text-white rounded-3xl p-5 sm:p-7 border-4 border-amber-400/90 shadow-2xl relative overflow-hidden">
        {/* Background Train Track Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Header Station Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl shadow-lg border-2 border-white">
              <span>🚂</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 tracking-wider">
                  Sprint G15 • Kereta Cerita
                </span>
                <span className="text-xs text-emerald-300 font-bold hidden sm:inline">
                  Stasiun Sentra Belajar Asy & Syifa
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Kereta Cerita Tematik (7 Gerbong Penuh Ilmu)
              </h3>
            </div>
          </div>

          {/* Whistle Button */}
          <button
            onClick={handleWhistle}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all transform cursor-pointer border-2 border-white ${
              isTrainWhistling ? 'scale-110 rotate-3 bg-yellow-300' : 'hover:scale-105'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>{isTrainWhistling ? 'Tuuuut! Tuuuut! 🚂' : 'Bunyikan Peluit Masinis'}</span>
          </button>
        </div>

        {/* Scrollable Train Track with Locomotive & 7 Wagons */}
        <div className="relative z-10 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-amber-400/40">
          <div className="flex items-end gap-3.5 min-w-max px-2">
            {/* Locomotive Head with Masinis Asy */}
            <div className="w-64 sm:w-72 p-4 rounded-3xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-green-600 border-4 border-amber-300 shadow-xl text-white relative group shrink-0">
              {/* Animated Steam puff */}
              <div className="absolute -top-6 left-12 flex gap-1 animate-bounce">
                <span className="text-base">💨</span>
                <span className="text-xs opacity-75">☁️</span>
              </div>

              {/* Chimney */}
              <div className="w-8 h-4 bg-amber-400 mx-auto -mt-6 rounded-t-lg border-2 border-amber-200" />

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 shrink-0 bg-white/20 rounded-2xl p-1 backdrop-blur-sm border border-white/40">
                  <CartoonCharacterSvg type="ASY" size={60} expression="HAPPY" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    Lokomotif Utama
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    Masinis Cilik Asy
                  </h4>
                  <p className="text-[11px] text-emerald-100 font-medium leading-snug">
                    "Bismillah! Ayo jelajahi 7 gerbong kebaikan hari ini!"
                  </p>
                </div>
              </div>

              {/* Train Wheels with Coupler */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-emerald-500/50">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-300 flex items-center justify-center text-[10px] text-amber-300">⚙️</div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-300 flex items-center justify-center text-[10px] text-amber-300">⚙️</div>
                </div>
                <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Siap Meluncur
                </span>
              </div>
            </div>

            {/* Coupler link */}
            <div className="w-4 h-2 bg-amber-400 rounded-full shrink-0 -mx-1 self-center" />

            {/* 7 Thematic Wagons */}
            {TRAIN_WAGONS.map((wagon, idx) => (
              <React.Fragment key={wagon.id}>
                <div
                  onClick={() => handleOpenWagon(wagon)}
                  className={`w-52 sm:w-56 p-3.5 rounded-3xl bg-gradient-to-tr ${wagon.color} border-3 border-amber-300 shadow-xl text-white cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300 shrink-0 relative group`}
                >
                  {/* Wagon Roof Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-sm border border-white/30 text-white">
                      Gerbong {wagon.wagonNumber}
                    </span>
                    <span className="text-xl group-hover:scale-125 transition-transform">{wagon.iconEmoji}</span>
                  </div>

                  <h4 className="text-xs font-black text-white group-hover:text-amber-200 transition-colors truncate">
                    {wagon.themeTitle}
                  </h4>
                  
                  <p className="text-[11px] font-bold text-amber-200 mt-0.5 line-clamp-1">
                    {wagon.highlightText}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-[10px]">
                    <span className="text-white/80 font-medium">Buka Gerbong</span>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold shadow">
                      ➔
                    </span>
                  </div>

                  {/* Wagon Wheels */}
                  <div className="flex justify-between mt-2 px-2">
                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-amber-300" />
                    <div className="w-4 h-4 rounded-full bg-slate-900 border border-amber-300" />
                  </div>
                </div>

                {idx < TRAIN_WAGONS.length - 1 && (
                  <div className="w-3 h-2 bg-amber-400 rounded-full shrink-0 -mx-1 self-center" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Instruction Pill */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-emerald-200 gap-2 border-t border-emerald-800/80 pt-3">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Ketuk salah satu gerbong untuk membuka kartu belajar tematik harian!
          </span>
          <span className="bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-700 text-amber-300 font-extrabold text-[11px]">
            7 Tema Sentra Lengkap
          </span>
        </div>
      </div>

      {/* Wagon Detail Pop-up Modal */}
      {selectedWagon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Header with Close */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedWagon.color} flex items-center justify-center text-3xl shadow-lg border-2 border-white`}>
                  <span>{selectedWagon.iconEmoji}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                    Gerbong {selectedWagon.wagonNumber} • {selectedWagon.themeCategory}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {selectedWagon.detailContent.heading}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedWagon(null)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subheading */}
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              ✨ {selectedWagon.detailContent.subheading}
            </p>

            {/* Fun Fact Card */}
            <div className="p-3.5 bg-stone-50 dark:bg-slate-800/80 rounded-2xl border border-stone-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                Fakta Menarik & Pengetahuan:
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {selectedWagon.detailContent.funFact}
              </p>
            </div>

            {/* Action Prompt */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-300 text-slate-900 dark:text-amber-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" />
                Tantangan Aksi Ceria:
              </span>
              <p className="text-xs font-bold leading-snug">
                "{selectedWagon.detailContent.actionPrompt}"
              </p>
            </div>

            {/* Quote / Dua */}
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs italic text-center font-semibold">
              {selectedWagon.detailContent.quoteOrDua}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedWagon(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition"
            >
              Tutup & Lanjutkan Kereta Cerita
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
