import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Cloud, 
  Database, 
  HardDrive, 
  TrendingUp, 
  CreditCard, 
  Bot, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Zap, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Radio, 
  ChevronRight, 
  RefreshCw, 
  Layers, 
  Terminal, 
  UserCheck, 
  KeyRound, 
  Activity,
  Award,
  Lock
} from 'lucide-react';
import { TenantOverview, TenantSchool, MOCK_TENANTS } from './TenantOverview';
import { SystemFleetMonitor } from './SystemFleetMonitor';

export const TADEControlTower: React.FC<{
  onSelectModule?: (modId: string) => void;
}> = ({ onSelectModule }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TENANTS' | 'LICENSES' | 'FLEET_RADAR' | 'GROWTH'>('OVERVIEW');
  const [tenants, setTenants] = useState<TenantSchool[]>(MOCK_TENANTS);
  const [selectedTargetTenantForAssist, setSelectedTargetTenantForAssist] = useState<TenantSchool | null>(null);

  // Phase 10: AI Asy CEO Briefing (R128)
  const [showBriefing, setShowBriefing] = useState<boolean>(true);
  const [briefingSecondsLeft, setBriefingSecondsLeft] = useState<number>(8);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // 10 Summary Widgets calculation
  const totalSchools = tenants.length;
  const activeSchools = tenants.filter(t => t.licenseStatus === 'AKTIF').length;
  const runningTrials = tenants.filter(t => t.licenseStatus === 'TRIAL').length;
  const expiringTrials = tenants.filter(t => t.licenseStatus === 'TRIAL' && t.daysRemaining <= 7).length;
  const activeSubscriptions = tenants.filter(t => t.licensePlan === 'Enterprise Golden' || t.licensePlan === 'Pro Islamic Suite').length;
  const guardianFleetHealth = 99.8;
  const cloudHealthStatus = '100% Ingress OK';
  const backupSyncedCount = tenants.filter(t => t.health.backup >= 85).length;
  const totalStorageGb = tenants.reduce((acc, t) => acc + t.metrics.storageUsedGb, 0).toFixed(1);
  const criticalAlertCount = 1; // 1 backup fail at TK Darunnajah

  // Audio Speech Synthesis for AI Asy Briefing (Phase 10 - R128)
  useEffect(() => {
    if (showBriefing && !isAudioMuted && 'speechSynthesis' in window) {
      const speechText = `Selamat datang Super Admin. ${totalSchools} sekolah terdaftar, ${activeSchools} sekolah aktif, ${expiringTrials} trial berakhir minggu ini. Satu backup membutuhkan perhatian. Seluruh sistem Guardian sehat.`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Briefing countdown timer (8s max)
  useEffect(() => {
    if (!showBriefing) return;
    if (briefingSecondsLeft <= 0) {
      setShowBriefing(false);
      return;
    }
    const timer = setInterval(() => {
      setBriefingSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showBriefing, briefingSecondsLeft]);

  const handleOpenRemoteAssist = (tenant: TenantSchool) => {
    setSelectedTargetTenantForAssist(tenant);
    setActiveTab('FLEET_RADAR');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Top Banner: AI Asy CEO Briefing (Phase 10 - R128) */}
      {showBriefing && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-4 sm:p-5 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Bot className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  R128 • AI Asy Executive CEO Briefing
                </span>
                <span className="text-[10px] text-slate-400">Auto-dismiss: {briefingSecondsLeft}s</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-100 mt-1 leading-relaxed">
                "Selamat datang Super Admin. <strong className="text-white">{totalSchools} sekolah terdaftar</strong> ({activeSchools} aktif, {expiringTrials} trial hampir habis). <span className="text-amber-300 font-bold">1 insiden backup darunnajah</span> butuh retry. Seluruh radar Guardian armada beroperasi optimal."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 z-10">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors"
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-300" />}
            </button>
            <button
              onClick={() => setShowBriefing(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Tutup Briefing
            </button>
          </div>

          {/* Glowing background aura */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      )}

      {/* Main Cockpit Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white shadow-sm">
              R119 • TADE Control Tower
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              DISC-042 LOCKED
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Multi-School Control Tower & Fleet Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pusat Komando Tertinggi Super Admin untuk mengelola seluruh ekosistem sekolah multi-tenant, masa aktif lisensi, kesehatan cloud, dan integritas data terisolasi.
          </p>
        </div>

        {/* Top Control Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: '10-Widget Tower', icon: Zap },
            { id: 'TENANTS', label: 'Sekolah & Tenant (R120)', icon: Building2 },
            { id: 'LICENSES', label: 'License Center (R125)', icon: CreditCard },
            { id: 'FLEET_RADAR', label: 'Fleet & Support (R126)', icon: ShieldCheck },
            { id: 'GROWTH', label: 'Growth Stats (R127)', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHASE 1 — 10 SUMMARY WIDGETS ALL IN ONE VIEW (R119) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Sekolah */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Sekolah</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalSchools}</div>
          <div className="text-[10px] text-emerald-600 font-bold">100% Terdaftar NPSN</div>
        </div>

        {/* 2. Sekolah Aktif */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Sekolah Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{activeSchools}</div>
          <div className="text-[10px] text-slate-500">Berjalan normal</div>
        </div>

        {/* 3. Trial Berjalan */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Trial Berjalan</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">{runningTrials}</div>
          <div className="text-[10px] text-blue-500 font-bold">30-Hari Evaluasi</div>
        </div>

        {/* 4. Trial Hampir Habis */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-bold">
            <span>Trial ≤ 7 Hari</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{expiringTrials}</div>
          <div className="text-[10px] text-amber-700/80 dark:text-amber-400">AI Asy WA Auto-Active</div>
        </div>

        {/* 5. Subscription Aktif */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Langganan Berbayar</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{activeSubscriptions}</div>
          <div className="text-[10px] text-purple-500 font-bold">Enterprise & Pro</div>
        </div>

        {/* 6. Guardian Health */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Guardian Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{guardianFleetHealth}%</div>
          <div className="text-[10px] text-emerald-600 font-bold">DEFCON 1 (SAFE)</div>
        </div>

        {/* 7. Cloud Health */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Cloud Health</span>
            <Cloud className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-slate-100 pt-1">{cloudHealthStatus}</div>
          <div className="text-[10px] text-slate-500">Asia-Southeast1 Node</div>
        </div>

        {/* 8. Backup Status */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Backup Fleet</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{backupSyncedCount}/{totalSchools}</div>
          <div className="text-[10px] text-amber-600 font-bold">1 Snapshot Tertunda</div>
        </div>

        {/* 9. Storage Usage */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Storage</span>
            <HardDrive className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalStorageGb} GB</div>
          <div className="text-[10px] text-slate-500">Dari 360 GB Kuota Fleet</div>
        </div>

        {/* 10. Critical Alert */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs font-bold">
            <span>Critical Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{criticalAlertCount}</div>
          <div className="text-[10px] text-rose-600 font-bold">Timeout Darunnajah</div>
        </div>
      </div>

      {/* Tab Switch Views */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Quick Cockpit View: Top Tenants & Alerts side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Active Tenants Live Stream */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Daftar Institusi Sekolah Terdaftar (R120)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('TENANTS')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Lihat Semua Tenant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {tenants.slice(0, 4).map(t => (
                  <div key={t.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-sm"
                        style={{ backgroundColor: t.themeColor }}
                      >
                        {t.name.slice(3, 5)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{t.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">ID: {t.tenantId} • {t.city}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-black text-slate-800 dark:text-slate-200">{t.metrics.totalStudents} Santri</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Health {t.health.overallScore}%</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        t.licenseStatus === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.licenseStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Action Hub & AI Asy Fleet Advice */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Asy Fleet Intelligence</span>
              </h3>

              <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-3xl border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-900 dark:text-indigo-200">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Rekomendasi Armada Super Admin</span>
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>TK Melati Ceria (H-7):</strong> Kirim draf invoice tahunan paket Pro Islamic via WA.
                  </li>
                  <li>
                    <strong>TK Darunnajah 8 (H-1):</strong> Jalankan remote backup snapshot untuk amankan data rapor santri.
                  </li>
                  <li>
                    <strong>Pertumbuhan Fleet:</strong> Rata-rata santri naik 16.4% pasca implementasi PPDB Online R21.
                  </li>
                </ul>

                <button
                  onClick={() => {
                    alert('[AI Asy Automated Fleet Broadcast]\nBerhasil mengirim ringkasan performa dan pengingat lisensi otomatis ke 6 Kepala Sekolah.');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Jalankan Auto-Broadcast Pengingat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Multi-Tenant View (Phase 2, 3, 4) */}
      {activeTab === 'TENANTS' && (
        <TenantOverview 
          onOpenRemoteAssist={handleOpenRemoteAssist}
        />
      )}

      {/* Tab 3: License Center (Phase 7 - R125) */}
      {activeTab === 'LICENSES' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>R125 • License Center & Manajemen Langganan Multi-Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengawasan status lisensi Trial, Aktif, Berakhir, dan Suspend dengan penanganan tagihan dan aktivasi instan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">Lisensi Aktif</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{activeSchools} Sekolah</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Enterprise & Pro Plan</div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-800 dark:text-blue-300 font-bold">Trial Berjalan</div>
              <div className="text-2xl font-black text-blue-600 mt-1">{runningTrials} Sekolah</div>
              <div className="text-[11px] text-blue-700 mt-0.5">Evaluasi 30 Hari</div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-bold">Trial Kritis (≤ 7 Hari)</div>
              <div className="text-2xl font-black text-amber-600 mt-1">{expiringTrials} Sekolah</div>
              <div className="text-[11px] text-amber-700 mt-0.5">Memerlukan Invoice</div>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800">
              <div className="text-xs text-rose-800 dark:text-rose-300 font-bold">Lisensi Berakhir / Suspend</div>
              <div className="text-2xl font-black text-rose-600 mt-1">1 Sekolah</div>
              <div className="text-[11px] text-rose-700 mt-0.5">TK Islam An-Nur (Expired)</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Tabel Rinci Lisensi Institusi</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-bold">Nama Sekolah</th>
                    <th className="p-3 font-bold">Paket Lisensi</th>
                    <th className="p-3 font-bold">Mulai</th>
                    <th className="p-3 font-bold">Berakhir</th>
                    <th className="p-3 font-bold">Sisa Hari</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{t.name}</td>
                      <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">{t.licensePlan}</td>
                      <td className="p-3">{t.startDate}</td>
                      <td className="p-3">{t.endDate}</td>
                      <td className="p-3 font-bold">{t.daysRemaining} Hari</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          t.licenseStatus === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : t.licenseStatus === 'TRIAL' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.licenseStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setTenants(prev => prev.map(item => item.id === t.id ? { ...item, licenseStatus: 'AKTIF', licensePlan: 'Enterprise Golden', daysRemaining: 365 } : item));
                            alert(`[License Center R125] Sukses mengaktifkan lisensi Enterprise Golden 1 Tahun untuk ${t.name}!`);
                          }}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold"
                        >
                          Perpanjang / Aktifkan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Fleet & Support (Phase 5, 6, 8) */}
      {activeTab === 'FLEET_RADAR' && (
        <SystemFleetMonitor 
          targetTenant={selectedTargetTenantForAssist}
          onClearTargetTenant={() => setSelectedTargetTenantForAssist(null)}
        />
      )}

      {/* Tab 5: Growth Stats (Phase 9) */}
      {activeTab === 'GROWTH' && (
        <SystemFleetMonitor 
          targetTenant={null}
        />
      )}
    </div>
  );
};
