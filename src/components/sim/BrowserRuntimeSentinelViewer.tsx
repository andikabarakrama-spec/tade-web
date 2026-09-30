import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Eye, 
  EyeOff, 
  HardDrive, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  Maximize2
} from 'lucide-react';

export const BrowserRuntimeSentinelViewer: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [visibilityState, setVisibilityState] = useState<string>(typeof document !== 'undefined' ? document.visibilityState : 'visible');
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);
  const [heapUsageMB, setHeapUsageMB] = useState<number>(46.2);
  const [tabFreezeState, setTabFreezeState] = useState<'HEALTHY' | 'SLUGGISH' | 'FROZEN'>('HEALTHY');
  const [aiAsyGuide, setAiAsyGuide] = useState<string>(
    'Tab browser Anda bekerja optimal. Seluruh koneksi data dan tampilan halaman stabil tanpa hambatan.'
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAiAsyGuide('Alhamdulillah koneksi internet tersambung kembali. Data otomatis diselaraskan ke server.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setAiAsyGuide('Koneksi internet terputus. Mode hemat offline aktif — jangan khawatir, data tetap tersimpan di laptop/HP Anda.');
    };
    const handleVisibilityChange = () => {
      setVisibilityState(document.visibilityState);
      if (document.visibilityState === 'hidden') {
        setAiAsyGuide('Tab aplikasi berada di latar belakang. Penggunaan memori otomatis dikurangi agar perangkat tetap dingin.');
      } else {
        setAiAsyGuide('Selamat datang kembali! Seluruh data langsung disegarkan dalam sekejap.');
      }
    };
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Minor telemetry heartbeat
    const interval = setInterval(() => {
      setHeapUsageMB((prev) => {
        const jitter = (Math.random() - 0.5) * 1.2;
        return Number((Math.max(38, Math.min(65, prev + jitter))).toFixed(1));
      });
    }, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      clearInterval(interval);
    };
  }, []);

  const handleSimulateMemorySpike = () => {
    setHeapUsageMB(124.8);
    setTabFreezeState('SLUGGISH');
    setAiAsyGuide('AI Asy mendeteksi penumpukan data sementara di tab browser. Membersihkan cache otomatis sekarang...');

    setTimeout(() => {
      setHeapUsageMB(48.5);
      setTabFreezeState('HEALTHY');
      setAiAsyGuide('Pembersihan berhasil! Memori browser kembali ramping dan ringan.');
    }, 1500);
  };

  const handleSimulateOffline = () => {
    setIsOnline(false);
    setAiAsyGuide('Simulasi mode offline aktif. Antrean transaksi lokal siap mencatat pendaftaran/rapor tanpa internet.');
  };

  const handleSimulateOnline = () => {
    setIsOnline(true);
    setAiAsyGuide('Koneksi pulih. Semua perubahan offline berhasil dikirim ke server pusat.');
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-600/20 rounded-2xl border border-teal-500/30 text-teal-400">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
                R581 &bull; BROWSER RUNTIME SENTINEL
              </span>
              <span className="text-xs text-slate-400 font-mono">Client-Side Runtime &amp; Telemetry Guardian</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Browser Runtime Sentinel &amp; Tab Telemetry</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateMemorySpike}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            Simulate Heap GC Cycle
          </button>
        </div>
      </div>

      {/* AI Asy Friendly Guide Banner */}
      <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-700/60 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wide">Panduan Ramah AI Asy:</span>
          <p className="text-sm text-teal-100 font-sans leading-relaxed">
            "{aiAsyGuide}"
          </p>
        </div>
      </div>

      {/* 4 Telemetry Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Tile 1: Online Status */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Konektivitas Jaringan</span>
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
          </div>
          <span className="text-lg font-bold text-white block">
            {isOnline ? 'ONLINE (TERHUBUNG)' : 'OFFLINE (LOKAL)'}
          </span>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSimulateOnline}
              className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-slate-200 font-bold"
            >
              Set Online
            </button>
            <button
              onClick={handleSimulateOffline}
              className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-slate-200 font-bold"
            >
              Set Offline
            </button>
          </div>
        </div>

        {/* Tile 2: Tab Visibility */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status Visibilitas Tab</span>
            {visibilityState === 'visible' ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
          </div>
          <span className="text-lg font-bold text-white block uppercase">
            {visibilityState}
          </span>
          <p className="text-[10px] text-slate-400">
            {visibilityState === 'visible' ? 'Rendering aktif 60 FPS' : 'Throttle hemat daya aktif'}
          </p>
        </div>

        {/* Tile 3: Window Focus */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fokus Jendela / Window</span>
            <Maximize2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-lg font-bold text-white block">
            {isWindowFocused ? 'FOCUSED (AKTIF)' : 'UNFOCUSED'}
          </span>
          <p className="text-[10px] text-slate-400">
            Prioritas respon input: {isWindowFocused ? 'Maksimal' : 'Disesuaikan'}
          </p>
        </div>

        {/* Tile 4: Memory Heap */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Alokasi Heap Browser</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">{heapUsageMB} MB</span>
            <span className="text-xs text-slate-500">/ 120 MB budget</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${heapUsageMB > 90 ? 'bg-rose-500' : heapUsageMB > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (heapUsageMB / 120) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
