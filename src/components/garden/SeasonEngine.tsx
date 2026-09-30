import React, { useState } from 'react';
import { Calendar, Sparkles, Heart, Flag, Moon, Award, Gift, Compass } from 'lucide-react';

export interface SeasonalEvent {
  id: string;
  title: string;
  dateString: string;
  greeting: string;
  themeColor: string;
  bgGradient: string;
  icon: string;
  badge: string;
  decorations: string[];
}

export const SeasonEngine: React.FC = () => {
  const seasonalEvents: SeasonalEvent[] = [
    {
      id: 'ramadhan',
      title: 'Marhaban Ya Ramadhan Mubarak',
      dateString: 'Bulan Suci Ramadhan',
      greeting: 'Selamat Menunaikan Ibadah Puasa untuk Ayah, Bunda, dan Ananda Santri Cilik Asy Syifa.',
      themeColor: 'from-purple-900 via-indigo-900 to-slate-900',
      bgGradient: 'from-amber-400 to-amber-500',
      icon: '🌙',
      badge: 'Bulan Penuh Berkah',
      decorations: ['Lanterns', 'MoonStars', 'Crickets', 'Fireflies']
    },
    {
      id: 'idul_fitri',
      title: 'Selamat Hari Raya Idul Fitri 1448 H',
      dateString: '1 Syawal',
      greeting: 'Taqabbalallahu minna wa minkum. Mohon maaf lahir dan batin dari Keluarga Besar TK Asy Syifa.',
      themeColor: 'from-emerald-900 via-teal-900 to-slate-900',
      bgGradient: 'from-emerald-400 to-teal-400',
      icon: '🕌',
      badge: 'Hari Kemenangan',
      decorations: ['Ketupat', 'Confetti', 'Sparkles', 'Balloons']
    },
    {
      id: '17_agustus',
      title: 'Dirgahayu Republik Indonesia',
      dateString: '17 Agustus',
      greeting: 'Merdeka! Menumbuhkan jiwa patriotisme dan kecintaan pada Tanah Air sejak usia dini.',
      themeColor: 'from-red-900 via-rose-900 to-slate-900',
      bgGradient: 'from-red-500 to-white',
      icon: '🇮🇩',
      badge: 'HUT RI Ceria',
      decorations: ['RedWhiteFlags', 'Balloons', 'MarchingDrums']
    },
    {
      id: 'hari_guru',
      title: 'Selamat Hari Guru Nasional',
      dateString: '25 November',
      greeting: 'Terima kasih Ustadzah atas kesabaran, bimbingan, dan kasih sayang tulus menyinari Ananda.',
      themeColor: 'from-teal-900 via-emerald-900 to-slate-900',
      bgGradient: 'from-amber-300 to-emerald-300',
      icon: '👩‍🏫',
      badge: 'Apresiasi Ustadzah',
      decorations: ['Flowers', 'Pencils', 'Hearts', 'Stars']
    },
    {
      id: 'hari_anak',
      title: 'Selamat Hari Anak Nasional',
      dateString: '23 Juli',
      greeting: 'Anak Terlindungi, Indonesia Maju! Mari bersama menciptakan lingkungan tumbuh kembang terbaik.',
      themeColor: 'from-sky-900 via-blue-900 to-slate-900',
      bgGradient: 'from-sky-400 to-amber-300',
      icon: '🎈',
      badge: 'Dunia Anak Ceria',
      decorations: ['Balloons', 'Rainbow', 'Butterflies', 'Kites']
    },
    {
      id: 'awal_tahun',
      title: 'Selamat Datang Tahun Ajaran Baru!',
      dateString: 'Juli - Agustus',
      greeting: 'Awal petualangan ceria di Kampus Hijau TK Asy Syifa Tanggul! Selamat bergabung Ananda tercinta.',
      themeColor: 'from-amber-900 via-orange-900 to-slate-900',
      bgGradient: 'from-amber-400 to-orange-400',
      icon: '🎒',
      badge: 'Tahun Ajaran Baru',
      decorations: ['SchoolBus', 'Confetti', 'Balloons', 'PaperAirplanes']
    }
  ];

  const [activeEventId, setActiveEventId] = useState<string>('awal_tahun');
  const activeEvent = seasonalEvents.find(e => e.id === activeEventId) || seasonalEvents[0];

  return (
    <div className={`bg-gradient-to-r ${activeEvent.themeColor} text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-2xl relative overflow-hidden my-6 transition duration-500`}>
      {/* Event Header Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md animate-pulse">
            {activeEvent.icon}
          </span>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              Season & Event Engine: {activeEvent.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {activeEvent.title}
            </h3>
          </div>
        </div>

        {/* Event Chips */}
        <div className="flex flex-wrap gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10">
          {seasonalEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => setActiveEventId(evt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                activeEventId === evt.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <span>{evt.icon}</span>
              <span>{evt.dateString}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xs p-6 rounded-3xl border border-white/20 space-y-3">
        <p className="text-xs sm:text-base font-bold text-amber-200 leading-relaxed italic">
          “{activeEvent.greeting}”
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-stone-300 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Dekorasi Aktif: {activeEvent.decorations.join(', ')}
          </span>
          <span className="text-[11px] bg-amber-400/20 text-amber-300 px-3 py-0.5 rounded-full border border-amber-400/30">
            Tema Berubah Otomatis Sesuai Kalender Sekolah
          </span>
        </div>
      </div>
    </div>
  );
};
