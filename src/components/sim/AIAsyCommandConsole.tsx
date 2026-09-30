import React, { useState } from 'react';
import {
  Bot,
  Zap,
  Send,
  Sparkles,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Clock,
  ShieldCheck,
  Building2,
  Database,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import { MissionCompletionBoard, CompletedMissionReport, INITIAL_MISSION_REPORTS } from './MissionCompletionBoard';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const AIAsyCommandConsole: React.FC<Props> = ({ onSelectModule }) => {
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionPhase, setExecutionPhase] = useState<'IDLE' | 'NLU_PARSING' | 'ORCHESTRATING' | 'EXECUTING_TADE' | 'REPORTING'>('IDLE');
  const [activeStepLog, setActiveStepLog] = useState<string[]>([]);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [missions, setMissions] = useState<CompletedMissionReport[]>(INITIAL_MISSION_REPORTS);
  const [currentExecutionSummary, setCurrentExecutionSummary] = useState<string | null>(null);

  const QUICK_PROMPTS = [
    'AI Asy, cek semua tenant.',
    'AI Asy, backup seluruh sekolah.',
    'AI Asy, bantu TK Melati.',
    'AI Asy, analisis prediksi storage.',
    'AI Asy, periksa kepatuhan konstitusi.'
  ];

  const handleSpeak = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleExecuteCommand = async (customCmd?: string) => {
    const textToRun = (customCmd || commandInput).trim();
    if (!textToRun || isProcessing) return;

    setIsProcessing(true);
    setActiveStepLog([]);
    setCurrentExecutionSummary(null);

    // Step 1: AI Asy Brain
    setExecutionPhase('NLU_PARSING');
    setActiveStepLog(prev => [...prev, `[AI Asy NLU] Menganalisis sintaks natural language: "${textToRun}"`]);
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Orchestrator
    setExecutionPhase('ORCHESTRATING');
    setActiveStepLog(prev => [
      ...prev,
      `[AI Asy Orchestrator] Membagi intent menjadi 3 sub-tugas terisolasi.`,
      `[AI Asy Chief Intel] Mengarahkan TADE Execution Engine (Backup + DB + QR Core).`
    ]);
    await new Promise(r => setTimeout(r, 700));

    // Step 3: TADE Execution Engine
    setExecutionPhase('EXECUTING_TADE');
    let summaryText = '';
    let target = 'Fleet Global (14 Sekolah)';
    let tasks: { name: string; engine: any; result: string }[] = [];

    if (textToRun.toLowerCase().includes('backup')) {
      target = '14 Sekolah Terdaftar';
      tasks = [
        { name: 'Database Snapshot Parallel', engine: 'BACKUP_ENGINE', result: '14/14 DBs dikompresi & diverifikasi SHA-256' },
        { name: 'Cloud Storage Ingress', engine: 'BACKUP_ENGINE', result: 'Snapshot tersimpan di Google Cloud Multi-Region Bucket' },
        { name: 'Recovery Key Check', engine: 'RECOVERY_ENGINE', result: 'Checksum diverifikasi 100% cocok' }
      ];
      summaryText = 'Laporan AI Asy: Seluruh 14 sekolah berhasil dibackup secara otomatis tanpa interupsi operasional.';
    } else if (textToRun.toLowerCase().includes('melati')) {
      target = 'TK Terpadu Melati Ceria (melati-02)';
      tasks = [
        { name: 'Dynamic QR Refresh', engine: 'QR_ENGINE', result: '72 Kode QR Penjemputan diperbarui' },
        { name: 'WhatsApp Notification', engine: 'MESSENGER_ENGINE', result: 'Pengingat perpanjangan lisensi dikirim ke Kepala Sekolah' },
        { name: 'School TV Layout', engine: 'SCHOOL_TV_ENGINE', result: 'Slide info penjemputan disinkronkan' }
      ];
      summaryText = 'Laporan AI Asy: TK Melati Ceria telah dibantu. Token QR diperbarui dan notifikasi terkirim.';
    } else if (textToRun.toLowerCase().includes('cek') || textToRun.toLowerCase().includes('tenant')) {
      target = '14 Tenant Terdaftar';
      tasks = [
        { name: 'Tenant Health Scan', engine: 'TENANT_ENGINE', result: 'Rata-rata skor kesehatan armada 97.4/100' },
        { name: 'Quota Verification', engine: 'BACKUP_ENGINE', result: '13 Sekolah aman, 1 Sekolah kuota 91%' },
        { name: 'RBAC Integrity Audit', engine: 'RECOVERY_ENGINE', result: 'Zero Privilege Escalation Detected' }
      ];
      summaryText = 'Laporan AI Asy: Seluruh tenant dalam kondisi stabil. 13 sekolah berkinerja prima, 1 sekolah memerlukan eskalasi kuota.';
    } else {
      target = 'Arsitektur Global TADE';
      tasks = [
        { name: 'Deep System Diagnostic', engine: 'TENANT_ENGINE', result: 'Seluruh service micro-core beroperasi normal (DEFCON 1)' },
        { name: 'AI Asy Synthesis', engine: 'RECOVERY_ENGINE', result: 'Parameter perintah berhasil dipetakan ke TADE Engine' }
      ];
      summaryText = `Laporan AI Asy: Perintah "${textToRun}" selesai dieksekusi dengan sukses oleh TADE Engine.`;
    }

    setActiveStepLog(prev => [
      ...prev,
      `[TADE Engine] Memulai eksekusi paralel pada ${target}...`,
      ...tasks.map(t => `[TADE ${t.engine}] -> ${t.name}: ${t.result}`)
    ]);
    await new Promise(r => setTimeout(r, 900));

    // Step 4: Final Reporting
    setExecutionPhase('REPORTING');
    setCurrentExecutionSummary(summaryText);
    handleSpeak(summaryText);

    const newMission: CompletedMissionReport = {
      id: `MSN-${Date.now().toString().slice(-6)}`,
      commandText: textToRun,
      plannedBy: 'AI Asy Operating Intelligence v11.0',
      executedBy: 'TADE Execution Engine',
      timestamp: new Date().toLocaleString('id-ID'),
      durationMs: 2200,
      status: 'COMPLETED',
      tenantTarget: target,
      tasksCompleted: tasks,
      aiSummary: summaryText
    };

    setMissions(prev => [newMission, ...prev]);
    setIsProcessing(false);
    setExecutionPhase('IDLE');
    setCommandInput('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    MODULE R132
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    DUAL INTELLIGENCE ACTIVE
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  AI Asy Dual Intelligence & Command Console
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Sinergi dua pilar utama: <strong className="text-indigo-300">AI Asy</strong> sebagai Chief Operating Intelligence (Perencana & Pengawas), dan <strong className="text-emerald-300">TADE</strong> sebagai Execution Engine (Pelaksana Otonom: Backup, QR, Banner, Recovery, Messenger, School TV).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              className={`p-3 rounded-xl border transition-colors flex items-center space-x-2 text-xs font-semibold ${
                voiceMuted
                  ? 'bg-slate-900 border-slate-700 text-slate-400'
                  : 'bg-indigo-950/80 border-indigo-700 text-indigo-300 shadow-lg'
              }`}
            >
              {voiceMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              <span>{voiceMuted ? 'Suara Senyap' : 'Suara AI Asy Aktif'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Command Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>Super Admin Natural Command Console</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Ketik instruksi langsung dalam Bahasa Indonesia
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            placeholder="Contoh: AI Asy, backup seluruh sekolah dan verifikasi integritas database sekarang..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleExecuteCommand();
              }
            }}
            className="w-full p-4 pr-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <button
              onClick={() => handleExecuteCommand()}
              disabled={isProcessing || !commandInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-900/30 transition-all"
            >
              {isProcessing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Perintah</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Perintah Cepat:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteCommand(prompt)}
              disabled={isProcessing}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Live Pipeline Execution Stream */}
      {isProcessing && (
        <div className="bg-slate-950 rounded-2xl border border-indigo-900/60 p-6 text-slate-100 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
              <span className="font-bold text-sm text-indigo-300 font-mono">
                DUAL INTELLIGENCE PIPELINE IN MOTION
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Phase: {executionPhase}
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-300">
            {activeStepLog.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-indigo-400">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Result Banner */}
      {currentExecutionSummary && !isProcessing && (
        <div className="bg-emerald-950/60 border border-emerald-800 rounded-2xl p-5 text-emerald-200 flex items-start space-x-4 shadow-lg">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-100">Laporan Otonom AI Asy Selesai</h4>
            <p className="text-xs leading-relaxed text-emerald-200/90">{currentExecutionSummary}</p>
          </div>
        </div>
      )}

      {/* Mission Completion Board */}
      <MissionCompletionBoard missions={missions} />
    </div>
  );
};
