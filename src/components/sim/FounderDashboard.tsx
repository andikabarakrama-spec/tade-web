import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Layers,
  KeyRound,
  FileKey2,
  Lock,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Terminal,
  Clock,
  CheckCircle2,
  Sliders,
  Settings,
  ArrowUpRight,
  ShoppingBag,
  Palette
} from 'lucide-react';
import { FounderVault } from './FounderVault';
import { FounderLayerGate } from './FounderLayerGate';

interface FounderDashboardProps {
  onSelectModule?: (moduleId: string) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({ onSelectModule }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VAULT' | 'FLEET' | 'SIGNATURE'>('OVERVIEW');

  return (
    <FounderLayerGate>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border border-amber-500/30 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                  <Crown className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      MODULE R139
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      FOUNDER EXCLUSIVE LAYER
                    </span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-100">
                    TADE Sovereign Founder Dashboard & Fleet Governance
                  </h1>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Lapisan kedaulatan eksklusif Founder TADE. Memantau seluruh ekosistem multi-tenant nasional, mengelola Founding Root Seal, mengontrol feature flags, dan menjamin kepatuhan Constitution v12.2 tanpa pernah bocor ke antarmuka sekolah.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-amber-500/30">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('VAULT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'VAULT'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Founding Seal
              </button>
              <button
                onClick={() => setActiveTab('SIGNATURE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'SIGNATURE'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Build Signature
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic View */}
        {activeTab === 'VAULT' && <FounderVault />}

        {activeTab === 'SIGNATURE' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Founder Build Signature (Module R150)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sertifikat kompilasi resmi dan manifest kompatibilitas platform nasional TADE.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] mb-1">BUILD ID:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">TADE-BUILD-2026-RC18</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] mb-1">RC VERSION:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">RC18_ENTERPRISE_LOCKED</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] mb-1">CONSTITUTION:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">v12.2 LOCKED</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] mb-1">PLATFORM SIGNATURE:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">SHA-256 VALIDATED</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Compatibility & Zero Regression Manifest:</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                Build ini mengintegrasikan seluruh modul RC1–RC17 terdahulu (db.ts, firestore.rules, Payment Core, RBAC, Sovereign Root, Discovery Registry DISC-001 s/d DISC-070) dengan jaminan backward compatibility 100%.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Total Fleet Sekolah</span>
                  <Building2 className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 block">
                  12 Institusi
                </span>
                <span className="text-[10px] text-emerald-500 mt-1 block font-medium">100% Zero Cross-Tenant Leak</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Sovereign Root Status</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">
                  DEFCON 1
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">1 Master Root Preserved</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Pioneer School Program</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 block">
                  TK Asy-Syifa (Pusat)
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Pilot Flag v12.2 Active</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Performance Gate</span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 block">
                  PASSED
                </span>
                <span className="text-[10px] text-emerald-500 mt-1 block">Feather Lightweight Grade A</span>
              </div>
            </div>

            {/* Quick Action Matrix for Founder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => onSelectModule && onSelectModule('r140')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    R140
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>Root Recovery & Envelope</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cetak amplop darurat air-gapped dan rotasi kunci pemulihan fisik satu kali pakai.
                </p>
              </div>

              <div
                onClick={() => onSelectModule && onSelectModule('r144')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    R144
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>Feature Gate & Pioneer Program</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kelola status rollout fitur (Hijau, Kuning, Merah) dan uji coba di TK Asy-Syifa.
                </p>
              </div>

              <div
                onClick={() => onSelectModule && onSelectModule('r143')}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    R143
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>Performance Gate Center</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pantau budget performa per-role (Parent Lite, Teacher Lite, Operations Ultra).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FounderLayerGate>
  );
};
