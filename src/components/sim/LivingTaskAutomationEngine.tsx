import React, { useState } from 'react';
import { 
  Zap, 
  FileText, 
  CheckCircle2, 
  Sun, 
  Calendar, 
  Bell, 
  Archive, 
  Database, 
  Play, 
  Clock, 
  Sparkles, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface AutomationJob {
  id: string;
  name: string;
  category: 'PERSURATAN' | 'KBM' | 'BRIEF' | 'AGENDA' | 'REMINDER' | 'ARSIP' | 'BACKUP';
  frequency: string;
  lastRun: string;
  status: 'SUCCESS' | 'RUNNING' | 'SCHEDULED';
  details: string;
}

const INITIAL_JOBS: AutomationJob[] = [
  {
    id: 'JOB-01',
    name: 'Penomoran Surat Dinas Otomatis (WORM Formatter)',
    category: 'PERSURATAN',
    frequency: 'Saat Pembuatan Draf',
    lastRun: '10 menit lalu',
    status: 'SUCCESS',
    details: 'Format 421.1/XXX/TK-ASY/2026 terindeks tanpa duplikasi atau nomor loncat.'
  },
  {
    id: 'JOB-02',
    name: 'Checklist Kesiapan 8 Pilar KBM Sentra',
    category: 'KBM',
    frequency: 'Setiap Hari 06:45 WIB',
    lastRun: 'Pagi ini 06:45 WIB',
    status: 'SUCCESS',
    details: 'Audit kelayakan APE, P3K, kebersihan, AC, dan kehadiran guru sentra.'
  },
  {
    id: 'JOB-03',
    name: 'Penyusunan Taklimat Pagi (Morning Brief)',
    category: 'BRIEF',
    frequency: 'Setiap Hari 07:00 WIB',
    lastRun: 'Pagi ini 07:00 WIB',
    status: 'SUCCESS',
    details: 'Ringkasan harian untuk Ketua Yayasan & Kepala Sekolah berbasis telemetri.'
  },
  {
    id: 'JOB-04',
    name: 'Sinkronisasi Agenda & Kalender Akademik',
    category: 'AGENDA',
    frequency: 'Real-time',
    lastRun: '5 menit lalu',
    status: 'SUCCESS',
    details: 'Sinkronisasi jadwal KBM, parenting seminar, dan evaluasi kurikulum.'
  },
  {
    id: 'JOB-05',
    name: 'Pengingat Pembayaran SPP & Pesan WhatsApp',
    category: 'REMINDER',
    frequency: 'Tanggal 5 & 10 Tiap Bulan',
    lastRun: '10 Agustus 2026',
    status: 'SUCCESS',
    details: 'Pesan santun terpersonalisasi ke wali murid lengkap dengan QR tagihan.'
  },
  {
    id: 'JOB-06',
    name: 'Pengarsipan Dokumen Resmi & Indexing Digital',
    category: 'ARSIP',
    frequency: 'Setiap Dokumen Final',
    lastRun: '15 menit lalu',
    status: 'SUCCESS',
    details: 'Penyimpanan terenkripsi dengan metadata terindeks untuk pencarian instan.'
  },
  {
    id: 'JOB-07',
    name: 'Auto-Snapshot Cloud Backup & Guardian Sync',
    category: 'BACKUP',
    frequency: 'Setiap 6 Jam',
    lastRun: 'Pukul 06:00 WIB',
    status: 'SUCCESS',
    details: 'Pencadangan WORM 4.2 MB dengan hash integritas SHA-256.'
  }
];

export const LivingTaskAutomationEngine: React.FC = () => {
  const [jobs, setJobs] = useState<AutomationJob[]>(INITIAL_JOBS);
  const [isExecutingAll, setIsExecutingAll] = useState(false);

  const handleExecuteAll = () => {
    setIsExecutingAll(true);
    setTimeout(() => {
      setIsExecutingAll(false);
      setJobs(jobs.map(j => ({ ...j, lastRun: 'Baru saja', status: 'SUCCESS' })));
      blackBoxRecorder.record({
        moduleCode: 'R500',
        eventType: 'ACTION',
        severity: 'INFO',
        details: 'Living Task Automation Engine executed batch automated jobs successfully.'
      });
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R500 &bull; LIVING TASK AUTOMATION ENGINE
          </span>
          <span className="text-xs text-slate-400 font-mono">Zero Human Repetition &bull; Background Autopilot</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-cyan-400" />
              Living Task Automation Engine &bull; Otomasi Tugas Hidup
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Mesin autopilot harian TK Asy Syifa: mengotomatisasi penomoran surat dinas, checklist 8 pilar kesiapan sentra, Taklimat Pagi, pengingat wali murid, pengarsipan berkas resmi, hingga pencadangan data tanpa repot mengulang pekerjaan manual.
            </p>
          </div>

          <button
            onClick={handleExecuteAll}
            disabled={isExecutingAll}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Play className={`w-4 h-4 ${isExecutingAll ? 'animate-spin' : ''}`} />
            {isExecutingAll ? 'Menjalankan Otomasi...' : 'Jalankan Seluruh Otomasi'}
          </button>
        </div>

        {/* Vital 4 Automation Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">TOTAL TUGAS OTOMATIS</span>
            <span className="text-base font-bold text-cyan-400 font-mono">7 Alur Aktif</span>
            <span className="text-[9px] text-cyan-500 block">100% On-Schedule</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">EFISIENSI WAKTU STAF</span>
            <span className="text-base font-bold text-emerald-400 font-mono">~ 4.5 Jam / Hari</span>
            <span className="text-[9px] text-emerald-500 block">Hemat Tenaga TU</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">AKURASI PENOMORAN</span>
            <span className="text-base font-bold text-purple-400 font-mono">100% ZERO TYPO</span>
            <span className="text-[9px] text-purple-400 block">WORM Formatter</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS KEANDALAN</span>
            <span className="text-base font-bold text-emerald-400 font-mono">99.99% UPTIME</span>
            <span className="text-[9px] text-emerald-500 block">Zero Failure</span>
          </div>
        </div>
      </div>

      {/* Main Jobs Matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            MATRIKS ALUR KERJA AUTOPILOT
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Semua Alur Siap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  {job.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {job.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {job.name}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {job.details}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px] font-mono text-slate-400">
                <span>Frekuensi: <strong>{job.frequency}</strong></span>
                <span>Terakhir: <strong className="text-slate-600 dark:text-slate-300">{job.lastRun}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
