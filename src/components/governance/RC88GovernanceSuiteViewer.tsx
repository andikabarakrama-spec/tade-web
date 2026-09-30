import React, { useState } from 'react';
import { 
  Activity, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Lock, 
  Cpu, 
  CheckCircle2,
  HardDrive,
  Sliders,
  Terminal,
  Gauge
} from 'lucide-react';
import { OperationalHealthViewer } from './OperationalHealthViewer';
import { FounderVerificationCenterViewer } from './FounderVerificationCenterViewer';
import { GuardianIntegrityScannerViewer } from './GuardianIntegrityScannerViewer';
import { ExecutiveGovernanceJournalViewer } from './ExecutiveGovernanceJournalViewer';

export const RC88GovernanceSuiteViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'health' | 'founder_verification' | 'integrity_drift' | 'decisions_knowledge'>('overview');

  const subTabs = [
    { id: 'overview', label: 'RC88 Governance Overview', icon: Layers, badge: 'R710' },
    { id: 'health', label: 'Health & Recovery Telemetry', icon: Activity, badge: 'R701, R704, R709' },
    { id: 'founder_verification', label: 'Founder Verification Center', icon: Award, badge: 'R702' },
    { id: 'integrity_drift', label: 'Guardian Integrity & Drift', icon: ShieldCheck, badge: 'R703, R705' },
    { id: 'decisions_knowledge', label: 'Decisions & Knowledge Ledger', icon: BookOpen, badge: 'R706, R707, R708' },
  ];

  return (
    <div className="space-y-6" id="rc88-governance-suite-viewer">
      {/* Sub-tab Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap gap-2 shadow-lg">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-950/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
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
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    RC88 Operational Intelligence
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    Manifest v6.6.0-RC88
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  RC88 Operational Intelligence & Governance War Room
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Pusat kedaulatan observabilitas, verifikasi kelayakan Founder, pemindaian integritas arsitektur, kesiapan disaster recovery, dan tata kelola pengetahuan TK Asy-Syifa Digital Ecosystem.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Hermes: DORMANT_SAFE (Zero Prod Mutation)
                </span>
              </div>
            </div>
          </div>

          {/* 10-Point Governance Architecture Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R701 &bull; Health Center</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Operational Health Center</div>
              <p className="text-xs text-slate-400">Pemeriksaan komprehensif build status, tipe tsc, Guardian, dan konektivitas SSoT.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R702 &bull; Verification</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Founder Verification Center</div>
              <p className="text-xs text-slate-400">9 checklist kelayakan teknis dan pengesahan kedaulatan formal oleh Founder.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R703 &bull; Scanner</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Guardian Integrity Scanner</div>
              <p className="text-xs text-slate-400">Deteksi struktural bebas duplikasi service, registry, bus, dan auth leaks (Report-Only).</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R704 &bull; Disaster Recovery</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Recovery Readiness Dashboard</div>
              <p className="text-xs text-slate-400">Pemantauan artefak backup, RTO (~2s), RPO (0s), dan ketiadaan celah fatal data loss.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R705 &bull; Drift Audit</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Configuration Drift Detector</div>
              <p className="text-xs text-slate-400">Perbandingan 4 lingkup konfigurasi terhadap baseline emas tanpa mutasi otomatis.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R706 &bull; Decisions</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Executive Decision Journal</div>
              <p className="text-xs text-slate-400">Buku kasus keputusan strategis append-only dengan tanda tangan kriptografis.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R707 &bull; Knowledge Vault</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Knowledge Evolution Tracker</div>
              <p className="text-xs text-slate-400">Pelacakan fase ide (CORE, RESERVED, EXPERIMENTAL, REJECTED) dan justifikasi doktrin.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R708 &bull; Audit Trail</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Founder Command History</div>
              <p className="text-xs text-slate-400">Histori perintah operasional Founder yang searchable, filterable, dan immutable.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R709 &bull; Zero-Cost Telemetry</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Performance Observation Engine</div>
              <p className="text-xs text-slate-400">Observasi lokal render cost, heap memory, bundle chunks, dan load latency.</p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'health' && <OperationalHealthViewer />}
      {activeSubTab === 'founder_verification' && <FounderVerificationCenterViewer />}
      {activeSubTab === 'integrity_drift' && <GuardianIntegrityScannerViewer />}
      {activeSubTab === 'decisions_knowledge' && <ExecutiveGovernanceJournalViewer />}
    </div>
  );
};
