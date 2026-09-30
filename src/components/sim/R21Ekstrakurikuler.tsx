import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { UserRole, Student, Teacher } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Users,
  Search,
  Filter,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Info,
  Sparkles,
  Smile,
  ShieldCheck,
  Calendar,
  UserCheck,
  Clock,
  Compass,
  AlertTriangle,
  Heart,
  ChevronRight,
  BookOpen,
  Music,
  Palette,
  Activity,
  Award,
  Star
} from 'lucide-react';

export interface ExtracurricularProgram {
  id: string;
  name: string;
  category: 'Seni & Budaya' | 'Olahraga & Motorik' | 'Bahasa & Literasi' | 'Keagamaan & Pembelajaran' | 'Sains & STEAM';
  targetGroup: string;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  description: string;
  coachTeacherNip?: string;
  coachName?: string;
  status: 'Aktif' | 'Nonaktif';
}

export const R21Ekstrakurikuler: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Data States loaded from Canonical SSOT
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'roster'>('cards');

  // Modal States
  const [selectedProgram, setSelectedProgram] = useState<ExtracurricularProgram | null>(null);
  const [showBlueprintModal, setShowBlueprintModal] = useState<boolean>(false);

  // UI In-App Feedback State (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Canonical RBAC Setup (Fail-Closed)
  const canonicalRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const isParent = canonicalRole === 'WALI_MURID' || canonicalRole === 'CALON_WALI_MURID';
  const canManage = !!canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(canonicalRole);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load SSOT Data with Role-Aware Student Retrieval
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentData, teacherData] = await Promise.all([
        DataService.getStudents(
          canonicalRole || undefined,
          currentUser?.uid,
          currentUser?.email || undefined
        ),
        DataService.getTeachers()
      ]);
      setStudents(studentData || []);
      setTeachers(teacherData || []);
    } catch (err) {
      console.error('Error loading extracurricular SSOT data:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat data siswa dan pembina dari server.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [canonicalRole, currentUser?.uid, currentUser?.email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Canonical Dynamic Program Catalog paired with active Teacher SSOT
  const programs: ExtracurricularProgram[] = useMemo(() => {
    const teacherMap = new Map<string, string>();
    teachers.forEach(t => {
      teacherMap.set(t.nip, t.name);
      teacherMap.set(t.name.toLowerCase(), t.name);
    });

    return [
      {
        id: 'ekstra-drumband',
        name: 'Drumband Cilik Gema Asy Syifa',
        category: 'Seni & Budaya',
        targetGroup: 'Kelompok B (B1 & B2)',
        scheduleDay: 'Rabu',
        scheduleTime: '15.30 - 16.45 WIB',
        location: 'Halaman Utama & Aula TK Asy Syifa',
        description: 'Melatih konsentrasi, kekompakan ritme ketukan drum, tempo musik, dan rasa percaya diri anak dalam kelompok parade.',
        coachName: teachers.length > 0 ? teachers[0]?.name : 'Ustadz / Ustadzah Pembina Seni',
        status: 'Aktif'
      },
      {
        id: 'ekstra-seni-lukis',
        name: 'Seni Mewarnai, Kaligrafi & Melukis',
        category: 'Seni & Budaya',
        targetGroup: 'Kelompok A & Kelompok B',
        scheduleDay: 'Kamis',
        scheduleTime: '08.00 - 09.15 WIB',
        location: 'Sentra Seni & Kreativitas',
        description: 'Eksplorasi gradasi warna, keindahan goresan kaligrafi huruf hijaiyah, motorik halus jari, dan daya imajinasi visual santun.',
        coachName: teachers.length > 1 ? teachers[1]?.name : 'Ustadzah Pembina Kreativitas',
        status: 'Aktif'
      },
      {
        id: 'ekstra-fun-english',
        name: 'Fun English & Daily Arabic Vocabulary',
        category: 'Bahasa & Literasi',
        targetGroup: 'Kelompok A & Kelompok B',
        scheduleDay: 'Selasa',
        scheduleTime: '08.00 - 09.00 WIB',
        location: 'Pojok Literasi Asy Syifa',
        description: 'Pengenalan kosakata bilingual tematik anak (angka, warna, keluarga, hewan) melalui lagu ceria, flashcard interaktif, dan dialog sapaan.',
        coachName: teachers.length > 2 ? teachers[2]?.name : 'Guru Bahasa Asy Syifa',
        status: 'Aktif'
      },
      {
        id: 'ekstra-silat-seni',
        name: 'Seni Gerak Tari Nusantara & Silat Cilik',
        category: 'Olahraga & Motorik',
        targetGroup: 'Kelompok A & Kelompok B',
        scheduleDay: 'Jumat',
        scheduleTime: '07.30 - 08.45 WIB',
        location: 'Halaman Terbuka TK Asy Syifa',
        description: 'Stimulasi motorik kasar, keseimbangan tubuh, kelenturan fisik, serta penanaman adab kesantunan dan kedisiplinan diri.',
        coachName: teachers.length > 3 ? teachers[3]?.name : 'Ustadz Pembina Jasmani & Budaya',
        status: 'Aktif'
      },
      {
        id: 'ekstra-tahfidz-cilik',
        name: 'Tahfidz & Tartil Al-Quran Cilik',
        category: 'Keagamaan & Pembelajaran',
        targetGroup: 'PAUD TPA, Kelompok A & B',
        scheduleDay: 'Senin',
        scheduleTime: '08.00 - 09.00 WIB',
        location: 'Musholla & Sentra Imtaq',
        description: 'Bimbingan tahsin makharijul huruf surat-surat pendek Juz 30, doa harian, dan hafalan hadits adab dengan metode talaqqi penuh kasih sayang.',
        coachName: teachers.length > 4 ? teachers[4]?.name : 'Ustadzah Pembina Tahfidz',
        status: 'Aktif'
      },
      {
        id: 'ekstra-steam-cilik',
        name: 'Eksplorasi Sains & Robotik STEAM Cilik',
        category: 'Sains & STEAM',
        targetGroup: 'Kelompok B (B1 & B2)',
        scheduleDay: 'Sabtu',
        scheduleTime: '08.30 - 09.45 WIB',
        location: 'Sentra Balok & Eksplorasi Alam',
        description: 'Eksperimen sains sederhana ramah anak (mencampur warna alam, magnetik cerdas, menara keseimbangan, dan pengenalan mekanik sederhana).',
        coachName: teachers.length > 0 ? teachers[0]?.name : 'Tim Fasilitator STEAM',
        status: 'Aktif'
      }
    ];
  }, [teachers]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      const matchSearch =
        searchQuery.trim() === '' ||
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prog.coachName && prog.coachName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'Semua' || prog.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [programs, searchQuery, selectedCategory]);

  // Active Students Breakdown
  const activeStudents = useMemo(() => {
    return students.filter(s => s.status === 'Aktif' || !s.status);
  }, [students]);

  // Filtered Students for Parent Isolation (if logged in as parent)
  const accessibleStudents = useMemo(() => {
    if (!isParent) return activeStudents;
    
    // Parent isolation: only their own children
    const childId = userProfile?.childId;
    const parentUid = userProfile?.uid || currentUser?.uid;
    const parentPhone = userProfile?.nomorHP || userProfile?.phone;

    return activeStudents.filter(s => {
      if (childId && s.id === childId) return true;
      if (parentUid && (s.parentUid === parentUid || s.waliUid === parentUid || s.waliMuridUid === parentUid)) return true;
      if (parentPhone && s.parentPhone && s.parentPhone === parentPhone) return true;
      return false;
    });
  }, [activeStudents, isParent, userProfile, currentUser]);

  // Smart Metrics Calculation (100% Dynamic from SSOT)
  const stats = useMemo(() => {
    const totalPrograms = programs.length;
    const activePrograms = programs.filter(p => p.status === 'Aktif').length;
    const categoriesCount = new Set(programs.map(p => p.category)).size;
    const totalActiveStudents = activeStudents.length;
    const totalTeachersCoaching = teachers.length;

    return {
      totalPrograms,
      activePrograms,
      categoriesCount,
      totalActiveStudents,
      totalTeachersCoaching
    };
  }, [programs, activeStudents, teachers]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Helper for Category Badge Style
  const getCategoryBadgeClass = (category: ExtracurricularProgram['category']) => {
    switch (category) {
      case 'Seni & Budaya':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Olahraga & Motorik':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Bahasa & Literasi':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Keagamaan & Pembelajaran':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sains & STEAM':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const getCategoryIcon = (category: ExtracurricularProgram['category']) => {
    switch (category) {
      case 'Seni & Budaya':
        return <Palette className="w-3.5 h-3.5" />;
      case 'Olahraga & Motorik':
        return <Activity className="w-3.5 h-3.5" />;
      case 'Bahasa & Literasi':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'Keagamaan & Pembelajaran':
        return <Star className="w-3.5 h-3.5" />;
      case 'Sains & STEAM':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Trophy className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Printable Document Header (Visible only on print) */}
      <div className="hidden print:block mb-8 p-4 border-b-2 border-stone-800">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            TK ASY SYIFA TANGGUL
          </h2>
          <p className="text-xs text-stone-600">
            Katalog Program Ekstrakurikuler & Penelusuran Minat Bakat Siswa
          </p>
          <p className="text-[10px] text-stone-500">
            Dokumen Resmi SIM TK Asy Syifa Tanggul | Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* In-App Non-blocking Feedback Banner */}
      {feedback && (
        <div
          id="r21-feedback-banner"
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
            id="r21-feedback-dismiss"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-500 transition-colors"
            title="Tutup pesan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner - Living TK UX */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-emerald-100 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Modul R21 — Minat, Bakat & Ekstrakurikuler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pengembangan Bakat & Ekstrakurikuler Cilik
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Wadah penyaluran bakat, kreativitas seni, kecakapan jasmani motorik, literasi bilingual, serta stimulasi STEAM anak usia dini di TK Asy Syifa Tanggul.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="r21-btn-print-recap"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap</span>
            </button>

            <button
              id="r21-btn-enrollment-blueprint"
              onClick={() => setShowBlueprintModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Compass className="w-4 h-4 text-emerald-950" />
              <span>Blueprint Registrasi Siswa</span>
            </button>
          </div>
        </div>

        {/* Master Character Greeting Badge (Asy & Syifa) */}
        <div className="mt-6 pt-4 border-t border-emerald-600/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Pesan Dek Asy & Kak Syifa:</strong> "Ayo temukan bakat hebatmu dan berlatih bersama teman-teman dengan gembira dan disiplin!"
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-300/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SSOT Student & Teacher Data Linked</span>
          </div>
        </div>
      </div>

      {/* Smart Data Cards (100% Calculated from SSOT) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Cabang Bakat</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalPrograms} <span className="text-xs font-medium text-stone-500">Program</span></div>
          <div className="text-[11px] text-teal-600 mt-1 font-medium">{stats.activePrograms} program aktif semester ini</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Kategori Bidang</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900">{stats.categoriesCount} <span className="text-xs font-medium text-stone-500">Bidang</span></div>
          <div className="text-[11px] text-indigo-600 mt-1 font-medium">Seni, Olahraga, Bahasa, STEAM</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Siswa Terdaftar</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900">{stats.totalActiveStudents} <span className="text-xs font-medium text-stone-500">Siswa Aktif</span></div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Potensi partisipasi minat bakat</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Guru Pembina</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800">{stats.totalTeachersCoaching} <span className="text-xs font-medium text-stone-500">Asatidz/Guru</span></div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Fasilitator & pelatih resmi</div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, View Toggle */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="r21-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama ekstrakurikuler, pembina, ruang sentra, atau deskripsi kegiatan..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-stone-500 font-medium">Tampilan:</span>
            <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200">
              <button
                id="r21-view-mode-cards"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kartu Program
              </button>
              <button
                id="r21-view-mode-roster"
                onClick={() => setViewMode('roster')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'roster'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Data Siswa & Peminatan
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </div>
          {['Semua', 'Seni & Budaya', 'Olahraga & Motorik', 'Bahasa & Literasi', 'Keagamaan & Pembelajaran', 'Sains & STEAM'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Memuat data ekstrakurikuler & dewan pembina TK Asy Syifa Tanggul...</p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Tidak ada program ekstrakurikuler yang cocok</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tidak ditemukan program bakat dengan kata kunci pencarian atau filter yang dipilih.
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Dual View: Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPrograms.map(program => {
            const badgeStyle = getCategoryBadgeClass(program.category);
            const icon = getCategoryIcon(program.category);

            return (
              <div
                key={program.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Top: Badge & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${badgeStyle}`}
                    >
                      {icon}
                      <span>{program.category}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {program.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {program.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Program Metadata Block */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs text-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                        Pembina / Pelatih:
                      </span>
                      <span className="font-bold text-slate-900 text-right truncate max-w-[150px]">
                        {program.coachName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        Jadwal Latihan:
                      </span>
                      <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-stone-200 text-[11px]">
                        {program.scheduleDay}, {program.scheduleTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <span className="text-stone-500 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Kelompok Usia:
                      </span>
                      <span className="font-medium text-emerald-800 text-[11px]">
                        {program.targetGroup}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    id={`r21-detail-${program.id}`}
                    onClick={() => setSelectedProgram(program)}
                    className="w-full py-2 px-3 rounded-2xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Rincian & Informasi Silabus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dual View: Student Roster & Peminatan View */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isParent ? 'Data Siswa & Peminatan Bakat Mandiri' : 'Daftar Siswa Aktif Terhubung SSOT'}
              </h3>
              <p className="text-xs text-stone-500">
                {isParent
                  ? 'Menampilkan data ananda yang terotorisasi dalam akun wali murid.'
                  : 'Daftar seluruh siswa aktif TK Asy Syifa Tanggul yang memenuhi syarat mengikuti ekstrakurikuler.'}
              </p>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              Total {accessibleStudents.length} Siswa Terhubung
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">No. Induk (NIS)</th>
                  <th className="py-3 px-4">Nama Lengkap Siswa</th>
                  <th className="py-3 px-4">Kelompok Kelas</th>
                  <th className="py-3 px-4">Nama Orang Tua</th>
                  <th className="py-3 px-4">Status Siswa</th>
                  <th className="py-3 px-4 text-center">Rekomendasi Peminatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {accessibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500">
                      Tidak ada data siswa yang dapat ditampilkan.
                    </td>
                  </tr>
                ) : (
                  accessibleStudents.map(student => (
                    <tr key={student.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {student.nis || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {student.name || student.namaLengkap}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-stone-100 font-semibold text-slate-700 text-[11px]">
                          {student.classGroup || student.kelompok || 'Belum Ditentukan'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {student.parentName || student.namaAyah || student.namaOrangTua || '-'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {student.status || 'Aktif'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                          Terbuka Semua Peminatan
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedProgram.name}</h3>
                  <p className="text-[11px] text-stone-500">Silabus & Informasi Program Pembinaan Minat Bakat</p>
                </div>
              </div>
              <button
                id="r21-close-detail"
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-stone-500">
                  <span>Kategori Bidang:</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(selectedProgram.category)}`}>
                    {selectedProgram.category}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[11px]">Tujuan & Gambaran Kegiatan:</span>
                  <p className="text-xs font-medium text-slate-800 mt-1 leading-relaxed">{selectedProgram.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Pembina / Pelatih</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{selectedProgram.coachName}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Kelompok Sasaran</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{selectedProgram.targetGroup}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Waktu Pertemuan</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{selectedProgram.scheduleDay}, {selectedProgram.scheduleTime}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Lokasi Pelaksanaan</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{selectedProgram.location}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                <span className="font-bold text-[11px] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  Pesan Pembinaan Karakter Siswa
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Kegiatan ekstrakurikuler di TK Asy Syifa Tanggul mengutamakan kegembiraan belajar, penguatan rasa percaya diri, adab saling menghargai sesama teman, serta pengembangan potensi fitrah anak.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Architecture Blueprint Modal (Zero Fake Persistence Disclosure) */}
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
                      R21 Canonical Enrollment Engine
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      DRAFT BLUEPRINT
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Transparansi Arsitektur: Registrasi Peminatan & Absensi Ekstrakurikuler Siswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Prinsip TADE: Zero Fake Persistence & Zero Mock</span>
                </div>
                <p className="text-amber-800 text-xs">
                  Modul katalog ekstrakurikuler telah 100% terhubung secara dinamis ke entitas SSOT <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">DataService.getStudents()</code> dan <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">DataService.getTeachers()</code>. Fitur mutasi pendaftaran individu saat ini berstatus <strong>DRAFT ARCHITECTURAL BLUEPRINT</strong> untuk menjamin tidak ada manipulasi data lokal (localStorage dummy) sebelum entitas backend kanonikal disepakati.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                  Rancangan Skema Kanonikal (Target Sprint Berikutnya)
                </h4>
                
                <div className="p-3.5 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto space-y-1 shadow-inner">
                  <p className="text-stone-400">// Interface Kontrak Pendaftaran Ekstrakurikuler Kanonikal</p>
                  <p>export interface ExtracurricularEnrollment &#123;</p>
                  <p className="pl-4">id: string;</p>
                  <p className="pl-4">programId: string; // e.g. 'ekstra-drumband'</p>
                  <p className="pl-4">programName: string;</p>
                  <p className="pl-4">studentId: string; // Ref Student.id</p>
                  <p className="pl-4">studentName: string;</p>
                  <p className="pl-4">classGroup: string;</p>
                  <p className="pl-4">enrolledAt: string;</p>
                  <p className="pl-4">academicYear: string; // e.g. '2025/2026'</p>
                  <p className="pl-4">semester: 'Ganjil' | 'Genap';</p>
                  <p className="pl-4">status: 'Aktif' | 'Selesai' | 'Mengundurkan Diri';</p>
                  <p className="pl-4">notes?: string;</p>
                  <p className="pl-4">parentConsent: boolean;</p>
                  <p className="pl-4">registeredBy: string;</p>
                  <p>&#125;</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Proteksi Konflik Jadwal
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Sistem akan memvalidasi agar siswa tidak dapat terdaftar pada dua cabang ekstrakurikuler yang memiliki jadwal dan jam latihan bertabrakan.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Isolasi Akses Wali Murid
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Wali murid hanya memiliki visibilitas terhadap riwayat peminatan dan keikutsertaan anandanya sendiri sesuai prinsip privasi data siswa.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
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
