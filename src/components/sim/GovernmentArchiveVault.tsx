import React, { useState } from 'react';
import {
  Archive,
  Lock,
  Search,
  CheckCircle2,
  ShieldCheck,
  HardDrive,
  FileText,
  Clock,
  Download,
  Key,
  FolderOpen
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface ArchiveDocument {
  id: string;
  docNumber: string;
  title: string;
  category: 'SURAT' | 'SK' | 'SERTIFIKAT' | 'PIAGAM' | 'RAPORT' | 'TABUNGAN' | 'BERITA_ACARA';
  retentionYears: number;
  archiveDate: string;
  expiryDate: string;
  sha256: string;
  fileSizeBytes: number;
  status: 'PERMANENT' | 'ACTIVE_RETENTION';
}

export const GovernmentArchiveVault: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const archives: ArchiveDocument[] = [
    {
      id: 'ARC-001',
      docNumber: '001/SK/YYS-ASY/2026',
      title: 'SK Pendirian & Struktur Organisasi Satuan PAUD Sentra Asy-Syifa',
      category: 'SK',
      retentionYears: 99,
      archiveDate: '2026-01-10',
      expiryDate: 'PERMANEN (SEUMUR HIDUP LEMBAGA)',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      fileSizeBytes: 2450000,
      status: 'PERMANENT'
    },
    {
      id: 'ARC-002',
      docNumber: '112/421.1/TK-ASY/VIII/2026',
      title: 'Surat Masuk Edaran Akreditasi Badan Akreditasi Nasional PAUD',
      category: 'SURAT',
      retentionYears: 10,
      archiveDate: '2026-08-01',
      expiryDate: '2036-08-01',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      fileSizeBytes: 1120000,
      status: 'ACTIVE_RETENTION'
    },
    {
      id: 'ARC-003',
      docNumber: 'PGM/2026/TK-ASY/BATCH-8',
      title: 'Bundel Piagam Kelulusan Santri Angkatan VIII TA 2025/2026',
      category: 'PIAGAM',
      retentionYears: 50,
      archiveDate: '2026-06-30',
      expiryDate: '2076-06-30',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      fileSizeBytes: 18500000,
      status: 'ACTIVE_RETENTION'
    },
    {
      id: 'ARC-004',
      docNumber: 'RPT/2026/SM1/TK-A-B',
      title: 'Laporan Capaian Pembelajaran (e-Raport) Semester 1 & 2 Sentra',
      category: 'RAPORT',
      retentionYears: 30,
      archiveDate: '2026-07-05',
      expiryDate: '2056-07-05',
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      fileSizeBytes: 9400000,
      status: 'ACTIVE_RETENTION'
    },
    {
      id: 'ARC-005',
      docNumber: 'TBG/2026/REKAP-08',
      title: 'Rekapitulasi Mutasi Buku Tabungan Qurban & Studi Wisata Santri',
      category: 'TABUNGAN',
      retentionYears: 10,
      archiveDate: '2026-08-02',
      expiryDate: '2036-08-02',
      sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
      fileSizeBytes: 3200000,
      status: 'ACTIVE_RETENTION'
    },
    {
      id: 'ARC-006',
      docNumber: 'BAST/2026/SARPRAS-02',
      title: 'Berita Acara Serah Terima Renovasi Taman Bermain & Sentra Bahan Alam',
      category: 'BERITA_ACARA',
      retentionYears: 20,
      archiveDate: '2026-07-28',
      expiryDate: '2046-07-28',
      sha256: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
      fileSizeBytes: 4100000,
      status: 'ACTIVE_RETENTION'
    }
  ];

  const filteredArchives = archives.filter(a => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.docNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownloadVault = (doc: ArchiveDocument) => {
    blackBoxRecorder.record({
      moduleCode: 'R427-ARCHIVE-VAULT',
      role: 'ADMIN',
      eventType: 'ACTION',
      details: `Archive Vault Document downloaded: ${doc.docNumber} (${doc.title}). SHA-256 verified.`,
      severity: 'INFO'
    });
  };

  return (
    <div id="government-archive-vault-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R427 &bull; GOVERNMENT ARCHIVE VAULT
              </span>
              <span className="text-xs text-slate-400 font-mono">TADE WORM Compliance &amp; Automated Retention System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Archive className="w-8 h-8 text-purple-400" />
              Gudang Arsip Statis &amp; Dinamis Pemerintahan (WORM Vault)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Penyimpanan permanen dokumen penting: Surat, SK, Sertifikat, Piagam, Raport, Tabungan, dan Berita Acara dengan retensi otomatis hingga 99 tahun.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" /> WORM WRITE-ONCE SECURED
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'SK', 'SURAT', 'PIAGAM', 'RAPORT', 'TABUNGAN', 'BERITA_ACARA'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nomor/judul arsip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
          />
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {filteredArchives.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[9px]">
                  {doc.category}
                </span>
                <span className="text-[10px] text-slate-400">Retensi: {doc.retentionYears} Thn</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                {doc.title}
              </h3>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-[10px] space-y-1">
                <div>
                  <span className="text-slate-400 block">Nomor Arsip:</span>
                  <code className="text-purple-600 dark:text-purple-400 font-bold">{doc.docNumber}</code>
                </div>
                <div>
                  <span className="text-slate-400 block">Jadwal Retensi:</span>
                  <span className="text-slate-600 dark:text-slate-300">{doc.archiveDate} s/d {doc.expiryDate}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 text-[9px] text-slate-400 break-all">
                <span className="text-purple-400 font-bold block">SHA-256:</span>
                {doc.sha256.substring(0, 36)}...
              </div>
            </div>

            <button
              onClick={() => handleDownloadVault(doc)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Dokumen Arsip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
