import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  Layers, 
  FileText, 
  Archive, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export type MissionLifecycleStage = 
  | 'DIBUAT' 
  | 'DIBAGIKAN' 
  | 'SEDANG_DIKERJAKAN' 
  | 'MENUNGGU_VERIFIKASI' 
  | 'SELESAI' 
  | 'DIARSIPKAN';

interface CommandTimelineProps {
  currentStage: MissionLifecycleStage;
  progressPct: number;
  missionCode: string;
  createdAt: string;
  targetDate: string;
  onAdvanceStage?: (newStage: MissionLifecycleStage) => void;
}

const STAGES: { stage: MissionLifecycleStage; label: string; desc: string; icon: any }[] = [
  { stage: 'DIBUAT', label: '1. Dibuat', desc: 'Direktif Super Admin & Dekomposisi AI', icon: Sparkles },
  { stage: 'DIBAGIKAN', label: '2. Dibagikan', desc: 'Dispatched ke 6 Tier Rantai Komando', icon: Send },
  { stage: 'SEDANG_DIKERJAKAN', label: '3. Dikerjakan', desc: 'Eksekusi aktif oleh Admin & Guru', icon: Clock },
  { stage: 'MENUNGGU_VERIFIKASI', label: '4. Verifikasi', desc: 'Validasi berkas oleh Kepala Sekolah', icon: ShieldCheck },
  { stage: 'SELESAI', label: '5. Selesai', desc: 'Pengesahan Ketua Yayasan & LPJ Terbit', icon: CheckCircle2 },
  { stage: 'DIARSIPKAN', label: '6. Diarsipkan', desc: 'Tersimpan permanen di Smart Vault', icon: Archive }
];

export const CommandTimeline: React.FC<CommandTimelineProps> = ({
  currentStage,
  progressPct,
  missionCode,
  createdAt,
  targetDate,
  onAdvanceStage
}) => {
  const currentStageIndex = STAGES.findIndex(s => s.stage === currentStage);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>R115 • Live Mission Lifecycle Timeline</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300">
              {missionCode}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Dibuat: <strong className="text-slate-700 dark:text-slate-200">{createdAt}</strong></span>
          <span>•</span>
          <span>Target Selesai: <strong className="text-indigo-600 dark:text-indigo-400">{targetDate}</strong></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Progres Eksekusi Rantai Komando</span>
          <span className="text-indigo-600 dark:text-indigo-400">{progressPct}% Selesai</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Interactive Timeline Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          const isPassed = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={s.stage}
              onClick={() => onAdvanceStage && onAdvanceStage(s.stage)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : isPassed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white' 
                      : isPassed 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isPassed && <span className="text-[10px] text-emerald-600 font-bold">✓ OK</span>}
                  {isCurrent && <span className="text-[10px] text-indigo-600 font-bold animate-pulse">● AKTIF</span>}
                </div>

                <div className={`text-xs font-bold ${
                  isCurrent ? 'text-indigo-900 dark:text-indigo-200' : isPassed ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {s.label}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-2">
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
