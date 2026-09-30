import React, { useState } from 'react';
import { 
  Building2, 
  Camera, 
  Sliders, 
  Film, 
  BookOpen, 
  FolderArchive, 
  Heart, 
  Smile, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Crown, 
  CheckCircle2, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { MasterCharacterViewer } from './MasterCharacterViewer';
import { SchoolActivityCenterPro } from './SchoolActivityCenterPro';
import { PhotoLabProPlus } from './PhotoLabProPlus';
import { StoryStudioViral } from './StoryStudioViral';
import { SmartTeachingLibrary } from './SmartTeachingLibrary';
import { HermesDigitalVaultViewer } from './HermesDigitalVaultViewer';
import { ParentEngagementDashboard } from './ParentEngagementDashboard';
import { LivingSchoolModeViewer } from './LivingSchoolModeViewer';
import { EvolutionIntelligenceViewer } from './EvolutionIntelligenceViewer';

export const RC101OperationalWarRoomViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'kegiatan'
    | 'photolab'
    | 'story'
    | 'pustaka'
    | 'brankas'
    | 'wali'
    | 'living'
    | 'intelijen'
    | 'master_char'
  >('kegiatan');

  const tabs = [
    { id: 'kegiatan', label: 'Kegiatan TK', sub: 'R832 Single Upload', icon: Camera, color: 'text-emerald-400' },
    { id: 'photolab', label: 'Photo Lab Pro+', sub: 'R833 Restorasi', icon: Sliders, color: 'text-rose-400' },
    { id: 'story', label: 'Story Studio', sub: 'R834 Reels Viral', icon: Film, color: 'text-violet-400' },
    { id: 'pustaka', label: 'Bahan Ajar', sub: 'R835 Generator PDF', icon: BookOpen, color: 'text-teal-400' },
    { id: 'brankas', label: 'Brankas Hermes', sub: 'R836 Folder Arsip', icon: FolderArchive, color: 'text-cyan-400' },
    { id: 'wali', label: 'Wali Murid', sub: 'R837 Portal Ortu', icon: Heart, color: 'text-pink-400' },
    { id: 'living', label: 'Sekolah Hidup', sub: 'R838 Bank Tingkah', icon: Smile, color: 'text-amber-400' },
    { id: 'intelijen', label: 'Evolusi Radar', sub: 'R839 Inovasi Queue', icon: TrendingUp, color: 'text-indigo-400' },
    { id: 'master_char', label: 'Master Character', sub: 'R831 Konstitusi', icon: Crown, color: 'text-amber-300' }
  ];

  return (
    <div className="space-y-6" id="rc101-operational-war-room">
      {/* Master Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                TADE RC101 &bull; Operational Excellence
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                v8.1.0-RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Komando Operasional Harian Sekolah
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pusat keunggulan operasional yang menyatukan kegiatan santri, photo lab, video story, generator bahan ajar cerdas, brankas arsip, portal wali murid, dan karakter hidup resmi.
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
                  ? 'bg-slate-800 border-amber-500/80 ring-2 ring-amber-500/20 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${tab.color}`} />
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'kegiatan' && <SchoolActivityCenterPro />}
        {activeTab === 'photolab' && <PhotoLabProPlus />}
        {activeTab === 'story' && <StoryStudioViral />}
        {activeTab === 'pustaka' && <SmartTeachingLibrary />}
        {activeTab === 'brankas' && <HermesDigitalVaultViewer />}
        {activeTab === 'wali' && <ParentEngagementDashboard />}
        {activeTab === 'living' && <LivingSchoolModeViewer />}
        {activeTab === 'intelijen' && <EvolutionIntelligenceViewer />}
        {activeTab === 'master_char' && <MasterCharacterViewer />}
      </div>
    </div>
  );
};
