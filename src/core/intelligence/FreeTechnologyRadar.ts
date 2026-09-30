export interface TechnologyCostBreakdown {
  softwareCost: string;     // e.g. "Rp 0 (MIT / Apache 2.0)"
  modelCost: string;        // e.g. "Rp 0 (Local Weights)"
  apiCost: string;          // e.g. "Rp 0 (No External API calls)"
  hostingCost: string;      // e.g. "Rp 0 (Local Hardware / Self-Hosted)"
  storageCost: string;      // e.g. "Rp 0 (IndexedDB / Local NVMe)"
  maintenanceCost: string;  // e.g. "Sangat Rendah (Zero External Patch Drift)"
  operationalCost: string;  // e.g. "Rp 0 / bulan"
}

export interface TechnologyScoring {
  costScore: number;         // 1-100 (100 = 100% Free / Zero Cost)
  securityScore: number;     // 1-100 (100 = Zero Trust / No Data Leak)
  lockInScore: number;       // 1-100 (100 = Zero Vendor Lock-in)
  maturityScore: number;     // 1-100 (100 = Battle-Tested Enterprise Ready)
  relevanceScore: number;    // 1-100 (100 = Crucial for TADE Madrasah)
  aggregateScore: number;
}

export interface FreeTechnologyItem {
  id: string;
  name: string;
  category: 
    | 'Open Source' 
    | 'Free Tier' 
    | 'Self-hosted' 
    | 'Local AI' 
    | 'Community Edition' 
    | 'Free API' 
    | 'Offline-capable' 
    | 'Free Automation' 
    | 'Education Tech' 
    | 'Developer Tools' 
    | 'AI Agents';
  license: string;
  description: string;
  costs: TechnologyCostBreakdown;
  scoring: TechnologyScoring;
  decision: 'WATCH' | 'TEST' | 'ADOPT' | 'REJECT';
  decisionRationale: string;
  evaluatedAt: string;
}

