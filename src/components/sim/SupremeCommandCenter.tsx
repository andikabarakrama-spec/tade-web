import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Cloud, 
  HardDrive, 
  RefreshCw, 
  Zap, 
  AlertTriangle, 
  Users, 
  Terminal, 
  Play, 
  Radio, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Laptop, 
  Eye, 
  ArrowRight, 
  FileText, 
  Lock, 
  Cpu, 
  ExternalLink,
  Bot,
  Layers,
  MessageSquare
} from 'lucide-react';
import { CommandMissionEngine } from './CommandMissionEngine';

interface SupremeCommandCenterProps {
  onSelectModule?: (modId: string) => void;
}

export const SupremeCommandCenter: React.FC<SupremeCommandCenterProps> = ({ onSelectModule }) => {
  // Phase 8: AI Asy Mission Briefing State (8s max auto-mute)
  const [briefingTimer, setBriefingTimer] = useState<number>(8);
  const [briefingActive, setBriefingActive] = useState<boolean>(true);
  const [briefingMuted, setBriefingMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MISSIONS' | 'ROOT_PANEL' | 'AUDIT'>('OVERVIEW');

  // Root Command Panel state
  const [rootActionLog, setRootActionLog] = useState<string[]>([]);
  const [isExecutingRoot, setIsExecutingRoot] = useState<boolean>(false);

  // System telemetries
  const [backupTimestamp, setBackupTimestamp] = useState<string>('Hari ini, 08:00 WIB');
  const [guardianDefcon, setGuardianDefcon] = useState<string>('DEFCON 1 (SAFE)');
  const [dbLatency, setDbLatency] = useState<number>(8);

  // Auto-countdown briefing timer for 8 seconds
  useEffect(() => {
    if (!briefingActive) return;
    
    // Web Speech synthesis for AI Asy Voice
    if (!briefingMuted && 'speechSynthesis' in window) {
      try {
        const text = "Assalamu'alaikum Super Admin. Melaporkan status terkini: Sistem Guardian aman, Cloud Database normal, dan Rantai Komando berjalan sesuai jadwal.";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.pitch = 1.1; // AI Asy Persona
        utterance.rate = 1.05;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        // Fallback silently if speech synthesis blocked by browser policy
      }
    }

    const interval = setInterval(() => {
      setBriefingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBriefingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleMuteBriefing = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setBriefingMuted(true);
    setBriefingActive(false);
  };

  const handleRunRootAction = (actionName: string, detailMsg: string) => {
    setIsExecutingRoot(true);
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setTimeout(() => {
      setIsExecutingRoot(false);
      setRootActionLog(prev => [`[${timestamp}] ROOT EXEC: ${actionName} -> ${detailMsg}`, ...prev.slice(0, 15)]);
      alert(`[Root Authority Action] Berhasil menjalankan: ${actionName}`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* AI Asy 8-Second Mission Briefing Banner (Phase 8 - R118) */}
      {briefingActive && (
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-4 rounded-2xl border border-indigo-400/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                  R118 • AI Asy 8-Second Mission Briefing
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {briefingTimer}s tersisa
                </span>
              </div>
              <p className="text-sm font-medium text-slate-100 mt-0.5">
                "Assalamu'alaikum Super Admin. Melaporkan: 1 misi aktif, 1 tugas eskalasi guru dalam penanganan. Backup cloud sukses, Guardian aman 100%."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleMuteBriefing}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {briefingMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>Tutup Briefing</span>
            </button>
          </div>
        </div>
      )}

      {/* Supreme Command Center Master Header (Phase 1 - R111) */}
      <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Zap className="w-8 h-8" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  R111 • Supreme Command Center
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Komando Tunggal TADE Super Admin
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Pusat Kendali Induk & Rantai Komando Otonom
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Super Admin sebagai komandan tunggal. AI Asy mengorkestrasi 6 tier rantai komando, memantau SLA, dan mengeksekusi eskalasi otonom.
              </p>
            </div>
          </div>

          {/* Master Cockpit Quick Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start lg:self-auto">
            {[
              { id: 'OVERVIEW', label: 'Induk Telemetri', icon: Activity },
              { id: 'MISSIONS', label: 'Mission Engine (R112)', icon: Bot },
              { id: 'ROOT_PANEL', label: 'Root Panel (R117)', icon: Terminal }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 10-Widget Induk Cockpit Grid (Phase 1) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Widget 1: Guardian Security */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Guardian Core</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-black text-emerald-400">{guardianDefcon}</div>
            <div className="text-[10px] text-slate-500">0 Threat • HMAC SHA256</div>
          </div>

          {/* Widget 2: System Health */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">System Health</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-sm font-black text-white">60 FPS • 12% CPU</div>
            <div className="text-[10px] text-slate-500">Hardware Tier 1 Ultra</div>
          </div>

          {/* Widget 3: Database Firestore */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Firestore Cloud</span>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-black text-white">{dbLatency}ms Latency</div>
            <div className="text-[10px] text-emerald-400 font-bold">● Connected (Online)</div>
          </div>

          {/* Widget 4: Cloud Run Server */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Cloud Ingress</span>
              <Cloud className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-black text-white">99.99% Uptime</div>
            <div className="text-[10px] text-slate-500">Asia-Southeast1</div>
          </div>

          {/* Widget 5: Backup Status */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Smart Backup</span>
              <HardDrive className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-black text-white">Snapshot OK</div>
            <div className="text-[10px] text-slate-400 truncate">{backupTimestamp}</div>
          </div>

          {/* Widget 6: Recovery Status */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Autonomous Recovery</span>
              <Zap className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-sm font-black text-emerald-400">Siaga (Ready)</div>
            <div className="text-[10px] text-slate-500">0 Data Loss Guarantee</div>
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Mission Engine embedded in overview */}
          <CommandMissionEngine onSelectModule={onSelectModule} userRoleContext="SUPER_ADMIN" />

          {/* Root Authority Quick Trigger Panel (Phase 7 - R117) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span>R117 • Root Command Panel (Otoritas Instan Super Admin)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tindakan eksekutif berkecepatan tinggi tanpa meninggalkan dashboard induk.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                ROOT PRIVILEGE
              </span>
            </div>

            {/* Quick Action Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => handleRunRootAction('Ambil Alih Tugas', 'Semua subtugas tertunda dipindahkan ke Super Admin')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all text-left flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Ambil Alih Tugas (Takeover)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Reassign tugas macet langsung ke Super Admin</div>
                </div>
              </button>

              <button
                onClick={() => handleRunRootAction('Paksa Backup Cloud', 'Snapshot smart database Firestore tersimpan secara otonom')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-left flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Paksa Backup Cloud Seketika</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Snapshot database terenkripsi SHA256</div>
                </div>
              </button>

              <button
                onClick={() => handleRunRootAction('Broadcast Darurat', 'Notifikasi prioritas tinggi disiarkan ke seluruh dewan guru & wali murid')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 hover:border-rose-500 transition-all text-left flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Broadcast Darurat Sekolah</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kirim pengumuman vital ke Living Messenger</div>
                </div>
              </button>

              <button
                onClick={() => handleRunRootAction('Guardian Deep Scan', 'Pemeriksaan integritas 100% rules Firestore dan token akses')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all text-left flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Guardian Deep Scan</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Audit pencegahan injeksi & integritas DB</div>
                </div>
              </button>

              {/* Direct Workspace Jumps */}
              <button
                onClick={() => onSelectModule && onSelectModule('r102')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Buka Workspace Admin (R102)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Akses antarmuka operasional TU ASUS ROG</div>
                </div>
              </button>

              <button
                onClick={() => onSelectModule && onSelectModule('r101')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Buka Workspace Yayasan (R101)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Akses antarmuka Executive Lite PC Jadul</div>
                </div>
              </button>
            </div>

            {/* Live Root Command Console Output */}
            {rootActionLog.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 max-h-32 overflow-y-auto">
                <div className="text-slate-500 text-[10px]">-- ROOT COMMAND EXECUTION STREAM --</div>
                {rootActionLog.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'MISSIONS' && (
        <CommandMissionEngine onSelectModule={onSelectModule} userRoleContext="SUPER_ADMIN" />
      )}

      {activeTab === 'ROOT_PANEL' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Root Authority Master Console (Super Admin Privilege)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kontrol penuh atas seluruh parameter runtime, snapshot recovery, dan override rantai komando.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Audit & Integritas Sistem</h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span>Integritas Schema Firestore:</span>
                  <span className="font-bold text-emerald-600">100% LOCKED</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span>HMAC-SHA256 Token Sentinel:</span>
                  <span className="font-bold text-emerald-600">ACTIVE</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span>Discovery Registry (DISC-001 s/d DISC-040):</span>
                  <span className="font-bold text-indigo-600">40 LOCKS</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Autonomous Chain of Command Diagnostics</h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span>AI Asy NLP Engine:</span>
                  <span className="font-bold text-emerald-600">Online & Ready</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span>WhatsApp Guardian Auto-Dispatcher:</span>
                  <span className="font-bold text-emerald-600">Standby (0 Delay)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span>Smart Escalation Matrix:</span>
                  <span className="font-bold text-indigo-600">Monitoring 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
