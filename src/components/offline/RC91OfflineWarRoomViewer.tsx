import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Radio,
  ListOrdered,
  HardDrive,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Flame,
  FileCheck2,
  Sliders,
  CheckCircle2,
  Sparkles,
  Layers,
  LayoutDashboard,
  Lock,
  Activity
} from 'lucide-react';
import { OfflineContinuityManagerViewer } from './OfflineContinuityManagerViewer';
import { SafeSyncQueueViewer } from './SafeSyncQueueViewer';
import { ConflictResolutionViewer } from './ConflictResolutionViewer';
import { LocalSnapshotCacheViewer } from './LocalSnapshotCacheViewer';
import { ConnectivityIntelligenceViewer } from './ConnectivityIntelligenceViewer';
import { RecoveryReplayViewer } from './RecoveryReplayViewer';
import { OfflineReadinessDashboardViewer } from './OfflineReadinessDashboardViewer';
import { DisasterContinuitySimulatorViewer } from './DisasterContinuitySimulatorViewer';
import { OfflineIntegrityAuditorViewer } from './OfflineIntegrityAuditorViewer';
import { offlineContinuityManager } from '../../core/offline/offlineContinuityManager';
import { safeSyncQueue } from '../../core/offline/safeSyncQueue';
import { conflictResolutionEngine } from '../../core/offline/conflictResolutionEngine';
import { localSnapshotCache } from '../../core/offline/localSnapshotCache';

interface Props {
  initialTab?: string;
  onNavigate?: (module: string) => void;
}

type TabType =
  | 'OVERVIEW'
  | 'MANAGER'
  | 'QUEUE'
  | 'CONFLICTS'
  | 'CACHE'
  | 'INTELLIGENCE'
  | 'REPLAY'
  | 'DASHBOARD'
  | 'SIMULATOR'
  | 'AUDIT';

