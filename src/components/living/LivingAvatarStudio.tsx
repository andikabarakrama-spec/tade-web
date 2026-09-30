import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw,
  ShieldCheck,
  Crown,
  Layers,
  Zap,
  Image as ImageIcon,
  Smile,
  FileCheck,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  livingAvatarService,
  AvatarPhotoMode,
  MicroAnimationType,
  LivingAvatarConfig
} from '../../services/livingAvatarService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const LivingAvatarStudio: React.FC = () => {
  const [photoMode, setPhotoMode] = useState<AvatarPhotoMode>('ANIMASI');
  const [selectedAnimation, setSelectedAnimation] = useState<MicroAnimationType>('BREATHING');
  const [intensity, setIntensity] = useState<number>(0.8);
  const [isFounderMode, setIsFounderMode] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'
  );
  const [config, setConfig] = useState<LivingAvatarConfig>(() =>
    livingAvatarService.processDualPhotoMode(avatarUrl, 'ANIMASI', false)
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const presets = livingAvatarService.getAnimationPresets();

  const handleApplyConfig = (mode: AvatarPhotoMode, anim: MicroAnimationType, founder: boolean) => {
    const updated = livingAvatarService.processDualPhotoMode(avatarUrl, mode, founder);
    updated.activeAnimation = anim;
    updated.animationIntensity = intensity;
    setConfig(updated);

    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'Living Avatar Studio',
      `Dual Photo Mode updated -> Mode: ${mode}, Animasi: ${anim}, Founder Presence: ${founder}`
    );

    setFeedback(`Konfigurasi Avatar tersimpan: Mode ${mode} (${anim})`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const getAnimationClass = () => {
    if (config.mode === 'DOKUMENTASI') return '';
    if (isFounderMode) return 'ring-4 ring-amber-400 shadow-emerald-500/50 shadow-2xl animate-pulse';
    switch (selectedAnimation) {
      case 'BREATHING':
        return 'scale-100 hover:scale-105 transition-transform duration-1000';
      case 'BLINK':
        return 'opacity-100 hover:opacity-90 transition-opacity duration-300';
      case 'SOFT_SMILE':
        return 'brightness-105 transition duration-500';
      case 'HEAD_TURN':
        return 'hover:rotate-2 transition-transform duration-500';
      case 'FLOATING_IDLE':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              DUAL PHOTO MODE PIPELINE
            </span>
            <span className="text-xs text-stone-500">Living Avatar Foundation (P2)</span>
          </div>
          <h2 className="text-xl font-black text-stone-900">
            Living Avatar & Foto Profil Studio
          </h2>
          <p className="text-xs text-stone-500">
            Pilihan ganda saat unggah foto: Arsip Resmi Dokumentasi (Auto-crop & Kompresi) atau Runtime Mikro-Animasi Santun.
          </p>
        </div>

        <button
          onClick={() => handleApplyConfig(photoMode, selectedAnimation, isFounderMode)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Simpan Konfigurasi Avatar</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Avatar Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-950 via-emerald-950 to-stone-900 rounded-3xl border border-stone-800 text-white space-y-4 text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Mode Pill Indicator */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              photoMode === 'DOKUMENTASI'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-emerald-400 text-slate-950'
            }`}>
              {photoMode === 'DOKUMENTASI' ? 'Foto Dokumentasi (Resmi)' : 'Foto Animasi (Living Runtime)'}
            </span>
            {isFounderMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                Founder Presence
              </span>
            )}
          </div>

          {/* Avatar Container */}
          <div className="relative group p-3">
            <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-stone-700 bg-stone-900 shadow-2xl transition-all duration-500 ${getAnimationClass()}`}>
              <img
                src={avatarUrl}
                alt="Living Avatar Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Watermark in documentation mode */}
              {photoMode === 'DOKUMENTASI' && (
                <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-300 border border-emerald-500/30 pointer-events-none">
                  TK ASY SYIFA
                </div>
              )}
            </div>

            {/* Decorative Corner Stars */}
            <div className="absolute -top-1 -right-1 text-amber-400 animate-spin-slow">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Compression & Telemetry stats */}
          <div className="w-full bg-slate-900/80 p-3 rounded-2xl border border-stone-800 text-xs text-stone-300 space-y-1 text-left">
            <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold uppercase">
              <span>Optimasi Smart Media:</span>
              <span className="text-emerald-400 font-bold">Hemat {config.compressionStats.savedPercentage}%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Ukuran Asli: {config.compressionStats.originalSizeKb} KB</span>
              <span className="font-mono text-emerald-300">Hasil: {config.compressionStats.compressedSizeKb} KB (WebP)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mode Controls & Presets */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Dual Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. Pilih Mode Foto Profil
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhotoMode('DOKUMENTASI');
                  handleApplyConfig('DOKUMENTASI', selectedAnimation, isFounderMode);
                }}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                  photoMode === 'DOKUMENTASI'
                    ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500/20 text-amber-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black">Foto Dokumentasi</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal">
                  Auto-crop rapi 1:1, penyesuaian posisi wajah, kompresi cerdas WebP, dan watermark resmi raport.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhotoMode('ANIMASI');
                  handleApplyConfig('ANIMASI', selectedAnimation, isFounderMode);
                }}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                  photoMode === 'ANIMASI'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black">Foto Animasi (Living)</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal">
                  Foto asli tetap utuh 100%, ditambah mikro-animasi napas, kedipan lembut, dan sudut pandang 3D santun.
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Micro-Animation Presets (Active in ANIMASI mode) */}
          {photoMode === 'ANIMASI' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  2. Pilih Gaya Mikro-Animasi (GPU-Friendly)
                </label>
                <span className="text-[10px] text-stone-500 font-mono">rAF Synchronized</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((preset) => {
                  const isSelected = selectedAnimation === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAnimation(preset.id);
                        if (preset.id === 'FOUNDER_PRESENCE') {
                          setIsFounderMode(true);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{preset.name}</span>
                        {preset.isExecutive && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 rounded">
                            EXECUTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Intensity Slider */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Intensitas Animasi:</span>
                  <span className="font-mono text-emerald-700 font-bold">{Math.round(intensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Step 3: Founder Presence Toggle */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Founder Presence Aura Mode</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Aura cincin zamrud dan partikel mikro emas eksklusif saat login akun Founder (Andika).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFounderMode(!isFounderMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isFounderMode
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {isFounderMode ? 'AKTIF' : 'NON-AKTIF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
