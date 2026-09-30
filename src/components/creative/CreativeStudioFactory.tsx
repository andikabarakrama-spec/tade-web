import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  Crown,
  Sliders,
  Eye,
  RefreshCw,
  FolderDown,
  Copy,
  Star,
  ShieldCheck,
  BookmarkPlus,
  Trash2,
  FileCheck,
  ZoomIn,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Printer,
  FileStack,
  Check,
  Scissors
} from 'lucide-react';
import {
  creativeStudioEngine,
  CreativeTemplateType,
  CreativeTemplateConfig,
  DEFAULT_TEMPLATES,
  ProjectDraft,
  BatchExportResult
} from '../../services/creativeStudioEngine';
import { BrandValidationResult } from '../../services/brandDnaEngine';

export const CreativeStudioFactory: React.FC = () => {
  const [selectedType, setSelectedType] = useState<CreativeTemplateType>('POSTER_PPDB');
  const [config, setConfig] = useState<CreativeTemplateConfig>({
    ...DEFAULT_TEMPLATES.POSTER_PPDB,
    showSafeMargins: false,
    isFavorite: false
  });
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [savedPresets, setSavedPresets] = useState<CreativeTemplateConfig[]>([]);
  const [projectHistory, setProjectHistory] = useState<ProjectDraft[]>([]);
  const [activeTab, setActiveTab] = useState<'EDITOR' | 'HISTORY' | 'BATCH'>('EDITOR');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [brandReport, setBrandReport] = useState<BrandValidationResult | null>(null);
  const [showBrandDetails, setShowBrandDetails] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchExportResult[] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load presets & history on mount
  useEffect(() => {
    setSavedPresets(creativeStudioEngine.getSavedPresets());
    setProjectHistory(creativeStudioEngine.getProjectHistory());
  }, []);

  // Switch template type
  const handleSelectType = (type: CreativeTemplateType) => {
    setSelectedType(type);
    setConfig({
      ...DEFAULT_TEMPLATES[type],
      showSafeMargins: config.showSafeMargins,
      isFavorite: config.isFavorite
    });
  };

  // Re-render canvas and validate when config or userImage changes
  useEffect(() => {
    if (!canvasRef.current) return;
    creativeStudioEngine.renderToCanvas(canvasRef.current, config, userImage);
    const report = creativeStudioEngine.validateConfig(config);
    setBrandReport(report);
  }, [config, userImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        setFeedback('Foto santri/kegiatan berhasil disisipkan ke frame resmi.');
        setTimeout(() => setFeedback(null), 3000);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (format: 'PNG' | 'WEBP') => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const mime = format === 'WEBP' ? 'image/webp' : 'image/png';
    const ext = format === 'WEBP' ? 'webp' : 'png';
    link.download = `TK_ASY_SYIFA_${config.type}_${Date.now()}.${ext}`;
    link.href = canvasRef.current.toDataURL(mime, 0.95);
    link.click();
    setFeedback(`Materi grafis berhasil diunduh (${format} HD).`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveToHistory = () => {
    if (!canvasRef.current) return;
    const thumb = canvasRef.current.toDataURL('image/jpeg', 0.6);
    creativeStudioEngine.saveProjectDraft(config, thumb);
    setProjectHistory(creativeStudioEngine.getProjectHistory());
    setFeedback('Draf proyek berhasil disimpan ke Riwayat Proyek.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleLoadDraft = (draft: ProjectDraft) => {
    setConfig(draft.config);
    setSelectedType(draft.templateType);
    setActiveTab('EDITOR');
    setFeedback(`Draf "${draft.title}" berhasil dimuat.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    creativeStudioEngine.deleteProjectDraft(id);
    setProjectHistory(creativeStudioEngine.getProjectHistory());
    setFeedback('Draf dihapus.');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleRunBatchExport = () => {
    const results = creativeStudioEngine.generateBatchExport(config, userImage);
    setBatchResults(results);
    setActiveTab('BATCH');
    setFeedback('Batch export untuk 3 format (4:5, 16:9, 9:16) berhasil diproses.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportToArchive = () => {
    if (!canvasRef.current) return;
    creativeStudioEngine.exportToMediaArchive(canvasRef.current, config);
    setFeedback('Materi grafis berhasil diekspor ke Smart Media Archive & siap untuk broadcast WhatsApp!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAutoFixBrand = () => {
    setConfig(prev => ({
      ...prev,
      themeColor: '#064e3b',
      accentColor: '#f59e0b'
    }));
    setFeedback('Warna template disesuaikan otomatis dengan Palet Murni Brand DNA.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const templateTypes: { type: CreativeTemplateType; title: string; ratio: string; isFav: boolean }[] = [
    { type: 'POSTER_PPDB', title: 'Poster PPDB', ratio: '4:5', isFav: true },
    { type: 'BANNER_SENTRA', title: 'Banner Sentra Belajar', ratio: '16:9', isFav: true },
    { type: 'STORY_MOMENT_HARI_INI', title: 'Story Moment Hari Ini', ratio: '9:16', isFav: false },
    { type: 'PENGUMUMAN_WALI', title: 'Pengumuman Wali Santri', ratio: '4:5', isFav: false },
    { type: 'SERTIFIKAT_TAHFIDZ', title: 'Sertifikat Tahfidz Juz 30', ratio: '16:9', isFav: true },
    { type: 'KARTU_SPP_INFAQ', title: 'Kartu Infaq & SPP', ratio: '1:1', isFav: false }
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              CREATIVE STUDIO EVOLUTION (P6)
            </span>
            <span className="text-xs text-stone-300">
              Sprint G5 Self-Reliant Graphic Engine
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Creative Studio Factory
          </h3>
          <p className="text-xs text-teal-100/80 max-w-2xl">
            Produksi poster PPDB, banner sentra, syahadah tahfidz, dan kartu infaq mandiri dengan 100% Brand DNA Asy Syifa, validasi kepatuhan live, batch export, dan zona aman cetak.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-teal-500/30">
          <button
            onClick={() => setActiveTab('EDITOR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'EDITOR' ? 'bg-teal-500 text-slate-950' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'HISTORY' ? 'bg-teal-500 text-slate-950' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat Draf ({projectHistory.length})</span>
          </button>
          <button
            onClick={() => {
              if (!batchResults) handleRunBatchExport();
              else setActiveTab('BATCH');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'BATCH' ? 'bg-teal-500 text-slate-950' : 'text-stone-300 hover:text-white'
            }`}
          >
            <FileStack className="w-3.5 h-3.5" />
            <span>Batch Export</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TAB 1: PRIMARY EDITOR */}
      {activeTab === 'EDITOR' && (
        <div className="space-y-6">
          {/* Template Selection Chips & Favorites */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 uppercase tracking-wider">
                Pilih Template Grafis Resmi TK Islam Asy Syifa:
              </span>
              <span className="text-stone-500 text-[11px]">
                Rasio Terpilih: <strong>{config.aspectRatio}</strong> ({config.width}x{config.height}px)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {templateTypes.map((tpl) => {
                const isSelected = selectedType === tpl.type;
                return (
                  <button
                    key={tpl.type}
                    onClick={() => handleSelectType(tpl.type)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-stone-200 px-1.5 py-0.5 rounded text-stone-700">
                        {tpl.ratio}
                      </span>
                      {tpl.isFav && <Star className="w-3 h-3 text-amber-500 fill-amber-400" />}
                    </div>
                    <div className="text-xs font-bold text-stone-900 leading-tight">
                      {tpl.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Studio Grid: Controls & Canvas Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Config Form (5 cols) */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              {/* Brand DNA Live Compliance Card */}
              {brandReport && (
                <div className={`p-4 rounded-2xl border ${
                  brandReport.isCompliant
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Validasi Brand DNA: {brandReport.score}%</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white rounded-full border border-stone-200">
                      {brandReport.level}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {brandReport.summary}
                  </p>

                  {!brandReport.isCompliant && (
                    <button
                      onClick={handleAutoFixBrand}
                      className="mt-2 px-3 py-1 bg-emerald-700 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-800 transition cursor-pointer"
                    >
                      Terapkan Palet Warna Murni
                    </button>
                  )}
                </div>
              )}

              {/* Form Input Fields */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <div className="font-bold text-stone-800 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                  <span>Konten Teks Desain</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Sisipkan Foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Judul Utama</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Subjudul / Deskripsi</label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Label Badge</label>
                    <input
                      type="text"
                      value={config.badgeText}
                      onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Highlight Tanggal</label>
                    <input
                      type="text"
                      value={config.dateText}
                      onChange={(e) => setConfig({ ...config, dateText: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Highlight Teks Kotak</label>
                  <input
                    type="text"
                    value={config.highlightText}
                    onChange={(e) => setConfig({ ...config, highlightText: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Kontak / Keterangan Footer</label>
                  <input
                    type="text"
                    value={config.contactText}
                    onChange={(e) => setConfig({ ...config, contactText: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-stone-600 font-mono text-[11px]"
                  />
                </div>

                {/* Print Safe Zone Toggle (G5 Feature) */}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-700 font-bold">
                    <Scissors className="w-4 h-4 text-rose-500" />
                    <span>Tampilkan Garis Aman Cetak & Bleed</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showSafeMargins || false}
                    onChange={(e) => setConfig({ ...config, showSafeMargins: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSaveToHistory}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simpan ke Draf</span>
                </button>
                <button
                  onClick={handleRunBatchExport}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileStack className="w-3.5 h-3.5" />
                  <span>Batch Export (3 Format)</span>
                </button>
                <button
                  onClick={handleExportToArchive}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Simpan ke Smart Media Archive</span>
                </button>
              </div>
            </div>

            {/* Right Column: Canvas Live Preview (7 cols) */}
            <div className="lg:col-span-7 bg-stone-900 rounded-3xl p-5 flex flex-col items-center justify-center space-y-4 border border-stone-800">
              <div className="w-full flex items-center justify-between text-white text-xs border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Live Canvas Render Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload('PNG')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={() => handleDownload('WEBP')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-stone-200 font-bold rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>WebP</span>
                  </button>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="max-w-full overflow-hidden flex items-center justify-center p-2">
                <canvas
                  ref={canvasRef}
                  className="max-h-[520px] w-auto max-w-full rounded-2xl shadow-2xl border border-stone-700/80 bg-stone-950"
                />
              </div>

              <div className="w-full text-center text-[11px] text-stone-400 font-mono flex items-center justify-center gap-3">
                <span>Format: {config.aspectRatio}</span>
                <span>•</span>
                <span>100% Pure Brand Constitution Seal</span>
                <span>•</span>
                <span>Zero Third-Party Watermarks</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT HISTORY & DRAFTS */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-stone-900">
              Riwayat Proyek Grafis Mandiri ({projectHistory.length} Tersimpan)
            </h4>
            <button
              onClick={() => setActiveTab('EDITOR')}
              className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 cursor-pointer"
            >
              + Buat Proyek Baru
            </button>
          </div>

          {projectHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projectHistory.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => handleLoadDraft(draft)}
                  className="p-4 bg-stone-50 border border-stone-200 hover:border-emerald-500 rounded-2xl space-y-3 cursor-pointer transition group shadow-xs"
                >
                  <div className="relative rounded-xl overflow-hidden bg-stone-950 aspect-[4/3] flex items-center justify-center border border-stone-200">
                    <img
                      src={draft.thumbnailDataUrl}
                      alt={draft.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                    />
                    <button
                      onClick={(e) => handleDeleteDraft(draft.id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Hapus Draf"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-black text-stone-900 truncate">
                      {draft.title}
                    </div>
                    <div className="text-[10px] text-stone-500 flex items-center justify-between mt-0.5">
                      <span>{draft.templateType}</span>
                      <span>{draft.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-stone-50 rounded-3xl border border-stone-200 space-y-2">
              <Clock className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-600 font-semibold">
                Belum ada riwayat draf proyek grafis tersimpan.
              </p>
              <p className="text-[11px] text-stone-400">
                Klik tombol "Simpan ke Draf" di tab Editor untuk menyimpan proyek Anda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BATCH EXPORT SUITE */}
      {activeTab === 'BATCH' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-stone-900">
                Batch Export Output (3 Format Rasio Terpadu)
              </h4>
              <p className="text-xs text-stone-500">
                Satu kali desain, otomatis dikonversi ke Feed IG (4:5), Banner Web/TV Sentra (16:9), dan WhatsApp Story (9:16).
              </p>
            </div>
            <button
              onClick={() => setActiveTab('EDITOR')}
              className="px-3.5 py-1.5 bg-stone-800 text-white rounded-xl font-bold text-xs hover:bg-stone-900 cursor-pointer"
            >
              Kembali ke Editor
            </button>
          </div>

          {batchResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {batchResults.map((b) => (
                <div key={b.format} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{b.label}</span>
                    <span className="font-mono text-[10px] text-stone-500">{b.width}x{b.height}px</span>
                  </div>

                  <div className="rounded-xl overflow-hidden bg-stone-950 aspect-[4/3] flex items-center justify-center border border-stone-200">
                    <img src={b.dataUrl} alt={b.label} className="max-h-full max-w-full object-contain" />
                  </div>

                  <a
                    href={b.dataUrl}
                    download={`TK_ASY_SYIFA_${b.format}_${Date.now()}.jpg`}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Format Ini</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
