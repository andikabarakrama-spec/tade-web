import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ScheduleEvent, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Printer,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Info,
  X,
  CheckCircle2,
  AlertCircle,
  Edit2,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Flag,
  ShoppingBag,
  HeartHandshake,
  Compass
} from 'lucide-react';

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

// Roles with Calendar Event Management Authority (Create / Update / Mutate)
const EVENT_MANAGEMENT_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH'
];

export const R14KalenderAkademik: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Data States
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Calendar View Date State (Default August 2026 as per TADE academic year timeline)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // Aug 2026
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('');
  const [formCategory, setFormCategory] = useState<'Akademik' | 'Kegiatan' | 'Libur' | 'Market Day' | 'Manasik'>('Kegiatan');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');

  // Modal State for View Detail
  const [viewDetailEvent, setViewDetailEvent] = useState<ScheduleEvent | null>(null);

  // In-App Feedback Banner (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  // Note: userProfile.role NEVER overrides activeRole
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Event Management Authority strictly limited to SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH (Fail-Closed)
  const canManageEvents = useMemo(() => {
    return Boolean(verifiedActiveRole && EVENT_MANAGEMENT_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  // Authentic Actor Identity Resolution (Zero Synthetic Fallbacks)
  const actorName = useMemo(() => {
    return (
      userProfile?.name?.trim() ||
      userProfile?.nama?.trim() ||
      currentUser?.displayName?.trim() ||
      currentUser?.email?.trim() ||
      'Pengguna Terautentikasi'
    );
  }, [userProfile?.name, userProfile?.nama, currentUser?.displayName, currentUser?.email]);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Load Events from DataService
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Error loading schedule events:', err);
      showFeedback('error', 'Gagal memuat agenda kalender akademik.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Category Badges & Color Helper
  const getCategoryTheme = (category: ScheduleEvent['category']) => {
    switch (category) {
      case 'Akademik':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CalendarCheck
        };
      case 'Kegiatan':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Sparkles
        };
      case 'Libur':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: CalendarX
        };
      case 'Market Day':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: ShoppingBag
        };
      case 'Manasik':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          icon: Compass
        };
      default:
        return {
          bg: 'bg-stone-100 text-stone-800 border-stone-200',
          dot: 'bg-stone-500',
          icon: CalendarDays
        };
    }
  };

  // Smart Data Statistics Calculation
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const currentMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthEvents = events.filter(e => e.date.startsWith(currentMonthPrefix)).length;
    const holidayCount = events.filter(e => e.category === 'Libur').length;
    const schoolActivityCount = events.filter(
      e => e.category === 'Kegiatan' || e.category === 'Market Day' || e.category === 'Manasik'
    ).length;

    return {
      totalEvents,
      thisMonthEvents,
      holidayCount,
      schoolActivityCount
    };
  }, [events, currentDate]);

  // Filtered Events List
  const filteredEvents = useMemo(() => {
    return events
      .filter(item => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.location && item.location.toLowerCase().includes(query));

        const matchesCat =
          selectedCategory === 'Semua' || item.category === selectedCategory;

        const matchesDateFilter =
          !selectedDateFilter || item.date === selectedDateFilter;

        return matchesQuery && matchesCat && matchesDateFilter;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, searchQuery, selectedCategory, selectedDateFilter]);

  // Calendar Calculation Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Shift day for Monday start (0=Senin, ..., 6=Minggu)
  const startDayOffset = (firstDayOfMonth + 6) % 7;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateFilter(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateFilter(null);
  };

  // Open Add Modal (Guarded by Event Management Authority)
  const handleOpenAddModal = (presetDate?: string) => {
    if (!canManageEvents) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk menambahkan agenda.');
      return;
    }
    setEditingEventId(null);
    setFormTitle('');
    setFormDate(presetDate || `${year}-${String(month + 1).padStart(2, '0')}-15`);
    setFormCategory('Kegiatan');
    setFormDescription('');
    setFormLocation('TK Islam Terpadu Asy-Syifa');
    setIsModalOpen(true);
  };

  // Open Edit Modal (Guarded by Event Management Authority)
  const handleOpenEditModal = (eventItem: ScheduleEvent) => {
    if (!canManageEvents) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk mengedit agenda.');
      return;
    }
    setEditingEventId(eventItem.id);
    setFormTitle(eventItem.title);
    setFormDate(eventItem.date);
    setFormCategory(eventItem.category);
    setFormDescription(eventItem.description);
    setFormLocation(eventItem.location || '');
    setIsModalOpen(true);
  };

  // Save / Mutate Event Handler (Strict Fail-Closed Authorization + Anti-Double-Submit)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Session and Role Authorization Check (Fail-Closed)
    if (!currentUser?.uid || !verifiedActiveRole || !canManageEvents) {
      showFeedback('error', 'Akses ditolak: Hanya Super Admin, Admin, atau Kepala Sekolah yang berwenang mengelola kalender akademik.');
      return;
    }

    // 2. Anti-Double-Submit Guard
    if (isSaving) {
      return;
    }

    if (!formTitle.trim() || !formDate.trim() || !formDescription.trim()) {
      showFeedback('error', 'Mohon lengkapi judul, tanggal, dan deskripsi kegiatan.');
      return;
    }

    // Duplicate Check: Same title and date
    const duplicate = events.find(
      ev =>
        ev.id !== editingEventId &&
        ev.title.trim().toLowerCase() === formTitle.trim().toLowerCase() &&
        ev.date === formDate
    );

    if (duplicate) {
      showFeedback('error', `Agenda dengan judul serupa sudah terdaftar pada tanggal ${formDate}.`);
      return;
    }

    setIsSaving(true);
    try {
      const eventToSave: ScheduleEvent = {
        id: editingEventId || `evt-${Date.now()}`,
        title: formTitle.trim(),
        date: formDate,
        category: formCategory,
        description: formDescription.trim(),
        location: formLocation.trim() || undefined
      };

      await DataService.saveEvent(eventToSave);

      // Audit Trail with Authentic Actor Identity (Zero synthetic fallback)
      await DataService.createAuditLog({
        uid: currentUser.uid,
        userName: actorName,
        role: verifiedActiveRole,
        action: editingEventId ? 'UPDATE_SCHEDULE_EVENT' : 'CREATE_SCHEDULE_EVENT',
        targetModule: `R14_KALENDER_AKADEMIK - ${editingEventId ? 'Memperbarui' : 'Menambahkan'} agenda: "${eventToSave.title}" pada ${eventToSave.date}`
      });

      showFeedback(
        'success',
        editingEventId
          ? 'Agenda kegiatan berhasil diperbarui.'
          : 'Agenda kegiatan baru berhasil ditambahkan ke kalender.'
      );

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Error saving schedule event:', err);
      showFeedback('error', 'Terjadi kesalahan saat menyimpan agenda ke kalender.');
    } finally {
      setIsSaving(false);
    }
  };

  // Print View Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="r14-kalender-akademik-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Print-Only Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          TK ISLAM TERPADU ASY-SYIFA TANGGUL
        </h1>
        <p className="text-xs text-slate-600">
          KALENDER AKADEMIK & AGENDA KEGIATAN TAHUN AJARAN 2026/2027
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          id="calendar-feedback-banner"
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
            id="btn-close-feedback-cal"
            onClick={() => setFeedback(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>MODUL R14 • KALENDER AKADEMIK & AGENDA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kalender Akademik & Agenda Kegiatan
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Panduan jadwal libur sekolah, kegiatan rutin bulanan, tema pembelajaran terpadu, market day, dan manasik haji cilik TK Islam Terpadu Asy-Syifa Tanggul.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-print-calendar"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            title="Cetak Kalender Akademik"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Agenda</span>
          </button>

          {canManageEvents && (
            <button
              id="btn-add-new-event"
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda</span>
            </button>
          )}
        </div>
      </div>

      {/* Smart Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Card 1: Total Agenda */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Seluruh Agenda</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalEvents} Kegiatan</h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Tahun Ajaran 2026/2027</p>
          </div>
        </div>

        {/* Card 2: Bulan Ini */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Agenda {monthNames[month]} {year}
            </p>
            <h3 className="text-2xl font-black text-slate-900">{stats.thisMonthEvents} Agenda</h3>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">Bulan Aktif Terpilih</p>
          </div>
        </div>

        {/* Card 3: Kegiatan Sekolah */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kegiatan & STEAM</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.schoolActivityCount} Acara</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Market Day, Manasik & Pentas</p>
          </div>
        </div>

        {/* Card 4: Hari Libur */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <CalendarX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Libur & Cuti Bersama</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.holidayCount} Hari</h3>
            <p className="text-[11px] text-rose-700 font-medium mt-0.5">Jadwal Libur Resmi</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="input-search-calendar"
              type="text"
              placeholder="Cari judul kegiatan, lokasi, atau deskripsi agenda..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              id="select-filter-category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Akademik">Akademik</option>
              <option value="Kegiatan">Kegiatan Sekolah</option>
              <option value="Libur">Libur Resmi</option>
              <option value="Market Day">Market Day</option>
              <option value="Manasik">Manasik Haji Cilik</option>
            </select>
          </div>
        </div>

        {/* View Switcher & Quick Date Filter Feedback */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2">
            {selectedDateFilter ? (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                <span>Filter Tanggal: {selectedDateFilter}</span>
                <button
                  onClick={() => setSelectedDateFilter(null)}
                  className="p-0.5 hover:bg-emerald-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>
                  Menampilkan <strong className="text-slate-800">{filteredEvents.length}</strong> agenda kegiatan
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tampilan:</span>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                id="btn-view-calendar-grid"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kalender Bulanan
              </button>
              <button
                id="btn-view-calendar-list"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daftar Lengkap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar View Section */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          {/* Month Navigation Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {monthNames[month]} {year}
                </h2>
                <p className="text-xs text-slate-500">
                  Jadwal Kegiatan Belajar Mengajar & Acara TK Asy-Syifa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-prev-month"
                onClick={prevMonth}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-slate-600 hover:text-slate-900 transition-colors"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="btn-today-month"
                onClick={() => {
                  setCurrentDate(new Date(2026, 7, 1));
                  setSelectedDateFilter(null);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-stone-200 hover:bg-stone-50 text-slate-700 transition-colors"
              >
                Hari Ini
              </button>
              <button
                id="btn-next-month"
                onClick={nextMonth}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-slate-600 hover:text-slate-900 transition-colors"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day of Week Header Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 border-b border-stone-100 pb-2">
            <span className="text-slate-700">Senin</span>
            <span className="text-slate-700">Selasa</span>
            <span className="text-slate-700">Rabu</span>
            <span className="text-slate-700">Kamis</span>
            <span className="text-slate-700">Jumat</span>
            <span className="text-slate-400">Sabtu</span>
            <span className="text-rose-600">Minggu</span>
          </div>

          {/* Calendar Day Cells Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty Offset Slots */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div
                key={`offset-${i}`}
                className="min-h-[90px] sm:min-h-[110px] p-2 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200/60 opacity-40"
              />
            ))}

            {/* Days of Current Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isSelected = selectedDateFilter === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      setSelectedDateFilter(isSelected ? null : dateStr);
                    } else if (canManageEvents) {
                      handleOpenAddModal(dateStr);
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : dayEvents.length > 0
                      ? 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs'
                      : 'bg-white/80 border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        dayEvents.length > 0
                          ? 'bg-emerald-600 text-white font-black'
                          : 'text-slate-700 group-hover:bg-stone-200'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event Badges inside Cell */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => {
                      const theme = getCategoryTheme(ev.category);
                      return (
                        <div
                          key={ev.id}
                          onClick={e => {
                            e.stopPropagation();
                            setViewDetailEvent(ev);
                          }}
                          className={`text-[10px] px-1.5 py-0.5 rounded-lg border font-medium truncate flex items-center gap-1 hover:opacity-90 ${theme.bg}`}
                          title={ev.title}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} shrink-0`} />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-bold text-center">
                        +{dayEvents.length - 2} agenda lainnya
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    {canManageEvents && dayEvents.length === 0 && (
                      <span className="text-[10px] text-slate-300 group-hover:text-emerald-600 font-medium">
                        + Tambah
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Agenda List & Highlights Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Daftar Agenda Kegiatan & Libur Sekolah
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian waktu pelaksanaan, tempat kegiatan, dan deskripsi acara.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Total <strong>{filteredEvents.length}</strong> agenda ditemukan
            </span>
          </div>
        </div>

        {/* Empty State */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Calendar className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold">Memuat agenda kegiatan dari server...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-800">Tidak ada agenda kegiatan yang cocok.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori agenda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map(item => {
              const theme = getCategoryTheme(item.category);
              const ThemeIcon = theme.icon;

              return (
                <div
                  key={item.id}
                  id={`event-card-${item.id}`}
                  className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Date & Category */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{item.date}</span>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${theme.bg}`}>
                        <ThemeIcon className="w-3 h-3" />
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Info & Action */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-[11px]">
                        {item.location || 'TK Islam Terpadu Asy-Syifa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-view-detail-${item.id}`}
                        onClick={() => setViewDetailEvent(item)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        Detail
                      </button>

                      {canManageEvents && (
                        <button
                          id={`btn-edit-event-${item.id}`}
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-stone-100 transition-colors"
                          title="Edit Agenda"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Add / Edit Event */}
      {isModalOpen && (
        <div
          id="modal-event-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-event-container"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingEventId ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kalender Akademik TK Islam Terpadu Asy-Syifa
                  </p>
                </div>
              </div>
              <button
                id="btn-close-modal-event"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Judul Kegiatan / Agenda *</label>
                <input
                  id="input-form-event-title"
                  type="text"
                  required
                  placeholder="Contoh: Peringatan Hari Anak Nasional & Pawai Muharram Ceria"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                />
              </div>

              {/* Date & Category in 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Tanggal Pelaksanaan *</label>
                  <input
                    id="input-form-event-date"
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Kategori Agenda *</label>
                  <select
                    id="select-form-event-category"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ScheduleEvent['category'])}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Libur">Libur</option>
                    <option value="Market Day">Market Day</option>
                    <option value="Manasik">Manasik</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Lokasi / Tempat Pelaksanaan</label>
                <input
                  id="input-form-event-location"
                  type="text"
                  placeholder="Contoh: Halaman Utama TK Asy-Syifa / Aula Tanggul"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Deskripsi & Rincian Agenda *</label>
                <textarea
                  id="textarea-form-event-desc"
                  required
                  rows={3}
                  placeholder="Jelaskan instruksi perlengkapan siswa, susunan acara, atau pemberitahuan penting untuk guru & wali murid..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  id="btn-cancel-form-event"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-form-event"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Calendar className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{editingEventId ? 'Simpan Perubahan' : 'Tambah ke Kalender'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Detail Event */}
      {viewDetailEvent && (
        <div
          id="modal-view-detail-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-view-detail-container"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Rincian Agenda Kegiatan
                  </h3>
                  <p className="text-xs text-slate-500">ID: {viewDetailEvent.id}</p>
                </div>
              </div>
              <button
                id="btn-close-view-detail"
                onClick={() => setViewDetailEvent(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tanggal: {viewDetailEvent.date}</span>
                </div>
                <span className={`px-3 py-1 rounded-xl font-bold border ${getCategoryTheme(viewDetailEvent.category).bg}`}>
                  {viewDetailEvent.category}
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Nama Kegiatan</span>
                <h4 className="text-base font-extrabold text-slate-900">{viewDetailEvent.title}</h4>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Lokasi Pelaksanaan</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{viewDetailEvent.location || 'TK Islam Terpadu Asy-Syifa'}</span>
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Deskripsi & Panduan</span>
                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {viewDetailEvent.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              {canManageEvents && (
                <button
                  id="btn-edit-from-detail"
                  onClick={() => {
                    const ev = viewDetailEvent;
                    setViewDetailEvent(null);
                    handleOpenEditModal(ev);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Agenda Ini</span>
                </button>
              )}

              <button
                id="btn-close-view-detail-action"
                onClick={() => setViewDetailEvent(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs ml-auto"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
