export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'KETUA_YAYASAN' 
  | 'KEPALA_SEKOLAH' 
  | 'GURU' 
  | 'KEUANGAN' 
  | 'WALI_MURID' 
  | 'CALON_WALI_MURID'
  | 'ALUMNI_FAMILY';

export * from './alumni';
export * from './notification';

export interface UserProfile {
  uid: string;
  id?: string;
  nama: string;
  name?: string;
  displayName?: string;
  email: string;
  nomorHP: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'pending' | 'rejected' | 'suspended';
  avatar?: string;
  assignedClass?: string;
  childName?: string;
  childId?: string;
  nik?: string;
  kkNo?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: 'Laki-laki' | 'Perempuan' | 'L' | 'P';
  address?: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  ktpUrl?: string;
  kkUrl?: string;
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface FirstSetupData {
  namaSekolah: string;
  yayasan: string;
  npsn: string;
  jenjang: string;
  kepalaSekolah: string;
  tahunAjaran: string;
  alamat: string;
  email: string;
  nomorWA: string;
  logo: string;
  rekening: string;
  timezone: string;
}

export type ApprovalType = 
  | 'USER_REGISTRATION' 
  | 'PPDB_VERIFICATION' 
  | 'PAYMENT_VERIFICATION' 
  | 'DOCUMENT_APPROVAL' 
  | 'GENERAL';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'suspended';

export interface CentralApprovalRequest {
  id: string;
  type: ApprovalType;
  module: string;
  requesterId: string;
  requesterName: string;
  targetId: string;
  title: string;
  description: string;
  payload?: Record<string, any>;
  status: ApprovalStatus;
  approverRole: UserRole[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  metadata?: Record<string, any>;

  // Backward compatibility fields
  uid?: string;
  nama?: string;
  email?: string;
  nomorHP?: string;
  role?: UserRole;
  requestedAt?: string;
}

export type ApprovalRequest = CentralApprovalRequest;

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationType = 
  | 'APPROVAL_CREATED'
  | 'APPROVAL_APPROVED'
  | 'APPROVAL_REJECTED'
  | 'APPROVAL_CANCELLED'
  | 'SYSTEM_BROADCAST'
  | 'SECURITY_ALERT'
  | 'ACADEMIC_ANNOUNCEMENT'
  | 'PAYMENT_REMINDER'
  | 'GENERAL';

export type ArchiveCategory = 
  | 'ADMINISTRASI'
  | 'AKADEMIK'
  | 'KEUANGAN'
  | 'LEGALITAS'
  | 'KEPEGAWAIAN'
  | 'PPDB'
  | 'KEGIATAN'
  | 'LAINNYA';

export const ARCHIVE_CATEGORY_PERMISSIONS: Record<ArchiveCategory, { label: string; allowedRoles: UserRole[] }> = {
  ADMINISTRASI: {
    label: 'Administrasi',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN']
  },
  AKADEMIK: {
    label: 'Akademik',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU']
  },
  KEUANGAN: {
    label: 'Keuangan',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN']
  },
  LEGALITAS: {
    label: 'Legalitas',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH']
  },
  KEPEGAWAIAN: {
    label: 'Kepegawaian',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU']
  },
  PPDB: {
    label: 'PPDB',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU']
  },
  KEGIATAN: {
    label: 'Kegiatan',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU']
  },
  LAINNYA: {
    label: 'Lainnya',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH']
  }
};

export type DocumentCategory =
  | 'SURAT'
  | 'LAPORAN'
  | 'ADMINISTRASI'
  | 'AKADEMIK'
  | 'KEUANGAN'
  | 'PPDB'
  | 'KEPEGAWAIAN';

export interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentCategory;
  type: 'PDF' | 'EXCEL' | 'BOTH';
  content: string; // HTML/Markdown or template structure
  variables: string[]; // e.g. ["namaSiswa", "nis", "kelas", "tanggalLahir", "keperluan"]
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived';
}

export interface GeneratedDocument {
  id: string;
  templateId?: string;
  templateName: string;
  documentNumber: string;
  title: string;
  category: DocumentCategory;
  data: Record<string, any>;
  pdfUrl?: string;
  excelUrl?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived' | 'APPROVED' | 'REJECTED';
  approvalRequestId?: string;
  archiveId?: string;
  ownerId: string;
  ownerRole: UserRole;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
  recipientName?: string;
  attachments?: any[];
}

export interface DocumentTypeConfig {
  id: string;
  code: string;
  name: string;
  description: string;
  isRequired: boolean;
  applicableRoles: UserRole[];
  applicableTarget: 'PERSON' | 'STUDENT' | 'TEACHER' | 'SCHOOL' | 'PPDB';
  isIdentityDocument: boolean;
  isPrivate: boolean;
  requiresVerification: boolean;
  maxSizeMB: number;
  allowedMimeTypes: string[];
  status: 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultVersionItem {
  version: number;
  storagePath: string;
  downloadUrl: string;
  uploadedAt: string;
  uploaderUid: string;
  uploaderName: string;
  changeReason: string;
}

export interface VaultDocumentItem {
  id: string;
  documentTypeId: string;
  documentTypeCode: string;
  documentTypeName: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerRole: UserRole;
  targetType: 'PERSON' | 'STUDENT' | 'TEACHER' | 'SCHOOL' | 'PPDB';
  visibility: 'PRIVATE_IDENTITY' | 'SHARED_SCHOOL' | 'PUBLIC_WEBSITE';
  storagePath: string;
  downloadUrl: string;
  fileType: string;
  fileSizeMB: number;
  status: 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION' | 'ARCHIVED';
  verificationNote?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  version: number;
  previousVersionId?: string;
  versionsHistory?: VaultVersionItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeSourceType = 
  | 'digital_archives'
  | 'archive_versions'
  | 'documents'
  | 'document_templates'
  | 'school_profile'
  | 'approval_requests'
  | 'notifications'
  | 'users';

export interface KnowledgeIndexItem {
  id: string;
  sourceType: KnowledgeSourceType;
  sourceId: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  module: string;
  ownerId: string;
  accessRoles: UserRole[];
  createdAt: string;
  updatedAt: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeSummary {
  topic: string;
  totalResults: number;
  summaryText: string;
  sources: { title: string; sourceType: string; category: string }[];
  schoolProfile?: SchoolProfile;
}

export interface HealthIssue {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'FRONTEND' | 'FIREBASE' | 'SECURITY' | 'PERFORMANCE';
  issue: string;
  location: string;
  cause: string;
  solution: string;
}

export interface HealthReport {
  id: string;
  createdAt: string;
  overallScore: number;
  frontendScore: number;
  firebaseScore: number;
  securityScore: number;
  performanceScore: number;
  status: 'EXCELLENT' | 'WARNING' | 'CRITICAL';
  issues: HealthIssue[];
  recommendations: string[];
  executedBy: string;
}

export interface SystemBackup {
  id: string;
  backupType: 'MANUAL' | 'SCHEDULED' | 'EMERGENCY';
  createdAt: string;
  createdBy: string;
  createdByName: string;
  collectionList: string[];
  documentCount: number;
  status: 'CREATED' | 'VERIFIED' | 'FAILED' | 'RESTORED';
  checksum: string;
  version: string;
  snapshotData?: Record<string, any[]>;
  timestamp?: string;
  type?: string;
  createdByRole?: string;
}

export type PaymentCategory = 
  | 'SPP'
  | 'PPDB'
  | 'Seragam'
  | 'Kegiatan'
  | 'Study Tour'
  | 'Administrasi'
  | 'Infak'
  | 'Lainnya';

export type PaymentMethod = 'TRANSFER_BANK' | 'E_WALLET' | 'CASH';

export type EWalletProvider = 'DANA' | 'OVO' | 'GoPay' | 'ShopeePay' | 'QRIS';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PaymentTransaction {
  id: string;
  transactionNumber: string;
  studentId: string;
  studentName?: string;
  classGroup?: string;
  payerId: string;
  payerName: string;
  category: PaymentCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  proofFile?: string;
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  receiptUrl?: string;

  // Transfer Bank details
  bankName?: string;
  accountNumber?: string;
  senderName?: string;
  transferDate?: string;
  transferProof?: string;

  // E-Wallet details
  walletProvider?: EWalletProvider;
  walletNumber?: string;
  paymentProof?: string;

  // Cash details
  cashReceivedBy?: string;
  cashDate?: string;
}

export interface DigitalArchive {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  downloadUrl: string;
  category: ArchiveCategory;
  folder: string;
  module: string;
  title: string;
  description: string;
  ownerId: string;
  ownerRole: UserRole;
  tags: string[];
  status: 'active' | 'archived' | 'deleted';
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ArchiveVersion {
  id: string;
  archiveId: string;
  version: number;
  changedBy: string;
  changedByName?: string;
  changedAt: string;
  changeNote: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
}

export interface ArchiveAuditLogRecord {
  id: string;
  timestamp: string;
  uid: string;
  role: UserRole;
  archiveId: string;
  category: string;
  action:
    | 'ARCHIVE_VIEW'
    | 'ARCHIVE_DOWNLOAD'
    | 'ARCHIVE_UPLOAD'
    | 'ARCHIVE_VERSION_VIEW'
    | 'ARCHIVE_RESTORE'
    | 'ARCHIVE_DELETE'
    | 'ARCHIVE_PERMISSION_DENIED';
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  duration: number;
  correlationId: string;
  details?: string;
}

export interface SystemNotification {
  id: string;
  recipientId?: string;
  recipientRole?: UserRole | UserRole[];
  type: NotificationType;
  title: string;
  message: string;
  source: string;
  sourceId?: string;
  priority: NotificationPriority;
  status: 'unread' | 'read';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationEvent {
  id: string;
  type: 'APPROVAL_CREATED' | 'APPROVAL_APPROVED' | 'APPROVAL_REJECTED' | 'APPROVAL_CANCELLED';
  targetUserId?: string;
  targetRole?: UserRole[];
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  akreditasi: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  whatsapp: string;
  kepalaSekolah: string;
  headmaster?: string;
  academicYear?: string;
  namaSekolah?: string;
  visi?: string;
  alamat?: string;
  mapsUrl: string;
  vision: string;
  missions: string[];
  coreValues: string[];
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    accreditationScore: number;
    alumniCount: number;
  };
}

export interface ArticleCMS {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: 'Berita' | 'Pengumuman' | 'Edukasi' | 'Kegiatan';
  image: string;
  author: string;
  date: string;
  createdAt?: string;
  isPublished: boolean;
  tags?: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'gallery' | 'video' | 'banner' | 'document';
  category: string;
  description?: string;
  isPublished: boolean;
  dateAdded: string;
}

export interface PPDBRecord {
  id: string;
  registrationNo: string;
  studentName: string;
  nik: string;
  nickname: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  religion: string;
  address: string;
  distanceKm: number;
  groupChoice: 'Kelompok A' | 'Kelompok B' | 'PAUD/TPA';
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  phone: string;
  status: 'Menunggu' | 'Diterima' | 'Ditolak' | 'Verifikasi';
  registeredAt: string;
  wave: 'Gelombang 1' | 'Gelombang 2' | 'Gelombang 3';
  isPaidFee: boolean;
  notes?: string;
  documents?: any[];
  fullName?: string;
  parentName?: string;
}

export interface PPDBLifecycleConfig {
  isActive: boolean;
  academicYear: string;
  startDate: string;
  endDate: string;
  showMenuInSIM: boolean;
  showBannerInSIM: boolean;
  showPopupInSIM: boolean;
  showInPublicNav?: boolean;
  targetQuota: number;
  currentWave: 'Gelombang 1' | 'Gelombang 2' | 'Gelombang 3';
  notes: string;
  lastUpdated: string;
  updatedBy: string;
  updatedByRole: string;
}

export const DEFAULT_PPDB_LIFECYCLE_CONFIG: PPDBLifecycleConfig = {
  isActive: true,
  academicYear: '2026/2027',
  startDate: '2026-01-05',
  endDate: '2026-07-15',
  showMenuInSIM: true,
  showBannerInSIM: true,
  showPopupInSIM: false,
  showInPublicNav: true,
  targetQuota: 60,
  currentWave: 'Gelombang 1',
  notes: 'Penerimaan Peserta Didik Baru (PPDB) TK Asy Syifa Tanggul Tahun Ajaran 2026/2027',
  lastUpdated: '2026-01-05T08:00:00.000Z',
  updatedBy: 'Admin Operasional',
  updatedByRole: 'ADMIN'
};

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  nama?: string;
  namaLengkap?: string;
  nickname: string;
  gender: 'L' | 'P';
  classGroup: 'Kelompok A1' | 'Kelompok A2' | 'Kelompok B1' | 'Kelompok B2' | 'PAUD TPA';
  kelompok?: string;
  rombel?: string;
  birthDate: string;
  parentName: string;
  namaAyah?: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: 'Aktif' | 'Alumni' | 'Cuti';
  bloodType?: string;
  photoUrl?: string;
  joinedYear: number;
  parentUid?: string;
  waliUid?: string;
  waliMuridUid?: string;
  namaOrangTua?: string;
}

export interface Teacher {
  id: string;
  nip: string;
  nuptk: string;
  name: string;
  title: string;
  gender: 'L' | 'P';
  position: string;
  assignedClass?: string;
  phone: string;
  email: string;
  isWaliKelas: boolean;
  photoUrl?: string;
  education?: string;
  isHomeroomTeacher?: boolean;
  role?: string;
  jabatan?: string;
  status?: string;
}

export interface PresensiRecord {
  id: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  notes?: string;
  checkInTime?: string;
}

export interface PresensiGuruRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Dinas';
  notes?: string;
  activitySummary?: string;
}

export interface EraporRecord {
  id: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  nilaiAgama: string;
  jatiDiri: string;
  dasarLiterasiSteam: string;
  perkembanganFisikMotorik: string;
  catatanWaliKelas: string;
  teacherName: string;
  createdAt: string;
}

export interface AnecdotRecord {
  id: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  date: string;
  time: string;
  location: string;
  observedBehavior: string;
  teacherAnalysis: string;
  followUp: string;
  photoUrl?: string;
}

export interface SPPBill {
  id: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  month: string;
  year: number;
  sppAmount: number;
  amount?: number;
  gedungAmount?: number;
  status: 'Lunas' | 'Belum Bayar' | 'Pending' | 'LUNAS' | 'PAID' | 'UNPAID';
  paidAt?: string;
  paymentMethod?: string;
  receiptNo?: string;
}

export interface BookConnection {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  mealNote: string;
  sleepNote: string;
  mood: string;
  teacherMessage: string;
  parentReply?: string;
  lastUpdated: string;
}

export interface TahfidzProgress {
  id: string;
  studentId: string;
  studentName: string;
  surahName: string;
  ayatProgress: string;
  status: 'Lancar' | 'Mengulang' | 'Belum Bimbingan';
  date: string;
  notes?: string;
}

export interface KMSHealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  checkDate: string;
  heightCm: number;
  weightKg: number;
  headCircumferenceCm: number;
  dentalHealth: string;
  immunizationStatus: string;
  doctorNotes?: string;
}

export type KMSRecord = KMSHealthRecord;
export type AnekdotRecord = AnecdotRecord;

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  category: 'Akademik' | 'Kegiatan' | 'Libur' | 'Market Day' | 'Manasik';
  description: string;
  location?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'APE Luar' | 'APE Dalam' | 'Elektronik' | 'Mebel' | 'Buku';
  quantity: number;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  location: string;
}

export interface CateringMenu {
  id: string;
  dayName: string;
  date: string;
  mainCourse: string;
  snack: string;
  drink: string;
  nutritionalInfo: string;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  assignedStudentsCount: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  userRole?: UserRole | string;
  action: string;
  targetModule: string;
  module?: string;
  timestamp: string;
  details?: string;
}

// Sprint W26 & W27 - Living Website CMS & Quality Engine Interfaces
export interface WebsiteHomepageConfig {
  headline: string;
  subtitle: string;
  heroImage: string;
  youtubeUrl: string;
  ctaText: string;
  ctaLink: string;
  runningText: string;
  highlights: string[];
  sectionOrder: string[]; // e.g. ['hero', 'program', 'guru', 'galeri', 'prestasi', 'ppdb', 'footer']
}

export interface WebsiteProgram {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  ageGroup: string;
  schedule: string;
  isFeatured: boolean;
}

export interface WebsiteTeacherPublic {
  id: string;
  name: string;
  title: string;
  position: string;
  quote: string;
  photoUrl: string;
  experienceYears: number;
}

export interface WebsiteAchievement {
  id: string;
  title: string;
  winnerName: string;
  category: string;
  year: string;
  level: string;
  badgeIcon: string;
}

export interface WebsiteAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  urgency: 'Penting' | 'Biasa' | 'Info';
  isPublished: boolean;
}

