import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SchoolProfile, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import {
  Save,
  Sparkles,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
  Building,
  Loader2
} from 'lucide-react';
import { useLivingGarden, ThemePreset } from '../../context/LivingGardenContext';
import { GlobalVisualAuditEngine } from './GlobalVisualAuditEngine';
import { AIWebsiteGuide } from './AIWebsiteGuide';
import { WebsiteHealthCenter } from './WebsiteHealthCenter';
import { AIAsyCharacterCMS } from './AIAsyCharacterCMS';

export const R23PengaturanWebsite: React.FC = () => {
  const { user, userProfile, activeRole } = useAuth();
  const actorName = userProfile?.nama || userProfile?.name || user?.displayName || 'Admin CMS';

  // Fail-closed canonical role resolution (No privileged default)
  const canonicalRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const canManage =
    !!canonicalRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole);

  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const { settings, updateGardenSettings, setThemePreset } = useLivingGarden();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await DataService.getSchoolProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Error loading school profile in R23:', err);
      setFeedback({
        type: 'error',
        message: `Gagal memuat profil sekolah: ${err?.message || 'Terjadi gangguan jaringan Firestore.'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !canManage || !canonicalRole) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah identitas resmi sekolah.'
        });
      }
      return;
    }

    if (!profile) {
      setFeedback({
        type: 'error',
        message: 'Data profil sekolah belum siap disimpan.'
      });
      return;
    }

    // Basic Payload Validation
    if (!profile.name || profile.name.trim().length < 3) {
      setFeedback({
        type: 'error',
        message: 'Nama sekolah resmi wajib diisi minimal 3 karakter.'
      });
      return;
    }

    if (!profile.address || profile.address.trim().length < 5) {
      setFeedback({
        type: 'error',
        message: 'Alamat lengkap sekolah wajib diisi minimal 5 karakter.'
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      await DataService.updateSchoolProfile(profile);

      // Audit Chain of Custody
      try {
        await DataService.logAction(
          actorName,
          canonicalRole,
          'R23_SCHOOL_PROFILE_UPDATE',
          `Pembaruan identitas resmi sekolah: ${profile.name} (Akreditasi: ${profile.akreditasi || '-'})`
        );
      } catch (auditErr) {
        console.warn('[Audit Log Warning]:', auditErr);
      }

      setFeedback({
        type: 'success',
        message: 'Identitas resmi sekolah & pengaturan website berhasil disimpan ke Firestore!'
      });
    } catch (err: any) {
      console.error('Error updating school profile in R23:', err);
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan profil sekolah: ${err?.message || 'Terjadi kesalahan sistem.'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SIMSkeletonLoader type="dashboard" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Data Profil Sekolah Tidak Ditemukan</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Sistem belum dapat memuat profil sekolah dari Firestore. Silakan muat ulang halaman.
        </p>
        <button
          type="button"
          onClick={loadProfile}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Coba Muat Ulang
        </button>
      </div>
    );
  }

  const themePresets: { id: ThemePreset; name: string; desc: string; colors: string }[] = [
    { id: 'garden-ceria', name: '🌿 Garden Ceria (Default)', desc: 'Emerald, Mint, Yellow & Soft Sky', colors: 'from-emerald-500 via-teal-400 to-amber-300' },
    { id: 'emerald', name: '🕌 Emerald Islami', desc: 'Hijau Islami Deep Emerald & Gold Accent', colors: 'from-emerald-800 via-emerald-600 to-amber-400' },
    { id: 'pastel', name: '🌸 Pastel Ceria', desc: 'Lavender, Peach, Baby Pink & Mint', colors: 'from-pink-300 via-purple-300 to-sky-300' },
    { id: 'ramadhan', name: '🌙 Ramadhan Suci', desc: 'Deep Night Blue, Gold Crescent & Emerald', colors: 'from-slate-900 via-emerald-900 to-amber-400' },
    { id: 'hari-guru', name: '🍎 Hari Guru', desc: 'Warm Amber, Cream & Gentle Olive', colors: 'from-amber-600 via-orange-500 to-yellow-300' },
    { id: 'agustus', name: '🇮🇩 17 Agustus Kemerdekaan', desc: 'Merah Putih Semarak Ceria PAUD', colors: 'from-red-600 via-rose-500 to-slate-100' },
    { id: 'ppdb', name: '🎒 PPDB Semangat Baru', desc: 'Sky Blue, Soft Coral & Bright Sun', colors: 'from-sky-500 via-teal-400 to-yellow-400' },
    { id: 'minimal', name: '✨ Minimal Clean', desc: 'Warm White, Slate & Gentle Emerald', colors: 'from-stone-100 via-stone-200 to-emerald-600' },
    { id: 'night', name: '🌌 Night Garden Suasana Malam', desc: 'Starry Sky, Fireflies & Lunar Glow', colors: 'from-slate-950 via-slate-900 to-indigo-950' },
  ];

  const decorationItems = [
    { key: 'sunEnabled', label: '☀️ Matahari Tersenyum', desc: 'Ikon matahari hangat di sudut kanan atas' },
    { key: 'cloudsEnabled', label: '☁️ Awan Awan Melayang', desc: 'Partikel awan lembut yang bergerak' },
    { key: 'birdsEnabled', label: '🐦 Burung-burung Terbang', desc: 'Burung pipit cilik beterbangan di langit' },
    { key: 'butterfliesEnabled', label: '🦋 Kupu-kupu Menari', desc: 'Kupu-kupu warna-warni di area taman' },
    { key: 'beesEnabled', label: '🐝 Lebah Madu Cilik', desc: 'Lebah dengung kecil di sekitar bunga' },
    { key: 'busEnabled', label: '🚌 Bus Sekolah Ceria', desc: 'Bus kuning sekolah di jalan setapak' },
    { key: 'lanternsEnabled', label: '🏮 Lampion Taman Islami', desc: 'Lampion hangat penerang malam' },
    { key: 'firefliesEnabled', label: '✨ Kunang-kunang Malam', desc: 'Lampu kunang-kunang kelip-kelip' },
    { key: 'starsEnabled', label: '⭐ Bintang Gemerlap', desc: 'Langit malam penuh bintang gemerlap' },
    { key: 'moonEnabled', label: '🌙 Bulan Sabit Glowing', desc: 'Cahaya bulan sabit lembut di malam hari' },
    { key: 'rainEnabled', label: '🌧️ Hujan Rintik Ceria', desc: 'Efek hujan gerimis yang menenangkan' },
    { key: 'snowEnabled', label: '❄️ Salju Musim Dingin (Nonaktif default)', desc: 'Efek kristal salju putih' },
    { key: 'rainbowEnabled', label: '🌈 Pelangi Warna-warni', desc: 'Busur pelangi indah setelah hujan/pagi' },
    { key: 'bubblesEnabled', label: '🫧 Gelembung Sabun', desc: 'Gelembung transparan melayang di layar' },
    { key: 'flowersEnabled', label: '🌸 Bunga Taman Mekar', desc: 'Bunga-bunga mekar di pinggir rumput' },
    { key: 'grassEnabled', label: '🌱 Rumput Taman Hijau', desc: 'Hamparan rumput lembut di batas section' },
    { key: 'mascotEnabled', label: '👧 Dek Syifa (Maskot)', desc: 'Panduan floating maskot pemberi salam' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Building className="w-3.5 h-3.5" /> Pengaturan Identitas & Website
              </span>
              <span className="text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                TK ASY SYIFA TANGGUL
              </span>
              <span className="text-xs font-semibold text-stone-400">
                Operator: <strong className="text-stone-200">{actorName}</strong> ({canonicalRole || 'GUEST'})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pengaturan Identitas & Control Center Website
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Kelola Color Theme Presets, Decoration Toggles, AI Website Guide & Health Quality Center resmi TK ASY SYIFA TANGGUL.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={loadProfile}
              disabled={loading || isSaving}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-2xl border border-stone-700 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* In-App Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : feedback.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
              {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />}
              {feedback.type === 'info' && <Info className="w-4 h-4 text-blue-700 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Website Health Center */}
      <WebsiteHealthCenter />

      {/* AI Asy Living Mascot CMS Management Center */}
      <AIAsyCharacterCMS />

      {/* AI Website Guide & Content Generator */}
      <AIWebsiteGuide />

      {/* Global Visual Audit Engine */}
      <GlobalVisualAuditEngine />

      {/* COLOR THEME MANAGER */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Palette className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Color Theme Manager (Preset Suasana Website)</h3>
            <p className="text-stone-500 text-xs">Pilih tema warna resmi untuk mengubah nuansa website TK Asy Syifa dalam 1-klik.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themePresets.map(preset => {
            const isSelected = settings.activeThemePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setThemePreset(preset.id)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`h-3 w-full rounded-full bg-gradient-to-r ${preset.colors} mb-2.5`} />
                <h4 className="font-extrabold text-xs text-slate-900">{preset.name}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">{preset.desc}</p>
                {isSelected && (
                  <span className="absolute top-2 right-2 text-[10px] bg-emerald-800 text-white font-bold px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DECORATION CMS TOGGLE MANAGER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-emerald-700/50 pb-3">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <div>
            <h2 className="text-lg font-bold">Decoration CMS (Kontrol Seluruh Elemen Hiasan Taman)</h2>
            <p className="text-emerald-200 text-xs">
              Satu-per-satu elemen hiasan dapat diaktifkan atau dinonaktifkan sesuai kebutuhan sekolah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
          {decorationItems.map(item => {
            const isChecked = (settings as any)[item.key] ?? true;
            return (
              <label key={item.key} className="flex items-start gap-3 p-3 bg-white/10 rounded-2xl cursor-pointer hover:bg-white/20 transition">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => updateGardenSettings({ [item.key]: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <div>
                  <span className="font-bold block text-white">{item.label}</span>
                  <span className="text-[10px] text-emerald-200">{item.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SCHOOL PROFILE FORM */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-base font-extrabold text-slate-900">Identitas Resmi Sekolah</h3>
          <span className="text-[11px] font-semibold text-stone-500">TK ASY SYIFA TANGGUL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Nama Resmi Sekolah <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="Contoh: TK ASY SYIFA TANGGUL"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Akreditasi</label>
            <input
              type="text"
              value={profile.akreditasi || ''}
              onChange={e => setProfile({ ...profile, akreditasi: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="Contoh: A (Unggul)"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-800">Visi Utama Sekolah</label>
          <textarea
            rows={2}
            value={profile.vision || ''}
            onChange={e => setProfile({ ...profile, vision: e.target.value })}
            className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            placeholder="Visi institusi..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Telepon / WhatsApp</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-800">Email Resmi</label>
            <input
              type="email"
              value={profile.email || ''}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="admin@tkasysyifa.sch.id"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-800">Alamat Lengkap <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={profile.address || ''}
            onChange={e => setProfile({ ...profile, address: e.target.value })}
            className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            placeholder="Alamat lengkap sekolah..."
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan ke Firestore...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Perubahan Identitas
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

