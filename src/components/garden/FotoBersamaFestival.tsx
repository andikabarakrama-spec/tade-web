import React, { useState } from 'react';
import { 
  Camera, Sparkles, Download, Heart, Star, 
  Share2, Check, PartyPopper, Image as ImageIcon 
} from 'lucide-react';
import { FestivalPhotoCard, festivalCeriaService } from '../../services/festivalCeriaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const FotoBersamaFestival: React.FC = () => {
  const theme = festivalCeriaService.getCurrentTheme();
  const [savedPhotos, setSavedPhotos] = useState<FestivalPhotoCard[]>(festivalCeriaService.getSavedPhotos());
  const [customCaption, setCustomCaption] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<'GOLD_BARAKAH' | 'PELANGI_CERIA' | 'ISLAMI_EMERALD'>('GOLD_BARAKAH');
  const [justSnapped, setJustSnapped] = useState<boolean>(false);

  const handleSnapPhoto = () => {
    const newPhoto = festivalCeriaService.savePhotoCard(
      customCaption || `Kenangan Indah ${theme.title}`,
      selectedFrame
    );
    setSavedPhotos(festivalCeriaService.getSavedPhotos());
    setJustSnapped(true);
    setTimeout(() => setJustSnapped(false), 3000);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-amber-50 to-white border-4 border-amber-300 shadow-xl p-6 sm:p-8 space-y-6" id="foto-bersama-festival">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            Sprint G18 P6 — Spot Foto Bersama
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
            Foto Bersama Sahabat Ceria
            <span>📸</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Latar foto otomatis menyesuaikan perayaan sekolah: <strong>{theme.title}</strong>.
          </p>
        </div>

        {/* Frame Style Selector */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'GOLD_BARAKAH', label: '👑 Bingkai Emas' },
            { id: 'PELANGI_CERIA', label: '🌈 Pelangi Ceria' },
            { id: 'ISLAMI_EMERALD', label: '🌿 Zamrud Berkah' }
          ].map(frame => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFrame === frame.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              {frame.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Photo Stage Canvas */}
      <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl transition-all border-8 ${
        selectedFrame === 'GOLD_BARAKAH' ? 'border-amber-400 bg-gradient-to-b from-amber-200 via-amber-50 to-orange-100' :
        selectedFrame === 'PELANGI_CERIA' ? 'border-pink-400 bg-gradient-to-b from-sky-200 via-pink-100 to-amber-100' :
        'border-emerald-500 bg-gradient-to-b from-emerald-200 via-teal-50 to-emerald-100'
      }`}>
        {/* Event Header Banner in Photo Frame */}
        <div className="text-center mb-6">
          <span className="px-4 py-1.5 rounded-full bg-white/90 shadow-md text-slate-800 text-xs font-black uppercase tracking-wider border border-amber-300">
            {theme.badge} • TK Asy Syifa Tanggul
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {customCaption || `Kenangan Manis di ${theme.title}`}
          </h4>
        </div>

        {/* Characters Lineup Photo Visual */}
        <div className="relative z-10 flex flex-wrap items-end justify-center gap-3 sm:gap-4 my-6">
          {/* Asy */}
          <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-4xl sm:text-5xl shadow-xl ring-4 ring-white">
              👦
            </div>
            <span className="text-xs font-black text-emerald-950 mt-1 bg-white/80 px-2 py-0.5 rounded-md">Asy</span>
          </div>

          {/* Syifa */}
          <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '3.2s' }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-4xl sm:text-5xl shadow-xl ring-4 ring-white">
              👧
            </div>
            <span className="text-xs font-black text-pink-950 mt-1 bg-white/80 px-2 py-0.5 rounded-md">Syifa</span>
          </div>

          {/* Bubu */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-3xl shadow-lg ring-2 ring-white">
              🐰
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/80 px-1.5 py-0.2 rounded-md">Bubu</span>
          </div>

          {/* Gogo */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-3xl shadow-lg ring-2 ring-white">
              🐻
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/80 px-1.5 py-0.2 rounded-md">Gogo</span>
          </div>

          {/* Mimi */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-yellow-400 text-white flex items-center justify-center text-3xl shadow-lg ring-2 ring-white">
              🐝
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/80 px-1.5 py-0.2 rounded-md">Mimi</span>
          </div>

          {/* Dodo */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-teal-400 text-white flex items-center justify-center text-3xl shadow-lg ring-2 ring-white">
              🦆
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/80 px-1.5 py-0.2 rounded-md">Dodo</span>
          </div>

          {/* Titi */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg ring-2 ring-white">
              🐢
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/80 px-1.5 py-0.2 rounded-md">Titi</span>
          </div>

          {/* Rara */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-400 text-white flex items-center justify-center text-3xl shadow-lg ring-2 ring-white">
              🦜
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/80 px-1.5 py-0.2 rounded-md">Rara</span>
          </div>
        </div>

        {/* Date & Signature Watermark */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 border-t border-amber-300/60 pt-3">
          <span>📅 {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="text-amber-800">⭐️ Tersambung dengan Creative Studio</span>
        </div>
      </div>

      {/* Snap Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Tulis ucapan atau caption foto..."
          value={customCaption}
          onChange={e => setCustomCaption(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-hidden text-sm bg-white font-medium"
        />
        <button
          onClick={handleSnapPhoto}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          {justSnapped ? 'Foto Berhasil Diambil! ✨' : 'Ambil Foto Bersama (Klik!)'}
        </button>
      </div>

      {/* Photo Gallery Grid */}
      {savedPhotos.length > 0 && (
        <div className="mt-6 pt-6 border-t border-amber-200">
          <h4 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            Galeri Foto Festival Tersimpan ({savedPhotos.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedPhotos.map(p => (
              <div key={p.id} className="p-3 rounded-2xl bg-white border-2 border-amber-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>{p.timestamp}</span>
                    <span className="text-amber-600">{p.frameStyle}</span>
                  </div>
                  <h5 className="font-black text-slate-800 text-xs">{p.caption}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 italic">{p.eventName}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                  <span>8 Sahabat Hadir</span>
                  <span>Tersimpan di Black Box</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
