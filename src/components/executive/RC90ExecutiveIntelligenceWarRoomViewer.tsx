import React, { useState } from 'react';
import {
  Brain,
  FileText,
  MessageSquare,
  Layers,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ExecutiveIntelligenceHubViewer } from './ExecutiveIntelligenceHubViewer';
import { SituationReportViewer } from './SituationReportViewer';
import { ExecutiveQuestionConsoleViewer } from './ExecutiveQuestionConsoleViewer';
import { EngineContractRegistryViewer } from './EngineContractRegistryViewer';
import { CapabilityRegistryViewer } from './CapabilityRegistryViewer';

interface Props {
  onNavigate?: (tabId: string) => void;
  defaultSubTab?: 'HUB' | 'SITREP' | 'QUESTION' | 'CONTRACTS' | 'CAPABILITY';
}

export const RC90ExecutiveIntelligenceWarRoomViewer: React.FC<Props> = ({
  onNavigate,
  defaultSubTab = 'HUB'
}) => {
  const [activeTab, setActiveTab] = useState<'HUB' | 'SITREP' | 'QUESTION' | 'CONTRACTS' | 'CAPABILITY'>(defaultSubTab);

  return (
    <div className="space-y-6">
      {/* War Room Command Nav Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">RC90 — WAR ROOM AR-13</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LTS v6.8.0-RC90
              </span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-slate-200 font-mono">
              Enterprise Engine Contract & AI Asy Executive Intelligence
            </h1>
          </div>
        </div>

        {/* Sub-Nav Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('HUB')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'HUB'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Executive Hub (R723)</span>
          </button>

          <button
            onClick={() => setActiveTab('SITREP')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'SITREP'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SITREP (R724)</span>
          </button>

          <button
            onClick={() => setActiveTab('QUESTION')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'QUESTION'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Konsol Tanya (R727)</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTRACTS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'CONTRACTS'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kontrak Engine (R721)</span>
          </button>

          <button
            onClick={() => setActiveTab('CAPABILITY')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'CAPABILITY'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Kapabilitas (R729)</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'HUB' && <ExecutiveIntelligenceHubViewer onNavigate={onNavigate} />}
      {activeTab === 'SITREP' && <SituationReportViewer />}
      {activeTab === 'QUESTION' && <ExecutiveQuestionConsoleViewer onNavigate={onNavigate} />}
      {activeTab === 'CONTRACTS' && <EngineContractRegistryViewer onNavigate={onNavigate} />}
      {activeTab === 'CAPABILITY' && <CapabilityRegistryViewer onNavigate={onNavigate} />}
    </div>
  );
};
