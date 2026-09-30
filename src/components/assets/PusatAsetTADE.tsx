import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  FolderOpen,
  Image as ImageIcon,
  Award,
  Radio,
  FileText,
  Palette,
  ShieldCheck,
  Crown,
  Filter,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Zap,
  TrendingUp,
  Clock,
  Printer,
  Download,
  Eye,
  SlidersHorizontal,
  Video,
  Grid,
  List,
  Compass,
  Cpu,
  Trash2
} from 'lucide-react';
import {
  TadeAssetCategory,
  TadeAssetItem,
  tadeAssetCenterService
} from '../../services/tadeAssetCenterService';
import { useAuth } from '../../context/AuthContext';
import { PosterEditorModal } from './PosterEditorModal';
import { CertificateEditorModal } from './CertificateEditorModal';
import { KotakMainanAsyShelf } from './KotakMainanAsyShelf';
import { SoundscapeBar } from './SoundscapeBar';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const PusatAsetTADE: React.FC<Props> = ({ onSelectModule }) => {
  const { userProfile, activeRole } = useAuth();
  const [assets, setAssets] = useState<TadeAssetItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<TadeAssetCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelf, setSelectedShelf] = useState<string>('ALL');

  // Modals
  const [editingPoster, setEditingPoster] = useState<TadeAssetItem | null>(null);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [editingCert, setEditingCert] = useState<TadeAssetItem | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Quick Action notification toast
  const [actionToast, setActionToast] = useState<string | null>(null);

  const isFounderOrAdmin = activeRole === 'SUPER_ADMIN' || activeRole === 'KETUA_YAYASAN' || activeRole === 'ADMIN';

  useEffect(() => {
    const unsub = tadeAssetCenterService.subscribe(list => {
      setAssets(list);
    });
    return () => unsub();
  }, []);

  const stats = tadeAssetCenterService.getAssetStats();

  const categories: { id: TadeAssetCategory | 'ALL'; label: string; icon: any; count: number }[] = [
    { id: 'ALL', label: 'Semua Rak Aset', icon: FolderOpen, count: stats.total },
    { id: 'POSTER', label: 'Tempat Poster', icon: Palette, count: stats.posters },
    { id: 'SERTIFIKAT', label: 'Tempat Sertifikat', icon: Award, count: stats.certs },
    { id: 'ANIMASI', label: 'Kotak Mainan Asy', icon: Sparkles, count: stats.animations },
    { id: 'IKON', label: 'Tempat Ikon', icon: Grid, count: assets.filter(a => a.category === 'IKON').length },
    { id: 'MOTIF_ISLAMI', label: 'Motif Islami', icon: Compass, count: assets.filter(a => a.category === 'MOTIF_ISLAMI').length },
    { id: 'SUARA', label: 'Tempat Suara', icon: Radio, count: stats.sounds },
    { id: 'FOTO', label: 'Galeri Foto', icon: ImageIcon, count: assets.filter(a => a.category === 'FOTO').length },
    { id: 'VIDEO', label: 'Video Resmi', icon: Video, count: assets.filter(a => a.category === 'VIDEO').length },
    { id: 'FITUR_TAMBAHAN', label: 'Fitur Tambahan', icon: Cpu, count: assets.filter(a => a.category === 'FITUR_TAMBAHAN').length }
  ];

  const filteredAssets = tadeAssetCenterService.searchAssets(searchQuery, activeCategory, selectedShelf);

  const handleFounderApproval = (assetId: string) => {
    const nextStatus = tadeAssetCenterService.approveAssetByFounder(
      assetId,
      userProfile?.displayName || 'Founder Andika'
    );
    showToast(nextStatus ? 'Aset resmi disahkan oleh Founder!' : 'Pengesahan aset dicabut.');
  };

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  const handleOpenAssetEditor = (asset: TadeAssetItem) => {
    if (asset.category === 'POSTER') {
      setEditingPoster(asset);
      setShowPosterModal(true);
    } else if (asset.category === 'SERTIFIKAT') {
      setEditingCert(asset);
      setShowCertModal(true);
    } else {
      showToast(`Membuka detail aset: ${asset.title}`);
    }
  };

  const handleCreateNew = (category: TadeAssetCategory) => {
    if (category === 'POSTER') {
      setEditingPoster(null);
      setShowPosterModal(true);
    } else if (category === 'SERTIFIKAT') {
      setEditingCert(null);
      setShowCertModal(true);
    } else {
      showToast(`Pilih template yang ada untuk menggandakan.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{actionToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              TADE SPRINT G13 • PUSAT ASET TUNGGAL
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Pusat Aset TK Islam Asy Syifa
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              "TADE adalah rumah digital TK Asy Syifa. Semua kebutuhan sekolah harus bisa ditemukan di satu tempat."
              Template poster siap pakai, ijazah resmi, kotak mainan animasi 60 FPS, ikon murni, dan soundscape alami.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-center p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-lg font-black text-emerald-400">{stats.total + stats.animations}</div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Total Aset</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-lg font-black text-amber-400">{stats.officialCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Resmi Sah</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 col-span-2 sm:col-span-1">
              <div className="text-lg font-black text-teal-300 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100%
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Bebas Watermark</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pencarian cepat: ketik kata kunci (contoh: PPDB, Wisuda, Burung, Ramadhan, Balok, Kelinci)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-md"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => handleCreateNew('POSTER')}
              className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Buat Poster
            </button>
            <button
              onClick={() => handleCreateNew('SERTIFIKAT')}
              className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-colors"
            >
              <Award className="w-4 h-4" />
              Buat Sertifikat
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs (Rak Penyimpanan) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedShelf('ALL');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic View Rendering according to Category */}
      {activeCategory === 'ANIMASI' ? (
        /* P4: Kotak Mainan Asy (7 Shelves) */
        <KotakMainanAsyShelf />
      ) : activeCategory === 'SUARA' ? (
        /* P6: Tempat Suara Alami (Web Audio) */
        <SoundscapeBar />
      ) : (
        /* Standard Asset Shelves Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              Menampilkan {filteredAssets.length} Aset di Rak {activeCategory}
            </h3>
            <span className="text-xs text-slate-400">
              Semua aset tersertifikasi resmi bebas watermark luar
            </span>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Tidak ada aset yang cocok</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Coba gunakan kata kunci lain dalam pencarian atau pilih kategori lain pada tab rak di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAssets.map(asset => {
                return (
                  <div
                    key={asset.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg relative"
                  >
                    {/* Top Meta Bar */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                          {asset.shelf}
                        </span>
                        {asset.isOfficialApproved && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Resmi TADE
                          </span>
                        )}
                      </div>

                      {/* Visual Preview Box */}
                      <div
                        onClick={() => handleOpenAssetEditor(asset)}
                        className="w-full aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800/80 p-4 mb-4 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all overflow-hidden relative group/box"
                      >
                        {asset.previewType === 'SVG_VECTOR' && asset.svgData ? (
                          <div
                            className="w-20 h-20"
                            dangerouslySetInnerHTML={{ __html: asset.svgData }}
                          />
                        ) : asset.previewType === 'CANVAS_TEMPLATE' ? (
                          <div className="w-full h-full p-2 bg-gradient-to-br from-emerald-950 to-slate-900 rounded-lg border border-emerald-500/30 flex flex-col justify-between text-center text-white select-none">
                            <span className="text-[8px] uppercase tracking-widest text-amber-300 font-bold">
                              {asset.templateData?.badge || 'DOKUMEN RESMI'}
                            </span>
                            <div className="text-xs font-black line-clamp-2 px-1 text-slate-100">
                              {asset.templateData?.title || asset.title}
                            </div>
                            <span className="text-[8px] text-slate-400 truncate">
                              {asset.templateData?.subtitle || 'TK Islam Asy-Syifa'}
                            </span>
                          </div>
                        ) : asset.previewType === 'PHOTO_GALLERY' && asset.mediaUrl ? (
                          <img
                            src={asset.mediaUrl}
                            alt={asset.title}
                            className="w-full h-full object-cover rounded-lg group-hover/box:scale-105 transition-transform duration-300"
                          />
                        ) : asset.previewType === 'VIDEO_STREAM' ? (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                            <Video className="w-10 h-10 text-teal-400" />
                            <span className="text-[10px]">Video Sinematik 1080p</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                            <Cpu className="w-8 h-8 text-amber-400" />
                            <span className="text-[10px]">Alat Operasional</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/box:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                            <Eye className="w-3.5 h-3.5" />
                            Buka / Edit
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {asset.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {asset.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions & Founder Approval */}
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>v{asset.version} • {asset.author.split(' ')[0]}</span>
                        <span>{asset.usageCount || 0}x Dipakai</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenAssetEditor(asset)}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Gunakan
                        </button>

                        {isFounderOrAdmin && (
                          <button
                            onClick={() => handleFounderApproval(asset.id)}
                            title={asset.isOfficialApproved ? 'Cabut Pengesahan Founder' : 'Sahkan sebagai Aset Resmi Yayasan'}
                            className={`p-2 rounded-xl border transition-colors ${
                              asset.isOfficialApproved
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-400'
                            }`}
                          >
                            <Crown className="w-4 h-4" />
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
      )}

      {/* Poster Customizer Modal */}
      {showPosterModal && (
        <PosterEditorModal
          asset={editingPoster}
          onClose={() => {
            setShowPosterModal(false);
            setEditingPoster(null);
          }}
          onSaved={saved => {
            showToast(`Poster "${saved.title}" tersimpan ke Pusat Aset!`);
          }}
        />
      )}

      {/* Certificate Customizer Modal */}
      {showCertModal && (
        <CertificateEditorModal
          asset={editingCert}
          onClose={() => {
            setShowCertModal(false);
            setEditingCert(null);
          }}
          onSaved={saved => {
            showToast(`Sertifikat "${saved.title}" tersimpan ke Pusat Aset!`);
          }}
        />
      )}
    </div>
  );
};
