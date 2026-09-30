import React, { useState } from 'react';
import {
  guardianMilitaryLogistics,
  MilitaryLogisticsReserve,
  ReinforcementUnit
} from '../../core/government/GuardianMilitaryLogistics';
import { Shield, Database, HardDrive, RefreshCw, Zap, Award, Layers, Cpu } from 'lucide-react';

export const GuardianMilitaryLogisticsViewer: React.FC = () => {
  const [reserves, setReserves] = useState<MilitaryLogisticsReserve[]>(() =>
    guardianMilitaryLogistics.getReserves()
  );
  const [reinforcements, setReinforcements] = useState<ReinforcementUnit[]>(() =>
    guardianMilitaryLogistics.getReinforcementCorps()
  );

  const handleOptimizeBuffers = () => {
    guardianMilitaryLogistics.optimizeBuffers();
    setReserves([...guardianMilitaryLogistics.getReserves()]);
  };

  const handleDeployReinforcement = (corpsId: string, sector: string) => {
    guardianMilitaryLogistics.deployReinforcement(corpsId, sector);
    setReinforcements([...guardianMilitaryLogistics.getReinforcementCorps()]);
  };

  return (
    <div id="r619-guardian-military-logistics" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Guardian Military Logistics & Recovery Reinforcement Corps
                </h1>
                <span className="text-xs px-2 py-0.5 font-mono bg-red-500/10 text-red-600 dark:text-red-400 rounded border border-red-500/20">
                  R619 – R620
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manajemen cadangan logistik buffer, WAL emergency pool, dan rotasi pasukan veteran Recovery Swarm.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOptimizeBuffers}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Rebalance Logistik Buffer
            </button>
          </div>
        </div>

        {/* Reserves Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {reserves.map((res) => (
            <div
              key={res.reserveId}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">{res.reserveId}</span>
                <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {res.healthStatus}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                {res.name}
              </h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Terpakai:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{res.usedMb} MB / {res.allocatedMb} MB</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${(res.usedMb / res.allocatedMb) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Tersedia: <strong className="text-emerald-600 dark:text-emerald-400">{res.availableMb} MB</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Reinforcement Corps (R620) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recovery Reinforcement Corps (Pasukan Penguat Sektor)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {reinforcements.length} Batalyon Siaga Tempur
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reinforcements.map((unit) => (
            <div
              key={unit.corpsId}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  {unit.corpsId}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    unit.combatStatus === 'ENGAGED'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 animate-pulse'
                      : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  }`}
                >
                  {unit.combatStatus}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {unit.unitName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Asal Resimen: <strong className="text-slate-700 dark:text-slate-300">{unit.regimentOrigin}</strong>
                </p>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Sektor yang Diperkuat:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{unit.reinforcedSector}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Misi Selesai:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{unit.activeMissionCount} Selesai</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Tingkat Efisiensi:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{unit.efficiencyRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleDeployReinforcement(unit.corpsId, 'Sovereign Executive Decision Vault')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Deploy ke Sektor Prioritas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
