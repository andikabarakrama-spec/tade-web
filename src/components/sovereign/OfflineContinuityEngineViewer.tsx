import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Plus, 
  Trash2,
  Sparkles,
  Zap
} from 'lucide-react';
import { OfflineContinuityEngine, PendingOfflineAction, OfflineSyncReport } from '../../core/sovereign/offlineContinuityEngine';

export const OfflineContinuityEngineViewer: React.FC = () => {
  const engine = OfflineContinuityEngine.getInstance();
  const [isOnline, setIsOnline] = useState<boolean>(() => engine.getNetworkStatus());
  const [queue, setQueue] = useState<PendingOfflineAction[]>(() => engine.getQueue());
  const [reports, setReports] = useState<OfflineSyncReport[]>(() => engine.getSyncReports());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<OfflineSyncReport | null>(null);

  // New action input state
  const [newEntityType, setNewEntityType] = useState<PendingOfflineAction['entityType']>('TAHFIDZ_PROGRESS');
  const [newSummary, setNewSummary] = useState('Input Setoran Surat Al-Mulk ayat 1-10');
  const [notification, setNotification] = useState<string | null>(null);

  const refreshData = () => {
    setIsOnline(engine.getNetworkStatus());
    setQueue(engine.getQueue());
    setReports(engine.getSyncReports());
  };

  const handleToggleNetwork = () => {
    const nextStatus = engine.toggleNetworkStatus();
    setIsOnline(nextStatus);
    setNotification(nextStatus ? 'Status Jaringan: ONLINE (Terhubung ke Gateway)' : 'Status Jaringan: OFFLINE (Beralih ke Antrean In-Memory)');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEnqueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;

    engine.enqueueAction(
      newEntityType,
      `ENT-${Date.now().toString(16).toUpperCase()}`,
      'CREATE',
      newSummary,
      { title: newSummary, timestamp: new Date().toISOString() },
      'GURU',
      'USR-GURU-CURRENT'
    );

    setNewSummary('');
    refreshData();
    setNotification(`Tindakan offline baru berhasil di-queue (Invarian SSoT terlindungi)`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRunSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const rep = engine.executeGradualSync();
      setActiveReport(rep);
      setIsSyncing(false);
      refreshData();
    }, 600);
  };

  const handleClearSynced = () => {
    engine.clearSynced();
    refreshData();
  };

  const queuedCount = queue.filter(q => q.status === 'QUEUED' || q.status === 'RETRYING' || q.status === 'RECONCILING').length;
  const syncedCount = queue.filter(q => q.status === 'SYNCED').length;

  return (
    <div className="space-y-6" id="offline-continuity-engine-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sovereign Operations
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R761 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Offline Continuity Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Penjamin kelancaran aplikasi saat jaringan terputus dengan antrean tindakan *in-memory*, pelacak status bertahap, dan detektor konflik tanpa *auto-overwrite* SSoT.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleNetwork}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border shadow-md ${
                isOnline 
                  ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-500/40'
              }`}
            >
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
              <span>Mode Jaringan: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            <button
              onClick={handleRunSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sinkronisasi Bertahap</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-slate-900 border border-sky-500/40 rounded-xl text-sky-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-sky-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* State Machine Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Pipeline Transisi State Kontinuitas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'ONLINE', desc: 'Jaringan aktif, transaksi langsung divalidasi ke SSoT', active: isOnline },
            { label: 'PENDING', desc: 'Transaksi dicatat di antrean in-memory lokal', active: !isOnline && queuedCount > 0 },
            { label: 'RETRY', desc: 'Percobaan sinkronisasi bertahap dengan backoff', active: isSyncing },
            { label: 'RECONCILE', desc: 'Verifikasi timestamp diff sebelum commit', active: queue.some(q => q.status === 'RECONCILING') },
            { label: 'SYNCED', desc: 'Data berhasil diselaraskan ke SSoT tanpa drift', active: syncedCount > 0 }
          ].map((st, idx) => (
            <div 
              key={st.label}
              className={`p-3 rounded-xl border transition ${
                st.active 
                  ? 'bg-sky-950/40 border-sky-500/50 text-white shadow-md' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                {st.active && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
              </div>
              <p className="text-xs font-bold text-sky-300">{st.label}</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Creator & Queue List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enqueue Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Simulasi Entri Tindakan Offline
            </h2>
          </div>

          <form onSubmit={handleEnqueue} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Kategori Entitas</label>
              <select
                value={newEntityType}
                onChange={e => setNewEntityType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="TAHFIDZ_PROGRESS">Tahfidz & Hafalan Santri</option>
                <option value="ATTENDANCE">Presensi Harian Rombel</option>
                <option value="INFAQ_PAYMENT">Pencatatan Infaq & Kas</option>
                <option value="ADAB_OBSERVATION">Observasi Adab & Akhlak</option>
                <option value="ACADEMIC_NOTE">Catatan Perkembangan Anak</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Deskripsi Ringkas Tindakan</label>
              <textarea
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                rows={3}
                placeholder="Contoh: Input setoran hafalan..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Simpan ke Antrean Lokal
            </button>
          </form>
        </div>

        {/* Queue Items */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white">Antrean Tindakan Lokal ({queue.length})</h2>
            </div>
            {syncedCount > 0 && (
              <button
                onClick={handleClearSynced}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Bersihkan yang Sudah Tersinkron
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {queue.map(item => {
              const isSynced = item.status === 'SYNCED';
              const isReconciling = item.status === 'RECONCILING';
              return (
                <div 
                  key={item.actionId}
                  className={`p-3.5 rounded-xl border transition ${
                    isSynced 
                      ? 'bg-slate-950/40 border-slate-800 opacity-75' 
                      : isReconciling 
                        ? 'bg-amber-950/20 border-amber-500/40' 
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400">{item.actionId}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                          {item.entityType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSynced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white mt-1">{item.payloadSummary}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">
                        Oleh: {item.performedByRole} &bull; Sidik Jari: {item.fingerprintHash.substring(0, 24)}...
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-400 block">
                        Retry: {item.retryCount}/{item.maxRetries}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
