import { GuardianPolicy, PolicyEvaluationResult, EvaluationOutcome } from './guardianTypes';
import { guardianPolicyRegistry } from './guardianPolicyRegistry';
import { guardianExceptionJournal } from './guardianExceptionJournal';

/**
 * R742 — Policy Evaluation Engine
 * Deterministic policy evaluator that parses policy rules and scores context data.
 * Outputs PASS, WARNING, or BLOCKED.
 */
class PolicyEvaluationEngine {
  private static instance: PolicyEvaluationEngine;

  private constructor() {}

  public static getInstance(): PolicyEvaluationEngine {
    if (!PolicyEvaluationEngine.instance) {
      PolicyEvaluationEngine.instance = new PolicyEvaluationEngine();
    }
    return PolicyEvaluationEngine.instance;
  }

  /**
   * Deterministically evaluate a single policy against a target context.
   */
  public evaluatePolicy(policy: GuardianPolicy, context: Record<string, any> = {}): PolicyEvaluationResult {
    let outcome: EvaluationOutcome = 'PASS';
    let score = 100;
    let details = 'Policy evaluation passed with zero compliance violations.';
    let violationCount = 0;

    try {
      // Evaluate policy based on rule code
      switch (policy.code) {
        case 'SEC_RING0_IMMUTABLE':
          if (context.ringLevel !== undefined && context.ringLevel > 0 && context.modifyingRing0) {
            outcome = 'BLOCKED';
            score = 0;
            details = 'VIOLATION: Attempted mutation of Ring-0 root kernel from unprivileged ring level.';
            violationCount = 1;
          }
          break;

        case 'SEC_NO_CLIENT_SECRETS':
          if (context.hasClientSecretLeak || (context.bundleScan && context.bundleScan.secretsFound > 0)) {
            outcome = 'BLOCKED';
            score = 0;
            details = 'VIOLATION: Private secret/API token found in client build assets.';
            violationCount = 1;
          }
          break;

        case 'RBAC_STRICT_SEPARATION':
          if (context.role && context.actionRequiresAdmin) {
            const allowed = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'];
            if (!allowed.includes(context.role)) {
              outcome = 'BLOCKED';
              score = 0;
              details = `VIOLATION: Role ${context.role} is not authorized for high-privilege administrative action.`;
              violationCount = 1;
            }
          }
          break;

        case 'RBAC_PARENT_DATA_ISOLATION':
          if (context.role === 'WALI_MURID' && context.studentParentUid && context.userUid) {
            if (context.studentParentUid !== context.userUid) {
              outcome = 'BLOCKED';
              score = 0;
              details = 'VIOLATION: Parent attempting to access unauthorized child profile.';
              violationCount = 1;
            }
          }
          break;

        case 'REC_ATOMIC_FIVE_PHASE':
          if (context.isRecovery && context.phaseCount !== 5) {
            outcome = 'BLOCKED';
            score = 20;
            details = 'VIOLATION: Recovery procedure does not satisfy 5-Phase atomic guarantee.';
            violationCount = 1;
          }
          break;

        case 'REC_ZERO_DATA_LOSS':
          if (context.isDataPurge && !context.snapshotVerified) {
            outcome = 'BLOCKED';
            score = 0;
            details = 'VIOLATION: Permanent record purge attempted without verified cryptographic snapshot.';
            violationCount = 1;
          }
          break;

        case 'OFF_IDEMPOTENCY_FINGERPRINT':
          if (context.isOfflineSync && (!context.operationFingerprint || context.operationFingerprint.length < 32)) {
            outcome = 'BLOCKED';
            score = 0;
            details = 'VIOLATION: Offline mutation lacks cryptographic SHA-256 idempotency fingerprint.';
            violationCount = 1;
          }
          break;

        case 'OFF_NO_BLIND_AUTO_MERGE':
          if (context.hasConflict && context.isSensitiveDomain && !context.isQuarantined) {
            outcome = 'BLOCKED';
            score = 10;
            details = 'VIOLATION: Sensitive data conflict bypassing quarantine with blind auto-merge.';
            violationCount = 1;
          }
          break;

        case 'INT_HERMES_DORMANT_SAFE':
          if (context.hermesState && context.hermesState !== 'DORMANT_SAFE' && !context.founderAuthorized) {
            outcome = 'BLOCKED';
            score = 0;
            details = 'VIOLATION: Hermes autonomous agent is active without explicit Founder credentials.';
            violationCount = 1;
          }
          break;

        case 'INT_NON_DESTRUCTIVE_OBSERVATION':
          if (context.isAIOperation && context.attemptedWrite) {
            outcome = 'WARNING';
            score = 50;
            details = 'WARNING: AI Advisory attempted database write. Blocked non-destructive override enforced.';
            violationCount = 1;
          }
          break;

        case 'GOV_SSOT_CENTRAL_DB':
          if (context.bypassingDbService) {
            outcome = 'BLOCKED';
            score = 0;
            details = 'VIOLATION: Direct storage modification bypassing src/services/db.ts SSoT layer.';
            violationCount = 1;
          }
          break;

        case 'GOV_IMMUTABLE_AUDIT_TRAIL':
          if (context.requiresAudit && !context.auditLogged) {
            outcome = 'WARNING';
            score = 40;
            details = 'WARNING: Administrative mutation missing synchronous audit journal entry.';
            violationCount = 1;
          }
          break;

        default:
          // Standard generic verification
          outcome = 'PASS';
          score = 100;
          details = 'Complies with general policy constraints.';
          break;
      }
    } catch (err: any) {
      outcome = 'WARNING';
      score = 50;
      details = `Policy evaluation exception: ${err.message || 'Unknown evaluation error'}`;
      violationCount = 1;
    }

    // If BLOCKED, journal the exception
    if (outcome === 'BLOCKED') {
      guardianExceptionJournal.recordException({
        policyId: policy.policyId,
        policyName: policy.name,
        category: policy.category,
        severity: policy.severity,
        actor: context.user?.name || context.actor || 'SYSTEM_DAEMON',
        role: context.user?.role || context.role || 'GUEST',
        targetEntity: context.targetEntity || policy.category,
        details,
        blocked: true
      });
    }

    return {
      policyId: policy.policyId,
      policyName: policy.name,
      category: policy.category,
      outcome,
      severity: policy.severity,
      score,
      details,
      violationCount,
      evaluatedAt: new Date().toISOString(),
      contextData: context
    };
  }

