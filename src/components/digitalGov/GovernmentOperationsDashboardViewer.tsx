import React, { useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Scale, 
  RotateCcw, 
  Layers, 
  Stamp, 
  BookLock,
  Flame,
  FileCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  GovernmentOperationsDashboard, 
  GovernmentDashboardSnapshot 
} from '../../core/digitalGov/governmentOperationsDashboard';

export const GovernmentOperationsDashboardViewer: React.FC = () => {
  const dashboard = useMemo(() => GovernmentOperationsDashboard.getInstance(), []);
  const snapshot: GovernmentDashboardSnapshot = useMemo(() => dashboard.getSnapshot(), [dashboard]);

  return (
    <div id="r776-government-operations-dashboard" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold font-mono border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" /> R776 • GOVERNMENT OPERATIONS DASHBOARD
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Institutional Sovereign Health Observatory
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Ringkasan komprehensif metrik kedaulatan, kepatuhan kebijakan konstitusi, kesiapan pemulihan bencana, status Guardian Ring-0, dan integritas Discovery Registry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Governance Health</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">{snapshot.governanceHealthScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-stone-500 font-mono">Policy Compliance</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg"><Scale className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{snapshot.policyComplianceRate}%</p>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${snapshot.policyComplianceRate}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">{snapshot.activePoliciesCount} Invarian Aktif di Ring-0</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-stone-500 font-mono">Recovery Readiness</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg"><RotateCcw className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{snapshot.recoveryReadinessRate}%</p>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${snapshot.recoveryReadinessRate}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">RTO: ~1.1s | RPO: 0 Bytes</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-stone-500 font-mono">Guardian Ring-0</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg"><ShieldCheck className="w-4 h-4" /></span>
          </div>
          <p className="text-xs font-black text-amber-600 font-mono mt-2">ACTIVE_SHIELD</p>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-stone-500">Zero Autonomous Mutation Protected</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-stone-500 font-mono">Discovery Integrity</span>
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded-lg"><FileCheck className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{snapshot.discoveryIntegrityScore}%</p>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${snapshot.discoveryIntegrityScore}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">Zero Registry Anomaly Detected</p>
        </div>
      </div>

      {/* KPI Breakdown Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" /> Indikator Kinerja Tata Kelola (Institutional KPIs)
          </h2>
          <span className="text-xs font-mono text-stone-400">Live Snapshot</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snapshot.kpis.map((kpi, idx) => (
            <div 
              key={idx}
              className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-2 hover:border-emerald-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{kpi.metricName}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> {kpi.status}
                </span>
              </div>
              <p className="text-lg font-black text-slate-800 font-mono">{kpi.value}</p>
              <p className="text-[11px] text-stone-500 leading-relaxed">{kpi.description}</p>
            </div>
          ))}
        </div>

        {/* Aggregate Totals Footer */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Kebijakan</p>
            <p className="text-lg font-bold text-emerald-400 font-mono">{snapshot.activePoliciesCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Keputusan Founder</p>
            <p className="text-lg font-bold text-amber-400 font-mono">{snapshot.totalDecisionsCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Dokumen Resmi</p>
            <p className="text-lg font-bold text-blue-400 font-mono">{snapshot.totalOfficialDocsCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Entri Jurnal</p>
            <p className="text-lg font-bold text-purple-400 font-mono">{snapshot.totalJournalEntriesCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
