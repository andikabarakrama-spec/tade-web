import React, { useState } from 'react';
import { 
  ImageIcon, Sparkles, Filter, CheckCircle2, Search, Heart, 
  Layers, Folder, Eye, Tag
} from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Motorik' | 'Agama' | 'Outdoor' | 'Prakarya' | 'Belajar' | 'Senam' | 'Kegiatan Bersama' | 'Perayaan';
  photoUrl: string;
  date: string;
  aiTag: string;
  description: string;
}

export const SmartGalleryEngine: React.FC = () => {
  const photos: GalleryPhoto[] = [
    {
      id: 'g-1',
      title: 'Keceriaan Cap Daun Kamboja & Finger Painting',
      category: 'Prakarya',
      photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
      date: 'Hari Ini',
      aiTag: 'Motorik Halus AI Grouped',
      description: 'Anak-anak melukis serat daun kamboja menggunakan pewarna alami makanan.'
    },
    {
      id: 'g-2',
      title: 'Sholat Dhuha Berjamaah & Murojaah An-Naba',
      category: 'Agama',
      photoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      date: 'Kemarin',
      aiTag: 'Tahfidz & Ibadah AI Grouped',
      description: 'Khusyuknya ananda saat memperagakan gerakan sholat dan hafalan Juz 30.'
    },
    {
      id: 'g-3',
      title: 'Outdoor Learning Kebun Edukasi Asy Syifa',
      category: 'Outdoor',
      photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
      date: '3 Hari Lalu',
      aiTag: 'Cinta Alam AI Grouped',
      description: 'Eksplorasi menyiram tanaman dan mengenal serangga di kebun hijau sekolah.'
    },
    {
      id: 'g-4',
      title: 'Membangun Masjid Tanggul di Sentra Balok',
      category: 'Motorik',
      photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      date: 'Pekan Lalu',
      aiTag: 'Spasial & Balok AI Grouped',
      description: 'Kolaborasi antar anak menyusun 50 balok kayu jati belanda.'
    },
    {
      id: 'g-5',
      title: 'Senam Pagi Anak Ceria Di Halaman Rumput',
      category: 'Senam',
      photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      date: 'Pekan Lalu',
      aiTag: 'Motorik Kasar AI Grouped',
      description: 'Gerakan senam ceria dan pemanasan jasmani sebelum memasuki kelas.'
    },
    {
      id: 'g-6',
      title: 'Pawai Santri & Perayaan Hari Besar Islam',
      category: 'Perayaan',
      photoUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
      date: 'Bulan Lalu',
      aiTag: 'Kegiatan Bersama AI Grouped',
      description: 'Pawai bendera mini dan busana muslim dalam menyambut Tahun Baru Hijriyah.'
    }
  ];

  const categories = ['Semua', 'Motorik', 'Agama', 'Outdoor', 'Prakarya', 'Belajar', 'Senam', 'Kegiatan Bersama', 'Perayaan'];

  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = activeCategory === 'Semua' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-green-950 text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" /> SMART GALLERY AI ENGINE v3.0
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
              Galeri Cerdas AI Dokumentasi TK Asy Syifa
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              AI secara otomatis mengelompokkan dokumentasi foto berdasarkan aspek perkembangan ananda.
            </p>
          </div>
        </div>

        {/* AI Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-900/80 text-emerald-200 border-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {cat === 'Semua' ? '🌟 Semua Album' : `📁 ${cat}`}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-white text-slate-900 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-xl cursor-pointer hover:scale-[1.02] transition duration-300 flex flex-col justify-between"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={photo.photoUrl} 
                  alt={photo.title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 text-amber-300 font-black text-[10px] px-3 py-1 rounded-full border border-amber-400/50 backdrop-blur-xs">
                  {photo.aiTag}
                </div>
                <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md shadow-md">
                  {photo.date}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-black text-slate-900 leading-snug">{photo.title}</h4>
                <p className="text-xs text-stone-600 line-clamp-2">{photo.description}</p>
                <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-[10px] font-bold text-emerald-800">
                  <span>📁 Kategori: {photo.category}</span>
                  <span className="flex items-center gap-1 text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                    <Eye className="w-3 h-3" /> Perbesar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Enlarged View */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 border-4 border-amber-400 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-xs font-black bg-emerald-800 text-amber-300 px-3 py-1 rounded-full">
                  {selectedPhoto.aiTag}
                </span>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 font-black rounded-xl text-xs cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              <img 
                src={selectedPhoto.photoUrl} 
                alt={selectedPhoto.title}
                className="w-full h-72 object-cover rounded-2xl border-2 border-stone-300" 
              />

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">{selectedPhoto.title}</h3>
                <p className="text-xs text-stone-700 leading-relaxed">{selectedPhoto.description}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
