/**
 * R626: Capability Kernel Engine
 * Linux POSIX Capabilities-inspired permission and authorization kernel for TADE entities.
 * Eliminates monolithic root privileges, binds granular capabilities to each role, agent, and engine.
 */

export type TADECapability =
  // Sovereign Tier
  | 'CAP_SOVEREIGN_VETO'
  | 'CAP_CONSTITUTION_OVERRIDE'
  | 'CAP_DECREE_ISSUE'
  | 'CAP_ALL'

  // Guardian Military Tier (Ring-0)
  | 'CAP_SESSION_ISOLATE'
  | 'CAP_RECOVERY_START'
  | 'CAP_RING0_PROTECT'
  | 'CAP_MEM_LOCK'
  | 'CAP_THREAT_CORRELATE'
  | 'CAP_DEFCON_SET'

  // AI Asy Prime Minister Tier (Civil Administration)
  | 'CAP_TASK_PLAN'
  | 'CAP_EXEC_BRIEF'
  | 'CAP_CIVIL_DELEGATE'
  | 'CAP_ORCHESTRATE'
  | 'CAP_COMMUNICATION'

  // Ministry & Assistant Domain Capabilities
  | 'CAP_ACADEMIC_ANALYZE'
  | 'CAP_FINANCE_AUDIT'
  | 'CAP_ROSTER_SCHEDULE'
  | 'CAP_ATTENDANCE_VERIFY'
  | 'CAP_SARPRAS_INSPECT'
  | 'CAP_PPDB_TRIAGE'

  // Micro Agent Single Responsibility Capabilities
  | 'CAP_DATA_SCRUB'
  | 'CAP_LOG_FLUSH'
  | 'CAP_HASH_VERIFY'
  | 'CAP_CACHE_PRUNE'
  | 'CAP_METRIC_SAMPLE';

export interface EntityCapabilityProfile {
  entityId: string;
  entityName: string;
  tier: 'SOVEREIGN' | 'GUARDIAN_GENERAL' | 'AI_ASY_PM' | 'MINISTER_ASSISTANT' | 'MICRO_AGENT' | 'SYSTEM_CORE';
  effectiveCapabilities: Set<TADECapability>;
  permittedCapabilities: Set<TADECapability>;
  inheritableCapabilities: Set<TADECapability>;
  boundedByConstitution: boolean;
  lastAuditedTimestamp: number;
}

export interface CapabilityCheckResult {
  allowed: boolean;
  entityId: string;
  capability: TADECapability;
  reason: string;
  timestamp: string;
}

class CapabilityKernelEngine {
  private static instance: CapabilityKernelEngine;

  private profiles: Map<string, EntityCapabilityProfile> = new Map();
  private auditLogs: CapabilityCheckResult[] = [];
  private privilegeEscalationAttemptsBlocked: number = 0;

  private constructor() {
    this.initializeEntityProfiles();
  }

  public static getInstance(): CapabilityKernelEngine {
    if (!CapabilityKernelEngine.instance) {
      CapabilityKernelEngine.instance = new CapabilityKernelEngine();
    }
    return CapabilityKernelEngine.instance;
  }

