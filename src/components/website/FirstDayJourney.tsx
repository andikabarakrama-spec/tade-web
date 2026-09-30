import React, { useState } from 'react';
import { Clock, Heart, Sparkles, Sun, Smile, BookOpen, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface TimelineStep {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  teacherNote: string;
  tag: string;
}

export const FirstDayJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: TimelineStep[] = [
    {
      time: '06.30 WIB',
      title: 'Menyambut Senyuman Pagi',
      subtitle: 'Gerbang Ramah Anak & Penyambutan Guru',
      description: 'Ananda disambut langsung oleh Kepala Sekolah dan Guru Piket dengan senyuman hangat, kehangatan salam Islami, dan sapaan santun sebelum melangkah ke area sekolah.',
      icon: '🌅',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Assalamu’alaikum Ananda Soleh! Selamat pagi, mari masuk dengan kaki kanan ya.”',
      tag: '5S: Senyum, Sapa, Salam, Sopan, Santun',
    },
    {
      time: '07.00 WIB',
      title: 'Sholat Dhuha & Doa Ceria',
      subtitle: 'Pembiasaan Adab & Ruang Suci',
      description: 'Melatih kedisiplinan beribadah sejak dini melalui wudhu mandiri, sholat Dhuha 2 rakaat berjamaah cilik, dan hafalan doa harian dengan penuh khusyuk.',
      icon: '🕌',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Membentuk karakter pembiasa ibadah tanpa paksaan melalui keteladanan.”',
      tag: 'Karakter Islami',
    },
    {
      time: '08.00 WIB',
      title: 'Belajar Sentra Interaktif',
      subtitle: 'Kurikulum Merdeka PAUD STEAM',
      description: 'Ananda mengeksplorasi Sentra Balok, Sentra IMTAQ, Sentra Seni Kreasi, dan Sentra Alam. Melatih kreativitas, problem solving, dan keterampilan motorik halus.',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Bermain adalah cara anak belajar paling efektif dan membahagiakan.”',
      tag: 'Merdeka Belajar PAUD',
    },
    {
      time: '09.00 WIB',
      title: 'Snack Time & Adab Makan',
      subtitle: 'Gizi Seimbang & Kemandirian',
      description: 'Menikmati bekal sehat dari rumah atau catering sekolah, diawali doa makan, cuci tangan 6 langkah, dan belajar berbagi dengan teman sebaya.',
      icon: '🍎',
      image: 'https://images.unsplash.com/photo-1566454825481-4e48f80aa4d7?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Mendidik adab makan tangan kanan, duduk tenang, dan tidak bersisa.”',
      tag: 'Adab & Kesehatan',
    },
    {
      time: '09.30 WIB',
      title: 'Bermain Bebas di Taman',
      subtitle: 'Outdoor Playground Safe & Green',
      description: 'Ayunan, perosotan, komidi putar, dan permainan pasir kinetik. Di bawah pengawasan ekstra guru pendamping untuk memastikan keamanan penuh.',
      icon: '🛝',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Interaksi sosial dan fisik outdoor membangun imunitas serta keberanian anak.”',
      tag: 'Motorik Kasar',
    },
    {
      time: '10.30 WIB',
      title: 'Bimbingan Tahfidz Surah',
      subtitle: 'Tartil Gembira Juz 30',
      description: 'Metode sima’i dan murajaah ringan menyenangkan. Ananda menghafal Surah An-Nas hingga An-Naba, doa harian, dan hadits pendek dengan bimbingan ustadzah.',
      icon: '📖',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Menanamkan rasa cinta Al-Qur’an sejak dini melalui nada tartil indah.”',
      tag: 'Unggulan Tahfidz',
    },
    {
      time: '11.00 WIB',
      title: 'Kepulangan & Pelukan Bunda',
      subtitle: 'Buku Penghubung Digital SIM & Salam Penutup',
      description: 'Ananda merapikan perlengkapan sendiri, berdo’a penutup majelis, dan dijemput oleh orang tua. Guru melaporkan jurnal perkembangan harian di SIM Wali Murid R29.',
      icon: '🏡',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      teacherNote: '“Sampai jumpa besok Ananda hebat! Terima kasih Bunda atas kepercayaannya.”',
      tag: 'Transparansi SIM',
    },
  ];

  const current = steps[activeStep];

  return (
    <section className="bg-gradient-to-br from-amber-50/80 via-emerald-50/60 to-teal-50/80 rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200/80 text-amber-900 font-extrabold text-xs">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          Pengalaman Harian Anak
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Bayangkan Hari Pertama Ananda di TK Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Setiap detik diawali dengan kasih sayang, dibimbing dengan nilai Islami, dan dipenuhi keceriaan dunia anak.
        </p>
      </div>

      {/* Interactive Time Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {steps.map((s, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={s.time}
              onClick={() => setActiveStep(idx)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition transform flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md scale-105'
                  : 'bg-white text-stone-700 hover:bg-emerald-100 border border-stone-200'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.time}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Card for Selected Step */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
        {/* Left Image & Tag */}
        <div className="lg:col-span-5 relative">
          <div className="h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-100 relative">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                {current.tag}
              </span>
              <p className="text-xs text-stone-200 mt-1 font-semibold">{current.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full w-fit">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            Jadwal: {current.time}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {current.description}
          </p>

          <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200/80 text-xs text-amber-950 font-medium space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Smile className="w-3.5 h-3.5 text-amber-600" /> Catatan Hangat Guru:
            </span>
            <p className="italic text-stone-800">{current.teacherNote}</p>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pengawasan Guru 1:10
            </span>
            <span className="font-semibold text-emerald-700">Langkah {activeStep + 1} dari {steps.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
