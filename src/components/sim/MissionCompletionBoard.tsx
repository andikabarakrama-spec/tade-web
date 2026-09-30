import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Bot,
  Zap,
  CheckCheck,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Building2,
  Database,
  QrCode,
  Tv,
  MessageSquare
} from 'lucide-react';

export interface CompletedMissionReport {
  id: string;
  commandText: string;
  plannedBy: string; // 'AI Asy Operating Intelligence'
  executedBy: string; // 'TADE Execution Engine'
  timestamp: string;
  durationMs: number;
  status: 'COMPLETED' | 'EXECUTING' | 'ACTION_REQUIRED';
  tenantTarget: string;
  tasksCompleted: {
    name: string;
    engine: 'BACKUP_ENGINE' | 'QR_ENGINE' | 'MESSENGER_ENGINE' | 'SCHOOL_TV_ENGINE' | 'RECOVERY_ENGINE' | 'TENANT_ENGINE';
    result: string;
  }[];
  aiSummary: string;
}

export const INITIAL_MISSION_REPORTS: CompletedMissionReport[] = [
  {
    id: 'MSN-2026-0814-991',
    commandText: 'AI Asy, backup seluruh sekolah dan verifikasi snapshot.',
    plannedBy: 'AI Asy Operating Intelligence v11.0',
    executedBy: 'TADE Execution Engine (Parallel Async)',
    timestamp: '2026-08-14 15:30:12 WIB',
    durationMs: 3420,
    status: 'COMPLETED',
    tenantTarget: '14 Sekolah (Fleet Global)',
    tasksCompleted: [
      { name: 'Multi-Tenant Database Snapshot', engine: 'BACKUP_ENGINE', result: '14/14 Tenant DBs compressed & signed with SHA-256' },
      { name: 'Cold Cloud Vault Sync', engine: 'BACKUP_ENGINE', result: 'Uploaded to Google Cloud Storage immutable bucket' },
      { name: 'Recovery Checksum Validation', engine: 'RECOVERY_ENGINE', result: '100% Integrity match across 48,000 document nodes' }
    ],
    aiSummary: 'Laporan Selesai: Seluruh 14 sekolah berhasil dibackup tanpa error. Total snapshot 342 GB aman dan terenkripsi.'
  },
  {
    id: 'MSN-2026-0814-990',
    commandText: 'AI Asy, bantu TK Melati Ceria optimasi QR dan perpanjang masa tenggang.',
    plannedBy: 'AI Asy Operating Intelligence v11.0',
    executedBy: 'TADE Execution Engine',
    timestamp: '2026-08-14 14:10:44 WIB',
    durationMs: 1850,
    status: 'COMPLETED',
    tenantTarget: 'TK Terpadu Melati Ceria (melati-02)',
    tasksCompleted: [
      { name: 'Generate High-Entropy QR Tokens', engine: 'QR_ENGINE', result: '72 Dynamic Parent Pick-up QR Codes refreshed' },
      { name: 'Grace Period Provisioning', engine: 'TENANT_ENGINE', result: 'Grace period diperpanjang +7 hari dengan WhatsApp notice ke PIC' },
      { name: 'School TV Slide Refresh', engine: 'SCHOOL_TV_ENGINE', result: 'Jadwal penjemputan santri disinkronkan ke layar TV lobi' }
    ],
    aiSummary: 'Laporan Selesai: QR Code TK Melati Ceria telah diregenerasi dan masa tenggang diperpanjang 7 hari. Notifikasi terkirim ke Kepala Sekolah.'
  },
  {
    id: 'MSN-2026-0814-989',
    commandText: 'AI Asy, siarkan pengumuman libur nasional ke seluruh wali murid via Living Messenger.',
    plannedBy: 'AI Asy Operating Intelligence v11.0',
    executedBy: 'TADE Execution Engine',
    timestamp: '2026-08-14 10:05:19 WIB',
    durationMs: 4100,
    status: 'COMPLETED',
    tenantTarget: '1,420 Wali Murid (4 Sekolah Aktif)',
    tasksCompleted: [
      { name: 'Dynamic Message Template Formatting', engine: 'MESSENGER_ENGINE', result: '1,420 Personalized greeting payloads composed' },
      { name: 'Official WhatsApp Guardian Dispatch', engine: 'MESSENGER_ENGINE', result: '1,418 Sent, 2 Queued for offline retry' }
    ],
    aiSummary: 'Laporan Selesai: Pengumuman libur berhasil disiarkan ke 1,420 wali murid dengan rasio keberhasilan 99.8%.'
  }
];

interface Props {
  missions?: CompletedMissionReport[];
}

export const MissionCompletionBoard: React.FC<Props> = ({ missions = INITIAL_MISSION_REPORTS }) => {
  const [selectedMission, setSelectedMission] = useState<CompletedMissionReport | null>(null);

  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'BACKUP_ENGINE':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'QR_ENGINE':
        return <QrCode className="w-4 h-4 text-indigo-400" />;
      case 'SCHOOL_TV_ENGINE':
        return <Tv className="w-4 h-4 text-purple-400" />;
      case 'MESSENGER_ENGINE':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default:
        return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>Mission Completion Board (Laporan Otonom AI Asy & TADE)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Setiap perintah Super Admin direncanakan oleh AI Asy dan dieksekusi secara instan oleh TADE Engine.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full">
          {missions.length} Misi Selesai
        </span>
      </div>

      <div className="space-y-3">
        {missions.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMission(m)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-4 transition-all cursor-pointer shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {m.id}
                </span>
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  "{m.commandText}"
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {m.timestamp}
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {(m.durationMs / 1000).toFixed(2)}s
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-start space-x-2">
                <Bot className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {m.aiSummary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className="text-slate-400 font-medium">Eksekusi Engine:</span>
              {m.tasksCompleted.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-1"
                >
                  {getEngineIcon(t.engine)}
                  <span>{t.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Mission */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-base text-slate-100">Detail Laporan Misi Otonom</h4>
              </div>
              <span className="font-mono text-xs text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800">
                {selectedMission.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Perintah Super Admin:</span>
                <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 font-mono">
                  "{selectedMission.commandText}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Perencana (Planning):</span>
                  <span className="font-bold text-indigo-400 mt-0.5 block">{selectedMission.plannedBy}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Pelaksana (Execution):</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">{selectedMission.executedBy}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1.5">Rincian Tugas & Hasil Engine:</span>
                <div className="space-y-2">
                  {selectedMission.tasksCompleted.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-3">
                      <div className="mt-0.5">{getEngineIcon(t.engine)}</div>
                      <div>
                        <span className="font-bold text-slate-200 block">{t.name}</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{t.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Tutup Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
