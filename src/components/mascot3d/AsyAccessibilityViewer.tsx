import React, { useState, useEffect, useMemo } from 'react';
import { Accessibility, Eye, Volume2, Keyboard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MascotAccessibilityLayer, AccessibilitySettings } from '../../core/mascot3d/mascotAccessibilityLayer';

export const AsyAccessibilityViewer: React.FC = () => {
  const accessLayer = useMemo(() => MascotAccessibilityLayer.getInstance(), []);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => accessLayer.getSettings());

  useEffect(() => {
    return accessLayer.subscribe(setSettings);
  }, [accessLayer]);

  return (
    <div id="r788-accessibility-layer" className="space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Accessibility className="w-4 h-4 text-emerald-600" /> WCAG 2.1 & Inclusive Design Engine
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
          Maskot Asy dirancang dengan kepatuhan aksesibilitas penuh agar ramah bagi seluruh pengguna, termasuk pengguna pembaca layar (screen reader), pengguna keyboard, dan mereka yang sensitif terhadap gerakan (motion sickness).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Reduced Motion Toggle */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Reduced Motion Mode</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200 font-bold">
                  {settings.reducedMotion ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Mematikan loop goyangan pernapasan dan ayunan kaki dinamis.
              </p>
            </div>
            <button
              onClick={() => accessLayer.setReducedMotion(!settings.reducedMotion)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                settings.reducedMotion ? 'bg-slate-900 text-white' : 'bg-white border border-stone-300 text-stone-700'
              }`}
            >
              {settings.reducedMotion ? 'Matikan Reduced Motion' : 'Aktifkan Reduced Motion'}
            </button>
          </div>

          {/* High Contrast Outline */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">High Contrast Outline</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200 font-bold">
                  {settings.highContrastOutline ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Menambahkan garis kontras tajam pada siluet Asy untuk visibilitas optimal.
              </p>
            </div>
            <button
              onClick={() => accessLayer.setHighContrastOutline(!settings.highContrastOutline)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                settings.highContrastOutline ? 'bg-slate-900 text-white' : 'bg-white border border-stone-300 text-stone-700'
              }`}
            >
              {settings.highContrastOutline ? 'Matikan High Contrast' : 'Aktifkan High Contrast'}
            </button>
          </div>

          {/* Screen Reader Live Region */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Screen Reader Stream</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                  ARIA-LIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Menyampaikan ucapan penting tanpa memotong pembacaan form utama.
              </p>
            </div>
            <button
              onClick={() => accessLayer.setScreenReaderAnnouncements(!settings.screenReaderAnnouncements)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                settings.screenReaderAnnouncements ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300 text-stone-700'
              }`}
            >
              {settings.screenReaderAnnouncements ? 'Live Announcement Aktif' : 'Nonaktif'}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Accessibility Reference */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-indigo-600" /> Keyboard Shortcuts & Focus Navigation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <kbd className="px-2 py-1 bg-white border border-stone-300 rounded-md font-mono text-[11px] font-bold text-slate-800 shadow-2xs">
              Tab / Shift+Tab
            </kbd>
            <p className="text-stone-600 text-[11px] pt-1">Fokus ke widget Asy dengan ring indikator hijau zamrud.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <kbd className="px-2 py-1 bg-white border border-stone-300 rounded-md font-mono text-[11px] font-bold text-slate-800 shadow-2xs">
              Enter / Space
            </kbd>
            <p className="text-stone-600 text-[11px] pt-1">Buka percakapan / memicu sapaan islami ceria.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <kbd className="px-2 py-1 bg-white border border-stone-300 rounded-md font-mono text-[11px] font-bold text-slate-800 shadow-2xs">
              Escape (ESC)
            </kbd>
            <p className="text-stone-600 text-[11px] pt-1">Menutup bubble ucapan seketika tanpa jeda.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
