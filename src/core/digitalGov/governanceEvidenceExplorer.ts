import { ConstitutionalPolicyEngine } from './constitutionalPolicyEngine';
import { ImmutableGovernanceJournal } from './immutableGovernanceJournal';
import { FounderDecisionLedger } from './founderDecisionLedger';
import { DigitalSignatureReadiness } from './digitalSignatureReadiness';
import { discoveryRegistry } from '../discoveryRegistry';

export type EvidenceCategory = 
  | 'DECISION' 
  | 'POLICY' 
  | 'GUARDIAN_EVENT' 
  | 'JOURNAL_ENTRY' 
  | 'DISCOVERY_ENTRY'
  | 'OFFICIAL_DOCUMENT';

export interface EvidenceRecord {
  evidenceId: string;
  category: EvidenceCategory;
  title: string;
  sourceCode: string;
  timestamp: string;
  authorOrActor: string;
  cryptographicDigest: string;
  summary: string;
  metadata: Record<string, any>;
  isImmutable: boolean;
}

export class GovernanceEvidenceExplorer {
  private static instance: GovernanceEvidenceExplorer;

  private constructor() {}

  public static getInstance(): GovernanceEvidenceExplorer {
    if (!GovernanceEvidenceExplorer.instance) {
      GovernanceEvidenceExplorer.instance = new GovernanceEvidenceExplorer();
    }
    return GovernanceEvidenceExplorer.instance;
  }

  public searchEvidence(query: string = '', categoryFilter?: EvidenceCategory): EvidenceRecord[] {
    const records: EvidenceRecord[] = [];

    // 1. Gather Founder Decisions
    const decisions = FounderDecisionLedger.getInstance().getAllDecisions();
    decisions.forEach(d => {
      records.push({
        evidenceId: `EVD-DEC-${d.decisionId}`,
        category: 'DECISION',
        title: d.title,
        sourceCode: d.code,
        timestamp: d.decisionDate,
        authorOrActor: `${d.authorName} (${d.authorRole})`,
        cryptographicDigest: d.cryptographicSeal,
        summary: `${d.reason} — Dampak: ${d.impactAssessment}`,
        metadata: { status: d.status, category: d.category },
        isImmutable: d.status === 'APPROVED'
      });
    });

    // 2. Gather Institutional Policies
    const policies = ConstitutionalPolicyEngine.getInstance().getAllPolicies();
    policies.forEach(p => {
      records.push({
        evidenceId: `EVD-POL-${p.policyId}`,
        category: 'POLICY',
        title: p.title,
        sourceCode: p.code,
        timestamp: '2026-08-19T00:00:00.000Z',
        authorOrActor: 'TADE Constitutional Compiler',
        cryptographicDigest: `HASH-${p.policyId}-SEAL`,
        summary: p.description,
        metadata: { severity: p.severity, category: p.category, invariant: p.invariantReference },
        isImmutable: true
      });
    });

    // 3. Gather Journal Entries
    const journalEntries = ImmutableGovernanceJournal.getInstance().getAllEntries();
    journalEntries.forEach(j => {
      records.push({
        evidenceId: `EVD-JRN-${j.entryId}`,
        category: 'JOURNAL_ENTRY',
        title: j.title,
        sourceCode: j.entryId,
        timestamp: j.timestamp,
        authorOrActor: `${j.performedByName} (${j.performedByRole})`,
        cryptographicDigest: j.cryptographicDigest,
        summary: j.summary,
        metadata: { eventType: j.eventType, state: j.state },
        isImmutable: true
      });
    });

    // 4. Gather Official Documents
    const docs = DigitalSignatureReadiness.getInstance().getAllDocuments();
    docs.forEach(doc => {
      records.push({
        evidenceId: `EVD-DOC-${doc.documentId}`,
        category: 'OFFICIAL_DOCUMENT',
        title: doc.documentTitle,
        sourceCode: doc.documentNumber,
        timestamp: doc.createdAt,
        authorOrActor: doc.createdByName,
        cryptographicDigest: doc.contentDigest,
        summary: `Kategori: ${doc.category} — Status Verifikasi: ${doc.verificationStatus}`,
        metadata: { verificationStatus: doc.verificationStatus, approvalSteps: doc.approvalChain.length },
        isImmutable: doc.isImmutable
      });
    });

    // 5. Gather Discovery Registry Entries
    discoveryRegistry.forEach(disc => {
      records.push({
        evidenceId: `EVD-DISC-${disc.id}`,
        category: 'DISCOVERY_ENTRY',
        title: disc.name,
        sourceCode: disc.id,
        timestamp: disc.timestamp || new Date().toISOString(),
        authorOrActor: disc.author || `TADE Kernel Registry (${disc.sprintOrigin})`,
        cryptographicDigest: `DISC-HASH-${disc.id}`,
        summary: disc.reason || disc.name,
        metadata: { id: disc.id, category: disc.category, moduleCodes: disc.moduleCodes, tags: disc.tags },
        isImmutable: true
      });
    });

    // Filtering
    let results = records;
    if (categoryFilter) {
      results = results.filter(r => r.category === categoryFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(r => 
        r.evidenceId.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.sourceCode.toLowerCase().includes(q) ||
        r.authorOrActor.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.cryptographicDigest.toLowerCase().includes(q)
      );
    }

    return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
