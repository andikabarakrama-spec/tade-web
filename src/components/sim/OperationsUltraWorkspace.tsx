import React, { useState } from 'react';
import { 
  Laptop, 
  Zap, 
  Palette, 
  QrCode, 
  Printer, 
  MessageSquare, 
  Tv, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  Cpu, 
  Maximize2,
  Sparkles,
  Activity,
  FileText
} from 'lucide-react';

interface SubAppTile {
  id: string;
  name: string;
  category: string;
  icon: any;
  status: 'READY' | 'ACTIVE' | 'PROCESSING';
  description: string;
  throughput: string;
  targetModule: string;
}

const OPERATIONS_FLEET: SubAppTile[] = [
  {
    id: 'op-banner-3d',
    name: 'Living Banner Nusantara 3D Studio',
    category: 'CGI 3D Media',
    icon: Palette,
    status: 'ACTIVE',
    throughput: '1000+ Varian Banner',
    targetModule: 'r98',
    description: 'Studio pembuatan spanduk panggung, haflah, dan banner promosi TK dengan 3D rendering aktif.'
  },
  {
    id: 'op-qr-universal',
    name: 'Universal QR Evolution Studio',
    category: 'Security & Auth',
    icon: QrCode,
    status: 'ACTIVE',
    throughput: 'HMAC-SHA256 Multi-Expiry',
    targetModule: 'r106',
    description: 'Penerbitan QR Rapat, Event, PPDB, Tamu, Guru, dan Dokumen berbatas waktu dinamis.'
  },
  {
    id: 'op-messenger',
    name: 'Living Messenger Enterprise',
    category: 'Communication',
    icon: MessageSquare,
    status: 'ACTIVE',
    throughput: '500+ Dek Asy Stickers',
    targetModule: 'r104',
    description: 'Pusat komunikasi resmi sekolah, broadcast wali murid, dan chat koordinasi dewan guru.'
  },
  {
    id: 'op-school-tv',
    name: 'School TV Living Broadcast Channel',
    category: 'Digital Signage',
    icon: Tv,
    status: 'READY',
    throughput: '60 FPS Continuous Loop',
    targetModule: 'r107',
    description: 'Siaran TV lobi sekolah dengan Dek Asy host virtual, countdown acara, dan radar cuaca.'
  },
  {
    id: 'op-action-dock',
    name: 'Contextual AI Operations Dock',
    category: 'Workflow Automation',
    icon: Zap,
    status: 'ACTIVE',
    throughput: '5-Stage Auto Pipeline',
    targetModule: 'r97',
    description: 'Pipeline 1-klik untuk intake PPDB, verifikasi berkas, persuratan, dan notifikasi WA.'
  },
  {
    id: 'op-print-center',
    name: 'Guardian Batch Print Center',
    category: 'Physical Production',
    icon: Printer,
    status: 'READY',
    throughput: 'High-DPI Label & ID Cards',
    targetModule: 'r86',
    description: 'Cetak massal kartu pelajar santri, barcode inventaris, sertifikat tahfidz, dan map rapor.'
  }
];

export const OperationsUltraWorkspace: React.FC<{ onSelectModule?: (mod: string) => void }> = ({ onSelectModule }) => {
  const [activeFleet] = useState<SubAppTile[]>(OPERATIONS_FLEET);
  const [gpuLoad] = useState<number>(34);
  const [workerThreads] = useState<number>(8);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Laptop className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R102 • Operations Ultra Mode
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ASUS ROG GL503GE Calibrated
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">Admin Operations High-Throughput Dock</h1>
              <p className="text-sm text-slate-300">
                Memanfaatkan daya multi-core dan akselerasi WebGL laptop admin untuk multitasking studio media, QR, percetakan, dan persuratan simultan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Multithreading Hardware</div>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <Cpu className="w-4 h-4" />
                <span>{workerThreads} Worker Threads Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Hardware Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">GPU Hardware Accel</div>
            <div className="text-lg font-bold text-white mt-1">NVIDIA GTX 1050 Ti</div>
            <div className="text-[11px] text-emerald-400">WebGL 2.0 Enabled</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Beban GPU Simultan</div>
            <div className="text-lg font-bold text-indigo-300 mt-1">{gpuLoad}% Utilization</div>
            <div className="text-[11px] text-slate-400">Target &lt; 75% Optimal</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Active Dock Modules</div>
            <div className="text-lg font-bold text-white mt-1">6 Sub-Engines</div>
            <div className="text-[11px] text-emerald-400">Zero Lag Multi-Tasking</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Memory Budget Status</div>
            <div className="text-lg font-bold text-white mt-1">1,420 KB Bundle</div>
            <div className="text-[11px] text-emerald-400">Passed Budget &le; 1.8 MB</div>
          </div>
        </div>
      </div>

      {/* Grid of Operations Engines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeFleet.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {tile.throughput}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tile.name}
                </h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {tile.category}
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {tile.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">
                  {tile.targetModule.toUpperCase()}
                </span>

                <button
                  onClick={() => onSelectModule && onSelectModule(tile.targetModule)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Buka Dock</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
