import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle,
  Plus,
  Filter,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { smartReminderEngine } from '../../core/companion/smartReminderEngine';
import { CompanionRole, ReminderPriority, SmartReminder } from '../../core/companion/companionTypes';

export const SmartReminderViewer: React.FC = () => {
  const [reminders, setReminders] = useState<SmartReminder[]>(
    smartReminderEngine.getAllReminders()
  );
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Form states for test dispatch
  const [targetRole, setTargetRole] = useState<CompanionRole>('EXECUTIVE');
  const [priority, setPriority] = useState<ReminderPriority>('HIGH');
  const [category, setCategory] = useState<'SECURITY' | 'ACADEMIC' | 'FINANCE' | 'RECOVERY' | 'ADMINISTRATION'>('ACADEMIC');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [dispatchResult, setDispatchResult] = useState<{ success: boolean; msg: string } | null>(null);

  const refreshList = () => {
    setReminders(smartReminderEngine.getAllReminders());
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const res = smartReminderEngine.dispatchReminder({
      targetRole,
      priority,
      category,
      title: title.trim(),
      message: message.trim(),
      sourceModule: 'RC93 Manual Dispatcher'
    });

    if (res.success) {
      setDispatchResult({ success: true, msg: `Pengingat berhasil diterbitkan (DedupHash: ${res.reminder?.dedupHash})` });
      setTitle('');
      setMessage('');
      refreshList();
    } else {
      setDispatchResult({ success: false, msg: res.reason || 'Deduplication suppressed this duplicate reminder.' });
    }

    setTimeout(() => setDispatchResult(null), 5000);
  };

  const handleStatusChange = (reminderId: string, status: any) => {
    smartReminderEngine.updateStatus(reminderId, status);
    refreshList();
  };

  const filtered = reminders.filter(r => {
    if (roleFilter !== 'ALL' && r.targetRole !== roleFilter && r.targetRole !== 'UNIVERSAL') return false;
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="smart-reminder-engine-view">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-2xl border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R756 Deduplicated Notification Dispatcher
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Priority: CRITICAL / HIGH / MED / LOW
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bell className="w-7 h-7 text-amber-400" />
              Smart Reminder Engine
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Sistem pengingat kontekstual antar-peran: mencegah kejenuhan notifikasi melalui hash deduplikasi otomatis serta pengelompokan prioritas waktu nyata.
            </p>
          </div>

          <button
            onClick={() => {
              smartReminderEngine.resetToDefaults();
              refreshList();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>
        </div>
      </div>

      {dispatchResult && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
            dispatchResult.success
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}
        >
          {dispatchResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <div>{dispatchResult.msg}</div>
        </div>
      )}

      {/* Dispatch Form with Deduplication Protection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-slate-100 text-base mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Dispatch Pengingat Baru (Deduplicated)
        </h3>
        <form onSubmit={handleDispatch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Judul Pengingat..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Pesan instruksi ringkas..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value as CompanionRole)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="EXECUTIVE">EXECUTIVE</option>
              <option value="TEACHER">TEACHER</option>
              <option value="PARENT">PARENT</option>
              <option value="UNIVERSAL">UNIVERSAL</option>
            </select>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as ReminderPriority)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="SECURITY">SECURITY</option>
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="FINANCE">FINANCE</option>
              <option value="RECOVERY">RECOVERY</option>
              <option value="ADMINISTRATION">ADMIN</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
          >
            <Plus className="w-4 h-4" /> Terbitkan Pengingat
          </button>
        </form>
      </div>

      {/* Filter Tabs & Reminder List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-400" />
            Daftar Pengingat Aktif ({filtered.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  priorityFilter === p
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => (
            <div
              key={r.reminderId}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                r.priority === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20'
                  : r.priority === 'HIGH'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-slate-200 text-sm">{r.title}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      r.priority === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : r.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {r.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{r.message}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {r.targetRole}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Hash: {r.dedupHash}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {r.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(r.reminderId, 'RESOLVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" /> Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
