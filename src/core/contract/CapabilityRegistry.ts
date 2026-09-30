/**
 * R729 — Capability Registry
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE) — RC90
 * 
 * Comprehensive map of all system capabilities and inter-capability relationships.
 * Read-only, structured as a directional dependency and enhancement graph.
 */

export type CapabilityCategory =
  | 'GUARDIAN'
  | 'AI_ASY'
  | 'HERMES'
  | 'SMART_OFFICE'
  | 'RECOVERY'
  | 'KNOWLEDGE'
  | 'GOVERNANCE'
  | 'ACADEMIC'
  | 'FINANCE';

export interface CapabilityRelation {
  targetCapabilityId: string;
  relationType: 'REQUIRES' | 'ENHANCES' | 'MONITORED_BY' | 'AUDITED_BY' | 'PROVIDES_DATA_TO';
  description: string;
}

export interface SystemCapability {
  id: string;
  name: string;
  category: CapabilityCategory;
  description: string;
  maturityLevel: 'PRODUCTION_LOCKED' | 'ENTERPRISE_READY' | 'DORMANT_SAFE' | 'PROBATIONARY';
  owner: string;
  associatedEngineId: string;
  associatedModuleCodes: string[];
  relations: CapabilityRelation[];
  invariants: string[];
}

export class CapabilityRegistry {
  private static instance: CapabilityRegistry;
  private capabilities: Map<string, SystemCapability> = new Map();

  private constructor() {
    this.seedCapabilities();
  }

  public static getInstance(): CapabilityRegistry {
    if (!CapabilityRegistry.instance) {
      CapabilityRegistry.instance = new CapabilityRegistry();
    }
    return CapabilityRegistry.instance;
  }

