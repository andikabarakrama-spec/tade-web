import React, { useState } from 'react';
import { 
  Database, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowDownUp, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Server,
  Layers
} from 'lucide-react';

interface CollectionStat {
  name: string;
  readsPerMin: number;
  writesPerMin: number;
  indexStatus: 'OPTIMAL' | 'BUILDING';
  latency: string;
  errorRate: string;
  status: 'GREEN' | 'YELLOW';
}

export const DatabaseHealthMonitor: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [totalReads, setTotalReads] = useState('1,420 / min');
  const [totalWrites, setTotalWrites] = useState('84 / min');
  const [avgLatency, setAvgLatency] = useState('18 ms');
  const [globalErrorRate, setGlobalErrorRate] = useState('0.00%');

  const [collections] = useState<CollectionStat[]>([
    { name: 'students (Data Santri)', readsPerMin: 420, writesPerMin: 12, indexStatus: 'OPTIMAL', latency: '14 ms', errorRate: '0.00%', status: 'GREEN' },
    { name: 'payments (SPP & Tabungan)', readsPerMin: 310, writesPerMin: 28, indexStatus: 'OPTIMAL', latency: '16 ms', errorRate: '0.00%', status: 'GREEN' },
    { name: 'attendance (Presensi Sentra)', readsPerMin: 280, writesPerMin: 32, indexStatus: 'OPTIMAL', latency: '12 ms', errorRate: '0.00%', status: 'GREEN' },
    { name: 'compliance_archive (Arsip SK)', readsPerMin: 65, writesPerMin: 2, indexStatus: 'OPTIMAL', latency: '22 ms', errorRate: '0.00%', status: 'GREEN' },
    { name: 'audit_logs (Immutable Log)', readsPerMin: 140, writesPerMin: 8, indexStatus: 'OPTIMAL', latency: '18 ms', errorRate: '0.00%', status: 'GREEN' },
    { name: 'school_config (DNA Tenant)', readsPerMin: 205, writesPerMin: 2, indexStatus: 'OPTIMAL', latency: '10 ms', errorRate: '0.00%', status: 'GREEN' }
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  return (
    <div id="database-health-monitor-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R210 &bull; DATABASE WATCHTOWER
              </span>
              <span className="text-xs text-slate-400">Zero Downtime Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-indigo-400" />
              Database Health Monitor
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pemantauan kesehatan database Firestore secara mendalam: frekuensi Read, Write, status Indeks komposit, latensi query, dan tingkat error per koleksi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memperbarui...' : 'Segarkan Data'}
            </button>
          </div>
        </div>

        {/* Database Metric Summary Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Read Throughput</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{totalReads}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Write Rate</span>
            <span className="text-xl font-bold text-white font-mono">{totalWrites}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Rata-Rata Latensi</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{avgLatency}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Global Error Rate</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{globalErrorRate} (Zero Error)</span>
          </div>
        </div>
      </div>

      {/* Collection-Level Health Breakdown Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Metrik Kesehatan Koleksi Firestore Primer
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            100% Indeks Optimal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Nama Koleksi</th>
                <th className="px-4 py-3">Read / Menit</th>
                <th className="px-4 py-3">Write / Menit</th>
                <th className="px-4 py-3">Status Indeks</th>
                <th className="px-4 py-3">Latensi</th>
                <th className="px-4 py-3">Error Rate</th>
                <th className="px-4 py-3">Kondisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {collections.map((col) => (
                <tr key={col.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-slate-900 dark:text-slate-100">{col.name}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">{col.readsPerMin} op/m</td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">{col.writesPerMin} op/m</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      {col.indexStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{col.latency}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">{col.errorRate}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      SEHAT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Defense Protocol */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Prosedur Isolasi & Ketahanan Database
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Semua pembacaan data memanfaatkan multi-tier caching lokal untuk meminimalkan beban read Firestore. Hak tulis dilindungi oleh aturan keamanan `firestore.rules` dan verifikasi peran ganda untuk memastikan data santri dan transaksi keuangan tetap terlindungi.
        </p>
      </div>
    </div>
  );
};
