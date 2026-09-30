import React, { useState } from 'react';
import { 
  Clock, 
  History, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Bell, 
  Layers,
  Terminal,
  BookOpen,
  HardDrive
} from 'lucide-react';
import { AdministrativeTimelineEngine, UnifiedTimelineEvent } from '../../core/smartoffice/AdministrativeTimelineEngine';
import { SmartNotificationRouter, SmartNotification } from '../../core/smartoffice/SmartNotificationRouter';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AdministrativeTimelineViewer: React.FC = () => {
  const { activeRole } = useAuth();
  const currentRole: UserRole = activeRole || 'SUPER_ADMIN';

  const timelineEngine = AdministrativeTimelineEngine.getInstance();
  const notifRouter = SmartNotificationRouter.getInstance();

  const [activeTab, setActiveTab] = useState<'timeline' | 'notifications'>('timeline');
  const [filterSource, setFilterSource] = useState<string>('ALL');

  const timelineEvents = timelineEngine.getUnifiedTimeline(filterSource);
  const notifications = notifRouter.getNotificationsForRole(currentRole);

  const getSourceIcon = (src: string) => {
    switch (src) {
      case 'DECISION_JOURNAL': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'COMMAND_HISTORY': return <Terminal className="w-4 h-4 text-sky-400" />;
      case 'RECOVERY_SNAPSHOT': return <HardDrive className="w-4 h-4 text-amber-400" />;
      case 'GUARDIAN_AUDIT': return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6" id="administrative-timeline-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                R716 &amp; R717 &bull; Unified Activity Timeline &amp; Notification Router
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Immutable History
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Linimasa Aktivitas Terpadu &amp; Notifikasi Cerdas
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Agregasi historis keputusan strategis (R706), komando Founder (R708), snapshot recovery, dan audit Guardian dalam linimasa tak terubah (*immutable*).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Linimasa ({timelineEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifikasi ({notifications.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {/* Timeline Filter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-2 shadow-lg">
            <Filter className="w-4 h-4 text-slate-400 mr-1" />
            <span className="text-xs font-bold text-slate-300">Sumber Data:</span>
            {[
              { id: 'ALL', label: 'Semua Sumber' },
              { id: 'DECISION_JOURNAL', label: 'Buku Keputusan (R706)' },
              { id: 'COMMAND_HISTORY', label: 'Komando Founder (R708)' },
              { id: 'RECOVERY_SNAPSHOT', label: 'Snapshot Recovery' },
              { id: 'GUARDIAN_AUDIT', label: 'Guardian Ring-0' }
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setFilterSource(src.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  filterSource === src.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          {/* Timeline Vertical Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center group-hover:border-emerald-500 transition">
                    {getSourceIcon(evt.source)}
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400">{evt.actor}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-slate-300">
                          {evt.badge}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(evt.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{evt.title}</h3>
                    <p className="text-xs text-slate-400">{evt.description}</p>

                    {evt.metadata && (
                      <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-500 flex flex-wrap items-center gap-3 font-mono">
                        {Object.entries(evt.metadata).map(([k, v]) => (
                          <span key={k}>
                            {k}: <strong className="text-slate-400">{String(v)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              Notifikasi Aktif Sesuai Peran: {currentRole}
            </h2>
            <span className="text-xs text-slate-400">
              Deduplikasi &bull; Zero Spam &bull; Zero External Cost
            </span>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                      {notif.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{notif.category}</span>
                    <span className="text-xs text-slate-500">&bull;</span>
                    <span className="text-xs text-slate-500">{new Date(notif.createdAt).toLocaleTimeString('id-ID')}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                  <p className="text-xs text-slate-400">{notif.body}</p>
                </div>

                <button
                  onClick={() => notifRouter.markAsRead(notif.id, currentRole)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 transition shrink-0"
                >
                  Tandai Dibaca
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
