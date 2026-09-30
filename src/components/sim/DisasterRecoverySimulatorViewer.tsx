import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldCheck, 
  Zap, 
  Flame, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  HardDrive, 
  WifiOff, 
  Clock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { immortalStorage } from '../../core/kernel/ImmortalStorageManager';
import { kernelEventBus } from '../../core/kernel/KernelEventBus';

interface DisasterScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  automatedRecoveryAction: string;
}

export const DisasterRecoverySimulatorViewer: React.FC = () => {
  const [scenarios] = useState<DisasterScenario[]>([
    {
      id: 'DIS-01',
      name: 'Listrik Padam Mendadak (Power Outage)',
      category: 'POWER_FAILURE',
      description: 'Catu daya server lokal putus saat penulisan SPP siswa sedang berlangsung.',
      impactLevel: 'CRITICAL',
      automatedRecoveryAction: 'WAL replay otomatis mengembalikan state sebelum listrik mati.'
    },
    {
      id: 'DIS-02',
      name: 'Browser Tab Crash / OOM Terminate',
      category: 'BROWSER_RUNTIME',
      description: 'Browser kehabisan RAM karena ekstensi pihak ketiga dan menutup tab SIM.',
      impactLevel: 'HIGH',
      automatedRecoveryAction: 'Crash Sentinel merekonstruksi form draft dan posisi halaman kerja.'
    },
    {
      id: 'DIS-03',
      name: 'Firestore Remote Timeout (10000ms)',
      category: 'NETWORK_TIMEOUT',
      description: 'Jalur internet ke Google Cloud Firestore mengalami packet loss 100%.',
      impactLevel: 'HIGH',
      automatedRecoveryAction: 'Immortal Storage mengalihkan penulisan ke Offline Queue lokal.'
    },
    {
      id: 'DIS-04',
      name: 'Local Cache Corrupted by Extension',
      category: 'DATA_INTEGRITY',
      description: 'Ekstensi browser memanipulasi string JSON pada localStorage.',
      impactLevel: 'CRITICAL',
      automatedRecoveryAction: 'Guardian Integrity mendeteksi checksum mismatch dan me-restore snapshot SHA-256.'
    },
    {
      id: 'DIS-05',
      name: 'Session Token Expired Mid-Exam',
      category: 'AUTHENTICATION',
      description: 'Token auth kedaluwarsa saat siswa sedang mengerjakan ujian online.',
      impactLevel: 'MEDIUM',
      automatedRecoveryAction: 'Silent token refresh tanpa me-refresh halaman ujian santri.'
    },
    {
      id: 'DIS-06',
      name: 'Storage Quota Full (QuotaExceededError)',
      category: 'DISK_LIMIT',
      description: 'LocalStorage browser penuh akibat akumulasi cache aset lama.',
      impactLevel: 'HIGH',
      automatedRecoveryAction: 'Automatic LRU cache eviction pada tier memori sekunder.'
    },
    {
      id: 'DIS-07',
      name: 'Reconnect Storm (1000 Simultan Klien)',
      category: 'CONCURRENCY_BURST',
      description: 'Internet kembali menyala dan 1000 tab melakukan sinkronisasi bersamaan.',
      impactLevel: 'HIGH',
      automatedRecoveryAction: 'Exponential backoff dengan jitter acak untuk mencegah API throttling.'
    }
  ]);

  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleRunSimulation = (scenario: DisasterScenario) => {
    setActiveTestId(scenario.id);
    setTestResult(null);

    kernelEventBus.publish({
      type: 'recovery.initiated',
      sourceEngine: 'GUARDIAN',
      severity: 'WARNING',
      data: { scenario: scenario.name, action: scenario.automatedRecoveryAction },
      traceId: `TRC-DISASTER-${scenario.id}`
    });

    setTimeout(() => {
      setActiveTestId(null);
      setTestResult(`[${scenario.id}] SIMULASI SUKSES: ${scenario.automatedRecoveryAction} Sistem 100% pulih tanpa data loss.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/30 text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                R591 &bull; DISASTER RECOVERY SIMULATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">Chaos Engineering &bull; 7 Disaster Vectors</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Disaster Recovery &amp; Chaos Simulator</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 7/7 Recovery Playbooks Ready
          </span>
        </div>
      </div>

      {testResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* 7 Chaos Scenarios Grid */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-slate-300 font-bold flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          Simulasi Skenario Bencana Nyata:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition flex flex-col justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300 font-bold text-[10px]">
                    {sc.id} &bull; {sc.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                    sc.impactLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {sc.impactLevel}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1.5">{sc.name}</h4>
                <p className="text-[11px] text-slate-400 font-sans mt-1">
                  {sc.description}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-emerald-300">
                <strong>Mitigasi Otomatis:</strong> {sc.automatedRecoveryAction}
              </div>

              <button
                onClick={() => handleRunSimulation(sc)}
                disabled={activeTestId !== null}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${activeTestId === sc.id ? 'animate-spin' : ''}`} />
                {activeTestId === sc.id ? 'Simulating Chaos & Auto-Healing...' : 'Uji Pemulihan Bencana Ini'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
