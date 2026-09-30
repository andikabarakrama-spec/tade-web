import React, { useState } from 'react';
import { Sparkles, Heart, Smile, Sun, Clock, BookOpen, Utensils, Music, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { DoodleSun, DoodleCloud, DoodleRainbow, DoodlePencil, DoodlePaperAirplane, DoodleHandprint, DoodleBlocks } from '../garden/ChildDoodleDecorations';

interface StoryStep {
  id: number;
  time: string;
  title: string;
  subtitle: string;
  icon: string;
  storyText: string;
  emotionalTag: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
}

export const ImagineYourChildSmile: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const storySteps: StoryStep[] = [
    {
      id: 1,
      time: "07.00 WIB",
      title: "Ayah & Bunda Mengantar Ananda",
      subtitle: "Awal pagi penuh kecupan dan doa keselamatan",
      icon: "🚗",
      storyText: "Di gerbang Kampus Hijau TK Asy Syifa, Ananda melangkah dengan percaya diri. Ayah membisikkan doa, Bunda memberikan pelukan terhangat. Senyum Ananda mengembang melihat bus sekolah & taman hijau yang asri.",
      emotionalTag: "Cinta & Kehangatan Keluarga",
      bgGradient: "from-amber-50 via-orange-50 to-amber-100",
      borderColor: "border-amber-300",
      badgeBg: "bg-amber-400 text-slate-950"
    },
    {
      id: 2,
      time: "07.15 WIB",
      title: "Ibu Guru Menyambut Hangat",
      subtitle: "3S: Senyum, Salam, dan Sapa Ramah Anak",
      icon: "👩‍🏫",
      storyText: "Ustadzah menyapa Ananda dengan sebutan kesayangan, menanyakan kabar dengan kelembutan, dan membimbing Ananda melepas sepatu serta merapikan tas di loker pribadinya.",
      emotionalTag: "Rasa Aman & Diterima",
      bgGradient: "from-emerald-50 via-teal-50 to-emerald-100",
      borderColor: "border-emerald-300",
      badgeBg: "bg-emerald-800 text-amber-300"
    },
    {
      id: 3,
      time: "07.30 WIB",
      title: "Ceria Bermain Bersama Sahabat",
      subtitle: "Lingkungan inklusif, sehat, dan penuh tawa",
      icon: "🛝",
      storyText: "Ananda berlari kecil menuju perosotan, bermain engklek, dan menyapa teman-teman. Dek Syifa maskot ikut hadir menghibur dengan lagu-lagu gembira Islami.",
      emotionalTag: "Persahabatan & Interaksi Sosial",
      bgGradient: "from-sky-50 via-blue-50 to-sky-100",
      borderColor: "border-sky-300",
      badgeBg: "bg-sky-600 text-white"
    },
    {
      id: 4,
      time: "08.00 WIB",
      title: "Iqro & Hafalan Surah Pendek",
      subtitle: "Menanamkan kecintaan Al-Qur'an sejak dini",
      icon: "📖",
      storyText: "Dengan metode privat bertahap yang menyenangkan, Ananda melafalkan huruf-huruf hijaiyah dan menghafal Surah Al-Fatihah hingga An-Nas tanpa paksaan, penuh antusiasme.",
      emotionalTag: "Keimanan & Cinta Al-Qur'an",
      bgGradient: "from-teal-50 via-emerald-50 to-teal-100",
      borderColor: "border-teal-300",
      badgeBg: "bg-teal-700 text-white"
    },
    {
      id: 5,
      time: "09.15 WIB",
      title: "Sholat Dhuha Berjamaah",
      subtitle: "Latihan wudhu dan pembiasaan ibadah rutin",
      icon: "🕌",
      storyText: "Ananda memakai sarung & mukena ciliknya dengan mandiri. Mengikuti gerakan wudhu dan sholat dhuha dengan khusyuk dalam bimbingan Ustadzah.",
      emotionalTag: "Pembentukan Karakter Islami",
      bgGradient: "from-purple-50 via-indigo-50 to-purple-100",
      borderColor: "border-purple-300",
      badgeBg: "bg-purple-700 text-white"
    },
    {
      id: 6,
      time: "09.45 WIB",
      title: "Makan Sehat & Doa Bersama",
      subtitle: "Asupan thoyyib & kemandirian adab makan",
      icon: "🍱",
      storyText: "Ananda membaca doa sebelum makan, mencuci tangan memakai sabun, dan menikmati bekal sehat bernutrisi sambil diajarkan berbagi makanan dengan teman.",
      emotionalTag: "Kemandirian & Kemuliaan Adab",
      bgGradient: "from-rose-50 via-pink-50 to-rose-100",
      borderColor: "border-rose-300",
      badgeBg: "bg-rose-600 text-white"
    },
    {
      id: 7,
      time: "10.15 WIB",
      title: "Experiential Learning & Eksplorasi",
      subtitle: "Seni, musik angklung, berkebun & sains cilik",
      icon: "🎨",
      storyText: "Jemari Ananda belepotan cat air berwarna-warni membuat lukisan bunga matahari, memetik sayur di kebun sekolah, dan menari di kelas seni musik.",
      emotionalTag: "Kreativitas & Kecerdasan Spasial",
      bgGradient: "from-yellow-50 via-amber-50 to-yellow-100",
      borderColor: "border-amber-400",
      badgeBg: "bg-amber-500 text-slate-950"
    },
    {
      id: 8,
      time: "11.00 WIB",
      title: "Pulang dengan Wajah Berseri",
      subtitle: "Membawa pulang sejuta cerita membanggakan",
      icon: "🎒",
      storyText: "Saat Ayah Bunda datang menjemput, Ananda berlari memeluk sambil berteriak gembira: 'Bunda, tadi aku bisa hafal Surah baru dan buat lukisan burung!' Senyum membuncah di wajah Ayah Bunda.",
      emotionalTag: "Kebanggaan & Kebahagiaan Orang Tua",
      bgGradient: "from-emerald-100 via-teal-100 to-amber-100",
      borderColor: "border-emerald-400",
      badgeBg: "bg-emerald-900 text-amber-300"
    }
  ];

  const current = storySteps.find(s => s.id === activeStep) || storySteps[0];

  return (
    <div className="bg-gradient-to-b from-stone-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-amber-400/80 shadow-2xl relative my-10 overflow-hidden">
      {/* Background Decorative Doodles */}
      <div className="absolute top-6 left-8 pointer-events-none opacity-20">
        <DoodleSun className="w-20 h-20 text-amber-300" />
      </div>
      <div className="absolute bottom-8 right-10 pointer-events-none opacity-20">
        <DoodlePaperAirplane className="w-16 h-16 text-sky-300" />
      </div>

      {/* Header Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-8 relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600 animate-pulse" />
          Buku Cerita Orang Tua
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-amber-300 tracking-tight">
          Bayangkan Senyum Ananda Setiap Hari
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 font-medium leading-relaxed">
          Setiap detik di TK Asy Syifa dirancang untuk menumbuhkan binar kebahagiaan, kemandirian, dan kecintaan pada ilmu serta Al-Qur'an. Klik setiap tahap untuk mengikuti perjalanan Ananda!
        </p>
      </div>

      {/* Timeline Step Selector Buttons */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar relative z-10">
        {storySteps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`flex-none px-4 py-2.5 rounded-2xl text-xs font-black transition duration-200 flex items-center gap-2 border-2 ${
              activeStep === step.id
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-105'
                : 'bg-slate-800/80 text-stone-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>{step.icon}</span>
            <span>{step.time}</span>
          </button>
        ))}
      </div>

      {/* Active Story Card - Storybook Page Layout */}
      <div className={`bg-gradient-to-br ${current.bgGradient} text-slate-900 rounded-3xl p-6 sm:p-10 border-4 ${current.borderColor} shadow-2xl relative z-10 transition duration-300`}>
        {/* Scrapbook Corner Tape */}
        <div className="absolute -top-3 left-8 w-24 h-6 bg-amber-200/90 border border-amber-300 -rotate-2 rounded-xs shadow-2xs pointer-events-none" />
        <div className="absolute -top-3 right-8 w-24 h-6 bg-amber-200/90 border border-amber-300 rotate-2 rounded-xs shadow-2xs pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big Icon & Time Badge */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3 bg-white/80 backdrop-blur-xs p-6 rounded-3xl border-2 border-stone-200 shadow-md">
            <div className="w-24 h-24 rounded-3xl bg-amber-100 flex items-center justify-center text-5xl shadow-inner border-2 border-amber-300 animate-bounce">
              {current.icon}
            </div>
            <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-xs ${current.badgeBg}`}>
              {current.time}
            </span>
            <span className="text-[11px] font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              💖 {current.emotionalTag}
            </span>
          </div>

          {/* Right Column: Narrative Story text */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-emerald-800">
                {current.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-base text-stone-800 leading-relaxed font-medium bg-white/60 p-4 rounded-2xl border border-stone-200/80 shadow-2xs italic">
              “{current.storyText}”
            </p>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1">
                <Smile className="w-4 h-4 text-amber-600" />
                Langkah {current.id} dari {storySteps.length}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-slate-900 font-bold disabled:opacity-40 text-xs shadow-2xs"
                >
                  ◀ Sebelumnya
                </button>

                <button
                  disabled={activeStep === storySteps.length}
                  onClick={() => setActiveStep(prev => Math.min(storySteps.length, prev + 1))}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black disabled:opacity-40 text-xs shadow-md"
                >
                  Selanjutnya ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
