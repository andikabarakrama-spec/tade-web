/**
 * TADE RC100 — R821, R823, R824, R825
 * Digital Government Core (Struktur Pemerintahan Digital Tri-Sovereign)
 * 
 * 3 Pemerintahan Berdaulat:
 * 1. Pemerintahan Asy (Pelayanan Publik & Kreativitas Santri)
 * 2. Pemerintahan Guardian (Keamanan, Integritas, Ring-0)
 * 3. Pemerintahan Hermes (Pemulihan & Kontinuitas DORMANT_SAFE)
 */

export type SovereignDomain = 'ASY_PELAYANAN' | 'GUARDIAN_KEAMANAN' | 'HERMES_PEMULIHAN';

export interface DigitalCivilServant {
  id: string;
  name: string;
  roleTitle: string;
  specialization: string;
  status: 'ONLINE' | 'STANDBY' | 'DORMANT_SAFE';
  activeTasks: number;
  uptimePercent: number;
  avatarIcon: string;
}

export interface DigitalMinistry {
  id: string;
  code: string;
  name: string;
  domain: SovereignDomain;
  ministerName: string;
  mandateDescription: string;
  directoratesCount: number;
  civilServants: DigitalCivilServant[];
  healthScore: number;
  statusText: string;
  isReadOnly: boolean;
}

export interface SovereignGovernment {
  domain: SovereignDomain;
  title: string;
  palaceName: string;
  presidentName: string;
  presidentRole: string;
  slogan: string;
  ministries: DigitalMinistry[];
  totalCivilServants: number;
  overallHealth: number;
  badgeColor: string;
}

export interface GuardianTroopUnit {
  id: string;
  unitName: string;
  battalion: string;
  mandate: string;
  readinessLevel: 'PATROLLING_BACKGROUND' | 'RING0_STANDBY' | 'ELEVATED';
  shieldIntegrityPercent: number;
  stealthMode: boolean;
}

export class DigitalGovernmentCore {
  private static instance: DigitalGovernmentCore;
  private listeners: Array<() => void> = [];

  private governments: Record<SovereignDomain, SovereignGovernment>;
  private guardianTroops: GuardianTroopUnit[];