export interface WebsiteFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface WebsiteEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Market Day' | 'Manasik' | 'Outing' | 'Lomba' | 'PHBI' | 'Hari Nasional';
  description: string;
  isPast?: boolean;
}

// Sprint W27 Additions
export interface PublicStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAchievements: number;
  ppdbStatus: string;
  ppdbQuotaRemaining: number;
  activeAcademicYear: string;
}

export type SeasonalPreset = 'auto' | 'ppdb' | 'ramadhan' | 'agustus' | 'hari-guru' | 'awal-tahun' | 'normal';

export interface SmartQuote {
  id: string;
  text: string;
  source: string;
  category: 'Hadits' | 'Doa' | 'Quote Parenting' | 'Inspirasi';
  isFeatured: boolean;
}

export interface WebsiteProductionLock {
  isLocked: boolean;
  protectedSections: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  author: string;
}

// TADE v25.0 Enterprise Intelligence Foundation Types
export interface PaymentSettings {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankInstructions?: string;
  walletDanaNumber: string;
  walletOvoNumber: string;
  walletGopayNumber: string;
  walletShopeeNumber: string;
  qrisNmsId: string;
  qrisImageUrl: string;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
}

export type QRPurpose = 'PAYMENT' | 'STUDENT_CARD' | 'TEACHER_CARD' | 'GUEST_BOOK' | 'INVENTORY' | 'OFFICIAL_DOC' | 'ATTENDANCE';

