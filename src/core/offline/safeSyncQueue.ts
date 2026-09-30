/**
 * TADE RC91 — R732 Safe Sync Queue
 * Deduplicated, priority-aware offline synchronization queue.
 * Every operation contains: operationId, timestamp, fingerprint, retryCount.
 * Deduplication is mandatory to guarantee zero duplicate execution.
 */

import { SyncOperation, OperationPriority, OperationStatus } from './offlineTypes';

const STORAGE_KEY = 'tade_safe_sync_queue_v1';
const SYNC_HISTORY_KEY = 'tade_synced_fingerprints_v1';

export function generateOperationFingerprint(
  entityType: string,
  action: string,
  payload: Record<string, any>
): string {
  // Deterministic JSON serialization
  const sortedKeys = Object.keys(payload).sort();
  const canonicalPayload: Record<string, any> = {};
  for (const k of sortedKeys) {
    canonicalPayload[k] = payload[k];
  }
  const str = `${entityType}:${action}:${JSON.stringify(canonicalPayload)}`;

  // Deterministic hash algorithm (Fletcher / SHA-256 simulation in JS)
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  return `fp_${hex.padStart(16, '0')}`;
}

export class SafeSyncQueue {
  private static instance: SafeSyncQueue;
  private queue: SyncOperation[] = [];
  private syncedFingerprints: Set<string> = new Set();
  private inFlightIds: Set<string> = new Set();
  private listeners: Set<(queue: SyncOperation[]) => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): SafeSyncQueue {
    if (!SafeSyncQueue.instance) {
      SafeSyncQueue.instance = new SafeSyncQueue();
    }
    return SafeSyncQueue.instance;
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const rawQueue = localStorage.getItem(STORAGE_KEY);
      if (rawQueue) {
        this.queue = JSON.parse(rawQueue);
      }

      const rawHistory = localStorage.getItem(SYNC_HISTORY_KEY);
      if (rawHistory) {
        const list = JSON.parse(rawHistory);
        this.syncedFingerprints = new Set(list);
      }
    } catch (e) {
      console.warn('[SafeSyncQueue] Storage load fallback', e);
      this.queue = [];
      this.syncedFingerprints = new Set();
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
      const historyArr = Array.from(this.syncedFingerprints).slice(-500); // keep last 500
      localStorage.setItem(SYNC_HISTORY_KEY, JSON.stringify(historyArr));
    } catch (e) {
      console.warn('[SafeSyncQueue] Storage save error', e);
    }
  }

  /**
   * Enqueue a new operation with strict deduplication check.
   * Returns existing operation if fingerprint is identical.
   */
  public enqueue(params: {
    entityType: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXECUTE';
    payload: Record<string, any>;
    priority?: OperationPriority;
    sourceModule?: string;
    author?: string;
    maxRetries?: number;
  }): { operation: SyncOperation; isDuplicate: boolean } {
    const fingerprint = generateOperationFingerprint(params.entityType, params.action, params.payload);

    // 1. Check if already queued
    const existingQueued = this.queue.find(
      (op) => op.fingerprint === fingerprint && (op.status === 'QUEUED' || op.status === 'IN_FLIGHT')
    );
    if (existingQueued) {
      return { operation: existingQueued, isDuplicate: true };
    }

    // 2. Check if already synced recently (within session)
    if (this.syncedFingerprints.has(fingerprint)) {
      const syncedPlaceholder: SyncOperation = {
        operationId: `op_cached_${Date.now()}`,
        entityType: params.entityType,
        action: params.action,
        payload: params.payload,
        timestamp: new Date().toISOString(),
        fingerprint,
        retryCount: 0,
        maxRetries: params.maxRetries || 3,
        priority: params.priority || 'NORMAL',
        status: 'SYNCED',
        sourceModule: params.sourceModule || 'GENERAL',
        author: params.author || 'SYSTEM'
      };
      return { operation: syncedPlaceholder, isDuplicate: true };
    }

    // 3. Create fresh operation
    const newOperation: SyncOperation = {
      operationId: `op_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      entityType: params.entityType,
      action: params.action,
      payload: params.payload,
      timestamp: new Date().toISOString(),
      fingerprint,
      retryCount: 0,
      maxRetries: params.maxRetries || 3,
      priority: params.priority || 'NORMAL',
      status: 'QUEUED',
      sourceModule: params.sourceModule || 'GENERAL',
      author: params.author || 'SYSTEM'
    };

    // Sort insertion by priority: CRITICAL > HIGH > NORMAL > LOW
    const priorityWeights: Record<OperationPriority, number> = {
      CRITICAL: 4,
      HIGH: 3,
      NORMAL: 2,
      LOW: 1
    };

    let insertIdx = this.queue.length;
    for (let i = 0; i < this.queue.length; i++) {
      if (priorityWeights[newOperation.priority] > priorityWeights[this.queue[i].priority]) {
        insertIdx = i;
        break;
      }
    }

    this.queue.splice(insertIdx, 0, newOperation);
    this.saveToStorage();
    this.notifyListeners();

    return { operation: newOperation, isDuplicate: false };
  }

  public getQueue(): SyncOperation[] {
    return [...this.queue];
  }

  public getQueuedCount(): number {
    return this.queue.filter((op) => op.status === 'QUEUED').length;
  }

  public getInFlightCount(): number {
    return this.queue.filter((op) => op.status === 'IN_FLIGHT').length;
  }

  public getFailedCount(): number {
    return this.queue.filter((op) => op.status === 'FAILED' || op.status === 'CONFLICT').length;
  }

  public getNextQueuedBatch(limit: number = 10): SyncOperation[] {
    return this.queue
      .filter((op) => op.status === 'QUEUED' && !this.inFlightIds.has(op.operationId))
      .slice(0, limit);
  }

  public markInFlight(operationIds: string[]): void {
    operationIds.forEach((id) => {
      this.inFlightIds.add(id);
      const op = this.queue.find((o) => o.operationId === id);
      if (op) {
        op.status = 'IN_FLIGHT';
        op.lastAttemptAt = new Date().toISOString();
      }
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public markSynced(operationId: string): void {
    this.inFlightIds.delete(operationId);
    const op = this.queue.find((o) => o.operationId === operationId);
    if (op) {
      op.status = 'SYNCED';
      this.syncedFingerprints.add(op.fingerprint);
    }
    // Remove from active queue once successfully synced
    this.queue = this.queue.filter((o) => o.operationId !== operationId);
    this.saveToStorage();
    this.notifyListeners();
  }

  public markFailed(operationId: string, errorMessage: string, isConflict: boolean = false): void {
    this.inFlightIds.delete(operationId);
    const op = this.queue.find((o) => o.operationId === operationId);
    if (op) {
      op.retryCount++;
      op.errorMessage = errorMessage;
      if (isConflict) {
        op.status = 'CONFLICT';
      } else if (op.retryCount >= op.maxRetries) {
        op.status = 'FAILED';
      } else {
        op.status = 'QUEUED'; // Ready for retry
      }
    }
    this.saveToStorage();
    this.notifyListeners();
  }

  public clearQueue(): void {
    this.queue = [];
    this.inFlightIds.clear();
    this.saveToStorage();
    this.notifyListeners();
  }

  public retryAllFailed(): void {
    this.queue.forEach((op) => {
      if (op.status === 'FAILED' || op.status === 'CONFLICT') {
        op.status = 'QUEUED';
        op.retryCount = 0;
        op.errorMessage = undefined;
      }
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  public removeOperation(operationId: string): void {
    this.inFlightIds.delete(operationId);
    this.queue = this.queue.filter((o) => o.operationId !== operationId);
    this.saveToStorage();
    this.notifyListeners();
  }

  public subscribe(listener: (queue: SyncOperation[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.queue]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.queue]);
      } catch (err) {
        console.error('[SafeSyncQueue] Listener error:', err);
      }
    });
  }
}

export const safeSyncQueue = SafeSyncQueue.getInstance();
