import React from 'react';
import { 
  StoryPhotoMemory, 
  magicCameraEngine 
} from '../../services/magicCameraEngine';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { 
  Sparkles, Award, Heart, CheckCircle2, Download, 
  Share2, BookOpen, X, Camera, Calendar, ShieldCheck 
} from 'lucide-react';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

interface StoryMemoryCardModalProps {
  photo: StoryPhotoMemory;
  onClose: () => void;
  onOpenStorybook?: () => void;
}

export const StoryMemoryCardModal: React.FC<StoryMemoryCardModalProps> = ({
  photo,
  onClose,
  onOpenStorybook
}) => {
  const handleDownloadStub = () => {
    tadeSoundEngine.playFx('TEPUK_TANGAN_KECIL');
    // Simple printable view trigger or confirmation
    alert(`Foto kenangan "${photo.title}" siap dicetak atau disimpan ke album keluarga!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden text-slate-900 my-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Camera className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 block">
                Sprint G21 • Foto Otomatis Cerita
              </span>
              <h3 className="text-sm font-bold leading-tight">Kartu Kenangan Asy & Syifa</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Polaroid Stage Body */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50 to-amber-50/40">
          
          {/* Polaroid Frame */}
          <div className="bg-white p-4 pb-6 rounded-2xl shadow-lg border-2 border-slate-200 space-y-4">
            
            {/* Stage Visual Art Container */}
            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 border border-slate-200/80 flex items-center justify-center">
              
              {/* Decorative Sun / Sky */}
              <div className="absolute top-3 right-4 text-2xl animate-pulse">☀️</div>
              <div className="absolute top-6 left-4 text-lg">☁️</div>

              {/* Characters inside the memory snapshot */}
              <div className="flex items-end justify-center -space-x-3 z-10">
                {photo.characterRole === 'ASY' && (
                  <CartoonCharacterSvg type="ASY" size={100} movement="LANGKAH_KECIL" expression="BANGGA" />
                )}
                {photo.characterRole === 'SYIFA' && (
                  <CartoonCharacterSvg type="SYIFA" size={100} movement="LAMBAIAN_TANGAN" expression="SENYUM" />
                )}
                {(photo.characterRole === 'DUO' || photo.characterRole === 'KAMPUNG_FRIENDS') && (
                  <>
                    <CartoonCharacterSvg type="ASY" size={90} movement="ANGGUKAN_KEPALA" expression="TERIMA_KASIH" />
                    <CartoonCharacterSvg type="SYIFA" size={90} movement="LAMBAIAN_TANGAN" expression="SENYUM" />
                  </>
                )}
              </div>

              {/* Badge Overlay */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-100 flex items-center gap-1">
                <span>{photo.badgeEmoji}</span>
                <span className="text-[10px] text-emerald-800">{photo.sourceModule.replace('_', ' ')}</span>
              </div>

              {/* Golden Stamp Badge (P5) */}
              {photo.goldenStamp && (
                <div className="absolute bottom-2 right-2 rotate-[-8deg] bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-lg shadow-md border border-amber-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-900" />
                  <span>STEMPEL RESMI ASY SYIFA</span>
                </div>
              )}
            </div>

            {/* Polaroid Handwritten Title & Info */}
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-slate-800 font-serif leading-tight">
                {photo.title}
              </h4>
              <p className="text-xs text-amber-800 font-semibold">{photo.subtitle}</p>
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{photo.dateStr}</span>
              </div>
            </div>

            {/* Moral & Doa Box */}
            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/80 space-y-1.5 text-xs text-left">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>Hikmah Hari Ini:</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                "{photo.moralLesson}"
              </p>
              <p className="text-[11px] text-emerald-800 font-bold italic pt-1 border-t border-emerald-200/60">
                🤲 {photo.duaPhrase}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {onOpenStorybook && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenStorybook();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Buka Buku Cerita</span>
                </button>
              )}

              <button
                onClick={handleDownloadStub}
                className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Simpan Gambar</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Tutup Kartu
            </button>
          </div>

          {/* Verification Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Tersimpan Otomatis di Buku Cerita & Kotak Kenangan Asy</span>
          </div>

        </div>

      </div>
    </div>
  );
};
