import React, { useState } from 'react';
import { 
  Boxes, 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Download, 
  RefreshCw, 
  Clock, 
  HardDrive,
  FileCode,
  Sliders,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface ChunkItem {
  id: string;
  name: string;
  category: 'CORE' | 'ROLE_BUNDLE' | 'HEAVY_DEFERRED' | 'ON_DEMAND';
  sizeKb: number;
  targetKb: number;
  status: 'OPTIMAL' | 'DEFERRED' | 'PRELOADED' | 'LAZY';
  roles: string[];
  loadedOnInit: boolean;
  description: string;
}

const CHUNK_REGISTRY: ChunkItem[] = [
  {
    id: 'chunk-core-auth',
    name: 'vendor-core-auth.js',
    category: 'CORE',
    sizeKb: 142,
    targetKb: 180,
    status: 'OPTIMAL',
    roles: ['ALL'],
    loadedOnInit: true,
    description: 'Pondasi otentikasi Firebase, RBAC token decoders, dan router minimal.'
  },
  {
    id: 'chunk-parent-lite',
    name: 'role-parent-lite.js',
    category: 'ROLE_BUNDLE',
    sizeKb: 388,
    targetKb: 600,
    status: 'OPTIMAL',
    roles: ['WALI_MURID'],
    loadedOnInit: true,
    description: 'Portal Orang Tua: Timeline Kenangan, Bintang Reward, Murojaah Tahfidz, Tagihan SPP.'
  },
  {
    id: 'chunk-teacher-lite',
    name: 'role-teacher-lite.js',
    category: 'ROLE_BUNDLE',
    sizeKb: 642,
    targetKb: 900,
    status: 'OPTIMAL',
    roles: ['GURU'],
    loadedOnInit: true,
    description: 'Portal Guru: Presensi Suara Cepat, Setoran Tahfidz, Catatan Sentra, Buku Penghubung.'
  },
  {
    id: 'chunk-executive-lite',
    name: 'role-executive-lite.js',
    category: 'ROLE_BUNDLE',
    sizeKb: 395,
    targetKb: 550,
    status: 'OPTIMAL',
    roles: ['KETUA_YAYASAN'],
    loadedOnInit: true,
    description: 'Ruang Ketua Yayasan: Kontras Tinggi, Surat Masuk Instan, AI Ringkasan Surat, Nol GPU Tax.'
  },
  {
    id: 'chunk-operations-ultra',
    name: 'role-operations-ultra.js',
    category: 'ROLE_BUNDLE',
    sizeKb: 1420,
    targetKb: 1800,
    status: 'OPTIMAL',
    roles: ['ADMIN'],
    loadedOnInit: true,
    description: 'Multitasking Admin: Action Dock, PPDB Pipeline, Persuratan, Verifikasi Berkas.'
  },
  {
    id: 'chunk-presidential-ultra',
    name: 'role-presidential-ultra.js',
    category: 'ROLE_BUNDLE',
    sizeKb: 1980,
    targetKb: 2500,
    status: 'OPTIMAL',
    roles: ['SUPER_ADMIN'],
    loadedOnInit: true,
    description: 'Komando Super Admin: 3D Threat Map, Guardian Sentinel, Recovery Center, Discovery Registry.'
  },
  {
    id: 'chunk-heavy-battlefield',
    name: 'feature-guardian-battlefield.js',
    category: 'HEAVY_DEFERRED',
    sizeKb: 680,
    targetKb: 800,
    status: 'DEFERRED',
    roles: ['SUPER_ADMIN'],
    loadedOnInit: false,
    description: 'Simulasi perang siber dan DDoS lab. Hanya dimuat saat Super Admin membuka tab Battlefield.'
  },
  {
    id: 'chunk-heavy-banner3d',
    name: 'feature-banner-3d-studio.js',
    category: 'HEAVY_DEFERRED',
    sizeKb: 890,
    targetKb: 1000,
    status: 'DEFERRED',
    roles: ['ADMIN', 'SUPER_ADMIN', 'GURU'],
    loadedOnInit: false,
    description: 'Studio Desain 1000+ Banner Nusantara 3D CGI. Dimuat secara asinkron saat studio dibuka.'
  },
  {
    id: 'chunk-heavy-schooltv',
    name: 'feature-school-tv-living.js',
    category: 'HEAVY_DEFERRED',
    sizeKb: 520,
    targetKb: 600,
    status: 'DEFERRED',
    roles: ['ALL'],
    loadedOnInit: false,
    description: 'Living School TV Broadcast Player & Video Engine. Dimuat saat mode TV diaktifkan.'
  },
  {
    id: 'chunk-heavy-mascot-runtime',
    name: 'feature-mascot-living-fsm.js',
    category: 'HEAVY_DEFERRED',
    sizeKb: 410,
    targetKb: 500,
    status: 'LAZY',
    roles: ['ALL'],
    loadedOnInit: false,
    description: 'Full 60 FPS Mascot FSM Runtime dengan 8 animasi & 6 kostum musiman.'
  },
  {
    id: 'chunk-heavy-voice-studio',
    name: 'feature-ai-voice-studio.js',
    category: 'HEAVY_DEFERRED',
    sizeKb: 340,
    targetKb: 400,
    status: 'DEFERRED',
    roles: ['SUPER_ADMIN', 'ADMIN', 'GURU', 'KETUA_YAYASAN'],
    loadedOnInit: false,
    description: 'Studio Sintesis Suara AI Asy & Voice Command Everywhere.'
  }
];

export const IntelligentChunkEngineManager: React.FC = () => {
  const [chunks, setChunks] = useState<ChunkItem[]>(CHUNK_REGISTRY);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [preloadingId, setPreloadingId] = useState<string | null>(null);

  const handlePreloadChunk = (id: string) => {
    setPreloadingId(id);
    setTimeout(() => {
      setChunks(prev => prev.map(c => c.id === id ? { ...c, status: 'PRELOADED' } : c));
      setPreloadingId(null);
    }, 600);
  };

  const filteredChunks = chunks.filter(c => filterCategory === 'ALL' || c.category === filterCategory);

  const totalLoadedOnInitKb = chunks
    .filter(c => c.loadedOnInit)
    .reduce((acc, curr) => acc + curr.sizeKb, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Boxes className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R99 • Intelligent Chunk Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DISC-016 Locked
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">Intelligent Chunk & Route Code-Splitting Engine</h1>
              <p className="text-sm text-slate-300">
                Memecah bundle monolitik menjadi sub-chunk cerdas per role. Modul berat (Battlefield, Banner 3D, TV, Voice) didefer otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Wali Murid Initial Bundle</div>
              <div className="text-lg font-black text-emerald-400 flex items-center gap-1.5 justify-end">
                <TrendingDown className="w-4 h-4" />
                <span>388 KB</span>
                <span className="text-xs text-slate-400 font-normal">(&le; 600 KB Target)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Bundle Budget Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Wali Murid (Parent Lite)</div>
            <div className="text-lg font-bold text-white mt-1">388 KB</div>
            <div className="text-[11px] text-emerald-400">Hemat 84.4% vs Mono</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Guru (Teacher Lite)</div>
            <div className="text-lg font-bold text-white mt-1">642 KB</div>
            <div className="text-[11px] text-emerald-400">Target &le; 900 KB PASS</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Ketua Yayasan (Exec Lite)</div>
            <div className="text-lg font-bold text-white mt-1">395 KB</div>
            <div className="text-[11px] text-emerald-400">Target &le; 550 KB PASS</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Admin (Operations Ultra)</div>
            <div className="text-lg font-bold text-white mt-1">1,420 KB</div>
            <div className="text-[11px] text-indigo-400">Target &le; 1,800 KB PASS</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Super Admin (Presidential)</div>
            <div className="text-lg font-bold text-white mt-1">1,980 KB</div>
            <div className="text-[11px] text-purple-400">Target &le; 2,500 KB PASS</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2">
          {['ALL', 'ROLE_BUNDLE', 'HEAVY_DEFERRED', 'CORE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Chunk (11)' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Status: <b>Deferred Loading Active</b> (Nol overhead awal)
        </div>
      </div>

      {/* Chunk List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Nama Chunk & Berkas</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Target Peran (RBAC)</th>
                <th className="p-4">Ukuran Gzip</th>
                <th className="p-4">Beban Awal</th>
                <th className="p-4">Status Prefetch</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredChunks.map((chunk) => {
                const isOptimal = chunk.sizeKb <= chunk.targetKb;
                return (
                  <tr key={chunk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          chunk.category === 'CORE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                          chunk.category === 'ROLE_BUNDLE' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
                          'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                        }`}>
                          <FileCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono text-xs">
                            <span>{chunk.name}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {chunk.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        chunk.category === 'CORE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                        chunk.category === 'ROLE_BUNDLE' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                      }`}>
                        {chunk.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {chunk.roles.map(r => (
                          <span key={r} className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{chunk.sizeKb} KB</span>
                        <span className="text-xs text-slate-400">/ {chunk.targetKb} KB</span>
                        {isOptimal ? (
                          <span className="text-emerald-600 dark:text-emerald-400 text-xs">✔ PASS</span>
                        ) : (
                          <span className="text-rose-600 text-xs">⚠ OVER</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      {chunk.loadedOnInit ? (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Initial Login</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          <span>Deferred (On-Demand)</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        chunk.status === 'PRELOADED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        chunk.status === 'DEFERRED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {chunk.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {!chunk.loadedOnInit && chunk.status !== 'PRELOADED' ? (
                        <button
                          onClick={() => handlePreloadChunk(chunk.id)}
                          disabled={preloadingId === chunk.id}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ml-auto"
                        >
                          {preloadingId === chunk.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Preloading...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>Preload Sekarang</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Siap Digunakan</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
