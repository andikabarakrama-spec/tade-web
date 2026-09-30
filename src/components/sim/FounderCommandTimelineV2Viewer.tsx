import React, { useState } from 'react';
import { 
  Crown, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Bot, 
  HardDrive, 
  Radio, 
  CheckCircle2, 
  Filter, 
  Search,
  Sparkles
} from 'lucide-react';

interface TimelineEventV2 {
  id: string;
  source: 'RECOVERY' | 'THREAT' | 'AI_ASY' | 'GUARDIAN' | 'STORAGE' | 'EVENT_BUS';
  title: string;
  description: string;
  time: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export const FounderCommandTimelineV2Viewer: React.FC = () => {
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [events] = useState<TimelineEventV2[]>([
    {
      id: 'EVT-101',
      source: 'GUARDIAN',
      title: 'Control Plane Bootstrap Verification',
      description: 'Seluruh 8 engine resmi terdaftar pada Service Registry dengan status HEALTHY.',
      time: '08:00:00',
      severity: 'SUCCESS'
    },
    {
      id: 'EVT-102',
      source: 'AI_ASY',
      title: 'Executive Morning Brief Dispatched',
      description: 'Laporan harian kesiapsiagaan pesantren dan yayasan disampaikan ke Ketua Yayasan.',
      time: '08:01:15',
      severity: 'INFO'
    },
    {
      id: 'EVT-103',
      source: 'STORAGE',
      title: 'Pre-Class Automated Snapshot SHA-256',
      description: 'Checkpoint SNP-991 berhasil diarsipkan dengan 384 data siswa.',
      time: '08:02:40',
      severity: 'SUCCESS'
    },
    {
      id: 'EVT-104',
      source: 'THREAT',
      title: 'Threat Correlation Routine Check',
      description: 'Zero anomalies correlated across 6 storage partitions. Defense level NOMINAL.',
      time: '08:05:00',
      severity: 'INFO'
    },
    {
      id: 'EVT-105',
      source: 'RECOVERY',
      title: 'Offline Queue Auto-Draining',
      description: '3 transaksi kasir offline berhasil disinkronkan ke PostgreSQL & Firestore.',
      time: '08:08:12',
      severity: 'SUCCESS'
    },
    {
      id: 'EVT-106',
      source: 'EVENT_BUS',
      title: 'Kernel Trace Spans Aggregated',
      description: 'eBPF-inspired observatory merekam 142 event/detik dengan latency &lt; 2ms.',
      time: '08:10:00',
      severity: 'INFO'
    }
  ]);

  const filtered = filterSource === 'ALL'
    ? events
    : events.filter(e => e.source === filterSource);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                R602 &bull; FOUNDER COMMAND TIMELINE V2
              </span>
              <span className="text-xs text-slate-400 font-mono">Unified Multi-Source Chronology</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Founder Command Timeline V2 &amp; Unified Chronology</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
          >
            <option value="ALL">All Sources (Unified)</option>
            <option value="GUARDIAN">Guardian Kernel</option>
            <option value="AI_ASY">AI Asy Executive</option>
            <option value="STORAGE">Immortal Storage &amp; WAL</option>
            <option value="THREAT">Threat Correlator</option>
            <option value="RECOVERY">Distributed Recovery</option>
            <option value="EVENT_BUS">Event Bus &amp; Traces</option>
          </select>
        </div>
      </div>

      {/* Unified Multi-Channel Stream */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Integrated Operational Chronology (/var/log/tade_founder_chronology.v2):
        </span>

        <div className="space-y-2">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 rounded bg-slate-900 text-amber-300 font-bold text-[10px] border border-slate-800 mt-0.5">
                  {evt.time}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{evt.title}</strong>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                      {evt.source}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  {evt.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
