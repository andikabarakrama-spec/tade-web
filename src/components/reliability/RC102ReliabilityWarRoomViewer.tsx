import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Layers, 
  Zap, 
  HeartPulse, 
  FolderArchive, 
  Sliders, 
  Film, 
  GraduationCap, 
  ShieldAlert, 
  Crown, 
  CheckCircle2, 
  Lock,
  Sparkles
} from 'lucide-react';
import { NationalTaskOrchestratorViewer } from './NationalTaskOrchestratorViewer';
import { SmartQueueDashboard } from './SmartQueueDashboard';
import { AutomationCenterViewer } from './AutomationCenterViewer';
import { DailyHealthInspectorViewer } from './DailyHealthInspectorViewer';
import { AutonomousDigitalVaultViewer } from './AutonomousDigitalVaultViewer';
import { PhotoLabBatchViewer } from './PhotoLabBatchViewer';
import { StoryStudioBatchViewer } from './StoryStudioBatchViewer';
import { PrincipalExecutiveDashboard } from './PrincipalExecutiveDashboard';
import { GuardianStressTestViewer } from './GuardianStressTestViewer';

export const RC102ReliabilityWarRoomViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'orchestrator'
    | 'smartqueue'
    | 'automation'
    | 'health'
    | 'vault'
    | 'photobatch'
    | 'storybatch'
    | 'principal'
    | 'stresstest'
  >('orchestrator');

  const tabs = [
    { id: 'orchestrator', label: 'Orchestrator', sub: 'R841 Task Idempoten', icon: Server, color: 'text-blue-400' },
    { id: 'smartqueue', label: 'Smart Queue', sub: 'R842 Priority Deck', icon: Layers, color: 'text-cyan-400' },
    { id: 'automation', label: 'Otomasi Pipa', sub: 'R843 Jadwal Autopilot', icon: Zap, color: 'text-amber-400' },
    { id: 'health', label: 'Cek Kesehatan', sub: 'R844 Diagnostik SSoT', icon: HeartPulse, color: 'text-emerald-400' },
    { id: 'vault', label: 'Brankas Auto', sub: 'R845 Rolling SHA-256', icon: FolderArchive, color: 'text-cyan-300' },
    { id: 'photobatch', label: 'Foto Batch', sub: 'R846 Bulk Restore', icon: Sliders, color: 'text-rose-400' },
    { id: 'storybatch', label: 'Story Batch', sub: 'R847 Multi-Reels 9:16', icon: Film, color: 'text-violet-400' },
    { id: 'principal', label: 'Kepala Sekolah', sub: 'R848 Dashboard Strategis', icon: GraduationCap, color: 'text-emerald-300' },
    { id: 'stresstest', label: 'Stress Chaos', sub: 'R849 Ring-0 Defense', icon: ShieldAlert, color: 'text-rose-500' }
  ];

  return (
    <div className="space-y-6" id="rc102-reliability-war-room">
      {/* Master Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                TADE RC102 &bull; Autonomous Reliability & Production Readiness
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                v8.2.0-RC102
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Komando Keandalan Otonom & Kesiapan Produksi
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memastikan operasional sekolah berjalan tangguh 24/7 dengan eksekusi bebas duplikasi, beban CPU mendekati nol, bebas kebocoran memori, dan perlindungan Ring-0 100%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Guardian Ring-0: 100%
            </span>
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-cyan-500/20 text-cyan-300 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Hermes: DORMANT_SAFE
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Pills Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                isSelected
                  ? 'bg-slate-800 border-blue-500/80 ring-2 ring-blue-500/20 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${tab.color}`} />
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </div>
              <div>
                <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {tab.label}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">{tab.sub}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'orchestrator' && <NationalTaskOrchestratorViewer />}
        {activeTab === 'smartqueue' && <SmartQueueDashboard />}
        {activeTab === 'automation' && <AutomationCenterViewer />}
        {activeTab === 'health' && <DailyHealthInspectorViewer />}
        {activeTab === 'vault' && <AutonomousDigitalVaultViewer />}
        {activeTab === 'photobatch' && <PhotoLabBatchViewer />}
        {activeTab === 'storybatch' && <StoryStudioBatchViewer />}
        {activeTab === 'principal' && <PrincipalExecutiveDashboard />}
        {activeTab === 'stresstest' && <GuardianStressTestViewer />}
      </div>
    </div>
  );
};
