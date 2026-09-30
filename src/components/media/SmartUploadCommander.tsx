import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FolderUp,
  Clipboard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  Filter,
  Eye,
  Trash2,
  Crown,
  Share2,
  CheckSquare,
  Square,
  FileCheck2,
  Lock,
  RefreshCw,
  Copy,
  AlertTriangle,
  Flame
} from 'lucide-react';
import {
  smartMediaPipeline,
  ProcessedMediaAsset,
  WatermarkMode
} from '../../services/smartMediaPipeline';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

interface UploadQueueItem {
  id: string;
  name: string;
  sizeBytes: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR' | 'DUPLICATE_DETECTED';
  progress: number;
  error?: string;
  file: File;
}

export const SmartUploadCommander: React.FC = () => {
  const [archive, setArchive] = useState<ProcessedMediaAsset[]>(
    smartMediaPipeline.getArchive()
  );
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState<'KEGIATAN' | 'SENTRA' | 'TAHFIDZ' | 'PPDB' | 'SARPRAS' | 'DOKUMEN'>('KEGIATAN');
  const [watermarkMode, setWatermarkMode] = useState<WatermarkMode>('PUBLIK');
  const [selectedAssetForWizard, setSelectedAssetForWizard] = useState<ProcessedMediaAsset | null>(null);
  const [selectedCoverId, setSelectedCoverId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isQueueProcessing, setIsQueueProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Global Clipboard paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            queueFile(blob, `Clipboard_Image_${Date.now()}.png`);
            setFeedback({
              type: 'info',
              text: 'Gambar dari Clipboard berhasil ditangkap dan dimasukkan ke antrean upload!'
            });
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [category, watermarkMode, archive.length]);

  const refreshArchive = () => {
    setArchive(smartMediaPipeline.getArchive());
  };

  const queueFile = (file: File, customName?: string) => {
    const originalName = customName || file.name;
    const isDup = smartMediaPipeline.checkDuplicate(file.size, originalName);

    const newItem: UploadQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: originalName,
      sizeBytes: file.size,
      status: isDup ? 'DUPLICATE_DETECTED' : 'PENDING',
      progress: 0,
      file
    };

    setUploadQueue(prev => [...prev, newItem]);
  };

  // Process Queue automatically
  useEffect(() => {
    const pendingItem = uploadQueue.find(q => q.status === 'PENDING');
    if (pendingItem && !isQueueProcessing) {
      processQueueItem(pendingItem);
    }
  }, [uploadQueue, isQueueProcessing]);

  const processQueueItem = async (item: UploadQueueItem) => {
    setIsQueueProcessing(true);

    // Update status to processing
    setUploadQueue(prev =>
      prev.map(q => q.id === item.id ? { ...q, status: 'PROCESSING', progress: 40 } : q)
    );

    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;

      const img = new Image();
      img.onload = async () => {
        const quality = smartMediaPipeline.analyzeImageQuality(img.width, img.height, item.file.size);
        const smartName = smartMediaPipeline.generateSmartName(category, archive.length + 1);

        // Apply watermark
        const watermarkedUrl = await smartMediaPipeline.applyWatermark(rawDataUrl, watermarkMode);

        const newAsset: ProcessedMediaAsset = {
          id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          originalName: item.name,
          smartName,
          category,
          mimeType: item.file.type || 'image/jpeg',
          sizeBytes: item.file.size,
          width: img.width,
          height: img.height,
          aspectRatio: quality.aspectRatio,
          sharpnessScore: quality.sharpnessScore,
          isBlurry: quality.isBlurry,
          isDuplicate: item.status === 'DUPLICATE_DETECTED',
          qualityBadge: quality.qualityBadge,
          optimizedDataUrl: watermarkedUrl,
          watermarkMode,
          targetDestinations: {
            galeri: true,
            berita: false,
            arsip: true,
            whatsApp: false,
            story: false
          },
          isPublished: false,
          uploadedAt: new Date().toISOString(),
          hash: `HASH-${Date.now().toString(36).toUpperCase()}`
        };

        smartMediaPipeline.saveAsset(newAsset);
        refreshArchive();

        // Update queue item to COMPLETED
        setUploadQueue(prev =>
          prev.map(q => q.id === item.id ? { ...q, status: 'COMPLETED', progress: 100 } : q)
        );

        founderCommandRecorder.recordCommand(
          'MEDIA_VALIDATION',
          'Smart Media Pipeline',
          `Foto diunggah dan distandarisasi: ${smartName} (${quality.qualityBadge})`
        );

        setIsQueueProcessing(false);
      };
      img.onerror = () => {
        setUploadQueue(prev =>
          prev.map(q => q.id === item.id ? { ...q, status: 'ERROR', progress: 0, error: 'Gagal memuat format gambar.' } : q)
        );
        setIsQueueProcessing(false);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(item.file);
  };

  const handleRetryItem = (item: UploadQueueItem) => {
    setUploadQueue(prev =>
      prev.map(q => q.id === item.id ? { ...q, status: 'PENDING', progress: 0 } : q)
    );
  };

  const handleForceUploadDuplicate = (item: UploadQueueItem) => {
    setUploadQueue(prev =>
      prev.map(q => q.id === item.id ? { ...q, status: 'PENDING', progress: 0 } : q)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        queueFile(files[i]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        queueFile(files[i]);
      }
    }
  };

  const handlePasteButtonClick = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            queueFile(blob as File, `Clipboard_Image_${Date.now()}.png`);
            setFeedback({ type: 'success', text: 'Gambar clipboard berhasil ditambahkan ke antrean upload.' });
            return;
          }
        }
      }
      setFeedback({ type: 'info', text: 'Tidak ada gambar ditemukan di clipboard. Gunakan Ctrl+V atau pilih file.' });
    } catch {
      setFeedback({ type: 'info', text: 'Tekan Ctrl+V langsung di halaman ini untuk menempelkan gambar.' });
    }
  };

  const handleToggleDestination = (key: keyof ProcessedMediaAsset['targetDestinations']) => {
    if (!selectedAssetForWizard) return;
    const updated = {
      ...selectedAssetForWizard,
      targetDestinations: {
        ...selectedAssetForWizard.targetDestinations,
        [key]: !selectedAssetForWizard.targetDestinations[key]
      }
    };
    setSelectedAssetForWizard(updated);
  };

  const handleConfirmPublish = () => {
    if (!selectedAssetForWizard) return;
    const updated = { ...selectedAssetForWizard, isPublished: true };
    smartMediaPipeline.saveAsset(updated);
    refreshArchive();

    founderCommandRecorder.recordCommand(
      'MEDIA_VALIDATION',
      'Smart Media Pipeline',
      `Publikasi Media dikonfirmasi: ${selectedAssetForWizard.smartName}`
    );

    setFeedback({
      type: 'success',
      text: `Publikasi media "${selectedAssetForWizard.smartName}" berhasil dipetakan ke target kanal.`
    });
    setSelectedAssetForWizard(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = (id: string) => {
    smartMediaPipeline.deleteAsset(id);
    refreshArchive();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              SMART UPLOAD COMMANDER & MEDIA PIPELINE v10
            </span>
            <span className="text-xs text-stone-300">
              Sprint G4 Autonomous Media Evolution
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Smart Media Commander (R94 / G4)
          </h2>
          <p className="text-xs text-teal-100/80 max-w-2xl">
            Pusat upload media berstandar kurikulum: Folder Drop, Clipboard Paste (<kbd className="bg-black/30 px-1 rounded">Ctrl+V</kbd>), Duplicate Intelligence, Smart Cover Picker, dan Upload Queue dengan retry otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePasteButtonClick}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Clipboard className="w-4 h-4" />
            Paste Clipboard (Ctrl+V)
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-blue-50 text-blue-900 border border-blue-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs">
        <div>
          <label className="font-bold text-stone-700 block mb-1">Kategori Arsip Kegiatan</label>
          <select
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold text-stone-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="KEGIATAN">Kegiatan Harian Sentra</option>
            <option value="SENTRA">Karya & Sentra Balok/Bahan Alam</option>
            <option value="TAHFIDZ">Tahfidz & Doa Harian</option>
            <option value="PPDB">Materi Brosur & PPDB</option>
            <option value="SARPRAS">Inventaris & Sarpras UKS</option>
            <option value="DOKUMEN">Dokumen Legal & Sertifikat</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-stone-700 block mb-1">Watermark Konstitusi</label>
          <select
            value={watermarkMode}
            onChange={(e: any) => setWatermarkMode(e.target.value as WatermarkMode)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold text-stone-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="PUBLIK">Publik: TK Islam Asy Syifa Tanggul</option>
            <option value="INTERNAL">Internal: Dokumen Internal Sekolah</option>
            <option value="RESMI_YAYASAN">Resmi: Yayasan Asy Syifa Tanggul</option>
            <option value="NONE">Tanpa Watermark (Original)</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-stone-700 block mb-1">Format Penamaan Otomatis</label>
          <div className="px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-[11px] text-emerald-800 font-bold truncate">
            {smartMediaPipeline.generateSmartName(category, archive.length + 1)}
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
            : 'border-stone-300 bg-stone-50 hover:bg-stone-100/60'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
          <Upload className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-black text-stone-900">
            Tarik & Lepas Foto atau Folder ke Sini
          </h4>
          <p className="text-xs text-stone-500 max-w-md">
            Mendukung multi-file, recursive folder drop, atau tekan <kbd className="px-1.5 py-0.5 rounded bg-stone-200 font-mono text-[10px]">Ctrl+V</kbd> untuk menempelkan foto dari clipboard secara instan.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            Pilih Foto
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <FolderUp className="w-4 h-4" />
            Pilih Satu Folder
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Upload Queue Tracker */}
      {uploadQueue.length > 0 && (
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-stone-800 flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${isQueueProcessing ? 'animate-spin text-emerald-600' : 'text-stone-400'}`} />
              Antrean Upload & Duplicate Intelligence ({uploadQueue.filter(q => q.status === 'COMPLETED').length}/{uploadQueue.length})
            </span>
            <button
              onClick={() => setUploadQueue([])}
              className="text-[11px] text-stone-500 hover:text-stone-800 font-bold"
            >
              Bersihkan Antrean
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 truncate">
                  <div className="font-bold text-stone-800 truncate">{item.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono">{(item.sizeBytes / 1024).toFixed(0)} KB</div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'DUPLICATE_DETECTED' && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Duplikat
                      </span>
                      <button
                        onClick={() => handleForceUploadDuplicate(item)}
                        className="px-2 py-1 bg-stone-800 hover:bg-stone-900 text-white text-[10px] font-bold rounded cursor-pointer"
                      >
                        Paksa Simpan
                      </button>
                    </div>
                  )}

                  {item.status === 'PROCESSING' && (
                    <div className="w-24 bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full animate-pulse" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}

                  {item.status === 'COMPLETED' && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selesai
                    </span>
                  )}

                  {item.status === 'ERROR' && (
                    <button
                      onClick={() => handleRetryItem(item)}
                      className="px-2 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Coba Lagi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Media Archive Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-500" />
            <h4 className="text-sm font-extrabold text-stone-900">
              Arsip Media Terstandarisasi ({archive.length} Asset)
            </h4>
          </div>
          <span className="text-xs text-stone-400">
            Kualitas Alami • Non-AI Generated
          </span>
        </div>

        {archive.length === 0 ? (
          <div className="p-10 border border-stone-200 rounded-2xl text-center text-xs text-stone-400">
            Belum ada media yang diunggah. Tarik foto atau tekan tombol upload di atas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {archive.map((asset) => {
              const isCover = selectedCoverId === asset.id;
              return (
                <div
                  key={asset.id}
                  className={`rounded-2xl border bg-stone-50 overflow-hidden space-y-2 transition flex flex-col justify-between ${
                    isCover ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="relative aspect-video bg-stone-200 overflow-hidden">
                    <img
                      src={asset.optimizedDataUrl}
                      alt={asset.smartName}
                      className="w-full h-full object-cover"
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-stone-950/80 text-white backdrop-blur-xs">
                        {asset.qualityBadge}
                      </span>
                      {asset.isBlurry && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white">
                          PERLU FOKUS
                        </span>
                      )}
                      {isCover && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-stone-950 flex items-center gap-1 shadow-sm">
                          <Crown className="w-2.5 h-2.5" />
                          COVER UTAMA
                        </span>
                      )}
                    </div>

                    {/* Cover Star Button */}
                    <button
                      onClick={() => {
                        setSelectedCoverId(isCover ? null : asset.id);
                        setFeedback({
                          type: 'success',
                          text: isCover ? 'Status cover album dilepas.' : `Foto "${asset.smartName}" dipilih sebagai Cover Utama Album Kegiatan.`
                        });
                        setTimeout(() => setFeedback(null), 3000);
                      }}
                      title={isCover ? 'Lepas status cover' : 'Jadikan Sampul Utama Album'}
                      className={`absolute top-2 right-2 p-1.5 rounded-xl transition cursor-pointer ${
                        isCover
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-950/60 text-white hover:bg-stone-950'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 space-y-1.5 text-xs">
                    <div className="font-mono font-bold text-stone-800 truncate" title={asset.smartName}>
                      {asset.smartName}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span>Rasio: {asset.aspectRatio}</span>
                      <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                    </div>

                    {/* Target Destinations Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {Object.entries(asset.targetDestinations).map(([key, val]) => (
                        val && (
                          <span key={key} className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[9px] uppercase">
                            {key}
                          </span>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="p-2 border-t border-stone-200/60 flex items-center justify-between gap-1">
                    <button
                      onClick={() => setSelectedAssetForWizard(asset)}
                      className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-emerald-600 hover:text-white text-stone-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <FileCheck2 className="w-3 h-3" />
                      Wizard
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Smart Upload Wizard Modal (Zero Auto-Publish) */}
      {selectedAssetForWizard && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <FileCheck2 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-stone-900">
                  Smart Upload Wizard — Target Penerbitan
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssetForWizard(null)}
                className="text-stone-400 hover:text-stone-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Asset Preview Mini Banner */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <img
                src={selectedAssetForWizard.optimizedDataUrl}
                alt="Preview"
                className="w-16 h-12 object-cover rounded-xl border border-stone-200"
              />
              <div className="space-y-0.5 overflow-hidden">
                <div className="font-mono font-bold text-stone-900 truncate">
                  {selectedAssetForWizard.smartName}
                </div>
                <div className="text-[11px] text-stone-500">
                  Kualitas: {selectedAssetForWizard.qualityBadge} • Watermark: {selectedAssetForWizard.watermarkMode}
                </div>
              </div>
            </div>

            {/* Mandatory Checklist */}
            <div className="space-y-2">
              <label className="font-extrabold text-stone-800 block">
                Pilih Target Kanal Penerbitan (Tidak Ada Auto-Publish):
              </label>
              <div className="space-y-2">
                {[
                  { key: 'galeri', label: 'Galeri Resmi Sekolah (W3 / R94)', desc: 'Ditampilkan di galeri publik website' },
                  { key: 'berita', label: 'Lampiran Berita & Informasi Sekolah', desc: 'Disematkan pada artikel pengumuman' },
                  { key: 'arsip', label: 'Arsip Digital Yayasan (R14 Smart Archive)', desc: 'Tersimpan permanen untuk akreditasi' },
                  { key: 'whatsApp', label: 'Siaran WhatsApp Broadcast Wali Murid', desc: 'Disiapkan untuk template siaran resmi' },
                  { key: 'story', label: 'Status / Story Ringkasan Harian', desc: 'Tayang 24 jam di beranda portal wali' }
                ].map((item) => {
                  const isChecked = selectedAssetForWizard.targetDestinations[item.key as keyof ProcessedMediaAsset['targetDestinations']];
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleToggleDestination(item.key as any)}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 text-left transition cursor-pointer bg-stone-50/50"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-stone-800">{item.label}</div>
                        <div className="text-[11px] text-stone-500">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Safety Warning */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Prinsip Kedaulatan:</strong> Media hanya akan tayang pada kanal yang telah Anda centang secara sadar.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedAssetForWizard(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Konfirmasi & Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
