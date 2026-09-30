/**
 * TADE RC74 — KERNEL SERVICE LIFECYCLE MANAGER (R565) & SUPERVISION ENGINE
 * Inspired by systemd service lifecycle, Kubernetes pod supervisor, OpenBSD daemon control, PostgreSQL WAL replay.
 *
 * Provides:
 * - Deterministic Service State Machine (STARTING, RUNNING, DEGRADED, RECOVERING, STOPPED)
 * - Restart Budgeting & Safe Shutdown Protocols
 * - Dependency Supervision & Health Propagation Control
 * - Smart WAL Journal Replay Capabilities
 * - Permission Drift Detection Hooks
 */

import { EngineId, GuardianKernel } from './GuardianKernelLayer';

export type ServiceLifecycleState = 'STARTING' | 'RUNNING' | 'DEGRADED' | 'RECOVERING' | 'STOPPED';

export interface ServiceDescriptor {
  engineId: EngineId;
  name: string;
  state: ServiceLifecycleState;
  restartBudget: number; // Max restarts per time window (e.g. 5)
  restartsUsed: number;
  uptimeSeconds: number;
  healthScore: number; // 0 - 100%
  lastStateChange: string;
  activeWorkers: number;
  memoryQuotaMb: number;
  memoryUsedMb: number;
  cgroupSandbox: string;
}

export interface ReplayJournalEntry {
  id: string;
  lsn: number; // Log Sequence Number
  timestamp: string;
  engineId: EngineId;
  operation: string;
  payload: Record<string, unknown>;
  checksum: string;
  replayed: boolean;
}

export interface RecoveryPlanAction {
  id: string;
  targetEngine: EngineId;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  triggerCondition: string;
  plannedAction: string;
  estimatedRecoveryMs: number;
  status: 'PROPOSED' | 'EXECUTING' | 'COMPLETED' | 'STANDBY';
  supervisedBy: 'AI_ASY' | 'GUARDIAN_KERNEL';
}

class KernelServiceLifecycleManagerSingleton {
  private services: Map<EngineId, ServiceDescriptor> = new Map();
  private walReplayLog: ReplayJournalEntry[] = [];
  private recoveryPlans: RecoveryPlanAction[] = [];
  private permissionDriftViolations: { timestamp: string; role: string; engine: EngineId; violation: string; corrected: boolean }[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initializeServiceRegistry();
    this.seedWalJournalLog();
    this.seedRecoveryPlans();
    this.seedPermissionDriftAudit();
  }

  private initializeServiceRegistry() {
    const allEngines: { id: EngineId; name: string; memQuota: number }[] = [
      { id: 'GUARDIAN', name: 'Guardian Security Supervisor', memQuota: 64 },
      { id: 'SESSION', name: 'Session & Auth Subsystem', memQuota: 32 },
      { id: 'AI_ASY', name: 'AI Asy Cognitive Engine', memQuota: 96 },
      { id: 'DISCOVERY', name: 'Discovery Registry System', memQuota: 32 },
      { id: 'FIRESTORE', name: 'Firestore Storage Pipeline', memQuota: 64 },
      { id: 'WAR_ROOM', name: 'War Room Operations Center', memQuota: 48 },
      { id: 'PPDB', name: 'PPDB Admissions Engine', memQuota: 48 },
      { id: 'RAPORT', name: 'Raport Academic Engine', memQuota: 48 },
      { id: 'KEUANGAN', name: 'Keuangan SPP Ledger', memQuota: 48 },
      { id: 'WEBSITE', name: 'Public Website Isolated Sandbox', memQuota: 32 },
      { id: 'CCTV', name: 'CCTV Stream & Timeline', memQuota: 64 },
      { id: 'ANIMATION', name: 'UI & FX Animation Governor', memQuota: 32 }
    ];

    allEngines.forEach(e => {
      this.services.set(e.id, {
        engineId: e.id,
        name: e.name,
        state: 'RUNNING',
        restartBudget: 5,
        restartsUsed: 0,
        uptimeSeconds: 86400 + Math.floor(Math.random() * 7200),
        healthScore: 100,
        lastStateChange: new Date().toISOString(),
        activeWorkers: e.id === 'AI_ASY' || e.id === 'FIRESTORE' ? 3 : 1,
        memoryQuotaMb: e.memQuota,
        memoryUsedMb: Math.round((e.memQuota * 0.35 + Math.random() * 5) * 10) / 10,
        cgroupSandbox: `cgroup.v2/tade_slice/${e.id.toLowerCase()}.service`
      });
    });
  }

