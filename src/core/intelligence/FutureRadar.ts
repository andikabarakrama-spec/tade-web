export interface FutureRadarItem {
  id: string;
  trend: string;
  timeHorizon: '6 Bulan' | '12 Bulan' | '18 Bulan' | '24 Bulan';
  focusArea: 
    | 'AI Agents' 
    | 'Multi-Agent' 
    | 'Sovereign AI' 
    | 'Cybersecurity' 
    | 'Education Tech' 
    | 'Digital Identity' 
    | 'Offline-First' 
    | 'Local AI' 
    | 'Autonomous Administration' 
    | 'Open-Source Infrastructure';
  evidence: string;
  maturity: 'EMERGING' | 'GROWING' | 'STABLE' | 'STANDARDIZED';
  relevanceToTADE: string;
  impactAssessment: string;
  recommendation: string;
  status: 'WATCH' | 'RESERVED' | 'EXPERIMENTAL' | 'CORE CANDIDATE' | 'REJECT';
  evaluatedDate: string;
}

export class FutureRadar {
  private static instance: FutureRadar;
  private items: FutureRadarItem[] = [
    {
      id: 'FUTR-2026-001',
      trend: 'WebAssembly (Wasm) Sandboxed Multi-Agent Execution',
      timeHorizon: '12 Bulan',
      focusArea: 'Autonomous Administration',
      evidence: 'Standar Wasm Component Model (WASI 0.3) kini mendukung isolasi proses agen dengan proteksi memori ketat dan startup instan (<5ms).',
      maturity: 'GROWING',
      relevanceToTADE: 'Dapat menjadi sandbox masa depan bagi eksekusi tugas administratif asisten tanpa risiko kebocoran memori atau loop tak terbatas.',
      impactAssessment: 'Tinggi untuk keamanan jangka panjang eksekutor administratif; risiko nol bagi stabilitas aplikasi saat ini.',
      recommendation: 'Tetapkan status RESERVED. Pantau kematangan ekosistem TypeScript-to-Wasm tanpa mengubah kode produksi.',
      status: 'RESERVED',
      evaluatedDate: '2026-08-16'
    },
    {
      id: 'FUTR-2026-002',
      trend: 'Identitas Digital Berdaulat (W3C DID & Verifiable Credentials) untuk Ijazah Madrasah',
      timeHorizon: '18 Bulan',
      focusArea: 'Digital Identity',
      evidence: 'Standar ijazah digital terverifikasi berbasis kriptografi publik tanpa bergantung pada server verifikasi pihak ketiga.',
      maturity: 'STANDARDIZED',
      relevanceToTADE: 'Memungkinkan lulusan santri memiliki ijazah dan transkrip digital yang dapat diverifikasi siapa saja selamanya secara offline.',
      impactAssessment: 'Sangat positif untuk reputasi madrasah dan kedaulatan data santri seumur hidup.',
      recommendation: 'Jadikan CORE CANDIDATE untuk roadmap evaluasi kurikulum masa depan setelah verifikasi Founder.',
      status: 'CORE CANDIDATE',
      evaluatedDate: '2026-08-15'
    },
    {
      id: 'FUTR-2026-003',
      trend: 'Sovereign On-Device Speech-to-Text untuk Notulensi Rapat Yayasan',
      timeHorizon: '6 Bulan',
      focusArea: 'Local AI',
      evidence: 'Pustaka transkripsi suara open-weight berukuran <40MB mampu berjalan langsung di peramban dengan akurasi 94% untuk Bahasa Indonesia.',
      maturity: 'GROWING',
      relevanceToTADE: 'Membantu Kepala Madrasah dan Notulis membuat berita acara rapat tanpa mengirim rekaman suara ke cloud eksternal.',
      impactAssessment: 'Kerahasiaan rapat terjamin 100%; bebas dari pelanggaran UU PDP.',
      recommendation: 'Eksperimen dalam lingkungan sandbox terisolasi pada War Room simulasi tanpa mengaktifkan izin mikrofon sembarangan.',
      status: 'EXPERIMENTAL',
      evaluatedDate: '2026-08-14'
    },
    {
      id: 'FUTR-2026-004',
      trend: 'Proprietary Cloud-Locked Autonomous Orchestrator Frameworks',
      timeHorizon: '12 Bulan',
      focusArea: 'AI Agents',
      evidence: 'Berbagai vendor cloud meluncurkan orkestrator yang mewajibkan langganan API berbayar per agent-execution step.',
      maturity: 'EMERGING',
      relevanceToTADE: 'Berlawanan 180 derajat dengan prinsip kemandirian dan efisiensi biaya TADE.',
      impactAssessment: 'Dapat menimbulkan beban biaya berulang dan hilangnya kedaulatan sistem.',
      recommendation: 'Tolak (REJECT) mutlak dari pertimbangan arsitektur TADE.',
      status: 'REJECT',
      evaluatedDate: '2026-08-12'
    },
    {
      id: 'FUTR-2026-005',
      trend: 'Causal Time-Clock CRDTs untuk Sinkronisasi P2P Antar-Madrasah',
      timeHorizon: '24 Bulan',
      focusArea: 'Offline-First',
      evidence: 'Struktur data bebas konflik untuk sinkronisasi inventaris antar cabang madrasah dalam satu yayasan secara mesh Wi-Fi lokal.',
      maturity: 'GROWING',
      relevanceToTADE: 'Memungkinkan transfer data siswa antar madrasah binaan tanpa server pusat.',
      impactAssessment: 'Potensi ekspansi jaringan madrasah mandiri.',
      recommendation: 'Pertahankan dalam radar pengawasan (WATCH) hingga standar implementasi web stabil.',
      status: 'WATCH',
      evaluatedDate: '2026-08-10'
    }
  ];

  public static getInstance(): FutureRadar {
    if (!FutureRadar.instance) {
      FutureRadar.instance = new FutureRadar();
    }
    return FutureRadar.instance;
  }

  public getFutureItems(): FutureRadarItem[] {
    return [...this.items];
  }

  public getSummary() {
    return {
      totalHorizonItems: this.items.length,
      coreCandidates: this.items.filter(i => i.status === 'CORE CANDIDATE').length,
      reserved: this.items.filter(i => i.status === 'RESERVED').length,
      experimental: this.items.filter(i => i.status === 'EXPERIMENTAL').length,
      watching: this.items.filter(i => i.status === 'WATCH').length,
      rejected: this.items.filter(i => i.status === 'REJECT').length,
      autoImplementationBlocked: true
    };
  }
}
