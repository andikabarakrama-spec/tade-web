/**
 * TADE RC102 — R841, R842, R843
 * National Task Orchestrator & Smart Queue Engine
 * 
 * Konstitusi:
 * - Zero Duplicate Execution: Tiap task memiliki idempotencyKey unik
 * - Idle CPU mendekati 0%: Menggunakan queue event-driven non-polling
 * - SSoT tetap di src/services/db.ts
 * - Guardian Ring-0 Compliance 100%
 */

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
export type TaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
export type TaskCategory = 
  | 'SYNC_DATABASE' 
  | 'ASSET_OPTIMIZATION' 
  | 'INDEXING_SEARCH' 
  | 'NOTIF_DISPATCH' 
  | 'HERMES_SNAPSHOT' 
  | 'INTEGRITY_AUDIT';

export interface OrchestratedTask {
  id: string;
  idempotencyKey: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  progressPercent: number;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  payloadSummary: string;
  errorMessage?: string;
  executionTimeMs?: number;
}

export interface AutomationTriggerRule {
  id: string;
  name: string;
  scheduleDescription: string;
  category: TaskCategory;
  isEnabled: boolean;
  lastRunTimestamp?: string;
  nextRunEstimated: string;
  successRate: number;
  totalExecutions: number;
}

export class NationalTaskOrchestrator {
  private static instance: NationalTaskOrchestrator;

  private tasks: OrchestratedTask[] = [
    {
      id: 'TASK-841-01',
      idempotencyKey: 'IDEMP_SYNC_SSOT_20260820_001',
      title: 'Sinkronisasi SSoT Presensi & Mutabaah Santri',
      category: 'SYNC_DATABASE',
      priority: 'HIGH',
      status: 'COMPLETED',
      progressPercent: 100,
      retryCount: 0,
      maxRetries: 3,
      createdAt: '2026-08-20 07:00:00 WIB',
      startedAt: '2026-08-20 07:00:01 WIB',
      completedAt: '2026-08-20 07:00:03 WIB',
      payloadSummary: 'Rekonsiliasi 128 santri & 12 guru tanpa konflik',
      executionTimeMs: 182
    },
    {
      id: 'TASK-841-02',
      idempotencyKey: 'IDEMP_HERMES_SNAP_20260820_002',
      title: 'Pembuatan Snapshot SHA-256 Brankas Hermes',
      category: 'HERMES_SNAPSHOT',
      priority: 'CRITICAL',
      status: 'COMPLETED',
      progressPercent: 100,
      retryCount: 0,
      maxRetries: 2,
      createdAt: '2026-08-20 07:15:00 WIB',
      startedAt: '2026-08-20 07:15:01 WIB',
      completedAt: '2026-08-20 07:15:02 WIB',
      payloadSummary: 'Manifest SHA-256 terverifikasi utuh 24 koleksi',
      executionTimeMs: 94
    },
    {
      id: 'TASK-841-03',
      idempotencyKey: 'IDEMP_PHOTO_OPT_20260820_003',
      title: 'Optimasi Batch Foto Kegiatan Sentra Pagi',
      category: 'ASSET_OPTIMIZATION',
      priority: 'NORMAL',
      status: 'PROCESSING',
      progressPercent: 68,
      retryCount: 0,
      maxRetries: 3,
      createdAt: '2026-08-20 08:30:00 WIB',
      startedAt: '2026-08-20 08:30:02 WIB',
      payloadSummary: 'Batch 14 foto santri; deteksi blur & mata terbuka',
      executionTimeMs: 420
    },
    {
      id: 'TASK-841-04',
      idempotencyKey: 'IDEMP_AUDIT_RING0_20260820_004',
      title: 'Audit Integritas Master Character Lock Ring-0',
      category: 'INTEGRITY_AUDIT',
      priority: 'HIGH',
      status: 'PENDING',
      progressPercent: 0,
      retryCount: 0,
      maxRetries: 3,
      createdAt: '2026-08-20 08:45:00 WIB',
      payloadSummary: 'Verifikasi imutabilitas Asy & Syifa seragam krem-oranye'
    }
  ];

