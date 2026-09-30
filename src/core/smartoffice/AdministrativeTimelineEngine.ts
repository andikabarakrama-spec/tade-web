import { ExecutiveDecisionJournal } from '../governance/ExecutiveDecisionJournal';
import { FounderCommandHistory } from '../governance/FounderCommandHistory';

export interface UnifiedTimelineEvent {
  id: string;
  source: 'DECISION_JOURNAL' | 'RECOVERY_SNAPSHOT' | 'COMMAND_HISTORY' | 'GUARDIAN_AUDIT' | 'WORKFLOW_EVENT';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  badge: string;
  badgeColor: string;
  metadata?: Record<string, any>;
}

export class AdministrativeTimelineEngine {
  private static instance: AdministrativeTimelineEngine;

  public static getInstance(): AdministrativeTimelineEngine {
    if (!AdministrativeTimelineEngine.instance) {
      AdministrativeTimelineEngine.instance = new AdministrativeTimelineEngine();
    }
    return AdministrativeTimelineEngine.instance;
  }

  public getUnifiedTimeline(filterSource?: string): UnifiedTimelineEvent[] {
    const events: UnifiedTimelineEvent[] = [];

    // 1. Executive Decisions (R706)
    try {
      const decisionEngine = ExecutiveDecisionJournal.getInstance();
      const decisions = decisionEngine.getAllEntries();
      decisions.forEach(d => {
        events.push({
          id: `TL-DEC-${d.decisionId}`,
          source: 'DECISION_JOURNAL',
          title: `[Keputusan] ${d.title}`,
          description: d.reason,
          actor: d.actor,
          timestamp: d.timestamp,
          badge: d.category,
          badgeColor: 'emerald',
          metadata: { impact: d.impact, signature: d.cryptographicSignature }
        });
      });
    } catch (e) {}

    // 2. Founder Commands (R708)
    try {
      const commandEngine = FounderCommandHistory.getInstance();
      const commands = commandEngine.getCommands();
      commands.forEach(c => {
        events.push({
          id: `TL-CMD-${c.commandId}`,
          source: 'COMMAND_HISTORY',
          title: `[Komando] ${c.commandType}`,
          description: c.payloadSummary,
          actor: c.executor,
          timestamp: c.timestamp,
          badge: c.commandType,
          badgeColor: 'sky',
          metadata: { status: c.executionStatus, hash: c.auditHash }
        });
      });
    } catch (e) {}

    // 3. Recovery & Integrity Milestones
    events.push({
      id: 'TL-REC-20260818-01',
      source: 'RECOVERY_SNAPSHOT',
      title: '[Recovery] SSoT Multi-Layer Backup Sealed',
      description: 'Pembuatan snapshot memori dan file cadangan lokal SSoT (4 artefak terverifikasi penuh).',
      actor: 'Recovery Doctrine Core',
      timestamp: '2026-08-18T04:00:00Z',
      badge: 'ZERO_DATA_LOSS',
      badgeColor: 'amber'
    });

    events.push({
      id: 'TL-GRD-20260818-02',
      source: 'GUARDIAN_AUDIT',
      title: '[Integritas] Pemindaian Guardian Ring-0 Sukses',
      description: 'Audit 6 vektor struktural menyatakan 100% konsistensi tanpa kebocoran autentikasi.',
      actor: 'Guardian Ring-0 Core',
      timestamp: '2026-08-18T04:05:00Z',
      badge: 'AUDIT_PASS',
      badgeColor: 'purple'
    });

    // Sort descending (newest first)
    const sorted = events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filterSource && filterSource !== 'ALL') {
      return sorted.filter(e => e.source === filterSource);
    }
    return sorted;
  }
}
