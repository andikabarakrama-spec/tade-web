import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KnowledgeIndexItem, KnowledgeSummary, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import {
  Search,
  Sparkles,
  ShieldCheck,
  FileText,
  Archive,
  Database,
  Building2,
  Lock,
  ExternalLink,
  Plus,
  RefreshCw,
  Info,
  CheckCircle2,
  Tag,
  BookOpen,
  X,
  AlertCircle,
  Clock,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'GURU',
  'WALI_MURID',
  'KEUANGAN',
  'KETUA_YAYASAN',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY',
] as const;

export const R33AISearchKnowledge: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const searchInputId = useId();
  const indexTitleId = useId();
  const indexCatId = useId();
  const indexDescId = useId();
  const indexKeywordsId = useId();

  // Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates strictly to null.
  // CRITICAL: userProfile.role NEVER overrides activeRole, and no raw fallback exists.
  const verifiedActiveRole: UserRole | null = (
    currentUser?.uid &&
    activeRole &&
    CANONICAL_ROLES.includes(activeRole)
  ) ? activeRole : null;

  // Authentic Actor Name Resolution (No synthetic actor fallback)
  const actorDisplayName =
    currentUser?.displayName ||
    userProfile?.nama ||
    userProfile?.name ||
    currentUser?.email ||
    (currentUser?.uid ? `User (${currentUser.uid.slice(0, 8)})` : 'Pengguna SIM');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeIndexItem[]>([]);
  const [knowledgeSummary, setKnowledgeSummary] = useState<KnowledgeSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterSource, setFilterSource] = useState<string>('ALL');

  // Indexing Modal & State
  const [showIndexModal, setShowIndexModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('AKADEMIK');
  const [newKeywords, setNewKeywords] = useState('');
  const [indexing, setIndexing] = useState(false);

  // In-App Notification / Feedback Modal (Zero native alerts)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const [adminAnswer, setAdminAnswer] = useState<{
    answer: string;
    category: string;
    statusBadge: string;
    metrics?: Record<string, string | number>;
    actionableSteps: string[];
  } | null>(null);

  // Role permissions strictly gated by verifiedActiveRole
  const canIndexKnowledge = Boolean(
    verifiedActiveRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KETUA_YAYASAN'].includes(verifiedActiveRole)
  );
  const canAccessAdminAssistant = Boolean(
    verifiedActiveRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'GURU', 'KETUA_YAYASAN'].includes(verifiedActiveRole)
  );

  const handleSearchInternal = async (queryToRun?: string, isMountedRef?: { current: boolean }) => {
    // Hard pre-query authorization gate
    if (!currentUser?.uid || !verifiedActiveRole) {
      setSearchResults([]);
      setKnowledgeSummary(null);
      setAdminAnswer(null);
      setLoading(false);
      return;
    }

    const q = (queryToRun !== undefined ? queryToRun : searchQuery).trim();
    setLoading(true);
    setAdminAnswer(null);

    try {
      // Check if this is an Admin Governance question
      const adminKeywords = ['backup', 'arsip', 'belum diarsipkan', 'ppdb', 'verifikasi', 'pembayaran', 'pending', 'ganda', 'duplikat', 'konflik', 'qr', 'rusak', 'gagal'];
      const isAdminQuestion = adminKeywords.some(k => q.toLowerCase().includes(k)) && canAccessAdminAssistant;

      if (isAdminQuestion && canAccessAdminAssistant) {
        const ans = await DataService.answerAdminAssistantQuery(q);
        if (!isMountedRef || isMountedRef.current) {
          setAdminAnswer(ans);
        }
      } else {
        if (!isMountedRef || isMountedRef.current) {
          setAdminAnswer(null);
        }
      }

      const results = await DataService.searchKnowledge(
        q,
        verifiedActiveRole,
        currentUser.uid
      );
      if (isMountedRef && !isMountedRef.current) return;
      setSearchResults(results || []);

      const summary = await DataService.buildKnowledgeSummary(
        q || 'sekolah',
        verifiedActiveRole,
        currentUser.uid
      );
      if (isMountedRef && !isMountedRef.current) return;
      setKnowledgeSummary(summary);
    } catch (err: any) {
      if (isMountedRef && !isMountedRef.current) return;
      console.error('Search error', err);
      setNotification({
        type: 'error',
        title: 'Pencarian Terkendala',
        message: err?.message || 'Terjadi kesalahan saat memproses pencarian basis pengetahuan.'
      });
    } finally {
      if (!isMountedRef || isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleSearch = (queryToRun?: string) => {
    return handleSearchInternal(queryToRun);
  };

  useEffect(() => {
    const isCurrent = { current: true };

    // Pre-query authorization gate on mount
    if (!currentUser?.uid || !verifiedActiveRole) {
      setSearchResults([]);
      setKnowledgeSummary(null);
      setAdminAnswer(null);
      setLoading(false);
      return () => {
        isCurrent.current = false;
      };
    }

    // Initial auto search for general information (strictly authenticated)
    handleSearchInternal('sekolah', isCurrent);

    return () => {
      isCurrent.current = false;
    };
  }, [currentUser?.uid, verifiedActiveRole]);

  const handleAddIndexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (indexing) return;

    // Hard handler-level authorization guard
    if (!currentUser?.uid || !verifiedActiveRole || !canIndexKnowledge) {
      setNotification({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Otorisasi tidak valid: Hanya peran staf/manajemen yang memiliki izin mengindeks pengetahuan.'
      });
      return;
    }

    if (!newTitle.trim()) {
      setNotification({
        type: 'error',
        title: 'Judul Wajib Diisi',
        message: 'Silakan masukkan judul entitas pengetahuan yang akan diindeks.'
      });
      return;
    }

    setIndexing(true);
    try {
      const kwList = newKeywords.split(',').map(k => k.trim()).filter(Boolean);
      await DataService.indexKnowledge({
        title: newTitle.trim(),
        description: newDesc.trim(),
        category: newCategory,
        keywords: kwList,
        sourceType: 'digital_archives',
        module: 'AI Search & Knowledge Engine',
        ownerId: currentUser.uid,
        accessRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID']
      });

      // Authentic audit trail (No synthetic 'Petugas')
      await DataService.logAction(
        actorDisplayName,
        verifiedActiveRole,
        'INDEX_KNOWLEDGE_CREATED',
        `R33_KNOWLEDGE: Menambah indeks "${newTitle.trim()}" (${newCategory})`
      );

      setShowIndexModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewKeywords('');

      setNotification({
        type: 'success',
        title: 'Pengetahuan Berhasil Diindeks',
        message: `Entitas pengetahuan "${newTitle}" telah disimpan ke basis data terpusat dan siap dicari.`
      });

      handleSearch(searchQuery);
    } catch (err: any) {
      setNotification({
        type: 'error',
        title: 'Gagal Menambah Indeks',
        message: err?.message || 'Terjadi gangguan saat menyimpan indeks pengetahuan ke sistem.'
      });
    } finally {
      setIndexing(false);
    }
  };

  const filteredResults = searchResults.filter(r => {
    if (filterSource === 'ALL') return true;
    return r.sourceType === filterSource;
  });

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'digital_archives':
        return <Archive className="w-4 h-4 text-sky-600" />;
      case 'documents':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'school_profile':
        return <Building2 className="w-4 h-4 text-purple-600" />;
      default:
        return <Database className="w-4 h-4 text-stone-600" />;
    }
  };

  // Fail-Closed Access Boundary
  if (!currentUser?.uid || !verifiedActiveRole) {
    return (
      <div className="space-y-6" id="r33-access-denied-container">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center max-w-xl mx-auto my-12 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Akses Ditolak — Sesi Tidak Terverifikasi</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Modul R33 AI Search & Knowledge Engine membutuhkan sesi terautentikasi dengan otoritas peran kanonik yang sah. Identitas atau sesi Anda belum terdaftar pada sistem keamanan SIM.
          </p>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-600">
            Status: <strong className="text-rose-600">UNAUTHENTICATED / GUEST</strong>
          </div>
          <a
            href="/sim"
            id="btn-r33-back-sim"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Kembali ke Dashboard SIM
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="r33-ai-search-knowledge-container">
      {/* In-App Feedback Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : notification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />}
              <div>
                <h4 className="text-xs font-bold">{notification.title}</h4>
                <p className="text-xs opacity-90 mt-0.5">{notification.message}</p>
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner & Character Scene */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> TADE AI Search & Knowledge Engine
            </span>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> RBAC Terverifikasi ({verifiedActiveRole})
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pusat Pencarian & Pengetahuan Terpadu Sekolah
          </h1>
          <p className="text-stone-600 text-xs leading-relaxed">
            Single Source of Truth: Pencarian instan dan aman berbasis otorisasi peran pada Arsip Digital, Dokumen Resmi, Profil Institusi TK Asy Syifa, dan Indeks Pengetahuan.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:block">
            <AIAsyCharacterScene pageContext="dashboardAdmin" />
          </div>
          {canIndexKnowledge && (
            <button
              onClick={() => setShowIndexModal(true)}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
              id="btn-tambah-pengetahuan"
            >
              <Plus className="w-4 h-4" /> Tambah Pengetahuan Baru
            </button>
          )}
        </div>
      </div>

      {/* Main Search Input Box */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <label htmlFor={searchInputId} className="sr-only">Kata Kunci Pencarian</label>
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-stone-400" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Cari surat, laporan, profil sekolah, nama siswa, dokumen, atau kata kunci..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-bold text-xs rounded-2xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
            id="btn-jalankan-cari"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Cari Pengetahuan
          </button>
        </form>

        {/* Quick Admin Governance Queries */}
        {canAccessAdminAssistant && (
          <div className="flex items-center gap-2 pt-3 border-t border-stone-100 flex-wrap text-xs">
            <span className="text-purple-900 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Asisten AI Admin:
            </span>
            {[
              'Backup terakhir kapan',
              'Dokumen belum diarsipkan',
              'PPDB belum diverifikasi',
              'Pembayaran pending',
              'Ada data ganda'
            ].map(prompt => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setSearchQuery(prompt);
                  handleSearch(prompt);
                }}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-[11px] rounded-lg border border-purple-200 transition cursor-pointer"
              >
                {prompt}?
              </button>
            ))}
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
          <span className="text-stone-400 font-bold text-[11px] uppercase tracking-wider">Sumber Data:</span>
          {['ALL', 'digital_archives', 'documents', 'school_profile', 'knowledge_index'].map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setFilterSource(src)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterSource === src
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {src === 'ALL' ? 'Semua Sumber' : src.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Assistant Governance Card */}
      {adminAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border border-purple-200 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hasil Analisis Asisten Governance Admin</h3>
                <p className="text-[10px] text-stone-500 font-mono">TADE Realtime Query Engine</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              adminAnswer.statusBadge === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              {adminAnswer.statusBadge}
            </span>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed font-medium bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
            {adminAnswer.answer}
          </div>

          {adminAnswer.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(adminAnswer.metrics).map(([k, v]) => (
                <div key={k} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">{k}</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          )}

          {adminAnswer.actionableSteps && adminAnswer.actionableSteps.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Langkah Rekomendasi Admin:</p>
              <ul className="space-y-1.5">
                {adminAnswer.actionableSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-stone-700 flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* AI Context Summary Card */}
      {knowledgeSummary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md space-y-3 border border-purple-800/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <h3 className="text-sm font-bold tracking-wide">TADE Assistant Knowledge Summary</h3>
            </div>
            <span className="text-[10px] font-mono bg-purple-800/80 text-purple-200 px-2.5 py-1 rounded-full">
              Terverifikasi & Akurat
            </span>
          </div>

          <p className="text-xs text-purple-100 leading-relaxed font-medium">
            {knowledgeSummary.summaryText}
          </p>

          <div className="pt-2 border-t border-purple-800/60 flex items-center justify-between text-[11px] text-purple-300 flex-wrap gap-2">
            <span>Ditemukan <strong className="text-white">{knowledgeSummary.totalResults}</strong> entitas terverifikasi.</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Diakses secara aman oleh peranan: <strong className="text-emerald-300 uppercase">{verifiedActiveRole}</strong></span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Hasil Pencarian Knowledge Base ({filteredResults.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-stone-200 rounded-lg"></div>
                  <div className="h-4 w-16 bg-purple-100 rounded-lg"></div>
                </div>
                <div className="h-5 w-3/4 bg-stone-200 rounded-lg"></div>
                <div className="h-3 w-full bg-stone-100 rounded"></div>
                <div className="h-3 w-2/3 bg-stone-100 rounded"></div>
                <div className="pt-3 border-t border-stone-100 flex justify-between">
                  <div className="h-3 w-20 bg-stone-100 rounded"></div>
                  <div className="h-6 w-24 bg-stone-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-stone-500 space-y-3 border border-stone-200">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tidak Ada Hasil Ditemukan</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tidak ditemukan data yang sesuai dengan kata kunci "{searchQuery}" dan hak akses peran Anda ({verifiedActiveRole}). Silakan coba kata kunci lain seperti "profil", "guru", "jadwal", atau "surat".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-stone-100 text-stone-700 flex items-center gap-1.5">
                      {getSourceIcon(item.sourceType)}
                      {item.sourceType.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-3">{item.description}</p>

                  {item.keywords && item.keywords.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {item.keywords.map((kw, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" /> {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">Modul: <strong>{item.module}</strong></span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                    >
                      Buka Berkas <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indexing Modal (Internal TADE Modal) */}
      {showIndexModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200"
          >
            <form onSubmit={handleAddIndexSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-700" /> Index Entitas Pengetahuan Baru
                </h2>
                <button
                  type="button"
                  onClick={() => setShowIndexModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                  aria-label="Tutup formulir"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor={indexTitleId} className="block text-xs font-bold text-stone-700 mb-1">Judul Pengetahuan / Informasi</label>
                  <input
                    id={indexTitleId}
                    type="text"
                    required
                    placeholder="Misal: Prosedur Pengajuan Cuti Guru 2026..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor={indexCatId} className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    id={indexCatId}
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="AKADEMIK">AKADEMIK</option>
                    <option value="ADMINISTRASI">ADMINISTRASI</option>
                    <option value="KEUANGAN">KEUANGAN</option>
                    <option value="SURAT">SURAT</option>
                    <option value="PPDB">PPDB</option>
                    <option value="KEPEGAWAIAN">KEPEGAWAIAN</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={indexDescId} className="block text-xs font-bold text-stone-700 mb-1">Deskripsi / Rincian Pengetahuan</label>
                  <textarea
                    id={indexDescId}
                    rows={3}
                    required
                    placeholder="Deskripsi ringkas pengetahuan yang dapat dicari..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor={indexKeywordsId} className="block text-xs font-bold text-stone-700 mb-1">Kata Kunci (Dipisahkan Koma)</label>
                  <input
                    id={indexKeywordsId}
                    type="text"
                    placeholder="misal: cuti, guru, prosedur, izin..."
                    value={newKeywords}
                    onChange={e => setNewKeywords(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowIndexModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={indexing}
                  className="px-5 py-2 bg-purple-800 hover:bg-purple-900 disabled:bg-purple-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition flex items-center gap-2"
                >
                  {indexing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mengindeks...
                    </>
                  ) : (
                    'Simpan ke Knowledge Base'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
