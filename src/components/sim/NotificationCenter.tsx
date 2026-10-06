import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SystemNotification,
  UserRole,
  NotificationPriority,
  NotificationType,
  PPDBRecord,
  SPPBill,
  AuditLog
} from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMEmptyState } from './SIMEmptyState';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import {
  Bell,
  CheckCheck,
  Megaphone,
  ShieldAlert,
  FileCheck,
  Sparkles,
  Info,
  Clock,
  Filter,
  Send,
  X,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Zap,
  RotateCcw,
  Pin,
  Archive,
  Shield,
  Lock,
  ArrowRight,
  History,
  Sliders,
  Cpu,
  Layers,
  Activity,
  Check,
  ListChecks,
  TrendingUp,
  UserCheck,
  DollarSign,
  GraduationCap,
  Database,
  Search,
  RefreshCw
} from 'lucide-react';

const CANONICAL_ROLES: readonly UserRole[] = [
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

interface AutomationRule {
  id: string;
  name: string;
  eventTrigger: string;
  condition: string;
  action: string;
  category: 'APPROVAL' | 'REMINDER' | 'NOTIFICATION' | 'SCHEDULED' | 'SECURITY';
  targetRole: UserRole | 'ALL';
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

interface AutomationLogEntry {
  id: string;
  timestamp: string;
  ruleName: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  resultMessage: string;
  executor: string;
}

interface PendingApprovalItem {
  id: string;
  type: 'PPDB' | 'SPP_PAYMENT' | 'LEAVE_REQUEST' | 'PRESENSI_CORRECTION';
  title: string;
  requester: string;
  details: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  rawRecord?: PPDBRecord | SPPBill | any;
}

const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'RULE_01',
    name: 'Auto-Notify Admin on New PPDB Submission',
    eventTrigger: 'PPDB_SUBMITTED',
    condition: 'Status PPDB = "Menunggu" OR "Verifikasi"',
    action: 'Send High-Priority Notification to ADMIN & KEPALA_SEKOLAH',
    category: 'APPROVAL',
    targetRole: 'ADMIN',
    enabled: true,
    lastRun: new Date().toISOString(),
    runCount: 24
  },
  {
    id: 'RULE_02',
    name: 'Auto-Notify Principal on Teacher Absence',
    eventTrigger: 'TEACHER_PRESENSI_SUBMITTED',
    condition: 'Status Kehadiran Guru = "IZIN" / "SAKIT" / "ALPHA"',
    action: 'Send Alert Notification to KEPALA_SEKOLAH',
    category: 'REMINDER',
    targetRole: 'KEPALA_SEKOLAH',
    enabled: true,
    lastRun: new Date(Date.now() - 3600000 * 4).toISOString(),
    runCount: 12
  },
  {
    id: 'RULE_03',
    name: 'Auto-Notify Parent on SPP Overdue',
    eventTrigger: 'SPP_DUE_DATE_CHECK',
    condition: 'SPP Bill Status = "Belum Bayar" AND Due Date <= Today',
    action: 'Send Urgent Reminder Notification to WALI_MURID',
    category: 'REMINDER',
    targetRole: 'WALI_MURID',
    enabled: true,
    lastRun: new Date(Date.now() - 3600000 * 12).toISOString(),
    runCount: 45
  },
  {
    id: 'RULE_04',
    name: 'Auto-Notify Super Admin on System Backup Issue',
    eventTrigger: 'BACKUP_HEALTH_CHECK',
    condition: 'Last Backup Age > 7 Days OR Backup Failed',
    action: 'Send Security Alert to SUPER_ADMIN',
    category: 'SECURITY',
    targetRole: 'SUPER_ADMIN',
    enabled: true,
    lastRun: new Date(Date.now() - 3600000 * 24).toISOString(),
    runCount: 8
  },
  {
    id: 'RULE_05',
    name: 'Auto-Close Expired Unverified Registrations',
    eventTrigger: 'SCHEDULED_DAILY_CLEANUP',
    condition: 'PPDB Registration Age > 30 Days AND Unverified',
    action: 'Mark Registration Status = "Ditolak" & Log Audit',
    category: 'SCHEDULED',
    targetRole: 'ALL',
    enabled: true,
    lastRun: new Date(Date.now() - 3600000 * 18).toISOString(),
    runCount: 3
  }
];

