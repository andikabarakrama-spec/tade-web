import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  GraduationCap, 
  ShieldAlert, 
  Activity, 
  Send,
  BookOpen,
  Wifi,
  WifiOff
} from 'lucide-react';
import { ContextTriggerEngine, PlatformContextEventType, TriggerEventPayload } from '../../core/mascot3d/contextTriggerEngine';

export const AsyTriggerViewer: React.FC = () => {
  const triggerEngine = useMemo(() => ContextTriggerEngine.getInstance(), []);
  const [events, setEvents] = useState<TriggerEventPayload[]>(() => triggerEngine.getRecentEvents());
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  useEffect(() => {
    return triggerEngine.subscribe(() => {
      setEvents(triggerEngine.getRecentEvents());
    });
  }, [triggerEngine]);

  const testScenarios: { type: PlatformContextEventType; label: string; icon: React.ElementType; color: string }[] = [
    { type: 'USER_LOGIN', label: 'User Login Sapaan', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { type: 'SAVE_SUCCESS', label: 'Data Save Success (SSoT)', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { type: 'OPERATION_ERROR', label: 'System Error Intercept', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { type: 'NOTIFICATION_RECEIVED', label: 'New Notification Ping', icon: Bell, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { type: 'PPDB_SUBMITTED', label: 'PPDB Santri Baru Submitted', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { type: 'TAHFIDZ_MILESTONE', label: 'Tahfidz Hafalan Milestone', icon: BookOpen, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'OFFLINE_DETECTED', label: 'Offline Continuity Trigger', icon: WifiOff, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'ONLINE_RESTORED', label: 'Online Sync Restored', icon: Wifi, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  ];

  const handleSimulate = (type: PlatformContextEventType, label: string) => {
    triggerEngine.dispatchEvent(type, {
      title: label,
      detail: `Simulasi event trigger dari Asy Trigger Deck (${type})`
    });
    setLastDispatched(`Trigger [${type}] berhasil ditembakkan.`);
    setTimeout(() => setLastDispatched(null), 3000);
  };

  return (
    <div id="r784-context-trigger-engine" className="space-y-6">
      {lastDispatched && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {lastDispatched} Periksa widget Asy di sudut layar untuk melihat respon animasi & bubble.
        </div>
      )}

      {/* Simulator Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Platform Context Event Simulation
        </h3>
        <p className="text-xs text-stone-500">
          Uji respon spontan Asy terhadap berbagai macam kondisi aplikasi (login, simpan data, error, PPDB, tahfidz).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {testScenarios.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleSimulate(type, label)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer hover:shadow-xs flex flex-col justify-between space-y-3 ${color}`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-mono font-bold opacity-70">SIMULATE</span>
              </div>
              <p className="text-xs font-bold">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Trigger Event Logs */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" /> Event Dispatch Log (In-Memory Ring Buffer)
        </h3>

        {events.length === 0 ? (
          <p className="text-xs text-stone-400 italic">Belum ada event trigger yang dieksekusi.</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 8).map((evt, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md font-mono text-[10px] font-bold">
                    {evt.type}
                  </span>
                  <span className="font-medium text-slate-800">{evt.title || 'Platform Event'}</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">
                  {new Date(evt.timestamp).toLocaleTimeString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
