import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { TransportRoute, Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Truck,
  Bus,
  Search,
  Filter,
  Printer,
  Phone,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Clock,
  Navigation,
  Car,
  UserCheck,
  ChevronRight,
  RefreshCw,
  Lock
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

export const R28AntarJemput: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Canonical Identity & RBAC Resolution (Fail-closed)
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Operational Roles Separation
  const isStaff = useMemo(() => {
    return Boolean(
      verifiedActiveRole &&
      ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(verifiedActiveRole)
    );
  }, [verifiedActiveRole]);

  const isWaliMurid = useMemo(() => {
    return verifiedActiveRole === 'WALI_MURID';
  }, [verifiedActiveRole]);

  // Overall Module Access Authorization
  const canAccessR28 = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    (isStaff || isWaliMurid)
  );

  const canViewGlobalRegistry = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    isStaff
  );

  const canMutate = Boolean(
    currentUser?.uid &&
    verifiedActiveRole &&
    ['SUPER_ADMIN', 'ADMIN'].includes(verifiedActiveRole)
  );

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

  // Data States
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Detail Modal State
  const [selectedRouteDetail, setSelectedRouteDetail] = useState<TransportRoute | null>(null);
  const [isSopModalOpen, setIsSopModalOpen] = useState<boolean>(false);

  // In-App Feedback Banner (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Hard Pre-Query Gate: Load Transport & Student Data from SSOT
  const loadData = useCallback(async () => {
    // Hard authorization boundary check BEFORE query
    if (!canAccessR28 || !currentUser?.uid || !verifiedActiveRole) {
      setRoutes([]);
      setStudents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (isStaff) {
        // Operational staff: allowed global transport registry and staff student scope
        const [transportData, studentData] = await Promise.all([
          DataService.getTransport(),
          DataService.getStudents(verifiedActiveRole, currentUser.uid, currentUser.email || undefined)
        ]);
        setRoutes(transportData || []);
        setStudents(studentData || []);
      } else if (isWaliMurid) {
        // Wali murid: child-scoped query only, zero global transport query
        const studentData = await DataService.getStudents('WALI_MURID', currentUser.uid, currentUser.email || undefined);
        setRoutes([]);
        setStudents(studentData || []);
      } else {
        // Fail-closed for any other role
        setRoutes([]);
        setStudents([]);
      }
    } catch (err: any) {
      console.error('Error loading transport data:', err);
      showFeedback('error', 'Gagal memuat data armada antar jemput: ' + (err?.message || 'Terjadi kesalahan sistem'));
    } finally {
      setIsLoading(false);
    }
  }, [canAccessR28, currentUser?.uid, currentUser?.email, verifiedActiveRole, isStaff, isWaliMurid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Smart Statistics (Calculated strictly from authorized routes)
  const stats = useMemo(() => {
    const totalRoutes = routes.length;
    const totalAssignedStudents = routes.reduce(
      (acc, r) => acc + (Number(r.assignedStudentsCount) || 0),
      0
    );
    const activeVehicles = routes.filter(r => r.vehicleNo && r.vehicleNo.trim() !== '').length;
    const uniqueDrivers = new Set(routes.map(r => r.driverName.trim()).filter(Boolean)).size;

    return {
      totalRoutes,
      totalAssignedStudents,
      activeVehicles,
      uniqueDrivers
    };
  }, [routes]);

  // Filtered Routes
  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        r.routeName.toLowerCase().includes(query) ||
        r.driverName.toLowerCase().includes(query) ||
        r.vehicleNo.toLowerCase().includes(query) ||
        r.driverPhone.toLowerCase().includes(query);

      const matchesRoute =
        selectedRouteFilter === 'Semua' || r.routeName === selectedRouteFilter;

      return matchesQuery && matchesRoute;
    });
  }, [routes, searchQuery, selectedRouteFilter]);

  // Wali Murid Accessible Student Sublist (Guaranteed child-scoped)
  const myLinkedStudents = useMemo(() => {
    return students;
  }, [students]);

  // Handler-Level Guards for Operational Actions
  const handlePrint = () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR28) {
      showFeedback('error', 'Akses ditolak: Sesi tidak memiliki wewenang untuk mencetak dokumen.');
      return;
    }
    window.print();
  };

  const handleOpenRouteDetail = (route: TransportRoute) => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR28) {
      showFeedback('error', 'Akses ditolak: Sesi tidak terautentikasi.');
      return;
    }
    if (!canViewGlobalRegistry) {
      showFeedback('error', 'Akses ditolak: Detail rute global hanya dapat diakses oleh staf operasional.');
      return;
    }
    setSelectedRouteDetail(route);
  };

  const handleOpenSopModal = () => {
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessR28) {
      showFeedback('error', 'Akses ditolak: Sesi tidak valid.');
      return;
    }
    setIsSopModalOpen(true);
  };

  // Security Fail-Closed Render Guard: Sensitive DOM Isolation
  if (!currentUser?.uid || !verifiedActiveRole || !canAccessR28) {
    return (
      <div
        id="r28-access-denied-container"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5"
      >
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-rose-700" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            KEAMANAN ARMADA & TRANSPORTASI SISWA
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Akses Layanan Antar Jemput Dibatasi
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {!currentUser?.uid
              ? 'Sesi Anda belum terautentikasi. Silakan masuk terlebih dahulu untuk mengakses layanan antar jemput.'
              : !verifiedActiveRole
              ? 'Peran akun tidak terverifikasi secara sah dalam sistem kanonikal TK Asy-Syifa.'
              : `Peran Anda (${verifiedActiveRole}) tidak memiliki wewenang untuk mengakses manifest dan data operasional armada antar-jemput anak.`}
          </p>
        </div>
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sim"
            id="btn-r28-back-sim"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Kembali ke Beranda SIM
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="r28-antar-jemput-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Print-Only Official Document Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          TK ISLAM TERPADU ASY-SYIFA TANGGUL
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          MANIFEST & JADWAL OPERASIONAL ARMADA ANTAR JEMPUT TAHUN AJARAN 2026/2027
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} | Operator: {actorDisplayName} ({verifiedActiveRole})
        </p>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          id="transport-feedback-banner"
          className={`p-4 rounded-2xl flex items-center justify-between shadow-xs transition-all animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : feedback.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium">{feedback.message}</p>
          </div>
          <button
            id="btn-close-feedback-transport"
            onClick={() => setFeedback(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              <Bus className="w-3.5 h-3.5 text-emerald-600" />
              <span>MODUL R28 • ANTAR JEMPUT & MANIFEST ARMADA</span>
            </span>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              Operator: <strong className="text-stone-800">{actorDisplayName}</strong> ({verifiedActiveRole})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Layanan Armada Antar Jemput Anak
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {isWaliMurid
              ? 'Informasi jadwal dan status layanan armada antar jemput untuk putra/putri Anda di TK Islam Terpadu Asy-Syifa.'
              : 'Sistem monitoring rute kendaraan operasional, kontak resmi pengemudi (driver), alokasi kapasitas kursi siswa, dan SOP keselamatan penjemputan anak TK Islam Terpadu Asy-Syifa.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-refresh-transport"
            onClick={loadData}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>

          <button
            id="btn-sop-keselamatan"
            onClick={handleOpenSopModal}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            title="Lihat SOP Keselamatan Transportasi"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SOP Keselamatan</span>
          </button>

          <button
            id="btn-print-transport"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            title="Cetak Manifest Armada"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Jadwal</span>
          </button>
        </div>
      </div>

      {/* Smart Data Statistics Cards (Visible strictly for authorized operational staff) */}
      {canViewGlobalRegistry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
          {/* Card 1: Total Rute */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Rute Trayek</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.totalRoutes} Rute</h3>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Wilayah Tanggul & Sekitarnya</p>
            </div>
          </div>

          {/* Card 2: Armada Aktif */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Armada Operasional</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.activeVehicles} Mobil</h3>
              <p className="text-[11px] text-blue-700 font-medium mt-0.5">Kendaraan Laik Jalan</p>
            </div>
          </div>

          {/* Card 3: Siswa Terdaftar */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Siswa Terdaftar</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.totalAssignedStudents} Anak</h3>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">Alokasi Penjemputan</p>
            </div>
          </div>

          {/* Card 4: Pengemudi Resmi */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pengemudi Resmi</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.uniqueDrivers} Driver</h3>
              <p className="text-[11px] text-purple-700 font-medium mt-0.5">Terlatih & Bersertifikat</p>
            </div>
          </div>
        </div>
      )}

      {/* Wali Murid Info Box (If Wali Murid is viewing) */}
      {isWaliMurid && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-200/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-emerald-900">
                Pemberitahuan Layanan Antar Jemput untuk Wali Murid
              </h4>
              <p className="text-emerald-800 leading-relaxed max-w-3xl">
                Layanan antar jemput beroperasi mulai pukul <strong>06.15 - 07.15 WIB</strong> (Pagi) dan <strong>11.00 - 12.00 WIB</strong> (Siang). 
                Pastikan putra/putri sudah siap 10 menit sebelum armada tiba di titik penjemputan.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenSopModal}
            className="px-3.5 py-2 bg-emerald-600 text-white font-bold rounded-xl shrink-0 hover:bg-emerald-700 transition-colors text-xs cursor-pointer"
          >
            Panduan Penjemputan
          </button>
        </div>
      )}

      {/* Search, Filter & View Controls (Visible strictly for authorized operational staff) */}
      {canViewGlobalRegistry && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Box */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="input-search-transport"
                type="text"
                placeholder="Cari nama rute, driver, nomor plat kendaraan, atau nomor kontak..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Route Filter Dropdown */}
            <div>
              <select
                id="select-filter-route"
                value={selectedRouteFilter}
                onChange={e => setSelectedRouteFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
              >
                <option value="Semua">Semua Rute Trayek</option>
                {routes.map(r => (
                  <option key={r.id} value={r.routeName}>
                    {r.routeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Menampilkan <strong className="text-slate-800">{filteredRoutes.length}</strong> armada rute operasional
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Tampilan:</span>
              <div className="flex bg-stone-100 p-1 rounded-xl">
                <button
                  id="btn-view-cards"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kartu Armada
                </button>
                <button
                  id="btn-view-table"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tabel Rute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Fleet & Route Content (Authorized operational staff view) */}
      {canViewGlobalRegistry && (
        <>
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center text-slate-500 space-y-3">
              <Bus className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold">Memuat data armada dan manifest penjemputan...</p>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-800">Tidak ada data armada yang sesuai pencarian.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan sesuaikan kata kunci pencarian atau ganti filter rute armada.
              </p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoutes.map((route, idx) => (
                <div
                  key={route.id}
                  id={`transport-card-${route.id}`}
                  className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-5"
                >
                  {/* Header: Code/ID & Badge */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-emerald-900 text-xs">
                          ARMADA #{String(idx + 1).padStart(2, '0')} • {route.id}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight mt-0.5">
                          {route.routeName}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Siap Operasional</span>
                    </span>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Vehicle & Plate */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <Car className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kendaraan / No. Pol</span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {route.vehicleNo}
                      </p>
                    </div>

                    {/* Assigned Students */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kapasitas Kursi</span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {route.assignedStudentsCount} Anak Terdaftar
                      </p>
                    </div>

                    {/* Driver */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pengemudi Resmi</span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {route.driverName}
                      </p>
                    </div>

                    {/* Phone Contact */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <Phone className="w-3.5 h-3.5 text-purple-600" />
                        <span>Kontak Driver</span>
                      </div>
                      <a
                        href={`tel:${route.driverPhone}`}
                        className="font-bold text-emerald-700 hover:text-emerald-800 text-xs sm:text-sm block truncate"
                      >
                        {route.driverPhone}
                      </a>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Jemput: 06.15 - 07.15 WIB</span>
                    </div>

                    <button
                      id={`btn-detail-route-${route.id}`}
                      onClick={() => handleOpenRouteDetail(route)}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition-colors text-xs cursor-pointer"
                    >
                      <span>Detail & SOP</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Kode / ID</th>
                      <th className="py-3.5 px-4">Nama Rute Trayek</th>
                      <th className="py-3.5 px-4">Kendaraan & No. Pol</th>
                      <th className="py-3.5 px-4">Pengemudi (Driver)</th>
                      <th className="py-3.5 px-4">Kontak Telepon</th>
                      <th className="py-3.5 px-4 text-center">Alokasi Siswa</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-slate-700">
                    {filteredRoutes.map((r, i) => (
                      <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                          ARMADA-{String(i + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          {r.routeName}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {r.vehicleNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {r.driverName}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`tel:${r.driverPhone}`}
                            className="text-emerald-700 font-bold hover:underline"
                          >
                            {r.driverPhone}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900">
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                            {r.assignedStudentsCount} Anak
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            id={`btn-table-detail-${r.id}`}
                            onClick={() => handleOpenRouteDetail(r)}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold rounded-lg transition-colors text-xs cursor-pointer"
                          >
                            Rincian
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Manifest Siswa & Safety Protocol Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Manifest Siswa & Titik Pemberhentian</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isWaliMurid
                ? 'Informasi penjemputan anak yang terdaftar di akun wali murid.'
                : 'Data alokasi siswa dan rekap titik penjemputan seluruh kelas.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Standar Keamanan Anak: Pendampingan Guru Aktif</span>
          </div>
        </div>

        {/* Student Manifest Roster */}
        {isWaliMurid ? (
          myLinkedStudents.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700">
                Siswa Terdaftar pada Akun Anda:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myLinkedStudents.map(student => (
                  <div
                    key={student.id}
                    className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {student.name || student.namaLengkap}
                      </h4>
                      <p className="text-xs text-slate-600">
                        NIS: {student.nis || '-'} • Kelompok: {student.classGroup || student.kelompok || 'TK Asy-Syifa'}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        Alamat: {student.address || 'Kecamatan Tanggul, Jember'}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                      Aktif Antar Jemput
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">Belum ada siswa terhubung dengan layanan antar jemput pada akun ini.</p>
              <p>Silakan hubungi Tata Usaha TK Asy-Syifa untuk pendaftaran rute penjemputan anak.</p>
            </div>
          )
        ) : (
          /* Staff View of Fleet Manifest */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span>Cakupan Wilayah Operasional Tanggul</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Rute Barat:</strong> Tanggul Kulon, Stasiun Tanggul, Krajan Barat, Darungan.</li>
                  <li><strong>Rute Timur & Patemon:</strong> Tanggul Wetan, Patemon, Perbatasan Bangsalsari, Semboro.</li>
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Jadwal Operasional Penjemputan</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Keberangkatan Pagi:</strong> Armada tiba di sekolah maksimal pukul 07.15 WIB.</li>
                  <li><strong>Kepulangan Siang:</strong> Armada berangkat dari sekolah pukul 11.00 WIB (Senin - Kamis) dan 10.30 WIB (Jumat).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Rute & Driver (Authorized Operational Staff Only) */}
      {selectedRouteDetail && canViewGlobalRegistry && (
        <div
          id="modal-route-detail-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-route-detail-container"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Rincian Armada & Rute
                  </h3>
                  <p className="text-xs text-slate-500">ID: {selectedRouteDetail.id}</p>
                </div>
              </div>
              <button
                id="btn-close-route-detail"
                onClick={() => setSelectedRouteDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Nama Rute Trayek</span>
                <h4 className="text-base font-extrabold text-emerald-950">{selectedRouteDetail.routeName}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Kendaraan</span>
                  <p className="font-extrabold text-slate-900">{selectedRouteDetail.vehicleNo}</p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Alokasi Penumpang</span>
                  <p className="font-extrabold text-slate-900">{selectedRouteDetail.assignedStudentsCount} Anak</p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Informasi Pengemudi</span>
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-slate-900 text-sm">{selectedRouteDetail.driverName}</p>
                  <a
                    href={`tel:${selectedRouteDetail.driverPhone}`}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-emerald-700 text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi Driver</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Protokol Keselamatan Penjemputan</span>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  <li>Wajib didampingi 1 guru/asisten pendamping di dalam armada.</li>
                  <li>Siswa dipastikan mengenakan sabuk pengaman / posisi duduk aman.</li>
                  <li>Penyerahan anak saat kepulangan hanya dilakukan kepada wali murid terdaftar.</li>
                </ul>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-end pt-4 border-t border-stone-100">
              <button
                id="btn-close-modal-route-action"
                onClick={() => setSelectedRouteDetail(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal SOP Keselamatan Transportasi */}
      {isSopModalOpen && (
        <div
          id="modal-sop-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-sop-container"
            className="bg-white rounded-3xl max-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    SOP Keselamatan Armada Antar Jemput
                  </h3>
                  <p className="text-xs text-slate-500">TK Islam Terpadu Asy-Syifa Tanggul</p>
                </div>
              </div>
              <button
                id="btn-close-sop-modal"
                onClick={() => setIsSopModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SOP Rules */}
            <div className="space-y-3.5 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                <h5 className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Kelaikan Kendaraan & Kecepatan Maksimal</span>
                </h5>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Pemeriksaan rutin harian tekanan ban, rem, sabuk pengaman, dan kebersihan kabin. Batas kecepatan maksimal armada di area perkampungan adalah <strong>30 km/jam</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. Pendampingan Guru di Setiap Mobil</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Setiap armada didampingi oleh seorang ustadzah/guru pendamping untuk membantu anak naik-turun mobil dan menjaga ketertiban selama perjalanan.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>3. Verifikasi Penyerahan Anak (Hand-over Protocol)</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Anak hanya diserahkan kepada orang tua/wali resmi yang terdaftar di sistem. Jika ada pihak pengganti yang menjemput, wali murid wajib mengonfirmasi ke guru pendamping via WhatsApp terlebih dahulu.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>4. Tindakan Darurat & P3K</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Setiap armada dilengkapi kotak P3K resmi, kantong mabuk perjalanan, dan akses langsung komunikasi darurat ke Puskesmas Tanggul / Klinik Asy-Syifa.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-end pt-4 border-t border-stone-100">
              <button
                id="btn-close-sop-action"
                onClick={() => setIsSopModalOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Saya Memahami SOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
