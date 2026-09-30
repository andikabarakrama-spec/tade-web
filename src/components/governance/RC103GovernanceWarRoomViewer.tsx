import React from 'react';
import { Crown, ShieldCheck, CheckCircle2, Award, Zap, ArrowRight, Activity, Users, Database, Layers } from 'lucide-react';

interface Props {
  onSelectModule?: (tab: string) => void;
}

export const RC103GovernanceWarRoomViewer: React.FC<Props> = ({ onSelectModule }) => {
  const modules = [
    { id: 'r851', code: 'R851', name: 'Guardian Policy Center', desc: 'Penegakan kebijakan Ring-0, kedaulatan data & UU PDP', status: 'DITEGAKKAN (100%)', color: 'emerald' },
    { id: 'r852', code: 'R852', name: 'Audit Timeline Explorer', desc: 'Jejak kronologis imutabel berbukti tanda tangan SHA-256', status: 'IMUTABEL', color: 'blue' },
    { id: 'r853', code: 'R853', name: 'School Command Center', desc: 'Pusat kendali holistik seluruh unit santri, sentra & kas', status: 'AKTIF (99.4%)', color: 'indigo' },
    { id: 'r854', code: 'R854', name: 'Operational KPI Engine', desc: 'Metrik kinerja akuntabel dan evaluasi capaian kuantitatif', status: 'OPTIMAL (102%)', color: 'teal' },
    { id: 'r855', code: 'R855', name: 'Smart Incident Manager', desc: 'Deteksi, isolasi & mitigasi insiden otomatis &lt; 10 menit', status: 'TERKENDALI (0 Open)', color: 'rose' },
    { id: 'r856', code: 'R856', name: 'Founder Governance Console', desc: 'Otoritas tertinggi, audit master key & konstitusi TADE', status: 'TERVERIFIKASI', color: 'amber' },
    { id: 'r857', code: 'R857', name: 'Compliance Readiness Center', desc: 'Kesiapan akreditasi BAN-PAUD 1-8 & UU PDP 27/2022', status: 'AUDIT READY (99.2%)', color: 'purple' },
    { id: 'r858', code: 'R858', name: 'Offline Sync Assurance', desc: 'Jaminan sinkronisasi nir-konflik & local-first IndexedDB', status: 'TERJAMIN (100%)', color: 'cyan' },
    { id: 'r859', code: 'R859', name: 'Living Performance Profiler', desc: 'Telemetri JS Heap &lt; 35MB, 60 FPS & Idle CPU ~0%', status: 'EFISIEN (60 FPS)', color: 'emerald' }
  ];

  return (
    <div id="rc103-governance-war-room-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 text-xs font-black uppercase tracking-widest bg-amber-500 text-slate-950 rounded-full flex items-center gap-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5" /> RC103 • Go-Live Governance
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Guardian Ring-0 & SSoT Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            RC103 Governance War Room
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pusat Komando Tata Kelola & Kepercayaan Operasional (Operational Trust). Menghubungkan kepatuhan hukum, keamanan data santri, kesiapan audit BAN-PAUD, dan keandalan offline nir-konflik.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
              <div className="text-[11px] text-slate-300">Skor Tata Kelola</div>
              <div className="text-2xl font-black text-emerald-400">100 / 100</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
              <div className="text-[11px] text-slate-300">Audit Kesiapan Go-Live</div>
              <div className="text-2xl font-black text-amber-400">SIAP PRODUKSI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Modules of RC103 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {m.code}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {m.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{m.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onSelectModule && onSelectModule(m.id)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                Buka Modul {m.code} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