  private constructor() {
    this.governments = {
      ASY_PELAYANAN: {
        domain: 'ASY_PELAYANAN',
        title: 'Pemerintahan Digital Asy',
        palaceName: 'Istana Pelayanan Asy',
        presidentName: 'Presiden Asy (Mascot Sovereign)',
        presidentRole: 'Kepala Pelayanan & Kebahagiaan Santri',
        slogan: 'Melayani dengan Ceria, Cepat, dan Penuh Akhlakul Karimah',
        badgeColor: 'emerald',
        totalCivilServants: 28,
        overallHealth: 99.8,
        ministries: [
          {
            id: 'min-asy-foto',
            code: 'KEMEN-FOTO',
            name: 'Kementerian Foto & Dokumentasi',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Foto Asy',
            mandateDescription: 'Memproses optimasi optik foto santri secara non-generatif dan kurasi album kegiatan.',
            directoratesCount: 3,
            healthScore: 100,
            statusText: '8-Stage Optical Darkroom Aktif',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-f1', name: 'Petugas Koreksi Cahaya', roleTitle: 'Optical Technician', specialization: 'White balance & Shadow recovery', status: 'ONLINE', activeTasks: 4, uptimePercent: 100, avatarIcon: 'Camera' },
              { id: 'cs-f2', name: 'Petugas WebP Optimizer', roleTitle: 'Compression Specialist', specialization: 'Lossless bandwidth saver', status: 'ONLINE', activeTasks: 12, uptimePercent: 99.9, avatarIcon: 'Sparkles' }
            ]
          },
          {
            id: 'min-asy-video',
            code: 'KEMEN-VIDEO',
            name: 'Kementerian Video & Animasi',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Video Asy',
            mandateDescription: 'Mengorkestrasi Story Studio Express, preset rasio 9:16 reels, dan rendering video santri.',
            directoratesCount: 2,
            healthScore: 99.5,
            statusText: 'Multi-Ratio Story Engine Ready',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-v1', name: 'Petugas Bingkai Islami', roleTitle: 'Frame Composer', specialization: 'Zamrud & Gold Prestasi Layouts', status: 'ONLINE', activeTasks: 3, uptimePercent: 100, avatarIcon: 'Film' }
            ]
          },
          {
            id: 'min-asy-perpustakaan',
            code: 'KEMEN-PERPUS',
            name: 'Kementerian Perpustakaan Kelas',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Pustaka Asy',
            mandateDescription: 'Katalogisasi buku cerita anak, literasi usia dini, dan monitoring peminjaman kelas.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Digital Bookshelf Indexed',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-p1', name: 'Kurator Dongeng Santri', roleTitle: 'Story Cataloger', specialization: 'Adab & Moral Stories', status: 'ONLINE', activeTasks: 0, uptimePercent: 100, avatarIcon: 'BookOpen' }
            ]
          },
          {
            id: 'min-asy-berita',
            code: 'KEMEN-BERITA',
            name: 'Kementerian Berita & Publikasi',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Publikasi Asy',
            mandateDescription: 'Sinkronisasi artikel kegiatan santri ke website resmi dan portal warta umum.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Public Portal Bridge Synchronized',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-b1', name: 'Jurnalis Cilik Asy', roleTitle: 'News Dispatcher', specialization: 'Publishing & Markdown formatter', status: 'ONLINE', activeTasks: 2, uptimePercent: 100, avatarIcon: 'Globe' }
            ]
          },
          {
            id: 'min-asy-ppdb',
            code: 'KEMEN-PPDB',
            name: 'Kementerian PPDB & Pendaftaran',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Admisi Asy',
            mandateDescription: 'Pelayanan formulir pendaftaran santri baru, verifikasi berkas, dan nomor antrean digital.',
            directoratesCount: 3,
            healthScore: 100,
            statusText: 'Automated Admission Desk Open',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-pp1', name: 'Petugas Verifikasi NIK', roleTitle: 'Data Validator', specialization: 'Dukcapil match & validation', status: 'ONLINE', activeTasks: 5, uptimePercent: 100, avatarIcon: 'UserCheck' }
            ]
          },
          {
            id: 'min-asy-wali',
            code: 'KEMEN-WALI',
            name: 'Kementerian Wali Murid & Relasi',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Kemitraan Wali',
            mandateDescription: 'Portal komunikasi transparan wali murid, catatan adab santri, dan laporan kepulangan aman.',
            directoratesCount: 3,
            healthScore: 99.9,
            statusText: 'Parent Connection Active',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-w1', name: 'Pendamping Digital Wali', roleTitle: 'Family Companion', specialization: 'Daily updates & Pick-up signals', status: 'ONLINE', activeTasks: 8, uptimePercent: 99.8, avatarIcon: 'Heart' }
            ]
          },
          {
            id: 'min-asy-tahfidz',
            code: 'KEMEN-TAHFIDZ',
            name: 'Kementerian Tahfidz & Quran',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Quran Asy',
            mandateDescription: 'Pemantauan setoran surat pendek Juz 30, doa harian, dan mutabaah hafalan santri.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Mutabaah Quranic Ledger Synced',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-t1', name: 'Pencatat Hafalan Asy', roleTitle: 'Hafiz Tracker', specialization: 'Juz Amma & Doa Harian', status: 'ONLINE', activeTasks: 14, uptimePercent: 100, avatarIcon: 'Book' }
            ]
          },
          {
            id: 'min-asy-kreativitas',
            code: 'KEMEN-KREATIF',
            name: 'Kementerian Kreativitas & Seni',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Seni Asy',
            mandateDescription: 'Penyediaan template original TADE, piagam penghargaan, dan stempel ceria Asy Chibi.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Template Intelligence Hub Online',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-k1', name: 'Desainer Asy Chibi', roleTitle: 'Artistic Coordinator', specialization: 'Original Preschool Vector Art', status: 'ONLINE', activeTasks: 6, uptimePercent: 100, avatarIcon: 'Palette' }
            ]
          },
          {
            id: 'min-asy-tren',
            code: 'KEMEN-TREN',
            name: 'Kementerian Tren & Edukasi',
            domain: 'ASY_PELAYANAN',
            ministerName: 'Menteri Tren Edukasi',
            mandateDescription: 'Radar kurasi tren pembelajaran PAUD, format video ramah anak, dan nasehat bijak.',
            directoratesCount: 2,
            healthScore: 99.0,
            statusText: 'Ethical Trend Radar Scanning',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-tr1', name: 'Analis Tren Edukatif', roleTitle: 'Content Strategist', specialization: 'Positive Islamic Preschool Trends', status: 'ONLINE', activeTasks: 1, uptimePercent: 99.9, avatarIcon: 'TrendingUp' }
            ]
          }
        ]
      },
      GUARDIAN_KEAMANAN: {
        domain: 'GUARDIAN_KEAMANAN',
        title: 'Pemerintahan Digital Guardian',
        palaceName: 'Benteng Istana Guardian',
        presidentName: 'Presiden Guardian (Supreme Security Sentinel)',
        presidentRole: 'Otoritas Tertinggi Keamanan & Konstitusi Ring-0',
        slogan: 'Kedaulatan Data, Integritas Tanpa Kompromi, Terlindungi di Balik Layar',
        badgeColor: 'amber',
        totalCivilServants: 32,
        overallHealth: 100.0,
        ministries: [
          {
            id: 'min-g-ring0',
            code: 'KEMEN-RING0',
            name: 'Kementerian Ring-0 & Konstitusi',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Ring-0 Sentinel',
            mandateDescription: 'Penegakan aturan konstitusi platform permanen, pencegahan bypass, dan segregasi otoritas.',
            directoratesCount: 4,
            healthScore: 100,
            statusText: 'Ring-0 Lockdown Enforced',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-gr1', name: 'Sentinel Konstitusi', roleTitle: 'Core Enforcer', specialization: 'Rule validation & Bypass defense', status: 'ONLINE', activeTasks: 0, uptimePercent: 100, avatarIcon: 'Shield' }
            ]
          },
          {
            id: 'min-g-rbac',
            code: 'KEMEN-RBAC',
            name: 'Kementerian RBAC & Hak Akses',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Akses RBAC',
            mandateDescription: 'Verifikasi role 6-lapisan (Super Admin, Yayasan, Admin, Kepsek, Guru, Wali Murid).',
            directoratesCount: 3,
            healthScore: 100,
            statusText: '6-Role Matrix Strictly Checked',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-grb1', name: 'Penjaga Gerbang Role', roleTitle: 'Permission Arbiter', specialization: 'Session boundary & Token check', status: 'ONLINE', activeTasks: 18, uptimePercent: 100, avatarIcon: 'Lock' }
            ]
          },
          {
            id: 'min-g-audit',
            code: 'KEMEN-AUDIT',
            name: 'Kementerian Audit & Bukti Hukum',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Audit Permanen',
            mandateDescription: 'Pencatatan journal immutable SHA-256 dan pembuktian rekam jejak digital tanpa mutasi.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Immutable Journal Sealed',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-ga1', name: 'Notaris Kriptografis', roleTitle: 'Hash Auditor', specialization: 'SHA-256 ledger recording', status: 'ONLINE', activeTasks: 7, uptimePercent: 100, avatarIcon: 'FileCheck2' }
            ]
          },
          {
            id: 'min-g-ancaman',
            code: 'KEMEN-ANCAMAN',
            name: 'Kementerian Ancaman & Intelijen Serangan',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Pertahanan Siber',
            mandateDescription: 'Deteksi dini payload XSS, SQLi, tampering, dan anomali brute-force pada rute API.',
            directoratesCount: 3,
            healthScore: 100,
            statusText: 'Threat Detector Zero-Tolerance',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-gt1', name: 'Radar Anomali Siber', roleTitle: 'Intrusion Analyst', specialization: 'Heuristic anomaly detection', status: 'ONLINE', activeTasks: 2, uptimePercent: 100, avatarIcon: 'Crosshair' }
            ]
          },
          {
            id: 'min-g-pemantauan',
            code: 'KEMEN-PANTAU',
            name: 'Kementerian Pemantauan Telemetri',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Telemetri & Health',
            mandateDescription: 'Pengawasan latensi, idle CPU ~0%, konsumsi memori browser HP, dan frame rate 60fps.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'All Nodes Nominal',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-gp1', name: 'Inspektur Kinerja HP', roleTitle: 'Memory & Frame Rate Sentinel', specialization: 'One-hand memory guard', status: 'ONLINE', activeTasks: 1, uptimePercent: 100, avatarIcon: 'Activity' }
            ]
          },
          {
            id: 'min-g-darurat',
            code: 'KEMEN-DARURAT',
            name: 'Kementerian Darurat & Isolasi Krisis',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Penanganan Insiden',
            mandateDescription: 'Protokol isolasi darurat, lockdown rute, dan pembatasan transfer data sensitif saat krisis.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Standby Safe Ready',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-gd1', name: 'Komandan Isolasi', roleTitle: 'Emergency Officer', specialization: 'Safe route lockdown', status: 'STANDBY', activeTasks: 0, uptimePercent: 100, avatarIcon: 'AlertTriangle' }
            ]
          },
          {
            id: 'min-g-firewall',
            code: 'KEMEN-FIREWALL',
            name: 'Kementerian Firewall & Pembatas Sesi',
            domain: 'GUARDIAN_KEAMANAN',
            ministerName: 'Menteri Firewall Perimeter',
            mandateDescription: 'Penjaga dinding pemisah sesi browser, penyaringan header, dan pencegahan leakage lintas tab.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Perimeter Secured',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-gf1', name: 'Penjaga Gerbang Header', roleTitle: 'Perimeter Officer', specialization: 'Cross-origin protection', status: 'ONLINE', activeTasks: 21, uptimePercent: 100, avatarIcon: 'ShieldAlert' }
            ]
          }
        ]
      },
      HERMES_PEMULIHAN: {
        domain: 'HERMES_PEMULIHAN',
        title: 'Pemerintahan Digital Hermes',
        palaceName: 'Istana Kesinambungan Hermes',
        presidentName: 'Presiden Hermes (Continuity Arbiter)',
        presidentRole: 'Kepala Rekonsiliasi & Pemulihan Adaptif',
        slogan: 'Pekerjaan Guru Aman Tanpa Terputus, Tersinkronisasi Otomatis',
        badgeColor: 'sky',
        totalCivilServants: 22,
        overallHealth: 100.0,
        ministries: [
          {
            id: 'min-h-kontinuitas',
            code: 'KEMEN-KONTINUITAS',
            name: 'Kementerian Kontinuitas Tugas',
            domain: 'HERMES_PEMULIHAN',
            ministerName: 'Menteri Jeda & Lanjutkan',
            mandateDescription: 'Penyelamatan draf formulir saat sinyal hilang atau tab ditutup mendadak.',
            directoratesCount: 3,
            healthScore: 100,
            statusText: 'Draft Auto-Preserved',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-hk1', name: 'Penyelamat Draf Cepat', roleTitle: 'Draft Guardian', specialization: 'State snapshot on blur', status: 'ONLINE', activeTasks: 3, uptimePercent: 100, avatarIcon: 'FileText' }
            ]
          },
          {
            id: 'min-h-rekonsiliasi',
            code: 'KEMEN-REKONSILIASI',
            name: 'Kementerian Rekonsiliasi & Resolusi Konflik',
            domain: 'HERMES_PEMULIHAN',
            ministerName: 'Menteri Rekonsiliasi SSoT',
            mandateDescription: 'Penyatuan antrean offline ke database pusat (src/services/db.ts) tanpa kehilangan data.',
            directoratesCount: 3,
            healthScore: 100,
            statusText: 'SSoT Alignment Guaranteed',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-hr1', name: 'Penata Antrean Offline', roleTitle: 'Queue Resolver', specialization: 'Non-destructive merge', status: 'ONLINE', activeTasks: 0, uptimePercent: 100, avatarIcon: 'GitMerge' }
            ]
          },
          {
            id: 'min-h-snapshot',
            code: 'KEMEN-SNAPSHOT',
            name: 'Kementerian Snapshot & Penyimpanan Lokal',
            domain: 'HERMES_PEMULIHAN',
            ministerName: 'Menteri Snapshot Lokal',
            mandateDescription: 'Pengelolaan IndexedDB snapshot terisolasi untuk data offline tanpa kredensial.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Local Snapshot Indexed',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-hs1', name: 'Arsiparis Lokal', roleTitle: 'Local Storage Manager', specialization: 'Sanitized offline storage', status: 'ONLINE', activeTasks: 4, uptimePercent: 100, avatarIcon: 'HardDrive' }
            ]
          },
          {
            id: 'min-h-dryrun',
            code: 'KEMEN-DRYRUN',
            name: 'Kementerian Dry Run & Simulasi Sandi',
            domain: 'HERMES_PEMULIHAN',
            ministerName: 'Menteri Dry Run Lab',
            mandateDescription: 'Pengujian transmisi data dalam sandbox aman sebelum dikomit ke jaringan produksi.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'DORMANT_SAFE Mode Active',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-hd1', name: 'Inspektur Dry Run', roleTitle: 'Simulation Tester', specialization: 'DORMANT_SAFE non-mutating checks', status: 'DORMANT_SAFE', activeTasks: 0, uptimePercent: 100, avatarIcon: 'PlayCircle' }
            ]
          },
          {
            id: 'min-h-adaptasi',
            code: 'KEMEN-ADAPTASI',
            name: 'Kementerian Adaptasi Alur Kerja',
            domain: 'HERMES_PEMULIHAN',
            ministerName: 'Menteri Alur Adaptif',
            mandateDescription: 'Penyederhanaan alur kerja guru senior dan adaptasi perangkat berlayar kecil.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Adaptive Flow Enforced',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-ha1', name: 'Penata Layar Senior', roleTitle: 'Accessibility Tuner', specialization: 'Simplified one-hand UI', status: 'ONLINE', activeTasks: 2, uptimePercent: 100, avatarIcon: 'Smartphone' }
            ]
          },
          {
            id: 'min-h-pemulihan',
            code: 'KEMEN-PULIH',
            name: 'Kementerian Pemulihan Cepat',
            domain: 'HERMES_PEMULIHAN',
            ministerName: 'Menteri Pemulihan Transaksi',
            mandateDescription: 'Rollback aman transaksi terganggu dan pemulihan status konsisten.',
            directoratesCount: 2,
            healthScore: 100,
            statusText: 'Zero Corruption Protected',
            isReadOnly: true,
            civilServants: [
              { id: 'cs-hp1', name: 'Dokter Database', roleTitle: 'Recovery Officer', specialization: 'Transaction rollback protection', status: 'ONLINE', activeTasks: 0, uptimePercent: 100, avatarIcon: 'RotateCcw' }
            ]
          }
        ]
      }
    };

    this.guardianTroops = [
      { id: 'gt-alpha', unitName: 'Batalyon Perisai Ring-0', battalion: 'Divisi Pertahanan Inti', mandate: 'Menjaga kernel eksekusi dari modifikasi tak sah', readinessLevel: 'RING0_STANDBY', shieldIntegrityPercent: 100, stealthMode: true },
      { id: 'gt-bravo', unitName: 'Skuadron Pengawal RBAC', battalion: 'Divisi Otentikasi', mandate: 'Memverifikasi setiap rute akses per detik secara pasif', readinessLevel: 'PATROLLING_BACKGROUND', shieldIntegrityPercent: 100, stealthMode: true },
      { id: 'gt-charlie', unitName: 'Regu Pengintai Ancaman XSS/SQLi', battalion: 'Divisi Forensik Siber', mandate: 'Menyaring input teks sebelum diproses DOM', readinessLevel: 'PATROLLING_BACKGROUND', shieldIntegrityPercent: 99.8, stealthMode: true },
      { id: 'gt-delta', unitName: 'Satuan Segel Kriptografis SHA-256', battalion: 'Divisi Arsip Hukum', mandate: 'Menjaga keabadian log tanpa celah manipulasi', readinessLevel: 'PATROLLING_BACKGROUND', shieldIntegrityPercent: 100, stealthMode: true }
    ];
  }

  public static getInstance(): DigitalGovernmentCore {
    if (!DigitalGovernmentCore.instance) {
      DigitalGovernmentCore.instance = new DigitalGovernmentCore();
    }
    return DigitalGovernmentCore.instance;
  }

  public getGovernment(domain: SovereignDomain): SovereignGovernment {
    return this.governments[domain];
  }

  public getAllGovernments(): SovereignGovernment[] {
    return [
      this.governments.ASY_PELAYANAN,
      this.governments.GUARDIAN_KEAMANAN,
      this.governments.HERMES_PEMULIHAN
    ];
  }

  public getGuardianTroops(): GuardianTroopUnit[] {
    return [...this.guardianTroops];
  }

  public getOverallStats() {
    const govList = this.getAllGovernments();
    const totalMinistries = govList.reduce((acc, g) => acc + g.ministries.length, 0);
    const totalCivilServants = govList.reduce((acc, g) => acc + g.totalCivilServants, 0);
    const avgHealth = govList.reduce((acc, g) => acc + g.overallHealth, 0) / govList.length;

    return {
      totalGovernments: 3,
      totalMinistries,
      totalCivilServants,
      averageHealthScore: parseFloat(avgHealth.toFixed(1)),
      guardianTroopReadiness: '100% STEALTH_SECURED',
      hermesStatus: 'DORMANT_SAFE'
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
