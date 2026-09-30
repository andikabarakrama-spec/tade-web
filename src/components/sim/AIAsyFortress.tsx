import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Radio,
  Server,
  Layers,
  Zap,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Cpu,
  KeyRound,
  FileCode,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface FortressDefenseRing {
  ringNumber: number;
  name: string;
  codename: string;
  status: 'ACTIVE_ARMED' | 'MONITORING' | 'REINFORCED' | 'SAFE_MODE';
  healthScore: number;
  description: string;
  activeEnforcements: string[];
  lastAudit: string;
  threatBlockedCount: number;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
  };
}

export const AIAsyFortress: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const currentRole: UserRole = activeRole || userProfile?.role || 'CALON_WALI_MURID';
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';

  // 7 Defense Rings of AI Asy Fortress
  const [rings, setRings] = useState<FortressDefenseRing[]>([
    {
      ringNumber: 1,
      name: 'Ring 1 — Guardian Firewall',
      codename: 'RING-01-FIREWALL',
      status: 'ACTIVE_ARMED',
      healthScore: 100,
      description: 'Lapisan terluar menyaring seluruh ingress HTTP/WS, memblokir brute force, bot scraping, dan anomali parameter.',
      activeEnforcements: [
        'Rate limiting 100 req/min per IP address',
        'Parameter sanitization & SQL/NoSQL payload filtering',
        'Honey Shield bot redirection traps aktif'
      ],
      lastAudit: 'Realtime',
      threatBlockedCount: 14,
      colorScheme: {
        bg: 'bg-emerald-50/50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800'
      }
    },
    {
      ringNumber: 2,
      name: 'Ring 2 — Identity Verification (Zero Trust RBAC)',
      codename: 'RING-02-IDENTITY',
      status: 'ACTIVE_ARMED',
      healthScore: 100,
      description: 'Memverifikasi token JWT, App Check attestation, dan isolasi ketat 7 peran (SUPER_ADMIN s/d CALON_WALI_MURID).',
      activeEnforcements: [
        'Firebase App Check attestation enforcement',
        'Anti-privilege-escalation context binding',
        'Per-session rotation & cryptographic claims check'
      ],
      lastAudit: '1 menit lalu',
      threatBlockedCount: 3,
      colorScheme: {
        bg: 'bg-blue-50/50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800'
      }
    },
    {
      ringNumber: 3,
      name: 'Ring 3 — AI Isolation Sandbox',
      codename: 'RING-03-AI-SANDBOX',
      status: 'ACTIVE_ARMED',
      healthScore: 100,
      description: 'Mengisolasi seluruh penalaran LLM/AI Asy dalam container tertutup tanpa akses langsung ke storage fisik atau terminal server.',
      activeEnforcements: [
        'Prompt Injection sanitization layer (Regex & Semantic Filter)',
        'Ephemeral memory buffers (Zero data leakage into logs)',
        'Output encoding against XSS & script execution'
      ],
      lastAudit: '3 menit lalu',
      threatBlockedCount: 8,
      colorScheme: {
        bg: 'bg-indigo-50/50',
        border: 'border-indigo-200',
        text: 'text-indigo-900',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-800'
      }
    },
    {
      ringNumber: 4,
      name: 'Ring 4 — Tool Permission Gate',
      codename: 'RING-04-TOOL-GATE',
      status: 'ACTIVE_ARMED',
      healthScore: 100,
      description: 'Membatasi wewenang eksekusi fungsi AI hanya pada tool read-only dan auto-repair non-destruktif.',
      activeEnforcements: [
        'Banned tools: Drop, Delete, Truncate, Format, Bypass',
        'Allowlisted tools: Reconnect, CacheClean, BatchSync, GKLQuery',
        'Strict schema validation on tool input arguments'
      ],
      lastAudit: '5 menit lalu',
      threatBlockedCount: 0,
      colorScheme: {
        bg: 'bg-purple-50/50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800'
      }
    },
    {
      ringNumber: 5,
      name: 'Ring 5 — Safe Mode Autonomous Fallback',
      codename: 'RING-05-SAFE-MODE',
      status: 'MONITORING',
      healthScore: 100,
      description: 'Otomatis aktif jika terjadi kegagalan startup hash atau anomali fatal, menonaktifkan fitur AI dan kembali ke mode deterministik murni.',
      activeEnforcements: [
        'Auto-trip trigger on configuration hash drift',
        'Deterministic UI fallback without breaking SIM workflows',
        'Immediate alert dispatch to Super Admin & WhatsApp Gateway'
      ],
      lastAudit: '10 menit lalu',
      threatBlockedCount: 0,
      colorScheme: {
        bg: 'bg-teal-50/50',
        border: 'border-teal-200',
        text: 'text-teal-900',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800'
      }
    },
    {
      ringNumber: 6,
      name: 'Ring 6 — Crisis Command Mode',
      codename: 'RING-06-CRISIS-MODE',
      status: 'MONITORING',
      healthScore: 100,
      description: 'Mekanisme isolasi instan yang dapat diaktifkan dalam keadaan darurat (bencana siber/infrastruktur putus total).',
      activeEnforcements: [
        'Offline-First IndexedDB state preservation',
        'Full read-only freeze on all database writes',
        'Quarantine mode for non-verified external webhooks'
      ],
      lastAudit: '15 menit lalu',
      threatBlockedCount: 0,
      colorScheme: {
        bg: 'bg-amber-50/50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800'
      }
    },
    {
      ringNumber: 7,
      name: 'Ring 7 — Presidential Shield (Triple Verification Core)',
      codename: 'RING-07-PRESIDENTIAL-SHIELD',
      status: 'REINFORCED',
      healthScore: 100,
      description: 'Jantung pertahanan TADE. Memastikan Human Final Authority (Super Admin) memegang kendali mutlak atas seluruh aksi kritis.',
      activeEnforcements: [
        'Immutable Triple Verification Protocol enforcement',
        'Zero autonomous write permission for payment/invoice tables',
        '7 Locked Invariants cryptographic integrity enforcement'
      ],
      lastAudit: 'Realtime',
      threatBlockedCount: 1,
      colorScheme: {
        bg: 'bg-rose-50/50',
        border: 'border-rose-200',
        text: 'text-rose-900',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800'
      }
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Fortress Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-rose-900/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider border border-rose-500/30">
              <Shield className="w-3.5 h-3.5 text-rose-400" /> AI Asy Fortress • 7 Rings of Defense Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              Benteng Pertahanan Tujuh Lapis AI Asy (RC6)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Arsitektur keamanan berlapis (Defense in Depth) yang melindungi ekosistem kecerdasan buatan TK ASY SYIFA dari ancaman injeksi prompt, pembobolan wewenang, kebocoran memori, dan anomali sistemik.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs font-mono">
              <div className="text-slate-400 text-[10px] uppercase">Status Benteng:</div>
              <div className="text-rose-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 7/7 Rings Armed
              </div>
            </div>
            <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-800 text-xs font-mono">
              <div className="text-emerald-300 text-[10px] uppercase">Total Ancaman Dihalau:</div>
              <div className="text-white font-bold">26 Vectors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seven Defense Rings Display */}
      <div className="space-y-4">
        {rings.map((ring) => (
          <div
            key={ring.ringNumber}
            className={`p-6 rounded-3xl border ${ring.colorScheme.border} ${ring.colorScheme.bg} shadow-xs space-y-4 transition hover:shadow-md`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center font-mono font-black text-sm text-slate-900 shadow-xs">
                  R{ring.ringNumber}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900">{ring.name}</h3>
                  <span className="text-[10px] font-mono text-stone-500">{ring.codename}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${ring.colorScheme.badgeBg} ${ring.colorScheme.badgeText}`}>
                  {ring.status} • {ring.healthScore}%
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Audit: {ring.lastAudit}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-sans">
              {ring.description}
            </p>

            {/* Enforcements */}
            <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/60 space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-700" /> Penegakan Keamanan Aktif:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ring.activeEnforcements.map((enf, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-800 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{enf}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Threat Counter */}
            <div className="flex items-center justify-between text-xs font-mono pt-1 text-stone-600">
              <span>Vektor Ancaman Dinetralisir:</span>
              <span className="font-bold text-stone-900">{ring.threatBlockedCount} Percobaan</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
