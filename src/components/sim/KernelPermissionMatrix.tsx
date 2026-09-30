import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2, XCircle, ArrowRight, Shield } from 'lucide-react';
import { GuardianKernel, EngineId, PermissionPolicy } from '../../core/kernel/GuardianKernelLayer';

export const KernelPermissionMatrix: React.FC = () => {
  const policies = GuardianKernel.getPermissionMatrix();
  const [testEngine, setTestEngine] = useState<EngineId>('WEBSITE');
  const [testAction, setTestAction] = useState<'read' | 'write' | 'execute'>('write');
  const [testResource, setTestResource] = useState<string>('grades');
  const [testResult, setTestResult] = useState<{ allowed: boolean; timestamp: string } | null>(null);

  const handleTestPermission = () => {
    const isAllowed = GuardianKernel.verifyPermission(testEngine, testAction, testResource);
    setTestResult({
      allowed: isAllowed,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
              R550 &bull; KERNEL PERMISSION MATRIX
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              SELINUX &amp; APPARMOR MANDATORY ACCESS CONTROL (MAC)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Zero-Trust Subsystem Capability &amp; Policy Matrix
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Terinspirasi oleh SELinux &amp; AppArmor. Setiap engine memiliki Security Policy yang tertanam di level kernel. Akses ilegal ditolak secara deterministik tanpa toleransi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">ENFORCEMENT MODE</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              MANDATORY ENFORCING (ZERO TRUST)
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Permission Policies vs Real-time Permission Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policies List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
            Engine Security Policies (MAC Table)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map(policy => (
              <div key={policy.engineId} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-slate-900 dark:text-white">{policy.engineId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    POLICY ENFORCED
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ALLOWED ROLES:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{policy.roleRequirements.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">READ CAPABILITIES:</span>
                    <span className="text-slate-700 dark:text-slate-300">{policy.readAccess.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">WRITE CAPABILITIES:</span>
                    <span className="text-slate-700 dark:text-slate-300">{policy.writeAccess.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SYSCALL EXECUTION:</span>
                    <span className="text-slate-700 dark:text-slate-300">{policy.executeAccess.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Challenge Simulator */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
            Kernel Access Challenge Lab
          </h3>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Subject Engine</label>
              <select
                aria-label="Subject Engine"
                value={testEngine}
                onChange={e => setTestEngine(e.target.value as EngineId)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="WEBSITE">WEBSITE (Public Engine)</option>
                <option value="PPDB">PPDB (Admission Engine)</option>
                <option value="RAPORT">RAPORT (Academic Engine)</option>
                <option value="KEUANGAN">KEUANGAN (Finance Engine)</option>
                <option value="GUARDIAN">GUARDIAN (Kernel Core)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Action Type</label>
              <select
                aria-label="Action Type"
                value={testAction}
                onChange={e => setTestAction(e.target.value as 'read' | 'write' | 'execute')}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="read">READ Resource</option>
                <option value="write">WRITE / MUTATE Resource</option>
                <option value="execute">EXECUTE Syscall</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Target Resource</label>
              <select
                aria-label="Target Resource"
                value={testResource}
                onChange={e => setTestResource(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="grades">grades (Nilai Siswa Raport)</option>
                <option value="spp_invoices">spp_invoices (Keuangan)</option>
                <option value="public_news">public_news (Berita Publik)</option>
                <option value="REBOOT_ENGINE">REBOOT_ENGINE (Syscall)</option>
                <option value="applicant_submissions">applicant_submissions (PPDB)</option>
              </select>
            </div>

            <button
              onClick={handleTestPermission}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition"
            >
              <ShieldCheck className="w-4 h-4" /> Evaluate SELinux Policy
            </button>

            {testResult && (
              <div className={`p-4 rounded-2xl border transition-all ${
                testResult.allowed
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {testResult.allowed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                  <span className="font-bold text-xs">
                    {testResult.allowed ? 'ACCESS GRANTED (SELinux OK)' : 'ACCESS DENIED (AVC REJECTION)'}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed opacity-90">
                  {testResult.allowed
                    ? `Subject [${testEngine}] is explicitly authorized to ${testAction.toUpperCase()} target "${testResource}".`
                    : `Kernel Policy Violation: Subject [${testEngine}] is forbidden to ${testAction.toUpperCase()} target "${testResource}". Request dropped.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
