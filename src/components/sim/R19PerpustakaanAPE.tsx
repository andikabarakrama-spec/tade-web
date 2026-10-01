import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { InventoryItem, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Library,
  BookOpen,
  Boxes,
  Plus,
  Search,
  Filter,
  Printer,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Info,
  Layers,
  Wrench,
  Sparkles,
  MapPin,
  Tag,
  Hash,
  Smile,
  ShieldCheck,
  ShieldAlert,
  BookMarked,
  FileText,
  AlertTriangle,
  Heart,
  ChevronRight,
  BookmarkCheck,
  Compass
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
] as const;

const MUTATION_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'GURU'
] as const;

/**
 * Deterministic ID Generator for Library & APE inventory items.
 * Guarantees reproducible, collision-free canonical keys without non-deterministic entropy.
 */
const generateDeterministicId = (
  category: string,
  code: string,
  name: string
): string => {
  const cleanCode = code
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');

  const cleanCat = category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');

  if (cleanCode) {
    return `inv-lib-${cleanCat}-${cleanCode}`;
  }

  const hash = Math.abs(
    name.split('').reduce(
      (acc, c) => (acc << 5) - acc + c.charCodeAt(0),
      0
    )
  ).toString(36);

  return `inv-lib-${cleanCat}-${hash}`;
};