export interface QRTokenRecord {
  id: string;
  tokenId: string;
  purpose: QRPurpose;
  targetId: string;
  title: string;
  metadata: Record<string, any>;
  expiryTime: string;
  scannedCount: number;
  maxScans: number; // -1 for unlimited
  status: 'ACTIVE' | 'EXPIRED' | 'USED' | 'REVOKED';
  createdBy: string;
  createdAt: string;
  lastScannedAt?: string;
  lastScannedBy?: string;
}

export interface QRScanLog {
  id: string;
  tokenId: string;
  action: 'QR_SCANNED' | 'QR_FAILED' | 'QR_EXPIRED' | 'QR_ACCESS_DENIED';
  scannedBy: string;
  role: UserRole;
  ipAddress?: string;
  deviceInfo?: string;
  timestamp: string;
  details: string;
}

export interface SystemConflictItem {
  id: string;
  type: 'DUPLICATE_FUNCTION' | 'COLLECTION_COLLISION' | 'ROUTE_CONFLICT' | 'COMPONENT_CONFLICT';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  location: string;
  suggestedFix: string;
  detectedAt: string;
}

export interface AIMaintenanceQueryResult {
  query: string;
  response: string;
  sources: KnowledgeIndexItem[];
  recoverySteps: string[];
  timestamp: string;
}

