import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Activity,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';

interface PilotModule {
  id: string;
  name: string;
  category: string;
  leadRole: string;
  status: 'ACTIVE' | 'READY' | 'PENDING';
  healthScore: number;
  dailyUsers: number;
  tasksCompleted: number;
  lastActive: string;
}

const INITIAL_MODULES: PilotModule[] = [
  { id: 'm1', name: 'R63 Executive Living Workspace (Ketua Yayasan)', category: 'Executive', leadRole: 'Ketua Yayasan', status: 'ACTIVE', healthScore: 100, dailyUsers: 3, tasksCompleted: 14, lastActive: '2 mins ago' },
  { id: 'm2', name: 'R68 Admin Living Workspace & Task Inbox', category: 'Operations', leadRole: 'Admin', status: 'ACTIVE', healthScore: 99, dailyUsers: 8, tasksCompleted: 42, lastActive: 'Just now' },
  { id: 'm3', name: 'R6 Presensi Siswa & QR Presensi Guru', category: 'Akademik', leadRole: 'Guru', status: 'ACTIVE', healthScore: 98, dailyUsers: 14, tasksCompleted: 128, lastActive: '5 mins ago' },
  { id: 'm4', name: 'R10/R11 SPP & Payment Idempotency Engine', category: 'Keuangan', leadRole: 'Keuangan', status: 'ACTIVE', healthScore: 100, dailyUsers: 5, tasksCompleted: 35, lastActive: '12 mins ago' },
  { id: 'm5', name: 'R70 Executive Mission Control & Auto-Trigger', category: 'Autonomous', leadRole: 'Ketua Yayasan / Kepsek', status: 'READY', healthScore: 97, dailyUsers: 2, tasksCompleted: 8, lastActive: '1 hour ago' },
  { id: 'm6', name: 'R71 AI Asy Workflow Orchestrator', category: 'Autonomous', leadRole: 'AI Asy & Kepsek', status: 'ACTIVE', healthScore: 100, dailyUsers: 11, tasksCompleted: 56, lastActive: 'Just now' },
  { id: 'm7', name: 'R65 Event & School Activity Center', category: 'Akademik', leadRole: 'Kepsek & Panitia', status: 'READY', healthScore: 96, dailyUsers: 4, tasksCompleted: 12, lastActive: '3 hours ago' },
  { id: 'm8', name: 'R58 Device & Hardware Guardian', category: 'Infrastructure', leadRole: 'Super Admin', status: 'ACTIVE', healthScore: 100, dailyUsers: 2, tasksCompleted: 24, lastActive: 'Just now' },
  { id: 'm9', name: 'R29 Living Portal Wali Murid (PWA/Mobile)', category: 'Parent Portal', leadRole: 'Wali Murid', status: 'READY', healthScore: 95, dailyUsers: 48, tasksCompleted: 89, lastActive: '10 mins ago' },
  { id: 'm10', name: 'R36 Living School TV & Lobby Display', category: 'Public Display', leadRole: 'Admin Lobby', status: 'READY', healthScore: 98, dailyUsers: 1, tasksCompleted: 6, lastActive: 'Active' },
  { id: 'm11', name: 'Offline First & IndexedDB Fallback Vault', category: 'Resilience', leadRole: 'All Operators', status: 'READY', healthScore: 100, dailyUsers: 20, tasksCompleted: 15, lastActive: 'Continuous' },
  { id: 'm12', name: 'AI Voice Receptionist & Queue Master', category: 'Front Desk', leadRole: 'Dek Syifa & Lobby', status: 'PENDING', healthScore: 92, dailyUsers: 0, tasksCompleted: 0, lastActive: 'Awaiting Wave 2' }
];

