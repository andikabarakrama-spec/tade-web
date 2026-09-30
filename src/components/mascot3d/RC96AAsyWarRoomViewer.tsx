import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Box, 
  Sparkles, 
  Zap, 
  Gauge, 
  Accessibility, 
  Sliders, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Activity
} from 'lucide-react';
import { AsyAssetViewer } from './AsyAssetViewer';
import { AsyAnimationViewer } from './AsyAnimationViewer';
import { AsyTriggerViewer } from './AsyTriggerViewer';
import { AsyPerformanceViewer } from './AsyPerformanceViewer';
import { AsyAccessibilityViewer } from './AsyAccessibilityViewer';
import { AsyControlPanelManager, AsyControlSettings } from '../../core/mascot3d/asyControlPanelManager';
import { Asy3DModelCanvas } from './Asy3DModelCanvas';
import { LivingAnimationEngine } from '../../core/mascot3d/livingAnimationEngine';

export const RC96AAsyWarRoomViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ASSET' | 'ANIMATION' | 'TRIGGER' | 'PERFORMANCE' | 'ACCESSIBILITY' | 'SETTINGS'>('ANIMATION');
  const controlMgr = useMemo(() => AsyControlPanelManager.getInstance(), []);
  const [settings, setSettings] = useState<AsyControlSettings>(() => controlMgr.getSettings());
  const animEngine = useMemo(() => LivingAnimationEngine.getInstance(), []);
  const [animState, setAnimState] = useState(() => animEngine.getCurrentState());

  React.useEffect(() => {
    const unsubCtrl = controlMgr.subscribe(setSettings);
    const unsubAnim = animEngine.subscribe(setAnimState);
    return () => {
      unsubCtrl();
      unsubAnim();
    };
  }, [controlMgr, animEngine]);

  const tabs = [
    { id: 'ANIMATION' as const, label: 'Living Animation', icon: Sparkles, code: 'R783' },
    { id: 'ASSET' as const, label: '3D Asset & Mesh', icon: Box, code: 'R781' },
    { id: 'TRIGGER' as const, label: 'Context Triggers', icon: Zap, code: 'R784' },
    { id: 'PERFORMANCE' as const, label: 'Performance Guard', icon: Gauge, code: 'R787' },
    { id: 'ACCESSIBILITY' as const, label: 'Accessibility', icon: Accessibility, code: 'R788' },
    { id: 'SETTINGS' as const, label: 'Mascot Settings', icon: Sliders, code: 'R789' }
  ];

  return (
    <div id="r790-rc96a-asy-war-room" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold font-mono border border-emerald-500/30">
              <Bot className="w-3.5 h-3.5" /> R790 • ASY LIVING 3D MASCOT WAR ROOM (RC96A)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Asy 3D Living Mascot Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Pusat orkestrasi maskot resmi TADE: 3D chibi islami bertema zamrud, dock assistant mandiri, living animation, context triggers, dan zero-lag performance guard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800/80 backdrop-blur-xs rounded-2xl border border-slate-700 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Status Maskot</p>
                <p className="text-sm font-extrabold text-emerald-400 font-mono">
                  {settings.isEnabled ? 'LIVING & ACTIVE' : 'DORMANT / HIDDEN'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* War Room Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                isActive
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                isActive ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'bg-stone-200 text-stone-500'
              }`}>
                {tab.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'ASSET' && <AsyAssetViewer />}
        {activeTab === 'ANIMATION' && <AsyAnimationViewer />}
        {activeTab === 'TRIGGER' && <AsyTriggerViewer />}
        {activeTab === 'PERFORMANCE' && <AsyPerformanceViewer />}
        {activeTab === 'ACCESSIBILITY' && <AsyAccessibilityViewer />}
        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" /> Maskot Preferences & Super Admin Controls
            </h3>
            <p className="text-xs text-stone-500">
              Konfigurasi master kehadiran Asy dapat disesuaikan melalui tombol cepat di dock sudut layar atau melalui parameter berikut.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <p className="text-xs font-bold text-slate-900">Busana & Tema Karakter</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => controlMgr.updateSettings({ genderOutfit: 'ASY_KOKO_EMERALD' })}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex-1 ${
                      settings.genderOutfit === 'ASY_KOKO_EMERALD'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    Asy (Koko Zamrud)
                  </button>
                  <button
                    onClick={() => controlMgr.updateSettings({ genderOutfit: 'ASYAH_HIJAB_EMERALD' })}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex-1 ${
                      settings.genderOutfit === 'ASYAH_HIJAB_EMERALD'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    Asyah (Hijab Zamrud)
                  </button>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <p className="text-xs font-bold text-slate-900">Mode Sapaan Role Otomatis</p>
                <button
                  onClick={() => controlMgr.updateSettings({ roleGreetingEnabled: !settings.roleGreetingEnabled })}
                  className={`w-full py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    settings.roleGreetingEnabled ? 'bg-slate-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  {settings.roleGreetingEnabled ? 'Sapaan Kontekstual Aktif' : 'Sapaan Manual Saja'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