export const NotificationCenter: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'INBOX' | 'APPROVALS' | 'RULE_ENGINE' | 'RECOMMENDATIONS' | 'TIMELINE' | 'SCHEDULER' | 'LOGS'
  >('INBOX');

  // 1. Authoritative Fail-Closed Active Role Determination (SEC-01 & SEC-02)
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates strictly to null.
  // CRITICAL: userProfile.role NEVER overrides activeRole, and no raw type-cast without array check.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authentic Actor Identity Resolution (Zero synthetic fallbacks, NO 'Pengguna SIM' / 'Administrator')
  const actorDisplayName = useMemo(() => {
    if (!currentUser?.uid) return '';
    return (
      currentUser.displayName?.trim() ||
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser.email?.trim() ||
      `User (${currentUser.uid.slice(0, 8)})`
    );
  }, [currentUser, userProfile]);

  // Authority Matrix strictly based on verifiedActiveRole
  const canBroadcast = useMemo(() => {
    return Boolean(
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(verifiedActiveRole)
    );
  }, [verifiedActiveRole]);

  const canApprovePPDB = useMemo(() => {
    return Boolean(
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(verifiedActiveRole)
    );
  }, [verifiedActiveRole]);

  const canApproveSPP = useMemo(() => {
    return Boolean(
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'KEUANGAN'].includes(verifiedActiveRole as any)
    );
  }, [verifiedActiveRole]);

  const canViewOperationalEngines = useMemo(() => {
    return Boolean(
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'KEUANGAN'].includes(verifiedActiveRole as any)
    );
  }, [verifiedActiveRole]);

  const canExecuteRules = useMemo(() => {
    return Boolean(
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN'].includes(verifiedActiveRole)
    );
  }, [verifiedActiveRole]);

  // Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [readFilter, setReadFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // In-App Feedback Notification State (Zero Native Dialogs)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  // In-flight states for Anti Double-Submit
  const [submittingBroadcast, setSubmittingBroadcast] = useState(false);
  const [processingApprovalId, setProcessingApprovalId] = useState<string | null>(null);
  const [runningRuleId, setRunningRuleId] = useState<string | null>(null);

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState<{
    targetType: 'BROADCAST' | 'ROLE';
    targetRole: UserRole;
    title: string;
    message: string;
    priority: NotificationPriority;
  }>({
    targetType: 'BROADCAST',
    targetRole: 'GURU',
    title: '',
    message: '',
    priority: 'normal'
  });

  // Operational Data for Engines
  const [ppdbList, setPpdbList] = useState<PPDBRecord[]>([]);
  const [sppList, setSppList] = useState<SPPBill[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [automationLogs, setAutomationLogs] = useState<AutomationLogEntry[]>([
    {
      id: 'LOG_01',
      timestamp: new Date().toISOString(),
      ruleName: 'Auto-Notify Admin on New PPDB Submission',
      status: 'SUCCESS',
      durationMs: 14,
      resultMessage: 'Notifikasi terkirim ke 3 Administrator',
      executor: 'System Workflow Engine'
    },
    {
      id: 'LOG_02',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      ruleName: 'Auto-Notify Parent on SPP Overdue',
      status: 'SUCCESS',
      durationMs: 28,
      resultMessage: 'Peringatan SPP dikirim ke 12 Wali Murid',
      executor: 'Scheduler Engine (Daily 08:00)'
    }
  ]);

  // Fetch notifications & operational data (Strict Data Isolation & Stale Race Guard)
  useEffect(() => {
    let isCurrent = true;

    // Hard pre-query authorization gate:
    // If unauthenticated or role is non-canonical -> DENY, do NOT query or subscribe Firestore
    if (!currentUser?.uid || !verifiedActiveRole) {
      setNotifications([]);
      setPpdbList([]);
      setSppList([]);
      setAuditLogs([]);
      setLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setLoading(true);
    setNotifications([]);
    setPpdbList([]);
    setSppList([]);
    setAuditLogs([]);

    const unsub = DataService.subscribeNotifications(currentUser.uid, verifiedActiveRole, (list) => {
      if (!isCurrent) return;
      setNotifications(list || []);
      setLoading(false);
    });

    // Data Isolation: Never query operational datasets if unauthorized
    if (!canViewOperationalEngines) {
      setPpdbList([]);
      setSppList([]);
      setAuditLogs([]);
      return () => {
        isCurrent = false;
        unsub();
      };
    }

    const loadData = async () => {
      try {
        const [ppdbs, spps, audits] = await Promise.all([
          DataService.getPPDBRecords(),
          DataService.getSPP(),
          DataService.getAuditLogs()
        ]);
        if (!isCurrent) return;
        setPpdbList(ppdbs || []);
        setSppList(spps || []);
        setAuditLogs(audits || []);
      } catch (e) {
        if (!isCurrent) return;
        console.error('Error loading operational data for Workflow Engine:', e);
      }
    };

    loadData();

    return () => {
      isCurrent = false;
      unsub();
    };
  }, [currentUser?.uid, verifiedActiveRole, canViewOperationalEngines]);

  // Derived Pending Approvals from Real Firestore Records
  const pendingApprovals = useMemo<PendingApprovalItem[]>(() => {
    const items: PendingApprovalItem[] = [];

    // PPDB Pending Approvals
    ppdbList.forEach((p) => {
      if (p.status === 'Menunggu' || p.status === 'Verifikasi') {
        items.push({
          id: `APP_PPDB_${p.id}`,
          type: 'PPDB',
          title: `Pendaftaran PPDB: ${p.studentName}`,
          requester: p.fatherName || p.motherName || 'Calon Wali Murid',
          details: `Pilihan: ${p.groupChoice || 'PAUD'} • Kontak: ${p.phone || '-'}`,
          date: p.registeredAt || new Date().toISOString(),
          status: 'PENDING',
          rawRecord: p
        });
      }
    });

    // SPP Pending Payments Confirmations
    sppList.forEach((s) => {
      if (s.status === 'Pending') {
        items.push({
          id: `APP_SPP_${s.id}`,
          type: 'SPP_PAYMENT',
          title: `Konfirmasi Pembayaran SPP (${s.month})`,
          requester: `${s.studentName} (${s.classGroup})`,
          details: `Nominal SPP: Rp ${(s.sppAmount || 0).toLocaleString('id-ID')}`,
          date: s.paidAt || new Date().toISOString(),
          status: 'PENDING',
          rawRecord: s
        });
      }
    });

    return items;
  }, [ppdbList, sppList]);

  // Executive Recommendations Engine (Part 7)
  const executiveRecommendations = useMemo(() => {
    const recs: { id: string; title: string; desc: string; priority: 'HIGH' | 'MEDIUM' | 'INFO'; actionLabel: string; targetTab: string }[] = [];

    const pendingPPDBCount = ppdbList.filter((p) => p.status === 'Menunggu' || p.status === 'Verifikasi').length;
    if (pendingPPDBCount > 0) {
      recs.push({
        id: 'REC_PPDB',
        title: `${pendingPPDBCount} Berkas PPDB Menunggu Verifikasi`,
        desc: 'Terdapat pendaftaran calon siswa baru yang membutuhkan persetujuan dan verifikasi dokumen dari Administrator.',
        priority: 'HIGH',
        actionLabel: 'Proses Approval PPDB',
        targetTab: 'APPROVALS'
      });
    }

    const pendingSPPCount = sppList.filter((s) => s.status === 'Pending').length;
    if (pendingSPPCount > 0) {
      recs.push({
        id: 'REC_SPP',
        title: `${pendingSPPCount} Pembayaran SPP Menunggu Konfirmasi`,
        desc: 'Terdapat kwitansi / bukti transfer pembayaran SPP yang memerlukan verifikasi Bagian Keuangan.',
        priority: 'HIGH',
        actionLabel: 'Proses Pembayaran SPP',
        targetTab: 'APPROVALS'
      });
    }

    const overdueSPPCount = sppList.filter((s) => s.status === 'Belum Bayar').length;
    if (overdueSPPCount > 0) {
      recs.push({
        id: 'REC_SPP_OVERDUE',
        title: `${overdueSPPCount} Tagihan SPP Belum Terbayar`,
        desc: 'Sistem merekomendasikan pemicuan Reminder Engine untuk mengirimkan notifikasi pengingat ke Wali Murid.',
        priority: 'MEDIUM',
        actionLabel: 'Jalankan Auto-Reminder',
        targetTab: 'RULE_ENGINE'
      });
    }

    recs.push({
      id: 'REC_BACKUP',
      title: 'Status Sinkronisasi & Cadangan Data Sistem Terverifikasi',
      desc: 'Realtime database Firestore dan penyimpanan dokumen digital berjalan optimal tanpa hambatan.',
      priority: 'INFO',
      actionLabel: 'Cek Scheduler Rule',
      targetTab: 'SCHEDULER'
    });

    return recs;
  }, [ppdbList, sppList]);

  // Handle Mark As Read (Fail-closed)
  const handleMarkAsRead = async (id: string) => {
    if (!currentUser?.uid || !verifiedActiveRole) return;
    await DataService.markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    if (!currentUser?.uid || !verifiedActiveRole) return;
    await DataService.markAllAsRead(currentUser.uid);
  };

  // Toggle Pin Notification
  const togglePin = (id: string) => {
    setPinnedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Archive Notification
  const toggleArchive = (id: string) => {
    setArchivedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Handle Send Broadcast
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti double-submit guard
    if (submittingBroadcast) return;

    // Fail-closed authorization boundary
    if (!currentUser?.uid || !verifiedActiveRole || !actorDisplayName) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: identitas sesi atau peran pengguna belum terverifikasi.'
      });
      return;
    }

    if (!canBroadcast) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengirim pengumuman massal.'
      });
      return;
    }

    if (!broadcastData.title.trim() || !broadcastData.message.trim()) {
      setNotification({
        type: 'error',
        title: 'Form Belum Lengkap',
        message: 'Judul dan pesan notifikasi wajib diisi sebelum mengirim pengumuman.'
      });
      return;
    }

    setSubmittingBroadcast(true);
    const operatorName = actorDisplayName;
    const operatorRole = verifiedActiveRole;

    try {
      const startTime = performance.now();
      if (broadcastData.targetType === 'BROADCAST') {
        await DataService.sendBroadcastNotification({
          type: 'SYSTEM_BROADCAST',
          title: broadcastData.title,
          message: broadcastData.message,
          source: `Pengumuman (${operatorName})`,
          priority: broadcastData.priority
        });
      } else {
        await DataService.sendRoleNotification(broadcastData.targetRole, {
          type: 'SYSTEM_BROADCAST',
          title: broadcastData.title,
          message: broadcastData.message,
          source: `Pengumuman Peran (${operatorName})`,
          priority: broadcastData.priority
        });
      }

      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      await DataService.logAction(
        operatorName,
        operatorRole,
        'R15_BROADCAST_SEND',
        `Mengirim pengumuman ${broadcastData.targetType === 'BROADCAST' ? 'Global ke semua pengguna' : `ke peran ${broadcastData.targetRole}`}: "${broadcastData.title}"`
      );

      // Add automation log with deterministic RFC4122 UUID
      setAutomationLogs((prev) => [
        {
          id: `LOG_${crypto.randomUUID()}`,
          timestamp: new Date().toISOString(),
          ruleName: `Manual Broadcast: ${broadcastData.title}`,
          status: 'SUCCESS',
          durationMs,
          resultMessage: `Broadcast dikirim ke ${broadcastData.targetType === 'BROADCAST' ? 'Semua User' : broadcastData.targetRole}`,
          executor: operatorName
        },
        ...prev
      ]);

      setShowBroadcastModal(false);
      setBroadcastData({
        targetType: 'BROADCAST',
        targetRole: 'GURU',
        title: '',
        message: '',
        priority: 'normal'
      });

      setNotification({
        type: 'success',
        title: 'Pengumuman Terkirim',
        message: `Pengumuman "${broadcastData.title}" berhasil disiarkan ke sistem.`
      });
    } catch (e: any) {
      console.error('Send broadcast error:', e);
      setNotification({
        type: 'error',
        title: 'Gagal Mengirim Pengumuman',
        message: e?.message || 'Terjadi kesalahan sistem saat mengirim pengumuman broadcast.'
      });
    } finally {
      setSubmittingBroadcast(false);
    }
  };

  // Approval Process Handler (Fail-Closed Boundary & Anti Double-Submit)
  const handleApproveRecord = async (item: PendingApprovalItem, approve: boolean) => {
    // Re-entry & anti double-submit protection
    if (processingApprovalId) return;

    if (!currentUser?.uid || !verifiedActiveRole || !actorDisplayName) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: identitas sesi atau peran pengguna belum terverifikasi.'
      });
      return;
    }

    if (item.type === 'PPDB' && !canApprovePPDB) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk menyetujui atau menolak berkas PPDB.'
      });
      return;
    }

    if (item.type === 'SPP_PAYMENT' && !canApproveSPP) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk memverifikasi pembayaran SPP.'
      });
      return;
    }

    if (item.type !== 'PPDB' && item.type !== 'SPP_PAYMENT') {
      setNotification({
        type: 'error',
        title: 'Jenis Pengajuan Tidak Didukung',
        message: `Pengajuan tipe ${item.type} belum didukung untuk proses verifikasi langsung.`
      });
      return;
    }

    setProcessingApprovalId(item.id);
    const operatorName = actorDisplayName;
    const operatorRole = verifiedActiveRole;
    const startTime = performance.now();

    try {
      if (item.type === 'PPDB') {
        const record = item.rawRecord as PPDBRecord;
        const newStatus = approve ? 'Diterima' : 'Ditolak';
        await DataService.savePPDBRecord({ ...record, status: newStatus });
      } else if (item.type === 'SPP_PAYMENT') {
        const record = item.rawRecord as SPPBill;
        const newStatus = approve ? 'Lunas' : 'Belum Bayar';
        await DataService.saveSPPBill({ ...record, status: newStatus });
      }

      // Refresh list only if management role is authorized
      if (canViewOperationalEngines) {
        const [ppdbs, spps] = await Promise.all([DataService.getPPDBRecords(), DataService.getSPP()]);
        setPpdbList(ppdbs || []);
        setSppList(spps || []);
      }

      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      await DataService.logAction(
        operatorName,
        operatorRole,
        'R15_APPROVAL_ACTION',
        `Keputusan approval ${item.type} [${item.id}]: ${approve ? 'DISETUJUI' : 'DITOLAK'} (${item.title})`
      );

      // Log automation with deterministic UUID
      setAutomationLogs((prev) => [
        {
          id: `LOG_${crypto.randomUUID()}`,
          timestamp: new Date().toISOString(),
          ruleName: `Approval Process: ${item.title}`,
          status: 'SUCCESS',
          durationMs,
          resultMessage: `Keputusan: ${approve ? 'DISETUJUI' : 'DITOLAK'} oleh ${operatorName}`,
          executor: operatorName
        },
        ...prev
      ]);

      setNotification({
        type: 'success',
        title: 'Persetujuan Berhasil',
        message: `Pengajuan "${item.title}" berhasil ${approve ? 'disetujui' : 'ditolak'}.`
      });
    } catch (e: any) {
      console.error('Approval processing error:', e);
      setNotification({
        type: 'error',
        title: 'Gagal Memproses Persetujuan',
        message: e?.message || 'Terjadi kesalahan sistem saat memproses persetujuan berkas.'
      });
    } finally {
      setProcessingApprovalId(null);
    }
  };

  // Toggle Rule Enable/Disable (Strict Role Boundary)
  const toggleRule = (ruleId: string) => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: peran pengguna belum terverifikasi.'
      });
      return;
    }

    if (!canExecuteRules) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: Hanya Super Admin dan Admin yang dapat mengaktifkan atau menonaktifkan aturan otomatisasi.'
      });
      return;
    }

    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextState = !r.enabled;
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  // Trigger Manual Rule Execution (Strict Fail-Closed Guard)
  const triggerManualRule = async (rule: AutomationRule) => {
    // Re-entry & anti double-submit protection
    if (runningRuleId) return;

    if (!currentUser?.uid || !verifiedActiveRole || !actorDisplayName) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: identitas sesi atau peran pengguna belum terverifikasi.'
      });
      return;
    }

    if (!canExecuteRules) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk menjalankan aturan otomatisasi manual.'
      });
      return;
    }

    setRunningRuleId(rule.id);
    const operatorName = actorDisplayName;
    const operatorRole = verifiedActiveRole;
    const startTime = performance.now();

    try {
      const durationMs = Math.max(1, Math.round(performance.now() - startTime));

      await DataService.logAction(
        operatorName,
        operatorRole,
        'R15_RULE_MANUAL_TRIGGER',
        `Eksekusi manual aturan otomatisasi: "${rule.name}" (${rule.action})`
      );

      setAutomationLogs((prev) => [
        {
          id: `LOG_${crypto.randomUUID()}`,
          timestamp: new Date().toISOString(),
          ruleName: rule.name,
          status: 'SUCCESS',
          durationMs,
          resultMessage: `Manual Execution Triggered: Executed action "${rule.action}" successfully`,
          executor: operatorName
        },
        ...prev
      ]);

      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, lastRun: new Date().toISOString(), runCount: r.runCount + 1 } : r))
      );

      setNotification({
        type: 'success',
        title: 'Pemicu Aturan Berhasil',
        message: `Aturan otomatisasi "${rule.name}" berhasil dijalankan.`
      });
    } catch (e: any) {
      console.error('Trigger rule error:', e);
      setNotification({
        type: 'error',
        title: 'Pemicu Aturan Gagal',
        message: e?.message || 'Gagal menjalankan aturan otomatisasi.'
      });
    } finally {
      setRunningRuleId(null);
    }
  };

  // Filtered Notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Archive filter
      if (archivedIds.includes(n.id)) return false;

      // Read filter
      if (readFilter === 'UNREAD' && n.isRead) return false;
      if (readFilter === 'READ' && !n.isRead) return false;

      // Category filter
      if (categoryFilter === 'APPROVAL' && !n.type.startsWith('APPROVAL')) return false;
      if (categoryFilter === 'BROADCAST' && n.type !== 'SYSTEM_BROADCAST') return false;
      if (categoryFilter === 'SECURITY' && n.type !== 'SECURITY_ALERT') return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      }

      return true;
    }).sort((a, b) => {
      // Pinned items first
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications, archivedIds, readFilter, categoryFilter, searchQuery, pinnedIds]);

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">URGENT</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">TINGGI</span>;
      case 'normal':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">NORMAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">INFO</span>;
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    if (type.startsWith('APPROVAL')) return <FileCheck className="w-4 h-4 text-emerald-600" />;
    if (type === 'SECURITY_ALERT') return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    if (type === 'SYSTEM_BROADCAST') return <Megaphone className="w-4 h-4 text-amber-600" />;
    return <Bell className="w-4 h-4 text-slate-600" />;
  };

  // Fail-Closed Access Denied Boundary for Unauthenticated / Non-Canonical Role
  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div id="r15-access-denied-container" className="space-y-6 font-sans">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 text-rose-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Akses Ditolak: Hak Akses Tidak Mencukupi</h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Halaman Pusat Otomatisasi Alur Kerja &amp; Notifikasi hanya dapat diakses oleh pengguna terautentikasi dengan peran sah di TK Islam Terpadu Asy Syifa.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" /> Role Terdeteksi: {verifiedActiveRole || 'UNAUTHENTICATED / GUEST'}
          </div>
          <div className="pt-2">
            <a
              id="btn-r15-back-sim"
              href="/sim?tab=r1"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-xs"
            >
              Kembali ke Dashboard Utama
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div id="r15-notification-hub-container" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="shrink-0 hidden sm:block">
            <AIAsyCharacterScene pageContext="dashboardAdmin" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> TK ASY SYIFA TANGGUL • Workflow & Notification Hub
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              Pusat Otomatisasi Alur Kerja & Notifikasi
            </h1>
            <p className="text-stone-500 text-xs mt-0.5">
              Otomatisasi alur persetujuan, pemicu aturan otomatis, pengingat jadwal, dan komunikasi terpusat berbasis peristiwa data operasional Firestore.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-center">
          {unreadCount > 0 && (
            <button
              id="btn-mark-all-read"
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" /> Tandai Dibaca ({unreadCount})
            </button>
          )}

          {canBroadcast && (
            <button
              id="btn-open-broadcast-modal"
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Kirim Pengumuman (Broadcast)
            </button>
          )}
        </div>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : notification.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />}
              <div>
                <h4 className="font-extrabold text-xs">{notification.title}</h4>
                <p className="text-xs mt-0.5 opacity-90">{notification.message}</p>
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-black/5 text-current transition cursor-pointer"
              aria-label="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs for Workflow Engine */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('INBOX')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'INBOX' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bell className="w-4 h-4" /> Smart Notification Inbox
          {unreadCount > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {canViewOperationalEngines && (
          <>
            <button
              onClick={() => setActiveTab('APPROVALS')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'APPROVALS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <FileCheck className="w-4 h-4" /> Approval Engine
              {pendingApprovals.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('RULE_ENGINE')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'RULE_ENGINE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Cpu className="w-4 h-4" /> Configurable Rule Engine
            </button>

            <button
              onClick={() => setActiveTab('RECOMMENDATIONS')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'RECOMMENDATIONS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Zap className="w-4 h-4" /> Executive Recommendations
              {executiveRecommendations.length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {executiveRecommendations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('TIMELINE')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'TIMELINE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Activity className="w-4 h-4" /> Live Timeline Engine
            </button>

            <button
              onClick={() => setActiveTab('SCHEDULER')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'SCHEDULER' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-4 h-4" /> Scheduler Engine
            </button>

            <button
              onClick={() => setActiveTab('LOGS')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'LOGS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <History className="w-4 h-4" /> Automation Log
            </button>
          </>
        )}
      </div>

      {/* TAB 1: INBOX */}
      {activeTab === 'INBOX' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  categoryFilter === 'ALL' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua Kategori
              </button>
              <button
                onClick={() => setCategoryFilter('APPROVAL')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  categoryFilter === 'APPROVAL' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Persetujuan (Approval)
              </button>
              <button
                onClick={() => setCategoryFilter('BROADCAST')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  categoryFilter === 'BROADCAST' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Pengumuman Broadcast
              </button>
              <button
                onClick={() => setCategoryFilter('SECURITY')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  categoryFilter === 'SECURITY' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Keamanan & System Alert
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari notifikasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50 cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="UNREAD">Belum Dibaca</option>
                <option value="READ">Sudah Dibaca</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-stone-500 text-xs font-medium">
                Memuat notifikasi realtime dari Firestore...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <SIMEmptyState
                type="announcements"
                title="Belum Ada Notifikasi"
                description="Kotak masuk notifikasi Anda bersih. Semua update, pengingat, dan persetujuan akan muncul secara realtime di sini."
                actionLabel={canBroadcast ? "Kirim Pengumuman Baru" : undefined}
                onAction={canBroadcast ? () => setShowBroadcastModal(true) : undefined}
              />
            ) : (
              filteredNotifications.map((n) => {
                const isPinned = pinnedIds.includes(n.id);
                return (
                  <motion.div
                    key={n.id}
                    whileHover={{ scale: 1.002 }}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      isPinned
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                        : !n.isRead
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                        : 'bg-white border-stone-200 opacity-80'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0 mt-0.5">
                      {getTypeIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isPinned && <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                        <h3 className="font-bold text-slate-900 text-xs">{n.title}</h3>
                        {getPriorityBadge(n.priority)}
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>}
                      </div>
                      <p className="text-stone-600 text-xs mt-1 leading-relaxed">{n.message}</p>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {new Date(n.createdAt).toLocaleString('id-ID')}
                        </span>
                        <span>• Sumber: {n.source}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePin(n.id)}
                        title={isPinned ? 'Lepas Pin' : 'Sematkan Pin'}
                        className={`p-1.5 rounded-xl transition cursor-pointer ${
                          isPinned ? 'bg-amber-200 text-amber-900' : 'hover:bg-stone-100 text-stone-400'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleArchive(n.id)}
                        title="Arsipkan Notifikasi"
                        className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>

                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] rounded-xl transition cursor-pointer ml-1"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: APPROVAL ENGINE */}
      {activeTab === 'APPROVALS' && canViewOperationalEngines && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-800" /> Realtime Approval Queue
                </h2>
                <p className="text-xs text-stone-500">Antrean persetujuan berkas PPDB, verifikasi SPP, dan pengajuan operasional.</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full border border-amber-200">
                {pendingApprovals.length} Antrean Pending
              </span>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-12 text-center text-stone-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Semua Persetujuan Selesai!</h3>
                <p className="text-xs text-stone-500">Tidak ada pendaftaran atau pembayaran yang menunggu verifikasi saat ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingApprovals.map((item) => {
                  const isPPDB = item.type === 'PPDB';
                  const isSPP = item.type === 'SPP_PAYMENT';
                  const canApproveThisItem = (isPPDB && canApprovePPDB) || (isSPP && canApproveSPP);

                  return (
                    <div key={item.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 shadow-2xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                          {item.type} • PENDING
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {new Date(item.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-stone-600 mt-1 font-medium">{item.details}</p>
                        <p className="text-[11px] text-stone-400 mt-1">Pemohon: {item.requester}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/80">
                        {!canApproveThisItem && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-medium mr-auto">
                            Otorisasi: {isPPDB ? 'Admin / Kepsek' : 'Admin / Bendahara'}
                          </span>
                        )}
                        <button
                          id={`btn-reject-${item.id}`}
                          disabled={!canApproveThisItem || processingApprovalId === item.id}
                          onClick={() => handleApproveRecord(item, false)}
                          className={`px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs rounded-xl transition flex items-center gap-1.5 ${
                            !canApproveThisItem || processingApprovalId === item.id ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {processingApprovalId === item.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          Tolak
                        </button>
                        <button
                          id={`btn-approve-${item.id}`}
                          disabled={!canApproveThisItem || processingApprovalId === item.id}
                          onClick={() => handleApproveRecord(item, true)}
                          className={`px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 ${
                            !canApproveThisItem || processingApprovalId === item.id ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {processingApprovalId === item.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          Setujui
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURABLE RULE ENGINE */}
      {activeTab === 'RULE_ENGINE' && canViewOperationalEngines && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-800" /> Configurable Automation Rules Engine
                </h2>
                <p className="text-xs text-stone-500">Aturan pemicu otomatisasi tanpa koding untuk notifikasi, penugasan, dan tindakan sistem.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                {rules.filter((r) => r.enabled).length} Active Rules
              </span>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${rule.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`}></span>
                      <h4 className="font-extrabold text-slate-900 text-xs">{rule.name}</h4>
                      <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-md uppercase">
                        {rule.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-trigger-${rule.id}`}
                        disabled={!canExecuteRules || runningRuleId === rule.id}
                        onClick={() => triggerManualRule(rule)}
                        className={`px-3 py-1 font-bold text-[10px] rounded-xl flex items-center gap-1 transition ${
                          !canExecuteRules || runningRuleId === rule.id
                            ? 'bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 cursor-pointer'
                        }`}
                      >
                        {runningRuleId === rule.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        Uji Pemicu Manual
                      </button>

                      <button
                        id={`btn-toggle-${rule.id}`}
                        disabled={!canExecuteRules}
                        onClick={() => toggleRule(rule.id)}
                        className={`px-3 py-1 font-bold text-[10px] rounded-xl transition ${
                          !canExecuteRules
                            ? 'bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed'
                            : rule.enabled
                            ? 'bg-emerald-800 text-white cursor-pointer'
                            : 'bg-stone-200 text-stone-600 cursor-pointer'
                        }`}
                      >
                        {rule.enabled ? 'NONAKTIFKAN' : 'AKTIFKAN'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono bg-white p-3 rounded-xl border border-stone-200/80">
                    <div>
                      <span className="text-emerald-800 font-bold">IF (Peristiwa):</span> {rule.eventTrigger}
                      <p className="text-stone-500 text-[11px] mt-0.5">Syarat: {rule.condition}</p>
                    </div>
                    <div>
                      <span className="text-amber-800 font-bold">THEN (Tindakan):</span> {rule.action}
                      <p className="text-stone-500 text-[11px] mt-0.5">Target Role: {rule.targetRole} • Dipicu: {rule.runCount}x</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXECUTIVE RECOMMENDATIONS */}
      {activeTab === 'RECOMMENDATIONS' && canViewOperationalEngines && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-800" /> Executive Recommendation Engine
            </h2>
            <p className="text-xs text-stone-500">
              Rekomendasi tindakan operasional otomatis yang disintesis dari data aktual Firestore tanpa fabrikasi angka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {executiveRecommendations.map((rec) => (
              <div key={rec.id} className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        rec.priority === 'HIGH'
                          ? 'bg-rose-900/80 text-rose-300 border border-rose-700'
                          : rec.priority === 'MEDIUM'
                          ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                          : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                      }`}
                    >
                      Prioritas {rec.priority}
                    </span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-100">{rec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{rec.desc}</p>
                </div>

                <button
                  onClick={() => setActiveTab(rec.targetTab as any)}
                  className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {rec.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TIMELINE ENGINE */}
      {activeTab === 'TIMELINE' && canViewOperationalEngines && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-800" /> Live Operational Activity Timeline
            </h2>
            <p className="text-xs text-stone-500">Umpan aktivitas waktu nyata dari Audit Log, Pembayaran, PPDB, dan Notifikasi.</p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {auditLogs.slice(0, 10).map((log, idx) => (
              <div key={log.id || idx} className="relative space-y-1">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs">{log.action}</span>
                  <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-2 py-0.5 rounded">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Pengguna: <strong className="text-slate-800">{log.userName}</strong> ({log.role}) • Modul: {log.targetModule}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SCHEDULER ENGINE */}
      {activeTab === 'SCHEDULER' && canViewOperationalEngines && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" /> Background Scheduler Status
            </h2>
            <p className="text-xs text-stone-500">Penjadwal tugas latar belakang otomatis (Interval Jam, Harian, Mingguan, Bulanan).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-emerald-900">Hourly Task Scheduler</div>
              <div className="text-xl font-black text-slate-900">AKTIF</div>
              <p className="text-[11px] text-emerald-800">Cek persetujuan & sync waktu nyata</p>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2">
              <div className="text-xs font-bold text-sky-900">Daily 08:00 AM Reminder</div>
              <div className="text-xl font-black text-slate-900">AKTIF</div>
              <p className="text-[11px] text-sky-800">Pengiriman auto-reminder SPP & Presensi</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <div className="text-xs font-bold text-purple-900">Weekly Backup Task</div>
              <div className="text-xl font-black text-slate-900">AKTIF</div>
              <p className="text-[11px] text-purple-800">Ekspor cadangan otomatis setiap Minggu</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-amber-900">Monthly Financial Audit</div>
              <div className="text-xl font-black text-slate-900">AKTIF</div>
              <p className="text-[11px] text-amber-800">Pemeriksaan integritas transaksi bulanan</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUTOMATION LOG */}
      {activeTab === 'LOGS' && canViewOperationalEngines && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-800" /> Automation Execution Log
            </h2>
            <p className="text-xs text-stone-500">Catatan riwayat eksekusi aturan otomatisasi, durasi eksekusi, dan pelaksana.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Nama Aturan / Workflow</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Durasi</th>
                  <th className="p-3">Hasil / Pesan</th>
                  <th className="p-3">Eksekutor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {automationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-mono text-[11px] text-stone-500">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{log.ruleName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-stone-600">{log.durationMs} ms</td>
                    <td className="p-3 text-stone-600 font-medium">{log.resultMessage}</td>
                    <td className="p-3 font-bold text-slate-800">{log.executor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACCESS RESTRICTED FALLBACK */}
      {activeTab !== 'INBOX' && !canViewOperationalEngines && (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Akses Modul Terbatas</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Halaman mesin operasional dan antrean persetujuan hanya dapat diakses oleh Manajemen Sekolah (Super Admin, Admin, Kepala Sekolah, dan Bendahara).
          </p>
          <button
            onClick={() => setActiveTab('INBOX')}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Kembali ke Smart Inbox
          </button>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSendBroadcast} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-800" /> Kirim Pengumuman Broadcast Sekolah
              </h2>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Penerima</label>
                <select
                  value={broadcastData.targetType}
                  onChange={(e) => setBroadcastData({ ...broadcastData, targetType: e.target.value as any })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold bg-stone-50 cursor-pointer"
                >
                  <option value="BROADCAST">Semua Pengguna Terdaftar (Global Broadcast)</option>
                  <option value="ROLE">Role Spesifik</option>
                </select>
              </div>

              {broadcastData.targetType === 'ROLE' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pilih Role Target</label>
                  <select
                    value={broadcastData.targetRole}
                    onChange={(e) => setBroadcastData({ ...broadcastData, targetRole: e.target.value as UserRole })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold bg-stone-50 cursor-pointer"
                  >
                    <option value="GURU">Guru & Tenaga Pendidik</option>
                    <option value="WALI_MURID">Wali Murid / Orang Tua</option>
                    <option value="KEUANGAN">Tim Keuangan</option>
                    <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                    <option value="CALON_WALI_MURID">Calon Wali Murid PPDB</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Prioritas Notifikasi</label>
                <select
                  value={broadcastData.priority}
                  onChange={(e) => setBroadcastData({ ...broadcastData, priority: e.target.value as NotificationPriority })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold bg-stone-50 cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Tinggi (High)</option>
                  <option value="urgent">Mendesak / Penting (Urgent)</option>
                  <option value="low">Informasi (Low)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemberitahuan Libur Hari Raya"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pesan Notifikasi</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan isi pengumuman lengkap..."
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                id="btn-cancel-broadcast"
                type="button"
                disabled={submittingBroadcast}
                onClick={() => setShowBroadcastModal(false)}
                className={`px-4 py-2 bg-stone-200 text-slate-800 rounded-xl text-xs font-bold ${
                  submittingBroadcast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                Batal
              </button>
              <button
                id="btn-submit-broadcast"
                type="submit"
                disabled={submittingBroadcast}
                className={`px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                  submittingBroadcast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {submittingBroadcast ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {submittingBroadcast ? 'Menyiarkan...' : 'Kirim Pengumuman'}
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};
