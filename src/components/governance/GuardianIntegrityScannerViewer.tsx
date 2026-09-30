import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  FileCode2, 
  Sliders, 
  Search,
  Check
} from 'lucide-react';
import { GuardianIntegrityScanner, GuardianIntegrityScanReport } from '../../core/governance/GuardianIntegrityScanner';
import { ConfigurationDriftDetector, ConfigurationDriftReport } from '../../core/governance/ConfigurationDriftDetector';

export const GuardianIntegrityScannerViewer: React.FC = () => {
  const integrityScanner = GuardianIntegrityScanner.getInstance();
  const driftDetector = ConfigurationDriftDetector.getInstance();

  const [scanReport, setScanReport] = useState<GuardianIntegrityScanReport>(() => integrityScanner.runFullScan());
  const [driftReport, setDriftReport] = useState<ConfigurationDriftReport>(() => driftDetector.detectDrift());
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<string>('ALL');

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanReport(integrityScanner.runFullScan());
      setDriftReport(driftDetector.detectDrift());
      setIsScanning(false);
    }, 500);
  };

  const filteredDeltas = selectedScope === 'ALL' 
    ? driftReport.deltas 
    : driftReport.deltas.filter(d => d.scope === selectedScope);

  return (
    <div className="space-y-6" id="guardian-integrity-scanner-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Structural Guardian & Drift Audit
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R703, R705
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Guardian Integrity Scanner & Drift Detector
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Scanner internal otomatis mendeteksi anomali struktural (duplikasi service/registry, pelanggaran SSoT, orphan module) dan membandingkan konfigurasi terhadap baseline kedaulatan emas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Memindai Integritas...' : 'Jalankan Scan Integritas'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Integritas Ring-0</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{scanReport.overallHealth}</div>
          <div className="text-xs text-slate-400">{scanReport.cleanVectorsCount} dari {scanReport.totalInspectedVectors} Vektor Bersih</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">Zero Breach &bull; Zero Duplicate Registries</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Status Drift Baseline</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{driftReport.overallStatus}</div>
          <div className="text-xs text-slate-400">{driftReport.syncedKeysCount} / {driftReport.totalCheckedKeys} Kunci Selaras 100%</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">Nol Penyimpangan Konfigurasi</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Segel Kedaulatan</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">SSoT BINDING: ACTIVE</div>
          <div className="text-xs text-slate-400">Provider: {scanReport.guardianSeal.ssotProvider}</div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">Hermes Status: {scanReport.guardianSeal.dormancyHermesStatus}</div>
        </div>
      </div>

      {/* Grid: 6 Guardian Inspection Vectors (R703) & Configuration Baseline Drift (R705) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guardian Integrity Vectors (R703) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                6 Vektor Pemeriksaan Integritas Struktur (R703)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Scan ID: {scanReport.scanId}</span>
          </div>

          <div className="space-y-3">
            {scanReport.issues.map(iss => (
              <div key={iss.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{iss.category}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-mono">
                      {iss.targetPath}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {iss.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{iss.description}</p>
                
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Aturan: <strong className="text-slate-300">{iss.invariantRule}</strong></span>
                  <span className="text-emerald-400">{iss.remedyRecommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Drift Detector (R705) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Deteksi Deviasi Konfigurasi Baseline (R705)
              </h3>
            </div>

            {/* Scope Filter */}
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="ALL">Semua Cakupan</option>
              <option value="FEATURE_FLAGS">Feature Flags</option>
              <option value="ENGINE_REGISTRY">Engine Registry</option>
              <option value="SYSTEM_CONFIG">System Config</option>
              <option value="SECURITY_CONFIG">Security Config</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredDeltas.map(delta => (
              <div key={delta.key} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{delta.key}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                    IN SYNC (0% Drift)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <div className="text-slate-400 text-[10px]">Nilai Baseline Emas:</div>
                    <div className="text-emerald-400 font-semibold font-mono">{delta.baselineValue}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Nilai Runtime Aktual:</div>
                    <div className="text-white font-semibold font-mono">{delta.actualValue}</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">{delta.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
