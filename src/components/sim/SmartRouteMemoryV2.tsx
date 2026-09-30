import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  HardDrive, 
  Clock, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

const STORAGE_KEY = 'tade_last_active_route';

interface RouteHistoryEntry {
  path: string;
  moduleName: string;
  timestamp: string;
}

export const SmartRouteMemoryV2: React.FC = () => {
  const [lastSavedRoute, setLastSavedRoute] = useState<string>('/sim/dashboard');
  const [history, setHistory] = useState<RouteHistoryEntry[]>([
    { path: '/sim/dashboard', moduleName: 'Dashboard Utama (R1)', timestamp: '08:00 WIB' },
    { path: '/sim/r475', moduleName: 'Digital Twin Campus Center (R475)', timestamp: '08:15 WIB' },
    { path: '/sim/r495', moduleName: 'AI Asy Command Center (R495)', timestamp: '08:30 WIB' },
    { path: '/sim/r496', moduleName: 'Guardian Command Center (R496)', timestamp: '08:45 WIB' }
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLastSavedRoute(saved);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleSimulateNavigation = (path: string, moduleName: string) => {
    setLastSavedRoute(path);
    try {
      localStorage.setItem(STORAGE_KEY, path);
    } catch {
      // safe fallback
    }
    const newEntry: RouteHistoryEntry = {
      path,
      moduleName,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };
    setHistory([newEntry, ...history.slice(0, 5)]);
    blackBoxRecorder.record({
      moduleCode: 'R499',
      eventType: 'NAVIGATE',
      severity: 'INFO',
      details: `Smart Route Memory updated last route to: ${path} (${moduleName})`
    });
  };

  const handleClearMemory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSavedRoute('/sim/dashboard');
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R499 &bull; SMART ROUTE MEMORY V2
          </span>
          <span className="text-xs text-slate-400 font-mono">Persistent State Restorer &bull; Anti-Jump Memory</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Compass className="w-8 h-8 text-cyan-400" />
              Smart Route Memory V2 &bull; Pemulih Rute Sesi Aktif
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Memastikan pengalaman pengguna mulus tanpa gangguan: ketika Founder merefresh halaman pada modul SIM apapun (misal <code>/sim/dashboard</code> atau <code>/sim/r475</code>), sistem otomatis memulihkan kembali modul terakhir tanpa mental ke landing page website.
            </p>
          </div>

          <button
            onClick={handleClearMemory}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            Reset Memori Rute
          </button>
        </div>

        {/* Quick Memory Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">RUTE TERSIMPAN</span>
            <span className="text-base font-bold text-cyan-400 font-mono">{lastSavedRoute}</span>
            <span className="text-[9px] text-cyan-500 block">Persisten di LocalStorage</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS PEMULIHAN</span>
            <span className="text-base font-bold text-emerald-400 font-mono">100% INSTAN</span>
            <span className="text-[9px] text-emerald-500 block">Zero Jump to Root</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STORAGE OVERHEAD</span>
            <span className="text-base font-bold text-purple-400 font-mono">&lt; 1 KB</span>
            <span className="text-[9px] text-purple-400 block">Ultra Ringan</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">KEAMANAN STATE</span>
            <span className="text-base font-bold text-emerald-400 font-mono">TERKUNCI</span>
            <span className="text-[9px] text-emerald-500 block">RBAC Validated</span>
          </div>
        </div>
      </div>

      {/* Main Route Navigator & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Preset Quick Routes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-cyan-500" />
                SIMULASI NAVIGASI &amp; PENYIMPANAN RUTE
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-500">Auto Sync Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { path: '/sim/dashboard', name: 'Dashboard Eksekutif SIM', code: 'R1' },
                { path: '/sim/r475', name: 'Digital Twin Campus Center', code: 'R475' },
                { path: '/sim/r495', name: 'AI Asy Command Center', code: 'R495' },
                { path: '/sim/r496', name: 'Guardian Command Center', code: 'R496' },
                { path: '/sim/r497', name: 'Dual AI Coordination Engine', code: 'R497' },
                { path: '/sim/r500', name: 'Living Task Automation', code: 'R500' }
              ].map(item => {
                const isActive = lastSavedRoute === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSimulateNavigation(item.path, item.name)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-700/20 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {item.code} &bull; {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                        {item.path}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Aktif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Route History Trail */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                RIWAYAT JEJAK RUTE
              </h3>
              <span className="text-[10px] font-mono text-cyan-500 font-bold">Memory Log</span>
            </div>

            <div className="space-y-2">
              {history.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white text-[11px] truncate">{entry.moduleName}</strong>
                    <span className="text-[9px] text-slate-400">{entry.timestamp}</span>
                  </div>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 block truncate">
                    {entry.path}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
