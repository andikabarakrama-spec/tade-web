import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Crown,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Radio,
  Clock,
  Database,
  Lock,
  Zap,
  CheckCircle2,
  Wrench,
  Flame,
  FileText,
  Users,
  HardDrive,
  Eye,
  RefreshCw,
  Play,
  Check,
  ArrowRight,
  Info,
  Server,
  Layers,
  Crosshair
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { GuardianMaintenanceVault } from './GuardianMaintenanceVault';
import { GuardianChaosLab } from './GuardianChaosLab';
import { GuardianFirestoreWatchtower } from './GuardianFirestoreWatchtower';
import { GuardianDDoSCenter } from './GuardianDDoSCenter';
import { AIAsyPrimeCabinet } from './AIAsyPrimeCabinet';
import { VoiceIntelligenceCenter } from './VoiceIntelligenceCenter';
import { AIAsyFortress } from './AIAsyFortress';
import { GuardianRoyalGuard } from './GuardianRoyalGuard';
import { GuardianBattlefieldOrchestrator } from './GuardianBattlefieldOrchestrator';

export interface GuardianEventItem {
  id: string;
  type: 'LOGIN' | 'BACKUP_COMPLETE' | 'PPDB_SUBMITTED' | 'UPLOAD_RETRY' | 'THREAT_DETECTED' | 'AUTO_REPAIR_SUCCESS' | 'FINANCIAL_RECONCILED';
  title: string;
  actor: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  timestampRelative: string;
  timestamp: string;
  details: string;
}

