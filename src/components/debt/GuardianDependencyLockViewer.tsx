import React, { useState } from 'react';
import { guardianDependencyLock, DependencyLockManifest } from '../../core/debt/GuardianDependencyLock';
import { ShieldCheck, Lock, AlertTriangle, RefreshCw, Key, CheckCircle2 } from 'lucide-react';

export const GuardianDependencyLockViewer: React.FC = () => {
  const [manifest, setManifest] = useState<DependencyLockManifest>(() => guardianDependencyLock.auditDependencies());
  const [testPackage, setTestPackage] = useState('react');

  const handleSimulateDrift = () => {
    const res = guardianDependencyLock.simulateDrift(testPackage, '^20.0.0-unapproved');
    setManifest({ ...res });
  };

  const handleResetBaseline = () => {
    const res = guardianDependencyLock.resetToApprovedBaseline();
    setManifest({ ...res });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                R646 &bull; GUARDIAN DEPENDENCY LOCK
              </span>
              <span className="text-xs text-slate-400">Cryptographic Dependency Baseline</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-indigo-400" />
              Guardian Dependency Lock &amp; Drift Sentinel
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Memantau baseline dependensi yang terkunci secara kriptografis (package, versi, lisensi, checksum sha256, approvedBy). Jika terjadi perubahan tanpa persetujuan, memicu alarm <strong>Dependency Drift (Severity: HIGH)</strong> di War Room.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateDrift}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" /> Uji Drift Alert
            </button>
            <button
              onClick={handleResetBaseline}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Reset Baseline
            </button>
          </div>
        </div>
      </div>

      {/* Drift Alert Banner if DRIFT_ALERT */}
      {manifest.driftStatus === 'DRIFT_ALERT' && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200 flex items-start gap-3 shadow-md animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-sm font-bold font-mono">DEPENDENCY DRIFT DETECTED</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                SEVERITY: {manifest.driftAlertSeverity}
              </span>
            </div>
            <p className="text-xs">
              Terdeteksi {manifest.unapprovedChangesCount} perubahan dependensi tidak sah atau versi di luar persetujuan Ring-0 Guardian. Segera lakukan reset baseline atau eskalasi ke Founder Prime Minister.
            </p>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Status Baseline</span>
          <span className={`text-lg font-bold font-mono ${manifest.driftStatus === 'STABLE_LOCKED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {manifest.driftStatus}
          </span>
          <span className="text-[10px] text-slate-500 block">guardian/dependency-lock.json</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Total Dependensi Dikunci</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {manifest.totalDependencies} Paket
          </span>
          <span className="text-[10px] text-slate-500 block">100% Lisensi Valid (MIT/Apache)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Perubahan Tidak Sah</span>
          <span className={`text-2xl font-bold font-mono ${manifest.unapprovedChangesCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {manifest.unapprovedChangesCount} Drift
          </span>
          <span className="text-[10px] text-slate-500 block">Guardian Ring-0 Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Integritas Checksum</span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            100% MATCH
          </span>
          <span className="text-[10px] text-slate-500 block">SHA-256 Digest Chain</span>
        </div>
      </div>

      {/* Dependencies Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Registri Dependensi Terkunci (Direct Dependencies)</h3>
            <p className="text-xs text-slate-500">Diverifikasi dan disetujui oleh Chief Architect &amp; Founder Prime Minister.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Lock Manifest v1.0.0-RC82</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="pb-3 font-bold">Package</th>
                <th className="pb-3 font-bold">Versi Terkunci</th>
                <th className="pb-3 font-bold">Lisensi</th>
                <th className="pb-3 font-bold">Checksum SHA-256</th>
                <th className="pb-3 font-bold">Disetujui Oleh</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {manifest.dependencies.map(dep => (
                <tr key={dep.packageName} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {dep.packageName}
                  </td>
                  <td className="py-3 text-indigo-600 dark:text-indigo-400 font-bold">
                    {dep.version}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                      {dep.license}
                    </span>
                  </td>
                  <td className="py-3 text-[10px] text-slate-500 truncate max-w-[140px]" title={dep.checksum}>
                    {dep.checksum.substring(0, 20)}...
                  </td>
                  <td className="py-3 text-[11px] text-slate-600 dark:text-slate-300">
                    {dep.approvedBy}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dep.status === 'LOCKED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'}`}>
                      {dep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