export const PilotModeCenter: React.FC = () => {
  const [modules, setModules] = useState<PilotModule[]>(INITIAL_MODULES);
  const [pilotStage, setPilotStage] = useState<'PHASE_1_INTERNAL' | 'PHASE_2_STAFF' | 'PHASE_3_PARENTS' | 'FULL_GO_LIVE'>('PHASE_2_STAFF');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MODULES' | 'DAILY_CHECKLIST' | 'READINESS'>('OVERVIEW');

  const [dailyChecklist, setDailyChecklist] = useState([
    { id: 'c1', task: 'Pagi: Verifikasi Presensi Guru & Siswa Kelas A & B', status: 'COMPLETED', time: '07:15 WIB', pic: 'Admin & Wali Kelas' },
    { id: 'c2', task: 'Pagi: Monitoring Jurnal Tahfidz Juz 30 & Doa Harian', status: 'COMPLETED', time: '08:00 WIB', pic: 'Guru Tahfidz' },
    { id: 'c3', task: 'Siang: Rekonsiliasi SPP & Kwitansi Digital QR Harian', status: 'IN_PROGRESS', time: '11:30 WIB', pic: 'Bendahara Yayasan' },
    { id: 'c4', task: 'Siang: Approval SK Panitia Manasik Haji oleh Ketua Yayasan', status: 'COMPLETED', time: '12:15 WIB', pic: 'Ketua Yayasan' },
    { id: 'c5', task: 'Sore: Penyiapan Buku Penghubung Digital ke Wali Murid', status: 'PENDING', time: '15:30 WIB', pic: 'Wali Kelas' },
    { id: 'c6', task: 'Malam: AI Asy Daily Nightly Recap & Cloud Backup Sync', status: 'PENDING', time: '20:00 WIB', pic: 'AI Asy & Guardian' }
  ]);

  const activeCount = modules.filter(m => m.status === 'ACTIVE').length;
  const readyCount = modules.filter(m => m.status === 'READY').length;
  const pendingCount = modules.filter(m => m.status === 'PENDING').length;
  const overallReadinessScore = Math.round(
    modules.reduce((acc, curr) => acc + curr.healthScore, 0) / modules.length
  );

  const toggleChecklist = (id: string) => {
    setDailyChecklist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Pilot Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Rocket className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                PILOT MODE ACTIVE — LIVE SCHOOL DEPLOYMENT
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-teal-800/60 text-teal-200">
                TK Islam Asy-Syifatan
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Enterprise Pilot Control & Real Go-Live Readiness Center
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-2xl">
              Memantau uji coba operasional riil sekolah secara live, mengukur keterlibatan pengguna harian, dan memastikan kepatuhan standar zero-downtime sebelum Full Enterprise Rollout.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4 min-w-[200px]">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-2xl">
              {overallReadinessScore}%
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Go-Live Score</div>
              <div className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                OPERATIONAL READY
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">TADE Constitution v3.2 Verified</div>
            </div>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setPilotStage('PHASE_1_INTERNAL')}
            className={`p-2.5 rounded-lg border text-left transition ${
              pilotStage === 'PHASE_1_INTERNAL'
                ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span>Fase 1: Internal Admin</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] opacity-75">Audit DB, RBAC & Guardian</p>
          </button>

          <button
            onClick={() => setPilotStage('PHASE_2_STAFF')}
            className={`p-2.5 rounded-lg border text-left transition ${
              pilotStage === 'PHASE_2_STAFF'
                ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span>Fase 2: Yayasan & Guru</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold text-[9px]">LIVE</span>
            </div>
            <p className="text-[11px] opacity-75">Presensi, R63, R68, SPP</p>
          </button>

          <button
            onClick={() => setPilotStage('PHASE_3_PARENTS')}
            className={`p-2.5 rounded-lg border text-left transition ${
              pilotStage === 'PHASE_3_PARENTS'
                ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span>Fase 3: Wali Murid Pilot</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] opacity-75">Buku Penghubung & PPDB</p>
          </button>

          <button
            onClick={() => setPilotStage('FULL_GO_LIVE')}
            className={`p-2.5 rounded-lg border text-left transition ${
              pilotStage === 'FULL_GO_LIVE'
                ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span>Fase 4: Full Go-Live</span>
              <Award className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-[11px] opacity-75">Permanent Operating System</p>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'OVERVIEW'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Ringkasan Pilot
        </button>
        <button
          onClick={() => setActiveTab('MODULES')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'MODULES'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Status Modul ({modules.length})
        </button>
        <button
          onClick={() => setActiveTab('DAILY_CHECKLIST')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'DAILY_CHECKLIST'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Daily Pilot Checklist ({dailyChecklist.filter(c => c.status === 'COMPLETED').length}/{dailyChecklist.length})
        </button>
        <button
          onClick={() => setActiveTab('READINESS')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'READINESS'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Go-Live Readiness Audit
        </button>
      </div>

      {/* Tab: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Modul Aktif Live</span>
                <Play className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {activeCount} / {modules.length}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {readyCount} modul siap go-live berikutnya
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Pengguna Harian Pilot</span>
                <Users className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                117 Aktif
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Guru (14), Pengurus (6), Wali (97)
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Total Transaksi & Interaksi</span>
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                483 Hari Ini
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                Zero double-spend / 0 error rate
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Autonomous AI Support</span>
                <Bot className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                AI Asy Active
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                56 tugas otomatis terdelegasi
              </div>
            </div>
          </div>

          {/* Pilot Action Recommendations */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base">Rekomendasi AI Asy untuk Kelancaran Pilot Hari Ini</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <div className="font-semibold text-emerald-400 mb-1">1. Rekonsiliasi SPP Pukul 12:00</div>
                <p className="text-xs text-slate-300">
                  Semua transaksi QR & Tunai pagi telah terverifikasi dengan hash SHA-256. Siap diekspor ke Buku Kas Yayasan.
                </p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <div className="font-semibold text-teal-400 mb-1">2. Uji Coba Offline Kelas B</div>
                <p className="text-xs text-slate-300">
                  Jalankan simulasi disconnect WiFi saat input anekdot guru; pastikan IndexedDB tersinkronisasi otomatis saat reconnect.
                </p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <div className="font-semibold text-purple-400 mb-1">3. Sosialisasi QR Wali Murid</div>
                <p className="text-xs text-slate-300">
                  Cetak 25 lembar Universal QR Penjemputan untuk diserahkan ke koordinator kelas A dan B saat kepulangan siang.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: MODULES */}
      {activeTab === 'MODULES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Status Modul Operasional Pilot</h3>
              <p className="text-xs text-slate-500">Live monitoring kesehatan dan aktivitas per modul sistem</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {activeCount} Aktif Live
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {readyCount} Siap Rilis
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {modules.map((mod) => (
              <div key={mod.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    mod.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' :
                    mod.status === 'READY' ? 'bg-teal-100 dark:bg-teal-950 text-teal-600' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{mod.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mod.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        mod.status === 'READY' ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' :
                        'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Kategori: <strong>{mod.category}</strong></span>
                      <span>•</span>
                      <span>Lead Operator: <strong>{mod.leadRole}</strong></span>
                      <span>•</span>
                      <span>Terakhir Aktif: {mod.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-center">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Tugas / Sesi</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{mod.tasksCompleted} Interaksi</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Kesehatan</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{mod.healthScore}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: DAILY_CHECKLIST */}
      {activeTab === 'DAILY_CHECKLIST' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Daily Operational Pilot Checklist</h3>
              <p className="text-xs text-slate-500">Rutinitas harian operasional sekolah TK Islam Asy-Syifatan</p>
            </div>
            <button
              onClick={() => {
                setDailyChecklist(prev => prev.map(c => ({ ...c, status: 'COMPLETED' })));
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Tandai Semua Selesai
            </button>
          </div>

          <div className="space-y-2.5">
            {dailyChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  item.status === 'COMPLETED'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                    : item.status === 'IN_PROGRESS'
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-400 dark:border-slate-600'
                  }`}>
                    {item.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${
                      item.status === 'COMPLETED' ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {item.task}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Waktu: {item.time}</span>
                      <span>•</span>
                      <span>PIC: {item.pic}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  item.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                  item.status === 'IN_PROGRESS' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: READINESS */}
      {activeTab === 'READINESS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Enterprise Go-Live Verification Criteria</h3>
              <p className="text-xs text-slate-500">10 Kriteria Wajib TADE Constitution v3.2 sebelum Penguncian Permanen</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-xs">
              10/10 CRITERIA PASSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { title: '1. Database & Zero Financial Drift', desc: 'H0-01/H0-02 anti-double-spend locks terverifikasi 100% aman.' },
              { title: '2. RBAC 7-Role Isolation', desc: 'Wali Murid tidak dapat membaca data keuangan yayasan atau data siswa lain.' },
              { title: '3. Offline First & IndexedDB Fallback', desc: 'Presensi dan buku penghubung tersimpan lokal saat koneksi terputus.' },
              { title: '4. Executive Digital Signatures', desc: 'SK & LPJ yayasan ditandatangani digital dengan cryptographic seal.' },
              { title: '5. Multi-Tier Reminders H-7/H-3/H-1/Day H', desc: 'Notifikasi otomatis terkirim tanpa intervensi manual.' },
              { title: '6. Hardware & Device Adaptive', desc: 'UI responsif pada TV Lobby, Laptop Admin, iPad Guru, dan HP Wali Murid.' },
              { title: '7. Guardian Health & Auto Recovery', desc: 'SLA Watchtower aktif 24/7 dengan auto-respawn sub-service.' },
              { title: '8. Universal QR Studio & Verification', desc: 'QR presensi, penjemputan, dan sertifikat berintegritas anti-pemalsuan.' },
              { title: '9. Voice Identity & Natural Language', desc: 'AI Asy Prime, Dek Syifa, dan Guardian bersuara jernih ramah anak.' },
              { title: '10. Governance Vault 10 Kategori', desc: 'Arsip akreditasi, BOS, SPTJM, dan SK tersimpan dengan SHA-256 checksum.' }
            ].map((crit, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{crit.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{crit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
