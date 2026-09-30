/**
 * R627: Virtual Process Table (/proc)
 * State table representing active background engines, daemons, and autonomous swarms.
 * Provides Linux-style /proc tracking with Virtual PID, memory, capabilities, heartbeat, and signal handling.
 */

import { VirtualNamespace } from './KernelNamespaceManager';
import { TADECapability } from './CapabilityKernelEngine';

export type ProcessHealth = 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'ZOMBIE';
export type ProcessRecoveryState = 'IDLE' | 'RESTORING' | 'RECOVERED' | 'FAILED_OVER';
export type VirtualSignal = 'SIGHUP' | 'SIGTERM' | 'SIGRECOVERY' | 'SIGKILL' | 'SIGPAUSE';

export interface VirtualProcessEntry {
  vpid: number;
  name: string;
  command: string;
  namespace: VirtualNamespace;
  user: 'root' | 'sovereign' | 'guardian' | 'ai_asy' | 'civil_staff' | 'micro_agent';
  state: 'RUNNING' | 'SLEEPING' | 'WAITING_IPC' | 'RECOVERING' | 'STOPPED';
  health: ProcessHealth;
  recoveryState: ProcessRecoveryState;
  capabilities: TADECapability[];
  cpuUsagePct: number;
  memoryBytes: number;
  heartbeatTimestamp: number;
  uptimeSeconds: number;
  signalsReceived: { signal: VirtualSignal; timestamp: number }[];
}

class VirtualProcessTable {
  private static instance: VirtualProcessTable;

  private processes: Map<number, VirtualProcessEntry> = new Map();
  private nextPid: number = 1001;

  private constructor() {
    this.seedVirtualProcesses();
  }

  public static getInstance(): VirtualProcessTable {
    if (!VirtualProcessTable.instance) {
      VirtualProcessTable.instance = new VirtualProcessTable();
    }
    return VirtualProcessTable.instance;
  }

  private seedVirtualProcesses(): void {
    const defaultProcesses: Omit<VirtualProcessEntry, 'vpid' | 'heartbeatTimestamp' | 'uptimeSeconds' | 'signalsReceived'>[] = [
      {
        name: 'init_kernel_daemon',
        command: '/sbin/tade_init --ring0 --immutable',
        namespace: 'SYSTEM_KERNEL',
        user: 'root',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_ALL'],
        cpuUsagePct: 0.8,
        memoryBytes: 32 * 1024 * 1024,
      },
      {
        name: 'guardian_sentinel_d',
        command: '/usr/bin/guardian_sentinel --defcon=5 --isolate',
        namespace: 'GUARDIAN',
        user: 'guardian',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_SESSION_ISOLATE', 'CAP_RING0_PROTECT', 'CAP_MEM_LOCK', 'CAP_DEFCON_SET'],
        cpuUsagePct: 1.4,
        memoryBytes: 64 * 1024 * 1024,
      },
      {
        name: 'ai_asy_pm_cabinet_d',
        command: '/usr/bin/ai_asy_pm --cabinet=10 --mode=ramah',
        namespace: 'AI_ASY',
        user: 'ai_asy',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_TASK_PLAN', 'CAP_EXEC_BRIEF', 'CAP_CIVIL_DELEGATE', 'CAP_ORCHESTRATE'],
        cpuUsagePct: 2.1,
        memoryBytes: 48 * 1024 * 1024,
      },
      {
        name: 'wal_journal_writer',
        command: '/usr/lib/storage/wal_writer --pre-commit --sha256',
        namespace: 'SYSTEM_KERNEL',
        user: 'root',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_MEM_LOCK', 'CAP_RECOVERY_START'],
        cpuUsagePct: 0.5,
        memoryBytes: 16 * 1024 * 1024,
      },
      {
        name: 'civil_service_worker_d',
        command: '/usr/bin/civil_workforce --ministries=10',
        namespace: 'CIVIL_SERVICE',
        user: 'civil_staff',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_ACADEMIC_ANALYZE', 'CAP_FINANCE_AUDIT', 'CAP_ATTENDANCE_VERIFY'],
        cpuUsagePct: 1.2,
        memoryBytes: 28 * 1024 * 1024,
      },
      {
        name: 'micro_swarm_scrubber',
        command: '/usr/lib/agents/scrubber --sub-second --gc',
        namespace: 'GUARDIAN',
        user: 'micro_agent',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_DATA_SCRUB', 'CAP_CACHE_PRUNE'],
        cpuUsagePct: 0.3,
        memoryBytes: 8 * 1024 * 1024,
      },
      {
        name: 'telemetry_matrix_d',
        command: '/usr/bin/telemetry_bus --unified --matrix',
        namespace: 'WAR_ROOM',
        user: 'sovereign',
        state: 'RUNNING',
        health: 'OPTIMAL',
        recoveryState: 'IDLE',
        capabilities: ['CAP_METRIC_SAMPLE'],
        cpuUsagePct: 0.7,
        memoryBytes: 12 * 1024 * 1024,
      },
    ];

    defaultProcesses.forEach((dp) => {
      const vpid = this.nextPid++;
      this.processes.set(vpid, {
        ...dp,
        vpid,
        heartbeatTimestamp: Date.now(),
        uptimeSeconds: Math.floor(Math.random() * 50000) + 12000,
        signalsReceived: [],
      });
    });
  }

