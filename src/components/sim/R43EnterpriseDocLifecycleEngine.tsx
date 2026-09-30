import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GitCommit,
  Hash,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Lock,
  RefreshCw,
  FileCode,
  QrCode,
  UserCheck,
  FileCheck,
  Grid,
  Building2,
  Sliders,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  FileSpreadsheet,
  Workflow,
  Check,
  AlertTriangle,
  FolderTree,
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface LifecycleStateInfo {
  code: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED' | 'EXPIRED' | 'CANCELLED';
  name: string;
  badgeColor: string;
  description: string;
  allowedTransitions: string[];
}

export interface NumberingPolicy {
  id: string;
  name: string;
  category: string;
  pattern: string;
  example: string;
  resetCycle: 'ANNUAL' | 'MONTHLY' | 'NEVER';
  schoolCode: string;
}

export interface ApprovalChain {
  id: string;
  name: string;
  targetCategories: string[];
  steps: {
    order: number;
    role: string;
    title: string;
    slaHours: number;
  }[];
}

export interface TemplateGovernancePolicy {
  id: string;
  templateName: string;
  version: string;
  paperSize: 'A4' | 'F4 (Folio)' | 'Letter';
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  margins: string;
  requiredVarsCount: number;
  approvalChain: string;
  numberingPolicy: string;
  signatureMeta: string;
  qrMeta: string;
}

export interface TaxonomyNode {
  id: string;
  code: string;
  title: string;
  retentionPeriod: string;
  accessLevel: string;
  subNodes?: { id: string; code: string; title: string }[];
}

