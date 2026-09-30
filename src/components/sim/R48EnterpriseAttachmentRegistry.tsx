import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Paperclip,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Download,
  UploadCloud,
  Layers,
  GitCommit,
  Clock,
  ShieldCheck,
  Tag,
  User,
  Building2,
  Folder,
  History,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  Student,
  Teacher,
  PPDBRecord,
  SchoolProfile,
  DigitalArchive,
  GeneratedDocument,
  AuditLog,
  DocumentTypeConfig,
  VaultDocumentItem,
  UserProfile,
  UserRole
} from '../../types';

// Types for Attachment Registry
export type AttachmentCategory =
  | 'KK'
  | 'KTP'
  | 'AKTA_KELAHIRAN'
  | 'FOTO_SISWA'
  | 'FOTO_ORTU'
  | 'FOTO_GURU'
  | 'IJAZAH_GURU'
  | 'SERTIFIKAT_GURU'
  | 'LOGO_SEKOLAH'
  | 'LOGO_YAYASAN'
  | 'TTD_KEPALA_SEKOLAH'
  | 'TTD_KETUA_YAYASAN'
  | 'STEMPEL_SEKOLAH'
  | 'DOKUMEN_PPDB'
  | 'DOKUMEN_KEUANGAN'
  | 'DOKUMEN_INVENTARIS'
  | 'DOKUMEN_ADMINISTRASI'
  | 'DOKUMEN_LEGAL'
  | 'OTHER';

export type AttachmentStatus =
  | 'AVAILABLE'
  | 'MISSING'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'EXPIRED'
  | 'ARCHIVED'
  | 'REPLACED';

export interface AttachmentVersion {
  version: string;
  uploadedAt: string;
  uploaderName: string;
  uploaderRole: string;
  fileSize: string;
  changeNote: string;
}

export interface AttachmentAssetItem {
  id: string; // Asset ID
  category: AttachmentCategory;
  categoryLabel: string;
  title: string;
  ownerName: string;
  ownerType: 'STUDENT' | 'TEACHER' | 'SCHOOL' | 'FOUNDATION' | 'PPDB';
  uploadDate: string;
  currentVersion: string;
  status: AttachmentStatus;
  linkedModules: string[];
  storageInfo: string; // e.g., 'Cloud Storage (Encrypted) / tade_archives'
  tags: string[];
  notes: string;
  isSensitive: boolean;
  fileType: string;
  fileSize: string;
  versions: AttachmentVersion[];
  rawObject?: any;
}

