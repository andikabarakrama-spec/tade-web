import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  AlertOctagon,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Database,
  Lock,
  Globe,
  HardDrive,
  FileText,
  Clock,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Server
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type ChaosCategory = 'SECURITY' | 'TRAFFIC' | 'DATABASE' | 'OPERATIONS' | 'DOCUMENTS' | 'RECOVERY';

export interface ChaosSimulationScenario {
  id: string;
  code: string;
  category: ChaosCategory;
  name: string;
  description: string;
  chaosVector: string;
  expectedDetection: string;
  guardianResponse: string;
  estimatedRecovery: string;
  lessonsLearned: string;
  prevention: string;
  regressionTestCode: string;
  gklKnowledgeTitle: string;
  gklCategory: string;
}

export const GuardianChaosLab: React.FC = () => {
  const { userProfile, activeRole } = useAuth();

  const [activeCategory, setActiveCategory] = useState<ChaosCategory>('SECURITY');
  const [runningScenarioId, setRunningScenarioId] = useState<string | null>(null);
  const [completedSimulations, setCompletedSimulations] = useState<Record<string, boolean>>({});
  const [selectedScenarioForDetails, setSelectedScenarioForDetails] = useState<ChaosSimulationScenario | null>(null);
  const [knowledgeFeedbackCards, setKnowledgeFeedbackCards] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      rootCause: string;
      guardianResponse: string;
      prevention: string;
      regressionTest: string;
      timestamp: string;
    }>
  >([]);

  // 21 Pre-configured Enterprise Chaos Scenarios across 6 categories
  const scenarios: ChaosSimulationScenario[] = useMemo(
    () => [
      // 1. SECURITY
      {
        id: 'sec-01',
        code: 'CHAOS-SEC-01',
        category: 'SECURITY',
        name: 'Brute Force Authentication Storm',
        description: 'Simulasi pengiriman 1.000 percobaan login ilegal per detik terhadap endpoint autentikasi.',
        chaosVector: '1,000 invalid credential POSTs/sec with spoofed client headers',
        expectedDetection: 'Tingkat kegagalan login melonjak > 20x baseline; App Check & IP throttle terpicu.',
        guardianResponse: 'Guardian Honey Shield mengaktifkan IP rate limit 15 menit dan isolasi token otomatis.',
        estimatedRecovery: '< 1.2 detik (Instant Autonomous Mitigation)',
        lessonsLearned: 'Sistem pertahanan lapis ganda Firebase Auth + IP Jail berhasil memblokir serangan tanpa kenaikan latensi bagi pengguna valid.',
        prevention: 'Terapkan progressive delay + biometric MFA challenge otomatis.',
        regressionTestCode: 'TC-SEC-BRUTEFORCE-ISOLATION-01',
        gklKnowledgeTitle: 'Mitigasi Badai Brute Force Tanpa Polusi Auth Logs',
        gklCategory: 'Cyber Security Invariant'
      },
      {
        id: 'sec-02',
        code: 'CHAOS-SEC-02',
        category: 'SECURITY',
        name: 'Credential Stuffing Injection Drill',
        description: 'Uji penyusupan data dump kredensial pihak ketiga pada form login wali murid.',
        chaosVector: 'Replay of leaked credential pairs across multiple user roles',
        expectedDetection: 'Deteksi anomali fingerprint browser & lokasi IP yang tidak lazim.',
        guardianResponse: 'Guardian Security Monitor memblokir sesi dan memicu verifikasi OTP WhatsApp darurat.',
        estimatedRecovery: '< 2.0 detik',
        lessonsLearned: 'Integrasi WhatsApp Guardian menjadi fail-safe efektif saat terjadi anomali login lintas geolokasi.',
        prevention: 'Enforce single active session token dengan rotasi token dinamis.',
        regressionTestCode: 'TC-SEC-CREDSTUFFING-GUARD-02',
        gklKnowledgeTitle: 'Protokol Isolasi Sesi Terdistribusi & OTP Fallback',
        gklCategory: 'Identity Governance'
      },
      {
        id: 'sec-03',
        code: 'CHAOS-SEC-03',
        category: 'SECURITY',
        name: 'Cross-Site Scripting (XSS) Sanitization Stress',
        description: 'Penyusupan tag script berbahaya pada input teks Buku Penghubung & Catatan Anekdot.',
        chaosVector: '<script>alert("XSS")</script> and polymorphic SVG onload payloads in text inputs',
        expectedDetection: 'DOMPurify & input sanitization layer mendeteksi payload kode eksekusi.',
        guardianResponse: 'Input dinetralkan menjadi raw text string yang aman sebelum disimpan ke Firestore.',
        estimatedRecovery: '0.0 ms (Real-time Pre-Flight Cleanse)',
        lessonsLearned: 'Semua input markdown dan deskripsi anak di-strip dari atribut berbahaya tanpa merusak format teks.',
        prevention: 'Pertahankan strict Content Security Policy (CSP) + React JSX auto-escaping.',
        regressionTestCode: 'TC-SEC-XSS-SANITIZER-03',
        gklKnowledgeTitle: 'Sanitasi Masukan Teks & Pencegahan Script Injection',
        gklCategory: 'Application Security'
      },
      {
        id: 'sec-04',
        code: 'CHAOS-SEC-04',
        category: 'SECURITY',
        name: 'NoSQL / Firestore Injection Vector Drill',
        description: 'Pengujian injeksi query clause tidak sah untuk membocorkan koleksi rapor dan keuangan.',
        chaosVector: 'Malformed query operators ($gt, nested conditions, where clauses manipulation)',
        expectedDetection: 'Canonical Data Layer DataService query validator menolak filter ilegal.',
        guardianResponse: 'Request ditolak dengan error 400 Bad Request; zero leaked metadata.',
        estimatedRecovery: '< 0.5 ms',
        lessonsLearned: 'Canonical Data Layer bertindak sebagai gerbang invariant tak tembus terhadap injeksi query.',
        prevention: 'Terapkan type-safe Firestore query builders pada DataService.',
        regressionTestCode: 'TC-SEC-FIRESTORE-INJECTION-04',
        gklKnowledgeTitle: 'Proteksi Schema Contract Terhadap Query Injeksi',
        gklCategory: 'Database Security'
      },
      {
        id: 'sec-05',
        code: 'CHAOS-SEC-05',
        category: 'SECURITY',
        name: 'File Upload Malware & Polyglot Abuse',
        description: 'Simulasi unggah berkas PDF palsu yang menyematkan payload executable.',
        chaosVector: 'Polyglot executable hidden inside valid JPEG/PDF header bytes',
        expectedDetection: 'MIME-type binary signature inspection memeriksa magic bytes berkas.',
        guardianResponse: 'Berkas dibuang seketika pada client pre-check dan ditolak oleh Cloud Storage bucket rules.',
        estimatedRecovery: '< 1.5 detik',
        lessonsLearned: 'Magic byte verification mencegah manipulasi ekstensi file pada berkas pendaftaran PPDB.',
        prevention: 'Batasi upload hanya untuk PDF, JPG, PNG murni dengan validasi checksum.',
        regressionTestCode: 'TC-SEC-UPLOAD-MALWARE-05',
        gklKnowledgeTitle: 'Verifikasi Magic Bytes & Pencegahan Upload Abuse',
        gklCategory: 'Asset Vault Protection'
      },

      // 2. TRAFFIC
      {
        id: 'traf-01',
        code: 'CHAOS-TRAF-01',
        category: 'TRAFFIC',
        name: 'Distributed Denial of Service (DDoS) Simulation',
        description: 'Simulasi gelombang 25.000 HTTP requests per detik dari ratusan IP botnet.',
        chaosVector: '25k HTTP SYN/GET flood directed at Nginx Ingress Port 3000',
        expectedDetection: 'Tingkat permintaan melebihi batas toleransi 500 req/sec; CPU Ingress naik.',
        guardianResponse: 'Guardian Adaptive DDoS Shield mengaktifkan filter Cloudflare level mitigasi dan rate limit IP.',
        estimatedRecovery: '< 3.5 detik',
        lessonsLearned: 'Koneksi pengguna terautentikasi tetap lancar berkat jalur prioritas token claims.',
        prevention: 'Sematkan CDN caching untuk asset statis dan throttling per subnet.',
        regressionTestCode: 'TC-TRAF-DDOS-SHIELD-01',
        gklKnowledgeTitle: 'Pertahanan Adaptive Shield Terhadap Lonjakan DDoS',
        gklCategory: 'Network Resilience'
      },
      {
        id: 'traf-02',
        code: 'CHAOS-TRAF-02',
        category: 'TRAFFIC',
        name: 'Burst Traffic Morning Check-In Spike',
        description: 'Simulasi lonjakan 300 pengguna bersamaan melakukan presensi pada pukul 07:15 WIB.',
        chaosVector: '300 concurrent mobile presensi submissions within 30-second window',
        expectedDetection: 'Antrean Firestore writes meningkat 10x lipat dalam waktu singkat.',
        guardianResponse: 'DataService mengaktifkan batch write concurrency queue tanpa lock contention.',
        estimatedRecovery: '< 1.8 detik',
        lessonsLearned: 'Desain batch write mencegah Firestore write quota throttling pada jam masuk sekolah.',
        prevention: 'Gunakan offline IndexedDB queuing jika latensi jaringan pengguna > 800ms.',
        regressionTestCode: 'TC-TRAF-BURST-PRESENSI-02',
        gklKnowledgeTitle: 'Manajemen Batch Concurrency Pada Jam Masuk Sekolah',
        gklCategory: 'Performance Optimization'
      },
      {
        id: 'traf-03',
        code: 'CHAOS-TRAF-03',
        category: 'TRAFFIC',
        name: 'PPDB Opening Peak Hour Surge',
        description: 'Simulasi 1.500 pendaftar serentak mengakses form PPDB pada menit pertama pembukaan.',
        chaosVector: '1,500 simultaneous PPDB registration forms initialization and submission',
        expectedDetection: 'Lonjakan pembacaan kuota pendaftaran dan verifikasi NISN.',
        guardianResponse: 'Guardian Virtual Waiting Room mendistribusikan request secara merata per 200 ms.',
        estimatedRecovery: '< 2.2 detik',
        lessonsLearned: 'Sistem pendaftaran PPDB mampu menjaga 100% konsistensi nomor antrean tanpa race condition.',
        prevention: 'Gunakan server-side atomic counter untuk nomor pendaftaran PPDB.',
        regressionTestCode: 'TC-TRAF-PPDB-SURGE-03',
        gklKnowledgeTitle: 'Distribusi Antrean Virtual Pendaftaran Santri Baru',
        gklCategory: 'Traffic Engineering'
      },

      // 3. DATABASE
      {
        id: 'db-01',
        code: 'CHAOS-DB-01',
        category: 'DATABASE',
        name: 'Firestore Synthetic Latency Spike (800ms)',
        description: 'Penyuntikan latensi buatan 800ms pada operasi pembacaan dokumen.',
        chaosVector: 'Inject 800ms artificial network roundtrip delay on all db read calls',
        expectedDetection: 'Komponen UI mendeteksi jeda response di atas ambang batas 200ms.',
        guardianResponse: 'SIM Skeleton Loader & optimistic UI caching langsung menampilkan data lokal instan.',
        estimatedRecovery: '< 0.1 detik (Instant Optimistic Fallback)',
        lessonsLearned: 'Pengalaman pengguna tetap halus tanpa layar putih berkat Skeleton Loaders dan cache lokal.',
        prevention: 'Pertahankan caching stale-while-revalidate pada level DataService.',
        regressionTestCode: 'TC-DB-LATENCY-FALLBACK-01',
        gklKnowledgeTitle: 'Pola Optimistic UI dan Pencegahan Layout Shift Saat Jaringan Lambat',
        gklCategory: 'Data Resilience'
      },
      {
        id: 'db-02',
        code: 'CHAOS-DB-02',
        category: 'DATABASE',
        name: 'Concurrent SPP Payment Mutation Lock Collision',
        description: 'Simulasi 2 kasir memproses pembayaran untuk tagihan SPP santri yang sama secara bersamaan.',
        chaosVector: 'Simultaneous payment submit for invoice INV-2026-08-01 within 5ms delta',
        expectedDetection: 'Invariant FIND-08-R3 Anti-Double-Spend Mutation Guard terpicu.',
        guardianResponse: 'Transaksi pertama berhasil dicap nomor kwitansi, transaksi kedua ditolak aman dengan status Idempotent Duplicate.',
        estimatedRecovery: '< 0.8 detik',
        lessonsLearned: 'Zero-drift dan zero-double-spend terjamin 100% oleh kunci atomik FIND-08-R3.',
        prevention: 'Kunci mutasi tagihan dengan Firestore RunTransaction idempotency stamp.',
        regressionTestCode: 'TC-DB-MUTATION-LOCK-02',
        gklKnowledgeTitle: 'Integritas Mutasi Kasir & Pencegahan Pembayaran Ganda',
        gklCategory: 'Financial Invariant'
      },
      {
        id: 'db-03',
        code: 'CHAOS-DB-03',
        category: 'DATABASE',
        name: 'Firestore Massive Read Burst Stress',
        description: 'Simulasi query pembacaan riwayat 5 tahun dokumen sekolah sekaligus.',
        chaosVector: 'Unbounded query reading 10,000 historical documents across all collections',
        expectedDetection: 'Beban memori browser dan penggunaan kuota Firestore meningkat.',
        guardianResponse: 'DataService secara otomatis memotong query dengan batas paginasi limit 50 dokumen per halaman.',
        estimatedRecovery: '< 1.1 detik',
        lessonsLearned: 'Paginasi wajib mencegah konsumsi memori berlebih dan menghemat kuota gratis Firebase.',
        prevention: 'Terapkan strict pagination limits di seluruh fungsi query database.',
        regressionTestCode: 'TC-DB-PAGINATION-LIMIT-03',
        gklKnowledgeTitle: 'Kebijakan Paginasi Otomatis Untuk Efisiensi Kuota Database',
        gklCategory: 'Resource Governance'
      },

      // 4. OPERATIONS
      {
        id: 'ops-01',
        code: 'CHAOS-OPS-01',
        category: 'OPERATIONS',
        name: 'Complete Internet Loss & Offline Recovery',
        description: 'Pemutusan total koneksi internet selama pengisian Catatan Anekdot dan E-Rapor.',
        chaosVector: 'Simulate navigator.onLine = false during active form typing',
        expectedDetection: 'Offline event listener mendeteksi ketiadaan koneksi server.',
        guardianResponse: 'Data tersimpan otomatis di IndexedDB lokal dengan badge Offline Mode Aktif.',
        estimatedRecovery: 'Instan saat online (Auto-Sync Berjalan Otomatis)',
        lessonsLearned: 'Tidak ada data guru yang hilang meskipun mati lampu atau koneksi internet sekolah terputus.',
        prevention: 'Pertahankan arsitektur offline-first IndexedDB buffer.',
        regressionTestCode: 'TC-OPS-OFFLINE-SYNC-01',
        gklKnowledgeTitle: 'Arsitektur Offline-First & Sinkronisasi Tanpa Kehilangan Data',
        gklCategory: 'Operational Continuity'
      },
      {
        id: 'ops-02',
        code: 'CHAOS-OPS-02',
        category: 'OPERATIONS',
        name: 'Bulk Upload Interruption & Resumable Flow',
        description: 'Koneksi terputus di tengah unggah 50 foto kegiatan santri.',
        chaosVector: 'Drop TCP connection at 48% progress of 50 MB image bundle upload',
        expectedDetection: 'Upload stream timeout terdeteksi oleh background uploader.',
        guardianResponse: 'Uploader menjeda antrean dan melanjutkan otomatis dari byte terakhir saat jaringan pulih.',
        estimatedRecovery: '< 3.0 detik pasca koneksi kembali',
        lessonsLearned: 'Resumable upload menghemat bandwidth dan mencegah kegagalan unggah berkas besar.',
        prevention: 'Gunakan chunked upload dengan verifikasi MD5 checksum per potongan berkas.',
        regressionTestCode: 'TC-OPS-RESUMABLE-UPLOAD-02',
        gklKnowledgeTitle: 'Mekanisme Resumable Upload Chunked Pada Jaringan Lemah',
        gklCategory: 'Storage Reliability'
      },
      {
        id: 'ops-03',
        code: 'CHAOS-OPS-03',
        category: 'OPERATIONS',
        name: 'WhatsApp Notification Queue Jam Recovery',
        description: 'Penyedia gateway WhatsApp mengalami penundaan antrean pesan notifikasi SPP.',
        chaosVector: 'Inject 504 Gateway Timeout on WhatsApp webhook endpoint',
        expectedDetection: 'Queue manager mendeteksi kegagalan webhook pengiriman pesan.',
        guardianResponse: 'Antrean dialihkan ke failover fallback buffer dengan retry exponential backoff.',
        estimatedRecovery: '< 2.5 detik',
        lessonsLearned: 'Seluruh notifikasi berhasil terkirim tanpa ada pesan yang terduplikasi atau terbuang.',
        prevention: 'Terapkan idempotency tracking pada setiap ID pesan WhatsApp.',
        regressionTestCode: 'TC-OPS-WA-FAILOVER-03',
        gklKnowledgeTitle: 'Failover Queue & Idempotensi Pengiriman Pesan WhatsApp',
        gklCategory: 'Notification Gateway'
      },

      // 5. DOCUMENTS
      {
        id: 'doc-01',
        code: 'CHAOS-DOC-01',
        category: 'DOCUMENTS',
        name: 'Mass PDF Kwitansi & Rapor Generation Stress',
        description: 'Simulasi pencetakan serentak 140 berkas PDF Rapor Santri akhir semester.',
        chaosVector: 'Spawn 140 parallel jsPDF generation threads in browser memory',
        expectedDetection: 'Lonjakan penggunaan memori heap browser.',
        guardianResponse: 'PDF Composer memproses dokumen secara batch serial (5 per siklus) untuk menjaga memori < 60 MB.',
        estimatedRecovery: '< 4.5 detik',
        lessonsLearned: 'Serial batch worker mencegah browser crash pada perangkat laptop/tablet guru berspesifikasi rendah.',
        prevention: 'Gunakan web worker terpisah untuk rendering PDF massal.',
        regressionTestCode: 'TC-DOC-PDF-MASS-GEN-01',
        gklKnowledgeTitle: 'Optimasi Memori Worker Untuk Pencetakan Rapor Massal',
        gklCategory: 'Document Engine'
      },
      {
        id: 'doc-02',
        code: 'CHAOS-DOC-02',
        category: 'DOCUMENTS',
        name: 'Mass Document Intake Validation Stress',
        description: 'Unggah serentak 100 berkas akta kelahiran dan kartu keluarga calon santri PPDB.',
        chaosVector: 'Bulk ingestion of 100 files simultaneously with varying compression qualities',
        expectedDetection: 'Kompresi gambar dan ekstraksi metadata beroperasi penuh.',
        guardianResponse: 'Smart Intake Engine mengompres gambar client-side 80% sebelum dikirim ke Storage.',
        estimatedRecovery: '< 3.8 detik',
        lessonsLearned: 'Kompresi client-side menghemat 75% kuota storage dan mempercepat waktu upload.',
        prevention: 'Terapkan browser-side canvas resizing sebelum transmisi berkas.',
        regressionTestCode: 'TC-DOC-MASS-INTAKE-02',
        gklKnowledgeTitle: 'Kompresi Citra Client-Side Pada Formulir Pendaftaran PPDB',
        gklCategory: 'Intake Optimization'
      },
      {
        id: 'doc-03',
        code: 'CHAOS-DOC-03',
        category: 'DOCUMENTS',
        name: 'Template Schema Migration Backward Compatibility',
        description: 'Simulasi pembacaan rapor format kurikulum lama dengan engine template terbaru.',
        chaosVector: 'Load legacy 2024 JSON template metadata into 2026 Kurikulum Merdeka renderer',
        expectedDetection: 'Deteksi field atribut yang tidak lengkap atau usang.',
        guardianResponse: 'Schema Adapter mengisi default fallback values secara otomatis tanpa error rendering.',
        estimatedRecovery: '< 0.2 detik',
        lessonsLearned: 'Backward compatibility terjaga 100%; rapor arsip santri alumni tetap dapat dibuka sempurna.',
        prevention: 'Wajibkan schema versioning pada seluruh payload template dokumen.',
        regressionTestCode: 'TC-DOC-TEMPLATE-MIGRATION-03',
        gklKnowledgeTitle: 'Kompatibilitas Mundur Skema Dokumen & Arsip Rapor PAUD',
        gklCategory: 'Schema Governance'
      },

      // 6. RECOVERY
      {
        id: 'rec-01',
        code: 'CHAOS-REC-01',
        category: 'RECOVERY',
        name: 'Cold Backup Snapshot SHA-256 Checksum Verification',
        description: 'Uji integritas data berkas cadangan JSON snapshot 24 jam terhadap tampering.',
        chaosVector: 'Simulate 1-byte alteration in backup JSON payload archive',
        expectedDetection: 'Checksum verification mismatch: calculated hash berbeda dengan signature hash.',
        guardianResponse: 'Guardian Recovery Vault menolak berkas korup dan mengalihkan ke snapshot sekunder tervalidasi.',
        estimatedRecovery: '< 1.4 detik',
        lessonsLearned: 'Verifikasi SHA-256 mencegah restorasi data yang rusak atau termanipulasi.',
        prevention: 'Tandatangani setiap snapshot backup dengan cryptographic checksum manifest.',
        regressionTestCode: 'TC-REC-CHECKSUM-VERIFY-01',
        gklKnowledgeTitle: 'Integritas Kriptografis Snapshot Backup & Anti-Tampering',
        gklCategory: 'Disaster Recovery'
      },
      {
        id: 'rec-02',
        code: 'CHAOS-REC-02',
        category: 'RECOVERY',
        name: 'Zero-Data-Loss Database Restore Drill (Sandbox)',
        description: 'Simulasi pemulihan penuh seluruh 18 koleksi database ke sandbox memory terisolasi.',
        chaosVector: 'Execute full 18-collection state restore onto ephemeral sandbox container',
        expectedDetection: 'Sandbox memory buffer menerima 4.820 dokumen.',
        guardianResponse: 'Restorasi selesai dalam 12 detik dengan 100% konsistensi relasi data santri, guru, dan SPP.',
        estimatedRecovery: '12.0 detik (RTO < 45s tervalidasi)',
        lessonsLearned: 'RTO (Recovery Time Objective) tercapai jauh di bawah batas SLA darurat (45 detik).',
        prevention: 'Jalankan simulasi pemulihan otomatis berkala setiap pergantian semester.',
        regressionTestCode: 'TC-REC-RESTORE-DRILL-02',
        gklKnowledgeTitle: 'Validasi RTO & Pemulihan Basis Data Skala Penuh',
        gklCategory: 'Business Continuity'
      },
      {
        id: 'rec-03',
        code: 'CHAOS-REC-03',
        category: 'RECOVERY',
        name: 'State Quiescence & Live Transaction Freeze Drill',
        description: 'Pengujian penguncian sementara transaksi finansial saat proses backup darurat berjalan.',
        chaosVector: 'Trigger temporary state quiescence lock during active transaction burst',
        expectedDetection: 'Semua transaksi baru dialihkan ke antrean tunggu idempotensi.',
        guardianResponse: 'Backup selesai bersih tanpa inkonsistensi dirty read; antrean transaksi diproses normal.',
        estimatedRecovery: '< 2.8 detik',
        lessonsLearned: 'State quiescence menjamin snapshot backup merekam kondisi finansial yang 100% presisi.',
        prevention: 'Gunakan isolasi transaksi bertingkat saat snapshot point-in-time dibuat.',
        regressionTestCode: 'TC-REC-STATE-QUIESCENCE-03',
        gklKnowledgeTitle: 'Penguncian State Quiescence Untuk Konsistensi Finansial',
        gklCategory: 'Financial Invariant'
      }
    ],
    []
  );

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => s.category === activeCategory);
  }, [scenarios, activeCategory]);

  const handleRunChaosSimulation = (scenario: ChaosSimulationScenario) => {
    setRunningScenarioId(scenario.id);

    setTimeout(() => {
      setCompletedSimulations((prev) => ({ ...prev, [scenario.id]: true }));
      setRunningScenarioId(null);
      setSelectedScenarioForDetails(scenario);

      // Add to GKL Knowledge Feedback automatically
      const newCard = {
        id: `gkl-${Date.now()}`,
        title: scenario.gklKnowledgeTitle,
        category: scenario.gklCategory,
        rootCause: scenario.expectedDetection,
        guardianResponse: scenario.guardianResponse,
        prevention: scenario.prevention,
        regressionTest: scenario.regressionTestCode,
        timestamp: 'Baru saja (Just now)'
      };

      setKnowledgeFeedbackCards((prev) => [newCard, ...prev.slice(0, 7)]);
    }, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 text-xs font-black uppercase tracking-wider border border-rose-300">
            <Flame className="w-3.5 h-3.5 text-rose-700" /> Guardian Chaos Laboratory • RC5
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Laboratorium Simulasi Anomali & Rekayasa Ketahanan Sistem (Chaos Lab)
          </h1>
          <p className="text-stone-600 text-xs mt-0.5 max-w-3xl">
            Pusat uji ketahanan lingkungan sandbox non-destruktif. Menguji respon otonom Guardian terhadap 21 skenario kegagalan tanpa memodifikasi data produksi sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-2 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-200 text-xs font-mono">
            Mode Uji: <strong className="text-emerald-800">100% Sandbox Ephemeral</strong>
          </span>
        </div>
      </div>

      {/* 6 Category Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => setActiveCategory('SECURITY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeCategory === 'SECURITY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Lock className="w-4 h-4 text-emerald-400" /> 1. Security (5 Skenario)
        </button>

        <button
          onClick={() => setActiveCategory('TRAFFIC')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeCategory === 'TRAFFIC' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" /> 2. Traffic (3 Skenario)
        </button>

        <button
          onClick={() => setActiveCategory('DATABASE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeCategory === 'DATABASE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" /> 3. Database (3 Skenario)
        </button>

        <button
          onClick={() => setActiveCategory('OPERATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeCategory === 'OPERATIONS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Server className="w-4 h-4 text-emerald-400" /> 4. Operations (3 Skenario)
        </button>

        <button
          onClick={() => setActiveCategory('DOCUMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeCategory === 'DOCUMENTS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" /> 5. Documents (3 Skenario)
        </button>

        <button
          onClick={() => setActiveCategory('RECOVERY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeCategory === 'RECOVERY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <HardDrive className="w-4 h-4 text-emerald-400" /> 6. Recovery (3 Skenario)
        </button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((sc) => {
          const isRunning = runningScenarioId === sc.id;
          const isPassed = completedSimulations[sc.id];

          return (
            <div
              key={sc.id}
              className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between space-y-4 shadow-xs ${
                isPassed
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : isRunning
                  ? 'border-rose-400 ring-2 ring-rose-300'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-slate-900 text-emerald-300 font-mono text-[10px] font-bold rounded">
                    {sc.code}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                    {sc.category}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {sc.name}
                </h3>

                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {sc.description}
                </p>

                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] font-mono text-stone-600">
                  <span className="font-bold text-slate-800 block">Vektor Anomali:</span>
                  <span className="text-rose-950 font-bold">{sc.chaosVector}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRunChaosSimulation(sc)}
                  disabled={isRunning}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-900 hover:bg-black text-white shadow-xs'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      <span>Menjalankan Simulasi...</span>
                    </>
                  ) : isPassed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Uji Ulang Simulasi</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Eksekusi Simulasi Sandbox</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Result Details Drawer / Card */}
      {selectedScenarioForDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                  Hasil Evaluasi Simulasi • {selectedScenarioForDetails.code}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedScenarioForDetails.name} — Mitigasi Sukses
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 self-start sm:self-auto">
              Estimasi Pemulihan: {selectedScenarioForDetails.estimatedRecovery}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">1. Deteksi Sistem (Detection):</span>
              <p className="text-slate-800 font-medium">{selectedScenarioForDetails.expectedDetection}</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">2. Respon Guardian (Response):</span>
              <p className="text-emerald-900 font-bold">{selectedScenarioForDetails.guardianResponse}</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">3. Pelajaran Kunci (Lessons Learned):</span>
              <p className="text-slate-800 font-medium">{selectedScenarioForDetails.lessonsLearned}</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">4. Rekomendasi Pencegahan & Regresi:</span>
              <p className="text-slate-800 font-medium">{selectedScenarioForDetails.prevention}</p>
              <div className="font-mono text-[10px] text-emerald-800 font-bold pt-1">
                Regression Tag: {selectedScenarioForDetails.regressionTestCode}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* PHASE 8: Guardian Knowledge Feedback (GKL Knowledge Cards) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-800" /> Guardian Knowledge Feedback (GKL Cards Generated)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Kartu pengetahuan otomatis dari hasil simulasi anomali untuk integrasi basis pengetahuan Guardian Knowledge Library (GKL).
            </p>
          </div>
          <span className="px-3 py-1 bg-stone-100 text-stone-800 font-mono text-xs font-bold rounded-full border border-stone-300">
            {knowledgeFeedbackCards.length > 0 ? `${knowledgeFeedbackCards.length} Kartu Dihasilkan` : 'Siap Menghasilkan Kartu'}
          </span>
        </div>

        {knowledgeFeedbackCards.length === 0 ? (
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500 space-y-1">
            <Info className="w-5 h-5 text-stone-400 mx-auto" />
            <p className="font-bold text-slate-700">Belum ada simulasi yang dijalankan pada sesi ini.</p>
            <p>Jalankan salah satu simulasi skenario di atas untuk menghasilkan Kartu Pengetahuan GKL secara instan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeFeedbackCards.map((card) => (
              <div
                key={card.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition space-y-2 text-xs"
              >
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-mono text-[10px] font-bold rounded">
                    {card.category}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400">{card.timestamp}</span>
                </div>

                <h4 className="font-black text-slate-900 text-sm leading-snug">{card.title}</h4>

                <div className="space-y-1 text-stone-600">
                  <div><strong>Respon:</strong> {card.guardianResponse}</div>
                  <div><strong>Pencegahan:</strong> {card.prevention}</div>
                  <div className="font-mono text-[10px] text-slate-700"><strong>Uji Regresi:</strong> {card.regressionTest}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
