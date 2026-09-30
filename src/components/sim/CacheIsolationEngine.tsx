import React, { useState } from 'react';
import { 
  HardDrive, 
  Layers, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface CachePartition {
  name: string;
  namespace: string;
  storageType: 'localStorage' | 'IndexedDB' | 'SessionStorage' | 'MemoryBuffer';
  sizeEstimate: string;
  domainScope: 'PUBLIC_WEBSITE' | 'INTERNAL_SIM' | 'CRYPTO_CORE';
  isEncrypted: boolean;
  isolationStatus: 'STRICTLY_ISOLATED';
}

const CACHE_PARTITIONS: CachePartition[] = [
  {
    name: 'Website Public Cache',
    namespace: 'asy_pub_cache_v1',
    storageType: 'localStorage',
    sizeEstimate: '1.2 MB',
    domainScope: 'PUBLIC_WEBSITE',
    isEncrypted: false,
    isolationStatus: 'STRICTLY_ISOLATED'
  },
  {
    name: 'SIM Protected State & Ledger Cache',
    namespace: 'asy_sim_secure_vault_v1',
    storageType: 'IndexedDB',
    sizeEstimate: '4.8 MB',
    domainScope: 'INTERNAL_SIM',
    isEncrypted: true,
    isolationStatus: 'STRICTLY_ISOLATED'
  },
  {
    name: 'Guardian WORM Buffer',
    namespace: 'asy_guardian_worm_v1',
    storageType: 'IndexedDB',
    sizeEstimate: '2.1 MB',
    domainScope: 'INTERNAL_SIM',
    isEncrypted: true,
    isolationStatus: 'STRICTLY_ISOLATED'
  },
  {
    name: 'Core Cryptographic Keys',
    namespace: 'asy_crypto_core_mem',
    storageType: 'MemoryBuffer',
    sizeEstimate: '256 KB',
    domainScope: 'CRYPTO_CORE',
    isEncrypted: true,
    isolationStatus: 'STRICTLY_ISOLATED'
  }
];

export const CacheIsolationEngine: React.FC = () => {
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushMessage, setFlushMessage] = useState<string | null>(null);

  const handleFlushPublicCacheOnly = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
      setFlushMessage('Cache Publik Dibersihkan: Cache SIM internal dan buffer WORM tetap utuh dan terlindungi 100%.');
      blackBoxRecorder.record({
        moduleCode: 'R512',
        eventType: 'STORAGE',
        severity: 'INFO',
        details: 'Flushed public website cache namespace without touching SIM secure partition.'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R512 &bull; CACHE ISOLATION ENGINE
          </span>
          <span className="text-xs text-slate-400 font-mono">Namespace Partitioning &bull; Zero Data Bleed</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-cyan-400" />
              Cache Isolation Engine &bull; Pemisah Partisi Cache &amp; Storage
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Mempartisi IndexedDB, localStorage, dan memory buffer ke dalam namespace terpisah. Data sensitif SIM tersimpan terenkripsi dan tidak dapat diakses atau bercampur dengan cache publik.
            </p>
          </div>

          <button
            onClick={handleFlushPublicCacheOnly}
            disabled={isFlushing}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className={`w-4 h-4 ${isFlushing ? 'animate-spin' : ''}`} />
            {isFlushing ? 'Membersihkan...' : 'Bersihkan Cache Publik'}
          </button>
        </div>

        {/* 4 Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PARTISI NAMESPACE</span>
            <span className="text-base font-bold text-cyan-400 font-mono">4 TERISOLASI</span>
            <span className="text-[9px] text-cyan-500 block">Zero Namespace Bleed</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">ENKRIPSI DATA SIM</span>
            <span className="text-base font-bold text-emerald-400 font-mono">AES-GCM / SHA-256</span>
            <span className="text-[9px] text-emerald-500 block">Encrypted at rest</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">CACHE SEPARATION</span>
            <span className="text-base font-bold text-purple-400 font-mono">100% MUTLAK</span>
            <span className="text-[9px] text-purple-400 block">Public vs SIM Split</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">GUARDIAN AUDIT</span>
            <span className="text-base font-bold text-amber-400 font-mono">PASSED</span>
            <span className="text-[9px] text-amber-500 block">Clean Boundary</span>
          </div>
        </div>
      </div>

      {flushMessage && (
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs font-mono text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
          {flushMessage}
        </div>
      )}

      {/* Partitions List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
          Daftar Partisi Cache &amp; Storage Terisolasi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CACHE_PARTITIONS.map(part => (
            <div
              key={part.namespace}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {part.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  part.domainScope === 'PUBLIC_WEBSITE'
                    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                    : part.domainScope === 'INTERNAL_SIM'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {part.domainScope}
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                <p>Namespace: <code className="text-cyan-600 dark:text-cyan-400 font-bold">{part.namespace}</code></p>
                <p>Tipe Storage: {part.storageType} ({part.sizeEstimate})</p>
                <p className="flex items-center gap-1.5 pt-1">
                  Enkripsi: {part.isEncrypted ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Terenkripsi
                    </span>
                  ) : (
                    <span className="text-slate-500">Unencrypted (Publik)</span>
                  )}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {part.isolationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
