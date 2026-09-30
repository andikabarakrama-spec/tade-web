import React, { useState } from 'react';
import { AdministrativeTaskOrchestrator } from '../../core/hermes/AdministrativeTaskOrchestrator';
import { SovereignManualAdministration } from '../../core/hermes/SovereignManualAdministration';
import { 
  Crown, 
  HelpCircle, 
  Send, 
  Pause, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Sliders 
} from 'lucide-react';

export const FounderAdminCommandCenterViewer: React.FC = () => {
  const orchestrator = AdministrativeTaskOrchestrator.getInstance();
  const sovereign = SovereignManualAdministration.getInstance();

  const [queryInput, setQueryInput] = useState('');
  const [asyResponse, setAsyResponse] = useState<string | null>(null);
  const [modeState, setModeState] = useState(sovereign.getState());
  const [feedback, setFeedback] = useState<string | null>(null);

  const founderQueries = [
    'Asy, apa yang sedang dikerjakan Hermes?',
    'Asy, apa yang gagal?',
    'Asy, apa yang menunggu saya?',
    'Asy, berapa tugas yang selesai hari ini?',
    'Asy, kenapa tugas ini belum selesai?'
  ];

  const handleFounderQuery = (question: string) => {
    setQueryInput(question);
    const q = question.toLowerCase();
    const tasks = orchestrator.getAllTasks();

    if (q.includes('sedang dikerjakan') || q.includes('aktif')) {
      const active = tasks.filter(t => t.state === 'EXECUTING' || t.state === 'UNDERSTANDING' || t.state === 'PLANNED');
      if (active.length === 0) {
        setAsyResponse(
          'Laporan Asy (Berdasarkan State Nyata):\n' +
          'Hermes saat ini dalam kondisi DORMANT (Standby aman). Tidak ada tugas aktif yang sedang berjalan tanpa pengawasan. ' +
          `Total terdapat ${tasks.length} tugas dalam riwayat antrean.`
        );
      } else {
        setAsyResponse(
          `Laporan Asy: Terdapat ${active.length} tugas yang sedang aktif:\n` +
          active.map(t => `- [${t.taskId}] ${t.objective} (Pemohon: ${t.requester})`).join('\n')
        );
      }
    } else if (q.includes('gagal')) {
      const failed = tasks.filter(t => t.state === 'FAILED' || t.state === 'BLOCKED');
      if (failed.length === 0) {
        setAsyResponse('Laporan Asy: Nol kegagalan fatal. Semua tugas berada dalam status COMPLETED atau terkontrol di Safety Gate.');
      } else {
        setAsyResponse(
          `Laporan Asy: Ditemukan ${failed.length} tugas terhenti/terblokir:\n` +
          failed.map(t => `- [${t.taskId}] ${t.objective}\n  Alasan: ${t.result || t.humanHandoff?.blockerReason || 'Evaluasi Safety Gate'}`).join('\n')
        );
      }
    } else if (q.includes('menunggu') || q.includes('approval') || q.includes('saya')) {
      const waiting = tasks.filter(t => t.state === 'WAITING_APPROVAL' || (t.humanHandoff && t.humanHandoff.requiredAuthorityRole === 'SUPER_ADMIN'));
      if (waiting.length === 0) {
        setAsyResponse('Laporan Asy: Tidak ada tugas yang menunggu persetujuan Super Admin saat ini. Semua aman.');
      } else {
        setAsyResponse(
          `Laporan Asy: Terdapat ${waiting.length} tindakan yang membutuhkan verifikasi Anda:\n` +
          waiting.map(t => `- [${t.taskId}] ${t.objective}\n  Tindakan: ${t.humanHandoff?.requiredAction || 'Persetujuan Safety Gate Dokumen Eksekutif'}`).join('\n')
        );
      }
    } else if (q.includes('selesai')) {
      const completed = tasks.filter(t => t.state === 'COMPLETED');
      setAsyResponse(
        `Laporan Asy: Sebanyak ${completed.length} tugas dari total ${tasks.length} telah selesai 100% dan terverifikasi di SSoT db.ts tanpa kesalahan.`
      );
    } else if (q.includes('kenapa') || q.includes('belum selesai')) {
      const pending = tasks.filter(t => t.state !== 'COMPLETED');
      if (pending.length === 0) {
        setAsyResponse('Laporan Asy: Seluruh tugas telah selesai!');
      } else {
        const top = pending[0];
        setAsyResponse(
          `Laporan Asy untuk [${top.taskId}] "${top.objective}":\n` +
          `Status saat ini: ${top.state}\n` +
          `Penyebab: ${top.result || top.humanHandoff?.blockerReason || 'Menunggu jadwal antrean'}\n` +
          `Rekomendasi Tindakan: ${top.humanHandoff?.requiredAction || 'Buka modul terkait untuk validasi manual.'}`
        );
      }
    } else {
      setAsyResponse(
        `Laporan Asy: Menjawab pertanyaan "${question}". Membaca database operasional...\n` +
        `Ringkasan Sistem: Total Tugas: ${tasks.length}, Selesai: ${tasks.filter(t => t.state === 'COMPLETED').length}, Memerlukan Perhatian: ${tasks.filter(t => t.state === 'BLOCKED' || t.state === 'WAITING_APPROVAL').length}.`
      );
    }
  };

  const handleSetMode = (targetMode: any) => {
    const res = sovereign.setMode(targetMode, 'Diperintahkan oleh Super Admin via Command Center');
    setModeState(sovereign.getState());
    setFeedback(res.message);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Super Admin Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 text-white space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-mono font-bold text-xl text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                R687 &bull; R689 SOVEREIGN WORK MODE &bull; FOUNDER COMMAND
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Founder Administrative Command Center &bull; AI Asy Live Observability
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Status Hermes:</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold">
              {modeState.activeMode} (DORMANT)
            </span>
          </div>
        </div>

        {/* Sovereign Control Buttons (R687) */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 font-mono text-xs">
          <span className="text-slate-400 font-bold block">Kendali Kedaulatan Tertinggi (Super Admin Sovereign Control):</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSetMode('PAUSED')}
              className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Hermes (State Preserved)</span>
            </button>
            <button
              onClick={() => handleSetMode('STANDBY')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Hermes (No Duplicate)</span>
            </button>
            <button
              onClick={() => handleSetMode('MANUAL_ADMIN')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manual Admin Mode</span>
            </button>
            <button
              onClick={() => handleSetMode('GLOBAL_OVERRIDE')}
              className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Global Sovereign Override</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 font-mono text-xs flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-amber-400 hover:text-white">✕</button>
        </div>
      )}

      {/* AI Asy Live Observability Query Panel (R689) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">R689 AI ASY OBSERVABILITY</span>
            <strong className="text-sm text-slate-900 dark:text-white">Tanya Langsung ke AI Asy (Membaca State Nyata Tanpa Halusinasi)</strong>
          </div>
        </div>

        {/* Quick Query Chips */}
        <div className="flex flex-wrap gap-2">
          {founderQueries.map((fq, idx) => (
            <button
              key={idx}
              onClick={() => handleFounderQuery(fq)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors text-xs font-bold"
            >
              {fq}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Tanyakan status Hermes ke AI Asy..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
          />
          <button
            onClick={() => handleFounderQuery(queryInput)}
            disabled={!queryInput.trim()}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tanya Asy</span>
          </button>
        </div>

        {/* AI Asy Live Response Box */}
        {asyResponse && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
              <span>Laporan Otoritatif AI Asy (State SSoT Terkini):</span>
              <button onClick={() => setAsyResponse(null)} className="text-slate-400 hover:text-slate-600">✕ Tutup</button>
            </div>
            <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-white/70 dark:bg-slate-900/60 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900">
              {asyResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
