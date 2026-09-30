import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Activity,
  Layers,
  Search,
  Bell,
  FolderOpen,
  Award,
  Smile,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  livingMicroInteractionEngine,
  REGISTERED_MICRO_INTERACTIONS,
  MicroInteractionEffect
} from '../../services/livingMicroInteractions';

export const LivingMicroInteractionsDemo: React.FC = () => {
  const [popActive, setPopActive] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [bounceEmoji, setBounceEmoji] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleTriggerPop = () => {
    setPopActive(true);
    setTimeout(() => setPopActive(false), 500);
  };

  const handleTriggerGlow = () => {
    setGlowActive(true);
    setTimeout(() => setGlowActive(false), 600);
  };

  const handleTriggerBounce = () => {
    setBounceEmoji(true);
    setTimeout(() => setBounceEmoji(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Living Micro Interaction Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                60 FPS • 120-300ms
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Engine sentuhan mikro taktil, GPU-accelerated, hemat baterai, dan patuh Konstitusi Kinerja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>GPU Constitution: 100% Green</span>
        </div>
      </div>

      {/* Interactive Micro-Interaction Testing Sandbox */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Ripple Emerald Wave Button */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-emerald-400">1. Ripple Emerald Wave</h4>
            <p className="text-xs text-slate-400 mt-1">
              Riak hijau zamrud cair organik saat tombol ditekan (150ms).
            </p>
          </div>
          <button
            onClick={(e) => livingMicroInteractionEngine.triggerEmeraldRipple(e)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Klik Riak Zamrud
          </button>
        </div>

        {/* 2. Achievement Star Pop */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-amber-400">2. Milestone Star Burst Pop</h4>
            <p className="text-xs text-slate-400 mt-1">
              Dentuman mikro bintang emas saat santri mencapai juz baru (260ms).
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleTriggerPop}
              className="py-3 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Award className="w-4 h-4" /> Uji Dentuman Bintang
            </button>
            <span className={`text-3xl transition-all duration-300 ${popActive ? 'scale-150 rotate-12' : 'scale-100'}`}>
              ⭐
            </span>
          </div>
        </div>

        {/* 3. Notification Pulse Glow */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-teal-400">3. Pulse Emerald Ring Glow</h4>
            <p className="text-xs text-slate-400 mt-1">
              Cincin kilau zamrud pada lonceng notifikasi dan pesan baru (300ms).
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleTriggerGlow}
              className="py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
            >
              Uji Kilau Lonceng
            </button>
            <div className={`p-3 rounded-full bg-slate-800 text-emerald-400 transition-all ${glowActive ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-500/50' : ''}`}>
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 4. Search Magic Shimmer */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-indigo-400">4. Search Magic Focus Shimmer</h4>
            <p className="text-xs text-slate-400 mt-1">
              Kilau halus pada bilah pencarian cerdas SIM (220ms).
            </p>
          </div>
          <div className={`p-1.5 rounded-xl border transition-all ${searchFocused ? 'border-indigo-400 ring-2 ring-indigo-400/50 bg-slate-950' : 'border-slate-800 bg-slate-950'}`}>
            <input
              type="text"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Fokus pencarian cerdas..."
              className="w-full bg-transparent px-2 py-1 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* 5. 3D Folder & Book Unfold */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-sky-400">5. 3D Folder & Raport Unfold</h4>
            <p className="text-xs text-slate-400 mt-1">
              Sensasi pembukaan buku raport digital / portofolio (280ms).
            </p>
          </div>
          <button
            onClick={() => setFolderOpen(!folderOpen)}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <FolderOpen className={`w-4 h-4 transition-transform duration-300 ${folderOpen ? 'rotate-12 scale-110' : ''}`} />
            <span>{folderOpen ? 'Raport Terbuka' : 'Buka Raport Sentra'}</span>
          </button>
        </div>

        {/* 6. Spring Emoji Bounce */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-pink-400">6. Spring Emoji Rebound</h4>
            <p className="text-xs text-slate-400 mt-1">
              Pegas elastis reaktif pada stiker Living Messenger (140ms).
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleTriggerBounce}
              className="py-3 px-4 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
            >
              Sentuh Reaksi
            </button>
            <span className={`text-3xl transition-transform duration-150 ${bounceEmoji ? 'scale-150 -translate-y-2' : 'scale-100'}`}>
              🕌
            </span>
          </div>
        </div>
      </div>

      {/* Catalog of all 9 effects */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Katalog 9 Efek Mikro Interaksi TADE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REGISTERED_MICRO_INTERACTIONS.map(eff => (
            <div key={eff.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{eff.name}</span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">{eff.durationMs}ms</span>
              </div>
              <p className="text-[11px] text-slate-400">{eff.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
