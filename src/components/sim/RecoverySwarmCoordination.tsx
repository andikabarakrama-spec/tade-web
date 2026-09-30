import React, { useState } from 'react';
import { Users, RefreshCw, Zap, Shield, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Cpu } from 'lucide-react';

interface SwarmPair {
  primaryEngine: string;
  primaryRole: string;
  helperEngine: string;
  helperRole: string;
  scenario: string;
  swarmStrategy: string;
  status: 'ACTIVE_SWARM' | 'STANDBY_SYNCED';
}

export const RecoverySwarmCoordination: React.FC = () => {
  const [swarmPairs, setSwarmPairs] = useState<SwarmPair[]>([
    {
      primaryEngine: 'Firestore Data Pipeline',
      primaryRole: 'Primary cloud persistence database',
      helperEngine: 'Offline Queue & IndexedDB Buffer',
      helperRole: 'Mencegah kehilangan transaksi saat koneksi Firestore terputus',
      scenario: 'Firestore timeout atau koneksi lambat',
      swarmStrategy: 'Queue menampung mutasi data secara lokal, lalu menyinkronkan otomatis saat Firestore rejoin.',
      status: 'ACTIVE_SWARM'
    },
    {
      primaryEngine: 'Session & Auth Fortress',
      primaryRole: 'Manajemen login & validasi role RBAC',
      helperEngine: 'Route Memory & Secure Cookie Vault',
      helperRole: 'Menyimpan checkpoint halaman terakhir pengguna secara aman',
      scenario: 'Sesi browser restart / token refresh delay',
      swarmStrategy: 'Route Memory mengembalikan guru/admin ke halaman & draft formulir tanpa kehilangan input data.',
      status: 'ACTIVE_SWARM'
    },
    {
      primaryEngine: 'CCTV Perimeter Ingest',
      primaryRole: 'Pengawasan live feed gerbang & halaman PAUD',
      helperEngine: 'Timeline Incident & Audit Trail',
      helperRole: 'Mencatat snapshot & status berkala gerbang',
      scenario: 'RTSP stream kamera offline sesaat',
      swarmStrategy: 'Timeline tetap mencatat log keamanan gerbang dan Asy memberikan notifikasi cerdas kepada operator.',
      status: 'ACTIVE_SWARM'
    },
    {
      primaryEngine: 'PPDB Registration Engine',
      primaryRole: 'Penerimaan berkas wali murid baru',
      helperEngine: 'WORM Immutable Storage & Local Sandbox',
      helperRole: 'Menyimpan dokumen pendaftar secara instan',
      scenario: 'Lonjakan 50+ pendaftar simultan',
      swarmStrategy: 'Swarm buffer membagi beban unggahan file dan memberikan tanda terima digital QR instan.',
      status: 'ACTIVE_SWARM'
    }
  ]);

  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const triggerSwarmSimulation = (primary: string) => {
    setActiveSimulation(primary);
    setTimeout(() => {
      setActiveSimulation(null);
    }, 1500);
  };

  return (
    <div id="recovery-swarm-coordination-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-teal-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              TADE RC70 • R529
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Collaborative Self-Healing
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-teal-400" />
            Recovery Swarm Coordination
          </h1>
          <p className="text-teal-100/80 text-sm mt-1 max-w-2xl">
            Mekanisme gotong-royong antar-engine: saat satu modul mengalami hambatan, engine lain otomatis menopang beban kerja sehingga operasional sekolah tidak pernah terhenti.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-teal-500/30 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-teal-300 block">Swarm Consensus</span>
          <span className="text-xl font-bold text-teal-400">100% COLLABORATIVE</span>
        </div>
      </div>

      {/* Swarm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swarmPairs.map((pair, index) => (
          <div key={index} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Swarm Pair #{index + 1}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {pair.status}
                </span>
              </div>

              {/* Engine Pair Visual */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-3">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Primary Node</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{pair.primaryEngine}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-500 shrink-0" />
                <div className="flex-1 text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Helper Swarm Node</div>
                  <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{pair.helperEngine}</div>
                </div>
              </div>

              {/* Scenario & Strategy */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Skenario Gangguan: </span>
                  <span>{pair.scenario}</span>
                </div>
                <div>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">Strategi Kolaboratif: </span>
                  <span>{pair.swarmStrategy}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => triggerSwarmSimulation(pair.primaryEngine)}
                disabled={activeSimulation !== null}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${activeSimulation === pair.primaryEngine ? 'animate-spin text-teal-600' : ''}`} />
                {activeSimulation === pair.primaryEngine ? 'Simulating Swarm Handshake...' : 'Simulate Swarm Handshake'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resilience Summary */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          Filosofi Recovery Swarm TADE
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Tidak ada modul yang berdiri terisolasi. Arsitektur TADE menjamin setiap komponen memiliki pendamping otomatis yang siap menampung antrean permintaan (queueing), menjaga rute pengguna (route memory), dan memelihara jejak audit (timeline integrity) sehingga aplikasi senantiasa responsif 100%.
        </p>
      </div>
    </div>
  );
};
