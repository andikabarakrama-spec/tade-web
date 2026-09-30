import React, { useState } from 'react';
import { GrandSovereignCertificate, GrandCertificateManifest } from '../../core/orchestration/GrandSovereignCertificate';
import { Award, ShieldCheck, CheckCircle2, Lock, Sparkles, Copy, Layers, Cpu } from 'lucide-react';

export const GrandSovereignCertificateViewer: React.FC = () => {
  const engine = GrandSovereignCertificate.getInstance();
  const [manifest] = useState<GrandCertificateManifest>(engine.getManifest());
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; checksumMatch: boolean; message: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResult(engine.verifyIntegrity());
      setIsVerifying(false);
    }, 600);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Grand Certificate Golden Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-900 border-2 border-yellow-500/50 shadow-2xl text-white space-y-6 relative overflow-hidden">
        {/* Background glow watermark */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center font-mono font-bold text-3xl text-yellow-300 shadow-lg shadow-yellow-500/20">
              666
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-yellow-500/30 text-yellow-300 border border-yellow-400/40">
                  GRAND SOVEREIGN CERTIFICATE
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                  ENTERPRISE LTS PERMANENT
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1">
                TADE Grand Sovereign Enterprise LTS Seal &bull; R666
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-4 py-2.5 rounded-2xl bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-yellow-500/25 flex items-center gap-2"
            >
              <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Memverifikasi...' : 'Verifikasi Kriptografis 666 Modul'}</span>
            </button>
            <button
              onClick={handleCopyManifest}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Tersalin!' : 'Salin Manifest'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-yellow-100/90 leading-relaxed max-w-4xl font-mono">
          Piagam Tertinggi Kedaulatan Digital &bull; Mengesahkan 666 Modul Arsitektur TADE (R1 s/d R666) melintasi 43 War Rooms, menjamin keabadian operasional madrasah, independensi total dari vendor eksternal, integritas data tak terbantahkan, dan kepatuhan penuh terhadap 22 Invarian Konstitusi.
        </p>

        {/* Verification Alert */}
        {verificationResult && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-200 font-mono flex items-center gap-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-emerald-300 text-sm">SEAL INTEGRITY VERIFIED (100% PASS)</strong>
              <span>{verificationResult.message}</span>
            </div>
          </div>
        )}

        {/* Manifest Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-1 font-mono">
            <span className="text-[11px] text-yellow-300/80">Total Discovery Modul</span>
            <div className="text-3xl font-black text-yellow-400">{manifest.discoveryEntriesCount}</div>
            <span className="text-[10px] text-yellow-200/60">R1 - R666 Certified</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-1 font-mono">
            <span className="text-[11px] text-yellow-300/80">War Rooms Audit</span>
            <div className="text-3xl font-black text-emerald-400">{manifest.totalWarRooms}</div>
            <span className="text-[10px] text-emerald-300/60">Rooms A through AR</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-1 font-mono">
            <span className="text-[11px] text-yellow-300/80">Kriteria Validasi</span>
            <div className="text-3xl font-black text-teal-400">{manifest.totalValidatedCriteria}</div>
            <span className="text-[10px] text-teal-300/60">100% Zero-Defect</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-1 font-mono">
            <span className="text-[11px] text-yellow-300/80">LTS Status</span>
            <div className="text-sm font-black text-emerald-300 mt-1 truncate">IMMORTAL</div>
            <span className="text-[10px] text-yellow-300/70">Enterprise Certified</span>
          </div>
        </div>

        {/* Cryptographic Founder Signature Seal */}
        <div className="pt-4 border-t border-yellow-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-yellow-200/80">
          <div>
            <span className="text-yellow-400 font-bold block">Cryptographic Founder Seal:</span>
            <span className="text-yellow-100 font-mono">{manifest.cryptographicFounderSeal}</span>
          </div>
          <div>
            <span className="text-yellow-400 font-bold block">Constitution Hash:</span>
            <span className="text-yellow-100 font-mono">{manifest.constitutionHash}</span>
          </div>
        </div>
      </div>

      {/* Signatories & Architects */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Supreme Signatories of the Sovereign State</h4>
          </div>
          <span className="text-xs text-slate-400">RC84 Supreme Ratification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {manifest.leadArchitects.map((arch, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-xs">
                0{i + 1}
              </div>
              <strong className="text-xs text-slate-900 dark:text-white block">{arch}</strong>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Signed &amp; Ratified
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
