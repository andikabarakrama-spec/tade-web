import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle2, Shield, ArrowRight, Activity, Users } from 'lucide-react';
import { recoveryReinforcementMatrix, FrontlineGarrison, RecoveryDaemonUnit } from '../../core/operational/RecoveryReinforcementMatrix';

export const RecoveryReinforcementMatrixViewer: React.FC = () => {
  const [garrisons, setGarrisons] = useState<FrontlineGarrison[]>(recoveryReinforcementMatrix.getGarrisons());
  const [units, setUnits] = useState<RecoveryDaemonUnit[]>(recoveryReinforcementMatrix.getUnits());
  const [selectedUnit, setSelectedUnit] = useState<RecoveryDaemonUnit | null>(null);

  useEffect(() => {
    const unsub = recoveryReinforcementMatrix.subscribe(() => {
      setGarrisons(recoveryReinforcementMatrix.getGarrisons());
      setUnits(recoveryReinforcementMatrix.getUnits());
    });
    return () => unsub();
  }, []);

  const handleRedeploy = (unitId: string, sectorId: string) => {
    recoveryReinforcementMatrix.completeRecoveryAndRedeploy(unitId, sectorId);
  };

  return (
    <div id="recovery-reinforcement-matrix-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              R638 &bull; RECOVERY REINFORCEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              AUTONOMOUS FRONT-LINE REDEPLOYMENT
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recovery Reinforcement Matrix &amp; Garrison Defense
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational Doctrine: Forces and daemons that finish recovery missions instantly return to reinforce the frontline.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold">
          <Shield className="w-4 h-4" /> 100% Garrisons Fortified
        </div>
      </div>

      {/* Frontline Garrisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {garrisons.map((gar) => (
          <div
            key={gar.sectorId}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 font-mono"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {gar.sectorId}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {gar.readinessPercentage}% READY
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {gar.sectorName}
            </h4>

            {/* Troop Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>Garrison Strength:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{gar.assignedTroops}/{gar.defenseCapacity} units</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${(gar.assignedTroops / gar.defenseCapacity) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Threat: <strong className="text-emerald-500">{gar.threatLevel}</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{gar.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Swarm Units Active Rotation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-500 block">ACTIVE RECOVERY DAEMONS</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Swarm Force Deployment &amp; Mission History
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Auto-Redeploy: Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs"
            >
              <div className="flex items-center justify-between">
                <strong className="text-slate-900 dark:text-white">{unit.unitCode}</strong>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {unit.state}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Specialty: <span className="text-slate-700 dark:text-slate-300 font-bold">{unit.specialty}</span>
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Completed Missions: <strong>{unit.completedMissionsCount}</strong></span>
                <span>Garrison: <strong>{unit.assignedGarrisonSector}</strong></span>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleRedeploy(unit.id, 'SEC-RING0-KERNEL')}
                  className="flex-1 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-600 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-[10px] font-bold transition-all"
                >
                  Reinforce Ring-0
                </button>
                <button
                  onClick={() => handleRedeploy(unit.id, 'SEC-RBAC-FORTRESS')}
                  className="flex-1 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-600 hover:bg-cyan-600 hover:text-white text-slate-700 dark:text-slate-200 text-[10px] font-bold transition-all"
                >
                  Reinforce RBAC
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
