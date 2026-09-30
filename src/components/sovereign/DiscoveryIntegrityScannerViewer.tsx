import React, { useState } from 'react';
import { 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  PieChart, 
  Award,
  Search
} from 'lucide-react';
import { DiscoveryIntegrityScanner, DiscoveryScanReport } from '../../core/sovereign/discoveryIntegrityScanner';

export const DiscoveryIntegrityScannerViewer: React.FC = () => {
  const scanner = DiscoveryIntegrityScanner.getInstance();
  const [report, setReport] = useState<DiscoveryScanReport>(() => scanner.runScan());
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setReport(scanner.runScan());
      setIsScanning(false);
    }, 500);
  };

  return (
    <div className="space-y-6" id="discovery-integrity-scanner-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                Discovery Registry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R768 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Discovery Integrity Scanner
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pemindai validasi kelengkapan pendaftaran penemuan (*Discovery Registry*), pencegah entri ganda, deteksi modul orphan, dan audit cakupan sprint (RC87, RC93, RC94).
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Pindai Ulang Registry</span>
          </button>
        </div>
      </div>

      {/* Summary Score Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Discoveries</span>
            <p className="text-xl font-black text-white">{report.totalEntries} Entri</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Integrity Score</span>
            <p className="text-xl font-black text-emerald-400">{report.integrityScore}%</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Duplicate IDs</span>
            <p className="text-xl font-black text-sky-400">{report.duplicateIdsFound.length} Ditemukan</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Scan Verdict</span>
            <p className="text-sm font-black text-emerald-400">{report.verdict}</p>
          </div>
        </div>
      </div>

      {/* Category and Sprint Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <PieChart className="w-4 h-4 text-purple-400" />
            Distribusi Kategori Penemuan (Architecture, Security, Operations, dll)
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(report.categoryDistribution).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-xs">
                <span className="font-semibold text-slate-300">{cat}</span>
                <span className="font-mono font-bold text-purple-300">{count} entri</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-emerald-400" />
            Cakupan per Sprint Asal (RC84 s/d RC94)
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(report.sprintCoverage).map(([sprint, count]) => (
              <div key={sprint} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-xs">
                <span className="font-semibold text-slate-300">{sprint}</span>
                <span className="font-mono font-bold text-emerald-300">{count} penemuan</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
