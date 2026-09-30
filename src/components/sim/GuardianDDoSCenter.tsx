import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  Lock,
  Globe,
  Radio,
  Server,
  RefreshCw,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { ThreatLevel } from './GuardianFirestoreWatchtower';

export interface AttackReplayEvent {
  id: string;
  timestamp: string;
  timestampRelative: string;
  sourceIpSubnet: string;
  vector: string;
  requestsBlocked: number;
  mitigationAction: string;
  shieldTriggered: string;
  status: 'MITIGATED' | 'BLOCKED';
}

export const GuardianDDoSCenter: React.FC = () => {
  const [pulse, setPulse] = useState(0);

  // Real-time telemetry
  const [requestsPerSec, setRequestsPerSec] = useState(24.5);
  const [rateLimitStatus, setRateLimitStatus] = useState('ARMED_ACTIVE (100 req/min per IP)');
  const [adaptiveShieldLevel, setAdaptiveShieldLevel] = useState('LEVEL-1 (STANDARD DEFENSE)');
  const [ppdbQueueHealth, setPpdbQueueHealth] = useState('100% HEALTHY (0ms latency penalty)');
  const [honeyShieldDetections, setHoneyShieldDetections] = useState(14);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('GREEN');

  // Attack replay events
  const attackHistory: AttackReplayEvent[] = useMemo(
    () => [
      {
        id: 'atk-01',
        timestamp: '2026-08-14 03:15 WIB',
        timestampRelative: '1 jam 34 menit yang lalu',
        sourceIpSubnet: '194.26.29.0/24 (Unknown Autonomous System)',
        vector: 'HTTP GET Flood on public website asset paths',
        requestsBlocked: 4280,
        mitigationAction: 'Honey Shield IP Jail 15 menit + Cloudflare Edge Challenge',
        shieldTriggered: 'Adaptive Layer-7 Rate Limiter',
        status: 'MITIGATED'
      },
      {
        id: 'atk-02',
        timestamp: '2026-08-13 22:40 WIB',
        timestampRelative: '6 jam yang lalu',
        sourceIpSubnet: '45.154.255.0/24 (Automated Scraper Botnet)',
        vector: 'Malicious Form Scraping on PPDB Landing Page',
        requestsBlocked: 1150,
        mitigationAction: 'App Check Token Verification Failure Drop',
        shieldTriggered: 'Guardian App Check Shield',
        status: 'BLOCKED'
      },
      {
        id: 'atk-03',
        timestamp: '2026-08-12 14:10 WIB',
        timestampRelative: '1 hari yang lalu',
        sourceIpSubnet: '185.220.101.0/24 (Tor Exit Node Probe)',
        vector: 'SQL/NoSQL Parameter Fuzzing on Public Search Query',
        requestsBlocked: 820,
        mitigationAction: 'Sanitization Layer Auto-Drop & IP Rate Throttling',
        shieldTriggered: 'Guardian Honey Trap Vector',
        status: 'MITIGATED'
      }
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => p + 1);
      setRequestsPerSec(+(20 + Math.random() * 8).toFixed(1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black uppercase tracking-wider border border-emerald-300">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-800" /> Guardian DDoS Defense Center • RC5
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Pertahanan DDoS & Perlindungan Lalu Lintas (DDoS Center)
          </h1>
          <p className="text-stone-600 text-xs mt-0.5 max-w-3xl">
            Sistem perisai adaptif proteksi Layer-7, deteksi perangkap Honey Shield, mitigasi lonjakan antrean pendaftaran PPDB, dan riwayat serangan otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-600 text-white rounded-2xl text-xs font-mono font-black tracking-wider shadow-xs">
            THREAT LEVEL: GREEN (STABLE)
          </div>
        </div>
      </div>

      {/* DDoS Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Requests / Sec Ingress
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">{requestsPerSec} req/s</div>
          <p className="text-[11px] text-stone-500 font-medium">Lalu lintas web normal dan terdistribusi merata.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Perisai Adaptif (Adaptive Shield)
          </span>
          <div className="text-xl font-black text-emerald-800 font-mono">{adaptiveShieldLevel}</div>
          <p className="text-[11px] text-stone-500 font-medium">Batas rate limit adaptif aktif dan responsif.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Kesehatan Antrean PPDB
          </span>
          <div className="text-xl font-black text-emerald-800 font-mono">100% Optimal</div>
          <p className="text-[11px] text-stone-500 font-medium">{ppdbQueueHealth}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
            Honey Shield Detections
          </span>
          <div className="text-3xl font-black text-emerald-800 font-mono">{honeyShieldDetections} Terblokir</div>
          <p className="text-[11px] text-stone-500 font-medium">Botnet & crawler mencurigakan dinetralkan.</p>
        </div>
      </div>

      {/* Attack Replay Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" /> Riwayat Penangkalan Anomali (Attack Replay Timeline)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Log mitigasi serangan Layer-7 otomatis yang berhasil dinetralkan oleh Guardian Shield.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-black rounded-full border border-emerald-300 self-start sm:self-auto">
            3/3 Insiden Berhasil Dinetralkan
          </span>
        </div>

        <div className="space-y-3">
          {attackHistory.map((atk) => (
            <div
              key={atk.id}
              className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 hover:border-emerald-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-slate-900 text-emerald-300 font-mono text-[10px] font-bold rounded">
                    {atk.shieldTriggered}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-mono text-[10px] font-black rounded border border-emerald-300">
                    {atk.status}
                  </span>
                  <span className="text-xs font-black text-slate-900">{atk.vector}</span>
                </div>

                <span className="text-xs font-mono text-stone-500">
                  {atk.timestampRelative} ({atk.timestamp})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200 font-sans">
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Subnet Penyerang:</span>
                  <span className="font-mono text-slate-800 font-bold">{atk.sourceIpSubnet}</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Permintaan Terblokir:</span>
                  <span className="font-mono text-rose-800 font-bold">{atk.requestsBlocked.toLocaleString()} Permintaan</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">Tindakan Mitigasi:</span>
                  <span className="text-emerald-900 font-bold">{atk.mitigationAction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
