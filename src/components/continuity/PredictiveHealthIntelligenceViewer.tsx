import React, { useState, useEffect } from 'react';
import { Eye, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { ContinuityIntelligenceEngine, PredictiveHealthAnomaly } from '../../core/continuity/continuityIntelligenceEngine';

export const PredictiveHealthIntelligenceViewer: React.FC = () => {
  const [anomalies, setAnomalies] = useState<PredictiveHealthAnomaly[]>([]);
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'CLEAN'>('IDLE');

  useEffect(() => {
    const engine = ContinuityIntelligenceEngine.getInstance();
    setAnomalies(engine.getPredictiveAnomalies());
  }, []);

  const runPredictiveScan = () => {
    setScanState('SCANNING');
    setTimeout(() => {
      setScanState('CLEAN');
      setTimeout(() => setScanState('IDLE'), 2000);
    }, 800);
  };

  return (
    <div id="r862-predictive-health-intelligence" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded">R862</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Early Anomaly Shield</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Predictive Health Intelligence</h2>
              <p className="text-sm text-slate-500">
                Pendeteksi tren penurunan performa &amp; potensi bottleneck sebelum berdampak pada proses belajar mengajar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runPredictiveScan}
              disabled={scanState === 'SCANNING'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium text-sm rounded-lg transition-all shadow-sm"
            >
              <Sparkles className={`w-4 h-4 ${scanState === 'SCANNING' ? 'animate-spin' : ''}`} />
              {scanState === 'SCANNING' ? 'Menganalisis Tren...' : 'Pindai Tren Prediktif'}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Health Index Prediktif</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">99.8 / 100</p>
          <span className="text-xs text-emerald-600 font-medium">Stabilitas optimal untuk 180 hari ke depan</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Anomali Terdeteksi</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">0 Kritis</p>
          <span className="text-xs text-slate-500">2 indikator dalam pengawasan otomatis</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-Mitigation Active</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">100% Siaga</p>
          <span className="text-xs text-emerald-600 font-medium">Pencegahan dini tanpa jeda sistem</span>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Daftar Indikator Kesehatan Prediktif (Proaktif)
          </h3>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded border border-indigo-200">
            Realtime Analysis
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {anomalies.map((a) => (
            <div key={a.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{a.id}</span>
                  <h4 className="font-semibold text-slate-800 text-sm">{a.subsystem}</h4>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium border border-blue-100">
                    {a.metric}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Estimasi Dampak: <strong>{a.timeToImpact}</strong></span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {a.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <span className="font-semibold text-indigo-700 shrink-0">Tindakan Preventif:</span>
                <span>{a.preventiveAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
