import React, { useEffect, useState, useMemo } from 'react';
import { 
  PaymentTransaction, 
  LedgerEntry, 
  FinancialAccount, 
  OperationalExpense, 
  FinancialPeriodClosing,
  UserRole 
} from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';
import { 
  PieChart, 
  FileSpreadsheet, 
  RefreshCw, 
  BookOpen, 
  Wallet, 
  Receipt, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  X, 
  Info, 
  ShieldCheck,
  Shield,
  Calendar,
  Filter,
  Sparkles
} from 'lucide-react';
import { verifyLedgerBalance } from '../../services/financialCalculationService';

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

const toCanonicalDateISO = (date?: Date | string): string => {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

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

interface FeedbackState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const R12LaporanKeuangan: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'LEDGER' | 'ACCOUNTS' | 'EXPENSES' | 'CLOSING'>('SUMMARY');
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [expenses, setExpenses] = useState<OperationalExpense[]>([]);
  const [closings, setClosings] = useState<FinancialPeriodClosing[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingPeriod, setClosingPeriod] = useState<string>(new Date().toISOString().substring(0, 7));
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Search & Filter States
  const [searchSummary, setSearchSummary] = useState('');
  const [searchLedger, setSearchLedger] = useState('');
  const [searchExpense, setSearchExpense] = useState('');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('ALL');

  // Modals & Action States
  const [showClosingConfirmModal, setShowClosingConfirmModal] = useState(false);
  const [closingNotes, setClosingNotes] = useState('');
  const [isProcessingClosing, setIsProcessingClosing] = useState(false);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newExpenseData, setNewExpenseData] = useState({
    category: 'Operasional Kelas',
    description: '',
    amount: '',
    sourceAccountId: '',
    date: toCanonicalDateISO()
  });

  // Canonical Identity & RBAC Resolution (Fail-closed)
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Authentic Identity Resolution: strictly use authenticated identity contracts without synthetic fallbacks
  const actorName = useMemo(() => {
    return userProfile?.nama || userProfile?.name || currentUser?.displayName || currentUser?.email || 'Pengguna Terautentikasi';
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email]);

  const actorUid = currentUser?.uid || '';
  const isFinancialRole = verifiedActiveRole ? FINANCIAL_ROLES.includes(verifiedActiveRole) : false;
  const isGuru = verifiedActiveRole === 'GURU';
  const isRestrictedRole = verifiedActiveRole
    ? ['WALI_MURID', 'CALON_WALI_MURID', 'ALUMNI_FAMILY'].includes(verifiedActiveRole)
    : false;

  const loadFinancialData = async () => {
    if (!currentUser?.uid || !verifiedActiveRole) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const payData = await DataService.getPayments(verifiedActiveRole, actorUid);
      setPayments(payData || []);
      if (isFinancialRole) {
        const [ledgerData, accData, expData, closingData] = await Promise.all([
          DataService.getLedgerEntries(),
          DataService.getFinancialAccounts(),
          DataService.getExpenses(),
          DataService.getFinancialClosings()
        ]);
        setLedgerEntries(ledgerData || []);
        setAccounts(accData || []);
        setExpenses(expData || []);
        setClosings(closingData || []);
      } else {
        setLedgerEntries([]);
        setAccounts([]);
        setExpenses([]);
        setClosings([]);
      }
    } catch (err: any) {
      console.error('Failed loading financial data', err);
      setFeedback({ 
        type: 'error', 
        message: `STATUS: GAGAL → Gagal memuat data keuangan: ${err?.message || err}. Silakan muat ulang data.` 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, [actorUid, verifiedActiveRole]);

  // Auto dismiss feedback banner
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const approvedPayments = payments.filter(p => p.paymentStatus === 'APPROVED');
  const totalApproved = approvedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const sppTotal = approvedPayments.filter(p => p.category === 'SPP').reduce((acc, p) => acc + (p.amount || 0), 0);
  const ppdbTotal = approvedPayments.filter(p => p.category === 'PPDB').reduce((acc, p) => acc + (p.amount || 0), 0);
  const seragamTotal = approvedPayments.filter(p => p.category === 'Seragam').reduce((acc, p) => acc + (p.amount || 0), 0);
  const kegiatanTotal = approvedPayments.filter(p => p.category === 'Kegiatan' || p.category === 'Study Tour').reduce((acc, p) => acc + (p.amount || 0), 0);
  const infakTotal = approvedPayments.filter(p => p.category === 'Infak').reduce((acc, p) => acc + (p.amount || 0), 0);
  const lainnyaTotal = approvedPayments.filter(p => ['Administrasi', 'Lainnya'].includes(p.category)).reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalDebitLedger = ledgerEntries.reduce((acc, l) => acc + (l.debitAmount || 0), 0);
  const totalCreditLedger = ledgerEntries.reduce((acc, l) => acc + (l.creditAmount || 0), 0);
  const isLedgerBalanced = verifyLedgerBalance({ debitAmount: totalDebitLedger, creditAmount: totalCreditLedger });

  const totalExpensesAmount = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  const handleExecuteMonthlyClosing = async () => {
    if (isProcessingClosing) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid. Aksi dibatalkan.'
      });
      return;
    }
    if (!isFinancialRole) {
      setFeedback({ 
        type: 'error', 
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya Otoritas Keuangan yang dapat melakukan penutupan buku periode. Sistem memblokir aksi ini.' 
      });
      return;
    }
    if (!closingPeriod) {
      setFeedback({
        type: 'error',
        message: 'STATUS: VALIDASI GAGAL → Periode penutupan buku wajib ditentukan.'
      });
      return;
    }

    setIsProcessingClosing(true);
    try {
      const closingResult = await DataService.performMonthlyClosing(
        closingPeriod,
        actorUid,
        actorName,
        verifiedActiveRole,
        closingNotes.trim() || undefined
      );

      // Canonical audit log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'EXECUTE_MONTHLY_CLOSING',
        targetModule: `Laporan Keuangan - Penutupan buku bulanan periode ${closingPeriod} (${closingResult.status}) oleh ${actorName}. Catatan: ${closingNotes.trim() || 'Tanpa catatan'}`
      }).catch((auditErr) => {
        console.warn('Non-blocking audit log failure:', auditErr);
      });

      setFeedback({ 
        type: 'success', 
        message: `STATUS: SUKSES → Penutupan Buku Periode ${closingPeriod} Berhasil Diposting ke Buku Besar. Saldo akhir terkunci secara resmi.` 
      });
      setShowClosingConfirmModal(false);
      setClosingNotes('');
      await loadFinancialData();
    } catch (err: any) {
      console.error('Failed executing monthly closing', err);
      setFeedback({ 
        type: 'error', 
        message: `STATUS: GAGAL → ${err?.message || 'Terjadi kesalahan sistem saat penutupan buku'}. Saldo dan ledger tidak diubah. Silakan periksa koneksi dan coba kembali.` 
      });
    } finally {
      setIsProcessingClosing(false);
    }
  };

  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingExpense) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid. Aksi dibatalkan.'
      });
      return;
    }
    if (!isFinancialRole) {
      setFeedback({ 
        type: 'error', 
        message: 'STATUS: DITOLAK → Hanya Otoritas Keuangan yang memiliki wewenang mencatat beban operasional.' 
      });
      return;
    }

    const amountNum = parseFloat(newExpenseData.amount);
    if (isNaN(amountNum) || amountNum <= 0 || !isFinite(amountNum)) {
      setFeedback({ 
        type: 'error', 
        message: 'STATUS: VALIDASI GAGAL → Nominal beban pengeluaran harus berupa angka lebih besar dari Rp 0.' 
      });
      return;
    }
    if (!newExpenseData.description.trim()) {
      setFeedback({ 
        type: 'error', 
        message: 'STATUS: VALIDASI GAGAL → Uraian/deskripsi keperluan pengeluaran wajib diisi secara jelas.' 
      });
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const sourceAcc = accounts.find(a => a.accountId === newExpenseData.sourceAccountId) || accounts[0];
      const createdExpense = await DataService.createExpense(
        {
          date: newExpenseData.date || toCanonicalDateISO(),
          category: newExpenseData.category,
          description: newExpenseData.description.trim(),
          amount: amountNum,
          sourceAccountId: sourceAcc ? sourceAcc.accountId : 'ACC_KAS_UTAMA',
          sourceAccountName: sourceAcc ? sourceAcc.accountName : 'Kas Operasional Sekolah',
          requestedBy: actorName
        },
        actorUid,
        actorName,
        verifiedActiveRole
      );

      // Canonical audit log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'CREATE_EXPENSE',
        targetModule: `Laporan Keuangan - Beban pengeluaran ${createdExpense.category} Rp ${amountNum.toLocaleString('id-ID')} (${createdExpense.description})`
      }).catch((auditErr) => {
        console.warn('Non-blocking audit log failure:', auditErr);
      });

      setFeedback({ 
        type: 'success', 
        message: `STATUS: SUKSES → Beban pengeluaran ${createdExpense.expenseNumber} berhasil dicatat dan diajukan.` 
      });
      setShowAddExpenseModal(false);
      setNewExpenseData({
        category: 'Operasional Kelas',
        description: '',
        amount: '',
        sourceAccountId: '',
        date: toCanonicalDateISO()
      });
      await loadFinancialData();
    } catch (err: any) {
      console.error('Failed submitting expense', err);
      setFeedback({ 
        type: 'error', 
        message: `STATUS: GAGAL → Gagal mencatat pengeluaran: ${err?.message || 'Terjadi kesalahan sistem'}. Data tidak tersimpan.` 
      });
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleExportAccountingReport = async () => {
    if (isExporting) return;
    if (!currentUser?.uid || !verifiedActiveRole) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Sesi otentikasi tidak valid. Aksi dibatalkan.'
      });
      return;
    }
    if (!isFinancialRole) {
      setFeedback({ 
        type: 'error', 
        message: 'STATUS: DITOLAK → Akses Ditolak: Anda tidak memiliki wewenang untuk mengekspor laporan keuangan.' 
      });
      return;
    }

    setIsExporting(true);
    try {
      await DataService.exportPaymentReportLog(
        actorUid,
        actorName,
        verifiedActiveRole,
        'FINANCIAL_SUMMARY_R12'
      );

      // Canonical audit log
      await DataService.createAuditLog({
        uid: actorUid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'EXPORT_FINANCIAL_REPORT',
        targetModule: `Laporan Keuangan - Ekspor CSV (${approvedPayments.length} transaksi approved)`
      }).catch((auditErr) => {
        console.warn('Non-blocking audit log failure:', auditErr);
      });

      const headers = ['No Transaksi', 'Siswa', 'Kelompok', 'Kategori', 'Metode', 'Nominal (Rp)', 'Tanggal Approved'];
      const rows = approvedPayments.map(p => [
        `"${p.transactionNumber}"`,
        `"${p.studentName || '-'}"`,
        `"${p.classGroup || '-'}"`,
        `"${p.category}"`,
        `"${p.paymentMethod}"`,
        p.amount,
        `"${formatDateCanonical(p.verifiedAt || p.createdAt)}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Laporan_Rekapitulasi_Keuangan_TADE_${toCanonicalDateISO()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFeedback({ 
        type: 'success', 
        message: 'STATUS: SUKSES → Laporan rekapitulasi keuangan berhasil diekspor ke format CSV / Spreadsheet.' 
      });
    } catch (err: any) {
      console.error('Failed exporting financial report', err);
      setFeedback({ 
        type: 'error', 
        message: `STATUS: GAGAL → Gagal mengekspor laporan: ${err?.message || 'Terjadi kesalahan sistem'}. Silakan coba kembali.` 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = handleExportAccountingReport;

  // Filtered Payments for Summary
  const filteredPayments = approvedPayments.filter(p => {
    if (!searchSummary.trim()) return true;
    const q = searchSummary.toLowerCase();
    return (
      (p.transactionNumber || '').toLowerCase().includes(q) ||
      (p.studentName || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.classGroup || '').toLowerCase().includes(q) ||
      (p.paymentMethod || '').toLowerCase().includes(q)
    );
  });

  // Filtered Ledger
  const filteredLedger = ledgerEntries.filter(l => {
    if (!searchLedger.trim()) return true;
    const q = searchLedger.toLowerCase();
    return (
      (l.debitAccountName || '').toLowerCase().includes(q) ||
      (l.debitAccountCode || '').toLowerCase().includes(q) ||
      (l.creditAccountName || '').toLowerCase().includes(q) ||
      (l.creditAccountCode || '').toLowerCase().includes(q) ||
      (l.description || '').toLowerCase().includes(q) ||
      (l.category || '').toLowerCase().includes(q) ||
      (l.postedBy || '').toLowerCase().includes(q)
    );
  });

  // Filtered Expenses
  const filteredExpenses = expenses.filter(e => {
    const matchesCat = selectedExpenseCategory === 'ALL' || e.category === selectedExpenseCategory;
    if (!matchesCat) return false;
    if (!searchExpense.trim()) return true;
    const q = searchExpense.toLowerCase();
    return (
      (e.expenseNumber || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q) ||
      (e.requestedBy || '').toLowerCase().includes(q) ||
      (e.sourceAccountName || '').toLowerCase().includes(q)
    );
  });

  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div id="r12-unauthorized-guard" className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
          TADE RBAC v25.2A POLICY
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Sesi Tidak Terotentikasi / Peran Tidak Valid
        </h2>
        <p className="text-stone-600 text-xs leading-relaxed max-w-lg mx-auto">
          Akses ke modul Laporan Keuangan diblokir secara fail-closed karena identitas sesi tidak valid atau wewenang peran belum terverifikasi secara sah. Silakan masuk kembali dengan akun resmi.
        </p>
      </div>
    );
  }

  if (isRestrictedRole) {
    return (
      <div id="r12-access-restricted" className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
          TADE RBAC v25.2A POLICY
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Akses Laporan Keuangan Dibatasi
        </h2>
        <p className="text-stone-600 text-xs leading-relaxed max-w-lg mx-auto">
          Peran <strong>{verifiedActiveRole}</strong> tidak memiliki hak akses ke Buku Besar & Laporan Keuangan Institusi.
          Informasi tagihan & kwitansi pembayaran khusus siswa/putra-putri Anda dapat diakses melalui Portal Resmi Siswa / Tab Tagihan SPP.
        </p>
      </div>
    );
  }

  return (
    <div id="r12-laporan-keuangan-root" className="space-y-6">
      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          id="r12-feedback-banner"
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-sky-50 text-sky-900 border-sky-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button
            id="btn-dismiss-feedback"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div id="r12-header-banner" className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            FIND-04 Unified Financial Ecosystem & Reporting Engine
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Laporan Keuangan & Buku Besar Terpadu
          </h1>
          <p className="text-stone-500 text-xs">
            Satu Sistem Terkoneksi: Arus Kas, Buku Besar Double-Entry, Saldo Akun, Pengeluaran, & Closing Periode.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-refresh-financial"
            disabled={loading}
            onClick={loadFinancialData}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isFinancialRole && (
            <button
              id="btn-export-excel"
              disabled={isExporting}
              onClick={handleExportAccountingReport}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Mengekspor CSV...' : 'Export CSV / Excel'}
            </button>
          )}
        </div>
      </div>

      {/* Asy Contextual Advisory Banner */}
      <div id="r12-asy-advisory" className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
          Asy
        </div>
        <div className="space-y-0.5">
          <div className="font-bold flex items-center gap-1.5 text-emerald-950">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Asistensi Finansial Cerdas Asy Syifa
          </div>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            {isLedgerBalanced
              ? `Buku besar dalam kondisi seimbang (Debit = Kredit: Rp ${totalDebitLedger.toLocaleString('id-ID')}). ${approvedPayments.length} transaksi approved terakumulasi dari SIM Kas.`
              : `Peringatan: Terdeteksi selisih sebesar Rp ${Math.abs(totalDebitLedger - totalCreditLedger).toLocaleString('id-ID')} pada pembukuan buku besar. Mohon verifikasi seluruh jurnal posting sebelum melakukan closing periode.`}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div id="r12-nav-tabs" className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          id="btn-tab-summary"
          onClick={() => setActiveTab('SUMMARY')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'SUMMARY'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <PieChart className="w-4 h-4" /> Ringkasan Arus Kas
        </button>

        {isFinancialRole && (
          <>
            <button
              id="btn-tab-ledger"
              onClick={() => setActiveTab('LEDGER')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'LEDGER'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Buku Besar (General Ledger) ({ledgerEntries.length})
            </button>

            <button
              id="btn-tab-accounts"
              onClick={() => setActiveTab('ACCOUNTS')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'ACCOUNTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Wallet className="w-4 h-4" /> Master Rekening ({accounts.length})
            </button>

            <button
              id="btn-tab-expenses"
              onClick={() => setActiveTab('EXPENSES')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'EXPENSES'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Receipt className="w-4 h-4" /> Beban Operasional ({expenses.length})
            </button>

            <button
              id="btn-tab-closing"
              onClick={() => setActiveTab('CLOSING')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'CLOSING'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Lock className="w-4 h-4" /> Closing Periode ({closings.length})
            </button>
          </>
        )}
      </div>

      {/* TAB 1: SUMMARY */}
      {activeTab === 'SUMMARY' && (
        <div id="r12-tab-summary-content" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Pemasukan Kas Terverifikasi</span>
              <div className="text-2xl font-black text-emerald-900">
                {isGuru ? '***' : `Rp ${totalApproved.toLocaleString('id-ID')}`}
              </div>
              <p className="text-[11px] text-stone-500">{approvedPayments.length} transaksi approved</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pemasukan SPP Bulanan</span>
              <div className="text-2xl font-black text-sky-800">
                {isGuru ? '***' : `Rp ${sppTotal.toLocaleString('id-ID')}`}
              </div>
              <p className="text-[11px] text-stone-500">Iuran rutin seluruh kelompok siswa</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pemasukan PPDB & Seragam</span>
              <div className="text-2xl font-black text-purple-900">
                {isGuru ? '***' : `Rp ${(ppdbTotal + seragamTotal).toLocaleString('id-ID')}`}
              </div>
              <p className="text-[11px] text-stone-500">Registrasi peserta didik baru & perlengkapan</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Rincian Pemasukan per Kategori Transaksi
              </h2>
              {isGuru && (
                <span className="text-[11px] text-stone-500 bg-stone-100 px-3 py-1 rounded-full font-bold">
                  Mode Guru: Angka agregat institusi disamarkan
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold">1. SPP Bulanan</span>
                <div className="text-base font-black text-slate-900">{isGuru ? '***' : `Rp ${sppTotal.toLocaleString('id-ID')}`}</div>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold">2. PPDB & Pendaftaran</span>
                <div className="text-base font-black text-slate-900">{isGuru ? '***' : `Rp ${ppdbTotal.toLocaleString('id-ID')}`}</div>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold">3. Seragam Sekolah</span>
                <div className="text-base font-black text-slate-900">{isGuru ? '***' : `Rp ${seragamTotal.toLocaleString('id-ID')}`}</div>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold">4. Kegiatan & Study Tour</span>
                <div className="text-base font-black text-slate-900">{isGuru ? '***' : `Rp ${kegiatanTotal.toLocaleString('id-ID')}`}</div>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold">5. Infak & Sedekah</span>
                <div className="text-base font-black text-slate-900">{isGuru ? '***' : `Rp ${infakTotal.toLocaleString('id-ID')}`}</div>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold">6. Administrasi & Lainnya</span>
                <div className="text-base font-black text-slate-900">{isGuru ? '***' : `Rp ${lainnyaTotal.toLocaleString('id-ID')}`}</div>
              </div>
            </div>
          </div>

          {/* Detailed Transaction List */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Daftar Transaksi Pemasukan Terverifikasi ({filteredPayments.length})
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  id="input-search-summary"
                  type="text"
                  placeholder="Cari transaksi / siswa..."
                  value={searchSummary}
                  onChange={e => setSearchSummary(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-stone-300 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {loading ? (
              <SIMSkeletonLoader type="table" />
            ) : filteredPayments.length === 0 ? (
              <SIMEmptyState 
                type="payments"
                title="Belum Ada Transaksi Pemasukan Terverifikasi"
                description="Transaksi pembayaran siswa yang sudah disetujui (APPROVED) pada modul Pembayaran akan otomatis direkapitulasi di sini."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700 border-collapse">
                  <thead className="bg-stone-100 uppercase text-[11px] text-stone-600 font-bold">
                    <tr>
                      <th className="p-3 rounded-l-xl">No Transaksi</th>
                      <th className="p-3">Siswa / Kelompok</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Metode</th>
                      <th className="p-3 text-right">Nominal</th>
                      <th className="p-3 rounded-r-xl">Tanggal Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredPayments.slice(0, 15).map(p => (
                      <tr key={p.id} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-mono font-bold text-stone-900">{p.transactionNumber}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{p.studentName || '-'}</div>
                          <div className="text-[10px] text-stone-500">{p.classGroup || '-'}</div>
                        </td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold">{p.category}</span></td>
                        <td className="p-3">{p.paymentMethod}</td>
                        <td className="p-3 text-right font-bold text-emerald-800">
                          {isGuru ? '***' : `Rp ${p.amount.toLocaleString('id-ID')}`}
                        </td>
                        <td className="p-3 text-stone-500 whitespace-nowrap">
                          {formatDateCanonical(p.verifiedAt || p.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEDGER */}
      {isFinancialRole && activeTab === 'LEDGER' && (
        <div id="r12-tab-ledger-content" className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Buku Besar Double-Entry (General Ledger Audit Trail)
              </h2>
              <p className="text-xs text-stone-500">
                Pencatatan Otomatis Setiap Transaksi Terposting (Prinsip Keseimbangan Debit = Kredit).
              </p>
            </div>

            <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              isLedgerBalanced ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {isLedgerBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />}
              <div>
                <div>Status Ledger: {isLedgerBalanced ? 'BALANCED (Debit = Kredit)' : 'DISCREPANCY DETECTED (Terdapat Selisih)'}</div>
                {!isLedgerBalanced && (
                  <div className="text-[10px] text-rose-700 font-normal mt-0.5">
                    Perhatian: Terdapat selisih Rp {Math.abs(totalDebitLedger - totalCreditLedger).toLocaleString('id-ID')} antara total debit dan kredit. Segera lakukan rekonsiliasi posting sebelum closing.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl text-xs">
            <div>
              <span className="text-stone-500 font-bold">Total Debit Ledger:</span>
              <div className="text-lg font-black text-slate-900">Rp {totalDebitLedger.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <span className="text-stone-500 font-bold">Total Kredit Ledger:</span>
              <div className="text-lg font-black text-slate-900">Rp {totalCreditLedger.toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                id="input-search-ledger"
                type="text"
                placeholder="Cari akun, deskripsi, atau posted by..."
                value={searchLedger}
                onChange={e => setSearchLedger(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs text-stone-500">Menampilkan {filteredLedger.length} baris jurnal</span>
          </div>

          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : filteredLedger.length === 0 ? (
            <SIMEmptyState 
              type="generic"
              title="Buku Besar Belum Berisi Jurnal Posting"
              description="Transaksi terverifikasi dari modul pembayaran, tabungan, dan beban operasional akan otomatis membukukan jurnal debit-kredit di sini."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-700 border-collapse">
                <thead className="bg-stone-100 uppercase text-[11px] text-stone-600 font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">Tanggal</th>
                    <th className="p-3">Akun Debit</th>
                    <th className="p-3 text-right">Nominal Debit</th>
                    <th className="p-3">Akun Kredit</th>
                    <th className="p-3 text-right">Nominal Kredit</th>
                    <th className="p-3">Kategori & Deskripsi</th>
                    <th className="p-3 rounded-r-xl">Posted By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredLedger.map(entry => (
                    <tr key={entry.id} className="hover:bg-stone-50 transition">
                      <td className="p-3 font-semibold whitespace-nowrap">
                        {formatDateCanonical(entry.transactionDate)}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-sky-800">[{entry.debitAccountCode}]</span> {entry.debitAccountName}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-800">
                        Rp {entry.debitAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-purple-800">[{entry.creditAccountCode}]</span> {entry.creditAccountName}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-800">
                        Rp {entry.creditAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold mr-1.5">{entry.category}</span>
                        {entry.description}
                      </td>
                      <td className="p-3 text-stone-500">{entry.postedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACCOUNTS */}
      {isFinancialRole && activeTab === 'ACCOUNTS' && (
        <div id="r12-tab-accounts-content" className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Master Rekening & Saldo Akun Finansial</h2>
            <p className="text-xs text-stone-500">
              Daftar Rekening Bank, Kas Tunai, & Settlement QRIS Resmi Sekolah.
            </p>
          </div>

          {loading ? (
            <SIMSkeletonLoader type="cards" />
          ) : accounts.length === 0 ? (
            <SIMEmptyState 
              type="generic"
              title="Master Rekening Belum Dikonfigurasi"
              description="Data rekening bank institusi, kas tunai bendahara, dan settlement QRIS belum tersedia."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map(acc => (
                <div key={acc.accountId} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full uppercase">
                      {acc.accountType}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${acc.isActive ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{acc.accountName}</h3>
                    <p className="text-xs text-stone-500">{acc.institution} • {acc.accountIdentifier}</p>
                    <p className="text-[11px] text-stone-400">a/n {acc.accountHolder}</p>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Saldo Saat Ini</span>
                      <div className="text-base font-black text-emerald-900">
                        Rp {acc.currentBalance.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EXPENSES */}
      {isFinancialRole && activeTab === 'EXPENSES' && (
        <div id="r12-tab-expenses-content" className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Beban Operasional & Pengeluaran Kas</h2>
              <p className="text-xs text-stone-500">
                Rekapitulasi Pengeluaran Operasional Terverifikasi & Terposting ke Ledger (Total: Rp {totalExpensesAmount.toLocaleString('id-ID')}).
              </p>
            </div>

            {isFinancialRole && (
              <button
                id="btn-open-add-expense-modal"
                onClick={() => setShowAddExpenseModal(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Catat Beban Pengeluaran
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                id="input-search-expenses"
                type="text"
                placeholder="Cari beban pengeluaran..."
                value={searchExpense}
                onChange={e => setSearchExpense(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded-xl text-xs bg-stone-50 focus:bg-white focus:outline-none"
              />
            </div>

            <select
              id="select-expense-category"
              value={selectedExpenseCategory}
              onChange={e => setSelectedExpenseCategory(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl text-xs bg-stone-50 font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Operasional Kelas">Operasional Kelas</option>
              <option value="Sarana & Prasarana">Sarana & Prasarana</option>
              <option value="Kegiatan Siswa">Kegiatan Siswa</option>
              <option value="Honorarium & Gaji">Honorarium & Gaji</option>
              <option value="Administrasi & Utilitas">Administrasi & Utilitas</option>
            </select>
          </div>

          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : filteredExpenses.length === 0 ? (
            <SIMEmptyState 
              type="generic"
              title="Belum Ada Beban Pengeluaran Operasional"
              description="Gunakan tombol 'Catat Beban Pengeluaran' untuk mendokumentasikan pengeluaran kelas, utilitas, atau operasional sekolah."
              actionLabel={isFinancialRole ? "Catat Beban Pengeluaran" : undefined}
              onAction={isFinancialRole ? () => setShowAddExpenseModal(true) : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-700 border-collapse">
                <thead className="bg-stone-100 uppercase text-[11px] text-stone-600 font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">No Pengeluaran</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Deskripsi</th>
                    <th className="p-3 text-right">Nominal</th>
                    <th className="p-3">Diajukan Oleh</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-stone-50 transition">
                      <td className="p-3 font-mono font-bold text-stone-900">{exp.expenseNumber}</td>
                      <td className="p-3 whitespace-nowrap">{formatDateCanonical(exp.date)}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold">{exp.category}</span></td>
                      <td className="p-3">{exp.description}</td>
                      <td className="p-3 text-right font-bold text-rose-800">Rp {exp.amount.toLocaleString('id-ID')}</td>
                      <td className="p-3">{exp.requestedBy || exp.sourceAccountName || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          exp.status === 'POSTED' || exp.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CLOSING */}
      {isFinancialRole && activeTab === 'CLOSING' && (
        <div id="r12-tab-closing-content" className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Penutupan Buku (Financial Period Closing Engine)</h2>
              <p className="text-xs text-stone-500">
                Lakukan Penutupan Buku Bulanan/Tahunan Secara Teratur Untuk Menjamin Integritas Histori.
              </p>
            </div>

            {isFinancialRole && (
              <div className="flex items-center gap-2">
                <input
                  id="input-closing-period"
                  type="month"
                  value={closingPeriod}
                  onChange={(e) => setClosingPeriod(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-xl text-xs font-bold bg-stone-50"
                />
                <button
                  id="btn-open-closing-modal"
                  onClick={() => setShowClosingConfirmModal(true)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" /> Proses Monthly Closing
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <SIMSkeletonLoader type="table" />
          ) : closings.length === 0 ? (
            <SIMEmptyState 
              type="generic"
              title="Belum Ada Histori Penutupan Buku Periode"
              description="Lakukan penutupan buku bulanan secara teratur untuk membekukan saldo dan menjaga integritas histori pembukuan."
              actionLabel={isFinancialRole ? "Proses Monthly Closing" : undefined}
              onAction={isFinancialRole ? () => setShowClosingConfirmModal(true) : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-700 border-collapse">
                <thead className="bg-stone-100 uppercase text-[11px] text-stone-600 font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">Periode</th>
                    <th className="p-3">Tipe</th>
                    <th className="p-3 text-right">Saldo Awal</th>
                    <th className="p-3 text-right">Pemasukan</th>
                    <th className="p-3 text-right">Pengeluaran</th>
                    <th className="p-3 text-right">Saldo Akhir</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl">Diclose Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {closings.map(c => (
                    <tr key={c.id} className="hover:bg-stone-50 transition">
                      <td className="p-3 font-bold text-slate-900">{c.period}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold">{c.type}</span></td>
                      <td className="p-3 text-right font-semibold">Rp {c.openingBalance.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-bold text-emerald-800">Rp {c.totalIncome.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-bold text-rose-800">Rp {c.totalExpense.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-bold text-slate-900">Rp {c.closingBalance.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500">{c.closedBy} ({formatDateCanonical(c.closedAt)})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Internal Modal: Monthly Closing Confirmation */}
      {showClosingConfirmModal && (
        <div id="modal-confirm-closing" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Penutupan Buku</h3>
              <p className="text-xs text-stone-500">
                Apakah Anda yakin ingin melakukan penutupan buku untuk <strong>Periode {closingPeriod}</strong>?
                Proses ini akan merekapitulasi saldo awal, arus kas masuk/keluar, dan saldo akhir periode tersebut ke Buku Besar.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Closing (Opsional)</label>
              <textarea
                id="input-closing-notes"
                rows={2}
                placeholder="Contoh: Rekonsiliasi selesai, kas fisik telah sesuai..."
                value={closingNotes}
                onChange={e => setClosingNotes(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-closing"
                disabled={isProcessingClosing}
                onClick={() => setShowClosingConfirmModal(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-execute-closing"
                disabled={isProcessingClosing}
                onClick={handleExecuteMonthlyClosing}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessingClosing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {isProcessingClosing ? 'Memproses Closing...' : 'Ya, Lakukan Closing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Modal: Add New Operational Expense */}
      {showAddExpenseModal && (
        <div id="modal-add-expense" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateExpenseSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-800" /> Catat Beban Pengeluaran Operasional
              </h2>
              <button
                type="button"
                id="btn-close-expense-modal"
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal</label>
                  <input
                    id="input-expense-date"
                    type="date"
                    required
                    value={newExpenseData.date}
                    onChange={e => setNewExpenseData({ ...newExpenseData, date: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    id="select-modal-expense-category"
                    value={newExpenseData.category}
                    onChange={e => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs bg-stone-50 cursor-pointer"
                  >
                    <option value="Operasional Kelas">Operasional Kelas</option>
                    <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                    <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                    <option value="Honorarium & Gaji">Honorarium & Gaji</option>
                    <option value="Administrasi & Utilitas">Administrasi & Utilitas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nominal Beban (Rp)</label>
                <input
                  id="input-expense-amount"
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  placeholder="Contoh: 150000"
                  value={newExpenseData.amount}
                  onChange={e => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Sumber Rekening / Akun Kas</label>
                <select
                  id="select-expense-source-account"
                  value={newExpenseData.sourceAccountId}
                  onChange={e => setNewExpenseData({ ...newExpenseData, sourceAccountId: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs bg-stone-50 cursor-pointer"
                >
                  <option value="">Pilih Sumber Rekening Kas...</option>
                  {accounts.map(a => (
                    <option key={a.accountId} value={a.accountId}>
                      {a.accountName} ({a.institution} - Rp {a.currentBalance.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Uraian / Deskripsi Pengeluaran</label>
                <textarea
                  id="input-expense-description"
                  rows={3}
                  required
                  placeholder="Contoh: Pembelian spidol, kertas HVS A4, dan perlengkapan kelas..."
                  value={newExpenseData.description}
                  onChange={e => setNewExpenseData({ ...newExpenseData, description: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-add-expense"
                disabled={isSubmittingExpense}
                onClick={() => setShowAddExpenseModal(false)}
                className="px-4 py-2 bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-300 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-submit-add-expense"
                disabled={isSubmittingExpense}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingExpense && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {isSubmittingExpense ? 'Menyimpan Pengeluaran...' : 'Simpan Pengeluaran'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

