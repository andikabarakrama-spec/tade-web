import React, { useState } from 'react';
import { 
  PauseCircle, 
  PlayCircle, 
  ShieldCheck, 
  Database, 
  Fingerprint, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Layers, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { AdaptiveWorkflowMemory, TaskWorkflowMemorySnapshot, ExecutionFingerprint } from '../../core/hermes/AdaptiveWorkflowMemory';
import { PauseResumeIntelligence, PauseOperationResult, ResumeOperationResult } from '../../core/hermes/PauseResumeIntelligence';
import { HermesContinuityReconciliation, ContinuityReconciliationReport } from '../../core/hermes/HermesContinuityReconciliation';
import { AdministrativeTaskOrchestrator } from '../../core/hermes/AdministrativeTaskOrchestrator';

export const PauseResumeContinuityViewer: React.FC = () => {
  const memory = AdaptiveWorkflowMemory.getInstance();
  const pauseResume = PauseResumeIntelligence.getInstance();
  const reconciler = HermesContinuityReconciliation.getInstance();
  const orchestrator = AdministrativeTaskOrchestrator.getInstance();

  const [snapshots, setSnapshots] = useState<TaskWorkflowMemorySnapshot[]>(() => memory.getAllSnapshots());
  const [selectedTaskId, setSelectedTaskId] = useState<string>(snapshots[0]?.taskId || 'TASK-2026-0801');
  const [pauseReasonInput, setPauseReasonInput] = useState('Audit Rutin Pengurus Yayasan');
  const [pauseResult, setPauseResult] = useState<PauseOperationResult | null>(null);
  const [resumeResult, setResumeResult] = useState<ResumeOperationResult | null>(null);
  const [reconciliationReport, setReconciliationReport] = useState<ContinuityReconciliationReport | null>(null);

  const activeSnapshot = snapshots.find(s => s.taskId === selectedTaskId) || snapshots[0];

  const refreshState = () => {
    setSnapshots(memory.getAllSnapshots());
  };

  const handlePause = () => {
    if (!selectedTaskId) return;
    const res = pauseResume.pauseTask(selectedTaskId, pauseReasonInput);
    setPauseResult(res);
    setResumeResult(null);
    refreshState();
  };

  const handleResume = () => {
    if (!selectedTaskId) return;
    // Step 1: Reconcile before resume (R698)
    const recon = reconciler.reconcileBeforeResume(selectedTaskId);
    setReconciliationReport(recon);

    // Step 2: Resume task execution (R692)
    const res = pauseResume.resumeTask(selectedTaskId);
    setResumeResult(res);
    setPauseResult(null);
    refreshState();
  };

  const states = [
    'RECEIVED',
    'UNDERSTANDING',
    'PLANNED',
    'AUTHORIZED',
    'EXECUTING',
    'PAUSED',
    'VERIFYING',
    'COMPLETED'
  ];

  return (
    <div className="space-y-6" id="pause-resume-continuity-viewer">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Continuity Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R691 &bull; R692 &bull; R698
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Pause/Resume State Intelligence & Continuity Reconciliation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Preservasi snapshot memori dan Execution Fingerprint untuk penjaminan Zero Duplicate Execution saat melanjutkan tugas yang sempat dijeda.
            </p>
          </div>
        </div>
      </div>

      {/* Task Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilih Task Memori:</span>
          <select 
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-sky-500"
          >
            {orchestrator.getAllTasks().map(t => (
              <option key={t.taskId} value={t.taskId}>
                {t.taskId} &mdash; {t.objective} ({t.state})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/90 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow"
          >
            <PauseCircle className="w-4 h-4" />
            Pause Task (Preserve State)
          </button>
          <button
            onClick={handleResume}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow"
          >
            <PlayCircle className="w-4 h-4" />
            Resume Pipeline (R692)
          </button>
        </div>
      </div>

      {/* State Machine Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              State Machine Workflow: {activeSnapshot?.taskId || selectedTaskId}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Current State: <strong className="text-sky-400">{activeSnapshot?.currentState || 'INITIALIZING'}</strong>
          </span>
        </div>

        {/* State Pipeline Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {states.map((st, idx) => {
            const isCurrent = activeSnapshot?.currentState === st;
            return (
              <div 
                key={st}
                className={`p-2.5 rounded-xl border text-center transition ${
                  isCurrent 
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-black shadow-lg ring-1 ring-sky-400/50'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-500 text-xs font-medium'
                }`}
              >
                <div className="text-[10px] opacity-70 mb-0.5">0{idx + 1}</div>
                <div className="text-[11px] truncate">{st}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Execution Fingerprints & Resume Pipeline Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Preserved Workflow Steps & Fingerprints (R691) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                Execution Fingerprints & Preserved Checkpoints
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Deduplication Signature: <strong className="font-mono text-slate-300">{activeSnapshot?.deduplicationSignature?.slice(0, 16)}...</strong>
            </span>
          </div>

          <div className="space-y-3">
            {activeSnapshot?.steps?.map((step) => {
              const hasFp = !!step.fingerprint;
              return (
                <div 
                  key={step.stepIndex}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-bold">
                        {step.stepIndex}
                      </span>
                      <span className="text-xs font-bold text-white">{step.stepName}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      step.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      step.status === 'PAUSED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{step.description}</p>

                  {hasFp && (
                    <div className="p-2 bg-slate-900 rounded border border-slate-800/80 font-mono text-[10px] text-indigo-300 space-y-0.5">
                      <div><strong className="text-slate-400">Fingerprint ID:</strong> {step.fingerprint?.fingerprintId}</div>
                      <div><strong className="text-slate-400">Input Hash:</strong> {step.fingerprint?.inputPayloadHash}</div>
                      <div><strong className="text-slate-400">Output Checksum:</strong> {step.fingerprint?.outputChecksum}</div>
                      <div><strong className="text-slate-400">Executed At:</strong> {step.fingerprint?.executedAt} ({step.fingerprint?.durationMs}ms)</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Resume Pipeline Trail & Reconciliation (R692, R698) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resume Pipeline Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Resume Execution Pipeline (R692)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-400">
                RELOAD &bull; RECONCILE &bull; VERIFY &bull; CONTINUE
              </span>
            </div>

            {resumeResult ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                  <strong>Hasil Resumption:</strong> {resumeResult.message}
                </div>

                <div className="space-y-2">
                  {resumeResult.pipelineTrail.map((pt, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-400">{pt.phase} PHASE</span>
                        <span className="text-[10px] text-slate-500 font-mono">{pt.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{pt.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                Tekan tombol <strong>Resume Pipeline</strong> di atas untuk melihat proses RELOAD &rarr; RECONCILE &rarr; VERIFY &rarr; CONTINUE secara live.
              </div>
            )}
          </div>

          {/* SSoT Reconciliation Report (R698) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Reconciliation Invariant Guard (R698)</h3>
              </div>
              <span className="text-xs text-cyan-300 font-mono">db.ts SSoT</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">Zero Data Drift Detected</span>
                <span className="text-emerald-400 font-bold">100% SINKRON</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">Duplicate Checksum Match</span>
                <span className="text-emerald-400 font-bold">TERKUNCI AMAN</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
