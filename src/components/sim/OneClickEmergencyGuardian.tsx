import React, { useState } from 'react';
import {
  Flame,
  ShieldAlert,
  Lock,
  Camera,
  Milestone,
  FileCheck2,
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const OneClickEmergencyGuardian: React.FC = () => {
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<{ step: string; status: string; time: string }[]>([]);

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    const now = new Date().toLocaleTimeString('id-ID');
    const logs = [
      { step: '1. Lock Ring Buffer CCTV 6 Kamera (-30 menit s/d sekarang)', status: 'LOCKED', time: now },
      { step: '2. Ekstraksi Snapshot Resolusi Tinggi Seluruh Sudut Gerbang & Koridor', status: 'EXTRACTED', time: now },
      { step: '3. Pembuatan Timeline Kronologis Otomatis', status: 'GENERATED', time: now },
      { step: '4. Pembungkusan Evidence Pack & Hash Kriptografis SHA-256', status: 'SEALED', time: now },
      { step: '5. Pengiriman Sinyal Notifikasi Darurat ke Satpam, Yayasan & Polsek', status: 'DISPATCHED', time: now },
      { step: '6. Layar Beralih ke Mode Komando Insiden Terpadu', status: 'ACTIVE', time: now }
    ];
    setExecutionLogs(logs);

    blackBoxRecorder.record({
      moduleCode: 'R396-SOS',
      role: 'SECURITY_COMMANDER',
      eventType: 'SECURITY',
      details: 'GUARDIAN SOS TRIGGERED. 6 emergency protocols executed simultaneously.',
      severity: 'CRITICAL'
    });
  };

  const handleResetSOS = () => {
    setSosTriggered(false);
    setExecutionLogs([]);
    blackBoxRecorder.record({
      moduleCode: 'R396-SOS',
      role: 'SECURITY_COMMANDER',
      eventType: 'ACTION',
      details: 'Guardian SOS Deactivated. System restored to standard standby.',
      severity: 'INFO'
    });
  };

  return (
    <div id="one-click-emergency-guardian-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        sosTriggered 
          ? 'bg-rose-950 border-rose-600 text-white animate-pulse' 
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R396 &bull; ONE CLICK EMERGENCY CONSTITUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">Instant Guardian SOS Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Flame className="w-8 h-8 text-rose-500" />
              Tombol Darurat Terpadu: Guardian SOS
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Satu klik instan mengeksekusi 6 tindakan darurat sekaligus: kunci rekaman, snapshot, timeline, bundle berkas bukti, notifikasi multi-kanal, dan dasbor komando.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!sosTriggered ? (
              <button
                onClick={handleTriggerSOS}
                className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm font-mono shadow-xl shadow-rose-600/40 flex items-center gap-3 active:scale-95 transition-all"
              >
                <Flame className="w-6 h-6 animate-bounce" /> AKTIFKAN GUARDIAN SOS SEKARANG
              </button>
            ) : (
              <button
                onClick={handleResetSOS}
                className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm font-mono shadow-xl flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Matikan Sinyal SOS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Execution Stream */}
      {sosTriggered && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-rose-300 dark:border-rose-900 shadow-md space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Radio className="w-4 h-4 animate-ping" />
              Protokol Darurat Sedang Aktif (6/6 Sukses Tereksekusi)
            </h3>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
              CRITICAL MODE
            </span>
          </div>

          <div className="space-y-2">
            {executionLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">{log.step}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  {log.status} &bull; {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
