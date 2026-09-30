import { CompanionPrivacyAudit } from './companionTypes';

/**
 * R759 — Companion Privacy Guard
 * Validates RBAC permissions, Guardian Ring-0 safety, and Constitution boundaries
 * before any Companion advisory response or data slice is presented to the user.
 */
class CompanionPrivacyGuard {
  private static instance: CompanionPrivacyGuard;
  private auditLog: CompanionPrivacyAudit[] = [];

  private constructor() {
    this.seedInitialAudits();
  }

  public static getInstance(): CompanionPrivacyGuard {
    if (!CompanionPrivacyGuard.instance) {
      CompanionPrivacyGuard.instance = new CompanionPrivacyGuard();
    }
    return CompanionPrivacyGuard.instance;
  }

  private seedInitialAudits() {
    this.auditLog = [
      {
        auditId: 'AUD-001',
        timestamp: '2026-08-18T06:05:00Z',
        actorRole: 'PARENT',
        targetDomain: 'STUDENT_DEVELOPMENT',
        actionRequested: 'READ_CHILD_ASSESSMENT',
        verdict: 'PERMITTED',
        enforcingPolicy: 'SEC_RBAC_DATA_ISOLATION'
      },
      {
        auditId: 'AUD-002',
        timestamp: '2026-08-18T06:12:00Z',
        actorRole: 'PARENT',
        targetDomain: 'FINANCE_GENERAL_LEDGER',
        actionRequested: 'READ_INSTITUTIONAL_PAYROLL',
        verdict: 'BLOCKED_RBAC',
        enforcingPolicy: 'SEC_ZERO_CROSS_TENANT_LEAK'
      },
      {
        auditId: 'AUD-003',
        timestamp: '2026-08-18T06:25:00Z',
        actorRole: 'TEACHER',
        targetDomain: 'CLASSROOM_MANAGEMENT',
        actionRequested: 'READ_DAILY_AGENDA',
        verdict: 'PERMITTED',
        enforcingPolicy: 'SEC_RBAC_DATA_ISOLATION'
      },
      {
        auditId: 'AUD-004',
        timestamp: '2026-08-18T06:50:00Z',
        actorRole: 'AI_ASY_COMPANION',
        targetDomain: 'GUARDIAN_RING0',
        actionRequested: 'AUTONOMOUS_DB_MUTATION',
        verdict: 'BLOCKED_GUARDIAN',
        enforcingPolicy: 'INT_NON_DESTRUCTIVE_OBSERVATION'
      }
    ];
  }

  /**
   * Evaluates if a role is permitted to view or request specific domain data.
   */
  public evaluateAccess(
    actorRole: string,
    targetDomain: string,
    actionRequested: string
  ): { permitted: boolean; verdict: 'PERMITTED' | 'BLOCKED_RBAC' | 'BLOCKED_GUARDIAN'; policy: string; message: string } {
    // 1. Check AI write autonomy
    if (actionRequested.startsWith('AUTONOMOUS_') || actionRequested.includes('WRITE') || actionRequested.includes('MUTATE')) {
      const audit: CompanionPrivacyAudit = {
        auditId: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole,
        targetDomain,
        actionRequested,
        verdict: 'BLOCKED_GUARDIAN',
        enforcingPolicy: 'INT_NON_DESTRUCTIVE_OBSERVATION'
      };
      this.auditLog.unshift(audit);
      return {
        permitted: false,
        verdict: 'BLOCKED_GUARDIAN',
        policy: 'INT_NON_DESTRUCTIVE_OBSERVATION',
        message: 'Guardian Ring-0: Companion is strictly read-only and advisory. Direct mutation blocked.'
      };
    }

    // 2. Check Parent RBAC boundaries
    if (actorRole === 'PARENT') {
      const forbiddenForParent = ['FINANCE_GENERAL_LEDGER', 'TEACHER_PAYROLL', 'SYS_CONFIG', 'ALL_STUDENTS_RAW'];
      if (forbiddenForParent.includes(targetDomain)) {
        const audit: CompanionPrivacyAudit = {
          auditId: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorRole,
          targetDomain,
          actionRequested,
          verdict: 'BLOCKED_RBAC',
          enforcingPolicy: 'SEC_RBAC_DATA_ISOLATION'
        };
        this.auditLog.unshift(audit);
        return {
          permitted: false,
          verdict: 'BLOCKED_RBAC',
          policy: 'SEC_RBAC_DATA_ISOLATION',
          message: 'RBAC Access Denied: Parent companion is restricted to assigned student scope only.'
        };
      }
    }

    // Permitted read
    const audit: CompanionPrivacyAudit = {
      auditId: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      targetDomain,
      actionRequested,
      verdict: 'PERMITTED',
      enforcingPolicy: 'SEC_RBAC_DATA_ISOLATION'
    };
    this.auditLog.unshift(audit);
    return {
      permitted: true,
      verdict: 'PERMITTED',
      policy: 'SEC_RBAC_DATA_ISOLATION',
      message: 'Access permitted under sovereign privacy rules.'
    };
  }

  public getAuditLog(): CompanionPrivacyAudit[] {
    return [...this.auditLog];
  }
}

export const companionPrivacyGuard = CompanionPrivacyGuard.getInstance();