  private initializeEntityProfiles(): void {
    // 1. Super Admin / Founder (Sovereign)
    this.profiles.set('ENT_SOVEREIGN', {
      entityId: 'ENT_SOVEREIGN',
      entityName: 'Ketua Yayasan / Super Admin (Sovereign)',
      tier: 'SOVEREIGN',
      effectiveCapabilities: new Set<TADECapability>([
        'CAP_SOVEREIGN_VETO',
        'CAP_CONSTITUTION_OVERRIDE',
        'CAP_DECREE_ISSUE',
        'CAP_ALL',
      ]),
      permittedCapabilities: new Set<TADECapability>(['CAP_ALL']),
      inheritableCapabilities: new Set<TADECapability>(['CAP_DECREE_ISSUE']),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });

    // 2. Guardian (Supreme General - Ring-0)
    this.profiles.set('ENT_GUARDIAN', {
      entityId: 'ENT_GUARDIAN',
      entityName: 'Guardian Supreme General (Ring-0 Security)',
      tier: 'GUARDIAN_GENERAL',
      effectiveCapabilities: new Set<TADECapability>([
        'CAP_SESSION_ISOLATE',
        'CAP_RECOVERY_START',
        'CAP_RING0_PROTECT',
        'CAP_MEM_LOCK',
        'CAP_THREAT_CORRELATE',
        'CAP_DEFCON_SET',
      ]),
      permittedCapabilities: new Set<TADECapability>([
        'CAP_SESSION_ISOLATE',
        'CAP_RECOVERY_START',
        'CAP_RING0_PROTECT',
        'CAP_MEM_LOCK',
        'CAP_THREAT_CORRELATE',
        'CAP_DEFCON_SET',
      ]),
      inheritableCapabilities: new Set<TADECapability>(['CAP_RING0_PROTECT', 'CAP_MEM_LOCK']),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });

    // 3. AI Asy (Prime Minister - Civil Administration)
    this.profiles.set('ENT_AI_ASY', {
      entityId: 'ENT_AI_ASY',
      entityName: 'AI Asy Prime Minister (Civilian Cabinet)',
      tier: 'AI_ASY_PM',
      effectiveCapabilities: new Set<TADECapability>([
        'CAP_TASK_PLAN',
        'CAP_EXEC_BRIEF',
        'CAP_CIVIL_DELEGATE',
        'CAP_ORCHESTRATE',
        'CAP_COMMUNICATION',
      ]),
      permittedCapabilities: new Set<TADECapability>([
        'CAP_TASK_PLAN',
        'CAP_EXEC_BRIEF',
        'CAP_CIVIL_DELEGATE',
        'CAP_ORCHESTRATE',
        'CAP_COMMUNICATION',
      ]),
      inheritableCapabilities: new Set<TADECapability>(['CAP_CIVIL_DELEGATE']),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });

    // 4. Academic Assistant
    this.profiles.set('ENT_AST_ACADEMIC', {
      entityId: 'ENT_AST_ACADEMIC',
      entityName: 'Academic Affairs Assistant',
      tier: 'MINISTER_ASSISTANT',
      effectiveCapabilities: new Set<TADECapability>(['CAP_ACADEMIC_ANALYZE', 'CAP_ROSTER_SCHEDULE']),
      permittedCapabilities: new Set<TADECapability>(['CAP_ACADEMIC_ANALYZE', 'CAP_ROSTER_SCHEDULE']),
      inheritableCapabilities: new Set<TADECapability>(),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });

    // 5. Finance Assistant
    this.profiles.set('ENT_AST_FINANCE', {
      entityId: 'ENT_AST_FINANCE',
      entityName: 'Treasury & SPP Assistant',
      tier: 'MINISTER_ASSISTANT',
      effectiveCapabilities: new Set<TADECapability>(['CAP_FINANCE_AUDIT']),
      permittedCapabilities: new Set<TADECapability>(['CAP_FINANCE_AUDIT']),
      inheritableCapabilities: new Set<TADECapability>(),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });

    // 6. Micro Agent: Data Scrubber
    this.profiles.set('ENT_MIC_SCRUBBER', {
      entityId: 'ENT_MIC_SCRUBBER',
      entityName: 'Micro Agent: Log & Memory Scrubber',
      tier: 'MICRO_AGENT',
      effectiveCapabilities: new Set<TADECapability>(['CAP_DATA_SCRUB']),
      permittedCapabilities: new Set<TADECapability>(['CAP_DATA_SCRUB']),
      inheritableCapabilities: new Set<TADECapability>(),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });

    // 7. Micro Agent: Hash Verifier
    this.profiles.set('ENT_MIC_HASH_VERIFY', {
      entityId: 'ENT_MIC_HASH_VERIFY',
      entityName: 'Micro Agent: Cryptographic Hash Verifier',
      tier: 'MICRO_AGENT',
      effectiveCapabilities: new Set<TADECapability>(['CAP_HASH_VERIFY']),
      permittedCapabilities: new Set<TADECapability>(['CAP_HASH_VERIFY']),
      inheritableCapabilities: new Set<TADECapability>(),
      boundedByConstitution: true,
      lastAuditedTimestamp: Date.now(),
    });
  }

