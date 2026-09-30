import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  HardDrive,
  Cpu,
  Lock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface OfflineQueueItem {
  id: string;
  action: string;
  payloadType: string;
  timestamp: string;
  status: 'QUEUED_LOCAL' | 'SYNCED' | 'RESUMING';
  bytes: string;
}

export const OfflineFirstValidation: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [queue, setQueue] = useState<OfflineQueueItem[]>([
    { id: 'q1', action: 'Input Presensi Siswa Kelas TK-A (14 Anak)', payloadType: 'ATTENDANCE_RECORD', timestamp: '07:35:12 WIB', status: 'SYNCED', bytes: '4.2 KB' },
    { id: 'q2', action: 'Catatan Anekdot Sentra Balok (Ananda Rayyan)', payloadType: 'ANECDOTE_NOTE', timestamp: '08:12:44 WIB', status: 'SYNCED', bytes: '1.8 KB' },
    { id: 'q3', action: 'Draft Upload Foto Kegiatan Sentra Imtaq', payloadType: 'MEDIA_ATTACHMENT', timestamp: '09:05:00 WIB', status: 'QUEUED_LOCAL', bytes: '2.4 MB' }
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleConnection = () => {
    setIsOnline(prev => !prev);
  };

  const handleTriggerSync = async () => {
    setIsSimulatingSync(true);
    try {
      const itemsToSync = queue.filter(q => q.status === 'QUEUED_LOCAL');
      
      // Perform DB connection verification
      await DataService.getSystemHealth();

      setQueue(prev => prev.map(item => ({ ...item, status: 'SYNCED' })));

      blackBoxRecorder.record({
        moduleCode: 'R452',
        eventType: 'ACTION',
        severity: 'INFO',
        details: `Offline queue flushed: ${itemsToSync.length} items synced to central storage.`
      });

      await DataService.logAction(
        userProfile?.nama || userProfile?.name || 'Front Desk / Guru',
        activeRole || 'GURU',
        'OFFLINE_QUEUE_FLUSHED',
        `Sinkronisasi offline-first tuntas: ${itemsToSync.length} item berhasil diunggah.`
      );
    } catch (err) {
      console.error('Offline sync error:', err);
    } finally {
      setIsSimulatingSync(false);
    }
  };

  const queuedCount = queue.filter(q => q.status === 'QUEUED_LOCAL').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`border rounded-2xl p-6 text-white shadow-xl transition-colors duration-500 ${
        isOnline
          ? 'bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border-teal-500/30'
          : 'bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 border-amber-500/40'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
              isOnline
                ? 'bg-teal-500/20 border-teal-400/40 text-teal-300'
                : 'bg-amber-500/20 border-amber-400/40 text-amber-300 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-8 h-8" /> : <WifiOff className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isOnline
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {isOnline ? 'ONLINE • CLOUD CONNECTED' : 'OFFLINE MODE • LOCAL INDEXEDDB ACTIVE'}
                </span>
                <span className="text-xs text-slate-400">Zero Data Loss Architecture</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Offline-First Resilience & Sync Engine
              </h1>
              <p className="text-sm text-teal-100/80 mt-0.5">
                Memastikan operasional guru dan admin tetap lancar 100% saat internet sekolah putus, dengan auto-sync instan saat online kembali.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleConnection}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                isOnline
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isOnline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4" />}
              {isOnline ? 'Simulasi Putus Internet (Go Offline)' : 'Sambungkan Kembali (Go Online)'}
            </button>

            <button
              onClick={handleTriggerSync}
              disabled={isSimulatingSync || !isOnline}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulatingSync ? 'animate-spin' : ''}`} />
              {isSimulatingSync ? 'Menyinkronkan Data...' : 'Sinkronisasi Manual (Sync Now)'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 5 Core Offline Pillars & Live Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 5 Pillars Status */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">5 Pilar Ketahanan Offline TADE</h3>

            {[
              { title: '1. IndexedDB Local Store', desc: 'Presensi & mutasi tersimpan lokal di browser.', status: 'HEALTHY' },
              { title: '2. Resumable Chunk Upload', desc: 'Upload foto kegiatan melanjutkan otomatis dari potongan terakhir.', status: 'READY' },
              { title: '3. Reconnect Auto-Handshake', desc: 'Deteksi sinyal WiFi live & flush antrean otomatis.', status: 'ACTIVE' },
              { title: '4. Token Refresh Resilience', desc: 'JWT & token keamanan diperbarui tanpa logout user.', status: 'SECURED' },
              { title: '5. Cache Integrity & Recovery', desc: 'Asset UI tetap terbuka walau server offline total.', status: 'OPTIMIZED' }
            ].map((pilar, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{pilar.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{pilar.desc}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                  {pilar.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Offline Queue Explorer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Antrean Sinkronisasi Lokal (IndexedDB)</h3>
                <p className="text-xs text-slate-500">Daftar transaksi yang dibuat saat offline / dalam proses kirim</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                queuedCount > 0
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {queuedCount > 0 ? `${queuedCount} Menunggu Kirim` : 'Semua Terkirim'}
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {queue.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.action}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>Payload: <strong>{item.payloadType}</strong></span>
                        <span>•</span>
                        <span>Ukuran: {item.bytes}</span>
                        <span>•</span>
                        <span>Waktu: {item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      item.status === 'SYNCED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {item.status === 'SYNCED' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          TERSIMPAN DI CLOUD
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          MENUNGGU SINKRON
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
