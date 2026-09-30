import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Radio, 
  Lock, 
  Cpu, 
  Globe, 
  Zap, 
  RefreshCw, 
  HardDrive, 
  Layers, 
  Database,
  ArrowUpRight,
  Sparkles,
  Eye
} from 'lucide-react';

interface ThreatIncident {
  id: string;
  sourceIp: string;
  vector: 'DDOS_SYN_FLOOD' | 'SQLI_INJECTION' | 'BRUTE_FORCE' | 'TOKEN_TAMPER';
  target: string;
  mitigation: string;
  status: 'BLOCKED' | 'MITIGATED' | 'ISOLATED';
  timestamp: string;
}

const LIVE_THREATS: ThreatIncident[] = [
  {
    id: 'THR-8891',
    sourceIp: '185.220.101.42 (Tor Exit Node)',
    vector: 'DDOS_SYN_FLOOD',
    target: '/api/v1/auth/verify',
    mitigation: 'Guardian Royal Guard Auto-Nullroute (Edge Dropped)',
    status: 'BLOCKED',
    timestamp: 'Baru saja (12 detik lalu)'
  },
  {
    id: 'THR-8890',
    sourceIp: '103.145.22.18 (Subnet Scan)',
    vector: 'SQLI_INJECTION',
    target: '/api/v1/students/query',
    mitigation: 'Firestore Rules AST Filter (Zero Execution)',
    status: 'MITIGATED',
    timestamp: '1 menit lalu'
  },
  {
    id: 'THR-8889',
    sourceIp: '45.154.255.99 (Botnet Probe)',
    vector: 'TOKEN_TAMPER',
    target: '/api/v1/payments/webhook',
    mitigation: 'HMAC-SHA256 Signature Mismatch Discarded',
    status: 'ISOLATED',
    timestamp: '3 menit lalu'
  }
];

export const PresidentialUltraWorkspace: React.FC<{ onSelectModule?: (mod: string) => void }> = ({ onSelectModule }) => {
  const [threats, setThreats] = useState<ThreatIncident[]>(LIVE_THREATS);
  const [activeTab, setActiveTab] = useState<'WAR_ROOM' | 'SHADOW_AGENT' | 'RECOVERY' | 'TELEMETRY'>('WAR_ROOM');
  const [radarRotation, setRadarRotation] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarRotation(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Presidential Header */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 text-white p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  R103 • Presidential Ultra Mode
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  120 FPS Capable • Super Admin Authority
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">Presidential Cyber Command & War-Room</h1>
              <p className="text-sm text-slate-300">
                Pusat pengawasan keamanan tertinggi: Peta ancaman siber real-time, mitigasi DDoS otonom, dan pengawas arsitektur permanen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-purple-800 text-right">
              <div className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Sentinel Defense Level</div>
              <div className="text-base font-black text-emerald-400 flex items-center gap-1.5 justify-end">
                <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
                <span>DEFCON 1 • ALL GREEN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Security Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-900/50">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300">Threat Ingestion Rate</div>
            <div className="text-lg font-bold text-white mt-1">0.02 Events/sec</div>
            <div className="text-[11px] text-emerald-400">100% Mitigated</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300">Firestore Integrity Hash</div>
            <div className="text-lg font-bold text-purple-300 mt-1 font-mono text-xs truncate">
              SHA256: 8f9b...a10c
            </div>
            <div className="text-[11px] text-emerald-400">Locked & Verified</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300">Shadow Agent Telemetry</div>
            <div className="text-lg font-bold text-white mt-1">Active 24/7 (30s Tick)</div>
            <div className="text-[11px] text-emerald-400">Zero Anomaly Detected</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300">Discovery Registry</div>
            <div className="text-lg font-bold text-white mt-1">20 Locked Entries</div>
            <div className="text-[11px] text-purple-400">DISC-001 s/d DISC-020</div>
          </div>
        </div>
      </div>

      {/* Cyber War-Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar & Live Threat Map (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-purple-900/40 text-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2 text-purple-300">
              <Globe className="w-5 h-5 text-purple-400" />
              <span>Real-Time Cyber Radar & Threat Interception</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              LIVE STREAMING
            </span>
          </div>

          {/* SVG Radar Display */}
          <div className="relative h-64 w-full bg-slate-900/90 rounded-xl border border-purple-900/50 flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 flex items-center justify-center opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Radar Sweep Line */}
            <div
              className="absolute w-60 h-60 rounded-full border border-purple-500/40 flex items-center justify-center"
              style={{
                background: `conic-gradient(from ${radarRotation}deg at 50% 50%, rgba(168, 85, 247, 0.4) 0deg, transparent 60deg, transparent 360deg)`
              }}
            >
              <div className="w-40 h-40 rounded-full border border-purple-500/30 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-purple-500/20" />
              </div>
            </div>

            {/* Simulated Interception Blips */}
            <div className="absolute top-12 left-24 flex items-center gap-1.5 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/50 text-[10px] text-rose-300 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>SYN-Flood Blocked</span>
            </div>

            <div className="absolute bottom-16 right-32 flex items-center gap-1.5 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-500/50 text-[10px] text-indigo-300">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Edge Sanitized</span>
            </div>

            <div className="absolute center z-10 p-2 bg-purple-600 rounded-full text-white shadow-lg shadow-purple-600/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          {/* Live Incident Feed */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Insiden Terakhir Yang Dicegat Otonom:
            </div>
            {threats.map((t) => (
              <div key={t.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-rose-400">[{t.vector}]</span>
                    <span>{t.sourceIp}</span>
                  </div>
                  <div className="text-slate-400 mt-0.5 text-[11px]">{t.mitigation}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                    {t.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch & Sovereign Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>Sovereign Security Navigation Dock</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onSelectModule && onSelectModule('r90')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    R90 • Discovery Registry & Permanent Memory
                  </div>
                  <div className="text-[11px] text-slate-500">20 Locked Architectural Entries</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
              </button>

              <button
                onClick={() => onSelectModule && onSelectModule('r110')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    R110 • Guardian Continuous Bundle Auditor
                  </div>
                  <div className="text-[11px] text-slate-500">Pencegah regresi ukuran bundle otomatis</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
              </button>

              <button
                onClick={() => onSelectModule && onSelectModule('r82')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    R82 • Threat Matrix Sentinel & DDoS Lab
                  </div>
                  <div className="text-[11px] text-slate-500">Simulasi uji ketahanan 10.000 req/sec</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
              </button>

              <button
                onClick={() => onSelectModule && onSelectModule('r87')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    R87 • Offline-First Engine & Sync Sentinel
                  </div>
                  <div className="text-[11px] text-slate-500">IndexedDB local queue & conflict resolver</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
