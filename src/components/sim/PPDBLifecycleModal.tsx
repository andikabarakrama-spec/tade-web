import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  Eye,
  ShieldCheck,
  Save,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole, PPDBLifecycleConfig, DEFAULT_PPDB_LIFECYCLE_CONFIG } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updatedConfig: PPDBLifecycleConfig) => void;
}

export const PPDBLifecycleModal: React.FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [config, setConfig] = useState<PPDBLifecycleConfig>(DEFAULT_PPDB_LIFECYCLE_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const rawRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const canonicalRole: UserRole | null =
    rawRole && CANONICAL_ROLES.includes(rawRole) ? rawRole : null;

  const canManagePPDB = Boolean(
    currentUser?.uid &&
    canonicalRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole)
  );

  const isAuthorized = canManagePPDB;

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    DataService.getPPDBLifecycleConfig()
      .then((cfg) => {
        if (isMounted) {
          setConfig(cfg);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load PPDB Lifecycle config:', err);
          setErrorMessage('Gagal memuat konfigurasi PPDB. Menggunakan pengaturan default.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    if (!canManagePPDB || !canonicalRole) {
      setErrorMessage('Akses Ditolak: Anda tidak memiliki wewenang untuk menyimpan pengaturan siklus PPDB.');
      return;
    }

    const activeUserUid = currentUser?.uid;
    const activeUserName = userProfile?.nama || userProfile?.name || currentUser?.displayName || currentUser?.email;

    if (!activeUserUid || !activeUserName) {
      setErrorMessage('Autentikasi Diperlukan: Identitas pengguna terautentikasi tidak valid.');
      return;
    }

    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await DataService.updatePPDBLifecycleConfig(
        config,
        canonicalRole,
        activeUserName,
        activeUserUid
      );

      setSuccessMessage('Konfigurasi siklus PPDB berhasil disimpan.');
      if (onSaved) {
        onSaved(updated);
      }
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to save PPDB config:', err);
      setErrorMessage(`Terjadi kesalahan saat menyimpan pengaturan PPDB: ${err?.message || 'Gagal menyimpan'}. Silakan coba lagi.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border-2 border-emerald-200 shadow-2xl w-full max-w-2xl overflow-hidden my-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ppdb-lifecycle-modal-title"
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-850 text-white flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/60 text-emerald-100 text-[10px] font-black uppercase tracking-wider">
                    Kontrol Operasional Admin
                  </span>
                  <span className="text-[11px] text-emerald-200 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Mandiri & Terotorisasi
                  </span>
                </div>
                <h2 id="ppdb-lifecycle-modal-title" className="text-lg sm:text-xl font-black">
                  Pengaturan Siklus & Visibilitas PPDB
                </h2>
                <p className="text-xs text-emerald-100/90">
                  Atur kapan PPDB aktif, periode pendaftaran, kuota calon siswa, dan visibilitas menu di SIM.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
                aria-label="Tutup Pengaturan PPDB"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {loading ? (
              <div className="p-12 text-center text-stone-500 space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-800">Memuat konfigurasi PPDB...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Alert Notifications */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">{successMessage}</span>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-bold">{errorMessage}</span>
                  </motion.div>
                )}

                {/* 1. Main Status Toggle Card */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                  config.isActive
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${config.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                      <h3 className="font-black text-sm text-slate-900">
                        Status PPDB: {config.isActive ? 'AKTIF (DIBUKA)' : 'NONAKTIF (DITUTUP)'}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-600">
                      {config.isActive
                        ? 'Pendaftaran calon siswa dapat diproses dan tombol aksi pendaftaran ditampilkan secara teratur.'
                        : 'Pendaftaran ditutup. Tidak ada popup atau CTA pendaftaran yang mengganggu di sistem.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isAuthorized}
                    onClick={() => setConfig(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`p-2 rounded-2xl transition flex items-center gap-1.5 font-extrabold text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                      config.isActive
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {config.isActive ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-emerald-200" />
                        <span>Buka PPDB</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-stone-500" />
                        <span>Tutup PPDB</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Academic Period & Waves */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Periode & Gelombang Pendaftaran</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Tahun Ajaran
                      </label>
                      <input
                        type="text"
                        value={config.academicYear}
                        onChange={(e) => setConfig(prev => ({ ...prev, academicYear: e.target.value }))}
                        placeholder="Contoh: 2026/2027"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Gelombang Aktif
                      </label>
                      <select
                        value={config.currentWave}
                        onChange={(e) => setConfig(prev => ({ ...prev, currentWave: e.target.value as any }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Gelombang 1">Gelombang 1</option>
                        <option value="Gelombang 2">Gelombang 2</option>
                        <option value="Gelombang 3">Gelombang 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Tanggal Mulai Pendaftaran
                      </label>
                      <input
                        type="date"
                        value={config.startDate}
                        onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Tanggal Penutupan Pendaftaran
                      </label>
                      <input
                        type="date"
                        value={config.endDate}
                        onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Target Quota & Integrity Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>Target Kuota Calon Siswa</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={300}
                        value={config.targetQuota}
                        onChange={(e) => setConfig(prev => ({ ...prev, targetQuota: Number(e.target.value) || 60 }))}
                        className="w-24 px-3 py-2 rounded-xl border border-stone-300 text-slate-900 font-black text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <span className="text-xs font-bold text-stone-500">Calon Siswa</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Total kapasitas kelompok bermain & TK untuk tahun ajaran terkait.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Integritas Single Registration</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                      Sistem mengunci <strong>1 Calon Siswa = 1 Pendaftaran PPDB</strong>. Pendaftaran berulang dengan NIK atau identitas siswa yang sama akan dialihkan ke berkas existing untuk mencegah duplikasi data.
                    </p>
                  </div>
                </div>

                {/* 4. Visibility Toggles in SIM */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                    <Eye className="w-4 h-4 text-emerald-700" />
                    <span>Kontrol Visibilitas & Navigasi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Menu SIM */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Sidebar SIM</div>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Tampilkan Verifikasi PPDB (R13) di bilah SIM.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, showMenuInSIM: !prev.showMenuInSIM }))}
                        className={`mt-1 py-1 px-2.5 rounded-xl font-bold text-[11px] flex items-center justify-between cursor-pointer transition ${
                          config.showMenuInSIM ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <span>{config.showMenuInSIM ? 'Tampil' : 'Sembunyi'}</span>
                        {config.showMenuInSIM ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Banner SIM */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Banner Dashboard</div>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Tampilkan kartu progres di halaman utama SIM.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, showBannerInSIM: !prev.showBannerInSIM }))}
                        className={`mt-1 py-1 px-2.5 rounded-xl font-bold text-[11px] flex items-center justify-between cursor-pointer transition ${
                          config.showBannerInSIM ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <span>{config.showBannerInSIM ? 'Tampil' : 'Sembunyi'}</span>
                        {config.showBannerInSIM ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Website Publik */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Navigasi Website</div>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Tampilkan menu PPDB di header website publik.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, showInPublicNav: prev.showInPublicNav === false ? true : false }))}
                        className={`mt-1 py-1 px-2.5 rounded-xl font-bold text-[11px] flex items-center justify-between cursor-pointer transition ${
                          config.showInPublicNav !== false ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <span>{config.showInPublicNav !== false ? 'Tampil' : 'Sembunyi'}</span>
                        {config.showInPublicNav !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Popup SIM */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Popup Dialog SIM</div>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Pop-up pengingat PPDB di SIM.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, showPopupInSIM: !prev.showPopupInSIM }))}
                        className={`mt-1 py-1 px-2.5 rounded-xl font-bold text-[11px] flex items-center justify-between cursor-pointer transition ${
                          config.showPopupInSIM ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <span>{config.showPopupInSIM ? 'Aktif' : 'Nonaktif'}</span>
                        {config.showPopupInSIM ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Panitia Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Catatan Pengumuman Panitia PPDB
                  </label>
                  <textarea
                    rows={2}
                    value={config.notes}
                    onChange={(e) => setConfig(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Catatan pendaftaran, informasi seragam, atau jadwal observasi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Metadata info */}
                <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    Pembaruan terakhir: {config.lastUpdated ? new Date(config.lastUpdated).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                  </span>
                  <span>Oleh: {config.updatedBy} ({config.updatedByRole})</span>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition cursor-pointer min-h-[44px]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !isAuthorized}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer disabled:cursor-not-allowed min-h-[44px]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan PPDB'}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
