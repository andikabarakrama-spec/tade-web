import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles, BookOpen, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import { MarketStall, kampungCeriaService } from '../../services/kampungCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface Props {
  onClose: () => void;
}

export const PasarCeriaModal: React.FC<Props> = ({ onClose }) => {
  const stalls = kampungCeriaService.getMarketStalls();
  const [selectedStall, setSelectedStall] = useState<MarketStall>(stalls[0]);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [asyDialogue, setAsyDialogue] = useState<string>(
    '“Hari ini kita berkunjung ke Pasar Ceria untuk memilih buku cerita dan buah segar yang bermanfaat!”'
  );

  const handleSelectItem = (item: { name: string; icon: string; quote: string }) => {
    setSelectedItemName(item.name);
    setAsyDialogue(`“Alhamdulillah, Asy & sahabat memilih ${item.name} (${item.icon})! ${item.quote}.”`);
    tadeSoundEngine.playFx('POP_WAGON');

    if (item.name.includes('Balon Emas')) {
      kampungCeriaService.unlockSticker('stk_emas_mahkota');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-orange-50 to-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-orange-300 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Pasar Ceria Kampung (Sprint G17 P4)
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            Pojok Berniaga & Kisah Teladan
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Pasar kartun ramah santri untuk belajar mengenal buah berkah, buku cerita teladan, balon keceriaan, dan bunga taman.
          </p>
        </div>

        {/* Stall selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {stalls.map(stall => {
            const isSelected = selectedStall.id === stall.id;
            return (
              <button
                key={stall.id}
                onClick={() => {
                  setSelectedStall(stall);
                  setSelectedItemName(null);
                  setAsyDialogue(`“Selamat datang di ${stall.name}! ${stall.speechQuote}”`);
                  tadeSoundEngine.playFx('TV_CLICK');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 border border-orange-200 hover:bg-orange-100'
                }`}
              >
                <span className="text-base">{stall.emoji}</span>
                {stall.name}
              </button>
            );
          })}
        </div>

        {/* Active Stall Card */}
        <div className="p-5 rounded-2xl bg-white border-2 border-orange-200 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedStall.themeColor} flex items-center justify-center text-2xl text-white shadow`}>
                {selectedStall.emoji}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">{selectedStall.name}</h4>
                <p className="text-xs text-slate-500 font-medium">Penjual: {selectedStall.shopkeeper}</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 font-bold">
              Bukan Transaksi Uang Asli
            </span>
          </div>

          <p className="text-xs italic text-slate-600 bg-orange-50/70 p-2.5 rounded-xl border border-orange-100 mb-4">
            {selectedStall.speechQuote}
          </p>

          {/* Items to pick */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {selectedStall.goods.map((item, idx) => {
              const isChosen = selectedItemName === item.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col items-center text-center ${
                    isChosen
                      ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
                      : 'border-slate-200 hover:border-orange-300 bg-slate-50/70 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{item.quote}</span>
                  <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Pilih & Pelajari
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asy & Syifa Speech Dialogue Card */}
        <div className="p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300 flex items-start gap-3 mb-5">
          <div className="text-3xl">👦</div>
          <div>
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Pesan Hikmah Asy:
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
              {asyDialogue}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-orange-100">
          <span className="text-xs text-slate-500 font-medium">
            Nilai Edukasi: Adab berdagang jujur & memilih barang berfaedah
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all"
          >
            Tutup Pasar
          </button>
        </div>
      </div>
    </div>
  );
};
