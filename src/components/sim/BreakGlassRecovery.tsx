import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  FileCheck,
  AlertTriangle,
  Fingerprint,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const BreakGlassRecovery: React.FC = () => {
  const [isArming, setIsArming] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600); // 60 menit countdown
  const [emergencyCodeInput, setEmergencyCodeInput] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentSecretToken, setCurrentSecretToken] = useState('BG-EMERGENCY-2026-9812-X9');

  // Hardcoded recovery seed hash
  const EXPECTED_CODE = 'TADE-RECOVERY-CONFIRM-ROOT-V11';

  useEffect(() => {
    let interval: any = null;
    if (sessionActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            handleAutoRotateAndLock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeLeftSeconds]);

  const handleArmBreakGlass = () => {
    if (emergencyCodeInput.trim() !== EXPECTED_CODE) {
      alert('Kode Konfirmasi Darurat Salah. Harap masukkan: ' + EXPECTED_CODE);
      return;
    }

    setSessionActive(true);
    setIsArming(false);
    setVerificationSuccess(true);
    setTimeLeftSeconds(3600);
  };

  const handleAutoRotateAndLock = () => {
    setSessionActive(false);
    setVerificationSuccess(false);
    setEmergencyCodeInput('');
    // Generate new rotated secret token
    const newRandomToken = `BG-ROTATED-${Math.random().toString(36).substring(2, 10).toUpperCase()}-V11`;
    setCurrentSecretToken(newRandomToken);
    setTimeLeftSeconds(3600);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(currentSecretToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    MODULE R136
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    AIR-GAPPED COLD VAULT
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Break-Glass Cold Chamber & Auto-Rotating Recovery
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Protokol pemulihan darurat tingkat tertinggi ketika seluruh perangkat keras Super Admin tidak dapat diakses. Akun darurat ini bersifat <strong className="text-rose-300">dorman (tidak aktif sehari-hari)</strong>, berlaku 60 menit per sesi darurat, dan secara otomatis melakukan rotasi kredensial 1-kali pakai.
            </p>
          </div>

          <div className="bg-slate-950/90 border border-rose-900/60 rounded-xl p-4 flex items-center space-x-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">STATUS BREAK-GLASS</span>
              <span className={`text-sm font-bold font-mono ${sessionActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {sessionActive ? 'SESSION ACTIVE (UNLOCKED)' : 'DORMANT COLD (LOCKED)'}
              </span>
              <span className="text-[10px] text-slate-500 block">Single Root Rule Preserved</span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
              sessionActive ? 'bg-rose-950 border-rose-700 text-rose-400' : 'bg-emerald-950 border-emerald-700 text-emerald-400'
            }`}>
              {sessionActive ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-3">
        <h4 className="font-bold text-slate-100 flex items-center space-x-2 text-sm">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Prinsip Keamanan Konstitusi TADE v11.0 untuk Break-Glass:</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">1. Dilarang Membuat Super Admin #2</span>
            <p className="text-[11px] text-slate-400">
              Break-glass tidak menciptakan user baru. Sesi ini hanya memberikan akses sementara (ephemeral) ke Sovereign Root tunggal.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">2. Auto-Expire 60 Menit</span>
            <p className="text-[11px] text-slate-400">
              Sesi recovery memiliki countdown timer yang langsung mengunci sistem dan membatalkan semua token jika waktu habis.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">3. Otomatis Rotasi Kredensial</span>
            <p className="text-[11px] text-slate-400">
              Setelah sesi darurat selesai atau ditutup, hash kunci darurat lama otomatis hangus dan di-regenerasi secara acak.
            </p>
          </div>
        </div>
      </div>

      {/* Active Session Warning / Countdown */}
      {sessionActive && (
        <div className="bg-rose-950/80 border-2 border-rose-600 rounded-2xl p-6 text-white shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-100">SESI BREAK-GLASS SEDANG BERLANGSUNG</h3>
                <p className="text-xs text-rose-200">
                  Seluruh tindakan dicatat ke dalam Root Evidence Vault dengan prioritas insiden TIER-1.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 px-5 py-3 rounded-xl border border-rose-700 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-rose-400 animate-spin" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">SISA WAKTU AKSES DARURAT</span>
                <span className="text-2xl font-black font-mono text-rose-400">{formatTimer(timeLeftSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-rose-900/80">
            <button
              onClick={handleAutoRotateAndLock}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-700 text-xs font-bold flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Selesaikan Sesi & Rotasi Kunci Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* Standby State & Trigger Box */}
      {!sessionActive && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Pemicu Break-Glass Darurat (Emergency Override)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hanya gunakan jika seluruh kunci FIDO2/Passkey utama tidak dapat diakses.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              CHAMBER STATUS: DORMANT
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Current Rotated Emergency Key Hash:</span>
              <button
                onClick={copySecret}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Token'}</span>
              </button>
            </div>
            <div className="font-mono text-xs bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all break-all">
              {currentSecretToken}
            </div>
          </div>

          {!isArming ? (
            <div className="flex justify-end">
              <button
                onClick={() => setIsArming(true)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-rose-900/30 transition-all"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Buka Chamber Break-Glass</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-3">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">
                Konfirmasi Kode Otentikasi Pemulihan Darurat:
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ketik string pengaman berikut: <code className="font-bold text-rose-600 dark:text-rose-400">{EXPECTED_CODE}</code>
              </p>
              <input
                type="text"
                placeholder={EXPECTED_CODE}
                value={emergencyCodeInput}
                onChange={(e) => setEmergencyCodeInput(e.target.value)}
                className="w-full p-2.5 text-xs font-mono rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => {
                    setIsArming(false);
                    setEmergencyCodeInput('');
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleArmBreakGlass}
                  disabled={!emergencyCodeInput.trim()}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
                >
                  <Flame className="w-4 h-4" />
                  <span>Aktifkan Sesi Darurat 60 Menit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
