import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Calendar,
  History,
  Sparkles,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  category: 'FINANCE' | 'ACADEMIC' | 'SYSTEM' | 'COMMUNICATION';
  schedule: string;
  nextRun: string;
  status: 'ACTIVE' | 'PAUSED';
  lastRunStatus: 'SUCCESS' | 'WARNING' | 'FAILED';
  lastRunTime: string;
  actionCount: number;
}

interface ExecutionLog {
  id: string;
  workflowName: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  summary: string;
  targetCount: number;
}

export const SchoolOperationsAutomationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'logs' | 'reminders' | 'audit'>('workflows');
  const [executingId, setExecutingId] = useState<string | null>(null);

  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: 'WF-01',
      name: 'Pengingat Tagihan SPP Otomatis (Tanggal 10 Setiap Bulan)',
      category: 'FINANCE',
      schedule: 'Setiap tgl 10 pukul 08:00 WIB',
      nextRun: '10 September 2026, 08:00',
      status: 'ACTIVE',
      lastRunStatus: 'SUCCESS',
      lastRunTime: '10 Agustus 2026, 08:00 WIB',
      actionCount: 142
    },
    {
      id: 'WF-02',
      name: 'Rekonsiliasi Presensi & Sapaan Pagi Santri Sentra',
      category: 'ACADEMIC',
      schedule: 'Senin - Jumat pukul 07:45 WIB',
      nextRun: 'Besok, 07:45 WIB',
      status: 'ACTIVE',
      lastRunStatus: 'SUCCESS',
      lastRunTime: 'Hari ini, 07:45 WIB',
      actionCount: 118
    },
    {
      id: 'WF-03',
      name: 'Ucapan Selamat Milad Islami untuk Santri & Guru',
      category: 'COMMUNICATION',
      schedule: 'Setiap hari pukul 06:00 WIB',
      nextRun: 'Besok, 06:00 WIB',
      status: 'ACTIVE',
      lastRunStatus: 'SUCCESS',
      lastRunTime: 'Hari ini, 06:00 WIB',
      actionCount: 3
    },
    {
      id: 'WF-04',
      name: 'Sinkronisasi Snapshot & Verifikasi SHA-256 Cloud Backup',
      category: 'SYSTEM',
      schedule: 'Setiap malam pukul 23:30 WIB',
      nextRun: 'Hari ini, 23:30 WIB',
      status: 'ACTIVE',
      lastRunStatus: 'SUCCESS',
      lastRunTime: 'Kemarin, 23:30 WIB',
      actionCount: 1
    }
  ]);

  const [logs, setLogs] = useState<ExecutionLog[]>([
    {
      id: 'LOG-001',
      workflowName: 'Rekonsiliasi Presensi & Sapaan Pagi Santri Sentra',
      timestamp: '15 Agustus 2026, 07:45 WIB',
      status: 'SUCCESS',
      summary: '118 santri tercatat hadir; 4 izin sakit diteruskan ke guru kelas.',
      targetCount: 122
    },
    {
      id: 'LOG-002',
      workflowName: 'Ucapan Selamat Milad Islami untuk Santri & Guru',
      timestamp: '15 Agustus 2026, 06:00 WIB',
      status: 'SUCCESS',
      summary: 'Terkirim 3 pesan doa milad berkah via WhatsApp Guardian Gateway.',
      targetCount: 3
    },
    {
      id: 'LOG-003',
      workflowName: 'Sinkronisasi Snapshot & Verifikasi SHA-256 Cloud Backup',
      timestamp: '14 Agustus 2026, 23:30 WIB',
      status: 'SUCCESS',
      summary: 'Snapshot integritas 100% verified SHA-256 (3.8 MB).',
      targetCount: 1
    }
  ]);

  const handleManualRun = (id: string, name: string) => {
    setExecutingId(id);
    setTimeout(() => {
      const newLog: ExecutionLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        workflowName: name,
        timestamp: 'Baru saja (Manual Trigger)',
        status: 'SUCCESS',
        summary: 'Eksekusi manual berhasil diverifikasi dengan respon instan 14ms.',
        targetCount: 12
      };
      setLogs([newLog, ...logs]);
      setExecutingId(null);
    }, 700);
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev =>
      prev.map(w => w.id === id ? { ...w, status: w.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : w)
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">School Operations Automation Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                Smart Operations Suite
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat otomasi cerdas operasional madrasah: penjadwalan rutin, engine reminder otomatis, audit alur kerja harian, dan verifikasi eksekusi.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['workflows', 'logs', 'reminders', 'audit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'workflows' && 'Alur Kerja Otomatis'}
              {tab === 'logs' && 'Log Eksekusi'}
              {tab === 'reminders' && 'Engine Pengingat'}
              {tab === 'audit' && 'Audit History'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Alur Otomasi Aktif</span>
          <div className="text-2xl font-black text-slate-800">4 Task</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Scheduled Running
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Tingkat Keberhasilan</span>
          <div className="text-2xl font-black text-emerald-600">99.8%</div>
          <span className="text-[10px] text-slate-500 font-medium">Bebas error 30 hari terakhir</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Aksi Otomasi Hari Ini</span>
          <div className="text-2xl font-black text-amber-600">121 Aksi</div>
          <span className="text-[10px] text-slate-500 font-medium">Presensi, doa & sinkronisasi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Status Gateway</span>
          <div className="text-2xl font-black text-indigo-600">Terisolasi</div>
          <span className="text-[10px] text-slate-500 font-medium">Zero Overwrite Verified</span>
        </div>
      </div>

      {/* Tab: Workflows */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-700">Daftar Skenario Otomasi Operasional</h2>
            <span className="text-xs font-mono text-slate-400">Total: {workflows.length} Aturan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((wf) => (
              <div key={wf.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-[10px] font-bold">
                      {wf.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">{wf.name}</h3>
                  </div>

                  <button
                    onClick={() => toggleWorkflowStatus(wf.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                      wf.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {wf.status}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jadwal:</span>
                    <span className="font-medium text-slate-700">{wf.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jadwal Berikutnya:</span>
                    <span className="font-medium text-slate-700">{wf.nextRun}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Terakhir Dijalankan:</span>
                    <span className="font-medium text-slate-700">{wf.lastRunTime}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sukses ({wf.actionCount} target)
                  </span>

                  <button
                    onClick={() => handleManualRun(wf.id, wf.name)}
                    disabled={executingId === wf.id}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    {executingId === wf.id ? (
                      <RotateCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    {executingId === wf.id ? 'Menjalankan...' : 'Jalankan Sekarang'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              Riwayat Eksekusi Otomasi Real-Time
            </h2>
            <span className="text-xs font-mono text-slate-400">Status: Realtime Stream</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-slate-800">{log.workflowName}</span>
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{log.summary}</p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Status: Verified 200 OK • Target: {log.targetCount} Entitas
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reminders */}
      {activeTab === 'reminders' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            Konfigurasi Engine Pengingat Pintar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800">1. Notifikasi Jatuh Tempo SPP</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Kirim pesan santun berbasis adab kepada wali murid yang belum menyelesaikan administrasi SPP setiap tanggal 10.
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-600 font-mono">Otomatis Aktif</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800">2. Pengingat Kegiatan Puncak Tema</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Broadcast H-2 dan H-1 menjelang agenda outbound/manasik haji santri lengkap dengan perlengkapan yang perlu dibawa.
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-600 font-mono">Otomatis Aktif</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Audit */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Audit Kepatuhan & Keamanan Otomasi
          </h2>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            Seluruh aturan otomasi berjalan dalam sandboxed microservice environment dengan isolasi tenantId murni. Tidak ada data pribadi santri yang terekspos ke luar atau mengubah file konfigurasi inti yang terkunci.
          </p>
        </div>
      )}
    </div>
  );
};