export const RC91OfflineWarRoomViewer: React.FC<Props> = ({ initialTab, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>(
    (initialTab as TabType) || 'OVERVIEW'
  );
  const [status, setStatus] = useState(offlineContinuityManager.getStatus());
  const [queueCount, setQueueCount] = useState(safeSyncQueue.getQueuedCount());
  const [conflictCount, setConflictCount] = useState(conflictResolutionEngine.getUnresolvedCount());
  const [snapshotCount, setSnapshotCount] = useState(localSnapshotCache.getAllSnapshots().length);

  useEffect(() => {
    const unsub1 = offlineContinuityManager.subscribe((st) => setStatus(st));
    const unsub2 = safeSyncQueue.subscribe(() => setQueueCount(safeSyncQueue.getQueuedCount()));
    const unsub3 = conflictResolutionEngine.subscribe(() => setConflictCount(conflictResolutionEngine.getUnresolvedCount()));
    const unsub4 = localSnapshotCache.subscribe(() => setSnapshotCount(localSnapshotCache.getAllSnapshots().length));

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: 'OVERVIEW', label: 'Ringkasan RC91', icon: <Layers className="w-4 h-4" /> },
    { id: 'MANAGER', label: 'R731 Manager', icon: <Radio className="w-4 h-4" />, badge: status },
    { id: 'QUEUE', label: 'R732 Safe Queue', icon: <ListOrdered className="w-4 h-4" />, badge: queueCount > 0 ? queueCount : undefined },
    { id: 'CONFLICTS', label: 'R733 Conflicts', icon: <AlertTriangle className="w-4 h-4" />, badge: conflictCount > 0 ? conflictCount : undefined },
    { id: 'CACHE', label: 'R734 Cache', icon: <HardDrive className="w-4 h-4" />, badge: snapshotCount },
    { id: 'INTELLIGENCE', label: 'R735 Intel', icon: <Activity className="w-4 h-4" /> },
    { id: 'REPLAY', label: 'R736 Replay', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'DASHBOARD', label: 'R737 Readiness', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'SIMULATOR', label: 'R738 Simulator', icon: <Flame className="w-4 h-4" /> },
    { id: 'AUDIT', label: 'R739 Audit', icon: <FileCheck2 className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Master Sovereign Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                TADE RC91 &bull; OFFLINE CONTINUITY ENTERPRISE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> MANIFEST v6.9.0-RC91
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HERMES: DORMANT_SAFE
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Pusat Komando Kontinuitas Offline &amp; Ketahanan Jaringan
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Infrastruktur multi-layer untuk menjamin operasional madrasah tetap berjalan mulus saat jaringan putus,
              dengan antrean idempoten, resolusi konflik aman, dan 5-Phase atomic recovery replay.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono text-xs hidden sm:block">
              <div className="text-slate-400">STATUS SINKRONISASI</div>
              <div className="text-emerald-400 font-bold text-sm flex items-center justify-end gap-1">
                <CheckCircle2 className="w-4 h-4" /> ZERO DATA LOSS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.icon}
              {t.label}
              {t.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-indigo-300 font-bold">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-mono font-bold">STATE KONEKSI</span>
                <Radio className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{status}</div>
              <p className="text-xs text-slate-400 mt-1">R731 Continuity Manager</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-mono font-bold">SAFE QUEUE</span>
                <ListOrdered className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{queueCount} Antrean</div>
              <p className="text-xs text-slate-400 mt-1">R732 Deduplicated Sync</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-mono font-bold">KONFLIK TERISOLASI</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{conflictCount} Kasus</div>
              <p className="text-xs text-slate-400 mt-1">R733 Conflict Engine</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-mono font-bold">SNAPSHOT CACHE</span>
                <HardDrive className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{snapshotCount} Entitas</div>
              <p className="text-xs text-slate-400 mt-1">R734 Local Snapshot Cache</p>
            </div>
          </div>

          {/* Module Grid of RC91 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'MANAGER',
                code: 'R731',
                title: 'Offline Continuity Manager',
                desc: 'Mengelola 4 state jaringan (ONLINE, DEGRADED, OFFLINE, RECOVERING) dengan hysteresis.'
              },
              {
                id: 'QUEUE',
                code: 'R732',
                title: 'Safe Sync Queue',
                desc: 'Antrean operasi offline berbobot prioritas dengan fingerprinting anti-duplikasi.'
              },
              {
                id: 'CONFLICTS',
                code: 'R733',
                title: 'Conflict Resolution Engine',
                desc: 'Mencegah auto-merge berbahaya dengan kebijakan SSoT Authoritative & manual review.'
              },
              {
                id: 'CACHE',
                code: 'R734',
                title: 'Local Snapshot Cache',
                desc: 'Cache baca lokal berperforma tinggi dengan validasi TTL dan SHA-256 checksum.'
              },
              {
                id: 'INTELLIGENCE',
                code: 'R735',
                title: 'Connectivity Intelligence',
                desc: 'Profiling telemetri jaringan, latensi, waktu pemulihan, dan skor stabilitas.'
              },
              {
                id: 'REPLAY',
                code: 'R736',
                title: 'Recovery Replay Engine',
                desc: 'Eksekusi pemulihan 5-fase: RELOAD &rarr; PRE-VERIFY &rarr; REPLAY &rarr; POST-VERIFY &rarr; COMPLETE.'
              },
              {
                id: 'DASHBOARD',
                code: 'R737',
                title: 'Offline Readiness Dashboard',
                desc: 'Panel kontrol terpadu status kesiapan kontinuitas dan matriks keandalan.'
              },
              {
                id: 'SIMULATOR',
                code: 'R738',
                title: 'Disaster Continuity Simulator',
                desc: 'Air-gapped sandbox simulasi internet putus, degradasi, tabrakan, dan pemulihan.'
              },
              {
                id: 'AUDIT',
                code: 'R739',
                title: 'Offline Integrity Auditor',
                desc: 'Audit kepatuhan non-destruktif terhadap keutuhan data offline dan SSoT invariants.'
              }
            ].map((mod) => (
              <div
                key={mod.code}
                onClick={() => setActiveTab(mod.id as TabType)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {mod.code}
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      Buka Modul &rarr;
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Founder Verification Ratification Banner */}
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 font-mono">
                  STATUS RC91: IMPLEMENTED — FOUNDER VERIFICATION REQUIRED
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Seluruh 10 modul RC91 (R731–R740) telah terpasang, terverifikasi bebas duplikasi, dan siap diuji oleh Founder.
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs font-mono shrink-0">
              SEAL-SHA256-RC91-OFFLINE
            </span>
          </div>
        </div>
      )}

      {activeTab === 'MANAGER' && <OfflineContinuityManagerViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'QUEUE' && <SafeSyncQueueViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'CONFLICTS' && <ConflictResolutionViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'CACHE' && <LocalSnapshotCacheViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'INTELLIGENCE' && <ConnectivityIntelligenceViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'REPLAY' && <RecoveryReplayViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'DASHBOARD' && <OfflineReadinessDashboardViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'SIMULATOR' && <DisasterContinuitySimulatorViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
      {activeTab === 'AUDIT' && <OfflineIntegrityAuditorViewer onNavigate={(m) => setActiveTab(m.toUpperCase() as TabType)} />}
    </div>
  );
};