  private seedCapabilities(): void {
    const list: SystemCapability[] = [
      {
        id: 'CAP-GUARDIAN-RING0',
        name: 'Ring-0 Sovereign Integrity Scanner',
        category: 'GUARDIAN',
        description: 'Pemindaian 6 vektor integritas skema data, invariant enkapsulasi, dan autentikasi.',
        maturityLevel: 'PRODUCTION_LOCKED',
        owner: 'Guardian Directorate',
        associatedEngineId: 'ENG-GUARDIAN-01',
        associatedModuleCodes: ['R703', 'R705'],
        relations: [
          { targetCapabilityId: 'CAP-SSOT-STORAGE', relationType: 'REQUIRES', description: 'Memeriksa konsistensi skema SSoT db.ts' },
          { targetCapabilityId: 'CAP-HERMES-AUTOMATION', relationType: 'MONITORED_BY', description: 'Memastikan Hermes tetap dalam status aman DORMANT_SAFE' }
        ],
        invariants: ['Zero security regression', 'Air-gapped verification']
      },
      {
        id: 'CAP-SSOT-STORAGE',
        name: 'Single Source of Truth (SSoT) Central Data Service',
        category: 'GOVERNANCE',
        description: 'Sentralisasi penyimpanan entitas dan state reaktif lokal + cloud Firestore tanpa duplikasi.',
        maturityLevel: 'PRODUCTION_LOCKED',
        owner: 'Supreme Architecture Board',
        associatedEngineId: 'ENG-SSOT-01',
        associatedModuleCodes: ['R665', 'R701', 'R710'],
        relations: [
          { targetCapabilityId: 'CAP-RECOVERY-SNAPSHOT', relationType: 'PROVIDES_DATA_TO', description: 'Menjadi sumber data snapshot pemulihan' },
          { targetCapabilityId: 'CAP-SMART-OFFICE-QUEUE', relationType: 'PROVIDES_DATA_TO', description: 'Menyuplai entitas pendaftaran, transaksi, dan absensi' }
        ],
        invariants: ['All mutations pass through DataService', 'Zero parallel state silos']
      },
      {
        id: 'CAP-AI-ASY-INTEL',
        name: 'AI Asy Executive Intelligence 2.0 & Situation Report',
        category: 'AI_ASY',
        description: 'Sintesis intelijen eksekutif, SITREP otomatis, analisis bottleneck, dan konsol tanya-jawab pimpinan.',
        maturityLevel: 'ENTERPRISE_READY',
        owner: 'AI Asy Cognitive Lab',
        associatedEngineId: 'ENG-AI-ASY-01',
        associatedModuleCodes: ['R723', 'R724', 'R725', 'R726', 'R727', 'R728', 'R730'],
        relations: [
          { targetCapabilityId: 'CAP-SSOT-STORAGE', relationType: 'REQUIRES', description: 'Membaca data faktual institusi secara read-only' },
          { targetCapabilityId: 'CAP-KNOWLEDGE-INDEX', relationType: 'ENHANCES', description: 'Memanfaatkan indeks regulasi dan kurikulum untuk grounding' },
          { targetCapabilityId: 'CAP-GOVERNANCE-DECISION', relationType: 'PROVIDES_DATA_TO', description: 'Memberikan rekomendasi bernilai tinggi bagi Founder' }
        ],
        invariants: ['Strictly advisory output', 'Zero auto-mutation']
      },
      {
        id: 'CAP-HERMES-AUTOMATION',
        name: 'Hermes Autonomous Workflow & Adaptation Engine',
        category: 'HERMES',
        description: 'Mesin automasi adaptif yang diisolasi dalam mode dormansi aman untuk simulasi lab uji.',
        maturityLevel: 'DORMANT_SAFE',
        owner: 'Automation Council',
        associatedEngineId: 'ENG-HERMES-01',
        associatedModuleCodes: ['R672', 'R677', 'R691', 'R700'],
        relations: [
          { targetCapabilityId: 'CAP-GUARDIAN-RING0', relationType: 'AUDITED_BY', description: 'Diverifikasi status dormansinya oleh Guardian' }
        ],
        invariants: ['Zero production mutation without manual authorization']
      },
      {
        id: 'CAP-SMART-OFFICE-QUEUE',
        name: 'Smart Office Unified Administrative Queue & Priority',
        category: 'SMART_OFFICE',
        description: 'Antrean agregasi beban kerja multi-domain dengan penilaian prioritas matematis cerdas.',
        maturityLevel: 'ENTERPRISE_READY',
        owner: 'Enterprise Workflow Council',
        associatedEngineId: 'ENG-SMART-OFFICE-01',
        associatedModuleCodes: ['R711', 'R712', 'R713', 'R714', 'R718'],
        relations: [
          { targetCapabilityId: 'CAP-SSOT-STORAGE', relationType: 'REQUIRES', description: 'Membaca antrean PPDB, SPP, dan surat resmi' },
          { targetCapabilityId: 'CAP-AI-ASY-INTEL', relationType: 'PROVIDES_DATA_TO', description: 'Menyuplai metrik beban kerja untuk SITREP' }
        ],
        invariants: ['Deterministic priority weighting', 'Role-based visibility']
      },
      {
        id: 'CAP-RECOVERY-SNAPSHOT',
        name: 'Zero-Data-Loss Multi-Layer Recovery Doctrine',
        category: 'RECOVERY',
        description: 'Pusat cadangan lokal & cloud dengan verifikasi integritas kriptografis dan uji pulih berkala.',
        maturityLevel: 'PRODUCTION_LOCKED',
        owner: 'Recovery Core Directorate',
        associatedEngineId: 'ENG-RECOVERY-01',
        associatedModuleCodes: ['R35', 'R669', 'R704'],
        relations: [
          { targetCapabilityId: 'CAP-SSOT-STORAGE', relationType: 'REQUIRES', description: 'Mengamankan seluruh state SSoT' },
          { targetCapabilityId: 'CAP-AI-ASY-INTEL', relationType: 'PROVIDES_DATA_TO', description: 'Melaporkan skor kesiapan pemulihan' }
        ],
        invariants: ['Immutable backup artifacts', 'Sub-second recovery readiness']
      },
      {
        id: 'CAP-KNOWLEDGE-INDEX',
        name: 'Sovereign Knowledge Vault & Air-Gapped Indexer',
        category: 'KNOWLEDGE',
        description: 'Indeks pengetahuan kurikulum, regulasi dinas, arsip SK yayasan, dan SOP operasional sekolah.',
        maturityLevel: 'ENTERPRISE_READY',
        owner: 'Knowledge Board',
        associatedEngineId: 'ENG-KNOWLEDGE-01',
        associatedModuleCodes: ['R140', 'R666', 'R715'],
        relations: [
          { targetCapabilityId: 'CAP-AI-ASY-INTEL', relationType: 'ENHANCES', description: 'Menyediakan basis pengetahuan untuk grounding jawaban' }
        ],
        invariants: ['Zero external vector database cost', 'Offline query resilience']
      },
      {
        id: 'CAP-GOVERNANCE-DECISION',
        name: 'Executive Decision Journal & Founder Command Trail',
        category: 'GOVERNANCE',
        description: 'Buku keputusan eksekutif tak terubah dan jejak audit komando tertinggi institusi.',
        maturityLevel: 'PRODUCTION_LOCKED',
        owner: 'Founder & Supreme System Architect',
        associatedEngineId: 'ENG-GOVERNANCE-01',
        associatedModuleCodes: ['R706', 'R707', 'R708', 'R716'],
        relations: [
          { targetCapabilityId: 'CAP-AI-ASY-INTEL', relationType: 'PROVIDES_DATA_TO', description: 'Menampilkan keputusan yang sedang dalam peninjauan' }
        ],
        invariants: ['Immutable append-only ledger', 'Cryptographic signature per actor']
      },
      {
        id: 'CAP-ENGINE-CONTRACT',
        name: 'Engine Contract Versioning & Compatibility Validation',
        category: 'GOVERNANCE',
        description: 'Pencatatan kontrak eksplisit antar-engine, validasi dependensi DAG, dan jaminan rollback safety.',
        maturityLevel: 'ENTERPRISE_READY',
        owner: 'Supreme Architecture Board',
        associatedEngineId: 'ENG-CONTRACT-01',
        associatedModuleCodes: ['R721', 'R722', 'R729'],
        relations: [
          { targetCapabilityId: 'CAP-GUARDIAN-RING0', relationType: 'ENHANCES', description: 'Menjamin arsitektur bebas dari drift dependensi' }
        ],
        invariants: ['Backward compatibility declaration', 'Zero hidden coupling']
      }
    ];

    list.forEach(item => this.capabilities.set(item.id, item));
  }

  public getAllCapabilities(): SystemCapability[] {
    return Array.from(this.capabilities.values());
  }

  public getCapability(id: string): SystemCapability | undefined {
    return this.capabilities.get(id);
  }

  public getCapabilitiesByCategory(category: CapabilityCategory): SystemCapability[] {
    return this.getAllCapabilities().filter(c => c.category === category);
  }

  public getSummary(): {
    totalCapabilities: number;
    productionLockedCount: number;
    enterpriseReadyCount: number;
    dormantSafeCount: number;
    totalRelations: number;
  } {
    const all = this.getAllCapabilities();
    const locked = all.filter(c => c.maturityLevel === 'PRODUCTION_LOCKED').length;
    const ready = all.filter(c => c.maturityLevel === 'ENTERPRISE_READY').length;
    const dormant = all.filter(c => c.maturityLevel === 'DORMANT_SAFE').length;
    const relations = all.reduce((acc, c) => acc + c.relations.length, 0);

    return {
      totalCapabilities: all.length,
      productionLockedCount: locked,
      enterpriseReadyCount: ready,
      dormantSafeCount: dormant,
      totalRelations: relations
    };
  }
}
