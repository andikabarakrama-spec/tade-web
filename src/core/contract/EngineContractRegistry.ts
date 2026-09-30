/**
 * R721 — Engine Contract Registry
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE) — RC90
 * 
 * Formal enterprise engine contract versioning registry.
 * Adheres to Debian Stable / Kubernetes Controller patterns:
 * - Explicit dependencies
 * - Backward compatibility declarations
 * - Rollback safety guarantees
 * - Immutable version history
 * - No hidden coupling
 */

export interface EngineDependency {
  engineId: string;
  minContractVersion: string;
  maxContractVersion?: string;
  optional?: boolean;
  notes?: string;
}

export interface EngineVersionRelease {
  version: string;
  contractVersion: string;
  releasedAt: string;
  changeLog: string;
  hash: string;
}

export interface EngineContractMetadata {
  engineId: string;
  engineName: string;
  category: 'GUARDIAN' | 'SSOT' | 'AI_ASY' | 'HERMES' | 'SMART_OFFICE' | 'RECOVERY' | 'KNOWLEDGE' | 'GOVERNANCE' | 'CONTRACT';
  engineVersion: string;
  contractVersion: string;
  compatibilityVersion: string; // TADE release target e.g. ">=v6.0.0"
  owner: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'DORMANT_SAFE' | 'PROBATIONARY';
  isRollbackSafe: boolean;
  isBackwardCompatible: boolean;
  dependencies: EngineDependency[];
  versionHistory: EngineVersionRelease[];
  sourceFilePath: string;
  apiSurfaceDescription: string;
}

export class EngineContractRegistry {
  private static instance: EngineContractRegistry;
  private registry: Map<string, EngineContractMetadata> = new Map();

  private constructor() {
    this.seedContractRegistry();
  }

  public static getInstance(): EngineContractRegistry {
    if (!EngineContractRegistry.instance) {
      EngineContractRegistry.instance = new EngineContractRegistry();
    }
    return EngineContractRegistry.instance;
  }

