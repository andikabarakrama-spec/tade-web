/**
 * TADE RC79 — R618: GOVERNMENT WORKFLOW ORCHESTRATOR
 * Orchestrated by Prime Minister AI Asy:
 * Manages task priorities, async queues, workload distribution, and dynamic load balancing across digital civil servants.
 */

export type TaskPriority = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_NORMAL' | 'P3_BACKGROUND';
export type TaskState = 'QUEUED' | 'DISPATCHED' | 'PROCESSING' | 'COMPLETED' | 'FAILED_RETRY';

export interface OrchestratedTask {
  taskId: string;
  title: string;
  ministryTarget: string;
  assignedNip: string;
  assignedName: string;
  priority: TaskPriority;
  state: TaskState;
  estimatedEffortMs: number;
  enqueuedAt: string;
  dispatchedAt?: string;
  completedAt?: string;
  retryCount: number;
}

export interface WorkloadDistributionMetric {
  ministryCode: string;
  ministryName: string;
  totalActiveEmployees: number;
  averageLoadPercent: number;
  queuedTasksCount: number;
  completedTasks24h: number;
}

class GovernmentWorkflowOrchestratorCore {
  private static instance: GovernmentWorkflowOrchestratorCore | null = null;
  private taskQueue: OrchestratedTask[] = [];

  private constructor() {
    this.bootstrapQueue();
  }

  public static getInstance(): GovernmentWorkflowOrchestratorCore {
    if (!GovernmentWorkflowOrchestratorCore.instance) {
      GovernmentWorkflowOrchestratorCore.instance = new GovernmentWorkflowOrchestratorCore();
    }
    return GovernmentWorkflowOrchestratorCore.instance;
  }

  private bootstrapQueue(): void {
    const now = Date.now();
    this.taskQueue = [
      {
        taskId: 'TSK-ASY-9901',
        title: 'Rekonsiliasi Masal Pembayaran SPP Bulan Agustus 2026',
        ministryTarget: 'MIN_KEUANGAN',
        assignedNip: 'NIP-MIN03-001',
        assignedName: 'Pegawai Tagihan & Virtual Account SPP',
        priority: 'P1_HIGH',
        state: 'PROCESSING',
        estimatedEffortMs: 450,
        enqueuedAt: new Date(now - 120000).toISOString(),
        dispatchedAt: new Date(now - 60000).toISOString(),
        retryCount: 0
      },
      {
        taskId: 'TSK-ASY-9902',
        title: 'Verifikasi 15 Berkas Calon Santri Gelombang II',
        ministryTarget: 'MIN_PPDB',
        assignedNip: 'NIP-MIN04-001',
        assignedName: 'Pegawai Verifikasi Berkas Calon Santri',
        priority: 'P2_NORMAL',
        state: 'QUEUED',
        estimatedEffortMs: 800,
        enqueuedAt: new Date(now - 90000).toISOString(),
        retryCount: 0
      },
      {
        taskId: 'TSK-ASY-9903',
        title: 'Penerbitan Surat Keterangan Santri Aktif Beasiswa Kemenag',
        ministryTarget: 'MIN_ADMINISTRASI',
        assignedNip: 'NIP-MIN02-002',
        assignedName: 'Pegawai Legalisir Digital & Stempel QR',
        priority: 'P1_HIGH',
        state: 'PROCESSING',
        estimatedEffortMs: 300,
        enqueuedAt: new Date(now - 180000).toISOString(),
        dispatchedAt: new Date(now - 100000).toISOString(),
        retryCount: 0
      },
      {
        taskId: 'TSK-ASY-9904',
        title: 'Broadcast Ringkasan Prestasi Mingguan ke 1.200 Wali Santri',
        ministryTarget: 'MIN_KOMUNIKASI',
        assignedNip: 'NIP-MIN05-001',
        assignedName: 'Pegawai Warta Pesantren & Gateway WA',
        priority: 'P2_NORMAL',
        state: 'QUEUED',
        estimatedEffortMs: 1200,
        enqueuedAt: new Date(now - 300000).toISOString(),
        retryCount: 0
      },
      {
        taskId: 'TSK-ASY-9899',
        title: 'Penataan Roster Jam Pelajaran Ustadz Tamu Bahasa Arab',
        ministryTarget: 'MIN_PENDIDIKAN',
        assignedNip: 'NIP-MIN01-001',
        assignedName: 'Pegawai Jadwal Pelajaran & Roster',
        priority: 'P3_BACKGROUND',
        state: 'COMPLETED',
        estimatedEffortMs: 650,
        enqueuedAt: new Date(now - 600000).toISOString(),
        dispatchedAt: new Date(now - 550000).toISOString(),
        completedAt: new Date(now - 480000).toISOString(),
        retryCount: 0
      }
    ];
  }

  public getQueue(): OrchestratedTask[] {
    return this.taskQueue;
  }

  public getWorkloadMetrics(): WorkloadDistributionMetric[] {
    return [
      { ministryCode: 'MIN_PENDIDIKAN', ministryName: 'Kementerian Pendidikan', totalActiveEmployees: 4, averageLoadPercent: 50, queuedTasksCount: 1, completedTasks24h: 649 },
      { ministryCode: 'MIN_ADMINISTRASI', ministryName: 'Kementerian Administrasi', totalActiveEmployees: 2, averageLoadPercent: 28, queuedTasksCount: 1, completedTasks24h: 248 },
      { ministryCode: 'MIN_KEUANGAN', ministryName: 'Kementerian Keuangan', totalActiveEmployees: 2, averageLoadPercent: 55, queuedTasksCount: 2, completedTasks24h: 550 },
      { ministryCode: 'MIN_PPDB', ministryName: 'Kementerian PPDB', totalActiveEmployees: 1, averageLoadPercent: 50, queuedTasksCount: 1, completedTasks24h: 74 },
      { ministryCode: 'MIN_KOMUNIKASI', ministryName: 'Kementerian Komunikasi', totalActiveEmployees: 1, averageLoadPercent: 68, queuedTasksCount: 1, completedTasks24h: 620 },
      { ministryCode: 'MIN_BANKING_OFFICE', ministryName: 'Kementerian Banking Office', totalActiveEmployees: 1, averageLoadPercent: 78, queuedTasksCount: 0, completedTasks24h: 890 }
    ];
  }

  public processNextQueuedTask(): boolean {
    const nextQueued = this.taskQueue.find(t => t.state === 'QUEUED');
    if (nextQueued) {
      nextQueued.state = 'PROCESSING';
      nextQueued.dispatchedAt = new Date().toISOString();
      return true;
    }
    const processing = this.taskQueue.find(t => t.state === 'PROCESSING');
    if (processing) {
      processing.state = 'COMPLETED';
      processing.completedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
}

export const governmentWorkflowOrchestrator = GovernmentWorkflowOrchestratorCore.getInstance();
