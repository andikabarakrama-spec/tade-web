import React from 'react';
import {
  CinemaSeatType,
  CINEMA_SEATS_CATALOG
} from '../../services/bioskopLangitEngine';
import { Sparkles, Armchair, Heart, CheckCircle } from 'lucide-react';

interface CloudSeatSelectorProps {
  activeSeat: CinemaSeatType;
  onSelectSeat: (seat: CinemaSeatType) => void;
  isEcoMode?: boolean;
}

export const CloudSeatSelector: React.FC<CloudSeatSelectorProps> = ({
  activeSeat,
  onSelectSeat,
  isEcoMode = false
}) => {
  const currentSeatInfo = CINEMA_SEATS_CATALOG[activeSeat];

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md text-white shadow-xl">
      {/* Header & Dek Asy Invitation Bubble */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-500/20">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
            <Armchair className="w-5 h-5 text-sky-400" />
            Pilihan Kursi Awan & Angkasa (P3)
          </h3>
          <p className="text-xs text-slate-300">
            Pilih tempat duduk ternyaman untuk menikmati bioskop langit malam ini
          </p>
        </div>

        {/* Asy Mascot Dialogue Bubble */}
        <div className="flex items-center gap-2.5 bg-indigo-950/80 border border-sky-400/40 rounded-xl px-3 py-2 text-xs text-sky-200">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-sm shadow-inner shrink-0">
            👦
          </div>
          <div>
            <span className="font-bold text-amber-300 block text-[11px]">Dek Asy Mengajak:</span>
            <p className="italic text-slate-200 line-clamp-1">{currentSeatInfo.asyVoiceLine}</p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Seat Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.values(CINEMA_SEATS_CATALOG).map((seat) => {
          const isSelected = activeSeat === seat.id;
          return (
            <button
              key={seat.id}
              onClick={() => onSelectSeat(seat.id)}
              className={`relative text-left p-3.5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-b ${seat.bgGradient} ${seat.borderGlow} scale-[1.02] shadow-lg ring-2 ring-amber-400/50`
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-500/80 hover:bg-slate-800/90'
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400 text-indigo-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                  <CheckCircle className="w-3 h-3" /> Dipilih
                </div>
              )}

              <div>
                {/* Seat Emoji & Icon Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-indigo-950/60 border border-indigo-400/30 ${
                      isSelected && !isEcoMode ? 'animate-bounce' : ''
                    }`}
                    style={{ animationDuration: '2.5s' }}
                  >
                    {seat.iconEmoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">{seat.name}</h4>
                    <span className="text-[10px] text-amber-300 font-medium">{seat.fluffiness}</span>
                  </div>
                </div>

                {/* Subtitle Description */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-2">{seat.subtitle}</p>
              </div>

              {/* Atmosphere Tag */}
              <div className="mt-2 pt-2 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {seat.atmosphere}
                </span>
                <Heart className={`w-3.5 h-3.5 ${isSelected ? 'text-pink-400 fill-pink-400' : 'text-slate-500'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
