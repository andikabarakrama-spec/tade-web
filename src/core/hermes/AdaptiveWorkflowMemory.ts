export type AdaptiveWorkflowState = 
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
  | 'CANCELLED';

export interface ExecutionFingerprint {
  fingerprintId: string;
  taskId: string;
  stepIndex: number;
  stepName: string;
  inputPayloadHash: string;
  outputChecksum: string;
  executedAt: string;
  durationMs: number;
  status: 'SUCCESS' | 'SKIPPED_ON_RESUME' | 'RECONCILED';
}

export interface WorkflowStepRecord {
  stepIndex: number;
  stepName: string;
  description: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'PAUSED' | 'FAILED';
  outputData?: Record<string, any>;
  fingerprint?: ExecutionFingerprint;
  executedAt?: string;
}

export interface TaskWorkflowMemorySnapshot {
  taskId: string;
  workflowId?: string;
  workflowTitle: string;
  currentState: AdaptiveWorkflowState;
  currentStepIndex: number;
  totalSteps: number;
  steps: WorkflowStepRecord[];
  executionFingerprints: ExecutionFingerprint[];
  intermediateStateData: Record<string, any>;
  createdAt: string;
  lastStateChangeAt: string;
  pauseHistory: Array<{ pausedAt: string; resumedAt?: string; reason: string }>;
  deduplicationSignature: string;
}

export class AdaptiveWorkflowMemory {
  private static instance: AdaptiveWorkflowMemory;
  private memoryStore: Map<string, TaskWorkflowMemorySnapshot> = new Map();

  private constructor() {
    this.seedInitialMemories();
  }

  public static getInstance(): AdaptiveWorkflowMemory {
    if (!AdaptiveWorkflowMemory.instance) {
      AdaptiveWorkflowMemory.instance = new AdaptiveWorkflowMemory();
    }
    return AdaptiveWorkflowMemory.instance;
  }

  private seedInitialMemories(): void {
    const sampleTask: TaskWorkflowMemorySnapshot = {
      taskId: 'TASK-2026-0801',
      workflowId: 'WF-ABS-01',
      workflowTitle: 'Rekapitulasi Presensi Santri Bulanan',
      currentState: 'COMPLETED',
      currentStepIndex: 3,
      totalSteps: 3,
      steps: [
        {
          stepIndex: 1,
          stepName: 'Fetch Attendance Stream',
          description: 'Ambil log presensi harian dari database db.ts',
          status: 'COMPLETED',
          executedAt: '2026-08-17T08:00:02Z',
          fingerprint: {
            fingerprintId: 'FP-0801-1',
            taskId: 'TASK-2026-0801',
            stepIndex: 1,
            stepName: 'Fetch Attendance Stream',
            inputPayloadHash: 'HASH_INPUT_ROMBEL_1A_AUG2026',
            outputChecksum: 'CHECKSUM_ATT_STREAM_28_RECORDS',
            executedAt: '2026-08-17T08:00:02Z',
            durationMs: 14,
            status: 'SUCCESS'
          }
        },
        {
          stepIndex: 2,
          stepName: 'Aggregate Metrics',
          description: 'Kalkulasi rasio kehadiran, izin, sakit, alpa secara matematis',
          status: 'COMPLETED',
          executedAt: '2026-08-17T08:00:08Z',
          fingerprint: {
            fingerprintId: 'FP-0801-2',
            taskId: 'TASK-2026-0801',
            stepIndex: 2,
            stepName: 'Aggregate Metrics',
            inputPayloadHash: 'HASH_RAW_ATT_28',
            outputChecksum: 'CHECKSUM_METRICS_96.4_PCT',
            executedAt: '2026-08-17T08:00:08Z',
            durationMs: 22,
            status: 'SUCCESS'
          }
        },
        {
          stepIndex: 3,
          stepName: 'Generate Class Summary',
          description: 'Susun ringkasan siap cetak untuk wali kelas & wali santri',
          status: 'COMPLETED',
          executedAt: '2026-08-17T08:00:14Z',
          fingerprint: {
            fingerprintId: 'FP-0801-3',
            taskId: 'TASK-2026-0801',
            stepIndex: 3,
            stepName: 'Generate Class Summary',
            inputPayloadHash: 'HASH_METRICS_96.4_PCT',
            outputChecksum: 'CHECKSUM_DOC_REKAP_FINAL_PDF',
            executedAt: '2026-08-17T08:00:14Z',
            durationMs: 35,
            status: 'SUCCESS'
          }
        }
      ],
      executionFingerprints: [],
      intermediateStateData: { rombel: '1A', attendanceRate: 96.4, totalSantri: 28 },
      createdAt: '2026-08-17T08:00:00Z',
      lastStateChangeAt: '2026-08-17T08:00:15Z',
      pauseHistory: [],
      deduplicationSignature: 'DEDUP-SIG-TASK-0801-COMPLETED'
    };

    sampleTask.executionFingerprints = sampleTask.steps
      .map(s => s.fingerprint)
      .filter((fp): fp is ExecutionFingerprint => !!fp);

    this.memoryStore.set(sampleTask.taskId, sampleTask);
  }

