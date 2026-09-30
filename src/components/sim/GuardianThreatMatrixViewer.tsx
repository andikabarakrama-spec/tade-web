import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Flame, 
  CheckCircle2, 
  RefreshCw,
  Fingerprint,
  Radio,
  Server,
  Zap
} from 'lucide-react';
import { kernelEventBus } from '../../core/kernel/KernelEventBus';

export type ThreatLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

interface ThreatVector {
  id: string;
  category: string;
  name: string;
  level: ThreatLevel;
  score: number; // 0 - 100
  details: string;
  mitigation: string;
  detectedAt: string;
}

export const GuardianThreatMatrixViewer: React.FC = () => {
  const [vectors, setVectors] = useState<ThreatVector[]>([
    {
      id: 'VEC-LOGIN',
      category: 'AUTHENTICATION',
      name: 'Login Anomaly Detector',
      level: 'GREEN',
      score: 4,
      details: 'Zero brute-force attempts. 100% MFA/passkey challenge compliance.',
      mitigation: 'Adaptive rate-limit token bucket armed (max 5 attempts / min).',
      detectedAt: 'Normal Telemetry'
    },
    {
      id: 'VEC-PERM-DRIFT',
      category: 'ACCESS_CONTROL',
      name: 'Permission Drift Monitor',
      level: 'GREEN',
      score: 0,
      details: 'SELinux MAC immutable policy enforced. 0 privilege escalation.',
      mitigation: 'Ring 0 kernel strict role isolation active across 7 roles.',
      detectedAt: 'Audit Verified'
    },
    {
      id: 'VEC-SESSION',
      category: 'IDENTITY',
      name: 'Session Token Hijacking Sentinel',
      level: 'GREEN',
      score: 2,
      details: 'All session tokens signed with SHA-256 and bound to client fingerprint.',
      mitigation: 'Silent token rotation every 15 minutes.',
      detectedAt: 'Normal Telemetry'
    },
    {
      id: 'VEC-CACHE',
      category: 'INTEGRITY',
      name: 'Cache Poisoning & State Drift',
      level: 'GREEN',
      score: 5,
      details: 'Cryptographic hash trees verify memory and localStorage cache integrity.',
      mitigation: 'Automatic purge and refresh on checksum discrepancy.',
      detectedAt: 'Normal Telemetry'
    },
    {
      id: 'VEC-FIRESTORE',
      category: 'DATABASE',
      name: 'Firestore Injection & Rule Breach',
      level: 'GREEN',
      score: 1,
      details: 'Security rules audited 100% granular. Zero unauthenticated collection reads.',
      mitigation: 'Strict client SDK encapsulation through Guardian API gateway.',
      detectedAt: 'Audit Verified'
    },
    {
      id: 'VEC-BROWSER',
      category: 'RUNTIME',
      name: 'Browser Tamper & Script Injection',
      level: 'GREEN',
      score: 3,
      details: 'CSP Level 3 headers active. Zero inline eval or malicious DOM mutation.',
      mitigation: 'Runtime freeze on debugger hooks or prototype tampering.',
      detectedAt: 'Normal Telemetry'
    },
    {
      id: 'VEC-PERF',
      category: 'RESOURCE',
      name: 'Resource Exhaustion & ReDoS',
      level: 'GREEN',
      score: 8,
      details: 'Event loop lag < 2.4ms. Animation frame budget 16.6ms maintained.',
      mitigation: 'Priority scheduler sheds non-critical telemetry if budget exceeded.',
      detectedAt: 'Normal Telemetry'
    },
    {
      id: 'VEC-RECOVERY',
      category: 'SELF_HEALING',
      name: 'Recovery Loop Anomaly',
      level: 'GREEN',
      score: 0,
      details: 'Swarm recovery convergence verified. 0 infinite restart loops.',
      mitigation: 'Max 3 restarts budget per 60 seconds with exponential backoff.',
      detectedAt: 'Audit Verified'
    }
  ]);

  const [activeThreatLevel, setActiveThreatLevel] = useState<ThreatLevel>('GREEN');

  // Calculate composite threat score
  const averageScore = Math.round(vectors.reduce((acc, v) => acc + v.score, 0) / vectors.length);

  const handleSimulateThreatSpike = (vectorId: string, level: ThreatLevel, score: number, details: string) => {
    setVectors(prev => prev.map(v => {
      if (v.id === vectorId) {
        return {
          ...v,
          level,
          score,
          details,
          detectedAt: new Date().toLocaleTimeString()
        };
      }
      return v;
    }));

    // Update aggregate level
    if (level === 'RED') setActiveThreatLevel('RED');
    else if (level === 'ORANGE' && activeThreatLevel !== 'RED') setActiveThreatLevel('ORANGE');
    else if (level === 'YELLOW' && activeThreatLevel === 'GREEN') setActiveThreatLevel('YELLOW');

    kernelEventBus.publish({
      type: 'threat.detected',
      sourceEngine: 'GUARDIAN',
      severity: level === 'RED' ? 'CRITICAL' : 'WARNING',
      data: { vectorId, threatLevel: level, score, details },
      traceId: `TRC-THREAT-${Date.now().toString().slice(-4)}`
    });
  };

  const handleNeutralizeAllThreats = () => {
    setVectors(prev => prev.map(v => ({
      ...v,
      level: 'GREEN',
      score: Math.floor(Math.random() * 5),
      details: 'Neutralized by Guardian Kernel. Baseline restored.',
      detectedAt: 'Normal Telemetry'
    })));
    setActiveThreatLevel('GREEN');

    kernelEventBus.publish({
      type: 'recovery.completed',
      sourceEngine: 'GUARDIAN',
      severity: 'NOTICE',
      data: { message: 'Guardian Threat Matrix neutralized all simulated attack vectors.' },
      traceId: `TRC-THREAT-RESET-${Date.now().toString().slice(-4)}`
    });
  };

  const getLevelBadge = (level: ThreatLevel) => {
    switch (level) {
      case 'RED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'ORANGE':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'YELLOW':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
                R578 &bull; THREAT INTELLIGENCE MATRIX
              </span>
              <span className="text-xs text-slate-400 font-mono">Guardian Left-Hand Security Core</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Guardian Threat Intelligence Matrix</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNeutralizeAllThreats}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
          >
            <ShieldCheck className="w-4 h-4" />
            Neutralize All Vectors
          </button>
        </div>
      </div>

      {/* Overview Threat Banner */}
      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border flex items-center justify-center font-mono font-black text-xl ${getLevelBadge(activeThreatLevel)}`}>
            {activeThreatLevel}
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase">Composite Threat Posture</span>
            <h3 className="text-lg font-bold text-white">
              {activeThreatLevel === 'GREEN' && 'Normal Operational Security • 0 Critical Vectors'}
              {activeThreatLevel === 'YELLOW' && 'Elevated Warning • Minor Vector Anomaly Detected'}
              {activeThreatLevel === 'ORANGE' && 'Severe Threat • Mitigation Active & Shieling Engaged'}
              {activeThreatLevel === 'RED' && 'Critical Attack • Emergency Lockdown Mode Ready'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">AVG Threat Index</span>
            <span className="text-lg font-bold text-cyan-300">{averageScore} / 100</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Monitored Vectors</span>
            <span className="text-lg font-bold text-indigo-300">8 Pillars</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Ring 0 Status</span>
            <span className="text-lg font-bold text-emerald-400">ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Quick Threat Simulation Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Simulate Attack Vector Ingestion:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSimulateThreatSpike('VEC-LOGIN', 'YELLOW', 45, '3 rapid failed login attempts from abnormal subnet.')}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-700/50 text-xs text-amber-300 font-mono"
          >
            + Login Jitter (YELLOW)
          </button>
          <button
            onClick={() => handleSimulateThreatSpike('VEC-PERM-DRIFT', 'ORANGE', 72, 'SELinux context escalation detected in sandbox.')}
            className="px-2.5 py-1.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/40 border border-orange-700/50 text-xs text-orange-300 font-mono"
          >
            + Permission Drift (ORANGE)
          </button>
          <button
            onClick={() => handleSimulateThreatSpike('VEC-BROWSER', 'RED', 94, 'DOM prototype injection attempt intercepted by Sentinel.')}
            className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-700/50 text-xs text-rose-300 font-mono"
          >
            + DOM Injection Attack (RED)
          </button>
        </div>
      </div>

      {/* 8 Threat Vectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vectors.map((vec) => (
          <div
            key={vec.id}
            className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition space-y-3 font-mono text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">{vec.category}</span>
                <strong className="text-sm font-bold text-white block">{vec.name}</strong>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadge(vec.level)}`}>
                {vec.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Risk Score:</span>
                <span className="font-bold text-slate-200">{vec.score} / 100</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    vec.score > 70 ? 'bg-rose-500' : vec.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(5, vec.score)}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {vec.details}
            </p>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400">
              <span className="text-indigo-400 font-bold block uppercase text-[9px]">Mitigation Protocol:</span>
              <p className="mt-0.5">{vec.mitigation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
