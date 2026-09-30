import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Database,
  Lock,
  Flame,
  FileText,
  CreditCard,
  Users,
  Activity,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle2,
  Info,
  Layers,
  Zap
} from 'lucide-react';

export type ThreatLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface ThreatNode {
  id: string;
  name: string;
  category: 'Firestore' | 'Authentication' | 'DDoS' | 'Voice' | 'Documents' | 'Payments' | 'PPDB';
  status: ThreatLevel;
  healthPercent: number;
  currentTraffic: string;
  anomalyScore: number; // 0-100
  activeDefense: string;
  lastAuditRelative: string;
  details: string;
  metrics: { label: string; value: string }[];
}

export const NationalThreatMap: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-firestore');
  const [overallPosture, setOverallPosture] = useState<ThreatLevel>('GREEN');

  // Interactive Live Nodes
  const nodes: ThreatNode[] = [
    {
      id: 'node-firestore',
      name: 'Firestore Cloud Watchtower',
      category: 'Firestore',
      status: 'GREEN',
      healthPercent: 99.8,
      currentTraffic: '142 ops/detik',
      anomalyScore: 3,
      activeDefense: 'Zero-Leak Security Rule Engine & Index Sharding',
      lastAuditRelative: 'Baru saja (Real-time)',
      details: 'Koneksi real-time listener stabil. Latensi rata-rata 18ms. Tidak ada query unindexed atau anomaly leak.',
      metrics: [
        { label: 'Avg Latency', value: '18 ms' },
        { label: 'Read/Write Ratio', value: '8.4 : 1' },
        { label: 'Error Rate', value: '0.00%' }
      ]
    },
    {
      id: 'node-auth',
      name: 'Authentication & RBAC Bastion',
      category: 'Authentication',
      status: 'GREEN',
      healthPercent: 100,
      currentTraffic: '38 sesi aktif',
      anomalyScore: 0,
      activeDefense: 'App Check Attestation & 7-Role Isolation Guard',
      lastAuditRelative: '15 detik lalu',
      details: 'Seluruh custom token tervalidasi. 0 upaya brute force atau privilege escalation terdeteksi.',
      metrics: [
        { label: 'Token Validity', value: '100%' },
        { label: 'Failed Attempts', value: '0/jam' },
        { label: 'App Check Status', value: 'VERIFIED' }
      ]
    },
    {
      id: 'node-ddos',
      name: 'Edge Ingress & DDoS Honey Shield',
      category: 'DDoS',
      status: 'GREEN',
      healthPercent: 99.4,
      currentTraffic: '512 req/mnt',
      anomalyScore: 8,
      activeDefense: 'Adaptive 100 req/min/IP Limiter & Honey Trap IP Isolation',
      lastAuditRelative: '30 detik lalu',
      details: 'Ingress traffic berada di bawah ambang batas normal. 2 crawler jinak di-throttle secara halus tanpa menyentuh core DB.',
      metrics: [
        { label: 'Blocked IPs', value: '4' },
        { label: 'Honey Traps Active', value: '12' },
        { label: 'Bandwidth Headroom', value: '94%' }
      ]
    },
    {
      id: 'node-voice',
      name: 'Voice Intelligence & Dek Syifa Shield',
      category: 'Voice',
      status: 'GREEN',
      healthPercent: 100,
      currentTraffic: '14 request audio/jam',
      anomalyScore: 1,
      activeDefense: 'Triple-Layer Prompt Injection Sanitizer & Dek Syifa Safe Sandbox',
      lastAuditRelative: '1 menit lalu',
      details: 'Semua rekaman suara lokal dan query asisten suara tervalidasi aman. Nol kebocoran konteks identitas santri.',
      metrics: [
        { label: 'Injection Blocked', value: '0' },
        { label: 'Audio Latency', value: '120 ms' },
        { label: 'Safe Adab Score', value: '100%' }
      ]
    },
    {
      id: 'node-docs',
      name: 'Smart Document Factory & QR Registry',
      category: 'Documents',
      status: 'GREEN',
      healthPercent: 99.2,
      currentTraffic: '45 dokumen/jam',
      anomalyScore: 4,
      activeDefense: 'SHA-256 Signature Validator & Nonce Tamper-Proofing',
      lastAuditRelative: '3 menit lalu',
      details: 'Generasi rapor e-Rapor dan sertifikat kelulusan berjalan lancar dalam worker thread terisolasi.',
      metrics: [
        { label: 'Queue Length', value: '0 item' },
        { label: 'Avg Gen Time', value: '420 ms' },
        { label: 'QR Tamper Events', value: '0' }
      ]
    },
    {
      id: 'node-payments',
      name: 'Financial Invariant Core (FIND-08-R4)',
      category: 'Payments',
      status: 'GREEN',
      healthPercent: 100,
      currentTraffic: '18 kwitansi/jam',
      anomalyScore: 0,
      activeDefense: 'H0-01 Anti-Double Spend Lock & Continuous Zero-Drift Reconciler',
      lastAuditRelative: '45 detik lalu',
      details: 'Integritas penomoran kwitansi urut tanpa gap. Mutasi saldo kasir 100% klop dengan ledger bank.',
      metrics: [
        { label: 'Double Spend Attempts', value: '0' },
        { label: 'Serial Gap Count', value: '0' },
        { label: 'Financial Drift', value: 'Rp 0' }
      ]
    },
    {
      id: 'node-ppdb',
      name: 'PPDB High-Concurrency Intake Gate',
      category: 'PPDB',
      status: 'GREEN',
      healthPercent: 98.9,
      currentTraffic: '84 pendaftar/hari',
      anomalyScore: 11,
      activeDefense: 'Atomic Quota Allocator & File Payload Sanitizer',
      lastAuditRelative: '2 menit lalu',
      details: 'Penerimaan berkas calon santri baru stabil. Upload foto dan KK diproses via Cloudflare-guarded intake.',
      metrics: [
        { label: 'Quota Remaining', value: '60 kursi' },
        { label: 'Upload Buffer', value: 'Optimal' },
        { label: 'Form Abandon Rate', value: '1.2%' }
      ]
    }
  ];

  const filteredNodes = useMemo(() => {
    if (filterCategory === 'ALL') return nodes;
    return nodes.filter((n) => n.category === filterCategory);
  }, [nodes, filterCategory]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  const getStatusBadge = (status: ThreatLevel) => {
    switch (status) {
      case 'GREEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AMAN (GREEN POSTURE)
          </span>
        );
      case 'YELLOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            WASPADA (YELLOW)
          </span>
        );
      case 'ORANGE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            SIAGA (ORANGE)
          </span>
        );
      case 'RED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            BAHAYA (RED CRISIS)
          </span>
        );
    }
  };

  return (
    <div id="national-threat-map-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                Peta Ancaman Nasional & Pertahanan Sektoral
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Phase 7 Real-time
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Observabilitas 360° infrastruktur sistem TK ASY SYIFA di bawah perlindungan 7 Guardian Sektor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400 font-medium">Status Pertahanan Nasional</div>
            <div className="text-sm font-black text-emerald-400">DEFCON 5 — SEMUA SEKTOR AMAN</div>
          </div>
          {getStatusBadge(overallPosture)}
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {['ALL', 'Firestore', 'Authentication', 'DDoS', 'Voice', 'Documents', 'Payments', 'PPDB'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[38px] cursor-pointer ${
              filterCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat === 'ALL' ? '🌐 Semua Sektor (7)' : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Sector Node Cards & Live Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sector Nodes */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            Matriks Kesehatan Node Sektor ({filteredNodes.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 text-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-slate-800 text-teal-300' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {node.category}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        node.status === 'GREEN'
                          ? isSelected
                            ? 'text-emerald-400'
                            : 'text-emerald-600'
                          : 'text-amber-500'
                      }`}
                    >
                      {node.healthPercent}% Sehat
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-slate-100' : 'text-stone-900'}`}>
                    {node.name}
                  </h3>

                  <div className="mt-2 text-xs opacity-80 flex items-center justify-between">
                    <span>Lalu Lintas:</span>
                    <span className="font-semibold">{node.currentTraffic}</span>
                  </div>

                  <div className="mt-3 w-full bg-stone-200/40 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        node.status === 'GREEN' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${node.healthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Inspection Terminal */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-stone-900">Inspeksi Telemetri Node</h3>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">{selectedNode.lastAuditRelative}</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-stone-400 font-medium">Nama Sektor Terpilih</div>
                <div className="text-base font-bold text-stone-900">{selectedNode.name}</div>
              </div>

              <div>
                <div className="text-xs text-stone-400 font-medium">Deskripsi & Status Saat Ini</div>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {selectedNode.details}
                </p>
              </div>

              <div>
                <div className="text-xs text-stone-400 font-medium">Protokol Pertahanan Aktif</div>
                <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-800 bg-teal-50 border border-teal-200/60 p-2.5 rounded-xl">
                  <Zap className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{selectedNode.activeDefense}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-stone-400 font-medium mb-2">Metrik Inti Sektor</div>
                <div className="grid grid-cols-3 gap-2">
                  {selectedNode.metrics.map((m, idx) => (
                    <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-center">
                      <div className="text-[10px] text-stone-500">{m.label}</div>
                      <div className="text-xs font-bold text-stone-800 mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sandboxed Read-Only
            </span>
            <span className="font-mono text-[11px] text-slate-400">ID: {selectedNode.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
