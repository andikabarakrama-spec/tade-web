import React, { useState } from 'react';
import { Camera, Eye, CheckCircle2, Sparkles, MapPin, Maximize2, Shield, Users, Heart } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  category: string;
  capacity: string;
  desc: string;
  features: string[];
  image: string;
  tag: string;
}

export const VirtualSchoolTour: React.FC = () => {
  const facilities: Facility[] = [
    {
      id: 'kelas',
      name: 'Ruang Kelas Ber-AC & Multimedia',
      category: 'Akademik',
      capacity: '15-20 Anak / Kelas',
      desc: 'Ruang kelas bersih, ber-AC, karpet empuk, sudut baca bergambar, serta proyektor multimedia untuk pembelajaran interaktif.',
      features: ['Karpet Empuk Standar Anak', 'AC & Air Purifier', 'Sudut Baca Bergambar', 'Proyektor Interactive'],
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800',
      tag: 'Sentra Utama',
    },
    {
      id: 'perpus',
      name: 'Perpustakaan Cilik Asy Syifa',
      category: 'Literasi',
      capacity: '30 Anak',
      desc: 'Koleksi 500+ buku cerita bergambar, ensiklopedia anak, komik Islami, dan panggung dongeng cilik.',
      features: ['500+ Buku Bergambar', 'Panggung Dongeng', 'Karpet Busa Nyaman', 'Audiobook Islami'],
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
      tag: 'Literasi Ceria',
    },
    {
      id: 'play',
      name: 'Area Bermain Outdoor Ramah Anak',
      category: 'Motorik',
      capacity: '60 Anak',
      desc: 'Arena permainan perosotan, ayunan, titian keseimbangan, dan mangkok putar berlapis rumput sintetis empuk anti benturan.',
      features: ['Rumput Sintetis Safe-Impact', 'Perosotan & Ayunan SNI', 'Pagar Pengaman Keliling', 'Area Bunga Ceria'],
      image: 'https://images.unsplash.com/photo-1566454825481-4e48f80aa4d7?auto=format&fit=crop&q=80&w=800',
      tag: 'Outdoor Safety',
    },
    {
      id: 'musholla',
      name: 'Musholla Cilik & Area Wudhu',
      category: 'Ibadah',
      capacity: '80 Anak',
      desc: 'Sarana latihan sholat dhuha berjamaah dan wudhu mandiri dengan kran air disesuaikan dengan tinggi badan anak.',
      features: ['Kran Wudhu Rendah', 'Sajadah Warna-Warni', 'Mukena & Sarung Cilik', 'Sound System Soft'],
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      tag: 'Ibadah Ceria',
    },
    {
      id: 'kebun',
      name: 'Taman Edukasi & Kebun Hidroponik',
      category: 'Sains & Alam',
      capacity: '25 Anak',
      desc: 'Kebun sekolah berisi tanaman hias, sayur hidroponik, dan kolam ikan mas untuk pembelajaran sains cilik dan cinta alam.',
      features: ['Instalasi Hidroponik', 'Kolam Ikan Mas', 'Peralatan Berkebun Cilik', 'Kompos Organik'],
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      tag: 'Cinta Alam',
    },
    {
      id: 'uks',
      name: 'Ruang UKS & Layanan KMS',
      category: 'Kesehatan',
      capacity: '4 Ranjang Cilik',
      desc: 'Ruang kesehatan lengkap dengan timbangan, pengukur tinggi badan, tempat tidur istirahat, dan obat P3K ramah anak.',
      features: ['Ranjang Istirahat Empuk', 'Alat KMS Kesehatan', 'Obat P3K Anak', 'Kerjasama Puskesmas'],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      tag: 'Kesehatan Utama',
    },
  ];

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <section className="bg-gradient-to-br from-stone-50 via-emerald-50/40 to-teal-50/30 rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-200/60 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Virtual School Tour
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Keliling & Jelajahi Fasilitas TK Asy Syifa
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Lingkungan sekolah yang bersih, aman, ramah anak, dan dirancang khusus untuk kenyamanan stimulasi tumbuh kembang ananda.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-2xl shrink-0">
          🏫 100% Standar Keamanan Anak
        </span>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((f) => (
          <div
            key={f.id}
            onClick={() => setSelectedFacility(f)}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/50">
                  {f.tag}
                </span>
                <span className="absolute bottom-3 left-3 text-white font-extrabold text-sm drop-shadow-md">
                  {f.name}
                </span>
                <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-emerald-900 transition">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span className="flex items-center gap-1 text-emerald-800 font-bold">
                    <Shield className="w-3.5 h-3.5" /> {f.category}
                  </span>
                  <span className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Users className="w-3.5 h-3.5" /> {f.capacity}
                  </span>
                </div>

                <p className="text-stone-600 leading-relaxed line-clamp-2">{f.desc}</p>

                {/* Features list */}
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-1.5 text-[11px]">
                  {f.features.map((feat, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-slate-700 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
              <span>Lihat Detail Fasilitas</span>
              <Eye className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Popup */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-300 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-64 bg-stone-900">
              <img
                src={selectedFacility.image}
                alt={selectedFacility.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20"
              >
                ✕ Tutup
              </button>
              <div className="absolute bottom-4 left-6 right-6 space-y-1 text-white">
                <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  {selectedFacility.category}
                </span>
                <h3 className="text-xl font-black">{selectedFacility.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-stone-700 leading-relaxed text-sm">{selectedFacility.desc}</p>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <h4 className="font-extrabold text-emerald-900 text-xs">Fitur & Fasilitas Lengkap:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                  {selectedFacility.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-stone-500 font-medium">Kapasitas: {selectedFacility.capacity}</span>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl"
                >
                  Selesai Membaca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
