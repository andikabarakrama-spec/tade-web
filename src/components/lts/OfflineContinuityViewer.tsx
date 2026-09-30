import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  PlusCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { 
  offlineContinuityEngine, 
  OfflineMutationType 
} from '../../core/lts/OfflineContinuityEngine';

export const OfflineContinuityViewer: React.FC = () => {
  const [state, setState] = useState(() => offlineContinuityEngine.getState());
  const [testSantriName, setTestSantriName] = useState('Muhammad Fatih Zarkasyi');
  const [testAmount, setTestAmount] = useState('100000');

  const handleToggleOnline = () => {
    offlineContinuityEngine.toggleNetworkSimulation();
    setState({ ...offlineContinuityEngine.getState() });
  };

  const handleEnqueueAttendance = () => {
    offlineContinuityEngine.enqueueMutation('ATTENDANCE_RECORD', 'SAN-001', {
      santriName: testSantriName,
      session: 'Sholat Maghrib',
      status: 'HADIR',
      timestamp: new Date().toISOString()
    });
    setState({ ...offlineContinuityEngine.getState() });
  };

  const handleEnqueueSavings = () => {
    offlineContinuityEngine.enqueueMutation('SAVINGS_TRANSACTION', 'SAN-002', {
      santriName: testSantriName,
      amount: parseInt(testAmount) || 50000,
      type: 'SETORAN',
      timestamp: new Date().toISOString()
    });
    setState({ ...offlineContinuityEngine.getState() });
  };

  const handleTriggerSync = () => {
    offlineContinuityEngine.processQueue();
    setState({ ...offlineContinuityEngine.getState() });
  };

  return (
    <div id="offline-continuity-layer-panel" className="space-y-6">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-network-status" className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${state.isOnline ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-rose-950/20 border-rose-800/60'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Status Jaringan</span>
            {state.isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-slate-100">{state.isOnline ? 'ONLINE' : 'AIR-GAP OFFLINE'}</p>
          <span className="text-xs font-medium text-slate-400">
            {state.isOnline ? 'Direct Cloud Syncing' : 'Local Durable Queue Active'}
          </span>
        </div>

        <div id="metric-queue-pending" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Antrean Lokal</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.activeQueueCount} Pending</p>
          <span className="text-xs text-amber-400 font-medium">Safe in Local IndexedDB</span>
        </div>

        <div id="metric-synced-total" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Transaksi Sinkron</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.totalSyncedTransactions}</p>
          <span className="text-xs text-cyan-400 font-medium">Zero Data Loss Verified</span>
        </div>

        <div id="metric-conflicts-resolved" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Konflik Diselesaikan</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{state.totalConflictsResolved}</p>
          <span className="text-xs text-indigo-400 font-medium">Guardian Ring-0 Verified</span>
        </div>
      </div>

      {/* Network Simulator & Interactive Queue Controls */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-slate-100">Offline Simulation & Mutation Testing</h3>
              <p className="text-xs text-slate-400">Uji ketahanan input data saat mati lampu atau koneksi terputus.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleOnline}
              id="btn-toggle-network"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${state.isOnline ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30' : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'}`}
            >
              {state.isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              {state.isOnline ? 'Simulasikan Internet Terputus' : 'Pulihkan Jaringan Online'}
            </button>
            <button
              onClick={handleTriggerSync}
              id="btn-trigger-manual-sync"
              disabled={!state.isOnline}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sinkronkan Sekarang
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Input Presensi Offline
            </span>
            <input
              type="text"
              value={testSantriName}
              onChange={(e) => setTestSantriName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleEnqueueAttendance}
              id="btn-enqueue-attendance"
              className="w-full py-2 rounded-lg bg-emerald-700/40 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-200 text-xs font-medium transition-colors"
            >
              Catat Presensi (Masuk Antrean)
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-cyan-400" /> Input Tabungan Offline
            </span>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none font-mono"
            />
            <button
              onClick={handleEnqueueSavings}
              id="btn-enqueue-savings"
              className="w-full py-2 rounded-lg bg-cyan-700/40 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-200 text-xs font-medium transition-colors"
            >
              Catat Setoran Tabungan (Masuk Antrean)
            </button>
          </div>
        </div>
      </div>

      {/* Queue Table & Conflict Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Items */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-semibold text-slate-200 text-sm">Antrean Transaksi Lokal</h4>
            <span className="text-xs font-mono text-slate-400">{state.queue.length} Total</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {state.queue.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-300">{item.id} • {item.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.syncStatus === 'SYNCED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.syncStatus === 'RESOLVED_BY_GUARDIAN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {item.syncStatus}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {item.payload.santriName || item.entityId} — {item.payload.session || (item.payload.amount ? `Rp ${item.payload.amount.toLocaleString()}` : 'Data')}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Queued: {new Date(item.queuedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conflict Resolution Audit Log */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-semibold text-slate-200 text-sm">Guardian Conflict Resolution Log</h4>
            <span className="text-xs font-mono text-indigo-400">Ring-0 Supervisor</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {state.conflictLog.map((log, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-indigo-300 font-semibold">{log.queueId} • {log.type}</span>
                  <span className="text-[10px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-slate-300">{log.conflictReason}</p>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Solusi: {log.resolution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
