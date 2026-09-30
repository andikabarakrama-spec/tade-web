import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { SPPBill, Student, Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';
import {
  DollarSign,
  MessageCircle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Check,
  X,
  AlertCircle,
  Calendar,
  User,
  CreditCard,
  Building2,
  TrendingUp,
  Receipt,
  FileCheck2,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  ShieldCheck,
  Lock
} from 'lucide-react';

const MONTH_NAMES = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
];

// School-local timezone configuration: Asia/Jakarta (WIB, UTC+7)
const SCHOOL_TIMEZONE = 'Asia/Jakarta';

/**
 * Returns YYYY-MM-DD string in school-local WIB timezone.
 * Eliminates UTC date skew where 00:00-06:59 WIB would otherwise shift to previous UTC date.
 */
const getWIBDateString = (date: Date = new Date()): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: SCHOOL_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
};

/**
 * Returns full 4-digit calendar year in school-local WIB timezone.
 */
const getWIBYear = (date: Date = new Date()): number => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: SCHOOL_TIMEZONE,
      year: 'numeric'
    }).formatToParts(date);
    const yearPart = parts.find(p => p.type === 'year');
    return yearPart ? parseInt(yearPart.value, 10) : date.getFullYear();
  } catch {
    return date.getFullYear();
  }
};

const CALENDAR_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const CALENDAR_MONTH_MAP: Record<string, string> = {
  'Januari': '01',
  'Februari': '02',
  'Maret': '03',
  'April': '04',
  'Mei': '05',
  'Juni': '06',
  'Juli': '07',
  'Agustus': '08',
  'September': '09',
  'Oktober': '10',
  'November': '11',
  'Desember': '12'
};

/**
 * Returns the current month name (Indonesian) in school-local WIB timezone.
 */
const getWIBMonthName = (date: Date = new Date()): string => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: SCHOOL_TIMEZONE,
      month: 'numeric'
    }).formatToParts(date);
    const monthPart = parts.find(p => p.type === 'month');
    const monthNum = monthPart ? parseInt(monthPart.value, 10) : (date.getMonth() + 1);
    return CALENDAR_MONTH_NAMES[monthNum - 1] || 'Mei';
  } catch {
    return CALENDAR_MONTH_NAMES[date.getMonth()] || 'Mei';
  }
};

/**
 * Returns 2-digit month string (01-12) for bill identity and receipt numbers.
 */
const getMonthNumber = (monthName: string): string => {
  if (CALENDAR_MONTH_MAP[monthName]) {
    return CALENDAR_MONTH_MAP[monthName];
  }
  const acadIdx = MONTH_NAMES.indexOf(monthName);
  if (acadIdx !== -1) {
    return String(acadIdx + 1).padStart(2, '0');
  }
  return '01';
};

const CLASS_OPTIONS = [
  'Semua Kelompok',
  'Kelompok A1',
  'Kelompok A2',
  'Kelompok B1',
  'Kelompok B2',
  'PAUD TPA'
];

const PAYMENT_METHODS = [
  'Transfer QRIS/Bank',
  'Tunai di Kasir TU',
  'Transfer Mandiri / BSI',
  'E-Wallet (Gopay/OVO/Dana)'
];

// Canonical Application Roles for Authoritative Verification
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
] as const;

// Financial Mutation Authority Roles (Strict Management & Finance Mandate)
const FINANCIAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEUANGAN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN'
] as const;

