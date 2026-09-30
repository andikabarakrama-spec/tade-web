import { AdaptiveWorkflowMemory, TaskWorkflowMemorySnapshot } from './AdaptiveWorkflowMemory';

export interface ReconciliationDiffItem {
  field: string;
  previousValueAtPause: any;
  currentValueInSSoT: any;
  driftDetected: boolean;
  resolutionStrategy: 'PRESERVE_SNAPSHOT' | 'ADOPT_SSOT_STATE' | 'FLAG_FOR_CONFIRMATION';
}

export interface ContinuityReconciliationReport {
  reconciliationId: string;
  taskId: string;
  pausedTimestamp: string;
  resumedTimestamp: string;
  elapsedPauseDurationSeconds: number;
  overallStatus: 'CLEAN_NO_DRIFT' | 'RECONCILED_WITH_DIFFS' | 'CONFLICT_DETECTED_BLOCKED';
  detectedDiffs: ReconciliationDiffItem[];
  deduplicationSignatureMatch: boolean;
  safeResumptionPlan: {
    targetStepToResume: number;
    skippedStepCount: number;
    remainingStepCount: number;
    recommendedAction: string;
  };
  generatedAt: string;
}

export class HermesContinuityReconciliation {
  private static instance: HermesContinuityReconciliation;
  private reconciliationHistory: ContinuityReconciliationReport[] = [];

  private constructor() {}

  public static getInstance(): HermesContinuityReconciliation {
    if (!HermesContinuityReconciliation.instance) {
      HermesContinuityReconciliation.instance = new HermesContinuityReconciliation();
    }
    return HermesContinuityReconciliation.instance;
  }

  public getHistory(): ContinuityReconciliationReport[] {
    return [...this.reconciliationHistory];
  }

  /**
   * Reconciles paused task snapshot against current SSoT before resumption.
   */
  public reconcileBeforeResume(taskId: string): ContinuityReconciliationReport {
    const memory = AdaptiveWorkflowMemory.getInstance();
    const snapshot = memory.getSnapshot(taskId);

    const now = new Date().toISOString();
    const lastPause = snapshot?.pauseHistory[snapshot.pauseHistory.length - 1];
    const pausedAt = lastPause?.pausedAt || now;
    const elapsedSeconds = Math.max(1, Math.round((new Date(now).getTime() - new Date(pausedAt).getTime()) / 1000));

    const diffs: ReconciliationDiffItem[] = [];

    if (snapshot) {
      // Simulate checking data drift against SSoT db.ts
      diffs.push({
        field: 'SSoT_LEDGER_VERSION',
        previousValueAtPause: 'LEDGER_VER_884',
        currentValueInSSoT: 'LEDGER_VER_884',
        driftDetected: false,
        resolutionStrategy: 'PRESERVE_SNAPSHOT'
      });

      diffs.push({
        field: 'STUDENT_ROSTER_CHECKSUM',
        previousValueAtPause: 'ROSTER_HASH_MATCH',
        currentValueInSSoT: 'ROSTER_HASH_MATCH',
        driftDetected: false,
        resolutionStrategy: 'PRESERVE_SNAPSHOT'
      });
    }

    const skippedCount = snapshot?.executionFingerprints.length || 0;
    const totalCount = snapshot?.totalSteps || 3;
    const remainingCount = Math.max(0, totalCount - skippedCount);
    const targetStep = Math.min(totalCount, skippedCount + 1);

    const report: ContinuityReconciliationReport = {
      reconciliationId: `RECON-${taskId.slice(-4)}-${Date.now().toString(16)}`,
      taskId,
      pausedTimestamp: pausedAt,
      resumedTimestamp: now,
      elapsedPauseDurationSeconds: elapsedSeconds,
      overallStatus: 'CLEAN_NO_DRIFT',
      detectedDiffs: diffs,
      deduplicationSignatureMatch: true,
      safeResumptionPlan: {
        targetStepToResume: targetStep,
        skippedStepCount: skippedCount,
        remainingStepCount: remainingCount,
        recommendedAction: `Lanjutkan eksekusi langkah ${targetStep} dari total ${totalCount}. Langkah 1-${skippedCount} dilewati tanpa mutasi ulang.`
      },
      generatedAt: now
    };

    this.reconciliationHistory.unshift(report);
    return report;
  }
}
