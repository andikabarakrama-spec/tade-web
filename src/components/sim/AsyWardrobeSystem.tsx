import React, { useState, useMemo } from 'react';
import { 
  Shirt, 
  Sparkles, 
  Sun, 
  CloudRain, 
  Wind, 
  Calendar, 
  Tag, 
  Eye, 
  Layers, 
  Check, 
  Search, 
  Filter, 
  Compass, 
  ShieldCheck, 
  Award,
  Crown
} from 'lucide-react';

export interface CostumeDefinition {
  id: string;
  nama: string;
  kategori: 'SERAGAM_SEKOLAH' | 'BUSANA_ADAT' | 'BUSANA_MUSLIM' | 'HARI_NASIONAL' | 'WISUDA_KHUSUS';
  periodeAktif: string;
  cuacaCocok: 'SEMUA_CUACA' | 'CERAH' | 'HUJAN_SEJUK';
  animasiCocok: string;
  deskripsi: string;
  warnaDominan: string;
  aksesori: string[];
  kodeAsetVisual: string;
}

export const AsyWardrobeSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCostumeId, setActiveCostumeId] = useState<string>('COSTUME-01');

  // Wardrobe Catalog (Zero Random, Fully Structured)
  const wardrobeCatalog: CostumeDefinition[] = useMemo(() => [
    {
      id: 'COSTUME-01',
      nama: 'Seragam TK Kotak Hijau Sentra',
      kategori: 'SERAGAM_SEKOLAH',
      periodeAktif: 'Hari Belajar Reguler (Senin & Selasa)',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Bintang Ceria & Balon Sentra',
      deskripsi: 'Seragam kebanggaan santri cilik KB-TK Asy-Syifa dengan motif kotak hijau cerah yang melambangkan kesuburan dan akhlak mulia.',
      warnaDominan: '#059669',
      aksesori: ['Topi Hijau Sentra', 'Sepatu Hitam Polos', 'Tas Ransel Asy'],
      kodeAsetVisual: 'ASSET-TK-SENTRA-V1'
    },
    {
      id: 'COSTUME-02',
      nama: 'Batik Nasional & Nusantara',
      kategori: 'SERAGAM_SEKOLAH',
      periodeAktif: 'Hari Kamis Budaya & Hari Batik Nasional (2 Okt)',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Corak Megamendung Berpendar Halus',
      deskripsi: 'Busana batik khas karya nusantara dengan corak kearifan lokal yang menanamkan rasa cinta tanah air sejak usia dini.',
      warnaDominan: '#b45309',
      aksesori: ['Syal Batik Halus', 'Pin Asy-Syifa'],
      kodeAsetVisual: 'ASSET-BATIK-NUSANTARA-V1'
    },
    {
      id: 'COSTUME-03',
      nama: 'Seragam Pramuka Siaga',
      kategori: 'SERAGAM_SEKOLAH',
      periodeAktif: 'Hari Rabu Pramuka & Hari Pramuka (14 Ags)',
      cuacaCocok: 'CERAH',
      animasiCocok: 'Tunas Kelapa Keberanian',
      deskripsi: 'Pakaian cokelat muda dan tua lengkap dengan kacu merah putih, melambangkan santri yang disiplin, ceria, dan mandiri.',
      warnaDominan: '#78350f',
      aksesori: ['Kacu Merah Putih', 'Baret Cokelat Siaga', 'Tali Peluit'],
      kodeAsetVisual: 'ASSET-PRAMUKA-SIAGA-V1'
    },
    {
      id: 'COSTUME-04',
      nama: 'Busana Muslim Putih & Peci Hitam',
      kategori: 'BUSANA_MUSLIM',
      periodeAktif: 'Hari Jumat Berkah & Pengajian Akbar',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Butiran Cahaya Tenang & Doa',
      deskripsi: 'Baju koko putih bersih, celana sirwal rapi, dan peci hitam beludru untuk pembiasaan ibadah sholat dhuha dan tadarus.',
      warnaDominan: '#0f766e',
      aksesori: ['Peci Hitam Beludru', 'Sajadah Mini Asy', 'Tasbih Kayu'],
      kodeAsetVisual: 'ASSET-MUSLIM-PUTIH-V1'
    },
    {
      id: 'COSTUME-05',
      nama: 'Gamis Ikhlas Ramadan',
      kategori: 'BUSANA_MUSLIM',
      periodeAktif: 'Bulan Suci Ramadan (1–30 Ramadan)',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Bulan Sabit Emas & Lentera Fanous',
      deskripsi: 'Gamis hijau toska lembut dengan sentuhan bordir emas, mendampingi santri menjalani pesantren kilat Ramadan.',
      warnaDominan: '#0d9488',
      aksesori: ['Sorban Bahu Hijau', 'Lentera Fanous Mini'],
      kodeAsetVisual: 'ASSET-RAMADAN-IKHLAS-V1'
    },
    {
      id: 'COSTUME-06',
      nama: 'Busana Hari Raya Idul Fitri',
      kategori: 'BUSANA_MUSLIM',
      periodeAktif: '1–7 Syawal (Hari Raya Idul Fitri)',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Bedug Kemenangan & Kilauan Ketupat',
      deskripsi: 'Pakaian hari raya bersuasana suci dan gembira untuk saling memaafkan dan menjalin silaturahmi.',
      warnaDominan: '#15803d',
      aksesori: ['Ketupat Hiasan', 'Selendang Sutra Cilik'],
      kodeAsetVisual: 'ASSET-IDUL-FITRI-V1'
    },
    {
      id: 'COSTUME-07',
      nama: 'Busana Pejuang 17 Agustus',
      kategori: 'HARI_NASIONAL',
      periodeAktif: 'Bulan Kemerdekaan (1–31 Agustus)',
      cuacaCocok: 'CERAH',
      animasiCocok: 'Bendera Merah Putih & Konfeti Semangat',
      deskripsi: 'Pakaian pejuang cilik kemerdekaan bernuansa merah putih lengkap dengan pita keberanian di kepala.',
      warnaDominan: '#dc2626',
      aksesori: ['Pita Merah Putih', 'Bendera Tangan Mini'],
      kodeAsetVisual: 'ASSET-PEJUANG-MERDEKA-V1'
    },
    {
      id: 'COSTUME-08',
      nama: 'Busana Adat Nusantara Cilik',
      kategori: 'BUSANA_ADAT',
      periodeAktif: 'Hari Kartini (21 Apr) & Sumpah Pemuda (28 Okt)',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Bunga Melati & Selendang Tradisional',
      deskripsi: 'Pakaian adat Nusantara lengkap dengan kain songket dan blangkon/mahkota kecil melambangkan Bhinneka Tunggal Ika.',
      warnaDominan: '#be185d',
      aksesori: ['Songket Mini', 'Blangkon / Mahkota Cilik'],
      kodeAsetVisual: 'ASSET-ADAT-NUSANTARA-V1'
    },
    {
      id: 'COSTUME-09',
      nama: 'Toga & Jubah Wisuda Cilik',
      kategori: 'WISUDA_KHUSUS',
      periodeAktif: 'Hari Wisuda & Pelepasan Santri Kelulusan',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Topi Toga Terbang & Konfeti Emas',
      deskripsi: 'Jubah wisuda hitam dengan selempang beludru kuning emas serta topi toga mini untuk perayaan wisuda tahfidz dan kelulusan.',
      warnaDominan: '#854d0e',
      aksesori: ['Topi Toga Mini', 'Map Ijazah Sentra', 'Selempang Wisudawan Cilik'],
      kodeAsetVisual: 'ASSET-TOGA-WISUDA-V1'
    },
    {
      id: 'COSTUME-10',
      nama: 'Kostum Pentas Seni & Haflah',
      kategori: 'WISUDA_KHUSUS',
      periodeAktif: 'Pekan Pentas Seni & Haflah Akhirussanah',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Kembang Api Lembut & Lampu Sorot',
      deskripsi: 'Kostum pentas seni dengan jubah panggung warna-warni yang memicu imajinasi dan keberanian tampil di depan umum.',
      warnaDominan: '#7c3aed',
      aksesori: ['Mahkota Seni Bintang', 'Tongkat Ajaib Sentra'],
      kodeAsetVisual: 'ASSET-HAFLAH-PENTAS-V1'
    },
    {
      id: 'COSTUME-11',
      nama: 'Batik Guru & Pendidik Cilik',
      kategori: 'HARI_NASIONAL',
      periodeAktif: 'Hari Guru Nasional (25 November)',
      cuacaCocok: 'SEMUA_CUACA',
      animasiCocok: 'Buku Terbuka & Pensil Mengambang',
      deskripsi: 'Batik guru rapi menghormati jasa para ustadz dan ustadzah yang telah mendidik dengan penuh kesabaran.',
      warnaDominan: '#4338ca',
      aksesori: ['Kacamata Cilik Pendidik', 'Buku Cerita Asy'],
      kodeAsetVisual: 'ASSET-BATIK-GURU-V1'
    }
  ], []);

  // Filtered List
  const filteredCostumes = useMemo(() => {
    return wardrobeCatalog.filter(c => {
      const matchCat = selectedCategory === 'ALL' || c.kategori === selectedCategory;
      const matchQuery = c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.periodeAktif.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [wardrobeCatalog, selectedCategory, searchQuery]);

  const activeCostume = useMemo(() => {
    return wardrobeCatalog.find(c => c.id === activeCostumeId) || wardrobeCatalog[0];
  }, [wardrobeCatalog, activeCostumeId]);

  return (
    <div id="asy-wardrobe-system-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shirt className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
              R237 &bull; ASY WARDROBE SYSTEM
            </span>
            <span className="text-xs text-slate-400">Contextual Outfit &amp; Cultural Attire Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Shirt className="w-8 h-8 text-indigo-400" />
            Asy Wardrobe System
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Sistem tata kelola pakaian dan atribut Maskot Asy. Setiap kostum memiliki <strong>ID terverifikasi, periode aktif, toleransi cuaca, dan animasi kultural</strong> yang terikat ketat pada tata nilai Islam dan Nusantara.
          </p>
        </div>
      </div>

      {/* Main Grid: Fitting Room Preview + Catalog Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Fitting Room Showcase */}
        <div className="lg:col-span-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                FITTING ROOM ASY
              </span>
              <span className="text-slate-500">{activeCostume.id}</span>
            </div>

            {/* Mascot Avatar in Costume */}
            <div className="my-6 flex flex-col items-center text-center">
              <div 
                className="w-40 h-40 rounded-full p-2 shadow-2xl flex items-center justify-center relative transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${activeCostume.warnaDominan}, #0f172a)` }}
              >
                <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden border border-slate-700">
                  <span className="text-5xl animate-bounce">🐱</span>
                  <span className="text-[10px] font-bold text-white font-mono tracking-widest mt-1">ASY MASCOT</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-4">{activeCostume.nama}</h3>
              <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700 mt-1">
                {activeCostume.kategori}
              </span>
            </div>

            {/* Costume Specs List */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" /> Periode Penggunaan:
                </span>
                <p className="font-medium text-white">{activeCostume.periodeAktif}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Animasi Kultural:
                </span>
                <p className="font-medium text-amber-300">{activeCostume.animasiCocok}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-400" /> Aksesori Terpasang:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeCostume.aksesori.map((acc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-700/80 text-[10px] text-emerald-300">
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
            Kode Aset: {activeCostume.kodeAsetVisual}
          </div>
        </div>

        {/* Right: Wardrobe Catalog Explorer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari busana Asy (misal: Batik, Wisuda, Ramadan)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'SERAGAM_SEKOLAH', 'BUSANA_MUSLIM', 'HARI_NASIONAL', 'BUSANA_ADAT', 'WISUDA_KHUSUS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredCostumes.map((costume) => {
              const isSelected = costume.id === activeCostumeId;
              return (
                <div
                  key={costume.id}
                  onClick={() => setActiveCostumeId(costume.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-md ring-1 ring-indigo-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {costume.kategori}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-mono">
                          <Check className="w-3.5 h-3.5" /> Sedang Dipakai
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: costume.warnaDominan }}
                      />
                      {costume.nama}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {costume.deskripsi}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[170px] font-mono text-[10px]">
                      {costume.periodeAktif}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                      Pilih &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
