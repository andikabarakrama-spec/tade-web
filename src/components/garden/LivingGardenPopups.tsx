import React, { useState, useEffect } from 'react';
import { Sparkles, X, Heart, Calendar, BookOpen, Volume2, Bell, ShieldCheck, ChevronRight } from 'lucide-react';

interface PopupNotice {
  id: string;
  type: 'welcome' | 'ppdb' | 'doa' | 'activity' | 'event';
  title: string;
  badge: string;
  body: string;
  actionText?: string;
  actionTab?: string;
  icon: string;
}

interface Props {
  onTabChange: (tab: string) => void;
}

export const LivingGardenPopups: React.FC<Props> = ({ onTabChange }) => {
  const [currentPopupIndex, setCurrentPopupIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  const notices: PopupNotice[] = [
    {
      id: 'welcome',
      type: 'welcome',
      title: 'Selamat Datang di TK Asy Syifa Tanggul!',
      badge: 'Assalamu\'alaikum Wr. Wb.',
      body: 'Rasakan lingkungan belajar Islami yang hangat, aman, dan berakhlak mulia untuk kebaikan putra-putri ananda.',
      actionText: 'Jelajahi Profil',
      actionTab: 'w2',
      icon: '🌸',
    },
    {
      id: 'ppdb',
      type: 'ppdb',
      title: 'PPDB Gelombang 1 TA 2026/2027 Dibuka!',
      badge: 'Kuota Terbatas 60 Siswa',
      body: 'Dapatkan diskon pendaftaran awal & gratis seragam batik khas sekolah jika mendaftar bulan ini.',
      actionText: 'Daftar Sekarang',
      actionTab: 'w4',
      icon: '✨',
    },
    {
      id: 'doa',
      type: 'doa',
      title: 'Doa Menerima Ilmu & Hikmah',
      badge: 'Mutaba\'ah Harian Santri',
      body: '"Rabbi zidni \'ilman warzuqni fahman" - Ya Allah, tambahkanlah kepadaku ilmu dan berilah aku karunia untuk memahaminya.',
      actionText: 'Hafalan Surah',
      actionTab: 'w3',
      icon: '📖',
    },
    {
      id: 'activity',
      type: 'activity',
      title: 'Jadwal Hari Ini: Sentra Bahan Alam & Tahfidz',
      badge: 'Kegiatan Santri Ceria',
      body: 'Ananda hari ini belajar mengenal tanaman hidroponik, setor hafalan Surah An-Nas, dan sholat dhuha berjamaah.',
      actionText: 'Lihat Timeline',
      actionTab: 'w1',
      icon: '🌿',
    },
  ];

  useEffect(() => {
    // Show first popup after 3 seconds, then auto-hide after 5 seconds
    const showTimer = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    const autoHideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoHideTimer);
    };
  }, [dismissed]);

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentPopupIndex((prev) => (prev + 1) % notices.length);
      setIsVisible(true);
    }, 400);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  if (dismissed || !isVisible) return null;

  const popup = notices[currentPopupIndex];

  return (
    <div className="fixed bottom-20 left-5 z-40 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-emerald-300 shadow-2xl space-y-3 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-600" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">{popup.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {popup.badge}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            title="Tutup Pengumuman"
            className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-900 leading-snug">{popup.title}</h4>
          <p className="text-[11px] text-stone-600 leading-relaxed">{popup.body}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-bold">
          {popup.actionTab && (
            <button
              onClick={() => {
                onTabChange(popup.actionTab!);
                handleDismiss();
              }}
              className="text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group text-[11px]"
            >
              <span>{popup.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </button>
          )}

          <button
            onClick={handleNext}
            className="text-[10px] font-extrabold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl border border-amber-300 transition"
          >
            Info Berikutnya ({currentPopupIndex + 1}/{notices.length})
          </button>
        </div>
      </div>
    </div>
  );
};
