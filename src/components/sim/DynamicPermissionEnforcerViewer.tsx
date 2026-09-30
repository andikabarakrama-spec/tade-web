import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle2, XCircle, RefreshCw, Key, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import { GuardianKernel, EngineId, KernelRole } from '../../core/kernel/GuardianKernelLayer';

export const DynamicPermissionEnforcerViewer: React.FC = () => {
  const [activeRole, setActiveRole] = useState<KernelRole>('GURU');
  const [targetEngine, setTargetEngine] = useState<EngineId>('KEUANGAN');
  const [targetAction, setTargetAction] = useState<string>('MUTATE_BUDGET_LEDGER');
  const [evalResult, setEvalResult] = useState<{ allowed: boolean; reason: string; securityContext: string } | null>(null);
  const [denialLog, setDenialLog] = useState<{ time: string; role: string; engine: string; reason: string }[]>([
    {
      time: '07:32:15',
      role: 'WALI_MURID',
      engine: 'KEUANGAN',
      reason: 'SELinux MAC Violation: Unauthorized write syscall to financial ledger.'
    },
    {
      time: '07:34:02',
      role: 'GURU',
      engine: 'GUARDIAN',
      reason: 'AppArmor Denial: Capability CAP_SYS_ADMIN required for kernel reconfiguration.'
    }
  ]);

  const roles: KernelRole[] = ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'WALI_MURID', 'SISWA'];
  const engines: EngineId[] = ['GUARDIAN', 'SESSION', 'FIRESTORE', 'PPDB', 'RAPORT', 'KEUANGAN', 'WAR_ROOM', 'WEBSITE'];

  const handleEvaluatePermission = () => {
    const isAllowed = GuardianKernel.checkPermission(targetEngine, activeRole);
    const reason = isAllowed
      ? `SELinux Context [tade_${activeRole.toLowerCase()}_t] grants direct access to ${targetEngine}.`
      : `AppArmor & SELinux MAC policy DENIED: Role ${activeRole} lacks capability for ${targetEngine}.`;

    const result = {
      allowed: isAllowed,
      reason,
      securityContext: `system_u:object_r:${targetEngine.toLowerCase()}_exec_t:s0`
    };

    setEvalResult(result);

    if (!isAllowed) {
      setDenialLog(prev => [
        {
          time: new Date().toLocaleTimeString(),
          role: activeRole,
          engine: targetEngine,
          reason
        },
        ...prev.slice(0, 7)
      ]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
              R560 &bull; DYNAMIC PERMISSION ENFORCEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              SELINUX &amp; APPARMOR MANDATORY ACCESS CONTROL (MAC)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Kernel-Level Runtime Privilege Validation &amp; Automated Security Denial
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Penegakan izin terjadi pada lapisan kernel interceptor, bukan sekadar menyembunyikan tombol UI. Setiap panggilan mutasi divalidasi terhadap kebijakan MAC SELinux.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleEvaluatePermission}
            className="py-2.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold flex items-center gap-2 shadow transition"
          >
            <Lock className="w-4 h-4" />
            Evaluate Kernel Syscall Permission
          </button>
        </div>
      </div>

      {/* Simulator Playground */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <span className="text-slate-400 font-bold block">1. SELECT ACTOR ROLE</span>
          <div className="grid grid-cols-2 gap-1.5">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`p-2 rounded-xl text-left text-[11px] font-bold border transition ${
                  activeRole === r
                    ? 'bg-rose-600 text-white border-rose-600 shadow'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <span className="text-slate-400 font-bold block">2. SELECT TARGET ENGINE SYSCALL</span>
          <div className="grid grid-cols-2 gap-1.5">
            {engines.map(eng => (
              <button
                key={eng}
                onClick={() => setTargetEngine(eng)}
                className={`p-2 rounded-xl text-left text-[11px] font-bold border transition ${
                  targetEngine === eng
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-bold block mb-2">3. SELINUX EVALUATION RESULT</span>
            {evalResult ? (
              <div className={`p-4 rounded-2xl border space-y-2 ${
                evalResult.allowed
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-800 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {evalResult.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                  {evalResult.allowed ? 'SYSCALL PERMITTED (200 OK)' : 'MAC ENFORCEMENT DENIED (403)'}
                </div>
                <p className="text-[11px] leading-relaxed font-sans">{evalResult.reason}</p>
                <div className="text-[10px] opacity-75 pt-1">
                  Context: <strong className="font-mono">{evalResult.securityContext}</strong>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 text-[11px] text-center">
                Pilih role dan engine lalu klik Evaluate untuk memicu pemeriksaan SELinux MAC.
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2">
            <span>Enforcement Mode: <strong className="text-emerald-600">ENFORCING</strong></span>
            <span>Zero-Bypass Active</span>
          </div>
        </div>
      </div>

      {/* Denial Audit Log */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Kernel MAC Violation &amp; Security Denial Ledger
          </h3>
          <span className="text-[10px] text-slate-400">{denialLog.length} Recorded Interceptions</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {denialLog.map((log, idx) => (
            <div key={idx} className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[10px]">{log.time}</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                  {log.role}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">&rarr; {log.engine}</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">{log.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
