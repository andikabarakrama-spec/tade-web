/**
 * AI Context Filter & Data Privacy Boundary
 * 
 * Ensures AI Asy and Syifa only receive sanitized, public, or minimal
 * necessary presentation context. Direct access to raw Firestore or sensitive PII
 * is strictly forbidden.
 */

export interface SanitizedAIContext {
  characterName: 'Asy' | 'Syifa';
  userRole?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  schoolName: string;
  currentActivity?: string;
  announcementSummary?: string;
  allowedTopic?: string;
  featureFlags?: Record<string, boolean>;
}

export interface RawUserContext {
  user?: {
    id?: string;
    role?: string;
    email?: string;
    phone?: string;
    address?: string;
    password?: string;
    token?: string;
    studentRecords?: unknown[];
  };
  query?: string;
  systemConfig?: Record<string, unknown>;
  firebaseConfig?: Record<string, unknown>;
}

export class AIContextFilter {
  /**
   * Sanitizes raw user/system context to ensure zero leakage of PII, passwords,
   * tokens, or sensitive administrative databases to the AI character context.
   */
  static sanitizeContext(
    rawContext: RawUserContext,
    characterName: 'Asy' | 'Syifa' = 'Asy'
  ): SanitizedAIContext {
    const hours = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
    if (hours >= 5 && hours < 11) timeOfDay = 'morning';
    else if (hours >= 11 && hours < 15) timeOfDay = 'afternoon';
    else if (hours >= 15 && hours < 18) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Role filtering: keep role string only, remove user email, phone, address, token, etc.
    const safeRole = rawContext.user?.role
      ? String(rawContext.user.role).replace(/[^a-zA-Z_]/g, '')
      : 'guest';

    return {
      characterName,
      userRole: safeRole,
      timeOfDay,
      schoolName: 'TK Asy Syifa Tanggul',
      currentActivity: 'Belajar & Bermain Islami',
      announcementSummary: 'Selamat datang di TK Asy Syifa Tanggul',
      featureFlags: {
        livingCharacterEngine: true,
        reducedMotionSupport: true,
      },
    };
  }

  /**
   * Sanitizes input query string to strip sensitive tokens, passwords, or credentials.
   */
  static sanitizeQuery(query: string): string {
    if (!query) return '';
    return query
      .replace(/(\b(password|token|secret|key|apiKey|auth)\b\s*[:=]\s*\S+)/gi, '[REDACTED]')
      .replace(/\b\d{10,16}\b/g, '[REDACTED_NUMERIC]')
      .substring(0, 500); // Enforce max query length
  }
}
