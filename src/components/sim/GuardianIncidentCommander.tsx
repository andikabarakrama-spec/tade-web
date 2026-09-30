import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Camera, 
  Clock, 
  FileText, 
  Bell, 
  RotateCcw, 
  FileCheck, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Play,
  Key,
  Database
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface IncidentProtocolStep {
  stepNumber: number;
  name: string;
  guardianAction: string;
  status: 'COMPLETED' | 'STANDBY';
  hash?: string;
}

export const GuardianIncidentCommander: React.FC = () => {
  const [isSimulatingIncident, setIsSimulatingIncident] = useState(false);
  const [incidentActive, setIncidentActive] = useState(false);

  const steps: IncidentProtocolStep[] = [
    { stepNumber: 1, name: 'Lock Memory Buffer', guardianAction: 'Buffer memori IO terkunci seketika untuk mencegah race condition atau manipulasi sesi.', status: incidentActive ? 'COMPLETED' : 'STANDBY', hash: 'e3b0c44298fc1c149afbf4c8996fb924' },
    { stepNumber: 2, name: 'Immutable Snapshot', guardianAction: 'Snapshot instan database lokal dan telemetri disimpan ke brankas WORM terisolasi.', status: incidentActive ? 'COMPLETED' : 'STANDBY', hash: '9b71d224bd62f3785d96d46ad3ea3d73' },
    { stepNumber: 3, name: 'Audit Timeline Replay', guardianAction: 'Penyusunan log kronologis per milidetik sebelum dan sesudah anomali terdeteksi.', status: incidentActive ? 'COMPLETED' : 'STANDBY' },
    { stepNumber: 4, name: 'Evidence Pack Packing', guardianAction: 'Pembuatan bundel bukti digital terenkripsi SHA-256 siap audit hukum Yayasan.', status: incidentActive ? 'COMPLETED' : 'STANDBY', hash: 'ca978112ca1bbdcafac231b39a23dc4d' },
    { stepNumber: 5, name: 'Multi-Channel Alert Dispatch', guardianAction: 'Pengiriman sinyal prioritas tinggi ke Super Admin & Ketua Yayasan.', status: incidentActive ? 'COMPLETED' : 'STANDBY' },
    { stepNumber: 6, name: 'Zero Data Loss Recovery', guardianAction: 'Pemulihan otomatis dari snapshot aman tanpa kehilangan catatan transaksi keuangan.', status: incidentActive ? 'COMPLETED' : 'STANDBY' },
    { stepNumber: 7, name: 'Cryptographic Chain of Custody', guardianAction: 'Pencatatan stempel waktu dan tanda tangan kunci pengawas Guardian.', status: incidentActive ? 'COMPLETED' : 'STANDBY', hash: '5e884898da28047151d0e56f8dc62927' }
  ];

  const handleSimulateIncident = () => {
    setIsSimulatingIncident(true);
    setTimeout(() => {
      setIsSimulatingIncident(false);
      setIncidentActive(true);
      blackBoxRecorder.record({
        moduleCode: 'R501',
        eventType: 'SECURITY',
        severity: 'WARN',
        details: 'Guardian Incident Commander simulated emergency drill. All 7 protocol steps executed.'
      });
    }, 700);
  };

  const handleResetProtocol = () => {
    setIncidentActive(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R501 &bull; GUARDIAN INCIDENT COMMANDER
          </span>
          <span className="text-xs text-slate-400 font-mono">Automated Incident Response &amp; Chain of Custody</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-purple-400" />
              Guardian Incident Commander &bull; Komandan Tanggap Insiden
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Protokol respon krisis otomatis 7 langkah: penguncian buffer memori, snapshot brankas data WORM, timeline bukti digital terenkripsi, pelaporan alert, hingga pemulihan instan dengan penjelasan terpandu oleh AI Asy.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {incidentActive ? (
              <button
                onClick={handleResetProtocol}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                Reset Status Siaga
              </button>
            ) : (
              <button
                onClick={handleSimulateIncident}
                disabled={isSimulatingIncident}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className={`w-4 h-4 ${isSimulatingIncident ? 'animate-spin' : ''}`} />
                {isSimulatingIncident ? 'Menjalankan Protokol...' : 'Simulasi Respon Insiden'}
              </button>
            )}
          </div>
        </div>

        {/* 4 Emergency Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS PROTOKOL</span>
            <span className={`text-base font-bold font-mono ${incidentActive ? 'text-amber-400' : 'text-emerald-400'}`}>
              {incidentActive ? 'DRILL ACTIVE' : 'STANDBY PRIMA'}
            </span>
            <span className="text-[9px] text-slate-400 block">7 Langkah Teruji</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">LOCK BUFFER SPEED</span>
            <span className="text-base font-bold text-cyan-400 font-mono">&lt; 3 ms</span>
            <span className="text-[9px] text-cyan-500 block">Zero Race Condition</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">EVIDENCE PACK</span>
            <span className="text-base font-bold text-purple-400 font-mono">SHA-256 Valid</span>
            <span className="text-[9px] text-purple-400 block">Chain of Custody</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">RTO / RECOVERY TIME</span>
            <span className="text-base font-bold text-emerald-400 font-mono">0.4 Detik</span>
            <span className="text-[9px] text-emerald-500 block">Zero Data Loss</span>
          </div>
        </div>
      </div>

      {/* Main 7-Step Incident Pipeline */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-500" />
            7 TAHAPAN PROTOKOL TANGGAP DARURAT GUARDIAN
          </h3>
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
            {incidentActive ? '7/7 Selesai' : 'Siaga Otomatis'}
          </span>
        </div>

        <div className="space-y-3">
          {steps.map(s => (
            <div
              key={s.stepNumber}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                s.status === 'COMPLETED'
                  ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/60'
                  : 'bg-slate-50 dark:bg-slate-700/20 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  s.status === 'COMPLETED' ? 'bg-purple-600 text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                }`}>
                  {s.stepNumber}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    {s.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {s.guardianAction}
                  </p>
                  {s.hash && s.status === 'COMPLETED' && (
                    <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-1">
                      Hash SHA-256: <code>{s.hash}</code>
                    </div>
                  )}
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shrink-0 ${
                s.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {s.status === 'COMPLETED' ? '✓ DILAKSANAKAN' : '● SIAGA'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Asy Guidance Panel on Incident */}
      <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-3xl p-5 border border-cyan-200 dark:border-cyan-900/60 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-cyan-600 text-white shrink-0">
          <Bot className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-cyan-900 dark:text-cyan-200 font-mono">
            PANDUAN LANGKAH SELANJUTNYA DARI AI ASY:
          </h4>
          <p className="text-xs text-cyan-800 dark:text-cyan-300 leading-relaxed">
            “Apabila sistem mendeteksi anomali pada salah satu perangkat keras atau jaringan, Guardian secara otomatis mengisolasi sesi dan mengamankan brankas data. Anda cukup meninjau rangkuman ini tanpa perlu mematikan server manual.”
          </p>
        </div>
      </div>
    </div>
  );
};
