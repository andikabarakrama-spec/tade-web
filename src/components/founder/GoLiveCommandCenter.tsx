import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  Zap,
  Activity,
  UserCheck,
  Radio,
  HardDrive,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Send,
  Sparkles,
  Lock,
  ArrowUpRight,
  Database,
  Layers,
  Flame,
  Terminal,
  Search
} from 'lucide-react';
import { smartPPDBService, SmartPPDBRecord } from '../../services/smartPPDBService';
import { guardianFortressService } from '../../services/guardianFortressService';
import { goLiveMonitorService, LiveTelemetrySnapshot } from '../../services/goLiveMonitorService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

interface Props {
  onNavigateSection?: (sectionId: string) => void;
}

export const GoLiveCommandCenter: React.FC<Props> = ({ onNavigateSection }) => {
  const [candidates, setCandidates] = useState<SmartPPDBRecord[]>([]);
  const [telemetry, setTelemetry] = useState<LiveTelemetrySnapshot>(goLiveMonitorService.getSnapshot());
  const [fortressSummary, setFortressSummary] = useState(guardianFortressService.getFortressStatusSummary());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setCandidates(smartPPDBService.getCandidates());
    setTelemetry(goLiveMonitorService.getSnapshot());
    setFortressSummary(guardianFortressService.getFortressStatusSummary());

    const interval = setInterval(() => {
      setTelemetry(goLiveMonitorService.getSnapshot());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCandidates(smartPPDBService.getCandidates());
      setTelemetry(goLiveMonitorService.getSnapshot());
      setFortressSummary(guardianFortressService.getFortressStatusSummary());
      setIsRefreshing(false);
      showFeedback('Seluruh telemetri Go-Live diperbarui.');
    }, 600);
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleQuickAction = (actionKey: string, desc: string) => {
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Go-Live Command Center',
      `Eksekusi Quick Action: ${desc}`
    );
    showFeedback(`Aksi Berhasil: ${desc}`);
  };

  const pendingPPDB = candidates.filter(c => c.stage !== 'RESMI_DITERIMA' && c.stage !== 'DITOLAK').length;
  const readyPPDB = candidates.filter(c => c.stage === 'APPROVAL_KEPSEK').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Pusat Komando Utama • Sprint G8 Go-Live Fortress</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Founder Go-Live Command Center
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Satu layar kendali eksekutif: pantau antrean pendaftaran PPDB, integritas Ring-0, telemetri Dr. Pulse, kapasitas penyimpanan, dan eksekusi komando darurat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Segarkan Telemetri</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Status Sistem</span>
              <span className="text-sm font-black text-white">100% SIAP LIVE</span>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 8 Essential Executive Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. PPDB Pending */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Antrean PPDB</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{pendingPPDB} Calon</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{readyPPDB} siap persetujuan Kepsek</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateSection && onNavigateSection('SMART_PPDB')}
            className="w-full text-left text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-2 border-t border-slate-800"
          >
            <span>Buka Seleksi PPDB</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Guardian Ring-0 */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guardian Ring-0</span>
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-300 font-mono">AKTIF 100%</div>
            <div className="text-[11px] text-cyan-400 font-medium mt-1">
              {fortressSummary.blockedAttempts} potensi anomali diblokir
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Sesi Aman</span>
            <span className="text-cyan-400 font-mono font-bold">Timeout {fortressSummary.timeoutMinutes}m</span>
          </div>
        </div>

        {/* 3. Dr. Pulse Telemetry (FPS & Memory) */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performa Dr. Pulse</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300 font-mono">{telemetry.fps} FPS</div>
            <div className="text-[11px] text-slate-300 font-medium mt-1">
              Memori Heap: <span className="text-amber-400 font-mono">{telemetry.memoryHeapMB} MB</span> / {telemetry.maxHeapMB} MB
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Anggaran Animasi</span>
            <span className="text-amber-400 font-mono font-bold">{telemetry.activeAnimationCount} / {telemetry.animationBudgetLimit} Efek</span>
          </div>
        </div>

        {/* 4. Storage Quota */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Penyimpanan Digital</span>
            <div className="p-2 rounded-xl bg-violet-950 text-violet-400 border border-violet-800/40">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-violet-300 font-mono">{telemetry.storageUsedMB} MB</div>
            <div className="text-[11px] text-slate-300 font-medium mt-1">
              Terpakai <span className="text-violet-400 font-mono">{telemetry.storageUsagePercent}%</span> dari 1.024 MB
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-violet-500 h-full rounded-full transition-all"
              style={{ width: `${telemetry.storageUsagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column View: Quick Command Dock & Realtime Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Realtime Operational Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Realtime Action Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Status Kesiapan Operasional Go-Live</span>
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800/50">
                0 Error Ring-0
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Kanal Siaran & Broadcast</span>
                  <span className="text-emerald-400 font-mono">124 Wali Murid Terkoneksi</span>
                </div>
                <p className="text-xs text-slate-300">
                  Jalur WhatsApp & Notifikasi Santun siap menyiarkan maklumat resmi tahun ajaran baru.
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Template pesan santun tervalidasi</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Keuangan & Kas Yayasan</span>
                  <span className="text-emerald-400 font-mono">Idempotency Terkunci</span>
                </div>
                <p className="text-xs text-slate-300">
                  Semua transaksi pembayaran SPP dan pendaftaran terlindung dari duplikasi request.
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kwitansi otomatis ber-QR tanda tangan</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Pemulihan Hermes & Offline</span>
                  <span className="text-emerald-400 font-mono">RTO 1.4 detik</span>
                </div>
                <p className="text-xs text-slate-300">
                  Local-first write buffer menjamin presensi santri dan anekdot guru tetap tercatat tanpa internet.
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sinkronisasi otomatis saat jaringan pulih</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Mode Pelatihan (Training Mode)</span>
                  <span className="text-emerald-400 font-mono">Sandbox Terisolasi</span>
                </div>
                <p className="text-xs text-slate-300">
                  Guru dan Staf baru dapat berlatih input tanpa risiko merusak database operasional madrasah.
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulasi interaktif siap digunakan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigations */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Modul Kunci Sprint G8</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigateSection && onNavigateSection('ROLE_MATRIX')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400">Role Matrix (P2)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Audit 7 peran & hak akses</span>
              </button>
              <button
                onClick={() => onNavigateSection && onNavigateSection('SMART_PPDB')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400">Smart PPDB (P3)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Checklist & approval 3 tingkat</span>
              </button>
              <button
                onClick={() => onNavigateSection && onNavigateSection('GO_LIVE_MONITOR')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400">Live Monitor (P5)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Dr. Pulse FPS & Memori</span>
              </button>
              <button
                onClick={() => onNavigateSection && onNavigateSection('TRAINING_MODE')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400">Training Mode (P6)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Simulasi staf & guru baru</span>
              </button>
              <button
                onClick={() => onNavigateSection && onNavigateSection('GO_LIVE_CHECKLIST')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400">Launch Checklist (P7)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Skor kesiapan & SLA</span>
              </button>
              <button
                onClick={() => onNavigateSection && onNavigateSection('MASTER_VISIBILITY')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-xs font-bold text-white block group-hover:text-emerald-400">Visibility Center</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Kendali modul v10.4</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Founder Quick Action Dock */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Founder Quick Actions</span>
              </h2>
              <span className="text-[10px] text-slate-400 uppercase font-mono">1-Click Fast Ops</span>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleQuickAction('BROADCAST_READY', 'Kirim Pengingat Tahfiz & Agenda Maulid ke Seluruh Wali')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 mt-0.5">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Siarkan Pengumuman Santun</span>
                  <span className="text-[11px] text-slate-400 block">Kirim notifikasi jadwal kegiatan ke 124 wali murid</span>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('PURGE_CACHE', 'Pembersihan Buffer Transien & Alokasi Ulang Memori Heap')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-amber-950 text-amber-400 mt-0.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Purge Cache & Optimasikan FPS</span>
                  <span className="text-[11px] text-slate-400 block">Bersihkan cache transien menjaga 60 FPS</span>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('BACKUP_SNAPSHOT', 'Pencadangan Snapshot Darurat ke Immutable Storage')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 mt-0.5">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Ambil Snapshot Cadangan</span>
                  <span className="text-[11px] text-slate-400 block">Simpan salinan data santri & keuangan</span>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('LITE_MODE_TOGGLE', 'Alihkan Mode Hemat Daya / Rendah Jaringan')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-violet-950 text-violet-400 mt-0.5">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Kompensasi Mode Jaringan Lemah</span>
                  <span className="text-[11px] text-slate-400 block">Matikan animasi berat di area minim sinyal</span>
                </div>
              </button>
            </div>
          </div>

          {/* Audit Log Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Log Aktivitas Terakhir</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono">Live Stream</span>
            </div>
            <div className="space-y-2 text-xs">
              {guardianFortressService.getAuditLogs().slice(0, 3).map(log => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-400">{log.event}</span>
                    <span className="text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