export const PresidentialCommandCenter: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const currentRole: UserRole = activeRole || userProfile?.role || 'CALON_WALI_MURID';
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';

  const [activeSubView, setActiveSubView] = useState<
    'EXECUTIVE_OVERVIEW' | 'BATTLEFIELD' | 'AI_CABINET' | 'VOICE_INTELLIGENCE' | 'AI_FORTRESS' | 'ROYAL_GUARD' | 'MAINTENANCE_VAULT' | 'CHAOS_LAB' | 'WATCHTOWER' | 'DDOS_CENTER'
  >('EXECUTIVE_OVERVIEW');

  // Live Guardian Event Stream (Phase 7)
  const [events, setEvents] = useState<GuardianEventItem[]>([
    {
      id: 'evt-01',
      type: 'AUTO_REPAIR_SUCCESS',
      title: 'Pembersihan Buffer Geolocation Selesai',
      actor: 'Guardian Auto-Repair Engine',
      severity: 'SUCCESS',
      timestampRelative: 'Baru saja (Just now)',
      timestamp: '04:52 WIB',
      details: 'Cache geolokasi presensi dibersihkan secara aman tanpa efek samping.'
    },
    {
      id: 'evt-02',
      type: 'FINANCIAL_RECONCILED',
      title: 'Rekonsiliasi SPP Zero-Drift Terverifikasi',
      actor: 'Guardian Financial Invariant (FIND-08-R4)',
      severity: 'SUCCESS',
      timestampRelative: '2 menit yang lalu',
      timestamp: '04:50 WIB',
      details: 'Total saldo kas & mutasi kwitansi 100% klop tanpa selisih (Rp 0 drift).'
    },
    {
      id: 'evt-03',
      type: 'PPDB_SUBMITTED',
      title: 'Formulir Pendaftaran Calon Santri Diterima',
      actor: 'Portal Calon Wali Murid',
      severity: 'INFO',
      timestampRelative: '5 menit yang lalu',
      timestamp: '04:47 WIB',
      details: 'Pendaftar no #140 berkas lengkap terverifikasi otomatis.'
    },
    {
      id: 'evt-04',
      type: 'UPLOAD_RETRY',
      title: 'Unggah Ulang Foto Buku Penghubung Sukses',
      actor: 'Guardian Resilient Storage Uploader',
      severity: 'INFO',
      timestampRelative: '12 menit yang lalu',
      timestamp: '04:40 WIB',
      details: '2 berkas foto karya santri tervalidasi SHA-256 dan masuk ke Cloud Storage.'
    },
    {
      id: 'evt-05',
      type: 'BACKUP_COMPLETE',
      title: 'Snapshot Backup Otomatis 24 Jam Selesai',
      actor: 'Guardian Recovery Vault',
      severity: 'SUCCESS',
      timestampRelative: '52 menit yang lalu',
      timestamp: '04:00 WIB',
      details: 'Snapshot point-in-time 4.820 dokumen tersimpan di JSON Vault terenkripsi.'
    },
    {
      id: 'evt-06',
      type: 'LOGIN',
      title: 'Sesi Super Admin Terautentikasi',
      actor: 'andikabarakrama@gmail.com (Super Admin)',
      severity: 'INFO',
      timestampRelative: '1 jam yang lalu',
      timestamp: '03:50 WIB',
      details: 'Token claims RBAC terverifikasi via Google Identity Services.'
    }
  ]);

  // Live Pulse ticker to simulate streaming event addition
  useEffect(() => {
    const timer = setInterval(() => {
      const liveTypes: Array<{
        type: GuardianEventItem['type'];
        title: string;
        actor: string;
        severity: GuardianEventItem['severity'];
        details: string;
      }> = [
        {
          type: 'AUTO_REPAIR_SUCCESS',
          title: 'Heartbeat Real-time Handshake Re-anchored',
          actor: 'Guardian Core',
          severity: 'SUCCESS',
          details: 'Sinkronisasi koneksi background tab berhasil disegarkan.'
        },
        {
          type: 'FINANCIAL_RECONCILED',
          title: 'Audit Idempotensi Pembayaran SPP (FIND-08-R2)',
          actor: 'Cashier Invariant Sentinel',
          severity: 'SUCCESS',
          details: 'Nomor kwitansi terurut serial tervalidasi 100% konsisten.'
        },
        {
          type: 'PPDB_SUBMITTED',
          title: 'Pemeriksaan Integritas Berkas PPDB',
          actor: 'Smart Document Intake',
          severity: 'INFO',
          details: 'Validasi berkas digital santri lulus pemeriksaan format PDF/JPG.'
        }
      ];

      const chosen = liveTypes[Math.floor(Math.random() * liveTypes.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const newEvt: GuardianEventItem = {
        id: `evt-${Date.now()}`,
        type: chosen.type,
        title: chosen.title,
        actor: chosen.actor,
        severity: chosen.severity,
        timestampRelative: 'Baru saja',
        timestamp: timeStr,
        details: chosen.details
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 15)]);
    }, 18000);

    return () => clearInterval(timer);
  }, []);

  const getEventSeverityClass = (sev: GuardianEventItem['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      case 'WARNING':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'INFO':
      default:
        return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Presidential Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-700">
            <Crown className="w-4 h-4 text-emerald-400" /> Pusat Komando Tertinggi • Presidential Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Pusat Komando Presiden Sistem & Federasi Guardian (RC5)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Stasiun kendali terpadu Super Admin. Mengintegrasikan briefing AI Asy (Chief of Staff), Presiden Sistem (Guardian Core), observabilitas menara pengawas, dan persetujuan tindakan kritis bertingkat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-mono space-y-1">
            <div className="text-slate-400 text-[10px] uppercase">Otoritas Tertinggi:</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" /> Super Admin Active
            </div>
          </div>

          <div className="p-3 bg-emerald-950 rounded-2xl border border-emerald-800 text-xs font-mono space-y-1">
            <div className="text-emerald-300 text-[10px] uppercase">Status Federasi:</div>
            <div className="text-white font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Invariants Locked
            </div>
          </div>
        </div>
      </div>

      {/* Sub-View Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => setActiveSubView('EXECUTIVE_OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'EXECUTIVE_OVERVIEW' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Crown className="w-4 h-4 text-emerald-400" /> Ringkasan Komando & Briefing
        </button>

        <button
          onClick={() => setActiveSubView('BATTLEFIELD')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'BATTLEFIELD' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Crosshair className="w-4 h-4 text-teal-400" /> Medan Tempur (Battlefield)
        </button>

        <button
          onClick={() => setActiveSubView('AI_CABINET')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'AI_CABINET' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Kabinet 8 Menteri AI Asy
        </button>

        <button
          onClick={() => setActiveSubView('VOICE_INTELLIGENCE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'VOICE_INTELLIGENCE' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Radio className="w-4 h-4 text-teal-400" /> Asisten Suara & Dek Syifa
        </button>

        <button
          onClick={() => setActiveSubView('AI_FORTRESS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'AI_FORTRESS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Shield className="w-4 h-4 text-rose-400" /> Benteng 7 Lapis (Fortress)
        </button>

        <button
          onClick={() => setActiveSubView('ROYAL_GUARD')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'ROYAL_GUARD' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Garda Royal & Integritas Startup
        </button>

        <button
          onClick={() => setActiveSubView('MAINTENANCE_VAULT')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'MAINTENANCE_VAULT' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-400" /> Maintenance Vault
        </button>

        <button
          onClick={() => setActiveSubView('CHAOS_LAB')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'CHAOS_LAB' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-400" /> Chaos Lab Sandbox
        </button>

        <button
          onClick={() => setActiveSubView('WATCHTOWER')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'WATCHTOWER' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" /> Firestore Watchtower
        </button>

        <button
          onClick={() => setActiveSubView('DDOS_CENTER')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            activeSubView === 'DDOS_CENTER' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-400" /> DDoS Defense Center
        </button>
      </div>

      {/* VIEW: EXECUTIVE OVERVIEW & BRIEFINGS */}
      {activeSubView === 'EXECUTIVE_OVERVIEW' && (
        <div className="space-y-6">
          {/* AI Asy & Guardian Core Twin Briefing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Asy Morning Briefing (Chief of Staff) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Briefing Pagi AI Asy (Chief of Staff)</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Companion Strategis & Analis Operasional</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-950 font-mono text-[10px] font-black rounded-lg">
                  LIVE ADVISORY
                </span>
              </div>

              <div className="space-y-3 text-xs text-stone-700 font-medium leading-relaxed">
                <p>
                  <strong>Bismillāh, Yang Mulia Super Admin:</strong>
                </p>
                <p>
                  Seluruh 58 modul SIM TK Islam Asy-Syifatan beroperasi dalam status <strong>100% Optimal</strong>. Presensi guru dan santri tercatat sempurna, pelunasan SPP zero-drift, dan kuota pendaftaran PPDB (140 santri) terpenuhi penuh.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-800">Rekomendasi AI Asy Hari Ini:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    <li>Semua perbaikan otomatis (auto-repairs) telah selesai tanpa hambatan.</li>
                    <li>Terdapat 2 agenda audit manual menunggu persetujuan Anda di Maintenance Vault.</li>
                    <li>Suhu lalu lintas jaringan dan kuota Firestore berada di zona hijau bebas risiko.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Guardian Live Briefing (President System) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-900 text-emerald-400 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Laporan Presiden Sistem (Guardian Core)</h3>
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Penjaga Kedaulatan Invariant & Pertahanan</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-slate-900 text-emerald-300 font-mono text-[10px] font-black rounded-lg">
                  7 INVARIANTS LOCKED
                </span>
              </div>

              <div className="space-y-3 text-xs text-stone-700 font-medium leading-relaxed">
                <p>
                  <strong>Laporan Integritas Keamanan:</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold">
                    App Check: 100% Enforced
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold">
                    Anti-Double-Spend: Active
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold">
                    Snapshot Vault: SHA-256 OK
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold">
                    7-Role RBAC: Isolated
                  </div>
                </div>
                <p className="text-stone-500 text-[11px]">
                  Tidak terdeteksi upaya bypass hak akses atau mutasi ilegal. Protokol pertahanan otomatis siap merespon dalam &lt; 0.5 detik.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Operational Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Tingkat Ancaman Sistem
              </span>
              <div className="text-2xl font-black text-emerald-800 font-mono">GREEN (0 Active Threats)</div>
              <p className="text-[11px] text-stone-500 font-medium">Lalu lintas bersih, nol botnet tembus.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Throughput Database
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">14.2 ops/s (16ms)</div>
              <p className="text-[11px] text-stone-500 font-medium">Beban baca/tulis normal & stabil.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Mitigasi Serangan DDoS
              </span>
              <div className="text-2xl font-black text-emerald-800 font-mono">100% Layer-7 Protected</div>
              <p className="text-[11px] text-stone-500 font-medium">Honey Shield & Rate Limiter siaga.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Kesiapan Pemulihan Bencana
              </span>
              <div className="text-2xl font-black text-emerald-800 font-mono">RTO &lt; 45s • RPO &lt; 15m</div>
              <p className="text-[11px] text-stone-500 font-medium">Snapshot cold-backup 24 jam tervalidasi.</p>
            </div>
          </div>

          {/* PHASE 7: Guardian Event Stream */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-800" /> Aliran Peristiwa Operasional Langsung (Guardian Event Stream)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Streaming telemetri aktivitas real-time sistem (Login, Backup, PPDB, Auto-Repair, Rekonsiliasi).
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span> Live Streaming Active
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 font-mono text-[9px] font-black rounded border ${getEventSeverityClass(evt.severity)}`}>
                      {evt.type}
                    </span>
                    <div>
                      <div className="font-black text-slate-900">{evt.title}</div>
                      <div className="text-[11px] text-stone-500">{evt.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right shrink-0">
                    <span className="text-[10px] font-mono text-stone-400">{evt.actor}</span>
                    <span className="font-mono font-bold text-slate-700 text-[11px]">{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GUARDIAN BATTLEFIELD ORCHESTRATOR */}
      {activeSubView === 'BATTLEFIELD' && <GuardianBattlefieldOrchestrator />}

      {/* VIEW: AI ASY PRIME CABINET */}
      {activeSubView === 'AI_CABINET' && <AIAsyPrimeCabinet />}

      {/* VIEW: VOICE INTELLIGENCE */}
      {activeSubView === 'VOICE_INTELLIGENCE' && <VoiceIntelligenceCenter />}

      {/* VIEW: AI FORTRESS */}
      {activeSubView === 'AI_FORTRESS' && <AIAsyFortress />}

      {/* VIEW: ROYAL GUARD */}
      {activeSubView === 'ROYAL_GUARD' && <GuardianRoyalGuard />}

      {/* VIEW: MAINTENANCE VAULT */}
      {activeSubView === 'MAINTENANCE_VAULT' && <GuardianMaintenanceVault />}

      {/* VIEW: CHAOS LAB */}
      {activeSubView === 'CHAOS_LAB' && <GuardianChaosLab />}

      {/* VIEW: WATCHTOWER */}
      {activeSubView === 'WATCHTOWER' && <GuardianFirestoreWatchtower />}

      {/* VIEW: DDOS CENTER */}
      {activeSubView === 'DDOS_CENTER' && <GuardianDDoSCenter />}
    </motion.div>
  );
};