// TADE v25.1 Enterprise Reliability & Autonomous Operations Types
export interface TransactionLockRecord {
  lockKey: string;
  operationType: string;
  lockedBy: string;
  lockedAt: string;
  expiresAt: string;
  metadata?: Record<string, any>;
}

export interface IdempotencyRecord {
  requestId: string;
  action: string;
  userUid: string;
  createdAt: string;
  completedAt?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  result?: any;
}

export interface SystemConfigRegistryItem {
  key: string;
  category: 'SCHOOL' | 'PAYMENT' | 'WEBSITE' | 'NOTIFICATION' | 'QR' | 'AI' | 'BACKUP' | 'THEME';
  version: number;
  value: any;
  updatedBy: string;
  updatedAt: string;
  notes?: string;
}

export interface SchedulerTaskLog {
  id: string;
  taskName: 'AUTO_BACKUP' | 'QR_CLEANUP' | 'TEMP_CLEANUP' | 'KNOWLEDGE_REINDEX' | 'HEALTH_SCAN' | 'ARCHIVE_VERIFICATION' | 'NOTIFICATION_CLEANUP' | 'AUDIT_OPTIMIZATION';
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  executedAt: string;
  durationMs: number;
  details: string;
  itemsProcessed: number;
}

export interface EnterpriseObservabilityMetrics {
  timestamp: string;
  firestoreReadEstimate: number;
  firestoreWriteEstimate: number;
  storageUsageBytesEstimate: number;
  avgQueryTimeMs: number;
  authFailuresCount: number;
  activeNotificationQueue: number;
  pendingApprovalQueue: number;
  activeTransactionLocks: number;
  schedulerHealthStatus: 'OPTIMAL' | 'DEGRADED' | 'DOWN';
  activeRealtimeListeners: number;
  memoryUsageMBEstimate: number;
}

