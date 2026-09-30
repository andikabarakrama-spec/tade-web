/**
 * TADE RC91 — Enterprise Offline Continuity Types
 * Definition of types, models, and interfaces for offline resilience,
 * safe sync queues, conflict resolution, snapshots, and recovery replay.
 */

export type ConnectivityStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'RECOVERING';

export type OperationPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type OperationStatus = 'QUEUED' | 'IN_FLIGHT' | 'SYNCED' | 'CONFLICT' | 'FAILED';

export interface SyncOperation {
  operationId: string;
  entityType: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXECUTE';
  payload: Record<string, any>;
  timestamp: string;
  fingerprint: string;
  retryCount: number;
  maxRetries: number;
  priority: OperationPriority;
  status: OperationStatus;
  lastAttemptAt?: string;
  errorMessage?: string;
  sourceModule: string;
  author: string;
}

export type ConflictCategory = 
  | 'TIMESTAMP_CONFLICT' 
  | 'DUPLICATE_WRITE' 
  | 'STALE_STATE' 
  | 'MANUAL_CONFLICT';

export type ResolutionStrategy = 
  | 'SSOT_AUTHORITATIVE' 
  | 'LAST_WRITE_WINS_SAFE' 
  | 'MANUAL_REVIEW_REQUIRED' 
  | 'REJECT_STALE';

export interface ConflictRecord {
  id: string;
  operationId: string;
  entityType: string;
  category: ConflictCategory;
  localVersion: Record<string, any>;
  remoteVersion: Record<string, any>;
  detectedAt: string;
  status: 'UNRESOLVED' | 'RESOLVED' | 'REJECTED';
  resolutionStrategy?: ResolutionStrategy;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface LocalSnapshot<T = any> {
  key: string;
  entityType: string;
  data: T;
  timestamp: string;
  ttlMs: number;
  expiresAt: string;
  checksum: string;
  itemCount?: number;
}

export interface ConnectivityTelemetry {
  status: ConnectivityStatus;
  latencyMs: number;
  offlineDurationSeconds: number;
  recoveryTimeMs: number;
  reconnectCount: number;
  packetLossRate: number;
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'OFFLINE';
  lastCheckedAt: string;
  history: Array<{
    timestamp: string;
    latencyMs: number;
    status: ConnectivityStatus;
  }>;
}

export type ReplayPhase = 
  | 'IDLE' 
  | 'RELOAD' 
  | 'PRE_VERIFY' 
  | 'REPLAY' 
  | 'POST_VERIFY' 
  | 'COMPLETE' 
  | 'FAILED';

export interface ReplayPhaseDetail {
  phase: ReplayPhase;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  details: string;
  recordsProcessed?: number;
}

export interface ReplayExecutionResult {
  executionId: string;
  startedAt: string;
  completedAt?: string;
  currentPhase: ReplayPhase;
  totalQueued: number;
  totalReplayed: number;
  totalConflicts: number;
  totalFailed: number;
  phases: ReplayPhaseDetail[];
  zeroDuplicateGuaranteed: boolean;
  status: 'IDLE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED_WITH_CONFLICTS';
}

export interface OfflineAuditItem {
  id: string;
  category: 'CACHE' | 'QUEUE' | 'FINGERPRINT' | 'REPLAY' | 'SECURITY';
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  passed: boolean;
  title: string;
  description: string;
  remediation?: string;
}

export interface OfflineAuditReport {
  timestamp: string;
  overallScore: number;
  cacheConsistencyScore: number;
  replayConsistencyScore: number;
  fingerprintIntegrityScore: number;
  deduplicationScore: number;
  totalAudited: number;
  passCount: number;
  warningCount: number;
  failureCount: number;
  items: OfflineAuditItem[];
}
