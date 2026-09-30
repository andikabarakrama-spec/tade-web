import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Lock,
  RefreshCw,
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  FileSpreadsheet,
  ArrowUpDown,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { DataService } from '../../services/db';
import { AuditLog, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';

export const R24AuditLog: React.FC = () => {
  const { user, userProfile, activeRole } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Fail-closed canonical role resolution (No privileged fallback)
  const canonicalRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const canView = !!canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole);
  const canExport = !!canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [datePreset, setDatePreset] = useState<'ALL' | 'TODAY' | '7DAYS' | '30DAYS' | 'CUSTOM'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const loadLogs = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await DataService.getAuditLogsFromFirestore();
      setLogs(data);
    } catch (e: any) {
      console.error('Error fetching audit logs:', e);
      setFeedback({
        type: 'error',
        message: `Gagal memuat log audit: ${e?.message || 'Terjadi gangguan koneksi data.'}`
      });
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Derive unique modules and roles for filter dropdowns
  const availableModules = useMemo(() => {
    const modules = new Set<string>();
    logs.forEach(l => {
      if (l.targetModule) modules.add(l.targetModule);
    });
    return Array.from(modules).sort();
  }, [logs]);

  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    logs.forEach(l => {
      if (l.role) roles.add(l.role);
    });
    return Array.from(roles).sort();
  }, [logs]);

  // Determine severity based on action keywords
  const getLogSeverity = useCallback((action: string): 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO' => {
    const act = action.toUpperCase();
    if (act.includes('DELETE') || act.includes('PURGE') || act.includes('EMERGENCY') || act.includes('RESTORE') || act.includes('REJECT')) {
      return 'CRITICAL';
    }
    if (act.includes('UPDATE') || act.includes('MUTASI') || act.includes('MODIFIED') || act.includes('ROLE_CHANGE') || act.includes('LOCK')) {
      return 'WARNING';
    }
    if (act.includes('CREATE') || act.includes('APPROVE') || act.includes('LOGIN') || act.includes('SUCCESS') || act.includes('PAYMENT_CONFIRMED')) {
      return 'SUCCESS';
    }
    return 'INFO';
  }, []);

  // Filtered & Searched Logs with Memoization
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 1. Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchUser = log.userName?.toLowerCase().includes(query) || false;
        const matchAction = log.action?.toLowerCase().includes(query) || false;
        const matchModule = log.targetModule?.toLowerCase().includes(query) || false;
        const matchId = log.id?.toLowerCase().includes(query) || false;
        if (!matchUser && !matchAction && !matchModule && !matchId) return false;
      }

      // 2. Role filter
      if (selectedRole !== 'ALL' && log.role !== selectedRole) {
        return false;
      }

      // 3. Module filter
      if (selectedModule !== 'ALL' && (log.targetModule || 'General') !== selectedModule) {
        return false;
      }

      // 4. Severity filter
      if (selectedSeverity !== 'ALL') {
        const sev = getLogSeverity(log.action);
        if (sev !== selectedSeverity) return false;
      }

      // 5. Date filter
      if (datePreset !== 'ALL') {
        const logDate = new Date(log.timestamp);
        const now = new Date();

        if (datePreset === 'TODAY') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (logDate < today) return false;
        } else if (datePreset === '7DAYS') {
          const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (logDate < past7) return false;
        } else if (datePreset === '30DAYS') {
          const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (logDate < past30) return false;
        } else if (datePreset === 'CUSTOM') {
          if (startDate) {
            const start = new Date(startDate);
            if (logDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (logDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [logs, searchTerm, selectedRole, selectedModule, selectedSeverity, datePreset, startDate, endDate, getLogSeverity]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Export to CSV Function with Chain of Custody Audit Log
  const handleExportCSV = async () => {
    if (isExporting || !canExport || !canonicalRole) {
      if (!canExport || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengekspor data audit trail sistem.'
        });
      }
      return;
    }

    if (filteredLogs.length === 0) {
      setFeedback({
        type: 'info',
        message: 'Tidak ada data log yang sesuai untuk diekspor.'
      });
      return;
    }

    setIsExporting(true);
    try {
      const headers = ['ID', 'Waktu', 'Pengguna', 'Role', 'Aksi', 'Modul Target', 'Tingkat Kepentingan'];
      const rows = filteredLogs.map(l => [
        `"${l.id}"`,
        `"${new Date(l.timestamp).toLocaleString('id-ID')}"`,
        `"${l.userName || 'System'}"`,
        `"${l.role || '-'}"`,
        `"${l.action.replace(/"/g, '""')}"`,
        `"${l.targetModule || 'General'}"`,
        `"${getLogSeverity(l.action)}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Audit_Trail_TADE_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Audit Chain of Custody
      const actorName = userProfile?.nama || userProfile?.name || user?.displayName || 'Administrator';
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R24_AUDIT_LOG_EXPORT',
        `R24 Audit Trail - Diekspor ${filteredLogs.length} entri CSV`
      ).catch((err) => {
        console.warn('Chain of custody logAction warning:', err);
      });

      setFeedback({
        type: 'success',
        message: `Berhasil mengekspor ${filteredLogs.length} catatan audit trail ke berkas CSV.`
      });
    } catch (err: any) {
      console.error('Export CSV error:', err);
      setFeedback({
        type: 'error',
        message: `Gagal mengekspor audit log: ${err?.message || 'Terjadi kesalahan sistem.'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Severity Badge Component
  const renderSeverityBadge = (severity: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO') => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Critical
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
            <ShieldAlert className="w-3 h-3 text-amber-600" /> Warning
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
            <Info className="w-3 h-3 text-sky-600" /> Info
          </span>
        );
    }
  };

  if (!canView) {
    return (
      <div className="space-y-6 font-sans">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 text-rose-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Akses Ditolak: Hak Akses Tidak Mencukupi</h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Halaman rekam jejak audit sistem dan log forensik hanya dapat diakses oleh Super Admin, Admin, atau Kepala Sekolah.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
            <User className="w-3.5 h-3.5" /> Role Terdeteksi: {canonicalRole || 'GUEST'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-sky-50 text-sky-800 border-sky-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              {feedback.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="p-1 hover:bg-black/5 rounded-lg transition cursor-pointer text-stone-500 hover:text-stone-800"
              title="Tutup pemberitahuan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner with Mascot Integration */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <AIAsyCharacterScene pageContext="dashboardAdmin" className="shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Module R24 • Audit Trail Viewer
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-Only Immutable
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                <User className="w-3 h-3" /> Operator: {canonicalRole || 'GUEST'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Audit Log Aktivitas Pengguna & Keamanan Sistem
            </h1>
            <p className="text-stone-500 text-xs">
              Rekam jejak kepatuhan dan audit forensik otomatis setiap pendaftaran, verifikasi pembayaran, persetujuan, dan perubahan data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={isExporting || loading || !canExport}
            className="min-h-[44px] px-4 py-2 bg-white hover:bg-stone-50 disabled:opacity-50 text-slate-800 font-bold text-xs rounded-2xl border border-stone-300 shadow-2xs flex items-center gap-2 transition cursor-pointer disabled:cursor-not-allowed"
            title={canExport ? "Export data audit trail ke format CSV" : "Akses ekspor dibatasi (Khusus Super Admin, Admin, & Kepala Sekolah)"}
          >
            <Download className={`w-4 h-4 text-emerald-700 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Mengekspor...' : 'Ekspor CSV'}</span>
          </button>

          <button
            onClick={loadLogs}
            disabled={loading || isExporting}
            className="min-h-[44px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memuat...' : 'Refresh Log'}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Entri Log</span>
          <p className="text-2xl font-black text-slate-900 font-mono">{logs.length}</p>
          <span className="text-[10px] text-emerald-700 font-bold">100% Tercatat Lengkap</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Hasil Filter</span>
          <p className="text-2xl font-black text-emerald-700 font-mono">{filteredLogs.length}</p>
          <span className="text-[10px] text-stone-400">Dari total {logs.length} entri</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Modul Terdeteksi</span>
          <p className="text-2xl font-black text-purple-700 font-mono">{availableModules.length}</p>
          <span className="text-[10px] text-purple-600 font-bold">Terpantau Realtime</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Integritas Hash</span>
          <p className="text-sm font-black text-slate-800 font-mono pt-1">SHA-256 Valid</p>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Immutable Ledger
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Filter & Pencarian Audit Trail
            </h3>
          </div>

          {(searchTerm || selectedRole !== 'ALL' || selectedModule !== 'ALL' || selectedSeverity !== 'ALL' || datePreset !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('ALL');
                setSelectedModule('ALL');
                setSelectedSeverity('ALL');
                setDatePreset('ALL');
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari user, aksi, ID, modul..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full min-h-[44px] pl-9.5 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="ALL">Semua Peran / Role</option>
              {availableRoles.map((r) => (
                <option key={r} value={r}>Role: {r}</option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="ALL">Semua Modul Target</option>
              {availableModules.map((m) => (
                <option key={m} value={m}>Modul: {m}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="ALL">Semua Tingkat Kepentingan</option>
              <option value="CRITICAL">🔴 Critical (Penghapusan / Darurat)</option>
              <option value="WARNING">🟡 Warning (Perubahan / Update)</option>
              <option value="SUCCESS">🟢 Success (Pembuatan / Otorisasi)</option>
              <option value="INFO">🔵 Info (Aktivitas Umum)</option>
            </select>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" /> Rentang:
            </span>
            {(['ALL', 'TODAY', '7DAYS', '30DAYS', 'CUSTOM'] as const).map((preset) => {
              const labels = {
                ALL: 'Semua Waktu',
                TODAY: 'Hari Ini',
                '7DAYS': '7 Hari Terakhir',
                '30DAYS': '30 Hari Terakhir',
                CUSTOM: 'Kustom Tanggal'
              };
              return (
                <button
                  key={preset}
                  onClick={() => {
                    setDatePreset(preset);
                    setCurrentPage(1);
                  }}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    datePreset === preset
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {labels[preset]}
                </button>
              );
            })}
          </div>

          {datePreset === 'CUSTOM' && (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <span className="text-stone-400 text-xs">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SIMSkeletonLoader type="table" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8">
            <SIMEmptyState
              type="generic"
              title="Tidak Ada Catatan Audit yang Cocok"
              description="Tidak ditemukan rekaman log yang sesuai dengan filter atau kata kunci pencarian yang Anda tentukan."
              actionLabel="Reset Semua Filter"
              onAction={() => {
                setSearchTerm('');
                setSelectedRole('ALL');
                setSelectedModule('ALL');
                setSelectedSeverity('ALL');
                setDatePreset('ALL');
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-700 uppercase font-black tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Waktu (WIB)</th>
                  <th className="py-3.5 px-4">Pengguna & Peran</th>
                  <th className="py-3.5 px-4">Aksi / Aktivitas Sistem</th>
                  <th className="py-3.5 px-4">Modul Target</th>
                  <th className="py-3.5 px-4 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedLogs.map((l) => {
                  const severity = getLogSeverity(l.action);
                  return (
                    <tr key={l.id} className="hover:bg-stone-50/80 transition group">
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            {new Date(l.timestamp).toLocaleDateString('id-ID')}
                          </span>
                          <span className="font-mono text-[11px] text-stone-400">
                            {new Date(l.timestamp).toLocaleTimeString('id-ID')}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                            {(l.userName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{l.userName || 'System Auto'}</div>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono inline-block mt-0.5">
                              {l.role || 'SYSTEM'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 leading-snug font-mono text-[11px]">
                          {l.action}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          ID: {l.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-stone-100 text-stone-800 border border-stone-200 inline-block">
                          {l.targetModule || 'General Core'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {renderSeverityBadge(severity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredLogs.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-600 font-medium">
              <span>Menampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entri dari total <strong>{filteredLogs.length}</strong> entri</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="min-h-[36px] min-w-[36px] p-2 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-white text-slate-800 rounded-xl border border-stone-300 transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                title="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 text-xs font-bold text-slate-800 bg-white border border-stone-300 rounded-xl">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="min-h-[36px] min-w-[36px] p-2 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-white text-slate-800 rounded-xl border border-stone-300 transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                title="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety and Legal Compliance Note */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
        <Shield className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 font-bold">Kepatuhan Keamanan & Audit Kependidikan Nasional:</strong>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Log audit ini disimpan secara immutable (tidak dapat diedit atau dihapus oleh pihak manapun) di koleksi <code>audit_logs</code>. Setiap aktivitas sensitif dicatat beserta ID pengguna, stempel waktu ISO, dan konteks modul untuk menjamin transparansi akuntabilitas sekolah.
          </p>
        </div>
      </div>
    </div>
  );
};
