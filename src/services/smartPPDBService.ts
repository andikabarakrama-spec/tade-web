/**
 * SMART PPDB FINALIZATION SERVICE — SPRINT G8
 * Comprehensive Admission & Multi-Level Verification Lifecycle for SIM Asy Syifa Tanggul.
 * Features: Mandatory Document Checklist (Akta, KK, Foto, KMS, Pernyataan),
 * Multi-Level Approval Pipeline (Admin SIM -> Keuangan -> Kepala Sekolah),
 * Wave Timeline & Quotas, Automated Gentle Family Notifications.
 * Pure Brand: Asy Syifa Sovereign Admissions.
 */

export type PPDBStage = 
  | 'PENDAFTARAN' 
  | 'VERIFIKASI_BERKAS' 
  | 'OBSERVASI_ANAK' 
  | 'VALIDASI_KEUANGAN' 
  | 'APPROVAL_KEPSEK' 
  | 'RESMI_DITERIMA' 
  | 'DITOLAK';

export interface PPDBCandidateDocument {
  id: string;
  name: string;
  required: boolean;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MISSING';
  fileUrl?: string;
  notes?: string;
  verifiedBy?: string;
}

export interface MultiLevelApprovalState {
  adminReviewed: boolean;
  adminReviewedBy?: string;
  adminReviewedAt?: string;
  financeApproved: boolean;
  financeApprovedBy?: string;
  financeApprovedAt?: string;
  principalApproved: boolean;
  principalApprovedBy?: string;
  principalApprovedAt?: string;
}

export interface SmartPPDBRecord {
  id: string;
  regNumber: string;
  studentName: string;
  nickname: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthDate: string;
  parentName: string;
  parentPhone: string;
  targetClass: 'Kelompok Bermain (KB)' | 'TK A' | 'TK B';
  wave: 'Gelombang 1 (Early Bird)' | 'Gelombang 2 (Reguler)' | 'Gelombang 3 (Susulan)';
  stage: PPDBStage;
  documents: PPDBCandidateDocument[];
  approvals: MultiLevelApprovalState;
  paymentStatus: 'LUNAS_FORMULIR' | 'MENUNGGU_PEMBAYARAN' | 'BEASISWA';
  submittedDate: string;
  notes: string;
}

export interface PPDBWaveInfo {
  id: string;
  name: string;
  period: string;
  quotaTotal: number;
  quotaFilled: number;
  status: 'OPEN' | 'UPCOMING' | 'CLOSED';
  benefit: string;
}

export class SmartPPDBService {
  private static instance: SmartPPDBService | null = null;
  private candidates: SmartPPDBRecord[] = [];
  private waves: PPDBWaveInfo[] = [];

  public static getInstance(): SmartPPDBService {
    if (!SmartPPDBService.instance) {
      SmartPPDBService.instance = new SmartPPDBService();
    }
    return SmartPPDBService.instance;
  }

  constructor() {
    this.initDefaultWaves();
    this.initSampleCandidates();
  }

  private initDefaultWaves(): void {
    this.waves = [
      {
        id: 'WAVE-1',
        name: 'Gelombang 1 (Early Bird & Alumni Family)',
        period: '1 Jan 2026 - 31 Mar 2026',
        quotaTotal: 30,
        quotaFilled: 28,
        status: 'CLOSED',
        benefit: 'Bebas Biaya Formulir & Potongan Seragam 15%'
      },
      {
        id: 'WAVE-2',
        name: 'Gelombang 2 (Reguler Utama)',
        period: '1 Apr 2026 - 30 Jun 2026',
        quotaTotal: 40,
        quotaFilled: 36,
        status: 'OPEN',
        benefit: 'Paket Perlengkapan Sentra Islami Lengkap'
      },
      {
        id: 'WAVE-3',
        name: 'Gelombang 3 (Susulan & Pindahan)',
        period: '1 Jul 2026 - 15 Agu 2026',
        quotaTotal: 15,
        quotaFilled: 8,
        status: 'OPEN',
        benefit: 'Alokasi Terbatas Kursi Sentra'
      }
    ];
  }

