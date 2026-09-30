import React, { useState } from 'react';
import { 
  Sparkles, X, ShoppingBag, BookOpen, Heart, 
  Smile, Star, Info, MessageSquare 
} from 'lucide-react';
import { FestivalBooth, festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const StanCeriaModal: React.FC<Props> = ({ onClose }) => {
  const booths = festivalCeriaService.getFestivalBooths();
  const [selectedBooth, setSelectedBooth] = useState<FestivalBooth>(booths[0]);

  const handleSelectBooth = (b: FestivalBooth) => {
    setSelectedBooth(b);
    tadeSoundEngine.playFx('TV_CLICK');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" id="stan-ceria-modal">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-amber-50 via-white to-emerald-50 border-4 border-amber-400 shadow-2xl p-6 sm:p-8">
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
            <ShoppingBag className="w-3.5 h-3.5" />
            Sprint G18 P5 — Stan Cerita Festival
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
            <span>🎪</span>
            Stan Ceria Kampung Asy & Syifa
            <span>🏪</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Bukan tempat jual beli, melainkan stan penuh cerita, hikmah, dan teladan persahabatan!
          </p>
        </div>

        {/* Booth Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
          {booths.map(b => {
            const isSelected = selectedBooth.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleSelectBooth(b)}
                className={`p-3 rounded-2xl text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-lg scale-105'
                    : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <span className="text-3xl">{b.icon}</span>
                <span className="mt-1 text-xs font-black line-clamp-1">{b.title.replace('Stan ', '')}</span>
                <span className={`mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {b.keeper.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Booth Interactive Story Card */}
        <div className="rounded-3xl bg-white border-4 border-amber-300 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedBooth.color} flex items-center justify-center text-4xl shadow-md text-white ring-4 ring-amber-100`}>
                {selectedBooth.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {selectedBooth.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                  {selectedBooth.title}
                </h3>
                <p className="text-xs font-bold text-amber-800">
                  Penjaga Stan: {selectedBooth.keeper}
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Bagian Cerita Sekolah
            </div>
          </div>

          {/* Story Snippet */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="font-black text-amber-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Kisah di Stan Ini:
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              {selectedBooth.storySnippet}
            </p>
          </div>

          {/* Wholesome Lesson & Reflection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
              💡
            </div>
            <div>
              <h5 className="font-black text-emerald-950 text-xs uppercase tracking-wide">
                Pesan Moral & Hikmah:
              </h5>
              <p className="text-xs sm:text-sm font-bold text-emerald-900 mt-0.5 leading-relaxed">
                “{selectedBooth.wholesomeMessage}”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
