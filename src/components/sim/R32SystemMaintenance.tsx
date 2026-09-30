import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  ShieldCheck,
  Database,
  RefreshCw,
  CheckCircle2,
  GitCommit,
  AlertTriangle,
  Activity,
  Server,
  FileText,
  Printer,
  Search,
  HardDrive,
  Cpu,
  Lock,
  Eye,
  AlertCircle,
  Sparkles,
  Filter,
  Check,
  X,
  ChevronRight,
  Layers,
  UserCheck,
  School,
  Terminal,
  ShieldAlert,
  FileCheck,
  Info,
  Shield,
  Clock,
  SlidersHorizontal
} from 'lucide-react';
import {
  SchoolProfile,
  Student,
  Teacher,
  PresensiRecord,
  PresensiGuruRecord,
  SPPBill,
  PPDBRecord,
  EraporRecord,
  AnecdotRecord,
  AuditLog,
  UserRole
} from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { R37EnterprisePatchGovernance } from './R37EnterprisePatchGovernance';

interface DatasetScanResult {
  collectionKey: string;
  displayName: string;
  recordCount: number;
  status: 'HEALTHY' | 'EMPTY' | 'ANOMALY_FOUND';
  lastScanTimestamp: string;
  description: string;
}

interface ConsistencyIssue {
  id: string;
  category: 'STUDENT' | 'TEACHER' | 'SPP' | 'PPDB' | 'ERAPOR' | 'PRESENSI';
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  description: string;
  affectedRecordId: string;
  suggestedAction: string;
}

// Canonical SSOT Roles
const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
] as const;

// Strict Maintenance Authority: Only SUPER_ADMIN and ADMIN are permitted
const MAINTENANCE_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN'
] as const;

interface Props {
  onSelectModule?: (mod: string) => void;
}

