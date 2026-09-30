/**
 * TADE RC79 — R615: SOVEREIGN CIVIL SERVICE REGISTRY & R616: DIGITAL EMPLOYEE WORKFORCE
 * Registry and state manager for all autonomous digital civil servants across 10 Sectoral Ministries.
 */

export type EmployeeStatus = 'ACTIVE' | 'IDLE' | 'ASSISTING' | 'RECOVERING' | 'SUSPENDED';
export type CivilRank = 'PRATAMA' | 'MADYA' | 'UTAMA' | 'AHLI_SPESIALIS';

export interface DigitalEmployee {
  nip: string; // Nomor Induk Pegawai Digital (e.g., NIP-MIN01-001)
  name: string;
  ministryCode: string;
  ministryName: string;
  parentAssistantId: string;
  parentAssistantName: string;
  jobTitle: string;
  jobDescription: string;
  rank: CivilRank;
  status: EmployeeStatus;
  workloadScore: number; // 0 - 100%
  completedTasksToday: number;
  assignedMicroAgentIds: string[];
  lastHeartbeat: string;
  efficiencyRating: number; // e.g. 99.8%
}

class CivilServiceRegistryCore {
  private static instance: CivilServiceRegistryCore | null = null;
  private employees: DigitalEmployee[] = [];

  private constructor() {
    this.bootstrapCivilService();
  }

  public static getInstance(): CivilServiceRegistryCore {
    if (!CivilServiceRegistryCore.instance) {
      CivilServiceRegistryCore.instance = new CivilServiceRegistryCore();
    }
    return CivilServiceRegistryCore.instance;
  }

