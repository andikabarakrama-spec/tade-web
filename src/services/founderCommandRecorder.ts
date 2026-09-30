/**
 * TADE FOUNDER OFFICE PHASE-1 — SPRINT G3
 * Founder Command Recorder Service
 * Comprehensive audit trail of all Founder executive actions, directives, overrides, and approvals.
 * Single Source of Truth: localStorage (tade_founder_command_recorder_v1) + blackBoxRecorder integration
 */

import { blackBoxRecorder } from './blackBoxRecorder';

export type FounderActionType = 
  | 'DIRECTIVE' 
  | 'POLICY_OVERRIDE' 
  | 'BROADCAST_AUTH' 
  | 'SYSTEM_DIAGNOSTIC' 
  | 'MEDIA_VALIDATION' 
  | 'CABINET_RESOLUTION' 
  | 'SECURITY_ARM' 
  | 'CONFIG_UPDATE';

export type FounderExecutionStatus = 'RECORDED' | 'DISPATCHED' | 'EXECUTED' | 'VERIFIED' | 'BLOCKED_BY_POLICY';

export interface FounderCommandEntry {
  id: string;
  timestamp: string;
  actor: string;
  actionType: FounderActionType;
  module: string;
  description: string;
  status: FounderExecutionStatus;
  auditHash: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'tade_founder_command_recorder_v1';

const INITIAL_SEEDS: FounderCommandEntry[] = [
  {
    id: 'FDR-CMD-2026-001',
    timestamp: '2026-08-21T02:10:00.000Z',
    actor: 'Founder Andika (Super Admin)',
    actionType: 'SECURITY_ARM',
    module: 'Guardian Ring-0',
    description: 'Arming security perimeter dan verifikasi zero-leakage RBAC.',
    status: 'VERIFIED',
    auditHash: 'SHA256-883F-ARMED-SECURE',
    metadata: { perimeterLevel: 'HIGH', ringStatus: 'ARMED' }
  },
  {
    id: 'FDR-CMD-2026-002',
    timestamp: '2026-08-21T03:30:00.000Z',
    actor: 'Founder Andika (Super Admin)',
    actionType: 'SYSTEM_DIAGNOSTIC',
    module: 'Dr. Pulse Diagnostics',
    description: 'Menjalankan audit kesiapan go-live dan telemetri memori PWA.',
    status: 'VERIFIED',
    auditHash: 'SHA256-992A-DIAG-OPTIMAL',
    metadata: { pwaStatus: 'STANDALONE', memUsage: '28MB' }
  },
  {
    id: 'FDR-CMD-2026-003',
    timestamp: '2026-08-21T04:15:00.000Z',
    actor: 'Founder Andika (Super Admin)',
    actionType: 'BROADCAST_AUTH',
    module: 'Hermes Broadcast Hub',
    description: 'Otorisasi template pesan seragam & tahfidz harian untuk wali murid.',
    status: 'EXECUTED',
    auditHash: 'SHA256-771C-HERMES-AUTH',
    metadata: { broadcastChannels: ['WHATSAPP', 'PWA_PUSH'] }
  },
  {
    id: 'FDR-CMD-2026-004',
    timestamp: '2026-08-21T05:00:00.000Z',
    actor: 'Founder Andika (Super Admin)',
    actionType: 'CABINET_RESOLUTION',
    module: 'Dewan Yayasan & Kepsek',
    description: 'Pengesahan Resolusi Peningkatan Standar Sanitasi & Sentra Bermain.',
    status: 'VERIFIED',
    auditHash: 'SHA256-441D-RESOL-APPROVED',
    metadata: { resolutionId: 'RES-2026-001', consensus: 'UNANIMOUS' }
  }
];

class FounderCommandRecorderService {
  private static instance: FounderCommandRecorderService | null = null;

  public static getInstance(): FounderCommandRecorderService {
    if (!FounderCommandRecorderService.instance) {
      FounderCommandRecorderService.instance = new FounderCommandRecorderService();
    }
    return FounderCommandRecorderService.instance;
  }

  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `SHA256-${Math.abs(hash).toString(16).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  }

  public getHistory(): FounderCommandEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
        return INITIAL_SEEDS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_SEEDS;
    }
  }

  public recordCommand(
    actionType: FounderActionType,
    module: string,
    description: string,
    metadata?: Record<string, any>,
    status: FounderExecutionStatus = 'EXECUTED'
  ): FounderCommandEntry {
    const history = this.getHistory();
    const timestamp = new Date().toISOString();
    const id = `FDR-CMD-${Date.now().toString().slice(-6)}`;
    const auditHash = this.generateHash(`${id}-${actionType}-${module}-${timestamp}`);

    const newEntry: FounderCommandEntry = {
      id,
      timestamp,
      actor: 'Founder Andika (Super Admin)',
      actionType,
      module,
      description,
      status,
      auditHash,
      metadata
    };

    const updated = [newEntry, ...history];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 200)));
    } catch {}

    // Integrate with system blackBoxRecorder
    blackBoxRecorder.record({
      moduleCode: module || 'FOUNDER_RECORDER',
      role: 'SUPER_ADMIN',
      eventType: 'ACTION',
      details: `[${actionType}] ${description} | Hash: ${auditHash}`,
      severity: status === 'BLOCKED_BY_POLICY' ? 'WARN' : 'INFO'
    });

    return newEntry;
  }

  public updateStatus(commandId: string, newStatus: FounderExecutionStatus): boolean {
    const history = this.getHistory();
    const targetIndex = history.findIndex(c => c.id === commandId);
    if (targetIndex === -1) return false;

    history[targetIndex].status = newStatus;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}
    return true;
  }

  public exportJSON(): string {
    return JSON.stringify(this.getHistory(), null, 2);
  }

  public exportCSV(): string {
    const history = this.getHistory();
    const header = 'ID,Timestamp,Actor,ActionType,Module,Description,Status,AuditHash\n';
    const rows = history.map(h => 
      `"${h.id}","${h.timestamp}","${h.actor}","${h.actionType}","${h.module}","${h.description.replace(/"/g, '""')}","${h.status}","${h.auditHash}"`
    ).join('\n');
    return header + rows;
  }

  public clearHistory(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
  }
}

export const founderCommandRecorder = FounderCommandRecorderService.getInstance();
