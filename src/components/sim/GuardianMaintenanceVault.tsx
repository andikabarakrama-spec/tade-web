import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Cpu,
  Database,
  Lock,
  Zap,
  Activity,
  Filter,
  Search,
  Eye,
  Check,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Server
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export type BugSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueResolutionStatus = 'RESOLVED' | 'AUTO_REPAIRING' | 'PENDING_MANUAL' | 'VERIFIED';
export type QueueCategory = 'BUG_QUEUE' | 'AUTO_REPAIR' | 'MANUAL_REVIEW' | 'FIXED_HISTORY';

export interface MaintenanceIssue {
  id: string;
  code: string;
  module: string;
  moduleName: string;
  title: string;
  description: string;
  detectionTime: string;
  detectionTimeRelative: string;
  severity: BugSeverity;
  autoRepairEligible: boolean;
  autoRepairAction?: string;
  estimatedRepairSeconds?: number;
  status: IssueResolutionStatus;
  guardianVerified: boolean;
  requiresSuperAdminApproval: boolean;
  rootCause: string;
  remediation: string;
}

export const GuardianMaintenanceVault: React.FC = () => {
  const { userProfile, activeRole, currentUser } = useAuth();
  const currentRole: UserRole = activeRole || userProfile?.role || 'CALON_WALI_MURID';
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';

  const [activeQueue, setActiveQueue] = useState<QueueCategory>('BUG_QUEUE');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulatingRepair, setIsSimulatingRepair] = useState<string | null>(null);
  const [repairSuccessMap, setRepairSuccessMap] = useState<Record<string, boolean>>({});
  const [approvedActionMap, setApprovedActionMap] = useState<Record<string, boolean>>({});

  // Initial maintenance issues dataset
  const [issues, setIssues] = useState<MaintenanceIssue[]>([
    {
      id: 'maint-01',
      code: 'MT-401',
      module: 'R10/R11',
      moduleName: 'SPP & Kasir Pembayaran',
      title: 'Token Sesi Gateway Refresh Interval Desync',
      description: 'Handshake token refresh berkala pada WebSocket real-time channel mengalami jeda minor saat transisi background tab.',
      detectionTime: '2026-08-14 04:12 WIB',
      detectionTimeRelative: '37 menit yang lalu',
      severity: 'LOW',
      autoRepairEligible: true,
      autoRepairAction: 'Token refresh & background heartbeat re-align',
      estimatedRepairSeconds: 3,
      status: 'RESOLVED',
      guardianVerified: true,
      requiresSuperAdminApproval: false,
      rootCause: 'Browser power-saving suspension membatasi background timers.',
      remediation: 'Guardian heartbeat autonomous re-anchor diterapkan otomatis.'
    },
    {
      id: 'maint-02',
      code: 'MT-402',
      module: 'R16',
      moduleName: 'Buku Penghubung & Smart Dokumen',
      title: 'Unggahan Foto Portofolio Retry Queue Backlog',
      description: 'Antrean retry upload foto karya santri menumpuk 2 berkas akibat fluktuasi sinyal seluler lokal.',
      detectionTime: '2026-08-14 04:25 WIB',
      detectionTimeRelative: '24 menit yang lalu',
      severity: 'LOW',
      autoRepairEligible: true,
      autoRepairAction: 'Upload retry queue sync & exponential backoff flush',
      estimatedRepairSeconds: 4,
      status: 'RESOLVED',
      guardianVerified: true,
      requiresSuperAdminApproval: false,
      rootCause: 'Jaringan seluler pengirim mengalami packet loss sesaat.',
      remediation: 'IndexedDB offline buffer mengunggah ulang secara sekuensial dan tervalidasi SHA-256.'
    },
    {
      id: 'maint-03',
      code: 'MT-403',
      module: 'R6/R7',
      moduleName: 'E-Presensi & Geo-Radius',
      title: 'Pembersihan Temporary Cache Geolocation Buffer',
      description: 'Cache koordinat GPS presensi harian membutuhkan rotasi pembersihan berkala pasca jam pulang sekolah.',
      detectionTime: '2026-08-14 04:35 WIB',
      detectionTimeRelative: '14 menit yang lalu',
      severity: 'INFO',
      autoRepairEligible: true,
      autoRepairAction: 'Temporary cache cleanup & memory buffer compaction',
      estimatedRepairSeconds: 2,
      status: 'RESOLVED',
      guardianVerified: true,
      requiresSuperAdminApproval: false,
      rootCause: 'Siklus retensi harian memory presensi.',
      remediation: 'Garbage collection cache koordinat berhasil diselesaikan.'
    },
    {
      id: 'maint-04',
      code: 'MT-404',
      module: 'R13',
      moduleName: 'Verifikasi PPDB',
      title: 'Sinkronisasi Polling Status Dokumen Berkas Baru',
      description: 'Polling interval pembacaan berkas pendaftar baru membutuhkan penyesuaian adaptif pada beban puncak pendaftaran.',
      detectionTime: '2026-08-14 04:40 WIB',
      detectionTimeRelative: '9 menit yang lalu',
      severity: 'MEDIUM',
      autoRepairEligible: true,
      autoRepairAction: 'Polling restart & adaptive rate-throttle calibration',
      estimatedRepairSeconds: 5,
      status: 'RESOLVED',
      guardianVerified: true,
      requiresSuperAdminApproval: false,
      rootCause: 'Peningkatan serentak akses formulir calon santri.',
      remediation: 'Throttling adaptif diaktifkan dengan polling rate 15 detik.'
    },
    {
      id: 'maint-05',
      code: 'MT-501',
      module: 'R35/R40',
      moduleName: 'Disaster Recovery Vault',
      title: 'Permintaan Simulasi Uji Restore Database Sandbox',
      description: 'Uji berkala pemulihan snapshot cold-backup 24 jam pada lingkungan simulasi sandbox non-destruktif.',
      detectionTime: '2026-08-14 04:45 WIB',
      detectionTimeRelative: '4 menit yang lalu',
      severity: 'HIGH',
      autoRepairEligible: false,
      autoRepairAction: 'Restore sandbox snapshot drill (Super Admin Required)',
      estimatedRepairSeconds: 15,
      status: 'PENDING_MANUAL',
      guardianVerified: true,
      requiresSuperAdminApproval: true,
      rootCause: 'Jadwal tata kelola audit berkala ISO/IEC-27001.',
      remediation: 'Menunggu persetujuan Super Admin untuk eksekusi simulasi sandbox.'
    },
    {
      id: 'maint-06',
      code: 'MT-502',
      module: 'R2',
      moduleName: 'RBAC & Akses Pengguna',
      title: 'Permintaan Audit Penyelarasan Hak Akses Staf Pengganti',
      description: 'Permintaan verifikasi pemutakhiran role pendidik pengganti semester ganjil.',
      detectionTime: '2026-08-14 04:48 WIB',
      detectionTimeRelative: '1 menit yang lalu',
      severity: 'MEDIUM',
      autoRepairEligible: false,
      autoRepairAction: 'RBAC boundary validation (Super Admin Required)',
      estimatedRepairSeconds: 8,
      status: 'PENDING_MANUAL',
      guardianVerified: true,
      requiresSuperAdminApproval: true,
      rootCause: 'Rotasi penugasan wali kelas tahun ajaran baru.',
      remediation: 'Memerlukan persetujuan bertingkat Triple Verification Protocol.'
    }
  ]);

  // Filter issues based on queue tab and filters
  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      // Queue tab filter
      if (activeQueue === 'BUG_QUEUE' && item.status !== 'RESOLVED' && item.status !== 'VERIFIED') return true;
      if (activeQueue === 'AUTO_REPAIR' && item.autoRepairEligible && item.status !== 'RESOLVED') return true;
      if (activeQueue === 'MANUAL_REVIEW' && item.requiresSuperAdminApproval) return true;
      if (activeQueue === 'FIXED_HISTORY' && (item.status === 'RESOLVED' || item.status === 'VERIFIED')) return true;
      if (activeQueue === 'BUG_QUEUE') return true; // Show all in general bug queue

      // Severity filter
      if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMod = item.moduleName.toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchMod) return false;
      }

      return true;
    });
  }, [issues, activeQueue, selectedSeverity, searchQuery]);

  // System Health Summary stats
  const healthSummary = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter((i) => i.status === 'RESOLVED' || i.status === 'VERIFIED').length;
    const pendingReview = issues.filter((i) => i.requiresSuperAdminApproval && i.status === 'PENDING_MANUAL').length;
    const autoRepairedCount = issues.filter((i) => i.autoRepairEligible && i.status === 'RESOLVED').length;

    return {
      total,
      resolved,
      pendingReview,
      autoRepairedCount,
      autoRepairSuccessRate: '100%',
      guardianIntegrityScore: '100.0%',
      meanTimeToRepair: '3.4s'
    };
  }, [issues]);

  // Autonomous non-destructive repair simulation handler
  const handleSimulateAutoRepair = (issueId: string, seconds: number = 3) => {
    setIsSimulatingRepair(issueId);
    setTimeout(() => {
      setIssues((prev) =>
        prev.map((item) =>
          item.id === issueId
            ? { ...item, status: 'RESOLVED', guardianVerified: true, detectionTimeRelative: 'Baru saja diperbaiki' }
            : item
        )
      );
      setRepairSuccessMap((prev) => ({ ...prev, [issueId]: true }));
      setIsSimulatingRepair(null);
    }, seconds * 600);
  };

  // Super Admin approval handler for critical manual review actions
  const handleApproveSuperAdminAction = (issueId: string) => {
    setApprovedActionMap((prev) => ({ ...prev, [issueId]: true }));
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issueId
          ? { ...item, status: 'VERIFIED', guardianVerified: true, detectionTimeRelative: 'Disetujui Super Admin' }
          : item
      )
    );
  };

  const getSeverityBadge = (sev: BugSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-950 border-yellow-300';
      case 'LOW':
        return 'bg-blue-100 text-blue-950 border-blue-300';
      case 'INFO':
      default:
        return 'bg-stone-100 text-stone-900 border-stone-300';
    }
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black uppercase tracking-wider border border-emerald-300">
            <Wrench className="w-3.5 h-3.5 text-emerald-800" /> Guardian Autonomous Maintenance Vault • RC5
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Pemeliharaan Otonom & Perbaikan Mandiri (Maintenance Vault)
          </h1>
          <p className="text-stone-600 text-xs mt-0.5 max-w-3xl">
            Infrastruktur pemeliharaan non-destruktif dengan mekanisme auto-repair tervalidasi Guardian, antrean tinjauan manual Super Admin, serta kepatuhan penuh pada Konstitusi Federasi Guardian.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-200 text-xs font-mono">
            Tingkat Keberhasilan Auto-Repair: <strong className="text-emerald-800">100% (4/4 Selesai)</strong>
          </div>
        </div>
      </div>

      {/* System Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Total Isu Terdeteksi
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-mono">{healthSummary.total} Isu</span>
            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-mono font-bold rounded">
              RC5 Monitored
            </span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Dipantau terus menerus oleh Guardian Core & AI Asy.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Auto-Repaired Otonom
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-800 font-mono">{healthSummary.autoRepairedCount}</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded">
              Non-Destructive
            </span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Rata-rata waktu perbaikan: <strong>{healthSummary.meanTimeToRepair}</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Antrean Tinjauan Manual (Super Admin)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-800 font-mono">{healthSummary.pendingReview} Tindakan</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-950 text-[10px] font-black rounded">
              Triple Protocol
            </span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Memerlukan persetujuan eksplisit Super Admin.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Skor Integritas Guardian
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-800 font-mono">{healthSummary.guardianIntegrityScore}</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-700" /> Untouched
            </span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Semua invariant H0-01 s/d FIND-10-R1 tervalidasi.
          </p>
        </div>
      </div>

      {/* Triple Verification Protocol Box */}
      <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Protokol Verifikasi Tiga Lapis (Triple Verification Protocol)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            <strong>1. AI Asy</strong> menganalisis anomali &rarr; <strong>2. Guardian Core</strong> memvalidasi batas invariant tanpa mutasi berbahaya &rarr; <strong>3. Super Admin</strong> memegang otoritas tunggal untuk persetujuan tindakan kritis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg">
            Human Final Authority
          </span>
        </div>
      </div>

      {/* Queue Tabs & Filters */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          {/* Sub-Queue Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveQueue('BUG_QUEUE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                activeQueue === 'BUG_QUEUE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Antrean Isu Sistem ({issues.length})
            </button>

            <button
              onClick={() => setActiveQueue('AUTO_REPAIR')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                activeQueue === 'AUTO_REPAIR' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Auto Repair Queue (4)
            </button>

            <button
              onClick={() => setActiveQueue('MANUAL_REVIEW')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                activeQueue === 'MANUAL_REVIEW' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Tinjauan Manual Super Admin (2)
            </button>

            <button
              onClick={() => setActiveQueue('FIXED_HISTORY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                activeQueue === 'FIXED_HISTORY' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Riwayat Selesai & Terverifikasi (4)
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-mono">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 font-mono text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Tingkat</option>
              <option value="INFO">INFO</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-3 pt-2">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded border ${getSeverityBadge(issue.severity)}`}>
                    {issue.severity}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded">
                    {issue.code}
                  </span>
                  <span className="px-2 py-0.5 bg-stone-200 text-stone-800 font-mono text-[10px] font-bold rounded">
                    Modul {issue.module} • {issue.moduleName}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">{issue.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" /> {issue.detectionTimeRelative}
                  </span>
                  {issue.guardianVerified && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-black rounded-md border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" /> Guardian Verified
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {issue.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200 font-sans">
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Akar Masalah (Root Cause):</span>
                  <span className="text-stone-700 font-medium">{issue.rootCause}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Tindakan Remediasi (Remediation):</span>
                  <span className="text-stone-700 font-medium">{issue.remediation}</span>
                </div>
              </div>

              {/* Action and Resolution Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs font-mono flex items-center gap-2">
                  <span className="text-stone-500">Status Penyelesaian:</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                    issue.status === 'RESOLVED' || issue.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}>
                    {issue.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {issue.autoRepairEligible && issue.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleSimulateAutoRepair(issue.id, issue.estimatedRepairSeconds)}
                      disabled={isSimulatingRepair === issue.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                    >
                      {isSimulatingRepair === issue.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Memperbaiki Otonom ({issue.estimatedRepairSeconds}s)...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Jalankan Auto-Repair ({issue.estimatedRepairSeconds}s)
                        </>
                      )}
                    </button>
                  )}

                  {issue.requiresSuperAdminApproval && issue.status === 'PENDING_MANUAL' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        Super Admin Approval Required
                      </span>
                      {isSuperAdmin ? (
                        <button
                          onClick={() => handleApproveSuperAdminAction(issue.id)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Setujui Tindakan (Triple Protocol)
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-mono italic">
                          (Masuk sebagai Super Admin untuk menyetujui)
                        </span>
                      )}
                    </div>
                  )}

                  {(issue.status === 'RESOLVED' || issue.status === 'VERIFIED') && (
                    <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-mono font-medium rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai Tanpa Efek Samping
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
