import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  UserCheck,
  Radio,
  FileCheck,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ArrowRight,
  Shield,
  Clock,
  HeartHandshake,
  CheckCheck,
  Send,
  BellRing,
  Layers
} from 'lucide-react';
import {
  adminCompanionService,
  AdminProactiveSuggestion,
  AdminProductivityMetrics
} from '../../services/adminCompanionService';

interface Props {
  onTriggerAction?: (actionPayload: string) => void;
}

export const AdminNeverAloneAssistant: React.FC<Props> = ({ onTriggerAction }) => {
  const [suggestions, setSuggestions] = useState<AdminProactiveSuggestion[]>([]);
  const [metrics, setMetrics] = useState<AdminProductivityMetrics>(adminCompanionService.getMetrics());
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshState = () => {
    setSuggestions(adminCompanionService.getActiveSuggestions());
    setMetrics(adminCompanionService.getMetrics());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleDismiss = (id: string) => {
    adminCompanionService.dismissSuggestion(id);
    refreshState();
  };

  const handleAction = (suggestion: AdminProactiveSuggestion) => {
    if (suggestion.actionPayload === 'QUICK_VERIFY_PPDB') {
      const res = adminCompanionService.executeQuickVerifyPPDB();
      setFeedback(res.message);
    } else if (suggestion.actionPayload === 'SEND_DRAFT_BROADCAST') {
      const res = adminCompanionService.executeSendDraftBroadcast();
      setFeedback(res.message);
    } else if (suggestion.actionPayload === 'SEND_SMART_REMINDER') {
      const res = adminCompanionService.executeSendSmartReminder();
      setFeedback(res.message);
    } else {
      setFeedback(`Tindakan "${suggestion.actionLabel}" diproses.`);
      if (onTriggerAction) {
        onTriggerAction(suggestion.actionPayload);
      }
      handleDismiss(suggestion.id);
    }

    refreshState();
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleBatchApprove = () => {
    const res = adminCompanionService.executeBatchApprove();
    setFeedback(res.message);
    refreshState();
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 md:p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Mode Pendamping Asy (Admin Never Alone)
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 font-bold">
                {metrics.totalPendingTasks} Tugas Menunggu
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800 font-semibold">
                Sprint G9 Productivity Boost
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Asy siap mendampingi operasional harian: Quick Verify, Batch Approve & Smart Reminder
            </h3>
          </div>
        </div>

        {/* Action shortcut bar */}
        {metrics.pendingPPDBCount > 0 && (
          <button
            onClick={handleBatchApprove}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Batch Approve ({metrics.pendingPPDBCount} Berkas)</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-inner">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of Proactive Cards */}
      {suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {suggestions.map(s => {
            let icon = <UserCheck className="w-4 h-4 text-emerald-400" />;
            if (s.category === 'BROADCAST') icon = <Radio className="w-4 h-4 text-indigo-400" />;
            if (s.category === 'ARCHIVE') icon = <FileCheck className="w-4 h-4 text-amber-400" />;
            if (s.category === 'RAPOR_PHOTO') icon = <ImageIcon className="w-4 h-4 text-cyan-400" />;

            return (
              <div
                key={s.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 relative group"
              >
                <button
                  onClick={() => handleDismiss(s.id)}
                  className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-300 p-1"
                  title="Tutup anjuran ini"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-1.5 pr-6">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {s.category}
                    </span>
                    {s.affectedCount > 0 && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                        {s.affectedCount}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{s.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{s.description}</p>
                </div>

                <button
                  onClick={() => handleAction(s)}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/60 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{s.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Semua tugas operasional telah selesai dan antrean bersih. Asy tetap siaga mendampingi.</span>
        </div>
      )}
    </div>
  );
};

