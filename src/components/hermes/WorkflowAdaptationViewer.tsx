import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck2, 
  Zap, 
  Award,
  Layers,
  Lock,
  Compass
} from 'lucide-react';
import { WorkflowAdaptationEngine, WorkflowRecommendation } from '../../core/hermes/WorkflowAdaptationEngine';
import { AdministrativePatternLearning, LearnedPatternTemplate } from '../../core/hermes/AdministrativePatternLearning';
import { ManualTakeoverLearning } from '../../core/hermes/ManualTakeoverLearning';

export const WorkflowAdaptationViewer: React.FC = () => {
  const adaptationEngine = WorkflowAdaptationEngine.getInstance();
  const patternLearning = AdministrativePatternLearning.getInstance();
  const takeoverLearning = ManualTakeoverLearning.getInstance();

  const [recommendations, setRecommendations] = useState<WorkflowRecommendation[]>(() => adaptationEngine.getAllRecommendations());
  const [learnedPatterns, setLearnedPatterns] = useState<LearnedPatternTemplate[]>(() => patternLearning.getAllLearnedTemplates());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [testSecurityInput, setTestSecurityInput] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  const filteredPatterns = selectedCategory === 'ALL' 
    ? learnedPatterns 
    : learnedPatterns.filter(p => p.domainCategory === selectedCategory);

  const handleTestPrivilegeSecurity = () => {
    const res = patternLearning.learnFromSuccessfulTask(
      'YAYASAN_GOVERNANCE',
      'Unauthorized Super Admin Bypass Pattern',
      'Percobaan mempelajari eskalasi wewenang oleh staf administrasi',
      ['Bypass Payload'],
      ['Force Write Root Invariants'],
      [],
      true // isPrivilegeEscalationAttempt: true
    );

    setSecurityMessage(res.message);
    setTimeout(() => setSecurityMessage(null), 6000);
  };

  return (
    <div className="space-y-6" id="workflow-adaptation-viewer">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Adaptive Learning
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R693 &bull; R694 &bull; R697
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Workflow Adaptation & Administrative Pattern Learning
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Sistem rekomendasi adaptasi alur kerja terstruktur yang belajar dari keberhasilan riil tanpa mutasi otomatis dan tanpa celah eskalasi izin.
            </p>
          </div>

          <button
            onClick={handleTestPrivilegeSecurity}
            className="flex items-center gap-2 px-3 py-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-bold transition"
          >
            <ShieldAlert className="w-4 h-4" />
            Uji Invarian Anti-Eskalasi (R697)
          </button>
        </div>
      </div>

      {securityMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{securityMessage}</span>
        </div>
      )}

      {/* Advisory Recommendations Grid (R694) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Workflow Adaptation Recommendations (Advisory Only &mdash; R694)
            </h2>
          </div>
          <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
            Non Auto-Production Guard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(rec => (
            <div key={rec.recommendationId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-400">{rec.recommendationId} &bull; {rec.targetWorkflowId}</span>
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded text-[11px] font-bold">
                  Skor Keyakinan: {rec.confidenceScore}%
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">
                {rec.recommendedChangeTitle}
              </h3>

              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Rasional:</strong> {rec.rationale}
              </p>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usulan Modifikasi Langkah:</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                  {rec.proposedStepModifications.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Sumber Bukti: <strong className="text-slate-400">{rec.evidenceSource}</strong></span>
                <span className="text-emerald-400 font-bold">Est. Latensi: {rec.estimatedLatencyImpactPct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learned Administrative Patterns (R697) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Learned Administrative Patterns & Proven Blueprints (R697)
            </h2>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'ABSENSI', 'SPP_PEMBAYARAN', 'YAYASAN_GOVERNANCE', 'ADMINISTRASI_GURU'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatterns.map(ptn => (
            <div key={ptn.templateId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400">{ptn.templateId} &bull; {ptn.domainCategory}</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-[11px] font-bold">
                  Frekuensi: {ptn.observedFrequency}x (100% Sukses)
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{ptn.patternName}</h3>
              <p className="text-xs text-slate-400">{ptn.description}</p>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pola Urutan Langkah Sukses:</div>
                <ol className="list-decimal list-inside text-slate-300 text-[11px] space-y-0.5">
                  {ptn.executionSequencePattern.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Invarian: <strong className="text-slate-400">{ptn.invariantsEnforced.join(', ')}</strong></span>
                <span className="text-sky-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {ptn.securityPrivilegeCheck}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
