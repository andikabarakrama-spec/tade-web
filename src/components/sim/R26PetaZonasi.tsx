import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Users,
  Search,
  Filter,
  Printer,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  ShieldCheck,
  Compass,
  Layers,
  School,
  Navigation,
  Smile,
  Sparkles,
  BarChart3,
  Bus,
  ChevronRight,
  AlertTriangle
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

interface ZoneAggregation {
  zoneName: string;
  count: number;
  percentage: number;
  category: 'Zona Inti (Dekat Kampus)' | 'Zona Penyangga' | 'Zona Luar / Eksternal' | 'Belum Terklasifikasi';
  transportFeasibility: string;
  classDistribution: Record<string, number>;
}

interface ClassGroupAggregation {
  className: string;
  count: number;
  percentage: number;
  topZones: { zoneName: string; count: number }[];
}

export const R26PetaZonasi: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Canonical Identity & RBAC Resolution (Fail-closed)
  const canonicalRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Operational Authority Matrix for Macro Zonasi & Demographics Analysis
  // Allowed: SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH, GURU
  // Denied: KEUANGAN, WALI_MURID, CALON_WALI_MURID, ALUMNI_FAMILY, UNKNOWN, UNAUTHENTICATED
  const canAccessR26 = useMemo(() => {
    return Boolean(
      currentUser?.uid &&
      canonicalRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(canonicalRole)
    );
  }, [currentUser?.uid, canonicalRole]);

  // Authentic Actor Identity Resolution (Zero synthetic fallbacks)
  const actorDisplayName = useMemo(() => {
    if (!currentUser?.uid) return '';
    return (
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser.displayName?.trim() ||
      currentUser.email?.trim() ||
      `User (${currentUser.uid.slice(0, 8)})`
    );
  }, [currentUser, userProfile]);

  // Data State from SSOT
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'zones' | 'classes'>('zones');

  // Modal State
  const [showBlueprintModal, setShowBlueprintModal] = useState<boolean>(false);

  // In-App Feedback Banner (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  // Hard Pre-Query Gate: Load Student Data strictly if authorized
  const loadData = useCallback(async () => {
    // Hard authorization boundary check BEFORE query
    if (!canAccessR26 || !currentUser?.uid || !canonicalRole) {
      setStudents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Pass canonical verified role and identity to DataService
      const studentData = await DataService.getStudents(
        canonicalRole,
        currentUser.uid,
        currentUser.email || undefined
      );
      setStudents(studentData || []);
    } catch (err: any) {
      console.error('Error loading SSOT student data for zoning analysis:', err);
      showFeedback('error', 'Gagal memuat data siswa untuk analisis sebaran wilayah: ' + (err?.message || 'Terjadi kesalahan sistem'));
    } finally {
      setIsLoading(false);
    }
  }, [canAccessR26, currentUser?.uid, currentUser?.email, canonicalRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Defensive, Deterministic Address Normalizer
  const normalizeZoneName = useCallback((addressRaw: string | undefined): {
    zoneName: string;
    category: ZoneAggregation['category'];
    transportFeasibility: string;
  } => {
    if (!addressRaw || addressRaw.trim() === '') {
      return {
        zoneName: 'Lainnya / Belum Teridentifikasi',
        category: 'Belum Terklasifikasi',
        transportFeasibility: 'Perlu verifikasi alamat domisili'
      };
    }

    const addr = addressRaw.toLowerCase();

    if (addr.includes('tanggul barat') || addr.includes('tanggul kulon')) {
      return {
        zoneName: 'Desa Tanggul Barat / Kulon',
        category: 'Zona Inti (Dekat Kampus)',
        transportFeasibility: 'Rute Armada Utama & Akses Jalan Kaki/Sepeda Sangat Dekat'
      };
    }
    if (addr.includes('tanggul timur') || addr.includes('tanggul wetan')) {
      return {
        zoneName: 'Desa Tanggul Timur / Wetan',
        category: 'Zona Inti (Dekat Kampus)',
        transportFeasibility: 'Rute Armada Utama Koridor Tanggul Timur'
      };
    }
    if (addr.includes('patemon')) {
      return {
        zoneName: 'Desa Patemon',
        category: 'Zona Penyangga',
        transportFeasibility: 'Rute Armada Antar-Jemput Koridor Patemon'
      };
    }
    if (addr.includes('darungan')) {
      return {
        zoneName: 'Desa Darungan',
        category: 'Zona Penyangga',
        transportFeasibility: 'Rute Armada Antar-Jemput Koridor Darungan'
      };
    }
    if (addr.includes('kramat') || addr.includes('sukoharjo')) {
      return {
        zoneName: 'Desa Kramat Sukoharjo',
        category: 'Zona Penyangga',
        transportFeasibility: 'Rute Armada Penjemputan Penyangga Barat'
      };
    }
    if (addr.includes('klatakan')) {
      return {
        zoneName: 'Desa Klatakan',
        category: 'Zona Penyangga',
        transportFeasibility: 'Rute Jalur Provinsi Penyangga Timur'
      };
    }
    if (addr.includes('manggisan')) {
      return {
        zoneName: 'Desa Manggisan',
        category: 'Zona Penyangga',
        transportFeasibility: 'Rute Penjemputan Jalur Utara'
      };
    }
    if (addr.includes('bangsalsari')) {
      return {
        zoneName: 'Kecamatan Bangsalsari',
        category: 'Zona Luar / Eksternal',
        transportFeasibility: 'Armada Khusus / Transportasi Mandiri Wali Murid'
      };
    }
    if (addr.includes('sumberbaru')) {
      return {
        zoneName: 'Kecamatan Sumberbaru',
        category: 'Zona Luar / Eksternal',
        transportFeasibility: 'Armada Khusus / Transportasi Mandiri Wali Murid'
      };
    }
    if (addr.includes('semboro')) {
      return {
        zoneName: 'Kecamatan Semboro',
        category: 'Zona Luar / Eksternal',
        transportFeasibility: 'Armada Khusus / Transportasi Mandiri Wali Murid'
      };
    }
    if (addr.includes('tanggul')) {
      return {
        zoneName: 'Kawasan Sentral Tanggul',
        category: 'Zona Inti (Dekat Kampus)',
        transportFeasibility: 'Akses Sangat Dekat ke Kampus TK Asy Syifa Tanggul'
      };
    }

    return {
      zoneName: 'Lainnya / Belum Teridentifikasi',
      category: 'Belum Terklasifikasi',
      transportFeasibility: 'Data alamat belum spesifik mencantumkan nama desa'
    };
  }, []);

  // Filtered Students according to Class Filter (Single Canonical Identity)
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const isStatusActive = s.status === 'Aktif' || !s.status;
      const matchClass =
        selectedClassFilter === 'Semua' ||
        s.classGroup === selectedClassFilter ||
        s.kelompok === selectedClassFilter;
      return isStatusActive && matchClass;
    });
  }, [students, selectedClassFilter]);

  // Zone Aggregations (100% Calculated from Active Students)
  const zoneAggregations: ZoneAggregation[] = useMemo(() => {
    const total = filteredStudents.length;
    if (total === 0) return [];

    const map = new Map<string, {
      count: number;
      category: ZoneAggregation['category'];
      transportFeasibility: string;
      classDistribution: Record<string, number>;
    }>();

    filteredStudents.forEach(student => {
      const { zoneName, category, transportFeasibility } = normalizeZoneName(student.address);
      const studentClass = student.classGroup || student.kelompok || 'Belum Terdaftar';

      if (!map.has(zoneName)) {
        map.set(zoneName, {
          count: 0,
          category,
          transportFeasibility,
          classDistribution: {}
        });
      }

      const entry = map.get(zoneName)!;
      entry.count += 1;
      entry.classDistribution[studentClass] = (entry.classDistribution[studentClass] || 0) + 1;
    });

    const result: ZoneAggregation[] = [];
    map.forEach((value, zoneName) => {
      result.push({
        zoneName,
        count: value.count,
        percentage: Number(((value.count / total) * 100).toFixed(1)),
        category: value.category,
        transportFeasibility: value.transportFeasibility,
        classDistribution: value.classDistribution
      });
    });

    // Sort descending by student count
    return result.sort((a, b) => b.count - a.count);
  }, [filteredStudents, normalizeZoneName]);

  // Filtered Zones by Search Query
  const displayedZones = useMemo(() => {
    if (!searchQuery.trim()) return zoneAggregations;
    const q = searchQuery.toLowerCase().trim();
    return zoneAggregations.filter(z =>
      z.zoneName.toLowerCase().includes(q) ||
      z.category.toLowerCase().includes(q) ||
      z.transportFeasibility.toLowerCase().includes(q)
    );
  }, [zoneAggregations, searchQuery]);

  // Class Group Aggregations
  const classAggregations: ClassGroupAggregation[] = useMemo(() => {
    const total = filteredStudents.length;
    if (total === 0) return [];

    const classMap = new Map<string, {
      count: number;
      zoneCounts: Record<string, number>;
    }>();

    filteredStudents.forEach(student => {
      const cName = student.classGroup || student.kelompok || 'Belum Terdaftar';
      const { zoneName } = normalizeZoneName(student.address);

      if (!classMap.has(cName)) {
        classMap.set(cName, { count: 0, zoneCounts: {} });
      }

      const cEntry = classMap.get(cName)!;
      cEntry.count += 1;
      cEntry.zoneCounts[zoneName] = (cEntry.zoneCounts[zoneName] || 0) + 1;
    });

    const result: ClassGroupAggregation[] = [];
    classMap.forEach((val, className) => {
      const topZones = Object.entries(val.zoneCounts)
        .map(([zoneName, count]) => ({ zoneName, count }))
        .sort((a, b) => b.count - a.count);

      result.push({
        className,
        count: val.count,
        percentage: Number(((val.count / total) * 100).toFixed(1)),
        topZones
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }, [filteredStudents, normalizeZoneName]);

  // Smart Metrics (100% Calculated)
  const stats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const identifiedZones = zoneAggregations.filter(z => z.zoneName !== 'Lainnya / Belum Teridentifikasi');
    const totalIdentifiedCount = identifiedZones.reduce((sum, z) => sum + z.count, 0);
    const unidentifiedCount = totalStudents - totalIdentifiedCount;
    const topZone = identifiedZones.length > 0 ? identifiedZones[0] : null;

    return {
      totalStudents,
      totalIdentifiedZones: identifiedZones.length,
      identifiedCount: totalIdentifiedCount,
      unidentifiedCount,
      topZone
    };
  }, [filteredStudents, zoneAggregations]);

  // Handler-Level Guards for Operational Actions
  const handlePrint = () => {
    if (!currentUser?.uid || !canonicalRole || !canAccessR26) {
      showFeedback('error', 'Akses ditolak: Sesi tidak memiliki wewenang untuk mencetak laporan analisis demografi zonasi.');
      return;
    }
    if (isPrinting) return;

    setIsPrinting(true);
    try {
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  const handleOpenBlueprintModal = () => {
    if (!currentUser?.uid || !canonicalRole || !canAccessR26) {
      showFeedback('error', 'Akses ditolak: Sesi tidak valid.');
      return;
    }
    setShowBlueprintModal(true);
  };

  // Helper for Category Colors
  const getCategoryBadge = (category: ZoneAggregation['category']) => {
    switch (category) {
      case 'Zona Inti (Dekat Kampus)':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Zona Penyangga':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Zona Luar / Eksternal':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // Security Fail-Closed Render Guard: Sensitive DOM Isolation
  if (!currentUser?.uid || !canonicalRole || !canAccessR26) {
    return (
      <div
        id="r26-access-denied-container"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5"
      >
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-rose-700" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            KEAMANAN & PRIVASI GEOGRAFIS SISWA
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Akses Peta Zonasi & Demografi Dibatasi
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {!currentUser?.uid
              ? 'Sesi Anda belum terautentikasi. Silakan masuk terlebih dahulu untuk mengakses analisis zonasi sekolah.'
              : !canonicalRole
              ? 'Peran akun tidak terverifikasi secara sah dalam sistem kanonikal TK Asy-Syifa.'
              : `Peran Anda (${canonicalRole}) tidak memiliki wewenang untuk mengakses data analitik sebaran tempat tinggal dan demografi siswa.`}
          </p>
        </div>
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sim"
            id="btn-r26-back-sim"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Kembali ke Beranda SIM
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="r26-peta-zonasi-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Official Print Header (Visible only on print) */}
      <div className="hidden print:block mb-8 p-4 border-b-2 border-stone-800 text-center space-y-1">
        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          TK ASY SYIFA TANGGUL
        </h2>
        <p className="text-sm font-semibold text-slate-700">
          LAPORAN ANALISIS SEBARAN WILAYAH & DEMOGRAFI SISWA
        </p>
        <p className="text-xs text-stone-500">
          Agregasi Makro Berbasis Data Siswa Aktif | Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | Operator: {actorDisplayName} ({canonicalRole})
        </p>
        <div className="text-[10px] text-stone-400 mt-1 italic">
          *Catatan Kerahasiaan: Dokumen ini memuat data statistik wilayah makro. Tidak mengekspos alamat spesifik rumah atau data individual siswa.
        </div>
      </div>

      {/* In-App Non-blocking Feedback Banner */}
      {feedback && (
        <div
          id="r26-feedback-banner"
          className={`p-4 rounded-2xl flex items-center justify-between shadow-xs transition-all animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-900'
              : 'bg-sky-50 border border-sky-200 text-sky-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
            <span className="text-xs font-semibold">{feedback.message}</span>
          </div>
          <button
            id="r26-feedback-dismiss"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-500 transition-colors cursor-pointer"
            title="Tutup pesan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner - Living TK UX */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-emerald-100 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Modul R26 — Analisis Sebaran Wilayah & Demografi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Peta Analisis Demografi & Zonasi Siswa
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Pemetaan agregasi wilayah tempat tinggal siswa TK Asy Syifa Tanggul untuk evaluasi keterjangkauan rute armada antar-jemput dan perencanaan pemerataan layanan pendidikan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="r26-btn-refresh"
              onClick={loadData}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors cursor-pointer disabled:opacity-50"
              title="Segarkan data zonasi"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>

            <button
              id="r26-btn-print-recap"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan</span>
            </button>

            <button
              id="r26-btn-blueprint-disclosure"
              onClick={handleOpenBlueprintModal}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-900" />
              <span>Blueprint GIS & Catchment</span>
            </button>
          </div>
        </div>

        {/* Master Character Assistant Quote (Asy & Syifa) */}
        <div className="mt-6 pt-4 border-t border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Dek Asy & Kak Syifa:</strong> "Alhamdulillah, siswa TK Asy Syifa datang dari berbagai desa di sekitar Tanggul dengan riang gembira!"
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operator: <strong>{actorDisplayName}</strong> ({canonicalRole})</span>
          </div>
        </div>
      </div>

      {/* Critical Geolocation Honesty Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-2xs print:hidden">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <span className="font-bold">Keterbukaan Akurasi Geografis:</span>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Statistik di bawah ini dikalkulasi secara deterministik dari normalisasi string alamat siswa pada SSOT. Modul ini menyajikan <strong>klasifikasi wilayah administratif makro</strong> tanpa koordinat GPS individual guna menjamin perlindungan privasi dan keselamatan siswa.
          </p>
        </div>
      </div>

      {/* Smart Data Cards (100% Calculated from SSOT) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Siswa</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.totalStudents} <span className="text-xs font-medium text-stone-500">Siswa</span>
          </div>
          <div className="text-[11px] text-teal-600 mt-1 font-medium">Data siswa aktif terhubung SSOT</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Wilayah Terdata</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900">
            {stats.totalIdentifiedZones} <span className="text-xs font-medium text-stone-500">Desa/Wilayah</span>
          </div>
          <div className="text-[11px] text-indigo-600 mt-1 font-medium">{stats.identifiedCount} siswa teridentifikasi wilayah</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Konsentrasi Utama</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-emerald-900 truncate">
            {stats.topZone ? stats.topZone.zoneName : 'Belum Ada'}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {stats.topZone ? `${stats.topZone.count} Siswa (${stats.topZone.percentage}%)` : 'Data belum teridentifikasi'}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Verifikasi Alamat</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900">
            {stats.unidentifiedCount} <span className="text-xs font-medium text-stone-500">Siswa</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Alamat belum spesifik desa</div>
        </div>
      </div>

      {/* Control Bar: Search, Class Filter, View Toggle */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search by Zone Name */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="r26-search-zone"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama desa, kecamatan, atau zona wilayah..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-stone-500 font-medium">Tampilan:</span>
            <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                id="r26-mode-zones"
                onClick={() => setViewMode('zones')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'zones'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Sebaran Wilayah</span>
              </button>
              <button
                id="r26-mode-classes"
                onClick={() => setViewMode('classes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'classes'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Distribusi Rombel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Class Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Rombel:</span>
          </div>
          {['Semua', 'Kelompok A1', 'Kelompok A2', 'Kelompok B1', 'Kelompok B2', 'PAUD TPA'].map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClassFilter(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedClassFilter === cls
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{cls}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Menganalisis sebaran demografi siswa TK Asy Syifa Tanggul...</p>
        </div>
      ) : stats.totalStudents === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 bg-stone-100 text-stone-500 rounded-3xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Belum ada data siswa untuk dianalisis</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tidak ditemukan data siswa aktif pada database atau filter rombel yang dipilih.
            </p>
          </div>
        </div>
      ) : viewMode === 'zones' ? (
        /* DUAL VIEW A: Sebaran Wilayah */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedZones.map((zone, idx) => {
              const badgeStyle = getCategoryBadge(zone.category);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Zone Top Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{zone.category}</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 font-mono">
                        {zone.count} Siswa
                      </span>
                    </div>

                    {/* Zone Name & Percentage */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {zone.zoneName}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-stone-500 mt-1">
                        <span>Porsi Populasi:</span>
                        <span className="font-bold text-slate-800">{zone.percentage}%</span>
                      </div>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(zone.percentage, 4)}%` }}
                      />
                    </div>

                    {/* Transport & Access Information */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-stone-400" />
                        Keterjangkauan Armada Antar-Jemput:
                      </span>
                      <p className="text-xs font-medium text-slate-800 leading-relaxed">
                        {zone.transportFeasibility}
                      </p>
                    </div>

                    {/* Breakdown by Class in this Zone */}
                    <div className="pt-2 border-t border-stone-100">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1.5">
                        Sebaran per Rombel:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(zone.classDistribution).map(([clsName, cCount]) => (
                          <span
                            key={clsName}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-700 text-[10px] font-semibold border border-stone-200"
                          >
                            {clsName}: <strong>{cCount}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedZones.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 shadow-2xs space-y-2">
              <p className="text-xs font-bold text-slate-700">Tidak ada wilayah yang cocok dengan pencarian</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      ) : (
        /* DUAL VIEW B: Distribusi Kelompok Kelas */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Analisis Sebaran Domisili per Kelompok Kelas
            </h3>
            <p className="text-xs text-stone-500">
              Menampilkan konsentrasi wilayah tempat tinggal siswa untuk setiap rombongan belajar aktif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {classAggregations.map((cls, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    {cls.className}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                    {cls.count} Siswa ({cls.percentage}%)
                  </span>
                </div>

                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-2 rounded-full"
                    style={{ width: `${Math.max(cls.percentage, 5)}%` }}
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    Wilayah Domisili Terbanyak:
                  </span>
                  <div className="space-y-1">
                    {cls.topZones.slice(0, 3).map((tz, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-xl border border-stone-200/70"
                      >
                        <span className="font-medium text-slate-800 truncate">{tz.zoneName}</span>
                        <span className="font-bold text-emerald-800 shrink-0 font-mono text-[11px]">
                          {tz.count} Siswa
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blueprint Transparency Modal (Zero Fake GIS Disclosure) */}
      {showBlueprintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      TADE Geographic Distance & Catchment Architecture
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      DRAFT BLUEPRINT
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Transparansi Arsitektur Pemetaan Radius Geospasial Berkelanjutan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Keterbukaan SSOT Geospasial</span>
                </div>
                <p className="text-amber-800 text-xs">
                  Modul R26 saat ini memproses data alamat berbasis string normalisasi administratif desa/kecamatan di sekitar Tanggul. Fitur pengukuran radius meter/kilometer real-time dan polygon zoning GIS berstatus <strong>DRAFT ARCHITECTURAL BLUEPRINT</strong> untuk mencegah tebakan angka jarak fiktif tanpa koordinat GPS kanonikal.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                  Rancangan Kontrak Skema Geospasial Kanonikal
                </h4>

                <div className="p-3.5 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto space-y-1 shadow-inner">
                  <p className="text-stone-400">// Interface Kontrak Geospasial & Catchment Zonasi Kanonikal</p>
                  <p>export interface GeographicCatchmentZone &#123;</p>
                  <p className="pl-4">id: string;</p>
                  <p className="pl-4">zoneName: string; // e.g. 'Desa Tanggul Barat'</p>
                  <p className="pl-4">district: string; // 'Tanggul'</p>
                  <p className="pl-4">centerLat: number;</p>
                  <p className="pl-4">centerLng: number;</p>
                  <p className="pl-4">estimatedRoadDistanceKm: number;</p>
                  <p className="pl-4">catchmentRing: 'RING_1_CORE' | 'RING_2_BUFFER' | 'RING_3_OUTER';</p>
                  <p className="pl-4">transportRouteId?: string; // Ref TransportRoute.id</p>
                  <p className="pl-4">pickupPointName: string;</p>
                  <p>&#125;</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Perlindungan Privasi Anak
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Sistem hanya akan menyimpan koordinat titik kumpul wilayah makro (bukan pin-point rumah spesifik siswa) guna mencegah kebocoran data lokasi pribadi anak.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    Integrasi Rute Armada R28
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Data zonasi akan menjadi dasar analitik penentuan jalur rute armada antar-jemput dan alokasi kapasitas kendaraan sekolah.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
