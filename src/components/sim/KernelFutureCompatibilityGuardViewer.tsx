import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Cpu, 
  Sparkles, 
  FileCode, 
  RotateCcw,
  Compass
} from 'lucide-react';
import { guardianControlPlane, CompatibilityCheck } from '../../core/kernel/GuardianControlPlane';

export const KernelFutureCompatibilityGuardViewer: React.FC = () => {
  const [guards] = useState<CompatibilityCheck[]>(guardianControlPlane.getCompatibilityGuardStatus());

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                R604 &bull; KERNEL FUTURE COMPATIBILITY GUARD
              </span>
              <span className="text-xs text-slate-400 font-mono">RC Upstream Protection &bull; Zero Duplication</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Kernel Future Compatibility Guard &amp; Upstream Shield</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            6/6 Upstream Protections Active
          </span>
        </div>
      </div>

      {/* Upstream Protection Directives Grid */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          Upstream Compatibility Directives for Future Release Candidates:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guards.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-bold text-[10px]">
                    {g.layer}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {g.status}
                  </span>
                </div>
                <strong className="text-sm text-white block">{g.rule}</strong>
                <p className="text-[11px] text-slate-300 font-sans">
                  {g.protectionMechanism}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/40 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Protected against breaking changes in RC78+</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
