import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Lock, 
  ArrowRight,
  Flame,
  Zap
} from 'lucide-react';
import { guardianControlPlane, CorrelatedThreatIncident } from '../../core/kernel/GuardianControlPlane';

export const GuardianThreatCorrelatorViewer: React.FC = () => {
  const [threats, setThreats] = useState<CorrelatedThreatIncident[]>(guardianControlPlane.getCorrelatedThreats());
  const [selectedIncident, setSelectedIncident] = useState<CorrelatedThreatIncident | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSimulateAttackCorrelation = () => {
    const inc = guardianControlPlane.correlateThreatEvent('Multiple Failed Passwords (Brute Force)', 'AUTH_SESSION_MAC');
    setThreats(guardianControlPlane.getCorrelatedThreats());
    setSelectedIncident(inc);
    setStatusMsg(`Threat Correlated: Anomaly patterns converged into Incident ${inc.incidentId}. Ring 0 Auto-Mitigation Applied.`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
                R598 &bull; GUARDIAN THREAT CORRELATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">SELinux &amp; NIST-Inspired Multi-Anomaly Correlation</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Threat Correlation Pipeline &amp; Attack Vector Synthesizer</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateAttackCorrelation}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
          >
            <Zap className="w-4 h-4" /> Simulate Multi-Vector Threat
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Correlation Mechanics Flow Diagram */}
      <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3 font-mono text-xs">
        <span className="text-rose-400 font-bold flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Mekanisme Korelasi Ancaman Otomatis (3 Tahap Anomali):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">1. Login Gagal</span>
            <p className="text-slate-500">Percobaan kredensial tidak valid terdeteksi 3x berturut.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">2. Session Aneh</span>
            <p className="text-slate-500">Mutasi token tanpa signature resmi dari auth provider.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-rose-400 font-bold block">3. Cache Berubah</span>
            <p className="text-slate-500">Storage key namespace mencoba ditembus lintas domain.</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 space-y-1">
            <span className="text-emerald-300 font-bold block">4. Escalation Trigger</span>
            <p className="text-rose-200">Threat Level langsung naik ke ELEVATED / CRITICAL.</p>
          </div>
        </div>
      </div>

      {/* Incidents Stream */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-400" />
          Correlated Threat Incidents (/var/log/tade_threat_correlator.log):
        </span>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {threats.length === 0 ? (
            <div className="p-6 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800">
              Zero correlated threats. Sistem berada dalam keadaan Nominal Defense.
            </div>
          ) : (
            threats.map((t) => (
              <div
                key={t.incidentId}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 text-[10px]">
                      {t.incidentId}
                    </span>
                    <strong className="text-white">{t.targetModule}</strong>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold">
                      {t.threatLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Korelasi: {t.correlatedFactors.join(' &rarr; ')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
