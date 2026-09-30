import React, { useState } from 'react';
import { Clock, Sun, Sparkles, CheckCircle2, Shield, Heart, ArrowRight } from 'lucide-react';

interface TimelineStep {
  id: number;
  time: string;
  stepName: string;
  category: string;
  icon: string;
  description: string;
  benefit: string;
  bgGradient: string;
}

export const DayInTheLifeTimeline: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const steps: TimelineStep[] = [
    {
      id: 1,
      time: "07.00 WIB",
      stepName: "1. Datang ke Sekolah",
      category: "Awal Ceria",
      icon: "🚶‍♂️",
      description: "Ananda tiba di gerbang kampus hijau TK Asy Syifa Tanggul dengan keceriaan dan senyum hangat.",
      benefit: "Membangun semangat pagi dan kebiasaan tepat waktu.",
      bgGradient: "from-amber-50 to-orange-50 border-amber-300"
    },
    {
      id: 2,
      time: "07.10 WIB",
      stepName: "2. Disambut Guru",
      category: "Kehangatan 3S",
      icon: "🤗",
      description: "Disambut dengan salam, senyum, dan sapa oleh Ustadzah. Ananda melepas sepatu mandiri dan menaruh di raknya.",
      benefit: "Rasa aman, diterima, dan melatih kemandirian sejak langkah pertama.",
      bgGradient: "from-emerald-50 to-teal-50 border-emerald-300"
    },
    {
      id: 3,
      time: "07.30 WIB",
      stepName: "3. Doa Pagi & Dhuha",
      category: "Pembiasaan Karakter",
      icon: "🕌",
      description: "Duduk melingkar bersama di musholla, membaca doa harian, ikrar siswa, serta wudhu dan sholat Dhuha berjamaah.",
      benefit: "Pondasi ketakwaan dan kecintaan ibadah sejak dini.",
      bgGradient: "from-sky-50 to-blue-50 border-sky-300"
    },
    {
      id: 4,
      time: "08.15 WIB",
      stepName: "4. Belajar Sentra",
      category: "Eksplorasi Merdeka",
      icon: "🧩",
      description: "Eksplorasi di Sentra Balok, Sentra Bahan Alam, Sentra IMTAQ, atau Sentra Peran sesuai minat dan rasa ingin tahu anak.",
      benefit: "Mengasah logika, motorik halus, dan imajinasi.",
      bgGradient: "from-yellow-50 to-amber-50 border-amber-400"
    },
    {
      id: 5,
      time: "09.00 WIB",
      stepName: "5. Tahfidz Cilik",
      category: "Qurani",
      icon: "📖",
      description: "Bimbingan privat melafalkan Iqro, memperlancar bacaan, dan menambah hafalan surah-surah pendek Juz 30.",
      benefit: "Kedekatan emosional dan hafalan Al-Qur'an secara bertahap.",
      bgGradient: "from-purple-50 to-indigo-50 border-purple-300"
    },
    {
      id: 6,
      time: "09.45 WIB",
      stepName: "6. Bermain Bebas",
      category: "Motorik Kasar",
      icon: "🛝",
      description: "Bermain di arena playground outdoor yang aman, berlari di atas rumput hijau, perosotan, dan ayunan.",
      benefit: "Kesehatan fisik, pelepasan energi positif, dan interaksi sosial.",
      bgGradient: "from-teal-50 to-emerald-50 border-teal-300"
    },
    {
      id: 7,
      time: "10.15 WIB",
      stepName: "7. Makan Bersama",
      category: "Adab Islami",
      icon: "🍱",
      description: "Cuci tangan dengan sabun, berdoa sebelum/sesudah makan, dan menikmati bekal sehat bersama teman-teman.",
      benefit: "Melatih adab makan, berbagi, dan rasa syukur.",
      bgGradient: "from-rose-50 to-pink-50 border-rose-300"
    },
    {
      id: 8,
      time: "10.30 WIB",
      stepName: "8. Berkreasi",
      category: "Seni & Ekspresi",
      icon: "🎨",
      description: "Mewarnai, melipat kertas origammi, bernyanyi lagu Islami, atau membuat hasta karya gembira.",
      benefit: "Mengekspresikan emosi positif dan apresiasi seni.",
      bgGradient: "from-amber-100 to-yellow-100 border-amber-400"
    },
    {
      id: 9,
      time: "11.00 WIB",
      stepName: "9. Doa Pulang",
      category: "Penutup Bahagia",
      icon: "🎒",
      description: "Mengingat kembali kegembiraan hari ini, membaca doa penutup majelis, dan dijemput oleh orang tua tercinta.",
      benefit: "Menutup hari dengan hati yang tenang, bahagia, dan rindu kembali besok.",
      bgGradient: "from-emerald-100 to-teal-100 border-emerald-400"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-emerald-50/80 via-white to-amber-50/80 rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 shadow-xl relative my-10 overflow-hidden">
      {/* Header Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto mb-8 relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800 text-amber-300 font-black text-xs shadow-xs">
          <Clock className="w-4 h-4 text-amber-300" />
          Satu Hari Menjadi Siswa Cilik
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          Perjalanan Harian Ananda di Sekolah
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Inilah sembilan momen berharga yang dirasakan ananda setiap hari dari kedatangan hingga kepulangan penuh keceriaan.
        </p>
      </div>

      {/* Horizontal Step Flow Badges */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar relative z-10">
        {steps.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => setSelectedStep(idx)}
            className={`px-3 py-2 rounded-2xl text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              selectedStep === idx
                ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-emerald-500'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>{st.icon}</span>
            <span className="hidden md:inline">{st.stepName.split('.')[1] || st.stepName}</span>
            <span className="md:hidden">{st.time}</span>
          </button>
        ))}
      </div>

      {/* Slots Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start pt-2">
        {/* Left Steps List */}
        <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {steps.map((st, idx) => (
            <div
              key={st.id}
              onClick={() => setSelectedStep(idx)}
              className={`p-3.5 rounded-2xl border-2 transition duration-200 cursor-pointer flex items-center justify-between ${
                selectedStep === idx
                  ? `${st.bgGradient} shadow-md scale-102 border-l-8 border-l-emerald-800`
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{st.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    {st.time}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {st.stepName}
                  </h4>
                </div>
              </div>
              <span className="text-xs text-stone-400 font-bold">▶</span>
            </div>
          ))}
        </div>

        {/* Right Step Detail Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-300 shadow-xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl bg-amber-100 p-3 rounded-2xl border border-amber-300">
                {steps[selectedStep].icon}
              </span>
              <span className="px-3 py-1 bg-emerald-800 text-amber-300 text-xs font-black rounded-full shadow-2xs">
                {steps[selectedStep].time}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {steps[selectedStep].category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {steps[selectedStep].stepName}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium bg-stone-50 p-4 rounded-2xl border border-stone-200">
              {steps[selectedStep].description}
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-black text-emerald-900">Dampak Perkembangan Anak:</h5>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  {steps[selectedStep].benefit}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Section Invitation */}
      <div className="mt-8 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p className="text-stone-600 font-bold text-center sm:text-left">
          Ingin merasakan kehangatan alur belajar ini secara langsung bersama ananda?
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('w4')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            Daftar Trial / Observasi Kelas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
