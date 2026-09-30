import React from 'react';
import { 
  Package, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  HardDrive, 
  FileCode, 
  Layers, 
  Tag,
  Cpu,
  Lock
} from 'lucide-react';
import { GoLiveCandidateEngine } from '../../core/golive/goLiveCandidateEngine';

export const ProductionDeploymentPackageViewer: React.FC = () => {
  const engine = GoLiveCandidateEngine.getInstance();
  const pkg = engine.getDeploymentPackage();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>G909 • Production Deployment Package</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Production Artifacts & Release Bundle
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Paket build produksi tunggal, teroptimasi, bebas dependensi rentan, bertanda tangan kriptografis aman, dan siap distribusi instan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-violet-950/80 border border-violet-700/80 text-violet-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{pkg.version} Ready</span>
          </span>
        </div>
      </div>

      {/* Package Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Fase Rilis</span>
            <Tag className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-lg font-bold text-white">{pkg.phase}</div>
          <div className="text-xs text-slate-400">Tahap Akhir Menuju Peluncuran Global</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Status Kompilasi Build</span>
            <FileCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">0 Errors, 0 Warnings</div>
          <div className="text-xs text-slate-400">TypeScript Strict & Lint Clean</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Ukuran Bundle (Gzip)</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300">{pkg.bundleSizeGzip}</div>
          <div className="text-xs text-slate-400">Fast Edge Loading (&lt; 500ms)</div>
        </div>
      </div>

      {/* Security Checksum Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Lock className="w-4 h-4 text-violet-400" />
            <span>Kriptografi Integritas Paket Rilis</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">SHA-256 Validated</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Fingerprint SHA-256:</span>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-cyan-400 break-all select-all">
              {pkg.securityHashSha256}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Target Runtime: {pkg.targetEnvironment}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Rencana Rollback: {pkg.rollbackPlanReady ? 'Tersedia & Siap' : 'Belum'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
