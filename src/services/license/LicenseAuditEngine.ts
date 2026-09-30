import { LicenseState, PolicyType } from './LicensePolicy';

export interface LicenseAuditEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: 'ACTIVATED' | 'RENEWED' | 'SUSPENDED' | 'TERMINATED' | 'EXPIRED' | 'GRACE_ENTERED' | 'POLICY_UPDATED';
  previousStatus: LicenseState;
  newStatus: LicenseState;
  policyType: PolicyType;
  details: string;
}

const STORAGE_KEY_AUDIT = 'TADE_LICENSE_AUDIT_LOGS';

class LicenseAuditEngineClass {
  public getLogs(): LicenseAuditEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to parse license audit logs', e);
    }
    return [
      {
        id: 'AUDIT-INIT-001',
        timestamp: new Date().toISOString(),
        operator: 'SYSTEM_SUPER_ADMIN',
        action: 'ACTIVATED',
        previousStatus: 'NOT_ACTIVATED',
        newStatus: 'ACTIVE',
        policyType: 'ENTERPRISE_LICENSE',
        details: 'Lisensi Resmi TK ASY SYIFA TADE v1.0.5 LTS diaktifkan secara otomatis.'
      }
    ];
  }

  public addLog(entry: Omit<LicenseAuditEntry, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    const newLog: LicenseAuditEntry = {
      ...entry,
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog); // latest first
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs.slice(0, 100))); // keep top 100
    } catch (e) {
      console.error('Failed to save license audit log', e);
    }
  }

  public clearLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUDIT);
    } catch (e) {
      console.error('Failed to clear license audit logs', e);
    }
  }
}

export const LicenseAuditEngine = new LicenseAuditEngineClass();
