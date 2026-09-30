import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Tag,
  FileText,
  Eye,
  Download,
  RotateCcw,
  Sparkles,
  Filter,
  CheckCircle,
  Archive
} from 'lucide-react';

interface ArchiveDocument {
  id: string;
  title: string;
  docNumber: string;
  category: 'AKREDITASI' | 'KEUANGAN' | 'KURIKULUM' | 'SK_YAYASAN' | 'RAPOR_IJAZAH';
  tags: string[];
  fileSize: string;
  archivedDate: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'TRASHED';
  previewSnippet: string;
}

export const DigitalArchiveIntelligence: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [activePreviewDoc, setActivePreviewDoc] = useState<ArchiveDocument | null>(null);

  const [documents, setDocuments] = useState<ArchiveDocument[]>([
    {
      id: 'DOC-001',
      title: 'Sertifikat Akreditasi PAUD A Unggul BAN PDM',
      docNumber: 'BAN-PDM/PAUD/2026/089',
      category: 'AKREDITASI',
      tags: ['Akreditasi', 'BAN-PDM', 'Unggul', 'Resmi'],
      fileSize: '2.4 MB',
      archivedDate: '10 Agustus 2026',
      status: 'ACTIVE',
      previewSnippet: 'Keputusan Badan Akreditasi Nasional Pendidikan Anak Usia Dini menetapkan KB-TK Islam Asy-Syaamil terakreditasi A (Unggul).'
    },
    {
      id: 'DOC-002',
      title: 'Laporan Pertanggungjawaban Keuangan Semester Genap',
      docNumber: 'LPJ/KEU/ASY/2026/02',
      category: 'KEUANGAN',
      tags: ['Keuangan', 'LPJ', 'Audit', 'Yayasan'],
      fileSize: '4.1 MB',
      archivedDate: '01 Agustus 2026',
      status: 'ACTIVE',
      previewSnippet: 'Laporan realisasi anggaran operasional, kas infaq sarpras, dan rekapitulasi dana BOS/BOP semester genap tahun ajaran 2025/2026.'
    },
    {
      id: 'DOC-003',
      title: 'Kurikulum Operasional Satuan Pendidikan (KOSP) 2026/2027',
      docNumber: 'KOSP/KUR/2026/V1',
      category: 'KURIKULUM',
      tags: ['Kurikulum', 'KOSP', 'Merdeka', 'Sentra'],
      fileSize: '5.8 MB',
      archivedDate: '15 Juli 2026',
      status: 'ACTIVE',
      previewSnippet: 'Dokumen KOSP KB-TK Islam Asy-Syaamil memuat karakteristik satuan, visi-misi, pengorganisasian pembelajaran berbasis sentra dan adab nabawiyah.'
    },
    {
      id: 'DOC-004',
      title: 'SK Pengangkatan Dewan Guru & Tenaga Kependidikan',
      docNumber: 'SK/YAS/2026/007',
      category: 'SK_YAYASAN',
      tags: ['SK', 'Yayasan', 'Kepegawaian', 'SDM'],
      fileSize: '1.2 MB',
      archivedDate: '01 Juli 2026',
      status: 'ACTIVE',
      previewSnippet: 'Surat Keputusan Ketua Yayasan tentang penetapan struktur dewan guru, wali kelas sentra, dan staf administrasi tahun ajaran 2026/2027.'
    }
  ]);

  const allTags = ['ALL', 'Akreditasi', 'Keuangan', 'Kurikulum', 'Yayasan', 'Merdeka'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesTag = selectedTag === 'ALL' || doc.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Digital Archive Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                Smart PDF Compatible
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Repositori arsip digital cerdas: pengindeksan otomatis, pencarian instan, penandaan dokumen, dan pratinjau dokumen penting madrasah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
            Total Arsip: {documents.length} Berkas
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul, nomor SK, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document List & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-800">{doc.title}</h2>
                    <p className="text-[11px] font-mono text-slate-500">{doc.docNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePreviewDoc(doc)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  {doc.archivedDate} • {doc.fileSize}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Document Preview Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600" />
              Smart Document Viewer
            </h2>
            {activePreviewDoc && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Verified PDF
              </span>
            )}
          </div>

          {activePreviewDoc ? (
            <div className="space-y-4 text-xs">
              <div>
                <div className="font-bold text-slate-800 text-sm">{activePreviewDoc.title}</div>
                <div className="font-mono text-slate-400 text-[11px] mt-0.5">{activePreviewDoc.docNumber}</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed font-sans">
                {activePreviewDoc.previewSnippet}
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Ukuran File:</span>
                  <span className="font-mono font-bold text-slate-700">{activePreviewDoc.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Diarsipkan:</span>
                  <span className="font-mono font-bold text-slate-700">{activePreviewDoc.archivedDate}</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all">
                <Download className="w-4 h-4" /> Unduh Dokumen Lengkap (PDF)
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">Pilih dokumen di samping untuk melihat pratinjau ringkasan cerdas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
