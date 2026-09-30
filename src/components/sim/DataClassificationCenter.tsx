import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Tag, 
  Lock, 
  Eye, 
  FileText, 
  Building, 
  Users, 
  Sparkles, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  KeyRound,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

export type ClassificationTier = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'FOUNDER_ONLY';

export interface ClassifiedDataItem {
  id: string;
  dataName: string;
  category: 'Akademik' | 'Keuangan' | 'Legal Yayasan' | 'Kepegawaian' | 'Sistem & Kunci' | 'Publikasi';
  tier: ClassificationTier;
  targetEntities: string[];
  accessRestrictions: string;
  encryptionStandard: string;
  dataOwner: string;
  exampleData: string;
  retentionTag: string;
  lastAudited: string;
}

export const DataClassificationCenter: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [classifiedRecords, setClassifiedRecords] = useState<ClassifiedDataItem[]>([
    {
      id: 'CLS-001',
      dataName: 'Buku Raport Sentra & Portofolio Santri',
      category: 'Akademik',
      tier: 'CONFIDENTIAL',
      targetEntities: ['Wali Murid Terkait', 'Guru Sentra', 'Kepala Sekolah'],
      accessRestrictions: 'Hanya dapat diakses wali murid terautentikasi dan pendidik berizin.',
      encryptionStandard: 'AES-256-GCM + Client-Side Decryption',
      dataOwner: 'Waka Kurikulum & Guru Sentra',
      exampleData: 'Nilai capaian, evaluasi psikomotorik, catatan anekdot, foto karya santri.',
      retentionTag: '100 Tahun (Time Capsule)',
      lastAudited: '15 Agustus 2026'
    },
    {
      id: 'CLS-002',
      dataName: 'SK Pengangkatan & Akta Pendirian Yayasan',
      category: 'Legal Yayasan',
      tier: 'RESTRICTED',
      targetEntities: ['Ketua Yayasan', 'Dewan Pembina', 'Kepala Sekolah'],
      accessRestrictions: 'Akses terbatas pejabat struktural tinggi dengan quorum signing.',
      encryptionStandard: 'SHA-256 Seal + Multi-Party Signature',
      dataOwner: 'Dewan Pembina Yayasan Asy-Syifa',
      exampleData: 'SK Kemenkumham, Akta Notaris, Peraturan Internal Yayasan.',
      retentionTag: 'Permanen / Abadi (Vault)',
      lastAudited: '10 Agustus 2026'
    },
    {
      id: 'CLS-003',
      dataName: 'Galeri Kegiatan & Brosur Informasi PPDB',
      category: 'Publikasi',
      tier: 'PUBLIC',
      targetEntities: ['Masyarakat Umum', 'Calon Wali Santri', 'Media'],
      accessRestrictions: 'Terbuka bebas untuk publik tanpa login atau restriksi.',
      encryptionStandard: 'HTTPS TLS 1.3 Public Web CDN',
      dataOwner: 'Humas & Tim Publikasi Madrasah',
      exampleData: 'Foto kegiatan sentra terbuka, formulir info biaya, brosur kurikulum.',
      retentionTag: '3 Tahun (Web Lifecycle)',
      lastAudited: '12 Agustus 2026'
    },
    {
      id: 'CLS-004',
      dataName: 'Buku Besar Kas, Ledger Tabungan & Mutasi SPP',
      category: 'Keuangan',
      tier: 'CONFIDENTIAL',
      targetEntities: ['Bendahara Yayasan', 'Kepala Sekolah', 'Ketua Yayasan'],
      accessRestrictions: 'Wajib autentikasi ganda role Bendahara & Pengawas Keuangan.',
      encryptionStandard: 'AES-256 Ledger Encryption + Audit Hash Replay',
      dataOwner: 'Bendahara Sekolah',
      exampleData: 'Saldo tabungan santri, mutasi bayar SPP, invoice honor guru.',
      retentionTag: '10 Tahun (Kemenkeu Audit Standard)',
      lastAudited: '14 Agustus 2026'
    },
    {
      id: 'CLS-005',
      dataName: 'Jadwal Pembelajaran & Agenda Kalender Akademik',
      category: 'Akademik',
      tier: 'INTERNAL',
      targetEntities: ['Seluruh Ustadz/Ustadzah', 'Staff Tata Usaha', 'Siswa & Wali'],
      accessRestrictions: 'Terbuka untuk civitas internal madrasah yang telah login.',
      encryptionStandard: 'Standard Token Authenticated Session',
      dataOwner: 'Staff Tata Usaha & Waka Kurikulum',
      exampleData: 'Kalender sentra, jam istirahat, jadwal piket guru, agenda rapat.',
      retentionTag: '5 Tahun (Siklus Akreditasi)',
      lastAudited: '01 Agustus 2026'
    },
    {
      id: 'CLS-006',
      dataName: 'Sovereign Root Recovery Seeds & Master Cryptographic Key',
      category: 'Sistem & Kunci',
      tier: 'FOUNDER_ONLY',
      targetEntities: ['Founder Sovereign', '2-of-3 Hardware Security Quorum'],
      accessRestrictions: 'Hanya Founder & Master Hardware Tokens; terisolasi dari database umum.',
      encryptionStandard: 'Shamir Secret Sharing (SSS) + Sovereign Air-Gap Storage',
      dataOwner: 'TADE Sovereign Founder',
      exampleData: 'Master recovery card quorum, root sovereign derivation seeds, air-gap backup keys.',
      retentionTag: 'Permanen Tanpa Batas Waktu',
      lastAudited: '15 Agustus 2026'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ClassifiedDataItem['category']>('Akademik');
  const [newTier, setNewTier] = useState<ClassificationTier>('CONFIDENTIAL');
  const [newOwner, setNewOwner] = useState('');
  const [newExample, setNewExample] = useState('');

  const getTierBadge = (tier: ClassificationTier) => {
    switch (tier) {
      case 'PUBLIC':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">PUBLIC</span>;
      case 'INTERNAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700">INTERNAL</span>;
      case 'CONFIDENTIAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">CONFIDENTIAL</span>;
      case 'RESTRICTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-700">RESTRICTED</span>;
      case 'FOUNDER_ONLY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700">FOUNDER ONLY</span>;
    }
  };

  const filteredRecords = classifiedRecords.filter(item => {
    const matchesTier = selectedTier === 'ALL' || item.tier === selectedTier;
    const matchesSearch = 
      item.dataName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exampleData.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleAddClassification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newOwner) return;

    const newItem: ClassifiedDataItem = {
      id: `CLS-${String(classifiedRecords.length + 1).padStart(3, '0')}`,
      dataName: newTitle,
      category: newCategory,
      tier: newTier,
      targetEntities: [newOwner, 'Kepala Sekolah'],
      accessRestrictions: `Akses sesuai kebijakan tingkat ${newTier}`,
      encryptionStandard: newTier === 'FOUNDER_ONLY' ? 'Sovereign SSS Protocol' : 'AES-256-GCM',
      dataOwner: newOwner,
      exampleData: newExample || 'Dokumen resmi terklasifikasi madrasah.',
      retentionTag: 'Sesuai Kebijakan Retensi R232',
      lastAudited: '15 Agustus 2026'
    };

    setClassifiedRecords([newItem, ...classifiedRecords]);
    setShowAddModal(false);
    setNewTitle('');
    setNewOwner('');
    setNewExample('');
  };

  return (
    <div id="data-classification-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R231 &bull; DATA GOVERNANCE & SECURITY
              </span>
              <span className="text-xs text-slate-400">Institutional Classification Scheme</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Tag className="w-8 h-8 text-indigo-400" />
              Data Classification Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Klasifikasi taksonomi data madrasah (<strong>PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED, FOUNDER ONLY</strong>). Menjamin isolasi data rahasia dan batasan akses sesuai tingkatan kewenangan.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md active:scale-95 shrink-0"
          >
            <Tag className="w-4 h-4" />
            Daftarkan Klasifikasi Baru
          </button>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block">PUBLIC</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {classifiedRecords.filter(r => r.tier === 'PUBLIC').length} Aset
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block">INTERNAL</span>
            <span className="text-lg font-bold text-blue-400 font-mono">
              {classifiedRecords.filter(r => r.tier === 'INTERNAL').length} Aset
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block">CONFIDENTIAL</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {classifiedRecords.filter(r => r.tier === 'CONFIDENTIAL').length} Aset
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block">RESTRICTED</span>
            <span className="text-lg font-bold text-rose-400 font-mono">
              {classifiedRecords.filter(r => r.tier === 'RESTRICTED').length} Aset
            </span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block">FOUNDER ONLY</span>
            <span className="text-lg font-bold text-purple-400 font-mono">
              {classifiedRecords.filter(r => r.tier === 'FOUNDER_ONLY').length} Air-Gap
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'FOUNDER_ONLY'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTier === tier
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tier === 'ALL' ? 'Semua Tingkat' : tier.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari jenis data, entitas, pemilik..."
            maxLength={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Classified Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {item.id}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.category}
                </span>
              </div>
              {getTierBadge(item.tier)}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                {item.dataName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                <strong>Contoh Konten:</strong> {item.exampleData}
              </p>
            </div>

            {/* Scope of Access & Security Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Penerima Hak Akses:</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {item.targetEntities.join(', ')}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Standar Enkripsi:</span>
                <div className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
                  {item.encryptionStandard}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300">
              <span className="font-bold block text-[11px]">Kebijakan Akses:</span>
              <p className="mt-0.5 leading-relaxed">{item.accessRestrictions}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
              <span>Pemilik Data: <strong className="text-slate-700 dark:text-slate-300">{item.dataOwner}</strong></span>
              <span className="font-mono">Retensi: {item.retentionTag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Classification */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                Daftarkan Klasifikasi Data Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono"
              >
                Tutup [ESC]
              </button>
            </div>

            <form onSubmit={handleAddClassification} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Nama / Jenis Dokumen:</label>
                <input
                  type="text"
                  placeholder="Contoh: Dokumen Evaluasi Kinerja Guru"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Kategori:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Legal Yayasan">Legal Yayasan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Sistem & Kunci">Sistem & Kunci</option>
                    <option value="Publikasi">Publikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Tingkat Klasifikasi:</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="FOUNDER_ONLY">FOUNDER ONLY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Pemilik Data (Data Custodian):</label>
                <input
                  type="text"
                  placeholder="Contoh: Kepala Sekolah / Tim Penjamin Mutu"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Uraian / Contoh Data:</label>
                <textarea
                  placeholder="Sebutkan ringkasan data yang dicakup..."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  Simpan Klasifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
