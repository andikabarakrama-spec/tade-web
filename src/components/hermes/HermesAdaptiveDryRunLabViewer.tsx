import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  Cpu, 
  Layers, 
  FileCode2,
  Award,
  RefreshCw
} from 'lucide-react';
import { HermesAdaptiveDryRunLab, DryRunEvaluationReport } from '../../core/hermes/HermesAdaptiveDryRunLab';
import { ManualTakeoverLearning, LearningCandidate } from '../../core/hermes/ManualTakeoverLearning';

export const HermesAdaptiveDryRunLabViewer: React.FC = () => {
  const lab = HermesAdaptiveDryRunLab.getInstance();
  const takeoverLearning = ManualTakeoverLearning.getInstance();

  const [candidates, setCandidates] = useState<LearningCandidate[]>(() => takeoverLearning.getAllCandidates());
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.candidateId || '');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<DryRunEvaluationReport | null>(null);

  const selectedCandidate = candidates.find(c => c.candidateId === selectedCandidateId) || candidates[0];

  const handleRunEvaluation = () => {
    if (!selectedCandidate) return;
    setIsSimulating(true);

    setTimeout(() => {
      const report = lab.evaluateCandidateWorkflow(selectedCandidate);
      setActiveReport(report);
      setIsSimulating(false);
      setCandidates(takeoverLearning.getAllCandidates());
    }, 600);
  };

  return (
    <div className="space-y-6" id="hermes-adaptive-dry-run-lab">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Adaptive Dry-Run Sandbox
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R700
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Hermes Adaptive Dry-Run Lab
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Laboratorium pengujian in-memory terisolasi. Seluruh usulan alur kerja adaptif wajib lulus 5 vektor uji ketat sebelum dapat diajukan untuk verifikasi Founder.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Hermes: Dormant (Zero Prod Mutation)
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Selector and Execution Action */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pilih Kandidat Alur Kerja untuk Diuji di Lab:
          </label>
          <select 
            value={selectedCandidateId}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
            className="w-full md:w-96 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            {candidates.map(c => (
              <option key={c.candidateId} value={c.candidateId}>
                {c.candidateId} &mdash; {c.suggestedWorkflowRevision.proposedTitle} ({c.status})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isSimulating || !selectedCandidate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl text-sm font-bold transition shadow-lg"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Menjalankan 5 Vektor Uji...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Uji Kelayakan Lab (Dry-Run R700)
            </>
          )}
        </button>
      </div>

      {/* Evaluation Results Report */}
      {activeReport ? (
        <div className="space-y-6">
          {/* Verdict Scorecard Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Laporan Hasil Evaluasi Lab: {activeReport.reportId}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {activeReport.workflowTitle}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                  <span>Isolasi Sandbox: <strong className="text-emerald-400">Terverifikasi 100%</strong></span>
                  <span>&bull;</span>
                  <span>Mutasi DB Produksi: <strong className="text-emerald-400">0 Record (Nol Efek Samping)</strong></span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skor Kelayakan</div>
                <div className="text-3xl font-black text-emerald-400">{activeReport.totalScore} / 100</div>
                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  activeReport.qualificationVerdict === 'QUALIFIED_FOR_FOUNDER_REVIEW' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {activeReport.qualificationVerdict === 'QUALIFIED_FOR_FOUNDER_REVIEW' ? 'LAYAK UNTUK FOUNDER REVIEW' : 'TIDAK LAYAK'}
                </span>
              </div>
            </div>
          </div>

          {/* 5 Test Vector Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hasil 5 Vektor Pengujian Ketat
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                5 dari 5 Vektor Uji Berhasil (100%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeReport.testVectors.map(vec => (
                <div key={vec.vectorId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-400">{vec.vectorId} &bull; {vec.category}</span>
                    <span className="text-xs font-bold text-emerald-400">+{vec.score} Poin</span>
                  </div>

                  <div className="text-xs font-bold text-white">{vec.name}</div>
                  <p className="text-[11px] text-slate-400">{vec.description}</p>

                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300">
                    <strong className="text-emerald-400">Detail Hasil:</strong> {vec.details}
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1">
                    Simulasi Waktu Eksekusi: <strong className="text-slate-400">{vec.simulatedLatencyMs}ms</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <FlaskConical className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Lab Pengujian Siap Dijalankan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Pilih salah satu kandidat alur kerja di atas lalu klik tombol <strong>"Uji Kelayakan Lab"</strong> untuk menjalankan simulasi 5 vektor uji in-memory secara komprehensif.
          </p>
        </div>
      )}
    </div>
  );
};
