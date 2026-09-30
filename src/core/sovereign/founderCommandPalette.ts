import { UserRole } from '../../types';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'NAVIGATION' | 'WAR_ROOM' | 'GUARDIAN' | 'COMPANION' | 'OFFLINE' | 'DISCOVERY' | 'SYSTEM';
  targetTab: string;
  keywords: string[];
  allowedRoles: UserRole[];
  badge?: string;
  isQuickAction?: boolean;
}

export class FounderCommandPalette {
  private static instance: FounderCommandPalette;
  private commands: CommandItem[] = [];

  private constructor() {
    this.initCommands();
  }

  public static getInstance(): FounderCommandPalette {
    if (!FounderCommandPalette.instance) {
      FounderCommandPalette.instance = new FounderCommandPalette();
    }
    return FounderCommandPalette.instance;
  }

  private initCommands(): void {
    this.commands = [
      // RC94 War Room & Sovereign
      {
        id: 'cmd-r770-warroom',
        title: 'Buka RC94 Sovereign War Room',
        subtitle: 'Command center operasi sovereign, offline queue, dan continuous verification',
        category: 'WAR_ROOM',
        targetTab: 'r770',
        keywords: ['war room', 'rc94', 'sovereign', 'offline', 'guardian', 'r770'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'RC94'
      },
      {
        id: 'cmd-r761-offline',
        title: 'Offline Continuity Engine (R761)',
        subtitle: 'Pantau antrean tindakan offline dan status sinkronisasi bertahap',
        category: 'OFFLINE',
        targetTab: 'r761',
        keywords: ['offline', 'queue', 'continuity', 'sync', 'r761'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'],
        badge: 'R761'
      },
      {
        id: 'cmd-r762-palette',
        title: 'Founder Command Palette Viewer (R762)',
        subtitle: 'Pusat pintasan perintah cepat dan navigasi instan Super Admin',
        category: 'SYSTEM',
        targetTab: 'r762',
        keywords: ['command palette', 'shortcut', 'ctrl+k', 'r762'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R762'
      },
      {
        id: 'cmd-r763-verification',
        title: 'Guardian Continuous Verification (R763)',
        subtitle: 'Audit otomatis drift RBAC, SSoT, integritas registry, dan permission mapping',
        category: 'GUARDIAN',
        targetTab: 'r763',
        keywords: ['guardian', 'verification', 'audit', 'drift', 'r763'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R763'
      },
      {
        id: 'cmd-r764-session',
        title: 'Sovereign Session Intelligence (R764)',
        subtitle: 'Deteksi idle time, tab awareness, session fingerprinting aman',
        category: 'SYSTEM',
        targetTab: 'r764',
        keywords: ['session', 'idle', 'fingerprint', 'security', 'r764'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R764'
      },
      {
        id: 'cmd-r765-cache',
        title: 'Offline Companion Cache (R765)',
        subtitle: 'Kelola cache preferensi UX non-sensitif dengan filter blacklist kredensial',
        category: 'COMPANION',
        targetTab: 'r765',
        keywords: ['companion', 'cache', 'preferences', 'blacklist', 'r765'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R765'
      },
      {
        id: 'cmd-r766-sync',
        title: 'Sync Reconciliation Viewer (R766)',
        subtitle: 'Visualisasi antrean sync, rekonsiliasi non-destruktif, dan penanganan konflik',
        category: 'OFFLINE',
        targetTab: 'r766',
        keywords: ['sync', 'reconcile', 'conflict', 'offline', 'r766'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R766'
      },
      {
        id: 'cmd-r767-health',
        title: 'Guardian Health Dashboard (R767)',
        subtitle: 'Skor kesehatan keamanan, recovery, integritas RBAC, dan sync',
        category: 'GUARDIAN',
        targetTab: 'r767',
        keywords: ['health', 'dashboard', 'security score', 'recovery', 'r767'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R767'
      },
      {
        id: 'cmd-r768-scanner',
        title: 'Discovery Integrity Scanner (R768)',
        subtitle: 'Pemindai integritas pendaftaran penemuan dan modul DISC-691 s/d DISC-770',
        category: 'DISCOVERY',
        targetTab: 'r768',
        keywords: ['discovery', 'scanner', 'registry', 'validation', 'r768'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R768'
      },
      {
        id: 'cmd-r769-recovery',
        title: 'Recovery Readiness Simulator (R769)',
        subtitle: 'Simulasi sandbox terisolasi: putus jaringan, reload tab, dan sinkronisasi kembali',
        category: 'OFFLINE',
        targetTab: 'r769',
        keywords: ['recovery', 'simulator', 'sandbox', 'offline drill', 'r769'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R769'
      },

      // Companion Ecosystem (RC93)
      {
        id: 'cmd-r751-parent',
        title: 'Parent Digital Companion (R751)',
        subtitle: 'Portal pendamping wali murid untuk pantauan hafalan, adab, dan kehadiran',
        category: 'COMPANION',
        targetTab: 'r751',
        keywords: ['parent', 'companion', 'wali murid', 'tahfidz', 'r751'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'WALI_MURID'],
        badge: 'RC93'
      },
      {
        id: 'cmd-r752-teacher',
        title: 'Teacher Digital Companion (R752)',
        subtitle: 'Pendamping harian guru PAUD untuk kelola sentra, observasi, dan RPP',
        category: 'COMPANION',
        targetTab: 'r752',
        keywords: ['teacher', 'guru', 'sentra', 'observasi', 'r752'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'RC93'
      },
      {
        id: 'cmd-r753-executive',
        title: 'Executive Companion (R753)',
        subtitle: 'Pantauan pimpinan: SITREP kelembagaan, matriks risiko, dan audit SSoT',
        category: 'COMPANION',
        targetTab: 'r753',
        keywords: ['executive', 'pimpinan', 'yayasan', 'sitrep', 'r753'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'RC93'
      },
      {
        id: 'cmd-r760-companion-warroom',
        title: 'RC93 Digital Companion War Room',
        subtitle: 'Pusat orkestrasi 10 modul pendamping digital Asy Syifa',
        category: 'WAR_ROOM',
        targetTab: 'r760',
        keywords: ['companion', 'war room', 'rc93', 'r760'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'RC93'
      },

      // Guardian & Adaptive Suite
      {
        id: 'cmd-r780-gov-warroom',
        title: 'RC95 Government War Room (R780)',
        subtitle: 'Pusat orkestrasi fondasi pemerintahan digital berdaulat, tanda tangan resmi, dan buku keputusan',
        category: 'WAR_ROOM',
        targetTab: 'r780',
        keywords: ['government', 'war room', 'rc95', 'digital gov', 'r780', 'r_rc95_suite'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'RC95'
      },
      {
        id: 'cmd-r771-policy',
        title: 'Constitutional Policy Engine (R771)',
        subtitle: 'Evaluasi kepatuhan kebijakan konstitusional terhadap SSoT tanpa autokoreksi',
        category: 'GUARDIAN',
        targetTab: 'r771',
        keywords: ['policy', 'kebijakan', 'konstitusi', 'ssot', 'r771'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R771'
      },
      {
        id: 'cmd-r772-signatures',
        title: 'Digital Signature Readiness Engine (R772)',
        subtitle: 'Stempel dan tanda tangan berjenjang dengan verifikasi integritas hash SHA-256',
        category: 'GUARDIAN',
        targetTab: 'r772',
        keywords: ['signature', 'tanda tangan', 'stempel', 'sha256', 'r772'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R772'
      },
      {
        id: 'cmd-r773-journal',
        title: 'Immutable Governance Journal (R773)',
        subtitle: 'Jurnal tata kelola permanen anti-overwrite dengan segel kriptografis',
        category: 'GUARDIAN',
        targetTab: 'r773',
        keywords: ['journal', 'jurnal', 'immutable', 'audit', 'r773'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R773'
      },
      {
        id: 'cmd-r775-ledger',
        title: 'Founder Decision Ledger (R775)',
        subtitle: 'Buku keputusan Founder berdaulat, alasan strategis, dan komitmen implementasi',
        category: 'WAR_ROOM',
        targetTab: 'r775',
        keywords: ['decision', 'ledger', 'founder', 'keputusan', 'r775'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R775'
      },
      {
        id: 'cmd-r776-dashboard',
        title: 'Government Operations Dashboard (R776)',
        subtitle: 'Ikhtisar kesiapan tata kelola pemerintahan, skor kebijakan, dan ringkasan audit',
        category: 'NAVIGATION',
        targetTab: 'r776',
        keywords: ['government', 'dashboard', 'operations', 'r776'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R776'
      },
      {
        id: 'cmd-r779-evidence',
        title: 'Governance Evidence Explorer (R779)',
        subtitle: 'Penjelajah bukti tata kelola, filter modul, verifikasi hash, dan paket ekspor audit',
        category: 'NAVIGATION',
        targetTab: 'r779',
        keywords: ['evidence', 'bukti', 'audit', 'explorer', 'r779'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R779'
      },
      {
        id: 'cmd-r790-rc96a-asy-warroom',
        title: 'RC96A Asy 3D Living Mascot War Room',
        subtitle: 'Pusat komando orkestrasi maskot 3D Chibi islami zamrud, living animation, trigger, dan performa',
        category: 'WAR_ROOM',
        targetTab: 'r790',
        keywords: ['asy', 'mascot', '3d', 'chibi', 'war room', 'rc96a', 'r790', 'animasi'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'],
        badge: 'RC96A'
      },
      {
        id: 'cmd-r781-asy-asset',
        title: 'Asy 3D Asset Foundation (R781)',
        subtitle: 'Inspeksi aset GLB, LOD, shader zamrud, dan fallback vector puppet',
        category: 'NAVIGATION',
        targetTab: 'r781',
        keywords: ['asy', 'asset', '3d', 'mesh', 'glb', 'r781'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R781'
      },
      {
        id: 'cmd-r783-asy-animation',
        title: 'Living Animation Engine (R783)',
        subtitle: 'Pengujian siklus nafas alami, kedipan, menoleh, ayunan kaki, dan pose ceria',
        category: 'NAVIGATION',
        targetTab: 'r783',
        keywords: ['asy', 'animation', 'living', 'pose', 'breathing', 'r783'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R783'
      },
      {
        id: 'cmd-r784-asy-trigger',
        title: 'Context Trigger Engine (R784)',
        subtitle: 'Simulasi dan pemantauan pemicu kontekstual event platform dan respon Asy',
        category: 'NAVIGATION',
        targetTab: 'r784',
        keywords: ['asy', 'trigger', 'context', 'event', 'simulation', 'r784'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R784'
      },
      {
        id: 'cmd-r787-asy-performance',
        title: 'Mascot Performance Guard (R787)',
        subtitle: 'Telemetri FPS, pemantauan GPU memory, dan zero-lag suspension guard',
        category: 'GUARDIAN',
        targetTab: 'r787',
        keywords: ['asy', 'performance', 'fps', 'gpu', 'zerolag', 'r787'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R787'
      },
      {
        id: 'cmd-r750-guardian-warroom',
        title: 'RC92 Sovereign Guardian War Room',
        subtitle: 'Pusat komando kebijakan dan konstitusi compiler Guardian Ring-0',
        category: 'WAR_ROOM',
        targetTab: 'r750',
        keywords: ['guardian', 'war room', 'rc92', 'constitution', 'r750'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'RC92'
      },
      {
        id: 'cmd-r_adaptive-suite',
        title: 'Hermes Adaptive Suite Master (RC87)',
        subtitle: 'Pusat kesinambungan tugas adaptif, jeda/lanjutkan, dan optimasi penyelesaian',
        category: 'WAR_ROOM',
        targetTab: 'r_adaptive_suite',
        keywords: ['hermes', 'adaptive', 'continuity', 'rc87'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'RC87'
      },
      {
        id: 'cmd-r800-rc97-living-asy',
        title: 'RC97 Asy Emotional Intelligence War Room',
        subtitle: 'Pusat komando kecerdasan emosional, jadwal harian santri, nasehat islami, dan perayaan',
        category: 'WAR_ROOM',
        targetTab: 'r800',
        keywords: ['asy', 'emotion', 'schedule', 'wisdom', 'celebration', 'rc97', 'r800'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'],
        badge: 'RC97'
      },
      {
        id: 'cmd-r810-rc98-micro-interaction',
        title: 'RC98 Asy Micro-Interaction Masterpiece War Room',
        subtitle: 'Pusat komando One-Hand UX, peek intelligence, thumb zone awareness, edge sitting, dan validator 360-430px',
        category: 'WAR_ROOM',
        targetTab: 'r810',
        keywords: ['asy', 'micro', 'interaction', 'thumb', 'peek', 'onehand', 'rc98', 'r810', 'r809'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'],
        badge: 'RC98'
      },
      // RC99 Creator Ecosystem Commands (R811 - R820)
      {
        id: 'cmd-r820-rc99-creator-warroom',
        title: 'RC99 Asy Central Intelligence & Creator War Room',
        subtitle: 'Pusat komando 7 subsistem kreatif: Photo Lab, Story Studio, Living Activity, Trends, Templates, Downloads, Innovation Lab',
        category: 'WAR_ROOM',
        targetTab: 'r820',
        keywords: ['creator', 'war room', 'photo lab', 'story studio', 'rc99', 'r820', 'r811', 'intel'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'],
        badge: 'RC99'
      },
      {
        id: 'cmd-r812-living-activity',
        title: 'Living Activity Center (R812)',
        subtitle: 'Pusat kegiatan santri terpadu: feed interaktif, timeline, dan alur unggah foto sekali untuk semua kanal',
        category: 'NAVIGATION',
        targetTab: 'r812',
        keywords: ['activity', 'kegiatan', 'santri', 'feed', 'timeline', 'foto', 'r812'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R812'
      },
      {
        id: 'cmd-r813-photo-lab',
        title: 'Asy AI Photo Lab (R813/R814)',
        subtitle: 'Pipeline 8-tahap enhancement non-generatif, smart cover selector terbobot, dan optimasi WebP',
        category: 'NAVIGATION',
        targetTab: 'r813',
        keywords: ['photo', 'lab', 'enhance', 'cover', 'pencahayaan', 'ketajaman', 'r813', 'r814'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R813'
      },
      {
        id: 'cmd-r815-story-studio',
        title: 'Story Studio Express (R815)',
        subtitle: 'Editor kreatif mobile-first: Story 9:16, Reels, Banner 16:9, Feed 1:1, stempel Asy Chibi, dan bingkai Islami',
        category: 'NAVIGATION',
        targetTab: 'r815',
        keywords: ['story', 'studio', 'reels', 'banner', 'design', 'poster', 'r815'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R815'
      },
      {
        id: 'cmd-r816-template-hub',
        title: 'Template Intelligence Hub (R816)',
        subtitle: 'Pustaka template original TADE: Senam, Tahfidz, Mewarnai, Manasik, Wisuda, Ramadhan, Hari Guru',
        category: 'NAVIGATION',
        targetTab: 'r816',
        keywords: ['template', 'hub', 'tahfidz', 'senam', 'wisuda', 'ramadhan', 'r816'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R816'
      },
      {
        id: 'cmd-r817-trend-intel',
        title: 'Trend Intelligence Center (R817)',
        subtitle: 'Radar kurasi tren edukasi & hook konten PAUD terkurasi aman tanpa scraping',
        category: 'NAVIGATION',
        targetTab: 'r817',
        keywords: ['trend', 'intelligence', 'radar', 'hook', 'konten', 'r817'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R817'
      },
      {
        id: 'cmd-r818-download-center',
        title: 'Creator Download Center (R818)',
        subtitle: 'Pusat unduhan multi-resolusi siap masa depan: Preview, HD 1080p, 2K Master, hingga 4K Archival',
        category: 'NAVIGATION',
        targetTab: 'r818',
        keywords: ['download', 'unduh', 'ekspor', 'resolusi', '4k', 'webp', 'r818'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R818'
      },
      {
        id: 'cmd-r819-innovation-lab',
        title: 'Innovation Lab & Sandbox (R819)',
        subtitle: 'Ruang inkubasi eksperimen fitur masa depan dengan proteksi gated rollout dan founder review',
        category: 'GUARDIAN',
        targetTab: 'r819',
        keywords: ['innovation', 'lab', 'experimental', 'sandbox', 'gated', 'founder review', 'r819'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R819'
      },
      // RC100 Living Digital School (R821 - R830)
      {
        id: 'cmd-r822-town-hall',
        title: 'Balai Kota Digital TADE (R822)',
        subtitle: 'Visualisasi Tiga Istana Pemerintahan: Asy (Pelayanan), Guardian (Keamanan), Hermes (Pemulihan)',
        category: 'WAR_ROOM',
        targetTab: 'r822',
        keywords: ['townhall', 'balai kota', 'pemerintahan', 'tiga istana', 'asy', 'guardian', 'hermes', 'r822'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R822'
      },
      {
        id: 'cmd-r823-asy-cabinet',
        title: 'Kabinet Pelayanan Asy (R823)',
        subtitle: '9 Kementerian Pelayanan: Foto, Video, Pustaka, Berita, PPDB, Wali, Tahfidz, Karya, Tren',
        category: 'NAVIGATION',
        targetTab: 'r823',
        keywords: ['kabinet asy', 'pelayanan', 'kementerian', 'santri', 'r823'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R823'
      },
      {
        id: 'cmd-r824-guardian-cabinet',
        title: 'Kabinet Pertahanan Guardian Ring-0 (R824)',
        subtitle: '7 Kementerian Keamanan & Pasukan Guardian Sentinel di balik layar',
        category: 'GUARDIAN',
        targetTab: 'r824',
        keywords: ['kabinet guardian', 'ring-0', 'keamanan', 'sentinel', 'rbac', 'audit', 'r824'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R824'
      },
      {
        id: 'cmd-r825-hermes-cabinet',
        title: 'Kabinet Pemulihan Hermes (R825)',
        subtitle: '6 Kementerian Kesinambungan & Rekonsiliasi SSoT terhubung RC87 mode DORMANT_SAFE',
        category: 'GUARDIAN',
        targetTab: 'r825',
        keywords: ['kabinet hermes', 'pemulihan', 'dormant safe', 'rekonsiliasi', 'ssot', 'r825'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R825'
      },
      {
        id: 'cmd-r826-voice-studio',
        title: 'Studio Suara Asy Global (R826)',
        subtitle: 'Konfigurasi identitas vokal global: Asy/Syifa, umur 4-12 tahun, gaya vokal mengikat seluruh TADE',
        category: 'COMPANION',
        targetTab: 'r826',
        keywords: ['suara', 'voice', 'studio', 'tts', 'asy', 'syifa', 'vokal', 'r826'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R826'
      },
      {
        id: 'cmd-r827-living-character',
        title: 'Mesin Karakter Hidup & Bank Tingkah (R827)',
        subtitle: 'Tingkah laku alamiah Asy: Ngintip, Mengejar Kupu-Kupu, Duduk, Merapikan Peci, Baca Iqro (Zero Lag)',
        category: 'COMPANION',
        targetTab: 'r827',
        keywords: ['karakter hidup', 'bank tingkah', 'mascot', 'ekspresi', 'iqro', 'r827'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R827'
      },
      {
        id: 'cmd-r828-situational-awareness',
        title: 'Mesin Kesadaran Situasi (R828)',
        subtitle: 'Sensor kontekstual: login, upload, keyboard aktif, malam, Ramadhan, wisuda, hari guru',
        category: 'COMPANION',
        targetTab: 'r828',
        keywords: ['situasi', 'konteks', 'awareness', 'sensor', 'ramadhan', 'wisuda', 'r828'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R828'
      },
      {
        id: 'cmd-r829-intelligence-council',
        title: 'Dewan Intelijen Asy & Laporan Pagi (R829)',
        subtitle: 'Laporan pagi terpadu Super Admin: foto, video, Guardian, Hermes, aktivitas santri (Advisory)',
        category: 'SYSTEM',
        targetTab: 'r829',
        keywords: ['dewan intelijen', 'laporan pagi', 'briefing', 'morning report', 'super admin', 'r829'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R829'
      },
      {
        id: 'cmd-r830-war-room',
        title: 'RC100 Pusat Kendali Nasional Living Digital School (R830)',
        subtitle: 'Master Command Center v8.0.0-RC100: Menyatukan seluruh pilar dan pengalaman hidup sekolah',
        category: 'WAR_ROOM',
        targetTab: 'r830',
        keywords: ['rc100', 'war room', 'living digital school', 'pusat kendali', 'v8.0.0', 'r830'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'RC100'
      },
      // RC101 Operational Excellence (R831 - R840)
      {
        id: 'cmd-r831-master-character',
        title: 'Master Character Lock Resmi Founder (R831)',
        subtitle: 'Konstitusi visual mutlak Asy & Syifa: Wajah, seragam krem-putih aksen oranye, peci & hijab',
        category: 'GUARDIAN',
        targetTab: 'r831',
        keywords: ['master character', 'karakter', 'asy', 'syifa', 'lock', 'founder', 'r831'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R831'
      },
      {
        id: 'cmd-r832-activity-center',
        title: 'Pusat Kegiatan TK & Single-Upload Flow (R832)',
        subtitle: 'Sekali unggah otomatis masuk ke Galeri, Feed, Timeline, Berita Website, dan Portal Wali Murid',
        category: 'NAVIGATION',
        targetTab: 'r832',
        keywords: ['kegiatan', 'single upload', 'galeri', 'feed', 'timeline', 'berita', 'r832'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R832'
      },
      {
        id: 'cmd-r833-photo-lab',
        title: 'Laboratorium Foto Pro+ (R833)',
        subtitle: 'Pipeline restorasi pencahayaan, white balance, ketajaman, deteksi blur & mata tertutup',
        category: 'NAVIGATION',
        targetTab: 'r833',
        keywords: ['photo lab', 'foto', 'restorasi', 'blur', 'kedip', 'optik', 'r833'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R833'
      },
      {
        id: 'cmd-r834-story-studio',
        title: 'Story Studio Viral 9:16 (R834)',
        subtitle: 'Pembuat video story otomatis dengan template Senam, Tahfidz, Ramadhan, Wisuda & ekspor 4K',
        category: 'NAVIGATION',
        targetTab: 'r834',
        keywords: ['story studio', 'video', 'reels', 'senam', 'tahfidz', 'ramadhan', 'r834'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R834'
      },
      {
        id: 'cmd-r835-smart-teaching',
        title: 'Perpustakaan Kelas Cerdas (R835)',
        subtitle: 'Generator bahan ajar PAUD (Huruf, Angka, Hewan, Buah, Doa) via ketik & dikte suara siap cetak PDF',
        category: 'NAVIGATION',
        targetTab: 'r835',
        keywords: ['perpustakaan', 'bahan ajar', 'flashcard', 'pdf', 'dikte suara', 'r835'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R835'
      },
      {
        id: 'cmd-r836-hermes-vault',
        title: 'Brankas Digital Hermes (R836)',
        subtitle: 'Sistem folder arsip Founder, uji latensi, kuota, manifest SHA-256 (Nol Database Kedua)',
        category: 'GUARDIAN',
        targetTab: 'r836',
        keywords: ['brankas', 'hermes', 'arsip', 'folder', 'manifest', 'sha256', 'r836'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R836'
      },
      {
        id: 'cmd-r837-parent-portal',
        title: 'Dashboard Wali Murid (R837)',
        subtitle: 'Portal kasih sayang: Foto asli, video, mutabaah tahfidz juz 30, dan pengumuman sekolah',
        category: 'COMPANION',
        targetTab: 'r837',
        keywords: ['wali murid', 'portal ortu', 'tahfidz', 'foto anak', 'jurnal harian', 'r837'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R837'
      },
      {
        id: 'cmd-r838-living-school',
        title: 'Mode Sekolah Hidup & Bank Tingkah (R838)',
        subtitle: 'Tingkah laku Asy & Syifa: Ngintip, duduk, membaca Iqro, mengejar kupu-kupu, merapikan peci',
        category: 'COMPANION',
        targetTab: 'r838',
        keywords: ['sekolah hidup', 'bank tingkah', 'iqro', 'peci', 'hijab', 'r838'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'R838'
      },
      {
        id: 'cmd-r839-evolution-intelligence',
        title: 'Pusat Intelijen Evolusi (R839)',
        subtitle: 'Radar inovasi tren template, reels, optik & suara dengan sistem Innovation Queue & Founder Review',
        category: 'SYSTEM',
        targetTab: 'r839',
        keywords: ['evolusi', 'inovasi', 'queue', 'radar', 'template tren', 'r839'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R839'
      },
      {
        id: 'cmd-r840-war-room',
        title: 'RC101 Pusat Komando Operasional Harian (R840)',
        subtitle: 'War Room Operasional v8.1.0-RC101: Menyatukan 8 pilar keunggulan operasional sekolah',
        category: 'WAR_ROOM',
        targetTab: 'r840',
        keywords: ['rc101', 'war room', 'operasional', 'excellence', 'v8.1.0', 'r840'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'RC101'
      },
      {
        id: 'cmd-r841-task-orchestrator',
        title: 'Task Orchestrator Nasional (R841)',
        subtitle: 'Orkestrasi tugas latar belakang skala nasional dengan Zero Duplicate Execution & Idle CPU ~0%',
        category: 'SYSTEM',
        targetTab: 'r841',
        keywords: ['orchestrator', 'task', 'idempotent', 'background worker', 'r841'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R841'
      },
      {
        id: 'cmd-r842-smart-queue',
        title: 'Smart Queue Dashboard (R842)',
        subtitle: 'Inspeksi antrean real-time, throttler telemetry, dan kendali prioritas tugas',
        category: 'SYSTEM',
        targetTab: 'r842',
        keywords: ['queue', 'antrean', 'throttler', 'priority', 'r842'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R842'
      },
      {
        id: 'cmd-r843-automation-center',
        title: 'Pusat Otomasi Sekolah (R843)',
        subtitle: 'Jadwal & pemicu otomasi harian (sinkronisasi pagi, pengingat tahfidz, infaq Jumat, snapshot malam)',
        category: 'SYSTEM',
        targetTab: 'r843',
        keywords: ['otomasi', 'cron', 'jadwal', 'autopilot', 'r843'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R843'
      },
      {
        id: 'cmd-r844-daily-health',
        title: 'Pemeriksa Kesehatan Harian (R844)',
        subtitle: 'Audit 6 pilar vital aplikasi (SSoT db.ts, Memory Leak Guard, Guardian Ring-0, ServiceWorker, Latensi)',
        category: 'GUARDIAN',
        targetTab: 'r844',
        keywords: ['kesehatan', 'health', 'diagnostik', 'audit', 'ssot', 'r844'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R844'
      },
      {
        id: 'cmd-r845-autonomous-vault',
        title: 'Brankas Digital Otomatis (R845)',
        subtitle: 'Snapshot rolling Hermes otomatis dengan verifikasi integritas SHA-256 dan retensi 30 hari',
        category: 'SYSTEM',
        targetTab: 'r845',
        keywords: ['brankas otomatis', 'snapshot', 'sha256', 'hermes', 'r845'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R845'
      },
      {
        id: 'cmd-r846-photolab-batch',
        title: 'Photo Lab Batch (R846)',
        subtitle: 'Restorasi & peningkatan hingga 20 foto kegiatan sekolah secara serempak dengan deteksi blur & mata',
        category: 'SYSTEM',
        targetTab: 'r846',
        keywords: ['photo lab batch', 'foto massal', 'restorasi batch', 'r846'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R846'
      },
      {
        id: 'cmd-r847-story-batch',
        title: 'Story Studio Batch (R847)',
        subtitle: 'Generator video vertikal 9:16 Instagram/WhatsApp Story massal untuk seluruh kelas sekaligus',
        category: 'SYSTEM',
        targetTab: 'r847',
        keywords: ['story batch', 'reels massal', '9:16', 'video story', 'r847'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R847'
      },
      {
        id: 'cmd-r848-principal-dashboard',
        title: 'Dashboard Kepala Sekolah (R848)',
        subtitle: 'Ikhtisar strategis capaian kurikulum RPPH, mutabaah tahfidz, presensi, kesiapan guru, dan keamanan',
        category: 'SYSTEM',
        targetTab: 'r848',
        keywords: ['kepala sekolah', 'principal', 'eksekutif', 'kurikulum', 'rpph', 'r848'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
        badge: 'R848'
      },
      {
        id: 'cmd-r849-guardian-stress',
        title: 'Guardian Stress & Chaos Test (R849)',
        subtitle: 'Pengujian ketahanan dan simulasi chaos Ring-0 non-destruktif: network drop, 100 ops/s, privilege escalation',
        category: 'GUARDIAN',
        targetTab: 'r849',
        keywords: ['stress test', 'chaos', 'ring-0', 'resilience', 'keamanan', 'r849'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R849'
      },
      {
        id: 'cmd-r850-reliability-war-room',
        title: 'RC102 Reliability War Room (R850)',
        subtitle: 'Pusat Komando Keandalan Otonom & Kesiapan Produksi v8.2.0-RC102',
        category: 'WAR_ROOM',
        targetTab: 'r850',
        keywords: ['rc102', 'reliability', 'war room', 'produksi', 'v8.2.0', 'r850'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'RC102'
      },
      {
        id: 'cmd-r851-guardian-policy',
        title: 'Guardian Policy Center (R851)',
        subtitle: 'Penegakan kebijakan Ring-0, kedaulatan data santri, dan kepatuhan UU PDP',
        category: 'GUARDIAN',
        targetTab: 'r851',
        keywords: ['policy', 'guardian', 'ring-0', 'uu pdp', 'r851'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R851'
      },
      {
        id: 'cmd-r852-audit-timeline',
        title: 'Audit Timeline Explorer (R852)',
        subtitle: 'Jejak kronologis imutabel berbukti tanda tangan kriptografis SHA-256',
        category: 'GUARDIAN',
        targetTab: 'r852',
        keywords: ['audit', 'timeline', 'sha-256', 'immutable', 'r852'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R852'
      },
      {
        id: 'cmd-r853-school-command',
        title: 'School Command Center (R853)',
        subtitle: 'Pusat kendali holistik seluruh unit santri, guru, aktivitas sentra, dan kas',
        category: 'SYSTEM',
        targetTab: 'r853',
        keywords: ['command center', 'sentra', 'rpph', 'operasional', 'r853'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
        badge: 'R853'
      },
      {
        id: 'cmd-r854-operational-kpi',
        title: 'Operational KPI Engine (R854)',
        subtitle: 'Metrik kinerja akuntabel dan evaluasi capaian kuantitatif berbasis SSoT db.ts',
        category: 'SYSTEM',
        targetTab: 'r854',
        keywords: ['kpi', 'kinerja', 'metrik', 'akuntabilitas', 'r854'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
        badge: 'R854'
      },
      {
        id: 'cmd-r855-smart-incident',
        title: 'Smart Incident Manager (R855)',
        subtitle: 'Pusat deteksi, isolasi, mitigasi otomatis, dan resolusi insiden < 10 menit',
        category: 'GUARDIAN',
        targetTab: 'r855',
        keywords: ['incident', 'anomali', 'mitigasi', 'darurat', 'r855'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R855'
      },
      {
        id: 'cmd-r856-founder-console',
        title: 'Founder Governance Console (R856)',
        subtitle: 'Otoritas veto tertinggi, audit master key, dan integritas konstitusi TADE',
        category: 'SYSTEM',
        targetTab: 'r856',
        keywords: ['founder', 'sovereign', 'veto', 'master key', 'r856'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R856'
      },
      {
        id: 'cmd-r857-compliance-readiness',
        title: 'Compliance Readiness Center (R857)',
        subtitle: 'Kesiapan akreditasi BAN-PAUD Standar 1-8 dan kepatuhan regulasi UU PDP',
        category: 'SYSTEM',
        targetTab: 'r857',
        keywords: ['compliance', 'ban-paud', 'akreditasi', 'uu pdp', 'r857'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
        badge: 'R857'
      },
      {
        id: 'cmd-r858-offline-sync-assurance',
        title: 'Offline Sync Assurance (R858)',
        subtitle: 'Jaminan sinkronisasi data nir-konflik, deterministic LWW, dan buffer IndexedDB',
        category: 'OFFLINE',
        targetTab: 'r858',
        keywords: ['offline sync', 'lww', 'indexeddb', 'nir-konflik', 'r858'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R858'
      },
      {
        id: 'cmd-r859-living-performance',
        title: 'Living Performance Profiler (R859)',
        subtitle: 'Telemetri performa browser: heap memory < 35MB, 60 FPS, dan Idle CPU ~0%',
        category: 'SYSTEM',
        targetTab: 'r859',
        keywords: ['performance', 'profiler', 'heap', 'fps', 'telemetri', 'r859'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R859'
      },
      {
        id: 'cmd-r860-governance-war-room',
        title: 'RC103 Governance War Room (R860)',
        subtitle: 'Pusat Komando Tata Kelola & Kepercayaan Operasional v8.3.0-RC103',
        category: 'WAR_ROOM',
        targetTab: 'r860',
        keywords: ['rc103', 'governance', 'war room', 'trust', 'v8.3.0', 'r860'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'RC103'
      },
      {
        id: 'cmd-r861-continuity-command',
        title: 'Continuity Command Engine (R861)',
        subtitle: 'Pusat komando kelangsungan operasional madrasah, RTO < 5s, RPO 0 kehilangan data',
        category: 'SYSTEM',
        targetTab: 'r861',
        keywords: ['continuity', 'rto', 'rpo', 'kelangsungan', 'r861'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R861'
      },
      {
        id: 'cmd-r862-predictive-health',
        title: 'Predictive Health Intelligence (R862)',
        subtitle: 'Deteksi dini tren performa browser & early anomaly sebelum KBM',
        category: 'SYSTEM',
        targetTab: 'r862',
        keywords: ['predictive', 'health', 'anomaly', 'proaktif', 'r862'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R862'
      },
      {
        id: 'cmd-r863-guardian-risk',
        title: 'Guardian Risk Observatory (R863)',
        subtitle: 'Observatorium risiko kedaulatan data, kepatuhan UU PDP, dan integritas Ring-0',
        category: 'GUARDIAN',
        targetTab: 'r863',
        keywords: ['risk', 'observatory', 'ring-0', 'uu pdp', 'r863'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R863'
      },
      {
        id: 'cmd-r864-smart-recovery',
        title: 'Smart Recovery Coordinator (R864)',
        subtitle: 'Orkestrasi pemulihan otomatis, simulasi DR drill, dan zero-loss restoration',
        category: 'SYSTEM',
        targetTab: 'r864',
        keywords: ['recovery', 'disaster', 'drill', 'restoration', 'r864'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'R864'
      },
      {
        id: 'cmd-r865-operations-timeline',
        title: 'School Operations Timeline (R865)',
        subtitle: 'Garis waktu operasional harian terintegrasi dari drop-off santri hingga closing kas',
        category: 'SYSTEM',
        targetTab: 'r865',
        keywords: ['timeline', 'lifecycle', 'jadwal', 'sentra', 'r865'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN', 'GURU'],
        badge: 'R865'
      },
      {
        id: 'cmd-r866-executive-decision',
        title: 'Executive Decision Center (R866)',
        subtitle: 'Analitik strategis yayasan & kepala sekolah (anggaran RKAS, tahfidz, rombel)',
        category: 'SYSTEM',
        targetTab: 'r866',
        keywords: ['executive', 'decision', 'rkas', 'yayasan', 'r866'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
        badge: 'R866'
      },
      {
        id: 'cmd-r867-capacity-forecast',
        title: 'Capacity Forecast Engine (R867)',
        subtitle: 'Proyeksi kapasitas 6 bulan (daya tampung santri, storage file, throughput SSoT)',
        category: 'SYSTEM',
        targetTab: 'r867',
        keywords: ['capacity', 'forecast', 'proyeksi', 'scaling', 'r867'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
        badge: 'R867'
      },
      {
        id: 'cmd-r868-offline-mission',
        title: 'Offline Mission Control (R868)',
        subtitle: 'Kendali operasi offline-first terisolasi, deterministic LWW, dan zero-conflict buffer',
        category: 'OFFLINE',
        targetTab: 'r868',
        keywords: ['offline', 'mission', 'lww', 'pelosok', 'r868'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'R868'
      },
      {
        id: 'cmd-r869-founder-briefing',
        title: 'Founder Intelligence Briefing (R869)',
        subtitle: 'Ringkasan eksekutif kedaulatan konstitusi TADE dan kompas nilai adab umat',
        category: 'SYSTEM',
        targetTab: 'r869',
        keywords: ['founder', 'briefing', 'konstitusi', 'tade', 'r869'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'R869'
      },
      {
        id: 'cmd-r870-continuity-war-room',
        title: 'RC104 Continuity War Room (R870)',
        subtitle: 'Pusat Komando Kelangsungan Operasional & Intelijen Terpadu v8.4.0-RC104',
        category: 'WAR_ROOM',
        targetTab: 'r870',
        keywords: ['rc104', 'continuity', 'war room', 'intelligence', 'v8.4.0', 'r870'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'RC104'
      },
      {
        id: 'cmd-g901-functional-validation',
        title: 'Functional Validation (G901)',
        subtitle: 'Validasi fungsional menyeluruh akademik, keuangan, dan sentra SSoT',
        category: 'SYSTEM',
        targetTab: 'g901',
        keywords: ['functional', 'validation', 'ssot', 'glc1', 'g901'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'G901'
      },
      {
        id: 'cmd-g902-guardian-security',
        title: 'Guardian Security Validation (G902)',
        subtitle: 'Penguncian mutlak Ring-0, audit Firestore/Storage rules, & kepatuhan UU PDP',
        category: 'GUARDIAN',
        targetTab: 'g902',
        keywords: ['security', 'ring0', 'pdp', 'rules', 'g902'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'G902'
      },
      {
        id: 'cmd-g903-performance-cert',
        title: 'Performance Certification (G903)',
        subtitle: 'Audit Lighthouse 99-100, Web Vitals, LCP 0.8s, dan 60 FPS stabil',
        category: 'SYSTEM',
        targetTab: 'g903',
        keywords: ['performance', 'lighthouse', 'vitals', 'fps', 'g903'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'G903'
      },
      {
        id: 'cmd-g904-offline-sync-cert',
        title: 'Offline & Sync Certification (G904)',
        subtitle: 'Sertifikasi pencatatan pelosok tanpa sinyal & deterministic LWW',
        category: 'OFFLINE',
        targetTab: 'g904',
        keywords: ['offline', 'sync', 'lww', 'pelosok', 'g904'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'G904'
      },
      {
        id: 'cmd-g905-hermes-recovery-cert',
        title: 'Hermes Recovery Certification (G905)',
        subtitle: 'Validasi cadangan DORMANT_SAFE, DR drill, RTO 1.4s, dan zero-loss RPO',
        category: 'SYSTEM',
        targetTab: 'g905',
        keywords: ['hermes', 'recovery', 'dormant', 'drill', 'g905'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'],
        badge: 'G905'
      },
      {
        id: 'cmd-g906-mobile-production-cert',
        title: 'Mobile Production Certification (G906)',
        subtitle: 'Sertifikasi tata letak ponsel 360-430px & ergonomi sentuh ≥44px',
        category: 'SYSTEM',
        targetTab: 'g906',
        keywords: ['mobile', 'viewport', 'touch', 'ergonomic', 'g906'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'],
        badge: 'G906'
      },
      {
        id: 'cmd-g907-founder-acceptance',
        title: 'Founder Acceptance Suite (G907)',
        subtitle: 'Pengesahan kedaulatan arsitektur & kompas visi konstitusi TADE',
        category: 'SYSTEM',
        targetTab: 'g907',
        keywords: ['founder', 'acceptance', 'supreme', 'konstitusi', 'g907'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'G907'
      },
      {
        id: 'cmd-g908-documentation-sop',
        title: 'Documentation & SOP (G908)',
        subtitle: 'Panduan operasional baku guru, kasir SPP, admin, dan yayasan',
        category: 'SYSTEM',
        targetTab: 'g908',
        keywords: ['sop', 'documentation', 'panduan', 'manual', 'g908'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'G908'
      },
      {
        id: 'cmd-g909-deployment-package',
        title: 'Production Deployment Package (G909)',
        subtitle: 'Paket build produksi, bundle gzip, segel SHA-256, dan rollback plan',
        category: 'SYSTEM',
        targetTab: 'g909',
        keywords: ['deployment', 'package', 'build', 'bundle', 'g909'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
        badge: 'G909'
      },
      {
        id: 'cmd-g910-golive-control-tower',
        title: 'Go-Live Control Tower (G910)',
        subtitle: 'Pusat Komando Kelayakan & Sertifikasi Peluncuran Produksi GLC-1',
        category: 'WAR_ROOM',
        targetTab: 'g910',
        keywords: ['golive', 'control tower', 'glc1', 'launch', 'g910'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'GLC-1'
      },
      {
        id: 'cmd-mca1-master-character-canon',
        title: 'Master Character Canon (MCA-1)',
        subtitle: 'Kanon resmi Asy & Syifa, proporsi 2.5 kepala, ekspresi, living animation, & guard',
        category: 'SYSTEM',
        targetTab: 'mca1',
        keywords: ['mascot', 'asy', 'syifa', 'canon', 'mca1', 'character', 'proporsi'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'],
        badge: 'MCA-1'
      },
      {
        id: 'cmd-r1-dashboard',
        title: 'Dashboard Utama SIM Sekolah',
        subtitle: 'Ikhtisar operasional, data santri, presensi harian, dan keuangan',
        category: 'NAVIGATION',
        targetTab: 'r1',
        keywords: ['dashboard', 'utama', 'sim', 'r1', 'beranda'],
        allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID']
      }
    ];
  }

  public getAllCommands(userRole: UserRole): CommandItem[] {
    return this.commands.filter(cmd => cmd.allowedRoles.includes(userRole));
  }

  public searchCommands(query: string, userRole: UserRole): CommandItem[] {
    const accessible = this.getAllCommands(userRole);
    if (!query || !query.trim()) return accessible;

    const q = query.toLowerCase().trim();
    return accessible.filter(cmd => {
      const titleMatch = cmd.title.toLowerCase().includes(q);
      const subtitleMatch = cmd.subtitle.toLowerCase().includes(q);
      const keywordMatch = cmd.keywords.some(k => k.toLowerCase().includes(q));
      const targetMatch = cmd.targetTab.toLowerCase().includes(q);
      return titleMatch || subtitleMatch || keywordMatch || targetMatch;
    });
  }
}
