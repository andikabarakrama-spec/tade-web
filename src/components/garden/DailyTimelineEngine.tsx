import React, { useState } from 'react';
import { Clock, Sun, BookOpen, Heart, Smile, Sparkles, Home, Bell } from 'lucide-react';

interface TimelineItem {
  time: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  badge: string;
}

export const DailyTimelineEngine: React.FC = () => {
  const timeline: TimelineItem[] = [
    {
      time: '06.30 WIB',
      title: 'Gerbang Buka & Menyapa Santun',
      desc: 'Penyambutan ramah oleh Ustadzah dengan senyum, salam, dan sapa (3S). Pengecekan suhu tubuh dan sterilisasi cilik.',
      icon: '🌅',
      color: 'from-amber-400 to-orange-400',
      badge: 'Menyapa Pagi',
    },
    {
      time: '07.00 WIB',
      title: 'Masuk Kelas & Sholat Dhuha Cilik',
      desc: 'Pembiasaan wudhu mandiri, sholat dhuha berjamaah 2 rakaat, dan pembacaan Asmaul Husna bersama.',
      icon: '🕌',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Pembiasaan Islami',
    },
    {
      time: '08.00 WIB',
      title: 'Kegiatan Sentra & Tahfidz Quran',
      desc: 'Setoran hafalan surah pendek, doa harian, serta aktivitas sentra STEAM (Sains, Teknologi, Seni & Matematika).',
      icon: '📖',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Tahfidz & Sentra',
    },
    {
      time: '09.00 WIB',
      title: 'Snack Time & Makan Sehat Bersama',
      desc: 'Makan bekal sehat bernutrisi tinggi (tanpa pengawet/MSG), mencuci tangan dengan sabun, dan doa sebelum & sesudah makan.',
      icon: '🍎',
      color: 'from-rose-400 to-pink-500',
      badge: 'Nutrisi Sehat',
    },
    {
      time: '10.00 WIB',
      title: 'Bermain Outdoor & Motorik Kasar',
      desc: 'Aktivitas fisik gembira di arena bermain ramah anak: perosotan, ayunan, titian keseimbangan, dan permainan tradisional.',
      icon: '🛝',
      color: 'from-amber-500 to-yellow-500',
      badge: 'Motorik & Sosial',
    },
    {
      time: '11.00 WIB',
      title: 'Doa Penutup & Refleksi Harian',
      desc: 'Ulasan pesan kebaikan hari ini, evaluasi ceria, membaca surah Al-Asr, dan doa penutup majelis.',
      icon: '🤲',
      color: 'from-teal-500 to-emerald-700',
      badge: 'Refleksi Ceria',
    },
    {
      time: '11.30 WIB',
      title: 'Penjemputan Aman Orang Tua',
      desc: 'Penyerahan siswa secara tertib kepada orang tua/wali murid dengan kartu identitas penjemputan resmi.',
      icon: '🚌',
      color: 'from-slate-700 to-slate-900',
      badge: 'Pulang Aman',
    },
  ];

  // Auto detect active step based on current browser hour
  const getCurrentStepByHour = () => {
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const timeInMin = hour * 60 + min;

    if (timeInMin < 420) return 0; // before 7am -> Gerbang Buka
    if (timeInMin >= 420 && timeInMin < 480) return 1; // 7am - 8am -> Sholat Dhuha
    if (timeInMin >= 480 && timeInMin < 540) return 2; // 8am - 9am -> Sentra & Tahfidz
    if (timeInMin >= 540 && timeInMin < 600) return 3; // 9am - 10am -> Snack Time
    if (timeInMin >= 600 && timeInMin < 660) return 4; // 10am - 11am -> Outdoor
    if (timeInMin >= 660 && timeInMin < 690) return 5; // 11am - 11:30am -> Doa Penutup
    return 6; // after 11:30am -> Pulang
  };

  const [activeStep, setActiveStep] = useState<number>(getCurrentStepByHour());
  const currentHourStep = getCurrentStepByHour();

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
          Rangkaian Aktivitas Siswa
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Jadwal Rutinitas Sehari di TK Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Keseimbangan antara pembentukan karakter Islami, stimulasi motorik, akademik menyenangkan, dan gizi seimbang.
        </p>
      </div>

      {/* Horizontal / Vertical Timeline Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {timeline.map((item, idx) => {
          const isActive = activeStep === idx;
          const isLiveNow = currentHourStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl border text-left transition transform duration-200 cursor-pointer flex flex-col justify-between h-full relative ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white border-emerald-600 shadow-md scale-105 ring-2 ring-emerald-400'
                  : 'bg-stone-50 hover:bg-emerald-50/50 text-slate-800 border-stone-200'
              }`}
            >
              {isLiveNow && (
                <span className="absolute -top-2 -right-1 bg-amber-400 text-stone-950 font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white shadow-xs animate-pulse">
                  Sekarang
                </span>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-300 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.time}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs leading-snug">{item.title}</h4>
              </div>

              <div className="pt-2 text-[10px] font-semibold opacity-90 border-t border-white/20 mt-2">
                {item.badge}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detail Preview Card */}
      {timeline[activeStep] && (
        <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-3xl border-2 border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-800 text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
            {timeline[activeStep].icon}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full">
                {timeline[activeStep].time}
              </span>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                {timeline[activeStep].badge}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900">{timeline[activeStep].title}</h3>
            <p className="text-xs text-stone-700 leading-relaxed max-w-3xl">
              {timeline[activeStep].desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
