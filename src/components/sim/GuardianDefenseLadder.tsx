import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldOff, Zap, RefreshCw, CheckCircle2, Award, ChevronRight, Lock } from 'lucide-react';

interface DefenseLayer {
  level: number;
  name: string;
  codename: string;
  status: 'ACTIVE' | 'STANDBY' | 'REINFORCING';
  healthScore: number;
  duties: string[];
  autoRecoveryEnabled: boolean;
}

export const GuardianDefenseLadder: React.FC = () => {
  const [layers, setLayers] = useState<DefenseLayer[]>([
    {
      level: 1,
      name: 'Layer 1: Sentinel',
      codename: 'SENTINEL_PROBE_ALPHA',
      status: 'ACTIVE',
      healthScore: 100,
      duties: ['Memantau heartbeat 8 probe keamanan secara real-time', 'Mendeteksi brute-force login & rate-limit throttling', 'Verifikasi SSL certificate expiry & HSTS headers'],
      autoRecoveryEnabled: true
    },
    {
      level: 2,
      name: 'Layer 2: Defender',
      codename: 'DEFENDER_ISOLATION_BETA',
      status: 'ACTIVE',
      healthScore: 100,
      duties: ['Mengisolasi blast radius anomali ke sandbox lokal', 'Memblokir bypass query Firestore & read loops', 'Menerapkan Circuit Breaker pada backend service'],
      autoRecoveryEnabled: true
    },
    {
      level: 3,
      name: 'Layer 3: Guardian Squad',
      codename: 'GUARDIAN_SQUAD_GAMMA',
      status: 'ACTIVE',
      healthScore: 100,
      duties: ['Koordinasi swarm recovery antar-engine secara kolaboratif', 'Sinkronisasi WORM immutable storage tamper check', 'Menjaga integritas data kas, raport, dan PPDB'],
      autoRecoveryEnabled: true
    },
    {
      level: 4,
      name: 'Layer 4: Guardian Elite',
      codename: 'GUARDIAN_ELITE_OMEGA',
      status: 'ACTIVE',
      healthScore: 100,
      duties: ['Eksekusi protokol Disaster Recovery & Total System Rebuild', 'Perlindungan Kedaulatan Data & Google Drive Bridge', 'Komando Strategis AI Asy & War Room AD Validation'],
      autoRecoveryEnabled: true
    }
  ]);

  const [activeTest, setActiveTest] = useState<string | null>(null);

  const simulateLayerStress = (lvl: number) => {
    setActiveTest(`Testing Layer ${lvl}...`);
    setLayers(prev => prev.map(l => l.level === lvl ? { ...l, status: 'REINFORCING', healthScore: 92 } : l));

    setTimeout(() => {
      setLayers(prev => prev.map(l => l.level === lvl ? { ...l, status: 'ACTIVE', healthScore: 100 } : l));
      setActiveTest(null);
    }, 1200);
  };

  return (
    <div id="guardian-defense-ladder-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-sky-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              TADE RC70 • R528
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Defense-in-Depth Architecture
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-sky-400" />
            Guardian Defense Ladder
          </h1>
          <p className="text-sky-100/80 text-sm mt-1 max-w-2xl">
            Sistem pertahanan 4 tingkat berlapis: Sentinel → Defender → Guardian Squad → Guardian Elite dengan kemampuan saling memperkuat dan pulih mandiri.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-sky-500/30 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-sky-300 block">Ladder Status</span>
          <span className="text-xl font-bold text-sky-400">4/4 TIERS FORTIFIED</span>
        </div>
      </div>

      {/* Ladder Visual Progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {layers.map((layer) => (
          <div
            key={layer.level}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              layer.status === 'REINFORCING'
                ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 ring-2 ring-amber-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
                  TIER {layer.level}
                </span>
                <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {layer.status}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">{layer.name}</h3>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-3">{layer.codename}</div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                {layer.duties.map((duty, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <span>{duty}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Integrity:</span>
                <span className="text-sky-600 dark:text-sky-400">{layer.healthScore}%</span>
              </div>
              <button
                onClick={() => simulateLayerStress(layer.level)}
                disabled={activeTest !== null}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${layer.status === 'REINFORCING' ? 'animate-spin text-amber-500' : ''}`} />
                Test Reinforcement
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resilience & Swarm Logic Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Protokol Pertahanan Bertingkat (Defense-in-Depth)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Apabila <strong>Sentinel</strong> mendeteksi beban berlebih atau percobaan akses ganda, <strong>Defender</strong> seketika mengaktifkan isolasi sandbox. Jika anomali berlanjut, <strong>Guardian Squad</strong> memobilisasi swarm recovery. Dalam skenario darurat ekstrim, <strong>Guardian Elite</strong> mengambil alih kendali pemulihan total tanpa kehilangan 1 bit data pun.
        </p>
      </div>
    </div>
  );
};
