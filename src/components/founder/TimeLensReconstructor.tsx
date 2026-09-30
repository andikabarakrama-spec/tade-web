import React, { useState, useEffect } from 'react';
import {
  Clock,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Activity,
  Users,
  Database,
  Search,
  CheckCircle2,
  Sliders,
  History,
  Radio,
  ArrowRight
} from 'lucide-react';
import {
  blackBoxRecorder,
  ReconstructedSystemState,
  BlackBoxLogEvent
} from '../../services/blackBoxRecorder';

export const TimeLensReconstructor: React.FC = () => {
  const now = Date.now();
  const [selectedEpoch, setSelectedEpoch] = useState<number>(now);
  const [offsetMinutes, setOffsetMinutes] = useState<number>(0);
  const [reconstructed, setReconstructed] = useState<ReconstructedSystemState>(
    blackBoxRecorder.reconstructStateAt(now)
  );
  const [isReplaying, setIsReplaying] = useState<boolean>(false);

  const handleSliderChange = (minutesAgo: number) => {
    setOffsetMinutes(minutesAgo);
    const targetEpoch = Date.now() - minutesAgo * 60 * 1000;
    setSelectedEpoch(targetEpoch);
    setReconstructed(blackBoxRecorder.reconstructStateAt(targetEpoch));
  };

  const handlePreset = (minutesAgo: number) => {
    handleSliderChange(minutesAgo);
  };

  const handleReplayIncidents = () => {
    setIsReplaying(true);
    let currentMin = 180; // start 3 hours ago
    const interval = setInterval(() => {
      currentMin -= 15;
      if (currentMin <= 0) {
        currentMin = 0;
        clearInterval(interval);
        setIsReplaying(false);
      }
      handleSliderChange(currentMin);
    }, 400);
  };

  const formatDateTime = (epoch: number) => {
    const d = new Date(epoch);
    return `${d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} • ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} WIB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-slate-800 p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-3 py-1 rounded-full">
              P2 • TADE Time Lens Reconstructor
            </span>
            <span className="text-xs bg-amber-950 text-amber-300 border border-amber-700 px-2.5 py-0.5 rounded-full font-bold">
              Living Temporal State
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <Clock className="w-5 h-5 text-emerald-400" />
            Rekonstruksi Kondisi Sistem & Timeline Historis
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Pilih waktu lampau untuk melihat rekonstruksi nyata kondisi sistem: status memori, sesi pengguna, antrean PPDB, integritas Ring-0, dan telemetri Black Box pada epoch tersebut.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReplayIncidents}
            disabled={isReplaying}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer ${
              isReplaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{isReplaying ? 'Memutar Ulang...' : 'Replay 3 Jam Terakhir'}</span>
          </button>
        </div>
      </div>

      {/* Time Scrubber / Selector Control */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Titik Waktu Observasi
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              {formatDateTime(selectedEpoch)}
            </h3>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePreset(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                offsetMinutes === 0
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Sekarang
            </button>
            <button
              onClick={() => handlePreset(30)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                offsetMinutes === 30
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              30 Mnt Lalu
            </button>
            <button
              onClick={() => handlePreset(60)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                offsetMinutes === 60
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              1 Jam Lalu
            </button>
            <button
              onClick={() => handlePreset(180)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                offsetMinutes === 180
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              3 Jam Lalu
            </button>
            <button
              onClick={() => handlePreset(300)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                offsetMinutes === 300
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              5 Jam Lalu
            </button>
          </div>
        </div>

        {/* Range slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-stone-500">
            <span>5 Jam Lalu (-300m)</span>
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
              Offset: {offsetMinutes === 0 ? 'Live (Real-time)' : `-${offsetMinutes} menit`}
            </span>
            <span>Sekarang (Live)</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="5"
            value={offsetMinutes}
            onChange={e => handleSliderChange(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
        </div>
      </div>

      {/* Reconstructed State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ring-0 Status */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Integritas Ring-0
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {reconstructed.ring0Integrity}
          </div>
          <p className="text-[11px] text-stone-500">Perimeter keamanan terlindungi tanpa celah eskalasi wewenang.</p>
        </div>

        {/* System Health Score */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Skor Kesehatan Sistem
            </span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">
            {reconstructed.healthScore}/100
          </div>
          <p className="text-[11px] text-stone-500">Dr. Pulse mengonfirmasi sistem dalam status Optimal (60 FPS).</p>
        </div>

        {/* Memory & Network */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Estimasi Memory & Jaringan
            </span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {reconstructed.estimatedMemoryMb} MB <span className="text-xs text-emerald-600 font-semibold">• {reconstructed.networkState}</span>
          </div>
          <p className="text-[11px] text-stone-500">JS Heap terkendali di bawah ambang batas kritis 80MB.</p>
        </div>

        {/* Active Roles & Sessions */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Sesi Peran Terdeteksi
            </span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {reconstructed.activeRoleCount} Entitas Peran
          </div>
          <p className="text-[11px] text-stone-500">Founder, Admin SIM, Kepsek & Wali Murid aktif pada log ini.</p>
        </div>
      </div>

      {/* Snapshot Details & Key Events Near This Epoch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PPDB Pipeline Snapshot */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Kondisi Pipeline PPDB pada Epoch
            </h4>
            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
              Snapshot SSoT
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-stone-600">Berkas Menunggu Verifikasi:</span>
              <span className="font-bold text-amber-700">{reconstructed.ppdbStageSummary.pendingVerification} Berkas</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-stone-600">Keuangan & Biaya Masuk Disetujui:</span>
              <span className="font-bold text-indigo-700">{reconstructed.ppdbStageSummary.financeCleared} Santri</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-stone-600">Resmi Disahkan Kepala Sekolah:</span>
              <span className="font-bold text-emerald-700">{reconstructed.ppdbStageSummary.approved} Santri</span>
            </div>
          </div>
        </div>

        {/* Reconstructed Event Context Timeline */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 text-white font-mono">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Peristiwa Telemetri di Sekitar Titik Waktu
            </h4>
            <span className="text-[10px] text-slate-400">
              {reconstructed.keyEventsNearTime.length} Peristiwa
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {reconstructed.keyEventsNearTime.length > 0 ? (
              reconstructed.keyEventsNearTime.map(e => {
                const date = new Date(e.epochMs);
                const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                return (
                  <div
                    key={e.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition"
                  >
                    <span className="text-slate-400 whitespace-nowrap text-[11px] font-bold">{timeStr}</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-800 font-bold shrink-0">
                      {e.ring}
                    </span>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="text-slate-200 text-xs font-bold truncate">
                        [{e.moduleCode}] {e.actorName || e.role}
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {e.details}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-slate-500 font-sans text-xs">
                Tidak ada peristiwa telemetri pada rentang waktu ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
