import React, { useState } from 'react';
import { LicenseEngine } from '../../services/license/LicenseEngine';
import { LICENSE_POLICIES } from '../../services/license/LicensePolicy';
import { LicenseIntegrityEngine } from '../../services/license/LicenseIntegrityEngine';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Building2,
  Key,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Lock,
  Award,
  HelpCircle,
  Zap,
  Bot,
  Activity
} from 'lucide-react';

interface Props {
  onOpenSuperAdminCenter?: () => void;
}

export const LicenseDashboard: React.FC<Props> = ({ onOpenSuperAdminCenter }) => {
  const license = LicenseEngine.getLicense();
  const daysRemaining = LicenseEngine.calculateDaysRemaining(license);
  const notification = LicenseEngine.getNotification();
  const policy = LICENSE_POLICIES[license.policyType];
  const secReport = LicenseIntegrityEngine.evaluateSecurityReport(license);

  const [inputKey, setInputKey] = useState('');
  const [activationResult, setActivationResult] = useState<{ success: boolean; msg: string } | null>(null);

  const isHealthy = license.status === 'ACTIVE' || (license.status === 'TRIAL' && daysRemaining > 14);
  const isWarning = license.status === 'GRACE_PERIOD' || (daysRemaining <= 14 && daysRemaining > 0);
  const isCritical = license.status === 'EXPIRED' || license.status === 'READ_ONLY' || license.status === 'SUSPENDED';

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    const res = LicenseEngine.activateLicenseKey(inputKey, 'USER_DASHBOARD');
    if (res.success) {
      setActivationResult({ success: true, msg: res.message });
      setInputKey('');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setActivationResult({ success: false, msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Health Indicator */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isHealthy
          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40 text-slate-100'
          : isWarning
          ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-amber-500/40 text-slate-100'
          : 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 border-rose-500/40 text-slate-100'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isHealthy
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isHealthy ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                <span>STATUS LISENSI: {license.status}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-800/80 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{policy?.label || license.policyType}</span>
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 ${
                secReport.integrityValid
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                <span>INTEGRITAS: {secReport.securityHealthScore}% HEALTH</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{license.schoolName}</span>
              <span className="text-xs font-normal text-slate-400 font-mono">({license.schoolId})</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>{license.foundationName}</span>
            </p>
          </div>

          {/* Health Bar Widget */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 w-full md:w-72 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-slate-400">Sisa Masa Berlaku</span>
              <span className={daysRemaining <= 14 ? 'text-amber-400' : 'text-emerald-400'}>
                {daysRemaining > 0 ? `${daysRemaining} Hari` : 'Kadaluarsa'}
              </span>
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHealthy ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(5, (daysRemaining / (policy?.durationDays || 365)) * 100))}%`
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Masa Tenggang:</span>
              <span className="font-bold text-slate-200">{license.gracePeriodDays} Hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Asy Security Assistant Banner (Part 9) */}
      <div className="p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 rounded-3xl border border-amber-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
          <Bot className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-amber-300 text-sm flex items-center gap-2">
            <span>AI Asy Assistant • Asisten Lisensi Enterprise</span>
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {notification.aiSpeechSuggestion}
          </p>
        </div>
      </div>

      {/* Grid Status Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Tanggal Tanggal Aktivasi</span>
          <p className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>{new Date(license.activationDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Tanggal Kadaluarsa</span>
          <p className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{new Date(license.expirationDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block font-mono">Diterbitkan Oleh</span>
          <p className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="truncate">{license.issuedBy}</span>
          </p>
        </div>
      </div>

      {/* Feature & Safe Mode Operational Permissions Matrix */}
      <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Matriks Akses Operational & Safe Mode Protection</span>
            </h3>
            <p className="text-xs text-slate-400">
              Perlindungan data terjamin. Dalam kondisi lisensi kadaluarsa, seluruh data sekolah tetap aman dan tidak akan dihapus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Login & Autentikasi User</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Melihat Data (View All Records)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Ekspor Laporan PDF & Excel</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Cadangan Data (Archive Backup)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Pembuatan / Input Data Baru</span>
            {LicenseEngine.isOperationAllowed('CREATE') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Pengeditan Data Master</span>
            {LicenseEngine.isOperationAllowed('EDIT') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Quick Key Activation Form & Super Admin Direct Access */}
      <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <span>Aktivasi Kunci Lisensi Baru</span>
            </h3>
            <p className="text-xs text-slate-400">
              Masukkan kode unik Lisensi Enterprise / Sewa Berlangganan yang diterbitkan oleh Super Admin.
            </p>
          </div>

          {onOpenSuperAdminCenter && (
            <button
              onClick={onOpenSuperAdminCenter}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pusat Super Admin Lisensi</span>
            </button>
          )}
        </div>

        <form onSubmit={handleActivateKey} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Tempel Kunci Lisensi Enterprise Di Sini..."
            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Aktifkan Kunci</span>
          </button>
        </form>

        {activationResult && (
          <div className={`p-3 rounded-xl text-xs font-bold ${
            activationResult.success ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-200' : 'bg-rose-950 border border-rose-500/50 text-rose-200'
          }`}>
            {activationResult.msg}
          </div>
        )}
      </div>
    </div>
  );
};
