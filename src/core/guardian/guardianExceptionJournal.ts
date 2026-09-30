import { GuardianExceptionEntry, PolicyCategory, PolicySeverity } from './guardianTypes';

/**
 * Pseudo-SHA256 simulation for cryptographic hash chaining of journal entries.
 */
function computeJournalHash(data: string, prevHash: string): string {
  let hash = 0;
  const str = prevHash + ':' + data;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${Math.abs(hash * 31).toString(16).padStart(8, '0')}`.padEnd(66, 'f');
}

/**
 * R746 — Guardian Exception Journal
 * Immutable append-only cryptographic ledger of all policy violations and blocked attempts.
 */
class GuardianExceptionJournal {
  private static instance: GuardianExceptionJournal;
  private journal: GuardianExceptionEntry[] = [];
  private readonly STORAGE_KEY = 'TADE_GUARDIAN_EXCEPTION_JOURNAL_V7';
  private genesisHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

  private constructor() {
    this.loadJournal();
  }

  public static getInstance(): GuardianExceptionJournal {
    if (!GuardianExceptionJournal.instance) {
      GuardianExceptionJournal.instance = new GuardianExceptionJournal();
    }
    return GuardianExceptionJournal.instance;
  }

  private loadJournal() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.journal = JSON.parse(stored);
      } else {
        this.journal = [];
        this.seedInitialJournal();
      }
    } catch {
      this.journal = [];
      this.seedInitialJournal();
    }
  }

  private seedInitialJournal() {
    this.recordException({
      policyId: 'POL-SEC-001',
      policyName: 'Ring-0 Root Authority & Kernel Isolation',
      category: 'SECURITY',
      severity: 'BLOCKING',
      actor: 'SYSTEM_BOOTSTRAP',
      role: 'GUARDIAN_DAEMON',
      targetEntity: 'KERNEL_INITIALIZATION',
      details: 'Genesis exception checkpoint. Guardian policy journal activated with immutable hash linkage.',
      blocked: false
    });
  }

  private saveJournal() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.journal.slice(0, 200)));
    } catch (e) {
      console.warn('[GuardianExceptionJournal] Failed to persist journal', e);
    }
  }

  public recordException(param: {
    policyId: string;
    policyName: string;
    category: PolicyCategory;
    severity: PolicySeverity;
    actor: string;
    role: string;
    targetEntity?: string;
    details: string;
    blocked: boolean;
  }): GuardianExceptionEntry {
    const timestamp = new Date().toISOString();
    const previousHash = this.journal.length > 0 
      ? this.journal[0].hash 
      : this.genesisHash;

    const payload = `${param.policyId}|${param.category}|${param.severity}|${param.actor}|${param.role}|${timestamp}|${param.details}`;
    const hash = computeJournalHash(payload, previousHash);

    const entry: GuardianExceptionEntry = {
      exceptionId: `EXC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      policyId: param.policyId,
      policyName: param.policyName,
      category: param.category,
      severity: param.severity,
      timestamp,
      actor: param.actor,
      role: param.role,
      targetEntity: param.targetEntity || 'SYSTEM',
      details: param.details,
      hash,
      previousHash,
      blocked: param.blocked
    };

    this.journal.unshift(entry);
    this.saveJournal();
    return entry;
  }

  public getJournalEntries(): GuardianExceptionEntry[] {
    return [...this.journal];
  }

  public verifyChainIntegrity(): { isValid: boolean; checkedCount: number; errorIndex?: number } {
    if (this.journal.length <= 1) {
      return { isValid: true, checkedCount: this.journal.length };
    }

    for (let i = 0; i < this.journal.length - 1; i++) {
      const current = this.journal[i];
      const nextOlder = this.journal[i + 1];

      if (current.previousHash !== nextOlder.hash) {
        return { isValid: false, checkedCount: i + 1, errorIndex: i };
      }
    }

    return { isValid: true, checkedCount: this.journal.length };
  }

  public clearNonCritical() {
    // Only retains genesis and critical blocks
    this.journal = this.journal.filter(e => e.severity === 'BLOCKING' || e.actor === 'SYSTEM_BOOTSTRAP');
    this.saveJournal();
  }
}

export const guardianExceptionJournal = GuardianExceptionJournal.getInstance();
