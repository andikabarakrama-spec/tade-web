/**
 * Security Middleware & RBAC Permission Gate
 * 
 * Provides client-side permission checks, session validation, and data isolation
 * helpers. Frontend checks work in tandem with Firebase Auth & Firestore Rules
 * to enforce a default-deny security stance.
 */

export type TADERole =
  | 'Super Admin'
  | 'Admin SIM'
  | 'Ketua Yayasan'
  | 'Kepala Sekolah'
  | 'Guru'
  | 'Wali Murid'
  | 'Guest';

export interface UserSession {
  uid: string;
  role: TADERole;
  studentId?: string; // For Wali Murid
  classId?: string;   // For Guru
  isAuth: boolean;
}

export const PERMISSION_MATRIX: Record<TADERole, string[]> = {
  'Super Admin': ['*'],
  'Admin SIM': ['manage_sim', 'manage_users', 'manage_content', 'view_reports', 'manage_settings'],
  'Ketua Yayasan': ['view_reports', 'view_finances', 'view_sim', 'manage_policy'],
  'Kepala Sekolah': ['manage_academic', 'manage_teachers', 'view_reports', 'manage_content'],
  'Guru': ['manage_learning', 'input_assessment', 'view_students', 'chat_parents'],
  'Wali Murid': ['view_child_report', 'pay_spp', 'view_announcements', 'chat_teacher'],
  'Guest': ['view_public_website', 'view_character_asy', 'submit_ppdb_inquiry'],
};

export class SecurityMiddleware {
  private static rateLimitStore: Map<string, { count: number; windowStart: number }> = new Map();

  /**
   * Checks rate limiting for sensitive operations (e.g., login, registration, approval, payment).
   */
  static checkRateLimit(
    actionKey: string,
    maxRequests: number = 10,
    windowMs: number = 60000
  ): { allowed: boolean; remainingMs: number } {
    const now = Date.now();
    const entry = this.rateLimitStore.get(actionKey);

    if (!entry || now - entry.windowStart > windowMs) {
      this.rateLimitStore.set(actionKey, { count: 1, windowStart: now });
      return { allowed: true, remainingMs: 0 };
    }

    if (entry.count >= maxRequests) {
      const remainingMs = windowMs - (now - entry.windowStart);
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', 'WARN', { actionKey, count: entry.count, maxRequests });
      return { allowed: false, remainingMs };
    }

    entry.count += 1;
    return { allowed: true, remainingMs: 0 };
  }

  /**
   * Lightweight security event monitoring hook for Enterprise Operations.
   */
  static logSecurityEvent(
    eventType: string,
    severity: 'INFO' | 'WARN' | 'CRITICAL',
    details: Record<string, unknown>
  ): void {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      severity,
      details,
    };
    if (severity === 'CRITICAL' || severity === 'WARN') {
      console.warn(`[SECURITY_EVENT_${severity}]`, JSON.stringify(event));
    } else {
      console.log(`[SECURITY_EVENT_${severity}]`, JSON.stringify(event));
    }
  }

  /**
   * Checks if user session has permission for a given action.
   */
  static hasPermission(session: UserSession | null, requiredPermission: string): boolean {
    if (!session || !session.isAuth) {
      return PERMISSION_MATRIX['Guest'].includes(requiredPermission);
    }

    const role = session.role || 'Guest';
    const permissions = PERMISSION_MATRIX[role] || PERMISSION_MATRIX['Guest'];

    if (permissions.includes('*')) return true;
    return permissions.includes(requiredPermission);
  }

  /**
   * Validates data isolation constraint (e.g. Wali Murid viewing only their child).
   */
  static canAccessStudentData(session: UserSession | null, targetStudentId: string): boolean {
    if (!session) return false;
    if (session.role === 'Super Admin' || session.role === 'Admin SIM' || session.role === 'Kepala Sekolah') {
      return true;
    }
    if (session.role === 'Guru') {
      return true; // Class-level boundary enforced in Firestore
    }
    if (session.role === 'Wali Murid') {
      return session.studentId === targetStudentId;
    }
    return false;
  }

  /**
   * Checks feature flag for Living Character Engine.
   */
  static isFeatureEnabled(flagName: string): boolean {
    const flags: Record<string, boolean> = {
      livingCharacterEngine: true,
      aiContextFilter: true,
      securityBoundary: true,
    };
    return flags[flagName] ?? true;
  }
}
