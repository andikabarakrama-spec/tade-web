import { UserRole } from '../../types';
import { TaskPriorityLevel } from './IntelligentPriorityEngine';

export interface ExecutiveInboxMessage {
  id: string;
  senderTitle: string;
  subject: string;
  summary: string;
  category: 'STRATEGIC_POLICY' | 'FINANCIAL_OVERSIGHT' | 'ACADEMIC_GOVERNANCE' | 'SYSTEM_SECURITY' | 'STAFF_HR';
  priority: TaskPriorityLevel;
  timestamp: string;
  actionRequired: 'APPROVE_REJECT' | 'ACKNOWLEDGE_ONLY' | 'DELEGATE' | 'REVIEW_REPORT';
  targetExecutive: 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'SUPER_ADMIN' | 'ALL_EXECUTIVES';
  isRead: boolean;
  referenceDocId?: string;
}

export class ExecutiveInboxEngine {
  private static instance: ExecutiveInboxEngine;

  private messages: ExecutiveInboxMessage[] = [
    {
      id: 'INBOX-YAYASAN-01',
      senderTitle: 'Direktorat Keuangan & Perbankan',
      subject: 'Laporan Posisi Kas & Likuiditas Dana Abadi Yayasan Bulan Ini',
      summary: 'Realisasi penerimaan SPP dan infaq mencapai 94.2% dari target anggaran. Tidak ditemukan anomali defisit.',
      category: 'FINANCIAL_OVERSIGHT',
      priority: 'HIGH',
      timestamp: '2026-08-18T03:30:00Z',
      actionRequired: 'REVIEW_REPORT',
      targetExecutive: 'KETUA_YAYASAN',
      isRead: false
    },
    {
      id: 'INBOX-YAYASAN-02',
      senderTitle: 'Dewan Pengawas & Legalitas',
      subject: 'Permohonan Pengesahan Perubahan Anggaran Sarpras Semester Ganjil',
      summary: 'Pengajuan belanja renovasi APE sentra luar dan instalasi pelindung keamanan ruang kelas kelompok B.',
      category: 'STRATEGIC_POLICY',
      priority: 'HIGH',
      timestamp: '2026-08-17T14:15:00Z',
      actionRequired: 'APPROVE_REJECT',
      targetExecutive: 'KETUA_YAYASAN',
      isRead: true
    },
    {
      id: 'INBOX-KEPSEK-01',
      senderTitle: 'Tim Pengembang Kurikulum Asy-Syifa',
      subject: 'Draf Final Capaian Pembelajaran Kurikulum Merdeka PAUD',
      summary: 'Modul ajar sentra dan integrasi pembiasaan nilai-nilai Islam telah siap untuk disahkan Kepala Sekolah.',
      category: 'ACADEMIC_GOVERNANCE',
      priority: 'CRITICAL',
      timestamp: '2026-08-18T04:00:00Z',
      actionRequired: 'APPROVE_REJECT',
      targetExecutive: 'KEPALA_SEKOLAH',
      isRead: false
    },
    {
      id: 'INBOX-KEPSEK-02',
      senderTitle: 'Koordinator Presensi & Kesiswaan',
      subject: 'Laporan Tingkat Kehadiran & Rekapitulasi Sakit Santri Pekan Ini',
      summary: 'Tingkat kehadiran 97.8%. Seluruh catatan anekdot harian telah terekam lengkap di SSoT.',
      category: 'STAFF_HR',
      priority: 'MEDIUM',
      timestamp: '2026-08-18T02:00:00Z',
      actionRequired: 'ACKNOWLEDGE_ONLY',
      targetExecutive: 'KEPALA_SEKOLAH',
      isRead: false
    },
    {
      id: 'INBOX-ADMIN-01',
      senderTitle: 'Guardian Ring-0 Security Core',
      subject: 'Laporan Integritas Audit RC88: Zero Drift & Safe Invariant',
      summary: 'Pemindaian 6 vektor struktural tervalidasi 100% konsisten. Tidak ditemukan duplikasi registry maupun leak auth.',
      category: 'SYSTEM_SECURITY',
      priority: 'HIGH',
      timestamp: '2026-08-18T04:10:00Z',
      actionRequired: 'ACKNOWLEDGE_ONLY',
      targetExecutive: 'SUPER_ADMIN',
      isRead: false
    },
    {
      id: 'INBOX-ADMIN-02',
      senderTitle: 'Executive Secretariat & Governance',
      subject: 'Permintaan Verifikasi Rilis Kedaulatan RC89 oleh Founder',
      summary: 'Smart Office Enterprise Orchestration layer telah terkompilasi bersih dan siap untuk verifikasi formal.',
      category: 'STRATEGIC_POLICY',
      priority: 'CRITICAL',
      timestamp: '2026-08-18T04:15:00Z',
      actionRequired: 'APPROVE_REJECT',
      targetExecutive: 'SUPER_ADMIN',
      isRead: false
    }
  ];

  public static getInstance(): ExecutiveInboxEngine {
    if (!ExecutiveInboxEngine.instance) {
      ExecutiveInboxEngine.instance = new ExecutiveInboxEngine();
    }
    return ExecutiveInboxEngine.instance;
  }

  public getMessagesForExecutive(executiveRole: 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'SUPER_ADMIN'): ExecutiveInboxMessage[] {
    return this.messages.filter(m => m.targetExecutive === executiveRole || m.targetExecutive === 'ALL_EXECUTIVES');
  }

  public getAllMessages(): ExecutiveInboxMessage[] {
    return this.messages;
  }

  public markAsRead(id: string): void {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.isRead = true;
    }
  }
}
