import React, { useState } from 'react';
import { 
  Wifi, 
  Command, 
  ShieldCheck, 
  Clock, 
  Database, 
  GitMerge, 
  Activity, 
  FileCheck, 
  HardDrive, 
  Sparkles,
  Layers,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';
import { OfflineContinuityEngineViewer } from './OfflineContinuityEngineViewer';
import { FounderCommandPaletteViewer } from './FounderCommandPaletteViewer';
import { GuardianContinuousVerificationViewer } from './GuardianContinuousVerificationViewer';
import { SovereignSessionIntelligenceViewer } from './SovereignSessionIntelligenceViewer';
import { OfflineCompanionCacheViewer } from './OfflineCompanionCacheViewer';
import { SyncReconciliationViewer } from './SyncReconciliationViewer';
import { GuardianHealthDashboardViewer } from './GuardianHealthDashboardViewer';
import { DiscoveryIntegrityScannerViewer } from './DiscoveryIntegrityScannerViewer';
import { RecoveryReadinessSimulatorViewer } from './RecoveryReadinessSimulatorViewer';

interface RC94SovereignWarRoomViewerProps {
  onNavigateTab?: (tabId: string) => void;
}

export const RC94SovereignWarRoomViewer: React.FC<RC94SovereignWarRoomViewerProps> = ({
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'offline' | 'command_palette' | 'guardian' | 'session' | 'companion_cache' | 'sync' | 'health' | 'registry' | 'recovery'
  >('overview');

  const subTabs = [
    { id: 'overview', label: 'Ringkasan Kedaulatan RC94', icon: Sparkles, badge: 'Overview' },
    { id: 'offline', label: 'Offline Continuity Engine', icon: Wifi, badge: 'R761' },
    { id: 'command_palette', label: 'Founder Command Palette', icon: Command, badge: 'R762' },
    { id: 'guardian', label: 'Continuous Verification', icon: ShieldCheck, badge: 'R763' },
    { id: 'session', label: 'Session Intelligence', icon: Clock, badge: 'R764' },
    { id: 'companion_cache', label: 'Companion Cache', icon: Database, badge: 'R765' },
    { id: 'sync', label: 'Sync Reconciliation', icon: GitMerge, badge: 'R766' },
    { id: 'health', label: 'Guardian Health Board', icon: Activity, badge: 'R767' },
    { id: 'registry', label: 'Discovery Scanner', icon: FileCheck, badge: 'R768' },
    { id: 'recovery', label: 'Recovery Simulator', icon: HardDrive, badge: 'R769' },
  ];

  return (
    <div className="space-y-6" id="rc94-sovereign-war-room">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sovereign Operations Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                RC94 &bull; R761–R770 &bull; Manifest v7.2.0
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              RC94 Sovereign Operations & Offline Continuity War Room
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pusat komando operasi berdaulat TADE: kontinuitas antrean offline, pintasan Command Palette Super Admin, audit otomatis Guardian Ring-0, dan sinkronisasi non-destruktif ke SSoT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              SSoT: Protected & Hegemonic
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap gap-2 shadow-lg">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-950/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Overview View */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">1. Offline Continuity Layer</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Antrean tindakan in-memory saat jaringan terputus (R761) dengan sinkronisasi bertahap tanpa auto-overwrite SSoT (R766) dan cache aman non-sensitif (R765).
              </p>
              <button
                onClick={() => setActiveTab('offline')}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition"
              >
                <span>Buka Engine Offline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">2. Founder Command Palette</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Navigasi cepat global via shortcut Ctrl+K dengan penyaringan RBAC ketat (R762) dan deteksi waktu idle sesi berdaulat (R764).
              </p>
              <button
                onClick={() => setActiveTab('command_palette')}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition"
              >
                <span>Buka Command Palette</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">3. Guardian Ring-0 & Registry</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audit internal berkelanjutan (R763), pemindai integritas pendaftaran penemuan (R768), dan simulasi pemulihan bencana (R769).
              </p>
              <button
                onClick={() => setActiveTab('guardian')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition"
              >
                <span>Buka Guardian Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Selected Sub-views */}
      {activeTab === 'offline' && <OfflineContinuityEngineViewer />}
      {activeTab === 'command_palette' && <FounderCommandPaletteViewer onNavigateTab={onNavigateTab} />}
      {activeTab === 'guardian' && <GuardianContinuousVerificationViewer />}
      {activeTab === 'session' && <SovereignSessionIntelligenceViewer />}
      {activeTab === 'companion_cache' && <OfflineCompanionCacheViewer />}
      {activeTab === 'sync' && <SyncReconciliationViewer />}
      {activeTab === 'health' && <GuardianHealthDashboardViewer />}
      {activeTab === 'registry' && <DiscoveryIntegrityScannerViewer />}
      {activeTab === 'recovery' && <RecoveryReadinessSimulatorViewer />}
    </div>
  );
};
