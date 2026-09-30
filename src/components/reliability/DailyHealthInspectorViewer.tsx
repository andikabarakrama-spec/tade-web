import React, { useState, useEffect, useMemo } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Wifi, 
  Layers, 
  CheckCircle2, 
  RotateCw, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  DailyHealthInspector, 
  DailyHealthReport, 
  HealthCheckPoint 
} from '../../core/reliability/dailyHealthInspector';

export const DailyHealthInspectorViewer: React.FC = () => {
  const inspector = useMemo(() => DailyHealthInspector.getInstance(), []);
  const [report, setReport] = useState<DailyHealthReport>(() => inspector.runDiagnostics());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunDiagnostics = () => {
    setIsRunning(true);
    setTimeout(() => {
      setReport(inspector.runDiagnostics());
      setIsRunning(false);
    }, 600);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SSOT': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'MEMORY': return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'GUARDIAN': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'OFFLINE': return <Layers className="w-4 h-4 text-purple-400" />;
      case 'NETWORK': return <Wifi className="w-4 h-4 text-cyan-400" />;
      default: return <Sparkles className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6" id="daily-health-inspector-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" />
                R844 &bull; Pemeriksa Kesehatan Harian
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                SCORE: {report.overallScore}/100
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Audit Kesehatan & Integritas Menyeluruh
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memverifikasi ketiadaan shadow DB, stabilitas alokasi heap memori, keutuhan Guardian Ring-0, dan integritas Master Character Lock secara non-destruktif.
            </p>
          </div>

          <button
            onClick={handleRunDiagnostics}
            disabled={isRunning}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Memeriksa Sistem...' : 'Jalankan Diagnostik Ulang'}</span>
          </button>
        </div>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status Kesehatan</span>
          <div className="text-xl font-black mt-1 text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {report.overallStatus.replace('_', ' ')}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{report.passedChecks}/{report.totalChecks} Titik Lulus</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Beban CPU Idle</span>
          <div className="text-xl font-black mt-1 text-cyan-400">{report.systemLoadEstimate}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Anti-Loop Polling</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimasi Uptime</span>
          <div className="text-xl font-black mt-1 text-blue-400">{report.estimatedUptime}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Reliability Target</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pemeriksaan Terakhir</span>
          <div className="text-sm font-bold mt-2 text-slate-300 font-mono">{report.timestamp}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Otomatis Terjadwal</span>
        </div>
      </div>

      {/* Check Points Detailed List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          6 Titik Pemeriksaan Vital ({report.checkPoints.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.checkPoints.map((chk) => (
            <div
              key={chk.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-lg space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800">
                    {getCategoryIcon(chk.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{chk.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{chk.category} &bull; {chk.id}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {chk.score}/100
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {chk.description}
              </p>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Hasil Pengukuran:</span>
                <span className="text-emerald-400 font-semibold">{chk.measuredValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
