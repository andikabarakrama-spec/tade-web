import React, { useState } from 'react';
import { HermesDryRunSimulator, SimulationScenarioResult } from '../../core/hermes/HermesDryRunSimulator';
import { AdministrativeSafetyGate, SafetyCheckResult } from '../../core/hermes/AdministrativeSafetyGate';
import { TaskRole } from '../../core/hermes/AdministrativeTaskOrchestrator';
import { 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Flame, 
  Lock, 
  RefreshCw, 
  Sliders, 
  Cpu 
} from 'lucide-react';

export const HermesDryRunSimulatorViewer: React.FC = () => {
  const simulator = HermesDryRunSimulator.getInstance();
  const safetyGate = AdministrativeSafetyGate.getInstance();

  const [results, setResults] = useState<SimulationScenarioResult[]>(simulator.runAllSimulations());
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenarioResult | null>(null);

  // Safety Gate Interactive Tester
  const [testAction, setTestAction] = useState('DELETE_ALL_STUDENT_RECORDS');
  const [testRole, setTestRole] = useState<TaskRole>('GURU');
  const [safetyVerdict, setSafetyVerdict] = useState<SafetyCheckResult | null>(null);

  const handleRunAll = () => {
    setIsRunning(true);
    setTimeout(() => {
      setResults(simulator.runAllSimulations());
      setIsRunning(false);
    }, 400);
  };

  const handleEvaluateSafety = () => {
    const res = safetyGate.evaluateAction(testAction, testRole);
    setSafetyVerdict(res);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-mono font-bold text-xl text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                  R688 &bull; R690 READINESS &amp; DRY-RUN SIMULATOR
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                  HERMES DORMANT &bull; ZERO PRODUCTION MUTATION
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Hermes Administrative Readiness Simulator (7 Scenarios)
              </h2>
            </div>
          </div>

          <button
            onClick={handleRunAll}
            disabled={isRunning}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Jalankan Ulang 7 Skenario</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Simulator aman in-memory untuk menguji seluruh alur kerja penyelesaian tugas, pemulihan otomatis, pause-resume tanpa duplikasi, dan evaluasi Guardian Ring-0 tanpa menyentuh data produksi.
        </p>
      </div>

      {/* 7 Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {results.map(sc => (
          <div
            key={sc.scenarioId}
            onClick={() => setSelectedScenario(sc)}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 cursor-pointer hover:border-emerald-400 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Skenario #{sc.scenarioId}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[9px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>PASS ({sc.simulatedLatencyMs}ms)</span>
              </span>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white text-xs">{sc.scenarioName}</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">{sc.notes}</p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Expected: {sc.expectedOutcome}</span>
              <span className="underline">Detail Eksekusi &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Detail Modal */}
      {selectedScenario && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 text-white space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Log Detail Eksekusi Simulator</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedScenario.scenarioName}</h3>
            </div>
            <button onClick={() => setSelectedScenario(null)} className="text-slate-400 hover:text-white font-bold">✕ Tutup</button>
          </div>

          <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 font-bold text-[10px] block mb-1">Jejak Langkah (Zero Mutation):</span>
            {selectedScenario.executionSteps.map((step, idx) => (
              <div key={idx} className="text-slate-300 text-xs">
                {step}
              </div>
            ))}
          </div>

          {selectedScenario.preservedStateSnapshot && (
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] space-y-1">
              <strong className="text-amber-400 block">Snapshot State Terawetkan:</strong>
              <pre className="text-slate-300">{JSON.stringify(selectedScenario.preservedStateSnapshot, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* R688: Administrative Safety Gate Interactive Evaluator */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <strong className="text-sm text-slate-900 dark:text-white">R688: Administrative Safety Gate Evaluator</strong>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            Guardian Ring-0 &bull; Multi-Sig Guard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Aksi Administratif untuk Diuji:</label>
            <select
              value={testAction}
              onChange={(e) => setTestAction(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="DELETE_ALL_STUDENT_RECORDS">DELETE_ALL_STUDENT_RECORDS (Penghapusan Data)</option>
              <option value="ESCALATE_ROLE_PERMISSION">ESCALATE_ROLE_PERMISSION (Perubahan Hak Akses)</option>
              <option value="LARGE_CASH_MUTATION">LARGE_CASH_MUTATION (Mutasi Kas &gt; Rp 1jt)</option>
              <option value="MODIFY_CONSTITUTIONAL_INVARIANT">MODIFY_CONSTITUTIONAL_INVARIANT (Konstitusi TADE)</option>
              <option value="READ_ATTENDANCE_SUMMARY">READ_ATTENDANCE_SUMMARY (Aman - Pembacaan Absensi)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Role Penguji:</label>
            <select
              value={testRole}
              onChange={(e) => setTestRole(e.target.value as TaskRole)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="GURU">Guru</option>
              <option value="ADMIN_TU">Admin Tata Usaha</option>
              <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
              <option value="KETUA_YAYASAN">Ketua Yayasan</option>
              <option value="SUPER_ADMIN">Super Admin (Sovereign)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleEvaluateSafety}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 transition-colors"
        >
          Evaluasi Keamanan Gate
        </button>

        {safetyVerdict && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 dark:text-white">Keputusan Guardian Ring-0:</strong>
              <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                safetyVerdict.guardianVerdict === 'PASS' ? 'bg-emerald-100 text-emerald-700' :
                safetyVerdict.guardianVerdict === 'HELD_FOR_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                VERDICT: {safetyVerdict.guardianVerdict}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">{safetyVerdict.rationale}</p>
            <div className="text-[10px] text-slate-400">
              <span>Peran Terotorisasi: <strong>{safetyVerdict.authorizedRoles.join(', ')}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
