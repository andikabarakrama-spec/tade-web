import { ConversationContextSession, CompanionRole } from './companionTypes';

/**
 * R755 — Conversation Context Engine
 * Retains ephemeral conversational context for AI Asy Digital Companion.
 * Enforces strictly advisory mode: never triggers automatic write mutations or executive overrides.
 */
class ConversationContextEngine {
  private static instance: ConversationContextEngine;
  private sessions: Map<string, ConversationContextSession> = new Map();

  private constructor() {
    this.seedDefaultSessions();
  }

  public static getInstance(): ConversationContextEngine {
    if (!ConversationContextEngine.instance) {
      ConversationContextEngine.instance = new ConversationContextEngine();
    }
    return ConversationContextEngine.instance;
  }

  private seedDefaultSessions() {
    this.createOrGetSession('PARENT', 'parent-demo-user', 'Perkembangan Hafalan Surat Pendek');
    this.createOrGetSession('TEACHER', 'teacher-demo-user', 'Rencana Kegiatan Harian Sentra Iman & Taqwa');
    this.createOrGetSession('EXECUTIVE', 'founder-demo-user', 'SITREP & Laporan Keuangan Bulanan');
  }

  public createOrGetSession(role: CompanionRole, userId: string, initialTopic: string = 'General Inquiry'): ConversationContextSession {
    const sessionId = `CTX-${role}-${userId}`;
    if (!this.sessions.has(sessionId)) {
      const session: ConversationContextSession = {
        sessionId,
        role,
        userId,
        activeTopic: initialTopic,
        recentQueries: [],
        contextState: {
          lastViewedTab: 'OVERVIEW',
          activeLanguage: 'ID',
          advisorySafetyNotice: 'This companion operates in pure advisory mode. Final decisions remain with human operators.'
        },
        lastInteraction: new Date().toISOString(),
        isAdvisoryOnly: true
      };
      this.sessions.set(sessionId, session);
    }
    return this.sessions.get(sessionId)!;
  }

  public appendQuery(sessionId: string, query: string, contextPatch: Record<string, any> = {}): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.recentQueries = [query, ...session.recentQueries.slice(0, 9)];
    session.contextState = { ...session.contextState, ...contextPatch };
    session.lastInteraction = new Date().toISOString();
  }

  public updateTopic(sessionId: string, newTopic: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.activeTopic = newTopic;
      session.lastInteraction = new Date().toISOString();
    }
  }

  public getSession(sessionId: string): ConversationContextSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllSessions(): ConversationContextSession[] {
    return Array.from(this.sessions.values());
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const conversationContextEngine = ConversationContextEngine.getInstance();
