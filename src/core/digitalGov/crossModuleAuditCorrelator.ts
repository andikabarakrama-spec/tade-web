import { UserRole } from '../../types';
import { GuardianContinuousVerification } from '../sovereign/guardianContinuousVerification';
import { SovereignSessionIntelligence } from '../sovereign/sovereignSessionIntelligence';
import { ImmutableGovernanceJournal } from './immutableGovernanceJournal';

export type AuditSourceModule = 
  | 'GUARDIAN' 
  | 'WAR_ROOM' 
  | 'COMPANION' 
  | 'RECOVERY' 
  | 'REGISTRY' 
  | 'SESSION'
  | 'GOVERNANCE';

export interface CorrelatedAuditEvent {
  correlationId: string;
  sourceModule: AuditSourceModule;
  eventCode: string;
  title: string;
  detail: string;
  severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';
  actorRole: UserRole | 'SYSTEM_KERNEL';
  actorName: string;
  timestamp: string;
  correlationToken: string;
  integrityHash: string;
}

export class CrossModuleAuditCorrelator {
  private static instance: CrossModuleAuditCorrelator;
  private syntheticAuditLogs: CorrelatedAuditEvent[] = [];

  private constructor() {
    this.seedCorrelatedLogs();
  }

  public static getInstance(): CrossModuleAuditCorrelator {
    if (!CrossModuleAuditCorrelator.instance) {
      CrossModuleAuditCorrelator.instance = new CrossModuleAuditCorrelator();
    }
    return CrossModuleAuditCorrelator.instance;
  }

  private seedCorrelatedLogs() {
    this.syntheticAuditLogs = [
      {
        correlationId: 'AUD-CORR-001',
        sourceModule: 'GUARDIAN',
        eventCode: 'GRD-SEC-200',
        title: 'Guardian Ring-0 Vector Verification',
        detail: '6 vektor konstitusional diverifikasi: 0 RBAC drift, 0 SSoT drift, 0 duplicate routes.',
        severity: 'INFO',
        actorRole: 'SYSTEM_KERNEL',
        actorName: 'Guardian Ring-0 Engine',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        correlationToken: 'TOKEN-CORR-SEC-95',
        integrityHash: 'HASH-A99B1201'
      },
      {
        correlationId: 'AUD-CORR-002',
        sourceModule: 'SESSION',
        eventCode: 'SES-AUTH-101',
        title: 'Founder Super Admin Session Initiated',
        detail: 'Sovereign session intelligence mencatat logon Founder dengan token tanpa PII.',
        severity: 'INFO',
        actorRole: 'SUPER_ADMIN',
        actorName: 'Founder Super Admin',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        correlationToken: 'TOKEN-CORR-SES-44',
        integrityHash: 'HASH-B33C8402'
      },
      {
        correlationId: 'AUD-CORR-003',
        sourceModule: 'RECOVERY',
        eventCode: 'REC-SIM-301',
        title: 'Disaster Recovery Readiness Sandbox Drill',
        detail: 'Simulasi pemulihan crash 4-tahap selesai: RTO 1.1s, RPO 0 bytes, database produksi 100% terisolasi.',
        severity: 'INFO',
        actorRole: 'SUPER_ADMIN',
        actorName: 'System Disaster Simulator',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        correlationToken: 'TOKEN-CORR-REC-11',
        integrityHash: 'HASH-C44D7503'
      },
      {
        correlationId: 'AUD-CORR-004',
        sourceModule: 'COMPANION',
        eventCode: 'CMP-FLT-402',
        title: 'Companion Blacklist Filter Enforcement',
        detail: 'Permintaan konteks companion disaring dari kata kunci sensitif (password, NIK, pin).',
        severity: 'NOTICE',
        actorRole: 'SYSTEM_KERNEL',
        actorName: 'Privacy Interceptor',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        correlationToken: 'TOKEN-CORR-CMP-88',
        integrityHash: 'HASH-D55E6604'
      },
      {
        correlationId: 'AUD-CORR-005',
        sourceModule: 'GOVERNANCE',
        eventCode: 'GOV-JRN-501',
        title: 'Immutable Journal Append Action',
        detail: 'Entri ratifikasi tata kelola institusi RC95 ditambahkan ke jurnal append-only.',
        severity: 'INFO',
        actorRole: 'KETUA_YAYASAN',
        actorName: 'H. Andika Barakrama',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        correlationToken: 'TOKEN-CORR-GOV-01',
        integrityHash: 'HASH-E66F5505'
      }
    ];
  }

  public getUnifiedTimeline(filterSource?: AuditSourceModule): CorrelatedAuditEvent[] {
    const journalEntries = ImmutableGovernanceJournal.getInstance().getAllEntries();
    
    // Convert journal entries dynamically to audit events
    const journalAudits: CorrelatedAuditEvent[] = journalEntries.map((j, idx) => ({
      correlationId: `AUD-JRN-${j.sequenceNumber}`,
      sourceModule: 'GOVERNANCE',
      eventCode: `GOV-${j.eventType}`,
      title: j.title,
      detail: j.summary,
      severity: j.eventType === 'APPROVAL_REJECTED' ? 'WARNING' : 'INFO',
      actorRole: j.performedByRole,
      actorName: j.performedByName,
      timestamp: j.timestamp,
      correlationToken: `CORR-JRN-${j.sequenceNumber}`,
      integrityHash: j.cryptographicDigest
    }));

    const combined = [...this.syntheticAuditLogs, ...journalAudits];
    
    // Sort descending by timestamp
    const sorted = combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filterSource) {
      return sorted.filter(e => e.sourceModule === filterSource);
    }
    return sorted;
  }
}
