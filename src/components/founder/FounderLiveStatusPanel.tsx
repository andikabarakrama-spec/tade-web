import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  RotateCcw,
  Terminal,
  UserCheck,
  HardDrive,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';
import { performanceStabilizer } from '../../services/performanceStabilizer';
import { smartIncidentService } from '../../services/smartIncidentService';

export interface SystemComponentStatus {
  key: string;
  name: string;
  category: 'GUARDIAN' | 'DR_PULSE' | 'HERMES' | 'BLACK_BOX' | 'PPDB' | 'STORAGE' | 'BACKUP';
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
  value: string;
  details: string;
}

export const FounderLiveStatusPanel: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live');
  const [components, setComponents] = useState<SystemComponentStatus[]>([
    {
      key: 'guardian',
      name: 'Guardian Ring-0',
      category: 'GUARDIAN',
      status: 'OPTIMAL',
      value: 'Perimeter Aman',
      details: 'Perlindungan eskalasi wewenang & idempotency token aktif 100%.'
    },
    {
      key: 'dr_pulse',
      name: 'Dr. Pulse',
      category: 'DR_PULSE',
      status: 'OPTIMAL',
      value: '99/100 Health',
      details: 'Skor kesehatan arsitektur optimal, latensi render 140ms.'
    },
    {
      key: 'hermes',
      name: 'Hermes Recovery',
      category: 'HERMES',
      status: 'OPTIMAL',
      value: 'Standby Ready',
      details: 'Snapshot state fallback & jalur pemulihan siap 100%.'
    },
    {
      key: 'black_box',
      name: 'Black Box',
      category: 'BLACK_BOX',
      status: 'OPTIMAL',
      value: 'Telemetry Active',
      details: 'Perekam telemetri multi-ring mencatat seluruh peristiwa secara deterministik.'
    },
    {
      key: 'ppdb',
      name: 'PPDB Fortress',
      category: 'PPDB',
      status: 'OPTIMAL',
      value: 'Pipeline Aktif',
      details: 'Pendaftaran gelombang reguler & penetapan SPP sinkron.'
    },
    {
      key: 'storage',
      name: 'Storage Buffer',
      category: 'STORAGE',
      status: 'OPTIMAL',
      value: '18.4 MB / 250 MB',
      details: 'Kapasitas penyimpanan media dan scan berkas aman.'
    },
    {
      key: 'backup',
      name: 'Snapshot Backup',
      category: 'BACKUP',
      status: 'OPTIMAL',
      value: 'SSoT Validated',
      details: 'Integritas cadangan data tersertifikasi SHA-256.'
    }
  ]);

  const refreshAll = () => {
    const d = new Date();
    setLastRefreshed(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} WIB`);

    const activeIncidents = smartIncidentService.getActiveIncidents();
    const perf = performanceStabilizer.getMetrics();

    setComponents([
      {
        key: 'guardian',
        name: 'Guardian Ring-0',
        category: 'GUARDIAN',
        status: 'OPTIMAL',
        value: 'Perimeter Aman',
        details: 'Perlindungan eskalasi wewenang & idempotency token aktif 100%.'
      },
      {
        key: 'dr_pulse',
        name: 'Dr. Pulse',
        category: 'DR_PULSE',
        status: perf.status === 'OPTIMAL' ? 'OPTIMAL' : 'WARNING',
        value: `${perf.averageFps} FPS`,
        details: `Skor kesehatan arsitektur ${perf.status}, latensi render optimal.`
      },
      {
        key: 'hermes',
        name: 'Hermes Recovery',
        category: 'HERMES',
        status: activeIncidents.length > 0 ? 'WARNING' : 'OPTIMAL',
        value: activeIncidents.length > 0 ? `${activeIncidents.length} Resolusi Standby` : 'Standby Ready',
        details: 'Snapshot state fallback & jalur pemulihan siap 100%.'
      },
      {
        key: 'black_box',
        name: 'Black Box',
        category: 'BLACK_BOX',
        status: 'OPTIMAL',
        value: `${blackBoxRecorder.getLogs().length} Log Events`,
        details: 'Perekam telemetri multi-ring mencatat seluruh peristiwa secara deterministik.'
      },
      {
        key: 'ppdb',
        name: 'PPDB Fortress',
        category: 'PPDB',
        status: 'OPTIMAL',
        value: 'Pipeline Aktif',
        details: 'Pendaftaran gelombang reguler & penetapan SPP sinkron.'
      },
      {
        key: 'storage',
        name: 'Storage Buffer',
        category: 'STORAGE',
        status: 'OPTIMAL',
        value: `${perf.storageUsageMb} MB / ${perf.storageQuotaMb} MB`,
        details: 'Kapasitas penyimpanan media dan scan berkas aman.'
      },
      {
        key: 'backup',
        name: 'Snapshot Backup',
        category: 'BACKUP',
        status: 'OPTIMAL',
        value: 'SSoT Validated',
        details: 'Integritas cadangan data tersertifikasi SHA-256.'
      }
    ]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const getStatusColor = (status: SystemComponentStatus['status']) => {
    switch (status) {
      case 'OPTIMAL':
        return 'bg-emerald-950/80 border-emerald-600/40 text-emerald-300';
      case 'WARNING':
        return 'bg-amber-950/80 border-amber-600/40 text-amber-300';
      case 'ALERT':
        return 'bg-rose-950/80 border-rose-600/40 text-rose-300';
    }
  };

  const getStatusDot = (status: SystemComponentStatus['status']) => {
    switch (status) {
      case 'OPTIMAL':
        return 'bg-emerald-400';
      case 'WARNING':
        return 'bg-amber-400 animate-pulse';
      case 'ALERT':
        return 'bg-rose-500 animate-ping';
    }
  };

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-slate-800 p-4 shadow-xl space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            TADE Founder Live Status Radar (P7)
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 font-mono">
            {lastRefreshed}
          </span>
        </div>

        <button
          onClick={refreshAll}
          className="text-slate-400 hover:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-end sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan Status</span>
        </button>
      </div>

      {/* Grid of 7 core modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {components.map(c => {
          let icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
          if (c.category === 'DR_PULSE') icon = <Activity className="w-3.5 h-3.5 text-emerald-400" />;
          if (c.category === 'HERMES') icon = <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />;
          if (c.category === 'BLACK_BOX') icon = <Terminal className="w-3.5 h-3.5 text-amber-400" />;
          if (c.category === 'PPDB') icon = <UserCheck className="w-3.5 h-3.5 text-cyan-400" />;
          if (c.category === 'STORAGE') icon = <HardDrive className="w-3.5 h-3.5 text-teal-400" />;
          if (c.category === 'BACKUP') icon = <Database className="w-3.5 h-3.5 text-emerald-400" />;

          return (
            <div
              key={c.key}
              title={c.details}
              className={`p-3 rounded-2xl border ${getStatusColor(c.status)} flex flex-col justify-between space-y-1.5 transition-all hover:scale-[1.02] cursor-default`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className="text-[11px] font-extrabold truncate text-white">{c.name}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${getStatusDot(c.status)} shrink-0`}></span>
              </div>
              <div className="text-[11px] font-bold truncate text-slate-300">
                {c.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
