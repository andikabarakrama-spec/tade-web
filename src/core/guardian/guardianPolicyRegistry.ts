import { GuardianPolicy, PolicyCategory } from './guardianTypes';

/**
 * R741 — Guardian Policy Registry
 * SSoT repository of all codified system policies across:
 * Security, RBAC, Recovery, Offline, Intelligence, and Governance.
 */
export const INITIAL_GUARDIAN_POLICIES: GuardianPolicy[] = [
  // 1. SECURITY
  {
    policyId: 'POL-SEC-001',
    code: 'SEC_RING0_IMMUTABLE',
    name: 'Ring-0 Root Authority & Kernel Isolation',
    category: 'SECURITY',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'No runtime component or module may modify, bypass, or mock Ring-0 root security checks.',
    constitutionArticleRef: 'Constitution Art. 1.1 (Sovereign Authority)',
    enforcementScope: 'UNIVERSAL',
    ruleExpression: 'context.caller.ringLevel === 0 || context.operation.target !== "RING0_CORE"',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Supreme System Architect'
  },
  {
    policyId: 'POL-SEC-002',
    code: 'SEC_NO_CLIENT_SECRETS',
    name: 'Zero Client-Side Secret Exposure',
    category: 'SECURITY',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'API keys, private keys, and master credentials must never be exported or rendered in browser DOM.',
    constitutionArticleRef: 'Constitution Art. 1.4 (Key Seclusion)',
    enforcementScope: 'BUILD',
    ruleExpression: '!context.bundle.includes("VITE_GEMINI_API_KEY") && !context.bundle.includes("PRIVATE_KEY")',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Guardian Security Sentinel'
  },

  // 2. RBAC
  {
    policyId: 'POL-RBAC-001',
    code: 'RBAC_STRICT_SEPARATION',
    name: 'Strict 7-Role Isolation & Dual Authorization',
    category: 'RBAC',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'High-risk operations (e.g. Finance, Raport Publishing, School Lock) require explicit super-admin/kepala sekolah roles.',
    constitutionArticleRef: 'Constitution Art. 2.1 (Role Sovereignty)',
    enforcementScope: 'GATEWAY',
    ruleExpression: '["SUPER_ADMIN", "ADMIN", "KEPALA_SEKOLAH"].includes(context.user.role) || !context.isHighRisk',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'RBAC Access Controller'
  },
  {
    policyId: 'POL-RBAC-002',
    code: 'RBAC_PARENT_DATA_ISOLATION',
    name: 'Parent-Student Tenant Segregation',
    category: 'RBAC',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'Parents and guardians may only view and query data belonging to their assigned child.',
    constitutionArticleRef: 'Constitution Art. 2.3 (Child Privacy Guarantee)',
    enforcementScope: 'RUNTIME',
    ruleExpression: 'context.user.role !== "WALI_MURID" || context.student.parentUid === context.user.uid',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Privacy Officer'
  },

  // 3. RECOVERY
  {
    policyId: 'POL-REC-001',
    code: 'REC_ATOMIC_FIVE_PHASE',
    name: 'Mandatory 5-Phase Atomic Recovery Replay',
    category: 'RECOVERY',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'Data restoration from disaster or offline states must follow RELOAD -> PRE-VERIFY -> REPLAY -> POST-VERIFY -> COMPLETE.',
    constitutionArticleRef: 'Constitution Art. 4.2 (Resilience & Disaster Continuity)',
    enforcementScope: 'UNIVERSAL',
    ruleExpression: 'context.recovery.phases.length === 5 && context.recovery.atomicRollbackSupported',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Disaster Recovery Custodian'
  },
  {
    policyId: 'POL-REC-002',
    code: 'REC_ZERO_DATA_LOSS',
    name: 'Zero Unaudited Data Loss Tolerance',
    category: 'RECOVERY',
    severity: 'CRITICAL',
    status: 'ENFORCING',
    description: 'No recovery procedure may truncate database records without an immutable cryptographic pre-snapshot.',
    constitutionArticleRef: 'Constitution Art. 4.4 (Zero Loss Mandate)',
    enforcementScope: 'RUNTIME',
    ruleExpression: 'context.snapshot.exists && context.snapshot.checksumVerified',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Integrity Sentry'
  },

  // 4. OFFLINE
  {
    policyId: 'POL-OFF-001',
    code: 'OFF_IDEMPOTENCY_FINGERPRINT',
    name: 'Idempotency Lock & Cryptographic Queue Fingerprint',
    category: 'OFFLINE',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'Every queued offline mutation must have a unique SHA-256 fingerprint to prevent double-execution.',
    constitutionArticleRef: 'Constitution Art. 5.1 (Offline Queue Idempotency)',
    enforcementScope: 'RUNTIME',
    ruleExpression: 'context.operation.fingerprint && context.operation.fingerprint.length === 64',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Distributed Network Specialist'
  },
  {
    policyId: 'POL-OFF-002',
    code: 'OFF_NO_BLIND_AUTO_MERGE',
    name: 'Prohibition of Blind Auto-Merge on Sensitive Collisions',
    category: 'OFFLINE',
    severity: 'CRITICAL',
    status: 'ENFORCING',
    description: 'Financial, Raport, and KMS data conflicts during offline sync must enter Quarantine instead of blind last-write-wins.',
    constitutionArticleRef: 'Constitution Art. 5.3 (Conflict Quarantine Rule)',
    enforcementScope: 'RUNTIME',
    ruleExpression: '!context.conflict.isSensitive || context.conflict.quarantined',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Data Safety Officer'
  },

  // 5. INTELLIGENCE
  {
    policyId: 'POL-INT-001',
    code: 'INT_HERMES_DORMANT_SAFE',
    name: 'Hermes Dormant Safe State Assurance',
    category: 'INTELLIGENCE',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'Hermes autonomous runtime must remain in DORMANT_SAFE status in production unless verified by Founder credentials.',
    constitutionArticleRef: 'Constitution Art. 3.2 (Autonomous AI Confinement)',
    enforcementScope: 'UNIVERSAL',
    ruleExpression: 'context.hermes.mode === "DORMANT_SAFE" || context.founderOverride === true',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'AI Safety Board'
  },
  {
    policyId: 'POL-INT-002',
    code: 'INT_NON_DESTRUCTIVE_OBSERVATION',
    name: 'Non-Destructive Observation Protocol',
    category: 'INTELLIGENCE',
    severity: 'WARNING',
    status: 'ENFORCING',
    description: 'AI advisory models and diagnostics must operate in read-only observer mode without mutating underlying database records.',
    constitutionArticleRef: 'Constitution Art. 3.5 (Advisory Non-Mutation)',
    enforcementScope: 'RUNTIME',
    ruleExpression: 'context.ai.isReadOnly === true',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'AI Ethics Lead'
  },

  // 6. GOVERNANCE
  {
    policyId: 'POL-GOV-001',
    code: 'GOV_SSOT_CENTRAL_DB',
    name: 'src/services/db.ts as Single Source of Truth',
    category: 'GOVERNANCE',
    severity: 'BLOCKING',
    status: 'ENFORCING',
    description: 'All persistent mutations and master queries must route through db.ts without rogue client storage forks.',
    constitutionArticleRef: 'Constitution Art. 6.1 (SSoT Mandate)',
    enforcementScope: 'BUILD',
    ruleExpression: 'context.mutation.serviceOrigin === "DataService"',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Enterprise Standards Committee'
  },
  {
    policyId: 'POL-GOV-002',
    code: 'GOV_IMMUTABLE_AUDIT_TRAIL',
    name: 'Immutable Regulatory Audit Trail Recording',
    category: 'GOVERNANCE',
    severity: 'CRITICAL',
    status: 'ENFORCING',
    description: 'Administrative changes and financial records must produce an append-only audit log entry.',
    constitutionArticleRef: 'Constitution Art. 6.4 (Accountability & Audit)',
    enforcementScope: 'RUNTIME',
    ruleExpression: 'context.audit.logged === true',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    author: 'Chief Auditor'
  }
];

