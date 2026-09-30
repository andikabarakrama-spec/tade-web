import React, { useState } from 'react';
import { Crown, Shield, Activity, FileText, CheckCircle2, Clock, AlertTriangle, Sparkles, Bot, Eye, Layers } from 'lucide-react';

export const ExecutiveIncidentTheater: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<string>('INC-001');

  const incidents = [
    {
      id: 'INC-001',
      title: 'Pencegahan Lonjakan Pendaftaran PPDB Gelombang 1',
      timestamp: '2026-08-16T08:30:00Z',
      status: 'RESOLVED',
      severity: 'LOW_PREVENTIVE',
      domain: 'PPDB & Form Pipeline',
      evidenceHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      recoveryProgress: 100,
      guardianStatus: 'Guardian Squad Level 3 Re-stabilized in 8ms',
      aiAsyGuidance: 'Alhamdulillah, lonjakan 35 pendaftar telah dialirkan ke antrean buffer aman. Seluruh berkas pendaftar tervalidasi dan QR tanda terima telah diterbitkan.'
    },
    {
      id: 'INC-002',
      title: 'Validasi Otomatis Integritas Backup Google Drive',
      timestamp: '2026-08-16T06:00:00Z',
      status: 'RESOLVED',
      severity: 'INFORMATIONAL',
      domain: 'Data Sovereignty Core',
      evidenceHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      recoveryProgress: 100,
      guardianStatus: 'Sentinel & Elite Checksum Match 100%',
      aiAsyGuidance: 'Cadangan data mandiri sekolah (JSON, XLSX, PDF) telah selesai disinkronkan. Kedaulatan data yayasan 100% aman dan mandiri.'
    }
  ];

  const current = incidents.find(i => i.id === selectedIncident) || incidents[0];

  return (
    <div id="executive-incident-theater-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-purple-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              TADE RC70 • R530
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Founder & Chairman Command Room
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="w-7 h-7 text-purple-400" />
            Executive Incident Theater
          </h1>
          <p className="text-purple-100/80 text-sm mt-1 max-w-2xl">
            Pusat pantauan komando visual Ketua Yayasan & Pendiri: Incident Map, Timeline Kronologis, Bukti Forensik Kriptografi, Progress Pemulihan, dan Arahan AI Asy.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-purple-500/30 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-purple-300 block">Executive Assurance</span>
          <span className="text-xl font-bold text-emerald-400">100% AMAN & TERKENDALI</span>
        </div>
      </div>

      {/* Main Theater Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Incident Selector List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Executive Event Log
          </h2>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedIncident === inc.id
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">{inc.id}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {inc.status}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{inc.title}</div>
                <div className="text-xs text-slate-500">{new Date(inc.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Theater Command Board */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Detail Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{current.domain}</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{current.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Pemulihan Otonom</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{current.recoveryProgress}% SELESAI</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-emerald-500 h-full rounded-full w-full"></div>
            </div>

            {/* Evidence & Guardian Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 mb-1">
                  <Shield className="w-4 h-4 text-sky-500" /> Guardian Defense Status
                </div>
                <div className="text-slate-600 dark:text-slate-300">{current.guardianStatus}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 mb-1">
                  <FileText className="w-4 h-4 text-purple-500" /> Kriptografi Bukti Tamper-Proof
                </div>
                <div className="font-mono text-[10px] text-slate-500 truncate">{current.evidenceHash}</div>
              </div>
            </div>

            {/* AI Asy Guidance Panel */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-emerald-500/10 border border-purple-500/20 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-0.5">
                  Taklimat Asy — Tangan Kanan Super Admin
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {current.aiAsyGuidance}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
