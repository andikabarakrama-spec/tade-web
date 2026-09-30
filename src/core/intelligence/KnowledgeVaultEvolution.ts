export interface VaultHistoricalRecord {
  id: string;
  topic: string;
  category: 'FOUNDER_DECISION' | 'INTELLIGENCE_FINDING' | 'ACCEPTED_TECH' | 'REJECTED_TECH' | 'RESERVED_IDEA' | 'TADE_HISTORY';
  date: string;
  summary: string;
  decisionReason: string;
  authorOrDecider: string;
  tags: string[];
}

export class KnowledgeVaultEvolution {
  private static instance: KnowledgeVaultEvolution;
  private records: VaultHistoricalRecord[] = [
    {
      id: 'VLT-001',
      topic: 'Penolakan Database SQL Relasional Eksternal & Cloud Lock-in',
      category: 'REJECTED_TECH',
      date: '2026-06-15',
      summary: 'Keputusan arsitektur menolak pengikatan pada database SQL hosting berbayar (RDS/Supabase/Neon) yang membebankan tagihan bulanan berulang.',
      decisionReason: 'Prinsip kemandirian madrasah mengharuskan sistem mampu berjalan pada single hardware lokal/cloud gratis tanpa tagihan tersembunyi. Single Source of Truth db.ts dan Firestore lokal/cloud bebas biaya memenuhi syarat.',
      authorOrDecider: 'Founder & Supreme System Architect',
      tags: ['CloudIndependence', 'AntiVendorLockIn', 'CostZero']
    },
    {
      id: 'VLT-002',
      topic: 'Adopsi Status DORMANT Mutlak untuk Hermes Agentic Engine',
      category: 'FOUNDER_DECISION',
      date: '2026-08-10',
      summary: 'Hermes ditempatkan dalam mode kontrol DORMANT tanpa dependensi runtime atau instalasi pihak ketiga.',
      decisionReason: 'Keamanan data santri dan stabilitas 60 FPS aplikasi tidak boleh terkompromi oleh agentic loops eksternal yang belum terverifikasi. Seluruh eksekusi administratif harus melalui RBAC dan db.ts.',
      authorOrDecider: 'Founder & AI Asy Prime Minister',
      tags: ['HermesControl', 'DormantSafety', 'GuardianRing0']
    },
    {
      id: 'VLT-003',
      topic: 'Pengesahan 22 Invarian Konstitusi TADE',
      category: 'TADE_HISTORY',
      date: '2026-08-01',
      summary: 'Perumusan dan penyegelan 22 pilar konstitusi digital tak tergoyahkan termasuk Anti-Negative Tabungan, Zero Data Overwrite, dan Audit Trail Abadi.',
      decisionReason: 'Menjamin keabadian sistem TADE lintas generasi pengurus yayasan dan mencegah degradasi integritas data.',
      authorOrDecider: 'Founder & Constitutional Assembly',
      tags: ['Constitution', '22Invariants', 'Immutability']
    },
    {
      id: 'VLT-004',
      topic: 'Adopsi Merkle Tree Chaining untuk Laporan Harian Madrasah',
      category: 'ACCEPTED_TECH',
      date: '2026-08-16',
      summary: 'Penerapan pohon hash Merkle harian untuk membuktikan integritas seluruh transaksi kas dan nilai santri.',
      decisionReason: 'Memenuhi standar Permendikbudristek 2026 dan ISO 27001 secara matematis tanpa memerlukan sertifikat berbayar pihak ketiga.',
      authorOrDecider: 'Founder & Chief Security Officer',
      tags: ['MerkleLedger', 'ISO27001', 'Permendikbud']
    },
    {
      id: 'VLT-005',
      topic: 'Pencadangan Wasm Multi-Agent Execution Sandbox',
      category: 'RESERVED_IDEA',
      date: '2026-08-16',
      summary: 'Pencadangan ide eksekusi agen dalam WebAssembly sandboxing untuk evaluasi masa depan.',
      decisionReason: 'Teknologi masih berkembang (WASI 0.3); dicadangkan agar tidak membebani rilis LTS saat ini.',
      authorOrDecider: 'Future Council',
      tags: ['Wasm', 'FutureRadar', 'Reserved']
    }
  ];

  public static getInstance(): KnowledgeVaultEvolution {
    if (!KnowledgeVaultEvolution.instance) {
      KnowledgeVaultEvolution.instance = new KnowledgeVaultEvolution();
    }
    return KnowledgeVaultEvolution.instance;
  }

  public getAllRecords(): VaultHistoricalRecord[] {
    return [...this.records];
  }

  public searchVault(query: string): VaultHistoricalRecord[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.records;
    return this.records.filter(r => 
      r.topic.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.decisionReason.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  public queryHistoricalReason(query: string): { found: boolean; explanation: string; record?: VaultHistoricalRecord } {
    const results = this.searchVault(query);
    if (results.length > 0) {
      const top = results[0];
      return {
        found: true,
        explanation: `Histori TADE mencatat: Mengenai "${top.topic}", keputusan dibuat pada ${top.date} oleh ${top.authorOrDecider}. Alasan utama: ${top.decisionReason}`,
        record: top
      };
    }
    return {
      found: false,
      explanation: 'Topik ini belum tercatat dalam histori keputusan resmi Knowledge Vault.'
    };
  }
}
