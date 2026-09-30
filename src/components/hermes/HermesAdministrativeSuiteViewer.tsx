import React, { useState } from 'react';
import { AdministrativeTaskOrchestratorViewer } from './AdministrativeTaskOrchestratorViewer';
import { AdminServiceQualityBoardViewer } from './AdminServiceQualityBoardViewer';
import { FounderAdminCommandCenterViewer } from './FounderAdminCommandCenterViewer';
import { HermesDryRunSimulatorViewer } from './HermesDryRunSimulatorViewer';
import { 
  Bot, 
  Sparkles, 
  BarChart3, 
  Crown, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export const HermesAdministrativeSuiteViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ORCHESTRATOR' | 'QUALITY_BOARD' | 'COMMAND_CENTER' | 'DRY_RUN'>('ORCHESTRATOR');

  const tabs = [
    {
      id: 'ORCHESTRATOR',
      label: 'Task Orchestrator & Workflows',
      sublabel: 'R677–R682, R684',
      icon: Sparkles
    },
    {
      id: 'QUALITY_BOARD',
      label: 'Service Quality & Journal',
      sublabel: 'R683, R685, R686',
      icon: BarChart3
    },
    {
      id: 'COMMAND_CENTER',
      label: 'Founder Command Center',
      sublabel: 'R687, R689 Sovereign Mode',
      icon: Crown
    },
    {
      id: 'DRY_RUN',
      label: 'Safety Gate & Simulator',
      sublabel: 'R688, R690 Dry-Run Engine',
      icon: Cpu
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Master Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-mono font-bold text-xl text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  TADE RC86 &bull; R677–R690
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                  FOUNDER VERIFICATION REQUIRED
                </span>
              </div>
              <h1 className="text-xl font-black text-white mt-0.5">
                Hermes Administrative Intelligence &amp; Task Completion Engine
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hermes: <strong>DORMANT SAFE</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Doctrine: <strong>COMPLETION FIRST</strong></span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          &ldquo;Hermes tidak dinilai dari seberapa pintar ia berbicara. Hermes dinilai dari seberapa banyak pekerjaan administrasi yang benar-benar selesai.&rdquo;
        </p>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3 rounded-2xl text-left transition-all font-mono ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span className="text-xs font-bold truncate">{tab.label}</span>
                </div>
                <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="transition-all">
        {activeTab === 'ORCHESTRATOR' && <AdministrativeTaskOrchestratorViewer />}
        {activeTab === 'QUALITY_BOARD' && <AdminServiceQualityBoardViewer />}
        {activeTab === 'COMMAND_CENTER' && <FounderAdminCommandCenterViewer />}
        {activeTab === 'DRY_RUN' && <HermesDryRunSimulatorViewer />}
      </div>
    </div>
  );
};
