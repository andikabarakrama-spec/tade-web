import { DataService } from '../../services/db';
import { UserRole } from '../../types/index';
import { IntelligentPriorityEngine, TaskPriorityLevel, PriorityEvaluationResult } from './IntelligentPriorityEngine';

export interface UnifiedQueueItem {
  id: string;
  sourceDomain: 'PPDB' | 'ABSENSI' | 'TABUNGAN' | 'INFAQ' | 'SURAT' | 'PENGUMUMAN';
  title: string;
  description: string;
  sourceEntityId?: string;
  assignedRoles: UserRole[];
  status: 'PENDING' | 'IN_REVIEW' | 'AWAITING_APPROVAL' | 'RESOLVED';
  createdAt: string;
  deadline?: string;
  evaluation: PriorityEvaluationResult;
  directActionLink?: string; // module tab link e.g. 'r13'
}

export class UnifiedAdministrativeQueue {
  private static instance: UnifiedAdministrativeQueue;
  private priorityEngine = IntelligentPriorityEngine.getInstance();

  public static getInstance(): UnifiedAdministrativeQueue {
    if (!UnifiedAdministrativeQueue.instance) {
      UnifiedAdministrativeQueue.instance = new UnifiedAdministrativeQueue();
    }
    return UnifiedAdministrativeQueue.instance;
  }

  public getQueueItems(role?: UserRole): UnifiedQueueItem[] {
    const queue: UnifiedQueueItem[] = [];

    // 1. PPDB Items (Pending student verifications)
    try {
      const evalRes = this.priorityEngine.evaluatePriority({
        impactCategory: 'ACADEMIC_REPORT',
        assignedRole: 'ADMIN',
        isDependencyBlocked: false,
        deadline: '2026-08-30'
      });

      queue.push({
        id: 'QUEUE-PPDB-C001',
        sourceDomain: 'PPDB',
        title: 'Verifikasi Berkas Calon Siswa: Muhammad Al-Fatih',
        description: 'Pendaftaran kelompok A - Validasi NIK dan kelengkapan akta lahir.',
        sourceEntityId: 'std_c001',
        assignedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'ADMIN'],
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        deadline: '2026-08-30',
        evaluation: evalRes,
        directActionLink: 'r13'
      });

      queue.push({
        id: 'QUEUE-PPDB-C002',
        sourceDomain: 'PPDB',
        title: 'Verifikasi Berkas Calon Siswa: Aisyah Az-Zahra',
        description: 'Pendaftaran kelompok B - Verifikasi kartu keluarga & surat mutasi.',
        sourceEntityId: 'std_c002',
        assignedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'ADMIN'],
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        deadline: '2026-08-30',
        evaluation: evalRes,
        directActionLink: 'r13'
      });
    } catch (e) {
      // safe fallback
    }

    // 2. Financial / SPP Items (Unpaid / pending bills)
    try {
      const evalRes = this.priorityEngine.evaluatePriority({
        impactCategory: 'FINANCIAL',
        assignedRole: 'ADMIN',
        isDependencyBlocked: false
      });

      queue.push({
        id: 'QUEUE-FIN-SPP-BATCH',
        sourceDomain: 'TABUNGAN',
        title: 'Rekonsiliasi 4 Tagihan SPP Terbuka Bulan Ini',
        description: 'Pemeriksaan status pembayaran dan pencocokan kwitansi masuk bulan berjalan.',
        assignedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        status: 'AWAITING_APPROVAL',
        createdAt: new Date().toISOString(),
        evaluation: evalRes,
        directActionLink: 'r10'
      });
    } catch (e) {}

    // 3. Official Letters / Legal Approvals
    queue.push({
      id: 'QUEUE-SURAT-088',
      sourceDomain: 'SURAT',
      title: 'Persetujuan Surat Rekomendasi Akreditasi PAUD 2026',
      description: 'Pemberkasan dokumen BAN-PAUD membutuhkan tanda tangan digital Kepala Sekolah & Yayasan.',
      assignedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'],
      status: 'AWAITING_APPROVAL',
      createdAt: new Date().toISOString(),
      deadline: '2026-08-25',
      evaluation: this.priorityEngine.evaluatePriority({
        impactCategory: 'LEGAL_COMPLIANCE',
        assignedRole: 'KEPALA_SEKOLAH',
        isDependencyBlocked: false
      }),
      directActionLink: 'r16'
    });

    // 4. Announcements / Parent Broadcasts
    try {
      queue.push({
        id: 'QUEUE-ANNC-DRAFT-01',
        sourceDomain: 'PENGUMUMAN',
        title: 'Review Draf Pengumuman: Libur Awal Ramadhan 1448 H',
        description: 'Penyusunan surat edaran wali murid perihal kalender akademik dan jam belajar khusus.',
        assignedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'ADMIN'],
        status: 'IN_REVIEW',
        createdAt: new Date().toISOString(),
        evaluation: this.priorityEngine.evaluatePriority({
          impactCategory: 'ROUTINE_ADMIN',
          assignedRole: 'ADMIN',
          isDependencyBlocked: false
        }),
        directActionLink: 'r15'
      });
    } catch (e) {}

    // Filter by role if provided
    if (role) {
      return queue.filter(q => q.assignedRoles.includes(role));
    }

    return queue.sort((a, b) => b.evaluation.compositeScore - a.evaluation.compositeScore);
  }

  public getQueueSummary(): {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  } {
    const items = this.getQueueItems();
    return {
      total: items.length,
      critical: items.filter(i => i.evaluation.priorityLevel === 'CRITICAL').length,
      high: items.filter(i => i.evaluation.priorityLevel === 'HIGH').length,
      medium: items.filter(i => i.evaluation.priorityLevel === 'MEDIUM').length,
      low: items.filter(i => i.evaluation.priorityLevel === 'LOW').length
    };
  }
}
