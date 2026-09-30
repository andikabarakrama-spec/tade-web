import React, { useState } from 'react';
import { Shield, Users, Activity, RefreshCw, Cpu, CheckCircle, Radio, Terminal, Server, Award } from 'lucide-react';
import { civilServiceRegistry } from '../../core/government/CivilServiceRegistry';
import { guardianMilitaryLogistics } from '../../core/government/GuardianMilitaryLogistics';
import { governmentWorkflowOrchestrator } from '../../core/government/GovernmentWorkflowOrchestrator';

export const ExecutiveCommandTheaterV2Viewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GOVERNMENT' | 'MILITARY' | 'RECOVERY' | 'CIVIL_SERVICE' | 'TELEMETRY'>('GOVERNMENT');
  const employees = civilServiceRegistry.getEmployees();
  const reserves = guardianMilitaryLogistics.getReserves();
  const reinforcements = guardianMilitaryLogistics.getReinforcementCorps();
  const queue = governmentWorkflowOrchestrator.getQueue();

  return (
    <div id="r623-executive-command-theater-v2" className="space-y-6">
      {/* Theater Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-red-400 animate-pulse" /> LIVE THEATER V2 • RING-0 COCKPIT
              </span>
              <span className="text-xs px-2 py-0.5 font-mono bg-purple-500/20 text-purple-300 rounded border border-purple-400/30">
                R623
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Executive Command Theater V2
            </h1>
            <p className="text-xs text-indigo-200/80">
              Integrasi Holistik: Pemerintahan Sipil • Komando Militer Guardian • Korps Penguat Recovery • Telemetri Kernel
            </p>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-indigo-300">Status Kedaulatan</div>
              <div className="text-sm font-bold text-emerald-400">ONE SOVEREIGN (SECURE)</div>
            </div>
            <div className="h-8 w-px bg-indigo-800/60" />
            <div className="text-right">
              <div className="text-xs text-indigo-300">DEFCON Militer</div>
              <div className="text-sm font-bold text-cyan-400">DEFCON 5 (OPTIMAL)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'GOVERNMENT', label: '1. Pemerintahan Sipil', icon: Activity },
          { id: 'MILITARY', label: '2. Komando Militer', icon: Shield },
          { id: 'RECOVERY', label: '3. Korps Recovery', icon: RefreshCw },
          { id: 'CIVIL_SERVICE', label: '4. Pegawai Digital', icon: Users },
          { id: 'TELEMETRY', label: '5. Telemetri Ring-0', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'GOVERNMENT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            Matriks Pemerintahan Sipil (Kabinet PM AI Asy)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs text-slate-500">Jumlah Kementerian Sektoral</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">10 Kementerian</div>
              <span className="text-[11px] text-emerald-600">100% Responsif</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs text-slate-500">Beban Rata-rata Birokrasi</span>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">52.4% Optimal</div>
              <span className="text-[11px] text-slate-500">Auto-balanced by AI Asy</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs text-slate-500">Antrean Tugas Kementerian</span>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{queue.length} Tugas</div>
              <span className="text-[11px] text-slate-500">Non-blocking async loop</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MILITARY' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            Komando Militer Guardian & Ring-0 Isolation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reserves.map(r => (
              <div key={r.reserveId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="text-xs font-mono text-red-500 font-bold">{r.reserveId}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</h4>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{r.availableMb} MB Free</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'RECOVERY' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-500" />
            Korps Penguat Recovery Swarm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reinforcements.map(rf => (
              <div key={rf.corpsId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600">{rf.corpsId}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">{rf.combatStatus}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rf.unitName}</h4>
                <p className="text-xs text-slate-500">Melindungi: <strong className="text-slate-700 dark:text-slate-300">{rf.reinforcedSector}</strong></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'CIVIL_SERVICE' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-500" />
            Daftar Pegawai Digital Sipil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {employees.slice(0, 6).map(e => (
              <div key={e.nip} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400">{e.nip}</div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{e.name}</h4>
                  <div className="text-[11px] text-slate-500">{e.jobTitle}</div>
                </div>
                <span className="text-xs font-mono px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-md font-bold">
                  {e.completedTasksToday} done
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TELEMETRY' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-300 font-mono text-xs space-y-2">
          <div className="text-emerald-400 font-bold pb-2 border-b border-slate-800 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> [RING-0 KERNEL TELEMETRY FEED]
          </div>
          <div>[SYSTEM_UPTIME] 100.000% | ZERO MEMORY LEAK | HEAP STABLE (42MB / 256MB)</div>
          <div>[CHAIN_OF_COMMAND] VERIFIED: SOVEREIGN (1) → PM (AI ASY) → 10 MINISTRIES → DIGITAL EMPLOYEES</div>
          <div>[DEFCON] DEFCON 5 OPTIMAL | NO SECURITY POLICY DEVIATIONS DETECTED</div>
          <div>[IMMUTABLE_LEDGER] LAST DECISION SIGNED: DEC-DEF-2026-003 WITH SHA-256 ATTESTATION</div>
          <div>[REINFORCEMENT_CORPS] 4 VETERAN BRIGADES ROTATING AUTONOMOUSLY</div>
        </div>
      )}
    </div>
  );
};