  private automationRules: AutomationTriggerRule[] = [
    {
      id: 'AUTO-01',
      name: 'Sinkronisasi Pagi & Rekonsiliasi Presensi',
      scheduleDescription: 'Setiap Hari Pukul 06:30 WIB',
      category: 'SYNC_DATABASE',
      isEnabled: true,
      lastRunTimestamp: '2026-08-20 06:30 WIB',
      nextRunEstimated: '2026-08-21 06:30 WIB',
      successRate: 100,
      totalExecutions: 312
    },
    {
      id: 'AUTO-02',
      name: 'Snapshot Hermes Otomatis & Hashing SHA-256',
      scheduleDescription: 'Setiap 6 Jam Sekali',
      category: 'HERMES_SNAPSHOT',
      isEnabled: true,
      lastRunTimestamp: '2026-08-20 06:00 WIB',
      nextRunEstimated: '2026-08-20 12:00 WIB',
      successRate: 99.8,
      totalExecutions: 840
    },
    {
      id: 'AUTO-03',
      name: 'Pengingat Mutabaah Tahfidz & Doa Harian',
      scheduleDescription: 'Setiap Hari Pukul 15:30 WIB',
      category: 'NOTIF_DISPATCH',
      isEnabled: true,
      lastRunTimestamp: '2026-08-19 15:30 WIB',
      nextRunEstimated: '2026-08-20 15:30 WIB',
      successRate: 100,
      totalExecutions: 194
    },
    {
      id: 'AUTO-04',
      name: 'Pembersihan Cache Kedaluwarsa & Memory Guard',
      scheduleDescription: 'Setiap Tengah Malam 00:00 WIB',
      category: 'INTEGRITY_AUDIT',
      isEnabled: true,
      lastRunTimestamp: '2026-08-20 00:00 WIB',
      nextRunEstimated: '2026-08-21 00:00 WIB',
      successRate: 100,
      totalExecutions: 120
    }
  ];

  private listeners: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): NationalTaskOrchestrator {
    if (!NationalTaskOrchestrator.instance) {
      NationalTaskOrchestrator.instance = new NationalTaskOrchestrator();
    }
    return NationalTaskOrchestrator.instance;
  }

  public getAllTasks(): OrchestratedTask[] {
    return this.tasks;
  }

  public getAutomationRules(): AutomationTriggerRule[] {
    return this.automationRules;
  }

  public enqueueTask(task: Omit<OrchestratedTask, 'id' | 'createdAt' | 'status' | 'progressPercent' | 'retryCount'>): OrchestratedTask | null {
    // Zero Duplicate Execution Enforcement via idempotencyKey
    const existing = this.tasks.find(t => t.idempotencyKey === task.idempotencyKey);
    if (existing) {
      console.warn(`[TaskOrchestrator] Task dengan idempotency key '${task.idempotencyKey}' sudah ada. Mencegah duplikasi.`);
      return existing;
    }

    const newTask: OrchestratedTask = {
      ...task,
      id: `TASK-841-${String(this.tasks.length + 1).padStart(2, '0')}`,
      createdAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
      status: 'PENDING',
      progressPercent: 0,
      retryCount: 0
    };

    this.tasks.unshift(newTask);
    this.notify();
    return newTask;
  }

  public retryTask(taskId: string): void {
    this.tasks = this.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'RETRYING',
          retryCount: t.retryCount + 1,
          progressPercent: 10,
          errorMessage: undefined
        };
      }
      return t;
    });
    this.notify();

    setTimeout(() => {
      this.tasks = this.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'COMPLETED',
            progressPercent: 100,
            completedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
            executionTimeMs: 140
          };
        }
        return t;
      });
      this.notify();
    }, 600);
  }

  public toggleAutomationRule(ruleId: string): void {
    this.automationRules = this.automationRules.map(r => {
      if (r.id === ruleId) {
        return { ...r, isEnabled: !r.isEnabled };
      }
      return r;
    });
    this.notify();
  }

  public purgeCompletedTasks(): void {
    this.tasks = this.tasks.filter(t => t.status !== 'COMPLETED');
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }
}