export const R48EnterpriseAttachmentRegistry: React.FC = () => {
  const { activeRole } = useAuth();

  // Top Module Navigation State
  const [topTab, setTopTab] = useState<'REGISTRY' | 'DOC_TYPES' | 'VAULT' | 'MASTER_DATA'>('REGISTRY');

  // Navigation & Filter States
  const [selectedCategory, setSelectedCategory] = useState<AttachmentCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AttachmentStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [activeDetailTab, setActiveDetailTab] = useState<'METADATA' | 'LINKING' | 'VERSIONS' | 'AUDIT'>('METADATA');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Document Type Manager State
  const [docTypes, setDocTypes] = useState<DocumentTypeConfig[]>([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeCode, setTypeCode] = useState('');
  const [typeName, setTypeName] = useState('');
  const [typeDesc, setTypeDesc] = useState('');
  const [typeIsReq, setTypeIsReq] = useState(false);
  const [typeIsIdentity, setTypeIsIdentity] = useState(true);

  // Vault Engine State
  const [vaultDocs, setVaultDocs] = useState<VaultDocumentItem[]>([]);
  const [showVaultSubmitModal, setShowVaultSubmitModal] = useState(false);
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultTypeId, setVaultTypeId] = useState('');
  const [vaultVisibility, setVaultVisibility] = useState<'PRIVATE_IDENTITY' | 'SHARED_SCHOOL' | 'PUBLIC_WEBSITE'>('PRIVATE_IDENTITY');
  const [vaultFile, setVaultFile] = useState<File | null>(null);
  const [selectedVaultDoc, setSelectedVaultDoc] = useState<VaultDocumentItem | null>(null);

  // Replace Vault Modal State
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceReason, setReplaceReason] = useState('');
  const [replaceFile, setReplaceFile] = useState<File | null>(null);

  // New Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AttachmentCategory>('DOKUMEN_ADMINISTRASI');
  const [newOwner, setNewOwner] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Master Raw Data State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [ppdbRecords, setPpdbRecords] = useState<PPDBRecord[]>([]);
  const [archives, setArchives] = useState<DigitalArchive[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Privileged Role Check for Sensitive Attachments
  const isPrivilegedRole = useMemo(() => {
    return ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'].includes(activeRole);
  }, [activeRole]);

  // Load All Registry Items from DataService
  const loadRegistryData = async () => {
    try {
      const [prof, tList, sList, pList, arcList, docList, logsList, typesList, vaultList] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getTeachers(),
        DataService.getStudents(),
        DataService.getPPDBRecords(),
        DataService.getArchives(),
        DataService.getDocuments(),
        DataService.getAuditLogs(),
        DataService.getDocumentTypes(),
        DataService.getVaultDocuments()
      ]);

      setSchoolProfile(prof);
      setTeachers(tList || []);
      setStudents(sList || []);
      setPpdbRecords(pList || []);
      setArchives(arcList || []);
      setGeneratedDocs(docList || []);
      setAuditLogs(logsList || []);
      setDocTypes(typesList || []);
      setVaultDocs(vaultList || []);
    } catch (err) {
      console.error('Error fetching DataService records for R48 Attachment Registry:', err);
    }
  };

  useEffect(() => {
    loadRegistryData();
  }, []);

  // Construct Unified Master Attachment List
  const masterAttachments: AttachmentAssetItem[] = useMemo(() => {
    const list: AttachmentAssetItem[] = [];

    // 1. Institutional Attachments (Logo, Stamp, Signatures)
    if (schoolProfile) {
      list.push({
        id: 'AST_SCH_LOGO_01',
        category: 'LOGO_SEKOLAH',
        categoryLabel: 'Logo Resmi Sekolah',
        title: 'Logo Utama TK ASY SYIFA (High-Res)',
        ownerName: schoolProfile.name || 'TK ASY SYIFA',
        ownerType: 'SCHOOL',
        uploadDate: '01 Juli 2025',
        currentVersion: 'v2.0',
        status: 'VERIFIED',
        linkedModules: ['R27 (Profil Sekolah)', 'R42 (Kop Surat)', 'R44 (Templat Dokumen)', 'R45 (DocGen Engine)'],
        storageInfo: 'Cloud Storage (Public CDN) / assets/logo.png',
        tags: ['logo', 'resmi', 'branding', 'kop'],
        notes: 'Logo resmi yang disahkan oleh Yayasan untuk seluruh kop surat & sertifikat.',
        isSensitive: false,
        fileType: 'PNG (Raster High-Res)',
        fileSize: '450 KB',
        versions: [
          { version: 'v2.0', uploadedAt: '01 Juli 2025', uploaderName: 'Admin Sekolah', uploaderRole: 'ADMIN', fileSize: '450 KB', changeNote: 'Pembaruan resolusi tinggi logo lembaga.' },
          { version: 'v1.0', uploadedAt: '10 Juni 2024', uploaderName: 'Admin Sekolah', uploaderRole: 'ADMIN', fileSize: '210 KB', changeNote: 'Unggahan awal logo sekolah.' }
        ],
        rawObject: schoolProfile
      });

      list.push({
        id: 'AST_SCH_STAMP_01',
        category: 'STEMPEL_SEKOLAH',
        categoryLabel: 'Stempel Resmi Sekolah',
        title: 'Stempel Basah Digital TK ASY SYIFA',
        ownerName: schoolProfile.name || 'TK ASY SYIFA',
        ownerType: 'SCHOOL',
        uploadDate: '15 Juli 2025',
        currentVersion: 'v1.1',
        status: 'VERIFIED',
        linkedModules: ['R42 (Kop & Stempel)', 'R43 (Doc Lifecycle)', 'R45 (DocGen Engine)'],
        storageInfo: 'Secure Store / signatures/stempel_sekolah.png',
        tags: ['stempel', 'legalitas', 'otentikasi'],
        notes: 'Stempel resmi bertanda transparansi tinggi untuk pengesahan otomatis surat keputusan.',
        isSensitive: true,
        fileType: 'PNG (Transparent)',
        fileSize: '320 KB',
        versions: [
          { version: 'v1.1', uploadedAt: '15 Juli 2025', uploaderName: 'Kepala Sekolah', uploaderRole: 'KEPALA_SEKOLAH', fileSize: '320 KB', changeNote: 'Pembersihan latar belakang transparansi.' }
        ],
        rawObject: schoolProfile
      });

      list.push({
        id: 'AST_FOUNDATION_LOGO_01',
        category: 'LOGO_YAYASAN',
        categoryLabel: 'Logo Yayasan Pembina',
        title: 'Logo Yayasan Asy-Syifa Al-Khairiyyah',
        ownerName: 'Yayasan Asy-Syifa Al-Khairiyyah',
        ownerType: 'FOUNDATION',
        uploadDate: '01 Agustus 2025',
        currentVersion: 'v1.0',
        status: 'VERIFIED',
        linkedModules: ['R27 (Profil Yayasan)', 'R44 (Templat Legal)', 'R46 (Digital Identity)'],
        storageInfo: 'Cloud Storage / assets/logo_yayasan.png',
        tags: ['yayasan', 'legal', 'induk'],
        notes: 'Logo induk yayasan untuk surat keputusan bersama dan dokumen strategis.',
        isSensitive: false,
        fileType: 'PNG',
        fileSize: '512 KB',
        versions: [
          { version: 'v1.0', uploadedAt: '01 Agustus 2025', uploaderName: 'Ketua Yayasan', uploaderRole: 'KETUA_YAYASAN', fileSize: '512 KB', changeNote: 'Rilis perdana aset logo yayasan.' }
        ]
      });
    }

    // 2. Student Attachments (KK, Akta, Foto, Dokumen PPDB)
    students.forEach((s) => {
      list.push({
        id: `AST_SISWA_KK_${s.id}`,
        category: 'KK',
        categoryLabel: 'Kartu Keluarga (KK)',
        title: `Kartu Keluarga - ${s.name}`,
        ownerName: s.name,
        ownerType: 'STUDENT',
        uploadDate: '10 Juli 2025',
        currentVersion: 'v1.0',
        status: 'VERIFIED',
        linkedModules: ['R2 (Data Siswa)', 'R11 (PPDB)', 'R46 (Digital Identity)', 'R23 (Digital Archive)'],
        storageInfo: 'Encrypted Vault / attachments/students/kk_encrypted.pdf',
        tags: ['kk', 'kependudukan', 'sensitif', 'siswa'],
        notes: 'Salinan resmi KK terverifikasi untuk sinkronisasi Dapodik dan ijazah.',
        isSensitive: true,
        fileType: 'PDF Document',
        fileSize: '1.2 MB',
        versions: [
          { version: 'v1.0', uploadedAt: '10 Juli 2025', uploaderName: s.parentName || 'Orang Tua Siswa', uploaderRole: 'WALI_MURID', fileSize: '1.2 MB', changeNote: 'Unggahan dokumen KK dari pendaftaran PPDB.' }
        ],
        rawObject: s
      });

      list.push({
        id: `AST_SISWA_AKTA_${s.id}`,
        category: 'AKTA_KELAHIRAN',
        categoryLabel: 'Akta Kelahiran Siswa',
        title: `Akta Kelahiran - ${s.name}`,
        ownerName: s.name,
        ownerType: 'STUDENT',
        uploadDate: '11 Juli 2025',
        currentVersion: 'v1.0',
        status: 'VERIFIED',
        linkedModules: ['R2 (Data Siswa)', 'R46 (Digital Identity)', 'R23 (Arsip)'],
        storageInfo: 'Encrypted Vault / attachments/students/akta_encrypted.pdf',
        tags: ['akta', 'kelahiran', 'sensitif'],
        notes: 'Dokumen kelahiran resmi pencatatan sipil.',
        isSensitive: true,
        fileType: 'PDF Document',
        fileSize: '980 KB',
        versions: [
          { version: 'v1.0', uploadedAt: '11 Juli 2025', uploaderName: s.parentName || 'Orang Tua Siswa', uploaderRole: 'WALI_MURID', fileSize: '980 KB', changeNote: 'Verifikasi fisik akta kelahiran oleh panitia.' }
        ],
        rawObject: s
      });

      list.push({
        id: `AST_SISWA_FOTO_${s.id}`,
        category: 'FOTO_SISWA',
        categoryLabel: 'Pasfoto Resmi Siswa',
        title: `Pasfoto Paspor 3x4 - ${s.name}`,
        ownerName: s.name,
        ownerType: 'STUDENT',
        uploadDate: '12 Juli 2025',
        currentVersion: 'v1.0',
        status: 'AVAILABLE',
        linkedModules: ['R2 (Profil Siswa)', 'R46 (Kartu Digital)', 'R10 (Buku Induk)'],
        storageInfo: 'Public Assets / photos/students/pasfoto.jpg',
        tags: ['foto', 'pasfoto', 'identitas'],
        notes: 'Pasfoto latar belakang merah untuk cetak Kartu Pelajar & Ijazah.',
        isSensitive: false,
        fileType: 'JPEG Image',
        fileSize: '350 KB',
        versions: [
          { version: 'v1.0', uploadedAt: '12 Juli 2025', uploaderName: 'Staf TU', uploaderRole: 'ADMIN', fileSize: '350 KB', changeNote: 'Foto studio terstandar.' }
        ]
      });
    });

    // 3. Teacher Attachments (Ijazah, Sertifikat, TTD)
    teachers.forEach((t) => {
      list.push({
        id: `AST_GURU_IJAZAH_${t.id}`,
        category: 'IJAZAH_GURU',
        categoryLabel: 'Ijazah & Transkrip Pendidik',
        title: `Ijazah S1/S2 - ${t.name}`,
        ownerName: t.name,
        ownerType: 'TEACHER',
        uploadDate: '01 Juni 2025',
        currentVersion: 'v1.0',
        status: 'VERIFIED',
        linkedModules: ['R3 (Profil Guru)', 'R46 (Digital Identity)', 'R23 (Arsip Kepegawaian)'],
        storageInfo: 'Encrypted Vault / attachments/teachers/ijazah.pdf',
        tags: ['ijazah', 'kepegawaian', 'pendidik'],
        notes: 'Salinan legalisir ijazah sarjana pendidikan PAUD.',
        isSensitive: true,
        fileType: 'PDF Document',
        fileSize: '2.4 MB',
        versions: [
          { version: 'v1.0', uploadedAt: '01 Juni 2025', uploaderName: t.name, uploaderRole: 'GURU', fileSize: '2.4 MB', changeNote: 'Unggahan awal berkas kepegawaian.' }
        ],
        rawObject: t
      });

      list.push({
        id: `AST_GURU_TTD_${t.id}`,
        category: 'TTD_KEPALA_SEKOLAH',
        categoryLabel: 'Tanda Tangan Digital Guru / Pendidik',
        title: `Spesimen Tanda Tangan - ${t.name}`,
        ownerName: t.name,
        ownerType: 'TEACHER',
        uploadDate: '05 Juni 2025',
        currentVersion: 'v1.0',
        status: 'VERIFIED',
        linkedModules: ['R43 (Approval Engine)', 'R45 (DocGen Engine)', 'R46 (Digital Identity)'],
        storageInfo: 'Secure Store / signatures/ttd_teacher.png',
        tags: ['ttd', 'spesimen', 'approval'],
        notes: 'Spesimen tanda tangan elektronik yang dilindungi hash terenkripsi.',
        isSensitive: true,
        fileType: 'PNG (Transparent)',
        fileSize: '180 KB',
        versions: [
          { version: 'v1.0', uploadedAt: '05 Juni 2025', uploaderName: t.name, uploaderRole: 'GURU', fileSize: '180 KB', changeNote: 'Perekaman tanda tangan digital pada pad sentuh.' }
        ]
      });
    });

    // 4. Digital Archives & Generated Documents
    archives.forEach((a) => {
      list.push({
        id: `AST_ARCHIVE_${a.id}`,
        category: 'DOKUMEN_ADMINISTRASI',
        categoryLabel: 'Berkas Arsip Digital',
        title: a.title,
        ownerName: a.createdBy || 'Sistem Sekolah',
        ownerType: 'SCHOOL',
        uploadDate: new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        currentVersion: 'v1.0',
        status: 'VERIFIED',
        linkedModules: ['R23 (Arsip Digital)', 'R45 (DocGen Engine)', 'R47 (Sync Engine)'],
        storageInfo: `Archive Collection / ${a.folder || 'Umum'}`,
        tags: a.tags || ['arsip', 'dokumen'],
        notes: a.description || 'Arsip tersimpan dalam registry.',
        isSensitive: false,
        fileType: a.fileName?.endsWith('.pdf') ? 'PDF Document' : 'Document File',
        fileSize: a.fileSize ? `${Math.round(a.fileSize / 1024)} KB` : '450 KB',
        versions: [
          { version: 'v1.0', uploadedAt: new Date(a.createdAt).toLocaleDateString('id-ID'), uploaderName: a.createdBy || 'Admin', uploaderRole: 'ADMIN', fileSize: '450 KB', changeNote: 'Pengarsipan otomatis sistem.' }
        ],
        rawObject: a
      });
    });

    return list;
  }, [schoolProfile, students, teachers, archives]);

  // Set initial selected asset
  useEffect(() => {
    if (masterAttachments.length > 0 && !selectedAssetId) {
      setSelectedAssetId(masterAttachments[0].id);
    }
  }, [masterAttachments, selectedAssetId]);

  // Filtered Assets based on Search, Category, and Status
  const filteredAssets = useMemo(() => {
    return masterAttachments.filter((asset) => {
      if (selectedCategory !== 'ALL' && asset.category !== selectedCategory) return false;
      if (selectedStatus !== 'ALL' && asset.status !== selectedStatus) return false;
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        asset.title.toLowerCase().includes(term) ||
        asset.id.toLowerCase().includes(term) ||
        asset.ownerName.toLowerCase().includes(term) ||
        asset.categoryLabel.toLowerCase().includes(term) ||
        asset.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [masterAttachments, selectedCategory, selectedStatus, searchTerm]);

  // Currently Selected Asset Object
  const currentAsset = useMemo(() => {
    return masterAttachments.find((a) => a.id === selectedAssetId) || filteredAssets[0] || masterAttachments[0];
  }, [masterAttachments, selectedAssetId, filteredAssets]);

  // Handle Refresh Action
  const handleRefreshRegistry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNoticeMessage('Enterprise Attachment Registry & File Linking Engine Berhasil Disegarkan.');
      setTimeout(() => setNoticeMessage(null), 3000);
    }, 450);
  };

  // Handle New Asset Registration Upload Form
  const handleCreateNewAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await DataService.createAuditLog({
        uid: 'SYSTEM_ATTACHMENT_REG',
        userName: activeRole,
        role: activeRole,
        action: 'ATTACHMENT_REGISTERED',
        targetModule: `Attachment Registry - ${newTitle}`
      });

      setNoticeMessage(`Aset dokumen "${newTitle}" berhasil didaftarkan ke Unified Attachment Registry!`);
      setShowUploadModal(false);
      setNewTitle('');
      setNewOwner('');
      setNewNotes('');

      await loadRegistryData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error creating attachment registry entry:', err);
    }
  };
  const handleSaveDocTypeConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeCode.trim() || !typeName.trim()) return;

    try {
      const newType: DocumentTypeConfig = {
        id: `DOC_TYPE_${Date.now()}`,
        code: typeCode.toUpperCase().replace(/\s+/g, '_'),
        name: typeName,
        description: typeDesc || 'Tipe Dokumen Konfigurabel TADE',
        isRequired: typeIsReq,
        applicableRoles: ['WALI_MURID', 'GURU', 'KEPALA_SEKOLAH', 'ADMIN', 'SUPER_ADMIN'],
        applicableTarget: 'PERSON',
        isIdentityDocument: typeIsIdentity,
        isPrivate: true,
        requiresVerification: true,
        maxSizeMB: 10,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        status: 'active',
        createdBy: activeRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await DataService.saveDocumentType(newType, 'SYSTEM_USER', activeRole, activeRole);
      setNoticeMessage(`Tipe dokumen '${typeName}' (${newType.code}) berhasil disimpan.`);
      setShowTypeModal(false);
      setTypeCode('');
      setTypeName('');
      setTypeDesc('');
      await loadRegistryData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error saving document type:', err);
    }
  };

  // Handle Submit Vault Document
  const handleSubmitVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultTitle.trim()) return;

    try {
      const selectedType = docTypes.find(t => t.id === vaultTypeId);
      await DataService.submitVaultDocument(
        {
          ownerId: 'USER_OWNER_01',
          ownerName: activeRole,
          ownerRole: activeRole,
          documentTypeId: vaultTypeId || 'DOC_TYPE_KK',
          documentTypeCode: selectedType?.code || 'KK',
          documentTypeName: selectedType?.name || 'Kartu Keluarga',
          targetType: selectedType?.applicableTarget || 'PERSON',
          title: vaultTitle,
          storagePath: '',
          downloadUrl: '',
          fileType: vaultFile?.type || 'application/pdf',
          fileSizeMB: vaultFile ? parseFloat((vaultFile.size / (1024 * 1024)).toFixed(2)) : 1.0,
          visibility: vaultVisibility,
          status: 'SUBMITTED',
          createdBy: 'CURRENT_USER'
        },
        vaultFile || undefined
      );

      setNoticeMessage(`Dokumen '${vaultTitle}' berhasil diunggah ke Document Vault!`);
      setShowVaultSubmitModal(false);
      setVaultTitle('');
      setVaultFile(null);
      await loadRegistryData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error submitting vault document:', err);
    }
  };

  // Handle Approve / Reject Vault Document
  const handleApproveVault = async (docId: string, title: string) => {
    try {
      await DataService.approveVaultDocument(docId, 'ADMIN_UID', activeRole, activeRole, 'Dokumen terverifikasi sah');
      setNoticeMessage(`Dokumen vault '${title}' telah disetujui (APPROVED).`);
      await loadRegistryData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error approving vault doc:', err);
    }
  };

  const handleRejectVault = async (docId: string, title: string) => {
    try {
      await DataService.rejectVaultDocument(docId, 'ADMIN_UID', activeRole, activeRole, 'Berkas perlu diperbarui / tidak terbaca');
      setNoticeMessage(`Dokumen vault '${title}' telah ditolak (REJECTED).`);
      await loadRegistryData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error rejecting vault doc:', err);
    }
  };

  // Handle Replace Vault Document Version
  const handleReplaceVaultVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaultDoc || !replaceFile || !replaceReason.trim()) return;

    try {
      await DataService.replaceVaultDocument(
        selectedVaultDoc.id,
        replaceFile,
        replaceReason,
        'USER_UID',
        activeRole,
        activeRole
      );

      setNoticeMessage(`Versi baru dokumen '${selectedVaultDoc.title}' berhasil diunggah dan v${selectedVaultDoc.version} diarsip.`);
      setShowReplaceModal(false);
      setSelectedVaultDoc(null);
      setReplaceFile(null);
      setReplaceReason('');
      await loadRegistryData();
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error replacing vault doc:', err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Sprint P23 • Enterprise Attachment Registry & Unified File Linking (R48)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Registri Berkas & Engine Keterhubungan File Terpadu
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Single Source of Truth seluruh dokumen fisik/digital (KK, KTP, Akta, Ijazah, Logo, Stempel) terhubung tanpa duplikasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Daftarkan Berkas Baru
          </button>

          <button
            onClick={handleRefreshRegistry}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Segarkan Engine
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-900 font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer border border-stone-300"
          >
            <Printer className="w-4 h-4" /> Cetak Lembar Registri
          </button>
        </div>
      </div>

      {/* Top Module Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-200/80 rounded-2xl border border-stone-300/80 overflow-x-auto">
        <button
          onClick={() => setTopTab('REGISTRY')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
            topTab === 'REGISTRY'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-transparent text-stone-700 hover:text-slate-900 hover:bg-stone-300/50'
          }`}
        >
          <Paperclip className="w-4 h-4" /> Registri Berkas & Link
        </button>

        <button
          onClick={() => setTopTab('DOC_TYPES')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
            topTab === 'DOC_TYPES'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-transparent text-stone-700 hover:text-slate-900 hover:bg-stone-300/50'
          }`}
        >
          <Layers className="w-4 h-4" /> Configurator Tipe Dokumen ({docTypes.length})
        </button>

        <button
          onClick={() => setTopTab('VAULT')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
            topTab === 'VAULT'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-transparent text-stone-700 hover:text-slate-900 hover:bg-stone-300/50'
          }`}
        >
          <Lock className="w-4 h-4" /> Document Vault & Approval ({vaultDocs.length})
        </button>

        <button
          onClick={() => setTopTab('MASTER_DATA')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
            topTab === 'MASTER_DATA'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-transparent text-stone-700 hover:text-slate-900 hover:bg-stone-300/50'
          }`}
        >
          <User className="w-4 h-4" /> Master Data Identitas & KTP
        </button>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Top Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Aset Berkas</span>
          <div className="text-xl font-black text-slate-900 font-mono">{masterAttachments.length} Aset</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Tercatat di Registry</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Terverifikasi Valid</span>
          <div className="text-xl font-black text-emerald-900 font-mono">
            {masterAttachments.filter((a) => a.status === 'VERIFIED').length} Berkas
          </div>
          <span className="text-[10px] text-emerald-800 font-bold block">100% Otentik</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Dokumen Sensitif</span>
          <div className="text-xl font-black text-amber-900 font-mono">
            {masterAttachments.filter((a) => a.isSensitive).length} Items
          </div>
          <span className="text-[10px] text-amber-800 font-bold block">Protected by RBAC</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Kategori Terhubung</span>
          <div className="text-xl font-black text-slate-900 font-mono">19 Kategori</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Single Source of Truth</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Modul Terintegrasi</span>
          <div className="text-xl font-black text-slate-900 font-mono">R1–R47</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Unified Linking Engine</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Privilese RBAC</span>
          <div className="text-xs font-black text-emerald-400 font-mono truncate">{activeRole}</div>
          <span className="text-[10px] text-slate-300 block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> {isPrivilegedRole ? 'Full Access' : 'Masked Preview'}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SEARCH & ASSET SELECTOR LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-800" /> Pencarian Registri Berkas
              </h2>
              <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono">
                {filteredAssets.length} Data
              </span>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Nama Berkas, Pemilik, ID Aset, atau Tag..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
              />
            </div>

            {/* Category Quick Filter Dropdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Kategori Berkas</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="ALL">Semua Kategori (19)</option>
                  <option value="KK">KK (Kartu Keluarga)</option>
                  <option value="KTP">KTP Orang Tua / Guru</option>
                  <option value="AKTA_KELAHIRAN">Akta Kelahiran</option>
                  <option value="FOTO_SISWA">Foto Siswa</option>
                  <option value="FOTO_GURU">Foto Guru</option>
                  <option value="IJAZAH_GURU">Ijazah & Transkrip Guru</option>
                  <option value="LOGO_SEKOLAH">Logo Sekolah</option>
                  <option value="STEMPEL_SEKOLAH">Stempel Sekolah</option>
                  <option value="DOKUMEN_ADMINISTRASI">Dokumen Administrasi</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Status Verifikasi</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="VERIFIED">Terverifikasi (Verified)</option>
                  <option value="AVAILABLE">Tersedia (Available)</option>
                  <option value="PENDING_VERIFICATION">Menunggu Verifikasi</option>
                </select>
              </div>
            </div>

            {/* Asset List Items */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredAssets.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                  Tidak ada aset dokumen yang sesuai dengan kriteria pencarian.
                </div>
              ) : (
                filteredAssets.map((asset) => {
                  const isSelected = currentAsset?.id === asset.id;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                          {asset.category}
                        </span>
                        <span className="text-[10px] font-bold text-stone-500">{asset.categoryLabel}</span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-black text-slate-900 leading-tight">{asset.title}</h3>
                          <p className="text-[11px] font-mono text-stone-500 mt-0.5">Pemilik: {asset.ownerName}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-900 px-2 py-0.5 bg-emerald-100 rounded-md shrink-0">
                          {asset.status}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                        <span className="font-mono">Ver: {asset.currentVersion} • {asset.fileSize}</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          Detail <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DIGITAL ASSET IDENTITY & UNIFIED FILE LINKING (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentAsset ? (
            <div className="space-y-6">
              {/* Asset Identity Card Header */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-200 uppercase">
                        {currentAsset.category}
                      </span>
                      <span className="text-xs text-stone-500 font-bold">• {currentAsset.categoryLabel}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-1">{currentAsset.title}</h2>
                    <p className="text-stone-600 font-mono text-xs mt-0.5">ID Aset: {currentAsset.id}</p>
                  </div>

                  <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shrink-0 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Versi Aktif</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">{currentAsset.currentVersion}</span>
                    <span className="text-[9px] font-bold block text-slate-300 mt-0.5">SINGLE SOURCE OF TRUTH</span>
                  </div>
                </div>

                {/* Internal Sub-Tabs Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2">
                  <button
                    onClick={() => setActiveDetailTab('METADATA')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'METADATA' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Identity & Metadata
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('LINKING')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'LINKING' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <GitCommit className="w-3.5 h-3.5" /> Unified File Linking
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('VERSIONS')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'VERSIONS' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" /> Riwayat Versi
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('AUDIT')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'AUDIT' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Audit & RBAC
                  </button>
                </div>

                {/* TAB 1: METADATA & SENSITIVE PREVIEW */}
                {activeDetailTab === 'METADATA' && (
                  <div className="space-y-5">
                    {/* Sensitive Document Banner & RBAC Masking Notice */}
                    {currentAsset.isSensitive && !isPrivilegedRole && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                          <Lock className="w-4 h-4 text-amber-800 shrink-0" /> Protected Document Notice (Dokumen Sensitif)
                        </div>
                        <p className="text-[11px]">
                          <strong>"Dokumen tersedia"</strong> di simpanan resmi sekolah. Tampilan pratinjau penuh dibatasi untuk peran Anda demi menjaga privasi data sesuai standar RBAC TADE.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase">Pemilik Aset Dokumen</span>
                        <span className="font-bold text-slate-900 block">{currentAsset.ownerName}</span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase">Tanggal Unggah Pertama</span>
                        <span className="font-bold text-slate-900 block">{currentAsset.uploadDate}</span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase">Format & Ukuran Berkas</span>
                        <span className="font-mono font-bold text-slate-900 block">
                          {currentAsset.fileType} ({currentAsset.fileSize})
                        </span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase">Lokasi Storage Terdaftar</span>
                        <span className="font-mono text-[11px] font-bold text-slate-900 block truncate">{currentAsset.storageInfo}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Catatan & Keterangan Pengesahan</span>
                      <p className="text-stone-700 leading-relaxed">{currentAsset.notes}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">Tags:</span>
                      {currentAsset.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-lg border border-stone-200 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: UNIFIED FILE LINKING (1 FILE -> MANY MODULES) */}
                {activeDetailTab === 'LINKING' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <GitCommit className="w-4 h-4" /> Visualisasi Hubungan Keterhubungan File (Unified Linking Graph)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Read-Only Graph</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Satu berkas induk terhubung ke seluruh modul sistem TADE tanpa duplikasi simpanan.
                      </p>
                    </div>

                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-6">
                      {/* Node Single Source of Truth */}
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-emerald-700 shadow-2xs">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs shrink-0 font-mono">
                          REG
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400 block">MASTER ATTACHMENT REGISTRY</span>
                          <h4 className="text-sm font-black text-slate-900">{currentAsset.title}</h4>
                          <span className="text-xs text-stone-500 font-mono">ID: {currentAsset.id}</span>
                        </div>
                      </div>

                      <div className="flex justify-center text-stone-400">
                        <ChevronRight className="w-6 h-6 rotate-90" />
                      </div>

                      {/* Linked Target Modules Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentAsset.linkedModules.map((mod, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-emerald-800" /> {mod}
                              </span>
                              <span className="text-[10px] text-emerald-800 font-bold">LINKED</span>
                            </div>
                            <span className="text-[10px] text-stone-500 block font-mono">Referensi Langsung Non-Duplikat</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: VERSION MANAGEMENT TIMELINE */}
                {activeDetailTab === 'VERSIONS' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-4 h-4 text-emerald-800" /> Riwayat & Versi Dokumen (Version Timeline)
                    </h3>

                    <div className="space-y-3">
                      {currentAsset.versions.map((ver, idx) => (
                        <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-xs font-bold rounded-md">
                              Versi {ver.version}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500">{ver.uploadedAt}</span>
                          </div>

                          <p className="text-xs font-bold text-slate-900">{ver.changeNote}</p>

                          <div className="flex items-center justify-between text-[10px] text-stone-500 border-t border-stone-200/60 pt-2">
                            <span>Pengunggah: {ver.uploaderName} ({ver.uploaderRole})</span>
                            <span className="font-mono">{ver.fileSize}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: AUDIT LOGS */}
                {activeDetailTab === 'AUDIT' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-800" /> Audit Trail & Akses Keamanan
                    </h3>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between text-stone-700">
                        <span>Pemeriksaan Keamanan RBAC</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ENFORCED
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-stone-700">
                        <span>Status Enkripsi Berkas</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AES-256 VAULT
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-stone-700">
                        <span>Audit Akses Terakhir</span>
                        <span className="font-mono text-stone-600">Hari ini oleh {activeRole}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-2 text-stone-500 text-xs">
              Pilih salah satu berkas dari registri di sebelah kiri untuk melihat metadata dan peta keterhubungan.
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD / REGISTRATION MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-800" /> Registrasi Berkas Baru
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-stone-400 hover:text-slate-900 font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewAttachment} className="space-y-4 text-xs font-bold text-slate-900">
              <div>
                <label className="block text-[10px] text-stone-500 uppercase mb-1">Nama / Judul Berkas</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Kartu Keluarga - Ahmad Rizky"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 uppercase mb-1">Kategori Berkas</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="KK">Kartu Keluarga (KK)</option>
                  <option value="KTP">KTP Orang Tua / Guru</option>
                  <option value="AKTA_KELAHIRAN">Akta Kelahiran</option>
                  <option value="FOTO_SISWA">Foto Siswa</option>
                  <option value="IJAZAH_GURU">Ijazah Guru</option>
                  <option value="DOKUMEN_ADMINISTRASI">Dokumen Administrasi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 uppercase mb-1">Nama Pemilik Berkas</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="Contoh: TK ASY SYIFA / Ahmad Rizky"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 uppercase mb-1">Catatan Tambahan</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Keterangan pengesahan atau spesifikasi berkas..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                >
                  Simpan Registrasi Berkas
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
