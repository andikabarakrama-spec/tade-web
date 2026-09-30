import React, { useState } from 'react';
import { LicenseEngine } from '../../services/license/LicenseEngine';
import { ShieldCheck, Lock, Eye, Download, Search, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

interface Props {
  onOpenLicenseCenter?: () => void;
}

export const SafeModeNotice: React.FC<Props> = ({ onOpenLicenseCenter }) => {
  const license = LicenseEngine.getLicense();
  const notification = LicenseEngine.getNotification();
  const [activationKeyInput, setActivationKeyInput] = useState('');
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Show notice if status is READ_ONLY, EXPIRED, GRACE_PERIOD, or SUSPENDED
  const isGrace = license.status === 'GRACE_PERIOD';
  const isReadOnly = license.status === 'READ_ONLY' || license.status === 'EXPIRED';
  const isSuspended = license.status === 'SUSPENDED';

  if (!isGrace && !isReadOnly && !isSuspended) {
    return null;
  }

  const handleQuickActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationKeyInput.trim()) return;

    const res = LicenseEngine.activateLicenseKey(activationKeyInput, 'SUPER_ADMIN_QUICK');
    if (res.success) {
      setResultMsg({ success: true, text: res.message });
      setActivationKeyInput('');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setResultMsg({ success: false, text: res.message });
    }
  };

  return (
    <div className={`p-4 rounded-2xl mb-6 border shadow-lg transition-all ${
      isReadOnly || isSuspended
        ? 'bg-amber-950/80 border-amber-500/50 text-amber-100'
        : 'bg-sky-950/80 border-sky-500/50 text-sky-100'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isReadOnly || isSuspended ? 'bg-amber-500 text-slate-950' : 'bg-sky-500 text-slate-950'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-wide flex items-center gap-1.5">
                {notification.title}
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400/40 font-mono">
                SAFE MODE PROTECTION
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90 max-w-3xl">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Action button */}
        {onOpenLicenseCenter && (
          <button
            onClick={onOpenLicenseCenter}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shrink-0 shadow-md"
          >
            <KeyRound className="w-4 h-4" />
            <span>Pusat Lisensi Enterprise</span>
          </button>
        )}
      </div>

      {/* Allowed vs Blocked Feature Guide */}
      <div className="mt-4 pt-3 border-t border-amber-500/30 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300 block mb-0.5">Akses Diizinkan Dalam Safe Mode:</span>
            <span className="text-slate-300">
              Melihat seluruh data (View), Pencarian (Search), Ekspor Laporan PDF/Excel, dan Cadangan (Backup Archive) aman 100%.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-amber-500/30">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">Dibatasi Sementara:</span>
            <span className="text-slate-300">
              Penambahan data baru, pengeditan, penghapusan, dan persetujuan dokumen memerlukan kunci perpanjangan lisensi.
            </span>
          </div>
        </div>
      </div>

      {/* Quick Activation Field */}
      {(isReadOnly || isSuspended) && (
        <form onSubmit={handleQuickActivate} className="mt-3 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={activationKeyInput}
            onChange={(e) => setActivationKeyInput(e.target.value)}
            placeholder="Masukkan Kode Kunci Lisensi Baru..."
            className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-100 text-xs focus:outline-hidden focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aktivasi Kunci Baru</span>
          </button>
        </form>
      )}

      {resultMsg && (
        <div className={`mt-2 p-2 rounded-lg text-xs font-bold ${resultMsg.success ? 'bg-emerald-900/80 text-emerald-200' : 'bg-rose-900/80 text-rose-200'}`}>
          {resultMsg.text}
        </div>
      )}
    </div>
  );
};