class GuardianPolicyRegistry {
  private static instance: GuardianPolicyRegistry;
  private policies: GuardianPolicy[] = [];

  private constructor() {
    this.loadPolicies();
  }

  public static getInstance(): GuardianPolicyRegistry {
    if (!GuardianPolicyRegistry.instance) {
      GuardianPolicyRegistry.instance = new GuardianPolicyRegistry();
    }
    return GuardianPolicyRegistry.instance;
  }

  private loadPolicies() {
    try {
      const stored = localStorage.getItem('TADE_GUARDIAN_POLICIES_V7');
      if (stored) {
        this.policies = JSON.parse(stored);
      } else {
        this.policies = [...INITIAL_GUARDIAN_POLICIES];
        this.savePolicies();
      }
    } catch {
      this.policies = [...INITIAL_GUARDIAN_POLICIES];
    }
  }

  private savePolicies() {
    try {
      localStorage.setItem('TADE_GUARDIAN_POLICIES_V7', JSON.stringify(this.policies));
    } catch (e) {
      console.warn('[GuardianPolicyRegistry] Failed to save', e);
    }
  }

  public getAllPolicies(): GuardianPolicy[] {
    return [...this.policies];
  }

  public getPolicyById(policyId: string): GuardianPolicy | undefined {
    return this.policies.find(p => p.policyId === policyId || p.code === policyId);
  }

  public getPoliciesByCategory(category: PolicyCategory): GuardianPolicy[] {
    return this.policies.filter(p => p.category === category);
  }

  public updatePolicy(updated: GuardianPolicy): void {
    const idx = this.policies.findIndex(p => p.policyId === updated.policyId);
    if (idx >= 0) {
      this.policies[idx] = { ...updated, updatedAt: new Date().toISOString() };
    } else {
      this.policies.push({ ...updated, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.savePolicies();
  }

  public resetToDefaults(): void {
    this.policies = [...INITIAL_GUARDIAN_POLICIES];
    this.savePolicies();
  }

  public getStats() {
    const total = this.policies.length;
    const byCat: Record<PolicyCategory, number> = {
      SECURITY: 0,
      RBAC: 0,
      RECOVERY: 0,
      OFFLINE: 0,
      INTELLIGENCE: 0,
      GOVERNANCE: 0
    };
    let blockingCount = 0;
    let criticalCount = 0;

    for (const p of this.policies) {
      byCat[p.category] = (byCat[p.category] || 0) + 1;
      if (p.severity === 'BLOCKING') blockingCount++;
      if (p.severity === 'CRITICAL') criticalCount++;
    }

    return { total, byCat, blockingCount, criticalCount };
  }
}

export const guardianPolicyRegistry = GuardianPolicyRegistry.getInstance();
