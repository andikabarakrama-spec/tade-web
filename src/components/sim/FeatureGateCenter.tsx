import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
  Layers,
  Award
} from 'lucide-react';

export interface FeatureGateItem {
  id: string;
  name: string;
  category: 'AI_CREATIVE' | 'MARKETPLACE' | 'MIGRATION' | 'GOVERNANCE' | 'SECURITY';
  status: 'GREEN_ACTIVE' | 'YELLOW_PILOT' | 'RED_HELD';
  pioneerSchoolOnly: boolean;
  rolloutPercentage: number;
  description: string;
}

const INITIAL_GATES: FeatureGateItem[] = [
  {
    id: 'GATE-001',
    name: 'Asy Creative Intelligence (Studio Grafis)',
    category: 'AI_CREATIVE',
    status: 'YELLOW_PILOT',
    pioneerSchoolOnly: true,
    rolloutPercentage: 10,
    description: 'Generator otomatis prompt banner 3D, brosur, sertifikat, dan Instagram story.'
  },
  {
    id: 'GATE-002',
    name: 'TADE Multi-Tenant Marketplace',
    category: 'MARKETPLACE',
    status: 'GREEN_ACTIVE',
    pioneerSchoolOnly: false,
    rolloutPercentage: 100,
    description: 'Pusat unduhan template sertifikat nusantara, RAB, LPJ, dan banner siap pakai.'
  },
  {
    id: 'GATE-003',
    name: 'Auto Migration & Excel Import Engine',
    category: 'MIGRATION',
    status: 'YELLOW_PILOT',
    pioneerSchoolOnly: true,
    rolloutPercentage: 25,
    description: 'Alat bantu migrasi santri & pembayaran massal dari spreadsheet dengan auto-mapping AI Asy.'
  },
  {
    id: 'GATE-004',
    name: 'Customer Success AI & Interactive Onboarding',
    category: 'AI_CREATIVE',
    status: 'GREEN_ACTIVE',
    pioneerSchoolOnly: false,
    rolloutPercentage: 100,
    description: 'Checklist interaktif dan video pemandu ramah anak untuk admin sekolah baru.'
  },
  {
    id: 'GATE-005',
    name: 'Air-Gapped Sovereign Root Envelope (R140)',
    category: 'SECURITY',
    status: 'GREEN_ACTIVE',
    pioneerSchoolOnly: false,
    rolloutPercentage: 100,
    description: 'Protokol pemulihan darurat satu kali pakai eksklusif Founder.'
  },
  {
    id: 'GATE-006',
    name: 'Experimental WebAssembly Vision OCR',
    category: 'AI_CREATIVE',
    status: 'RED_HELD',
    pioneerSchoolOnly: false,
    rolloutPercentage: 0,
    description: 'Ekstraksi otomatis foto bukti transfer rekening fisik (ditahan untuk evaluasi performa).'
  }
];

export const FeatureGateCenter: React.FC = () => {
  const [gates, setGates] = useState<FeatureGateItem[]>(INITIAL_GATES);
  const [pioneerSchool] = useState('TK Islam Asy-Syifa (Pusat)');

  const handleToggleStatus = (id: string, newStatus: FeatureGateItem['status']) => {
    setGates((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
    );
  };

  const getStatusBadge = (status: FeatureGateItem['status']) => {
    switch (status) {
      case 'GREEN_ACTIVE':
        return {
          label: 'HIJAU • AKTIF FLEET',
          classes: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
        };
      case 'YELLOW_PILOT':
        return {
          label: 'KUNING • PILOT (PIONEER)',
          classes: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        };
      case 'RED_HELD':
        return {
          label: 'MERAH • DITAHAN (HELD)',
          classes: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg">
                <Sliders className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    MODULE R144
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    PIONEER ROLLOUT ENGINE
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Feature Gate System & Pioneer School Program
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Kontrol rilis fitur bertahap (Hijau = Rilis Penuh, Kuning = Uji Coba Pioneer, Merah = Ditahan). Sekolah perintis <strong className="text-purple-300">{pioneerSchool}</strong> menjadi garda terdepan sebelum pembaruan disebarkan ke tenant lain.
            </p>
          </div>
        </div>
      </div>

      {/* Pioneer School Banner */}
      <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">Pioneer School: {pioneerSchool}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                PILOT TESTBED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Fitur berstatus Kuning (Pilot) hanya aktif pada institusi perintis ini untuk validasi kestabilan nyata.
            </p>
          </div>
        </div>
      </div>

      {/* Gates Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Daftar Feature Gates & Target Rollout</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">
            {gates.length} Fitur Terdaftar
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {gates.map((g) => {
            const badge = getStatusBadge(g.status);
            return (
              <div key={g.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{g.name}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono border ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {g.description}
                  </p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono pt-1">
                    <span>ID: {g.id}</span>
                    <span>•</span>
                    <span>Rollout Fleet: {g.rolloutPercentage}%</span>
                    <span>•</span>
                    <span>{g.pioneerSchoolOnly ? 'Target: Pioneer School Only' : 'Target: All Tenants'}</span>
                  </div>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(g.id, 'GREEN_ACTIVE')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      g.status === 'GREEN_ACTIVE'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Hijau (Aktif)
                  </button>
                  <button
                    onClick={() => handleToggleStatus(g.id, 'YELLOW_PILOT')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      g.status === 'YELLOW_PILOT'
                        ? 'bg-amber-600 text-white border-amber-600 shadow'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Kuning (Pilot)
                  </button>
                  <button
                    onClick={() => handleToggleStatus(g.id, 'RED_HELD')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      g.status === 'RED_HELD'
                        ? 'bg-red-600 text-white border-red-600 shadow'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Merah (Tahan)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
