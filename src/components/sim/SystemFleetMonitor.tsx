import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Terminal, 
  Cpu, 
  HardDrive, 
  Database, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter, 
  Send, 
  RefreshCw, 
  Zap, 
  Eye, 
  Lock, 
  MessageSquare, 
  UserCheck, 
  Sliders, 
  Wifi, 
  Radio, 
  Bot,
  Building2,
  Clock
} from 'lucide-react';
import { TenantSchool, MOCK_TENANTS } from './TenantOverview';

export interface FleetAlert {
  id: string;
  tenantId: string;
  schoolName: string;
  type: 'BACKUP_FAIL' | 'STORAGE_FULL' | 'SUSPICIOUS_LOGIN' | 'QR_MISMATCH' | 'SYNC_DELAY';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  details: string;
  resolved: boolean;
  aiRecommendation: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  schoolName: string;
  senderName: string;
  senderRole: string;
  category: 'Billing & License' | 'Printer / QR' | 'Storage / Media' | 'Akun Guru' | 'Lainnya';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  aiSummary: string;
}

const INITIAL_ALERTS: FleetAlert[] = [
  {
    id: 'alt-001',
    tenantId: 'tenant-darunnajah-04',
    schoolName: 'TK Islam Darunnajah 8',
    type: 'BACKUP_FAIL',
    severity: 'CRITICAL',
    timestamp: '14 Agustus 2026, 06:15 WIB',
    details: 'Snapshot database mingguan gagal karena batas timeout koneksi ISP lokal terputus saat upload arsip video.',
    resolved: false,
    aiRecommendation: 'Trigger Autonomous Snapshot Retry via Remote Assistance dengan chunk size 5MB.'
  },
  {
    id: 'alt-002',
    tenantId: 'tenant-melati-02',
    schoolName: 'TK Terpadu Melati Ceria',
    type: 'STORAGE_FULL',
    severity: 'WARNING',
    timestamp: '14 Agustus 2026, 04:30 WIB',
    details: 'Penggunaan media gallery mencapai 88% dari kuota 20GB Starter Trial.',
    resolved: false,
    aiRecommendation: 'Tawarkan upgrade paket Pro Islamic Suite atau aktifkan auto-compress media foto anak.'
  },
  {
    id: 'alt-003',
    tenantId: 'tenant-al-azhar-03',
    schoolName: 'TK Islam Al-Azhar Syarif',
    type: 'SUSPICIOUS_LOGIN',
    severity: 'INFO',
    timestamp: '13 Agustus 2026, 23:10 WIB',
    details: 'Percobaan login admin dari IP asing (36.88.x.x) di luar jam operasional. Terverifikasi 2FA sukses.',
    resolved: true,
    aiRecommendation: 'Status aman. Token 2FA diverifikasi dalam rentang waktu toleransi.'
  }
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-801',
    tenantId: 'tenant-darunnajah-04',
    schoolName: 'TK Islam Darunnajah 8',
    senderName: 'Ahmad Fauzi (Tata Usaha)',
    senderRole: 'ADMIN',
    category: 'Storage / Media',
    subject: 'Gagal backup otomatis snapshot rapor santri',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: '14 Agustus 2026, 07:00 WIB',
    aiSummary: 'Admin melaporkan pesan error saat melakukan snapshot rutin. Diakibatkan connection drop, dapat diselesaikan dengan remote trigger.'
  },
  {
    id: 'tkt-802',
    tenantId: 'tenant-melati-02',
    schoolName: 'TK Terpadu Melati Ceria',
    senderName: 'Dra. Hj. Nurul Hidayati',
    senderRole: 'KEPALA_SEKOLAH',
    category: 'Billing & License',
    subject: 'Permintaan invoice upgrade ke paket Pro Islamic 1 Tahun',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '13 Agustus 2026, 15:30 WIB',
    aiSummary: 'Masa trial tersisa 7 hari, sekolah mengajukan aktivasi lisensi tahunan untuk 85 santri.'
  }
];

