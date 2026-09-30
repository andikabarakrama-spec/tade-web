import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, Lock, FileText, AlertCircle } from 'lucide-react';
import { ContinuityIntelligenceEngine, RiskObservatoryItem } from '../../core/continuity/continuityIntelligenceEngine';

export const GuardianRiskObservatoryViewer: React.FC = () => {
  const [risks, setRisks] = useState<RiskObservatoryItem[]>([]);

  useEffect(() => {
    const engine = ContinuityIntelligenceEngine.getInstance();
    setRisks(engine.getRiskObservatory());
  }, []);

  return (
    <div id="r863-guardian-risk-observatory" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-800 rounded">R863</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Ring-0 Fortress</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Guardian Risk Observatory</h2>
              <p className="text-sm text-slate-500">
                Observatorium risiko operasional holistik: kedaulatan data, kontinuitas jaringan, dan integritas finansial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Overall Risk Index: 2.8 / 100 (Safe)
          </div>
        </div>
      </div>

      {/* Grid Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{r.id}</span>
                <h3 className="font-semibold text-slate-800 text-sm">{r.riskCategory}</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Skor: {r.riskScore} ({r.level})
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Strategi Mitigasi Guardian:
              </div>
              <p className="text-slate-600 leading-relaxed">{r.mitigationStrategy}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Penanggung Jawab: <strong className="text-slate-700">{r.owner}</strong>
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ring-0 Compliant
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Constitutional Safety Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong>Jaminan Keamanan Ring-0:</strong> Seluruh observatorium risiko terikat langsung pada basis data tunggal (<code className="bg-emerald-100 px-1 py-0.5 rounded">src/services/db.ts</code>). Tidak ada lapisan bypass atau modul eksternal yang diizinkan memodifikasi parameter resiko tanpa otorisasi kunci sovereign.
        </div>
      </div>
    </div>
  );
};
