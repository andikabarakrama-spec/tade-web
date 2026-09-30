import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Lock, 
  FileCheck,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { CompletionOptimizationEngine, OptimizationMetricsSnapshot, MetricTrendPoint } from '../../core/hermes/CompletionOptimizationEngine';
import { ManualTakeoverLearning, LearningCandidate, CandidateStatus } from '../../core/hermes/ManualTakeoverLearning';
import { FailurePatternIntelligence, FailurePatternCluster } from '../../core/hermes/FailurePatternIntelligence';
import { WorkflowAdaptationEngine, WorkflowRecommendation } from '../../core/hermes/WorkflowAdaptationEngine';

export const AdaptiveAdminQualityBoardViewer: React.FC = () => {
  const [metrics, setMetrics] = useState<OptimizationMetricsSnapshot>(() => 
    CompletionOptimizationEngine.getInstance().calculateMetrics()
  );
  const [trendHistory, setTrendHistory] = useState<MetricTrendPoint[]>(() => 
    CompletionOptimizationEngine.getInstance().getTrendHistory()
  );
  const [candidates, setCandidates] = useState<LearningCandidate[]>(() => 
    ManualTakeoverLearning.getInstance().getAllCandidates()
  );
  const [failureClusters, setFailureClusters] = useState<FailurePatternCluster[]>(() => 
    FailurePatternIntelligence.getInstance().getAllClusters()
  );
  const [recommendations, setRecommendations] = useState<WorkflowRecommendation[]>(() => 
    WorkflowAdaptationEngine.getInstance().getAllRecommendations()
  );

  const [selectedCandidate, setSelectedCandidate] = useState<LearningCandidate | null>(candidates[0] || null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const refreshAll = () => {
    setMetrics(CompletionOptimizationEngine.getInstance().calculateMetrics());
    setCandidates(ManualTakeoverLearning.getInstance().getAllCandidates());
    setFailureClusters(FailurePatternIntelligence.getInstance().getAllClusters());
    setRecommendations(WorkflowAdaptationEngine.getInstance().getAllRecommendations());
  };

  const handleUpdateStatus = (candidateId: string, status: CandidateStatus) => {
    const res = ManualTakeoverLearning.getInstance().updateCandidateStatus(
      candidateId, 
      status, 
      'SUPER_ADMIN', 
      reviewNote || `Status diperbarui menjadi ${status} via Adaptive Quality Board`
    );
    setActionFeedback(res.message);
    setReviewNote('');
    refreshAll();
    setTimeout(() => setActionFeedback(null), 5000);
  };

  return (
    <div className="space-y-6" id="adaptive-quality-board">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                RC87 Adaptive Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R696 &bull; R699
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Adaptive Admin Quality Board
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pusat observabilitas mutu adaptif, telaah kandidat pembelajaran manusia (Manual Takeover Learning), tren kegagalan, dan metrik optimasi penyelesaian tugas administratif.
            </p>
          </div>
          <button 
            onClick={refreshAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Metrik
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 6 Core Mathematical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Completion Rate</div>
          <div className="text-2xl font-black text-emerald-400">{metrics.completionRatePct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{metrics.completedTasksCount} / {metrics.totalEvaluatedTasks} tugas tuntas</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Recovery Rate</div>
          <div className="text-2xl font-black text-cyan-400">{metrics.recoveryRatePct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{metrics.recoveredTasksCount} pulih mandiri</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Human Intervene</div>
          <div className="text-2xl font-black text-amber-400">{metrics.humanInterventionRatePct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{metrics.humanInterventionsCount} handoff/takeover</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Failure Rate</div>
          <div className="text-2xl font-black text-rose-400">{metrics.failureRatePct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{metrics.unrecoverableFailuresCount} kegagalan fatal</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Duplicate Rate</div>
          <div className="text-2xl font-black text-indigo-400">{metrics.duplicateRatePct}%</div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1">0.0% Invarian Terjaga</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Resume Success</div>
          <div className="text-2xl font-black text-teal-400">{metrics.resumeSuccessRatePct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{metrics.resumedTasksCount} tugas dijeda sukses</div>
        </div>
      </div>

      {/* Main Content Grid: Candidates on Left, Failure Patterns & Trends on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Candidate Workflow Review Section (R693) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Candidate Workflows (Manual Takeover Learning)
              </h2>
            </div>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
              {candidates.length} Terdaftar
            </span>
          </div>

          <div className="space-y-3">
            {candidates.map(cand => {
              const isSelected = selectedCandidate?.candidateId === cand.candidateId;
              return (
                <div 
                  key={cand.candidateId}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800/90 border-indigo-500/60 shadow-md' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-black text-indigo-400">{cand.candidateId} &bull; {cand.sourceTaskId}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      cand.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      cand.status === 'REVIEWING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      cand.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}>
                      {cand.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    {cand.suggestedWorkflowRevision.proposedTitle}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                    <strong className="text-slate-300">Alasan Takeover:</strong> {cand.takeoverReason}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>Peran: <strong className="text-slate-400">{cand.takeoverByRole}</strong></span>
                    <span>Dry-Run Lab: <strong className={cand.dryRunLabPassed ? 'text-emerald-400' : 'text-amber-400'}>{cand.dryRunLabPassed ? 'LULUS (Qualified)' : 'Belum Diuji'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Candidate Detailed Inspection & Super Admin Action Panel */}
          {selectedCandidate && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detail Delta Pembelajaran: {selectedCandidate.candidateId}
                </span>
                <span className="text-[11px] text-slate-500">Kategori: {selectedCandidate.category}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-[11px] font-bold text-rose-400 mb-1">Original Planned Workflow:</div>
                  <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                    {selectedCandidate.delta.originalPlannedSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-[11px] font-bold text-emerald-400 mb-1">Human Action Steps (Real Takeover):</div>
                  <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                    {selectedCandidate.delta.actualHumanActionSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-lg text-xs">
                <strong className="text-indigo-300">Keunggulan Terobservasi:</strong>
                <p className="text-slate-300 mt-0.5">{selectedCandidate.delta.observedAdvantage}</p>
              </div>

              {/* Status Update Actions */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400">
                  Keputusan Founder / Super Admin (Non Auto-Production):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.candidateId, 'REVIEWING')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Tandai REVIEWING
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.candidateId, 'APPROVED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Setujui (APPROVED)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.candidateId, 'REJECTED')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Tolak (REJECTED)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.candidateId, 'ARCHIVED')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                  >
                    Arsipkan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Failure Pattern Clusters (R695) & Historical Trends */}
        <div className="lg:col-span-5 space-y-6">
          {/* Failure Pattern Intelligence */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">
                  Failure Pattern Intelligence (R695)
                </h2>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                6 Klaster
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {failureClusters.map(fc => (
                <div key={fc.clusterId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{fc.category}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                      fc.impactLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      fc.impactLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      Frekuensi: {fc.frequencyCount}x
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-200">{fc.title}</div>
                  <p className="text-[11px] text-slate-400">{fc.description}</p>
                  
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300">
                    <strong className="text-slate-400">Mitigasi:</strong> {fc.mitigationStrategy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Trend & Health Index */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">System Resilience & Health Index</h3>
              </div>
              <span className="text-lg font-black text-emerald-400">{metrics.systemHealthIndex}/100</span>
            </div>

            <div className="space-y-2 text-xs">
              {trendHistory.map(th => (
                <div key={th.batchId} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{th.batchId}</div>
                    <div className="text-[10px] text-slate-500">Completion: {th.completionRate}% &bull; Recovery: {th.recoveryRate}%</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded font-semibold text-[11px]">
                    Resume: {th.resumeSuccessRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
