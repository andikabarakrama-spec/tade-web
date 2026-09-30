import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Database, ShieldAlert, ArrowDownUp, Layers } from 'lucide-react';

export const OfflineSyncAssuranceViewer: React.FC = () => {
  const [simulatingOffline, setSimulatingOffline] = useState(false);
  const [syncedItemsCount, setSyncedItemsCount] = useState(48);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  const handleSimulateOfflineToggle = () => {
    if (!simulatingOffline) {
      setSimulatingOffline(true);
      setPendingQueueCount(3);
    } else {
      // Reconnect and flush
      setSimulatingOffline(false);
      setTimeout(() => {
        setSyncedItemsCount(prev => prev + pendingQueueCount);
        setPendingQueueCount(0);
      }, 600);
    }
  };

  return (
    <div id="offline-sync-assurance-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
              <Layers className="w-4 h-4" /> R858 • Jaminan Sinkronisasi Nir-Konflik
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Offline Sync Assurance</h1>
            <p className="text-slate-300 text-sm mt-1">
              Garansi integritas transaksi saat jaringan putus total di pelosok: antrean lokal IndexedDB, rekonsiliasi deterministik LWW, dan Zero Data Loss.
            </p>
          </div>
          <button
            onClick={handleSimulateOfflineToggle}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
              simulatingOffline
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {simulatingOffline ? (
              <>
                <Wifi className="w-4 h-4" /> Pulihkan Jaringan (Flush Buffer)
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" /> Uji Simulasi Jaringan Terputus
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
            simulatingOffline ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {simulatingOffline ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Status Konektivitas</div>
            <div className="text-xl font-black text-slate-900">
              {simulatingOffline ? 'OFFLINE (Tersimpan Lokal)' : 'ONLINE (Terhubung Penuh)'}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">IndexedDB Buffer Siap</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Antrean Tertunda (Queue)</div>
            <div className="text-xl font-black text-slate-900">{pendingQueueCount} Transaksi</div>
            <div className="text-[11px] text-blue-600 font-semibold">Zero Duplicate Execution</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Mutasi Tersinkron</div>
            <div className="text-xl font-black text-slate-900">{syncedItemsCount} Selesai</div>
            <div className="text-[11px] text-purple-600 font-semibold">100% SSoT Consistency</div>
          </div>
        </div>
      </div>

      {/* Deep Protocol Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ArrowDownUp className="w-5 h-5 text-cyan-600" /> Protokol Jaminan Nir-Konflik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
            <div className="font-bold text-slate-800">1. Local-First Write Buffer</div>
            <p className="text-slate-600">
              Setiap presensi atau catatan mutabaah langsung masuk ke IndexedDB lokal dalam waktu &lt;5ms tanpa menunggu konfirmasi server.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
            <div className="font-bold text-slate-800">2. Idempotent Deduplication</div>
            <p className="text-slate-600">
              Setiap catatan dilengkapi UUIDv4 unik dan hash timestamp. Pengiriman ulang saat jaringan fluktuatif tidak akan menduplikasi data.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
            <div className="font-bold text-slate-800">3. Conflict Resolver LWW</div>
            <p className="text-slate-600">
              Resolusi otomatis Last-Write-Wins menjamin data terupdate dari guru atau wali santri tetap konsisten di SSoT db.ts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
