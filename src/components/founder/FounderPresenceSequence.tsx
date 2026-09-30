/**
 * TADE FOUNDER PRESENCE AWAKENING — SPRINT G12 (P1)
 * Asy & Syifa Sovereign Awakening Sequence
 * 
 * 8-Step GPU-Friendly Awakening:
 * 1. Emerald Sovereign Glow
 * 2. Asy Greeting
 * 3. Syifa Greeting
 * 4. Morning SITREP Live
 * 5. Kabinet Founder Aktif (7 Pillars)
 * 6. Priority Alert Tampil
 * 7. Mission Queue Diperbarui
 * 8. Black Box Status SHA-256
 * 
 * Max Duration: 1-3 seconds • Pure Brand Constitution
 */

import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Radio,
  Cpu,
  BookOpen,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';
import { drPulseHealthPassportService } from '../../services/drPulseHealthPassport';

interface Props {
  onComplete?: () => void;
  autoDismissMs?: number;
}

export const FounderPresenceSequence: React.FC<Props> = ({
  onComplete,
  autoDismissMs = 2800
}) => {
  const [step, setStep] = useState<number>(1);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const healthPassport = drPulseHealthPassportService.getWeeklyHealthPassport();

  useEffect(() => {
    // 8-step micro-stages within 2.8 seconds
    const t1 = setTimeout(() => setStep(2), 400);   // Asy greeting
    const t2 = setTimeout(() => setStep(3), 800);   // Syifa greeting
    const t3 = setTimeout(() => setStep(4), 1200);  // Morning SITREP
    const t4 = setTimeout(() => setStep(5), 1600);  // Kabinet Aktif
    const t5 = setTimeout(() => setStep(6), 2000);  // Priority Alert
    const t6 = setTimeout(() => setStep(7), 2350);  // Mission Queue
    const t7 = setTimeout(() => setStep(8), 2600);  // Black Box Telemetry
    const t8 = setTimeout(() => {
      setIsDismissed(true);
      if (onComplete) onComplete();
    }, autoDismissMs);

    // Record Founder Awakening in Black Box & Command Recorder
    blackBoxRecorder.record({
      ring: 'RING_0',
      moduleCode: 'FOUNDER-AWAKENING',
      role: 'SUPER_ADMIN',
      actorName: 'Founder Andika',
      category: 'AUTH_LOGIN',
      eventType: 'AUTH',
      details: 'Founder Office Awakening Sequence diaktifkan (Emerald Sovereign Glow + 7-Pillar Cabinet)',
      severity: 'INFO',
      route: '/founder-office'
    });

    founderCommandRecorder.recordCommand(
      'SYSTEM_DIAGNOSTIC',
      'Founder Presence Engine',
      'Founder Andika Presence Awakening Sequence (Emerald Sovereign Glow & 7 Pillar Cabinet Sitrep)'
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  }, [autoDismissMs, onComplete]);

  if (isDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300">
      <div className="pointer-events-auto max-w-lg w-full bg-gradient-to-b from-slate-950 via-emerald-950 to-stone-900 border-2 border-emerald-400/80 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden animate-scale-up">
        {/* Ambient Emerald Aura & Ray */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Skip button */}
        <button
          onClick={() => {
            setIsDismissed(true);
            if (onComplete) onComplete();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs transition cursor-pointer flex items-center gap-1 border border-stone-700"
          title="Lewati Urutan Awakening"
        >
          <span className="text-[10px] font-bold">Lewati</span>
          <X className="w-3.5 h-3.5" />
        </button>

        {/* 8-Step Indicator */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                step >= i ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>

        {/* Dynamic Content across Stages */}
        <div className="space-y-4 min-h-[220px] flex flex-col justify-center">
          {/* Stage 1: Emerald Sovereign Glow */}
          {step === 1 && (
            <div className="text-center space-y-3 py-2 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-500/20">
                <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                  Ring-0 Sovereign Awakening
                </span>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Emerald Sovereign Glow • Founder Terverifikasi
                </h3>
                <p className="text-xs text-stone-300">
                  Ahlan wa Sahlan, Ustadz Andika. Mengaktifkan kendali kedaulatan institusi.
                </p>
              </div>
            </div>
          )}

          {/* Stage 2 & 3: Asy & Syifa Greetings */}
          {(step === 2 || step === 3) && (
            <div className="space-y-2.5 py-1 animate-fade-in">
              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${step === 2 ? 'bg-emerald-950/80 border-emerald-400 shadow-md' : 'bg-slate-900/60 border-stone-800'}`}>
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow">
                  ASY
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <span>Asy Executive Companion</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-xs text-stone-200 mt-0.5">
                    "Assalamu'alaikum Pak Andika! Seluruh operasional sentra & PPDB Gelombang I siap disinkronkan."
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${step === 3 ? 'bg-teal-950/80 border-teal-400 shadow-md' : 'bg-slate-900/60 border-stone-800'}`}>
                <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow">
                  SYIFA
                </div>
                <div>
                  <div className="text-xs font-black text-teal-300 flex items-center gap-1.5">
                    <span>Syifa Executive Companion</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-stone-200 mt-0.5">
                    "Karakter adab santri, mutabaah 15 doa harian, dan taman kebun digital mekar dalam rahmat Allah."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 4: Morning SITREP Live */}
          {step === 4 && (
            <div className="space-y-2.5 py-1 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Morning SITREP — Denyut Institusi
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  HEALTH {healthPassport.overallScore}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400">Presensi & Santri</div>
                  <div className="font-black text-white mt-0.5">48 Murid • 98.4% Hadir</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400">PWA Runtime</div>
                  <div className="font-black text-emerald-400 mt-0.5">60 FPS • 0 Leak</div>
                </div>
              </div>
              <div className="p-2 bg-emerald-900/30 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Single Source of Truth db.ts tersinkronisasi 100%.</span>
              </div>
            </div>
          )}

          {/* Stage 5: Kabinet Founder Aktif (7 Pillars) */}
          {step === 5 && (
            <div className="space-y-2 py-1 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  7 Pilar Kabinet Founder Bersiaga
                </span>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                  ARMED & READY
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <div className="p-2 bg-slate-900/80 rounded-lg border border-stone-800 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-200 block truncate">Guardian</span>
                  <span className="text-emerald-400 text-[9px]">Ring-0 Secure</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-lg border border-stone-800 text-center">
                  <Activity className="w-3.5 h-3.5 text-teal-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-200 block truncate">Dr. Pulse</span>
                  <span className="text-emerald-400 text-[9px]">Optimal</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-lg border border-stone-800 text-center">
                  <Radio className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-200 block truncate">Hermes</span>
                  <span className="text-blue-400 text-[9px]">Snapshot Valid</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-lg border border-stone-800 text-center">
                  <Cpu className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-200 block truncate">TIB Labs</span>
                  <span className="text-purple-400 text-[9px]">Media Ready</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-lg border border-stone-800 text-center">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-200 block truncate">Prof. Atlas</span>
                  <span className="text-amber-400 text-[9px]">SOP Aligned</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-lg border border-stone-800 text-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-200 block truncate">Asy & Syifa</span>
                  <span className="text-emerald-400 text-[9px]">Autonomous</span>
                </div>
              </div>
            </div>
          )}

          {/* Stage 6 & 7: Priority Alert & Mission Queue */}
          {(step === 6 || step === 7) && (
            <div className="space-y-2 py-1 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {step === 6 ? 'Priority Alert Terkini' : 'Mission Queue Diperbarui'}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {step === 6 ? '0 CRITICAL' : '3 MISI AKTIF'}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">Verifikasi Berkas Calon Santri PPDB</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    Prioritas Tinggi
                  </span>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">Mutabaah 15 Doa Harian Santri</span>
                  </div>
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                    Karakter
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stage 8: Black Box SHA-256 Telemetry */}
          {step === 8 && (
            <div className="text-center space-y-3 py-2 animate-fade-in">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Black Box Telemetry SHA-256 Terverifikasi</h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Memasuki Asy & Syifa Autonomous Office...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Sprint G12 • Asy & Syifa Autonomous Office</span>
          </span>
          <span className="font-mono text-amber-400">Tahap {step}/8</span>
        </div>
      </div>
    </div>
  );
};
