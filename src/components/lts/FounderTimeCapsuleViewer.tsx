import React, { useState } from 'react';
import { 
  Archive, 
  ShieldCheck, 
  FileCode, 
  FolderTree, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Key, 
  Download,
  Terminal
} from 'lucide-react';
import { 
  founderTimeCapsule, 
  TimeCapsuleEntry 
} from '../../core/lts/FounderTimeCapsule';

export const FounderTimeCapsuleViewer: React.FC = () => {
  const [capsule, setCapsule] = useState<TimeCapsuleEntry>(() => founderTimeCapsule.getLatestCapsule());
  const [copiedSeal, setCopiedSeal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleCopySeal = () => {
    navigator.clipboard.writeText(capsule.founderSeal);
    setCopiedSeal(true);
    setTimeout(() => setCopiedSeal(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(founderTimeCapsule.exportCapsuleJson(capsule.capsuleId));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div id="founder-time-capsule-panel" className="space-y-6">
      {/* Milestone Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950/80 border border-indigo-500/30 backdrop-blur-md relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Archive className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100 font-mono">{capsule.capsuleId}</h2>
            </div>
            <p className="text-sm text-slate-300">{capsule.milestoneName}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySeal}
              id="btn-copy-founder-seal"
              className="px-3.5 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copiedSeal ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5" />}
              {copiedSeal ? 'Seal Tersalin' : 'Copy Founder Seal'}
            </button>
            <button
              onClick={handleCopyJson}
              id="btn-export-time-capsule-json"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedJson ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              {copiedJson ? 'JSON Tersalin' : 'Ekspor Snapshot JSON'}
            </button>
          </div>
        </div>

        {/* Cryptographic Seal Display */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>CRYPTOGRAPHIC FOUNDER SEAL:</span>
            <span className="text-emerald-400">READ-ONLY IMMUTABLE</span>
          </div>
          <div className="text-indigo-300 font-bold break-all">{capsule.founderSeal}</div>
        </div>
      </div>

      {/* Snapshot High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-capsule-discoveries" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Manifest Discoveries</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{capsule.totalRegisteredDiscoveries}</p>
          <span className="text-xs text-emerald-400 font-medium">{capsule.discoveryManifestVersion}</span>
        </div>

        <div id="metric-capsule-guardian" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Guardian Ring-0</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-slate-100 mt-2 font-mono">A+ INTEGRITY</p>
          <span className="text-xs text-indigo-400 font-medium">Autonomous Sentinel</span>
        </div>

        <div id="metric-capsule-ai-asy" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">AI Asy Prime Minister</span>
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg font-bold text-slate-100 mt-2 font-mono truncate">Bounded Civilian</p>
          <span className="text-xs text-cyan-400 font-medium">Strict Boundary Lock (True)</span>
        </div>

        <div id="metric-capsule-lts-target" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">LTS Target Horizon</span>
            <Archive className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{capsule.buildMetadata.ltsTargetYear}</p>
          <span className="text-xs text-amber-400 font-medium">10-Year Enterprise Longevity</span>
        </div>
      </div>

      {/* Hash Digests & Structural Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hashes & Contracts */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">Cryptographic Invariants & Hashes</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-sans font-medium text-[11px]">Constitution 22 Invariants Hash:</span>
              <div className="text-indigo-300 font-mono text-[11px] break-all">{capsule.constitution22InvariantsHash}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-sans font-medium text-[11px]">Dependency Lock Baseline Digest:</span>
              <div className="text-cyan-300 font-mono text-[11px] break-all">{capsule.dependencyLockHash}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-sans font-medium text-[11px]">Build Runtime Target:</span>
              <div className="text-slate-300 text-[11px]">{capsule.buildMetadata.framework} ({capsule.buildMetadata.buildTarget})</div>
            </div>
          </div>
        </div>

        {/* Folder Map Topology */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FolderTree className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100">Folder Map Topology</h3>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {capsule.folderMapTopology.map((folder, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-slate-200">{folder.path}</div>
                  <div className="text-[11px] text-slate-400">{folder.role}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {folder.submoduleCount} modules
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