  public getProcessList(): VirtualProcessEntry[] {
    return Array.from(this.processes.values());
  }

  public getProcessByPid(vpid: number): VirtualProcessEntry | undefined {
    return this.processes.get(vpid);
  }

  public pulseHeartbeat(vpid: number): boolean {
    const proc = this.processes.get(vpid);
    if (!proc) return false;
    proc.heartbeatTimestamp = Date.now();
    proc.uptimeSeconds += 2;
    return true;
  }

  public pulseAll(): void {
    const now = Date.now();
    this.processes.forEach((proc) => {
      proc.heartbeatTimestamp = now;
      proc.uptimeSeconds += 2;
    });
  }

  public sendSignal(vpid: number, signal: VirtualSignal): { success: boolean; message: string } {
    const proc = this.processes.get(vpid);
    if (!proc) return { success: false, message: `VPID ${vpid} not found` };

    proc.signalsReceived.push({ signal, timestamp: Date.now() });

    switch (signal) {
      case 'SIGRECOVERY':
        proc.state = 'RECOVERING';
        proc.recoveryState = 'RESTORING';
        setTimeout(() => {
          proc.state = 'RUNNING';
          proc.health = 'OPTIMAL';
          proc.recoveryState = 'RECOVERED';
        }, 1000);
        return { success: true, message: `Sent SIGRECOVERY to ${proc.name} (VPID ${vpid}). Autonomous restore initiated.` };
      case 'SIGHUP':
        proc.health = 'OPTIMAL';
        proc.state = 'RUNNING';
        return { success: true, message: `Sent SIGHUP to ${proc.name} (VPID ${vpid}). Configuration reloaded.` };
      case 'SIGPAUSE':
        proc.state = 'SLEEPING';
        return { success: true, message: `Sent SIGPAUSE to ${proc.name} (VPID ${vpid}). Process suspended.` };
      case 'SIGTERM':
      case 'SIGKILL':
        proc.state = 'STOPPED';
        proc.health = 'CRITICAL';
        return { success: true, message: `Sent ${signal} to ${proc.name} (VPID ${vpid}). Process stopped.` };
      default:
        return { success: true, message: `Signal ${signal} dispatched to VPID ${vpid}.` };
    }
  }

  public registerProcess(
    name: string,
    command: string,
    namespace: VirtualNamespace,
    user: VirtualProcessEntry['user'],
    capabilities: TADECapability[],
    memoryBytes: number = 16 * 1024 * 1024
  ): VirtualProcessEntry {
    const vpid = this.nextPid++;
    const newProc: VirtualProcessEntry = {
      vpid,
      name,
      command,
      namespace,
      user,
      state: 'RUNNING',
      health: 'OPTIMAL',
      recoveryState: 'IDLE',
      capabilities,
      cpuUsagePct: 0.4,
      memoryBytes,
      heartbeatTimestamp: Date.now(),
      uptimeSeconds: 0,
      signalsReceived: [],
    };
    this.processes.set(vpid, newProc);
    return newProc;
  }
}

export const virtualProcessTable = VirtualProcessTable.getInstance();