  public checkCapability(entityId: string, requiredCap: TADECapability): CapabilityCheckResult {
    const profile = this.profiles.get(entityId);
    const timestamp = new Date().toISOString();

    if (!profile) {
      this.privilegeEscalationAttemptsBlocked++;
      const res: CapabilityCheckResult = {
        allowed: false,
        entityId,
        capability: requiredCap,
        reason: 'Unknown entity attempted unauthenticated capability assertion',
        timestamp,
      };
      this.recordAudit(res);
      return res;
    }

    // Sovereign has universal capability
    if (profile.effectiveCapabilities.has('CAP_ALL') || profile.effectiveCapabilities.has(requiredCap)) {
      // Check constitutional boundary: AI Asy cannot hold Ring-0 military capabilities
      if (profile.tier === 'AI_ASY_PM' && (requiredCap === 'CAP_RING0_PROTECT' || requiredCap === 'CAP_MEM_LOCK' || requiredCap === 'CAP_DEFCON_SET')) {
        this.privilegeEscalationAttemptsBlocked++;
        const res: CapabilityCheckResult = {
          allowed: false,
          entityId,
          capability: requiredCap,
          reason: 'CONSTITUTIONAL BLOCK: AI Asy is strictly civilian and cannot execute Ring-0 military commands',
          timestamp,
        };
        this.recordAudit(res);
        return res;
      }

      // Check constitutional boundary: Guardian cannot plan civilian syllabus
      if (profile.tier === 'GUARDIAN_GENERAL' && (requiredCap === 'CAP_ACADEMIC_ANALYZE' || requiredCap === 'CAP_TASK_PLAN')) {
        this.privilegeEscalationAttemptsBlocked++;
        const res: CapabilityCheckResult = {
          allowed: false,
          entityId,
          capability: requiredCap,
          reason: 'CONSTITUTIONAL BLOCK: Guardian is strictly military and cannot govern civilian pedagogical workflows',
          timestamp,
        };
        this.recordAudit(res);
        return res;
      }

      const res: CapabilityCheckResult = {
        allowed: true,
        entityId,
        capability: requiredCap,
        reason: `Authorized: Entity holds effective ${requiredCap}`,
        timestamp,
      };
      this.recordAudit(res);
      return res;
    }

    this.privilegeEscalationAttemptsBlocked++;
    const res: CapabilityCheckResult = {
      allowed: false,
      entityId,
      capability: requiredCap,
      reason: `Denied: Entity lacks ${requiredCap} in effective capability set`,
      timestamp,
    };
    this.recordAudit(res);
    return res;
  }

  private recordAudit(log: CapabilityCheckResult): void {
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 50) {
      this.auditLogs.pop();
    }
  }

  public getProfiles(): EntityCapabilityProfile[] {
    return Array.from(this.profiles.values());
  }

  public getAuditLogs(): CapabilityCheckResult[] {
    return [...this.auditLogs];
  }

  public getPrivilegeEscalationAttemptsBlocked(): number {
    return this.privilegeEscalationAttemptsBlocked;
  }

  public testSimulatePrivilegeEscalation(entityId: string, illegalCap: TADECapability): CapabilityCheckResult {
    return this.checkCapability(entityId, illegalCap);
  }
}

export const capabilityKernelEngine = CapabilityKernelEngine.getInstance();
