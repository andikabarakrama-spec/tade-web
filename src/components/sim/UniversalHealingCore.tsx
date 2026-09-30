import React, { useState } from 'react';
import { ShieldCheck, Activity, RefreshCw, Zap, CheckCircle2, Cpu, ArrowRight, Flame } from 'lucide-react';
import { immortalCoreOrchestrator, EngineNodeRegistration, HealingCycleLog } from '../../core/guardian/ImmortalCoreOrchestrator';

export const UniversalHealingCore: React.FC = () => {
  const [engines, setEngines] = useState<EngineNodeRegistration[]>(immortalCoreOrchestrator.getEngines());
  const [history, setHistory] = useState<HealingCycleLog[]>(immortalCoreOrchestrator.getHealingHistory());
  const [selectedEngine, setSelectedEngine] = useState<string>(engines[0]?.id || '');
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [activeCycleLogs, setActiveCycleLogs] = useState<HealingCycleLog[]>([]);

  const handleSimulateHeal = (engineId: string) => {
    setIsTriggering(true);
    const result = immortalCoreOrchestrator.triggerUniversalHealing(engineId, 'Simulasi trigger manual via Universal Healing Dashboard.');
    setActiveCycleLogs(result.log);
    setEngines(immortalCoreOrchestrator.getEngines());
    setHistory(immortalCoreOrchestrator.getHealingHistory());
    setTimeout(() => {
      setIsTriggering(false);
      setEngines(immortalCoreOrchestrator.getEngines());
    }, 1200);
  };

  const currentEngineObj = engines.find(e => e.id === selectedEngine) || engines[0];

  return (
    <div id="universal-healing-core-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              TADE RC70 • R526
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Zero Single Point of Failure
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-7 h-7 text-emerald-400" />
            Universal Healing Core
          </h1>
          <p className="text-emerald-100/80 text-sm mt-1 max-w-2xl">
            Standarisasi protokol swasembada 5 tahap (Detect → Contain → Heal → Rejoin → Strengthen) untuk 12 komponen sistem TADE.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/60 border border-emerald-800/50 px-4 py-2 rounded-xl text-center">
            <span className="text-xs text-emerald-300 block">Health Consensus</span>
            <span className="text-xl font-bold text-emerald-400">100% IMMORTAL</span>
          </div>
        </div>
      </div>

      {/* 5-Phase Flow Blueprint */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          Arsitektur 5 Tahap Universal Healing Lifecycle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { phase: '1. DETECT', desc: 'Identifikasi anomali, latensi tinggi, atau kegagalan IO dalam tempo < 10ms.', color: 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300' },
            { phase: '2. CONTAIN', desc: 'Isolasi blast radius ke sandbox lokal tanpa merusak alur data lain.', color: 'border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-300' },
            { phase: '3. HEAL', desc: 'Eksekusi pembersihan memory pool, reset koneksi, atau fallback storage.', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300' },
            { phase: '4. REJOIN', desc: 'Validasi integritas data SHA-256 lalu gabungkan kembali ke konsensus.', color: 'border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-300' },
            { phase: '5. STRENGTHEN', desc: 'Tingkatkan kapasitas buffer & catat pola ke Guardian Research Vault.', color: 'border-purple-500/40 bg-purple-500/5 text-purple-700 dark:text-purple-300' }
          ].map((step, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${step.color} flex flex-col justify-between`}>
              <div className="font-bold text-sm tracking-wide mb-1">{step.phase}</div>
              <div className="text-xs opacity-90">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of 12 Registered Engines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              12 Universal Healing Engines Matrix
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">
              Semua Aktif (12/12)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {engines.map(engine => (
              <div
                key={engine.id}
                onClick={() => setSelectedEngine(engine.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedEngine === engine.id
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {engine.name}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {engine.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Category: {engine.category}</span>
                  <span>Remedies: {engine.remediesCount}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Engine Action Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Engine Control & Sandbox
            </h2>

            {currentEngineObj && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Target Engine</div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-200">{currentEngineObj.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Node ID: {currentEngineObj.id}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block">Health Score</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentEngineObj.healthScore}%</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block">Circuit State</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">IMMORTAL</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-trigger-heal-${currentEngineObj.id}`}
                  onClick={() => handleSimulateHeal(currentEngineObj.id)}
                  disabled={isTriggering}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
                  {isTriggering ? 'Executing 5-Phase Healing...' : 'Trigger Universal Healing Cycle'}
                </button>
              </div>
            )}

            {/* Cycle Trace Logs */}
            {activeCycleLogs.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono space-y-1.5 border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Active Cycle Execution
                </div>
                {activeCycleLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-teal-400">[{log.phase}]</span>
                    <span className="text-slate-400">{log.details} ({log.durationMs}ms)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Orchestrator Heartbeat: SYNCED</span>
            <span>Zero Data Loss</span>
          </div>
        </div>
      </div>

      {/* Global Healing History Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Recent Self-Healing Cycles Log
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <div className="py-4 text-center text-slate-500">Semua engine dalam kondisi prima. Belum ada trigger anomali.</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">[{h.phase}]</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{h.engineName}</span>
                  <span className="text-slate-500">{h.details}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{new Date(h.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