  private seedContractRegistry(): void {
    const contracts: EngineContractMetadata[] = [
      {
        engineId: 'ENG-SSOT-01',
        engineName: 'Single Source of Truth Database Service',
        category: 'SSOT',
        engineVersion: '2.4.0',
        contractVersion: 'v2.0',
        compatibilityVersion: '>=v6.0.0',
        owner: 'Supreme Architecture Board',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-01T00:00:00Z', changeLog: 'Initial DataService centralization.', hash: 'HASH-SSOT-V1' },
          { version: '2.0.0', contractVersion: 'v2.0', releasedAt: '2026-08-16T10:00:00Z', changeLog: 'Enforce non-destructive read/write mutations and offline fallbacks.', hash: 'HASH-SSOT-V2' }
        ],
        sourceFilePath: 'src/services/db.ts',
        apiSurfaceDescription: 'DataService master CRUD and aggregation interfaces for students, teachers, finances, and settings.'
      },
      {
        engineId: 'ENG-GUARDIAN-01',
        engineName: 'Guardian Ring-0 Sovereign Integrity Scanner',
        category: 'GUARDIAN',
        engineVersion: '2.1.0',
        contractVersion: 'v2.0',
        compatibilityVersion: '>=v6.5.0',
        owner: 'Guardian Directorate',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false }
        ],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-14T00:00:00Z', changeLog: 'Initial structural integrity verification.', hash: 'HASH-GRD-V1' },
          { version: '2.1.0', contractVersion: 'v2.0', releasedAt: '2026-08-18T03:00:00Z', changeLog: 'RC88 Ring-0 invariant enforcement across 6 vector checks.', hash: 'HASH-GRD-V2' }
        ],
        sourceFilePath: 'src/core/governance/GuardianIntegrityScanner.ts',
        apiSurfaceDescription: 'scanSystemIntegrity(), verifyRing0State(), getAuditReport()'
      },
      {
        engineId: 'ENG-HERMES-01',
        engineName: 'Hermes Control Plane & Autonomous Lab Engine',
        category: 'HERMES',
        engineVersion: '1.8.0',
        contractVersion: 'v1.5',
        compatibilityVersion: '>=v6.6.0',
        owner: 'Automation & Workflow Council',
        status: 'DORMANT_SAFE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false },
          { engineId: 'ENG-GUARDIAN-01', minContractVersion: 'v2.0', optional: false }
        ],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-17T00:00:00Z', changeLog: 'Hermes orchestration prototype.', hash: 'HASH-HRM-V1' },
          { version: '1.8.0', contractVersion: 'v1.5', releasedAt: '2026-08-17T18:00:00Z', changeLog: 'Enforce strict DORMANT_SAFE mode with isolated dry-run lab.', hash: 'HASH-HRM-V2' }
        ],
        sourceFilePath: 'src/core/hermes/HermesControlPlaneEngine.ts',
        apiSurfaceDescription: 'getControlPlaneState(), runDryRunSimulation(), getDormancyReport()'
      },
      {
        engineId: 'ENG-RECOVERY-01',
        engineName: 'Recovery Doctrine & Snapshot Verification Core',
        category: 'RECOVERY',
        engineVersion: '3.0.0',
        contractVersion: 'v2.0',
        compatibilityVersion: '>=v6.0.0',
        owner: 'Recovery Core Directorate',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false }
        ],
        versionHistory: [
          { version: '2.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-10T00:00:00Z', changeLog: 'Local snapshot and restore capability.', hash: 'HASH-REC-V1' },
          { version: '3.0.0', contractVersion: 'v2.0', releasedAt: '2026-08-18T02:00:00Z', changeLog: 'Zero-data-loss multi-artifact verification with SHA-256 seal.', hash: 'HASH-REC-V2' }
        ],
        sourceFilePath: 'src/core/lts/RecoveryValidationAuditEngine.ts',
        apiSurfaceDescription: 'verifySnapshotHealth(), calculateReadinessScore(), generateRestorePlan()'
      },
      {
        engineId: 'ENG-KNOWLEDGE-01',
        engineName: 'Knowledge Vault & Sovereign Intelligence Index',
        category: 'KNOWLEDGE',
        engineVersion: '2.2.0',
        contractVersion: 'v2.0',
        compatibilityVersion: '>=v6.0.0',
        owner: 'Educational Content & Knowledge Board',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false }
        ],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-12T00:00:00Z', changeLog: 'Knowledge vector indexing and discovery.', hash: 'HASH-KNW-V1' },
          { version: '2.2.0', contractVersion: 'v2.0', releasedAt: '2026-08-18T00:00:00Z', changeLog: 'Air-gapped curriculum, SOP, and legal regulation indexing.', hash: 'HASH-KNW-V2' }
        ],
        sourceFilePath: 'src/core/lts/KnowledgeVaultIndexingEngine.ts',
        apiSurfaceDescription: 'searchKnowledge(), getIndexedDocuments(), calculateVaultFreshness()'
      },
      {
        engineId: 'ENG-GOVERNANCE-01',
        engineName: 'Executive Decision Journal & Founder Command Engine',
        category: 'GOVERNANCE',
        engineVersion: '1.5.0',
        contractVersion: 'v1.5',
        compatibilityVersion: '>=v6.7.0',
        owner: 'Founder & Supreme System Architect',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false },
          { engineId: 'ENG-GUARDIAN-01', minContractVersion: 'v2.0', optional: false }
        ],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-18T03:30:00Z', changeLog: 'RC88 immutable decision log and command audit trail.', hash: 'HASH-GOV-V1' }
        ],
        sourceFilePath: 'src/core/governance/ExecutiveDecisionJournal.ts',
        apiSurfaceDescription: 'getAllEntries(), recordDecision(), getCommands(), sealAuditTrail()'
      },
      {
        engineId: 'ENG-SMART-OFFICE-01',
        engineName: 'Smart Office Enterprise Orchestration Suite',
        category: 'SMART_OFFICE',
        engineVersion: '1.0.0',
        contractVersion: 'v1.0',
        compatibilityVersion: '>=v6.7.0',
        owner: 'Enterprise Workflow Council',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false },
          { engineId: 'ENG-GOVERNANCE-01', minContractVersion: 'v1.5', optional: false }
        ],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-18T04:20:00Z', changeLog: 'RC89 Smart office workspace, queue, priority, and timeline.', hash: 'HASH-SO-V1' }
        ],
        sourceFilePath: 'src/core/smartoffice/SmartOfficeWorkspaceEngine.ts',
        apiSurfaceDescription: 'getShortcuts(), getAgendas(), getQueueItems(), getUnifiedTimeline()'
      },
      {
        engineId: 'ENG-AI-ASY-01',
        engineName: 'AI Asy Executive Cognitive & Advisory Engine',
        category: 'AI_ASY',
        engineVersion: '2.0.0',
        contractVersion: 'v2.0',
        compatibilityVersion: '>=v6.8.0',
        owner: 'AI Asy Cognitive Lab',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [
          { engineId: 'ENG-SSOT-01', minContractVersion: 'v2.0', optional: false },
          { engineId: 'ENG-KNOWLEDGE-01', minContractVersion: 'v2.0', optional: false },
          { engineId: 'ENG-GOVERNANCE-01', minContractVersion: 'v1.5', optional: false }
        ],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-14T00:00:00Z', changeLog: 'Operational coach & natural language assistant.', hash: 'HASH-AI-V1' },
          { version: '2.0.0', contractVersion: 'v2.0', releasedAt: '2026-08-18T05:00:00Z', changeLog: 'RC90 Executive Intelligence 2.0 with strict advisory-only output.', hash: 'HASH-AI-V2' }
        ],
        sourceFilePath: 'src/core/executive/ExecutiveIntelligenceHub.ts',
        apiSurfaceDescription: 'getExecutiveSummary(), generateSITREP(), evaluateConfidence(), generateBrief()'
      },
      {
        engineId: 'ENG-CONTRACT-01',
        engineName: 'Enterprise Engine Contract & Capability Registry Core',
        category: 'CONTRACT',
        engineVersion: '1.0.0',
        contractVersion: 'v1.0',
        compatibilityVersion: '>=v6.8.0',
        owner: 'Supreme Architecture Board',
        status: 'ACTIVE',
        isRollbackSafe: true,
        isBackwardCompatible: true,
        dependencies: [],
        versionHistory: [
          { version: '1.0.0', contractVersion: 'v1.0', releasedAt: '2026-08-18T05:30:00Z', changeLog: 'RC90 Contract versioning, compatibility validator, and capability registry.', hash: 'HASH-CTR-V1' }
        ],
        sourceFilePath: 'src/core/contract/EngineContractRegistry.ts',
        apiSurfaceDescription: 'getAllContracts(), getContract(), validateCompatibility(), getCapabilityMap()'
      }
    ];

    contracts.forEach(c => this.registry.set(c.engineId, c));
  }

  public getAllContracts(): EngineContractMetadata[] {
    return Array.from(this.registry.values());
  }

  public getContract(engineId: string): EngineContractMetadata | undefined {
    return this.registry.get(engineId);
  }

  public getContractsByCategory(category: string): EngineContractMetadata[] {
    return this.getAllContracts().filter(c => c.category === category);
  }

  public getRegistrySummary(): {
    totalEngines: number;
    activeEngines: number;
    dormantSafeEngines: number;
    rollbackSafePercentage: number;
    backwardCompatiblePercentage: number;
  } {
    const all = this.getAllContracts();
    const active = all.filter(c => c.status === 'ACTIVE').length;
    const dormant = all.filter(c => c.status === 'DORMANT_SAFE').length;
    const rollbackSafe = all.filter(c => c.isRollbackSafe).length;
    const backwardCompatible = all.filter(c => c.isBackwardCompatible).length;

    return {
      totalEngines: all.length,
      activeEngines: active,
      dormantSafeEngines: dormant,
      rollbackSafePercentage: Math.round((rollbackSafe / all.length) * 100),
      backwardCompatiblePercentage: Math.round((backwardCompatible / all.length) * 100)
    };
  }
}
