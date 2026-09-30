import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Clock, 
  Calendar, 
  CloudSun, 
  Sparkles, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Play, 
  Pause, 
  Radio, 
  Award,
  BookOpen
} from 'lucide-react';

interface SlideItem {
  id: string;
  type: 'EVENT_COUNTDOWN' | 'TAHFIDZ_STAR' | 'SENTRA_ACTIVITY' | 'HEADLINE';
  title: string;
  subtitle: string;
  highlight: string;
  tag: string;
  bgGradient: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 's1',
    type: 'EVENT_COUNTDOWN',
    title: 'Visitasi Akreditasi BAN-PAUD 2026',
    subtitle: 'Menuju Akreditasi A Unggul TK Islam Asy Syifa',
    highlight: 'H-4 Menuju Visitasi',
    tag: 'AKREDITASI SEKOLAH',
    bgGradient: 'from-indigo-950 via-slate-900 to-indigo-900'
  },
  {
    id: 's2',
    type: 'TAHFIDZ_STAR',
    title: 'Santri Mumtaz Tahfidz Pekan Ini',
    subtitle: 'Ananda Muhammad Fatih (Kelompok B2) Menyelesaikan Surah Al-Balad',
    highlight: 'Hafalan 15 Surah Pendek',
    tag: 'PRESTASI TAHFIDZ',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-900'
  },
  {
    id: 's3',
    type: 'SENTRA_ACTIVITY',
    title: 'Sentra Bahan Alam & Sains Cilik',
    subtitle: 'Eksperimen Pelangi Dalam Tabung & Menanam Biji Kacang Hijau',
    highlight: 'Kreativitas & Karakter Islami',
    tag: 'KEGIATAN SENTRA',
    bgGradient: 'from-amber-950 via-slate-900 to-orange-900'
  }
];

export const SchoolTVLivingChannel: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const slideTimer = setInterval(() => {
      setCurrentSlideIdx(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [isPlaying]);

  const slide = SLIDES[currentSlideIdx];

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-0 m-0 overflow-hidden' : ''}`}>
      {/* Control Bar (Only when not in pure kiosk mode) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between bg-slate-900 text-white px-5 py-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider text-rose-400">
              Live School TV Broadcast • R107
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Jeda Siaran' : 'Lanjutkan'}</span>
            </button>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isAudioMuted ? 'Suara Senyap' : 'Audio Aktif'}</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Mode Layar Penuh Kiosk</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Broadcast Canvas (16:9 Aspect Ratio) */}
      <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-gradient-to-br ${slide.bgGradient} text-white flex flex-col justify-between ${isFullscreen ? 'h-screen rounded-none border-none' : 'min-h-[520px]'}`}>
        {/* Top Header Bar */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-xl">
              🌟
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tight text-white">TK ISLAM ASY SYIFA</h2>
              <p className="text-xs text-emerald-300 font-semibold tracking-wider uppercase">
                Siaran Informasi & Edukasi Santri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Weather Widget */}
            <div className="flex items-center gap-2.5 bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
              <CloudSun className="w-6 h-6 text-amber-400" />
              <div className="text-right">
                <div className="text-sm font-black">29°C</div>
                <div className="text-[10px] text-slate-300 font-medium">Bekasi • Cerah Berawan</div>
              </div>
            </div>

            {/* Live Clock Widget */}
            <div className="text-right bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
              <div className="text-lg font-black font-mono tracking-wider text-amber-300">{timeStr}</div>
              <div className="text-[10px] text-slate-300">{dateStr}</div>
            </div>
          </div>
        </div>

        {/* Center Stage: Slide Content & Virtual Host Dek Asy */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
          {/* Virtual Mascot Host Dek Asy (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border-4 border-emerald-400/50 flex items-center justify-center shadow-2xl relative animate-bounce-slow">
              <span className="text-7xl">👦✨</span>
              <div className="absolute -bottom-2 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
                Dek Asy Host
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/10 max-w-xs">
              <p className="text-xs text-slate-200 font-medium italic">
                "Selamat pagi adik-adik santri dan ayah bunda! Selalu ceria & berakhlak mulia!"
              </p>
            </div>
          </div>

          {/* Main Headline & Slide Information (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wide">
              {slide.tag}
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {slide.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-4 flex items-center gap-4">
              <div className="px-6 py-3 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md text-amber-300 font-black text-lg shadow-lg">
                {slide.highlight}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Running News Marquee & Guardian Status */}
        <div className="bg-slate-950/90 border-t border-white/10 p-3 flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>PENGUMUMAN</span>
          </div>

          <div className="whitespace-nowrap animate-marquee text-xs font-semibold text-slate-200 flex items-center gap-8">
            <span>📢 Pendaftaran Santri Baru (PPDB) Tahun Ajaran 2026/2027 Gelombang 1 Masih Dibuka. Dapatkan Potongan Infaq Khusus.</span>
            <span>🕌 Murojaah Surah Pendek Bersama Dek Asy Setiap Pagi Pukul 07.30 WIB di Ruang Kelas Sentra.</span>
            <span>🛡️ Sistem Keamanan TADE Guardian 2.0 Aktif Melindungi Data Sekolah 24 Jam.</span>
          </div>

          <div className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guardian 100% OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
