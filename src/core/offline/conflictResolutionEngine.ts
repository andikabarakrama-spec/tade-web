/**
 * TADE RC91 — R733 Conflict Resolution Engine
 * Detects and safely resolves synchronization conflicts between offline operations and SSoT.
 * Explicitly forbids dangerous blind auto-merging.
 * Categories: TIMESTAMP_CONFLICT, DUPLICATE_WRITE, STALE_STATE, MANUAL_CONFLICT.
 */

import { ConflictRecord, ConflictCategory, ResolutionStrategy, SyncOperation } from './offlineTypes';

const CONFLICTS_STORAGE_KEY = 'tade_offline_conflicts_v1';

export class ConflictResolutionEngine {
  private static instance: ConflictResolutionEngine;
  private conflicts: ConflictRecord[] = [];
  private listeners: Set<(conflicts: ConflictRecord[]) => void> = new Set();

  private constructor() {
    this.loadConflicts();
  }

  public static getInstance(): ConflictResolutionEngine {
    if (!ConflictResolutionEngine.instance) {
      ConflictResolutionEngine.instance = new ConflictResolutionEngine();
    }
    return ConflictResolutionEngine.instance;
  }

  private loadConflicts(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(CONFLICTS_STORAGE_KEY);
      if (raw) {
        this.conflicts = JSON.parse(raw);
      } else {
        // Seed some representative audit examples if empty
        this.conflicts = [
          {
            id: 'conf_init_1',
            operationId: 'op_draft_892',
            entityType: 'STUDENT_NOTE',
            category: 'TIMESTAMP_CONFLICT',
            localVersion: { note: 'Orang tua konfirmasi penjemputan 12:30', version: 3, updatedAt: '2026-08-18T05:40:00Z' },
            remoteVersion: { note: 'Orang tua konfirmasi penjemputan 12:45 oleh Kakek', version: 4, updatedAt: '2026-08-18T05:42:15Z' },
            detectedAt: '2026-08-18T05:45:00Z',
            status: 'RESOLVED',
            resolutionStrategy: 'SSOT_AUTHORITATIVE',
            resolvedAt: '2026-08-18T05:46:00Z',
            resolvedBy: 'FOUNDER_RULE',
            resolutionNotes: 'SSoT version 4 dipertahankan karena memiliki catatan spesifik penjemput pihak ketiga.'
          }
        ];
        this.saveConflicts();
      }
    } catch {
      this.conflicts = [];
    }
  }

  private saveConflicts(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(CONFLICTS_STORAGE_KEY, JSON.stringify(this.conflicts));
    } catch (e) {
      console.warn('[ConflictResolutionEngine] Storage save failed', e);
    }
  }

  /**
   * Evaluate if an operation has a conflict against authoritative SSoT state.
   */
  public evaluateOperation(
    operation: SyncOperation,
    remoteState: Record<string, any> | null
  ): { hasConflict: boolean; category?: ConflictCategory; reason?: string } {
    // 1. If remote record does not exist and action is UPDATE or DELETE -> STALE_STATE
    if (!remoteState && (operation.action === 'UPDATE' || operation.action === 'DELETE')) {
      return {
        hasConflict: true,
        category: 'STALE_STATE',
        reason: `Target entity ${operation.entityType} dengan ID tersebut tidak ditemukan di SSoT.`
      };
    }

    // 2. If entity is financial / grading -> Requires strict manual review on collision
    const isSensitive = ['FINANCE', 'TABUNGAN', 'RAPORT', 'PPDB_VERIFICATION', 'SECURITY_LOCK'].includes(
      operation.entityType
    );

    if (remoteState && remoteState.updatedAt && operation.payload.updatedAt) {
      const remoteTime = new Date(remoteState.updatedAt).getTime();
      const localTime = new Date(operation.payload.updatedAt).getTime();

      // Remote has newer changes than the local base
      if (remoteTime > localTime) {
        if (isSensitive) {
          return {
            hasConflict: true,
            category: 'MANUAL_CONFLICT',
            reason: `Data sensitif ${operation.entityType} telah dimodifikasi oleh sistem lain pada ${remoteState.updatedAt}. Wajib tinjauan manual.`
          };
        }
        return {
          hasConflict: true,
          category: 'TIMESTAMP_CONFLICT',
          reason: `Versi SSoT lebih baru (${remoteState.updatedAt}) dibanding draft offline (${operation.payload.updatedAt}).`
        };
      }
    }

    // 3. Version number mismatch check
    if (
      remoteState &&
      remoteState.version !== undefined &&
      operation.payload.baseVersion !== undefined &&
      remoteState.version !== operation.payload.baseVersion
    ) {
      return {
        hasConflict: true,
        category: 'DUPLICATE_WRITE',
        reason: `Base version lokal (${operation.payload.baseVersion}) tidak sesuai dengan current version SSoT (${remoteState.version}).`
      };
    }

    return { hasConflict: false };
  }

  /**
   * Record a detected conflict into the audit registry.
   */
  public recordConflict(
    operation: SyncOperation,
    category: ConflictCategory,
    remoteVersion: Record<string, any>,
    autoStrategy?: ResolutionStrategy,
    notes?: string
  ): ConflictRecord {
    const conflict: ConflictRecord = {
      id: `conf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      operationId: operation.operationId,
      entityType: operation.entityType,
      category,
      localVersion: operation.payload,
      remoteVersion,
      detectedAt: new Date().toISOString(),
      status: autoStrategy ? 'RESOLVED' : 'UNRESOLVED',
      resolutionStrategy: autoStrategy,
      resolvedAt: autoStrategy ? new Date().toISOString() : undefined,
      resolvedBy: autoStrategy ? 'AUTO_GUARDIAN_POLICY' : undefined,
      resolutionNotes: notes
    };

    this.conflicts.unshift(conflict);
    this.saveConflicts();
    this.notifyListeners();
    return conflict;
  }

  /**
   * Manually resolve an existing conflict.
   */
  public resolveConflict(
    conflictId: string,
    strategy: ResolutionStrategy,
    resolvedBy: string,
    notes: string
  ): boolean {
    const conf = this.conflicts.find((c) => c.id === conflictId);
    if (!conf) return false;

    conf.status = strategy === 'REJECT_STALE' ? 'REJECTED' : 'RESOLVED';
    conf.resolutionStrategy = strategy;
    conf.resolvedAt = new Date().toISOString();
    conf.resolvedBy = resolvedBy;
    conf.resolutionNotes = notes;

    this.saveConflicts();
    this.notifyListeners();
    return true;
  }

  public getConflicts(): ConflictRecord[] {
    return [...this.conflicts];
  }

  public getUnresolvedCount(): number {
    return this.conflicts.filter((c) => c.status === 'UNRESOLVED').length;
  }

  public clearResolvedConflicts(): void {
    this.conflicts = this.conflicts.filter((c) => c.status === 'UNRESOLVED');
    this.saveConflicts();
    this.notifyListeners();
  }

  public subscribe(listener: (conflicts: ConflictRecord[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.conflicts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.conflicts]);
      } catch (err) {
        console.error('[ConflictResolutionEngine] Listener error:', err);
      }
    });
  }
}

export const conflictResolutionEngine = ConflictResolutionEngine.getInstance();