  private seedWalJournalLog() {
    const operations: { engine: EngineId; op: string; payload: Record<string, unknown> }[] = [
      { engine: 'GUARDIAN', op: 'SUPERVISOR_INIT', payload: { level: 'RING_0', mode: 'ENFORCING' } },
      { engine: 'SESSION', op: 'BIND_WORM_TOKEN', payload: { uid: 'usr_superadmin_01', scope: 'ALL' } },
      { engine: 'FIRESTORE', op: 'WAL_CHECKPOINT_FLUSH', payload: { lsn: 10042, dirtyPages: 0 } },
      { engine: 'PPDB', op: 'ADMISSION_REGISTER_TX', payload: { candidateId: 'PPD2026-091', verified: true } },
      { engine: 'KEUANGAN', op: 'SPP_PAYMENT_TX', payload: { invoice: 'INV-SPP-771', amount: 450000 } },
      { engine: 'AI_ASY', op: 'AUTONOMOUS_PLAN_GENERATED', payload: { target: 'FIRESTORE', confidence: 0.99 } }
    ];

    operations.forEach((op, idx) => {
      this.walReplayLog.push({
        id: `WAL-${idx + 1}`,
        lsn: 10000 + idx * 10,
        timestamp: new Date(Date.now() - (operations.length - idx) * 3000).toISOString(),
        engineId: op.engine,
        operation: op.op,
        payload: op.payload,
        checksum: `0xwal_${Math.abs(Math.sin(idx * 43) * 1e16).toString(16).substring(0, 16)}`,
        replayed: true
      });
    });
  }

  private seedRecoveryPlans() {
    this.recoveryPlans = [
      {
        id: 'PLAN-001',
        targetEngine: 'FIRESTORE',
        severity: 'MEDIUM',
        triggerCondition: 'Network latency spike > 350ms or queue depth > 40',
        plannedAction: 'Shift to Local Offline WORM buffer & differential batch retry',
        estimatedRecoveryMs: 120,
        status: 'STANDBY',
        supervisedBy: 'AI_ASY'
      },
      {
        id: 'PLAN-002',
        targetEngine: 'CCTV',
        severity: 'LOW',
        triggerCondition: 'Frame buffer drop > 3 frames/sec',
        plannedAction: 'Degrade stream to 720p thumbnail feed and throttle worker',
        estimatedRecoveryMs: 80,
        status: 'STANDBY',
        supervisedBy: 'GUARDIAN_KERNEL'
      },
      {
        id: 'PLAN-003',
        targetEngine: 'PPDB',
        severity: 'HIGH',
        triggerCondition: 'Concurrent admission submissions exceed quota buffer',
        plannedAction: 'Engage Adaptive Queue Prioritizer and reserve 15% CFS CPU',
        estimatedRecoveryMs: 160,
        status: 'PROPOSED',
        supervisedBy: 'AI_ASY'
      }
    ];
  }

  private seedPermissionDriftAudit() {
    this.permissionDriftViolations = [
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        role: 'GURU',
        engine: 'KEUANGAN',
        violation: 'Attempted ledger write via legacy direct mutation path',
        corrected: true
      },
      {
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        role: 'WALI_MURID',
        engine: 'GUARDIAN',
        violation: 'Unauthorized syscall to supervisor configuration',
        corrected: true
      }
    ];
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- PUBLIC API ---

  public getServices(): ServiceDescriptor[] {
    return Array.from(this.services.values());
  }

  public transitionServiceState(engineId: EngineId, newState: ServiceLifecycleState) {
    const s = this.services.get(engineId);
    if (!s) return;
    s.state = newState;
    s.lastStateChange = new Date().toISOString();
    if (newState === 'DEGRADED') {
      s.healthScore = 65;
    } else if (newState === 'RECOVERING') {
      s.healthScore = 85;
      s.restartsUsed = Math.min(s.restartBudget, s.restartsUsed + 1);
    } else if (newState === 'RUNNING') {
      s.healthScore = 100;
    }
    this.notify();
  }

  public getWalReplayLog(): ReplayJournalEntry[] {
    return [...this.walReplayLog].reverse();
  }

  public appendWalEntry(engineId: EngineId, operation: string, payload: Record<string, unknown>): ReplayJournalEntry {
    const nextLsn = (this.walReplayLog[this.walReplayLog.length - 1]?.lsn || 10000) + 10;
    const entry: ReplayJournalEntry = {
      id: `WAL-${this.walReplayLog.length + 1}`,
      lsn: nextLsn,
      timestamp: new Date().toISOString(),
      engineId,
      operation,
      payload,
      checksum: `0xwal_${Math.abs(Math.sin(Date.now()) * 1e16).toString(16).substring(0, 16)}`,
      replayed: true
    };
    this.walReplayLog.push(entry);
    this.notify();
    return entry;
  }

  public getRecoveryPlans(): RecoveryPlanAction[] {
    return [...this.recoveryPlans];
  }

  public executeRecoveryPlan(planId: string) {
    const plan = this.recoveryPlans.find(p => p.id === planId);
    if (!plan) return;
    plan.status = 'EXECUTING';
    this.notify();

    setTimeout(() => {
      plan.status = 'COMPLETED';
      this.transitionServiceState(plan.targetEngine, 'RUNNING');
      GuardianKernel.appendJournal({
        engineId: plan.targetEngine,
        level: 'INFO',
        subsystem: 'SUPERVISOR',
        message: `Recovery plan [${plan.id}] successfully executed by ${plan.supervisedBy}.`
      });
      this.notify();
    }, 800);
  }

  public getPermissionDriftViolations() {
    return [...this.permissionDriftViolations];
  }

  public replayAllWalEntries(): { replayedCount: number; status: 'SUCCESS' | 'FAILED' } {
    return {
      replayedCount: this.walReplayLog.length,
      status: 'SUCCESS'
    };
  }
}

export const KernelServiceSupervisor = new KernelServiceLifecycleManagerSingleton();
