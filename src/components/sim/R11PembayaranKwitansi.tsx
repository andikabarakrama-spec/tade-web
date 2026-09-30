import React, { useState, useEffect, useMemo } from 'react';
import { PaymentTransaction, PaymentCategory, PaymentMethod, EWalletProvider, Student, Teacher, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';
import {
  CreditCard,
  Building2,
  Wallet,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Download,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  UserCheck,
  ArrowRight,
  RefreshCw,
  X,
  QrCode,
  Settings,
  Camera,
  Check,
  Copy,
  Shield
} from 'lucide-react';

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

const FINANCIAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KEUANGAN',
  'KETUA_YAYASAN'
];

const formatDateCanonical = (isoDateString?: string): string => {
  if (!isoDateString) return '-';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '-';
  }
};

export const R11PembayaranKwitansi: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE' | 'SETTINGS' | 'QR_SCANNER'>('LIST');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Payment Settings state
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // QR Scanner / Validator state
  const [qrInputText, setQrInputText] = useState('');
  const [scanningQR, setScanningQR] = useState(false);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [qrScanResult, setQrScanResult] = useState<any>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Payment for Modal / Receipt
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Form State for New Payment
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [category, setCategory] = useState<PaymentCategory>('SPP');
  const [amount, setAmount] = useState<number>(180000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER_BANK');
  const [proofUrl, setProofUrl] = useState('');

  // Transfer Bank details
  const [bankName, setBankName] = useState('Bank BSI (Bank Syariah Indonesia)');
  const [accountNumber, setAccountNumber] = useState('');
  const [senderName, setSenderName] = useState('');

  // E-Wallet details
  const [walletProvider, setWalletProvider] = useState<EWalletProvider>('QRIS');
  const [walletNumber, setWalletNumber] = useState('');

  // Cash details
  const [cashReceivedBy, setCashReceivedBy] = useState('');

  // 1. Authoritative Fail-Closed Active Role Determination (SEC-01 & SEC-02)
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Derived Security Role Boundaries
  const isFinancialRole = useMemo(() => {
    return Boolean(verifiedActiveRole && FINANCIAL_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const isGuru = useMemo(() => {
    return verifiedActiveRole === 'GURU';
  }, [verifiedActiveRole]);

  const isWali = useMemo(() => {
    return verifiedActiveRole === 'WALI_MURID' || verifiedActiveRole === 'CALON_WALI_MURID';
  }, [verifiedActiveRole]);

  // Authenticated Actor Identity (NO hardcoded fallback) (SEC-01, AUD-02)
  const actorName = useMemo(() => {
    return userProfile?.nama || userProfile?.name || currentUser?.displayName || currentUser?.email || 'Pengguna Terautentikasi';
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email]);

  const actorUid = currentUser?.uid || '';

  // Find teacher profile for homeroom isolation (PRIV-01)
  const matchedTeacher = useMemo<Teacher | null>(() => {
    if (!isGuru || !currentUser?.uid) return null;
    const cleanEmail = currentUser.email?.trim().toLowerCase();
    const cleanName = (userProfile?.nama || userProfile?.name || currentUser.displayName || '').trim().toLowerCase();

    return (
      teachers.find(t => (t as any).uid === currentUser.uid) ||
      teachers.find(t => t.id === currentUser.uid) ||
      (cleanEmail ? teachers.find(t => (t as any).email && (t as any).email.trim().toLowerCase() === cleanEmail) : null) ||
      (cleanName ? teachers.find(t => t.name && t.name.trim().toLowerCase() === cleanName) : null) ||
      null
    );
  }, [isGuru, currentUser?.uid, currentUser?.email, userProfile?.nama, userProfile?.name, currentUser?.displayName, teachers]);

  // Authorized Student IDs Scoping (PRIV-01)
  const authorizedStudentIds = useMemo<Set<string> | null>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      return new Set<string>(); // deny-all
    }

    if (isFinancialRole) {
      return null; // Full access for authorized financial management roles
    }

    if (isWali) {
      const cleanEmail = currentUser.email?.trim().toLowerCase();
      const cleanProfileEmail = userProfile?.email?.trim().toLowerCase();

      const linked = students.filter(s =>
        (s.parentUid && s.parentUid === currentUser.uid) ||
        (s.waliUid && s.waliUid === currentUser.uid) ||
        (s.waliMuridUid && s.waliMuridUid === currentUser.uid) ||
        (cleanEmail && s.parentEmail && s.parentEmail.trim().toLowerCase() === cleanEmail) ||
        (cleanProfileEmail && s.parentEmail && s.parentEmail.trim().toLowerCase() === cleanProfileEmail)
      ).map(s => s.id);

      return new Set<string>(linked);
    }

    if (isGuru) {
      // Guru homeroom isolation: only view students belonging to teacher's assignedClass
      if (!matchedTeacher || !matchedTeacher.assignedClass) {
        return new Set<string>(); // Unassigned teacher: zero records
      }
      const homeroomStudents = students
        .filter(s => (s.kelompok === matchedTeacher.assignedClass || s.classGroup === matchedTeacher.assignedClass))
        .map(s => s.id);
      return new Set<string>(homeroomStudents);
    }

    return new Set<string>();
  }, [
    currentUser?.uid,
    currentUser?.email,
    userProfile?.email,
    verifiedActiveRole,
    isFinancialRole,
    isWali,
    isGuru,
    matchedTeacher,
    students
  ]);

  const authorizedStudents = useMemo<Student[]>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return [];
    if (authorizedStudentIds === null) return students;
    return students.filter(s => authorizedStudentIds.has(s.id));
  }, [students, currentUser?.uid, verifiedActiveRole, authorizedStudentIds]);

  const authorizedPayments = useMemo<PaymentTransaction[]>(() => {
    if (!currentUser?.uid || !verifiedActiveRole) return [];
    if (authorizedStudentIds === null) return payments;
    return payments.filter(p => authorizedStudentIds.has(p.studentId));
  }, [payments, currentUser?.uid, verifiedActiveRole, authorizedStudentIds]);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadData = async () => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [pList, sList, tList, pSettings] = await Promise.all([
        DataService.getPayments(verifiedActiveRole, currentUser.uid),
        DataService.getStudents(verifiedActiveRole, currentUser.uid, currentUser.email || undefined),
        DataService.getTeachers(),
        DataService.getPaymentSettings()
      ]);
      setPayments(pList);
      setStudents(sList);
      setTeachers(tList);
      setPaymentSettings(pSettings);
      if (pSettings) {
        setBankName(pSettings.bankName || 'Bank BSI (Bank Syariah Indonesia)');
        setAccountNumber(pSettings.accountNumber || '');
      }
    } catch (err) {
      console.error('Failed loading payments data', err);
      showFeedback('error', 'Gagal memuat data transaksi pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.uid, verifiedActiveRole]);

  useEffect(() => {
    if (authorizedStudents.length > 0 && (!selectedStudentId || !authorizedStudents.some(s => s.id === selectedStudentId))) {
      setSelectedStudentId(authorizedStudents[0].id);
    }
  }, [authorizedStudents, selectedStudentId]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // CONC-01

    // SEC-03: Authentication & Active Role Guard
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Pengguna tidak terautentikasi atau peran tidak valid.');
      return;
    }

    // DAT-03: Validation of parameters
    if (!selectedStudentId || typeof selectedStudentId !== 'string' || !selectedStudentId.trim()) {
      showFeedback('error', 'Pilih siswa terlebih dahulu!');
      return;
    }

    // PRIV-01: Scoping check
    if (authorizedStudentIds !== null && !authorizedStudentIds.has(selectedStudentId)) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki otoritas untuk memproses pembayaran siswa ini.');
      return;
    }

    if (amount <= 0 || isNaN(amount) || !isFinite(amount)) {
      showFeedback('error', 'Nominal pembayaran harus berupa angka positif lebih besar dari Rp 0.');
      return;
    }

    const validCategories: PaymentCategory[] = ['SPP', 'PPDB', 'Seragam', 'Kegiatan', 'Study Tour', 'Administrasi', 'Infak', 'Lainnya'];
    if (!validCategories.includes(category)) {
      showFeedback('error', 'Kategori pembayaran tidak valid.');
      return;
    }

    const validMethods: PaymentMethod[] = ['TRANSFER_BANK', 'E_WALLET', 'CASH'];
    if (!validMethods.includes(paymentMethod)) {
      showFeedback('error', 'Metode pembayaran tidak valid.');
      return;
    }

    if (paymentMethod === 'CASH' && !isFinancialRole) {
      showFeedback('error', 'Pencatatan pembayaran tunai (CASH) hanya dapat dilakukan oleh staf Keuangan/Admin.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedStudent = authorizedStudents.find(s => s.id === selectedStudentId) || students.find(s => s.id === selectedStudentId);

      // DAT-01: Full canonical ISO string
      const isoNow = new Date().toISOString();

      const newPayment = await DataService.createPaymentTransaction(
        {
          studentId: selectedStudentId,
          studentName: selectedStudent?.namaLengkap || selectedStudent?.name || 'Siswa',
          classGroup: selectedStudent?.kelompok || selectedStudent?.classGroup || '-',
          category,
          amount,
          paymentMethod,
          proofFile: proofUrl || 'https://storage.googleapis.com/tade-proofs/proof_default.png',
          bankName: paymentMethod === 'TRANSFER_BANK' ? bankName : undefined,
          accountNumber: paymentMethod === 'TRANSFER_BANK' ? accountNumber : undefined,
          senderName: senderName || actorName,
          walletProvider: paymentMethod === 'E_WALLET' ? walletProvider : undefined,
          walletNumber: paymentMethod === 'E_WALLET' ? walletNumber : undefined,
          cashReceivedBy: paymentMethod === 'CASH' ? (cashReceivedBy || actorName) : undefined,
          cashDate: paymentMethod === 'CASH' ? isoNow : undefined
        },
        actorUid,
        actorName,
        verifiedActiveRole
      );

      // AUD-01 & AUD-02: Canonical Audit Log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'CREATE_PAYMENT',
        targetModule: `Payment Engine - Transaksi ${newPayment.transactionNumber} (${newPayment.category} - Rp ${newPayment.amount.toLocaleString('id-ID')}) untuk ${newPayment.studentName}`
      }).catch(() => {});

      showFeedback('success', `Transaksi pembayaran ${newPayment.transactionNumber} berhasil dibuat dan dikirim untuk verifikasi.`);
      setPayments(prev => [newPayment, ...prev]);
      setActiveTab('LIST');
      // Reset form
      setProofUrl('');
      setSenderName('');
    } catch (err: any) {
      showFeedback('error', `Gagal membuat pembayaran: ${err.message || 'Terjadi kesalahan sistem.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (status: 'APPROVED' | 'REJECTED') => {
    if (verifying) return; // CONC-01

    // SEC-03
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Pengguna tidak terautentikasi.');
      return;
    }

    if (!selectedPayment) return;
    if (!isFinancialRole) {
      showFeedback('error', 'Akses ditolak: Hanya Staf Keuangan, Admin, dan Kepala Sekolah yang berhak memverifikasi transaksi.');
      return;
    }
    setVerifying(true);
    try {
      const updated = await DataService.verifyPaymentTransaction(
        selectedPayment.id,
        status,
        actorName,
        verifiedActiveRole,
        verifyNotes
      );

      // AUD-01 & AUD-02: Canonical Audit Log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: status === 'APPROVED' ? 'APPROVE_PAYMENT' : 'REJECT_PAYMENT',
        targetModule: `Payment Engine - Verifikasi transaksi ${updated.transactionNumber} (${updated.studentName || 'Siswa'} - Rp ${updated.amount.toLocaleString('id-ID')}) status: ${status}`
      }).catch(() => {});

      setPayments(payments.map(p => p.id === updated.id ? updated : p));
      setSelectedPayment(updated);
      showFeedback('success', `Status transaksi ${updated.transactionNumber} berhasil diubah menjadi ${status}.`);
      if (status === 'APPROVED') {
        setShowReceiptModal(true);
      }
    } catch (err: any) {
      showFeedback('error', `Gagal memverifikasi transaksi: ${err.message || 'Terjadi kesalahan sistem.'}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleExportExcel = async () => {
    if (exporting) return; // CONC-01

    // SEC-03
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Pengguna tidak terautentikasi.');
      return;
    }

    if (!isFinancialRole) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk mengekspor laporan keuangan.');
      return;
    }
    setExporting(true);
    try {
      await DataService.exportPaymentReportLog(
        actorUid,
        actorName,
        verifiedActiveRole,
        categoryFilter
      );

      // AUD-01 & AUD-02: Canonical Audit Log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'EXPORT_FINANCIAL_REPORT',
        targetModule: `Payment Engine - Ekspor laporan keuangan CSV (${categoryFilter || 'ALL'}, ${filteredPayments.length} record)`
      }).catch(() => {});

      // Trigger standard CSV download with DAT-02 canonical dates
      const headers = ['No Transaksi', 'Siswa', 'Kategori', 'Metode', 'Nominal', 'Status', 'Tanggal'];
      const rows = filteredPayments.map(p => [
        p.transactionNumber,
        p.studentName || '-',
        p.category,
        p.paymentMethod,
        p.amount,
        p.paymentStatus,
        formatDateCanonical(p.createdAt)
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      // DAT-01: Validated ISO date format
      const exportDate = new Date();
      const exportDateStr = !isNaN(exportDate.getTime()) ? exportDate.toISOString().slice(0, 10) : 'export';
      link.setAttribute('download', `Laporan_Pembayaran_TADE_${exportDateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showFeedback('success', 'Laporan keuangan berhasil di-export ke CSV/Excel.');
    } catch (err: any) {
      showFeedback('error', `Gagal export laporan: ${err.message || 'Terjadi kesalahan sistem.'}`);
    } finally {
      setExporting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingSettings) return; // CONC-01

    // SEC-03
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Pengguna tidak terautentikasi.');
      return;
    }

    if (!paymentSettings) return;
    if (!isFinancialRole) {
      showFeedback('error', 'Akses ditolak: Hanya role Keuangan dan Admin yang dapat mengubah pengaturan pembayaran.');
      return;
    }
    setSavingSettings(true);
    try {
      const updated = await DataService.savePaymentSettings(
        paymentSettings,
        actorUid,
        actorName,
        verifiedActiveRole
      );

      // AUD-01 & AUD-02: Canonical Audit Log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'SETTINGS_UPDATE',
        targetModule: `Payment Engine Settings - Saluran rekening pembayaran: Bank ${updated.bankName || 'BSI'} (${updated.accountNumber || '-'}) & E-Wallet/QRIS diperbarui`
      }).catch(() => {});

      setPaymentSettings(updated);
      showFeedback('success', 'Pengaturan rekening & QRIS resmi pembayaran berhasil diperbarui.');
    } catch (err: any) {
      showFeedback('error', `Gagal menyimpan pengaturan: ${err.message || 'Terjadi kesalahan sistem.'}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleScanQR = async () => {
    if (scanningQR) return; // CONC-01

    // SEC-03
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Pengguna tidak terautentikasi.');
      return;
    }

    if (!qrInputText.trim()) {
      showFeedback('error', 'Masukkan atau scan token QR terlebih dahulu!');
      return;
    }
    setScanningQR(true);
    try {
      const result = await DataService.validateAndProcessQRToken(
        qrInputText.trim(),
        actorUid,
        actorName,
        verifiedActiveRole
      );
      setQrScanResult(result);

      // AUD-01 & AUD-02: Canonical Audit Log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: result.success ? 'SCAN_QR_SUCCESS' : 'SCAN_QR_FAILED',
        targetModule: `Payment Engine - Pindai token QR: ${qrInputText.trim().substring(0, 24)}... (Status: ${result.success ? 'VALID' : 'INVALID'})`
      }).catch(() => {});

      if (result.success) {
        showFeedback('success', 'Token QR valid dan berhasil diproses!');
      } else {
        showFeedback('error', result.message || 'Token QR tidak valid.');
      }
    } catch (err: any) {
      setQrScanResult({ success: false, message: `Error pemindaian: ${err.message}` });
      showFeedback('error', `Error pemindaian: ${err.message}`);
    } finally {
      setScanningQR(false);
    }
  };

  const handleGenerateSimulationToken = async () => {
    if (generatingToken) return; // CONC-01

    // SEC-03
    if (!currentUser?.uid || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Pengguna tidak terautentikasi.');
      return;
    }

    setGeneratingToken(true);
    try {
      const token = await DataService.generateQRToken({
        purpose: 'PAYMENT',
        targetId: 'PAY_SIMULATION_SANDBOX_123',
        title: 'Token Simulasi Pengujian Format Scanner (Sandbox)',
        metadata: {
          isSimulation: true,
          amount: 180000,
          category: 'SPP',
          notice: 'Token ini adalah data uji coba sandbox non-finansial'
        },
        expiryMinutes: 30,
        userUid: actorUid,
        userName: actorName,
        userRole: verifiedActiveRole
      });
      setQrInputText(token.tokenString);
      showFeedback('info', 'Token simulasi format QR (Sandbox 30 Menit) berhasil dibuat. Klik tombol Verifikasi untuk menguji scanner.');
    } catch (err: any) {
      showFeedback('error', `Gagal membuat token simulasi: ${err.message || 'Terjadi kesalahan sistem.'}`);
    } finally {
      setGeneratingToken(false);
    }
  };

  // Filter payments - Scoped by authorizedPayments (PRIV-01)
  const filteredPayments = useMemo(() => {
    return authorizedPayments.filter(p => {
      const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'ALL' || p.paymentStatus === statusFilter;
      const matchSearch = (p.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.transactionNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.payerName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });
  }, [authorizedPayments, categoryFilter, statusFilter, searchQuery]);

  const totalAmountApproved = useMemo(() => {
    return filteredPayments
      .filter(p => p.paymentStatus === 'APPROVED')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const getStatusBadge = (status: PaymentTransaction['paymentStatus']) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> APPROVED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> REJECTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 w-fit"><Clock className="w-3 h-3 animate-spin" /> PENDING</span>;
    }
  };

  // SEC-03: Fail-Closed Render Guard
  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-rose-200 text-center space-y-4 max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Ditolak / Sesi Tidak Terverifikasi</h2>
        <p className="text-xs text-stone-600">
          Modul R11 (Pembayaran & Kwitansi) memberlakukan prinsip keamanan Fail-Closed. Akses ditolak karena identitas pengguna tidak valid atau active role di luar Canonical Roles TADE.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            TADE Financial Engine v24.9
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Pusat Transaksi & Engine Pembayaran Sekolah
          </h1>
          <p className="text-stone-500 text-xs">
            Multi-channel Payment Hub: Transfer Bank, E-Wallet (QRIS/DANA), & Cash dengan Verifikasi Central Approval & Auto Kwitansi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2.5 font-bold text-xs rounded-2xl flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'LIST' ? 'bg-slate-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Daftar Transaksi
          </button>
          <button
            onClick={() => setActiveTab('CREATE')}
            className={`px-4 py-2.5 font-bold text-xs rounded-2xl flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'CREATE' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Plus className="w-4 h-4" /> Pembayaran Baru
          </button>
          <button
            onClick={() => setActiveTab('QR_SCANNER')}
            className={`px-4 py-2.5 font-bold text-xs rounded-2xl flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'QR_SCANNER' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <QrCode className="w-4 h-4" /> QR Scanner
          </button>
          {isFinancialRole && (
            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`px-4 py-2.5 font-bold text-xs rounded-2xl flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'SETTINGS' ? 'bg-slate-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Settings className="w-4 h-4" /> Pengaturan Channel
            </button>
          )}
          {isFinancialRole && (
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              {exporting ? 'Mengekspor...' : 'Export Excel'}
            </button>
          )}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[10px] font-bold opacity-70 hover:opacity-100 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Transaksi</span>
          <div className="text-xl font-black text-slate-900">{authorizedPayments.length} Record</div>
          <p className="text-[10px] text-stone-400">Riwayat pembayaran dalam otorisasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Terverifikasi (Approved)</span>
          <div className="text-xl font-black text-emerald-900">
            {isGuru ? '***' : `Rp ${totalAmountApproved.toLocaleString('id-ID')}`}
          </div>
          <p className="text-[10px] text-stone-400">Pemasukan kas sekolah tervalidasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Menunggu Verifikasi (Pending)</span>
          <div className="text-xl font-black text-amber-900">
            {authorizedPayments.filter(p => p.paymentStatus === 'PENDING').length} Transaksi
          </div>
          <p className="text-[10px] text-stone-400">Memerlukan persetujuan Central Approval</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Data Siswa Terotorisasi</span>
          <div className="text-xl font-black text-purple-900">{authorizedStudents.length} Siswa</div>
          <p className="text-[10px] text-stone-400">Sesuai hak akses & kewenangan peran</p>
        </div>
      </div>

      {/* TAB 1: LIST TRANSAKSI */}
      {activeTab === 'LIST' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari siswa, no. transaksi, atau pembayar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-2xl text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="p-2 border border-stone-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="SPP">SPP</option>
                <option value="PPDB">PPDB</option>
                <option value="Seragam">Seragam</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Study Tour">Study Tour</option>
                <option value="Administrasi">Administrasi</option>
                <option value="Infak">Infak</option>
                <option value="Lainnya">Lainnya</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="p-2 border border-stone-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>

              <button
                onClick={loadData}
                className="p-2 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-600 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : filteredPayments.length === 0 ? (
            <SIMEmptyState
              type="payments"
              title="Belum Ada Transaksi Pembayaran"
              description="Tidak ada data pembayaran yang sesuai dengan kriteria filter saat ini. Seluruh transaksi pembayaran yang diajukan atau dicatat akan langsung tampil di sini."
              actionLabel="Catat Pembayaran Baru"
              onAction={() => setActiveTab('CREATE')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                    <th className="p-3">No. Transaksi</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Metode</th>
                    <th className="p-3">Nominal</th>
                    <th className="p-3">Pembayar</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">{p.transactionNumber}</td>
                      <td className="p-3">
                        <strong className="text-slate-900">{p.studentName}</strong>
                        <div className="text-[10px] text-stone-400">{p.classGroup}</div>
                      </td>
                      <td className="p-3 font-semibold text-stone-700">{p.category}</td>
                      <td className="p-3 font-medium text-stone-600">
                        {p.paymentMethod === 'TRANSFER_BANK' && <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-sky-600" /> Bank ({p.bankName?.split(' ')[1] || 'BSI'})</span>}
                        {p.paymentMethod === 'E_WALLET' && <span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-purple-600" /> E-Wallet ({p.walletProvider})</span>}
                        {p.paymentMethod === 'CASH' && <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-amber-600" /> Cash</span>}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {isGuru ? '***' : `Rp ${p.amount.toLocaleString('id-ID')}`}
                      </td>
                      <td className="p-3 text-stone-600">{p.payerName}</td>
                      <td className="p-3">{getStatusBadge(p.paymentStatus)}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => { setSelectedPayment(p); setVerifyNotes(p.notes || ''); setShowReceiptModal(false); }}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-[11px] rounded-xl transition cursor-pointer"
                        >
                          Detail
                        </button>
                        {p.paymentStatus === 'APPROVED' && (
                          <button
                            onClick={() => { setSelectedPayment(p); setShowReceiptModal(true); }}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] rounded-xl transition cursor-pointer"
                          >
                            Kwitansi
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PEMBAYARAN BARU */}
      {activeTab === 'CREATE' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Formulir Pembayaran Baru (Zero Double Input Engine)</h2>
            <p className="text-xs text-stone-500">Pilih nama siswa dari database terintegrasi dan lengkapi detail metode pembayaran.</p>
          </div>

          <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
            {/* Student Selector (PRIV-01 Scoped) */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Pilih Siswa (Sync Master Students Terotorisasi)</label>
              {authorizedStudents.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  Tidak ada data siswa dalam kewenangan/otorisasi akun Anda saat ini.
                </div>
              ) : (
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  required
                  className="w-full p-3 border border-stone-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                >
                  {authorizedStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.namaLengkap || s.name} ({s.kelompok || s.classGroup || 'Kelompok PAUD'}) - Wali: {s.namaAyah || s.parentName || 'Wali'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Category & Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Kategori Pembayaran</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as PaymentCategory)}
                  className="w-full p-3 border border-stone-300 rounded-xl font-semibold focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                >
                  <option value="SPP">SPP Bulanan</option>
                  <option value="PPDB">PPDB (Pendaftaran)</option>
                  <option value="Seragam">Seragam Sekolah</option>
                  <option value="Kegiatan">Kegiatan Siswa</option>
                  <option value="Study Tour">Study Tour / Outing</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Infak">Infak & Sedekah</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nominal Pembayaran (Rp)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  required
                  min={1000}
                  className="w-full p-3 border border-stone-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-bold text-stone-700 mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('TRANSFER_BANK')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold cursor-pointer transition ${
                    paymentMethod === 'TRANSFER_BANK' ? 'bg-sky-50 border-sky-600 text-sky-900 shadow-xs' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-sky-600" /> Transfer Bank
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('E_WALLET')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold cursor-pointer transition ${
                    paymentMethod === 'E_WALLET' ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-purple-600" /> E-Wallet / QRIS
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold cursor-pointer transition ${
                    paymentMethod === 'CASH' ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Coins className="w-5 h-5 text-amber-600" /> Cash (Tunai)
                </button>
              </div>
            </div>

            {/* Method Details Form */}
            {paymentMethod === 'TRANSFER_BANK' && (
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-3">
                <p className="font-bold text-sky-900 text-xs">Detail Transfer Bank:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Bank Tujuan</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Nama Pengirim</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bpk Ahmad"
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'E_WALLET' && (
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-3">
                <p className="font-bold text-purple-900 text-xs">Detail E-Wallet / QRIS:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Provider E-Wallet</label>
                    <select
                      value={walletProvider}
                      onChange={e => setWalletProvider(e.target.value as EWalletProvider)}
                      className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                    >
                      <option value="QRIS">QRIS Standar Nasional</option>
                      <option value="DANA">DANA</option>
                      <option value="OVO">OVO</option>
                      <option value="GoPay">GoPay</option>
                      <option value="ShopeePay">ShopeePay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">No. Wallet / Ref QRIS</label>
                    <input
                      type="text"
                      placeholder="0812xxxx / ID Transaksi"
                      value={walletNumber}
                      onChange={e => setWalletNumber(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'CASH' && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                <p className="font-bold text-amber-900 text-xs">Detail Pembayaran Cash (Tunai):</p>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Petugas Penerima Kas</label>
                  <input
                    type="text"
                    value={cashReceivedBy}
                    onChange={e => setCashReceivedBy(e.target.value)}
                    placeholder="Nama Staf Keuangan"
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
              </div>
            )}

            {/* Proof Upload URL */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Bukti Transfer / Pembayaran (Firebase Storage Path / URL)</label>
              <input
                type="text"
                placeholder="https://storage.googleapis.com/... atau upload bukti"
                value={proofUrl}
                onChange={e => setProofUrl(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Tersimpan otomatis dalam folder <code>payment_proofs/{new Date().getFullYear()}/[studentId]</code> & terintegrasi Smart Archive Engine.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('LIST')}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-2xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl cursor-pointer shadow-xs flex items-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {submitting ? 'Memproses...' : 'Kirim Pembayaran'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: QR SCANNER & VERIFIER */}
      {activeTab === 'QR_SCANNER' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                QR & Barcode Security Engine v25.0
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Pemindai & Verifikator Token QR Resmi</h2>
              <p className="text-xs text-stone-500">
                Pindai token QR untuk pembayaran, kartu siswa, absensi, atau dokumen resmi dengan otentikasi Firestore & audit log.
              </p>
            </div>
            <Shield className="w-8 h-8 text-amber-600 shrink-0" />
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3 text-center">
              <Camera className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
              <p className="text-xs font-semibold text-slate-300">
                Arahkan Kamera ke Kode QR atau Tempelkan Kode Token QR di bawah ini:
              </p>

              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Contoh: TADE_QR:QRT_PAYMENT_172... atau QRT_PAYMENT_..."
                  value={qrInputText}
                  onChange={e => setQrInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 text-white font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleScanQR}
                  disabled={scanningQR}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-bold text-xs rounded-xl cursor-pointer transition flex items-center gap-1 shrink-0"
                >
                  {scanningQR ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                  {scanningQR ? 'Memindai...' : 'Verifikasi'}
                </button>
              </div>

              {/* Contained Sandbox Simulation Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sandbox Pengujian Format Token QR</span>
                </div>
                <p className="text-[10px] text-slate-300 max-w-md mx-auto">
                  Fitur simulasi ini khusus untuk menguji fungsionalitas scanner dan verifikasi format payload token QR tanpa mempengaruhi kas atau status keuangan produksi.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateSimulationToken}
                  disabled={generatingToken}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 px-3 py-1.5 rounded-lg font-mono cursor-pointer border border-amber-500/40 inline-flex items-center gap-1.5 transition"
                >
                  {generatingToken ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{generatingToken ? 'Membuat...' : '+ Buat Token Simulasi Uji Coba (Sandbox 30 Min)'}</span>
                </button>
              </div>
            </div>

            {/* Scan Result Box */}
            {qrScanResult && (
              <div className={`p-5 rounded-2xl border space-y-3 ${
                qrScanResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {qrScanResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <XCircle className="w-5 h-5 text-rose-700" />}
                    {qrScanResult.success ? 'Token QR Valid & Terverifikasi' : 'Verifikasi QR Gagal'}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 font-bold">
                    {new Date().toLocaleTimeString('id-ID')}
                  </span>
                </div>

                <p className="text-xs font-medium">{qrScanResult.message}</p>

                {qrScanResult.tokenRecord && (
                  <div className="bg-white/90 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-1">
                      <span className="font-bold text-slate-900">Detail Payload QR Token:</span>
                      {qrScanResult.tokenRecord.targetId?.includes('SIMULATION') ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          SANDBOX SIMULATION
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          OFFICIAL RECORD
                        </span>
                      )}
                    </div>
                    <p><span className="text-stone-500 font-semibold">Tujuan (Purpose):</span> <strong className="uppercase">{qrScanResult.tokenRecord.purpose}</strong></p>
                    <p><span className="text-stone-500 font-semibold">Judul Record:</span> {qrScanResult.tokenRecord.title}</p>
                    <p><span className="text-stone-500 font-semibold">Masa Berlaku:</span> {formatDateCanonical(qrScanResult.tokenRecord.expiryTime)}</p>
                    <p><span className="text-stone-500 font-semibold">Total Dipindai:</span> {qrScanResult.tokenRecord.scannedCount} kali (Maks: {qrScanResult.tokenRecord.maxScans === -1 ? 'Tak Terbatas' : qrScanResult.tokenRecord.maxScans})</p>
                    <p><span className="text-stone-500 font-semibold">Status Token:</span> <span className="font-bold text-emerald-800">{qrScanResult.tokenRecord.status}</span></p>
                    {qrScanResult.tokenRecord.targetId?.includes('SIMULATION') && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                        <strong>Catatan Integritas:</strong> Token ini terdaftar sebagai data simulasi pengujian dan tidak terafiliasi dengan penerimaan kas nyata sekolah.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PENGATURAN CHANNEL PEMBAYARAN */}
      {activeTab === 'SETTINGS' && isFinancialRole && paymentSettings && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Pengaturan Channel & Rekening Pembayaran (payment_settings)</h2>
            <p className="text-xs text-stone-500">Kelola nomor rekening resmi bank, akun e-wallet, dan QRIS sekolah secara terpusat tanpa hardcoding.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-3">
              <h3 className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-700" /> Channel Transfer Bank Utama
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Nama Bank</label>
                  <input
                    type="text"
                    value={paymentSettings.bankName || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Nomor Rekening Bank</label>
                  <input
                    type="text"
                    value={paymentSettings.accountNumber || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Atas Nama Rekening</label>
                <input
                  type="text"
                  value={paymentSettings.accountHolder || ''}
                  onChange={e => setPaymentSettings({ ...paymentSettings, accountHolder: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Instruksi Transfer</label>
                <textarea
                  rows={2}
                  value={paymentSettings.bankInstructions || ''}
                  onChange={e => setPaymentSettings({ ...paymentSettings, bankInstructions: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white text-stone-700"
                />
              </div>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-3">
              <h3 className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-purple-700" /> Nomor Akun E-Wallet Resmi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Nomor DANA</label>
                  <input
                    type="text"
                    value={paymentSettings.walletDanaNumber || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, walletDanaNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Nomor OVO</label>
                  <input
                    type="text"
                    value={paymentSettings.walletOvoNumber || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, walletOvoNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Nomor GoPay</label>
                  <input
                    type="text"
                    value={paymentSettings.walletGopayNumber || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, walletGopayNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Nomor ShopeePay</label>
                  <input
                    type="text"
                    value={paymentSettings.walletShopeeNumber || ''}
                    onChange={e => setPaymentSettings({ ...paymentSettings, walletShopeeNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
              <h3 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-700" /> QRIS Standar Nasional Sekolah
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">NMS / National Merchant ID QRIS</label>
                <input
                  type="text"
                  value={paymentSettings.qrisNmsId || ''}
                  onChange={e => setPaymentSettings({ ...paymentSettings, qrisNmsId: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">URL Gambar Kode QRIS</label>
                <input
                  type="text"
                  value={paymentSettings.qrisImageUrl || ''}
                  onChange={e => setPaymentSettings({ ...paymentSettings, qrisImageUrl: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl cursor-pointer shadow-xs flex items-center gap-2"
              >
                {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan Channels'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL & VERIFICATION MODAL */}
      {selectedPayment && !showReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Detail Transaksi</span>
                <h2 className="text-base font-bold text-slate-900">{selectedPayment.transactionNumber}</h2>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">Nama Siswa</span>
                  <strong className="text-slate-900 font-bold">{selectedPayment.studentName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Kategori</span>
                  <strong className="text-slate-900 font-bold">{selectedPayment.category}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Nominal</span>
                  <strong className="text-emerald-900 font-black text-sm">
                    {isGuru ? '***' : `Rp ${selectedPayment.amount.toLocaleString('id-ID')}`}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Metode</span>
                  <strong className="text-slate-900 font-bold">{selectedPayment.paymentMethod}</strong>
                </div>
              </div>

              {selectedPayment.proofFile && (
                <div className="space-y-1">
                  <span className="font-bold text-stone-700">Bukti Pembayaran / Transfer:</span>
                  <a
                    href={selectedPayment.proofFile}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-stone-100 rounded-xl text-sky-700 font-mono font-bold block truncate hover:underline"
                  >
                    {selectedPayment.proofFile}
                  </a>
                </div>
              )}

              {/* Verification Controls for Financial Roles */}
              {isFinancialRole && selectedPayment.paymentStatus === 'PENDING' && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3 pt-3">
                  <p className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" /> Verifikasi Persetujuan (Central Approval):
                  </p>
                  <textarea
                    placeholder="Catatan verifikasi (opsional)..."
                    value={verifyNotes}
                    onChange={e => setVerifyNotes(e.target.value)}
                    className="w-full p-2.5 border border-amber-300 rounded-xl bg-white text-xs focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    rows={2}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify('REJECTED')}
                      disabled={verifying}
                      className="flex-1 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-1"
                    >
                      {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      {verifying ? 'Memproses...' : 'Tolak'}
                    </button>
                    <button
                      onClick={() => handleVerify('APPROVED')}
                      disabled={verifying}
                      className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {verifying ? 'Memproses...' : 'Setujui & Terbitkan Kwitansi'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTO RECEIPT / KWITANSI MODAL */}
      {selectedPayment && showReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => { setShowReceiptModal(false); setSelectedPayment(null); }}
              className="absolute right-4 top-4 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Smart Document Factory Kwitansi Canvas */}
            <div className="bg-amber-50/60 p-8 rounded-3xl border-2 border-emerald-800 space-y-6">
              <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-emerald-900 tracking-tight">KWITANSI PEMBAYARAN RESMI</h2>
                  <p className="text-xs font-bold text-stone-600">TK ASY SYIFA TANGGUL JEMBER</p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-800 text-white px-3 py-1.5 rounded-lg shadow-xs">
                  {selectedPayment.transactionNumber}
                </span>
              </div>

              <div className="space-y-3 text-xs text-stone-800">
                <div className="grid grid-cols-3">
                  <span className="font-bold text-stone-600">Telah Diterima Dari:</span>
                  <span className="col-span-2 font-bold text-slate-900 border-b border-stone-300 pb-1">
                    {selectedPayment.payerName} ({selectedPayment.studentName})
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-bold text-stone-600">Uang Sejumlah:</span>
                  <span className="col-span-2 font-black text-emerald-900 italic border-b border-stone-300 pb-1 text-sm">
                    Rp {selectedPayment.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-bold text-stone-600">Untuk Pembayaran:</span>
                  <span className="col-span-2 border-b border-stone-300 pb-1">
                    {selectedPayment.category} (Siswa: {selectedPayment.studentName} - {selectedPayment.classGroup})
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-bold text-stone-600">Metode & Status:</span>
                  <span className="col-span-2 border-b border-stone-300 pb-1 font-semibold text-emerald-800">
                    {selectedPayment.paymentMethod} • VERIFIED & APPROVED
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-800/30 flex items-center justify-between text-xs">
                <div className="text-stone-500">
                  <p>Tanggul, {formatDateCanonical(selectedPayment.verifiedAt || selectedPayment.createdAt)}</p>
                  <p className="font-bold text-slate-900 mt-6">
                    {selectedPayment.verifiedBy || 'Staf Keuangan TK Asy Syifa'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Cetak Kwitansi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
