import React, { useState } from 'react';
import { Palette, Heart, Star, Sparkles, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { LivingSlideCarousel } from '../common/LivingSlideCarousel';

interface ArtWork {
  id: string;
  title: string;
  childName: string;
  classGroup: string;
  category: 'LUKISAN' | 'ORIGAMI' | 'KOLASE' | 'FINGER_PAINTING';
  image: string;
  applauseCount: number;
  starCount: number;
  quote: string;
}

export const ArtCornerGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('SEMUA');
  const [reactions, setReactions] = useState<Record<string, { applause: number; star: number }>>({});

  const artworks: ArtWork[] = [
    {
      id: 'art1',
      title: 'Taman Bunga Pelangi Ceria',
      childName: 'Ananda Kirana',
      classGroup: 'Kelompok B1',
      category: 'LUKISAN',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
      applauseCount: 42,
      starCount: 28,
      quote: '“Kirana melukis bunga yang disiram air hujan warna-warni bersama kupu-kupu.”',
    },
    {
      id: 'art2',
      title: 'Masjid Asy Syifa Berubah Warna',
      childName: 'Ananda Zaidan',
      classGroup: 'Kelompok B2',
      category: 'FINGER_PAINTING',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
      applauseCount: 38,
      starCount: 31,
      quote: '“Karya finger painting menggunakan cat berbahan dasar makanan aman bagi anak.”',
    },
    {
      id: 'art3',
      title: 'Origami Burung & Bintang Malam',
      childName: 'Ananda Fatimah',
      classGroup: 'Kelompok A1',
      category: 'ORIGAMI',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      applauseCount: 29,
      starCount: 19,
      quote: '“Lipatan kertas origami rapi karya anak usia 4 tahun melatih motorik halus.”',
    },
    {
      id: 'art4',
      title: 'Kolase Kebun Buah Biji-Bijian',
      childName: 'Ananda Umar',
      classGroup: 'Kelompok A2',
      category: 'KOLASE',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      applauseCount: 35,
      starCount: 24,
      quote: '“Memenempel biji jagung dan kacang hijau membentuk pohon dan buah apel.”',
    },
  ];

  const handleApplause = (id: string) => {
    setReactions((prev) => ({
      ...prev,
      [id]: {
        applause: (prev[id]?.applause || 0) + 1,
        star: prev[id]?.star || 0,
      },
    }));
  };

  const handleStar = (id: string) => {
    setReactions((prev) => ({
      ...prev,
      [id]: {
        applause: prev[id]?.applause || 0,
        star: (prev[id]?.star || 0) + 1,
      },
    }));
  };

  const filtered = activeCategory === 'SEMUA'
    ? artworks
    : artworks.filter((art) => art.category === activeCategory);

  return (
    <section className="bg-gradient-to-br from-amber-50/60 via-stone-50 to-emerald-50/60 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs border border-amber-300">
          <Palette className="w-3.5 h-3.5 text-amber-700" />
          Galeri Seniman Cilik
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Karya Ananda Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Setiap coretan, lipatan, dan paduan warna adalah luapan kegembiraan imajinasi dan jiwa kreatif anak.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { id: 'SEMUA', label: 'Semua Karya' },
          { id: 'LUKISAN', label: 'Lukisan Cat Air' },
          { id: 'FINGER_PAINTING', label: 'Finger Painting' },
          { id: 'ORIGAMI', label: 'Origami & Kertas' },
          { id: 'KOLASE', label: 'Kolase Alam' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeCategory === c.id
                ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Interactive Living Slide Carousel */}
      <LivingSlideCarousel
        items={filtered}
        keyExtractor={(art) => art.id}
        autoPlay={true}
        autoPlayInterval={4000}
        itemsPerPageDesktop={4}
        itemsPerPageTablet={2}
        itemsPerPageMobile={1}
        badge="Apresiasi Seni"
        title="Pameran Hasil Karya Cilik"
        subtitle="Berikan tepuk tangan atau bintang apresiasi untuk membakar semangat ananda"
        renderItem={(art) => {
          const extraApp = reactions[art.id]?.applause || 0;
          const extraStar = reactions[art.id]?.star || 0;

          return (
            <div className="bg-white rounded-2xl p-4 border-2 border-stone-200/80 shadow-md hover:shadow-xl transition duration-300 space-y-3 flex flex-col justify-between relative group h-full">
              {/* Tape Graphic */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/90 border border-amber-300/80 -rotate-2 z-20 shadow-2xs rounded-xs pointer-events-none" />

              <div className="space-y-3">
                <div className="h-48 rounded-xl overflow-hidden border border-stone-200 bg-stone-900 relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-800/90 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {art.classGroup}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{art.title}</h3>
                  <p className="text-xs font-bold text-amber-700">Karya: {art.childName}</p>
                </div>

                <p className="text-[11px] text-stone-600 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/60">
                  {art.quote}
                </p>
              </div>

              {/* Interaction Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleApplause(art.id)}
                  className="flex-1 py-1.5 px-2 bg-stone-50 hover:bg-emerald-50 rounded-xl border border-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{art.applauseCount + extraApp}</span>
                </button>

                <button
                  onClick={() => handleStar(art.id)}
                  className="flex-1 py-1.5 px-2 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{art.starCount + extraStar}</span>
                </button>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
};

