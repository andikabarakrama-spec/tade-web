import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Archive,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Share2,
  Printer,
  ChevronRight,
  FileCheck
} from 'lucide-react';

type DocumentStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ARCHIVED';

interface ManagedDocument {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  status: DocumentStatus;
  version: string;
  targetRole: string;
}

export const SmartDocumentLifecycle: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocumentStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<ManagedDocument | null>(null);

  const [documents, setDocuments] = useState<ManagedDocument[]>([
    {
      id: 'DOC-2026-001',
      title: 'Surat Keputusan Kalender Akademik Semester Ganjil 2026/2027',
      type: 'Surat Keputusan (SK)',
      author: 'H. Ahmad Dahlan (Kepsek)',
      date: '14 Agt 2026',
      status: 'APPROVED',
      version: 'v1.2-Final',
      targetRole: 'Guru & Wali Murid'
    },
    {
      id: 'DOC-2026-002',
      title: 'Template Rapor Capaian Pembelajaran Kurikulum Merdeka TK-B',
      type: 'Format Rapor PDF',
      author: 'Ustazah Maryam',
      date: '15 Agt 2026',
      status: 'REVIEW',
      version: 'v0.9',
      targetRole: 'Wali Kelas'
    },
    {
      id: 'DOC-2026-003',
      title: 'Draft Rencana Anggaran Biaya (RAB) Gebyar Milad & Pawai Hijriyah',
      type: 'Proposal Keuangan',
      author: 'Siti Rahmawati (Bendahara)',
      date: '15 Agt 2026',
      status: 'DRAFT',
      version: 'v0.4',
      targetRole: 'Ketua Yayasan'
    },
    {
      id: 'DOC-2025-099',
      title: 'Arsip Laporan Pertanggungjawaban Tahunan TA 2025/2026',
      type: 'Laporan Tahunan',
      author: 'Tim Manajemen Mutu',
      date: '20 Jun 2026',
      status: 'ARCHIVED',
      version: 'v1.0-Archived',
      targetRole: 'Yayasan & Dinas'
    }
  ]);

  const handleUpdateStatus = (id: string, newStatus: DocumentStatus) => {
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, status: newStatus } : d))
    );
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchStatus = activeTab === 'ALL' || doc.status === activeTab;
    const matchQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">DRAFT</span>;
      case 'REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">DALAM REVIEW</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">DISETUJUI (RESMI)</span>;
      case 'ARCHIVED':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">DIARSIPKAN</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Smart Document Lifecycle</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                Smart PDF Compatible
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manajemen siklus hidup dokumen sekolah (Draft → Review → Approved → Archived → Restore) dengan format cetak standar dinas.
            </p>
          </div>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm self-start md:self-auto">
          <Plus className="w-4 h-4" />
          Buat Dokumen Baru
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul, nomor dokumen, atau pembuat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {(['ALL', 'DRAFT', 'REVIEW', 'APPROVED', 'ARCHIVED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'Semua Status' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Daftar Dokumen Sekolah ({filteredDocs.length})</h2>
          <span className="text-xs text-slate-400">PDF Watermark & Metadata Active</span>
        </div>

        <div className="space-y-3">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {doc.id}
                  </span>
                  <span className="text-[11px] text-blue-600 font-semibold">{doc.type}</span>
                  {getStatusBadge(doc.status)}
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">{doc.title}</h3>
                <div className="text-slate-400 text-[11px] flex items-center gap-2">
                  <span>Penyusun: {doc.author}</span>
                  <span>•</span>
                  <span>Tanggal: {doc.date}</span>
                  <span>•</span>
                  <span>Versi: {doc.version}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {doc.status === 'DRAFT' && (
                  <button
                    onClick={() => handleUpdateStatus(doc.id, 'REVIEW')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-[11px] transition"
                  >
                    Ajukan Review
                  </button>
                )}
                {doc.status === 'REVIEW' && (
                  <button
                    onClick={() => handleUpdateStatus(doc.id, 'APPROVED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition"
                  >
                    Setujui (Approve)
                  </button>
                )}
                {doc.status === 'APPROVED' && (
                  <button
                    onClick={() => handleUpdateStatus(doc.id, 'ARCHIVED')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] transition flex items-center gap-1"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Arsipkan
                  </button>
                )}
                {doc.status === 'ARCHIVED' && (
                  <button
                    onClick={() => handleUpdateStatus(doc.id, 'APPROVED')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-[11px] transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Pulihkan (Restore)
                  </button>
                )}

                <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition" title="Cetak PDF">
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