  public getSnapshot(taskId: string): TaskWorkflowMemorySnapshot | undefined {
    return this.memoryStore.get(taskId);
  }

  public getAllSnapshots(): TaskWorkflowMemorySnapshot[] {
    return Array.from(this.memoryStore.values());
  }

  public registerWorkflow(
    taskId: string, 
    workflowTitle: string, 
    stepDescriptions: Array<{ stepIndex: number; stepName: string; description: string }>,
    workflowId?: string
  ): TaskWorkflowMemorySnapshot {
    const snapshot: TaskWorkflowMemorySnapshot = {
      taskId,
      workflowId,
      workflowTitle,
      currentState: 'RECEIVED',
      currentStepIndex: 1,
      totalSteps: stepDescriptions.length,
      steps: stepDescriptions.map(s => ({
        ...s,
        status: 'PENDING'
      })),
      executionFingerprints: [],
      intermediateStateData: {},
      createdAt: new Date().toISOString(),
      lastStateChangeAt: new Date().toISOString(),
      pauseHistory: [],
      deduplicationSignature: `DEDUP-${taskId}-${Date.now()}`
    };

    this.memoryStore.set(taskId, snapshot);
    return snapshot;
  }

  public updateWorkflowState(taskId: string, newState: AdaptiveWorkflowState): boolean {
    const snapshot = this.memoryStore.get(taskId);
    if (!snapshot) return false;

    snapshot.currentState = newState;
    snapshot.lastStateChangeAt = new Date().toISOString();
    return true;
  }

  public recordStepCompletion(
    taskId: string,
    stepIndex: number,
    outputData: Record<string, any>,
    durationMs: number = 20
  ): ExecutionFingerprint | null {
    const snapshot = this.memoryStore.get(taskId);
    if (!snapshot) return null;

    const step = snapshot.steps.find(s => s.stepIndex === stepIndex);
    if (!step) return null;

    const now = new Date().toISOString();
    const inputHash = `HASH_${taskId}_STEP_${stepIndex}_${JSON.stringify(snapshot.intermediateStateData).length}`;
    const outputHash = `HASH_OUT_${stepIndex}_${Object.keys(outputData).join('_')}_${Date.now().toString(16)}`;

    const fingerprint: ExecutionFingerprint = {
      fingerprintId: `FP-${taskId.slice(-4)}-${stepIndex}`,
      taskId,
      stepIndex,
      stepName: step.stepName,
      inputPayloadHash: inputHash,
      outputChecksum: outputHash,
      executedAt: now,
      durationMs,
      status: 'SUCCESS'
    };

    step.status = 'COMPLETED';
    step.outputData = outputData;
    step.fingerprint = fingerprint;
    step.executedAt = now;

    // Merge intermediate state
    snapshot.intermediateStateData = {
      ...snapshot.intermediateStateData,
      ...outputData
    };

    // Store fingerprint
    snapshot.executionFingerprints.push(fingerprint);
    snapshot.currentStepIndex = Math.min(snapshot.totalSteps, stepIndex + 1);
    snapshot.lastStateChangeAt = now;

    if (stepIndex === snapshot.totalSteps) {
      snapshot.currentState = 'COMPLETED';
    }

    return fingerprint;
  }

  public hasStepFingerprint(taskId: string, stepIndex: number): boolean {
    const snapshot = this.memoryStore.get(taskId);
    if (!snapshot) return false;
    return snapshot.executionFingerprints.some(fp => fp.stepIndex === stepIndex);
  }

  public getDeduplicationSignature(taskId: string): string {
    const snapshot = this.memoryStore.get(taskId);
    return snapshot?.deduplicationSignature || `DEDUP-${taskId}`;
  }
}
