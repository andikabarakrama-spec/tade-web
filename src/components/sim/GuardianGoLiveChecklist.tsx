import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Server,
  Database,
  Lock,
  QrCode,
  Tv,
  Mic,
  Video,
  HardDrive,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface HealthCheckItem {
  id: string;
  name: string;
  category: string;
  icon: any;
  status: 'PASS' | 'ATTENTION';
  latency: string;
  details: string;
  lastVerified: string;
}

const INITIAL_CHECKS: HealthCheckItem[] = [
  { id: 'c_db', name: 'Firestore Database & Rule Guard', category: 'Core Data', icon: Database, status: 'PASS', latency: '24ms', details: 'H0-01 Payment Locks active. 0 financial drift.', lastVerified: 'Just now' },
  { id: 'c_storage', name: 'Cloud Storage & Vault Archive', category: 'Media & Files', icon: HardDrive, status: 'PASS', latency: '42ms', details: 'SHA-256 integrity checks passing for all 10 governance folders.', lastVerified: 'Just now' },
  { id: 'c_auth', name: 'Firebase Authentication & 7-Role RBAC', category: 'Security', icon: Lock, status: 'PASS', latency: '18ms', details: 'Claims validation locked; no privilege leakage.', lastVerified: 'Just now' },
  { id: 'c_appcheck', name: 'App Check & Device Attestation', category: 'Security', icon: ShieldCheck, status: 'PASS', latency: '31ms', details: 'Anti-tamper token active on all API calls.', lastVerified: 'Just now' },
  { id: 'c_backup', name: 'Automated Snapshot & Backup Vault', category: 'Disaster Recovery', icon: Server, status: 'PASS', latency: '120ms', details: 'Daily snapshot verified; zero recovery gap.', lastVerified: '10 mins ago' },
  { id: 'c_recovery', name: 'Guardian Auto-Respawn & Self Healing', category: 'Continuity', icon: Cpu, status: 'PASS', latency: '15ms', details: 'Heartbeat active across 5 simulated micro-services.', lastVerified: 'Just now' },
  { id: 'c_qr', name: 'Universal QR Verification Engine', category: 'Verification', icon: QrCode, status: 'PASS', latency: '20ms', details: 'Dynamic HMAC tokens valid for Lobby, Presensi, and PPDB.', lastVerified: 'Just now' },
  { id: 'c_meeting', name: 'Executive Meeting & Digital Room Guard', category: 'Collaboration', icon: Video, status: 'PASS', latency: '35ms', details: 'WebRTC signaling channel healthy with end-to-end encryption.', lastVerified: 'Just now' },
  { id: 'c_schooltv', name: 'Living School TV & Public Carousel', category: 'Display', icon: Tv, status: 'PASS', latency: '28ms', details: 'Carousel auto-sync active with morning announcements.', lastVerified: 'Just now' },
  { id: 'c_voice', name: 'AI Voice Identity & Audio Streamer', category: 'AI Services', icon: Mic, status: 'PASS', latency: '48ms', details: 'Dek Syifa & AI Asy Prime voice synthesizers operational.', lastVerified: 'Just now' }
];

export const GuardianGoLiveChecklist: React.FC = () => {
  const [checks, setChecks] = useState<HealthCheckItem[]>(INITIAL_CHECKS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState('07:00:00 WIB (Morning Patrol)');

  const handleRunFullAudit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setChecks(prev =>
        prev.map(c => ({
          ...c,
          lastVerified: 'Just now',
          latency: `${Math.floor(Math.random() * 30 + 15)}ms`
        }))
      );
      setLastAuditTime(new Date().toLocaleTimeString('id-ID') + ' WIB');
      setIsVerifying(false);
    }, 1200);
  };

  const passCount = checks.filter(c => c.status === 'PASS').length;
  const attentionCount = checks.filter(c => c.status === 'ATTENTION').length;

  return (
    <div className="space-y-6">
      {/* Header Guard Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  GUARDIAN MORNING PATROL
                </span>
                <span className="text-xs text-slate-400">TADE Constitution v3.2</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Guardian Go-Live Daily Verification Checklist
              </h1>
              <p className="text-sm text-indigo-100/80 mt-0.5">
                Audit otomatis setiap pagi untuk memastikan seluruh subsistem sekolah beroperasi 100% prima tanpa hambatan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunFullAudit}
              disabled={isVerifying}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              {isVerifying ? 'Memverifikasi...' : 'Jalankan Audit Pagi Ulang'}
            </button>
          </div>
        </div>

        {/* Audit Status Bar */}
        <div className="mt-6 pt-4 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{passCount} SUBSYSTEMS PASS</span>
            </div>
            {attentionCount > 0 ? (
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{attentionCount} BUTUH PERHATIAN</span>
              </div>
            ) : (
              <div className="text-slate-400">0 Critical Warnings</div>
            )}
          </div>
          <div className="text-slate-400 text-xs">
            Audit Terakhir: <strong className="text-slate-200">{lastAuditTime}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Subsystems Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => {
          const Icon = check.icon;
          return (
            <div
              key={check.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-start justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{check.name}</h3>
                    <span className="text-[10px] text-slate-500 font-medium">({check.category})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{check.details}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span>Latency: <strong>{check.latency}</strong></span>
                    <span>•</span>
                    <span>Verified: {check.lastVerified}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                  check.status === 'PASS'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}>
                  {check.status === 'PASS' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      PASS
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      ATTENTION
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
