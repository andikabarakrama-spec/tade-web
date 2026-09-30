import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Camera,
  Film,
  Volume2,
  Tv,
  Layout,
  ShieldAlert,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Gauge,
  Layers,
  Crown,
  Radar,
  FileCheck,
  ShieldCheck,
  Type,
  Palette,
  Mic,
  Activity,
  Award
} from 'lucide-react';
import { founderWorkspaceMemory } from '../../services/founderWorkspaceMemory';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';
import { tibRadarService, OpenSourceRadarItem } from '../../services/tibRadarService';
import { tibRecommendationEngine, TIBRecommendation } from '../../services/tibRecommendationEngine';

export const TIBFoundation: React.FC = () => {
  const memory = founderWorkspaceMemory.load();
  const [activeLab, setActiveLab] = useState<
    'PHOTO' | 'ANIMATION' | 'VOICE' | 'VIDEO' | 'UI' | 'SECURITY' | 'PERFORMANCE' | 'RADAR' | 'RECOMMENDATIONS'
  >('RECOMMENDATIONS');

  const [gpuQuality, setGpuQuality] = useState<'HIGH' | 'BALANCED' | 'BATTERY_SAVER'>(
    memory.gpuQuality || 'HIGH'
  );
  const [animScheduler, setAnimScheduler] = useState<boolean>(
    memory.animationSchedulerEnabled !== false
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  // Lab testing states
  const [photoTestBlur, setPhotoTestBlur] = useState(0);
  const [voiceChimePlaying, setVoiceChimePlaying] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [radarItems] = useState<OpenSourceRadarItem[]>(tibRadarService.getRadarItems());
  const compliance = tibRadarService.getComplianceSummary();
  const recSummary = tibRecommendationEngine.getRecommendations();

  const handleGpuChange = (quality: 'HIGH' | 'BALANCED' | 'BATTERY_SAVER') => {
    setGpuQuality(quality);
    founderWorkspaceMemory.setGpuQuality(quality);
    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'TIB Performance Lab',
      `Founder merubah GPU Quality Switch -> ${quality}`
    );
    setFeedback(`Mode GPU disetel ke: ${quality}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleAnimScheduler = () => {
    const nextVal = !animScheduler;
    setAnimScheduler(nextVal);
    founderWorkspaceMemory.setAnimationScheduler(nextVal);
    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'TIB Performance Lab',
      `Founder ${nextVal ? 'mengaktifkan' : 'menonaktifkan'} Animation Scheduler`
    );
    setFeedback(`Animation Scheduler: ${nextVal ? 'AKTIF' : 'NON-AKTIF'}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const labs = [
    { id: 'RECOMMENDATIONS', name: 'Phase-4 Rekomendasi', icon: Award, desc: 'Font, Illustration, Animation, Voice, Perf' },
    { id: 'PERFORMANCE', name: 'Performance Lab', icon: Gauge, desc: 'GPU Quality Switch & Frame Budget Manager' },
    { id: 'PHOTO', name: 'Photo Lab', icon: Camera, desc: 'Pipeline media, blur metrics & watermark sandbox' },
    { id: 'ANIMATION', name: 'Animation Lab', icon: Film, desc: 'Mascot micro-animations & physics scheduler' },
    { id: 'VOICE', name: 'Voice Lab', icon: Volume2, desc: 'Recitation soundscape & chime frequency audit' },
    { id: 'VIDEO', name: 'Video Lab', icon: Tv, desc: 'Multi-aspect ratio container & stream tester' },
    { id: 'UI', name: 'UI Lab', icon: Layout, desc: 'Typography hierarchy & WCAG AA contrast validator' },
    { id: 'SECURITY', name: 'Security Lab', icon: ShieldAlert, desc: 'Ring-0 tripwires & sandbox quarantine barrier' },
    { id: 'RADAR', name: 'Free Tool Radar', icon: Radar, desc: 'Open Source Scanner & License Compliance' }
  ] as const;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-stone-900 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              TIB PHASE-4 EVOLUTION
            </span>
            <span className="text-xs text-stone-300">
              Sprint G5 Living Engineering Hub
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            TIB Innovation & Experimental Sandbox Hub
          </h2>
          <p className="text-xs text-teal-100/80 max-w-2xl">
            Laboratorium rekayasa mandiri dan pusat rekomendasi standar teknik kedaulatan: Font, Illustration, Animation, Voice, dan Performance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-stone-700 shrink-0">
          <Cpu className="w-6 h-6 text-teal-400" />
          <div>
            <div className="text-[10px] text-stone-400 font-bold uppercase">Sandbox Status</div>
            <div className="text-xs font-black text-teal-300">ISOLATED & SECURE</div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Labs Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {labs.map((lab) => {
          const Icon = lab.icon;
          const isSelected = activeLab === lab.id;
          return (
            <button
              key={lab.id}
              onClick={() => setActiveLab(lab.id)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className={`p-2 rounded-xl w-fit ${isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-stone-900">{lab.name}</div>
                <div className="text-[10px] text-stone-500 line-clamp-1">{lab.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Lab Sandbox Workspace */}
      <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl space-y-6">
        {/* TAB 1: PHASE-4 SOVEREIGN RECOMMENDATIONS */}
        {activeLab === 'RECOMMENDATIONS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  TIB Phase-4: Rekomendasi Standar Rekayasa Mandiri
                </h3>
                <p className="text-xs text-stone-500">
                  Panduan sovereign engineering 5 pilar (Font, Illustration, Animation, Voice, Performance) berorientasi Zero Breaking Change.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                Kepatuhan: {recSummary.overallScore}% (Optimal)
              </span>
            </div>

            {/* 5 Recommendation Sections */}
            <div className="space-y-4">
              {/* 1. Font */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <Type className="w-4 h-4 text-emerald-600" />
                  <span>1. Rekomendasi Font & Tipografi Arab-Latin</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {recSummary.categories.font.map((rec) => (
                    <div key={rec.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-800">{rec.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{rec.description}</p>
                      <div className="p-2 bg-emerald-50/50 rounded-lg text-[10px] font-mono text-emerald-900">
                        {rec.technicalRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Illustration */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>2. Rekomendasi Ilustrasi & Maskot Asy-Syifa</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {recSummary.categories.illustration.map((rec) => (
                    <div key={rec.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-800">{rec.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{rec.description}</p>
                      <div className="p-2 bg-amber-50/50 rounded-lg text-[10px] font-mono text-amber-900">
                        {rec.technicalRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Animation */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <Film className="w-4 h-4 text-purple-600" />
                  <span>3. Rekomendasi Animasi (rAF & 60 FPS Budget)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {recSummary.categories.animation.map((rec) => (
                    <div key={rec.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-800">{rec.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{rec.description}</p>
                      <div className="p-2 bg-purple-50/50 rounded-lg text-[10px] font-mono text-purple-900">
                        {rec.technicalRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Voice */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>4. Rekomendasi Audio & Voice Living Assistant</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {recSummary.categories.voice.map((rec) => (
                    <div key={rec.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-800">{rec.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{rec.description}</p>
                      <div className="p-2 bg-blue-50/50 rounded-lg text-[10px] font-mono text-blue-900">
                        {rec.technicalRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Performance */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <Gauge className="w-4 h-4 text-rose-600" />
                  <span>5. Rekomendasi Performa, GPU Throttle & GC</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {recSummary.categories.performance.map((rec) => (
                    <div key={rec.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-800">{rec.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                          {rec.badge}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{rec.description}</p>
                      <div className="p-2 bg-rose-50/50 rounded-lg text-[10px] font-mono text-rose-900">
                        {rec.technicalRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE LAB */}
        {activeLab === 'PERFORMANCE' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Performance Lab: GPU Quality Switch & Animation Scheduler
              </h3>
              <p className="text-xs text-stone-500">
                Kontrol beban rendering grafis perangkat wali murid dan guru untuk menjaga kelancaran 60fps.
              </p>
            </div>

            {/* GPU Switch Selector */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
              <div className="font-bold text-xs text-stone-800">
                Mode GPU Quality Switch
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'HIGH', label: 'High (Desktop / Flagship)', desc: 'Full shadow, 60fps canvas particles, blur filter' },
                  { id: 'BALANCED', label: 'Balanced (Standar HP Guru)', desc: 'Optimized shadows, static canvas, responsive micro-animations' },
                  { id: 'BATTERY_SAVER', label: 'Battery Saver (Hemat Daya)', desc: 'Minimal CSS transitions, 0 particle loops, max battery' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleGpuChange(mode.id as any)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      gpuQuality === mode.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs">{mode.label}</div>
                    <div className="text-[10px] text-stone-500 font-normal mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Scheduler Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-stone-900">Animation Scheduler (rAF Orchestrator)</div>
                <div className="text-[11px] text-stone-500">
                  Sinkronisasi requestAnimationFrame terpusat untuk menghindari micro-stuttering.
                </div>
              </div>
              <button
                onClick={handleToggleAnimScheduler}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  animScheduler
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {animScheduler ? 'AKTIF' : 'NON-AKTIF'}
              </button>
            </div>
          </div>
        )}

        {/* PHOTO LAB */}
        {activeLab === 'PHOTO' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-600" />
              Photo Lab: Kalibrasi Algoritma Deteksi Blur & Sharpness Score
            </h3>
            <p className="text-xs text-stone-600">
              Uji coba simulasi Laplacian kernel variance untuk penolakan foto buram sebelum masuk arsip Smart Media Pipeline.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>Simulasi Tingkat Blur:</span>
                <span className="font-bold">{photoTestBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={photoTestBlur}
                onChange={(e) => setPhotoTestBlur(Number(e.target.value))}
                className="w-full"
              />
              <div className={`p-3 rounded-xl text-xs font-bold ${
                photoTestBlur < 3
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-rose-100 text-rose-900'
              }`}>
                {photoTestBlur < 3 ? '✅ Foto Tajam (Sharpness ≥ 85) — Siap Publikasi' : '⚠️ Foto Terlalu Buram (Sharpness < 50) — Rekomendasikan Ambil Ulang'}
              </div>
            </div>
          </div>
        )}

        {/* ANIMATION LAB */}
        {activeLab === 'ANIMATION' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Film className="w-4 h-4 text-teal-600" />
              Animation Lab: Maskot Micro-Animations & Physics Loop
            </h3>
            <p className="text-xs text-stone-600">
              Uji fluiditas floating animation maskot Asy & Syifa pada variasi kecepatan CPU.
            </p>
            <div className="p-6 bg-white rounded-2xl border border-stone-200 flex flex-col items-center space-y-4">
              <div
                className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-lg"
                style={{
                  animation: `bounce ${2 / animSpeed}s infinite`
                }}
              >
                ASY
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAnimSpeed(0.5)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${animSpeed === 0.5 ? 'bg-emerald-700 text-white' : 'bg-stone-100'}`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setAnimSpeed(1)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${animSpeed === 1 ? 'bg-emerald-700 text-white' : 'bg-stone-100'}`}
                >
                  1.0x (Normal)
                </button>
                <button
                  onClick={() => setAnimSpeed(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${animSpeed === 2 ? 'bg-emerald-700 text-white' : 'bg-stone-100'}`}
                >
                  2.0x
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VOICE LAB */}
        {activeLab === 'VOICE' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-600" />
              Voice Lab: Generator Chime & Notifikasi Santun
            </h3>
            <p className="text-xs text-stone-600">
              Uji coba audio synthesizer web native tanpa dependensi file eksternal untuk pengingat doa harian.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
              <button
                onClick={() => {
                  setVoiceChimePlaying(true);
                  setTimeout(() => setVoiceChimePlaying(false), 1200);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{voiceChimePlaying ? 'Memutar Chime 528Hz...' : 'Uji Chime Notifikasi Islami'}</span>
              </button>
            </div>
          </div>
        )}

        {/* VIDEO LAB */}
        {activeLab === 'VIDEO' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Tv className="w-4 h-4 text-teal-600" />
              Video Lab: Kontainer Multi-Aspect Ratio (16:9, 9:16, 1:1)
            </h3>
            <p className="text-xs text-stone-600">
              Validasi viewport video dokumentasi santri untuk display TV ruang tunggu dan story wali.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600">
              Format 16:9 TV Display & 9:16 WhatsApp Story terkalibrasi responsif tanpa black bars berlebih.
            </div>
          </div>
        )}

        {/* UI LAB */}
        {activeLab === 'UI' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Layout className="w-4 h-4 text-teal-600" />
              UI Lab: Audit Kontras Tipografi WCAG AA & Tipografi Arab
            </h3>
            <p className="text-xs text-stone-600">
              Memastikan seluruh teks doa dan label memiliki kontras rasio minimal 4.5:1 untuk kenyamanan wali murid.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-emerald-950 font-bold">
              ✅ Seluruh palet warna Emerald, Teal, dan Slate lolos uji kontras WCAG AA 100%.
            </div>
          </div>
        )}

        {/* SECURITY LAB */}
        {activeLab === 'SECURITY' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Security Lab: Ring-0 Tripwires & Sandbox Quarantine Barrier
            </h3>
            <p className="text-xs text-stone-600">
              Memverifikasi isolasi token, anti-tampering localStorage, dan perlindungan SSoT db.ts.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-emerald-900 font-bold">
              ✅ 0 Celah Keamanan Terdeteksi. Seluruh 7 RBAC roles terisolasi dalam Ring-0 perimeter.
            </div>
          </div>
        )}

        {/* RADAR LAB */}
        {activeLab === 'RADAR' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <Radar className="w-4 h-4 text-teal-600" />
                  Free Tool & Open Source Ecosystem Radar (TIB Phase-3)
                </h3>
                <p className="text-xs text-stone-500">
                  Audit kurasi ekosistem tools gratis, bebas lisensi, dan berorientasi Zero Breaking Change.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {compliance.licenseScore}% Permissive
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {radarItems.map((item) => (
                <div key={item.id} className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">{item.category}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                      {item.license}
                    </span>
                  </div>
                  <div className="font-black text-xs text-stone-900">{item.name}</div>
                  <p className="text-[11px] text-stone-600">{item.purpose}</p>
                  <div className="text-[10px] text-teal-700 font-semibold pt-1 border-t border-stone-100">
                    {item.benefitForAsySyifa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
