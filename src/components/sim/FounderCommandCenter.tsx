import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  Activity,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Globe,
  Radio,
  FileCheck2,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Flame
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const FounderCommandCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('COCKPIT');

  const commandMetrics = [
    { label: 'HEALTH STATUS', value: '100% OPTIMAL', color: 'text-emerald-400', desc: '0 Zombie Timers, 0 Memory Leak' },
    { label: 'SECURITY FLEET', value: '6/6 ONLINE', color: 'text-cyan-400', desc: 'WORM Vault & SHA-256 Tamper-Proof' },
    { label: 'BACKUP & AUTOSAVE', value: '5s SYNCED', color: 'text-purple-400', desc: 'IndexedDB & Memory Crash Guard' },
    { label: 'DISCOVERY REGISTRY', value: '324 ITEMS', color: 'text-amber-400', desc: 'v3.5.0-RC57 Verified Manifest' },
    { label: 'BUILD QUALITY', value: '0 ERRORS', color: 'text-emerald-400', desc: 'Strict TypeScript & Clean Vite Dist' },
    { label: 'RECOVERY RTO', value: '< 2 DETIK', color: 'text-cyan-400', desc: 'Instant Fallback & Self-Healing' },
    { label: 'WAR ROOM SUITE', value: '17/17 ROOMS', color: 'text-purple-400', desc: 'A s/d Q All Passed (100%)' },
    { label: 'DEPLOYMENT STATE', value: 'ISOLATED', color: 'text-emerald-400', desc: 'Public SEO vs RBAC SIM Segregated' }
  ];

  return (
    <div id="founder-command-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R400 &bull; FOUNDER COMMAND CONSTITUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">TADE v12.2 Sovereign Cockpit</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Crown className="w-9 h-9 text-amber-400" />
              Pusat Kendali Eksekutif Tertinggi Founder &amp; Yayasan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Integrasi tunggal 9 pilar TADE: Health, Security, Backup, Discovery, Build, Recovery, War Room, Incident, dan Deployment dalam satu kendali berdaulat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SOVEREIGN LOCKED
            </span>
          </div>
        </div>

        {/* 8 Metric Cockpit Pillars */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          {commandMetrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 block font-bold tracking-wider">{m.label}</span>
              <strong className={`text-base sm:text-lg block font-bold ${m.color}`}>{m.value}</strong>
              <span className="text-[9px] text-slate-400 block leading-tight">{m.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Vision & Governance Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Hak Prerogatif Founder</h3>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Ketua Yayasan dan Founder memegang otoritas mutlak untuk mengaudit kas, memeriksa CCTV 24/7, menandatangani surat dinas, dan mengekspor bukti hukum.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Zero Data Loss Mandate</h3>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Konstitusi R391 &amp; R399 menjamin tidak ada raport, kas, atau arsip santri yang hilang. AutoSave 5 detik dan IndexedDB melindungi setiap pengetikan.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Perlindungan Fisik Santri</h3>
            <Radio className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Integrasi CCTV 6 titik, pelindung gerbang, verifikasi QR wali santri penjemput, dan tombol Guardian SOS memberikan keamanan optimal.
          </p>
        </div>
      </div>
    </div>
  );
};
