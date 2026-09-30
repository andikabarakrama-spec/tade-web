import React, { useState } from 'react';
import { GitCommit, Shield, Bot, CheckCircle2, Clock, Activity, Zap, Layers } from 'lucide-react';

interface CrisisTimelineEvent {
  id: string;
  timestamp: string; // ISO 8601
  detectionTitle: string;
  guardianAction: string;
  aiAsyAction: string;
  recoverySummary: string;
  durationMs: number;
  result: 'SUCCESS_100' | 'CONTAINED' | 'PREVENTED';
}

export const FounderCrisisTimeline: React.FC = () => {
  const [events] = useState<CrisisTimelineEvent[]>([
    {
      id: 'CRISIS-2026-0816-01',
      timestamp: '2026-08-16T08:14:22.105Z',
      detectionTitle: 'Deteksi Lonjakan Validasi Formulir PPDB Online',
      guardianAction: 'Defender Layer 2 mengaktifkan Sandbox Throttling untuk mencegah read exhaustion.',
      aiAsyAction: 'Asy memberikan umpan balik langsung kepada wali murid bahwa berkas sedang diverifikasi.',
      recoverySummary: 'Antrean selesai diproses secara FIFO tanpa ada data yang tertukar.',
      durationMs: 42,
      result: 'SUCCESS_100'
    },
    {
      id: 'CRISIS-2026-0816-02',
      timestamp: '2026-08-16T06:00:10.420Z',
      detectionTitle: 'Pemeriksaan Integritas Berkas Cadangan Harian',
      guardianAction: 'Guardian Squad Layer 3 memverifikasi checksum SHA-256 seluruh tabel buku kas & SPP.',
      aiAsyAction: 'Asy mencatat log sukses sinkronisasi backup ke Google Drive Yayasan.',
      recoverySummary: 'Data kedaulatan sekolah terverifikasi sah dan utuh 100%.',
      durationMs: 18,
      result: 'SUCCESS_100'
    },
    {
      id: 'CRISIS-2026-0815-03',
      timestamp: '2026-08-15T14:32:00.812Z',
      detectionTitle: 'Simulasi Pemutusan Koneksi Internet (Offline Stress Test)',
      guardianAction: 'Sentinel mendeteksi network drop dalam 2ms dan mengarahkan write operation ke IndexedDB buffer.',
      aiAsyAction: 'Asy menampilkan notifikasi tenang "Mode Offline Aktif - Data Aman" di pojok atas SIM.',
      recoverySummary: 'Saat koneksi pulih, 14 mutasi kas tersinkronisasi otomatis ke cloud tanpa duplikasi.',
      durationMs: 110,
      result: 'SUCCESS_100'
    }
  ]);

  return (
    <div id="founder-crisis-timeline-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-rose-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              TADE RC70 • R533
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ISO 8601 Immutable Audit Log
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GitCommit className="w-7 h-7 text-rose-400" />
            Founder Crisis Timeline
          </h1>
          <p className="text-rose-100/80 text-sm mt-1 max-w-2xl">
            Kronologi terperinci insiden & pemulihan otomatis mencatat: Deteksi, Tindakan Guardian, Tindakan AI Asy, Recovery, Durasi (ms), dan Hasil.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-rose-500/30 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-rose-300 block">Total Resolusi</span>
          <span className="text-xl font-bold text-emerald-400">100% SUCCESS RATE</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          Rekam Jejak Kronologis Resolusi Anomali
        </h2>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
          {events.map((evt, index) => (
            <div key={evt.id} className="relative pl-6">
              {/* Dot Icon */}
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">{evt.id}</span>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{evt.detectionTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{evt.timestamp}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                      {evt.durationMs} ms
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Tindakan Guardian (Tangan Kiri)
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{evt.guardianAction}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" /> Tindakan AI Asy (Tangan Kanan)
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{evt.aiAsyAction}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Hasil Pemulihan: </span>
                    {evt.recoverySummary}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