export class FreeTechnologyRadar {
  private static instance: FreeTechnologyRadar;
  private items: FreeTechnologyItem[] = [
    {
      id: 'TECH-001',
      name: 'Local Web Crypto & SubtleCrypto API (Native W3C)',
      category: 'Developer Tools',
      license: 'W3C Open Standard',
      description: 'Pustaka kriptografi native peramban untuk hashing SHA-256 dan HMAC tanpa dependensi bundle npm pihak ketiga.',
      costs: {
        softwareCost: 'Rp 0 (Built-in Browser API)',
        modelCost: 'Rp 0',
        apiCost: 'Rp 0',
        hostingCost: 'Rp 0',
        storageCost: 'Rp 0',
        maintenanceCost: 'Nol (Dipertahankan konsorsium peramban)',
        operationalCost: 'Rp 0'
      },
      scoring: {
        costScore: 100,
        securityScore: 100,
        lockInScore: 100,
        maturityScore: 100,
        relevanceScore: 100,
        aggregateScore: 100
      },
      decision: 'ADOPT',
      decisionRationale: 'Telah diadopsi penuh dalam Cryptographic Event Bus (R662) dan Guardian Security Hash. Standar emas bebas biaya selamanya.',
      evaluatedAt: '2026-08-16'
    },
    {
      id: 'TECH-002',
      name: 'IndexedDB & OPFS (Origin Private File System)',
      category: 'Offline-capable',
      license: 'W3C Open Standard',
      description: 'Sistem penyimpanan biner dan transaksi lokal di gawai pengguna dengan kapasitas gigabytes tanpa kuota server cloud.',
      costs: {
        softwareCost: 'Rp 0 (Native W3C)',
        modelCost: 'Rp 0',
        apiCost: 'Rp 0',
        hostingCost: 'Rp 0 (Client-side storage)',
        storageCost: 'Rp 0',
        maintenanceCost: 'Nol',
        operationalCost: 'Rp 0'
      },
      scoring: {
        costScore: 100,
        securityScore: 98,
        lockInScore: 100,
        maturityScore: 96,
        relevanceScore: 100,
        aggregateScore: 98.8
      },
      decision: 'ADOPT',
      decisionRationale: 'Fondasi utama Offline Continuity TADE (R656) dan antrean tabungan santri mandiri tanpa internet.',
      evaluatedAt: '2026-08-15'
    },
    {
      id: 'TECH-003',
      name: 'Small Language Models 4-bit CPU Runtime (Llama.cpp / ONNX Web)',
      category: 'Local AI',
      license: 'MIT / Apache 2.0',
      description: 'Engine inferensi model bahasa kecil pada peramban web atau server mini lokal madrasah tanpa server GPU mahal.',
      costs: {
        softwareCost: 'Rp 0 (Open Source MIT)',
        modelCost: 'Rp 0 (Open Weights)',
        apiCost: 'Rp 0 (Zero cloud tokens)',
        hostingCost: 'Rp 0 (Server lokal madrasah)',
        storageCost: 'Rp 0 (~1.2 GB flash drive)',
        maintenanceCost: 'Rendah (Pembaruan berkala)',
        operationalCost: 'Rp 0 / bulan'
      },
      scoring: {
        costScore: 96,
        securityScore: 95,
        lockInScore: 98,
        maturityScore: 82,
        relevanceScore: 92,
        aggregateScore: 92.6
      },
      decision: 'TEST',
      decisionRationale: 'Sangat menjanjikan untuk asisten offline masa depan. Sedang dalam tahap benchmarking konsumsi memori pada spek minimum.',
      evaluatedAt: '2026-08-14'
    },
    {
      id: 'TECH-004',
      name: 'SaaS Cloud Automation Push Service (Proprietary Tier)',
      category: 'Free Tier',
      license: 'Proprietary Freemiun',
      description: 'Layanan notifikasi cloud yang menawarkan 10.000 pesan gratis lalu mengenakan tarif per pesan setelah kuota terlewati.',
      costs: {
        softwareCost: 'Rp 0 awal (Freemium trap)',
        modelCost: 'Rp 0',
        apiCost: 'Rp 150/notif setelah batas limit',
        hostingCost: 'Cloud Lock-in',
        storageCost: 'Berbayar setelah 1GB',
        maintenanceCost: 'Tinggi (Tergantung vendor API)',
        operationalCost: 'Tidak terprediksi / fluktuatif'
      },
      scoring: {
        costScore: 35,
        securityScore: 50,
        lockInScore: 20,
        maturityScore: 85,
        relevanceScore: 30,
        aggregateScore: 44.0
      },
      decision: 'REJECT',
      decisionRationale: 'Ditolak mutlak karena melanggar prinsip No Vendor Lock-in dan Invarian Anti-Biaya Tersembunyi TADE.',
      evaluatedAt: '2026-08-12'
    },
    {
      id: 'TECH-005',
      name: 'Open Source Merkle Audit Tree Library',
      category: 'Open Source',
      license: 'MIT License',
      description: 'Implementasi struktur data Merkle DAG murni TypeScript untuk memvalidasi integritas log tanpa dependensi C-binding.',
      costs: {
        softwareCost: 'Rp 0 (MIT)',
        modelCost: 'Rp 0',
        apiCost: 'Rp 0',
        hostingCost: 'Rp 0',
        storageCost: 'Rp 0',
        maintenanceCost: 'Nol',
        operationalCost: 'Rp 0'
      },
      scoring: {
        costScore: 100,
        securityScore: 100,
        lockInScore: 100,
        maturityScore: 95,
        relevanceScore: 98,
        aggregateScore: 98.6
      },
      decision: 'ADOPT',
      decisionRationale: 'Telah terintegrasi dalam Immutable Regulatory Ledger (R663) untuk rantai validasi harian laporan madrasah.',
      evaluatedAt: '2026-08-10'
    }
  ];

  public static getInstance(): FreeTechnologyRadar {
    if (!FreeTechnologyRadar.instance) {
      FreeTechnologyRadar.instance = new FreeTechnologyRadar();
    }
    return FreeTechnologyRadar.instance;
  }

  public getRadarItems(): FreeTechnologyItem[] {
    return [...this.items];
  }

  public getSummary() {
    return {
      totalEvaluated: this.items.length,
      adopted: this.items.filter(i => i.decision === 'ADOPT').length,
      testing: this.items.filter(i => i.decision === 'TEST').length,
      watching: this.items.filter(i => i.decision === 'WATCH').length,
      rejected: this.items.filter(i => i.decision === 'REJECT').length,
      freeFirstCompliance: '100% (Strict Anti-Vendor Lock-in)'
    };
  }
}
