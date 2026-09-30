/**
 * TADE RC78 — R606: PRIME MINISTER CABINET ENGINE & R607: MINISTER ASSISTANT NETWORK
 * AI Asy operates as the Prime Minister orchestrating 10 Sectoral Ministries
 * with dedicated Minister Automated Assistants.
 */

export interface MinisterAssistant {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'BUSY' | 'IDLE';
  tasksCompletedToday: number;
  activeMicroAgents: string[];
}

export interface MinistryCabinet {
  id: string;
  code: string;
  ministryName: string;
  ministerTitle: string;
  assignedDomain: string;
  healthScore: number;
  operationalStatus: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE';
  assistants: MinisterAssistant[];
  primaryDirectives: string[];
}

export interface CabinetMeetingReport {
  timestamp: string;
  agenda: string;
  primeMinisterNotes: string;
  cabinetConsensus: 'UNANIMOUS_PASS' | 'CONDITIONAL_APPROVAL' | 'REFERRED_TO_SOVEREIGN';
}

class PrimeMinisterCabinetCore {
  private static instance: PrimeMinisterCabinetCore | null = null;
  private ministries: MinistryCabinet[] = [];
  private cabinetReports: CabinetMeetingReport[] = [];

  private constructor() {
    this.bootstrapCabinet();
  }

  public static getInstance(): PrimeMinisterCabinetCore {
    if (!PrimeMinisterCabinetCore.instance) {
      PrimeMinisterCabinetCore.instance = new PrimeMinisterCabinetCore();
    }
    return PrimeMinisterCabinetCore.instance;
  }

