import React, { useState } from 'react';
import {
  Download,
  Star,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  Building2,
  FileSpreadsheet,
  FileText,
  Layout,
  QrCode
} from 'lucide-react';

export type MarketplaceCategory =
  | 'ALL'
  | 'BANNER_3D'
  | 'SERTIFIKAT'
  | 'BROSUR'
  | 'KALENDER'
  | 'QR_EVENT'
  | 'LPJ'
  | 'RAB'
  | 'NUSANTARA';

export interface MarketplaceTemplate {
  id: string;
  title: string;
  category: MarketplaceCategory;
  downloadsCount: number;
  rating: number;
  fileFormat: string;
  isFree: boolean;
  thumbnailGradient: string;
  description: string;
  author: string;
}

const TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'TMPL-001',
    title: 'Template Banner Panggung 3D Gebyar Maulid & Muharram',
    category: 'BANNER_3D',
    downloadsCount: 1420,
    rating: 4.9,
    fileFormat: 'PSD / SVG / PNG HD',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-emerald-800 to-teal-950',
    description: 'Spanduk panggung megah bernuansa islami nusantara siap edit ukuran 4x2 meter.',
    author: 'TADE Studio Nusantara'
  },
  {
    id: 'TMPL-002',
    title: 'Sertifikat Kelulusan & Tahfidz Ornamen Songket Emas',
    category: 'SERTIFIKAT',
    downloadsCount: 2310,
    rating: 5.0,
    fileFormat: 'DOCX / PDF / SVG',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-amber-800 to-yellow-950',
    description: 'Sertifikat resmi dengan motif batik & songket nusantara berbingkai emas formal.',
    author: 'Desain Nasional Edu'
  },
  {
    id: 'TMPL-003',
    title: 'Template LPJ Dana BOSP & Yayasan Standar Kemdikbud',
    category: 'LPJ',
    downloadsCount: 980,
    rating: 4.8,
    fileFormat: 'XLSX / Google Sheets',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-blue-800 to-indigo-950',
    description: 'Format laporan pertanggungjawaban keuangan otomatis terkoneksi rumus pajak & nota.',
    author: 'Ikatan Bendahara Sekolah'
  },
  {
    id: 'TMPL-004',
    title: 'RAB Anggaran Tahunan Sekolah & Rencana Kerja (RKAS)',
    category: 'RAB',
    downloadsCount: 850,
    rating: 4.9,
    fileFormat: 'XLSX Spreadsheet',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-indigo-800 to-purple-950',
    description: 'Perhitungan otomatis alokasi gaji guru, pemeliharaan gedung, dan operasional santri.',
    author: 'Tim Ahli Keuangan TADE'
  },
  {
    id: 'TMPL-005',
    title: 'Brosur Pendaftaran PPDB Lipat Tiga Ceria Ramah Anak',
    category: 'BROSUR',
    downloadsCount: 1890,
    rating: 4.9,
    fileFormat: 'Canva / PDF / PNG',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-pink-800 to-rose-950',
    description: 'Brosur lipat 3 modern dengan tabel biaya, program unggulan, dan scan QR pendaftaran.',
    author: 'Kreator Edukasi Cilik'
  },
  {
    id: 'TMPL-006',
    title: 'Sistem QR Absensi Meja Tamu Event & Rapat Wali Murid',
    category: 'QR_EVENT',
    downloadsCount: 640,
    rating: 4.8,
    fileFormat: 'TADE Dynamic QR Card',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-cyan-800 to-sky-950',
    description: 'Standee QR code meja registrasi cepat tanpa antre dengan rekapitulasi real-time WhatsApp.',
    author: 'TADE Core Automation'
  },
  {
    id: 'TMPL-007',
    title: 'Kalender Akademik Pendidikan Hijriah & Masehi 1448 H',
    category: 'KALENDER',
    downloadsCount: 1150,
    rating: 4.9,
    fileFormat: 'PDF / Vector AI',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-teal-800 to-emerald-950',
    description: 'Kalender dinding lengkap hari libur nasional, jadwal ujian, dan peringatan hari besar Islam.',
    author: 'Pusat Kurikulum Nusantara'
  },
  {
    id: 'TMPL-008',
    title: 'Paket Template Piagam Prestasi Etnik Nusantara (Batik Megamendung)',
    category: 'NUSANTARA',
    downloadsCount: 1540,
    rating: 5.0,
    fileFormat: 'DOCX / SVG / PNG',
    isFree: true,
    thumbnailGradient: 'bg-gradient-to-tr from-amber-700 to-red-950',
    description: 'Koleksi sertifikat bertema kebudayaan Indonesia untuk lomba antar santri.',
    author: 'Galeri Budaya Edukasi'
  }
];

export const TemplateStore: React.FC = () => {
  const [category, setCategory] = useState<MarketplaceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCat = category === 'ALL' || tmpl.category === category;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (id: string, title: string) => {
    if (!downloadedIds.includes(id)) {
      setDownloadedIds([...downloadedIds, id]);
    }
    alert(`Mengunduh template: "${title}". File tersimpan di library sekolah.`);
  };

  const CATEGORIES: { key: MarketplaceCategory; label: string }[] = [
    { key: 'ALL', label: 'Semua Kategori' },
    { key: 'BANNER_3D', label: 'Banner 3D' },
    { key: 'SERTIFIKAT', label: 'Sertifikat' },
    { key: 'BROSUR', label: 'Brosur PPDB' },
    { key: 'LPJ', label: 'LPJ & Keuangan' },
    { key: 'RAB', label: 'RAB Sekolah' },
    { key: 'KALENDER', label: 'Kalender Edu' },
    { key: 'QR_EVENT', label: 'QR Event' },
    { key: 'NUSANTARA', label: 'Template Nusantara' }
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari template sertifikat, banner, LPJ, RAB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Menampilkan <strong className="text-slate-900 dark:text-slate-100">{filteredTemplates.length}</strong> template siap pakai
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                category === c.key
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTemplates.map((item) => {
          const isDownloaded = downloadedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Header Box / Visual Preview */}
              <div className={`h-36 p-4 text-white relative flex flex-col justify-between ${item.thumbnailGradient}`}>
                <div className="flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-black/40 backdrop-blur-sm border border-white/20">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/80 text-white">
                    GRATIS 100%
                  </span>
                </div>

                <div className="z-10">
                  <h4 className="font-bold text-xs line-clamp-2 leading-tight drop-shadow">
                    {item.title}
                  </h4>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Details & Actions */}
              <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Format: {item.fileFormat}</span>
                    <span className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{item.rating}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {item.downloadsCount} diunduh
                  </span>
                  <button
                    onClick={() => handleDownload(item.id, item.title)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                      isDownloaded
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                    }`}
                  >
                    {isDownloaded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{isDownloaded ? 'Terpasang' : 'Unduh'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
