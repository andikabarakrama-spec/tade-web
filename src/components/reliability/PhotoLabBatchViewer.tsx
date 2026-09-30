import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  RotateCw, 
  Image as ImageIcon, 
  Eye, 
  ShieldCheck, 
  Trash2,
  Layers,
  FileArchive
} from 'lucide-react';

export interface BatchPhotoItem {
  id: string;
  name: string;
  url: string;
  originalSize: string;
  enhanced: boolean;
  blurScore: number; // 0-100 (100 = tajam)
  eyeStatus: 'MATA_TERBUKA' | 'TERKEDIP_RINGAN';
  qualityScore: number;
  isSelected: boolean;
}

export const PhotoLabBatchViewer: React.FC = () => {
  const [photos, setPhotos] = useState<BatchPhotoItem[]>([
    {
      id: 'IMG-001',
      name: 'Santri_Sentra_Iqro_01.jpg',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
      originalSize: '2.4 MB',
      enhanced: false,
      blurScore: 95,
      eyeStatus: 'MATA_TERBUKA',
      qualityScore: 96,
      isSelected: true
    },
    {
      id: 'IMG-002',
      name: 'Senam_Pagi_Lapangan_02.jpg',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
      originalSize: '3.1 MB',
      enhanced: false,
      blurScore: 92,
      eyeStatus: 'MATA_TERBUKA',
      qualityScore: 94,
      isSelected: true
    },
    {
      id: 'IMG-003',
      name: 'Mewarnai_Kaligrafi_03.jpg',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=80',
      originalSize: '1.9 MB',
      enhanced: false,
      blurScore: 88,
      eyeStatus: 'MATA_TERBUKA',
      qualityScore: 90,
      isSelected: true
    },
    {
      id: 'IMG-004',
      name: 'Praktek_Sholat_Dhuha_04.jpg',
      url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&auto=format&fit=crop&q=80',
      originalSize: '2.8 MB',
      enhanced: false,
      blurScore: 98,
      eyeStatus: 'MATA_TERBUKA',
      qualityScore: 99,
      isSelected: true
    }
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [preset, setPreset] = useState<'NATURAL' | 'VIBRANT' | 'DOCUMENTARY'>('NATURAL');

  const handleToggleSelect = (id: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, isSelected: !p.isSelected } : p));
  };

  const handleBatchEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPhotos(photos.map(p => p.isSelected ? { ...p, enhanced: true, qualityScore: 99 } : p));
      setIsProcessing(false);
    }, 800);
  };

  const selectedCount = photos.filter(p => p.isSelected).length;

  return (
    <div className="space-y-6" id="photo-lab-batch-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                R846 &bull; Photo Lab Batch
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                BATCH RESTORATION
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Restorasi & Peningkatan Foto Massal
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memproses hingga 20 foto kegiatan sekolah secara serempak. Menyeimbangkan eksposur, shadow recovery, dan deteksi mata berkedip dalam 1 klik.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchEnhance}
              disabled={isProcessing || selectedCount === 0}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Memproses Batch...' : `Tingkatkan ${selectedCount} Foto`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            onClick={() => handleToggleSelect(p.id)}
            className={`bg-slate-900 border rounded-3xl p-3 text-white space-y-3 shadow-xl transition cursor-pointer relative overflow-hidden ${
              p.isSelected
                ? 'border-rose-500/60 ring-2 ring-rose-500/20'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={p.url}
                alt={p.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                {p.originalSize}
              </div>
              {p.enhanced && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-slate-950 shadow-md">
                  ENHANCED
                </div>
              )}
            </div>

            <div className="space-y-1 px-1">
              <div className="text-xs font-bold text-white truncate">{p.name}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Ketajaman: <strong className="text-emerald-400">{p.blurScore}/100</strong></span>
                <span className="text-slate-300 font-semibold">{p.eyeStatus.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
