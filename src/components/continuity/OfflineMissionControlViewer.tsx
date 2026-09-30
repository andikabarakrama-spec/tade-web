import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, ShieldCheck, Database, Layers, ArrowRight } from 'lucide-react';

export const OfflineMissionControlViewer: React.FC = () => {
  const [networkSim, setNetworkSim] = useState<'ONLINE' | 'OFFLINE_PELOSOK'>('ONLINE');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const handleSimulateOffline = () => {
    setNetworkSim(prev => prev === 'ONLINE' ? 'OFFLINE_PELOSOK' : 'ONLINE');
  };

  const handleTriggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedCount(prev => prev + 12);
    }, 700);
  };

  return (
    <div id="r868-offline-mission-control" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${
              networkSim === 'ONLINE'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {networkSim === 'ONLINE' ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">R868</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">Zero-Conflict SSoT</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Offline Mission Control</h2>
              <p className="text-sm text-slate-500">
                Pusat kendali misi operasional offline terisolasi: buffer lokal IndexedDB, rekonsiliasi deterministik LWW, dan deduplikasi transaksi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulateOffline}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border ${
                networkSim === 'ONLINE'
                  ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  : 'bg-amber-600 text-white border-amber-600 shadow-sm'
              }`}
            >
              {networkSim === 'ONLINE' ? 'Simulasikan Mode Terputus (Offline)' : 'Kembalikan Mode Online'}
            </button>

            <button
              onClick={handleTriggerManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs rounded-lg transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Buffer'}
            </button>
          </div>
        </div>
      </div>

      {/* State Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Status Konektivitas</span>
            {networkSim === 'ONLINE' ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-amber-600" />}
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {networkSim === 'ONLINE' ? 'Terkoneksi' : 'Terisolasi (Pelosok)'}
          </p>
          <span className={`text-xs font-medium ${networkSim === 'ONLINE' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {networkSim === 'ONLINE' ? 'Sinkronisasi Realtime Aktif' : 'Local-First Write Buffer Siaga'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Buffer Antrean Tertahan</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {networkSim === 'ONLINE' ? '0 Transaksi' : '4 Transaksi Lokal'}
          </p>
          <span className="text-xs text-blue-600 font-medium">Tersimpan aman di IndexedDB</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Konflik Data (LWW)</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">0 Konflik</p>
          <span className="text-xs text-purple-600 font-medium">Rekonsiliasi deterministik 100%</span>
        </div>
      </div>

      {/* Offline Guarantee Architecture Flow */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Arsitektur Jaminan Misi Offline SSoT (db.ts)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">1</span>
              Local-First Write
            </div>
            <p className="text-slate-600">Seluruh aksi input guru (presensi, nilai, kas) langsung ditulis ke IndexedDB lokal tanpa jeda jaringan.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
              Cryptographic Stamping
            </div>
            <p className="text-slate-600">Setiap mutasi diberi stempel waktu deterministik milidetik dan UUIDv4 unik untuk mencegah duplikasi.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">3</span>
              Deterministic LWW
            </div>
            <p className="text-slate-600">Saat koneksi pulih, algoritma Last-Write-Wins menyelesaikan selisih data secara deterministik tanpa intervensi manual.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">4</span>
              Zero-Loss Verification
            </div>
            <p className="text-slate-600">Hermes Vault memvalidasi keutuhan checksum data pasca sinkronisasi dengan status 100% mutlak aman.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
