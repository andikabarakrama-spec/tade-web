import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Sun, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  Camera, 
  Zap, 
  Check, 
  Layers,
  Wand2
} from 'lucide-react';

export const PhotoLabProPlus: React.FC = () => {
  const [brightness, setBrightness] = useState<number>(105);
  const [contrast, setContrast] = useState<number>(102);
  const [warmth, setWarmth] = useState<number>(104);
  const [shadowRecovery, setShadowRecovery] = useState<number>(15);
  const [sharpness, setSharpness] = useState<number>(20);
  const [denoise, setDenoise] = useState<number>(10);
  const [smartCropRatio, setSmartCropRatio] = useState<'4:5' | '1:1' | '16:9'>('4:5');
  
  const [isAutoEnhanced, setIsAutoEnhanced] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const samplePhoto = {
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    title: 'Santri Tersenyum Saat Belajar Mewarnai',
    blurDetection: { isBlurry: false, clarityScore: 96 },
    eyeDetection: { eyesOpen: true, blinkConfidence: 0.02 },
    recommendationScore: 98,
    isBestPick: true
  };

  const handleOneClickEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setBrightness(110);
      setContrast(105);
      setWarmth(106);
      setShadowRecovery(25);
      setSharpness(35);
      setDenoise(20);
      setIsAutoEnhanced(true);
      setIsProcessing(false);
    }, 400);
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setWarmth(100);
    setShadowRecovery(0);
    setSharpness(0);
    setDenoise(0);
    setIsAutoEnhanced(false);
  };

  return (
    <div className="space-y-6" id="photo-lab-pro-plus">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Laboratorium Foto Pro+ (Autentik & Aman Anak)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R833 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pipeline Restorasi Foto & Deteksi Blur/Kedip
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Tingkatkan pencahayaan, white balance, dan ketajaman foto kegiatan anak secara alami tanpa mengubah raut wajah santri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOneClickEnhance}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              {isProcessing ? 'Memproses Optik...' : '1-Klik Optimasi Cerdas'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Photo Canvas & Control Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Photo Preview Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Pratinjau Hasil Restorasi</span>
                {isAutoEnhanced && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-slate-950">
                    AI PRO+ ENHANCED
                  </span>
                )}
              </div>

              {/* Quality Badges */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Mata Terbuka ({Math.round((1 - samplePhoto.eyeDetection.blinkConfidence) * 100)}%)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Tajam ({samplePhoto.blurDetection.clarityScore}%)
                </span>
              </div>
            </div>

            {/* Photo Canvas Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center min-h-[340px] max-h-[440px] border border-slate-800">
              <img
                src={samplePhoto.url}
                alt="Sample Enhancement"
                className="w-full h-full object-cover transition-all duration-300"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${warmth > 100 ? (warmth - 100) * 0.5 : 0}%)`
                }}
                referrerPolicy="no-referrer"
              />

              {/* Best Pick Overlay Badge */}
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Rekomendasi Terbaik (Skor {samplePhoto.recommendationScore}/100)
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Pencahayaan +{brightness - 100}% &bull; Shadow +{shadowRecovery}% &bull; Denoise +{denoise}%
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="Reset Pengaturan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert('Foto kualitas tinggi siap diekspor ke Galeri Sekolah!')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Simpan Hasil Pro+
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Calibration Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              Kontrol Kalibrasi Optik
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>Pencahayaan (Exposure)</span>
                  <span className="font-mono text-rose-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>Kontras</span>
                  <span className="font-mono text-rose-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="130"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Warmth */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>White Balance & Kehangatan</span>
                  <span className="font-mono text-rose-400">{warmth}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="120"
                  value={warmth}
                  onChange={(e) => setWarmth(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Shadow Recovery */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>Pemulihan Bayangan (Shadow Recovery)</span>
                  <span className="font-mono text-rose-400">+{shadowRecovery}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={shadowRecovery}
                  onChange={(e) => setShadowRecovery(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Denoise */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>Peredam Bintik (Denoise)</span>
                  <span className="font-mono text-rose-400">+{denoise}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={denoise}
                  onChange={(e) => setDenoise(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Smart Aspect Ratio Crop */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">Rasio Crop Pintar:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '4:5', label: '4:5 (Feed IG)' },
                  { id: '1:1', label: '1:1 (Persegi)' },
                  { id: '16:9', label: '16:9 (Layar)' }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSmartCropRatio(r.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      smartCropRatio === r.id
                        ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
