import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  PauseCircle, 
  BookOpen, 
  FlaskConical, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import { AdaptiveAdminQualityBoardViewer } from './AdaptiveAdminQualityBoardViewer';
import { PauseResumeContinuityViewer } from './PauseResumeContinuityViewer';
import { WorkflowAdaptationViewer } from './WorkflowAdaptationViewer';
import { HermesAdaptiveDryRunLabViewer } from './HermesAdaptiveDryRunLabViewer';

export const HermesAdaptiveSuiteViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'quality_board' | 'pause_resume' | 'adaptation' | 'dry_run_lab'>('quality_board');

  const subTabs = [
    { id: 'quality_board', label: 'Admin Quality Board & Metrics', icon: Activity, badge: 'R696, R699' },
    { id: 'pause_resume', label: 'Pause/Resume & Fingerprint', icon: PauseCircle, badge: 'R691, R692, R698' },
    { id: 'adaptation', label: 'Takeover Learning & Patterns', icon: BookOpen, badge: 'R693, R694, R697' },
    { id: 'dry_run_lab', label: 'Adaptive Dry-Run Lab', icon: FlaskConical, badge: 'R700' },
  ];

  return (
    <div className="space-y-6" id="hermes-adaptive-suite-viewer">
      {/* Sub-tab Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap gap-2 shadow-lg">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-[220px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-950/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      {activeSubTab === 'quality_board' && <AdaptiveAdminQualityBoardViewer />}
      {activeSubTab === 'pause_resume' && <PauseResumeContinuityViewer />}
      {activeSubTab === 'adaptation' && <WorkflowAdaptationViewer />}
      {activeSubTab === 'dry_run_lab' && <HermesAdaptiveDryRunLabViewer />}
    </div>
  );
};
