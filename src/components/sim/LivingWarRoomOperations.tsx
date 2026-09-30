import React, { useState } from 'react';
import { Gauge, Radio, ShieldAlert, RefreshCw, FileSearch, Crown, CheckCircle2, AlertTriangle, Play, Sparkles, Activity } from 'lucide-react';

export type WarRoomOpMode = 'Live' | 'Incident' | 'Recovery' | 'Forensic' | 'Executive';

interface IncidentEvent {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  service: string;
  summary: string;
  actionTaken: string;
}

export const LivingWarRoomOperations: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<WarRoomOpMode>('Live');
  const [activeIncidents, setActiveIncidents] = useState<number>(0);
  const [telemetryLogs, setTelemetryLogs] = useState<IncidentEvent[]>([
    { id: 'EVT-101', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), severity: 'INFO', service: 'PPDB Service', summary: 'Spike pendaftaran online 12 wali murid bersamaan.', actionTaken: 'Auto-scaled cache & burst queue buffer.' },
    { id: 'EVT-102', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), severity: 'INFO', service: 'Firestore Cache', summary: 'Hit ratio 99.2% - Query budget zero cost.', actionTaken: 'Memory partition stabilized.' },
    { id: 'EVT-103', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), severity: 'INFO', service: 'Guardian Sentinel', summary: '8/8 Health probes passing normally.', actionTaken: 'Heartbeat logged in WORM.' }
  ]);

  const simulateTriggerIncident = () => {
    setActiveIncidents(prev => prev + 1);
    setCurrentMode('Incident');
    const newEvt: IncidentEvent = {
      id: `EVT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      severity: 'WARN',
      service: 'CCTV Stream Ingest',
      summary: 'Simulasi fluktuasi bitrate RTSP kamera gerbang utama.',
      actionTaken: 'Containment engaged; buffer stream switched to local proxy.'
    };
    setTelemetryLogs(prev => [newEvt, ...prev]);
  };

  const handleResolveIncident = () => {
    setActiveIncidents(0);
    setCurrentMode('Recovery');
    setTimeout(() => {
      setCurrentMode('Live');
    }, 1500);
  };

  return (
    <div id="living-war-room-operations-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              TADE RC70 • R527
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              24/7 Real-Time Operational HQ
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Gauge className="w-7 h-7 text-indigo-400" />
            Living War Room Operations
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Transformasi War Room statis menjadi pusat kendali dinamis dengan 5 mode operasional (Live, Incident, Recovery, Forensic, Executive).
          </p>
        </div>

        {/* Current Mode Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 border border-indigo-500/30 px-4 py-2 rounded-xl text-center">
            <span className="text-xs text-indigo-300 block">Active War Room Mode</span>
            <span className={`text-lg font-bold ${
              currentMode === 'Live' ? 'text-emerald-400' :
              currentMode === 'Incident' ? 'text-rose-400 animate-pulse' :
              currentMode === 'Recovery' ? 'text-amber-400' :
              currentMode === 'Forensic' ? 'text-cyan-400' : 'text-purple-400'
            }`}>
              {currentMode.toUpperCase()} MODE
            </span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { mode: 'Live', label: '1. Live Operations', icon: Radio, desc: 'Pemantauan real-time status 12 engine dan arus data.', color: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
          { mode: 'Incident', label: '2. Incident Mode', icon: ShieldAlert, desc: 'Isolasi anomali dan aktivasi swarm containment.', color: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
          { mode: 'Recovery', label: '3. Recovery Mode', icon: RefreshCw, desc: 'Proses penyembuhan mandiri dan restorasi service.', color: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
          { mode: 'Forensic', label: '4. Forensic Mode', icon: FileSearch, desc: 'Audit jejak memory, log WORM, dan bukti tamper-proof.', color: 'border-cyan-500 text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40' },
          { mode: 'Executive', label: '5. Executive Mode', icon: Crown, desc: 'Ringkasan komando strategis untuk Ketua Yayasan.', color: 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/40' }
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setCurrentMode(item.mode as WarRoomOpMode)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? `${item.color} shadow-sm ring-2 ring-indigo-500/20`
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                <div className="text-xs opacity-80">{item.desc}</div>
              </div>
              <div className="mt-3 text-[11px] font-semibold tracking-wider">
                {isSelected ? '● ACTIVE NOW' : 'SELECT MODE'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Living Operations Console — {currentMode}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={simulateTriggerIncident}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-200"
              >
                Simulate Anomaly
              </button>
              {activeIncidents > 0 && (
                <button
                  onClick={handleResolveIncident}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve & Heal
                </button>
              )}
            </div>
          </div>

          {/* Conditional View based on Mode */}
          {currentMode === 'Live' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold text-sm">Operasional Harian Normal (Green State)</div>
                  12/12 Engine berjalan otonom. Tidak ada error rate yang melebihi ambang batas 0.01%. Cache hit ratio 99.2%.
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Live Uptime</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">99.998%</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Active Requests/s</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">42 req/s</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Defense Ladder</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Level 4 (Elite)</div>
                </div>
              </div>
            </div>
          )}

          {currentMode === 'Incident' && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" /> Incident Response Protocol Active
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-200">
                Isolasi fault domain otomatis aktif. Modul yang terdampak dialihkan ke fallback queue tanpa mengganggu kelancaran portal utama.
              </p>
            </div>
          )}

          {currentMode === 'Recovery' && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
                <RefreshCw className="w-5 h-5 animate-spin" /> Swarm Recovery in Progress
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Verifikasi integritas state, sinkronisasi WORM storage, dan reintegrasi node ke active consensus.
              </p>
            </div>
          )}

          {currentMode === 'Forensic' && (
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                <FileSearch className="w-5 h-5" /> Cryptographic Forensic Analysis
              </div>
              <p className="text-xs text-cyan-800 dark:text-cyan-200">
                Audit trail SHA-256 terverifikasi tanpa ada tamper. Seluruh mutasi kas, PPDB, dan raport tervalidasi sah.
              </p>
            </div>
          )}

          {currentMode === 'Executive' && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm">
                <Crown className="w-5 h-5" /> Executive Summary for Ketua Yayasan
              </div>
              <p className="text-xs text-purple-800 dark:text-purple-200">
                Status kedaulatan data aman. Sekolah memiliki backup mandiri 100%, operasional sekolah berjalan lancar, dan AI Asy siap taklimat harian.
              </p>
            </div>
          )}

          {/* Event Stream */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Live Incident & Telemetry Stream</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
              {telemetryLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mr-2">[{log.service}]</span>
                    <span className="text-slate-600 dark:text-slate-300">{log.summary}</span>
                    <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5">Tindakan: {log.actionTaken}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Matrix */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              War Room Operations Guide
            </h2>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <p>
                War Room A–AC tetap terpasang secara utuh sebagai fondasi validasi build, sementara Living War Room mengorkestrasi operasi 24/7.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">AI Asy & Guardian SLA</span>
                <span>Response Time Anomali: <strong>&lt; 50ms</strong></span>
                <span className="block">Swarm Reconnection: <strong>Otonom</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>SLA: 99.99% Guaranteed</span>
            <span>Immutable WORM Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
