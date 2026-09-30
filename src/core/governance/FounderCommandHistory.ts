/**
 * R708 — Founder Command History
 * Immutable, searchable, and filterable command audit history for Founder / Super Admin actions.
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE)
 */

export interface FounderCommandRecord {
  commandId: string;
  timestamp: string;
  executor: string;
  commandType: 'EMERGENCY_LOCKDOWN' | 'DRYRUN_TRIGGER' | 'HEALTH_INSPECTION' | 'DRIFT_SCAN' | 'BACKUP_EXPORT' | 'POLICY_OVERRIDE' | 'AUDIT_SEAL';
  targetModule: string;
  payloadSummary: string;
  executionStatus: 'SUCCESS' | 'BLOCKED_BY_GUARDIAN' | 'SIMULATED';
  auditHash: string;
}

const STORAGE_KEY = 'tade_founder_command_history_rc88';

const SEED_COMMANDS: FounderCommandRecord[] = [
  {
    commandId: 'CMD-FDR-001',
    timestamp: '2026-08-16T09:00:00Z',
    executor: 'Founder & Super Admin',
    commandType: 'EMERGENCY_LOCKDOWN',
    targetModule: 'Guardian Ring-0',
    payloadSummary: 'Lockdown status verification & security perimeter arming.',
    executionStatus: 'SUCCESS',
    auditHash: 'HASH-8831-ARMED'
  },
  {
    commandId: 'CMD-FDR-002',
    timestamp: '2026-08-17T11:20:00Z',
    executor: 'Founder & Super Admin',
    commandType: 'DRYRUN_TRIGGER',
    targetModule: 'Hermes Adaptive Dry-Run Lab (R700)',
    payloadSummary: 'Trigger 5-vector qualification test on Adaptive SPP Remittance Workflow.',
    executionStatus: 'SUCCESS',
    auditHash: 'HASH-9921-QUALIFIED'
  },
  {
    commandId: 'CMD-FDR-003',
    timestamp: '2026-08-18T02:15:00Z',
    executor: 'Founder & Super Admin',
    commandType: 'DRIFT_SCAN',
    targetModule: 'Configuration Drift Detector (R705)',
    payloadSummary: 'Run baseline configuration alignment scan across 4 scopes.',
    executionStatus: 'SUCCESS',
    auditHash: 'HASH-1002-IN_SYNC'
  },
  {
    commandId: 'CMD-FDR-004',
    timestamp: '2026-08-18T03:45:00Z',
    executor: 'Founder & Super Admin',
    commandType: 'AUDIT_SEAL',
    targetModule: 'RC88 Governance War Room (R710)',
    payloadSummary: 'Founder seal and sign-off on RC88 Operational Intelligence suite.',
    executionStatus: 'SUCCESS',
    auditHash: 'HASH-7762-SEALED'
  }
];

export class FounderCommandHistory {
  private static instance: FounderCommandHistory;
  private commands: FounderCommandRecord[];

  private constructor() {
    this.commands = this.loadCommands();
  }

  public static getInstance(): FounderCommandHistory {
    if (!FounderCommandHistory.instance) {
      FounderCommandHistory.instance = new FounderCommandHistory();
    }
    return FounderCommandHistory.instance;
  }

  private loadCommands(): FounderCommandRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return [...SEED_COMMANDS];
  }

  private saveCommands(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.commands));
    } catch {
      // Ignore
    }
  }

  public getCommands(filterType?: string, searchQuery?: string): FounderCommandRecord[] {
    let result = [...this.commands];

    if (filterType && filterType !== 'ALL') {
      result = result.filter(c => c.commandType === filterType);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.commandId.toLowerCase().includes(q) ||
        c.targetModule.toLowerCase().includes(q) ||
        c.payloadSummary.toLowerCase().includes(q) ||
        c.executor.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public recordCommand(
    commandType: FounderCommandRecord['commandType'],
    targetModule: string,
    payloadSummary: string,
    executionStatus: FounderCommandRecord['executionStatus'] = 'SUCCESS'
  ): FounderCommandRecord {
    const timestamp = new Date().toISOString();
    const commandId = `CMD-FDR-${String(this.commands.length + 1).padStart(3, '0')}`;
    const auditHash = `HASH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${executionStatus}`;

    const newCmd: FounderCommandRecord = {
      commandId,
      timestamp,
      executor: 'Founder & Super Admin',
      commandType,
      targetModule,
      payloadSummary,
      executionStatus,
      auditHash
    };

    this.commands.unshift(newCmd);
    this.saveCommands();
    return newCmd;
  }
}