export const R10SPPTagihan: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  // Note: userProfile.role NEVER overrides activeRole. Zero privileged fallbacks.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Derived Security Role Boundaries
  const isManagementOrFinance = useMemo(() => {
    return Boolean(verifiedActiveRole && FINANCIAL_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const isGuruRole = useMemo(() => {
    return verifiedActiveRole === 'GURU';
  }, [verifiedActiveRole]);

  const isWaliMuridRole = useMemo(() => {
    return verifiedActiveRole === 'WALI_MURID';
  }, [verifiedActiveRole]);

  // General Access Boundary to Module R10 (Fail-Closed)
  // Management/Keuangan, Guru Kelas, and Wali Murid have legitimate mandates to access R10.
  // Peripheral/unauthorized roles (e.g. CALON_WALI_MURID, ALUMNI_FAMILY, unknown, unauthenticated) are blocked.
  const canAccessR10 = useMemo(() => {
    return Boolean(currentUser?.uid && verifiedActiveRole && (isManagementOrFinance || isGuruRole || isWaliMuridRole));
  }, [currentUser?.uid, verifiedActiveRole, isManagementOrFinance, isGuruRole, isWaliMuridRole]);

  // Mutation Authority strictly limited to management and finance roles (Fail-Closed)
  const canMutate = useMemo(() => {
    return Boolean(currentUser?.uid && verifiedActiveRole && isManagementOrFinance);
  }, [currentUser?.uid, verifiedActiveRole, isManagementOrFinance]);

  // Authenticated Actor Identity (strictly from session, NO synthetic or hardcoded fallback)
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return `User (${currentUser.uid.slice(0, 8)})`;
  }, [currentUser?.uid, userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email]);

  const actorUid = currentUser?.uid || '';

  // Core Data States (Pre-Scoped before entering state)
  const [bills, setBills] = useState<SPPBill[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState<boolean>(false);
  const [processingBillId, setProcessingBillId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<number>(getWIBYear());
  const [selectedClass, setSelectedClass] = useState<string>('Semua Kelompok');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'studentName' | 'month' | 'sppAmount' | 'status'>('studentName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [activeBill, setActiveBill] = useState<SPPBill | null>(null);

  // Form State for Single Bill
  const [formData, setFormData] = useState<{
    studentId: string;
    studentName: string;
    classGroup: string;
    month: string;
    year: number;
    sppAmount: number;
    gedungAmount: number;
    status: 'Lunas' | 'Belum Bayar' | 'Pending';
    paidAt: string;
    paymentMethod: string;
    receiptNo: string;
  }>({
    studentId: '',
    studentName: '',
    classGroup: 'Kelompok A1',
    month: getWIBMonthName(),
    year: getWIBYear(),
    sppAmount: 180000,
    gedungAmount: 0,
    status: 'Belum Bayar',
    paidAt: '',
    paymentMethod: 'Transfer QRIS/Bank',
    receiptNo: ''
  });

  // Batch Generation State
  const [batchMonth, setBatchMonth] = useState<string>(getWIBMonthName());
  const [batchYear, setBatchYear] = useState<number>(getWIBYear());
  const [batchClass, setBatchClass] = useState<string>('Semua Kelompok');
  const [batchSppAmount, setBatchSppAmount] = useState<number>(180000);
  const [batchGedungAmount, setBatchGedungAmount] = useState<number>(0);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  // 2. Pre-Query Authorization Gate & Scoped Financial Data Fetching
  // - Unauthorized/peripheral roles trigger ZERO queries and instantly clear state.
  // - WALI_MURID queries only linked children. Global un-scoped bills NEVER enter parent state.
  // - GURU resolves assigned homeroom class first. Only students and bills in teacher's class enter state.
  // - Institutional Management queries full institutional financial dataset.
  const loadData = useCallback(async () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR10) {
      setBills([]);
      setStudents([]);
      setTeachers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isWaliMuridRole) {
        // Authenticated Parent: Strictly query linked children only
        const linkedStudents = await DataService.getStudents(
          verifiedActiveRole,
          currentUser.uid,
          currentUser.email || undefined
        );

        const safeStudents = linkedStudents || [];
        const linkedStudentIds = new Set(safeStudents.map(s => s.id));

        // Fetch global bills but IMMEDIATELY scope before storing into React state
        // Cross-family financial records (other families' debts, balances, bank details) NEVER enter state
        const allBills = await DataService.getSPP();
        const parentScopedBills = (allBills || []).filter(b => linkedStudentIds.has(b.studentId));

        setStudents(safeStudents);
        setBills(parentScopedBills);
        setTeachers([]);
      } else if (isGuruRole) {
        // Educator / Teacher access:
        // 1. Resolve teacher identity and classroom assignment first
        const [fetchedTeachers, fetchedStudents] = await Promise.all([
          DataService.getTeachers(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          )
        ]);

        const cleanEmail = currentUser.email?.trim().toLowerCase();
        const cleanName = (userProfile?.nama || userProfile?.name || currentUser.displayName || '').trim().toLowerCase();

        const currentTeacher = fetchedTeachers.find(t =>
          (currentUser.uid && (t as any).uid === currentUser.uid) ||
          (currentUser.uid && t.id === currentUser.uid) ||
          (cleanEmail && (t as any).email && (t as any).email.trim().toLowerCase() === cleanEmail) ||
          (cleanName && t.name && t.name.trim().toLowerCase() === cleanName)
        );

        // Fail-closed if teacher has no mapped homeroom classroom
        if (!currentTeacher || !currentTeacher.assignedClass) {
          setTeachers(fetchedTeachers || []);
          setStudents([]);
          setBills([]);
          setFeedback({
            type: 'info',
            message: 'Akun Anda terdaftar sebagai Guru, namun kelas binaan belum terpetakan. Hubungi Bagian Administrasi / Keuangan.'
          });
          return;
        }

        const teacherClass = currentTeacher.assignedClass;
        const homeroomStudents = (fetchedStudents || []).filter(s => s.classGroup === teacherClass);
        const homeroomStudentIds = new Set(homeroomStudents.map(s => s.id));

        // 2. Fetch and IMMEDIATELY scope bills before storing into state
        // Cross-classroom financial debts NEVER enter educator state
        const allBills = await DataService.getSPP();
        const homeroomScopedBills = (allBills || []).filter(b =>
          homeroomStudentIds.has(b.studentId) || b.classGroup === teacherClass
        );

        setTeachers(fetchedTeachers || []);
        setStudents(homeroomStudents);
        setBills(homeroomScopedBills);
        setSelectedClass(teacherClass);
      } else {
        // Institutional Leadership & Finance Management (SUPER_ADMIN, ADMIN, KEUANGAN, KEPALA_SEKOLAH, KETUA_YAYASAN)
        const [fetchedBills, fetchedStudents, fetchedTeachers] = await Promise.all([
          DataService.getSPP(),
          DataService.getStudents(
            verifiedActiveRole,
            currentUser.uid,
            currentUser.email || userProfile?.email
          ),
          DataService.getTeachers()
        ]);

        setBills(fetchedBills || []);
        setStudents(fetchedStudents || []);
        setTeachers(fetchedTeachers || []);
      }
    } catch (err: any) {
      console.error('Error loading SPP data:', err);
      showFeedback('error', 'Gagal memuat data tagihan SPP: ' + (err?.message || 'Terjadi kesalahan sistem'));
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, currentUser?.email, userProfile?.email, userProfile?.nama, userProfile?.name, currentUser?.displayName, verifiedActiveRole, canAccessR10, isWaliMuridRole, isGuruRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Homeroom Teacher Identity Resolution (for GURU role display & verification)
  const matchedTeacher = useMemo<Teacher | null>(() => {
    if (!isGuruRole || !currentUser?.uid) return null;
    const cleanEmail = currentUser.email?.trim().toLowerCase();
    const cleanName = (userProfile?.nama || userProfile?.name || currentUser.displayName || '').trim().toLowerCase();

    return (
      teachers.find(t => (t as any).uid === currentUser.uid) ||
      teachers.find(t => t.id === currentUser.uid) ||
      (cleanEmail ? teachers.find(t => (t as any).email && (t as any).email.trim().toLowerCase() === cleanEmail) : null) ||
      (cleanName ? teachers.find(t => t.name && t.name.trim().toLowerCase() === cleanName) : null) ||
      null
    );
  }, [isGuruRole, currentUser?.uid, currentUser?.email, userProfile?.nama, userProfile?.name, currentUser?.displayName, teachers]);

  // 3. Authorized Student IDs Resolution (Double-Enforced Scoping Boundary)
  const authorizedStudentIds = useMemo<Set<string> | null>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      return new Set<string>(); // Unauthenticated or invalid role: deny-all
    }

    if (isManagementOrFinance) {
      return null; // Full visibility for authorized financial management roles
    }

    if (isWaliMuridRole) {
      // In parent session, students state contains ONLY linked children
      const linked = students.map(s => s.id);
      return new Set<string>(linked);
    }

    if (isGuruRole) {
      // In educator session, students state contains ONLY homeroom students
      if (!matchedTeacher || !matchedTeacher.assignedClass) {
        return new Set<string>(); // Unassigned teacher: zero records
      }
      const homeroomStudentIds = students
        .filter(s => s.classGroup === matchedTeacher.assignedClass)
        .map(s => s.id);
      return new Set<string>(homeroomStudentIds);
    }

    return new Set<string>();
  }, [currentUser?.uid, verifiedActiveRole, isManagementOrFinance, isWaliMuridRole, isGuruRole, matchedTeacher, students]);

  // 4. Authorized Bills & Students (Boundary double-enforced on React state)
  const authorizedBills = useMemo<SPPBill[]>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return [];
    if (authorizedStudentIds === null) return bills;
    return bills.filter(b => authorizedStudentIds.has(b.studentId));
  }, [bills, currentUser?.uid, verifiedActiveRole, authorizedStudentIds]);

  const authorizedStudents = useMemo<Student[]>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return [];
    if (authorizedStudentIds === null) return students;
    return students.filter(s => authorizedStudentIds.has(s.id));
  }, [students, currentUser?.uid, verifiedActiveRole, authorizedStudentIds]);

  // Selectable Students in Form Modal (Create only allows authorized scope)
  const selectableStudents = useMemo<Student[]>(() => {
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate) return [];
    if (isManagementOrFinance) return students;
    return [];
  }, [currentUser?.uid, verifiedActiveRole, canMutate, isManagementOrFinance, students]);

  // Available Classes for Filter
  const availableClasses = useMemo<string[]>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return [];
    if (isManagementOrFinance) {
      return CLASS_OPTIONS;
    }
    if (isGuruRole && matchedTeacher?.assignedClass) {
      return [matchedTeacher.assignedClass];
    }
    if (isWaliMuridRole) {
      const parentClasses = Array.from(new Set(authorizedStudents.map(s => s.classGroup).filter(Boolean)));
      return parentClasses.length > 0 ? parentClasses : ['Tidak Ada'];
    }
    return [];
  }, [currentUser?.uid, verifiedActiveRole, isManagementOrFinance, isGuruRole, matchedTeacher, isWaliMuridRole, authorizedStudents]);

  // Toggle Bill Status (Lunas <-> Belum Bayar) with Anti-Double-Submit and Scope Guard
  const handleToggleStatus = async (bill: SPPBill) => {
    // 1. Authorization Guard
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate || !actorName) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk mengubah status tagihan.');
      return;
    }

    // 2. Target Scope Guard
    if (authorizedStudentIds !== null && !authorizedStudentIds.has(bill.studentId)) {
      showFeedback('error', 'Akses ditolak: Tagihan ini berada di luar wewenang Anda.');
      return;
    }

    // 3. Double-Submit Guard
    if (processingBillId || saving) return;

    setProcessingBillId(bill.id);
    const isCurrentlyUnpaid = bill.status === 'Belum Bayar' || bill.status === 'Pending';
    const monthNum = getMonthNumber(bill.month);
    const updated: SPPBill = {
      ...bill,
      status: isCurrentlyUnpaid ? 'Lunas' : 'Belum Bayar',
      paidAt: isCurrentlyUnpaid ? getWIBDateString() : undefined,
      paymentMethod: isCurrentlyUnpaid ? (bill.paymentMethod || 'Transfer QRIS/Bank') : undefined,
      receiptNo: isCurrentlyUnpaid ? (bill.receiptNo || `KW-${bill.year}${monthNum}-${bill.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`) : undefined
    };

    try {
      await DataService.saveSPP(updated);
      setBills(prev => prev.map(b => b.id === bill.id ? updated : b));

      // Canonical Non-Blocking Production Audit Trail Logging
      DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'SPP_STATUS_UPDATE',
        targetModule: `SPP Engine - Status tagihan SPP ananda ${bill.studentName} (${bill.classGroup}, ${bill.month} ${bill.year}) diubah menjadi ${updated.status}. Nominal: Rp ${(Number(updated.sppAmount) || 0).toLocaleString('id-ID')}`
      }).catch(auditErr => {
        console.warn('Audit logging failed non-blockingly:', auditErr);
      });

      showFeedback('success', `Status pembayaran ${bill.studentName} berhasil diubah menjadi ${updated.status}`);
    } catch (err: any) {
      console.error('Failed to toggle bill status:', err);
      showFeedback('error', 'Gagal memperbarui status: ' + (err?.message || 'Kesalahan jaringan'));
    } finally {
      setProcessingBillId(null);
    }
  };

  // Open Edit Modal with Scope Guard
  const handleOpenEdit = (bill: SPPBill) => {
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk mengubah data tagihan.');
      return;
    }
    if (authorizedStudentIds !== null && !authorizedStudentIds.has(bill.studentId)) {
      showFeedback('error', 'Akses ditolak: Tagihan ini berada di luar wewenang Anda.');
      return;
    }
    setActiveBill(bill);
    setFormData({
      studentId: bill.studentId || '',
      studentName: bill.studentName || '',
      classGroup: bill.classGroup || 'Kelompok A1',
      month: bill.month || getWIBMonthName(),
      year: bill.year || getWIBYear(),
      sppAmount: Number(bill.sppAmount) || 0,
      gedungAmount: Number(bill.gedungAmount) || 0,
      status: (bill.status === 'Lunas' || (bill.status as any) === 'LUNAS' || (bill.status as any) === 'PAID') ? 'Lunas' : bill.status === 'Pending' ? 'Pending' : 'Belum Bayar',
      paidAt: bill.paidAt || '',
      paymentMethod: bill.paymentMethod || 'Transfer QRIS/Bank',
      receiptNo: bill.receiptNo || ''
    });
    setShowEditModal(true);
  };

  // Open Add Modal with Scope Guard
  const handleOpenAdd = () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk membuat tagihan.');
      return;
    }
    const defaultStudent = selectableStudents[0];
    setFormData({
      studentId: defaultStudent ? defaultStudent.id : '',
      studentName: defaultStudent ? defaultStudent.name : '',
      classGroup: defaultStudent ? defaultStudent.classGroup : 'Kelompok A1',
      month: getWIBMonthName(),
      year: getWIBYear(),
      sppAmount: 180000,
      gedungAmount: 0,
      status: 'Belum Bayar',
      paidAt: '',
      paymentMethod: 'Transfer QRIS/Bank',
      receiptNo: ''
    });
    setShowAddModal(true);
  };

  // Handle Student Select Change in Form
  const handleStudentSelect = (studentId: string) => {
    const found = students.find(s => s.id === studentId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        studentId: found.id,
        studentName: found.name,
        classGroup: found.classGroup
      }));
    }
  };

  // Save Single Bill (Create or Edit) with Anti-Double-Submit, Student ID Integrity & Deterministic IDs
  const handleSaveBill = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Authorization Guard
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate || !actorName) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk menyimpan tagihan.');
      return;
    }

    if (saving) return;

    // 2. Student ID Integrity: Validate studentId exists in master student data
    if (!formData.studentId || !formData.studentId.trim()) {
      showFeedback('error', 'Silakan pilih siswa yang valid dari daftar.');
      return;
    }

    const matchedMasterStudent = students.find(s => s.id === formData.studentId.trim());
    if (!matchedMasterStudent) {
      showFeedback('error', 'Data siswa tidak valid atau tidak ditemukan dalam master data siswa.');
      return;
    }

    // 3. Target Scope Guard
    if (authorizedStudentIds !== null && !authorizedStudentIds.has(matchedMasterStudent.id)) {
      showFeedback('error', 'Akses ditolak: Siswa ini berada di luar wewenang Anda.');
      return;
    }

    // 4. Input Validation
    if (formData.sppAmount < 0) {
      showFeedback('error', 'Nominal SPP tidak boleh bernilai negatif.');
      return;
    }

    if (formData.gedungAmount < 0) {
      showFeedback('error', 'Nominal uang gedung tidak boleh bernilai negatif.');
      return;
    }

    setSaving(true);
    try {
      if (showEditModal && activeBill) {
        // Update existing bill (Preserve original ID)
        if (authorizedStudentIds !== null && !authorizedStudentIds.has(activeBill.studentId)) {
          showFeedback('error', 'Akses ditolak: Tagihan ini berada di luar wewenang Anda.');
          return;
        }

        const cleanStudentId = matchedMasterStudent.id.replace(/[^a-zA-Z0-9_-]/g, '');
        const monthNum = getMonthNumber(formData.month);

        const updatedBill: SPPBill = {
          ...activeBill,
          studentId: matchedMasterStudent.id,
          studentName: matchedMasterStudent.name,
          classGroup: matchedMasterStudent.classGroup,
          month: formData.month,
          year: Number(formData.year),
          sppAmount: Number(formData.sppAmount),
          gedungAmount: Number(formData.gedungAmount) || 0,
          status: formData.status,
          paidAt: formData.status === 'Lunas' ? (formData.paidAt || getWIBDateString()) : undefined,
          paymentMethod: formData.status === 'Lunas' ? formData.paymentMethod : undefined,
          receiptNo: formData.status === 'Lunas' ? (formData.receiptNo || `KW-${formData.year}${monthNum}-${cleanStudentId.slice(-4)}`) : undefined
        };

        await DataService.saveSPP(updatedBill);
        setBills(prev => prev.map(b => b.id === activeBill.id ? updatedBill : b));

        // Canonical Non-Blocking Production Audit Trail Logging
        DataService.createAuditLog({
          uid: actorUid,
          userName: actorName,
          role: verifiedActiveRole,
          action: 'SPP_UPDATE',
          targetModule: `SPP Engine - Pembaruan rincian tagihan SPP ananda ${updatedBill.studentName} (${updatedBill.classGroup}, ${updatedBill.month} ${updatedBill.year}). Status: ${updatedBill.status}`
        }).catch(auditErr => {
          console.warn('Audit logging failed non-blockingly:', auditErr);
        });

        showFeedback('success', `Tagihan SPP untuk ${updatedBill.studentName} berhasil diperbarui.`);
        setShowEditModal(false);
      } else {
        // Create new bill
        const monthNum = getMonthNumber(formData.month);
        const cleanStudentId = matchedMasterStudent.id.replace(/[^a-zA-Z0-9_-]/g, '');
        // Deterministic Bill Identity: spp_${year}_${monthNum}_${studentId}
        const generatedId = `spp_${formData.year}_${monthNum}_${cleanStudentId}`;

        // Duplicate Bill Protection verified against existing bills state
        const targetStudentId = matchedMasterStudent.id.trim();
        const targetMonth = formData.month.trim().toLowerCase();
        const targetYear = Number(formData.year);

        const isDuplicate = bills.some(b => {
          const bStudentId = (b.studentId || '').trim();
          const bMonth = (b.month || '').trim().toLowerCase();
          const bYear = Number(b.year);
          return (
            b.id === generatedId ||
            (bStudentId === targetStudentId && bMonth === targetMonth && bYear === targetYear)
          );
        });

        if (isDuplicate) {
          showFeedback('error', `Tagihan SPP bulan ${formData.month} ${formData.year} untuk ananda ${matchedMasterStudent.name} sudah ada.`);
          return;
        }

        const newBill: SPPBill = {
          id: generatedId,
          studentId: matchedMasterStudent.id,
          studentName: matchedMasterStudent.name,
          classGroup: matchedMasterStudent.classGroup,
          month: formData.month,
          year: Number(formData.year),
          sppAmount: Number(formData.sppAmount),
          gedungAmount: Number(formData.gedungAmount) || 0,
          status: formData.status,
          paidAt: formData.status === 'Lunas' ? (formData.paidAt || getWIBDateString()) : undefined,
          paymentMethod: formData.status === 'Lunas' ? formData.paymentMethod : undefined,
          receiptNo: formData.status === 'Lunas' ? (formData.receiptNo || `KW-${formData.year}${monthNum}-${cleanStudentId.slice(-4)}`) : undefined
        };

        await DataService.saveSPP(newBill);
        setBills(prev => [newBill, ...prev.filter(b => b.id !== newBill.id)]);

        // Canonical Non-Blocking Production Audit Trail Logging
        DataService.createAuditLog({
          uid: actorUid,
          userName: actorName,
          role: verifiedActiveRole,
          action: 'SPP_CREATE',
          targetModule: `SPP Engine - Pembuatan tagihan SPP baru ananda ${newBill.studentName} (${newBill.classGroup}) periode ${newBill.month} ${newBill.year}. Nominal: Rp ${newBill.sppAmount.toLocaleString('id-ID')}`
        }).catch(auditErr => {
          console.warn('Audit logging failed non-blockingly:', auditErr);
        });

        showFeedback('success', `Tagihan SPP baru berhasil dibuat untuk ${newBill.studentName}.`);
        setShowAddModal(false);
      }
    } catch (err: any) {
      console.error('Failed to save SPP bill:', err);
      showFeedback('error', 'Gagal menyimpan tagihan: ' + (err?.message || 'Kesalahan sistem'));
    } finally {
      setSaving(false);
    }
  };

  // Batch Generation of Monthly Bills with Sequential Persistence, Deterministic IDs and Truthful Progress
  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Authorization Guard
    if (!currentUser?.uid || !verifiedActiveRole || !canMutate || !actorName) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk membuat tagihan massal.');
      return;
    }

    if (isGeneratingBatch || saving) return;

    // 2. Filter target students from master students
    const targetStudents = students.filter(s => {
      if (s.status && s.status !== 'Aktif') return false;
      if (batchClass !== 'Semua Kelompok' && s.classGroup !== batchClass) return false;
      // If user has restricted student scope, strictly enforce it
      if (authorizedStudentIds !== null && !authorizedStudentIds.has(s.id)) return false;
      return true;
    });

    if (targetStudents.length === 0) {
      showFeedback('info', 'Tidak ada siswa aktif yang sesuai dengan kriteria kelompok yang dipilih.');
      return;
    }

    setIsGeneratingBatch(true);
    setSaving(true);
    try {
      // Build lookup indices for fast duplicate protection across existing bills
      const existingKeys = new Set<string>();
      const existingIds = new Set<string>();

      for (const b of bills) {
        if (b.id) existingIds.add(b.id);
        if (b.studentId && b.month && b.year) {
          existingKeys.add(`${b.studentId.trim()}::${b.month.trim().toLowerCase()}::${Number(b.year)}`);
        }
      }

      const monthNum = getMonthNumber(batchMonth);
      let createdCount = 0;
      let skippedCount = 0;
      let failCount = 0;
      const newBillsList: SPPBill[] = [];

      for (const st of targetStudents) {
        const cleanStudentId = st.id.replace(/[^a-zA-Z0-9_-]/g, '');
        const generatedId = `spp_${batchYear}_${monthNum}_${cleanStudentId}`;
        const compositeKey = `${st.id.trim()}::${batchMonth.trim().toLowerCase()}::${Number(batchYear)}`;

        // Check duplicate records
        if (existingIds.has(generatedId) || existingKeys.has(compositeKey)) {
          skippedCount++;
          continue;
        }

        const newBill: SPPBill = {
          id: generatedId,
          studentId: st.id,
          studentName: st.name,
          classGroup: st.classGroup,
          month: batchMonth,
          year: Number(batchYear),
          sppAmount: Number(batchSppAmount),
          gedungAmount: Number(batchGedungAmount) || 0,
          status: 'Belum Bayar'
        };

        try {
          await DataService.saveSPP(newBill);
          newBillsList.push(newBill);
          existingIds.add(generatedId);
          existingKeys.add(compositeKey);
          createdCount++;
        } catch (itemErr) {
          console.error(`Failed to save SPP for ${st.name}:`, itemErr);
          failCount++;
        }
      }

      if (newBillsList.length > 0) {
        setBills(prev => [...newBillsList, ...prev]);
      }

      // Canonical Non-Blocking Production Audit Trail Logging
      DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'SPP_BATCH_GENERATE',
        targetModule: `SPP Engine - Generate tagihan SPP massal periode ${batchMonth} ${batchYear} target '${batchClass}': ${createdCount} berhasil dibuat, ${skippedCount} dilewati duplikasi, ${failCount} gagal.`
      }).catch(auditErr => {
        console.warn('Audit logging failed non-blockingly:', auditErr);
      });

      // Truthful Feedback (Exact progress reporting)
      if (failCount === 0) {
        showFeedback(
          'success',
          `Batch selesai: ${createdCount} tagihan bulan ${batchMonth} ${batchYear} berhasil digenerate.` +
          (skippedCount > 0 ? ` (${skippedCount} tagihan dilewati karena sudah ada).` : '')
        );
      } else {
        showFeedback(
          'info',
          `Batch selesai sebagian: ${createdCount} berhasil dibuat, ${failCount} gagal diproses, ${skippedCount} dilewati duplikasi.`
        );
      }

      setShowBatchModal(false);
    } catch (err: any) {
      console.error('Failed to generate batch bills:', err);
      showFeedback('error', 'Gagal membuat tagihan massal: ' + (err?.message || 'Kesalahan sistem'));
    } finally {
      setIsGeneratingBatch(false);
      setSaving(false);
    }
  };

  // Filter & Search Pipeline (Operates EXCLUSIVELY on authorizedBills)
  const filteredBills = useMemo(() => {
    return authorizedBills.filter(bill => {
      // Search query (constrained strictly to authorized bills)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (bill.studentName || '').toLowerCase().includes(q);
        const matchesClass = (bill.classGroup || '').toLowerCase().includes(q);
        const matchesMonth = (bill.month || '').toLowerCase().includes(q);
        const matchesReceipt = (bill.receiptNo || '').toLowerCase().includes(q);
        if (!matchesName && !matchesClass && !matchesMonth && !matchesReceipt) {
          return false;
        }
      }

      // Month Filter
      if (selectedMonth !== 'ALL' && bill.month !== selectedMonth) {
        return false;
      }

      // Year Filter
      if (selectedYear && bill.year !== selectedYear) {
        return false;
      }

      // Class Filter
      if (selectedClass !== 'Semua Kelompok' && bill.classGroup !== selectedClass) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'ALL' && bill.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comp = 0;
      if (sortField === 'studentName') {
        comp = (a.studentName || '').localeCompare(b.studentName || '');
      } else if (sortField === 'month') {
        const idxA = MONTH_NAMES.indexOf(a.month);
        const idxB = MONTH_NAMES.indexOf(b.month);
        comp = idxA - idxB;
      } else if (sortField === 'sppAmount') {
        comp = (Number(a.sppAmount) || 0) - (Number(b.sppAmount) || 0);
      } else if (sortField === 'status') {
        comp = (a.status || '').localeCompare(b.status || '');
      }
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [authorizedBills, searchQuery, selectedMonth, selectedYear, selectedClass, selectedStatus, sortField, sortOrder]);

  // Real Summary Calculations (Derived purely from filtered authorized data, NO dummy numbers)
  const summary = useMemo(() => {
    const totalCount = filteredBills.length;
    let totalNominal = 0;
    let paidCount = 0;
    let paidNominal = 0;
    let unpaidCount = 0;
    let unpaidNominal = 0;
    let pendingCount = 0;
    let pendingNominal = 0;

    for (const b of filteredBills) {
      const nominal = (Number(b.sppAmount) || 0) + (Number(b.gedungAmount) || 0);
      totalNominal += nominal;
      if (b.status === 'Lunas') {
        paidCount++;
        paidNominal += nominal;
      } else if (b.status === 'Pending') {
        pendingCount++;
        pendingNominal += nominal;
      } else {
        unpaidCount++;
        unpaidNominal += nominal;
      }
    }

    const collectionRate = totalNominal > 0 ? Math.round((paidNominal / totalNominal) * 100) : 0;

    return {
      totalCount,
      totalNominal,
      paidCount,
      paidNominal,
      unpaidCount,
      unpaidNominal,
      pendingCount,
      pendingNominal,
      collectionRate
    };
  }, [filteredBills]);

  // Helper for Student Phone lookup (Enforces scope check)
  const getStudentPhone = (studentId: string): string => {
    if (authorizedStudentIds !== null && !authorizedStudentIds.has(studentId)) {
      return '';
    }
    const st = students.find(s => s.id === studentId);
    if (st && st.parentPhone) {
      let p = st.parentPhone.replace(/[^0-9]/g, '');
      if (p.startsWith('0')) p = '62' + p.substring(1);
      return p;
    }
    return '';
  };

  // Security Fail-Closed Render Guard: Sensitive DOM Isolation
  // Unauthenticated or peripheral role without financial mandate (e.g. CALON_WALI_MURID, ALUMNI_FAMILY, invalid activeRole)
  // NEVER render the financial DOM, billing tables, mutation buttons, or analytics cards.
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR10) {
    return (
      <div
        id="r10-access-denied-container"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5"
      >
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-rose-700" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            KEAMANAN KEUANGAN & SPP SISWA
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Akses Data Keuangan & SPP Dibatasi
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {!currentUser?.uid
              ? 'Sesi Anda belum terautentikasi. Silakan masuk terlebih dahulu untuk mengakses data tagihan dan riwayat pembayaran SPP.'
              : !verifiedActiveRole
              ? 'Peran akun tidak terverifikasi secara sah dalam sistem kanonikal TK Asy-Syifa.'
              : `Peran Anda (${verifiedActiveRole}) tidak memiliki wewenang untuk mengakses manajemen tagihan SPP dan arsip keuangan sekolah.`}
          </p>
        </div>
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sim"
            id="btn-r10-back-sim"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Kembali ke Beranda SIM
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="r10-spp-container" className="space-y-6">
      {/* Toast / Feedback Banner with Dismiss */}
      {feedback && (
        <div
          id="spp-feedback-banner"
          className={`p-4 rounded-2xl flex items-center justify-between shadow-xs border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <Clock className="w-5 h-5 text-blue-600 shrink-0" />}
            <span className="text-xs font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Module R10 • SPP & Finance
            </span>
            <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {authorizedBills.length} Data Tagihan
            </span>
            {isWaliMuridRole && (
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Portal Khusus Ananda
              </span>
            )}
            {isGuruRole && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Guru Kelas ({matchedTeacher?.assignedClass || 'Tidak Ditemukan'}) • Baca Saja
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Manajemen Tagihan SPP & Keuangan Siswa
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Monitoring tagihan bulanan, pencatatan lunas, verifikasi kwitansi, dan pengingat wali murid TK Asy Syifa Tanggul.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          {canMutate && (
            <>
              <button
                onClick={() => setShowBatchModal(true)}
                disabled={isGeneratingBatch || saving}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Generate Bulanan</span>
              </button>

              <button
                onClick={handleOpenAdd}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tagihan</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Role Privacy Boundary Banner for WALI_MURID */}
      {isWaliMuridRole && (
        <div id="r10-wali-privacy-boundary" className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                Portal Tagihan Mandiri — Perlindungan Privasi Finansial Keluarga
              </h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed max-w-2xl">
                Sesuai Konstitusi Keamanan TADE, seluruh data tagihan dan rincian transaksi dibatasi strictly hanya untuk ananda yang terdaftar di akun Anda ({students.map(s => s.name).join(', ') || 'Santri Terdaftar'}). Data tagihan keluarga lain tidak dimuat ke dalam memori peramban Anda.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-900 bg-white px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
            Zero Cross-Family Leakage
          </span>
        </div>
      )}

      {/* Summary Analytics Cards (Role-Scoped: Parent sees only linked children; Teacher sees homeroom; Management sees school) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tagihan */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isWaliMuridRole ? 'Total Tagihan Ananda' : isGuruRole ? 'Total Tagihan Kelas' : 'Total Tagihan'}
            </span>
            <Receipt className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl font-black text-slate-900">
            Rp {summary.totalNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {summary.totalCount} Record Tagihan
          </div>
        </div>

        {/* Lunas */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terkumpul (Lunas)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-900">
            Rp {summary.paidNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            {summary.paidCount} Pembayaran Lunas ({summary.collectionRate}%)
          </div>
        </div>

        {/* Belum Bayar */}
        <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tertunggak (Belum Bayar)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-900">
            Rp {summary.unpaidNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            {summary.unpaidCount} Tagihan Belum Lunas
          </div>
        </div>

        {/* Pending Verifikasi */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-900">
            Rp {summary.pendingNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            {summary.pendingCount} Transaksi Pending
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, kelompok, kwitansi..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Month Selector */}
          <div>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
            >
              <option value="ALL">Semua Bulan</option>
              {MONTH_NAMES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Class Selector */}
          <div>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              disabled={isGuruRole && Boolean(matchedTeacher?.assignedClass)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isManagementOrFinance && <option value="Semua Kelompok">Semua Kelompok</option>}
              {availableClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
            >
              <option value="ALL">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum Bayar">Belum Bayar</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Sorting Bar */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 flex-wrap gap-2">
          <div className="text-stone-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">{filteredBills.length}</span> dari {authorizedBills.length} data tagihan
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium text-[11px]">Urutkan:</span>
            <button
              onClick={() => {
                if (sortField === 'studentName') {
                  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('studentName');
                  setSortOrder('asc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                sortField === 'studentName' ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>Nama</span>
              {sortField === 'studentName' && <ArrowUpDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => {
                if (sortField === 'month') {
                  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('month');
                  setSortOrder('asc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                sortField === 'month' ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>Bulan</span>
              {sortField === 'month' && <ArrowUpDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => {
                if (sortField === 'sppAmount') {
                  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('sppAmount');
                  setSortOrder('asc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                sortField === 'sppAmount' ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>Nominal</span>
              {sortField === 'sppAmount' && <ArrowUpDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Table / List Container */}
      {loading && bills.length === 0 ? (
        <SIMSkeletonLoader type="table" />
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          {filteredBills.length === 0 ? (
            <SIMEmptyState
              type="payments"
              title={
                !currentUser?.uid || !verifiedActiveRole
                  ? 'Akses Keuangan Terbatas'
                  : authorizedBills.length === 0
                  ? 'Belum Ada Tagihan untuk Anda'
                  : 'Tidak Ada Tagihan yang Cocok'
              }
              description={
                !currentUser?.uid || !verifiedActiveRole
                  ? 'Silakan masuk dengan akun terverifikasi untuk mengakses arsip tagihan SPP.'
                  : authorizedBills.length === 0
                  ? isWaliMuridRole
                    ? 'Belum ada catatan tagihan SPP yang diterbitkan untuk ananda tercatat.'
                    : 'Belum ada data tagihan SPP di sistem.'
                  : 'Tidak ada tagihan yang sesuai dengan kriteria pencarian dan filter saat ini.'
              }
              actionLabel={canMutate && authorizedBills.length === 0 ? 'Buat Tagihan Pertama' : undefined}
              onAction={canMutate && authorizedBills.length === 0 ? handleOpenAdd : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Nama Siswa</th>
                    <th className="p-3.5">Kelompok</th>
                    <th className="p-3.5">Periode</th>
                    <th className="p-3.5 text-right">Nominal SPP</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5">Detail Pembayaran</th>
                    <th className="p-3.5 text-right rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBills.map(b => {
                    const studentPhone = getStudentPhone(b.studentId);
                    const totalNominal = (Number(b.sppAmount) || 0) + (Number(b.gedungAmount) || 0);
                    const waMsg = encodeURIComponent(
                      `*TK ISLAM TERPADU ASY-SYIFA*\n\n` +
                      `Assalamu'alaikum Wr. Wb.\n` +
                      `Kepada Yth. Orang Tua / Wali Murid dari ananda *${b.studentName}* (${b.classGroup}):\n\n` +
                      `Mengingatkan informasi tagihan SPP:\n` +
                      `• Periode: *${b.month} ${b.year}*\n` +
                      `• Nominal SPP: *Rp ${(Number(b.sppAmount) || 0).toLocaleString('id-ID')}*\n` +
                      (b.gedungAmount ? `• Uang Gedung/Lainnya: *Rp ${Number(b.gedungAmount).toLocaleString('id-ID')}*\n` : '') +
                      `• Total: *Rp ${totalNominal.toLocaleString('id-ID')}*\n` +
                      `• Status: *${b.status}*\n\n` +
                      (b.status === 'Lunas'
                        ? `Alhamdulillah pembayaran telah kami terima dengan nomor kwitansi *${b.receiptNo || '-'}* pada tanggal ${b.paidAt || '-'}. Terima kasih.`
                        : `Pembayaran dapat disalurkan melalui kasir TU sekolah atau transfer bank/QRIS resmi sekolah. Terima kasih.`)
                    );

                    const isProcessingThis = processingBillId === b.id;

                    return (
                      <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                        {/* Student Name */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{b.studentName}</div>
                          {b.receiptNo && (
                            <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                              No. Kwitansi: {b.receiptNo}
                            </div>
                          )}
                        </td>

                        {/* Class */}
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px]">
                            {b.classGroup}
                          </span>
                        </td>

                        {/* Period */}
                        <td className="p-3.5 font-semibold text-slate-800">
                          {b.month} {b.year}
                        </td>

                        {/* Nominal */}
                        <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                          <div>Rp {(Number(b.sppAmount) || 0).toLocaleString('id-ID')}</div>
                          {b.gedungAmount && b.gedungAmount > 0 ? (
                            <div className="text-[10px] text-stone-400 font-normal">
                              + Gedung: Rp {Number(b.gedungAmount).toLocaleString('id-ID')}
                            </div>
                          ) : null}
                        </td>

                        {/* Status */}
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              b.status === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : b.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {b.status === 'Lunas' && <Check className="w-3 h-3" />}
                            {b.status === 'Pending' && <Clock className="w-3 h-3" />}
                            {b.status === 'Belum Bayar' && <AlertTriangle className="w-3 h-3" />}
                            <span>{b.status}</span>
                          </span>
                        </td>

                        {/* Payment Details */}
                        <td className="p-3.5 text-stone-600">
                          {b.status === 'Lunas' ? (
                            <div>
                              <div className="font-semibold text-slate-800">{b.paidAt || 'Tanggal tercatat'}</div>
                              <div className="text-[10px] text-stone-500">{b.paymentMethod || 'Metode standar'}</div>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">Belum ada transaksi</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick Toggle Status with Anti-Double-Submit */}
                            {canMutate && (
                              <button
                                onClick={() => handleToggleStatus(b)}
                                disabled={isProcessingThis || !!processingBillId || saving}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                  b.status === 'Lunas'
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs'
                                }`}
                                title={b.status === 'Lunas' ? 'Ubah status ke Belum Bayar' : 'Tandai sudah Lunas'}
                              >
                                {isProcessingThis ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    <span>Menyimpan...</span>
                                  </>
                                ) : b.status === 'Lunas' ? (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>Batal Lunas</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Tandai Lunas</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Edit Details */}
                            {canMutate && (
                              <button
                                onClick={() => handleOpenEdit(b)}
                                disabled={isProcessingThis || saving}
                                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer disabled:opacity-50"
                                title="Edit Rincian Tagihan"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* WhatsApp Reminder (Management / Staff only) */}
                            {canMutate && (
                              <a
                                href={
                                  studentPhone
                                    ? `https://wa.me/${studentPhone}?text=${waMsg}`
                                    : `https://wa.me/?text=${waMsg}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition"
                                title="Kirim Notifikasi / Kwitansi via WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Tambah / Edit Tagihan */}
      {(showAddModal || showEditModal) && canMutate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {showEditModal ? 'Edit Tagihan SPP' : 'Buat Tagihan SPP Baru'}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  {showEditModal ? 'Perbarui data nominal atau status pembayaran' : 'Pilih siswa dan tentukan periode tagihan'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                disabled={saving}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="space-y-4">
              {/* Student Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Siswa <span className="text-rose-500">*</span>
                </label>
                {showEditModal ? (
                  <div className="px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-slate-800">
                    {formData.studentName} ({formData.classGroup})
                  </div>
                ) : (
                  <select
                    value={formData.studentId}
                    onChange={e => handleStudentSelect(e.target.value)}
                    required
                    disabled={saving}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:opacity-60"
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {selectableStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.classGroup})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Month & Year Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bulan Tagihan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.month}
                    onChange={e => setFormData({ ...formData, month: e.target.value })}
                    disabled={saving}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:opacity-60"
                  >
                    {MONTH_NAMES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                    required
                    disabled={saving}
                    min={2020}
                    max={2035}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Nominal SPP & Gedung */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nominal SPP (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.sppAmount}
                    onChange={e => setFormData({ ...formData, sppAmount: Number(e.target.value) })}
                    required
                    disabled={saving}
                    min={0}
                    step={1000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Uang Gedung / Lainnya (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.gedungAmount}
                    onChange={e => setFormData({ ...formData, gedungAmount: Number(e.target.value) })}
                    disabled={saving}
                    min={0}
                    step={1000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Pembayaran <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Belum Bayar', 'Lunas', 'Pending'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      disabled={saving}
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={`py-2 rounded-xl text-xs font-bold transition border disabled:opacity-50 ${
                        formData.status === st
                          ? st === 'Lunas'
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : st === 'Pending'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-rose-600 text-white border-rose-600'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Lunas -> Additional Payment Fields */}
              {formData.status === 'Lunas' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Tanggal Bayar
                      </label>
                      <input
                        type="date"
                        value={formData.paidAt || getWIBDateString()}
                        onChange={e => setFormData({ ...formData, paidAt: e.target.value })}
                        disabled={saving}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                        Metode Pembayaran
                      </label>
                      <select
                        value={formData.paymentMethod}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        disabled={saving}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-60"
                      >
                        {PAYMENT_METHODS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Nomor Kwitansi
                    </label>
                    <input
                      type="text"
                      value={formData.receiptNo}
                      onChange={e => setFormData({ ...formData, receiptNo: e.target.value })}
                      disabled={saving}
                      placeholder={`Contoh: KW-${formData.year}-001`}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs font-mono font-medium text-slate-800 disabled:opacity-60"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{showEditModal ? 'Simpan Perubahan' : 'Buat Tagihan'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Bulanan Batch */}
      {showBatchModal && canMutate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  <span>Generate Tagihan SPP Massal</span>
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Buat tagihan SPP bulanan otomatis untuk seluruh siswa aktif
                </p>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                disabled={isGeneratingBatch || saving}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="space-y-4">
              {/* Target Class */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Kelompok Kelas <span className="text-rose-500">*</span>
                </label>
                <select
                  value={batchClass}
                  onChange={e => setBatchClass(e.target.value)}
                  disabled={isGeneratingBatch || saving}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 disabled:opacity-60"
                >
                  {CLASS_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Month & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bulan Tagihan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={batchMonth}
                    onChange={e => setBatchMonth(e.target.value)}
                    disabled={isGeneratingBatch || saving}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 disabled:opacity-60"
                  >
                    {MONTH_NAMES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={batchYear}
                    onChange={e => setBatchYear(Number(e.target.value))}
                    required
                    disabled={isGeneratingBatch || saving}
                    min={2020}
                    max={2035}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-slate-800 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Nominal SPP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal SPP Standar (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={batchSppAmount}
                  onChange={e => setBatchSppAmount(Number(e.target.value))}
                  required
                  disabled={isGeneratingBatch || saving}
                  min={0}
                  step={1000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-slate-800 disabled:opacity-60"
                />
              </div>

              {/* Safety notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Perlindungan Data:</div>
                  <div className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                    Sistem secara otomatis akan melewati (skip) siswa yang sudah memiliki tagihan pada bulan dan tahun yang sama untuk mencegah duplikasi data.
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  disabled={isGeneratingBatch || saving}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingBatch || saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingBatch ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses Tagihan...</span>
                    </>
                  ) : (
                    <span>Proses Generate Tagihan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default R10SPPTagihan;
