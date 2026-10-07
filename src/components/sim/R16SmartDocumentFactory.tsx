import React, { useState, useEffect } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentCategory, UserRole, Student, Teacher } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Archive,
  Download,
  Eye,
  Send,
  FileCode,
  Sparkles,
  Printer,
  X,
  ShieldCheck,
  RefreshCw,
  Copy,
  FolderArchive,
  GraduationCap,
  Briefcase,
  UserCheck,
  Layers,
  AlertTriangle,
  Info,
  Lock
} from 'lucide-react';

const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
];

interface FeedbackState {
  type: 'success' | 'error' | 'info';
  message: string;
}

const CATEGORIES: { key: DocumentCategory; label: string }[] = [
  { key: 'SURAT', label: 'Surat Resmi' },
  { key: 'LAPORAN', label: 'Laporan Rekap' },
  { key: 'ADMINISTRASI', label: 'Administrasi' },
  { key: 'AKADEMIK', label: 'Akademik' },
  { key: 'KEUANGAN', label: 'Keuangan' },
  { key: 'PPDB', label: 'PPDB' },
  { key: 'KEPEGAWAIAN', label: 'Kepegawaian' }
];

export const R16SmartDocumentFactory: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // In-app Feedback State (No native alerts)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Anti-double-submit guards
  const [processingDocId, setProcessingDocId] = useState<string | null>(null);
  const [isArchivingDocId, setIsArchivingDocId] = useState<string | null>(null);

  // Confirmation Modals (No native confirm)
  const [confirmApproveDoc, setConfirmApproveDoc] = useState<GeneratedDocument | null>(null);

  // Zero Double Input Master Data (Phase 4A)
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [autofillFeedback, setAutofillFeedback] = useState<string | null>(null);

  // Active Tab & Filters
  const [activeTab, setActiveTab] = useState<'templates' | 'documents' | 'approvals'>('documents');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation Modal
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [requireApproval, setRequireApproval] = useState(false);
  const [creating, setCreating] = useState(false);

  // PDF Preview Modal
  const [previewDoc, setPreviewDoc] = useState<GeneratedDocument | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pdfHtml, setPdfHtml] = useState<string>('');

  // Canonical Identity & RBAC Resolution (Fail Closed)
  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates strictly to null.
  // CRITICAL: userProfile.role NEVER overrides activeRole, and no raw fallback exists.
  const verifiedActiveRole: UserRole | null = (
    currentUser?.uid &&
    activeRole &&
    CANONICAL_ROLES.includes(activeRole)
  ) ? activeRole : null;

  // Authentic Actor Name Resolution (No synthetic actor fallback)
  const actorName =
    currentUser?.displayName ||
    userProfile?.nama ||
    userProfile?.name ||
    currentUser?.email ||
    (currentUser?.uid ? `User (${currentUser.uid.slice(0, 8)})` : 'Pengguna SIM');

  // Permissions Matrix (Strictly Gated by Verified Active Role)
  const canApprove = !!verifiedActiveRole && ['SUPER_ADMIN', 'KEPALA_SEKOLAH'].includes(verifiedActiveRole);
  const canCreate = !!verifiedActiveRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'].includes(verifiedActiveRole);
  const canArchive = !!verifiedActiveRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(verifiedActiveRole);
  const canViewMasterData = !!verifiedActiveRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'KETUA_YAYASAN'].includes(verifiedActiveRole);

  // Auto-dismiss feedback banner after 6 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Fetch templates, master data & subscribe documents (Authoritative Gate & Stale Race Guard)
  useEffect(() => {
    let isCurrent = true;

    // Hard Pre-Query Authorization Gate
    if (!currentUser?.uid || !verifiedActiveRole) {
      setTemplates([]);
      setDocuments([]);
      setStudents([]);
      setTeachers([]);
      setLoading(false);
      return;
    }

    // Role boundary gate: Parents and non-operational roles cannot query document factory
    if (['WALI_MURID', 'CALON_WALI_MURID', 'ALUMNI_FAMILY'].includes(verifiedActiveRole)) {
      setTemplates([]);
      setDocuments([]);
      setStudents([]);
      setTeachers([]);
      setLoading(false);
      return;
    }

    const loadInitData = async () => {
      setLoading(true);
      try {
        const promises: [Promise<DocumentTemplate[]>, Promise<Student[]>, Promise<Teacher[]>] = [
          DataService.getTemplates(),
          canViewMasterData ? DataService.getStudents() : Promise.resolve([]),
          canViewMasterData ? DataService.getTeachers() : Promise.resolve([])
        ];

        const [tpls, stds, tchs] = await Promise.all(promises);
        if (!isCurrent) return;

        setTemplates(tpls || []);
        setStudents(stds || []);
        setTeachers(tchs || []);
      } catch (err: any) {
        if (!isCurrent) return;
        console.warn('Error loading initial data in SmartDocumentFactory:', err);
        setFeedback({
          type: 'error',
          message: `STATUS: GAGAL → Gagal memuat data master template: ${err?.message || err}`
        });
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadInitData();

    const unsub = DataService.subscribeDocuments(verifiedActiveRole, currentUser.uid, (list) => {
      if (!isCurrent) return;
      setDocuments(list || []);
    });

    return () => {
      isCurrent = false;
      unsub();
    };
  }, [currentUser?.uid, verifiedActiveRole, canViewMasterData]);

  const matchVar = (v: string, targets: string[]) => {
    const clean = v.toLowerCase().replace(/[^a-z0-9]/g, '');
    return targets.some(t => clean === t.toLowerCase().replace(/[^a-z0-9]/g, ''));
  };

  const handleSelectTemplate = (tpl: DocumentTemplate) => {
    if (!canCreate) {
      setFeedback({
        type: 'error',
        message: `STATUS: DITOLAK → Peran ${verifiedActiveRole || 'Guest'} tidak memiliki izin membuat dokumen baru.`
      });
      return;
    }
    setSelectedTemplate(tpl);
    setDocumentTitle(tpl.name);
    setSelectedStudentId('');
    setSelectedTeacherId('');
    setAutofillFeedback(null);

    const initialForm: Record<string, string> = {};
    tpl.variables.forEach(v => {
      initialForm[v] = '';
    });

    setFormData(initialForm);
    setRequireApproval(tpl.category === 'SURAT' || tpl.category === 'KEUANGAN' || tpl.category === 'KEPEGAWAIAN');
    setShowCreateModal(true);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setSelectedTeacherId('');
    if (!studentId || !selectedTemplate) {
      setAutofillFeedback(null);
      return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updated = { ...formData };
    let filledCount = 0;

    selectedTemplate.variables.forEach(v => {
      if (matchVar(v, ['namaSiswa', 'nama', 'siswa', 'studentName', 'namaSantri'])) {
        updated[v] = student.name || student.namaLengkap || '';
        filledCount++;
      } else if (matchVar(v, ['nis', 'nomorInduk', 'nisSiswa'])) {
        updated[v] = student.nis || '';
        filledCount++;
      } else if (matchVar(v, ['nisn', 'nomorIndukSiswaNasional'])) {
        updated[v] = student.nisn || '';
        filledCount++;
      } else if (matchVar(v, ['kelas', 'kelompok', 'classGroup'])) {
        updated[v] = student.classGroup || student.kelompok || '';
        filledCount++;
      } else if (matchVar(v, ['waliMurid', 'orangTua', 'namaOrangTua', 'namaAyah', 'parentName', 'namaWali'])) {
        updated[v] = student.parentName || student.namaAyah || student.namaOrangTua || '';
        filledCount++;
      } else if (matchVar(v, ['alamat', 'alamatSiswa', 'address'])) {
        updated[v] = student.address || '';
        filledCount++;
      } else if (matchVar(v, ['tanggalLahir', 'tglLahir', 'birthDate', 'ttl'])) {
        updated[v] = student.birthDate || '';
        filledCount++;
      } else if (matchVar(v, ['noHp', 'noTelepon', 'kontak', 'parentPhone', 'telepon'])) {
        updated[v] = student.parentPhone || '';
        filledCount++;
      }
    });

    setFormData(updated);
    setAutofillFeedback(`✨ Data Siswa "${student.name}" (${student.classGroup}) berhasil di-prefill (${filledCount} field otomatis terisi). Anda tetap dapat mengubah nilainya.`);
  };

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setSelectedStudentId('');
    if (!teacherId || !selectedTemplate) {
      setAutofillFeedback(null);
      return;
    }

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const updated = { ...formData };
    let filledCount = 0;

    selectedTemplate.variables.forEach(v => {
      if (matchVar(v, ['namaGuru', 'nama', 'guru', 'penanggungJawab', 'namaStaf', 'teacherName', 'namaPendidik'])) {
        updated[v] = teacher.name;
        filledCount++;
      } else if (matchVar(v, ['nip', 'nuptk', 'nipNuptk', 'nomorIndukPegawai'])) {
        updated[v] = (teacher.nip && teacher.nip !== '-') ? teacher.nip : (teacher.nuptk || '-');
        filledCount++;
      } else if (matchVar(v, ['nuptk'])) {
        updated[v] = teacher.nuptk || '-';
        filledCount++;
      } else if (matchVar(v, ['jabatan', 'posisi', 'tugas', 'position', 'title'])) {
        updated[v] = teacher.position || teacher.title || '';
        filledCount++;
      } else if (matchVar(v, ['unitKerja', 'instansi', 'sekolah', 'lembaga'])) {
        updated[v] = 'TK ASY SYIFA';
        filledCount++;
      } else if (matchVar(v, ['kontak', 'noHp', 'phone', 'telepon'])) {
        updated[v] = teacher.phone || '';
        filledCount++;
      } else if (matchVar(v, ['email', 'surel'])) {
        updated[v] = teacher.email || '';
        filledCount++;
      }
    });

    setFormData(updated);
    setAutofillFeedback(`✨ Data Guru/Staf "${teacher.name}" (${teacher.position || teacher.title}) berhasil di-prefill (${filledCount} field otomatis terisi). Anda tetap dapat mengubah nilainya.`);
  };



  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi tidak terautentikasi atau peran tidak valid.'
      });
      return;
    }
    if (!canCreate) {
      setFeedback({
        type: 'error',
        message: `STATUS: DITOLAK → Peran ${verifiedActiveRole} tidak memiliki izin membuat dokumen baru.`
      });
      return;
    }
    if (!selectedTemplate) return;

    setCreating(true);
    try {
      const newDoc = await DataService.createDocument({
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        title: documentTitle || selectedTemplate.name,
        category: selectedTemplate.category,
        data: formData,
        ownerId: currentUser.uid,
        ownerRole: verifiedActiveRole,
        createdBy: actorName,
        requireApproval,
        approverRole: 'KEPALA_SEKOLAH'
      });

      // Auto generate PDF
      await DataService.generatePDF(
        newDoc.id,
        currentUser.uid,
        actorName,
        verifiedActiveRole
      );

      // Canonical Audit Log
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'CREATE_DOCUMENT',
        `Membuat dokumen ${newDoc.title} (${newDoc.documentNumber}) kategori ${newDoc.category}`
      ).catch(() => {});

      setShowCreateModal(false);
      setSelectedTemplate(null);
      setFormData({});
      setDocumentTitle('');
      setSelectedStudentId('');
      setSelectedTeacherId('');
      setAutofillFeedback(null);

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Dokumen '${newDoc.title}' berhasil dibuat dengan nomor resmi ${newDoc.documentNumber}.`
      });
    } catch (err: any) {
      console.error('Failed creating document', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal membuat dokumen: ${err?.message || err}. Data tidak tersimpan.`
      });
    } finally {
      setCreating(false);
    }
  };

  const handleOpenPreview = async (docItem: GeneratedDocument) => {
    if (!currentUser?.uid || !verifiedActiveRole) return;
    setPreviewDoc(docItem);
    const html = DataService.generatePDFHtml(docItem);
    setPdfHtml(html);
    setShowPreviewModal(true);
  };

  const handlePrintPDF = () => {
    if (!currentUser?.uid || !verifiedActiveRole) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleExportExcel = (docItem: GeneratedDocument) => {
    if (!currentUser?.uid || !verifiedActiveRole) return;
    const headers = ['Field', 'Nilai Parameter'];
    const rows = Object.entries(docItem.data).map(([k, v]) => [k, String(v)]);
    const dataUrl = DataService.generateExcel(
      docItem.title,
      headers,
      rows,
      currentUser.uid,
      actorName,
      verifiedActiveRole
    );

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${docItem.documentNumber.replace(/\//g, '_')}_${docItem.title}.csv`;
    a.click();
  };

  const handleApprove = async (docItem: GeneratedDocument) => {
    if (processingDocId) return;
    if (!currentUser?.uid || !verifiedActiveRole || !canApprove) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya SUPER_ADMIN dan KEPALA_SEKOLAH yang berhak menyetujui dokumen.'
      });
      return;
    }

    setProcessingDocId(docItem.id);
    try {
      await DataService.approveDocument(
        docItem.id,
        currentUser.uid,
        actorName,
        verifiedActiveRole
      );

      // Canonical Audit Log
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'APPROVE_DOCUMENT',
        `Menyetujui dokumen ${docItem.title} (${docItem.documentNumber}) dan otomatis diarsipkan ke Smart Archive`
      ).catch(() => {});

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Dokumen '${docItem.title}' disetujui dan otomatis diarsipkan ke Smart Archive.`
      });
      setConfirmApproveDoc(null);
    } catch (err: any) {
      console.error('Failed approving document', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal menyetujui dokumen: ${err?.message || err}. Status belum diubah.`
      });
    } finally {
      setProcessingDocId(null);
    }
  };

  const handleArchive = async (docItem: GeneratedDocument) => {
    if (isArchivingDocId) return;
    if (!currentUser?.uid || !verifiedActiveRole || !canArchive) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Anda tidak memiliki izin untuk mengarsipkan dokumen ini.'
      });
      return;
    }

    setIsArchivingDocId(docItem.id);
    try {
      const archiveId = await DataService.archiveDocument(
        docItem.id,
        currentUser.uid,
        actorName,
        verifiedActiveRole
      );

      // Canonical Audit Log
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        'ARCHIVE_DOCUMENT',
        `Mengarsipkan dokumen ${docItem.title} (${docItem.documentNumber}) ke Smart Archive dengan ID: ${archiveId}`
      ).catch(() => {});

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Dokumen '${docItem.title}' berhasil diarsipkan ke Smart Archive (ID: ${archiveId}).`
      });
    } catch (err: any) {
      console.error('Failed archiving document', err);
      setFeedback({
        type: 'error',
        message: `STATUS: GAGAL → Gagal mengarsipkan dokumen: ${err?.message || err}.`
      });
    } finally {
      setIsArchivingDocId(null);
    }
  };

  const filteredDocuments = documents.filter(d => {
    if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
    if (activeTab === 'approvals' && d.status !== 'pending') return false;

    if (!searchQuery.trim()) return true;

    const term = searchQuery.toLowerCase();
    const tMatch = d.title.toLowerCase().includes(term);
    const numMatch = d.documentNumber.toLowerCase().includes(term);
    const creatorMatch = d.createdBy.toLowerCase().includes(term);

    return tMatch || numMatch || creatorMatch;
  });

  const getStatusBadge = (status: GeneratedDocument['status']) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Disetujui</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 animate-pulse"><Clock className="w-3 h-3" /> Menunggu Approval</span>;
      case 'archived':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 flex items-center gap-1"><Archive className="w-3 h-3" /> Terarsip</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Ditolak</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">Draft</span>;
    }
  };

  // Fail-Closed Access Boundaries
  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Akses Ditolak — Sesi Tidak Terverifikasi</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Modul Smart Document Factory (R16) membutuhkan sesi terautentikasi dengan otoritas peran kanonik yang sah. Identitas Anda tidak valid atau belum terdaftar pada sistem keamanan SIM.
        </p>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-600">
          Status: <strong className="text-rose-600">UNAUTHENTICATED / GUEST</strong>
        </div>
        <a
          href="/sim"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Kembali ke Dashboard SIM
        </a>
      </div>
    );
  }

  if (['WALI_MURID', 'CALON_WALI_MURID', 'ALUMNI_FAMILY'].includes(verifiedActiveRole)) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Akses Dibatasi — Batas Wewenang Dokumen</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Modul Smart Document Factory (R16) dikhususkan untuk Manajemen Sekolah, Kepala Sekolah, Pendidik, dan Staf Administrasi. Peran Anda ({verifiedActiveRole}) tidak memiliki izin penerbitan dokumen resmi dan akses master data civitas sekolah.
        </p>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-600">
          Role Terdeteksi: <strong className="text-amber-700">{verifiedActiveRole}</strong>
        </div>
        <a
          href="/sim"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Kembali ke Dashboard SIM
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Smart Document Factory Engine v24.5
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Pusat Pembuatan & Otomatisasi Dokumen Sekolah
          </h1>
          <p className="text-stone-500 text-xs">
            Zero Double Input document engine: Penomoran otomatis (<code className="text-emerald-800 bg-stone-100 px-1 py-0.5 rounded">document_sequences</code>), Kop resmi, Export PDF/Excel, Approval Flow, dan Integrasi Smart Archive.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => {
              if (templates.length > 0) handleSelectTemplate(templates[0]);
            }}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Buat Dokumen Otomatis
          </button>
        )}
      </div>

      {/* In-App Feedback Banner (Non-blocking, replaces alert) */}
      {feedback && (
        <div
          id="r16-feedback-banner"
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedback.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Role Notice if User Cannot Approve */}
      {!canApprove && activeTab === 'approvals' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          Akses Terbatas: Role aktif Anda ({verifiedActiveRole || 'Belum Ditetapkan'}) dapat memantau status pengajuan, namun otorisasi persetujuan dokumen resmi dikhususkan untuk KEPALA_SEKOLAH dan SUPER_ADMIN.
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Daftar Dokumen ({documents.length})
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <FileCode className="w-4 h-4" /> Template Dokumen ({templates.length})
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Clock className="w-4 h-4" /> Status Approval ({documents.filter(d => d.status === 'pending').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-xl text-xs font-bold bg-white cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Content: Template Library */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {tpl.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-600">
                    {tpl.type}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{tpl.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2">{tpl.content}</p>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Variabel Otomatis:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {tpl.variables.map((v, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {canCreate ? (
                <button
                  onClick={() => handleSelectTemplate(tpl)}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-3"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Gunakan Template Ini
                </button>
              ) : (
                <div className="w-full py-2.5 bg-stone-100 text-stone-400 rounded-xl text-xs font-medium text-center mt-3">
                  Akses Read-Only
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Documents List or Approvals */}
      {(activeTab === 'documents' || activeTab === 'approvals') && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari dokumen berdasarkan judul, nomor surat, atau pembuat..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-stone-500 text-xs">Memuat dokumen dari Smart Document Factory...</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-12 text-center text-stone-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-semibold">Tidak ada dokumen ditemukan pada kategori ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredDocuments.map((docItem) => {
                  const isProcessingThis = processingDocId === docItem.id;
                  const isArchivingThis = isArchivingDocId === docItem.id;

                  return (
                    <div key={docItem.id} className="p-4 hover:bg-stone-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {docItem.documentNumber}
                        </span>
                        {getStatusBadge(docItem.status)}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                          {docItem.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm truncate">{docItem.title}</h3>
                      <div className="flex items-center gap-3 text-stone-400 text-xs flex-wrap">
                        <span>Pembuat: <strong className="text-stone-600">{docItem.createdBy}</strong></span>
                        <span>• Tanggal: {new Date(docItem.createdAt).toLocaleDateString('id-ID')}</span>
                        <span>• Template: {docItem.templateName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenPreview(docItem)}
                        title="Pratinjau PDF"
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> PDF
                      </button>

                      <button
                        onClick={() => handleExportExcel(docItem)}
                        title="Export Excel / CSV"
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                      </button>

                      {canApprove && docItem.status === 'pending' && (
                        <button
                          disabled={isProcessingThis || isArchivingThis}
                          onClick={() => setConfirmApproveDoc(docItem)}
                          title="Setujui Dokumen"
                          className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessingThis ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {isProcessingThis ? 'Memproses...' : 'Setujui'}
                        </button>
                      )}

                      {canArchive && docItem.status !== 'archived' && (
                        <button
                          disabled={isProcessingThis || isArchivingThis}
                          onClick={() => handleArchive(docItem)}
                          title="Arsipkan ke Smart Archive"
                          className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isArchivingThis ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FolderArchive className="w-3.5 h-3.5" />
                          )}
                          {isArchivingThis ? 'Arsip...' : 'Arsip'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    )}

      {/* Create Document Modal */}
      {showCreateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-800" /> Buat Dokumen dari Template
                </h2>
                <p className="text-stone-500 text-xs font-medium">{selectedTemplate.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Judul Dokumen Resmi</label>
                <input
                  type="text"
                  required
                  value={documentTitle}
                  onChange={e => setDocumentTitle(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* ZERO DOUBLE INPUT: Live SIM Data Selector Panel */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-800" />
                    <span className="text-xs font-bold text-emerald-950">Zero Double Input (Integrasi SIM)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                    Auto-Prefill Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Student Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700" /> Pilih Siswa dari SIM:
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={e => handleSelectStudent(e.target.value)}
                      className="w-full p-2 border border-emerald-300 rounded-xl text-xs bg-white text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="">-- Pilih Siswa (Opsional) --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.classGroup || s.kelompok || 'Siswa'} - NIS: {s.nis || '-'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Teacher / Staff Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-700" /> Pilih Guru / Staf dari SIM:
                    </label>
                    <select
                      value={selectedTeacherId}
                      onChange={e => handleSelectTeacher(e.target.value)}
                      className="w-full p-2 border border-emerald-300 rounded-xl text-xs bg-white text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="">-- Pilih Guru/Staf (Opsional) --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.position || t.title || 'Pendidik'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {autofillFeedback && (
                  <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between gap-2 shadow-2xs animate-fade-in">
                    <span className="text-[11px]">{autofillFeedback}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudentId('');
                        setSelectedTeacherId('');
                        setAutofillFeedback(null);
                      }}
                      className="text-[10px] text-stone-500 hover:text-stone-800 underline font-semibold shrink-0 cursor-pointer"
                    >
                      Reset Auto-Fill
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-emerald-800/80">
                  💡 Memilih data di atas otomatis mengisi variabel surat. Semua nilai di bawah tetap dapat disunting manual sebelum disimpan.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Parameter Variabel Dokumen</h4>
                {selectedTemplate.variables.map((varName) => (
                  <div key={varName}>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1 capitalize">
                      {varName.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`Masukkan ${varName}...`}
                      value={formData[varName] || ''}
                      onChange={e => setFormData({ ...formData, [varName]: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-xl text-xs bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <input
                  type="checkbox"
                  id="reqApp"
                  checked={requireApproval}
                  onChange={e => setRequireApproval(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-600 cursor-pointer"
                />
                <label htmlFor="reqApp" className="text-xs font-bold text-amber-900 cursor-pointer">
                  Kirim ke Kepala Sekolah untuk Persetujuan & Verifikasi (Approval Flow)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {creating ? 'Memproses...' : 'Generate Dokumen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPreviewModal && previewDoc && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold">{previewDoc.title}</h3>
                <p className="text-[11px] text-emerald-400 font-mono">Nomor: {previewDoc.documentNumber}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / Download PDF
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-stone-100 p-4 overflow-auto">
              <iframe
                srcDoc={pdfHtml}
                title="Preview PDF"
                className="w-full h-full min-h-[500px] bg-white rounded-2xl border border-stone-300 shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Document Approval (Non-blocking, replaces confirm) */}
      {confirmApproveDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Konfirmasi Persetujuan Dokumen</h3>
                  <p className="text-[11px] text-stone-500">Wewenang: Kepala Sekolah / Super Admin</p>
                </div>
              </div>
              <button
                disabled={!!processingDocId}
                onClick={() => setConfirmApproveDoc(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <p>
                Anda akan menyetujui dan mempublikasikan dokumen resmi berikut:
              </p>
              <div className="font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-stone-200">
                <p className="truncate text-xs">{confirmApproveDoc.title}</p>
                <p className="font-mono text-[11px] text-emerald-800 mt-0.5">{confirmApproveDoc.documentNumber}</p>
              </div>
              <p className="text-[11px] text-stone-500">
                Dokumen yang disetujui akan berubah status menjadi <strong className="text-emerald-800">Disetujui</strong> dan otomatis disalin ke <strong>Smart Archive</strong> untuk preservasi arsip digital sekolah.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={!!processingDocId}
                onClick={() => setConfirmApproveDoc(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!!processingDocId}
                onClick={() => handleApprove(confirmApproveDoc)}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingDocId === confirmApproveDoc.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Setujui & Publikasikan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
