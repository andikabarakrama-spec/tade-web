import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  FolderArchive, 
  FileCheck, 
  Layers, 
  Tag, 
  Sparkles,
  Lock
} from 'lucide-react';
import { SmartDocumentCenterEngine, SmartDocumentItem } from '../../core/smartoffice/SmartDocumentCenterEngine';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const SmartDocumentCenterViewer: React.FC = () => {
  const { activeRole } = useAuth();
  const currentRole: UserRole = activeRole || 'SUPER_ADMIN';

  const docEngine = SmartDocumentCenterEngine.getInstance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const documents = docEngine.searchDocuments(searchQuery, selectedCategory, currentRole);
  const stats = docEngine.getDocumentStats();

  const getFormatBadge = (fmt: string) => {
    switch (fmt) {
      case 'PDF': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'DOCX': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'XLSX': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6" id="smart-document-center-viewer">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                R715 &bull; Smart Document Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Searchable Document Index
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Dokumen, Surat Resmi, &amp; Khazanah Arsip
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Indeks pencarian terpusat surat keputusan, laporan keuangan, template formulir, dan regulasi yayasan. Memanfaatkan struktur penyimpanan eksisting tanpa overhead vendor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Dokumen</div>
              <div className="text-lg font-black text-emerald-400">{stats.totalDocuments} Berkas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, nomor surat, penulis, atau tag arsip..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { id: 'ALL', label: 'Semua Kategori' },
            { id: 'SURAT_RESMI', label: 'Surat Resmi' },
            { id: 'LAPORAN_KEUANGAN', label: 'Laporan Keuangan' },
            { id: 'TEMPLATE_FORMULIR', label: 'Template & Formulir' },
            { id: 'ARSIP_AKADEMIK', label: 'Arsip Akademik' },
            { id: 'REGULASI_YAYASAN', label: 'Regulasi Yayasan' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {doc.documentNumber}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getFormatBadge(doc.format)}`}>
                  {doc.format} &bull; {doc.fileSizeKb} KB
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{doc.title}</h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Penulis: <strong className="text-slate-300">{doc.author}</strong></span>
                <span>&bull;</span>
                <span>{new Date(doc.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {doc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px] font-medium border border-slate-800/80 flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Akses: {doc.accessLevel.join(', ')}
              </span>
              <button
                onClick={() => alert(`Mengunduh dokumen: ${doc.title} (${doc.documentNumber})`)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-800 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
