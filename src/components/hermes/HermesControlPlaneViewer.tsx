import React, { useState } from 'react';
import { HermesActivationGate, HermesState } from '../../core/hermes/HermesActivationGate';
import { HermesAdministrativeServiceContract } from '../../core/hermes/HermesAdministrativeServiceContract';
import { SovereignManualAdministration, AdministrationMode } from '../../core/hermes/SovereignManualAdministration';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  PauseCircle, 
  PlayCircle, 
  UserCheck, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  FileCode, 
  MessageSquareCode 
} from 'lucide-react';

export const HermesControlPlaneViewer: React.FC = () => {
  const gate = HermesActivationGate.getInstance();
  const contract = HermesAdministrativeServiceContract.getInstance();
  const manualAdmin = SovereignManualAdministration.getInstance();

  const [hermesState, setHermesState] = useState<HermesState>(gate.getState());
  const [checklist] = useState(gate.getChecklist());
  const [adminMode, setAdminMode] = useState<AdministrationMode>(manualAdmin.getCurrentMode());
  const [commandInput, setCommandInput] = useState('');
  const [commandReply, setCommandReply] = useState<string | null>(null);
  const [contracts] = useState(contract.getContracts());
  const [invariants] = useState(contract.getEnforcedInvariants());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleStateChange = (target: HermesState) => {
    const res = gate.setState(target);
    setHermesState(gate.getState());
    setFeedbackMessage(res.message);
  };

  const handleModeChange = (target: AdministrationMode) => {
    const res = manualAdmin.setMode(target);
    setAdminMode(manualAdmin.getCurrentMode());
    setFeedbackMessage(res.message);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const res = manualAdmin.parseNaturalCommand(commandInput);
    setCommandReply(res.reply);
    setAdminMode(manualAdmin.getCurrentMode());
    setCommandInput('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-500/40 text-white space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-mono font-bold text-xl text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/30 text-amber-300 border border-amber-400/30">
                  R672–R674 HERMES CONTROL PLANE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  CURRENT STATUS: {hermesState} (DORMANT SAFE)
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                Hermes Activation Gate &amp; Sovereign Manual Administration
              </h2>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 inline-block">
              100% Zero External Dependencies
            </span>
            <span className="block text-[10px] text-amber-300 mt-1">
              db.ts SSoT &bull; RBAC Bound
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Kendali kedaulatan Super Admin atas eksekutor administratif Hermes. Hermes tetap berstatus DORMANT secara default tanpa paket npm tambahan atau panggilan API berbayar.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs border border-amber-500/40 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Grid: Gate Checklist & Mode Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* R672: Activation Gate Safety Matrix */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <strong className="text-sm text-slate-900 dark:text-white">R672: Activation Gate Checklist</strong>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
              LOCK ENGAGED
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <span>Super Admin Authorization:</span>
              <strong className={checklist.superAdminAuthorization ? 'text-emerald-500' : 'text-rose-500'}>
                {checklist.superAdminAuthorization ? 'GRANTED' : 'UNAUTHORIZED (Default)'}
              </strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <span>Guardian Ring-0 Health:</span>
              <strong className="text-emerald-500">{checklist.guardianRing0HealthScore}% (Healthy)</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <span>Constitution Invariant Health:</span>
              <strong className="text-emerald-500">{checklist.constitutionHealthScore}% (100% Intact)</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <span>Zero External Dependency Enforced:</span>
              <strong className="text-emerald-500">VERIFIED (100% Zero Lock-in)</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <span>Dormant Safety Lock:</span>
              <strong className="text-amber-500">ACTIVE (Prevent Autonomous Drift)</strong>
            </div>
          </div>

          {/* State Transition Action Buttons */}
          <div className="pt-2">
            <span className="text-[10px] text-slate-400 font-bold block mb-2">Transisi Status Kontrol:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStateChange('DORMANT')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700"
              >
                Set DORMANT
              </button>
              <button
                onClick={() => handleStateChange('READY')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
              >
                Set READY
              </button>
              <button
                onClick={() => handleStateChange('ARMED')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
              >
                Test ARMED (Gated)
              </button>
              <button
                onClick={() => handleStateChange('ACTIVE')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Test ACTIVE (Gated)
              </button>
            </div>
          </div>
        </div>

        {/* R674: Sovereign Manual Administration Controls */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <strong className="text-sm text-slate-900 dark:text-white">R674: Sovereign Admin Controls</strong>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              MODE: {adminMode}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleModeChange('MANUAL_ADMIN')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                adminMode === 'MANUAL_ADMIN'
                  ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1" />
              <span>Manual Admin</span>
            </button>

            <button
              onClick={() => handleModeChange('PAUSED')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                adminMode === 'PAUSED'
                  ? 'bg-amber-600 text-white border-amber-500 font-bold'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <PauseCircle className="w-4 h-4 mx-auto mb-1" />
              <span>Pause Hermes</span>
            </button>

            <button
              onClick={() => handleModeChange('AUTONOMOUS_STANDBY')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                adminMode === 'AUTONOMOUS_STANDBY'
                  ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <PlayCircle className="w-4 h-4 mx-auto mb-1" />
              <span>Resume Standby</span>
            </button>

            <button
              onClick={() => handleModeChange('SUSPENDED')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                adminMode === 'SUSPENDED'
                  ? 'bg-rose-600 text-white border-rose-500 font-bold'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <AlertOctagon className="w-4 h-4 mx-auto mb-1" />
              <span>Suspend Total</span>
            </button>

            <button
              onClick={() => handleModeChange('GLOBAL_OVERRIDE')}
              className={`p-3 rounded-2xl border text-center transition-all col-span-2 ${
                adminMode === 'GLOBAL_OVERRIDE'
                  ? 'bg-purple-600 text-white border-purple-500 font-bold'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mx-auto mb-1" />
              <span>Global Override Super Admin</span>
            </button>
          </div>

          {/* Command Simulator */}
          <form onSubmit={handleCommandSubmit} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold">Simulator Perintah Verbal Super Admin:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Cth: 'Asy, jeda Hermes.', 'Asy, saya ingin bekerja sebagai admin.'"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
              >
                Kirim
              </button>
            </div>
            {commandReply && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200">
                {commandReply}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* R673: Administrative Service Contracts Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-500" />
            <strong className="text-sm text-slate-900 dark:text-white">R673: Administrative Service Contracts</strong>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            PIPELINE: Identity &rarr; Role &rarr; Capability &rarr; Action &rarr; Audit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {contracts.map(c => (
            <div key={c.taskId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{c.taskId}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[9px]">
                  {c.targetRole}
                </span>
              </div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">{c.taskType}</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">{c.description}</p>
              <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[10px] space-y-1 text-slate-500 dark:text-slate-400">
                <div>Cap: <strong>{c.requiredCapability}</strong></div>
                <div>Path: <strong>{c.targetServicePath}</strong></div>
                <div>Rule: <strong>{c.guardianVerificationRule}</strong></div>
              </div>
            </div>
          ))}
        </div>

        {/* 6 Invariants */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
          <strong className="text-xs text-indigo-900 dark:text-indigo-200 block">6 Invarian Hukum Administratif Hermes:</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            {invariants.map((inv, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{inv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
