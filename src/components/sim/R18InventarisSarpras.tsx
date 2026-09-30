import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { InventoryItem, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
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
  Boxes,
  Smile,
  ShieldCheck,
  Building2,
  Tv,
  BookOpen
} from 'lucide-react';

export const R18InventarisSarpras: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Data States
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

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    category: 'APE Luar' | 'APE Dalam' | 'Elektronik' | 'Mebel' | 'Buku';
    quantity: string;
    condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
    location: string;
  }>({
    code: '',
    name: '',
    category: 'APE Luar',
    quantity: '1',
    condition: 'Baik',
    location: ''
  });

  // UI In-App Feedback State (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Form Error
  const [formError, setFormError] = useState<string>('');

  // Canonical RBAC Setup (Fail-Closed)
  const canonicalRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const isParent = canonicalRole === 'WALI_MURID' || canonicalRole === 'CALON_WALI_MURID';
  const canMutate = !!canonicalRole && ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'].includes(canonicalRole);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Load Inventory Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await DataService.getInventory();
      setInventoryList(items || []);
    } catch (err) {
      console.error('Error loading inventory from DataService:', err);
      showFeedback('error', 'Gagal memuat data inventaris sarpras dari server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Categories & Conditions Lists
  const categories: Array<'APE Luar' | 'APE Dalam' | 'Elektronik' | 'Mebel' | 'Buku'> = [
    'APE Luar',
    'APE Dalam',
    'Elektronik',
    'Mebel',
    'Buku'
  ];

  const conditions: Array<'Baik' | 'Rusak Ringan' | 'Rusak Berat'> = [
    'Baik',
    'Rusak Ringan',
    'Rusak Berat'
  ];

  // Filtered List
  const filteredList = useMemo(() => {
    return inventoryList.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;

      const matchesCondition =
        selectedCondition === 'Semua' || item.condition === selectedCondition;

      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [inventoryList, searchQuery, selectedCategory, selectedCondition]);

  // Statistics for Smart Data Cards
  const stats = useMemo(() => {
    const totalItems = inventoryList.length;
    const totalUnits = inventoryList.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const goodConditionCount = inventoryList.filter(i => i.condition === 'Baik').length;
    const needsRepairCount = inventoryList.filter(
      i => i.condition === 'Rusak Ringan' || i.condition === 'Rusak Berat'
    ).length;
    const apeOutdoorCount = inventoryList.filter(i => i.category === 'APE Luar').length;
    const apeIndoorCount = inventoryList.filter(i => i.category === 'APE Dalam').length;

    return {
      totalItems,
      totalUnits,
      goodConditionCount,
      needsRepairCount,
      apeOutdoorCount,
      apeIndoorCount
    };
  }, [inventoryList]);

  // Handle Open Create Modal
  const handleOpenCreateModal = () => {
    if (!canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mencatat inventaris.');
      return;
    }

    setEditingItem(null);
    setFormError('');
    setFormData({
      code: `SAR-${String(inventoryList.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'APE Luar',
      quantity: '1',
      condition: 'Baik',
      location: 'Halaman Bermain Luar'
    });
    setShowModal(true);
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (item: InventoryItem) => {
    if (!canMutate) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mengedit aset.');
      return;
    }

    setEditingItem(item);
    setFormError('');
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      condition: item.condition,
      location: item.location
    });
    setShowModal(true);
  };

  // Handle Save (Create / Update)
  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Handler-level Re-entry / Anti-Double-Submit Guard
    if (isSaving) return;

    if (!canMutate || !canonicalRole) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki izin mutasi data.');
      return;
    }

    const codeTrimmed = formData.code.trim().toUpperCase();
    const nameTrimmed = formData.name.trim();
    const locationTrimmed = formData.location.trim();
    const quantityNum = parseInt(formData.quantity, 10);

    if (!codeTrimmed) {
      setFormError('Kode Aset wajib diisi.');
      return;
    }

    if (!nameTrimmed) {
      setFormError('Nama Aset / Barang wajib diisi.');
      return;
    }

    if (isNaN(quantityNum) || quantityNum <= 0) {
      setFormError('Jumlah unit harus berupa angka positif (minimal 1).');
      return;
    }

    if (!locationTrimmed) {
      setFormError('Lokasi Ruangan / Area wajib diisi.');
      return;
    }

    // Duplicate Check for Asset Code
    const isCodeDuplicate = inventoryList.some(
      item =>
        item.code.toUpperCase() === codeTrimmed &&
        (!editingItem || item.id !== editingItem.id)
    );

    if (isCodeDuplicate) {
      setFormError(`Kode Aset "${codeTrimmed}" sudah digunakan oleh barang lain. Silakan gunakan kode unik.`);
      return;
    }

    setIsSaving(true);
    try {
      const itemToSave: InventoryItem = {
        id: editingItem ? editingItem.id : `inv-${Date.now()}`,
        code: codeTrimmed,
        name: nameTrimmed,
        category: formData.category,
        quantity: quantityNum,
        condition: formData.condition,
        location: locationTrimmed
      };

      await DataService.saveInventory(itemToSave);

      // Canonical Audit Trail (Executed only after successful mutation)
      const actorName = userProfile?.nama || userProfile?.name || currentUser?.displayName || currentUser?.email || 'Petugas Sarpras';
      const actionDesc = editingItem
        ? `Memperbarui data aset sarpras: ${nameTrimmed} (${codeTrimmed})`
        : `Menambahkan aset baru ke inventaris sarpras: ${nameTrimmed} (${codeTrimmed})`;

      await DataService.logAction(
        actorName,
        canonicalRole,
        actionDesc,
        'R18_INVENTARIS_SARPRAS'
      );

      showFeedback(
        'success',
        editingItem
          ? `Aset "${nameTrimmed}" berhasil diperbarui.`
          : `Aset "${nameTrimmed}" berhasil ditambahkan ke inventaris.`
      );

      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error('Error saving inventory:', err);
      setFormError('Terjadi kesalahan saat menyimpan data ke server.');
      showFeedback('error', 'Gagal menyimpan data aset.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for Category Icon & Color
  const getCategoryBadge = (category: InventoryItem['category']) => {
    switch (category) {
      case 'APE Luar':
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'APE Luar (Outdoor)'
        };
      case 'APE Dalam':
        return {
          icon: <Boxes className="w-3.5 h-3.5" />,
          color: 'bg-teal-100 text-teal-800 border-teal-200',
          label: 'APE Dalam (Indoor)'
        };
      case 'Elektronik':
        return {
          icon: <Tv className="w-3.5 h-3.5" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Elektronik'
        };
      case 'Mebel':
        return {
          icon: <Building2 className="w-3.5 h-3.5" />,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Mebel / Furnitur'
        };
      case 'Buku':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Buku Pembelajaran'
        };
      default:
        return {
          icon: <Package className="w-3.5 h-3.5" />,
          color: 'bg-stone-100 text-stone-800 border-stone-200',
          label: category
        };
    }
  };

  // Helper for Condition Badge
  const getConditionBadge = (condition: InventoryItem['condition']) => {
    switch (condition) {
      case 'Baik':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Rusak Ringan':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Rusak Berat':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border border-stone-200';
    }
  };

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="r18-inventaris-sarpras-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Print-Only Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          TK ISLAM TERPADU ASY-SYIFA TANGGUL
        </h1>
        <p className="text-xs text-slate-600">
          BUKU INDUK INVENTARISASI SARANA, PRASARANA & ALAT PERMAINAN EDUKATIF (APE)
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          id="inventory-feedback-banner"
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
            id="btn-close-feedback-inv"
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
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>MODUL R18 • SARANA & PRASARANA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventaris Sarpras & Alat Permainan Edukatif (APE)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Pengelolaan aset fasilitas sekolah, pemeliharaan sarana belajar, serta monitoring kelayakan dan keamanan APE Indoor maupun Outdoor demi keselamatan anak.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-refresh-inventory"
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Muat Ulang</span>
          </button>

          <button
            id="btn-print-inventory"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            title="Cetak Buku Induk Inventaris"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Rekap</span>
          </button>

          {canMutate && (
            <button
              id="btn-add-inventory"
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset</span>
            </button>
          )}
        </div>
      </div>

      {/* Smart Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Card 1: Total Aset & Unit */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Aset</p>
            <h3 className="text-2xl font-black text-slate-900">
              {stats.totalItems} <span className="text-sm font-semibold text-slate-500">Jenis</span>
            </h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Akumulasi {stats.totalUnits} Unit Barang
            </p>
          </div>
        </div>

        {/* Card 2: Kondisi Baik */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kondisi Baik</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.goodConditionCount}</h3>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">100% Siap & Aman Digunakan</p>
          </div>
        </div>

        {/* Card 3: Perlu Servis / Perbaikan */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Perlu Servis / Rusak</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.needsRepairCount}</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Memerlukan Pemeliharaan</p>
          </div>
        </div>

        {/* Card 4: Fasilitas APE TK */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fasilitas APE TK</p>
            <h3 className="text-lg font-black text-slate-900">
              {stats.apeOutdoorCount} Luar • {stats.apeIndoorCount} Dalam
            </h3>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">Sarana Belajar & Bermain</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="input-search-inventory"
              type="text"
              placeholder="Cari kode, nama aset, lokasi..."
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
              <option value="Semua">Semua Kategori Aset</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <select
              id="select-filter-condition"
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
            >
              <option value="Semua">Semua Kondisi Fisik</option>
              {conditions.map(cond => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode & Active Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>
              Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> dari{' '}
              {inventoryList.length} jenis aset
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tampilan:</span>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                id="btn-view-cards"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu Visual
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabel Rinci
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Memuat data inventaris sarana & prasarana...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Data Aset</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tidak ditemukan data aset inventaris yang sesuai dengan filter atau kata kunci pencarian.
            </p>
          </div>
          {canMutate && (
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset Sekarang</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Visual Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map(item => {
            const catBadge = getCategoryBadge(item.category);
            const condClass = getConditionBadge(item.condition);

            return (
              <div
                key={item.id}
                id={`inv-card-${item.id}`}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Card Header: Code & Category */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      {item.code}
                    </span>

                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${catBadge.color}`}>
                      {catBadge.icon}
                      <span>{catBadge.label}</span>
                    </span>
                  </div>

                  {/* Asset Name */}
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h4>

                  {/* Location & Quantity Info */}
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between gap-2 text-slate-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Lokasi:</span>
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-[160px]">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-slate-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Jumlah Unit:</span>
                      </div>
                      <span className="font-extrabold text-slate-900">{item.quantity} Unit</span>
                    </div>
                  </div>

                  {/* Condition Badge */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-400 font-medium text-[11px]">Kondisi Fisik:</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${condClass}`}>
                      {item.condition}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    id={`btn-detail-${item.id}`}
                    onClick={() => setViewDetailItem(item)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>

                  {canMutate && (
                    <button
                      id={`btn-edit-${item.id}`}
                      onClick={() => handleOpenEditModal(item)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
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
        /* Detailed Table View */
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-slate-700 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Kode Aset</th>
                  <th className="p-3.5">Nama Barang / Aset</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Jumlah</th>
                  <th className="p-3.5">Kondisi</th>
                  <th className="p-3.5">Lokasi Ruang</th>
                  <th className="p-3.5 text-right rounded-r-xl print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredList.map(item => {
                  const condClass = getConditionBadge(item.condition);

                  return (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-emerald-800">
                        {item.code}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3.5 text-slate-700">{item.category}</td>
                      <td className="p-3.5 font-extrabold text-slate-900">{item.quantity} Unit</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${condClass}`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{item.location}</td>
                      <td className="p-3.5 text-right space-x-2 whitespace-nowrap print:hidden">
                        <button
                          onClick={() => setViewDetailItem(item)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                          title="Detail Aset"
                        >
                          Detail
                        </button>
                        {canMutate && (
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all"
                            title="Edit Aset"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form: Create / Edit Inventory Item */}
      {showModal && (
        <div
          id="modal-inventory-form-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-inventory-form-container"
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingItem ? 'Perbarui Data Aset Inventaris' : 'Tambah Aset Inventaris Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Masukkan rincian data sarana, APE, jumlah unit, dan kondisi fisik.
                  </p>
                </div>
              </div>
              <button
                id="btn-close-modal-inv"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Inside Modal */}
            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveInventory} className="space-y-4">
              {/* Row 1: Code & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kode Aset <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-input-code"
                    type="text"
                    placeholder="e.g. SAR-005 / APE-OUT-001"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Aset <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="form-select-category"
                    value={formData.category}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        category: e.target.value as InventoryItem['category']
                      })
                    }
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Asset Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Aset / Barang <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-input-name"
                  type="text"
                  placeholder="e.g. Ayunan Putar Lingkar Besi Anak"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                />
              </div>

              {/* Row 3: Quantity & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jumlah Unit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-input-quantity"
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kondisi Fisik <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="form-select-condition"
                    value={formData.condition}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        condition: e.target.value as InventoryItem['condition']
                      })
                    }
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium"
                  >
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lokasi Ruangan / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  id="form-input-location"
                  type="text"
                  placeholder="e.g. Taman Bermain Depan / Sentra Balok & STEAM"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  id="btn-cancel-inv-form"
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-inv-form"
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{isSaving ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Simpan Aset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Item */}
      {viewDetailItem && (
        <div
          id="modal-inventory-detail-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-inventory-detail-container"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 my-8"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Rincian Informasi Aset</h3>
                  <p className="text-xs text-slate-500">Kode Aset: {viewDetailItem.code}</p>
                </div>
              </div>
              <button
                onClick={() => setViewDetailItem(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-3">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Nama Aset</span>
                  <p className="text-sm font-extrabold text-slate-900">{viewDetailItem.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/60">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Kategori</span>
                    <p className="font-bold text-slate-800 mt-0.5">{viewDetailItem.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Jumlah Unit</span>
                    <p className="font-bold text-slate-800 mt-0.5">{viewDetailItem.quantity} Unit</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/60">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Kondisi Fisik</span>
                    <div className="mt-1">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${getConditionBadge(viewDetailItem.condition)}`}>
                        {viewDetailItem.condition}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Lokasi Ruang / Area</span>
                    <p className="font-bold text-slate-800 mt-0.5">{viewDetailItem.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              {canMutate && (
                <button
                  onClick={() => {
                    const item = viewDetailItem;
                    setViewDetailItem(null);
                    handleOpenEditModal(item);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Edit Aset Ini
                </button>
              )}
              <button
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
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
