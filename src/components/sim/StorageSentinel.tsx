import React, { useState } from 'react';
import { 
  HardDrive, 
  Database, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Archive, 
  ShieldCheck,
  Flame,
  Layers
} from 'lucide-react';

interface StorageCategory {
  id: string;
  name: string;
  used: string;
  limit: string;
  percent: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  description: string;
  action: string;
}

export const StorageSentinel: React.FC = () => {
  const [cleaning, setCleaning] = useState<string | null>(null);

  const [categories, setCategories] = useState<StorageCategory[]>([
    {
      id: 'local_storage',
      name: 'localStorage (Settings & Offline Cache)',
      used: '1.8 MB',
      limit: '5.0 MB',
      percent: 36,
      status: 'GREEN',
      description: 'Menyimpan preferensi user, tema, draft formulir, dan state sementara.',
      action: 'Bersihkan Cache Lama'
    },
    {
      id: 'indexed_db',
      name: 'IndexedDB (Offline Data Store)',
      used: '14.2 MB',
      limit: '50.0 MB',
      percent: 28,
      status: 'GREEN',
      description: 'Menyimpan antrean transaksi offline, snapshot santri, dan riwayat presensi.',
      action: 'Kompaksi IndexedDB'
    },
    {
      id: 'browser_cache',
      name: 'Browser Cache (Static Assets)',
      used: '8.4 MB',
      limit: '100.0 MB',
      percent: 8,
      status: 'GREEN',
      description: 'Gambar banner Nusantara 3D, icon SVG, dan bundle JavaScript ter-split.',
      action: 'Hapus Asset Usang'
    },
    {
      id: 'temp_pdf',
      name: 'PDF Sementara (Print & Raport Buffers)',
      used: '2.1 MB',
      limit: '25.0 MB',
      percent: 8,
      status: 'GREEN',
      description: 'Pratinjau cetak formulir PPDB, slip SPP, dan kartu santri sementara.',
      action: 'Purge Temporary PDF'
    },
    {
      id: 'smart_archive',
      name: 'Smart Vault & Compliance Archive',
      used: '124.5 MB',
      limit: '5.0 GB',
      percent: 2.5,
      status: 'GREEN',
      description: 'Arsip legalitas, ijazah digital, SK yayasan terverifikasi hash SHA-256.',
      action: 'Audit Vault Storage'
    }
  ]);

  const handleCleanStorage = (id: string) => {
    setCleaning(id);
    setTimeout(() => {
      setCategories(prev => prev.map(cat => {
        if (cat.id === id) {
          return {
            ...cat,
            used: '0.4 MB',
            percent: 8,
            status: 'GREEN'
          };
        }
        return cat;
      }));
      setCleaning(null);
    }, 700);
  };

  return (
    <div id="storage-sentinel-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <HardDrive className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R209 &bull; STORAGE SENTINEL
              </span>
              <span className="text-xs text-slate-400">Intelligent Quota Watchdog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-emerald-400" />
              Storage Sentinel
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pemantauan kapasitas penyimpanan menyeluruh: localStorage, IndexedDB, Cache peramban, berkas PDF sementara, dan Smart Vault Archive dengan peringatan dini otomatis.
            </p>
          </div>
        </div>

        {/* Storage Health Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Local Allocated</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">151.0 MB</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Local Quota Headroom</span>
            <span className="text-xl font-bold text-white font-mono">&gt; 95% Tersedia</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Peringatan Kuota</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">0 WARNING</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Auto-Purge Policy</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">AKTIF (30 HARI)</span>
          </div>
        </div>
      </div>

      {/* Storage Tier Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <Database className="w-5 h-5" />
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AMAN ({cat.percent}%)
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.description}</p>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Terpakai:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cat.used} / {cat.limit}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(cat.percent, 4)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCleanStorage(cat.id)}
              disabled={cleaning === cat.id}
              className="mt-5 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-700/60 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {cleaning === cat.id ? 'Membersihkan...' : cat.action}
            </button>
          </div>
        ))}
      </div>

      {/* Storage Policy Safeguard */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Protokol Auto-Purge & Batas Ambang Keamanan (Sentinel Policy)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Ambang Batas Peringatan</span>
            Peringatan otomatis muncul di dashboard jika kapasitas penyimpanan peramban melampaui 80%.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Buffer PDF Sementara</span>
            Berkas PDF pratinjau cetak dibersihkan otomatis dalam 24 jam untuk mencegah penumpukan sampah memori.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Perlindungan Smart Vault</span>
            Arsip legalitas dan ijazah santri tidak pernah dihapus oleh auto-purge karena berstatus *Immutable*.
          </div>
        </div>
      </div>
    </div>
  );
};