// ====================================================
// TADE v25.3 ENTERPRISE DATA GOVERNANCE & PRIVACY TYPES
// ====================================================

export interface RecordVersionLog {
  id: string;
  recordId: string;
  collectionName: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  changedFields: string[];
  editorUid: string;
  editorName: string;
  editorRole: UserRole;
  timestamp: string;
  correlationId: string;
  rollbackReference?: string;
}

export interface DataLineageNode {
  id: string;
  entityType: 'PPDB' | 'STUDENT' | 'PAYMENT' | 'DOCUMENT' | 'ARCHIVE' | 'BACKUP' | 'AUDIT';
  title: string;
  timestamp: string;
  actor: string;
  details: string;
  parentId?: string;
  children?: DataLineageNode[];
}

export interface DataCloneCheckItem {
  id: string;
  category:
    | 'DUPLICATE_DOCUMENT'
    | 'DUPLICATE_PAYMENT'
    | 'DUPLICATE_ARCHIVE'
    | 'DUPLICATE_NOTIFICATION'
    | 'DUPLICATE_APPROVAL'
    | 'DUPLICATE_QR'
    | 'DUPLICATE_BACKUP'
    | 'DUPLICATE_SCHEDULER'
    | 'DUPLICATE_GENERATOR'
    | 'DUPLICATE_FIRESTORE_PATH'
    | 'DUPLICATE_ROUTE'
    | 'DUPLICATE_SERVICE'
    | 'DUPLICATE_REACT_CONTEXT'
    | 'DUPLICATE_HOOK'
    | 'DUPLICATE_STORAGE_FOLDER'
    | 'DUPLICATE_SEQUENCE_NUMBER';
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  detectedAt: string;
}

export interface ConfigValidationItem {
  module: 'PAYMENT' | 'QR' | 'WEBSITE' | 'THEME' | 'SCHOOL_PROFILE' | 'SMTP' | 'NOTIFICATION' | 'BACKUP' | 'AI' | 'STORAGE';
  status: 'VALID' | 'WARNING';
  message: string;
  recommendation?: string;
  checkedAt: string;
}

export type UniversalAuditAction =
  | 'HOVER' | 'DOWNLOAD' | 'UPLOAD' | 'PREVIEW' | 'EXPORT' | 'SEARCH' | 'FILTER' | 'SORT'
  | 'AI' | 'NOTIFICATION' | 'SCHEDULER' | 'BACKUP' | 'RESTORE' | 'QR_SCAN' | 'BARCODE'
  | 'PDF_EXPORT' | 'EXCEL_EXPORT' | 'LOGIN' | 'LOGOUT' | 'TIMEOUT' | 'SESSION_REFRESH'
  | 'RBAC_DENY' | 'SOFT_DELETE' | 'PERMANENT_DELETE' | 'RECORD_RESTORE' | 'CONFIG_UPDATE'
  | 'THEME_UPDATE' | 'WEBSITE_PUBLISH' | 'PAYMENT_VERIFY' | 'DOCUMENT_APPROVE' | 'ARCHIVE_RESTORE';

export interface UniversalAuditLog {
  id: string;
  timestamp: string;
  uid: string;
  userName: string;
  role: UserRole;
  action: UniversalAuditAction;
  targetModule: string;
  targetId?: string;
  details?: string;
  correlationId?: string;
  ipAddress?: string;
}