  private bootstrapCivilService(): void {
    const now = new Date().toISOString();
    this.employees = [
      // Kementerian Pendidikan (MIN_PENDIDIKAN)
      {
        nip: 'NIP-MIN01-001',
        name: 'Pegawai Jadwal Pelajaran & Roster',
        ministryCode: 'MIN_PENDIDIKAN',
        ministryName: 'Kementerian Pendidikan & Kurikulum Pesantren',
        parentAssistantId: 'AST-EDU-01',
        parentAssistantName: 'Asisten Guru & RPP',
        jobTitle: 'Pranata Penjadwalan Belajar Mengajar',
        jobDescription: 'Mengatur alokasi jam ustadz, menghindari tabrakan jadwal kelas, dan sinkronisasi bel madrasah.',
        rank: 'MADYA',
        status: 'ACTIVE',
        workloadScore: 48,
        completedTasksToday: 64,
        assignedMicroAgentIds: ['ROSTER_OPTIMIZER_AGENT', 'SCHEDULE_CONFLICT_CHECKER'],
        lastHeartbeat: now,
        efficiencyRating: 99.9
      },
      {
        nip: 'NIP-MIN01-002',
        name: 'Pegawai Absensi & Kehadiran Santri',
        ministryCode: 'MIN_PENDIDIKAN',
        ministryName: 'Kementerian Pendidikan & Kurikulum Pesantren',
        parentAssistantId: 'AST-EDU-04',
        parentAssistantName: 'Asisten Kehadiran & Jam Belajar',
        jobTitle: 'Pengelola Data Presensi & Izin Sakit',
        jobDescription: 'Merekap presensi harian, QR check-in asrama, rekapitulasi surat izin ustadz.',
        rank: 'PRATAMA',
        status: 'ACTIVE',
        workloadScore: 62,
        completedTasksToday: 310,
        assignedMicroAgentIds: ['ATTENDANCE_SCANNER_AGENT', 'SICK_LEAVE_PROCESSOR'],
        lastHeartbeat: now,
        efficiencyRating: 99.8
      },
      {
        nip: 'NIP-MIN01-003',
        name: 'Pegawai Rapor & Kalkulasi Nilai',
        ministryCode: 'MIN_PENDIDIKAN',
        ministryName: 'Kementerian Pendidikan & Kurikulum Pesantren',
        parentAssistantId: 'AST-EDU-03',
        parentAssistantName: 'Asisten Penilaian & Raport',
        jobTitle: 'Analis Nilai Formatif & Sumatif',
        jobDescription: 'Pengolahan ledger nilai, pembobotan ujian tengah semester, pencetakan PDF e-raport.',
        rank: 'UTAMA',
        status: 'ACTIVE',
        workloadScore: 35,
        completedTasksToday: 180,
        assignedMicroAgentIds: ['RAPORT_AUTO_CALCULATOR', 'GRADE_CURVE_NORMALIZER'],
        lastHeartbeat: now,
        efficiencyRating: 100.0
      },
      {
        nip: 'NIP-MIN01-004',
        name: 'Pegawai Sentra Tahfidz & Tasmi',
        ministryCode: 'MIN_PENDIDIKAN',
        ministryName: 'Kementerian Pendidikan & Kurikulum Pesantren',
        parentAssistantId: 'AST-EDU-02',
        parentAssistantName: 'Asisten Kurikulum',
        jobTitle: 'Petugas Registrasi & Ujian Tahfidz',
        jobDescription: 'Pencatatan setoran hafalan santri, validasi target per juz, dan sertifikat syahadah.',
        rank: 'AHLI_SPESIALIS',
        status: 'ACTIVE',
        workloadScore: 55,
        completedTasksToday: 95,
        assignedMicroAgentIds: ['TAHFIDZ_TARGET_TRACKER', 'SYAHADAH_CERT_GENERATOR'],
        lastHeartbeat: now,
        efficiencyRating: 99.7
      },

      // Kementerian Keuangan (MIN_KEUANGAN)
      {
        nip: 'NIP-MIN03-001',
        name: 'Pegawai Tagihan & Virtual Account SPP',
        ministryCode: 'MIN_KEUANGAN',
        ministryName: 'Kementerian Keuangan & Perbendaharaan',
        parentAssistantId: 'AST-FIN-01',
        parentAssistantName: 'Asisten Kas & SPP',
        jobTitle: 'Petugas Billing & Billing Dispatcher',
        jobDescription: 'Generate invoice SPP bulanan, aktivasi VA Bank Syariah, rekonsiliasi gateway.',
        rank: 'UTAMA',
        status: 'ACTIVE',
        workloadScore: 70,
        completedTasksToday: 420,
        assignedMicroAgentIds: ['VA_RECONCILER_AGENT', 'INVOICE_DISPATCH_AGENT'],
        lastHeartbeat: now,
        efficiencyRating: 100.0
      },
      {
        nip: 'NIP-MIN03-002',
        name: 'Pegawai Buku Kas & Jurnal Pengeluaran',
        ministryCode: 'MIN_KEUANGAN',
        ministryName: 'Kementerian Keuangan & Perbendaharaan',
        parentAssistantId: 'AST-FIN-02',
        parentAssistantName: 'Asisten Ledger & Jurnal',
        jobTitle: 'Penata Buku Jurnal & Cashflow',
        jobDescription: 'Pencatatan mutasi kas operasional dapur pesantren, logistik, dan slip gaji asatidz.',
        rank: 'MADYA',
        status: 'ACTIVE',
        workloadScore: 40,
        completedTasksToday: 130,
        assignedMicroAgentIds: ['JOURNAL_AUTO_POSTER', 'EXPENSE_AUDITOR_AGENT'],
        lastHeartbeat: now,
        efficiencyRating: 99.9
      },

      // Kementerian Administrasi (MIN_ADMINISTRASI)
      {
        nip: 'NIP-MIN02-001',
        name: 'Pegawai Penomoran & Registrasi Surat',
        ministryCode: 'MIN_ADMINISTRASI',
        ministryName: 'Kementerian Administrasi & Tata Usaha',
        parentAssistantId: 'AST-ADM-01',
        parentAssistantName: 'Asisten Surat & Disposisi',
        jobTitle: 'Arsiparis Penomoran Surat Masuk & Keluar',
        jobDescription: 'Pemberian nomor baku ISO dinas madrasah dan routing disposisi kepala sekolah.',
        rank: 'PRATAMA',
        status: 'ACTIVE',
        workloadScore: 30,
        completedTasksToday: 88,
        assignedMicroAgentIds: ['SURAT_NUMBERING_AGENT', 'DISPOSISI_ROUTER'],
        lastHeartbeat: now,
        efficiencyRating: 99.8
      },
      {
        nip: 'NIP-MIN02-002',
        name: 'Pegawai Legalisir Digital & Stempel QR',
        ministryCode: 'MIN_ADMINISTRASI',
        ministryName: 'Kementerian Administrasi & Tata Usaha',
        parentAssistantId: 'AST-ADM-03',
        parentAssistantName: 'Asisten Validasi & Legalisir',
        jobTitle: 'Verifikator Dokumen & Stempel Elektronik',
        jobDescription: 'Penyematan stempel QR HMAC-SHA256 pada surat keterangan aktif dan ijazah santri.',
        rank: 'AHLI_SPESIALIS',
        status: 'ACTIVE',
        workloadScore: 25,
        completedTasksToday: 160,
        assignedMicroAgentIds: ['QR_LEGALISIR_AGENT', 'DIGITAL_STAMP_SEALER'],
        lastHeartbeat: now,
        efficiencyRating: 100.0
      },

      // Kementerian PPDB (MIN_PPDB)
      {
        nip: 'NIP-MIN04-001',
        name: 'Pegawai Verifikasi Berkas Calon Santri',
        ministryCode: 'MIN_PPDB',
        ministryName: 'Kementerian PPDB & Penerimaan Santri',
        parentAssistantId: 'AST-PPDB-02',
        parentAssistantName: 'Asisten Verifikasi Berkas',
        jobTitle: 'Pemeriksa Kelengkapan Dokumen PPDB',
        jobDescription: 'Scanning OCR akta kelahiran, kartu keluarga, dan surat keterangan sehat calon santri.',
        rank: 'MADYA',
        status: 'ACTIVE',
        workloadScore: 50,
        completedTasksToday: 74,
        assignedMicroAgentIds: ['DOCUMENT_OCR_VERIFIER', 'APPLICANT_VALIDATOR'],
        lastHeartbeat: now,
        efficiencyRating: 99.6
      },

      // Kementerian Komunikasi (MIN_KOMUNIKASI)
      {
        nip: 'NIP-MIN05-001',
        name: 'Pegawai Warta Pesantren & Gateway WA',
        ministryCode: 'MIN_KOMUNIKASI',
        ministryName: 'Kementerian Komunikasi & Humas Yayasan',
        parentAssistantId: 'AST-KOM-01',
        parentAssistantName: 'Asisten Siaran & Notifikasi',
        jobTitle: 'Operator Pengiriman Notifikasi Terjadwal',
        jobDescription: 'Pengiriman pesan massal terkelola ke wali santri mengenai perkembangan dan maklumat.',
        rank: 'PRATAMA',
        status: 'ACTIVE',
        workloadScore: 68,
        completedTasksToday: 620,
        assignedMicroAgentIds: ['BROADCAST_QUEUE_AGENT', 'WHATSAPP_GATEWAY_AGENT'],
        lastHeartbeat: now,
        efficiencyRating: 99.9
      },

      // Kementerian Banking Office (MIN_BANKING_OFFICE)
      {
        nip: 'NIP-MIN10-001',
        name: 'Pegawai Transaksi Kantin & Smart Card',
        ministryCode: 'MIN_BANKING_OFFICE',
        ministryName: 'Kementerian Banking Office & FinTech Syariah',
        parentAssistantId: 'AST-BNK-01',
        parentAssistantName: 'Asisten Kasir & Kantin Syariah',
        jobTitle: 'Kliring Transaksi Cashless Tertutup',
        jobDescription: 'Pemotongan saldo kartu santri untuk pembelian kitab, seragam, dan makanan kantin.',
        rank: 'UTAMA',
        status: 'ACTIVE',
        workloadScore: 78,
        completedTasksToday: 890,
        assignedMicroAgentIds: ['CASHLESS_POS_AGENT', 'CARD_BALANCE_DEDUCTOR'],
        lastHeartbeat: now,
        efficiencyRating: 100.0
      }
    ];
  }

  public getEmployees(): DigitalEmployee[] {
    return this.employees;
  }

  public getEmployeesByMinistry(ministryCode: string): DigitalEmployee[] {
    return this.employees.filter(e => e.ministryCode === ministryCode);
  }

  public setEmployeeStatus(nip: string, status: EmployeeStatus): boolean {
    const emp = this.employees.find(e => e.nip === nip);
    if (emp) {
      emp.status = status;
      emp.lastHeartbeat = new Date().toISOString();
      return true;
    }
    return false;
  }

  public pulseAllEmployees(): void {
    const now = new Date().toISOString();
    this.employees.forEach(emp => {
      if (emp.status === 'ACTIVE') {
        emp.completedTasksToday += Math.floor(Math.random() * 3) + 1;
        emp.lastHeartbeat = now;
      }
    });
  }
}

export const civilServiceRegistry = CivilServiceRegistryCore.getInstance();
