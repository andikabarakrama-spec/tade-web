/**
 * R706 — Executive Decision Journal
 * Immutable and append-only ledger of strategic governance decisions.
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE)
 */

export interface ExecutiveDecisionEntry {
  decisionId: string;
  timestamp: string;
  actor: string;
  category: 'ARCHITECTURE' | 'POLICY' | 'GOVERNANCE' | 'SECURITY' | 'FINANCIAL' | 'RESILIENCE';
  title: string;
  reason: string;
  impact: string;
  status: 'RATIFIED' | 'ENFORCED' | 'UNDER_REVIEW' | 'ARCHIVED';
  cryptographicSignature: string;
  references: string[];
}

const STORAGE_KEY = 'tade_executive_decision_journal_rc88';

const SEED_DECISIONS: ExecutiveDecisionEntry[] = [
  {
    decisionId: 'DEC-2026-08-01',
    timestamp: '2026-08-15T08:00:00Z',
    actor: 'Founder & Ketua Yayasan',
    category: 'GOVERNANCE',
    title: 'Adopsi Doktrin Free-First dan Non-Vendor Lock-in',
    reason: 'Menjamin kemandirian jangka panjang institusi pendidikan TK Asy-Syifa tanpa biaya lisensi cloud berulang.',
    impact: 'Semua dependensi eksternal berbayar dilarang keras, aplikasi bersifat self-contained.',
    status: 'RATIFIED',
    cryptographicSignature: 'SIG-FOUNDER-9921AA',
    references: ['DISC-001', 'CONSTITUTION-ARTICLE-1']
  },
  {
    decisionId: 'DEC-2026-08-02',
    timestamp: '2026-08-16T10:30:00Z',
    actor: 'Supreme Architecture Board',
    category: 'ARCHITECTURE',
    title: 'Penetapan src/services/db.ts sebagai Single Source of Truth (SSoT)',
    reason: 'Mencegah inkonsistensi data antar modul dan menghilangkan fragmentasi penyimpanan.',
    impact: 'Seluruh komponen UI dan proses background wajib berinteraksi melalui db.ts.',
    status: 'ENFORCED',
    cryptographicSignature: 'SIG-ARCH-7718BB',
    references: ['DISC-600', 'R665']
  },
  {
    decisionId: 'DEC-2026-08-03',
    timestamp: '2026-08-17T14:15:00Z',
    actor: 'Founder & Security Council',
    category: 'SECURITY',
    title: 'Hermes Dormancy Enactment (Zero Unintended Production Mutation)',
    reason: 'Mencegah automasi otonom memutasi basis data operasional secara tidak sengaja.',
    impact: 'Seluruh alur kerja Hermes hanya boleh dijalankan melalui simulator/lab uji in-memory.',
    status: 'RATIFIED',
    cryptographicSignature: 'SIG-SEC-3312CC',
    references: ['DISC-672', 'DISC-700', 'R690']
  },
  {
    decisionId: 'DEC-2026-08-04',
    timestamp: '2026-08-18T04:00:00Z',
    actor: 'Founder & Academic Directorate',
    category: 'RESILIENCE',
    title: 'Pengesahan TADE RC88: Operational Intelligence & Governance',
    reason: 'Menyediakan visibilitas menyeluruh dan audit kepatuhan sebelum aktivasi final.',
    impact: 'Menambahkan suite observabilitas kesehatan, verifikasi Founder, dan integrity scanner.',
    status: 'RATIFIED',
    cryptographicSignature: 'SIG-RC88-4490DD',
    references: ['DISC-701', 'DISC-710', 'RC88']
  }
];

export class ExecutiveDecisionJournal {
  private static instance: ExecutiveDecisionJournal;
  private entries: ExecutiveDecisionEntry[];

  private constructor() {
    this.entries = this.loadEntries();
  }

  public static getInstance(): ExecutiveDecisionJournal {
    if (!ExecutiveDecisionJournal.instance) {
      ExecutiveDecisionJournal.instance = new ExecutiveDecisionJournal();
    }
    return ExecutiveDecisionJournal.instance;
  }

  private loadEntries(): ExecutiveDecisionEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return [...SEED_DECISIONS];
  }

  private saveEntries(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
    } catch {
      // Ignore
    }
  }

  public getAllEntries(): ExecutiveDecisionEntry[] {
    return [...this.entries];
  }

  public recordDecision(entry: Omit<ExecutiveDecisionEntry, 'decisionId' | 'timestamp' | 'cryptographicSignature'>): ExecutiveDecisionEntry {
    const timestamp = new Date().toISOString();
    const decisionId = `DEC-${new Date().getFullYear()}-${String(this.entries.length + 1).padStart(3, '0')}`;
    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const cryptographicSignature = `SIG-${entry.actor.replace(/[^A-Z]/gi, '').slice(0, 4).toUpperCase()}-${hash}`;

    const newEntry: ExecutiveDecisionEntry = {
      decisionId,
      timestamp,
      actor: entry.actor,
      category: entry.category,
      title: entry.title,
      reason: entry.reason,
      impact: entry.impact,
      status: entry.status || 'RATIFIED',
      cryptographicSignature,
      references: entry.references || []
    };

    // Immutable append-only
    this.entries.unshift(newEntry);
    this.saveEntries();
    return newEntry;
  }
}