export const DATA_RETENTION_POLICIES = {
  audit_logs: { name: 'Audit Logs', days: 3650, retentionLabel: '10 Tahun' },
  documents: { name: 'Dokumen', days: Infinity, retentionLabel: 'Selamanya' },
  digital_archives: { name: 'Smart Archive', days: Infinity, retentionLabel: 'Selamanya' },
  notifications: { name: 'Notifikasi', days: 365, retentionLabel: '365 Hari' },
  qr_tokens: { name: 'Token QR', days: 30, retentionLabel: '30 Hari' },
  health_reports: { name: 'Laporan Kesehatan', days: 730, retentionLabel: '2 Tahun' },
  approval_requests: { name: 'Permohonan Persetujuan', days: Infinity, retentionLabel: 'Selamanya' },
  payment: { name: 'Transaksi Pembayaran', days: Infinity, retentionLabel: 'Selamanya' },
  knowledge_index: { name: 'Indeks Pengetahuan', days: Infinity, retentionLabel: 'Selamanya' },
};

// ====================================================
// TADE v25.4 ENTERPRISE CORE GOVERNANCE ENGINE TYPES
// ====================================================

export type FeatureFlagMode = 'ENABLED' | 'DISABLED' | 'MAINTENANCE' | 'READ_ONLY';

