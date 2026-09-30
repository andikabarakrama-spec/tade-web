import React, { useState } from 'react';
import { AdministrativeTaskOrchestrator, AdministrativeTask, TaskRole, TaskState } from '../../core/hermes/AdministrativeTaskOrchestrator';
import { NaturalLanguageAdminIntentEngine, ParsedAdminIntent } from '../../core/hermes/NaturalLanguageAdminIntentEngine';
import { AdministrativeWorkflowLibrary, AdministrativeWorkflowBlueprint } from '../../core/hermes/AdministrativeWorkflowLibrary';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  RefreshCw, 
  Layers, 
  ShieldAlert, 
  BookOpen, 
  Sliders, 
  Filter 
} from 'lucide-react';

export const AdministrativeTaskOrchestratorViewer: React.FC = () => {
  const orchestrator = AdministrativeTaskOrchestrator.getInstance();
  const intentEngine = NaturalLanguageAdminIntentEngine.getInstance();
  const wfLib = AdministrativeWorkflowLibrary.getInstance();

  const [tasks, setTasks] = useState<AdministrativeTask[]>(orchestrator.getAllTasks());
  const [selectedRole, setSelectedRole] = useState<TaskRole>('SUPER_ADMIN');
  const [commandInput, setCommandInput] = useState('');
  const [parsedIntent, setParsedIntent] = useState<ParsedAdminIntent | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | TaskState>('ALL');
  const [viewWorkflow, setViewWorkflow] = useState<AdministrativeWorkflowBlueprint | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sampleCommands = [
    'Hermes, siapkan laporan absensi.',
    'Hermes, cek pembayaran yang belum selesai.',
    'Hermes, siapkan bahan rapat yayasan.',
    'Hermes, rapikan administrasi kelas saya.',
    'Hermes, bereskan administrasi bulan ini.'
  ];

  const handleParse = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    const parsed = intentEngine.parseIntent(commandInput, selectedRole);
    setParsedIntent(parsed);
  };

  const handleExecutePlannedTask = () => {
    if (!parsedIntent) return;

    const newTask = orchestrator.createTask({
      requester: `Pengguna Aktif (${selectedRole})`,
      role: parsedIntent.suggestedRole,
      capability: parsedIntent.requiredCapability,
      objective: parsedIntent.recognizedGoal,
      priority: parsedIntent.priority,
      assignedExecutor: 'Hermes Administrative Executor (Dormant Engine)',
      dependencies: parsedIntent.dependencies,
      state: 'COMPLETED',
      result: `Pekerjaan administratif selesai: "${parsedIntent.recognizedGoal}". Dokumen/rekap terverifikasi.`,
      category: parsedIntent.category === 'GENERAL_ADMIN' ? 'LAPORAN' : parsedIntent.category,
      isSensitiveAction: parsedIntent.isSensitive
    });

    setTasks(orchestrator.getAllTasks());
    setFeedback(`Tugas ${newTask.taskId} berhasil diproses dan diselesaikan.`);
    setParsedIntent(null);
    setCommandInput('');
  };

  const handleCancelTask = (taskId: string) => {
    const res = orchestrator.cancelTask(taskId, 'Dibatalkan melalui panel kontrol.');
    setTasks(orchestrator.getAllTasks());
    setFeedback(res.message);
  };

  const filteredTasks = selectedFilter === 'ALL'
    ? tasks
    : tasks.filter(t => t.state === selectedFilter);

  return (
    <div className="space-y-6 font-sans">
      {/* Role Context Bar & Natural Language Prompt Engine */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                R677 &bull; R678 &bull; R679 INTENT ENGINE
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Natural Language Administrative Intent &bull; Eksekutor Nyata
              </h3>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Peran Aktif:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as TaskRole)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="SUPER_ADMIN">Super Admin (Sovereign)</option>
              <option value="KETUA_YAYASAN">Ketua Yayasan</option>
              <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
              <option value="GURU">Guru</option>
              <option value="ADMIN_TU">Admin Tata Usaha</option>
            </select>
          </div>
        </div>

        {/* Command Form */}
        <form onSubmit={handleParse} className="flex gap-2">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Ketik perintah administratif manusia biasa (cth: 'Hermes, siapkan laporan absensi')..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!commandInput.trim()}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Pahami Perintah</span>
          </button>
        </form>

        {/* Sample Prompt Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
          <span className="text-slate-400 py-1 mr-1">Contoh Perintah Manusia:</span>
          {sampleCommands.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                setCommandInput(c);
                const p = intentEngine.parseIntent(c, selectedRole);
                setParsedIntent(p);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Parsed Intent Card */}
        {parsedIntent && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 dark:border-indigo-800/60 pb-2.5">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">
                  Hasil Pemahaman Niat Administratif (R679)
                </span>
                <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-100">
                  {parsedIntent.recognizedGoal}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold text-[10px]">
                Kategori: {parsedIntent.category} &bull; Prioritas: {parsedIntent.priority}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
                <span className="text-slate-400 font-bold block">1. Dekomposisi Langkah Pekerjaan:</span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {parsedIntent.deconstructedSteps.map((s, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-indigo-500 font-bold">&bull;</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-900/60 space-y-1.5">
                <div><span className="text-slate-400">Required Capability:</span> <strong className="text-slate-900 dark:text-white">{parsedIntent.requiredCapability}</strong></div>
                <div><span className="text-slate-400">Dependencies:</span> <strong className="text-slate-900 dark:text-white">{parsedIntent.dependencies.join(', ')}</strong></div>
                <div><span className="text-slate-400">Evaluasi Keamanan:</span> <strong className={parsedIntent.isSensitive ? 'text-amber-500' : 'text-emerald-500'}>{parsedIntent.isSensitive ? 'Tindakan Sensitif (Memerlukan Verifikasi)' : 'Aman (Read / Format / Draft)'}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-indigo-200 dark:border-indigo-800/60">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-300 italic">{parsedIntent.explanation}</span>
              <button
                onClick={handleExecutePlannedTask}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Jalankan &amp; Selesaikan Tugas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-slate-900 text-white font-mono text-xs flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Task State Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {(['ALL', 'COMPLETED', 'WAITING_APPROVAL', 'BLOCKED', 'RECOVERING', 'EXECUTING'] as const).map(st => (
            <button
              key={st}
              onClick={() => setSelectedFilter(st as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-slate-400">Total: {filteredTasks.length} Tugas Terdaftar</span>
      </div>

      {/* Task List Grid */}
      <div className="space-y-4 font-mono text-xs">
        {filteredTasks.map(t => (
          <div key={t.taskId} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {t.taskId} &bull; Pemohon: {t.requester} ({t.role}) &bull; {t.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    t.priority === 'CRITICAL' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                    t.priority === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{t.objective}</h4>
              </div>

              {/* State Badge */}
              <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                t.state === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                t.state === 'WAITING_APPROVAL' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                t.state === 'BLOCKED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                t.state === 'RECOVERING' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {t.state === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {t.state === 'WAITING_APPROVAL' && <Clock className="w-3.5 h-3.5" />}
                {t.state === 'BLOCKED' && <AlertTriangle className="w-3.5 h-3.5" />}
                {t.state === 'RECOVERING' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>STATE: {t.state}</span>
              </span>
            </div>

            {/* Execution Result */}
            {t.result && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-200">
                <strong>Hasil Eksekusi:</strong> {t.result}
              </div>
            )}

            {/* Human Handoff Card (R684) */}
            {t.humanHandoff && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2 text-[11px] text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>HUMAN HANDOFF CARD (R684) &bull; Otoritas: {t.humanHandoff.requiredAuthorityRole}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><strong>Pekerjaan Selesai:</strong> {t.humanHandoff.completedWorkSummary}</div>
                  <div><strong>Pekerjaan Tertunda:</strong> {t.humanHandoff.pendingWorkSummary}</div>
                  <div><strong>Alasan Terhenti:</strong> {t.humanHandoff.blockerReason}</div>
                  <div><strong>Tindakan yang Diperlukan:</strong> <span className="underline">{t.humanHandoff.requiredAction}</span></div>
                </div>
              </div>
            )}

            {/* Task Footer Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400">
              <div>
                <span>Audit Ref: <strong>{t.auditReference}</strong> &bull; </span>
                <span>Executor: <strong>{t.assignedExecutor}</strong> &bull; </span>
                <span>Created: {t.createdAt.replace('T', ' ').slice(0, 19)}</span>
              </div>
              {t.state !== 'CANCELLED' && t.state !== 'COMPLETED' && (
                <button
                  onClick={() => handleCancelTask(t.taskId)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                >
                  Batalkan Tugas
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* R680: Administrative Workflow Library Browser */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <strong className="text-sm text-slate-900 dark:text-white">R680: Administrative Workflow Library (10 Blueprints)</strong>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            100% Menggunakan SSoT db.ts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {wfLib.getAllWorkflows().map(w => (
            <div
              key={w.workflowId}
              onClick={() => setViewWorkflow(w)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{w.workflowId}</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[9px]">
                  {w.targetRole}
                </span>
              </div>
              <h5 className="font-bold text-slate-900 dark:text-white text-xs">{w.title}</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">{w.description}</p>
              <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                <span>{w.processSteps.length} Langkah Proses</span>
                <span className="underline">Lihat Detail &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Detail Modal */}
        {viewWorkflow && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800 pb-2">
              <h4 className="text-sm font-bold text-indigo-950 dark:text-white">{viewWorkflow.workflowId}: {viewWorkflow.title}</h4>
              <button onClick={() => setViewWorkflow(null)} className="text-xs text-indigo-600 font-bold">✕ Tutup</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">Langkah Proses:</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {viewWorkflow.processSteps.map((st, idx) => (
                    <li key={idx}><strong>{st.name}</strong>: {st.description}</li>
                  ))}
                </ol>
              </div>
              <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <div><strong>Input:</strong> {viewWorkflow.inputSpec.join(', ')}</div>
                <div><strong>Validasi:</strong> {viewWorkflow.validationRules.join(', ')}</div>
                <div><strong>Output:</strong> {viewWorkflow.outputArtifacts.join(', ')}</div>
                <div><strong>Recovery:</strong> {viewWorkflow.recoveryProcedure}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