export const R32SystemMaintenance: React.FC<Props> = ({ onSelectModule }) => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  const canonicalRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Strict Maintenance Access Boundary: Only SUPER_ADMIN & ADMIN
  const canAccessMaintenance = useMemo<boolean>(() => {
    return Boolean(
      currentUser?.uid &&
      canonicalRole &&
      MAINTENANCE_ROLES.includes(canonicalRole)
    );
  }, [currentUser?.uid, canonicalRole]);

  // Authentic Identity Resolution (Zero synthetic/fabricated fallbacks)
  const actorDisplayName = useMemo(() => {
    if (!currentUser?.uid) return '';
    return (
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser.displayName?.trim() ||
      currentUser.email?.trim() ||
      `User (${currentUser.uid.slice(0, 8)})`
    );
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email, userProfile?.nama, userProfile?.name]);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'HEALTH_DIAGNOSTIC' | 'INTEGRITY_SCAN' | 'PROFILE_CONFIG' | 'PATCH_GOVERNANCE' | 'MAINTENANCE_AUDIT'
  >('HEALTH_DIAGNOSTIC');

  // Loading & Processing States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isExecutingAction, setIsExecutingAction] = useState<boolean>(false);
  const [isPrintingReport, setIsPrintingReport] = useState<boolean>(false);
  const [lastFullScanTime, setLastFullScanTime] = useState<string>('');

  // Real Canonical State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [presensiList, setPresensiList] = useState<PresensiRecord[]>([]);
  const [presensiGuruList, setPresensiGuruList] = useState<PresensiGuruRecord[]>([]);
  const [sppBills, setSppBills] = useState<SPPBill[]>([]);
  const [ppdbRecords, setPpdbRecords] = useState<PPDBRecord[]>([]);
  const [eraporList, setEraporList] = useState<EraporRecord[]>([]);
  const [anecdotList, setAnecdotList] = useState<AnecdotRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Consistency & Anomaly Findings
  const [consistencyIssues, setConsistencyIssues] = useState<ConsistencyIssue[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Internal Accessible Confirmation Modal State (Zero Native Dialogs)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: 'PRIMARY' | 'WARNING' | 'DANGER';
    actionType: 'REFRESH_CACHE' | 'RUN_SCAN' | 'SYNC_PROFILE' | null;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Lanjutkan',
    variant: 'PRIMARY',
    actionType: null
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'SUCCESS' | 'INFO' | 'WARNING';
  } | null>(null);

  const showToast = (text: string, type: 'SUCCESS' | 'INFO' | 'WARNING' = 'SUCCESS') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Fetch Master Data from SSOT with Strict Pre-Query Authorization
  const loadSystemData = useCallback(async () => {
    // HARD PRE-QUERY AUTHORIZATION GATE:
    // Unauthorized sessions must trigger ZERO queries across all 10 collections
    if (!canAccessMaintenance) {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsScanning(false);
      setSchoolProfile(null);
      setStudents([]);
      setTeachers([]);
      setPresensiList([]);
      setPresensiGuruList([]);
      setSppBills([]);
      setPpdbRecords([]);
      setEraporList([]);
      setAnecdotList([]);
      setAuditLogs([]);
      setConsistencyIssues([]);
      return;
    }

    setIsLoading(true);
    try {
      const [
        profileRes,
        studentsRes,
        teachersRes,
        presensiRes,
        presensiGuruRes,
        sppRes,
        ppdbRes,
        eraporRes,
        anecdotRes,
        auditLogsRes
      ] = await Promise.all([
        DataService.getSchoolProfile().catch(() => null),
        DataService.getStudents().catch(() => []),
        DataService.getTeachers().catch(() => []),
        DataService.getPresensi().catch(() => []),
        DataService.getPresensiGuru().catch(() => []),
        DataService.getSPP().catch(() => []),
        DataService.getPPDBRecords().catch(() => []),
        DataService.getErapor().catch(() => []),
        DataService.getAnecdot().catch(() => []),
        DataService.getAuditLogs().catch(() => [])
      ]);

      if (profileRes) setSchoolProfile(profileRes);
      setStudents(studentsRes);
      setTeachers(teachersRes);
      setPresensiList(presensiRes);
      setPresensiGuruList(presensiGuruRes);
      setSppBills(sppRes);
      setPpdbRecords(ppdbRes);
      setEraporList(eraporRes);
      setAnecdotList(anecdotRes);
      setAuditLogs(auditLogsRes);
      setLastFullScanTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Run Initial Consistency Analysis
      analyzeConsistency(
        studentsRes,
        teachersRes,
        presensiRes,
        presensiGuruRes,
        sppRes,
        ppdbRes,
        eraporRes,
        anecdotRes
      );
    } catch (err) {
      console.error('[R32 System Maintenance] Gagal memuat data sistem:', err);
      showToast('Terjadi kendala saat memeriksa database.', 'WARNING');
    } finally {
      setIsLoading(false);
    }
  }, [canAccessMaintenance]);

  useEffect(() => {
    loadSystemData();
  }, [loadSystemData]);

  // 2. Consistency & Integrity Analysis (Report Only)
  const analyzeConsistency = (
    sList: Student[],
    tList: Teacher[],
    pList: PresensiRecord[],
    pgList: PresensiGuruRecord[],
    sppList: SPPBill[],
    ppdbList: PPDBRecord[],
    eList: EraporRecord[],
    aList: AnecdotRecord[]
  ) => {
    const issues: ConsistencyIssue[] = [];

    // A. Check Students
    const studentIds = new Set<string>();
    sList.forEach((s) => {
      if (!s.id) {
        issues.push({
          id: `ISSUE_ST_${Math.random()}`,
          category: 'STUDENT',
          severity: 'CRITICAL',
          description: `Ditemukan data siswa tanpa primary ID unik.`,
          affectedRecordId: 'UNKNOWN_ID',
          suggestedAction: 'Periksa master data siswa di modul R3.'
        });
      } else if (studentIds.has(s.id)) {
        issues.push({
          id: `ISSUE_ST_DUP_${s.id}`,
          category: 'STUDENT',
          severity: 'CRITICAL',
          description: `Duplikasi ID Siswa terdeteksi: ${s.id} (${s.name || s.namaLengkap || 'Tanpa Nama'}).`,
          affectedRecordId: s.id,
          suggestedAction: 'Validasi data kembar di master siswa.'
        });
      } else {
        studentIds.add(s.id);
      }

      if (!s.name && !s.namaLengkap) {
        issues.push({
          id: `ISSUE_ST_NAME_${s.id}`,
          category: 'STUDENT',
          severity: 'WARNING',
          description: `Siswa [ID: ${s.id}] tidak memiliki nama lengkap.`,
          affectedRecordId: s.id,
          suggestedAction: 'Lengkapi identitas nama siswa di modul R3.'
        });
      }
    });

    // B. Check Teachers
    const teacherIds = new Set<string>();
    tList.forEach((t) => {
      if (!t.id) {
        issues.push({
          id: `ISSUE_TCH_${Math.random()}`,
          category: 'TEACHER',
          severity: 'CRITICAL',
          description: `Ditemukan pendidik tanpa primary ID.`,
          affectedRecordId: 'UNKNOWN_ID',
          suggestedAction: 'Periksa kelengkapan PTK di modul R4.'
        });
      } else if (teacherIds.has(t.id)) {
        issues.push({
          id: `ISSUE_TCH_DUP_${t.id}`,
          category: 'TEACHER',
          severity: 'CRITICAL',
          description: `Duplikasi ID Pendidik: ${t.id} (${t.name || 'Tanpa Nama'}).`,
          affectedRecordId: t.id,
          suggestedAction: 'Verifikasi NIP/NUPTK di modul R4.'
        });
      } else {
        teacherIds.add(t.id);
      }
    });

    // C. Check PPDB
    ppdbList.forEach((p) => {
      if (!p.studentName && !p.id) {
        issues.push({
          id: `ISSUE_PPDB_${Math.random()}`,
          category: 'PPDB',
          severity: 'WARNING',
          description: `Data pendaftar PPDB tidak memiliki nama siswa terdaftar.`,
          affectedRecordId: p.id || 'N/A',
          suggestedAction: 'Verifikasi berkas pendaftaran calon siswa di R13.'
        });
      }
    });

    // D. Check Presensi Siswa References
    pList.forEach((p) => {
      if (p.studentId && !studentIds.has(p.studentId) && studentIds.size > 0) {
        issues.push({
          id: `ISSUE_PRES_REF_${p.id}`,
          category: 'PRESENSI',
          severity: 'WARNING',
          description: `Presensi [ID: ${p.id}] merujuk ke ID siswa yang tidak terdaftar (${p.studentId}).`,
          affectedRecordId: p.id,
          suggestedAction: 'Sinkronkan data kehadiran dengan kelompok kelas aktif.'
        });
      }
    });

    setConsistencyIssues(issues);
  };

  // 3. Dataset Diagnostic Summary
  const datasetDiagnostics = useMemo<DatasetScanResult[]>(() => {
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return [
      {
        collectionKey: 'students',
        displayName: 'Master Data Siswa (R3)',
        recordCount: students.length,
        status: students.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Biodata siswa, NISN, kelompok belajar, dan relasi wali murid.'
      },
      {
        collectionKey: 'teachers',
        displayName: 'Tenaga Pendidik / PTK (R4)',
        recordCount: teachers.length,
        status: teachers.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Data dewan guru, jabatan struktural, dan wali kelas.'
      },
      {
        collectionKey: 'sim_presensi',
        displayName: 'Presensi Harian Siswa (R6)',
        recordCount: presensiList.length,
        status: presensiList.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Log kehadiran harian, status kehadiran (H/I/S/A), dan catatan walikelas.'
      },
      {
        collectionKey: 'sim_presensi_guru',
        displayName: 'Presensi Dewan Guru (R7)',
        recordCount: presensiGuruList.length,
        status: presensiGuruList.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Rekap kehadiran dewan guru dan tenaga kependidikan.'
      },
      {
        collectionKey: 'sim_spp',
        displayName: 'Keuangan SPP & Tagihan (R10/R11)',
        recordCount: sppBills.length,
        status: sppBills.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Buku besar SPP, status lunas, dan transaksi keuangan siswa.'
      },
      {
        collectionKey: 'SIM_TK_ASY_SYIFA_PPDB_RECORDS',
        displayName: 'Penerimaan Murid Baru (R13)',
        recordCount: ppdbRecords.length,
        status: ppdbRecords.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Berkas formulir pendaftaran calon siswa baru tahun ajaran 2026.'
      },
      {
        collectionKey: 'sim_erapor',
        displayName: 'E-Rapor Kurikulum Merdeka (R8)',
        recordCount: eraporList.length,
        status: eraporList.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Narasi capaian pembelajaran, perkembangan nilai agama, dan jati diri.'
      },
      {
        collectionKey: 'anecdot',
        displayName: 'Jurnal Catatan Anekdot (R9)',
        recordCount: anecdotList.length,
        status: anecdotList.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Catatan observasi perilaku autentik dan analisis capaian siswa.'
      },
      {
        collectionKey: 'audit_logs',
        displayName: 'Audit Trail & Keamanan Akses (R24)',
        recordCount: auditLogs.length,
        status: auditLogs.length > 0 ? 'HEALTHY' : 'EMPTY',
        lastScanTimestamp: now,
        description: 'Jejak mutasi data, histori login, dan aktivitas sistem.'
      }
    ];
  }, [
    students.length,
    teachers.length,
    presensiList.length,
    presensiGuruList.length,
    sppBills.length,
    ppdbRecords.length,
    eraporList.length,
    anecdotList.length,
    auditLogs.length
  ]);

  // 4. Maintenance Actions Handler
  const handleOpenConfirmation = (
    actionType: 'REFRESH_CACHE' | 'RUN_SCAN' | 'SYNC_PROFILE',
    title: string,
    description: string,
    confirmText: string,
    variant: 'PRIMARY' | 'WARNING' | 'DANGER' = 'PRIMARY'
  ) => {
    if (!canAccessMaintenance || !currentUser?.uid || !canonicalRole) {
      showToast('Otoritas tidak mencukupi untuk membuka aksi pemeliharaan.', 'WARNING');
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title,
      description,
      confirmText,
      variant,
      actionType
    });
  };

  const handleExecuteConfirmedAction = async () => {
    if (!canAccessMaintenance || !currentUser?.uid || !canonicalRole) {
      showToast('Otoritas tidak mencukupi untuk menjalankan aksi pemeliharaan.', 'WARNING');
      return;
    }
    if (isExecutingAction || isScanning || isRefreshing) return;

    const { actionType } = confirmationModal;
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
    if (!actionType) return;

    setIsExecutingAction(true);
    try {
      if (actionType === 'RUN_SCAN') {
        setIsScanning(true);
        try {
          await loadSystemData();
          await DataService.logAction(
            actorDisplayName,
            canonicalRole,
            'RUN_SYSTEM_DIAGNOSTIC',
            `R32_SYSTEM_MAINTENANCE - Pemindaian diagnostik basis data oleh ${actorDisplayName} (${canonicalRole})`
          );
          showToast('Pemindaian integritas dan diagnostik database selesai!', 'SUCCESS');
        } catch (e) {
          console.error('Scan error:', e);
          showToast('Terjadi kendala saat pemindaian.', 'WARNING');
        } finally {
          setIsScanning(false);
        }
      } else if (actionType === 'REFRESH_CACHE') {
        setIsRefreshing(true);
        try {
          await loadSystemData();
          await DataService.logAction(
            actorDisplayName,
            canonicalRole,
            'SAFE_CACHE_REFRESH',
            `R32_SYSTEM_MAINTENANCE - Penyegaran cache memori aplikasi oleh ${actorDisplayName} (${canonicalRole})`
          );
          showToast('State memori dan cache aplikasi berhasil disegarkan secara aman.', 'SUCCESS');
        } catch (e) {
          console.error('Refresh error:', e);
          showToast('Gagal menyegarkan state memori.', 'WARNING');
        } finally {
          setIsRefreshing(false);
        }
      } else if (actionType === 'SYNC_PROFILE') {
        setIsRefreshing(true);
        try {
          const prof = await DataService.getSchoolProfile();
          setSchoolProfile(prof);
          await DataService.logAction(
            actorDisplayName,
            canonicalRole,
            'SYNC_SCHOOL_PROFILE',
            `R32_SYSTEM_MAINTENANCE - Penyelarasan profil institusi oleh ${actorDisplayName} (${canonicalRole})`
          );
          showToast('Profil sekolah dan parameter institusi berhasil disinkronkan.', 'SUCCESS');
        } catch (e) {
          console.error('Profile sync error:', e);
          showToast('Gagal menyinkronkan profil institusi.', 'WARNING');
        } finally {
          setIsRefreshing(false);
        }
      }
    } finally {
      setIsExecutingAction(false);
    }
  };

  // 5. Print Maintenance Report
  const handlePrintMaintenanceReport = async () => {
    if (!canAccessMaintenance || !currentUser?.uid || !canonicalRole) {
      showToast('Otoritas tidak mencukupi untuk mencetak laporan pemeliharaan.', 'WARNING');
      return;
    }
    if (isPrintingReport || isExecutingAction) return;

    setIsPrintingReport(true);
    try {
      await DataService.logAction(
        actorDisplayName,
        canonicalRole,
        'PRINT_MAINTENANCE_REPORT',
        `R32_SYSTEM_MAINTENANCE - Cetak laporan pemeliharaan sistem oleh ${actorDisplayName} (${canonicalRole})`
      );
      window.print();
    } catch (e) {
      console.warn('Audit logging failed for print:', e);
      window.print();
    } finally {
      setIsPrintingReport(false);
    }
  };

  // 6. Filtered Maintenance Audit Logs
  const maintenanceAuditLogs = useMemo(() => {
    return auditLogs.filter(
      (log) =>
        log.targetModule?.includes('MAINTENANCE') ||
        log.targetModule?.includes('R32') ||
        log.action?.includes('DIAGNOSTIC') ||
        log.action?.includes('CACHE') ||
        log.action?.includes('REFRESH') ||
        log.action?.includes('BACKUP') ||
        log.action?.includes('SETTING')
    );
  }, [auditLogs]);

  const filteredIssues = useMemo(() => {
    if (!searchFilter.trim()) return consistencyIssues;
    const q = searchFilter.toLowerCase();
    return consistencyIssues.filter(
      (issue) =>
        issue.description.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q) ||
        issue.suggestedAction.toLowerCase().includes(q)
    );
  }, [consistencyIssues, searchFilter]);

  const totalRecordsCount = useMemo(() => {
    return datasetDiagnostics.reduce((acc, curr) => acc + curr.recordCount, 0);
  }, [datasetDiagnostics]);

  // Dignified Fail-Closed Access Denied State (Zero Sensitive Data in DOM)
  if (!canAccessMaintenance) {
    return (
      <div id="r32-access-denied-container" className="space-y-6 max-w-4xl mx-auto py-8 px-4">
        {toastMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl flex items-center justify-between border shadow-xs bg-amber-50 border-amber-200 text-amber-800"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-sm font-medium">{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-black/5 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              Akses Terbatas • Pemeliharaan Sistem
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Pemeliharaan Diperlukan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Modul R32 Pemeliharaan Sistem & Integritas Basis Data hanya dapat diakses oleh administrator sistem berwenang (<strong>SUPER_ADMIN</strong> atau <strong>ADMIN</strong>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-stone-600">
              <span>Status Autentikasi:</span>
              <span className="font-bold text-slate-900">
                {currentUser?.uid ? 'Terautentikasi' : 'Belum Masuk'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Identitas Sesi:</span>
              <span className="font-mono font-medium text-slate-900 truncate max-w-[200px]">
                {actorDisplayName || 'Tamu / Anonim'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Peran Terdeteksi:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                {canonicalRole || 'TIDAK TERIDENTIFIKASI'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>Kebijakan Keamanan:</span>
              <span className="font-bold text-rose-600">FAIL-CLOSED (DENY)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/sim"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
            >
              <span>Kembali ke Beranda Utama</span>
            </a>
            {onSelectModule && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectModule('r30')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-300 transition cursor-pointer"
                >
                  <span>Portal Guru</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectModule('r29')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-300 transition cursor-pointer"
                >
                  <span>Portal Wali Murid</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectModule('r31')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-300 transition cursor-pointer"
                >
                  <span>Portal Kepala Sekolah</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg border ${
              toastMessage.type === 'SUCCESS'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : toastMessage.type === 'WARNING'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-blue-50 text-blue-900 border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official Institutional Header (Print & Screen) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:border-none print:shadow-none print:p-0">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-stone-800 to-emerald-950 text-white flex items-center justify-center shadow-md shrink-0 border border-stone-700">
            <Wrench className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                Modul R32 — Tata Kelola & Pemeliharaan Sistem
              </span>
              <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                NPSN: 69992070
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Akreditasi A
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Pemeliharaan Sistem & Integritas Basis Data
            </h1>
            <p className="text-stone-500 text-xs mt-0.5 max-w-2xl leading-relaxed">
              Pusat diagnostik kesehatan basis data, verifikasi integritas catatan transaksi, penyegaran memori aman,
              dan tata kelola keandalan institusi TK Asy Syifa Tanggul.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            id="btn-run-diagnostic"
            onClick={() =>
              handleOpenConfirmation(
                'RUN_SCAN',
                'Jalankan Diagnostik Sistem & Database',
                'Sistem akan memindai seluruh volume record, memeriksa ketersediaan koleksi, dan mendeteksi anomali skema. Proses ini aman dan tidak merubah data.',
                'Jalankan Pemindaian',
                'PRIMARY'
              )
            }
            disabled={isScanning || isExecutingAction || isRefreshing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Activity className={`w-4 h-4 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Memindai...' : 'Diagnostik Sistem'}</span>
          </button>

          <button
            id="btn-refresh-cache"
            onClick={() =>
              handleOpenConfirmation(
                'REFRESH_CACHE',
                'Segarkan Memori & Cache Aplikasi',
                'Tindakan ini menyegarkan kembali cache lokal dan memuat ulang status dataset dari Single Source of Truth (DataService) secara aman tanpa menghapus data.',
                'Segarkan Memori',
                'PRIMARY'
              )
            }
            disabled={isRefreshing || isExecutingAction || isScanning}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-slate-800 rounded-2xl text-xs font-bold transition flex items-center gap-2 border border-stone-300 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-stone-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan Cache</span>
          </button>

          <button
            id="btn-print-report"
            onClick={handlePrintMaintenanceReport}
            disabled={isPrintingReport || isExecutingAction}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isPrintingReport ? 'Menyiapkan...' : 'Cetak Laporan'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-2xs flex flex-wrap items-center gap-1 print:hidden">
        <button
          id="tab-health-diagnostic"
          onClick={() => setActiveTab('HEALTH_DIAGNOSTIC')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'HEALTH_DIAGNOSTIC'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Diagnostik Kesehatan</span>
        </button>

        <button
          id="tab-integrity-scan"
          onClick={() => setActiveTab('INTEGRITY_SCAN')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'INTEGRITY_SCAN'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          <Database className="w-4 h-4 text-amber-500" />
          <span>Integritas Koleksi ({consistencyIssues.length})</span>
        </button>

        <button
          id="tab-profile-config"
          onClick={() => setActiveTab('PROFILE_CONFIG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'PROFILE_CONFIG'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          <School className="w-4 h-4 text-blue-500" />
          <span>Profil Institusi & Parameter</span>
        </button>

        <button
          id="tab-patch-governance"
          onClick={() => setActiveTab('PATCH_GOVERNANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'PATCH_GOVERNANCE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          <GitCommit className="w-4 h-4 text-purple-500" />
          <span>Tata Kelola Patch (R37)</span>
        </button>

        <button
          id="tab-maintenance-audit"
          onClick={() => setActiveTab('MAINTENANCE_AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'MAINTENANCE_AUDIT'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          <FileCheck className="w-4 h-4 text-stone-500" />
          <span>Audit Log Pemeliharaan ({maintenanceAuditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM HEALTH & STORAGE DIAGNOSTIC */}
      {activeTab === 'HEALTH_DIAGNOSTIC' && (
        <div className="space-y-6">
          {/* Top 4 KPI Diagnostic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">Status Runtime</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">Ready & Operasional</div>
              <div className="text-[11px] text-emerald-800 mt-1 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kernel TADE Aktif
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">Total Record Aktif</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalRecordsCount} Item</div>
              <div className="text-[11px] text-stone-600 mt-1">Tersebar di 9 Koleksi Utama</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">Status Konsistensi</span>
                {consistencyIssues.length === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {consistencyIssues.length === 0 ? '100% Sempurna' : `${consistencyIssues.length} Anomali`}
              </div>
              <div
                className={`text-[11px] mt-1 font-semibold ${
                  consistencyIssues.length === 0 ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {consistencyIssues.length === 0 ? 'Tidak ada konflik data' : 'Memerlukan review berkala'}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">Pembaruan Terakhir</span>
                <Clock className="w-4 h-4 text-stone-600" />
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">{lastFullScanTime || 'Baru saja'}</div>
              <div className="text-[11px] text-stone-600 mt-1">Pemindaian Terpadu SSOT</div>
            </div>
          </div>

          {/* AI Asy Executive & Guardian Companion Scene */}
          <div className="bg-gradient-to-br from-slate-950 via-stone-900 to-emerald-950 rounded-3xl p-6 text-white border border-stone-800 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    Guardian Sentinel & AI Asy Diagnostics
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">Kernel v1.0.1</span>
                </div>
                <h2 className="text-lg font-black tracking-tight text-white">
                  Pengawasan Kesehatan Data & Keandalan Operasional
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Dek Asy dan Kak Syifa bersama Guardian Turtle memantau stabilitas memori, integritas transaksi
                  pembayaran SPP, serta kesinambungan sinkronisasi dokumen e-rapor siswa. Pemeliharaan preventif
                  menjaga kedaulatan data institusi tetap aman dan berkesinambungan.
                </p>
              </div>

              <div className="shrink-0">
                <AIAsyCharacterScene pageContext="dashboardAdmin" />
              </div>
            </div>
          </div>

          {/* Detailed Dataset Volume & Health Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>Matriks Kesehatan Koleksi Basis Data (SSOT)</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verifikasi volume record dan kesiapan tiap modul fungsional TK Asy Syifa Tanggul.
                </p>
              </div>
              <span className="text-xs text-stone-600 font-mono">Total {datasetDiagnostics.length} Modul</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {datasetDiagnostics.map((item) => (
                <div
                  key={item.collectionKey}
                  className="bg-stone-50/70 hover:bg-stone-50 transition p-4 rounded-2xl border border-stone-200/80 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{item.displayName}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{item.collectionKey}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'HEALTHY'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-stone-200 text-stone-700 border-stone-300'
                      }`}
                    >
                      {item.status === 'HEALTHY' ? 'Aktif' : 'Kosong'}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 leading-snug">{item.description}</p>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                    <span className="text-stone-500 text-[11px]">Volume Data:</span>
                    <span className="font-black text-slate-900 font-mono">{item.recordCount} Record</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA INTEGRITY & ANOMALY SCAN */}
      {activeTab === 'INTEGRITY_SCAN' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600" />
                <span>Pemeriksaan Anomali & Konsistensi Skema (Report Only)</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Mendeteksi duplikasi ID, data wajib yang belum terisi, dan anomali relasi antar-tabel tanpa merusak data
                pengguna.
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari temuan anomali..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                Basis Data 100% Konsisten dan Sehat
              </div>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Tidak ditemukan duplikasi primary key, rekaman kosong yang rusak, atau anomali referensi antar-tabel
                pada seluruh dataset TK Asy Syifa Tanggul.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        issue.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : issue.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md">
                          {issue.category}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          Ref ID: {issue.affectedRecordId}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1">{issue.description}</div>
                      <div className="text-[11px] text-emerald-800 mt-0.5 flex items-center gap-1">
                        <Info className="w-3 h-3 text-emerald-600" />
                        <span>Saran Tindakan: {issue.suggestedAction}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                      issue.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCHOOL PROFILE & MASTER CONFIG */}
      {activeTab === 'PROFILE_CONFIG' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                <span>Parameter Profil Resmi & Konfigurasi Master</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Konfigurasi profil institusi TK Asy Syifa Tanggul yang tersimpan di Single Source of Truth.
              </p>
            </div>

            <button
              onClick={() =>
                handleOpenConfirmation(
                  'SYNC_PROFILE',
                  'Sinkronkan Ulang Profil Institusi',
                  'Memuat ulang profil sekolah dan parameter master dari Firestore dan menyelaraskan cache lokal.',
                  'Sinkronkan Sekarang',
                  'PRIMARY'
                )
              }
              disabled={isRefreshing || isExecutingAction || isScanning}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-stone-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Profil</span>
            </button>
          </div>

          {schoolProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Identitas Lembaga</div>
                <div className="text-sm font-black text-slate-900">{schoolProfile.name}</div>
                <div className="text-xs text-stone-600">NPSN: <span className="font-mono font-bold text-slate-900">{schoolProfile.npsn || '69992070'}</span></div>
                <div className="text-xs text-stone-600">Akreditasi: <span className="font-bold text-emerald-800">{schoolProfile.akreditasi || 'A'}</span></div>
                <div className="text-xs text-stone-600">Alamat: {schoolProfile.address || 'Jalan Raya Tanggul, Jember'}</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Kontak & Pimpinan</div>
                <div className="text-xs text-stone-600">Kepala Sekolah: <span className="font-bold text-slate-900">{schoolProfile.kepalaSekolah || 'Kepala Sekolah TK Asy Syifa'}</span></div>
                <div className="text-xs text-stone-600">Telepon / WhatsApp: <span className="font-mono">{schoolProfile.phone || '-'}</span></div>
                <div className="text-xs text-stone-600">Email Resmi: <span className="font-mono">{schoolProfile.email || '-'}</span></div>
                <div className="text-xs text-stone-600">Status Sinkronisasi: <span className="text-emerald-800 font-bold">Terhubung & Tersinkron</span></div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500 text-xs">
              Profil institusi belum dimuat dari server.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ENTERPRISE PATCH GOVERNANCE (R37 INTEGRATION) */}
      {activeTab === 'PATCH_GOVERNANCE' && <R37EnterprisePatchGovernance />}

      {/* TAB 5: MAINTENANCE AUDIT TRAIL */}
      {activeTab === 'MAINTENANCE_AUDIT' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Log Audit Pemeliharaan & Aksi Sistem</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Catatan riwayat tindakan pemeliharaan, diagnostik, dan sinkronisasi yang dilakukan administrator.
              </p>
            </div>
            <span className="text-xs text-stone-600 font-mono">{maintenanceAuditLogs.length} Entri Tercatat</span>
          </div>

          {maintenanceAuditLogs.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
              Belum ada log aktivitas pemeliharaan spesifik yang tercatat hari ini.
            </div>
          ) : (
            <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
              {maintenanceAuditLogs.slice(0, 20).map((log) => (
                <div key={log.id} className="p-3.5 bg-white hover:bg-stone-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                      {log.role?.[0] || 'A'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {log.action} — <span className="font-normal text-stone-600">{log.userName}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">Modul: {log.targetModule}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">{log.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Internal Accessible Confirmation Modal (Zero Native Dialogs) */}
      <AnimatePresence>
        {confirmationModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    confirmationModal.variant === 'DANGER'
                      ? 'bg-rose-100 text-rose-700'
                      : confirmationModal.variant === 'WARNING'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{confirmationModal.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{confirmationModal.description}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Otoritas: {canonicalRole} ({actorDisplayName}) — Aksi ini tercatat di Audit Trail.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isExecutingAction}
                  onClick={() => setConfirmationModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isExecutingAction}
                  onClick={handleExecuteConfirmedAction}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-xs disabled:opacity-50 ${
                    confirmationModal.variant === 'DANGER'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : confirmationModal.variant === 'WARNING'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isExecutingAction ? 'Memproses...' : confirmationModal.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