export interface FeatureFlagRegistryItem {
  key: string;
  name: string;
  category: 'CORE' | 'AI' | 'PAYMENT' | 'MEDIA' | 'GOVERNANCE';
  mode: FeatureFlagMode;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

export type QueueTaskType =
  | 'GENERATE_PDF'
  | 'GENERATE_EXCEL'
  | 'SYSTEM_BACKUP'
  | 'SYSTEM_RESTORE'
  | 'KNOWLEDGE_INDEX'
  | 'HEALTH_SCAN'
  | 'ARCHIVE_VERIFICATION'
  | 'QR_CLEANUP'
  | 'NOTIFICATION_BROADCAST'
  | 'BULK_IMPORT'
  | 'BULK_EXPORT';

export interface QueueTaskItem {
  id: string;
  type: QueueTaskType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  progress: number;
  retryCount: number;
  maxRetries: number;
  durationMs: number;
  correlationId: string;
  payload?: any;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SessionSecurityRecord {
  id: string;
  uid: string;
  userName: string;
  role: UserRole;
  deviceName: string;
  browser: string;
  ipAddress: string;
  loginAt: string;
  lastActiveAt: string;
  isTrustedDevice: boolean;
  isConcurrent: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'LOGGED_OUT' | 'REVOKED';
}

export interface ReferentialIntegrityIssue {
  id: string;
  parentEntity: string;
  childEntity: string;
  orphanId: string;
  issueDescription: string;
  recommendation: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
}

export interface EnterpriseGovernanceScores {
  healthScore: number;
  conflictScore: number;
  integrityScore: number;
  securityScore: number;
  recoveryScore: number;
  cpuEstimatePercent: number;
  memoryEstimateMB: number;
  firestoreReadsCount: number;
  firestoreWritesCount: number;
  storageUsageMB: number;
  queuePendingCount: number;
  approvalPendingCount: number;
}

// ====================================================
// TADE v25.5 ENTERPRISE OPERATIONS & DISASTER RESILIENCE TYPES
// ====================================================

export type DisasterComponentType =
  | 'FIRESTORE'
  | 'STORAGE'
  | 'QR_STAMP'
  | 'PAYMENT'
  | 'SCHEDULER'
  | 'NOTIFICATION'
  | 'ARCHIVE'
  | 'BACKUP'
  | 'RESTORE'
  | 'AUTH'
  | 'AI_ENGINE'
  | 'KNOWLEDGE';

export interface DisasterRecoveryPlaybookItem {
  id: string;
  component: DisasterComponentType;
  title: string;
  symptoms: string[];
  possibleCauses: string[];
  verificationSteps: string[];
  recoverySteps: string[];
  estimatedImpact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rollbackStrategy: string;
  status: 'READY' | 'DEGRADED' | 'TESTED';
}

export interface PerformanceBaselineItem {
  metricKey: string;
  name: string;
  currentValueMs: number;
  baselineValueMs: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'WARNING';
  thresholdWarningMs: number;
}

export interface ReleaseReadinessCheckItem {
  id: string;
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string;
  checkedAt: string;
}

export interface AIChangeImpactReport {
  targetModule: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  impactedModules: string[];
  affectedCollections: string[];
  affectedQueues: string[];
  recommendations: string[];
}

// ====================================================
// TADE v26 ENTERPRISE AI OPERATING SYSTEM TYPES
// ====================================================

export interface AIActiveContext {
  currentModule: string;
  currentUser: string;
  userRole: UserRole | string;
  currentPage: string;
  selectedRecordId?: string;
  activeStudentName?: string;
  activePaymentId?: string;
  activeDocumentId?: string;
  activeArchiveId?: string;
  pendingApprovalsCount: number;
  systemHealthStatus: string;
  knowledgeIndexCount: number;
}

export type AIActionType =
  | 'GENERATE_DOCUMENT'
  | 'GENERATE_REPORT'
  | 'GENERATE_RECEIPT'
  | 'GENERATE_ARCHIVE'
  | 'GENERATE_ANNOUNCEMENT'
  | 'GENERATE_SCHEDULE'
  | 'GENERATE_STORY'
  | 'CREATE_BACKUP_SUMMARY';

export interface AIProposedAction {
  id: string;
  title: string;
  actionType: AIActionType;
  targetModule: string;
  payload: Record<string, any>;
  requiresHumanConfirmation: true;
  confirmed: boolean;
  status: 'PROPOSED' | 'EXECUTED' | 'CANCELLED';
  createdAt: string;
}

export interface AIWorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  moduleCode: string;
}

export interface AIWorkflowGuide {
  id: string;
  workflowName: string;
  currentStepIndex: number;
  steps: AIWorkflowStep[];
}

export interface AIExplainedItem {
  title: string;
  simpleIndonesian: string;
  seniorTeacherSummary: string;
  technicalDetails?: string;
}

export interface AITranslatedError {
  originalError: string;
  problemIndonesian: string;
  possibleCause: string;
  recoverySteps: string[];
  estimatedSolutionTime: string;
}

export interface AIRoleRecommendation {
  id: string;
  targetRole: UserRole | 'ALL';
  category: 'HEALTH' | 'PAYMENT' | 'APPROVAL' | 'ATTENDANCE' | 'SECURITY' | 'BACKUP';
  title: string;
  actionableAdvice: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AISchoolAdvisorReport {
  overallScore: number;
  healthInsight: string;
  securityInsight: string;
  financialInsight: string;
  backupInsight: string;
  verifiedRecommendations: string[];
  hallucinationChecked: true;
  generatedAt: string;
}

export interface AIMaintenanceReport {
  issueSummary: string;
  rootCause: string;
  affectedModules: string[];
  estimatedRecoveryMinutes: number;
  mitigationSteps: string[];
}

export interface AIConstitutionLawCheck {
  lawNumber: number;
  lawName: string;
  status: 'PASS' | 'VIOLATION';
  notes: string;
}

export interface AIConstitutionAuditResult {
  timestamp: string;
  passed: boolean;
  lawsChecked: AIConstitutionLawCheck[];
  violationsCount: number;
  auditChecksum: string;
}

export interface VoiceCommandInterface {
  isListening: boolean;
  transcript: string;
  supportedCommands: string[];
  mode: 'STT_READY' | 'TTS_READY' | 'IDLE';
}

export interface EnterpriseEvolutionReport {
  timestamp: string;
  targetModification: string;
  riskScore: number;
  affectedModulesCount: number;
  affectedCollections: string[];
  affectedComponents: string[];
  affectedSchedulerTasks: string[];
  recommendation: 'PROCEED_SAFE' | 'PROCEED_WITH_BACKUP' | 'HALT_HIGH_RISK';
}

export interface EnterpriseReleaseQualityScore {
  overallEnterpriseScore: number;
  architectureScore: number;
  maintainabilityScore: number;
  performanceScore: number;
  securityScore: number;
  accessibilityScore: number;
  aiScore: number;
  backupScore: number;
  recoveryScore: number;
  animationScore: number;
  databaseScore: number;
  calculatedAt: string;
}

// AI Asy Living Character Mascot CMS Configuration Types
export type AIAsyOutfitTheme = 'DEFAULT_UNIFORM' | 'BATIK' | 'PE_CLOTHES' | 'RAMADAN' | 'INDEPENDENCE_DAY' | 'GRADUATION';
export type AIAsyExpression = 'SMILE' | 'THOUGHTFUL' | 'CHEERFUL' | 'READING' | 'PRAYING';
export type AIAsyActivityState = 'READING_BOOK' | 'WATERING_FLOWERS' | 'CHASING_BUTTERFLY' | 'DRAWING' | 'HELPING_TEACHER' | 'LEARNING' | 'RECITING_QURAN' | 'WAVING' | 'PRAYING';

export interface AIAsyCharacterConfig {
  isEnabled: boolean;
  activeOutfit: AIAsyOutfitTheme;
  animationIntensity: 'LOW' | 'NORMAL' | 'HIGH';
  timeScheduleSync: boolean;
  pageVisibility: {
    w1Hero: boolean;
    w2Program: boolean;
    w3Galeri: boolean;
    w4PPDB: boolean;
    w5Kontak: boolean;
    footer: boolean;
    dashboardGuru: boolean;
    dashboardAdmin: boolean;
    dashboardKepsek: boolean;
    dashboardYayasan: boolean;
    dashboardParent: boolean;
  };
  customGreetings: {
    w1Hero?: string;
    w2Program?: string;
    w3Galeri?: string;
    w4PPDB?: string;
    w5Kontak?: string;
    footer?: string;
    dashboardGuru?: string;
    dashboardAdmin?: string;
    dashboardKepsek?: string;
    dashboardYayasan?: string;
    dashboardParent?: string;
  };
}

// FIND-04 — Unified Financial Ecosystem Master Types
export type FinancialAccountType = 'BANK' | 'E_WALLET' | 'CASH' | 'QRIS_SETTLEMENT' | 'OTHER';

export interface FinancialAccount {
  accountId: string;
  accountName: string;
  accountType: FinancialAccountType;
  institution: string;
  accountIdentifier: string;
  accountHolder: string;
  isActive: boolean;
  openingBalance: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type UnifiedTransactionType = 
  | 'SPP_PAYMENT' 
  | 'SAVINGS_DEPOSIT' 
  | 'SAVINGS_WITHDRAWAL' 
  | 'OPERATIONAL_EXPENSE' 
  | 'PAYROLL_DISBURSEMENT' 
  | 'ACCOUNT_TRANSFER' 
  | 'ADJUSTMENT';

export type UnifiedTransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'POSTED' | 'REVERSED';

export interface UnifiedFinancialTransaction {
  id: string;
  paymentId?: string;
  transactionNumber: string;
  type: UnifiedTransactionType;
  category: string;
  amount: number;
  direction: 'INFLOW' | 'OUTFLOW';
  sourceAccountId?: string;
  destinationAccountId?: string;
  studentId?: string;
  studentName?: string;
  employeeId?: string;
  employeeName?: string;
  payerId?: string;
  payerName?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: UnifiedTransactionStatus;
  notes?: string;
  receiptUrl?: string;
  proofUrl?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  postedBy?: string;
  postedAt?: string;
  reversalOfId?: string;
  reversalReason?: string;
}

export interface LedgerEntry {
  id: string;
  paymentId?: string;
  transactionId: string;
  transactionDate: string;
  debitAccountCode: string;
  debitAccountName: string;
  debitAmount: number;
  creditAccountCode: string;
  creditAccountName: string;
  creditAmount: number;
  category: string;
  description: string;
  referenceId?: string;
  studentId?: string;
  employeeId?: string;
  postedBy: string;
  createdAt: string;
  isBalanced: boolean;
}

export interface StudentSavingsAccount {
  studentId: string;
  studentName: string;
  classGroup?: string;
  parentUid: string;
  parentName?: string;
  openingBalance: number;
  currentBalance: number;
  lastTransactionAt: string;
  updatedAt: string;
}

export interface SavingsTransaction {
  id: string;
  studentId: string;
  studentName?: string;
  parentUid: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'REVERSAL';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  paymentMethod: PaymentMethod;
  sourceAccountId?: string;
  destinationAccountId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'POSTED';
  description: string;
  referenceId?: string;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface SavingsWithdrawalRequest {
  id: string;
  requestNumber: string;
  studentId: string;
  studentName: string;
  parentUid: string;
  parentName?: string;
  amount: number;
  reason: string;
  destinationMethod: PaymentMethod;
  destinationBank?: string;
  destinationAccount?: string;
  destinationHolder?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'POSTED';
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  disbursedBy?: string;
  disbursedAt?: string;
  rejectionReason?: string;
  receiptUrl?: string;
}

export interface OperationalExpense {
  id: string;
  expenseNumber: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  sourceAccountId: string;
  sourceAccountName?: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'POSTED' | 'REJECTED';
  proofUrl?: string;
  createdAt: string;
  approvedAt?: string;
  postedAt?: string;
}

export interface EmployeePaymentProfile {
  id: string;
  userId: string;
  employeeName: string;
  role: string;
  paymentMethod: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  walletProvider?: EWalletProvider;
  walletNumber?: string;
  isVerified: boolean;
  updatedAt: string;
}

export interface PayrollRecord {
  id: string;
  payrollNumber: string;
  period: string; // YYYY-MM
  userId: string;
  employeeName: string;
  employeeRole: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  sourceAccountId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'POSTED';
  payslipUrl?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  approvedAt?: string;
  postedAt?: string;
}

export interface FinancialPeriodClosing {
  id: string;
  period: string; // YYYY-MM or YYYY
  type: 'MONTHLY' | 'YEARLY';
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalPayroll: number;
  totalSavingsInflow: number;
  totalSavingsOutflow: number;
  closingBalance: number;
  status: 'OPEN' | 'CLOSED' | 'REOPENED';
  closedBy?: string;
  closedAt?: string;
  reopenedBy?: string;
  reopenedAt?: string;
  notes?: string;
}

export interface FinancialReconciliation {
  id: string;
  reconciliationDate: string;
  period: string;
  accountId: string;
  accountName: string;
  statementBalance: number;
  ledgerBalance: number;
  difference: number;
  status: 'MATCHED' | 'DISCREPANCY' | 'ADJUSTED';
  notes?: string;
  reconciledBy: string;
  createdAt: string;
}








