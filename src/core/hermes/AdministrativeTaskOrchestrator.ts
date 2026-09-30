export type TaskState = 
  | 'RECEIVED' 
  | 'UNDERSTANDING' 
  | 'PLANNED' 
  | 'AUTHORIZED' 
  | 'EXECUTING' 
  | 'PAUSED'
  | 'VERIFYING' 
  | 'COMPLETED' 
  | 'BLOCKED' 
  | 'FAILED' 
  | 'RECOVERING' 
  | 'CANCELLED'
  | 'WAITING_APPROVAL';

export type TaskRole = 'SUPER_ADMIN' | 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'GURU' | 'ADMIN_TU';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RecoveryState {
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  nextRetryTime?: string;
  recoveryStrategy?: string;
}

export interface HumanHandoffDetails {
  completedWorkSummary: string;
  pendingWorkSummary: string;
  blockerReason: string;
  requiredAuthorityRole: TaskRole;
  requiredAction: string;
  preservedStateData: Record<string, any>;
  handoffTimestamp: string;
}

export interface AdministrativeTask {
  taskId: string;
  requester: string;
  role: TaskRole;
  capability: string;
  objective: string;
  priority: TaskPriority;
  createdAt: string;
  assignedExecutor: string;
  dependencies: string[];
  state: TaskState;
  result?: string;
  auditReference: string;
  recoveryState?: RecoveryState;
  humanHandoff?: HumanHandoffDetails;
  category: 
    | 'ABSENSI' 
    | 'SPP_PEMBAYARAN' 
    | 'TABUNGAN' 
    | 'PPDB' 
    | 'LAPORAN' 
    | 'PENGUMUMAN' 
    | 'SURAT_DOKUMEN' 
    | 'ARSIP' 
    | 'ADMINISTRASI_GURU' 
    | 'ADMINISTRASI_SISWA'
    | 'GOVERNANCE';
  isSensitiveAction?: boolean;
}

