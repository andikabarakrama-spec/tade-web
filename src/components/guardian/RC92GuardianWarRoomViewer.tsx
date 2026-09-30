import React, { useState } from 'react';
import { 
  Shield, 
  Cpu, 
  Hammer, 
  Radio, 
  FileText, 
  FlaskConical, 
  GitCompare, 
  Award, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Zap,
  SlidersHorizontal,
  Lock
} from 'lucide-react';
import { GuardianPolicyRegistryViewer } from './GuardianPolicyRegistryViewer';
import { PolicyEvaluationViewer } from './PolicyEvaluationViewer';
import { ConstitutionCompilerViewer } from './ConstitutionCompilerViewer';
import { BuildGateValidatorViewer } from './BuildGateValidatorViewer';
import { RuntimePolicyMonitorViewer } from './RuntimePolicyMonitorViewer';
import { GuardianExceptionJournalViewer } from './GuardianExceptionJournalViewer';
import { PolicySimulatorViewer } from './PolicySimulatorViewer';
import { ConstitutionDiffViewer } from './ConstitutionDiffViewer';
import { SovereignGovernanceBoardViewer } from './SovereignGovernanceBoardViewer';

export type RC92SubTab = 
  | 'OVERVIEW'
  | 'R741_REGISTRY'
  | 'R742_EVALUATOR'
  | 'R743_COMPILER'
  | 'R744_BUILDGATE'
  | 'R745_RUNTIME'
  | 'R746_JOURNAL'
  | 'R747_SIMULATOR'
  | 'R748_DIFF'
  | 'R749_BOARD';

export const RC92GuardianWarRoomViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RC92SubTab>('OVERVIEW');

  const navItems: { id: RC92SubTab; label: string; code: string; icon: any }[] = [
    { id: 'OVERVIEW', label: 'Master Command', code: 'R750', icon: Shield },
    { id: 'R741_REGISTRY', label: 'Policy Registry', code: 'R741', icon: Shield },
    { id: 'R742_EVALUATOR', label: 'Policy Evaluator', code: 'R742', icon: Zap },
    { id: 'R743_COMPILER', label: 'Constitution Compiler', code: 'R743', icon: Cpu },
    { id: 'R744_BUILDGATE', label: 'Build Gate Validator', code: 'R744', icon: Hammer },
    { id: 'R745_RUNTIME', label: 'Runtime Monitor', code: 'R745', icon: Radio },
    { id: 'R746_JOURNAL', label: 'Exception Journal', code: 'R746', icon: FileText },
    { id: 'R747_SIMULATOR', label: 'Policy Simulator', code: 'R747', icon: FlaskConical },
    { id: 'R748_DIFF', label: 'Constitution Diff', code: 'R748', icon: GitCompare },
    { id: 'R749_BOARD', label: 'Governance Board', code: 'R749', icon: Award }
  ];

  return (
    <div id="rc92-guardian-war-room" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Shield className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">RC92 Sovereign Suite</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full border border-emerald-500/30 font-bold">MANIFEST v7.0.0-RC92</span>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-mono rounded-full border border-purple-500/30 font-bold">HERMES: DORMANT_SAFE</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">RC92 Guardian Policy & Constitution War Room</h1>
            <p className="text-sm text-slate-400">Komando terpadu Guardian Policy Engine, Compiler Konstitusi, dan Validator Build Gate (R741–R750).</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 font-mono text-xs text-emerald-400 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>FOUNDER VERIFICATION REQUIRED</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {item.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render */}
      <div>
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Overview Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase">Policy Registry (R741)</span>
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">12 Codified Rules</div>
                <p className="text-xs text-slate-500 font-sans">Enforcing Ring-0, RBAC, Recovery, Offline, Intelligence, and SSoT.</p>
                <button 
                  onClick={() => setActiveTab('R741_REGISTRY')}
                  className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline pt-2 block"
                >
                  Explore Registry →
                </button>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase">Constitution Compiler (R743)</span>
                  <Cpu className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">7 Machine Rules</div>
                <p className="text-xs text-slate-500 font-sans">Deterministic conversion from human constitution articles into executable validator logic.</p>
                <button 
                  onClick={() => setActiveTab('R743_COMPILER')}
                  className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold hover:underline pt-2 block"
                >
                  View Compiler Bytecode →
                </button>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase">Build Gate Validator (R744)</span>
                  <Hammer className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">100% Gate Passed</div>
                <p className="text-xs text-slate-500 font-sans">5 core checks: RBAC, Guardian Ring-0, SSoT, Contract, and Recovery.</p>
                <button 
                  onClick={() => setActiveTab('R744_BUILDGATE')}
                  className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold hover:underline pt-2 block"
                >
                  Run Gate Verification →
                </button>
              </div>
            </div>

            {/* Comprehensive R741–R750 Validation Matrix */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">RC92 10-Point Architectural Verification Matrix</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  ALL PASS (10/10)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { code: 'R741', title: 'Guardian Policy Registry', detail: 'SSoT repository covering Security, RBAC, Recovery, Offline, Intelligence, Governance.' },
                  { code: 'R742', title: 'Policy Evaluation Engine', detail: 'Deterministic evaluation yielding PASS, WARNING, BLOCKED with zero false positives.' },
                  { code: 'R743', title: 'Constitution Compiler', detail: 'Translates legal constitution articles into machine validation rules.' },
                  { code: 'R744', title: 'Build Gate Validator', detail: 'Pre-build barrier across RBAC, Guardian, SSoT, Contract, Recovery; blocks build on failure.' },
                  { code: 'R745', title: 'Runtime Policy Monitor', detail: 'Non-mutating continuous observer and alerting daemon.' },
                  { code: 'R746', title: 'Guardian Exception Journal', detail: 'Immutable append-only cryptographic ledger with chained hash integrity.' },
                  { code: 'R747', title: 'Policy Simulator', detail: 'Air-gapped sandbox testing policy changes and breach blast radius safely.' },
                  { code: 'R748', title: 'Constitution Diff Viewer', detail: 'Comparative diff engine tracking legal amendments across sprint releases.' },
                  { code: 'R749', title: 'Sovereign Governance Board', detail: 'Executive compliance score, blocked rule metrics, and intervention history.' },
                  { code: 'R750', title: 'Guardian Master War Room', detail: 'Unified orchestrator linking DISC-741 through DISC-750 under Manifest v7.0.0-RC92.' }
                ].map(item => (
                  <div key={item.code} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-800 dark:text-slate-200">
                          {item.code}
                        </span>
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Live Board Preview */}
            <SovereignGovernanceBoardViewer />
          </div>
        )}

        {activeTab === 'R741_REGISTRY' && <GuardianPolicyRegistryViewer />}
        {activeTab === 'R742_EVALUATOR' && <PolicyEvaluationViewer />}
        {activeTab === 'R743_COMPILER' && <ConstitutionCompilerViewer />}
        {activeTab === 'R744_BUILDGATE' && <BuildGateValidatorViewer />}
        {activeTab === 'R745_RUNTIME' && <RuntimePolicyMonitorViewer />}
        {activeTab === 'R746_JOURNAL' && <GuardianExceptionJournalViewer />}
        {activeTab === 'R747_SIMULATOR' && <PolicySimulatorViewer />}
        {activeTab === 'R748_DIFF' && <ConstitutionDiffViewer />}
        {activeTab === 'R749_BOARD' && <SovereignGovernanceBoardViewer />}
      </div>
    </div>
  );
};
