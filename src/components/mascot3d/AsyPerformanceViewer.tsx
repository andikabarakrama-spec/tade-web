import React, { useState, useEffect, useMemo } from 'react';
import { Gauge, Cpu, Eye, Zap, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MascotPerformanceGuard, MascotPerformanceMetrics } from '../../core/mascot3d/mascotPerformanceGuard';

export const AsyPerformanceViewer: React.FC = () => {
  const guard = useMemo(() => MascotPerformanceGuard.getInstance(), []);
  const [metrics, setMetrics] = useState<MascotPerformanceMetrics>(() => guard.getMetrics());

  useEffect(() => {
    return guard.subscribe(setMetrics);
  }, [guard]);

  return (
    <div id="r787-performance-guard" className="space-y-6">
      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <Gauge className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              TARGET: {metrics.targetFps} FPS
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{metrics.currentFps} <span className="text-sm font-sans font-normal text-stone-500">FPS</span></p>
          <p className="text-xs text-stone-500">Frame rate stabil tanpa stutter atau blocking di main thread.</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <Cpu className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              VRAM: {metrics.gpuMemoryUsageMb} MB
            </span>
          </div>
          <p className="text-3xl font-black text-indigo-900 font-mono">{metrics.renderMode.replace(/_/g, ' ')}</p>
          <p className="text-xs text-stone-500">Rendering pipeline aktif dengan optimasi memori ultra-rendah.</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <Eye className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {metrics.isTabVisible ? 'TAB VISIBLE' : 'TAB HIDDEN'}
            </span>
          </div>
          <p className="text-3xl font-black text-amber-900 font-mono">
            {metrics.isTabVisible ? '0% CPU SUSPEND READY' : 'SUSPENDED (0% CPU)'}
          </p>
          <p className="text-xs text-stone-500">Otomatis suspend loop animasi saat tab browser diminimalkan.</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              LOAD: {metrics.cpuLoadTier}
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-800 font-mono">ZERO LAG</p>
          <p className="text-xs text-stone-500">Tidak ada blocking I/O pada operasi database SSoT.</p>
        </div>
      </div>

      {/* Render Mode Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" /> Pipeline Render Mode Override
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { mode: 'CANVAS_2_5D' as const, title: 'Canvas 2.5D Vector Puppet', desc: 'Sangat ringan (<30KB), optimal untuk semua jenis browser dan perangkat mobile.' },
            { mode: 'WEBGL_3D' as const, title: 'WebGL 3D GPU Pipeline', desc: 'Hardware-accelerated GLB mesh dengan dynamic lighting & soft shadows.' },
            { mode: 'VECTOR_SVG_FALLBACK' as const, title: 'Ultra-Lite SVG Fallback', desc: 'Fallback instan bila GPU mengalami context lost atau mode hemat daya ekstrim.' }
          ].map(({ mode, title, desc }) => (
            <button
              key={mode}
              onClick={() => guard.setRenderMode(mode)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                metrics.renderMode === mode
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800'
              }`}
            >
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase ${metrics.renderMode === mode ? 'text-emerald-400' : 'text-stone-400'}`}>
                  {mode}
                </span>
                <h4 className="text-xs font-bold mt-1">{title}</h4>
                <p className={`text-[11px] mt-1 leading-relaxed ${metrics.renderMode === mode ? 'text-slate-300' : 'text-stone-500'}`}>
                  {desc}
                </p>
              </div>
              {metrics.renderMode === mode && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CURRENT ACTIVE
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