export const SystemFleetMonitor: React.FC<{
  targetTenant?: TenantSchool | null;
  onClearTargetTenant?: () => void;
}> = ({ targetTenant, onClearTargetTenant }) => {
  const [alerts, setAlerts] = useState<FleetAlert[]>(INITIAL_ALERTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState<'FLEET_ALERTS' | 'SUPPORT_CENTER' | 'REMOTE_ASSIST' | 'GROWTH'>('FLEET_ALERTS');

  // Remote Diagnostic Simulator
  const [remoteConsoleLogs, setRemoteConsoleLogs] = useState<string[]>([
    '[INIT] Diagnostic Remote Tunnel (R124) Ready.',
    '[AUTH] Super Admin Session HMAC-SHA256 Authenticated.',
    '[POLICY] Strict RBAC Mode: Data Pribadi Murid/Ortu Terenkripsi & Terisolasi.'
  ]);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [selectedTenantForAssist, setSelectedTenantForAssist] = useState<TenantSchool>(
    targetTenant || MOCK_TENANTS[0]
  );

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    alert('[Guardian Fleet R126] Insiden berhasil ditandai selesai dan dicatat ke Immutable Audit Log.');
  };

  const handleRunRemoteDiagnostic = (action: string) => {
    setIsDiagnosing(true);
    const ts = new Date().toLocaleTimeString('id-ID');
    setTimeout(() => {
      setIsDiagnosing(false);
      setRemoteConsoleLogs(prev => [
        `[${ts}] REMOTE_EXEC: ${action} on ${selectedTenantForAssist.tenantId} -> SUCCESS (0 Errors)`,
        `[${ts}] Latency: 12ms | DB Integrity: 100% OK | Backup Node: Synchronized`,
        ...prev
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              R126 • Guardian Fleet Monitor
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              R124 Remote Assistance
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Guardian Fleet, Support Center & Remote Diagnostics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pemantauan anomali lintas tenant, penyelesaian tiket bantuan dengan ringkasan AI, dan eksekusi diagnostik tanpa melanggar privasi data RBAC.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs">
          {[
            { id: 'FLEET_ALERTS', label: 'Fleet Alerts', icon: AlertTriangle, count: alerts.filter(a => !a.resolved).length },
            { id: 'SUPPORT_CENTER', label: 'Support Center', icon: HelpCircle, count: tickets.filter(t => t.status !== 'RESOLVED').length },
            { id: 'REMOTE_ASSIST', label: 'Remote Assist', icon: Terminal },
            { id: 'GROWTH', label: 'Growth Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Guardian Fleet Alerts (Phase 8 - R126) */}
      {activeTab === 'FLEET_ALERTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50">
              <div className="text-xs font-bold text-rose-800 dark:text-rose-300">Anomali Kritis (Critical)</div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {alerts.filter(a => a.severity === 'CRITICAL' && !a.resolved).length} Insiden
              </div>
              <div className="text-[11px] text-rose-700/80 dark:text-rose-400 mt-0.5">Memerlukan tindakan segera</div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300">Peringatan Kuota / SLA (Warning)</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {alerts.filter(a => a.severity === 'WARNING' && !a.resolved).length} Tenant
              </div>
              <div className="text-[11px] text-amber-700/80 dark:text-amber-400 mt-0.5">Storage & Trial milestones</div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Fleet Status Uptime</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">99.98%</div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-0.5">Seluruh node aktif normal</div>
            </div>
          </div>

          {/* Alert List */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Daftar Anomali & Insiden Fleet Real-Time</span>
            </h3>

            <div className="space-y-3">
              {alerts.map(a => (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border transition-all ${
                    a.resolved
                      ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                      : a.severity === 'CRITICAL'
                      ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60'
                      : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          a.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {a.type}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {a.schoolName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">({a.tenantId})</span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 pt-0.5">
                        {a.details}
                      </p>

                      <div className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Rekomendasi AI Asy:</strong> {a.aiRecommendation}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                      {!a.resolved ? (
                        <button
                          onClick={() => handleResolveAlert(a.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai Selesai</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terselesaikan</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tenant Support Center (Phase 5 - R123) */}
      {activeTab === 'SUPPORT_CENTER' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>R123 • Tenant Support Center & Tiket Bantuan</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pusat pengaduan dan eskalasi kendala operasional dari seluruh kepala sekolah dan admin TU.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600">{t.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {t.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Priority: {t.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">{t.subject}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Dari: <strong>{t.senderName}</strong> ({t.schoolName}) • {t.createdAt}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black self-start ${
                    t.status === 'OPEN' ? 'bg-rose-100 text-rose-800' : t.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <Bot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>AI Asy Auto-Analysis:</strong> {t.aiSummary}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => alert(`[Tiket Bantuan ${t.id}] Membuka kanal Living Messenger darurat dengan ${t.senderName}`)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold"
                  >
                    Hubungi PIC
                  </button>
                  <button
                    onClick={() => {
                      setTickets(prev => prev.map(item => item.id === t.id ? { ...item, status: 'RESOLVED' } : item));
                      alert(`[Tiket ${t.id}] Berhasil diselesaikan.`);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Remote Assistance Console (Phase 6 - R124) */}
      {activeTab === 'REMOTE_ASSIST' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span>R124 • Remote Assistance & Diagnostik Namespace</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemeriksaan kesehatan teknis tenant dari jarak jauh tanpa pelanggaran RBAC privasi data pribadi.
              </p>
            </div>

            {/* Tenant Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Target Tenant:</span>
              <select
                value={selectedTenantForAssist.id}
                onChange={(e) => {
                  const found = MOCK_TENANTS.find(m => m.id === e.target.value);
                  if (found) setSelectedTenantForAssist(found);
                }}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                {MOCK_TENANTS.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.tenantId})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Action Matrix for Remote Assist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => handleRunRemoteDiagnostic('Trigger Autonomous Snapshot Backup')}
              disabled={isDiagnosing}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
            >
              <HardDrive className="w-4 h-4 text-indigo-600 mb-1.5" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Trigger Snapshot Backup</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Paksa snapshot Firestore namespace</div>
            </button>

            <button
              onClick={() => handleRunRemoteDiagnostic('Deep Integrity DB Scan')}
              disabled={isDiagnosing}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
            >
              <Database className="w-4 h-4 text-emerald-600 mb-1.5" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Deep Integrity DB Scan</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Periksa checksum skema koleksi</div>
            </button>

            <button
              onClick={() => handleRunRemoteDiagnostic('Flush Expired QR Tokens')}
              disabled={isDiagnosing}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
            >
              <Zap className="w-4 h-4 text-purple-600 mb-1.5" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Flush Expired QR Tokens</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Bersihkan token kedaluwarsa R106</div>
            </button>

            <button
              onClick={() => handleRunRemoteDiagnostic('Benchmark Network & Latency')}
              disabled={isDiagnosing}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
            >
              <Activity className="w-4 h-4 text-amber-600 mb-1.5" />
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Benchmark Latency</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Uji responsif server & cloud ingress</div>
            </button>
          </div>

          {/* Terminal Stream Console */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 max-h-48 overflow-y-auto">
            <div className="text-slate-500 text-[10px] flex items-center justify-between border-b border-slate-800 pb-1">
              <span>-- TADE REMOTE DIAGNOSTIC ENGINE (R124) --</span>
              <span>{isDiagnosing ? 'EXECUTING TASK...' : 'STANDBY'}</span>
            </div>
            {remoteConsoleLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: School Growth Analytics (Phase 9 - R127) */}
      {activeTab === 'GROWTH' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>R127 • School Growth Analytics (Agregat Ekosistem)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analisis pertumbuhan jumlah santri, rasio guru, dan tingkat adopsi fitur dari seluruh sekolah tanpa membuka dashboard satu per satu.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Total Santri Aktif</div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {MOCK_TENANTS.reduce((acc, curr) => acc + curr.metrics.totalStudents, 0)}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">+16.4% Rata-rata Pertumbuhan</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Total Pendidik / Guru</div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {MOCK_TENANTS.reduce((acc, curr) => acc + curr.metrics.totalTeachers, 0)} Guru
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Rasio Santri/Guru: 9.2:1</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Total Storage Digunakan</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {MOCK_TENANTS.reduce((acc, curr) => acc + curr.metrics.storageUsedGb, 0).toFixed(1)} GB
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Dari Kuota 360 GB Fleet</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Adopsi Fitur Rata-Rata</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {Math.round(MOCK_TENANTS.reduce((acc, curr) => acc + curr.metrics.featureAdoptionPct, 0) / MOCK_TENANTS.length)}%
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">High Engagement Level</div>
            </div>
          </div>

          {/* School Comparative Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 font-bold">Nama Sekolah</th>
                  <th className="p-3 font-bold">Santri</th>
                  <th className="p-3 font-bold">Pertumbuhan</th>
                  <th className="p-3 font-bold">Guru</th>
                  <th className="p-3 font-bold">Storage</th>
                  <th className="p-3 font-bold">Wali Aktif/Hari</th>
                  <th className="p-3 font-bold">Adopsi Fitur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_TENANTS.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{t.name}</td>
                    <td className="p-3">{t.metrics.totalStudents}</td>
                    <td className="p-3 text-emerald-600 font-bold">+{t.metrics.studentGrowthPct}%</td>
                    <td className="p-3">{t.metrics.totalTeachers}</td>
                    <td className="p-3 font-mono">{t.metrics.storageUsedGb} GB</td>
                    <td className="p-3">{t.metrics.dailyActiveParents}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {t.metrics.featureAdoptionPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
