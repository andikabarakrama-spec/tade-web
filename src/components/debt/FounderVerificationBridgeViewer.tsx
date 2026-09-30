import React, { useState } from 'react';
import { founderVerificationBridge, FounderVerificationResult } from '../../core/debt/FounderVerificationBridge';
import { Award, ShieldCheck, Play, CheckCircle2, Terminal, Copy, Check } from 'lucide-react';

export const FounderVerificationBridgeViewer: React.FC = () => {
  const [result, setResult] = useState<FounderVerificationResult>(() => founderVerificationBridge.runFullVerification());
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunVerification = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = founderVerificationBridge.runFullVerification();
      setResult({ ...res });
      setIsRunning(false);
    }, 600);
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(result.terminalSummary.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R654 &bull; FOUNDER VERIFICATION BRIDGE
              </span>
              <span className="text-xs text-slate-400">High-Authority Kernel Assurance Pipeline</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-400" />
              Founder Verification Bridge &amp; Cryptographic Seal
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Menyediakan satu jalur verifikasi terpadu (setara dengan <code>npm run guardian:verify</code>) yang mengevaluasi seluruh pilar kernel: Konstitusi, Dependensi, Kontrak Service, Bundle, Runtime, Recovery, dan War Room hingga menghasilkan status <strong>RC82 VERIFIED</strong>.
            </p>
          </div>
          <button
            onClick={handleRunVerification}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Mengevaluasi Kernel...' : 'Jalankan Guardian Verify'}
          </button>
        </div>
      </div>

      {/* Founder Seal Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              STATUS: {result.overallStatus}
            </span>
            <span className="text-xs text-slate-400">Bridge v1.0.0-RC82</span>
          </div>
          <h3 className="text-lg font-bold font-mono tracking-wide">
            CRYPTO FOUNDER SEAL: <span className="text-emerald-400">{result.founderSeal}</span>
          </h3>
          <p className="text-xs text-slate-300">
            Diverifikasi pada {result.verifiedAt.replace('T', ' ').substring(0, 19)} &bull; {result.passedChecks}/{result.totalChecks} Subsystem Gateways PASS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin' : 'Salin Log CLI'}
          </button>
        </div>
      </div>

      {/* Verification Check Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.checks.map(chk => (
          <div key={chk.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                {chk.name}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${chk.status === 'PASS' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                {chk.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">{chk.details}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
              <span>Category: {chk.category}</span>
              <span>Latency: {chk.latencyMs}ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal CLI Emulation Output */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-3 font-mono text-xs text-emerald-400">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] text-slate-300">Terminal Output (npm run guardian:verify)</span>
          </div>
          <span className="text-[10px]">TADE RC82 CLI Bridge</span>
        </div>
        <pre className="overflow-x-auto leading-relaxed text-[11px]">
          {result.terminalSummary.join('\n')}
        </pre>
      </div>
    </div>
  );
};
