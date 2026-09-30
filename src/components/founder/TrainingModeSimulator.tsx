import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  UserCheck,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
  Shield,
  Layers,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { trainingModeService, TrainingTrackId, TrainingTrack } from '../../services/trainingModeService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const TrainingModeSimulator: React.FC = () => {
  const [tracks, setTracks] = useState<TrainingTrack[]>(trainingModeService.getAllTracks());
  const [selectedTrackId, setSelectedTrackId] = useState<TrainingTrackId>('GURU_BARU');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(trainingModeService.getSandboxMetrics());

  const currentTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];

  const handleSimulateStep = (stepId: string) => {
    trainingModeService.executeStepSimulation(selectedTrackId, stepId);
    setTracks(trainingModeService.getAllTracks());
    setMetrics(trainingModeService.getSandboxMetrics());
    const step = currentTrack.steps.find(s => s.id === stepId);
    const msg = `Simulasi "${step?.title}" berhasil dieksekusi di Sandbox aman.`;
    setFeedback(msg);
    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Training Mode Simulator',
      `Simulasi langkah pelatihan: ${step?.title} (${currentTrack.roleTitle})`
    );
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReset = () => {
    trainingModeService.resetSandbox();
    setTracks(trainingModeService.getAllTracks());
    setMetrics(trainingModeService.getSandboxMetrics());
    setFeedback('Sandbox pelatihan telah di-reset ke kondisi awal.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const totalSteps = currentTrack.steps.length;
  const completedSteps = currentTrack.steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sprint G8 P6 • Mode Pelatihan & Simulasi Staf</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Asy Syifa Training Mode & Sandbox
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Lingkungan simulasi aman bagi Guru Baru, Staf Admin, dan Pimpinan Yayasan. Berlatih mengisi presensi, catatan anekdot, verifikasi berkas, dan audit tanpa mengubah data produksi madrasah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Role Curriculum Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tracks.map(track => {
          const isSelected = track.id === selectedTrackId;
          const done = track.steps.filter(s => s.completed).length;
          const pct = Math.round((done / track.steps.length) * 100);

          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`p-5 rounded-3xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {track.badge}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">{track.durationEst}</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-2">{track.roleTitle}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{track.description}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 mt-2 border-t border-slate-800">
                <span>Progres Pelatihan:</span>
                <span className="text-white font-mono font-bold">{done}/{track.steps.length} ({pct}%)</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track Steps & Sandbox Execution Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Step Walkthrough */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">{currentTrack.roleTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Selesaikan seluruh langkah simulasi di bawah ini secara mandiri.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400 font-mono">{progressPercent}%</span>
              <span className="text-[10px] text-slate-400 block uppercase">Selesai</span>
            </div>
          </div>

          <div className="space-y-4">
            {currentTrack.steps.map(step => (
              <div
                key={step.id}
                className={`p-5 rounded-2xl border transition-all ${
                  step.completed
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center font-mono">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      {step.completed && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
                          Lulus
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 pl-7 leading-relaxed">{step.description}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-7 pt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Petunjuk: {step.hint}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateStep(step.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all flex items-center gap-1.5 ${
                      step.completed
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{step.completed ? 'Uji Lagi' : 'Jalankan Simulasi'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Sandbox Safe Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Aktivitas Sandbox Terisolasi</span>
            </h3>
            <p className="text-xs text-slate-400">
              Data hasil simulasi disimpan di memori sementara dan tidak memengaruhi database utama.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulasi Presensi Diinput:</span>
                <span className="text-emerald-400 font-mono font-bold">{metrics.presensiCount} Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulasi Anekdot Disimpan:</span>
                <span className="text-emerald-400 font-mono font-bold">{metrics.anecdoteSaved} Catatan</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulasi PPDB Diverifikasi:</span>
                <span className="text-emerald-400 font-mono font-bold">{metrics.ppdbVerified} Berkas</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulasi Kwitansi SPP Valid:</span>
                <span className="text-emerald-400 font-mono font-bold">{metrics.sppApproved} Lembar</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulasi Surat Dinas Disahkan:</span>
                <span className="text-emerald-400 font-mono font-bold">{metrics.lettersSigned} Surat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