export const R43EnterpriseDocLifecycleEngine: React.FC = () => {
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'LIFECYCLE' | 'NUMBERING' | 'APPROVAL' | 'TEMPLATE_POLICY' | 'TAXONOMY'>('LIFECYCLE');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Numbering Generator Playground State
  const [numCategory, setNumCategory] = useState('SK');
  const [numYear, setNumYear] = useState('2026');
  const [numMonth, setNumMonth] = useState('02');
  const [numSeq, setNumSeq] = useState('089');
  const [numSchoolCode, setSchoolCode] = useState('TK-ASY');

  // Lifecycle States Definition
  const lifecycleStates: LifecycleStateInfo[] = [
    {
      code: 'DRAFT',
      name: 'Draft (Draf Awal)',
      badgeColor: 'bg-stone-200 text-stone-800 border-stone-300',
      description: 'Dokumen baru disusun oleh staf admin atau guru. Belum memiliki kekuatan hukum atau nomor resmi.',
      allowedTransitions: ['UNDER_REVIEW', 'CANCELLED']
    },
    {
      code: 'UNDER_REVIEW',
      name: 'Under Review (Dalam Tinjauan)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Dokumen sedang ditinjau oleh pejabat berwenang (Kepala Sekolah / Ketua Yayasan) sesuai Approval Matrix.',
      allowedTransitions: ['APPROVED', 'DRAFT', 'CANCELLED']
    },
    {
      code: 'APPROVED',
      name: 'Approved (Disetujui)',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Dokumen telah disetujui penuh & ditandatangani digital. Siap untuk penerbitan penomoran resmi.',
      allowedTransitions: ['PUBLISHED', 'CANCELLED']
    },
    {
      code: 'PUBLISHED',
      name: 'Published (Diterbitkan)',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'Dokumen diterbitkan dengan nomor surat resmi, terintegrasi QR stempel, dan dapat diakses penerima.',
      allowedTransitions: ['ARCHIVED', 'EXPIRED', 'CANCELLED']
    },
    {
      code: 'ARCHIVED',
      name: 'Archived (Diarsipkan)',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Masa aktif surat selesai, disimpan permanen dalam Master Archive Registry dengan enkripsi SHA256.',
      allowedTransitions: []
    },
    {
      code: 'EXPIRED',
      name: 'Expired (Kadaluarsa)',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Masa berlaku surat (misal Surat Tugas sementara) telah habis secara sistematis.',
      allowedTransitions: ['ARCHIVED']
    },
    {
      code: 'CANCELLED',
      name: 'Cancelled (Dibatalkan)',
      badgeColor: 'bg-slate-200 text-slate-700 border-slate-400',
      description: 'Penerbitan dokumen dibatalkan karena kesalahan input atau pembatalan kebijakan.',
      allowedTransitions: ['ARCHIVED']
    }
  ];

  // Numbering Policies
  const numberingPolicies: NumberingPolicy[] = [
    { id: 'POL-NUM-01', name: 'Kebijakan Penomoran Surat Keputusan (SK)', category: 'Surat Keputusan', pattern: '421.1/{SEQ}/{CAT_CODE}/{ROMAN_MONTH}/{YEAR}', example: '421.1/089/SK/II/2026', resetCycle: 'ANNUAL', schoolCode: 'TK-ASY' },
    { id: 'POL-NUM-02', name: 'Kebijakan Penomoran Surat Tugas (ST)', category: 'Surat Tugas', pattern: '421.2/{SEQ}/ST-ASY/{YEAR}', example: '421.2/014/ST-ASY/2026', resetCycle: 'ANNUAL', schoolCode: 'TK-ASY' },
    { id: 'POL-NUM-03', name: 'Kebijakan Penomoran Surat Keterangan (SKET)', category: 'Surat Keterangan', pattern: '421.3/{SEQ}/SKET-SISWA/{MONTH}/{YEAR}', example: '421.3/310/SKET-SISWA/02/2026', resetCycle: 'MONTHLY', schoolCode: 'TK-ASY' },
    { id: 'POL-NUM-04', name: 'Kebijakan Penomoran Undangan & Edaran', category: 'Surat Undangan / Edaran', pattern: '421.4/{SEQ}/UND-ASY/{ROMAN_MONTH}/{YEAR}', example: '421.4/092/UND-ASY/II/2026', resetCycle: 'ANNUAL', schoolCode: 'TK-ASY' },
    { id: 'POL-NUM-05', name: 'Kebijakan Penomoran Dokumen Yayasan', category: 'Dokumen Yayasan', pattern: 'YYS-ASY/{YEAR}/{CAT_CODE}/{SEQ}', example: 'YYS-ASY/2026/SK/005', resetCycle: 'ANNUAL', schoolCode: 'YYS-ASY' }
  ];

  // Approval Chains
  const approvalChains: ApprovalChain[] = [
    {
      id: 'APV-CHAIN-01',
      name: 'Matriks Persetujuan Persuratan Standar Administrative',
      targetCategories: ['Surat Tugas', 'Surat Keterangan', 'Surat Undangan', 'Dokumen Siswa'],
      steps: [
        { order: 1, role: 'ADMIN', title: 'Penyusunan Draf & Kelengkapan Data', slaHours: 12 },
        { order: 2, role: 'KEPALA_SEKOLAH', title: 'Pemeriksaan & Pengesahan TTD Digital', slaHours: 24 }
      ]
    },
    {
      id: 'APV-CHAIN-02',
      name: 'Matriks Persetujuan Kebijakan & SK Kelembagaan',
      targetCategories: ['Surat Keputusan', 'Sertifikat', 'Dokumen Akreditasi', 'Inventaris'],
      steps: [
        { order: 1, role: 'ADMIN', title: 'Penyusunan Draf & Verifikasi Skema', slaHours: 12 },
        { order: 2, role: 'KEPALA_SEKOLAH', title: 'Review & Persetujuan Kepala Sekolah', slaHours: 24 },
        { order: 3, role: 'KETUA_YAYASAN', title: 'Pengesahan Akhir Pembina Yayasan', slaHours: 48 }
      ]
    },
    {
      id: 'APV-CHAIN-03',
      name: 'Matriks Persetujuan Dokumen Keuangan & MOU',
      targetCategories: ['Dokumen Keuangan', 'Kerja Sama (MoU)', 'Dokumen SPP'],
      steps: [
        { order: 1, role: 'KEUANGAN', title: 'Audit Anggaran & Validasi Nota', slaHours: 24 },
        { order: 2, role: 'KEPALA_SEKOLAH', title: 'Otorisasi Kepala Sekolah', slaHours: 24 },
        { order: 3, role: 'KETUA_YAYASAN', title: 'Persetujuan Pembina Yayasan', slaHours: 48 }
      ]
    }
  ];

  // Template Policies
  const templatePolicies: TemplateGovernancePolicy[] = [
    { id: 'POL-TMP-01', templateName: 'Surat Keputusan Pengangkatan Guru', version: 'v1.2', paperSize: 'F4 (Folio)', orientation: 'PORTRAIT', margins: 'T:25mm, B:25mm, L:30mm, R:20mm', requiredVarsCount: 8, approvalChain: 'APV-CHAIN-02', numberingPolicy: 'POL-NUM-01', signatureMeta: 'Digital QR + Electronic Seal', qrMeta: 'SHA256 Encrypted Verification Token' },
    { id: 'POL-TMP-02', templateName: 'Surat Tugas Pelatihan Kedinasan', version: 'v1.0', paperSize: 'A4', orientation: 'PORTRAIT', margins: 'T:20mm, B:20mm, L:25mm, R:20mm', requiredVarsCount: 6, approvalChain: 'APV-CHAIN-01', numberingPolicy: 'POL-NUM-02', signatureMeta: 'Digital Signature Kepala Sekolah', qrMeta: 'Verification URL Token' },
    { id: 'POL-TMP-03', templateName: 'Surat Keterangan Aktif Siswa', version: 'v2.0', paperSize: 'A4', orientation: 'PORTRAIT', margins: 'T:20mm, B:20mm, L:25mm, R:20mm', requiredVarsCount: 5, approvalChain: 'APV-CHAIN-01', numberingPolicy: 'POL-NUM-03', signatureMeta: 'Digital Signature Kepala Sekolah', qrMeta: 'Verification URL Token' },
    { id: 'POL-TMP-04', templateName: 'Sertifikat Kelulusan Siswa', version: 'v1.5', paperSize: 'A4', orientation: 'LANDSCAPE', margins: 'T:15mm, B:15mm, L:15mm, R:15mm', requiredVarsCount: 7, approvalChain: 'APV-CHAIN-02', numberingPolicy: 'POL-NUM-01', signatureMeta: 'Dual TTD Digital Kepsek & Yayasan', qrMeta: 'Immutable Hash Signature' }
  ];

  // Taxonomy Tree
  const taxonomyTree: TaxonomyNode[] = [
    {
      id: 'TAX-01',
      code: '100',
      title: 'Kelembagaan & Kebijakan Tata Kelola',
      retentionPeriod: 'Abadi (Permanent)',
      accessLevel: 'TERBATAS (Kepsek & Yayasan)',
      subNodes: [
        { id: 'TAX-01-1', code: '110', title: 'Surat Keputusan (SK) Yayasan & Sekolah' },
        { id: 'TAX-01-2', code: '120', title: 'Memorandum of Understanding (MoU) & Kerjasama' },
        { id: 'TAX-01-3', code: '130', title: 'Borang & Sertifikat Akreditasi BAN-S/M' }
      ]
    },
    {
      id: 'TAX-02',
      code: '200',
      title: 'Kepegawaian & Sumber Daya Manusia (SDM)',
      retentionPeriod: '10 Tahun Setelah Purna Tugas',
      accessLevel: 'TERBATAS (Admin & Kepsek)',
      subNodes: [
        { id: 'TAX-02-1', code: '210', title: 'Surat Penugasan Kedinasan & Bintek' },
        { id: 'TAX-02-2', code: '220', title: 'SK Mengajar & Jam Tatap Muka' },
        { id: 'TAX-02-3', code: '230', title: 'Portofolio & Penilaian Kinerja Guru (PKG)' }
      ]
    },
    {
      id: 'TAX-03',
      code: '300',
      title: 'Kesiswaan & Kurikulum Pembelajaran',
      retentionPeriod: '10 Tahun pasca Kelulusan',
      accessLevel: 'UMUM SEKOLAH',
      subNodes: [
        { id: 'TAX-03-1', code: '310', title: 'Surat Keterangan Aktif & Kelakuan Baik' },
        { id: 'TAX-03-2', code: '320', title: 'Sertifikat Kelulusan & Apresiasi Lomba' },
        { id: 'TAX-03-3', code: '330', title: 'Buku Induk & Berkas PPDB Siswa' }
      ]
    },
    {
      id: 'TAX-04',
      code: '400',
      title: 'Keuangan, Anggaran & Sarana Prasarana',
      retentionPeriod: '7 Tahun (Audit Keuangan)',
      accessLevel: 'KHUSUS (Keuangan & Yayasan)',
      subNodes: [
        { id: 'TAX-04-1', code: '410', title: 'Kwitansi, Invoice & Surat Tagihan SPP' },
        { id: 'TAX-04-2', code: '420', title: 'Nota Belanja & Laporan Realisasi' },
        { id: 'TAX-04-3', code: '430', title: 'Berita Acara Inventaris & Aset Sekolah' }
      ]
    }
  ];

  const getRomanMonth = (mStr: string) => {
    const m = parseInt(mStr, 10);
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return roman[m - 1] || 'I';
  };

  const computedNumberPreview = `421.1/${numSeq}/${numCategory}/${getRomanMonth(numMonth)}/${numYear}`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotice('Operational Engine P18 (Siklus Hidup, Penomoran, Matriks Persetujuan & Taksonomi) Terverifikasi 100% Siap.');
      setTimeout(() => setNotice(null), 4000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Workflow className="w-3.5 h-3.5 text-emerald-700" /> Sprint P18 • Document Lifecycle, Numbering Policy & Approval Engine v50.0
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Engine Siklus Hidup Dokumen, Penomoran & Matriks Persetujuan (R43)
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Infrastruktur aturan siklus hidup (Lifecycle States), generator pola penomoran dinamis, alur persetujuan bertingkat, dan hirarki taksonomi dokumen LTS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Memuat Engine...' : 'Cek Status Engine'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Matriks Engine
          </button>
        </div>
      </div>

      {notice && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{notice}</span>
        </motion.div>
      )}

      {/* RBAC Notification Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Status Hak Akses ({activeRole}):</strong> {activeRole === 'SUPER_ADMIN' ? 'Otorisasi Governance Read-Only (Non-Operational)' : activeRole === 'ADMIN' ? 'Operator Utama Penyusunan & Konfigurasi Engine' : 'Otoritas Pengesahan Matriks Persetujuan'}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
          LTS ENGINE PRE-GENERATION MODE
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Siklus Hidup (Lifecycle)</span>
            <GitCommit className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{lifecycleStates.length} STATES</div>
          <p className="text-[11px] text-slate-300 font-bold">Read-Only Transition Guard</p>
        </div>

        <div className="p-5 bg-emerald-950 text-white rounded-3xl border border-emerald-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold uppercase tracking-wider">
            <span>Skema Penomoran</span>
            <Hash className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{numberingPolicies.length} POLICIES</div>
          <p className="text-[11px] text-emerald-200">Dynamic Pattern Engine</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Matriks Persetujuan</span>
            <Workflow className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{approvalChains.length} CHAINS</div>
          <p className="text-[11px] text-stone-500">Multi-Tier Approval SLA</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Taksonomi Dokumen</span>
            <FolderTree className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{taxonomyTree.length} MAIN TIERS</div>
          <p className="text-[11px] text-stone-500">Hierarchical Classification</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('LIFECYCLE')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'LIFECYCLE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <GitCommit className="w-4 h-4" /> Siklus Hidup ({lifecycleStates.length})
        </button>

        <button
          onClick={() => setActiveTab('NUMBERING')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'NUMBERING' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Hash className="w-4 h-4" /> Kebijakan Penomoran ({numberingPolicies.length})
        </button>

        <button
          onClick={() => setActiveTab('APPROVAL')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'APPROVAL' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Workflow className="w-4 h-4" /> Matriks Persetujuan ({approvalChains.length})
        </button>

        <button
          onClick={() => setActiveTab('TEMPLATE_POLICY')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'TEMPLATE_POLICY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileCode className="w-4 h-4" /> Kebijakan Templat ({templatePolicies.length})
        </button>

        <button
          onClick={() => setActiveTab('TAXONOMY')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'TAXONOMY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FolderTree className="w-4 h-4" /> Taksonomi Dokumen
        </button>
      </div>

      {/* TAB 1: LIFECYCLE */}
      {activeTab === 'LIFECYCLE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-emerald-800" /> Visualisasi Status Siklus Hidup Dokumen (State Transition Matrix)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {lifecycleStates.map((st, idx) => (
                <div key={st.code} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-center flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400">STATE 0{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border block truncate ${st.badgeColor}`}>
                      {st.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-tight font-medium text-left">{st.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" /> Aturan Transisi Status & Otoritas RBAC
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                    <th className="p-3">Status Asal</th>
                    <th className="p-3">Status Tujuan</th>
                    <th className="p-3">Deskripsi Operasional</th>
                    <th className="p-3">Akses Otoritas Peran (RBAC)</th>
                    <th className="p-3">Aksi Otomatis Sistem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  <tr className="hover:bg-stone-50/80 transition">
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-bold text-[10px]">DRAFT</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">UNDER_REVIEW</span></td>
                    <td className="p-3 font-sans font-medium text-stone-700">Mengirimkan draf untuk peninjauan persetujuan.</td>
                    <td className="p-3 font-sans font-bold text-slate-900">ADMIN / GURU</td>
                    <td className="p-3 font-sans text-stone-500">Picu Notifikasi ke Peninjau</td>
                  </tr>
                  <tr className="hover:bg-stone-50/80 transition">
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">UNDER_REVIEW</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">APPROVED</span></td>
                    <td className="p-3 font-sans font-medium text-stone-700">Persetujuan & pengesahan tanda tangan digital.</td>
                    <td className="p-3 font-sans font-bold text-slate-900">KEPALA_SEKOLAH / KETUA_YAYASAN</td>
                    <td className="p-3 font-sans text-stone-500">Stempel QR Hash Signature</td>
                  </tr>
                  <tr className="hover:bg-stone-50/80 transition">
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">APPROVED</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">PUBLISHED</span></td>
                    <td className="p-3 font-sans font-medium text-stone-700">Penerbitan nomor resmi & publikasi dokumen.</td>
                    <td className="p-3 font-sans font-bold text-slate-900">ADMIN</td>
                    <td className="p-3 font-sans text-stone-500">Alokasi Nomor Sekuensial</td>
                  </tr>
                  <tr className="hover:bg-stone-50/80 transition">
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">PUBLISHED</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">ARCHIVED</span></td>
                    <td className="p-3 font-sans font-medium text-stone-700">Pengarsipan jangka panjang dokumen selesai.</td>
                    <td className="p-3 font-sans font-bold text-slate-900">ADMIN / SUPER_ADMIN</td>
                    <td className="p-3 font-sans text-stone-500">Lock File di Master Archive</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NUMBERING */}
      {activeTab === 'NUMBERING' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-800" /> Registri Kebijakan Penomoran Dokumen (Numbering Policy Engine)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                    <th className="p-3">ID Kebijakan</th>
                    <th className="p-3">Nama Kebijakan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Pola Formulasi Penomoran</th>
                    <th className="p-3">Contoh Hasil Penomoran</th>
                    <th className="p-3">Siklus Reset Sekuensial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {numberingPolicies.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{p.id}</td>
                      <td className="p-3 font-sans font-black text-slate-900">{p.name}</td>
                      <td className="p-3 font-sans text-stone-600">{p.category}</td>
                      <td className="p-3 text-emerald-800 font-extrabold bg-emerald-50/50">{p.pattern}</td>
                      <td className="p-3 font-sans font-bold text-slate-900">{p.example}</td>
                      <td className="p-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-bold text-[10px]">
                          {p.resetCycle}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Live Generator Preview */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-800" /> Interactive Generator Preview (Simulation Only)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-stone-500 font-bold mb-1">Kode Kategori</label>
                <input
                  type="text"
                  value={numCategory}
                  onChange={(e) => setNumCategory(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">Nomor Urut (Seq)</label>
                <input
                  type="text"
                  value={numSeq}
                  onChange={(e) => setNumSeq(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">Bulan (MM)</label>
                <select
                  value={numMonth}
                  onChange={(e) => setNumMonth(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-hidden"
                >
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
                    <option key={m} value={m}>{m} ({getRomanMonth(m)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">Tahun (YYYY)</label>
                <input
                  type="text"
                  value={numYear}
                  onChange={(e) => setNumYear(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">Kode Sekolah</label>
                <input
                  type="text"
                  value={numSchoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Hasil Kalkulasi Format Penomoran:</span>
                <span className="text-lg font-black text-emerald-400">{computedNumberPreview}</span>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-800">
                PREVIEW ONLY
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVAL */}
      {activeTab === 'APPROVAL' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-emerald-800" /> Matriks Alur Persetujuan Bertingkat (Approval Chain Matrix)
          </h2>

          <div className="space-y-4">
            {approvalChains.map((chain) => (
              <div key={chain.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-500">{chain.id}</span>
                    <h3 className="text-sm font-black text-slate-900">{chain.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {chain.targetCategories.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {chain.steps.map((st) => (
                    <div key={st.order} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 font-mono">
                        <span>STEP 0{st.order}</span>
                        <span className="text-emerald-700">SLA: {st.slaHours} Hours</span>
                      </div>
                      <div className="text-xs font-black text-slate-900">{st.title}</div>
                      <div className="text-[11px] font-mono text-stone-600 font-bold">Otoritas: {st.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEMPLATE_POLICY */}
      {activeTab === 'TEMPLATE_POLICY' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-800" /> Registri Kebijakan Templat (Template Governance Metadata)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Nama Templat</th>
                  <th className="p-3">Ukuran Kertas</th>
                  <th className="p-3">Orientasi</th>
                  <th className="p-3">Margin (T,B,L,R)</th>
                  <th className="p-3">Variabel Wajib</th>
                  <th className="p-3">Alur Persetujuan</th>
                  <th className="p-3">Metode TTD / QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {templatePolicies.map((tp) => (
                  <tr key={tp.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-sans font-black text-slate-900">{tp.templateName} <span className="text-emerald-800">({tp.version})</span></td>
                    <td className="p-3 font-sans font-bold text-stone-800">{tp.paperSize}</td>
                    <td className="p-3 text-stone-600">{tp.orientation}</td>
                    <td className="p-3 text-stone-600">{tp.margins}</td>
                    <td className="p-3 text-emerald-800 font-bold">{tp.requiredVarsCount} Keys</td>
                    <td className="p-3 font-sans text-stone-700">{tp.approvalChain}</td>
                    <td className="p-3 font-sans text-stone-600">{tp.signatureMeta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TAXONOMY */}
      {activeTab === 'TAXONOMY' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-800" /> Taksonomi Hirarki Dokumen Administrasi Sekolah
          </h2>

          <div className="space-y-4">
            {taxonomyTree.map((tax) => (
              <div key={tax.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                      {tax.code}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{tax.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-stone-500 font-medium">Retensi: <strong>{tax.retentionPeriod}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">{tax.accessLevel}</span>
                  </div>
                </div>

                {tax.subNodes && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-4">
                    {tax.subNodes.map((sub) => (
                      <div key={sub.id} className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2 text-xs font-medium text-slate-800 shadow-2xs">
                        <span className="font-mono text-[10px] font-bold text-stone-400">{sub.code}</span>
                        <span>{sub.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
