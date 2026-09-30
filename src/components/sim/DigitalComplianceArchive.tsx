import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Eye,
  Download,
  Filter,
  Search,
  Lock
} from 'lucide-react';

interface ComplianceDocument {
  id: string;
  name: string;
  category: 'LEGALITAS' | 'AKREDITASI' | 'SANITASI' | 'KEMENKUMHAM';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  fileSize: string;
  sha256Hash: string;
  issuingAuthority: string;
}

export const DigitalComplianceArchive: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewDoc, setPreviewDoc] = useState<ComplianceDocument | null>(null);

  const [documents] = useState<ComplianceDocument[]>([
    {
      id: 'DOC-01',
      name: 'Izin Operasional Satuan Pendidikan PAUD',
      category: 'LEGALITAS',
      documentNumber: '421.1/0892/DPK-PAUD/2024',
      issueDate: '12 Januari 2024',
      expiryDate: '12 Januari 2029',
      daysRemaining: 880,
      status: 'VALID',
      fileSize: '2.4 MB (PDF)',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      issuingAuthority: 'Dinas Pendidikan Kabupaten'
    },
    {
      id: 'DOC-02',
      name: 'Sertifikat Akreditasi A BAN-PDM (PAUD & PNF)',
      category: 'AKREDITASI',
      documentNumber: '118/BAN-PAUD/AKR/2023',
      issueDate: '15 November 2023',
      expiryDate: '15 November 2028',
      daysRemaining: 822,
      status: 'VALID',
      fileSize: '3.1 MB (PDF)',
      sha256Hash: 'ca978112ca1bbdcafac231b39a23dc4da78608141904618fb5f0962804b407b4',
      issuingAuthority: 'Badan Akreditasi Nasional PDM'
    },
    {
      id: 'DOC-03',
      name: 'Sertifikat Laik Higiene Sanitasi Dapur PMT',
      category: 'SANITASI',
      documentNumber: '503/412/DINKES-SAN/2026',
      issueDate: '10 Februari 2026',
      expiryDate: '10 Februari 2027',
      daysRemaining: 179,
      status: 'VALID',
      fileSize: '1.8 MB (PDF)',
      sha256Hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
      issuingAuthority: 'Dinas Kesehatan Daerah'
    },
    {
      id: 'DOC-04',
      name: 'SK Pengesahan Badan Hukum Yayasan Kemenkumham',
      category: 'KEMENKUMHAM',
      documentNumber: 'AHU-0012489.AH.01.04.Tahun 2021',
      issueDate: '20 Agustus 2021',
      expiryDate: 'Seumur Hidup (Permanen)',
      daysRemaining: 9999,
      status: 'VALID',
      fileSize: '4.5 MB (PDF)',
      sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      issuingAuthority: 'Kemenkumham RI'
    }
  ]);

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Digital Compliance Archive</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold font-mono">
                Legal & Governance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat kepatuhan & arsip legalitas madrasah: sertifikat akreditasi BAN-PDM, izin operasional, sanitasi, pemantauan masa berlaku, dan backup SHA-256.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor SK / izin..."
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 outline-none w-48"
            />
          </div>
          <select
            aria-label="Filter Kategori Dokumen"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Dokumen ({documents.length})</option>
            <option value="LEGALITAS">Izin Operasional</option>
            <option value="AKREDITASI">Akreditasi</option>
            <option value="SANITASI">Sanitasi & PMT</option>
            <option value="KEMENKUMHAM">Kemenkumham</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Status Kepatuhan Hukum</span>
          <div className="text-2xl font-black text-emerald-600">100% Valid</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Semua Dokumen Aktif
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Total Arsip Legalitas</span>
          <div className="text-2xl font-black text-slate-800">{documents.length} Sertifikat</div>
          <span className="text-[10px] text-slate-500 font-medium">Tersimpan dalam Smart Vault</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Jatuh Tempo Terdekat</span>
          <div className="text-2xl font-black text-amber-600">179 Hari</div>
          <span className="text-[10px] text-slate-500 font-medium">Uji Sanitasi Dinkes 2027</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Integritas Hash SHA-256</span>
          <div className="text-2xl font-black text-teal-600">Verified</div>
          <span className="text-[10px] text-slate-500 font-medium">Immutability Guaranteed</span>
        </div>
      </div>

      {/* Dokumen Table / Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-700">Daftar Dokumen Kepatuhan & Sertifikat Resmi</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono text-[10px] font-bold">
                    {doc.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 mt-1">{doc.name}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  {doc.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Dokumen:</span>
                  <span className="font-mono text-slate-700 font-semibold">{doc.documentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penerbit:</span>
                  <span className="text-slate-700">{doc.issuingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Masa Berlaku:</span>
                  <span className="text-slate-700 font-medium">{doc.expiryDate}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-teal-600" /> Hash: {doc.sha256Hash.slice(0, 10)}...
                </span>

                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3 h-3" /> Pratinjau
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview Dokumen */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono text-[10px] font-bold">
                  {previewDoc.category}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-1">{previewDoc.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Registrasi:</span>
                <span className="font-mono font-bold text-slate-700">{previewDoc.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lembaga Penerbit:</span>
                <span className="text-slate-700">{previewDoc.issuingAuthority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Terbit:</span>
                <span className="text-slate-700">{previewDoc.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jatuh Tempo:</span>
                <span className="text-slate-700 font-semibold">{previewDoc.expiryDate}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                <span className="text-slate-400">Ukuran Berkas:</span>
                <span className="font-mono text-slate-600">{previewDoc.fileSize}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
