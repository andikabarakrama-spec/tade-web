import React from 'react';
import { Sparkles, Heart, Star, X, Home, Smile, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SahabatProfile, kampungCeriaService } from '../../services/kampungCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  sahabat: SahabatProfile | null;
  onClose: () => void;
}

export const RumahSahabatModal: React.FC<Props> = ({ sahabat, onClose }) => {
  if (!sahabat) return null;

  const handlePlayVoice = () => {
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sahabat.greeting);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 overflow-hidden transform transition-all"
        id={`modal-sahabat-${sahabat.id}`}
      >
        {/* Decorative corner ribbons */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full opacity-30 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-tr from-emerald-300 to-teal-400 rounded-full opacity-30 blur-xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md transition-all z-10"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with House Icon & Avatar */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Home className="w-3.5 h-3.5" />
            {sahabat.houseType}
          </div>

          <div className="relative inline-block mx-auto mb-2">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${sahabat.themeColor} flex items-center justify-center text-5xl shadow-lg ring-4 ring-white border-2 border-amber-200 animate-bounce`}>
              {sahabat.characterEmoji}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-2xl border border-amber-200">
              {sahabat.houseEmoji}
            </div>
          </div>

          <h3 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
            {sahabat.name}
            <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {sahabat.species}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Sahabat Setia Kampung Ceria Asy & Syifa</p>
        </div>

        {/* Speech Bubble Greeting */}
        <div className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-md border-2 border-amber-200 mb-5">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
          
          <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed text-center italic">
            {sahabat.greeting}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={handlePlayVoice}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow transition-all active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Dengarkan Suara Sahabat
            </button>
          </div>
        </div>

        {/* Blessing word & Hobbies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-900">Karakter Mulia:</div>
              <div className="text-xs text-emerald-800 leading-snug">{sahabat.blessingWord}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2.5">
            <Star className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-purple-900">Kegemaran:</div>
              <div className="text-xs text-purple-800 leading-snug">
                {sahabat.hobbies.join(' • ')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-200/80">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Stiker Sahabat Terbuka!
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all"
          >
            Kembali ke Peta Kampung
          </button>
        </div>
      </div>
    </div>
  );
};
