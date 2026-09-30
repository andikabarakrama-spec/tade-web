import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Bookmark,
  FileText,
  Download,
  Star,
  Tag,
  CheckCircle2,
  BookOpen,
  Filter
} from 'lucide-react';

interface ResourceDoc {
  id: string;
  title: string;
  category: 'SOP' | 'TEMPLATE' | 'KURIKULUM' | 'REGULASI';
  format: 'PDF' | 'DOCX' | 'XLSX';
  size: string;
  updatedAt: string;
  downloads: number;
  bookmarked: boolean;
  summary: string;
}

export const IntelligentResourceCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [resources, setResources] = useState<ResourceDoc[]>([
    {
      id: 'DOC-SOP-01',
      title: 'SOP Penyambutan Santri & Pemeriksaan Kesehatan Pagi',
      category: 'SOP',
      format: 'PDF',
      size: '1.4 MB',
      updatedAt: '10 Agu 2026',
      downloads: 142,
      bookmarked: true,
      summary: 'Panduan tata cara guru piket saat menyambut santri di gerbang sekolah, sanitasi tangan, dan verifikasi suhu tubuh.'
    },
    {
      id: 'DOC-TPL-02',
      title: 'Template Modul Ajar Sentra PAUD Kurikulum Merdeka',
      category: 'TEMPLATE',
      format: 'DOCX',
      size: '850 KB',
      updatedAt: '08 Agu 2026',
      downloads: 298,
      bookmarked: true,
      summary: 'Format baku penyusunan RPP harian (RPPH) berbasis sentra belajar islami yang sesuai pedoman BSKAP Kemendikbud.'
    },
    {
      id: 'DOC-KUR-03',
      title: 'Pedoman Capaian Pembelajaran Nilai Agama & Budi Pekerti',
      category: 'KURIKULUM',
      format: 'PDF',
      size: '2.1 MB',
      updatedAt: '01 Agu 2026',
      downloads: 87,
      bookmarked: false,
      summary: 'Rubrik penilaian tahsin, hafalan surat pendek, doa harian, dan adab keseharian santri usia 4-6 tahun.'
    },
    {
      id: 'DOC-SOP-04',
      title: 'SOP Tanggap Darurat & Pertolongan Pertama di Sentra (UKS)',
      category: 'SOP',
      format: 'PDF',
      size: '1.1 MB',
      updatedAt: '25 Jul 2026',
      downloads: 65,
      bookmarked: false,
      summary: 'Prosedur operasional standar penanganan luka ringan, demam mendadak, serta rujukan puskesmas/rumah sakit mitra.'
    },
    {
      id: 'DOC-TPL-05',
      title: 'Template Laporan Keuangan Sentra & Pengadaan Bahan Ajar',
      category: 'TEMPLATE',
      format: 'XLSX',
      size: '620 KB',
      updatedAt: '20 Jul 2026',
      downloads: 110,
      bookmarked: false,
      summary: 'Buku kas pembantu sentra untuk pencatatan belanja bahan alam, peralatan balok, dan media seni rupa.'
    }
  ]);

  const toggleBookmark = (id: string) => {
    setResources(resources.map(r => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r)));
  };

  const filtered = resources.filter(r => {
    const matchCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Intelligent Resource Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                Knowledge Repository
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat perbendaharaan digital sekolah: SOP operasional, template kurikulum merdeka, modul ajar sentra, dan arsip dokumen resmi.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Cari SOP, template RPP, panduan kurikulum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'SOP', 'TEMPLATE', 'KURIKULUM'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Dokumen' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-teal-300 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 font-mono text-[10px] font-bold border border-teal-200">
                  {doc.category}
                </span>

                <button
                  onClick={() => toggleBookmark(doc.id)}
                  className={`p-1.5 rounded-lg transition-all ${
                    doc.bookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div>
                <h2 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                  {doc.title}
                </h2>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {doc.summary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  {doc.format}
                </span>
                <span className="text-[11px]">{doc.size}</span>
              </div>

              <button
                onClick={() => alert(`Mengunduh dokumen: ${doc.title} (${doc.format})`)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-lg flex items-center gap-1.5 transition-all text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