export class AdministrativeTaskOrchestrator {
  private static instance: AdministrativeTaskOrchestrator;
  private tasks: AdministrativeTask[] = [
    {
      taskId: 'TASK-2026-0801',
      requester: 'Ustadz Ahmad (Wali Kelas 1)',
      role: 'GURU',
      capability: 'CAP_ATTENDANCE_RECAP',
      objective: 'Rekapitulasi presensi bulanan dan kalkulasi persentase kehadiran Kelas 1A',
      priority: 'HIGH',
      createdAt: '2026-08-17T08:00:00Z',
      assignedExecutor: 'Hermes Administrative Executor (Dormant Engine)',
      dependencies: ['src/services/db.ts:getAttendanceSummary'],
      state: 'COMPLETED',
      result: 'Rekap presensi 28 santri berhasil dihitung: Kehadiran 96.4%, Sakit 2.1%, Izin 1.5%. Data terverifikasi.',
      auditReference: 'AUDIT-REC-8801',
      category: 'ABSENSI',
      recoveryState: { retryCount: 0, maxRetries: 3 }
    },
    {
      taskId: 'TASK-2026-0802',
      requester: 'Staf Tata Usaha',
      role: 'ADMIN_TU',
      capability: 'CAP_FINANCE_RECAP',
      objective: 'Kompilasi tagihan SPP bulan Agustus dan status pelunasan kas tabungan',
      priority: 'HIGH',
      createdAt: '2026-08-17T08:15:00Z',
      assignedExecutor: 'Hermes Administrative Executor (Dormant Engine)',
      dependencies: ['src/services/db.ts:getSavingsTransactions'],
      state: 'COMPLETED',
      result: 'Rekapitulasi 42 santri lunas, 8 santri tertunda. Total penerimaan tercatat akurat Rp 21.000.000.',
      auditReference: 'AUDIT-REC-8802',
      category: 'SPP_PEMBAYARAN',
      recoveryState: { retryCount: 0, maxRetries: 3 }
    },
    {
      taskId: 'TASK-2026-0803',
      requester: 'Kepala Madrasah',
      role: 'KEPALA_SEKOLAH',
      capability: 'CAP_EXECUTIVE_REPORTING',
      objective: 'Penyusunan draf Laporan Kesiapan Kurikulum & Logistik Semester Ganjil',
      priority: 'MEDIUM',
      createdAt: '2026-08-17T08:30:00Z',
      assignedExecutor: 'Hermes Administrative Executor (Dormant Engine)',
      dependencies: ['src/services/db.ts:getSchoolPerformanceMetrics'],
      state: 'WAITING_APPROVAL',
      result: 'Draf laporan 10 halaman telah disusun. Menunggu persetujuan final Kepala Sekolah.',
      auditReference: 'AUDIT-REC-8803',
      category: 'LAPORAN',
      isSensitiveAction: true,
      recoveryState: { retryCount: 0, maxRetries: 3 }
    },
    {
      taskId: 'TASK-2026-0804',
      requester: 'Admin Keuangan',
      role: 'ADMIN_TU',
      capability: 'CAP_SAVINGS_SETTLEMENT',
      objective: 'Rekonsiliasi penarikan kas tabungan santri dengan mutasi buku besar',
      priority: 'CRITICAL',
      createdAt: '2026-08-17T08:45:00Z',
      assignedExecutor: 'Hermes Administrative Executor (Dormant Engine)',
      dependencies: ['src/services/db.ts:getLedgerSnapshot'],
      state: 'BLOCKED',
      result: 'Terhenti: Diperlukan konfirmasi otorisasi multi-signature untuk 2 transaksi penarikan di atas Rp 1.000.000.',
      auditReference: 'AUDIT-REC-8804',
      category: 'TABUNGAN',
      recoveryState: { retryCount: 2, maxRetries: 2, lastError: 'MULTI_SIG_REQUIRED' },
      humanHandoff: {
        completedWorkSummary: 'Rekonsiliasi 48 transaksi tabungan telah selesai dan balance 100%.',
        pendingWorkSummary: '2 transaksi penarikan besar (Rp 1.500.000 dan Rp 2.000.000) memerlukan verifikasi manual.',
        blockerReason: 'Batas otorisasi kas mandiri TU terlampaui sesuai Invarian Anti-Defisit TADE.',
        requiredAuthorityRole: 'KEPALA_SEKOLAH',
        requiredAction: 'Verifikasi tanda tangan digital persetujuan pencairan di modul Keuangan.',
        preservedStateData: { batchId: 'BATCH-TAB-09', pendingCount: 2 },
        handoffTimestamp: '2026-08-17T08:50:00Z'
      }
    },
    {
      taskId: 'TASK-2026-0805',
      requester: 'Ketua Yayasan',
      role: 'KETUA_YAYASAN',
      capability: 'CAP_GOVERNANCE_BRIEF',
      objective: 'Penyusunan ringkasan bahan rapat dewan pembina yayasan triwulan',
      priority: 'HIGH',
      createdAt: '2026-08-17T09:00:00Z',
      assignedExecutor: 'Hermes Administrative Executor (Dormant Engine)',
      dependencies: ['src/services/db.ts:getInstitutionalLedger'],
      state: 'COMPLETED',
      result: 'Ringkasan eksekutif 5 pilar yayasan (Finansial, SDM, Sarpras, Santri, Legalitas) selesai disusun.',
      auditReference: 'AUDIT-REC-8805',
      category: 'GOVERNANCE',
      recoveryState: { retryCount: 0, maxRetries: 3 }
    }
  ];

  public static getInstance(): AdministrativeTaskOrchestrator {
    if (!AdministrativeTaskOrchestrator.instance) {
      AdministrativeTaskOrchestrator.instance = new AdministrativeTaskOrchestrator();
    }
    return AdministrativeTaskOrchestrator.instance;
  }

  public getAllTasks(): AdministrativeTask[] {
    return [...this.tasks];
  }

  public getTaskById(taskId: string): AdministrativeTask | undefined {
    return this.tasks.find(t => t.taskId === taskId);
  }

  public getTasksByRole(role: TaskRole): AdministrativeTask[] {
    return this.tasks.filter(t => t.role === role);
  }

  public createTask(task: Omit<AdministrativeTask, 'taskId' | 'createdAt' | 'auditReference'>): AdministrativeTask {
    const id = `TASK-2026-${String(this.tasks.length + 801).padStart(4, '0')}`;
    const newTask: AdministrativeTask = {
      ...task,
      taskId: id,
      createdAt: new Date().toISOString(),
      auditReference: `AUDIT-REC-${String(this.tasks.length + 8801).padStart(4, '0')}`,
      recoveryState: task.recoveryState || { retryCount: 0, maxRetries: 3 }
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  public updateTaskState(taskId: string, newState: TaskState, resultMessage?: string): { success: boolean; task?: AdministrativeTask } {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) return { success: false };

    task.state = newState;
    if (resultMessage) task.result = resultMessage;

    return { success: true, task };
  }

  public cancelTask(taskId: string, reason: string): { success: boolean; message: string } {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) return { success: false, message: 'Task tidak ditemukan.' };

    task.state = 'CANCELLED';
    task.result = `Dibatalkan oleh Super Admin: ${reason}`;
    return { success: true, message: `Task ${taskId} berhasil dibatalkan.` };
  }
}