  /**
   * Evaluate all registered policies against current system state.
   */
  public evaluateAllPolicies(context: Record<string, any> = {}): {
    results: PolicyEvaluationResult[];
    overallScore: number;
    passedCount: number;
    warningCount: number;
    blockedCount: number;
    status: 'SYSTEM_CLEAN' | 'WARNINGS_DETECTED' | 'CRITICAL_BLOCK';
  } {
    const policies = guardianPolicyRegistry.getAllPolicies();
    const results: PolicyEvaluationResult[] = [];

    let totalScore = 0;
    let passedCount = 0;
    let warningCount = 0;
    let blockedCount = 0;

    for (const policy of policies) {
      const res = this.evaluatePolicy(policy, context);
      results.push(res);
      totalScore += res.score;

      if (res.outcome === 'PASS') passedCount++;
      else if (res.outcome === 'WARNING') warningCount++;
      else if (res.outcome === 'BLOCKED') blockedCount++;
    }

    const overallScore = Math.round(totalScore / (policies.length || 1));
    const status = blockedCount > 0 ? 'CRITICAL_BLOCK' : warningCount > 0 ? 'WARNINGS_DETECTED' : 'SYSTEM_CLEAN';

    return {
      results,
      overallScore,
      passedCount,
      warningCount,
      blockedCount,
      status
    };
  }
}

export const policyEvaluationEngine = PolicyEvaluationEngine.getInstance();
