import React, { useState } from 'react';
import {
  Crown,
  Activity,
  Eye,
  ShieldAlert,
  LifeBuoy,
  Calendar,
  Briefcase,
  Database,
  WifiOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const RC104ContinuityWarRoomViewer: React.FC<Props> = ({ onSelectModule }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  const rc104Modules = [
    { id: 'r861', code: 'R861', title: 'Continuity Command Engine', icon: Activity, desc: 'Pusat komando RTO < 5s & RPO 0 kehilangan data', status: 'LOCKED', color: 'emerald' },
    { id: 'r862', code: 'R862', title: 'Predictive Health Intelligence', icon: Eye, desc: 'Deteksi dini penurunan performa & early anomaly', status: 'LOCKED', color: 'indigo' },
    { id: 'r863', code: 'R863', title: 'Guardian Risk Observatory', icon: ShieldAlert, desc: 'Observatorium risiko kedaulatan data & jaringan', status: 'LOCKED', color: 'rose' },
    { id: 'r864', code: 'R864', title: 'Smart Recovery Coordinator', icon: LifeBuoy, desc: 'Orkestrasi DR drill & zero-loss restoration', status: 'LOCKED', color: 'amber' },
    { id: 'r865', code: 'R865', title: 'School Operations Timeline', icon: Calendar, desc: 'Garis waktu aktivitas harian sekolah terintegrasi', status: 'LOCKED', color: 'blue' },
    { id: 'r866', code: 'R866', title: 'Executive Decision Center', icon: Briefcase, desc: 'Analitik strategis yayasan & kepala sekolah', status: 'LOCKED', color: 'purple' },
    { id: 'r867', code: 'R867', title: 'Capacity Forecast Engine', icon: Database, desc: 'Proyeksi kapasitas 6 bulan (santri, file, SSoT)', status: 'LOCKED', color: 'cyan' },
    { id: 'r868', code: 'R868', title: 'Offline Mission Control', icon: WifiOff, desc: 'Kendali operasi offline-first & rekonsiliasi LWW', status: 'LOCKED', color: 'emerald' },
    { id: 'r869', code: 'R869', title: 'Founder Intelligence Briefing', icon: Sparkles, desc: 'Ringkasan kedaulatan konstitusi & visi TADE', status: 'LOCKED', color: 'amber' }
  ];

  return (
    <div id="r870-rc104-continuity-war-room" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-400/30 backdrop-blur-sm">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500 text-slate-950 rounded-full">R870</span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-white/10 text-white rounded-full">RC104 Suite</span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  v8.4.0-RC104
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1.5 text-white">
                Business Continuity &amp; Operational Intelligence War Room
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
                Pusat Komando Kelangsungan Operasional Terpadu (R861–R870) berdaya tahan tinggi, RTO &lt; 5s, RPO 0 Transaksi Hilang, dan 100% SSoT.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
              <span className="text-[11px] text-emerald-300 block">Status Kesiapan Operasional</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100 / 100 SIAP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vital Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Continuity Score</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">100 / 100</p>
          <span className="text-xs text-emerald-600 font-medium">Zero Downtime &amp; Fault-Tolerant</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Recovery (RTO/RPO)</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">1.8s / 0 Tx</p>
          <span className="text-xs text-blue-600 font-medium">Batas Aman Terlampaui</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Integritas Basis Data</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">100% SSoT</p>
          <span className="text-xs text-purple-600 font-medium">No Shadow DB Allowed</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Hermes Safe Vault</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">DORMANT_SAFE</p>
          <span className="text-xs text-amber-600 font-medium">Terisolasi &amp; Terverifikasi</span>
        </div>
      </div>

      {/* Modules Command Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Modul Operasional RC104 Terintegrasi</h3>
            <p className="text-xs text-slate-500">Klik modul di bawah untuk membuka halaman pengendali khusus.</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
            9 Modul Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rc104Modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => onSelectModule && onSelectModule(mod.id)}
                className="text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group bg-slate-50 hover:bg-white flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700">
                      {mod.code}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-800 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 font-semibold text-emerald-700">
                  <span>Buka Modul</span>
                  <Zap className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
