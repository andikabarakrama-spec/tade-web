/**
 * TADE CABINET MEETING MODAL — SPRINT G12
 * 30-Second Rapid Autonomous Council Session
 * 
 * Orchestrates 7 key reports:
 * 1. Asy (Operasional & Santri)
 * 2. Syifa (Karakter & Doa)
 * 3. Guardian Ring-0 (Keamanan)
 * 4. Dr. Pulse (Kesehatan Sistem)
 * 5. Hermes (Pemulihan Data)
 * 6. TIB (Inovasi Teknologi)
 * 7. Prof. Atlas (SOP Kurikulum)
 * 
 * Auto-Generates Signed Decree & Black Box Evidence.
 */

import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Activity,
  Radio,
  Cpu,
  BookOpen,
  CheckCircle2,
  X,
  Play,
  Pause,
  RotateCcw,
  FileCheck2,
  Award,
  ArrowRight,
  ChevronRight,
  Layers
} from 'lucide-react';
import {
  cabinetMeetingEngine,
  CabinetSpeakerReport,
  CabinetSessionResult
} from '../../services/cabinetMeetingEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSessionFinalized?: (result: CabinetSessionResult) => void;
}

export const CabinetMeetingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSessionFinalized
}) => {
  const [reports] = useState<CabinetSpeakerReport[]>(cabinetMeetingEngine.getCouncilReports());
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [finalizedResult, setFinalizedResult] = useState<CabinetSessionResult | null>(null);

  useEffect(() => {
    if (!isOpen || finalizedResult) return;

    let interval: NodeJS.Timeout;
    if (isPlaying && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          const next = prev - 1;
          // Step speaker every ~4.2 seconds (30s / 7 speakers)
          const newIndex = Math.min(6, Math.floor((30 - next) / 4.2));
          setActiveSpeakerIndex(newIndex);
          return next;
        });
      }, 1000);
    } else if (secondsRemaining === 0 && !finalizedResult) {
      // Auto-finalize when timer ends
      const res = cabinetMeetingEngine.finalizeMeeting();
      setFinalizedResult(res);
      if (onSessionFinalized) onSessionFinalized(res);
    }

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, secondsRemaining, finalizedResult, onSessionFinalized]);

  if (!isOpen) return null;

  const currentSpeaker = reports[activeSpeakerIndex];

  const handleManualFinalize = () => {
    const res = cabinetMeetingEngine.finalizeMeeting();
    setFinalizedResult(res);
    if (onSessionFinalized) onSessionFinalized(res);
  };

  const getSpeakerIcon = (id: string) => {
    switch (id) {
      case 'asy': return Crown;
      case 'syifa': return Sparkles;
      case 'guardian': return ShieldCheck;
      case 'drpulse': return Activity;
      case 'hermes': return Radio;
      case 'tib': return Cpu;
      case 'atlas': return BookOpen;
      default: return Layers;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  KABINET FOUNDER ASY-SYIFATAN
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Sidang Kilat 30 Detik
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Rapat Pleno Dewan Kedaulatan Institusi
              </h2>
              <p className="text-xs text-stone-300">
                Penyelarasan 7 pilar operasional, karakter santri, keamanan Ring-0, dan telemetri kesehatan.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar & Timer */}
          {!finalizedResult && (
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-stone-300">
                  <span>Progres Laporan 7 Pilar</span>
                  <span className="font-mono text-amber-400">{secondsRemaining}s tersisa</span>
                </div>
                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${((30 - secondsRemaining) / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs transition cursor-pointer"
                  title={isPlaying ? 'Jeda' : 'Lanjutkan'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setSecondsRemaining(30);
                    setActiveSpeakerIndex(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition cursor-pointer"
                  title="Ulangi"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!finalizedResult ? (
            <div className="space-y-6">
              {/* Speaker Pills Selection */}
              <div className="grid grid-cols-7 gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                {reports.map((rep, idx) => {
                  const Icon = getSpeakerIcon(rep.speakerId);
                  const isCurrent = idx === activeSpeakerIndex;
                  return (
                    <button
                      key={rep.speakerId}
                      onClick={() => {
                        setActiveSpeakerIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition text-center cursor-pointer ${
                        isCurrent
                          ? 'bg-white shadow-sm border border-emerald-400 text-emerald-950 font-bold'
                          : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <span className="text-[10px] truncate max-w-full">
                        {rep.speakerId.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Speaker Spotlight Card */}
              <div className="bg-gradient-to-br from-stone-50 to-emerald-50/40 p-6 rounded-3xl border-2 border-emerald-400/50 shadow-sm space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md font-black text-lg">
                      {currentSpeaker.order}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-stone-900 text-base">
                          {currentSpeaker.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${currentSpeaker.badgeColor}`}>
                          {currentSpeaker.domain}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        {currentSpeaker.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Status Metrik</span>
                    <span className="text-xs font-black text-emerald-800">{currentSpeaker.keyMetric}</span>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 text-stone-800 text-sm leading-relaxed shadow-2xs">
                  <p className="font-medium">"{currentSpeaker.summary}"</p>
                </div>

                {/* Recommendation */}
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-400/40 flex items-start gap-2.5 text-xs text-amber-950">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Rekomendasi Aksi:</span> {currentSpeaker.actionRecommendation}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeSpeakerIndex > 0) setActiveSpeakerIndex(activeSpeakerIndex - 1);
                    }}
                    disabled={activeSpeakerIndex === 0}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => {
                      if (activeSpeakerIndex < 6) setActiveSpeakerIndex(activeSpeakerIndex + 1);
                    }}
                    disabled={activeSpeakerIndex === 6}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    Berikutnya
                  </button>
                </div>

                <button
                  onClick={handleManualFinalize}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black shadow-md flex items-center gap-2 transition cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-300" />
                  <span>Sahkan Resolusi Kabinet Sekarang</span>
                </button>
              </div>
            </div>
          ) : (
            /* Finalized Decree State */
            <div className="space-y-6 animate-scale-up">
              <div className="text-center space-y-2 py-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-amber-300" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  SURAT KEPUTUSAN KABINET RESMI DISAHKAN
                </span>
                <h3 className="text-xl font-black text-stone-900">
                  {finalizedResult.resolutionDecreeTitle}
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  No. SK: {finalizedResult.resolutionDecreeNumber} • Penandatangan: {finalizedResult.founderName}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700 text-xs leading-relaxed">
                <p className="font-semibold text-stone-900 mb-1">Ikhtisar Keputusan Kabinet:</p>
                <p>{finalizedResult.decreeSummary}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-stone-500 font-medium">Santri & PPDB</div>
                  <div className="font-bold text-emerald-900 mt-0.5">48 Murid Terdata</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <div className="text-stone-500 font-medium">Kesehatan Sistem</div>
                  <div className="font-bold text-teal-900 mt-0.5">60 FPS • 0 Leak</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-stone-500 font-medium">Snapshot Hermes</div>
                  <div className="font-bold text-blue-900 mt-0.5">100% Konsisten</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <div className="text-stone-500 font-medium">Keamanan Ring-0</div>
                  <div className="font-bold text-indigo-900 mt-0.5">0 Breach</div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black shadow-md transition cursor-pointer"
                >
                  Tutup & Kembali ke Founder Office
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
