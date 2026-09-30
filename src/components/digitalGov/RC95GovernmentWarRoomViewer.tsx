import React, { useState } from 'react';
import { 
  Building2, 
  Scale, 
  Stamp, 
  BookLock, 
  GitCommit, 
  Crown, 
  AlertOctagon, 
  CheckSquare, 
  Search, 
  ShieldCheck, 
  Sliders,
  Sparkles,
  Layers,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { ConstitutionalPolicyEngineViewer } from './ConstitutionalPolicyEngineViewer';
import { DigitalSignatureReadinessViewer } from './DigitalSignatureReadinessViewer';
import { ImmutableGovernanceJournalViewer } from './ImmutableGovernanceJournalViewer';
import { CrossModuleAuditCorrelationViewer } from './CrossModuleAuditCorrelationViewer';
import { FounderDecisionLedgerViewer } from './FounderDecisionLedgerViewer';
import { GovernmentOperationsDashboardViewer } from './GovernmentOperationsDashboardViewer';
import { ConstitutionalConflictDetectorViewer } from './ConstitutionalConflictDetectorViewer';
import { InstitutionalApprovalWorkflowViewer } from './InstitutionalApprovalWorkflowViewer';
import { GovernanceEvidenceExplorerViewer } from './GovernanceEvidenceExplorerViewer';

export type GovWarRoomSubTab = 
  | 'OVERVIEW'
  | 'POLICIES'
  | 'SIGNATURES'
  | 'JOURNAL'
  | 'AUDIT'
  | 'DECISIONS'
  | 'CONFLICTS'
  | 'APPROVALS'
  | 'EVIDENCE';

export const RC95GovernmentWarRoomViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<GovWarRoomSubTab>('OVERVIEW');

  const navigationItems = [
    { id: 'OVERVIEW' as const, label: 'Dashboard Eksekutif', code: 'R776', icon: Building2 },
    { id: 'POLICIES' as const, label: 'Mesin Kebijakan', code: 'R771', icon: Scale },
    { id: 'SIGNATURES' as const, label: 'Tanda Tangan Resmi', code: 'R772', icon: Stamp },
    { id: 'JOURNAL' as const, label: 'Jurnal Permanen', code: 'R773', icon: BookLock },
    { id: 'AUDIT' as const, label: 'Korelasi Audit', code: 'R774', icon: GitCommit },
    { id: 'DECISIONS' as const, label: 'Buku Keputusan', code: 'R775', icon: Crown },
    { id: 'CONFLICTS' as const, label: 'Detektor Konflik', code: 'R777', icon: AlertOctagon },
    { id: 'APPROVALS' as const, label: 'Alur Persetujuan', code: 'R778', icon: CheckSquare },
    { id: 'EVIDENCE' as const, label: 'Pencari Bukti', code: 'R779', icon: Search }
  ];

  return (
    <div id="r780-rc95-government-war-room" className="space-y-6">
      {/* Master Hub Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold font-mono border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> TADE RC95 • DIGITAL GOVERNMENT FOUNDATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              RC95 Government War Room (R780)
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl">
              Pusat orkestrasi fondasi pemerintahan digital berdaulat: kepatuhan kebijakan, stempel resmi berjenjang, jurnal anti-overwrite, korelasi audit, buku keputusan Founder, dan investigasi bukti.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Manifest Target</p>
              <p className="text-xs font-extrabold text-emerald-400 font-mono">v7.3.0-RC95</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Governed Modules</p>
              <p className="text-xl font-black text-indigo-300 font-mono">R771 – R780</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-stone-500'}`} />
              <span>{item.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                isActive ? 'bg-slate-800 text-indigo-300' : 'bg-stone-100 text-stone-500'
              }`}>
                {item.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-module Container */}
      <div className="transition-all duration-150">
        {activeSubTab === 'OVERVIEW' && <GovernmentOperationsDashboardViewer />}
        {activeSubTab === 'POLICIES' && <ConstitutionalPolicyEngineViewer />}
        {activeSubTab === 'SIGNATURES' && <DigitalSignatureReadinessViewer />}
        {activeSubTab === 'JOURNAL' && <ImmutableGovernanceJournalViewer />}
        {activeSubTab === 'AUDIT' && <CrossModuleAuditCorrelationViewer />}
        {activeSubTab === 'DECISIONS' && <FounderDecisionLedgerViewer />}
        {activeSubTab === 'CONFLICTS' && <ConstitutionalConflictDetectorViewer />}
        {activeSubTab === 'APPROVALS' && <InstitutionalApprovalWorkflowViewer />}
        {activeSubTab === 'EVIDENCE' && <GovernanceEvidenceExplorerViewer />}
      </div>
    </div>
  );
};
