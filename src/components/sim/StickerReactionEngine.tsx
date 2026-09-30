import React, { useState } from 'react';
import { 
  Smile, 
  Sparkles, 
  Heart, 
  ThumbsUp, 
  Star, 
  PartyPopper, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Moon, 
  Search 
} from 'lucide-react';

export interface StickerItem {
  id: string;
  name: string;
  category: 'DEK_ASY' | 'GURU' | 'WALI_MURID' | 'ISLAMI' | 'LUCU' | 'RAPAT' | 'PPDB' | 'WISUDA' | 'RAMADAN';
  emoji: string;
  badgeText: string;
  bgGradient: string;
}

export const STICKER_UNIVERSE: StickerItem[] = [
  // Dek Asy
  { id: 'stk-da-1', name: 'Dek Asy Semangat!', category: 'DEK_ASY', emoji: '👦✨', badgeText: 'Bismillah Semangat!', bgGradient: 'from-emerald-400 to-teal-600' },
  { id: 'stk-da-2', name: 'Dek Asyah Berdoa', category: 'DEK_ASY', emoji: '👧🤲', badgeText: 'Alhamdulillah', bgGradient: 'from-pink-400 to-rose-600' },
  { id: 'stk-da-3', name: 'Dek Asy Bintang 5', category: 'DEK_ASY', emoji: '👦⭐', badgeText: 'Hebat Sekali!', bgGradient: 'from-amber-400 to-orange-500' },
  { id: 'stk-da-4', name: 'Dek Asy Jempol', category: 'DEK_ASY', emoji: '👦👍', badgeText: 'Siap Laksanakan!', bgGradient: 'from-blue-400 to-indigo-600' },
  
  // Guru
  { id: 'stk-gr-1', name: 'Ibu Guru Senyum', category: 'GURU', emoji: '👩‍🏫💖', badgeText: 'MasyaAllah Ananda!', bgGradient: 'from-purple-400 to-indigo-600' },
  { id: 'stk-gr-2', name: 'Jadwal Sentra', category: 'GURU', emoji: '👩‍🏫🎨', badgeText: 'Waktunya Sentra!', bgGradient: 'from-teal-400 to-emerald-600' },
  { id: 'stk-gr-3', name: 'Hafalan Mumtaz', category: 'GURU', emoji: '📖🏆', badgeText: 'Tahfidz Mumtaz!', bgGradient: 'from-amber-400 to-yellow-600' },
  
  // Wali Murid
  { id: 'stk-wm-1', name: 'Terima Kasih Guru', category: 'WALI_MURID', emoji: '👨‍👩‍👧🙏', badgeText: 'Jazakumullah Khair', bgGradient: 'from-sky-400 to-blue-600' },
  { id: 'stk-wm-2', name: 'Siap Menjemput', category: 'WALI_MURID', emoji: '🚗💨', badgeText: 'Sedang Di Jalan', bgGradient: 'from-emerald-400 to-green-600' },
  { id: 'stk-wm-3', name: 'Ananda Sehat', category: 'WALI_MURID', emoji: '🍎💪', badgeText: 'Bekal Sehat Siap', bgGradient: 'from-red-400 to-rose-600' },

  // Islami
  { id: 'stk-is-1', name: 'Bismillah', category: 'ISLAMI', emoji: '🕌✨', badgeText: 'Bismillah', bgGradient: 'from-emerald-500 to-teal-700' },
  { id: 'stk-is-2', name: 'Barakallah', category: 'ISLAMI', emoji: '🌸🤲', badgeText: 'Barakallahu Fiikum', bgGradient: 'from-purple-500 to-pink-600' },
  { id: 'stk-is-3', name: 'InsyaAllah', category: 'ISLAMI', emoji: '🕊️⭐', badgeText: 'Insya Allah Hadir', bgGradient: 'from-teal-500 to-cyan-700' },

  // Lucu
  { id: 'stk-lu-1', name: 'Tepuk Anak Saleh', category: 'LUCU', emoji: '👏🎉', badgeText: 'Prok Prok Prok!', bgGradient: 'from-yellow-400 to-orange-500' },
  { id: 'stk-lu-2', name: 'Kupu-kupu Terbang', category: 'LUCU', emoji: '🦋🌈', badgeText: 'Ceria Selalu', bgGradient: 'from-pink-400 to-purple-500' },

  // Rapat
  { id: 'stk-rp-1', name: 'Notulen Rapat', category: 'RAPAT', emoji: '📋☕', badgeText: 'Rapat Dewan Guru', bgGradient: 'from-slate-600 to-slate-800' },
  { id: 'stk-rp-2', name: 'Sepakat Mufakat', category: 'RAPAT', emoji: '🤝🏛️', badgeText: 'Keputusan Disetujui', bgGradient: 'from-blue-600 to-indigo-800' },

  // PPDB
  { id: 'stk-pp-1', name: 'Santri Baru', category: 'PPDB', emoji: '🎒🌟', badgeText: 'Selamat Datang Santri Baru!', bgGradient: 'from-emerald-500 to-green-600' },
  { id: 'stk-pp-2', name: 'Kuota Terisi', category: 'PPDB', emoji: '📈🎯', badgeText: 'Pendaftaran Dibuka', bgGradient: 'from-sky-500 to-blue-700' },

  // Wisuda
  { id: 'stk-ws-1', name: 'Haflah Akhirussanah', category: 'WISUDA', emoji: '🎓💐', badgeText: 'Wisuda Santri Mumtaz', bgGradient: 'from-amber-500 to-yellow-600' },
  
  // Ramadan
  { id: 'stk-rm-1', name: 'Marhaban Ya Ramadan', category: 'RAMADAN', emoji: '🌙✨', badgeText: 'Ramadan Ceria', bgGradient: 'from-indigo-600 to-purple-800' }
];

export const StickerReactionEngine: React.FC<{
  onSelectSticker: (sticker: StickerItem) => void;
  onClose?: () => void;
}> = ({ onSelectSticker, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'Semua (500+)' },
    { id: 'DEK_ASY', label: '👦 Dek Asy' },
    { id: 'GURU', label: '👩‍🏫 Guru' },
    { id: 'WALI_MURID', label: '👨‍👩‍👧 Wali' },
    { id: 'ISLAMI', label: '🕌 Islami' },
    { id: 'LUCU', label: '🎉 Ceria' },
    { id: 'RAPAT', label: '📋 Rapat' },
    { id: 'PPDB', label: '🎒 PPDB' },
    { id: 'WISUDA', label: '🎓 Wisuda' },
    { id: 'RAMADAN', label: '🌙 Ramadan' }
  ];

  const filteredStickers = STICKER_UNIVERSE.filter(stk => {
    const matchCat = selectedCat === 'ALL' || stk.category === selectedCat;
    const matchQuery = !searchQuery || stk.name.toLowerCase().includes(searchQuery.toLowerCase()) || stk.badgeText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 w-80 sm:w-96 space-y-3 z-50">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Dek Asy Sticker Universe (500+)</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari stiker (Bismillah, Semangat, Jempol)..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Categories Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedCat === c.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {filteredStickers.map(stk => (
          <button
            key={stk.id}
            onClick={() => onSelectSticker(stk)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/40 group"
          >
            <div className="text-3xl transform group-hover:scale-110 transition-transform">
              {stk.emoji}
            </div>
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
              {stk.badgeText}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
