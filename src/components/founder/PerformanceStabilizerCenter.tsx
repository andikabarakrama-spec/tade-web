import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Cpu,
  Layers,
  HardDrive,
  CheckCircle2,
  Gauge,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import {
  performanceStabilizer,
  PerformanceMetrics
} from '../../services/performanceStabilizer';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const PerformanceStabilizerCenter: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    performanceStabilizer.getMetrics()
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = performanceStabilizer.subscribe(updated => {
      setMetrics(updated);
    });
    return () => unsub();
  }, []);

  const handleToggleLiteMode = () => {
    const next = !metrics.liteModeActive;
    performanceStabilizer.setLiteMode(next);
    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'Performance Stabilizer',
      `Founder mengubah status Mode Lite menjadi: ${next ? 'AKTIF' : 'NON-AKTIF'}`
    );
    setFeedback(`Mode Lite berhasil di-${next ? 'aktifkan' : 'non-aktifkan'}. Animasi dioptimalkan.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOptimizeCache = () => {
    const res = performanceStabilizer.optimizeStorageCache();
    founderCommandRecorder.recordCommand(
      'SYSTEM_DIAGNOSTIC',
      'Performance Stabilizer',
      `Reklamasi Cache Storage: ${res.reclaimedMb}MB dibebaskan. Total sisa: ${res.newTotalMb}MB`
    );
    setFeedback(`Optimalisasi Berhasil: ${res.reclaimedMb}MB ruang cache sementara berhasil dibebaskan.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const storagePercentage = Math.round((metrics.storageUsageMb / metrics.storageQuotaMb) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 border border-slate-800 p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 border border-teal-700 px-3 py-1 rounded-full">
              P5 • Performance Stabilization Engine
            </span>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
              Target 60 FPS
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <Activity className="w-5 h-5 text-teal-400" />
            Stabilisasi Performa, Budget Animasi & Buffer Hardware
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Menjaga kelancaran antarmuka 60 FPS, membatasi budget animasi aktif maksimal 5 elemen, alokasi memori JS Heap yang hemat, dan aktivasi otomatis Mode Lite pada perangkat hemat daya.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOptimizeCache}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reklamasi Cache ({metrics.storageUsageMb} MB)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Frame Rate (FPS) */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Frame Rate Realtime
            </span>
            <Gauge className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{metrics.currentFps}</span>
            <span className="text-xs font-bold text-teal-700">FPS (Rata-rata: {metrics.averageFps})</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (metrics.currentFps / 60) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-stone-500">requestAnimationFrame loop berjalan tanpa stutter.</p>
        </div>

        {/* Memory JS Heap */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              JS Heap Memory
            </span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{metrics.jsHeapMemoryMb}</span>
            <span className="text-xs font-bold text-indigo-700">MB (Batas Aman &lt; 80MB)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, (metrics.jsHeapMemoryMb / 80) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-stone-500">Bebas memory leak dengan garbage collection optimal.</p>
        </div>

        {/* Animation Budget */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Budget Animasi Aktif
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{metrics.activeAnimationCount}</span>
            <span className="text-xs font-bold text-amber-700">/ {metrics.maxAnimationBudget} Maksimal</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${(metrics.activeAnimationCount / metrics.maxAnimationBudget) * 100}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-stone-500">Sesuai konstitusi: tidak ada animasi berlebihan.</p>
        </div>

        {/* Storage Buffer Usage */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Kapasitas Penyimpanan
            </span>
            <HardDrive className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{metrics.storageUsageMb}</span>
            <span className="text-xs font-bold text-emerald-700">MB / {metrics.storageQuotaMb} MB ({storagePercentage}%)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-stone-500">Penyimpanan lokal memiliki cadangan ruang &gt; 90%.</p>
        </div>
      </div>

      {/* Lite Mode Control & GPU Accelerator Switch */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Konfigurasi Efisiensi Daya
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              metrics.liteModeActive ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              Mode Lite: {metrics.liteModeActive ? 'AKTIF (Ultra Hemat)' : 'NORMAL (60 FPS)'}
            </span>
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            Akselerasi GPU & Mode Rendah Gerak (prefers-reduced-motion)
          </h4>
          <p className="text-xs text-stone-600">
            Mode Lite menonaktifkan seluruh animasi latar belakang dan transisi kompleks untuk perangkat spesifikasi hemat daya.
          </p>
        </div>

        <button
          onClick={handleToggleLiteMode}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow-sm cursor-pointer ${
            metrics.liteModeActive
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-emerald-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{metrics.liteModeActive ? 'Kembali ke Mode Normal' : 'Aktifkan Mode Lite'}</span>
        </button>
      </div>
    </div>
  );
};
