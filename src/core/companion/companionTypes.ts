/**
 * TADE RC93 — Digital Companion Ecosystem Types
 * Type definitions for Parent, Teacher, Executive companions,
 * memory, conversation context, smart reminders, insights, timeline, and privacy guard.
 */

export type CompanionRole = 'PARENT' | 'TEACHER' | 'EXECUTIVE' | 'UNIVERSAL';

export type ReminderPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ReminderStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export interface SmartReminder {
  reminderId: string;
  targetRole: CompanionRole;
  priority: ReminderPriority;
  status: ReminderStatus;
  title: string;
  message: string;
  category: 'SECURITY' | 'ACADEMIC' | 'FINANCE' | 'RECOVERY' | 'ADMINISTRATION';
  dedupHash: string; // SHA-like fingerprint for deduplication
  createdAt: string;
  expiresAt?: string;
  sourceModule: string;
  actionUri?: string;
}

export type InsightCategory = 'GOVERNANCE' | 'OPERATIONS' | 'STUDENT_DEVELOPMENT' | 'FINANCE' | 'SYSTEM_HEALTH';

export interface CompanionInsightCard {
  insightId: string;
  targetRole: CompanionRole;
  category: InsightCategory;
  title: string;
  summary: string;
  metricValue?: string;
  recommendation: string;
  confidenceScore: number; // 0 - 100
  isActionable: boolean;
  generatedAt: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'ACTIONED';
  rationale: string;
}

export interface CompanionMemoryPreference {
  key: string;
  role: CompanionRole;
  preferenceValue: any;
  updatedAt: string;
  isSafe: boolean; // Must not contain sensitive PII or credentials
}

export interface ConversationContextSession {
  sessionId: string;
  role: CompanionRole;
  userId: string;
  activeTopic: string;
  recentQueries: string[];
  contextState: Record<string, any>;
  lastInteraction: string;
  isAdvisoryOnly: true; // Strictly non-autonomous
}

export interface InteractionTimelineItem {
  itemId: string;
  type: 'REMINDER' | 'INSIGHT' | 'NOTIFICATION' | 'EXECUTIVE_BRIEFING';
  role: CompanionRole;
  title: string;
  description: string;
  priority: ReminderPriority;
  timestamp: string;
  metadata?: Record<string, any>;
  isRead: boolean;
}

export interface CompanionPrivacyAudit {
  auditId: string;
  timestamp: string;
  actorRole: string;
  targetDomain: string;
  actionRequested: string;
  verdict: 'PERMITTED' | 'BLOCKED_RBAC' | 'BLOCKED_GUARDIAN';
  enforcingPolicy: string;
}
