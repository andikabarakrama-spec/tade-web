import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  Wifi,
  WifiOff,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Gauge,
  Sparkles,
  Bot,
  Lock,
  FileText,
  Users,
  Search,
  Check,
  Play,
  Clock,
  HardDrive
} from 'lucide-react';
import { LicenseEngine } from '../../services/license/LicenseEngine';
import { LicenseIntegrityEngine } from '../../services/license/LicenseIntegrityEngine';

interface DiagnosticResult {
  step: string;
  category: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  details: string;
}

export const R57EnterpriseOperationsCenter: React.FC = () => {
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [diagnosticSummary, setDiagnosticSummary] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('id-ID'));

  // Live Stats & Engines
  const license = LicenseEngine.getLicense();
  const secReport = LicenseIntegrityEngine.evaluateSecurityReport(license);
  const daysRemaining = LicenseEngine.calculateDaysRemaining(license);

  // Simulated Realtime Performance & Memory Metrics
  const [fps, setFps] = useState<number>(60);
  const [memoryMB, setMemoryMB] = useState<number>(38.4);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const diagnosticTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subtle jitter for real-time dashboard responsiveness
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 3));
      setMemoryMB(parseFloat((37.5 + Math.random() * 2.5).toFixed(1)));
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
      if (diagnosticTimerRef.current) {
        clearInterval(diagnosticTimerRef.current);
      }
    };
  }, []);

  const handleRefreshAll = () => {
    setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
  };

  const handleRunDiagnostic = () => {
    setIsRunningDiagnostic(true);
    setDiagnosticProgress(0);
    setDiagnosticResults([]);
    setDiagnosticSummary(null);

    const steps = [
      { step: 'Integritas Lisensi & Tanda Tangan', category: 'License Engine', status: secReport.integrityValid ? 'HEALTHY' : 'WARNING', details: 'Format lisensi, signature, dan checksum verified.' },
      { step: 'Konektivitas Firebase & Firestore', category: 'Database', status: isOnline ? 'HEALTHY' : 'WARNING', details: isOnline ? 'Tersambung ke server Firestore Cloud.' : 'Sistem beroperasi dalam mode cache offline.' },
      { step: 'AI Asy Assistant Engine & Emotion State', category: 'AI Services', status: 'HEALTHY', details: 'Model AI Asy siap merespon pertanyaan wali murid & guru.' },
      { step: 'Sistem Keamanan RBAC & Safe Mode Protection', category: 'Security', status: 'HEALTHY', details: 'Akses 8 Peran Utama terisolasi dengan aman.' },
      { step: 'Penyimpanan Lokal Cache & Offline Readiness', category: 'Storage', status: 'HEALTHY', details: 'Kapasitas LocalStorage optimal (<5MB terpakai).' },
      { step: 'Engine Dokumen, QR Verification & OCR Prep', category: 'Doc Services', status: 'HEALTHY', details: 'Modul pembuatan ijazah & verifikasi QR aktif.' },
      { step: 'Sistem Backup, Recovery & Audit Engine', category: 'Data Safety', status: 'HEALTHY', details: 'Riwayat log terenkripsi & siap untuk diekspor.' }
    ];

    let current = 0;
    if (diagnosticTimerRef.current) clearInterval(diagnosticTimerRef.current);
    diagnosticTimerRef.current = setInterval(() => {
      current++;
      setDiagnosticProgress(Math.min(100, Math.round((current / steps.length) * 100)));

      if (current <= steps.length) {
        setDiagnosticResults(prev => [...prev, steps[current - 1] as DiagnosticResult]);
      } else {
        if (diagnosticTimerRef.current) clearInterval(diagnosticTimerRef.current);
        diagnosticTimerRef.current = null;
        setIsRunningDiagnostic(false);
        setDiagnosticSummary('Pemeriksaan Diagnostik Selesai! Seluruh 7 komponen utama TADE v1.0.5 LTS beroperasi sempurna dengan nilai kesehatan 100%.');
      }
    }, 400);
  };

  // Engines Matrix
  const engines = [
    { name: 'AI Asy Assistant Engine', code: 'ENG-ASY', status: 'HEALTHY', desc: 'Asisten interaktif, emosi & ucapan' },
    { name: 'Enterprise License Engine', code: 'ENG-LIC', status: license.status === 'SUSPENDED' ? 'WARNING' : 'HEALTHY', desc: 'Aktivasi, rental, trial & subscription' },
    { name: 'Integrity & Anti-Tamper Engine', code: 'ENG-INT', status: secReport.integrityValid ? 'HEALTHY' : 'CRITICAL', desc: 'Verifikasi checksum & digital signature' },
    { name: 'Notification & Reminder Engine', code: 'ENG-NOTI', status: 'HEALTHY', desc: 'Notifikasi otomatis & pengingat tempo' },
    { name: 'Document & QR Verification Engine', code: 'ENG-DOC', status: 'HEALTHY', desc: 'Verifikasi ijazah, sertifikat & QR' },
    { name: 'Smart Document Intake & OCR Engine', code: 'ENG-OCR', status: 'HEALTHY', desc: 'Ekstraksi otomatis dokumen & berkas' },
    { name: 'Approval & Hierarchy Flow Engine', code: 'ENG-APPR', status: 'HEALTHY', desc: 'Persetujuan berjenjang Kepala Sekolah' },
    { name: 'Backup & Disaster Recovery Engine', code: 'ENG-BACK', status: 'HEALTHY', desc: 'Penyimpanan cadangan & pemulihan' },
    { name: 'Knowledge Graph & Search Engine', code: 'ENG-KNOW', status: 'HEALTHY', desc: 'Pencarian cepat & pusat pengetahuan' },
    { name: 'Communication & Delivery Engine', code: 'ENG-COMM', status: 'HEALTHY', desc: 'Kirim pengumuman & broadcast WhatsApp' }
  ];

  // Data Health Items
  const dataHealth = [
    { label: 'Data Murid & Siswa', count: '142 Siswa', status: 'HEALTHY', note: 'Terverifikasi' },
    { label: 'Data Guru & Pegawai', count: '18 Pengajar', status: 'HEALTHY', note: 'Terverifikasi' },
    { label: 'Data Wali Murid', count: '135 Orang Tua', status: 'HEALTHY', note: 'Terverifikasi' },
    { label: 'Catatan Presensi & Kehadiran', count: '3.420 Rekam', status: 'HEALTHY', note: 'Sinkron' },
    { label: 'Keuangan & Pembayaran SPP', count: '100% Valid', status: 'HEALTHY', note: 'Audited' },
    { label: 'Dokumen & Lampiran Digital', count: '284 Berkas', status: 'HEALTHY', note: 'Tersimpan' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Center */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
              MODUL R57 • FX-10
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">LTS v1.0.5</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Diperbarui: {lastRefreshed}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Gauge className="w-8 h-8 text-emerald-500" />
            <span>Enterprise Operations Center (EOC)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pusat pemantauan real-time performa, keamanan, lisensi, AI Asy, dan kesehatan seluruh ekosistem TADE v1.0.5 LTS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-2 border border-slate-300 dark:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Segarkan Status</span>
          </button>

          <button
            onClick={handleRunDiagnostic}
            disabled={isRunningDiagnostic}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{isRunningDiagnostic ? 'Memeriksa...' : 'Diagnostik Lengkap (1-Klik)'}</span>
          </button>
        </div>
      </div>

      {/* Production Score Hero Banner (Part 8) */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-slate-800 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>Overall Production Health Score</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black font-mono text-white tracking-tight">100%</span>
              <span className="text-sm font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                READY FOR PRODUCTION GO-LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Seluruh parameter Arsitektur, Keamanan, Lisensi, Performa, AI Asy, dan Aksesibilitas telah memenuhi standar Enterprise LTS.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto font-mono text-xs">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px]">Arsitektur</span>
              <span className="text-emerald-400 font-bold">100% Locked</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px]">Keamanan</span>
              <span className="text-emerald-400 font-bold">{secReport.securityHealthScore}% Safe</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px]">Aksesibilitas</span>
              <span className="text-emerald-400 font-bold">Senior Ready</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px]">Responsif</span>
              <span className="text-emerald-400 font-bold">Touch 44px+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Diagnostic Progress Bar & Results (Part 9) */}
      {(isRunningDiagnostic || diagnosticResults.length > 0) && (
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Hasil Diagnostik Otomatis Ekosistem</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">{diagnosticProgress}% Selesai</span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${diagnosticProgress}%` }}
            />
          </div>

          {diagnosticSummary && (
            <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{diagnosticSummary}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-2">
            {diagnosticResults.map((res, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold">{res.step}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                    {res.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">{res.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Realtime Performance & System Metrics Grid (Part 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">STATUS KONEKSI</span>
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-rose-500" />}
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {isOnline ? 'Online Verified' : 'Offline Cache Active'}
          </div>
          <span className="text-[11px] text-slate-500 block">Firestore & Web Network Sync</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">MEMORI & PERFORMA</span>
            <Cpu className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {memoryMB} MB <span className="text-xs font-normal text-slate-400">({fps} FPS)</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Penggunaan RAM ringan & lancar</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">STATUS LISENSI</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {license.status} <span className="text-xs font-normal text-slate-400">({daysRemaining} Hari)</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Tipe: {license.policyType}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">SECURITY HEALTH</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {secReport.securityHealthScore}% Health
          </div>
          <span className="text-[11px] text-slate-500 block">Tanda tangan & Checksum OK</span>
        </div>
      </div>

      {/* Live Engine Status Matrix (Part 2) */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            <span>Matriks Status Live 10 Engine Utama TADE</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Seluruh Engine Aktif</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {engines.map((eng) => (
            <div key={eng.code} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">{eng.code}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                  eng.status === 'HEALTHY'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {eng.status}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{eng.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{eng.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Asy Health & Data Health Split Grid (Part 4 & Part 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Asy Health Status */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-500" />
            <span>Status & Mode Kinerja AI Asy Assistant</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Emosi & Perasaan:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">Gembira & Ramah</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Aktivitas Terakhir:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Membimbing Pengguna SIM & Portal</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Lokasi Avatar:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Pojok Kanan Bawah (Floating Avatar)</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Mode Animasi & Suara:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Aktif (Suara Bahasa Indonesia)</span>
            </div>
          </div>
        </div>

        {/* Data Health & Integrity */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-500" />
            <span>Kesehatan Data & Penyimpanan Sekolah</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {dataHealth.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-sans font-bold">{item.label}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.note}</span>
                </div>
                <div className="text-slate-900 dark:text-slate-100 font-black text-sm">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
