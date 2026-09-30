import React, { useState } from 'react';
import { BookOpen, Sparkles, Smile, Music, Palette, Play, Eye } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  sentra: string;
  icon: string;
  image: string;
  description: string;
  teacherNote: string;
  kidsAction: string;
}

export const LivingClassroomExperience: React.FC = () => {
  const [activeActivity, setActiveActivity] = useState<number>(0);

  const activities: Activity[] = [
    {
      id: 'act1',
      name: 'Membaca & Bercerita Bergambar',
      sentra: 'Sentra Persiapan & Literasi',
      icon: '📖',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      description: 'Anak-anak duduk melingkar menyimak dongeng Islami yang dibawakan ustadzah dengan boneka tangan.',
      teacherNote: 'Melatih konsentrasi, kosa kata baru, dan empati cerita.',
      kidsAction: '👧 Ananda Fatimah mengangkat tangan menjawab tebakan dongeng!',
    },
    {
      id: 'act2',
      name: 'Konstruksi Balok & Arsitek Cilik',
      sentra: 'Sentra Balok',
      icon: '🧱',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
      description: 'Anak merancang miniatur jembatan dan masjid menggunakan kayu pinus halus tanpa sudut tajam.',
      teacherNote: 'Melatih logika spasial, koordinasi mata-tangan, dan pemecahan masalah.',
      kidsAction: '👦 Ananda Zaidan & Umar bekerjasama menyusun menara tinggi!',
    },
    {
      id: 'act3',
      name: 'Melukis & Finger Painting Ceria',
      sentra: 'Sentra Seni & Kreativitas',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
      description: 'Goresan warna-warni cat aman anak membentuk lukisan bunga, pelangi, dan pemandangan alam.',
      teacherNote: 'Stimulasi sensorik taktil dan kebebasan berekspresi seni.',
      kidsAction: '👧 Ananda Kirana tersenyum bangga memperlihatkan lukisannya!',
    },
    {
      id: 'act4',
      name: 'Bermain Musik & Angklung Cilik',
      sentra: 'Sentra Olah Tubuh & Musik',
      icon: '🎵',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800',
      description: 'Irama lagu anak-anak Islami dipadu ketukan angklung bambu dan perkusi kayu.',
      teacherNote: 'Melatih kepekaan nada, pendengaran, dan kekompakan kelompok.',
      kidsAction: '👦 Ananda Rayhan bersemangat memimpin irama musik!',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-xl space-y-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center space-y-2 max-w-3xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800 text-amber-300 font-extrabold text-xs border border-emerald-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          Simulasi Suasana Belajar Interaktif
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Living Classroom Experience
        </h2>
        <p className="text-xs sm:text-sm text-stone-200">
          Suasana kelas yang hidup, hangat, dan interaktif. Tempat di mana setiap anak aktif berimajinasi dan bertumbuh dengan gembira.
        </p>
      </div>

      {/* Activity Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center relative z-10">
        {activities.map((act, idx) => {
          const isActive = activeActivity === idx;
          return (
            <button
              key={act.id}
              onClick={() => setActiveActivity(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg scale-105'
                  : 'bg-emerald-950/80 text-stone-300 hover:bg-emerald-800 border border-emerald-700/60'
              }`}
            >
              <span>{act.icon}</span>
              <span>{act.sentra}</span>
            </button>
          );
        })}
      </div>

      {/* Living Activity Display Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-xl h-64">
            <img
              src={activities[activeActivity].image}
              alt={activities[activeActivity].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span>{activities[activeActivity].icon}</span>
              {activities[activeActivity].sentra}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xl font-black text-amber-300">{activities[activeActivity].name}</h3>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            {activities[activeActivity].description}
          </p>

          <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/40 text-xs space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Tujuan Pembelajaran Guru:
            </div>
            <p className="text-stone-300">{activities[activeActivity].teacherNote}</p>
          </div>

          <div className="p-3 bg-amber-400/20 rounded-xl border border-amber-400/30 text-xs font-bold text-amber-200 flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{activities[activeActivity].kidsAction}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
