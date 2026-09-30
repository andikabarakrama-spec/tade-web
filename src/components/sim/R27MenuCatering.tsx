import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CateringMenu, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Utensils,
  Search,
  Filter,
  Printer,
  Calendar,
  Eye,
  RefreshCw,
  Info,
  Sparkles,
  Apple,
  Milk,
  ChefHat,
  Heart,
  ShieldCheck,
  Salad,
  Clock,
  X,
  CheckCircle2,
  AlertCircle
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

export const R27MenuCatering: React.FC = () => {
  const { currentUser, activeRole } = useAuth();

  // Data States
  const [cateringList, setCateringList] = useState<CateringMenu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [activeDayTab, setActiveDayTab] = useState<string>('Senin');

  // Modal State for Detail
  const [viewDetailItem, setViewDetailItem] = useState<CateringMenu | null>(null);

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

  // Role Scope: Parental guidance display for parent roles (Fail-Closed)
  const isParent = useMemo(() => {
    return verifiedActiveRole === 'WALI_MURID' || verifiedActiveRole === 'CALON_WALI_MURID';
  }, [verifiedActiveRole]);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Load Catering Data from DataService
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await DataService.getCatering();
      setCateringList(items || []);
    } catch (err) {
      console.error('Error loading catering menus from DataService:', err);
      showFeedback('error', 'Gagal memuat jadwal menu katering dari server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Days List
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  // Identify Today's Day Name in Indonesian
  const todayDayName = useMemo(() => {
    const dayIndex = new Date().getDay();
    const dayMap: { [key: number]: string } = {
      1: 'Senin',
      2: 'Selasa',
      3: 'Rabu',
      4: 'Kamis',
      5: 'Jumat',
      6: 'Sabtu',
      0: 'Minggu'
    };
    return dayMap[dayIndex] || 'Senin';
  }, []);

  // Filtered List
  const filteredList = useMemo(() => {
    return cateringList.filter(item => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.dayName.toLowerCase().includes(query) ||
        item.mainCourse.toLowerCase().includes(query) ||
        item.snack.toLowerCase().includes(query) ||
        item.drink.toLowerCase().includes(query) ||
        item.nutritionalInfo.toLowerCase().includes(query);

      const matchesDay =
        selectedDay === 'Semua' || item.dayName.toLowerCase() === selectedDay.toLowerCase();

      return matchesSearch && matchesDay;
    });
  }, [cateringList, searchQuery, selectedDay]);

  // Item for Daily View Tab
  const dailyViewItem = useMemo(() => {
    return cateringList.find(
      item => item.dayName.toLowerCase() === activeDayTab.toLowerCase()
    );
  }, [cateringList, activeDayTab]);

  // Today's Menu
  const todayMenu = useMemo(() => {
    return cateringList.find(
      item => item.dayName.toLowerCase() === todayDayName.toLowerCase()
    );
  }, [cateringList, todayDayName]);

  // Dynamic Statistics for Smart Data Cards
  const stats = useMemo(() => {
    const totalMenus = cateringList.length;
    const hasTodayMenu = Boolean(todayMenu);
    const highNutritionCount = cateringList.filter(
      item =>
        item.nutritionalInfo.toLowerCase().includes('protein') ||
        item.nutritionalInfo.toLowerCase().includes('vitamin') ||
        item.nutritionalInfo.toLowerCase().includes('karbohidrat')
    ).length;
    const healthyDrinkCount = cateringList.filter(
      item =>
        item.drink.toLowerCase().includes('susu') ||
        item.drink.toLowerCase().includes('jus') ||
        item.drink.toLowerCase().includes('air')
    ).length;

    return {
      totalMenus,
      hasTodayMenu,
      highNutritionCount,
      healthyDrinkCount
    };
  }, [cateringList, todayMenu]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="r27-menu-catering-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Print-Only Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          TK ISLAM TERPADU ASY-SYIFA TANGGUL
        </h1>
        <p className="text-xs text-slate-600">
          JADWAL MENU MAKAN SIANG & KUDAPAN SEHAT BERGIZI (BEBAS MSG)
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          id="catering-feedback-banner"
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
            id="btn-close-feedback-cat"
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
            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
            <span>MODUL R27 • MENU CATERING SEHAT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu Makan Siang & Gizi Sehat Anak
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Jadwal menu gizi seimbang harian tanpa MSG, dipersiapkan dengan higienis dan bahan pangan segar untuk menunjang tumbuh kembang optimal anak TK Islam Terpadu Asy-Syifa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-refresh-catering"
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Muat Ulang</span>
          </button>

          <button
            id="btn-print-catering"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            title="Cetak Jadwal Menu Mingguan"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Menu Mingguan</span>
          </button>
        </div>
      </div>

      {/* Smart Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Card 1: Total Menu */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Menu Terdaftar</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalMenus} Hari</h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Rotasi Menu Sehat Mingguan</p>
          </div>
        </div>

        {/* Card 2: Menu Hari Ini */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Menu Hari Ini ({todayDayName})</p>
            <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-[170px]">
              {todayMenu ? todayMenu.mainCourse : 'Menu Akhir Pekan / Libur'}
            </h3>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">
              {todayMenu ? `Snack: ${todayMenu.snack}` : 'Jadwal Reguler Senin-Jumat'}
            </p>
          </div>
        </div>

        {/* Card 3: Menu Bergizi Tinggi */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Salad className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kandungan Nutrisi</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.highNutritionCount} Varian</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Kaya Protein, Vitamin & Serat</p>
          </div>
        </div>

        {/* Card 4: Minuman & Kudapan Sehat */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Milk className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Minuman & Snack</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.healthyDrinkCount} Macam</h3>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">Susu UHT, Jus Buah & Air Putih</p>
          </div>
        </div>
      </div>

      {/* Parental Healthy Nutrition Guidance Banner */}
      {isParent && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-5 border border-emerald-200/80 shadow-xs flex items-start gap-4 print:hidden">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
              Catatan Gizi Sehat untuk Ayah & Bunda
            </h4>
            <p className="text-xs text-emerald-800/90 leading-relaxed">
              Seluruh sajian makan siang di TK Islam Terpadu Asy-Syifa diolah menggunakan bahan organik dan tanpa penyedap rasa sintetis (Bebas MSG). Jika Ananda memiliki riwayat alergi makanan tertentu (seperti kacang, telur, atau seafood), mohon komunikasikan melalui Buku Penghubung agar tim dapur dapat menyesuaikan sajian alternatif.
            </p>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="input-search-catering"
              type="text"
              placeholder="Cari menu makanan, snack, minuman, atau info nutrisi..."
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

          {/* Day Filter */}
          <div>
            <select
              id="select-filter-day"
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
            >
              <option value="Semua">Semua Hari (Senin - Jumat)</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>
                  Hari {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>
              Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> menu terjadwal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tampilan:</span>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                id="btn-view-weekly"
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Menu Mingguan
              </button>
              <button
                id="btn-view-daily"
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fokus Hari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Memuat jadwal menu katering sehat...</p>
        </div>
      ) : cateringList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Menu Katering</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Belum ada data menu katering yang tersedia untuk periode ini.
            </p>
          </div>
        </div>
      ) : viewMode === 'daily' ? (
        /* Daily Focused View */
        <div className="space-y-6">
          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
            {daysOfWeek.map(day => {
              const isSelected = activeDayTab.toLowerCase() === day.toLowerCase();
              const isToday = todayDayName.toLowerCase() === day.toLowerCase();

              return (
                <button
                  key={day}
                  id={`tab-day-${day.toLowerCase()}`}
                  onClick={() => setActiveDayTab(day)}
                  className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{day}</span>
                  {isToday && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Hari Ini
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Card Content */}
          {dailyViewItem ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Jadwal Hari {dailyViewItem.dayName}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Sajian Lengkap Makan Siang & Snack
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tanggal: {dailyViewItem.date} • Standar Higienis Bebas MSG
                  </p>
                </div>

                <button
                  onClick={() => setViewDetailItem(dailyViewItem)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-center transition-all"
                >
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span>Rincian Nutrisi Lengkap</span>
                </button>
              </div>

              {/* 3 Pillars of Daily Meal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Pillar 1: Main Course */}
                <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Menu Utama (Makan Siang)
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                      {dailyViewItem.mainCourse}
                    </h4>
                  </div>
                </div>

                {/* Pillar 2: Snack */}
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      Kudapan / Snack Sehat
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                      {dailyViewItem.snack}
                    </h4>
                  </div>
                </div>

                {/* Pillar 3: Drink */}
                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Milk className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                      Minuman Bergizi
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                      {dailyViewItem.drink}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Nutrition Info Strip */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Kandungan Nutrisi Seimbang:</span>
                  <strong className="text-slate-900 font-bold">{dailyViewItem.nutritionalInfo}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Bebas Pengawet & MSG</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center text-xs text-slate-500">
              Belum ada menu yang dijadwalkan khusus untuk hari {activeDayTab}.
            </div>
          )}
        </div>
      ) : (
        /* Weekly Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map(item => {
            const isToday = item.dayName.toLowerCase() === todayDayName.toLowerCase();

            return (
              <div
                key={item.id}
                id={`cat-card-${item.id}`}
                className={`bg-white rounded-3xl p-6 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
                  isToday ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header: Day & Date Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xs">
                        <Utensils className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-slate-900">
                          Hari {item.dayName}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
                      </div>
                    </div>

                    {isToday && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Main Course */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Menu Makan Siang
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                      {item.mainCourse}
                    </h4>
                  </div>

                  {/* Snack & Drink */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-start gap-2 text-xs bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/60">
                      <Apple className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-tight">
                        <span className="font-bold text-amber-900 block">Kudapan Sehat:</span>
                        <span className="text-slate-700">{item.snack}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/60">
                      <Milk className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-tight">
                        <span className="font-bold text-blue-900 block">Minuman:</span>
                        <span className="text-slate-700">{item.drink}</span>
                      </div>
                    </div>
                  </div>

                  {/* Nutritional Info */}
                  <div className="text-[11px] text-slate-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="font-bold text-slate-700 block text-[10px] uppercase">
                      Nilai Nutrisi:
                    </span>
                    <span className="text-slate-600">{item.nutritionalInfo}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Bebas MSG</span>
                  </span>

                  <button
                    id={`btn-detail-${item.id}`}
                    onClick={() => setViewDetailItem(item)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Menu Item */}
      {viewDetailItem && (
        <div
          id="modal-catering-detail-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-catering-detail-container"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Rincian Menu Hari {viewDetailItem.dayName}
                  </h3>
                  <p className="text-xs text-slate-500">Tanggal Sajian: {viewDetailItem.date}</p>
                </div>
              </div>
              <button
                id="btn-close-detail-modal"
                onClick={() => setViewDetailItem(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              {/* Main Course */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                  Menu Utama (Makan Siang)
                </span>
                <p className="text-sm font-extrabold text-slate-900">{viewDetailItem.mainCourse}</p>
              </div>

              {/* Snack & Drink */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-amber-800 font-bold uppercase text-[10px] tracking-wider">
                    Kudapan / Snack Sehat
                  </span>
                  <p className="font-bold text-slate-900">{viewDetailItem.snack}</p>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                  <span className="text-blue-800 font-bold uppercase text-[10px] tracking-wider">
                    Minuman Pendamping
                  </span>
                  <p className="font-bold text-slate-900">{viewDetailItem.drink}</p>
                </div>
              </div>

              {/* Nutrition & Allergy Notice */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kandungan Nutrisi</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {viewDetailItem.nutritionalInfo}
                </p>
                <div className="pt-2 border-t border-stone-200 text-[10px] text-slate-500 leading-normal">
                  * Seluruh menu disiapkan higienis di bawah standar pengawasan gizi anak usia dini tanpa pewarna buatan dan tanpa MSG.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                id="btn-close-modal-detail-action"
                onClick={() => setViewDetailItem(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
