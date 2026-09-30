import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  RefreshCw,
  Server,
  Zap,
  Lock,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface IncidentEvent {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  source: string;
  status: 'RESOLVED' | 'INVESTIGATING' | 'MONITORING';
  details: string;
}

export const GuardianMissionControl: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'services' | 'readiness' | 'correlation'>('timeline');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const incidents: IncidentEvent[] = [
    {
      id: 'INC-201',
      timestamp: '15 Agt 2026, 10:14 WIB',
      severity: 'INFO',
      title: 'Validasi Snapshot Coldline Berhasil',
      source: 'Disaster Recovery Daemon',
      status: 'RESOLVED',
      details: 'Integritas snapshot hash SHA-256 terverifikasi 100% cocok dengan index master.'
    },
    {
      id: 'INC-202',
      timestamp: '15 Agt 2026, 08:30 WIB',
      severity: 'LOW',
      title: 'Lonjakan Akses Presensi Pagi Santri',
      source: 'Traffic Sentinel',
      status: 'RESOLVED',
      details: '248 presensi tercatat dalam 15 menit. Latensi query stabil pada rentang 18-24ms.'
    },
    {
      id: 'INC-203',
      timestamp: '14 Agt 2026, 22:40 WIB',
      severity: 'INFO',
      title: 'Quiet Background Sleep Berjalan Normal',
      source: 'Battery Care Monitor',
      status: 'RESOLVED',
      details: 'Sesi browser non-aktif memasuki mode zero-polling tanpa memory leak.'
    }
  ];

  const services = [
    { name: 'Multi-Tenant Firestore Mesh', uptime: '99.99%', status: 'OPERATIONAL', latency: '19ms' },
    { name: 'WhatsApp Guardian Webhook', uptime: '99.95%', status: 'OPERATIONAL', latency: '110ms' },
    { name: 'Payment Core & VA Reconciliation', uptime: '100.00%', status: 'OPERATIONAL', latency: '45ms' },
    { name: 'Smart PDF Generator Engine', uptime: '99.98%', status: 'OPERATIONAL', latency: '85ms' },
    { name: 'AI Asy Cognitive Runtime', uptime: '99.92%', status: 'OPERATIONAL', latency: '140ms' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Guardian Mission Control</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Defcon-1 Normal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat komando keamanan platform, linimasa insiden real-time, korelasi event Guardian, dan kesiapan pemulihan darurat.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          Segarkan Status
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          Linimasa Keamanan
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'services' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          Status Layanan Langsung ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('readiness')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'readiness' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Kesiapan Pemulihan (Hot-Standby)
        </button>
        <button
          onClick={() => setActiveTab('correlation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'correlation' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Korelasi Sinyal Guardian
        </button>
      </div>

      {/* TAB: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Riwayat Peristiwa & Intervensi Guardian</h2>
            <span className="text-xs text-slate-400 font-mono">Real-time Stream Active</span>
          </div>

          <div className="space-y-3">
            {incidents.map(inc => (
              <div key={inc.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {inc.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800">{inc.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] text-slate-400 font-mono">{inc.timestamp}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {inc.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{inc.details}</p>

                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Modul Sumber: <strong className="text-slate-600">{inc.source}</strong></span>
                  <span className="font-semibold text-slate-500 uppercase">{inc.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Services */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800">Status Kesehatan Komponen Inti (Microservices)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Uptime SLA: {s.uptime}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {s.status}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">{s.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Readiness */}
      {activeTab === 'readiness' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Sertifikasi Kesiapan Pemulihan Bencana (RTO &lt; 5 Menit)</h2>
              <p className="text-xs text-slate-500">Mekanisme auto-failover dan validasi integritas cadangan data.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400">RPO (Recovery Point):</span>
              <div className="text-base font-bold text-slate-800 mt-1">&lt; 15 Menit</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Snapshot incremental otomatis.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400">RTO (Recovery Time):</span>
              <div className="text-base font-bold text-slate-800 mt-1">&lt; 5 Menit</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Hot-standby container cluster.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400">Integritas Enkripsi:</span>
              <div className="text-base font-bold text-emerald-600 mt-1">AES-256-GCM</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Air-gapped verification.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Correlation */}
      {activeTab === 'correlation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800">Matriks Korelasi Sinyal & Mitigasi Cerdas</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">Korelasi Sinyal Auth + Pembayaran</div>
                <p className="text-slate-500 mt-0.5">Sinkronisasi status lunas SPP langsung memicu pembukaan akses kartu ujian tanpa delay.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">Korelasi Presensi + Notifikasi Orang Tua</div>
                <p className="text-slate-500 mt-0.5">Absensi ketidakhadiran santri otomatis diverifikasi dengan data pengajuan izin buku penghubung.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
