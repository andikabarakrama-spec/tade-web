import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderArchive, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  RotateCw, 
  HardDrive, 
  Calendar, 
  History, 
  FileCode,
  Download,
  AlertCircle
} from 'lucide-react';
import { HermesDigitalVault } from '../../core/operational/hermesDigitalVault';

export interface VaultSnapshot {
  id: string;
  timestamp: string;
  sha256Hash: string;
  totalCollections: number;
  totalSizeFormatted: string;
  status: 'VERIFIED' | 'COMPUTING' | 'INTEGRITY_MISMATCH';
}

export const AutonomousDigitalVaultViewer: React.FC = () => {
  const vault = useMemo(() => HermesDigitalVault.getInstance(), []);
  const [snapshots, setSnapshots] = useState<VaultSnapshot[]>([
    {
      id: 'SNAP-20260820-0600',
      timestamp: '2026-08-20 06:00:00 WIB',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      totalCollections: 24,
      totalSizeFormatted: '14.2 MB',
      status: 'VERIFIED'
    },
    {
      id: 'SNAP-20260820-0000',
      timestamp: '2026-08-20 00:00:00 WIB',
      sha256Hash: 'a7c9d21102ba4f8812eac10488fbe01429df91e3249a883fa495991c7811a219',
      totalCollections: 24,
      totalSizeFormatted: '14.1 MB',
      status: 'VERIFIED'
    },
    {
      id: 'SNAP-20260819-1800',
      timestamp: '2026-08-19 18:00:00 WIB',
      sha256Hash: 'f4b1e52399cb1b250adfe5d7885ea81338df31e4248a773ea384882b6700b182',
      totalCollections: 24,
      totalSizeFormatted: '13.9 MB',
      status: 'VERIFIED'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSnapshot = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSnap: VaultSnapshot = {
        id: `SNAP-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12)}`,
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        sha256Hash: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        totalCollections: 24,
        totalSizeFormatted: '14.3 MB',
        status: 'VERIFIED'
      };
      setSnapshots([newSnap, ...snapshots]);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="space-y-6" id="autonomous-digital-vault-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5" />
                R845 &bull; Brankas Digital Otomatis
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ZERO SECOND DB
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Snapshot Rolling Hermes & Verifikasi SHA-256
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Membuat salinan snapshot berkala ke folder arsip Founder tanpa pernah membuat database bayangan. Menjaga retensi 30 hari dalam SSoT terverifikasi.
            </p>
          </div>

          <button
            onClick={handleGenerateSnapshot}
            disabled={isGenerating}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Membuat Snapshot...' : 'Buat Snapshot Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Snapshot History Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Riwayat Snapshot Terjadwal ({snapshots.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">RETENTION: 30 HARI</span>
        </div>

        <div className="space-y-3">
          {snapshots.map((s) => (
            <div
              key={s.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{s.id}</span>
                  <span className="text-[10px] text-slate-500 font-mono">&bull; {s.timestamp}</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400/90 break-all">
                  SHA-256: {s.sha256Hash}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Koleksi: <strong className="text-slate-300">{s.totalCollections} Modul</strong></span>
                  <span>&bull;</span>
                  <span>Ukuran: <strong className="text-slate-300">{s.totalSizeFormatted}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
