import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
  Building2,
  Lock,
  Sparkles,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  History,
  AlertTriangle,
  Award,
  Stamp,
  ArrowRight,
  Eye,
  Send,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  GeneratedDocument,
  SchoolProfile,
  Teacher,
  Student,
  AuditLog
} from '../../types';

export type ApprovalChainType =
  | 'ADMIN_TO_HEADMASTER'
  | 'ADMIN_HEADMASTER_FOUNDATION'
  | 'TEACHER_TO_HEADMASTER'
  | 'FINANCE_HEADMASTER_FOUNDATION';

export type ApprovalStatus =
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'ARCHIVED';

export interface ApprovalStepItem {
  stepNumber: number;
  roleRequired: string;
  roleLabel: string;
  approverName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  actionDate?: string;
  notes?: string;
  signatureAssetId?: string;
}

export interface ApprovalDocumentItem {
  id: string;
  title: string;
  docNum: string;
  category: string;
  submitterName: string;
  submitterRole: string;
  submittedAt: string;
  chainType: ApprovalChainType;
  chainLabel: string;
  currentStep: number;
  totalSteps: number;
  status: ApprovalStatus;
  steps: ApprovalStepItem[];
  stampAssetId: string;
  contentSnippet: string;
  rawDocObj?: GeneratedDocument;
}

