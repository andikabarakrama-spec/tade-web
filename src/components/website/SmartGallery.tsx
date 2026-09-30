import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize2, Sparkles, Filter, X, Layers, Grid, ChevronLeft, ChevronRight, Heart, Calendar, Eye } from 'lucide-react';
import { ExpandMedia } from '../interactions/ExpandMedia';
import { DepthCard } from '../interactions/DepthCard';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Lomba' | 'Outdoor' | 'Pentas Seni' | 'Ekstrakurikuler';
  image: string;
  date: string;
  caption: string;
  storySteps: { title: string; description: string }[];
}

export const SmartGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'coverflow' | 'grid'>('coverflow');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const galleryData: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Praktek Sholat Dhuha Berjamaah Cilik',
      category: 'Kegiatan',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      date: 'Agustus 2026',
      caption: 'Pembiasaan ibadah sholat dhuha dan wudhu mandiri rutin setiap pagi di Musholla Asy Syifa Tanggul.',
      storySteps: [
        { title: 'Wudhu Mandiri', description: 'Para siswa cilik mempraktikkan tata cara wudhu yang tertib dan tertuntun ustadzah.' },
        { title: 'Sholat Dhuha Berjamaah', description: 'Pelaksanaan 2 rakaat sholat Dhuha bersama melatih kekhusyukan sejak dini.' },
        { title: 'Murajaah Doa Harian', description: 'Mengulang hafalan juz 30 dan membaca doa kebaikan orang tua.' }
      ]
    },
    {
      id: 'g2',
      title: 'Lomba Mewarnai Kaligrafi Anak Soleh',
      category: 'Lomba',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
      date: 'Juli 2026',
      caption: 'Kreativitas siswa cilik dalam mengasah motorik halus dan apresiasi seni kaligrafi Islami.',
      storySteps: [
        { title: 'Goresan Warna Ceria', description: 'Masing-masing siswa memilih kombinasi warna gradasi dengan antusias.' },
        { title: 'Pembentukan Fokus & Sabar', description: 'Melatih konsentrasi dan kehati-hatian menggoreskan krayon.' },
        { title: 'Apresiasi & Hadiah', description: 'Setiap karya diberikan bintang apresiasi untuk memotivasi rasa percaya diri.' }
      ]
    },
    {
      id: 'g3',
      title: 'Senam Ceria & Bermain Air di Taman',
      category: 'Outdoor',
      image: 'https://images.unsplash.com/photo-1566454825481-4e48f80aa4d7?auto=format&fit=crop&q=80&w=800',
      date: 'Agustus 2026',
      caption: 'Aktivitas fisik gembira melatih ketahanan tubuh dan interaksi sosial positif antar siswa.',
      storySteps: [
        { title: 'Pemanasan Musikal', description: 'Mengikuti gerakan senam irama anak Islami bersama seluruh kelompok.' },
        { title: 'Permainan Ketangkasan Air', description: 'Eksplorasi sensorik air dan estafet bola warna di halaman sekolah.' },
        { title: 'Minum & Istirahat', description: 'Pembiasaan minum sambil duduk dan mengucapkan hamdalah.' }
      ]
    },
    {
      id: 'g4',
      title: 'Pentas Seni Hadrah & Wisuda Tahfidz',
      category: 'Pentas Seni',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
      date: 'Juni 2026',
      caption: 'Penampilan alat musik rebana/hadrah cilik dan wisuda hafalan Juz 30 siswa TK B.',
      storySteps: [
        { title: 'Latihan Harmoni Musik', description: 'Memukul rebana cilik sesuai ketukan ritme shalawat.' },
        { title: 'Unjuk Kebolehan di Panggung', description: 'Tampil dengan busana kurung islami penuh percaya diri di depan orang tua.' },
        { title: 'Penyematan Mahkota Tahfidz', description: 'Penyerahan sertifikat kelulusan hafalan juz 30.' }
      ]
    },
    {
      id: 'g5',
      title: 'Ekskul Drumband & Baris Berbaris Ceria',
      category: 'Ekstrakurikuler',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      date: 'Mei 2026',
      caption: 'Melatih kedisiplinan, ritme nada, dan kekompakan tim sejak usia dini.',
      storySteps: [
        { title: 'Baris Formasi Ceria', description: 'Latihan melangkah serempak sesuai irama drum.' },
        { title: 'Kombinasi Alat Musik', description: 'Paduan snare drum, bass drum, dan pianika cilik.' },
        { title: 'Pawai Keliling Kampus', description: 'Parade keceriaan mengelilingi lingkungan TK Asy Syifa.' }
      ]
    },
    {
      id: 'g6',
      title: 'Sains Cilik: Menanam Sayur Hidroponik',
      category: 'Outdoor',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      date: 'Agustus 2026',
      caption: 'Eksperimen berkebun dan mengenal siklus hidup tanaman di kebun sekolah.',
      storySteps: [
        { title: 'Pengenalan Benih & Pasir', description: 'Menyentuh benih kangkung dan media tanam hidroponik.' },
        { title: 'Penyiraman Rutin', description: 'Setiap kelompok menyiram dan mencatat perkembangan daun.' },
        { title: 'Panen Bersama', description: 'Memetik hasil panen untuk dimasak catering sehat sekolah.' }
      ]
    },
  ];

  const categories = ['Semua', 'Kegiatan', 'Lomba', 'Outdoor', 'Pentas Seni', 'Ekstrakurikuler'];

  const filtered = galleryData.filter(
    (g) => activeCategory === 'Semua' || g.category === activeCategory
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  // Keyboard navigation for coverflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'coverflow' || filtered.length === 0) return;
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, filtered.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else {
        // Swipe right
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      }
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            Dokumentasi Sekolah • Interactive Perspective
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Galeri Momen Ceria TK Asy Syifa
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Rekaman kenangan berharga dan kegembiraan ananda dalam setiap langkah kegiatan pembelajaran di sekolah.
          </p>
        </div>

        {/* View Mode & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setViewMode('coverflow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'coverflow' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 3D CoverFlow
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Perspective 3D CoverFlow View */}
      {viewMode === 'coverflow' && filtered.length > 0 && (
        <div className="space-y-6">
          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[360px] sm:h-[420px] w-full flex items-center justify-center overflow-hidden py-4 perspective-1000 select-none"
          >
            {filtered.map((item, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;

              // Calculate depth, scale, and rotation
              const scale = isCenter ? 1 : Math.max(0.7, 1 - Math.abs(offset) * 0.18);
              const translateX = offset * 180;
              const rotateY = offset > 0 ? -25 : offset < 0 ? 25 : 0;
              const zIndex = 30 - Math.abs(offset) * 10;
              const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.35);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedPhoto(item);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                  }}
                  className={`absolute w-[280px] sm:w-[340px] h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out cursor-pointer border-4 ${
                    isCenter ? 'border-amber-400 ring-4 ring-emerald-500/20' : 'border-white'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end text-white space-y-2">
                    <span className="self-start px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full shadow-md">
                      {item.category}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-stone-300 font-semibold pt-1 border-t border-white/20">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-300" /> {item.date}
                      </span>
                      {isCenter && (
                        <span className="text-amber-300 font-black flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Klik Detail
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))}
              className="p-3 rounded-full bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 font-bold transition shadow-sm cursor-pointer"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-black text-stone-700 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-200">
              {activeIndex + 1} / {filtered.length} Foto
            </span>

            <button
              onClick={() => setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))}
              className="p-3 rounded-full bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 font-bold transition shadow-sm cursor-pointer"
              title="Foto Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid View with DepthCard & ExpandMedia */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <DepthCard key={item.id} depth={8}>
              <ExpandMedia
                src={item.image}
                alt={item.title}
                title={item.title}
                subtitle={item.date}
                description={item.caption}
                category={item.category}
                storySteps={item.storySteps}
              />
            </DepthCard>
          ))}
        </div>
      )}

      {/* Selected Coverflow Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[160] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 relative border-4 border-amber-400 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-rose-100 text-stone-800 hover:text-rose-800 rounded-full font-bold transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200 h-64 sm:h-80">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full">
                {selectedPhoto.category}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {selectedPhoto.date}
              </span>
              <h3 className="text-xl font-black text-slate-900">{selectedPhoto.title}</h3>
              <p className="text-xs text-stone-700 leading-relaxed font-medium bg-stone-50 p-3 rounded-2xl border border-stone-200">
                {selectedPhoto.caption}
              </p>
            </div>

            {/* Story Steps */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Tahapan Kegiatan & Pembiasaan:
              </h4>
              <div className="space-y-2">
                {selectedPhoto.storySteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="block font-bold text-slate-900">{step.title}</strong>
                      <span className="text-stone-700">{step.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
