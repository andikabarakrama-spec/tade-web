/**
 * R637 — Service Ownership Registry
 * TADE RC81: Zero Empty Service Ownership & Accountability Directory
 * 
 * Strict constitutional requirement:
 * - Every engine/service MUST declare: Primary Owner, Backup Owner, and Recovery Owner
 * - Zero empty owner allowed (100% ownership coverage mandated)
 * - Real-time SLA response metrics, escalation pathways, and verification stamps.
 */

export interface ServiceOwnerProfile {
  name: string;
  role: string;
  division: 'SOVEREIGN_COUNCIL' | 'PRIME_CABINET' | 'GUARDIAN_CORPS' | 'CIVIL_MINISTRY' | 'INFRA_OPS';
  contactChannel: string;
  heartbeatState: 'ALIVE' | 'STANDBY' | 'ENGAGED';
  lastChecked: string;
}

export interface EngineOwnershipEntry {
  engineId: string;
  engineName: string;
  category: string;
  primaryOwner: ServiceOwnerProfile;
  backupOwner: ServiceOwnerProfile;
  recoveryOwner: ServiceOwnerProfile;
  slaTargetMinutes: number; // e.g. 5 mins for Tier-0, 15 mins for Tier-1
  escalationPath: string[];
  ownershipCompliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'DEGRADED';
  cryptographicVerificationHash: string;
}

export class ServiceOwnershipRegistry {
  private static instance: ServiceOwnershipRegistry | null = null;
  private registry: Map<string, EngineOwnershipEntry> = new Map();

  private constructor() {
    this.seedRegistry();
  }

  public static getInstance(): ServiceOwnershipRegistry {
    if (!ServiceOwnershipRegistry.instance) {
      ServiceOwnershipRegistry.instance = new ServiceOwnershipRegistry();
    }
    return ServiceOwnershipRegistry.instance;
  }

