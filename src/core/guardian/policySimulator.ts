import { PolicySimulationRequest, PolicySimulationResult, PolicyEvaluationResult, EvaluationOutcome } from './guardianTypes';
import { guardianPolicyRegistry } from './guardianPolicyRegistry';

export const DEFAULT_SIMULATION_SCENARIOS: PolicySimulationRequest[] = [
  {
    scenarioId: 'SIM-SCENARIO-01',
    name: 'Unprivileged Ring-0 Kernel Modification Attempt',
    targetPolicies: ['POL-SEC-001'],
    mockContext: {
      ringLevel: 2,
      modifyingRing0: true,
      role: 'OPERATOR',
      user: { name: 'Simulated Attacker', role: 'OPERATOR' }
    },
    description: 'Simulates a compromised operator dashboard trying to alter Ring-0 root parameters.'
  },
  {
    scenarioId: 'SIM-SCENARIO-02',
    name: 'Client-Side Private Key Leak in Build Asset',
    targetPolicies: ['POL-SEC-002'],
    mockContext: {
      hasClientSecretLeak: true,
      bundleScan: { secretsFound: 1, file: 'dist/assets/index.js' }
    },
    description: 'Simulates accidental packaging of private cryptographic keys into browser distribution.'
  },
  {
    scenarioId: 'SIM-SCENARIO-03',
    name: 'Parent Crossing Tenant to Access Other Student Raport',
    targetPolicies: ['POL-RBAC-002'],
    mockContext: {
      role: 'WALI_MURID',
      userUid: 'parent-alpha',
      studentParentUid: 'parent-beta',
      targetEntity: 'RAPORT_RECORD'
    },
    description: 'Simulates cross-tenant query where a parent attempts to view grades of a different student.'
  },
  {
    scenarioId: 'SIM-SCENARIO-04',
    name: 'Offline Sync Replay with Missing Idempotency Fingerprint',
    targetPolicies: ['POL-OFF-001', 'POL-OFF-002'],
    mockContext: {
      isOfflineSync: true,
      operationFingerprint: '',
      hasConflict: true,
      isSensitiveDomain: true,
      isQuarantined: false
    },
    description: 'Simulates an offline sync packet lacking SHA-256 fingerprint attempting blind auto-merge.'
  },
  {
    scenarioId: 'SIM-SCENARIO-05',
    name: 'Hermes Autonomous Activation Without Founder Passcode',
    targetPolicies: ['POL-INT-001'],
    mockContext: {
      hermesState: 'ACTIVE_AUTONOMOUS',
      founderAuthorized: false
    },
    description: 'Simulates unauthorized background execution of Hermes autonomous workflows.'
  }
];

/**
 * R747 — Policy Simulator
 * Sandbox environment to execute policy stress-tests and predict blast radius safely.
 */
class PolicySimulator {
  private static instance: PolicySimulator;

  private constructor() {}

  public static getInstance(): PolicySimulator {
    if (!PolicySimulator.instance) {
      PolicySimulator.instance = new PolicySimulator();
    }
    return PolicySimulator.instance;
  }

  public getAvailableScenarios(): PolicySimulationRequest[] {
    return [...DEFAULT_SIMULATION_SCENARIOS];
  }

  /**
   * Run a simulation scenario deterministically in a closed sandbox.
   */
  public runSimulation(request: PolicySimulationRequest): PolicySimulationResult {
    const policies = guardianPolicyRegistry.getAllPolicies();
    const targeted = request.targetPolicies.length > 0
      ? policies.filter(p => request.targetPolicies.includes(p.policyId) || request.targetPolicies.includes(p.code))
      : policies;

    const evaluations: PolicyEvaluationResult[] = [];
    let passes = 0;
    let warnings = 0;
    let blocks = 0;

    for (const policy of targeted) {
      // Deterministic dry-run evaluation (no real side effects)
      let outcome: EvaluationOutcome = 'PASS';
      let score = 100;
      let details = 'Simulated sandbox test passed.';
      let violationCount = 0;

      const ctx = request.mockContext;

      if (policy.code === 'SEC_RING0_IMMUTABLE' && ctx.ringLevel > 0 && ctx.modifyingRing0) {
        outcome = 'BLOCKED';
        score = 0;
        details = '[SANDBOX DETECTED] Ring-0 modification strictly prohibited from ring level > 0.';
        violationCount = 1;
      } else if (policy.code === 'SEC_NO_CLIENT_SECRETS' && ctx.hasClientSecretLeak) {
        outcome = 'BLOCKED';
        score = 0;
        details = '[SANDBOX DETECTED] Private credentials identified in client distribution bundle.';
        violationCount = 1;
      } else if (policy.code === 'RBAC_PARENT_DATA_ISOLATION' && ctx.role === 'WALI_MURID' && ctx.studentParentUid !== ctx.userUid) {
        outcome = 'BLOCKED';
        score = 0;
        details = '[SANDBOX DETECTED] Cross-tenant boundary breach prevented for parent.';
        violationCount = 1;
      } else if (policy.code === 'OFF_IDEMPOTENCY_FINGERPRINT' && ctx.isOfflineSync && !ctx.operationFingerprint) {
        outcome = 'BLOCKED';
        score = 0;
        details = '[SANDBOX DETECTED] Missing SHA-256 fingerprint would cause duplicate writes.';
        violationCount = 1;
      } else if (policy.code === 'OFF_NO_BLIND_AUTO_MERGE' && ctx.hasConflict && ctx.isSensitiveDomain && !ctx.isQuarantined) {
        outcome = 'BLOCKED';
        score = 10;
        details = '[SANDBOX DETECTED] Sensitive conflict must be routed to Quarantine.';
        violationCount = 1;
      } else if (policy.code === 'INT_HERMES_DORMANT_SAFE' && ctx.hermesState !== 'DORMANT_SAFE' && !ctx.founderAuthorized) {
        outcome = 'BLOCKED';
        score = 0;
        details = '[SANDBOX DETECTED] Hermes autonomous activation blocked. Dormant status enforced.';
        violationCount = 1;
      } else if (policy.code === 'INT_NON_DESTRUCTIVE_OBSERVATION' && ctx.attemptedWrite) {
        outcome = 'WARNING';
        score = 50;
        details = '[SANDBOX DETECTED] AI attempted database write warning.';
        violationCount = 1;
      }

      if (outcome === 'PASS') passes++;
      else if (outcome === 'WARNING') warnings++;
      else if (outcome === 'BLOCKED') blocks++;

      evaluations.push({
        policyId: policy.policyId,
        policyName: policy.name,
        category: policy.category,
        outcome,
        severity: policy.severity,
        score,
        details,
        violationCount,
        evaluatedAt: new Date().toISOString(),
        contextData: ctx
      });
    }

    let predictedImpact = 'LOW_RISK: All tested constraints pass or are safely isolated.';
    if (blocks > 0) {
      predictedImpact = `CRITICAL_INTERCEPTION: Guardian successfully blocked ${blocks} unauthorized breach attempts in this sandbox.`;
    } else if (warnings > 0) {
      predictedImpact = `ELEVATED_OBSERVATION: ${warnings} policy warnings triggered for administrative review.`;
    }

    return {
      scenarioId: request.scenarioId,
      executedAt: new Date().toISOString(),
      totalEvaluated: evaluations.length,
      passes,
      warnings,
      blocks,
      predictedImpact,
      evaluations
    };
  }
}

export const policySimulator = PolicySimulator.getInstance();
