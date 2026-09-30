import React, { useState, useEffect } from 'react';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Users,
  Layers,
  ChevronRight,
  Filter,
  Sparkles,
  RefreshCw,
  Crown
} from 'lucide-react';
import {
  featureRolloutService,
  RolloutFeature,
  RolloutStage
} from '../../services/featureRolloutService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const FeatureRolloutCenter: React.FC = () => {
  const [features, setFeatures] = useState<RolloutFeature[]>(() => featureRolloutService.getFeatures());
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(features[0]?.id || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = featureRolloutService.subscribe(newFeatures => {
      setFeatures(newFeatures);
    });
    return unsub;
  }, []);

  const activeFeature = features.find(f => f.id === selectedFeatureId) || features[0];

  const handleStageChange = (stage: RolloutStage) => {
    if (!activeFeature) return;
    featureRolloutService.setStage(activeFeature.id, stage, 'Founder Andika');
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Feature Rollout Center',
      `Ubah tahap rollout fitur [${activeFeature.name}] -> ${stage}`
    );
    showFeedback(`Tahap peluncuran diubah ke: ${stage}`);
  };

  const handleToggle = () => {
    if (!activeFeature) return;
    const newState = !activeFeature.enabled;
    featureRolloutService.toggleFeature(activeFeature.id, newState, 'Founder Andika');
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Feature Rollout Center',
      `Toggle fitur [${activeFeature.name}] -> ${newState ? 'ENABLED' : 'DISABLED'}`
    );
    showFeedback(`Status fitur: ${newState ? 'AKTIF' : 'NONAKTIF'}`);
  };

  const handlePercentageChange = (pct: number) => {
    if (!activeFeature) return;
    featureRolloutService.setPercentage(activeFeature.id, pct, 'Founder Andika');
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const STAGES: Array<{ id: RolloutStage; label: string; desc: string; color: string }> = [
    { id: 'ALPHA', label: 'Alpha (Internal)', desc: 'Admin & Founder saja (10%)', color: 'text-rose-400 bg-rose-950/40 border-rose-800' },
    { id: 'BETA', label: 'Beta (Pilot)', desc: 'Dewan Guru & Kelas Percontohan (25%)', color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
    { id: 'PREVIEW', label: 'Preview (Selected)', desc: 'Sebagian Wali Murid Terpilih (50%)', color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
    { id: 'LIMITED', label: 'Limited Cohort', desc: 'Kelas Tertarget Saja (75%)', color: 'text-teal-400 bg-teal-950/40 border-teal-800' },
    { id: 'PUBLIC', label: 'Public (100% GA)', desc: 'Seluruh Civitas Madrasah (100%)', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-teal-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/40">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Feature Rollout Center</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold">
                Zero-Redeploy Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Peluncuran fitur bertahap (Alpha → Public GA) berdasarkan Role dan Rombel tanpa perlu build ulang.
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>7 Fitur Terdaftar</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-950/80 border border-teal-500/60 rounded-xl text-teal-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          {feedback}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feature List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Daftar Modul & Fitur
          </h3>
          <div className="space-y-2">
            {features.map(f => {
              const isSelected = f.id === selectedFeatureId;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeatureId(f.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500/60 shadow-md ring-1 ring-teal-500/40'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white line-clamp-1">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                        {f.stage}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {f.rolloutPercentage}% rollout
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Feature Rollout Controls */}
        {activeFeature && (
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{activeFeature.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${activeFeature.enabled ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50' : 'bg-rose-950 text-rose-300 border-rose-800'}`}>
                    {activeFeature.enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{activeFeature.description}</p>
              </div>

              <button
                onClick={handleToggle}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFeature.enabled
                    ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                {activeFeature.enabled ? 'Matikan Fitur' : 'Aktifkan Fitur'}
              </button>
            </div>

            {/* Stage Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tahapan Peluncuran (Stage)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {STAGES.map(s => {
                  const isActive = activeFeature.stage === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStageChange(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isActive
                          ? `${s.color} ring-1 ring-teal-400 shadow-md font-bold`
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rollout Percentage Slider */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Persentase Cakupan Pengguna</span>
                <span className="font-mono font-bold text-teal-400">{activeFeature.rolloutPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={activeFeature.rolloutPercentage}
                onChange={e => handlePercentageChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0% (Internal)</span>
                <span>25% (Pilot)</span>
                <span>50% (Preview)</span>
                <span>75% (Limited)</span>
                <span>100% (Full GA)</span>
              </div>
            </div>

            {/* Role & Cohort Targeting Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-400" /> Role Diizinkan
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeFeature.allowedRoles.map(r => (
                    <span
                      key={r}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Target Rombel / Cohort
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeFeature.targetCohorts.map(c => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
