import { AdministrativeTask, TaskState } from './AdministrativeTaskOrchestrator';

export interface RecoveryAttemptResult {
  taskId: string;
  previousState: TaskState;
  newState: TaskState;
  attemptNumber: number;
  maxRetries: number;
  strategyUsed: string;
  errorAnalyzed: string;
  actionTaken: string;
  isExhausted: boolean;
  timestamp: string;
}

export class TaskSelfRecoveryEngine {
  private static instance: TaskSelfRecoveryEngine;
  private recoveryLogs: RecoveryAttemptResult[] = [];

  public static getInstance(): TaskSelfRecoveryEngine {
    if (!TaskSelfRecoveryEngine.instance) {
      TaskSelfRecoveryEngine.instance = new TaskSelfRecoveryEngine();
    }
    return TaskSelfRecoveryEngine.instance;
  }

  public getRecoveryLogs(): RecoveryAttemptResult[] {
    return [...this.recoveryLogs];
  }

  public handleTaskFailure(
    task: AdministrativeTask, 
    errorReason: string
  ): { nextState: TaskState; log: RecoveryAttemptResult } {
    const currentRetries = task.recoveryState?.retryCount || 0;
    const maxRetries = task.recoveryState?.maxRetries || 3;
    const nextRetry = currentRetries + 1;

    let nextState: TaskState = 'RECOVERING';
    let strategy = 'DIFFERENTIAL_RETRY_WITH_BACKOFF';
    let action = `Mencoba rekonsiliasi ulang otomatis (Percobaan ${nextRetry} dari ${maxRetries})`;
    let isExhausted = false;

    if (errorReason.includes('PERMISSION') || errorReason.includes('UNAUTHORIZED')) {
      // Permission issues cannot be resolved by retry -> Immediate BLOCKED with human handoff
      nextState = 'BLOCKED';
      strategy = 'NO_RETRY_SECURITY_BLOCK';
      action = 'Eskalasi ke Super Admin / Kepala Sekolah karena pelanggaran izin RBAC.';
      isExhausted = true;
    } else if (errorReason.includes('MULTI_SIG') || errorReason.includes('APPROVAL_REQUIRED')) {
      nextState = 'WAITING_APPROVAL';
      strategy = 'SAFETY_GATE_APPROVAL_HOLD';
      action = 'Menahan eksekusi pada Safety Gate hingga otorisasi ganda diberikan.';
      isExhausted = true;
    } else if (nextRetry > maxRetries) {
      // Retries exhausted -> Transition to BLOCKED
      nextState = 'BLOCKED';
      strategy = 'RETRIES_EXHAUSTED_ESCALATION';
      action = `Batas maksimum percobaan (${maxRetries}) terlampaui. Tugas dihentikan dan dialihkan ke Human Handoff.`;
      isExhausted = true;
    }

    // Update task object
    if (!task.recoveryState) {
      task.recoveryState = { retryCount: 0, maxRetries: 3 };
    }
    task.recoveryState.retryCount = nextRetry;
    task.recoveryState.lastError = errorReason;
    task.recoveryState.recoveryStrategy = strategy;
    task.state = nextState;

    const log: RecoveryAttemptResult = {
      taskId: task.taskId,
      previousState: 'FAILED',
      newState: nextState,
      attemptNumber: nextRetry,
      maxRetries,
      strategyUsed: strategy,
      errorAnalyzed: errorReason,
      actionTaken: action,
      isExhausted,
      timestamp: new Date().toISOString()
    };

    this.recoveryLogs.unshift(log);
    return { nextState, log };
  }
}
