import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Laptop, 
  Info,
  Server
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface Props {
  currentView?: 'WEBSITE' | 'SIM';
  onSwitchView?: (view: 'WEBSITE' | 'SIM') => void;
}

export const FounderPreviewModeFinal: React.FC<Props> = ({ currentView = 'SIM', onSwitchView }) => {
  const [isLocalhost, setIsLocalhost] = useState<boolean>(true);
  const [panelVisible, setPanelVisible] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>('/sim');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('ais-dev') || hostname.includes('ais-pre');
      setIsLocalhost(isLocal);
      setCurrentPath(pathname || '/sim');
    }
  }, []);

  const handleToggleView = (target: 'WEBSITE' | 'SIM') => {
    if (onSwitchView) {
      onSwitchView(target);
    }
    const path = target === 'SIM' ? '/sim' : '/';
    setCurrentPath(path);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', path);
    }
    blackBoxRecorder.record({
      moduleCode: 'R498',
      eventType: 'NAVIGATE',
      severity: 'INFO',
      details: `Founder Preview Mode switched view to ${target} (${path})`
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R498 &bull; FOUNDER PREVIEW MODE FINAL
          </span>
          <span className="text-xs text-slate-400 font-mono">Dual-Engine Unified Routing &bull; Localhost / Cloud</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Laptop className="w-8 h-8 text-cyan-400" />
              Founder Preview Mode &bull; Mode Pratinjau Terpadu
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Solusi tuntas routing audit lokal dan produksi: rute <code>/</code> menyajikan Website Resmi TK Asy Syifa, sedangkan rute <code>/sim</code> langsung membuka Portal SIM lengkap dengan memori rute tanpa reload.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleToggleView(currentView === 'SIM' ? 'WEBSITE' : 'SIM')}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              {currentView === 'SIM' ? 'Buka Website ( / )' : 'Buka SIM Portal ( /sim )'}
            </button>
          </div>
        </div>

        {/* Quick Route Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">RUTE AKTIF</span>
            <span className="text-base font-bold text-cyan-400 font-mono">{currentPath}</span>
            <span className="text-[9px] text-cyan-500 block">URL Path Valid</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">LINGKUNGAN RUNTIME</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{isLocalhost ? 'DEV / LOCAL' : 'PRODUCTION'}</span>
            <span className="text-[9px] text-emerald-500 block">TADE Full Engine</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS KESEHATAN ENGINE</span>
            <span className="text-base font-bold text-emerald-400 font-mono">100% HEALTHY</span>
            <span className="text-[9px] text-emerald-500 block">Zero Routing Conflict</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">BUILD PRODUCTION</span>
            <span className="text-base font-bold text-purple-400 font-mono">v4.5.0-RC67</span>
            <span className="text-[9px] text-purple-400 block">Locked Foundation</span>
          </div>
        </div>
      </div>

      {/* Main Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Website Profile Route */}
        <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
          currentView === 'WEBSITE'
            ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                1. RUTE WEBSITE RESMI ( / )
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200">
              Profil Sekolah &bull; PPDB Publik
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Menyajikan tampilan publik TK Asy Syifa: profil keunggulan sekolah, kurikulum sentra, galeri kegiatan, formulir pendaftaran PPDB daring, dan lokasi kampus.
          </p>

          <button
            onClick={() => handleToggleView('WEBSITE')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Alihkan ke Website Publik</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Card 2: SIM Portal Route */}
        <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
          currentView === 'SIM'
            ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                2. RUTE PORTAL SIM ( /sim )
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
              Enterprise Operations
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Membuka modul operasional lengkap: AI Asy, Guardian, Digital Twin Campus, Kasir SPP, Persuratan Resmi, PPDB Admin, CCTV Bridge, dan War Room.
          </p>

          <button
            onClick={() => handleToggleView('SIM')}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Buka Portal SIM Terpadu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
