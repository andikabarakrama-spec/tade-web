import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Radio,
  Clock,
  Layers,
  Sparkles,
  Flame,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Lock,
  ArrowRight,
  Crosshair
} from 'lucide-react';
import { NationalThreatMap } from './NationalThreatMap';
import { MultiVectorIncidentEngine } from './MultiVectorIncidentEngine';
import { GuardianRespawnCenter } from './GuardianRespawnCenter';
import { GuardianReinforcementCenter } from './GuardianReinforcementCenter';
import { OperationalContinuityMatrix } from './OperationalContinuityMatrix';
import { GuardianCoordinationTimeline } from './GuardianCoordinationTimeline';

export interface ActiveIncident {
  id: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sector: string;
  assignedGuardian: string;
  aiAdvisor: string;
  status: 'CONTAINED' | 'MITIGATING' | 'MONITORING';
  quarantineLane: string;
}

export const GuardianBattlefieldOrchestrator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'COMMAND_BOARD' | 'THREAT_MAP' | 'MULTI_VECTOR' | 'CONTINUITY_MATRIX' | 'RESPAWN' | 'REINFORCEMENT' | 'TIMELINE'
  >('COMMAND_BOARD');

  const activeIncidents: ActiveIncident[] = [
    {
      id: 'INC-2026-0814-A',
      name: 'Simulasi Lonjakan Pendaftaran PPDB Gelombang II',
      severity: 'MEDIUM',
      sector: 'Gate Penerimaan Siswa',
      assignedGuardian: 'Guardian Resilient Storage & Intake Gate',
      aiAdvisor: 'Dr. Asy-Intelligence (AI Intelligence Minister)',
      status: 'MITIGATING',
      quarantineLane: 'Lane #03 (PPDB Intake Buffer)'
    },
    {
      id: 'INC-2026-0814-B',
      name: 'Verifikasi Anti-Double Spend SPP Kasir (H0-01 Lock)',
      severity: 'LOW',
      sector: 'Financial Core (FIND-08-R4)',
      assignedGuardian: 'Guardian Financial Invariant Engine',
      aiAdvisor: 'Akunt. Asy-Finance (AI Finance Minister)',
      status: 'CONTAINED',
      quarantineLane: 'Lane #02 (Secure Financial Vault)'
    },
    {
      id: 'INC-2026-0814-C',
      name: 'Penyaringan Honey Shield Bot Crawler Edge Ingress',
      severity: 'LOW',
      sector: 'Edge & Network Bastion',
      assignedGuardian: 'Guardian DDoS & Honey Shield',
      aiAdvisor: 'Insp. Asy-Monitoring (AI Monitoring Minister)',
      status: 'MONITORING',
      quarantineLane: 'Lane #01 (Edge Firewall)'
    }
  ];

  return (
    <div id="guardian-battlefield-orchestrator" className="space-y-6">
      {/* Top Level Strategic Header */}
      <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
              <Crosshair className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  RC8 Battlefield Orchestrator
                </span>
                <span className="text-xs text-slate-400 font-medium">| Konstitusi TADE v3.2</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 mt-1 tracking-tight">
                Pusat Komando Medan Pertempuran Guardian (Battlefield)
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Koordinasi taktis multi-insiden secara simultan di bawah pengawasan Super Admin. Seluruh operasi bersifat Read-Only atau Terisolasi dalam Sandbox tanpa risiko modifikasi data produksi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <Crown className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-medium">Otoritas Tertinggi</div>
              <div className="text-xs font-black text-slate-200">SUPER ADMIN (Human Sign-off)</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'COMMAND_BOARD', label: 'Papan Komando (Overview)', icon: Crosshair },
            { id: 'THREAT_MAP', label: 'Peta Ancaman Sektoral', icon: Radio },
            { id: 'MULTI_VECTOR', label: 'Engine 5 Gelombang Multivektor', icon: Flame },
            { id: 'CONTINUITY_MATRIX', label: 'Matriks Kontinuitas Operasional', icon: Layers },
            { id: 'RESPAWN', label: 'Siklus Respawn 6-Langkah', icon: RotateCcw },
            { id: 'REINFORCEMENT', label: 'Pusat Penguatan (Hardening)', icon: Sparkles },
            { id: 'TIMELINE', label: 'Kronologi Koordinasi', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[40px] cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-teal-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: COMMAND BOARD OVERVIEW */}
      {activeTab === 'COMMAND_BOARD' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Insiden Aktif Ditangani</div>
              <div className="text-2xl font-black text-slate-900 mt-1">3 Kasus</div>
              <div className="text-[11px] text-teal-600 font-semibold mt-1">100% Terkarantina Aman</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Status Kontinuitas Sistem</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">100.0%</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">Zero Single Point of Failure</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Integritas Keuangan (FIND-08)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">Rp 0 Drift</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">H0-01 Lock Aktif</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Kondisi Data Produksi</div>
              <div className="text-2xl font-black text-teal-600 mt-1">Read-Only</div>
              <div className="text-[11px] text-teal-600 font-semibold mt-1">Sandbox Proteksi Total</div>
            </div>
          </div>

          {/* Active Incidents Board */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Papan Insiden Aktif & Penugasan Pasukan Guardian
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Setiap insiden dipetakan ke Guardian pertahanan dan Menteri AI terkait dalam jalur terisolasi
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Triple Verification Active
              </span>
            </div>

            <div className="space-y-3">
              {activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                        {inc.id}
                      </span>
                      <span className="text-xs font-black uppercase text-stone-900">{inc.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        {inc.severity} SEVERITY
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-stone-400 block text-[10px]">Guardian Penanggung Jawab:</span>
                      <span className="font-bold text-slate-800">{inc.assignedGuardian}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-stone-400 block text-[10px]">Penasihat Intelijen AI Asy:</span>
                      <span className="font-bold text-teal-700">{inc.aiAdvisor}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                      <span className="text-stone-400 block text-[10px]">Jalur Karantina Terisolasi:</span>
                      <span className="font-mono font-bold text-slate-700">{inc.quarantineLane}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combined Preview Panels: Threat Map & Continuity Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-teal-600" />
                    <h4 className="text-sm font-bold text-stone-900">Peta Ancaman Sektoral Ringkas</h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('THREAT_MAP')}
                    className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Buka Peta Lengkap <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Semua 7 sektor (Firestore, Auth, DDoS, Voice, Docs, Payments, PPDB) berada dalam postur DEFCON 5 (Green).
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
                <span>Status Postur Nasional:</span>
                <span className="font-bold text-emerald-600">DEFCON 5 — AMAN</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <h4 className="text-sm font-bold text-stone-900">Matriks Kontinuitas Lintas Jalur</h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('CONTINUITY_MATRIX')}
                    className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Buka Matriks <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Jalur pemrosesan SPP Kasir, e-Rapor, dan Presensi Kelas beroperasi 100% independen tanpa saling membebani.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
                <span>Toleransi Kegagalan (Fault-Tolerance):</span>
                <span className="font-bold text-teal-600">Zero Single Point of Failure</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NATIONAL THREAT MAP */}
      {activeTab === 'THREAT_MAP' && <NationalThreatMap />}

      {/* TAB CONTENT: MULTI-VECTOR INCIDENT ENGINE */}
      {activeTab === 'MULTI_VECTOR' && <MultiVectorIncidentEngine />}

      {/* TAB CONTENT: OPERATIONAL CONTINUITY MATRIX */}
      {activeTab === 'CONTINUITY_MATRIX' && <OperationalContinuityMatrix />}

      {/* TAB CONTENT: GUARDIAN RESPAWN SYSTEM */}
      {activeTab === 'RESPAWN' && <GuardianRespawnCenter />}

      {/* TAB CONTENT: GUARDIAN REINFORCEMENT CENTER */}
      {activeTab === 'REINFORCEMENT' && <GuardianReinforcementCenter />}

      {/* TAB CONTENT: COORDINATION TIMELINE */}
      {activeTab === 'TIMELINE' && <GuardianCoordinationTimeline />}
    </div>
  );
};
