import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Lock, 
  Scale, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  ConstitutionalConflictDetector, 
  ConstitutionalConflictItem 
} from '../../core/digitalGov/constitutionalConflictDetector';

export const ConstitutionalConflictDetectorViewer: React.FC = () => {
  const detector = useMemo(() => ConstitutionalConflictDetector.getInstance(), []);
  const [scanResult, setScanResult] = useState(() => detector.runDiagnosticScan());
  const [isScanning, setIsScanning] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(detector.runDiagnosticScan());
      setIsScanning(false);
    }, 600);
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'NO_CONFLICTS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> NO CONFLICTS DETECTED
          </span>
        );
      case 'POTENTIAL_FRICTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold font-mono">
            <AlertTriangle className="w-3.5 h-3.5" /> POTENTIAL FRICTION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold font-mono">
            <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL CONFLICT
          </span>
        );
    }
  };

  return (
    <div id="r777-constitutional-conflict-detector" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold font-mono border border-rose-500/30">
              <AlertOctagon className="w-3.5 h-3.5" /> R777 • CONSTITUTIONAL CONFLICT DETECTOR
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sovereign Conflict & Friction Diagnostics
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Deteksi dini pertentangan kebijakan internal, tabrakan matriks RBAC, otoritas ganda, dan rantai persetujuan tidak valid (Zero Autonomous Mutation / No Auto-Fix).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-4 py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              Jalankan Diagnostik Ulang
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-rose-600" /> Status Keharmonisan Konstitusi
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Waktu Pindai Terakhir: {new Date(scanResult.scanTimestamp).toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            {getVerdictBadge(scanResult.verdict)}
          </div>
        </div>

        {/* Conflicts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
              Temuan Konflik ({scanResult.totalConflictsFound})
            </h3>
            <span className="text-[10px] text-stone-400 font-mono">Prinsip Zero Auto-Fix Aktif</span>
          </div>

          {scanResult.conflicts.length > 0 ? (
            scanResult.conflicts.map((conf) => (
              <div 
                key={conf.conflictId}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  conf.severity === 'CRITICAL' ? 'bg-rose-50/60 border-rose-200' : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      conf.severity === 'CRITICAL' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {conf.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{conf.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                    conf.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {conf.severity}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">{conf.description}</p>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase font-mono">Rekomendasi Mediasi Manusia:</p>
                  <p className="text-stone-800 leading-relaxed font-medium">{conf.remediationRecommendation}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500 font-mono pt-1">
                  <span>Entitas Terdampak: {conf.affectedEntities.join(', ')}</span>
                  <span>Status: DILAPORKAN KE FOUNDER</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Seluruh Kebijakan & Matriks RBAC Harmonis</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Tidak ditemukan kontradiksi wewenang, tumpang tindih otorisasi, atau kejanggalan pada rantai persetujuan dokumen resmi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
