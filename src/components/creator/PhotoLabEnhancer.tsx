import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Sun, 
  Contrast, 
  Eye, 
  Crop, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Award, 
  Star, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { 
  AsyAIPhotoLabEngine, 
  PhotoEnhanceParameters, 
  EnhancementStage, 
  PhotoAnalysisResult 
} from '../../core/creator/asyAIPhotoLabEngine';
import { 
  SmartCoverIntelligence, 
  CoverEvaluationScore 
} from '../../core/creator/smartCoverIntelligence';
import { AsyCentralIntelligenceCore } from '../../core/creator/asyCentralIntelligenceCore';

interface PhotoLabEnhancerProps {
  initialPhotoUrl?: string;
  onSendToStoryStudio?: (photoUrl: string) => void;
  onSendToDownloadCenter?: (photoUrl: string, title: string) => void;
}

export const PhotoLabEnhancer: React.FC<PhotoLabEnhancerProps> = ({
  initialPhotoUrl = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
  onSendToStoryStudio,
  onSendToDownloadCenter
}) => {
  const photoLabEngine = useMemo(() => AsyAIPhotoLabEngine.getInstance(), []);
  const smartCoverIntel = useMemo(() => SmartCoverIntelligence.getInstance(), []);
  const centralIntel = useMemo(() => AsyCentralIntelligenceCore.getInstance(), []);

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>(initialPhotoUrl);
  const [params, setParams] = useState<PhotoEnhanceParameters>(() => photoLabEngine.getDefaultParameters());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stages, setStages] = useState<EnhancementStage[]>([]);
  const [analysis, setAnalysis] = useState<PhotoAnalysisResult>(() => photoLabEngine.analyzePhoto());
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  // Candidate photos for Smart Cover evaluation
  const candidatePhotos = useMemo(() => [
    { id: 'c1', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80', caption: 'Pentas Kreasi Santri Utama' },
    { id: 'c2', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', caption: 'Tawa Ceria Santri & Bunda Guru' },
    { id: 'c3', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80', caption: 'Momen Berdoa Bersama' },
    { id: 'c4', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80', caption: 'Gerak Senam Irama Pagi' }
  ], []);

  const [coverScores, setCoverScores] = useState<CoverEvaluationScore[]>(() => 
    smartCoverIntel.evaluateCandidatePhotos(candidatePhotos)
  );

  const [selectedCoverId, setSelectedCoverId] = useState<string>(() => 
    coverScores[0]?.mediaId || 'c1'
  );

  const runPipeline = async () => {
    setIsProcessing(true);
    try {
      const result = await photoLabEngine.executeEnhancementPipeline(
        currentPhotoUrl,
        params,
        (updatedStages) => setStages(updatedStages)
      );
      setAnalysis(result.analysis);
      centralIntel.recordEvent('Photo Lab', 'SUCCESS', `Pipeline 8-tahap selesai dengan Quality Score: ${result.analysis.overallQualityScore}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPreset = (type: 'VIBRANT' | 'WARM' | 'NATURAL' | 'SHADOW_LIFT') => {
    switch (type) {
      case 'VIBRANT':
        setParams(p => ({ ...p, brightness: 12, contrast: 16, saturation: 18, sharpenAmount: 25 }));
        break;
      case 'WARM':
        setParams(p => ({ ...p, brightness: 10, contrast: 10, whiteBalance: 12, saturation: 12 }));
        break;
      case 'SHADOW_LIFT':
        setParams(p => ({ ...p, brightness: 14, shadowRecovery: 60, contrast: 10 }));
        break;
      case 'NATURAL':
      default:
        setParams(photoLabEngine.getDefaultParameters());
        break;
    }
  };

  const cssFilter = useMemo(() => {
    if (showOriginal) return 'none';
    return photoLabEngine.generateCssFilter(params);
  }, [photoLabEngine, params, showOriginal]);

  return (
    <div className="space-y-6" id="asy-photo-lab-enhancer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Asy AI Photo Lab Foundation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R813 &bull; R814
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pipeline Enhancement Non-Generatif
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memperbaiki pencahayaan, ketajaman, dan keseimbangan warna foto kegiatan santri secara deterministik tanpa mengubah isi atau wajah santri (Bukan AI generatif).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runPipeline}
              disabled={isProcessing}
              className="px-5 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold hover:from-teal-400 hover:to-emerald-500 transition shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Memproses 8 Tahap...' : 'Jalankan 8-Stage Enhancement'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive Preview Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-teal-400" />
                  Live Canvas Preview
                </span>
                <span className="text-xs text-slate-400">
                  {params.cropRatio === 'ORIGINAL' ? 'Rasio Asli' : `Rasio ${params.cropRatio}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    showOriginal ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Tahan: Lihat Foto Asli
                </button>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center group shadow-inner">
              <img
                src={currentPhotoUrl}
                alt="Enhancement Preview"
                style={{ filter: cssFilter }}
                className="w-full h-full object-cover transition-all duration-200"
                referrerPolicy="no-referrer"
              />

              {/* Badges on Top */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authentic & Non-Generative
                </span>
                {showOriginal && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                    Mode Asli (Unfiltered)
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 backdrop-blur-md text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Quality Score: {analysis.overallQualityScore}/100
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 mr-1">Preset Cepat:</span>
              <button
                onClick={() => handleApplyPreset('NATURAL')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
              >
                Natural Balanced
              </button>
              <button
                onClick={() => handleApplyPreset('VIBRANT')}
                className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-semibold transition cursor-pointer"
              >
                Vibrant Outdoor
              </button>
              <button
                onClick={() => handleApplyPreset('SHADOW_LIFT')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
              >
                Shadow Recovery (Ruang Kelas)
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Ukuran terkompresi: ~420 KB <span className="text-emerald-400 font-semibold">(Hemat 82% bandwidth)</span>
              </div>
              <div className="flex items-center gap-2">
                {onSendToStoryStudio && (
                  <button
                    onClick={() => onSendToStoryStudio(currentPhotoUrl)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Kirim ke Story Studio
                  </button>
                )}
                {onSendToDownloadCenter && (
                  <button
                    onClick={() => onSendToDownloadCenter(currentPhotoUrl, 'Foto_Kegiatan_Enhanced')}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Center
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 8-Stage Pipeline Telemetry Card */}
          {stages.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                Status 8-Stage Pipeline Execution
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {stages.map(st => (
                  <div key={st.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{st.name}</span>
                      <span className="text-[10px] text-slate-400">{st.description}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {st.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Parameter Controls & Smart Cover Intelligence (R814) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Parameter Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-teal-400" />
              Kontrol Parameter Enhancement
            </h3>

            {/* Brightness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Brightness (Eksposur)
                </span>
                <span className="font-bold text-teal-400">{params.brightness > 0 ? `+${params.brightness}` : params.brightness}%</span>
              </div>
              <input
                type="range"
                min="-30"
                max="40"
                value={params.brightness}
                onChange={(e) => setParams({ ...params, brightness: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-sky-400" />
                  Contrast (Kedalaman)
                </span>
                <span className="font-bold text-teal-400">{params.contrast > 0 ? `+${params.contrast}` : params.contrast}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                value={params.contrast}
                onChange={(e) => setParams({ ...params, contrast: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Warna Saturation</span>
                <span className="font-bold text-teal-400">{params.saturation > 0 ? `+${params.saturation}` : params.saturation}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={params.saturation}
                onChange={(e) => setParams({ ...params, saturation: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Shadow Recovery */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Shadow Recovery (Angkat Gelap)</span>
                <span className="font-bold text-teal-400">{params.shadowRecovery}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.shadowRecovery}
                onChange={(e) => setParams({ ...params, shadowRecovery: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Sharpen */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Sharpen Ringan (Ketajaman Tekstur)</span>
                <span className="font-bold text-teal-400">{params.sharpenAmount}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={params.sharpenAmount}
                onChange={(e) => setParams({ ...params, sharpenAmount: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Crop Aspect Ratio */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-teal-400" />
                Smart Crop Ratio
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {(['ORIGINAL', '1:1', '4:3', '16:9', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setParams({ ...params, cropRatio: ratio })}
                    className={`py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                      params.cropRatio === ratio
                        ? 'bg-teal-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {ratio === 'ORIGINAL' ? 'Asli' : ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* R814: Smart Cover Intelligence Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  R814 &bull; Smart Cover Intelligence
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">Pemilihan Cover Terbaik Otomatis</h3>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                4 Kriteria Skor
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Asy menilai foto berdasarkan Pencahayaan (25%), Komposisi (20%), Ketajaman (30%), dan Ekspresi Alami (25%). Admin/Guru tetap bebas memilih manual.
            </p>

            {/* Candidate Photo List */}
            <div className="space-y-2.5">
              {coverScores.map((c, idx) => {
                const isSelected = selectedCoverId === c.mediaId;
                return (
                  <div
                    key={c.mediaId}
                    onClick={() => {
                      setSelectedCoverId(c.mediaId);
                      setCurrentPhotoUrl(c.mediaUrl);
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <img
                        src={c.mediaUrl}
                        alt="Candidate"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {c.isRecommended && (
                        <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 p-0.5 rounded-md shadow-xs">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {c.caption || `Foto #${idx + 1}`}
                        </span>
                        <span className={`text-xs font-bold ${c.compositeScore >= 95 ? 'text-amber-400' : 'text-slate-300'}`}>
                          {c.compositeScore} Poin
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {c.recommendationReason}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-400">
                        <span>Tajam: {c.sharpnessScore}</span>
                        <span>Cahaya: {c.lightingScore}</span>
                        <span>Ekspresi: {c.naturalExpressionScore}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="text-amber-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
