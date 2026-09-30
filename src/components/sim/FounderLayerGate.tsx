import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { INITIAL_FOUNDER_SEAL } from './FounderVault';

interface FounderLayerGateProps {
  children: React.ReactNode;
}

export const FounderLayerGate: React.FC<FounderLayerGateProps> = ({ children }) => {
  const [passphrase, setPassphrase] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // In real implementation, validated against Hardware FIDO2 + Master Token
  const VALID_FOUNDER_PASSPHRASE = 'TADE-FOUNDER-ROOT-SOVEREIGN-2026';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim() === VALID_FOUNDER_PASSPHRASE || passphrase.trim() === 'founder') {
      setIsAuthenticated(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Kunci Otentikasi Founder Invalid. Akses Sovereign Layer Ditolak.');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-1">
              <span>MODULE R139</span>
              <span>•</span>
              <span>FOUNDER LAYER GATE</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Founding Root Authentication
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gerbang eksklusif Founder Platform TADE. Masukkan passkey kedaulatan untuk membuka dashboard kontrol fleet multi-tenant.
            </p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Master Passphrase / FIDO2 Token:</span>
              <span className="text-[10px] text-slate-400 font-mono">CONSTITUTION V12.2</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan Sovereign Master Token..."
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-400">
              Demo token cepat: <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">founder</code> atau <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">TADE-FOUNDER-ROOT-SOVEREIGN-2026</code>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Verifikasi & Masuk Founder Layer</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
          Dilindungi oleh Single Sovereign Root & Invisible Tenant Layer Policy.
        </div>
      </div>
    </div>
  );
};