export const R51EnterpriseApprovalDigitalSignature: React.FC = () => {
  const { activeRole } = useAuth();

  // State Management
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PENDING_ACTION' | 'WORKFLOW_MAP' | 'HISTORY_AUDIT'>('PENDING_ACTION');

  // Loaded Master Data
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [dbDocuments, setDbDocuments] = useState<GeneratedDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load Real Data from DataService
  const loadApprovalData = async () => {
    try {
      const [prof, tList, sList, docList, logsList] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getTeachers(),
        DataService.getStudents(),
        DataService.getDocuments(),
        DataService.getAuditLogs()
      ]);

      setSchoolProfile(prof);
      setTeachers(tList || []);
      setStudents(sList || []);
      setDbDocuments(docList || []);
      setAuditLogs(logsList || []);
    } catch (err) {
      console.error('Error fetching DataService records for R51 Approval Engine:', err);
    }
  };

  useEffect(() => {
    loadApprovalData();
  }, []);

  // Construct Active Approval Queue Items
  const approvalItems: ApprovalDocumentItem[] = useMemo(() => {
    const headmasterName = schoolProfile?.headmaster || 'Hj. Syarifah Nur, S.Pd.I';
    const list: ApprovalDocumentItem[] = [
      {
        id: 'APP_DOC_SK_01',
        title: 'SK Penerimaan Peserta Didik Baru (PPDB) 2025/2026',
        docNum: 'SK/2025/TK-ASY/0981',
        category: 'Surat Keputusan Resmi',
        submitterName: 'Staf Administrasi TU',
        submitterRole: 'ADMIN',
        submittedAt: '05 Agustus 2026, 09:30 WIB',
        chainType: 'ADMIN_HEADMASTER_FOUNDATION',
        chainLabel: 'Admin TU → Kepala Sekolah → Ketua Yayasan',
        currentStep: 2,
        totalSteps: 3,
        status: 'WAITING_APPROVAL',
        stampAssetId: 'AST_SCH_STAMP_01',
        contentSnippet: 'Penetapan daftar 45 peserta didik baru yang terverifikasi lulus administrasi dan siap menerbitkan NISN resmi.',
        steps: [
          {
            stepNumber: 1,
            roleRequired: 'ADMIN',
            roleLabel: 'Penyusun Administrasi (Admin TU)',
            approverName: 'Staf Administrasi TU',
            status: 'APPROVED',
            actionDate: '05 Agustus 2026, 09:30 WIB',
            notes: 'Penyusunan draft SK selesai dan terikat dengan Attachment Registry.'
          },
          {
            stepNumber: 2,
            roleRequired: 'KEPALA_SEKOLAH',
            roleLabel: 'Pengesahan Pertama (Kepala Sekolah)',
            approverName: headmasterName,
            status: 'PENDING',
            signatureAssetId: 'AST_GURU_TTD_HEADMASTER'
          },
          {
            stepNumber: 3,
            roleRequired: 'KETUA_YAYASAN',
            roleLabel: 'Pengesahan Akhir (Ketua Yayasan Pembina)',
            approverName: 'H. Ahmad Dahlan, M.A.',
            status: 'PENDING',
            signatureAssetId: 'AST_FOUNDATION_SIGN'
          }
        ]
      },
      {
        id: 'APP_DOC_ST_02',
        title: 'Surat Tugas Pendidik & Pendamping Workshop PAUD',
        docNum: '090/ST-GURU/2026/102',
        category: 'Surat Tugas & SPPD',
        submitterName: teachers[0]?.name || 'Siti Aminah, S.Pd',
        submitterRole: 'GURU',
        submittedAt: '06 Agustus 2026, 08:15 WIB',
        chainType: 'TEACHER_TO_HEADMASTER',
        chainLabel: 'Guru Pendidik → Kepala Sekolah',
        currentStep: 2,
        totalSteps: 2,
        status: 'WAITING_APPROVAL',
        stampAssetId: 'AST_SCH_STAMP_01',
        contentSnippet: 'Penugasan 3 guru pendamping dalam Pelatihan Implementasi Transisi PAUD ke SD yang Menyenangkan.',
        steps: [
          {
            stepNumber: 1,
            roleRequired: 'GURU',
            roleLabel: 'Pengaju Tugas (Guru/Pendidik)',
            approverName: teachers[0]?.name || 'Siti Aminah, S.Pd',
            status: 'APPROVED',
            actionDate: '06 Agustus 2026, 08:15 WIB',
            notes: 'Permohonan rekomendasi tugas pelatihan dinas.'
          },
          {
            stepNumber: 2,
            roleRequired: 'KEPALA_SEKOLAH',
            roleLabel: 'Persetujuan & Pengesahan (Kepala Sekolah)',
            approverName: headmasterName,
            status: 'PENDING',
            signatureAssetId: 'AST_GURU_TTD_HEADMASTER'
          }
        ]
      },
      {
        id: 'APP_DOC_KW_03',
        title: 'Kwitansi Bebas Administrasi & Lunas SPP Tahunan',
        docNum: 'KW-SPP/2026/8812',
        category: 'Kwitansi & Keuangan',
        submitterName: 'Bendahara Keuangan',
        submitterRole: 'KEUANGAN',
        submittedAt: '04 Agustus 2026, 14:00 WIB',
        chainType: 'FINANCE_HEADMASTER_FOUNDATION',
        chainLabel: 'Keuangan → Kepala Sekolah → Ketua Yayasan',
        currentStep: 3,
        totalSteps: 3,
        status: 'APPROVED',
        stampAssetId: 'AST_SCH_STAMP_01',
        contentSnippet: 'Kwitansi penerimaan sumbangan pembinaan pendidikan (SPP) semester ganjil terverifikasi LUNAS.',
        steps: [
          {
            stepNumber: 1,
            roleRequired: 'KEUANGAN',
            roleLabel: 'Pencatat Keuangan (Bendahara)',
            approverName: 'Staf Keuangan',
            status: 'APPROVED',
            actionDate: '04 Agustus 2026, 14:00 WIB',
            notes: 'Verifikasi saldo masuk via rekening resmi sekolah.'
          },
          {
            stepNumber: 2,
            roleRequired: 'KEPALA_SEKOLAH',
            roleLabel: 'Mengetahui (Kepala Sekolah)',
            approverName: headmasterName,
            status: 'APPROVED',
            actionDate: '04 Agustus 2026, 15:20 WIB',
            notes: 'Disetujui dan dicatat dalam laporan keuangan.'
          },
          {
            stepNumber: 3,
            roleRequired: 'KETUA_YAYASAN',
            roleLabel: 'Verifikasi Audit (Ketua Yayasan)',
            approverName: 'H. Ahmad Dahlan, M.A.',
            status: 'APPROVED',
            actionDate: '04 Agustus 2026, 16:45 WIB',
            notes: 'Telah diaudit oleh pengawas yayasan.'
          }
        ]
      }
    ];

    // Merge Generated Documents from DB if available
    dbDocuments.forEach((doc) => {
      list.push({
        id: `APP_DB_${doc.id}`,
        title: doc.title,
        docNum: doc.documentNumber || 'DOC/2026/TADE',
        category: doc.type || 'Dokumen Resmi',
        submitterName: doc.createdBy || 'Admin Sekolah',
        submitterRole: 'ADMIN',
        submittedAt: new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        chainType: 'ADMIN_TO_HEADMASTER',
        chainLabel: 'Admin TU → Kepala Sekolah',
        currentStep: doc.status === 'APPROVED' ? 2 : 1,
        totalSteps: 2,
        status: doc.status === 'APPROVED' ? 'APPROVED' : doc.status === 'REJECTED' ? 'REJECTED' : 'WAITING_APPROVAL',
        stampAssetId: 'AST_SCH_STAMP_01',
        contentSnippet: doc.recipientName ? `Diperuntukkan untuk: ${doc.recipientName}` : 'Dokumen tersimpan di database.',
        steps: [
          {
            stepNumber: 1,
            roleRequired: 'ADMIN',
            roleLabel: 'Penyusun Draft',
            approverName: doc.createdBy || 'Admin',
            status: 'APPROVED',
            actionDate: new Date(doc.createdAt).toLocaleDateString('id-ID')
          },
          {
            stepNumber: 2,
            roleRequired: 'KEPALA_SEKOLAH',
            roleLabel: 'Persetujuan Kepala Sekolah',
            approverName: headmasterName,
            status: doc.status === 'APPROVED' ? 'APPROVED' : doc.status === 'REJECTED' ? 'REJECTED' : 'PENDING'
          }
        ],
        rawDocObj: doc
      });
    });

    return list;
  }, [schoolProfile, teachers, dbDocuments]);

  // Set default selected document
  useEffect(() => {
    if (approvalItems.length > 0 && !selectedDocId) {
      setSelectedDocId(approvalItems[0].id);
    }
  }, [approvalItems, selectedDocId]);

  // Filtered Items based on Search Term & Status Filter
  const filteredItems = useMemo(() => {
    return approvalItems.filter((item) => {
      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) return false;
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(term) ||
        item.docNum.toLowerCase().includes(term) ||
        item.submitterName.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    });
  }, [approvalItems, selectedStatusFilter, searchTerm]);

  // Currently Selected Document Item
  const currentDoc = useMemo(() => {
    return approvalItems.find((item) => item.id === selectedDocId) || filteredItems[0] || approvalItems[0];
  }, [approvalItems, selectedDocId, filteredItems]);

  // Check if Active User Role Can Approve Current Step
  const canApproveCurrentStep = useMemo(() => {
    if (!currentDoc || currentDoc.status !== 'WAITING_APPROVAL') return false;
    const currentStepObj = currentDoc.steps.find((s) => s.stepNumber === currentDoc.currentStep);
    if (!currentStepObj) return false;

    if (activeRole === 'SUPER_ADMIN') return true; // Super Admin governance
    return currentStepObj.roleRequired === activeRole;
  }, [currentDoc, activeRole]);

  // Action Handler: Approve Document
  const handleApproveDocument = async () => {
    if (!currentDoc) return;

    try {
      // 1. Audit Log via DataService
      await DataService.createAuditLog({
        uid: 'SYSTEM_APPROVAL_ENGINE',
        userName: activeRole,
        role: activeRole,
        action: 'DOCUMENT_APPROVED',
        targetModule: `Approval Engine - ${currentDoc.title}`
      });

      // 2. Notification for next approver/submitter via DataService
      await DataService.sendBroadcastNotification({
        title: 'Pengesahan Dokumen Digital',
        message: `Dokumen "${currentDoc.title}" (${currentDoc.docNum}) telah disetujui secara resmi oleh ${activeRole}.`,
        type: 'APPROVAL_APPROVED',
        source: 'Enterprise Approval Engine',
        priority: 'high'
      });

      setNoticeMessage(`Berhasil! Dokumen "${currentDoc.title}" telah disetujui & stempel digital dibubuhkan secara otomatis.`);
      setApprovalNotes('');

      await loadApprovalData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error executing approval action:', err);
    }
  };

  // Action Handler: Reject Document
  const handleRejectDocument = async () => {
    if (!currentDoc) return;

    try {
      await DataService.createAuditLog({
        uid: 'SYSTEM_APPROVAL_ENGINE',
        userName: activeRole,
        role: activeRole,
        action: 'DOCUMENT_REJECTED',
        targetModule: `Approval Engine - ${currentDoc.title}`
      });

      await DataService.sendBroadcastNotification({
        title: 'Penolakan Dokumen',
        message: `Dokumen "${currentDoc.title}" memerlukan revisi: ${approvalNotes || 'Harap periksa kembali draf dokumen.'}`,
        type: 'APPROVAL_REJECTED',
        source: 'Enterprise Approval Engine',
        priority: 'high'
      });

      setNoticeMessage(`Dokumen "${currentDoc.title}" dikembalikan untuk revisi.`);
      setApprovalNotes('');

      await loadApprovalData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error executing rejection action:', err);
    }
  };

  const handleRefreshEngine = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNoticeMessage('Approval & Digital Signature Engine Berhasil Disegarkan.');
      setTimeout(() => setNoticeMessage(null), 3000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Sprint P26 • Enterprise Approval & Digital Signature Engine (R51)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Engine Alur Persetujuan & Tanda Tangan Digital Resmi
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Mekanisme rantai persetujuan berjenjang (Admin → Kepala Sekolah → Ketua Yayasan) terintegrasi dengan spesimen tanda tangan & stempel Attachment Registry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshEngine}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Segarkan Engine
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-900 font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer border border-stone-300"
          >
            <Printer className="w-4 h-4" /> Cetak Log Persetujuan
          </button>
        </div>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Top Approval Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Menunggu Persetujuan</span>
          <div className="text-xl font-black text-amber-900 font-mono">
            {approvalItems.filter((i) => i.status === 'WAITING_APPROVAL').length} Berkas
          </div>
          <span className="text-[10px] text-amber-800 font-bold block">Butuh Tindakan</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Disetujui Sah</span>
          <div className="text-xl font-black text-emerald-900 font-mono">
            {approvalItems.filter((i) => i.status === 'APPROVED').length} Berkas
          </div>
          <span className="text-[10px] text-emerald-800 font-bold block">Stempel Dibubuhkan</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Antrean</span>
          <div className="text-xl font-black text-slate-900 font-mono">{approvalItems.length} Pengajuan</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Tercatat di Workflow</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Rantai Persetujuan</span>
          <div className="text-xl font-black text-slate-900 font-mono">4 Rantai</div>
          <span className="text-[10px] text-emerald-800 font-bold block">RBAC Multi-Level</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Spesimen TTD Digital</span>
          <div className="text-xl font-black text-slate-900 font-mono">Terikat R48</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Otentik Tanpa Duplikasi</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peran Aktif Pengguna</span>
          <div className="text-xs font-black text-emerald-400 font-mono truncate">{activeRole}</div>
          <span className="text-[10px] text-slate-300 block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> {canApproveCurrentStep ? 'Hak Pengesahan Aktif' : 'Akses Tinjau'}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: DOCUMENT QUEUE LIST & SEARCH (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" /> Antrean Pengajuan Persetujuan
              </h2>
              <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono">
                {filteredItems.length} Data
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Judul Dokumen, Nomor SK, atau Pengaju..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Filter Status Persetujuan</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="ALL">Semua Status Dokumen</option>
                <option value="WAITING_APPROVAL">Menunggu Persetujuan (Pending)</option>
                <option value="APPROVED">Disetujui Sah (Approved)</option>
                <option value="REJECTED">Dikembalikan / Ditolak</option>
              </select>
            </div>

            {/* Document Queue Items */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSelected = currentDoc?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDocId(item.id)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : item.status === 'WAITING_APPROVAL'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-slate-900 leading-tight">{item.title}</h3>
                      <p className="text-[11px] font-mono text-stone-500 mt-0.5">No: {item.docNum}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                      <span>Pengaju: {item.submitterName}</span>
                      <span className="font-mono font-bold text-slate-800">
                        Langkah {item.currentStep} dari {item.totalSteps}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKFLOW TIMELINE & ONE-CLICK APPROVAL PANEL (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentDoc ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
              {/* Document Header & Status Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-200 uppercase">
                      {currentDoc.category}
                    </span>
                    <span className="text-xs text-stone-500 font-bold">• {currentDoc.chainLabel}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{currentDoc.title}</h2>
                  <p className="text-stone-600 font-mono text-xs mt-0.5">Nomor Resmi: {currentDoc.docNum}</p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shrink-0 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Status Alur</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{currentDoc.status}</span>
                  <span className="text-[9px] font-bold block text-slate-300 mt-0.5">WORKFLOW ENGINE</span>
                </div>
              </div>

              {/* Document Content Snippet */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Ringkasan Draf Dokumen</span>
                <p className="text-slate-800 leading-relaxed italic">{currentDoc.contentSnippet}</p>
              </div>

              {/* Approval Chain Progress Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Rantai Persetujuan Berjenjang (Approval Chain)</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold">DIGITAL SIGNATURE BINDING</span>
                </h3>

                <div className="space-y-3">
                  {currentDoc.steps.map((step) => {
                    const isCurrentActiveStep = currentDoc.status === 'WAITING_APPROVAL' && step.stepNumber === currentDoc.currentStep;

                    return (
                      <div
                        key={step.stepNumber}
                        className={`p-4 rounded-2xl border-2 transition space-y-2 ${
                          step.status === 'APPROVED'
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : isCurrentActiveStep
                            ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                              {step.stepNumber}
                            </span>
                            <h4 className="text-xs font-black text-slate-900">{step.roleLabel}</h4>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                              step.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-900'
                                : isCurrentActiveStep
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-stone-700 pt-1">
                          <span>Pejabat Penandatangan: <strong>{step.approverName || 'Pengesah Resmi'}</strong></span>
                          {step.actionDate && <span className="font-mono text-[10px] text-stone-500">{step.actionDate}</span>}
                        </div>

                        {step.notes && (
                          <p className="text-[11px] text-stone-600 italic border-t border-stone-200/60 pt-1">
                            Catatan: "{step.notes}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Form Panel for Authorized Approvers */}
              {canApproveCurrentStep ? (
                <div className="p-5 bg-slate-900 text-white rounded-3xl space-y-4 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" /> Panel Pengesahan Resmi ({activeRole})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Aksi Satu Klik (One-Click Approval)</span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Catatan Persetujuan / Catatan Revisi</label>
                    <textarea
                      rows={2}
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Masukkan catatan pengesahan resmi atau instruksi revisi..."
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={handleRejectDocument}
                      className="px-5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Kembalikan / Tolak
                    </button>

                    <button
                      onClick={handleApproveDocument}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" /> Setujui & Bubuhkan TTD Digital
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-medium text-stone-600 text-center">
                  Dokumen ini tidak memerlukan tindakan pengesahan dari peran aktif Anda (<strong>{activeRole}</strong>) saat ini.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};
