import React, { useState } from 'react';
import { 
  Crown, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  HardDrive, 
  Mic, 
  Smile, 
  Activity, 
  SunMedium, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import { DigitalTownHallViewer } from './DigitalTownHallViewer';
import { AsyCabinetViewer } from './AsyCabinetViewer';
import { GuardianCabinetViewer } from './GuardianCabinetViewer';
import { HermesCabinetViewer } from './HermesCabinetViewer';
import { AsyVoiceStudioViewer } from './AsyVoiceStudioViewer';
import { LivingCharacterViewer } from './LivingCharacterViewer';
import { SituationalAwarenessViewer } from './SituationalAwarenessViewer';
import { IntelligenceCouncilViewer } from './IntelligenceCouncilViewer';

export type RC100Tab = 
  | 'townhall'
  | 'asy'
  | 'guardian'
  | 'hermes'
  | 'voice'
  | 'living'
  | 'situational'
  | 'intelligence';

interface Props {
  initialTab?: RC100Tab;
}

export const RC100LivingSchoolWarRoomViewer: React.FC<Props> = ({ initialTab = 'townhall' }) => {
  const [activeTab, setActiveTab] = useState<RC100Tab>(initialTab);

  const tabs: { id: RC100Tab; label: string; icon: any; badge?: string }[] = [
    { id: 'townhall', label: 'Balai Kota', icon: Building2, badge: 'R822' },
    { id: 'asy', label: 'Pemerintahan Asy', icon: Sparkles, badge: 'R823' },
    { id: 'guardian', label: 'Pemerintahan Guardian', icon: ShieldCheck, badge: 'R824' },
    { id: 'hermes', label: 'Pemerintahan Hermes', icon: HardDrive, badge: 'R825' },
    { id: 'voice', label: 'Studio Suara', icon: Mic, badge: 'R826' },
    { id: 'living', label: 'Karakter Hidup', icon: Smile, badge: 'R827' },
    { id: 'situational', label: 'Sensor Situasi', icon: Activity, badge: 'R828' },
    { id: 'intelligence', label: 'Dewan Intelijen', icon: SunMedium, badge: 'R829' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-4" id="rc100-war-room-master">
      {/* Master Top Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5" />
              TADE RC100 &bull; LIVING DIGITAL SCHOOL
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-emerald-400 border border-slate-700">
              v8.0.0-RC100
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">
            Pusat Kendali Nasional Pemerintahan & Ekosistem Hidup
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
            DISC-821 ~ DISC-830 LOCKED
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable One-Hand Friendly Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80 -mx-2 px-2 sm:mx-0 sm:px-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      <div className="pt-2">
        {activeTab === 'townhall' && <DigitalTownHallViewer onSelectGovernment={(domain) => {
          if (domain === 'ASY_PELAYANAN') setActiveTab('asy');
          else if (domain === 'GUARDIAN_KEAMANAN') setActiveTab('guardian');
          else if (domain === 'HERMES_PEMULIHAN') setActiveTab('hermes');
        }} />}
        {activeTab === 'asy' && <AsyCabinetViewer />}
        {activeTab === 'guardian' && <GuardianCabinetViewer />}
        {activeTab === 'hermes' && <HermesCabinetViewer />}
        {activeTab === 'voice' && <AsyVoiceStudioViewer />}
        {activeTab === 'living' && <LivingCharacterViewer />}
        {activeTab === 'situational' && <SituationalAwarenessViewer />}
        {activeTab === 'intelligence' && <IntelligenceCouncilViewer />}
      </div>
    </div>
  );
};
