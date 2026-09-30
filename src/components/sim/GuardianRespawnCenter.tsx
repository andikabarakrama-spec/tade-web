import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  RotateCcw,
  Shield,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame
} from 'lucide-react';

export interface RespawnRecord {
  id: string;
  guardianName: string;
  incidentTrigger: string;
  detectedAt: string;
  isolatedInMs: number;
  recoveredInMs: number;
  reinforcementAdded: string;
  battleMemoryId: string;
  status: 'WATCHING' | 'REINFORCED';
}

export const GuardianRespawnCenter: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const respawnSteps = [
    { step: 1, name: '1. DETECT', desc: 'Deteksi anomali via Invariant Checkpoint', color: 'text-amber-500' },
    { step: 2, name: '2. ISOLATE', desc: 'Karantina thread/request tanpa menyentuh core DB', color: 'text-rose-500' },
    { step: 3, name: '3. RECOVER', desc: 'Pemulihan non-destruktif dari checkpoint bersih', color: 'text-blue-500' },
    { step: 4, name: '4. REINFORCE', desc: 'Pemberlakuan auto-hardening & perketat batas', color: 'text-purple-500' },
    { step: 5, name: '5. LEARN', desc: 'Generasi Battle Memory & simpan ke GKL', color: 'text-teal-500' },
    { step: 6, name: '6. WATCH', desc: 'Kembali ke status siaga pasca-respawn aman', color: 'text-emerald-500' }
  ];

  const recentRespawns: RespawnRecord[] = [
    {
      id: 'respawn-01',
      guardianName: 'Guardian Resilient Storage Uploader',
      incidentTrigger: 'Upload Timeout saat Jaringan Seluler Drop',
      detectedAt: '04:50 WIB',
      isolatedInMs: 12,
      recoveredInMs: 110,
      reinforcementAdded: 'Exponential Backoff Multiplier x1.5 + Offline IndexedDB Buffer',
      battleMemoryId: 'BM-2026-0814-01',
      status: 'WATCHING'
    },
    {
      id: 'respawn-02',
      guardianName: 'Guardian Financial Invariant (FIND-08-R4)',
      incidentTrigger: 'Simulasi Upaya Klik Ganda Transaksi SPP (H0-01 Test)',
      detectedAt: '04:42 WIB',
      isolatedInMs: 4,
      recoveredInMs: 45,
      reinforcementAdded: 'Anti-Double Spend Mutex Lock Re-Verification',
      battleMemoryId: 'BM-2026-0814-02',
      status: 'REINFORCED'
    },
    {
      id: 'respawn-03',
      guardianName: 'Guardian DDoS Ingress Gate',
      incidentTrigger: 'Lonjakan 120 Request/Menit dari 1 Alamat IP',
      detectedAt: '04:30 WIB',
      isolatedInMs: 8,
      recoveredInMs: 80,
      reinforcementAdded: 'IP Honey Shield auto-isolate & challenge captcha challenge',
      battleMemoryId: 'BM-2026-0814-03',
      status: 'WATCHING'
    }
  ];

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsSimulating(false);
          return 6;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div id="guardian-respawn-center" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Pusat Siklus Kebangkitan Guardian (Respawn System)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Protokol pertahanan abadi: <strong>Detect → Isolate → Recover → Reinforce → Learn → Watch</strong> tanpa modifikasi data produksi.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            isSimulating
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-md font-black'
          }`}
        >
          {isSimulating ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-teal-400" />
              Menjalankan Siklus Respawn...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Simulasikan Siklus 6-Langkah
            </>
          )}
        </button>
      </div>

      {/* 6-Step Visual Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
          Alur Hidup & Pemulihan Mandiri Guardian
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {respawnSteps.map((s) => {
            const isCurrent = activeStep === s.step;
            const isPassed = activeStep > s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-xl border transition text-center flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-teal-500 shadow-md ring-2 ring-teal-500/20 scale-105'
                    : isPassed
                    ? 'bg-teal-50/50 border-teal-200 text-slate-800'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div>
                  <div className={`text-xs font-black tracking-wider ${isCurrent ? 'text-teal-400' : s.color}`}>
                    {s.name}
                  </div>
                  <p className={`text-[11px] mt-2 leading-tight ${isCurrent ? 'text-slate-300' : 'text-stone-500'}`}>
                    {s.desc}
                  </p>
                </div>

                <div className="mt-3 flex justify-center">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-stone-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History of Non-Destructive Respawns */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-900">Catatan Respawn & Reinforcement Terakhir</h4>
          <span className="text-xs text-stone-500">Total 0 Data Rusak / 100% Non-Destructive</span>
        </div>

        <div className="space-y-3">
          {recentRespawns.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-stone-900">{rec.guardianName}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500">
                  <span>Isolasi: {rec.isolatedInMs}ms</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Pulih: {rec.recoveredInMs}ms</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Pemicu: </span>
                {rec.incidentTrigger}
              </div>

              <div className="mt-2 pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-700 bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-lg">
                  <span className="font-semibold text-teal-800">Penguatan: </span>
                  {rec.reinforcementAdded}
                </div>
                <span className="font-mono text-[11px] text-slate-400">Memory Card: {rec.battleMemoryId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
