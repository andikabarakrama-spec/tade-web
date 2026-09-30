import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Zap, 
  Sparkles, 
  X, 
  RotateCcw, 
  Bot,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { AsyControlPanelManager, AsyControlSettings } from '../../core/mascot3d/asyControlPanelManager';
import { MascotPerformanceGuard, MascotPerformanceMetrics } from '../../core/mascot3d/mascotPerformanceGuard';
import { LivingAnimationEngine } from '../../core/mascot3d/livingAnimationEngine';

interface AsyControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AsyControlPanelModal: React.FC<AsyControlPanelModalProps> = ({ isOpen, onClose }) => {
  const manager = AsyControlPanelManager.getInstance();
  const perfGuard = MascotPerformanceGuard.getInstance();
  
  const [settings, setSettings] = useState<AsyControlSettings>(() => manager.getSettings());
  const [perfMetrics, setPerfMetrics] = useState<MascotPerformanceMetrics>(() => perfGuard.getMetrics());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const unsubMgr = manager.subscribe(setSettings);
    const unsubPerf = perfGuard.subscribe(setPerfMetrics);
    return () => {
      unsubMgr();
      unsubPerf();
    };
  }, []);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<AsyControlSettings>) => {
    manager.updateSettings(partial);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestPose = (pose: any) => {
    LivingAnimationEngine.getInstance().triggerPose(pose, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-2xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Asy 3D Living Mascot Control Panel
              </h2>
              <p className="text-[11px] text-stone-500 font-mono">
                R789 • TADE RC96A Enterprise Mascot Settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Pengaturan Asy berhasil diperbarui & disimpan!
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Toggle Presence */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <p className="font-bold text-slate-900">Status Maskot Asy di SIM</p>
              <p className="text-[11px] text-stone-500">Tampilkan atau sembunyikan Asy pada sudut layar.</p>
            </div>
            <button
              onClick={() => handleUpdate({ isEnabled: !settings.isEnabled })}
              className={`px-3 py-1.5 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
                settings.isEnabled 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {settings.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {settings.isEnabled ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* Scale Slider */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-900">Ukuran Maskot (Scale):</span>
              <span className="font-mono text-emerald-700">{settings.scale}x ({Math.round(settings.scale * 80)}px)</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.4"
              step="0.05"
              value={settings.scale}
              onChange={(e) => handleUpdate({ scale: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Animation Speed */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-slate-900">Kecepatan Animasi (Motion Rate):</span>
              <span className="font-mono text-indigo-700">{settings.animationSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.1"
              value={settings.animationSpeed}
              onChange={(e) => handleUpdate({ animationSpeed: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Chattiness Frequency */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <label className="block font-bold text-slate-900">Frekuensi Nasehat / Sapaan Bubble:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(['CHATTY', 'BALANCED', 'QUIET', 'SILENT'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleUpdate({ chattinessMode: mode })}
                  className={`py-1.5 px-2 font-bold rounded-xl text-center text-[10px] transition cursor-pointer font-mono ${
                    settings.chattinessMode === mode
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Future-Ready */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <p className="font-bold text-slate-900">Efek Suara Ramah Santri (Audio Cue)</p>
              <p className="text-[11px] text-stone-500">Efek chime lembut saat Asy menyapa.</p>
            </div>
            <button
              onClick={() => handleUpdate({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-xl transition cursor-pointer ${
                settings.soundEnabled ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Pose Trigger Test */}
          <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2">
            <p className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Uji Gerakan Ekspresif (Living Pose):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '👋 Wave', pose: 'WAVE' },
                { label: '🎉 Celebrate', pose: 'CELEBRATE' },
                { label: '👀 Look Around', pose: 'LOOK_AROUND' },
                { label: '📖 Doa', pose: 'READING_DOA' },
                { label: '🦘 Small Jump', pose: 'SMALL_JUMP' }
              ].map(item => (
                <button
                  key={item.pose}
                  onClick={() => handleTestPose(item.pose)}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Debug Overlay Toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-100/70 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-800 text-[11px]">Debug Telemetry Overlay</p>
                <p className="text-[10px] text-stone-500 font-mono">FPS: {perfMetrics.currentFps} • GPU: {perfMetrics.gpuMemoryUsageMb}MB</p>
              </div>
            </div>
            <button
              onClick={() => handleUpdate({ debugOverlayEnabled: !settings.debugOverlayEnabled })}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                settings.debugOverlayEnabled ? 'bg-slate-900 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {settings.debugOverlayEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => manager.resetToDefaults()}
            className="text-[11px] text-stone-500 hover:text-stone-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