  private seedRegistry() {
    const defaultServices: EngineOwnershipEntry[] = [
      {
        engineId: 'ENG-KERNEL-R625',
        engineName: 'Kernel Namespace Manager',
        category: 'KERNEL',
        primaryOwner: {
          name: 'Guardian Supreme General',
          role: 'RING0_SECURITY_DIRECTOR',
          division: 'GUARDIAN_CORPS',
          contactChannel: 'SEC-NET-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        backupOwner: {
          name: 'Deputy Kernel Marshal',
          role: 'SENIOR_KERNEL_ENGINEER',
          division: 'GUARDIAN_CORPS',
          contactChannel: 'SEC-NET-02',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        recoveryOwner: {
          name: 'Sovereign Emergency Taskforce',
          role: 'SYSTEM_FAILOVER_LEAD',
          division: 'SOVEREIGN_COUNCIL',
          contactChannel: 'SOV-DIRECT-99',
          heartbeatState: 'STANDBY',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        slaTargetMinutes: 2,
        escalationPath: ['Guardian Ring 0', 'Deputy Kernel Marshal', 'Ketua Yayasan'],
        ownershipCompliance: 'COMPLIANT',
        cryptographicVerificationHash: 'SHA256:8a1b2c3d4e5f607182930415263748596a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d'
      },
      {
        engineId: 'ENG-AI-R036',
        engineName: 'AI Operating System & Civil Orchestrator',
        category: 'AI_COGNITIVE',
        primaryOwner: {
          name: 'AI Asy Prime Minister',
          role: 'CIVIL_CHIEF_OF_STAFF',
          division: 'PRIME_CABINET',
          contactChannel: 'ASY-CIVIL-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        backupOwner: {
          name: 'Minister of Digital Operations',
          role: 'CABINET_DEPUTY',
          division: 'PRIME_CABINET',
          contactChannel: 'ASY-CIVIL-02',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        recoveryOwner: {
          name: 'Autonomous Self-Healing Daemon',
          role: 'RECOVERY_SCRUBBER',
          division: 'INFRA_OPS',
          contactChannel: 'HEAL-AUTO-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        slaTargetMinutes: 5,
        escalationPath: ['AI Asy Prime Minister', 'Cabinet Deputy', 'Ketua Yayasan'],
        ownershipCompliance: 'COMPLIANT',
        cryptographicVerificationHash: 'SHA256:1f2e3d4c5b6a708192a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'
      },
      {
        engineId: 'ENG-STORAGE-R594',
        engineName: 'Immortal Storage VFS & WAL Ledger',
        category: 'STORAGE',
        primaryOwner: {
          name: 'VFS Custodian Officer',
          role: 'STORAGE_ARCHITECT',
          division: 'INFRA_OPS',
          contactChannel: 'VFS-OPS-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        backupOwner: {
          name: 'WAL Integrity Supervisor',
          role: 'DATABASE_RELIABILITY_LEAD',
          division: 'INFRA_OPS',
          contactChannel: 'VFS-OPS-02',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        recoveryOwner: {
          name: 'Guardian Disaster Swarm',
          role: 'SWARM_RECOVERY_COMMAND',
          division: 'GUARDIAN_CORPS',
          contactChannel: 'SWARM-DEF-09',
          heartbeatState: 'STANDBY',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        slaTargetMinutes: 3,
        escalationPath: ['VFS Custodian', 'WAL Supervisor', 'Guardian Disaster Swarm', 'Ketua Yayasan'],
        ownershipCompliance: 'COMPLIANT',
        cryptographicVerificationHash: 'SHA256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'
      },
      {
        engineId: 'ENG-CIVIL-R624',
        engineName: 'Civil Service 10 Ministries Hub',
        category: 'CIVIL',
        primaryOwner: {
          name: 'Civil Service Secretary General',
          role: 'PUBLIC_ADMIN_DIRECTOR',
          division: 'CIVIL_MINISTRY',
          contactChannel: 'CIV-ADM-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        backupOwner: {
          name: 'Head of Academic & Treasury Affairs',
          role: 'MINISTRY_OPERATIONS_LEAD',
          division: 'CIVIL_MINISTRY',
          contactChannel: 'CIV-ADM-02',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        recoveryOwner: {
          name: 'AI Asy Civil Restoration Agent',
          role: 'PIPELINE_RESILIENCE_OFFICER',
          division: 'PRIME_CABINET',
          contactChannel: 'ASY-RESTORE-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        slaTargetMinutes: 10,
        escalationPath: ['Civil Service SecGen', 'Academic Head', 'AI Asy Prime Minister'],
        ownershipCompliance: 'COMPLIANT',
        cryptographicVerificationHash: 'SHA256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f'
      },
      {
        engineId: 'ENG-DOCTRINE-R635',
        engineName: 'Operational Doctrine Engine',
        category: 'OPERATIONS',
        primaryOwner: {
          name: 'Ketua Yayasan (Super Admin)',
          role: 'SOVEREIGN_COMMANDER',
          division: 'SOVEREIGN_COUNCIL',
          contactChannel: 'SOV-COMMAND-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        backupOwner: {
          name: 'AI Asy Prime Minister',
          role: 'CIVIL_CHIEF_OF_STAFF',
          division: 'PRIME_CABINET',
          contactChannel: 'ASY-CIVIL-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        recoveryOwner: {
          name: 'Guardian Supreme General',
          role: 'MILITARY_RECOVERY_LEAD',
          division: 'GUARDIAN_CORPS',
          contactChannel: 'SEC-NET-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        slaTargetMinutes: 1,
        escalationPath: ['Ketua Yayasan', 'AI Asy Prime Minister', 'Guardian Supreme General'],
        ownershipCompliance: 'COMPLIANT',
        cryptographicVerificationHash: 'SHA256:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'
      },
      {
        engineId: 'ENG-INVARIANTS-R643',
        engineName: 'Operational Invariants Engine',
        category: 'GOVERNANCE',
        primaryOwner: {
          name: 'Chief Constitutional Auditor',
          role: 'CONSTITUTION_GUARDIAN',
          division: 'SOVEREIGN_COUNCIL',
          contactChannel: 'AUDIT-CONST-01',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        backupOwner: {
          name: 'Guardian Compliance Sentinel',
          role: 'INVARIANT_ENFORCER',
          division: 'GUARDIAN_CORPS',
          contactChannel: 'SEC-NET-03',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        recoveryOwner: {
          name: 'Kernel Recovery Taskforce',
          role: 'FAILOVER_CONTROLLER',
          division: 'INFRA_OPS',
          contactChannel: 'HEAL-AUTO-02',
          heartbeatState: 'ALIVE',
          lastChecked: '2026-08-18T10:00:00Z'
        },
        slaTargetMinutes: 2,
        escalationPath: ['Constitutional Auditor', 'Guardian Compliance Sentinel', 'Ketua Yayasan'],
        ownershipCompliance: 'COMPLIANT',
        cryptographicVerificationHash: 'SHA256:9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d'
      }
    ];

    defaultServices.forEach(srv => this.registry.set(srv.engineId, srv));
  }

  public getAllEntries(): EngineOwnershipEntry[] {
    return Array.from(this.registry.values());
  }

  public getEntry(engineId: string): EngineOwnershipEntry | undefined {
    return this.registry.get(engineId);
  }

  public checkOwnershipCompleteness(): {
    totalEngines: number;
    compliantEngines: number;
    emptyPrimaryCount: number;
    emptyBackupCount: number;
    emptyRecoveryCount: number;
    score: number; // 0 - 100
  } {
    let emptyPrimary = 0;
    let emptyBackup = 0;
    let emptyRecovery = 0;
    let compliant = 0;

    this.registry.forEach(entry => {
      if (!entry.primaryOwner?.name) emptyPrimary++;
      if (!entry.backupOwner?.name) emptyBackup++;
      if (!entry.recoveryOwner?.name) emptyRecovery++;

      if (entry.primaryOwner?.name && entry.backupOwner?.name && entry.recoveryOwner?.name) {
        compliant++;
      }
    });

    const total = this.registry.size;
    const score = total > 0 ? Math.round((compliant / total) * 100) : 0;

    return {
      totalEngines: total,
      compliantEngines: compliant,
      emptyPrimaryCount: emptyPrimary,
      emptyBackupCount: emptyBackup,
      emptyRecoveryCount: emptyRecovery,
      score
    };
  }
}

export const serviceOwnershipRegistry = ServiceOwnershipRegistry.getInstance();
