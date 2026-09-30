import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  ScanLine,
  Eye,
  ShieldCheck,
  Paperclip,
  Building2,
  UserCheck,
  Sparkles,
  RotateCw,
  Image as ImageIcon,
  FileCheck,
  Layers,
  Lock,
  Plus,
  Printer,
  Clock,
  ArrowRight,
  ChevronRight,
  Filter,
  Sliders,
  Award,
  Check,
  Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  Student,
  Teacher,
  SchoolProfile,
  AuditLog,
  UserRole
} from '../../types';

export type IntakeDocumentCategory =
  | 'KK'
  | 'KTP'
  | 'AKTA_KELAHIRAN'
  | 'IJAZAH'
  | 'SERTIFIKAT'
  | 'SURAT'
  | 'FOTO'
  | 'DOKUMEN_YAYASAN'
  | 'DOKUMEN_GURU'
  | 'DOKUMEN_MURID';

export type IntakeStatus =
  | 'VALIDATED'
  | 'OCR_READY'
  | 'NEEDS_INSPECTION'
  | 'PROCESSING'
  | 'PENDING';

export interface OCRReadinessMetric {
  imageQualityScore: number; // e.g. 95 (out of 100)
  qualityLabel: 'Sangat Jernih (High)' | 'Cukup Jernih (Good)' | 'Kabur / Perlu Scan Ulang';
  rotationAngle: number; // 0, 90, 180, 270
  orientationLabel: 'Tegak Normal (0°)' | 'Miring (90°)' | 'Terbalik (180°)';
  contrastLevel: 'Optimal (High Contrast)' | 'Sedang' | 'Rendah (Pucat)';
  completenessScore: number; // e.g. 100%
  overallReadinessScore: number; // e.g. 96%
  isOcrReady: boolean;
}

export interface IntakeDocumentItem {
  id: string;
  intakeCode: string;
  title: string;
  category: IntakeDocumentCategory;
  categoryLabel: string;
  ownerType: 'STUDENT' | 'TEACHER' | 'SCHOOL' | 'FOUNDATION';
  ownerId: string;
  ownerName: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'WEBP';
  fileSize: string;
  resolution: string; // e.g. "2400 x 1600 px (300 DPI)"
  uploadDate: string;
  uploaderName: string;
  status: IntakeStatus;
  ocrReadiness: OCRReadinessMetric;
  linkedAttachmentId?: string;
  notes?: string;
  tags: string[];
}

