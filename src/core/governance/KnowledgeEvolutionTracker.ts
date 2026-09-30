/**
 * R707 — Knowledge Evolution Tracker
 * Extends the Knowledge Vault to track strategic architectural concepts and lifecycle phases.
 * Tracks: CORE | RESERVED | EXPERIMENTAL | REJECTED.
 * TK ASY SYIFA DIGITAL ECOSYSTEM (TADE)
 */

export interface KnowledgeLifecycleItem {
  id: string;
  code: string;
  title: string;
  lifecycleStatus: 'CORE' | 'RESERVED' | 'EXPERIMENTAL' | 'REJECTED';
  originDate: string;
  lastUpdated: string;
  originSprint: string;
  summary: string;
  evolutionHistory: Array<{
    date: string;
    phase: string;
    description: string;
    authorizedBy: string;
  }>;
  doctrineJustification: string;
  associatedModules: string[];
}

const SEED_KNOWLEDGE_ITEMS: KnowledgeLifecycleItem[] = [
  {
    id: 'KN-01',
    code: 'SSOT-CANONICAL-DB',
    title: 'Single Source of Truth Database Architecture (db.ts)',
    lifecycleStatus: 'CORE',
    originDate: '2026-08-01',
    lastUpdated: '2026-08-18',
    originSprint: 'RC01',
    summary: 'Sentralisasi seluruh penyimpanan state data entitas sekolah pada modul tunggal src/services/db.ts.',
    evolutionHistory: [
      { date: '2026-08-01', phase: 'Inception', description: 'Inisialisasi schema SSoT awal.', authorizedBy: 'Founder' },
      { date: '2026-08-10', phase: 'Enforcement', description: 'Guardian Ring-0 mengunci mutasi bypass db.ts.', authorizedBy: 'Architecture Board' },
      { date: '2026-08-18', phase: 'RC88 Hardening', description: 'Integrasi dengan Configuration Drift Detector.', authorizedBy: 'Supreme Council' }
    ],
    doctrineJustification: 'Menjamin integritas data tanpa split-brain across multiple stores.',
    associatedModules: ['R1', 'R665', 'R701', 'R703']
  },
  {
    id: 'KN-02',
    code: 'GUARDIAN-RING0',
    title: 'Guardian Ring-0 Sovereign Security Interceptor',
    lifecycleStatus: 'CORE',
    originDate: '2026-08-05',
    lastUpdated: '2026-08-18',
    originSprint: 'RC30',
    summary: 'Lapisan keamanan inti penegak invarian dan anti-eskalasi hak akses di runtime.',
    evolutionHistory: [
      { date: '2026-08-05', phase: 'Prototype', description: 'Pemeriksaan akses RBAC dasar.', authorizedBy: 'Security Lead' },
      { date: '2026-08-12', phase: 'Ring-0 Armor', description: 'Pencegahan mutasi ilegal di level execution stack.', authorizedBy: 'Founder' }
    ],
    doctrineJustification: 'Kedaulatan keamanan mutlak melindungi hak akses institusi TK Asy-Syifa.',
    associatedModules: ['R666', 'R688', 'R697', 'R703']
  },
  {
    id: 'KN-03',
    code: 'HERMES-AUTONOMOUS-MUTATION',
    title: 'Hermes Direct Unsupervised Production Mutation',
    lifecycleStatus: 'REJECTED',
    originDate: '2026-08-14',
    lastUpdated: '2026-08-17',
    originSprint: 'RC84',
    summary: 'Eksekusi mutasi langsung ke database produksi oleh AI agent tanpa review manual.',
    evolutionHistory: [
      { date: '2026-08-14', phase: 'Concept Analysis', description: 'Evaluasi risiko automasi penuh.', authorizedBy: 'TADE Research' },
      { date: '2026-08-16', phase: 'Rejection & Lock', description: 'Ditolak demi keamanan; dialihkan ke In-Memory Dry-Run Lab saja.', authorizedBy: 'Founder & Board' }
    ],
    doctrineJustification: 'Melanggar doktrin keselamatan data operasional sekolah.',
    associatedModules: ['R672', 'R690', 'R700']
  },
  {
    id: 'KN-04',
    code: 'ONDEVICE-LOCAL-LLM',
    title: 'Local On-Device AI Assistance Engine (WebGPU/WASM)',
    lifecycleStatus: 'EXPERIMENTAL',
    originDate: '2026-08-16',
    lastUpdated: '2026-08-18',
    originSprint: 'RC85',
    summary: 'Eksperimen inference kecerdasan buatan lokal tanpa mengirim data santri ke cloud eksternal.',
    evolutionHistory: [
      { date: '2026-08-16', phase: 'Lab Experimentation', description: 'Uji model quantized ringan untuk pembuatan soal & asesmen.', authorizedBy: 'Academic Directorate' }
    ],
    doctrineJustification: 'Mendukung privasi data santri 100% dan doktrin Free-First.',
    associatedModules: ['R667', 'R675', 'R676']
  },
  {
    id: 'KN-05',
    code: 'AIRGAP-DISTRIBUTED-MESH',
    title: 'Airgap Multi-Node Synchronization Mesh (P2P WiFi)',
    lifecycleStatus: 'RESERVED',
    originDate: '2026-08-17',
    lastUpdated: '2026-08-18',
    originSprint: 'RC86',
    summary: 'Sinkronisasi antar tablet guru dan proyektor kelas tanpa koneksi internet via WiFi lokal.',
    evolutionHistory: [
      { date: '2026-08-17', phase: 'Architecture Specification', description: 'Disiapkan untuk deployment skala cabang sekolah.', authorizedBy: 'Supreme Architecture Board' }
    ],
    doctrineJustification: 'Ketahanan operasional saat infrastruktur telekomunikasi terputus.',
    associatedModules: ['R685', 'R704']
  }
];

export class KnowledgeEvolutionTracker {
  private static instance: KnowledgeEvolutionTracker;

  private constructor() {}

  public static getInstance(): KnowledgeEvolutionTracker {
    if (!KnowledgeEvolutionTracker.instance) {
      KnowledgeEvolutionTracker.instance = new KnowledgeEvolutionTracker();
    }
    return KnowledgeEvolutionTracker.instance;
  }

  public getKnowledgeItems(filter?: 'CORE' | 'RESERVED' | 'EXPERIMENTAL' | 'REJECTED'): KnowledgeLifecycleItem[] {
    if (!filter) {
      return [...SEED_KNOWLEDGE_ITEMS];
    }
    return SEED_KNOWLEDGE_ITEMS.filter(k => k.lifecycleStatus === filter);
  }

  public getLifecycleDistribution(): Record<string, number> {
    return {
      CORE: SEED_KNOWLEDGE_ITEMS.filter(k => k.lifecycleStatus === 'CORE').length,
      RESERVED: SEED_KNOWLEDGE_ITEMS.filter(k => k.lifecycleStatus === 'RESERVED').length,
      EXPERIMENTAL: SEED_KNOWLEDGE_ITEMS.filter(k => k.lifecycleStatus === 'EXPERIMENTAL').length,
      REJECTED: SEED_KNOWLEDGE_ITEMS.filter(k => k.lifecycleStatus === 'REJECTED').length,
      TOTAL: SEED_KNOWLEDGE_ITEMS.length
    };
  }
}