  private initSampleCandidates(): void {
    this.candidates = [
      {
        id: 'PPDB-2026-001',
        regNumber: 'REG/2026/08/001',
        studentName: 'Muhammad Farhan Al-Fatih',
        nickname: 'Farhan',
        gender: 'Laki-laki',
        birthDate: '12 Mei 2021',
        parentName: 'Hendra Gunawan (Ayah)',
        parentPhone: '081234567890',
        targetClass: 'TK A',
        wave: 'Gelombang 2 (Reguler)',
        stage: 'APPROVAL_KEPSEK',
        documents: [
          { id: 'doc-1', name: 'Kartu Keluarga (KK)', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-2', name: 'Akta Kelahiran', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-3', name: 'Foto Siswa (3x4)', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-4', name: 'Riwayat Imunisasi / KMS', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-5', name: 'Surat Pernyataan Komitmen', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' }
        ],
        approvals: {
          adminReviewed: true,
          adminReviewedBy: 'Admin SIM (Ustadzah Fatimah)',
          adminReviewedAt: '12 Agu 2026, 09:15 WIB',
          financeApproved: true,
          financeApprovedBy: 'Bendahara Madrasah',
          financeApprovedAt: '12 Agu 2026, 11:30 WIB',
          principalApproved: false
        },
        paymentStatus: 'LUNAS_FORMULIR',
        submittedDate: '10 Agu 2026',
        notes: 'Anak aktif, sudah hafal doa harian dan Surat Al-Fatihah. Siap observasi kelas.'
      },
      {
        id: 'PPDB-2026-002',
        regNumber: 'REG/2026/08/002',
        studentName: 'Aisyah Zahira Syifa',
        nickname: 'Zahira',
        gender: 'Perempuan',
        birthDate: '24 Sep 2021',
        parentName: 'Ibu Ratna Dewi',
        parentPhone: '085678901234',
        targetClass: 'Kelompok Bermain (KB)',
        wave: 'Gelombang 2 (Reguler)',
        stage: 'VERIFIKASI_BERKAS',
        documents: [
          { id: 'doc-1', name: 'Kartu Keluarga (KK)', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-2', name: 'Akta Kelahiran', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-3', name: 'Foto Siswa (3x4)', required: true, status: 'PENDING' },
          { id: 'doc-4', name: 'Riwayat Imunisasi / KMS', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-5', name: 'Surat Pernyataan Komitmen', required: true, status: 'PENDING' }
        ],
        approvals: {
          adminReviewed: false,
          financeApproved: false,
          principalApproved: false
        },
        paymentStatus: 'LUNAS_FORMULIR',
        submittedDate: '14 Agu 2026',
        notes: 'Menunggu kelengkapan pas foto siswa dan surat pernyataan bertandatangan.'
      },
      {
        id: 'PPDB-2026-003',
        regNumber: 'REG/2026/08/003',
        studentName: 'Zaid bin Tsabit Pratama',
        nickname: 'Zaid',
        gender: 'Laki-laki',
        birthDate: '18 Nov 2020',
        parentName: 'Ahmad Fauzi (Ayah)',
        parentPhone: '087812345678',
        targetClass: 'TK B',
        wave: 'Gelombang 1 (Early Bird)',
        stage: 'RESMI_DITERIMA',
        documents: [
          { id: 'doc-1', name: 'Kartu Keluarga (KK)', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-2', name: 'Akta Kelahiran', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-3', name: 'Foto Siswa (3x4)', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-4', name: 'Riwayat Imunisasi / KMS', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' },
          { id: 'doc-5', name: 'Surat Pernyataan Komitmen', required: true, status: 'VERIFIED', verifiedBy: 'Admin SIM' }
        ],
        approvals: {
          adminReviewed: true,
          adminReviewedBy: 'Admin SIM',
          adminReviewedAt: '05 Agu 2026',
          financeApproved: true,
          financeApprovedBy: 'Bendahara Madrasah',
          financeApprovedAt: '06 Agu 2026',
          principalApproved: true,
          principalApprovedBy: 'Kepala Sekolah (Ustadzah Nurul)',
          principalApprovedAt: '07 Agu 2026'
        },
        paymentStatus: 'LUNAS_FORMULIR',
        submittedDate: '01 Agu 2026',
        notes: 'Lulus seleksi dan telah diterbitkan Nomor Induk Siswa (NIS).'
      }
    ];
  }

  public getCandidates(): SmartPPDBRecord[] {
    return [...this.candidates];
  }

  public getWaves(): PPDBWaveInfo[] {
    return [...this.waves];
  }

  public approveLevel(
    candidateId: string,
    level: 'ADMIN' | 'FINANCE' | 'PRINCIPAL',
    approverName: string
  ): SmartPPDBRecord | null {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return null;

    const now = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    if (level === 'ADMIN') {
      candidate.approvals.adminReviewed = true;
      candidate.approvals.adminReviewedBy = approverName;
      candidate.approvals.adminReviewedAt = now;
      candidate.stage = 'VALIDASI_KEUANGAN';
    } else if (level === 'FINANCE') {
      candidate.approvals.financeApproved = true;
      candidate.approvals.financeApprovedBy = approverName;
      candidate.approvals.financeApprovedAt = now;
      candidate.stage = 'APPROVAL_KEPSEK';
    } else if (level === 'PRINCIPAL') {
      candidate.approvals.principalApproved = true;
      candidate.approvals.principalApprovedBy = approverName;
      candidate.approvals.principalApprovedAt = now;
      candidate.stage = 'RESMI_DITERIMA';
    }

    return { ...candidate };
  }

  public updateDocumentStatus(
    candidateId: string,
    docId: string,
    status: 'VERIFIED' | 'REJECTED' | 'PENDING',
    verifier: string
  ): void {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    const doc = candidate.documents.find(d => d.id === docId);
    if (doc) {
      doc.status = status;
      doc.verifiedBy = verifier;
    }
  }
}

export const smartPPDBService = SmartPPDBService.getInstance();
