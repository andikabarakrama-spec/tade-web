import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Award,
  Heart,
  PartyPopper,
  CheckCircle2,
  Activity,
  Smile,
  ShieldCheck
} from 'lucide-react';

export const DigitalCampusExperience: React.FC = () => {
  const [quietMode, setQuietMode] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState({
    days: 7,
    hours: 4,
    minutes: 23,
    seconds: 45
  });

  useEffect(() => {
    if (quietMode) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: Math.max(0, prev.minutes - 1) };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quietMode]);

  const triggerCelebration = () => {
    setCelebrationActive(true);
    setTimeout(() => setCelebrationActive(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Digital Campus Experience</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                Interaksi & Suasana Sekolah
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengalaman digital adaptif: ucapan salam pagi, hitung mundur acara akbar, perayaan prestasi santri, dan mode animasi tenang (hemat baterai).
            </p>
          </div>
        </div>

        {/* Quiet Mode Switch */}
        <button
          onClick={() => setQuietMode(!quietMode)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            quietMode
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {quietMode ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          {quietMode ? 'Quiet Mode Aktif (Hemat Daya)' : 'Animasi Normal'}
        </button>
      </div>

      {/* Morning Greeting & Dynamic Status Card */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl text-white p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            <Sun className="w-4 h-4 text-amber-200" />
            <span>Pagi yang Cerah & Berkah • Asy-Syukriyyah</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Assalamu’alaikum, Semangat Belajar & Beramal Shalih Hari Ini!
          </h2>

          <p className="text-xs md:text-sm text-white/90 leading-relaxed">
            "Maka barangsiapa mengerjakan kebaikan seberat dzarrah, niscaya dia akan melihat (balasan)nya." — QS. Az-Zalzalah: 7.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Smile className="w-4 h-4 text-emerald-300" />
              <span>Status Kampus: <strong>Aktif Penuh</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Jadwal Shalat Dhuha: <strong>08:30 WIB</strong></span>
            </div>
          </div>
        </div>

        {/* Decorative Circle Shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Event Countdown & Celebration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Event Countdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              Hitung Mundur: Gebyar Kemerdekaan & Family Day
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full">
              22 Agustus 2026
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Ajang pentas seni santri, lomba memasak ayah & anak, serta bazar kreasi parenting TK Islam Asy-Syukriyyah.
          </p>

          {/* Countdown Boxes */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-2xl font-black text-rose-600">{timeRemaining.days}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-2xl font-black text-rose-600">{timeRemaining.hours}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jam</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-2xl font-black text-rose-600">{timeRemaining.minutes}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menit</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-2xl font-black text-rose-600">{timeRemaining.seconds}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detik</div>
            </div>
          </div>
        </div>

        {/* Right: Celebration Engine */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-amber-500" />
              Celebration & Recognition Engine
            </h2>
            <span className="text-xs text-slate-400 font-mono">Simulasi Prestasi</span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Award className="w-4 h-4 text-amber-600" />
              Apresiasi Capaian Santri Pekan Ini:
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Selamat kepada <strong>Ananda Aisyah Humaira</strong> atas kelulusan Ujian Tahfidz Juz 30 Predikat Mumtaz!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={triggerCelebration}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <PartyPopper className="w-4 h-4" />
              Nyalakan Efek Selebrasi Kampus
            </button>

            {celebrationActive && (
              <span className="text-xs font-bold text-rose-600 animate-bounce flex items-center gap-1">
                🎉 Mabruk & Barakallah! 🎊
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
