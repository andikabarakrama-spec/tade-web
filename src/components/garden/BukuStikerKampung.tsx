import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Award, Heart, ShieldCheck, Lock, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { KampungSticker, kampungCeriaService } from '../../services/kampungCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const BukuStikerKampung: React.FC = () => {
  const [stickers, setStickers] = useState<KampungSticker[]>(kampungCeriaService.getAllStickers());
  const [selectedSticker, setSelectedSticker] = useState<KampungSticker | null>(null);

  useEffect(() => {
    const unsub = kampungCeriaService.subscribe(() => {
      setStickers(kampungCeriaService.getAllStickers());
    });
    return () => unsub();
  }, []);

  const unlockedCount = stickers.filter(s => s.isUnlocked).length;
  const totalCount = stickers.length;

  const handleInspectSticker = (s: KampungSticker) => {
    setSelectedSticker(s);
    if (s.isUnlocked) {
      tadeSoundEngine.playFx('MAGIC_SPARKLE');
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl" id="buku-stiker-kampung">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Album Stiker Kampung Ceria (Sprint G17 P7)
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            Buku Koleksi Sahabat Asy & Syifa
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Koleksi kenangan dan sahabat yang ditemukan selama berkunjung ke Kampung Ceria. Tanpa peringkat, penuh keceriaan!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-sm">
          <div className="text-3xl">🌟</div>
          <div>
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Koleksi Terbuka</div>
            <div className="text-lg font-black text-slate-800">{unlockedCount} / {totalCount} Stiker</div>
          </div>
        </div>
      </div>

      {/* Grid of 12 Stickers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {stickers.map(sticker => {
          const isSelected = selectedSticker?.id === sticker.id;
          const isGold = sticker.rarity === 'EMAS_LANGKA';
          const isSpecial = sticker.rarity === 'SPESIAL';

          return (
            <div
              key={sticker.id}
              onClick={() => handleInspectSticker(sticker)}
              className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center select-none ${
                sticker.isUnlocked
                  ? isGold
                    ? 'bg-gradient-to-b from-amber-100 to-yellow-200 border-amber-400 shadow-md ring-2 ring-amber-300/60 hover:scale-105'
                    : isSpecial
                    ? 'bg-gradient-to-b from-emerald-50 to-teal-100 border-emerald-300 shadow-sm hover:scale-105'
                    : 'bg-white border-amber-200 shadow-xs hover:border-amber-400 hover:scale-105'
                  : 'bg-slate-100 border-slate-200 opacity-60 hover:opacity-80'
              } ${isSelected ? 'ring-4 ring-orange-400 scale-105' : ''}`}
            >
              {/* Badge for rarity */}
              {sticker.isUnlocked && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              )}

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-2 bg-white/70 shadow-inner">
                {sticker.isUnlocked ? (
                  <span className="transform hover:rotate-12 transition-transform">{sticker.emoji}</span>
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="font-bold text-xs text-slate-800 leading-tight">
                {sticker.isUnlocked ? sticker.name : 'Stiker Terkunci'}
              </div>

              <span className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                isGold 
                  ? 'bg-amber-400 text-amber-950' 
                  : isSpecial 
                  ? 'bg-emerald-200 text-emerald-900' 
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {sticker.rarity.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Sticker Detail Drawer */}
      {selectedSticker && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-300">
              {selectedSticker.isUnlocked ? selectedSticker.emoji : '🔒'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-slate-800 text-base">{selectedSticker.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  {selectedSticker.rarity}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{selectedSticker.description}</p>
              <p className="text-[11px] text-amber-800 font-semibold mt-1">
                Cara Membuka: {selectedSticker.howToUnlock}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {selectedSticker.isUnlocked ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Sudah Dikoleksi
              </span>
            ) : (
              <button
                onClick={() => {
                  kampungCeriaService.unlockSticker(selectedSticker.id);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Buka Stiker Ini
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
