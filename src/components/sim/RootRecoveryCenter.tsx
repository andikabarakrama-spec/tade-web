import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  RotateCcw,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Smartphone,
  Flame,
  ArrowRight
} from 'lucide-react';
import { RecoveryEnvelope } from './RecoveryEnvelope';

export const RootRecoveryCenter: React.FC = () => {
  const [rootId] = useState('PLATFORM-SOVEREIGN-ROOT-001');
  const [recoveryToken, setRecoveryToken] = useState('REC-TADE-SOVEREIGN-9912-78A1-X9');
  const [generatedDate, setGeneratedDate] = useState('2026-08-14 16:30 WIB');
  const [isRotating, setIsRotating] = useState(false);
  const [rotationSuccess, setRotationSuccess] = useState(false);

  // Transfer device state
  const [targetDeviceName, setTargetDeviceName] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const handleRotateSecret = async () => {
    setIsRotating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newToken = `REC-TADE-ROTATED-${randomHex}-${randomHex2}-V12`;
    setRecoveryToken(newToken);
    setGeneratedDate(new Date().toLocaleString('id-ID'));
    setIsRotating(false);
    setRotationSuccess(true);
    setTimeout(() => setRotationSuccess(false), 3000);
  };

  const handleTransferDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDeviceName.trim()) return;
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setTargetDeviceName('');
    }, 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    MODULE R140
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    INVISIBLE ROOT RECOVERY
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Sovereign Root Recovery & 1-Time Envelope Center
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Pusat penerbitan kartu pemulihan darurat satu kali pakai (1-Time Recovery Card) dan transfer perangkat fisik terpercaya (Trusted Device). Sistem menjamin tidak pernah ada pembuatan Root kedua.
            </p>
          </div>

          <button
            onClick={handleRotateSecret}
            disabled={isRotating}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-900/30 transition-all shrink-0 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Merenovasi Token...' : 'Rotasi Token 1-Pakai Sekarang'}</span>
          </button>
        </div>
      </div>

      {rotationSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Token Pemulihan Darurat lama telah hangus. Token baru telah diterbitkan dengan aman.</span>
        </div>
      )}

      {/* Main Envelope Component */}
      <RecoveryEnvelope
        rootId={rootId}
        recoveryToken={recoveryToken}
        generatedDate={generatedDate}
        onRotate={handleRotateSecret}
      />

      {/* Transfer Trusted Device Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Transfer Kedaulatan ke Perangkat Terpercaya Baru (Transfer Trusted Device)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pindahkan kunci otentikasi FIDO2/Passkey ke laptop/ponsel baru tanpa menambah akun admin baru.
            </p>
          </div>
        </div>

        <form onSubmit={handleTransferDevice} className="max-w-xl space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Nama / Identitas Perangkat Baru:
            </label>
            <input
              type="text"
              placeholder="Contoh: MacBook Pro Founder M4 (Serial #8821)"
              value={targetDeviceName}
              onChange={(e) => setTargetDeviceName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!targetDeviceName.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow cursor-pointer"
            >
              <span>Daftarkan & Kirim Undangan WebAuthn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {transferSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Otorisasi perangkat berhasil dikirim. Perangkat lama tetap aman hingga otentikasi baru selesai.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