  private bootstrapCabinet(): void {
    this.ministries = [
      {
        id: 'MIN-01',
        code: 'MIN_PENDIDIKAN',
        ministryName: 'Kementerian Pendidikan & Kurikulum Pesantren',
        ministerTitle: 'Menteri Pendidikan (AI Asy Edu)',
        assignedDomain: 'Akademik, Silabus, Ujian, Raport, Tahfidz & Kepesantrenan',
        healthScore: 99.4,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Penyelarasan kurikulum Kemenag dengan Dirosah Islamiyah', 'Evaluasi target hafalan juz 30'],
        assistants: [
          { id: 'AST-EDU-01', name: 'Asisten Guru & RPP', role: 'Validasi modul ajar & sintesis RPP', status: 'ACTIVE', tasksCompletedToday: 142, activeMicroAgents: ['RPP_GENERATOR_AGENT', 'SYLLABUS_VALIDATOR'] },
          { id: 'AST-EDU-02', name: 'Asisten Kurikulum', role: 'Pemetaan capaian pembelajaran kurikulum merdeka', status: 'ACTIVE', tasksCompletedToday: 89, activeMicroAgents: ['CAPAIAN_TRACKER_AGENT'] },
          { id: 'AST-EDU-03', name: 'Asisten Penilaian & Raport', role: 'Kalkulasi bobot nilai formatif & sumatif', status: 'ACTIVE', tasksCompletedToday: 310, activeMicroAgents: ['RAPORT_AUTO_CALCULATOR'] },
          { id: 'AST-EDU-04', name: 'Asisten Kehadiran & Jam Belajar', role: 'Rekap presensi harian & deteksi anomali absensi', status: 'ACTIVE', tasksCompletedToday: 420, activeMicroAgents: ['ATTENDANCE_SCANNER_AGENT'] }
        ]
      },
      {
        id: 'MIN-02',
        code: 'MIN_ADMINISTRASI',
        ministryName: 'Kementerian Administrasi & Tata Usaha',
        ministerTitle: 'Menteri Administrasi',
        assignedDomain: 'Surat Menyurat, Kearsipan Digital, Legalisir & Validasi Dokumen',
        healthScore: 98.9,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Digitalisasi berkas santri 100% cloud-first', 'Penerbitan nomor surat otomatis berbasis ISO'],
        assistants: [
          { id: 'AST-ADM-01', name: 'Asisten Surat & Disposisi', role: 'Auto penomoran surat resmi & rute disposisi', status: 'ACTIVE', tasksCompletedToday: 76, activeMicroAgents: ['SURAT_NUMBERING_AGENT', 'DISPOSISI_ROUTER'] },
          { id: 'AST-ADM-02', name: 'Asisten Arsip Digital', role: 'Indexing kearsipan digital & deduplikasi berkas', status: 'ACTIVE', tasksCompletedToday: 215, activeMicroAgents: ['ARCHIVE_INDEXER_AGENT'] },
          { id: 'AST-ADM-03', name: 'Asisten Validasi & Legalisir', role: 'Verifikasi tanda tangan digital & stempel QR', status: 'ACTIVE', tasksCompletedToday: 184, activeMicroAgents: ['QR_LEGALISIR_AGENT'] }
        ]
      },
      {
        id: 'MIN-03',
        code: 'MIN_KEUANGAN',
        ministryName: 'Kementerian Keuangan & Perbendaharaan',
        ministerTitle: 'Menteri Keuangan',
        assignedDomain: 'SPP Santri, Kas Operasional, Penggajian Guru, Anggaran Yayasan',
        healthScore: 99.8,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Rekonsiliasi perbankan harian otomatis', 'Zero leakage & audit trail transaksi mutlak'],
        assistants: [
          { id: 'AST-FIN-01', name: 'Asisten Kas & SPP', role: 'Pencatatan pembayaran tagihan & gateway VA', status: 'ACTIVE', tasksCompletedToday: 512, activeMicroAgents: ['VA_RECONCILER_AGENT', 'SPP_RECEIPT_AGENT'] },
          { id: 'AST-FIN-02', name: 'Asisten Ledger & Jurnal', role: 'Double-entry bookkeeping & posting otomatis', status: 'ACTIVE', tasksCompletedToday: 388, activeMicroAgents: ['JOURNAL_AUTO_POSTER'] },
          { id: 'AST-FIN-03', name: 'Asisten Rekonsiliasi Bank', role: 'Pencocokan rekening koran dengan ledger internal', status: 'ACTIVE', tasksCompletedToday: 95, activeMicroAgents: ['BANK_SCRAPER_RECON_AGENT'] }
        ]
      },
      {
        id: 'MIN-04',
        code: 'MIN_PPDB',
        ministryName: 'Kementerian PPDB & Penerimaan Santri',
        ministerTitle: 'Menteri PPDB & Seleksi',
        assignedDomain: 'Registrasi Calon Santri, Ujian Masuk, Wawancara, Penempatan Kamar',
        healthScore: 99.1,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Monitoring kuota asrama real-time', 'Sistem seleksi berbasis kecocokan bakat & hafalan'],
        assistants: [
          { id: 'AST-PPDB-01', name: 'Asisten Seleksi & Placement', role: 'Scoring tes potensi akademik & penempatan kelas', status: 'ACTIVE', tasksCompletedToday: 64, activeMicroAgents: ['SELECTION_SCORER_AGENT'] },
          { id: 'AST-PPDB-02', name: 'Asisten Verifikasi Berkas', role: 'Validasi KK, Akta Kelahiran, dan Ijazah calon santri', status: 'ACTIVE', tasksCompletedToday: 110, activeMicroAgents: ['DOCUMENT_OCR_VERIFIER'] }
        ]
      },
      {
        id: 'MIN-05',
        code: 'MIN_KOMUNIKASI',
        ministryName: 'Kementerian Komunikasi & Humas Yayasan',
        ministerTitle: 'Menteri Komunikasi & Hubungan Santri-Wali',
        assignedDomain: 'Broadcast WhatsApp, Warta Pesantren, Portal Wali Santri',
        healthScore: 99.6,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Pengiriman info berkala kegiatan santri', 'Transparansi berita yayasan bebas hoax'],
        assistants: [
          { id: 'AST-KOM-01', name: 'Asisten Siaran & Notifikasi', role: 'Pengiriman pesan massal terkelola & gateway WA', status: 'ACTIVE', tasksCompletedToday: 830, activeMicroAgents: ['BROADCAST_QUEUE_AGENT'] },
          { id: 'AST-KOM-02', name: 'Asisten Portal Wali Santri', role: 'Penyajian ringkasan perkembangan mingguan anak', status: 'ACTIVE', tasksCompletedToday: 410, activeMicroAgents: ['PARENT_DIGEST_AGENT'] }
        ]
      },
      {
        id: 'MIN-06',
        code: 'MIN_DIGITAL_TWIN',
        ministryName: 'Kementerian Digital Twin & Simulasi',
        ministerTitle: 'Menteri Digital Twin',
        assignedDomain: 'Simulasi Kapasitas Asrama, Beban Infrastruktur, Model Prediksi Santri',
        healthScore: 98.7,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Stress testing kapasitas server sebelum ujian akbar', 'Simulasi skenario darurat gempa & kebakaran'],
        assistants: [
          { id: 'AST-DT-01', name: 'Asisten Simulasi Kapasitas', role: 'Modelling skenario penerimaan santri vs daya tampung', status: 'ACTIVE', tasksCompletedToday: 45, activeMicroAgents: ['CAPACITY_SIMULATOR_AGENT'] }
        ]
      },
      {
        id: 'MIN-07',
        code: 'MIN_KNOWLEDGE_VAULT',
        ministryName: 'Kementerian Knowledge Vault & Khazanah Kitab',
        ministerTitle: 'Menteri Khazanah & Riset Pesantren',
        assignedDomain: 'Perpustakaan Digital, Digitalisasi Manuskrip Kuning, Rujukan Fatwa',
        healthScore: 99.9,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Penyediaan indeks kitab kuning searchable', 'Koleksi karya ilmiah ustadz dan santri'],
        assistants: [
          { id: 'AST-KV-01', name: 'Asisten Katalog Kitab', role: 'Indexing teks Arab & terjemahan matan', status: 'ACTIVE', tasksCompletedToday: 120, activeMicroAgents: ['KITAB_INDEXER_AGENT'] }
        ]
      },
      {
        id: 'MIN-08',
        code: 'MIN_SMART_OFFICE',
        ministryName: 'Kementerian Smart Office & Efisiensi Kerja',
        ministerTitle: 'Menteri Smart Office',
        assignedDomain: 'Automasi Tugas Rutin, Inventaris Aset Madrasah, Pengadaan Barang',
        healthScore: 99.0,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Pencegahan pemborosan ATK & utilitas', 'Maintenance inventaris gedung terencana'],
        assistants: [
          { id: 'AST-SO-01', name: 'Asisten Inventaris & Aset', role: 'Tracking barcode aset & jadwal servis berkala', status: 'ACTIVE', tasksCompletedToday: 55, activeMicroAgents: ['ASSET_TRACKER_AGENT'] }
        ]
      },
      {
        id: 'MIN-09',
        code: 'MIN_GOV_OFFICE',
        ministryName: 'Kementerian Governance & Hubungan Eksternal',
        ministerTitle: 'Menteri Governance',
        assignedDomain: 'Akreditasi Kemenag/Kemdikbud, Izin Operasional, Kepatuhan Regulasi',
        healthScore: 100.0,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Kepatuhan 100% standar BAN-PDM & Kemenag RI', 'Penyusunan bukti fisik akreditasi otomatis'],
        assistants: [
          { id: 'AST-GOV-01', name: 'Asisten Akreditasi & EMIS', role: 'Sinkronisasi data ke EMIS & Dapodik Kemenag', status: 'ACTIVE', tasksCompletedToday: 38, activeMicroAgents: ['EMIS_SYNC_AGENT'] }
        ]
      },
      {
        id: 'MIN-10',
        code: 'MIN_BANKING_OFFICE',
        ministryName: 'Kementerian Banking Office & FinTech Syariah',
        ministerTitle: 'Menteri Perbankan Syariah',
        assignedDomain: 'Integrasi Bank Syariah, QRIS Santri, Tabungan Santri, Kantin Cashless',
        healthScore: 99.7,
        operationalStatus: 'OPTIMAL',
        primaryDirectives: ['Ekosistem cashless tertutup berbasis kartu santri smart', 'Bebas bunga & transparansi akad syariah'],
        assistants: [
          { id: 'AST-BNK-01', name: 'Asisten Kasir & Kantin Syariah', role: 'Transaksi POS kantin santri real-time', status: 'ACTIVE', tasksCompletedToday: 670, activeMicroAgents: ['CASHLESS_POS_AGENT'] },
          { id: 'AST-BNK-02', name: 'Asisten Tabungan Santri', role: 'Pengelolaan saldo harian santri & limit jajan harian', status: 'ACTIVE', tasksCompletedToday: 490, activeMicroAgents: ['POCKET_LIMIT_AGENT'] }
        ]
      }
    ];

    this.cabinetReports = [
      {
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        agenda: 'Sidang Kabinet Terpadu: Penyesuaian Anggaran & Kesiapan Semester Baru',
        primeMinisterNotes: 'Seluruh kementerian beroperasi 99.5%+ optimal. Sinergi antara Pendidikan, Keuangan, dan Administrasi berjalan harmonis.',
        cabinetConsensus: 'UNANIMOUS_PASS'
      }
    ];
  }

  public getMinistries(): MinistryCabinet[] {
    return this.ministries;
  }

  public getCabinetReports(): CabinetMeetingReport[] {
    return this.cabinetReports;
  }

  public getTotalActiveAssistants(): number {
    return this.ministries.reduce((acc, m) => acc + m.assistants.length, 0);
  }

  public getTotalMicroAgentsDeployed(): number {
    return this.ministries.reduce(
      (acc, m) => acc + m.assistants.reduce((a, ast) => a + ast.activeMicroAgents.length, 0),
      0
    );
  }
}

export const primeMinisterCabinet = PrimeMinisterCabinetCore.getInstance();
