import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { DoodleBlocks, DoodleKite } from '../garden/ChildDoodleDecorations';
import { LivingSlideCarousel } from '../common/LivingSlideCarousel';

interface ActivityItem {
  id: string;
  title: string;
  category: 'Seni & Musik' | 'Karakter & Bermain' | 'Eksplorasi Alam' | 'Motorik & Olahraga';
  icon: string;
  description: string;
  badge: string;
  bgColor: string;
  borderColor: string;
}

export const ChildActivitiesShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const activities: ActivityItem[] = [
    {
      id: '1',
      title: 'Bermain Engklek & Lompat Tali',
      category: 'Motorik & Olahraga',
      icon: '🦘',
      description: 'Melatih keseimbangan, ketangkasan, dan keberanian fisik anak melalui permainan tradisional engklek dan lompat tali.',
      badge: 'Motorik Kasar',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300'
    },
    {
      id: '2',
      title: 'Terbang Layang-Layang & Pesawat Kertas',
      category: 'Eksplorasi Alam',
      icon: '🪁',
      description: 'Mengenal arah angin dan aerodinamika sederhana sambil mengejar keceriaan di halaman luas sekolah.',
      badge: 'Sains Anak',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-300'
    },
    {
      id: '3',
      title: 'Menyusun Balok Kayu & Puzzle ABC',
      category: 'Karakter & Bermain',
      icon: '🧱',
      description: 'Membangun menara imajinasi dan struktur arsitektur cilik untuk melatih spasial dan logika memecahkan masalah.',
      badge: 'Logika Cilik',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300'
    },
    {
      id: '4',
      title: 'Mewarnai, Melukis & Finger Painting',
      category: 'Seni & Musik',
      icon: '🎨',
      description: 'Mengekspresikan warna hati dengan kuas, cat air ramah anak, dan cetakan telapak tangan penuh keceriaan.',
      badge: 'Kreativitas Seni',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300'
    },
    {
      id: '5',
      title: 'Seni Origami & Lipat Kertas',
      category: 'Seni & Musik',
      icon: '📄',
      description: 'Melatih motorik halus jemari tangan dengan melipat kertas menjadi bentuk burung, kapal, dan bunga.',
      badge: 'Motorik Halus',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    },
    {
      id: '6',
      title: 'Berkebun & Menyiram Bunga',
      category: 'Eksplorasi Alam',
      icon: '🌱',
      description: 'Menanam benih sayur, menyiram tanaman, dan memanen hasil kebun sekolah bersama teman-teman.',
      badge: 'Cinta Lingkungan',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-300'
    },
    {
      id: '7',
      title: 'Memberi Makan Ikan Kolam',
      category: 'Eksplorasi Alam',
      icon: '🐟',
      description: 'Mengamati ekosistem air dan memelihara kepekaan rasa kasih sayang terhadap sesama makhluk ciptaan Allah.',
      badge: 'Kasih Sayang',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300'
    },
    {
      id: '8',
      title: 'Sentra Masak Cilik (Cooking Class)',
      category: 'Karakter & Bermain',
      icon: '👨‍🍳',
      description: 'Membuat sandwich sehat, menghias kue mangkok, dan belajar kemandirian menyiapkan makanan toyib.',
      badge: 'Kemandirian',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    },
    {
      id: '9',
      title: 'Ansambel Angklung & Drum Cilik',
      category: 'Seni & Musik',
      icon: '🪘',
      description: 'Mengenal nada, ketukan musik Islami, memainkan angklung bambu tradisional, dan bernyanyi bersama.',
      badge: 'Seni Musik',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: '10',
      title: 'Piknik Cilik & Camping Ceria',
      category: 'Karakter & Bermain',
      icon: '⛺',
      description: 'Pengalaman mendirikan tenda cilik di halaman sekolah, mendengarkan dongeng Islami, dan sarapan bersama.',
      badge: 'Petualangan',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300'
    },
    {
      id: '11',
      title: 'Bermain Istana Pasir Sintetis',
      category: 'Motorik & Olahraga',
      icon: '🏖️',
      description: 'Sensori taktil membentuk istana pasir dengan cetakan aneka binatang laut yang aman dan bersih.',
      badge: 'Eksplorasi Takstil',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300'
    },
    {
      id: '12',
      title: 'Pawai Drumband & Marching Cilik',
      category: 'Motorik & Olahraga',
      icon: '🥁',
      description: 'Latihan kekompakan baris-berbaris dan ketukan senam sehat ceria yang membangun jiwa kebersamaan.',
      badge: 'Kekompakan Tim',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300'
    }
  ];

  const categories = ['Semua', 'Seni & Musik', 'Karakter & Bermain', 'Eksplorasi Alam', 'Motorik & Olahraga'];

  const filtered = activeCategory === 'Semua'
    ? activities
    : activities.filter(a => a.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-amber-50/80 via-white to-emerald-50/80 rounded-3xl p-6 sm:p-10 border-2 border-amber-300 shadow-lg relative my-8 overflow-hidden">
      {/* Decorative Doodles Overlay */}
      <div className="absolute top-4 left-6 opacity-30 pointer-events-none">
        <DoodleBlocks className="w-12 h-12" />
      </div>
      <div className="absolute top-6 right-8 opacity-30 pointer-events-none">
        <DoodleKite className="w-12 h-16" />
      </div>

      <div className="text-center space-y-3 max-w-2xl mx-auto mb-6 relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Sparkles className="w-4 h-4 text-slate-950" />
          Galeri Aktivitas Keceriaan Anak
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Dunia Bermain & Belajar Seru TK Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Setiap hari adalah petualangan bermakna! Kami merancang aktivitas interaktif yang merangsang imajinasi, keimanan, dan keterampilan motorik ananda.
        </p>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-800 text-amber-300 font-black shadow-md scale-105 border-2 border-amber-300'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
              }`}
            >
              <span>{cat === 'Semua' ? '🌟' : '🎈'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Living Slide Carousel */}
      <LivingSlideCarousel
        items={filtered}
        keyExtractor={(act) => act.id}
        autoPlay={true}
        autoPlayInterval={4500}
        itemsPerPageDesktop={3}
        itemsPerPageTablet={2}
        itemsPerPageMobile={1}
        badge="Petualangan Harian"
        title="Eksplorasi Sentra Aktivitas Cilik"
        subtitle="Geser atau sentuh kartu untuk menjelajahi kegiatan harian ananda"
        renderItem={(act) => (
          <div
            className={`${act.bgColor} rounded-3xl p-6 border-2 ${act.borderColor} shadow-xs hover:shadow-xl transition duration-300 transform hover:-translate-y-1 relative group flex flex-col justify-between h-full`}
          >
            {/* Scrapbook Tape Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/90 border border-amber-300 rotate-1 z-10 rounded-xs pointer-events-none shadow-2xs" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-110 transition">
                  {act.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 text-slate-900 px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
                  {act.badge}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition leading-snug">
                {act.title}
              </h3>

              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {act.description}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-emerald-800">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Dipelajari dengan Kasih Sayang
              </span>
              <span className="text-xs">✨</span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

