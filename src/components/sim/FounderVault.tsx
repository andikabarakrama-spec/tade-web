import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  FileKey2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Award,
  Fingerprint,
  FileText,
  Printer
} from 'lucide-react';

export interface FounderSeal {
  sealId: string;
  platformRootId: string;
  sealHash: string;
  issuedAt: string;
  status: 'ACTIVE_LOCKED' | 'ROTATING';
  singleRootPreserved: boolean;
  tamperProofMerkleRoot: string;
}

export const INITIAL_FOUNDER_SEAL: FounderSeal = {
  sealId: 'FOUNDER-SEAL-2026-TADE-V12',
  platformRootId: 'PLATFORM-SOVEREIGN-ROOT-001',
  sealHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  issuedAt: '2026-08-14 00:00:00 UTC',
  status: 'ACTIVE_LOCKED',
  singleRootPreserved: true,
  tamperProofMerkleRoot: 'merkle:9a01f82c334bb201991823ae'
};

export const FounderVault: React.FC = () => {
  const [seal] = useState<FounderSeal>(INITIAL_FOUNDER_SEAL);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Vault Master Card */}
      <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                FOUNDER EXCLUSIVE VAULT
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                SINGLE ROOT SEALED
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
              <Lock className="w-6 h-6 text-amber-400" />
              <span>Founding Root Seal & Sovereign Vault</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Kunci kedaulatan platform tingkat tertinggi. Founder Vault ini sepenuhnya terisolasi dari ruang tenant sekolah dan hanya dapat diakses melalui verifikasi segel root berotasi.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 flex items-center space-x-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">SEAL STATUS</span>
              <span className="text-xs font-bold text-amber-400 font-mono">100% IMMUTABLE LOCKED</span>
              <span className="text-[10px] text-slate-500 block">Zero Secondary Root Allowed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Seal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Founding Root Master Identifier</span>
            </span>
            <button
              onClick={() => handleCopy(seal.platformRootId, 'rootId')}
              className="text-slate-400 hover:text-amber-500 flex items-center space-x-1 font-mono text-[11px]"
            >
              {copiedKey === 'rootId' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'rootId' ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
          <div className="font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] select-all break-all">
            {seal.platformRootId}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            ID Permanen Kedaulatan Platform. Dilarang menduplikasi atau mengubah entri ini.
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Founding Root Seal Hash (SHA-256)</span>
            </span>
            <button
              onClick={() => handleCopy(seal.sealHash, 'sealHash')}
              className="text-slate-400 hover:text-amber-500 flex items-center space-x-1 font-mono text-[11px]"
            >
              {copiedKey === 'sealHash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'sealHash' ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
          <div className="font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] select-all break-all">
            {seal.sealHash}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Checksum otentikasi segel yang memvalidasi integritas Constitution TADE v12.2.
          </div>
        </div>
      </div>

      {/* Security Policies for Founder Layer */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Aturan Konstitusi Founder Layer (Constitution v12.2):</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">1. Invisible Layer</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Menu dan modul Founder tidak pernah dirender pada bundle tenant sekolah mana pun.
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">2. Single Root Absolute</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Platform hanya memiliki 1 Sovereign Root. Tidak ada tombol atau form penambahan Super Admin kedua.
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">3. Air-Gapped Recovery</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Kunci cadangan fisik tersimpan dalam One-Time Recovery Envelope siap cetak dengan rotasi otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
