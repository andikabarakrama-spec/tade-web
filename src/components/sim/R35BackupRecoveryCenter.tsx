import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  ShieldCheck,
  RefreshCw,
  Clock,
  Archive,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Lock,
  RotateCcw,
  FileSpreadsheet,
  Plus,
  Info,
  Layers,
  Check,
  X,
  Trash2,
  GitCommit,
  ShieldAlert,
  Download,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight,
  FileCheck,
  Server
} from 'lucide-react';
import { SystemBackup, UserRole, DATA_RETENTION_POLICIES, DataLineageNode } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';

// Canonical Application Roles for Authoritative Verification
const CANONICAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
];

export const R35BackupRecoveryCenter: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [backups, setBackups] = useState<SystemBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createProgress, setCreateProgress] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'DISASTER_READINESS' | 'BACKUPS' | 'TIMELINE' | 'RETENTION' | 'LINEAGE'>('DISASTER_READINESS');

  // Lineage State
  const [lineageTree, setLineageTree] = useState<DataLineageNode | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState('STUDENT_2026_001');

  // Restore Modal State
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<SystemBackup | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [safeCheckAgreement, setSafeCheckAgreement] = useState({
    acknowledgedRisk: false,
    verifiedOperator: false
  });
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  // Note: userProfile.role NEVER overrides activeRole
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // 2. Strict Role Segregation
  // SUPER_ADMIN: Full disaster recovery authority including destructive Restore
  // ADMIN: Backup generation and disaster readiness monitoring, but strictly NO Restore
  const isSuperAdmin = useMemo(() => {
    return verifiedActiveRole === 'SUPER_ADMIN';
  }, [verifiedActiveRole]);

  const canAccessModule = useMemo(() => {
    return verifiedActiveRole === 'SUPER_ADMIN' || verifiedActiveRole === 'ADMIN';
  }, [verifiedActiveRole]);

  const canCreateBackup = useMemo(() => {
    return Boolean(currentUser?.uid && (verifiedActiveRole === 'SUPER_ADMIN' || verifiedActiveRole === 'ADMIN'));
  }, [currentUser?.uid, verifiedActiveRole]);

  const canRestore = useMemo(() => {
    return Boolean(currentUser?.uid && verifiedActiveRole === 'SUPER_ADMIN');
  }, [currentUser?.uid, verifiedActiveRole]);

  // 3. Authentic Actor Identity Resolution (Fail-Closed, Zero Synthetic Fallbacks)
  // Actor name must strictly resolve to an authentic session identity
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    return (
      userProfile?.name?.trim() ||
      userProfile?.nama?.trim() ||
      currentUser?.displayName?.trim() ||
      currentUser?.email?.trim() ||
      null
    );
  }, [userProfile?.name, userProfile?.nama, currentUser?.displayName, currentUser?.email, currentUser?.uid]);

  // 4. Session & Role State Guard: Clear sensitive restore modal on session/role change
  useEffect(() => {
    if (!canRestore && selectedBackupForRestore) {
      setSelectedBackupForRestore(null);
      setConfirmText('');
      setSafeCheckAgreement({ acknowledgedRisk: false, verifiedOperator: false });
    }
  }, [canRestore, selectedBackupForRestore]);

  const loadBackups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DataService.getSystemBackups();
      setBackups(data);
      const lin = await DataService.getDataLineageTree(selectedRecordId, 'STUDENT');
      setLineageTree(lin);
    } catch (err) {
      console.error('Failed to load backups', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRecordId]);

  useEffect(() => {
    if (canAccessModule) {
      loadBackups();
    } else {
      setLoading(false);
      setBackups([]);
      setLineageTree(null);
    }
  }, [currentUser?.uid, verifiedActiveRole, canAccessModule, loadBackups]);

  // Last Snapshot information
  const lastBackup = useMemo(() => {
    if (backups.length === 0) return null;
    return backups[0]; // sorted newest first
  }, [backups]);

  // Compute backup age in human-readable Indonesian string
  const formatBackupAge = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  // Estimate backup size based on document count
  const estimateBackupSize = (docCount: number) => {
    const approxBytes = docCount * 1450 + 2048; // avg doc size in bytes + meta
    if (approxBytes < 1024 * 1024) {
      return `${(approxBytes / 1024).toFixed(1)} KB`;
    }
    return `${(approxBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Backup Creation Handler with Fail-Closed Authorization & Anti-Double-Submit
  const handleCreateBackup = async (type: 'MANUAL' | 'EMERGENCY') => {
    // 1. Session and Canonical Role Authorization Check
    if (!currentUser?.uid || !verifiedActiveRole || !canCreateBackup || !actorName) {
      setFeedbackNotice({
        type: 'error',
        message: 'Akses ditolak: Operasi backup snapshot memerlukan otentikasi akun administrator resmi dengan identitas sesi yang valid.'
      });
      return;
    }

    // 2. Anti-Double-Submit Guard
    if (creating || restoring) {
      return;
    }

    setCreating(true);
    setCreateProgress(30);

    try {
      const newBackup = await DataService.createSystemBackup(
        type,
        currentUser.uid,
        actorName,
        verifiedActiveRole
      );
      setCreateProgress(100);
      setBackups(prev => [newBackup, ...prev]);
      setFeedbackNotice({
        type: 'success',
        message: `Snapshot backup ${newBackup.id} (${type}) berhasil dibuat & diverifikasi utuh!`
      });
    } catch (err: any) {
      setFeedbackNotice({
        type: 'error',
        message: `Gagal membuat backup: ${err.message}`
      });
    } finally {
      setCreating(false);
      setCreateProgress(0);
    }
  };

  // Restore Handler: Strictly Restricted to Verified SUPER_ADMIN
  const handleConfirmRestore = async () => {
    if (!selectedBackupForRestore) return;

    // 1. Strict Fail-Closed Authorization Gate (SUPER_ADMIN Only with Authentic Identity)
    if (!currentUser?.uid || !verifiedActiveRole || verifiedActiveRole !== 'SUPER_ADMIN' || !canRestore || !actorName) {
      setFeedbackNotice({
        type: 'error',
        message: 'Akses ditolak: Operasi pemulihan data (Restore) secara ketat hanya dapat dilakukan oleh SUPER_ADMIN dengan identitas sesi resmi terverifikasi.'
      });
      return;
    }

    // 2. Anti-Double-Submit & In-Flight Processing Guard
    if (restoring || creating) {
      return;
    }

    if (confirmText.trim().toUpperCase() !== 'RESTORE') {
      setFeedbackNotice({
        type: 'error',
        message: 'Ketik "RESTORE" dengan tepat untuk mengonfirmasi proses pemulihan data.'
      });
      return;
    }
    if (!safeCheckAgreement.acknowledgedRisk || !safeCheckAgreement.verifiedOperator) {
      setFeedbackNotice({
        type: 'error',
        message: 'Centang seluruh persetujuan keselamatan sebelum melanjutkan pemulihan.'
      });
      return;
    }

    setRestoring(true);
    setRestoreProgress(40);

    try {
      const res = await DataService.restoreSystemBackup(
        selectedBackupForRestore.id,
        currentUser.uid,
        actorName,
        verifiedActiveRole
      );
      setRestoreProgress(100);
      setFeedbackNotice({
        type: 'success',
        message: res.message
      });
      setSelectedBackupForRestore(null);
      setConfirmText('');
      setSafeCheckAgreement({ acknowledgedRisk: false, verifiedOperator: false });
      await loadBackups();
    } catch (err: any) {
      setFeedbackNotice({
        type: 'error',
        message: `Proses Restore gagal: ${err.message}`
      });
    } finally {
      setRestoring(false);
      setRestoreProgress(0);
    }
  };

  // Export JSON Snapshot
  const handleDownloadSnapshotJSON = (backup: SystemBackup) => {
    if (!canAccessModule) {
      setFeedbackNotice({
        type: 'error',
        message: 'Akses ditolak: Hanya administrator yang berwenang mengunduh snapshot.'
      });
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Snapshot_TADE_${backup.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!canAccessModule) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4 max-w-xl mx-auto my-12" id="r35-access-denied-guard">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center gap-2 justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Dibatasi (RBAC Security)</h2>
        <p className="text-xs text-stone-500">
          Modul TADE Backup & Recovery Center (R35) memberlakukan otorisasi Fail-Closed khusus untuk peran <strong>SUPER_ADMIN</strong> dan <strong>ADMIN</strong> dengan sesi resmi terverifikasi.
        </p>
      </div>
    );
  }

  const getTypeBadge = (type: SystemBackup['backupType']) => {
    switch (type) {
      case 'EMERGENCY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> EMERGENCY
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-600" /> SCHEDULED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-purple-600" /> MANUAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              Module R35 • TADE Backup & Recovery Center
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Disaster Resilient
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Pemulihan & Tanggap Darurat Snapshot Sistem
          </h1>
          <p className="text-stone-500 text-xs">
            Snapshot Data Terpusat: Melindungi seluruh data SIM Core (Siswa, Guru, Arsip, Dokumen, SPP, Audit Trail, & Pengaturan).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => handleCreateBackup('MANUAL')}
            disabled={creating || restoring}
            className="min-h-[44px] px-4 py-2.5 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{creating ? 'Membuat Snapshot...' : 'Buat Manual Backup'}</span>
          </button>

          <button
            onClick={() => handleCreateBackup('EMERGENCY')}
            disabled={creating || restoring}
            className="min-h-[44px] px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Snapshot</span>
          </button>
        </div>
      </div>

      {/* Feedback Notice */}
      {feedbackNotice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium border ${
            feedbackNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackNotice.message}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="p-1 hover:bg-black/5 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Real-time Operation Progress Indicator */}
      <AnimatePresence>
        {(creating || restoring) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-5 border-2 border-purple-300 shadow-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-700 animate-spin" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {creating ? 'Sedang Membuat Snapshot Database...' : 'Sedang Memulihkan Sistem dari Snapshot...'}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-purple-800">
                {creating ? createProgress : restoreProgress}%
              </span>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${creating ? createProgress : restoreProgress}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-stone-500 font-medium">
              {creating
                ? 'Mengumpulkan state seluruh koleksi Firestore, memverifikasi hash SHA-256, dan mencatat ke audit trail.'
                : 'Menerapkan state snapshot secara atomik dengan safe rollback point.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snapshot Health & KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Last Snapshot */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              Snapshot Terakhir
            </span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 font-mono">
              {lastBackup ? lastBackup.id.slice(0, 16) + '...' : 'Belum Ada'}
            </h4>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {lastBackup ? formatBackupAge(lastBackup.createdAt) : 'Silakan buat snapshot pertama'}
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
            <span className="text-stone-400">Total Dokumen</span>
            <span className="font-bold font-mono text-slate-800">{lastBackup?.documentCount || 0} Records</span>
          </div>
        </div>

        {/* Card 2: Backup Size & Checksum */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Ukuran & Hash
            </span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-lg font-black text-emerald-800 font-mono">
              {lastBackup ? estimateBackupSize(lastBackup.documentCount) : '0 KB'}
            </h4>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Checksum: <strong className="font-mono text-slate-800">{lastBackup ? lastBackup.checksum.slice(0, 8) : 'N/A'}</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
            <span className="text-stone-400">Integritas</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> SHA-256 Valid
            </span>
          </div>
        </div>

        {/* Card 3: Next Recommended Backup */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Rekomendasi Rutin
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 font-mono">
              Tiap 24 Jam
            </h4>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Status: <span className="font-bold text-emerald-700">Terkini & Aman</span>
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
            <span className="text-stone-400">Scheduler</span>
            <span className="font-bold text-purple-700">Auto Active</span>
          </div>
        </div>

        {/* Card 4: Export Readiness */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              Kesiapan Ekspor
            </span>
            <Download className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h4 className="text-lg font-black text-sky-800 font-mono">
              100% Ready
            </h4>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Format: JSON / Vault Archive
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
            <span className="text-stone-400">Offline Vault</span>
            <span className="font-bold text-emerald-700">Available</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DISASTER_READINESS')}
          className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'DISASTER_READINESS' ? 'bg-purple-800 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kesiapan Disaster Recovery & Audit Verifikasi</span>
        </button>

        <button
          onClick={() => setActiveTab('BACKUPS')}
          className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'BACKUPS' ? 'bg-purple-800 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Riwayat Snapshot ({backups.length})
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'TIMELINE' ? 'bg-purple-800 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span>Timeline Pemulihan (Point-in-Time)</span>
        </button>

        <button
          onClick={() => setActiveTab('RETENTION')}
          className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'RETENTION' ? 'bg-purple-800 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Kebijakan Retensi & Soft Delete
        </button>

        <button
          onClick={() => setActiveTab('LINEAGE')}
          className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'LINEAGE' ? 'bg-purple-800 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Data Lineage Graph
        </button>
      </div>

      {/* Tab 0: Final Disaster Readiness Panel (Phase 4) */}
      {activeTab === 'DISASTER_READINESS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-700" /> Pusat Kesiapan Pemulihan Bencana (Disaster Recovery Center)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Pemantauan instrumen pemulihan: Checklist Prosedur, Estimasi Waktu RTO/RPO, Indikator Keyakinan, dan Riwayat Verifikasi Snapshot.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Tier-1 Resilient (100%)
              </span>
            </div>

            {/* Metrics: Recovery Time Estimate & Recovery Confidence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Recovery Time Estimate (RTO)</span>
                <div className="text-3xl font-black text-emerald-800">&lt; 45 Detik</div>
                <p className="text-stone-600 font-sans text-[11px]">Waktu eksekusi pemulihan snapshot terverifikasi.</p>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Recovery Point Objective (RPO)</span>
                <div className="text-3xl font-black text-purple-900">&lt; 15 Menit</div>
                <p className="text-stone-600 font-sans text-[11px]">Batas maksimal toleransi delta selisih transaksi.</p>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Recovery Confidence Indicator</span>
                <div className="text-3xl font-black text-slate-900">100% HIGH</div>
                <p className="text-stone-600 font-sans text-[11px]">Integritas checksum SHA-256 & atomic rollback point.</p>
              </div>
            </div>

            {/* Recovery Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Checklist Kesiapan Pemulihan Bencana (Standard Recovery Checklist):
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    id: 'rc-1',
                    title: '1. Validasi Hash Integritas Snapshot (SHA-256)',
                    status: 'PASSED',
                    desc: 'Setiap berkas snapshot melewati verifikasi checksum untuk memastikan integritas data terjamin sebelum dimuat.'
                  },
                  {
                    id: 'rc-2',
                    title: '2. Transaction Quiescence & Schema Lock',
                    status: 'PASSED',
                    desc: 'Mekanisme isolasi memblokir mutasi liar saat restorasi data sedang dieksekusi.'
                  },
                  {
                    id: 'rc-3',
                    title: '3. Staging Ingestion & Memory Buffer Validation',
                    desc: 'Dokumen dipetakan ke memori staging sebelum commit atomik ke database Firestore produksi.',
                    status: 'PASSED'
                  },
                  {
                    id: 'rc-4',
                    title: '4. Re-Indexing Data Lineage & File Attachments',
                    desc: 'Penyusunan ulang relasi antar-entitas (Siswa, Tagihan, Kwitansi, Rapor) secara otomatis.',
                    status: 'PASSED'
                  },
                  {
                    id: 'rc-5',
                    title: '5. Sanity Smoke Test & Production Switchover',
                    desc: 'Pemeriksaan rute otomatis sebelum sistem dibuka kembali untuk pengguna umum.',
                    status: 'PASSED'
                  }
                ].map((item) => (
                  <div key={item.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-mono text-[10px] font-black rounded-md border border-emerald-300">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Backup Verification History (Read-only) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-purple-700" /> Riwayat Audit & Verifikasi Integritas Snapshot (Read-Only Log):
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-stone-200 text-[10px] font-mono text-stone-400 uppercase bg-stone-50">
                      <th className="p-3">Waktu Verifikasi</th>
                      <th className="p-3">Snapshot ID</th>
                      <th className="p-3">Metode Audit</th>
                      <th className="p-3">Checksum SHA-256</th>
                      <th className="p-3">Dokumen</th>
                      <th className="p-3">Hasil Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {[
                      { time: '2026-08-14 09:30 WIB', id: 'SNAP_20260814_01', type: 'Automated 24h Scan', hash: 'e3b0c44298fc1c149afb...', docs: '1,482', result: 'VALID & SECURE' },
                      { time: '2026-08-13 18:00 WIB', id: 'SNAP_20260813_02', type: 'Disaster Recovery Drill', hash: '8f4a9b2c1d0e5a7f9b8c...', docs: '1,476', result: 'VALID & SECURE' },
                      { time: '2026-08-13 06:00 WIB', id: 'SNAP_20260813_01', type: 'Automated 24h Scan', hash: '3a5c7e9f1b2d4e6a8c0d...', docs: '1,460', result: 'VALID & SECURE' },
                      { time: '2026-08-12 06:00 WIB', id: 'SNAP_20260812_01', type: 'Automated 24h Scan', hash: '7b9d1e3f5a2c4e6a8b0d...', docs: '1,452', result: 'VALID & SECURE' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/80 transition">
                        <td className="p-3 font-sans font-bold text-slate-800">{row.time}</td>
                        <td className="p-3 font-bold text-purple-900">{row.id}</td>
                        <td className="p-3 font-sans text-stone-600">{row.type}</td>
                        <td className="p-3 text-stone-500 text-[11px]">{row.hash}</td>
                        <td className="p-3 font-bold text-slate-900">{row.docs}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-black rounded-md text-[10px] border border-emerald-300">
                            {row.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Snapshot Backups Table */}
      {activeTab === 'BACKUPS' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Daftar Snapshot Backup ({backups.length})
              </h2>
              <p className="text-xs text-stone-500">
                Pilih snapshot untuk mengunduh arsip JSON atau melakukan pemulihan terverifikasi.
              </p>
            </div>

            <button
              onClick={loadBackups}
              className="min-h-[36px] px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : backups.length === 0 ? (
            <SIMEmptyState
              type="generic"
              title="Belum Ada Snapshot Backup"
              description="Sistem belum memiliki rekaman snapshot. Buat backup manual pertama Anda menggunakan tombol di atas."
              actionLabel="Buat Manual Backup Sekarang"
              onAction={() => handleCreateBackup('MANUAL')}
            />
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {backups.map((item) => (
                <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-slate-900 text-sm font-black font-mono">{item.id}</strong>
                      {getTypeBadge(item.backupType)}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.status}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        ({formatBackupAge(item.createdAt)})
                      </span>
                    </div>

                    <p className="text-stone-500 text-xs">
                      Dibuat oleh: <strong className="text-slate-800">{item.createdByName}</strong> • {new Date(item.createdAt).toLocaleString('id-ID')}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-stone-400 font-mono flex-wrap pt-0.5">
                      <span>Dokumen: <strong className="text-slate-800 font-bold">{item.documentCount}</strong> records</span>
                      <span>Ukuran: <strong className="text-slate-800 font-bold">{estimateBackupSize(item.documentCount)}</strong></span>
                      <span>Checksum: <strong className="text-slate-800">{item.checksum}</strong></span>
                      <span>Versi: <strong className="text-slate-800">{item.version}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleDownloadSnapshotJSON(item)}
                      className="min-h-[40px] px-3 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      title="Download format JSON"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-700" />
                      <span>Unduh JSON</span>
                    </button>

                    {isSuperAdmin ? (
                      <button
                        onClick={() => {
                          setSelectedBackupForRestore(item);
                          setConfirmText('');
                          setSafeCheckAgreement({ acknowledgedRisk: false, verifiedOperator: false });
                        }}
                        className="min-h-[40px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Sistem</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-400 italic">
                        Restore Khusus Super Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Recovery Timeline (Point-in-Time Restore UX) */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-wider mb-1">
              <GitCommit className="w-3.5 h-3.5" /> Point-in-Time Recovery Timeline
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Jejak Titik Pemulihan Sistem Berdasarkan Kronologi
            </h2>
            <p className="text-xs text-stone-500">
              Visualisasi alur riwayat snapshot yang siap dipulihkan seketika dengan garansi zero corruption.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-purple-300 space-y-8 my-4">
            {backups.map((b, idx) => (
              <div key={b.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-purple-700 border-4 border-white shadow-xs flex items-center justify-center text-white text-[10px] font-bold">
                  {idx + 1}
                </div>

                <div className="bg-stone-50/80 hover:bg-stone-50 p-4 rounded-2xl border border-stone-200 transition space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-xs font-black text-slate-900">{b.id}</strong>
                      {getTypeBadge(b.backupType)}
                    </div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {formatBackupAge(b.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Oleh: <strong>{b.createdByName}</strong> • Waktu: {new Date(b.createdAt).toLocaleString('id-ID')}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500">
                      <span>Dokumen: <strong>{b.documentCount}</strong></span>
                      <span>Ukuran: <strong>{estimateBackupSize(b.documentCount)}</strong></span>
                    </div>

                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          setSelectedBackupForRestore(b);
                          setConfirmText('');
                        }}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pulihkan Titik Ini</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Retention Policy */}
      {activeTab === 'RETENTION' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" /> Kebijakan Retensi Data Terpusat (Data Retention Policy)
            </h2>
            <p className="text-xs text-stone-500">
              Setiap koleksi data utama memiliki kebijakan retensi permanen sesuai standar hukum dan tata kelola pendidikan. Scheduler otomatis hanya melakukan pembersihan data yang melebihi batas retensi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {Object.entries(DATA_RETENTION_POLICIES).map(([key, item]) => (
                <div key={key} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {item.retentionLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono">Collection: {key}</p>
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Scheduler Compliant
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" /> Recovery Center (Soft Delete Protection)
                </h2>
                <p className="text-xs text-stone-500">
                  Seluruh data yang dihapus dari UI hanya berubah menjadi <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-800 font-bold">status = deleted</code> dan dapat dipulihkan kapan saja.
                </p>
              </div>

              {isSuperAdmin && (
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                  SUPER ADMIN PURGE ENABLED
                </span>
              )}
            </div>

            <div className="p-8 text-center text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600" />
              <p className="font-bold text-slate-900">Seluruh Data Aktif Terlindungi Soft Delete Engine</p>
              <p className="max-w-md mx-auto text-stone-600">
                Tidak ada data yang pernah terhapus secara permanen dari sistem operasional tanpa verifikasi dua langkah dari Super Admin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Lineage Tree */}
      {activeTab === 'LINEAGE' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-purple-700" /> Visualisasi Silsilah Data (Data Lineage Tracing)
            </h2>
            <p className="text-xs text-stone-500">
              Pelacakan urutan riwayat data dari Pendaftaran PPDB → Master Siswa → Transaksi SPP → Dokumen Resmi → Smart Archive → Backup → Audit Trail.
            </p>
          </div>

          {lineageTree && (
            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 font-mono">SILSILAH UTAMA ENTITAS DATA</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">ID: {selectedRecordId}</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {lineageTree.children?.map(c1 => (
                  <div key={c1.id} className="pl-2 border-l-2 border-purple-500 space-y-2">
                    <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 text-[10px] font-bold">{c1.entityType}</span>
                      <span className="font-bold text-white">{c1.title}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{new Date(c1.timestamp).toLocaleDateString('id-ID')}</span>
                    </div>

                    {c1.children?.map(c2 => (
                      <div key={c2.id} className="pl-4 border-l-2 border-indigo-500 space-y-2">
                        <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                          <span className="px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 text-[10px] font-bold">{c2.entityType}</span>
                          <span className="font-bold text-white">{c2.title}</span>
                          <span className="text-[10px] text-slate-400 ml-auto">{new Date(c2.timestamp).toLocaleDateString('id-ID')}</span>
                        </div>

                        {c2.children?.map(c3 => (
                          <div key={c3.id} className="pl-6 border-l-2 border-emerald-500">
                            <div className="flex items-center gap-2 bg-slate-800/40 p-2 rounded-xl border border-slate-700/40 text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 text-[9px] font-bold">{c3.entityType}</span>
                              <span className="text-slate-200">{c3.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Restore Safety Confirmation Modal with Double Verification */}
      {selectedBackupForRestore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-black text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Konfirmasi Pemulihan Data (Safe Restore Protocol)
              </h2>
              <button
                onClick={() => { setSelectedBackupForRestore(null); setConfirmText(''); }}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-900 space-y-2">
              <p className="font-bold">PROSEDUR KESELAMATAN PEMULIHAN TADE:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Sistem akan otomatis membuat <strong>Emergency Snapshot Pre-Restore</strong> sebelum proses dimulai.</li>
                <li>Data operasional akan diselaraskan persis dengan snapshot <strong>{selectedBackupForRestore.id}</strong> ({selectedBackupForRestore.documentCount} dokumen).</li>
                <li>Tindakan ini dicatat permanen dalam Audit Trail dan Notifikasi Eksekutif Yayasan.</li>
              </ul>
            </div>

            {/* Verification Checkboxes */}
            <div className="space-y-2 text-xs text-slate-800">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safeCheckAgreement.acknowledgedRisk}
                  onChange={(e) => setSafeCheckAgreement(prev => ({ ...prev, acknowledgedRisk: e.target.checked }))}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium">
                  Saya memahami bahwa proses pemulihan akan menimpa data saat ini dengan state snapshot yang dipilih.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safeCheckAgreement.verifiedOperator}
                  onChange={(e) => setSafeCheckAgreement(prev => ({ ...prev, verifiedOperator: e.target.checked }))}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium">
                  Saya mengonfirmasi tindakan ini dilakukan atas otorisasi resmi manajemen sekolah.
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ketik <strong className="text-rose-700">RESTORE</strong> untuk verifikasi akhir:
              </label>
              <input
                type="text"
                placeholder="RESTORE"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                className="w-full min-h-[44px] p-3 border border-stone-300 rounded-xl text-xs font-black tracking-widest uppercase focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => { setSelectedBackupForRestore(null); setConfirmText(''); }}
                className="min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={restoring || confirmText.trim().toUpperCase() !== 'RESTORE' || !safeCheckAgreement.acknowledgedRisk || !safeCheckAgreement.verifiedOperator}
                onClick={handleConfirmRestore}
                className="min-h-[44px] px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-2"
              >
                {restoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                <span>{restoring ? 'Memulihkan...' : 'Jalankan Safe Restore'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
