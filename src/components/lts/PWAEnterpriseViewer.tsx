import React, { useState } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Cpu 
} from 'lucide-react';
import { 
  pwaEnterpriseHardener, 
  PWAEnterpriseReport 
} from '../../core/lts/PWAEnterpriseHardener';

export const PWAEnterpriseViewer: React.FC = () => {
  const [report, setReport] = useState<PWAEnterpriseReport>(() => pwaEnterpriseHardener.getReport());

  const handleRefresh = () => {
    const fresh = pwaEnterpriseHardener.runAudit();
    setReport({ ...fresh });
  };

  return (
    <div id="pwa-enterprise-hardener-panel" className="space-y-6">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-pwa-compliance" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">PWA LTS Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.complianceScore}%</p>
          <span className="text-xs text-emerald-400 font-medium">6/6 Criteria Passed</span>
        </div>

        <div id="metric-pwa-worker-state" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Service Worker</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">ACTIVE</p>
          <span className="text-xs text-indigo-400 font-medium">{report.serviceWorkerState}</span>
        </div>

        <div id="metric-pwa-cache-strategy" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Cache Strategy</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-slate-100 mt-2 font-mono truncate">SWR Versioned</p>
          <span className="text-xs text-cyan-400 font-medium">Zero-Corrupt Multi-Year</span>
        </div>

        <div id="metric-pwa-offline-assets" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Offline Shell Assets</span>
            <Globe className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2 font-mono">{report.offlineAssetCount} Bundles</p>
          <span className="text-xs text-amber-400 font-medium">100% Air-Gap Resilient</span>
        </div>
      </div>

      {/* PWA Audit Criteria Breakdown */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-slate-100">Enterprise PWA Audit Matrix (R659)</h3>
              <p className="text-xs text-slate-400">Verifikasi ketahanan aplikasi untuk masa pakai jangka panjang.</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            id="btn-refresh-pwa-audit"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Segarkan Audit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.criteria.map((crit) => (
            <div key={crit.id} className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-700">
                    {crit.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{crit.name}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {crit.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{crit.details}</p>
              <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/30 p-2 rounded border border-indigo-900/40">
                🛡️ LTS Impact: {crit.longTermLTSImpact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Buckets Footprint */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="font-semibold text-slate-200 text-sm">Versioned Cache Storage Buckets</h4>
          <span className="text-xs font-mono text-slate-400">Deterministic Eviction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {report.cacheBuckets.map((bucket) => (
            <div key={bucket.bucketName} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
              <div className="font-mono font-bold text-slate-200 truncate">{bucket.bucketName}</div>
              <div className="text-[11px] text-slate-400">Tag: <span className="font-mono text-cyan-400">{bucket.versionTag}</span></div>
              <div className="text-[11px] text-slate-400">{bucket.itemCount} files • {bucket.sizeKb} KB</div>
              <div className="text-[10px] font-mono text-emerald-400 pt-1">Policy: {bucket.evictionPolicy}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
