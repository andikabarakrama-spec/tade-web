import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  Fingerprint,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Users,
  Terminal,
  Activity,
  Zap,
  Server,
  EyeOff,
  UserX
} from 'lucide-react';
import { TrustedDeviceVault } from './TrustedDeviceVault';
import { RootEvidenceVault } from './RootEvidenceVault';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const RootGuardianCenter: React.FC<Props> = ({ onSelectModule }) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'devices' | 'evidence' | 'integrity'>('policy');

  // Hardcoded immutable constitution checks
  const constitutionRules = [
    {
      id: 'RULE-ROOT-01',
      title: 'Monolithic Sovereign Root Limit',
      description: 'Hanya ada 1 Super Admin Global di seluruh arsitektur TADE. Tombol Create Super Admin dan Promote to Super Admin secara permanen dinonaktifkan di tingkat runtime.',
      status: 'ENFORCED',
      violationCount: 0,
      icon: <Lock className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'RULE-ROOT-02',
      title: 'Import User Root Immunity',
      description: 'Fitur bulk import pengguna dari CSV/Excel dilarang keras membuat entitas berizin SUPER_ADMIN atau mengubah atribusi root.',
      status: 'ENFORCED',
      violationCount: 0,
      icon: <Users className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'RULE-ROOT-03',
      title: 'Restore Backup Immutability Bypass',
      description: 'Operasi snapshot restore database tidak pernah menimpa catatan identitas Sovereign Root. Kredensial dan enclave root kebal dari rollback.',
      status: 'ENFORCED',
      violationCount: 0,
      icon: <Database className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'RULE-ROOT-04',
      title: 'Real-time Guardian Intrusion Sentinel',
      description: 'Mendeteksi dan memblokir login anomali, serangan brute-force, token invalid, modifikasi peran RBAC tidak sah, dan perangkat tak terdaftar.',
      status: 'ENFORCED',
      violationCount: 4,
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-red-500" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                    MODULE R131
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    DEFCON 1 IMMUTABLE
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Sovereign Root & Guardian Security Vault
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Pusat kedaulatan keamanan tertinggi TADE Constitution v11.0. Menjaga 1 Root Global tunggal, mengunci pendaftaran hak akses istimewa, dan mencatat setiap telemetri perangkat dalam Brankas Bukti Kriptografis.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">GLOBAL SOVEREIGN ROOT</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">1 Entitas Terkunci (Fixed)</span>
              <span className="text-[10px] text-slate-500 block">No Sub-Root / No Elevation</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'policy', label: 'Konstitusi & Kebijakan Root', icon: Lock },
            { id: 'devices', label: 'Perangkat FIDO2 / Passkey', icon: KeyRound },
            { id: 'evidence', label: 'Brankas Bukti Kriptografis', icon: FileText },
            { id: 'integrity', label: 'Radar Pertahanan Sentinel', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500'
                    : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Policy */}
      {activeTab === 'policy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {constitutionRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {rule.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{rule.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{rule.id}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rule.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Pelanggaran Terdeteksi:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{rule.violationCount} Insiden</span>
                </div>
              </div>
            ))}
          </div>

          {/* Hard Protection Badges */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
            <h4 className="font-bold text-sm mb-3 flex items-center space-x-2 text-slate-200">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Proteksi Eksekusi Kode Tingkat Runtime (Hard-Locked)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-red-400 font-bold mb-1">
                  <UserX className="w-4 h-4" />
                  <span>No Create Super Admin</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Fungsi API pembuat Super Admin dihapus dari codebase. Hanya 1 root akun master tetap.
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-red-400 font-bold mb-1">
                  <EyeOff className="w-4 h-4" />
                  <span>No Role Promotion to Root</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  RBAC tidak menerima mutasi role 'SUPER_ADMIN' dari endpoint manapun selain otentikasi awal root.
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
                  <Database className="w-4 h-4" />
                  <span>No Restore Overwrite</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recovery snapshot mengecualikan metadata root untuk mencegah pembajakan akun melalui file backup.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Devices */}
      {activeTab === 'devices' && <TrustedDeviceVault />}

      {/* Tab 3: Evidence Vault */}
      {activeTab === 'evidence' && <RootEvidenceVault />}

      {/* Tab 4: Integrity Sentinel */}
      {activeTab === 'integrity' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Live Ingress Sentinel Radar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pemindaian lalu lintas masuk untuk mendeteksi anomali pada identitas Sovereign Root</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              RADAR ACTIVE: 100% INGRESS FILTERED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Total Ingress Scanned</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">48,920 Req</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">Zero Delay (12ms)</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Blocked Brute Vectors</span>
              <span className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-1 block">142 Probes</span>
              <span className="text-[10px] text-slate-400 mt-1 block">All IP Blacklisted</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Passkey Handshakes</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">99.98%</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Hardware Attested</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Root Account State</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">SOVEREIGN</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Single Root Certified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