export const R19PerpustakaanAPE: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Data States (Zero Student Data / Zero PII leak)
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCondition, setSelectedCondition] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewDetailItem, setViewDetailItem] = useState<InventoryItem | null>(null);
  const [showBlueprintModal, setShowBlueprintModal] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    category: 'Buku' | 'APE Dalam' | 'APE Luar';
    quantity: string;
    condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
    location: string;
  }>({
    code: '',
    name: '',
    category: 'Buku',
    quantity: '1',
    condition: 'Baik',
    location: ''
  });

  // UI In-App Feedback State (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Form Validation Error
  const [formError, setFormError] = useState<string>('');

  // 1. Authoritative Fail-Closed Active Role Determination (SEC-01 & SEC-02)
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Operational Authority: Strictly restricted to MUTATION_ROLES
  const canMutate = useMemo<boolean>(() => {
    return Boolean(
      currentUser?.uid &&
      verifiedActiveRole &&
      MUTATION_ROLES.includes(verifiedActiveRole)
    );
  }, [currentUser?.uid, verifiedActiveRole]);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load Data from SSOT with Pre-Query Authorization Gate
  const loadData = useCallback(async () => {
    // Pre-query authorization gate: fail-closed if unauthenticated or invalid role
    if (!currentUser?.uid || !verifiedActiveRole) {
      setInventoryList([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const invData = await DataService.getInventory();
      setInventoryList(invData || []);
    } catch (err) {
      console.error('Error loading library & APE inventory:', err);
      setFeedback({
        type: 'error',
        message: 'Gagal memuat katalog koleksi perpustakaan & APE dari server.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid, verifiedActiveRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter only library and APE relevant items from general inventory
  const relevantInventory = useMemo(() => {
    return inventoryList.filter(
      item => item.category === 'Buku' || item.category === 'APE Dalam' || item.category === 'APE Luar'
    );
  }, [inventoryList]);

  // Smart Metrics Calculation (Phase 3)
  const stats = useMemo(() => {
    const totalItems = relevantInventory.length;
    const totalUnits = relevantInventory.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    
    const books = relevantInventory.filter(i => i.category === 'Buku');
    const totalBooksUnits = books.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    
    const apeIndoor = relevantInventory.filter(i => i.category === 'APE Dalam');
    const apeOutdoor = relevantInventory.filter(i => i.category === 'APE Luar');
    const totalApeUnits = [...apeIndoor, ...apeOutdoor].reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    const goodConditionUnits = relevantInventory
      .filter(i => i.condition === 'Baik')
      .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    const repairNeededUnits = relevantInventory
      .filter(i => i.condition === 'Rusak Ringan' || i.condition === 'Rusak Berat')
      .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    return {
      totalItems,
      totalUnits,
      totalBooksUnits,
      booksCount: books.length,
      totalApeUnits,
      apeCount: apeIndoor.length + apeOutdoor.length,
      goodConditionUnits,
      repairNeededUnits
    };
  }, [relevantInventory]);

  // Search and Filter logic (Phase 4 & 5)
  const filteredCollections = useMemo(() => {
    return relevantInventory.filter(item => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;

      const matchCondition =
        selectedCondition === 'Semua' || item.condition === selectedCondition;

      return matchSearch && matchCategory && matchCondition;
    });
  }, [relevantInventory, searchQuery, selectedCategory, selectedCondition]);

  // Open Create Modal
  const handleOpenCreate = () => {
    if (!canMutate || !verifiedActiveRole || !currentUser?.uid) {
      setFeedback({
        type: 'error',
        message: 'Hak akses terbatas. Hanya Tenaga Pendidik / Admin yang dapat menambah data koleksi.'
      });
      return;
    }
    setEditingItem(null);
    setFormData({
      code: `LIB-${new Date().getFullYear()}-${String(inventoryList.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'Buku',
      quantity: '1',
      condition: 'Baik',
      location: 'Rak Literasi Asy-Syifa A1'
    });
    setFormError('');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: InventoryItem) => {
    if (!canMutate || !verifiedActiveRole || !currentUser?.uid) {
      setFeedback({
        type: 'error',
        message: 'Hak akses terbatas. Anda tidak memiliki izin untuk mengedit koleksi.'
      });
      return;
    }
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category as 'Buku' | 'APE Dalam' | 'APE Luar',
      quantity: String(item.quantity || 1),
      condition: item.condition,
      location: item.location
    });
    setFormError('');
    setShowModal(true);
  };

  // Handle Save Mutation (Phase 8, 9, 20)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate || !verifiedActiveRole || !currentUser?.uid || isSaving) return;

    // Field Validations
    if (!formData.name.trim()) {
      setFormError('Nama buku atau APE wajib diisi.');
      return;
    }

    if (!formData.code.trim()) {
      setFormError('Kode identifikasi / barcode koleksi wajib diisi.');
      return;
    }

    const qtyNumber = parseInt(formData.quantity, 10);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      setFormError('Jumlah unit harus berupa angka positif lebih dari 0.');
      return;
    }

    if (!formData.location.trim()) {
      setFormError('Lokasi penempatan / rak penyimpanan wajib diisi.');
      return;
    }

    // Duplicate Code Protection (Phase 9)
    const codeConflict = inventoryList.some(item => {
      if (editingItem && item.id === editingItem.id) return false;
      return item.code.trim().toLowerCase() === formData.code.trim().toLowerCase();
    });

    if (codeConflict) {
      setFormError(`Kode koleksi "${formData.code}" sudah digunakan pada aset lain. Gunakan kode unik.`);
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const itemToSave: InventoryItem = {
        id: editingItem ? editingItem.id : generateDeterministicId(formData.category, formData.code, formData.name),
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        category: formData.category,
        quantity: qtyNumber,
        condition: formData.condition,
        location: formData.location.trim()
      };

      await DataService.saveInventory(itemToSave);

      // Audit Log (Phase 20) - Authentic actor identity and verified active role
      const actorName =
        currentUser.displayName?.trim() ||
        (userProfile?.nama || userProfile?.name)?.trim() ||
        currentUser.email?.trim() ||
        `Pengguna Terautentikasi (${currentUser.uid.slice(0, 8)})`;
      const actionText = editingItem
        ? `Memperbarui data koleksi perpustakaan/APE: ${itemToSave.name} (${itemToSave.code})`
        : `Menambahkan koleksi baru perpustakaan/APE: ${itemToSave.name} (${itemToSave.code})`;

      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        actionText,
        'R19_PERPUSTAKAAN_APE'
      );

      setFeedback({
        type: 'success',
        message: editingItem
          ? `Koleksi "${itemToSave.name}" berhasil diperbarui!`
          : `Koleksi baru "${itemToSave.name}" berhasil didaftarkan ke sistem!`
      });

      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Error saving inventory:', err);
      setFormError('Gagal menyimpan data ke database. Silakan periksa koneksi Anda.');
    } finally {
      setIsSaving(false);
    }
  };

  // Print Handler (Phase 18)
  const handlePrint = () => {
    window.print();
  };

  // 4. Fail-Closed Security Boundary: Unauthenticated or unverified role sessions
  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div id="r19-access-denied-container" className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-lg text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Akses Terbatas — Otorisasi Diperlukan</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Modul R19 (Perpustakaan Cilik & Sentra APE) memerlukan sesi pengguna terautentikasi dengan peran yang sah. Silakan masuk terlebih dahulu melalui portal SIM Asy-Syifa.
        </p>
        <div className="pt-2">
          <button
            id="btn-r19-back-sim"
            onClick={() => window.history.back()}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-sm transition"
          >
            Kembali ke Portal SIM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="r19-perpustakaan-ape-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Printable Document Header (Visible only on print) */}
      <div className="hidden print:block mb-8 p-4 border-b-2 border-stone-800">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            TK ISLAM PLUS ASY-SYIFA TANGGUL
          </h2>
          <p className="text-xs text-stone-600">
            Katalog Rekapitulasi Koleksi Perpustakaan Cilik & Alat Permainan Edukatif (APE)
          </p>
          <p className="text-[10px] text-stone-500">
            Dokumen Resmi SIM Asy-Syifa | Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* In-App Non-blocking Feedback Banner (Phase 15) */}
      {feedback && (
        <div
          id="r19-feedback-banner"
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
            id="r19-feedback-dismiss"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-500 transition-colors"
            title="Tutup pesan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner - Living TK UX */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-emerald-100 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Modul R19 — Perpustakaan Cilik & Sentra APE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pojok Literasi & Koleksi Alat Permainan Edukatif
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Katalog resmi buku cerita islami bergambar, ensiklopedia cilik STEAM, serta media mainan edukatif indoor & outdoor untuk stimulasi motorik santri Asy-Syifa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canMutate && (
              <button
                id="r19-btn-add-collection"
                onClick={handleOpenCreate}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Koleksi</span>
              </button>
            )}

            <button
              id="r19-btn-print-recap"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap</span>
            </button>

            <button
              id="r19-btn-circulation-blueprint"
              onClick={() => setShowBlueprintModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-teal-600/60 hover:bg-teal-600 text-teal-100 hover:text-white font-medium text-xs flex items-center gap-2 border border-teal-400/30 transition-colors"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Sirkulasi Blueprint</span>
            </button>
          </div>
        </div>

        {/* Master Character Greeting Badge (Asy & Syifa) */}
        <div className="mt-6 pt-4 border-t border-emerald-600/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Pesan Dek Asy & Kak Syifa:</strong> "Mari rawat buku dan rapikan kembali APE ke tempatnya setelah belajar bersama!"
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-300/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SSOT DataService Integrity Locked</span>
          </div>
        </div>
      </div>

      {/* Smart Data Cards (Phase 3 - 100% Calculated) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Koleksi</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalItems} <span className="text-xs font-medium text-stone-500">Judul/Item</span></div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">{stats.totalUnits} unit fisik terdaftar</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Buku</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900">{stats.booksCount} <span className="text-xs font-medium text-stone-500">Judul</span></div>
          <div className="text-[11px] text-indigo-600 mt-1 font-medium">{stats.totalBooksUnits} eksemplar buku</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total APE</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900">{stats.apeCount} <span className="text-xs font-medium text-stone-500">Model</span></div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">{stats.totalApeUnits} unit mainan edukatif</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Kondisi Baik</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-800">{stats.goodConditionUnits} <span className="text-xs font-medium text-stone-500">Unit</span></div>
          <div className="text-[11px] text-teal-600 mt-1 font-medium">Siap pakai dalam sentra</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Perlu Perbaikan</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-800">{stats.repairNeededUnits} <span className="text-xs font-medium text-stone-500">Unit</span></div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Kondisi ringan / berat</div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, Condition Filters, View Toggle (Phase 4, 5, 6) */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="r19-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama buku, kode barcode, lokasi rak, atau APE..."
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
                id="r19-view-mode-cards"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kartu Visual
              </button>
              <button
                id="r19-view-mode-table"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Tabel Audit
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </div>
          {['Semua', 'Buku', 'APE Dalam', 'APE Luar'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'Buku' ? '📚 Buku Cerita & Edukasi' : cat === 'APE Dalam' ? '🧩 APE Indoor' : cat === 'APE Luar' ? '🛝 APE Outdoor' : 'Semua Kategori'}
            </button>
          ))}

          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium ml-auto mr-2">
            <span>Kondisi:</span>
          </div>
          {['Semua', 'Baik', 'Rusak Ringan', 'Rusak Berat'].map(cond => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                selectedCondition === cond
                  ? 'bg-slate-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-600">Memuat koleksi perpustakaan & APE Asy-Syifa...</p>
        </div>
      ) : filteredCollections.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Tidak ada koleksi yang cocok</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tidak ditemukan buku atau APE dengan kata kunci pencarian atau filter yang dipilih.
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'Semua' || selectedCondition !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setSelectedCondition('Semua');
              }}
              className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Dual View: Cards Grid (Phase 6) */
        <div id="r19-collection-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCollections.map(item => {
            const isBook = item.category === 'Buku';
            const isApeIndoor = item.category === 'APE Dalam';

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                        isBook
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : isApeIndoor
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {isBook ? <BookOpen className="w-3 h-3" /> : <Boxes className="w-3 h-3" />}
                      <span>{item.category}</span>
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.condition === 'Baik'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.condition === 'Rusak Ringan'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>

                  {/* Title & Code */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-mono text-stone-500 mt-0.5 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-stone-400" />
                      <span>{item.code}</span>
                    </p>
                  </div>

                  {/* Quantity and Location */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5 text-xs text-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Kuantitas:</span>
                      <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        {item.quantity} Unit
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-600 pt-1 border-t border-stone-200/60">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate text-[11px] font-medium">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    id={`r19-detail-${item.id}`}
                    onClick={() => setViewDetailItem(item)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>

                  {canMutate && (
                    <button
                      id={`r19-edit-${item.id}`}
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dual View: Table View (Phase 6) */
        <div id="r19-collection-table" className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Kode Aset</th>
                  <th className="py-3.5 px-4">Nama Koleksi / Buku</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4 text-center">Jumlah</th>
                  <th className="py-3.5 px-4">Kondisi</th>
                  <th className="py-3.5 px-4">Lokasi Rak / Sentra</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredCollections.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 max-w-xs truncate">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          item.category === 'Buku'
                            ? 'bg-indigo-50 text-indigo-700'
                            : item.category === 'APE Dalam'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-slate-900 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.condition === 'Baik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.condition === 'Rusak Ringan'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.condition}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 text-[11px] whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewDetailItem(item)}
                          className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canMutate && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors"
                            title="Edit Data"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal (Phase 7 - Zero Native Dialogs) */}
      {viewDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Rincian Koleksi Perpustakaan & APE</h3>
                  <p className="text-[11px] text-stone-500">Informasi spesifikasi aset sarana edukasi</p>
                </div>
              </div>
              <button
                id="r19-close-detail"
                onClick={() => setViewDetailItem(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-stone-500">
                  <span>Kode Registrasi:</span>
                  <span className="font-mono font-bold text-slate-900 px-2 py-0.5 bg-white rounded-md border border-stone-200">
                    {viewDetailItem.code}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[11px]">Nama Koleksi:</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{viewDetailItem.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Kategori</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{viewDetailItem.category}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Kuantitas Fisik</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{viewDetailItem.quantity} Unit</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Kondisi Barang</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{viewDetailItem.condition}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-stone-500 text-[10px] uppercase font-bold">Lokasi Rak / Sentra</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{viewDetailItem.location}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                <span className="font-bold text-[11px] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  SOP Pemeliharaan & Edukasi Santri
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Pastikan buku disimpan tegak di rak berpeneduh dan APE dibersihkan secara berkala demi keamanan serta higienitas seluruh santri TK Asy-Syifa.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Create / Edit Modal (Phase 7, 8, 9) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? 'Edit Koleksi Perpustakaan / APE' : 'Tambah Koleksi Baru'}
                  </h3>
                  <p className="text-[11px] text-stone-500">SSOT Canonical Database Mutation</p>
                </div>
              </div>
              <button
                id="r19-close-modal"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Kode Barcode / Aset *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Contoh: LIB-2026-001"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Kategori Koleksi *</label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        category: e.target.value as 'Buku' | 'APE Dalam' | 'APE Luar'
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                  >
                    <option value="Buku">Buku (Cerita/Edukasi)</option>
                    <option value="APE Dalam">APE Dalam (Indoor)</option>
                    <option value="APE Luar">APE Luar (Outdoor)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Nama Koleksi / Judul Buku *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Seri 25 Nabi & Rasul Bergambar"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Jumlah Unit Fisik *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Kondisi Barang *</label>
                  <select
                    value={formData.condition}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        condition: e.target.value as 'Baik' | 'Rusak Ringan' | 'Rusak Berat'
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                  >
                    <option value="Baik">Baik (Laik Pakai)</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Lokasi Penempatan / Rak *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Rak Literasi A1 / Sentra Balok STEAM"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="r19-btn-submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingItem ? 'Simpan Perubahan' : 'Daftarkan Koleksi'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Circulation Architecture Blueprint Modal (Phase 11, 12 - Transparent Draft Gap) */}
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
                      R19 Canonical Circulation Engine
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      DRAFT BLUEPRINT
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Transparansi Arsitektur: Sirkulasi Peminjaman Buku & APE Santri
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
                  Modul katalog buku & APE telah 100% terhubung ke SSOT <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">DataService.getInventory()</code>. Fitur sirkulasi peminjaman santri saat ini berstatus <strong>DRAFT ARCHITECTURAL BLUEPRINT</strong> untuk menjamin tidak ada manipulasi data lokal (localStorage dummy) sebelum entitas backend kanonikal disepakati.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                  Rancangan Skema Kanonikal (Target Sprint Berikutnya)
                </h4>
                
                <div className="p-3.5 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto space-y-1 shadow-inner">
                  <p className="text-stone-400">// Interface: LibraryCirculationRecord</p>
                  <p>interface LibraryCirculationRecord {'{'}</p>
                  <p className="pl-4">id: string; // uuid canonical</p>
                  <p className="pl-4">itemId: string; // foreign key to InventoryItem</p>
                  <p className="pl-4">itemName: string;</p>
                  <p className="pl-4">itemCategory: 'Buku' | 'APE Dalam' | 'APE Luar';</p>
                  <p className="pl-4">studentId: string; // foreign key to Student</p>
                  <p className="pl-4">studentName: string;</p>
                  <p className="pl-4">borrowedAt: string; // ISO Timestamp</p>
                  <p className="pl-4">dueAt: string; // Due Date</p>
                  <p className="pl-4">returnedAt?: string; // Optional Return Date</p>
                  <p className="pl-4">status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat' | 'Rusak';</p>
                  <p className="pl-4">notes?: string;</p>
                  <p className="pl-4">operatorUid: string; // Staf/Guru yang melayani</p>
                  <p className="pl-4">operatorRole: UserRole;</p>
                  <p>{'}'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Duplicate Protection
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Kombinasi <code className="bg-white px-1 py-0.5 rounded font-mono">itemId + studentId + status=Dipinjam</code> mencegah peminjaman ganda pada aset yang sama.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Wali Murid Data Isolation
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Wali murid hanya diizinkan melihat riwayat sirkulasi dan buku penghubung milik santri binaan pribadinya.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowBlueprintModal(false)}
                className="px-5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Pahami & Tutup Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
