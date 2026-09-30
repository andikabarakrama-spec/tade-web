import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Layers, 
  FileText, 
  Scale, 
  Sparkles, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { GuardianContinuousVerification, ContinuousVerificationReport, VerificationVectorResult } from '../../core/sovereign/guardianContinuousVerification';

export const GuardianContinuousVerificationViewer: React.FC = () => {
  const verifier = GuardianContinuousVerification.getInstance();
  const [report, setReport] = useState<ContinuousVerificationReport>(() => verifier.getLatestReport());
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedVector, setSelectedVector] = useState<VerificationVectorResult | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = verifier.runVerificationScan();
      setReport(res);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="space-y-6" id="guardian-continuous-verification-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Guardian Ring-0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R763 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Guardian Continuous Verification
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Audit internal berkelanjutan untuk mendeteksi *RBAC drift*, pergeseran SSoT, duplikasi registry, rute terputus, dan anomali pemetaan hak akses secara *real-time*.
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Jalankan Audit Penuh</span>
          </button>
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Overall Verdict</span>
            <p className="text-xl font-black text-emerald-400">{report.overallVerdict}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Health Score</span>
            <p className="text-xl font-black text-sky-400">{report.healthScore}%</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Passed Checks</span>
            <p className="text-xl font-black text-white">{report.passCount} / {report.vectorsEvaluated.length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300">
            <Lock className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Block / Warning</span>
            <p className="text-xl font-black text-white">{report.blockCount} / {report.warningCount}</p>
          </div>
        </div>
      </div>

      {/* Vectors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            Vektor Audit Guardian Terverifikasi
          </h2>
          <span className="text-xs font-mono text-slate-500">Laporan ID: {report.reportId}</span>
        </div>

        <div className="space-y-3">
          {report.vectorsEvaluated.map(vec => (
            <div
              key={vec.vectorId}
              onClick={() => setSelectedVector(vec)}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-rose-400 border border-slate-800 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400">{vec.vectorId}</span>
                      <h3 className="text-xs font-bold text-white">{vec.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {vec.verdict}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{vec.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs font-mono text-slate-500 hidden md:inline">
                    {vec.invariantReference}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400">
                    {vec.score}/100
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
