import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ChevronRight,
  Database,
  Lock,
  Flame,
  Search,
  Sliders,
  DollarSign
} from 'lucide-react';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const FounderInsightDashboard: React.FC<Props> = ({ onSelectModule }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'licenses' | 'mesh' | 'guardian'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [searchTenant, setSearchTenant] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const tenants = [
    {
      id: 'asy-syifa-pusat',
      name: 'TK Islam Asy-Syifa (Pusat)',
      city: 'Jakarta Selatan',
      tier: 'ENTERPRISE_SOVEREIGN',
      students: 248,
      teachers: 18,
      mrr: 18500000,
      growth: '+14.2%',
      health: 99.8,
      status: 'ACTIVE',
      lastBackup: '5 menit lalu',
      expiresIn: '342 hari'
    },
    {
      id: 'asy-syifa-cb1',
      name: 'TK Asy-Syifa Mandiri (Cabang 1)',
      city: 'Tangerang Selatan',
      tier: 'ENTERPRISE_PRO',
      students: 186,
      teachers: 14,
      mrr: 12400000,
      growth: '+9.8%',
      health: 99.4,
      status: 'ACTIVE',
      lastBackup: '18 menit lalu',
      expiresIn: '280 hari'
    },
    {
      id: 'asy-syifa-cb2',
      name: 'TK Asy-Syifa Cendekia (Cabang 2)',
      city: 'Bekasi Barat',
      tier: 'GROWTH',
      students: 112,
      teachers: 9,
      mrr: 7500000,
      growth: '+22.5%',
      health: 98.9,
      status: 'ACTIVE',
      lastBackup: '42 menit lalu',
      expiresIn: '195 hari'
    },
    {
      id: 'partner-nurul-huda',
      name: 'RA Nurul Huda Nusantara',
      city: 'Depok',
      tier: 'GROWTH',
      students: 94,
      teachers: 8,
      mrr: 6200000,
      growth: '+6.1%',
      health: 99.1,
      status: 'ACTIVE',
      lastBackup: '1 jam lalu',
      expiresIn: '140 hari'
    },
    {
      id: 'partner-al-fatih',
      name: 'PAUD IT Al-Fatih Pratama',
      city: 'Bogor',
      tier: 'PILOT_STAGE',
      students: 65,
      teachers: 6,
      mrr: 4100000,
      growth: '+31.0%',
      health: 97.5,
      status: 'TRIAL_EXPIRING',
      lastBackup: '3 jam lalu',
      expiresIn: '12 hari'
    }
  ];

  const meshNodes = [
    { name: 'ID-JKT-EDGE-01', location: 'Jakarta DC (Tier-4)', latency: '14ms', cpu: '28%', mem: '42%', load: 'Optimal', status: 'ONLINE' },
    { name: 'SG-SIN-CORE-02', location: 'Singapore Hub (Cross-Sync)', latency: '32ms', cpu: '34%', mem: '48%', load: 'Optimal', status: 'ONLINE' },
    { name: 'ID-SBY-RELAY-03', location: 'Surabaya Regional Cache', latency: '22ms', cpu: '19%', mem: '31%', load: 'Idle', status: 'ONLINE' },
    { name: 'ID-BDG-BACKUP-04', location: 'Bandung Disaster Recovery', latency: '26ms', cpu: '12%', mem: '24%', load: 'Standby', status: 'ONLINE' }
  ];

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTenant.toLowerCase()) || 
    t.city.toLowerCase().includes(searchTenant.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5" /> Founder Sovereign Layer • R151
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Founder Insight & Fleet Intelligence
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Pemantauan kesehatan ekosistem makro, pertumbuhan tenant sekolah, metrik lisensi, status cloud mesh, dan jaminan integritas Konstitusi TADE v12.2.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition flex items-center gap-2 ${isRefreshing ? 'opacity-75' : ''}`}
              title="Segarkan Data Real-time"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {onSelectModule && (
              <button
                onClick={() => onSelectModule('r139')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Founder Vault</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Santri Terdaftar</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">705 <span className="text-xs font-normal text-emerald-400 font-sans">+18.4% MoM</span></div>
            <div className="text-xs text-slate-400 mt-1">Tersebar di 5 Sekolah TADE</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Gross Volume SPP (MTD)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">Rp 48,7 Jt</div>
            <div className="text-xs text-slate-400 mt-1">96.2% Rekonsiliasi Otomatis</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Fleet Platform Uptime</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">99.98%</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> SLA Enterprise Tercapai
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Guardian Security Index</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 mt-2">Defcon-1</div>
            <div className="text-xs text-slate-400 mt-1">Zero Breach • Root Terkunci</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          Ringkasan Eksekutif
        </button>
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tenants'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Pertumbuhan Tenant ({tenants.length})
        </button>
        <button
          onClick={() => setActiveTab('licenses')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'licenses'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          Kesehatan Lisensi
        </button>
        <button
          onClick={() => setActiveTab('mesh')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mesh'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          Infrastruktur Mesh ({meshNodes.length} Nodes)
        </button>
        <button
          onClick={() => setActiveTab('guardian')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'guardian'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Guardian Health Log
        </button>
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Growth & Volume Curve */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Pertumbuhan Armada & Adopsi Digital</h2>
                  <p className="text-xs text-slate-500">Trajektori pendaftaran santri dan transaksi SPP multi-tenant</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['7d', '30d', '90d', '1y'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPeriod(p)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                        selectedPeriod === p ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Bars Simulation */}
              <div className="space-y-4">
                {[
                  { month: 'Mei 2026', santri: 520, volume: 36.4, pct: 65 },
                  { month: 'Jun 2026', santri: 590, volume: 41.2, pct: 75 },
                  { month: 'Jul 2026', santri: 660, volume: 45.8, pct: 88 },
                  { month: 'Agt 2026 (Aktif)', santri: 705, volume: 48.7, pct: 95 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span className="font-semibold text-slate-800">{item.month}</span>
                      <span>{item.santri} Santri • Rp {item.volume} Jt</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +28.5% Pertumbuhan Tahunan (YoY)
                </span>
                <span>Proyeksi Q4: Target 1.000 Santri di 8 Sekolah</span>
              </div>
            </div>

            {/* Quick Strategic Actions */}
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-base font-bold text-indigo-950 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                Rekomendasi Strategis Founder
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-xs">
                  <div className="font-semibold text-slate-800 mb-1">Upgrade Lisensi PAUD IT Al-Fatih</div>
                  <p className="text-slate-600">Masa trial berakhir dalam 12 hari. Otomatisasi pengiriman invoice diskon awal tahun ajaran.</p>
                  <button className="mt-2 text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                    Kirim Penawaran Pro <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-xs">
                  <div className="font-semibold text-slate-800 mb-1">Replikasi Template Asy-Syifa Pusat</div>
                  <p className="text-slate-600">Template SPP dan RPP Asy-Syifa Pusat telah divalidasi 100%. Terbitkan ke Marketplace TADE.</p>
                  <button 
                    onClick={() => onSelectModule && onSelectModule('r146')}
                    className="mt-2 text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    Buka Marketplace <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fleet Status & Integrity */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Status Integritas Konstitusi
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Versi Konstitusi</span>
                  <span className="font-bold text-indigo-600">TADE v12.2</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Discovery Registry</span>
                  <span className="font-bold text-emerald-600">100% LOCK (70/70)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Isolated Namespaces</span>
                  <span className="font-bold text-slate-800">5 Tenant Active</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Air-Gapped Sovereign</span>
                  <span className="font-bold text-emerald-600">VERIFIED SAFE</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Zero Overwrite Certified:</strong> Seluruh modul terkunci (db.ts, RBAC, Payment, Guardian) beroperasi tanpa modifikasi tidak sah.
                </div>
              </div>
            </div>

            {/* Quick Tenant List Mini */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-800">Top Sekolah TADE</h2>
                <button
                  onClick={() => setActiveTab('tenants')}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-2.5">
                {tenants.slice(0, 3).map(t => (
                  <div key={t.id} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.students} Santri • {t.city}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Tenants */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama sekolah atau kota..."
                value={searchTenant}
                onChange={e => setSearchTenant(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan {filteredTenants.length} dari {tenants.length} institusi sekolah
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {t.tier.replace('_', ' ')}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1">{t.name}</h2>
                    <p className="text-xs text-slate-500">{t.city}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {t.status === 'ACTIVE' ? 'Aktif' : 'Trial'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400">Total Santri:</span>
                    <p className="font-bold text-slate-800">{t.students} Anak</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Tenaga Pendidik:</span>
                    <p className="font-bold text-slate-800">{t.teachers} Guru</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Kesehatan SIM:</span>
                    <p className="font-bold text-emerald-600">{t.health}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Backup Terakhir:</span>
                    <p className="font-bold text-slate-700">{t.lastBackup}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sisa Lisensi: <strong className="text-slate-800">{t.expiresIn}</strong></span>
                  <span className="font-bold text-indigo-600">{t.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Licenses */}
      {activeTab === 'licenses' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Manajemen Lisensi Ekosistem TADE</h2>
              <p className="text-xs text-slate-500">Distribusi lisensi, siklus perpanjangan otomatis, dan status kepatuhan tenant</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition shadow-sm">
              + Generate Kunci Lisensi Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Sekolah</th>
                  <th className="py-3 px-4">Paket Lisensi</th>
                  <th className="py-3 px-4">Batas Santri</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{t.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {t.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {t.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {t.students} / {t.tier.includes('ENTERPRISE') ? 'Unlimited' : '250'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{t.expiresIn}</div>
                      <div className="text-[10px] text-slate-400">Auto-renewal aktif</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                        t.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {t.status === 'ACTIVE' ? 'Verified' : 'Review'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Mesh Infrastructure */}
      {activeTab === 'mesh' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Status Global Infrastructure & Cloud Edge</h2>
            <p className="text-xs text-slate-500 mb-6">Pemantauan latensi, pemanfaatan memori, dan cluster sinkronisasi real-time</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meshNodes.map((node, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-800 text-sm font-mono">{node.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {node.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">{node.location}</p>

                  <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-200 pt-3">
                    <div>
                      <span className="text-slate-400">Latensi:</span>
                      <p className="font-bold text-indigo-600">{node.latency}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">CPU:</span>
                      <p className="font-bold text-slate-700">{node.cpu}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Memori:</span>
                      <p className="font-bold text-slate-700">{node.mem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Guardian Health */}
      {activeTab === 'guardian' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Guardian Sentinel Audit Log</h2>
              <p className="text-xs text-slate-500">Catatan telemetri perlindungan root, deteksi anomali, dan integritas multi-tenant</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              0 Security Anomalies
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '10:42:15 WIB', type: 'INTEGRITY_CHECK', text: 'Discovery Registry v1.5.0-RC18 validated with 70/70 LOCK status.', status: 'PASS' },
              { time: '10:15:00 WIB', type: 'ROOT_ISOLATION', text: 'Founder Exclusive Layer checked. Zero menu leaks detected across all 5 active school tenants.', status: 'PASS' },
              { time: '09:30:22 WIB', type: 'BACKUP_SYNC', text: 'Automated encrypted snapshot completed for TK Asy-Syifa Pusat. Hash valid.', status: 'PASS' },
              { time: '08:00:11 WIB', type: 'PERFORMANCE_GATE', text: 'Feather lightweight benchmark passed on low-end client device profile.', status: 'PASS' }
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 font-mono mr-2">[{log.time}]</span>
                    <span className="text-slate-600">{log.text}</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-600 font-mono">{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