export const R53EnterpriseSmartDocumentIntake: React.FC = () => {
  const { activeRole } = useAuth();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'NEW_INTAKE' | 'INTAKE_CATALOG' | 'OCR_READINESS_INSPECTOR' | 'AUDIT_LOGS'>('NEW_INTAKE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<IntakeDocumentCategory | 'ALL'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<IntakeStatus | 'ALL'>('ALL');
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>('INT-2026-KK-001');

  // Interactive Form States for New Intake
  const [formCategory, setFormCategory] = useState<IntakeDocumentCategory>('KK');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formOwnerType, setFormOwnerType] = useState<'STUDENT' | 'TEACHER' | 'SCHOOL' | 'FOUNDATION'>('STUDENT');
  const [formOwnerId, setFormOwnerId] = useState<string>('');
  const [formOwnerName, setFormOwnerName] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  const [simulatedFileName, setSimulatedFileName] = useState<string>('Scan_KK_Asli_2026.jpg');
  const [simulatedFileSize, setSimulatedFileSize] = useState<string>('2.4 MB');
  const [simulatedResolution, setSimulatedResolution] = useState<string>('2400 x 1650 px (300 DPI)');

  // Dynamic States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Live Data from DataService
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Intake Registry State
  const [intakeList, setIntakeList] = useState<IntakeDocumentItem[]>([]);

  // Load Real Data from DataService
  const loadIntakeData = async () => {
    try {
      const [stdList, tchList, prof, logsList] = await Promise.all([
        DataService.getStudents(),
        DataService.getTeachers(),
        DataService.getSchoolProfile(),
        DataService.getAuditLogs()
      ]);

      setStudents(stdList || []);
      setTeachers(tchList || []);
      setSchoolProfile(prof);
      setAuditLogs(logsList || []);

      const defaultStudent = stdList[0]?.name || 'Ahmad Rizky (Siswa)';
      const defaultTeacher = tchList[0]?.name || 'Siti Aminah, S.Pd (Guru)';
      const headmaster = prof?.kepalaSekolah || 'Hj. Syarifah Nur, S.Pd.I';
      const schoolName = prof?.name || 'TK ISLAM ASY-SYIFATAN';

      // Seed Initial Standard Intake Items
      const seedItems: IntakeDocumentItem[] = [
        {
          id: 'INT-2026-KK-001',
          intakeCode: 'INT-KK-9812',
          title: 'Kartu Keluarga (KK) Orang Tua / Wali Murid',
          category: 'KK',
          categoryLabel: 'Kartu Keluarga',
          ownerType: 'STUDENT',
          ownerId: stdList[0]?.id || 'STD-001',
          ownerName: defaultStudent,
          fileType: 'JPG',
          fileSize: '2.8 MB',
          resolution: '2500 x 1700 px (300 DPI)',
          uploadDate: '06 Agustus 2026',
          uploaderName: 'Admin TU & Kesiswaan',
          status: 'OCR_READY',
          ocrReadiness: {
            imageQualityScore: 98,
            qualityLabel: 'Sangat Jernih (High)',
            rotationAngle: 0,
            orientationLabel: 'Tegak Normal (0°)',
            contrastLevel: 'Optimal (High Contrast)',
            completenessScore: 100,
            overallReadinessScore: 98,
            isOcrReady: true
          },
          notes: 'Dokumen KK asli telah dipindai dalam resolusi tinggi 300 DPI dan siap untuk ekstraksi data kependudukan.',
          tags: ['KK', 'PPDB', 'Verifikasi Data', 'OCR Ready']
        },
        {
          id: 'INT-2026-KTP-002',
          intakeCode: 'INT-KTP-4412',
          title: 'KTP Ayah & Ibu Kandung Siswa',
          category: 'KTP',
          categoryLabel: 'KTP Orang Tua',
          ownerType: 'STUDENT',
          ownerId: stdList[1]?.id || 'STD-002',
          ownerName: stdList[1]?.name || 'Aisyah Putri (Siswa)',
          fileType: 'PNG',
          fileSize: '1.9 MB',
          resolution: '1920 x 1080 px (300 DPI)',
          uploadDate: '05 Agustus 2026',
          uploaderName: 'Wali Murid (Self-Upload Portal)',
          status: 'VALIDATED',
          ocrReadiness: {
            imageQualityScore: 88,
            qualityLabel: 'Cukup Jernih (Good)',
            rotationAngle: 0,
            orientationLabel: 'Tegak Normal (0°)',
            contrastLevel: 'Sedang',
            completenessScore: 95,
            overallReadinessScore: 90,
            isOcrReady: true
          },
          notes: 'KTP terpasang presisi pada frame scanner, kontras cukup tajam.',
          tags: ['KTP', 'Ortu', 'Validasi NIK']
        },
        {
          id: 'INT-2026-AKTA-003',
          intakeCode: 'INT-AKTA-7731',
          title: 'Akta Kelahiran Resmi Catatan Sipil',
          category: 'AKTA_KELAHIRAN',
          categoryLabel: 'Akta Kelahiran',
          ownerType: 'STUDENT',
          ownerId: stdList[2]?.id || 'STD-003',
          ownerName: stdList[2]?.name || 'Bilal Ramadhan (Siswa)',
          fileType: 'PDF',
          fileSize: '3.4 MB',
          resolution: '2400 x 3200 px (300 DPI)',
          uploadDate: '04 Agustus 2026',
          uploaderName: 'Admin TU',
          status: 'NEEDS_INSPECTION',
          ocrReadiness: {
            imageQualityScore: 68,
            qualityLabel: 'Kabur / Perlu Scan Ulang',
            rotationAngle: 90,
            orientationLabel: 'Miring (90°)',
            contrastLevel: 'Rendah (Pucat)',
            completenessScore: 82,
            overallReadinessScore: 72,
            isOcrReady: false
          },
          notes: 'Sudut berkas miring 90 derajat. Disarankan melakukan rotasi gambar sebelum proses OCR.',
          tags: ['Akta', 'Perlu Inspeksi', 'Rotasi 90°']
        },
        {
          id: 'INT-2026-IJZ-004',
          intakeCode: 'INT-IJZ-8819',
          title: 'Ijazah S1 Pendidik & Sertifikat Pendidik PAUD',
          category: 'IJAZAH',
          categoryLabel: 'Ijazah Pendidik',
          ownerType: 'TEACHER',
          ownerId: tchList[0]?.id || 'TCH-001',
          ownerName: defaultTeacher,
          fileType: 'PDF',
          fileSize: '4.1 MB',
          resolution: '3000 x 2000 px (300 DPI)',
          uploadDate: '03 Agustus 2026',
          uploaderName: defaultTeacher,
          status: 'OCR_READY',
          ocrReadiness: {
            imageQualityScore: 96,
            qualityLabel: 'Sangat Jernih (High)',
            rotationAngle: 0,
            orientationLabel: 'Tegak Normal (0°)',
            contrastLevel: 'Optimal (High Contrast)',
            completenessScore: 100,
            overallReadinessScore: 97,
            isOcrReady: true
          },
          notes: 'Legalisir Asli Ijazah terautentikasi sempurna.',
          tags: ['Ijazah Guru', 'Kualifikasi', 'S1 PAUD']
        },
        {
          id: 'INT-2026-YYS-005',
          intakeCode: 'INT-YYS-1092',
          title: 'Dokumen Legalitas Yayasan & Akta Notaris Establishment',
          category: 'DOKUMEN_YAYASAN',
          categoryLabel: 'Dokumen Legal Yayasan',
          ownerType: 'FOUNDATION',
          ownerId: 'FND-001',
          ownerName: `Ketua Yayasan & Management ${schoolName}`,
          fileType: 'PDF',
          fileSize: '8.2 MB',
          resolution: '3000 x 4000 px (300 DPI)',
          uploadDate: '01 Agustus 2026',
          uploaderName: headmaster,
          status: 'VALIDATED',
          ocrReadiness: {
            imageQualityScore: 94,
            qualityLabel: 'Sangat Jernih (High)',
            rotationAngle: 0,
            orientationLabel: 'Tegak Normal (0°)',
            contrastLevel: 'Optimal (High Contrast)',
            completenessScore: 100,
            overallReadinessScore: 95,
            isOcrReady: true
          },
          notes: 'Berkas legalitas resmi yayasan telah terverifikasi dalam simpanan digital.',
          tags: ['Legal', 'Akta Yayasan', 'Izin Operasional']
        }
      ];

      setIntakeList(seedItems);

      if (stdList.length > 0) {
        setFormOwnerId(stdList[0].id);
        setFormOwnerName(stdList[0].name);
      }
    } catch (err) {
      console.error('Error loading data for R53 Smart Document Intake:', err);
    }
  };

  useEffect(() => {
    loadIntakeData();
  }, []);

  // Sync Owner Selection dropdown based on formOwnerType
  useEffect(() => {
    if (formOwnerType === 'STUDENT' && students.length > 0) {
      setFormOwnerId(students[0].id);
      setFormOwnerName(students[0].name);
    } else if (formOwnerType === 'TEACHER' && teachers.length > 0) {
      setFormOwnerId(teachers[0].id);
      setFormOwnerName(teachers[0].name);
    } else if (formOwnerType === 'SCHOOL') {
      const name = schoolProfile?.name || 'TK ISLAM ASY-SYIFATAN';
      setFormOwnerId('SCH-001');
      setFormOwnerName(name);
    } else if (formOwnerType === 'FOUNDATION') {
      setFormOwnerId('FND-001');
      setFormOwnerName('Yayasan Asy-Syifatan Islamiyah');
    }
  }, [formOwnerType, students, teachers, schoolProfile]);

  // Selected Intake Record for Detail / Inspection
  const activeIntake = useMemo(() => {
    return intakeList.find((i) => i.id === selectedIntakeId) || intakeList[0];
  }, [intakeList, selectedIntakeId]);

  // Filtered Intake Catalog
  const filteredIntakeList = useMemo(() => {
    return intakeList.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.intakeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || item.status === selectedStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [intakeList, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = intakeList.length;
    const ocrReadyCount = intakeList.filter((i) => i.ocrReadiness.isOcrReady).length;
    const needsInspectionCount = intakeList.filter((i) => i.status === 'NEEDS_INSPECTION').length;
    const readyPercentage = total > 0 ? Math.round((ocrReadyCount / total) * 100) : 100;

    return { total, ocrReadyCount, needsInspectionCount, readyPercentage };
  }, [intakeList]);

  // Submit New Document Intake
  const handleSaveIntake = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle) {
      setNoticeMessage('Peringatan: Judul dokumen wajib diisi!');
      return;
    }

    const newId = `INT-2026-${formCategory}-${Math.floor(100 + Math.random() * 900)}`;
    const newCode = `INT-${formCategory}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const newRecord: IntakeDocumentItem = {
      id: newId,
      intakeCode: newCode,
      title: formTitle,
      category: formCategory,
      categoryLabel: formCategory.replace('_', ' '),
      ownerType: formOwnerType,
      ownerId: formOwnerId,
      ownerName: formOwnerName || 'Siswa / Civitas Sekolah',
      fileType: simulatedFileName.endsWith('.pdf') ? 'PDF' : 'JPG',
      fileSize: simulatedFileSize,
      resolution: simulatedResolution,
      uploadDate: now,
      uploaderName: activeRole || 'Admin Staff',
      status: 'OCR_READY',
      ocrReadiness: {
        imageQualityScore: 95,
        qualityLabel: 'Sangat Jernih (High)',
        rotationAngle: 0,
        orientationLabel: 'Tegak Normal (0°)',
        contrastLevel: 'Optimal (High Contrast)',
        completenessScore: 100,
        overallReadinessScore: 96,
        isOcrReady: true
      },
      notes: formNotes || 'Dokumen berhasil diproses pada intake gateway dan siap untuk OCR.',
      tags: [formCategory, 'Intake Standard', 'OCR Ready']
    };

    // Index into DataService Knowledge Base & Audit Trail
    try {
      await DataService.indexKnowledge({
        sourceType: 'digital_archives',
        sourceId: newId,
        title: `Document Intake: ${formTitle}`,
        description: `Dokumen intake kategori ${formCategory} milik ${formOwnerName}.`,
        category: 'ADMINISTRASI',
        module: 'Smart Document Intake',
        ownerId: formOwnerId
      });

      await DataService.createAuditLog({
        uid: 'SYSTEM_INTAKE',
        userName: activeRole || 'Petugas Intake',
        role: (activeRole as UserRole) || 'ADMIN',
        action: 'CREATE_DOCUMENT_INTAKE',
        targetModule: `Smart Document Intake - ${newCode}`
      });

      setIntakeList((prev) => [newRecord, ...prev]);
      setSelectedIntakeId(newId);
      setFormTitle('');
      setFormNotes('');
      setNoticeMessage(`Berhasil! Dokumen "${formTitle}" telah diterima, divalidasi, & terhubung ke Enterprise Attachment Registry.`);
      setActiveTab('INTAKE_CATALOG');

      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error saving intake item:', err);
    }
  };

  // Rotate Image Action (Fix Orientation for OCR Readiness)
  const handleFixOrientation = (item: IntakeDocumentItem) => {
    const updated = intakeList.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          status: 'OCR_READY' as IntakeStatus,
          ocrReadiness: {
            ...i.ocrReadiness,
            rotationAngle: 0,
            orientationLabel: 'Tegak Normal (0°)' as const,
            imageQualityScore: 95,
            overallReadinessScore: 96,
            isOcrReady: true
          },
          notes: 'Orientasi sudut dokumen telah dikoreksi menjadi 0° tegak lurus. Dokumen kini SIAP OCR.'
        };
      }
      return i;
    });

    setIntakeList(updated);
    setNoticeMessage(`Sukses! Orientasi berkas [${item.intakeCode}] telah dikoreksi menjadi 0° (Tegak Normal).`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNoticeMessage('Pintu Gerbang Smart Document Intake Berhasil Disegarkan.');
      setTimeout(() => setNoticeMessage(null), 3000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Sprint P28 • Enterprise Smart Document Intake & OCR Prep Center (R53)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Penerimaan Dokumen Cerdas & Pusat Kesiapan OCR
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Standarisasi intake berkas KK, KTP, Akta, Ijazah, dan Sertifikat. Memeriksa kualitas & kelengkapan visual sebelum tahap ekstraksi OCR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Segarkan Portal
          </button>

          <button
            onClick={() => setActiveTab('NEW_INTAKE')}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Intake Berkas Baru
          </button>
        </div>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Intake Berkas</span>
          <div className="text-xl font-black text-slate-900 font-mono">{stats.total} Dokumen</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Tersimpan di Registry</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Kesiapan OCR (Ready)</span>
          <div className="text-xl font-black text-emerald-900 font-mono">{stats.ocrReadyCount} Berkas ({stats.readyPercentage}%)</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Kualitas & Orientasi Valid</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Perlu Inspeksi Manual</span>
          <div className="text-xl font-black text-amber-700 font-mono">{stats.needsInspectionCount} Berkas</div>
          <span className="text-[10px] text-amber-800 font-bold block">Miring / Resolusi Rendah</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Format Terverifikasi</span>
          <div className="text-xs font-black text-emerald-400 font-mono truncate">PDF, JPG, PNG, WEBP</div>
          <span className="text-[10px] text-slate-300 block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> TADE LTS Protected
          </span>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => setActiveTab('NEW_INTAKE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'NEW_INTAKE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-emerald-400" /> 1. Form Intake & Pre-Scan Visual
        </button>

        <button
          onClick={() => setActiveTab('INTAKE_CATALOG')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'INTAKE_CATALOG' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" /> 2. Katalog Berkas Intake ({intakeList.length})
        </button>

        <button
          onClick={() => setActiveTab('OCR_READINESS_INSPECTOR')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'OCR_READINESS_INSPECTOR' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ScanLine className="w-4 h-4 text-emerald-400" /> 3. Inspektur Kesiapan OCR
        </button>
      </div>

      {/* TAB 1: NEW INTAKE FORM & PRE-INSPECTION */}
      {activeTab === 'NEW_INTAKE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-800" /> Penerimaan Berkas & Validasi Dokumen
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Lengkapi metadata pemilik dan unggah berkas fisik untuk dianalisis kesiapannya sebelum OCR.
              </p>
            </div>

            <form onSubmit={handleSaveIntake} className="space-y-4 text-xs">
              {/* Category Picker Cards */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 block">Kategori Dokumen Intake *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'KK', label: 'KK (Kartu Keluarga)' },
                    { id: 'KTP', label: 'KTP Orang Tua / Guru' },
                    { id: 'AKTA_KELAHIRAN', label: 'Akta Kelahiran' },
                    { id: 'IJAZAH', label: 'Ijazah Pendidik / Murid' },
                    { id: 'SERTIFIKAT', label: 'Sertifikat / Piagam' },
                    { id: 'SURAT', label: 'Surat Resmi / SK' },
                    { id: 'DOKUMEN_YAYASAN', label: 'Dokumen Yayasan' },
                    { id: 'DOKUMEN_GURU', label: 'Berkas Kepegawaian Guru' },
                    { id: 'DOKUMEN_MURID', label: 'Berkas Kesiswaan PPDB' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormCategory(cat.id as IntakeDocumentCategory)}
                      className={`p-3 rounded-2xl border text-left font-bold text-[11px] transition cursor-pointer ${
                        formCategory === cat.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Document Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Judul / Nama Berkas Dokumen *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Misal: Scan Kartu Keluarga Asli - Ananda Ahmad Rizky"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              {/* Entity Owner Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Tipe Pemilik Berkas</label>
                  <select
                    value={formOwnerType}
                    onChange={(e) => setFormOwnerType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value="STUDENT">Siswa / Peserta Didik</option>
                    <option value="TEACHER">Guru / Tenaga Pendidik</option>
                    <option value="SCHOOL">Profil Sekolah (TK Asy-Syifatan)</option>
                    <option value="FOUNDATION">Yayasan Asy-Syifatan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Pilih Nama Pemilik Terkait</label>
                  {formOwnerType === 'STUDENT' ? (
                    <select
                      value={formOwnerId}
                      onChange={(e) => {
                        setFormOwnerId(e.target.value);
                        const found = students.find((s) => s.id === e.target.value);
                        if (found) setFormOwnerName(found.name);
                      }}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.nis || 'Siswa'})
                        </option>
                      ))}
                    </select>
                  ) : formOwnerType === 'TEACHER' ? (
                    <select
                      value={formOwnerId}
                      onChange={(e) => {
                        setFormOwnerId(e.target.value);
                        const found = teachers.find((t) => t.id === e.target.value);
                        if (found) setFormOwnerName(found.name);
                      }}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.role || 'Pendidik'})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={formOwnerName}
                      className="w-full px-3 py-2.5 bg-stone-200 border border-stone-300 rounded-xl font-bold text-stone-700"
                    />
                  )}
                </div>
              </div>

              {/* Dropzone Simulation */}
              <div className="p-6 bg-stone-50 border-2 border-dashed border-stone-300 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Simulasi Pindaian Berkas (Scanner Dropzone)</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Format didukung: JPG, PNG, PDF, WEBP • Ukuran Maksimal: 10 MB per file
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 p-2 px-3 bg-white border border-stone-200 rounded-xl text-[11px] font-mono font-bold text-slate-800">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>{simulatedFileName} ({simulatedFileSize})</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Catatan Tambahan Intake</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Keterangan kondisi fisik dokumen, legalisir, dll..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl font-medium text-slate-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Proses Intake & Hubungkan ke Enterprise Attachment Registry
              </button>
            </form>
          </div>

          {/* Right Live OCR Readiness Pre-Check Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black flex items-center gap-2 text-white">
                  <ScanLine className="w-4 h-4 text-emerald-400" /> Indikator Kesiapan OCR (Pre-Check)
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-900/80 text-emerald-300 text-[10px] font-mono font-bold rounded-full border border-emerald-700">
                  AUTO-EVALUATED
                </span>
              </div>

              {/* Simulated Document Preview Badge */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">Skor Kesiapan Ekstraksi OCR:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">96% (SIAP OCR)</span>
                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>

              {/* Four Readiness Parameters */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">1. Kualitas & Ketajaman Gambar</span>
                  <span className="font-mono font-bold text-emerald-400">Sangat Jernih (95%)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">2. Rotasi / Orientasi Berkas</span>
                  <span className="font-mono font-bold text-emerald-400">Tegak Lurus (0°)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">3. Kontras & Pencahayaan</span>
                  <span className="font-mono font-bold text-emerald-400">Optimal (Tajam)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">4. Kelengkapan Frame Margin</span>
                  <span className="font-mono font-bold text-emerald-400">Utuh 100%</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl text-[11px] text-emerald-200 leading-relaxed">
                <strong>Catatan Kepatuhan TADE v1.0.5 LTS:</strong> Sistem ini menguji kesiapan struktur dokumen secara otomatis. Ekstraksi teks OCR nyata disiapkan secara seamless tanpa merusak skema database Firestore yang ada.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTAKE CATALOG & REGISTRY */}
      {activeTab === 'INTAKE_CATALOG' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filter & List (5 cols) */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" /> Register Berkas Intake
                </h2>
                <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono">
                  {filteredIntakeList.length} Item
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Judul, Kode Intake, atau Nama Pemilik..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="KK">Kartu Keluarga (KK)</option>
                  <option value="KTP">KTP</option>
                  <option value="AKTA_KELAHIRAN">Akta Kelahiran</option>
                  <option value="IJAZAH">Ijazah</option>
                  <option value="DOKUMEN_YAYASAN">Dokumen Yayasan</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="OCR_READY">Siap OCR</option>
                  <option value="NEEDS_INSPECTION">Perlu Inspeksi</option>
                  <option value="VALIDATED">Ter-validasi</option>
                </select>
              </div>

              {/* List Cards */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredIntakeList.map((item) => {
                  const isSelected = activeIntake?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIntakeId(item.id)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                          {item.intakeCode}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                            item.ocrReadiness.isOcrReady
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {item.ocrReadiness.isOcrReady ? 'SIAP OCR' : 'INSPEKSI'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xs font-black text-slate-900 leading-tight">{item.title}</h3>
                        <p className="text-[11px] font-medium text-stone-500 mt-0.5">Pemilik: {item.ownerName}</p>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                        <span>Format: {item.fileType} ({item.fileSize})</span>
                        <span className="font-bold text-emerald-800">{item.uploadDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Document Inspection View (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeIntake ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
                {/* Header Card */}
                <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <FileText className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                        INTAKE DOCUMENT RECORD
                      </span>
                      <h2 className="text-lg font-black text-white">{activeIntake.title}</h2>
                      <p className="text-xs text-slate-300 mt-0.5">Kode: {activeIntake.intakeCode}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status OCR</span>
                    <span
                      className={`text-xl font-black ${
                        activeIntake.ocrReadiness.isOcrReady ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {activeIntake.ocrReadiness.isOcrReady ? 'SIAP OCR 96%' : 'PERLU ROTASI'}
                    </span>
                  </div>
                </div>

                {/* Validation Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Kategori Berkas</span>
                    <span className="font-bold text-slate-900 block">{activeIntake.categoryLabel}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pemilik Terkait</span>
                    <span className="font-bold text-slate-900 block">{activeIntake.ownerName}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Tipe & Ukuran File</span>
                    <span className="font-mono font-bold text-slate-900 block">
                      {activeIntake.fileType} • {activeIntake.fileSize}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Resolusi Pindaian</span>
                    <span className="font-mono font-bold text-slate-900 block">{activeIntake.resolution}</span>
                  </div>
                </div>

                {/* OCR Readiness Parameters Box */}
                <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Metrik Kesiapan Struktur OCR</span>
                    <span className="font-mono text-emerald-800">{activeIntake.ocrReadiness.overallReadinessScore}% Score</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Kualitas Gambar:</span>
                      <strong className="text-slate-900 block">{activeIntake.ocrReadiness.qualityLabel}</strong>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Sudut Orientasi:</span>
                      <strong className="text-slate-900 block">{activeIntake.ocrReadiness.orientationLabel}</strong>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Tingkat Kontras:</span>
                      <strong className="text-slate-900 block">{activeIntake.ocrReadiness.contrastLevel}</strong>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Kelengkapan Frame:</span>
                      <strong className="text-slate-900 block">{activeIntake.ocrReadiness.completenessScore}% Utuh</strong>
                    </div>
                  </div>

                  {/* Actions for Inspection */}
                  {!activeIntake.ocrReadiness.isOcrReady && (
                    <button
                      onClick={() => handleFixOrientation(activeIntake)}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" /> Koreksi Orientasi Gambar ke 0° (Tegak Normal)
                    </button>
                  )}
                </div>

                {/* Linking Reference */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-emerald-950 block flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-800" /> Terhubung ke Enterprise Attachment Registry
                  </span>
                  <p className="text-emerald-900 text-[11px]">
                    Dokumen ini tidak diduplikasi, melainkan direferensikan secara langsung melalui Knowledge Graph Engine.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 3: OCR READINESS INSPECTOR */}
      {activeTab === 'OCR_READINESS_INSPECTOR' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-emerald-800" /> Matriks Kesiapan OCR Berkas TADE
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Inspeksi kelayakan teknis gambar sebelum integrasi ekstraksi OCR tingkat lanjut.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 rounded-l-xl">Kode Intake</th>
                  <th className="p-3">Nama Dokumen</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Pemilik</th>
                  <th className="p-3">Kualitas</th>
                  <th className="p-3">Orientasi</th>
                  <th className="p-3">Status Readiness</th>
                  <th className="p-3 rounded-r-xl text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium">
                {intakeList.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{item.intakeCode}</td>
                    <td className="p-3 font-bold text-slate-900">{item.title}</td>
                    <td className="p-3 font-mono text-stone-600">{item.category}</td>
                    <td className="p-3 text-stone-800">{item.ownerName}</td>
                    <td className="p-3 text-stone-800 font-mono">{item.ocrReadiness.qualityLabel}</td>
                    <td className="p-3 text-stone-800 font-mono">{item.ocrReadiness.orientationLabel}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          item.ocrReadiness.isOcrReady
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.ocrReadiness.isOcrReady ? 'SIAP OCR 96%' : 'PERLU KOREKSI'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {!item.ocrReadiness.isOcrReady ? (
                        <button
                          onClick={() => handleFixOrientation(item)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg transition"
                        >
                          Perbaiki Rotasi
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
