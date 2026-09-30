import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Printer,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Palette,
  ShieldCheck,
  Type,
  Phone,
  Calendar
} from 'lucide-react';
import { TadeAssetItem, tadeAssetCenterService } from '../../services/tadeAssetCenterService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  asset?: TadeAssetItem | null;
  onClose: () => void;
  onSaved?: (savedAsset: TadeAssetItem) => void;
}

export const PosterEditorModal: React.FC<Props> = ({ asset, onClose, onSaved }) => {
  const { userProfile } = useAuth();
  const [title, setTitle] = useState(asset?.templateData?.title || 'Penerimaan Peserta Didik Baru');
  const [subtitle, setSubtitle] = useState(asset?.templateData?.subtitle || 'Tahun Ajaran 2026/2027 • TK Islam Asy-Syifa Tanggul');
  const [badge, setBadge] = useState(asset?.templateData?.badge || 'KUOTA TERBATAS');
  const [highlight, setHighlight] = useState(asset?.templateData?.highlight || 'Kurikulum Sentra Islami & Tahfidz Quran Juz 30');
  const [dateText, setDateText] = useState(asset?.templateData?.dateText || 'Gelombang 1: 1 Januari - 31 Maret 2026');
  const [contact, setContact] = useState(asset?.templateData?.contact || 'Info Kantor Yayasan: 0812-3456-7890');
  const [theme, setTheme] = useState<'EMERALD_GOLD' | 'NAVY_GOLD' | 'ROYAL_PURPLE_GOLD' | 'RUBY_WHITE' | 'TEAL_EMERALD' | 'SLATE_GOLD'>(
    asset?.templateData?.theme || 'EMERALD_GOLD'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const posterRef = useRef<HTMLDivElement>(null);

  const getThemeStyles = () => {
    switch (theme) {
      case 'NAVY_GOLD':
        return {
          bg: 'from-slate-900 via-indigo-950 to-blue-950',
          accent: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
          borderAccent: 'border-amber-400/50'
        };
      case 'ROYAL_PURPLE_GOLD':
        return {
          bg: 'from-purple-950 via-indigo-950 to-purple-900',
          accent: 'text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
          borderAccent: 'border-amber-400/50'
        };
      case 'RUBY_WHITE':
        return {
          bg: 'from-rose-950 via-red-900 to-rose-900',
          accent: 'text-white',
          badgeBg: 'bg-white/20 text-white border-white/40',
          cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
          borderAccent: 'border-white/50'
        };
      case 'TEAL_EMERALD':
        return {
          bg: 'from-teal-950 via-emerald-950 to-teal-900',
          accent: 'text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
          borderAccent: 'border-emerald-400/50'
        };
      case 'SLATE_GOLD':
        return {
          bg: 'from-slate-950 via-slate-900 to-zinc-900',
          accent: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
          borderAccent: 'border-amber-400/50'
        };
      case 'EMERALD_GOLD':
      default:
        return {
          bg: 'from-emerald-950 via-teal-950 to-green-950',
          accent: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          cardBg: 'bg-white/10 backdrop-blur-md border-white/20',
          borderAccent: 'border-amber-400/50'
        };
    }
  };

  const themeStyle = getThemeStyles();

  const handleSaveToPusatAset = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const authorName = userProfile?.displayName || userProfile?.email || 'Ustadzah Guru';
      const authorRole = userProfile?.role || 'GURU';

      const result = tadeAssetCenterService.saveAsset({
        id: asset?.id,
        title: title ? `Poster: ${title}` : (asset?.title || 'Poster Resmi Sekolah'),
        category: 'POSTER',
        shelf: asset?.shelf || 'Poster Siap Pakai',
        description: `Desain poster sekolah bertema ${title} (${badge}). Diperbarui untuk kebutuhan operasional.`,
        tags: [asset?.shelf || 'Poster', 'Resmi TADE', 'Siap Pakai', badge],
        author: authorName,
        authorRole: authorRole,
        dimensions: { width: 1080, height: 1350, aspectRatio: '4:5' },
        fileSizeBytes: 240000,
        previewType: 'CANVAS_TEMPLATE',
        templateData: {
          theme,
          title,
          subtitle,
          badge,
          highlight,
          dateText,
          contact
        },
        forceApprove: userProfile?.role === 'SUPER_ADMIN' || userProfile?.role === 'KETUA_YAYASAN'
      });

      setSaveSuccess(true);
      setSaveMessage(`Tersimpan dengan sukses ke Pusat Aset (Versi ${result.asset.version})!`);
      if (onSaved) onSaved(result.asset);
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan poster.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    if (asset?.id) {
      tadeAssetCenterService.recordAssetUsage(asset.id, 'Cetak Poster');
    }
    window.print();
  };

  const handleDownload = () => {
    if (asset?.id) {
      tadeAssetCenterService.recordAssetUsage(asset.id, 'Unduh Poster HD');
    }
    alert('Poster siap diunduh dalam format High Resolution (1080x1350px) siap cetak tanpa watermark.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Studio Poster Siap Pakai
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Resmi TADE • Bebas Watermark
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ganti tulisan, pilih palet warna resmi, dan simpan langsung ke Pusat Aset tanpa perlu mendesain dari nol setiap tahun.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (2 Columns) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Palet Warna Resmi Sekolah
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EMERALD_GOLD', label: 'Zamrud Emas', color: 'bg-emerald-800' },
                  { id: 'NAVY_GOLD', label: 'Navy Emas', color: 'bg-indigo-900' },
                  { id: 'ROYAL_PURPLE_GOLD', label: 'Ungu Ramadhan', color: 'bg-purple-900' },
                  { id: 'RUBY_WHITE', label: 'Merah Putih', color: 'bg-rose-900' },
                  { id: 'TEAL_EMERALD', label: 'Teal Sentra', color: 'bg-teal-800' },
                  { id: 'SLATE_GOLD', label: 'Slate Eksekutif', color: 'bg-slate-800' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as any)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      theme === item.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color} border border-white/20`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Label Pita / Badge Atas</label>
                <input
                  type="text"
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: KUOTA TERBATAS"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Judul Utama Acara / Informasi</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  placeholder="Judul poster..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Sub-judul / Penjelasan Singkat</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Sub judul..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Sorotan Program & Fasilitas</label>
                <textarea
                  rows={3}
                  value={highlight}
                  onChange={e => setHighlight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Rincian keunggulan..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Waktu / Tanggal</label>
                  <input
                    type="text"
                    value={dateText}
                    onChange={e => setDateText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Kontak / Hotline</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div
              ref={posterRef}
              className={`w-full max-w-[360px] aspect-[4/5] rounded-2xl p-6 bg-gradient-to-br ${themeStyle.bg} border-2 ${themeStyle.borderAccent} shadow-2xl relative overflow-hidden flex flex-col justify-between text-white select-none`}
            >
              {/* Islamic Decorative Corners */}
              <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-400/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-400/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-400/40 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-400/40 rounded-br-xl pointer-events-none" />

              {/* Background Geometric Watermark Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-8 border-amber-400 rotate-45" />
              </div>

              {/* Top Header Section */}
              <div className="text-center relative z-10">
                <div className="inline-block mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${themeStyle.badgeBg}`}>
                    {badge}
                  </span>
                </div>
                <div className="text-[11px] font-medium tracking-wide text-slate-300">
                  YAYASAN ASY-SYIFATAN TANGGUL
                </div>
                <div className="text-xs font-bold text-amber-400 tracking-wider">
                  TK ISLAM ASY-SYIFA
                </div>
              </div>

              {/* Center Content Section */}
              <div className="text-center my-auto py-3 relative z-10">
                <h3 className="text-xl font-extrabold tracking-tight text-white leading-snug mb-1">
                  {title}
                </h3>
                <p className="text-xs text-slate-300 mb-3 px-2">
                  {subtitle}
                </p>

                <div className={`p-3 rounded-xl ${themeStyle.cardBg} border text-left my-2 space-y-1.5`}>
                  <div className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Keunggulan & Kurikulum
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {highlight}
                  </p>
                </div>
              </div>

              {/* Bottom Footer Section */}
              <div className="relative z-10 pt-2 border-t border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {dateText}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-amber-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {contact}
                  </span>
                  <span className="text-[8px] text-slate-400">
                    TADE V3 Official
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Desain Resmi Asy-Syifa • Sesuai Standar Cetak & Media Sosial
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-800/90 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Cetak Poster
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Unduh HD (1080p)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSaveToPusatAset}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan ke Pusat Aset
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
