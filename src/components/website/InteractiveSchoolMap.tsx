import React, { useState } from 'react';
import { MapPin, Sparkles, X, ChevronRight, CheckCircle2, Shield, Heart, Compass, Navigation, Trees, Bird, Sun } from 'lucide-react';

interface MapSpot {
  id: string;
  name: string;
  category: string;
  icon: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  activities: string[];
  features: string[];
  teacherTip: string;
  coords: { x: number; y: number };
  badgeColor: string;
  bgColor: string;
  animal: string;
}

export const InteractiveSchoolMap: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(null);

  const spots: MapSpot[] = [
    {
      id: 'spot-1',
      name: 'Gerbang Utama & Pos Keamanan 🚪',
      category: 'Penyambutan & Keamanan',
      icon: '🚪',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Area penyambutan guru 5S & pos satpam ramah anak 24 jam.',
      fullDesc: 'Gerbang utama dirancang ramah anak dengan pagar pembatas aman, kanopi pelindung hujan/panas, serta pos satpam sekolah yang bersiap menyambut kehadiran murid setiap pagi.',
      activities: ['Penyambutan Senyum Sapa Salam', 'Pengecekan Suhu & Cuci Tangan', 'Penjemputan Teratur'],
      features: ['CCTV 24 Jam', 'Pagar Keamanan Anak', 'Area Pengedropan Rapi'],
      teacherTip: '“Senyuman guru di gerbang adalah kunci kebahagiaan anak memulai hari sekolah.”',
      coords: { x: 15, y: 75 },
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      bgColor: 'bg-amber-50',
      animal: '🕊️ Burung Perkutut',
    },
    {
      id: 'spot-2',
      name: 'Gedung Kelas Utama & 5 Sentra 🏫',
      category: 'Ruang Belajar PAUD',
      icon: '🏫',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Ruang kelas ber-AC, penuh warna, dan area 5 Sentra.',
      fullDesc: 'Dilengkapi pendingin ruangan (AC), pencahayaan alami melimpah, meja kursi ergonomis anak, serta karpet edukatif untuk kegiatan Sentra Balok, Seni, dan IMTAQ.',
      activities: ['Bermain Balok Presisi', 'Eksplorasi Warna & Seni', 'Praktik Puzzle & Latihan Motorik'],
      features: ['Ber-AC & Sejuk', 'Lantai Kayu Anti Slip', 'Peralatan Edukasi Modern'],
      teacherTip: '“Lingkungan kelas yang bersih dan estetik membangkitkan fokus dan kreativitas anak.”',
      coords: { x: 40, y: 35 },
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      bgColor: 'bg-emerald-50',
      animal: '🐝 Lebah Madu Ceria',
    },
    {
      id: 'spot-3',
      name: 'Musholla Al-Syifa Cilik 🕌',
      category: 'Ibadah & Tahfidz',
      icon: '🕌',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Sarana latihan sholat Dhuha berjamaah & bimbingan Al-Qur’an.',
      fullDesc: 'Musholla sekolah yang bersih dan wangi. Dilengkapi sajadah cilik berderet, tempat wudhu ketinggian anak, serta sound system lembut untuk praktik adzan dan iqamah.',
      activities: ['Sholat Dhuha Berjamaah', 'Bimbingan Tahfidz Juz 30', 'Kisah Nabi & Sahabat'],
      features: ['Tempat Wudhu Anak', 'Sajadah & Mukena Bersih', 'Al-Qur’an & Iqro Anak'],
      teacherTip: '“Sholat berjamaah melatih kerapian shaf dan kekhusyukan ibadah sejak kecil.”',
      coords: { x: 70, y: 25 },
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      bgColor: 'bg-teal-50',
      animal: '🌙 Bulan Bintang',
    },
    {
      id: 'spot-4',
      name: 'Outdoor Playground & Taman 🛝',
      category: 'Motorik & Rekreasi',
      icon: '🛝',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Ayunan, perosotan, komidi putar, & pasir kinetik outdoor.',
      fullDesc: 'Taman bermain luas dengan rumput sintetis lembut dan alas karet anti benturan (EVA Mat). Dirancang untuk melatih keberanian fisik dan koordinasi tubuh.',
      activities: ['Bermain Ayunan & Perosotan', 'Senam Ceria Pagi Hari', 'Permainan Tradisional'],
      features: ['Alas Karet Anti Sakit', 'Rumput Hijau Asri', 'Naungan Pohon Rindang'],
      teacherTip: '“Bermain outdoor menguatkan imun, kebugaran fisik, dan kemampuan bersosialisasi.”',
      coords: { x: 25, y: 40 },
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      bgColor: 'bg-sky-50',
      animal: '🦋 Kupu-kupu Pelangi',
    },
    {
      id: 'spot-5',
      name: 'Kebun Edukasi & Kolam Ikan 🌱',
      category: 'Sentra Alam & Sains',
      icon: '🌱',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Kebun sayur organik & kolam ikan koi interaktif.',
      fullDesc: 'Anak-anak belajar langsung menanam bibit sayur (kangkung, bayam, tomat), menyiram tanaman harian, serta memberi makan ikan di kolam hias.',
      activities: ['Menanam Sayur Organik', 'Memberi Makan Ikan Koi', 'Pengamatan Kupu-Kupu & Bunga'],
      features: ['Tanaman Herbal & Buah', 'Kolam Air Jernih Safe Guard', 'Peralatan Berkebun Cilik'],
      teacherTip: '“Menyentuh tanah dan merawat tanaman menumbuhkan rasa syukur atas ciptaan Allah.”',
      coords: { x: 80, y: 60 },
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      bgColor: 'bg-rose-50',
      animal: '🐟 Ikan Koi Ceria & 🐰 Kelinci',
    },
    {
      id: 'spot-6',
      name: 'Perpustakaan & Pojok Baca 📚',
      category: 'Literasi & Dongeng',
      icon: '📚',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Ratusan buku cerita bergambar & sudut panggung pementasan.',
      fullDesc: 'Sudah karpet empuk dengan bantal warna-warni, rak buku terjangkau tinggi anak, serta koleksi buku Islami, sains anak, dan ensiklopedia bergambar menarik.',
      activities: ['Sesi Mendorong Dongeng Guru', 'Membaca Mandiri Bergambar', 'Panggung Boneka Tangan'],
      features: ['Bantal Empuk Renyah', 'Ratusan Buku Edukatif', 'Boneka Karakter Cerita'],
      teacherTip: '“Cinta buku dimulai dari mendengarkan dongeng yang membangkitkan imajinasi.”',
      coords: { x: 55, y: 70 },
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      bgColor: 'bg-purple-50',
      animal: '🦉 Burung Hantu Bijak',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-amber-100/90 rounded-3xl p-6 sm:p-10 border-4 border-emerald-300 shadow-md space-y-8 relative overflow-hidden">
      {/* Decorative Adventure Map Elements */}
      <div className="absolute top-3 left-4 text-2xl animate-float-slow">🎈</div>
      <div className="absolute top-4 right-8 text-2xl animate-bounce">☀️</div>
      <div className="absolute bottom-3 left-6 text-2xl">🌲</div>
      <div className="absolute bottom-3 right-10 text-2xl">🐇</div>

      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800 text-amber-300 font-black text-xs shadow-md border-2 border-amber-300">
          <Compass className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Peta Petualangan Jelajah Kampus Ceria</span>
          <span className="text-base">🧭</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Adventure Map: Keliling Kampus TK Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 font-medium">
          Ikuti jejak kaki 🐾, arah panah ↗️, dan temukan setiap sudut taman bermain & ruang sentra berkesan bagi ananda.
        </p>
      </div>

      {/* Visual Adventure Map Canvas */}
      <div className="relative w-full h-88 sm:h-100 bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl">
        {/* Map Background Illustration */}
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/50 to-teal-900/40" />

        {/* Footprint Trail Dotted Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-300/60 stroke-2" style={{ strokeDasharray: '6,6' }}>
          <path d="M 150 220 Q 250 120, 400 100 T 700 80 T 800 200" fill="none" />
        </svg>

        {/* Map Grid & Cute Doodles */}
        <div className="absolute top-4 left-6 text-white/80 text-xs font-black bg-slate-950/80 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-amber-300" />
          <span>Kompas: Arah Barat Daya - Tanggul Jember</span>
        </div>

        {/* Map Hotspot Pins */}
        {spots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setSelectedSpot(spot)}
            style={{ left: `${spot.coords.x}%`, top: `${spot.coords.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20"
          >
            <div className="relative flex items-center justify-center">
              {/* Pulse effect */}
              <span className="absolute w-10 h-10 rounded-full bg-amber-400/50 animate-ping" />
              {/* Pin Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-300 text-slate-950 font-black text-lg flex items-center justify-center shadow-2xl border-2 border-white group-hover:scale-115 transition transform">
                {spot.icon}
              </div>
            </div>
            <span className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-950/90 text-amber-300 font-black text-[10px] px-3 py-1 rounded-full whitespace-nowrap border border-amber-300/80 opacity-95 group-hover:opacity-100 shadow-lg flex items-center gap-1">
              <span>🐾</span>
              <span>{spot.name}</span>
            </span>
          </button>
        ))}

        {/* Floating Hint */}
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-amber-300 font-black text-xs px-3.5 py-1.5 rounded-full border border-amber-400 flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Klik Lokasi Pada Peta Petualangan</span>
        </div>
      </div>

      {/* Spot Quick Cards Below Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {spots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => setSelectedSpot(spot)}
            className={`bg-white/95 rounded-2xl p-4 border-2 ${spot.badgeColor.split(' ')[2] || 'border-stone-200'} shadow-xs hover:shadow-md transition duration-200 cursor-pointer flex items-center gap-3.5 group relative overflow-hidden`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl shrink-0 group-hover:bg-amber-400 group-hover:scale-105 transition shadow-2xs">
              {spot.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[9px] font-black uppercase ${spot.badgeColor} px-2 py-0.5 rounded-md border`}>
                {spot.category}
              </span>
              <h3 className="font-black text-xs text-slate-900 truncate mt-1 group-hover:text-emerald-800 transition">
                {spot.name}
              </h3>
              <p className="text-[10px] text-stone-600 truncate font-medium">{spot.shortDesc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 transition" />
          </div>
        ))}
      </div>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-4 border-amber-300 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-amber-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-amber-100 rounded-2xl border border-amber-300">{selectedSpot.icon}</span>
                <div>
                  <span className={`text-xs font-black uppercase tracking-wider ${selectedSpot.badgeColor} px-2.5 py-0.5 rounded-md border`}>
                    {selectedSpot.category} • {selectedSpot.animal}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{selectedSpot.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpot(null)}
                className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center font-black text-sm border border-stone-200"
              >
                ✕
              </button>
            </div>

            {/* Photo & Description */}
            <div className="space-y-4">
              <div className="h-60 rounded-2xl overflow-hidden shadow-lg relative border-2 border-amber-200">
                <img
                  src={selectedSpot.image}
                  alt={selectedSpot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs text-amber-300 font-black bg-slate-950/90 px-3 py-1 rounded-full border border-amber-400/60">
                  🐾 Lokasi Petualangan Resmi TK Asy Syifa
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {selectedSpot.fullDesc}
              </p>
            </div>

            {/* Features & Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <h4 className="font-black text-xs text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Kegunaan & Aktivitas Ceria:
                </h4>
                <ul className="text-xs text-stone-800 space-y-1.5 font-medium">
                  {selectedSpot.activities.map((act, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="font-black text-xs text-amber-950 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-700" /> Fasilitas Utama Ramah Anak:
                </h4>
                <ul className="text-xs text-stone-800 space-y-1.5 font-medium">
                  {selectedSpot.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Teacher Note */}
            <div className="p-4 bg-emerald-900 text-white rounded-2xl space-y-1 border-2 border-amber-300 shadow-md">
              <span className="text-[10px] uppercase font-black text-amber-300">Pesan Kasih Ibu Guru & Ustadzah</span>
              <p className="text-xs italic text-emerald-100 font-medium">{selectedSpot.teacherTip}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

