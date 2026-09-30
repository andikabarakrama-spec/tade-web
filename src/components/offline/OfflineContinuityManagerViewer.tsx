import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { offlineContinuityManager } from '../../core/offline/offlineContinuityManager';
import { ConnectivityStatus } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const OfflineContinuityManagerViewer: React.FC<Props> = ({ onNavigate }) => {
  const [status, setStatus] = useState<ConnectivityStatus>(offlineContinuityManager.getStatus());
  const [latency, setLatency] = useState<number>(offlineContinuityManager.getLastLatencyMs());
  const [offlineSec, setOfflineSec] = useState<number>(offlineContinuityManager.getOfflineDurationSeconds());
  const [reconnects, setReconnects] = useState<number>(offlineContinuityManager.getReconnectCount());
  const [isSimulated, setIsSimulated] = useState<boolean>(offlineContinuityManager.isSimulated());
  const [probing, setProbing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = offlineContinuityManager.subscribe((st) => {
      setStatus(st);
      setLatency(offlineContinuityManager.getLastLatencyMs());
      setOfflineSec(offlineContinuityManager.getOfflineDurationSeconds());
      setReconnects(offlineContinuityManager.getReconnectCount());
      setIsSimulated(offlineContinuityManager.isSimulated());
    });

    const interval = setInterval(() => {
      setOfflineSec(offlineContinuityManager.getOfflineDurationSeconds());
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleProbe = async () => {
    setProbing(true);
    await offlineContinuityManager.probeConnection();
    setProbing(false);
  };

  const handleSimulateStatus = (st: ConnectivityStatus | null) => {
    offlineContinuityManager.setSimulationOverride(st);
    setIsSimulated(st !== null);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ONLINE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'DEGRADED':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'OFFLINE':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      case 'RECOVERING':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R731 &bull; OFFLINE CONTINUITY MANAGER
            </span>
            {isSimulated && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                SIMULATED OVERRIDE
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pengelola Kontinuitas Offline &amp; State Jaringan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen status transisi adaptif: ONLINE, DEGRADED, OFFLINE, RECOVERING dengan hysteresis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProbe}
            disabled={probing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${probing ? 'animate-spin' : ''}`} />
            {probing ? 'Memeriksa...' : 'Ping Probe'}
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('r740')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              RC91 War Room
            </button>
          )}
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className={`p-5 rounded-2xl border ${getStatusColor()} flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">Status Saat Ini</span>
            {status === 'ONLINE' ? (
              <Wifi className="w-5 h-5" />
            ) : status === 'OFFLINE' ? (
              <WifiOff className="w-5 h-5" />
            ) : (
              <Activity className="w-5 h-5 animate-pulse" />
            )}
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">{status}</div>
            <div className="text-xs opacity-80 mt-0.5">
              {status === 'ONLINE' && 'Koneksi SSoT stabil'}
              {status === 'DEGRADED' && 'Koneksi lambat/jitter'}
              {status === 'OFFLINE' && 'Bekerja dengan local snapshot'}
              {status === 'RECOVERING' && '5-Phase Sync Replay aktif'}
            </div>
          </div>
        </div>

        {/* Latency Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">PROBE LATENCY</span>
            <Radio className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {status === 'OFFLINE' ? 'N/A' : `${latency} ms`}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {latency < 50 ? 'Sangat Cepat' : latency < 200 ? 'Normal' : 'Tinggi'}
            </div>
          </div>
        </div>

        {/* Offline Duration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">OFFLINE DURATION</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {offlineSec}s
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Total waktu offline sesi ini
            </div>
          </div>
        </div>

        {/* Reconnect Count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold">RECONNECT CYCLES</span>
            <RefreshCw className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {reconnects}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Siklus pemulihan otomatis
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Status Switcher & Testing Sandbox */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Kontrol Transisi Status Jaringan (Sandbox Testing)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Uji respons aplikasi saat beralih antara kondisi jaringan nyata tanpa mematikan internet PC.
            </p>
          </div>
          {isSimulated && (
            <button
              onClick={() => handleSimulateStatus(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Reset ke Real Network
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleSimulateStatus('ONLINE')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              status === 'ONLINE' && isSimulated
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <Wifi className="w-4 h-4" /> ONLINE
            </div>
            <p className="text-[10px] text-slate-500">SSoT Sinkron Aktif</p>
          </button>

          <button
            onClick={() => handleSimulateStatus('DEGRADED')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              status === 'DEGRADED' && isSimulated
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-amber-600 mb-1">
              <Activity className="w-4 h-4" /> DEGRADED
            </div>
            <p className="text-[10px] text-slate-500">Throttling &amp; Slow Link</p>
          </button>

          <button
            onClick={() => handleSimulateStatus('OFFLINE')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              status === 'OFFLINE' && isSimulated
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-rose-600 mb-1">
              <WifiOff className="w-4 h-4" /> OFFLINE
            </div>
            <p className="text-[10px] text-slate-500">Local Snapshot &amp; Queue</p>
          </button>

          <button
            onClick={() => handleSimulateStatus('RECOVERING')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              status === 'RECOVERING' && isSimulated
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-sky-600 mb-1">
              <RefreshCw className="w-4 h-4" /> RECOVERING
            </div>
            <p className="text-[10px] text-slate-500">5-Phase Replay Trigger</p>
          </button>
        </div>
      </div>

      {/* Continuity Architecture Invariants */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <h4 className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Ketetapan Arsitektur Kontinuitas (Enterprise Invariant):
        </h4>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
          <li><strong>SSoT Authority:</strong> Mutasi offline wajib diantrekan di Safe Sync Queue dan tidak langsung mengubah database produksi.</li>
          <li><strong>Zero Overwrite:</strong> Snapshot lokal bersifat read-only untuk tampilan antarmuka saat offline dan kedaluwarsa secara eksplisit via TTL.</li>
          <li><strong>Zero Data Loss:</strong> Seluruh draft terenkapsulasi dengan sidik jari (fingerprint) unik yang tahan terhadap reload halaman.</li>
        </ul>
      </div>
    </div>
  );
};
