import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, Sun, Calendar, Star } from 'lucide-react';

interface Story {
  day: string;
  theme: string;
  title: string;
  icon: string;
  story: string;
  hadithOrDoa: string;
  activity: string;
}

export const DailyStoryEngine: React.FC = () => {
  const stories: Story[] = [
    {
      day: 'Senin',
      theme: 'Belajar Disiplin & Kemandirian',
      title: 'Kisah Kelinci Kiki Memasang Sepatu Sendiri',
      icon: '🐰',
      story: 'Hari Senin yang cerah di TK Asy Syifa! Kiki Si Kelinci belajar memakai sepatu dan merapikan tas sendiri sebelum masuk kelas. Ibu Guru memberikan bintang emas atas kemandirian Kiki.',
      hadithOrDoa: 'Hadits Disiplin: "Kebersihan dan kerapian adalah sebagian dari iman." (HR. Muslim)',
      activity: 'Latihan merapikan peralatan sekolah sendiri & apel pagi.',
    },
    {
      day: 'Selasa',
      theme: 'Belajar Berbagi & Peduli Teman',
      title: 'Tupai Tutu Membagi Bekal Roti',
      icon: '🐿️',
      story: 'Saat jam bekal snack, Tutu Si Tupai melihat teman ayamnya lupa membawa roti. Tutu dengan senyum ceria membagi separuh rotinya. Merasa berbagi membuat hatiTutut terasa hangat dan bahagia!',
      hadithOrDoa: 'Hadits Berbagi: "Senyummu di hadapan saudaramu adalah sedekah." (HR. Tirmidzi)',
      activity: 'Kegiatan tukar krayon dan bekal sehat antar teman.',
    },
    {
      day: 'Rabu',
      theme: 'Belajar Doa & Adab Harian',
      title: 'Bebek Boni Selalu Membaca Bismillah',
      icon: '🦆',
      story: 'Sebelum minum air, Boni Si Bebek selalu mengucap Bismillahirrahmannirrahim dan duduk manis. Boni tahu bahwa adab makan dan minum membawa berkah dari Allah SWT.',
      hadithOrDoa: 'Doa Sebelum Makan: "Allahumma bariklana fi ma razaqtana wa qina \'adzabannar"',
      activity: 'Praktik sholat dhuha cilik & hafalan doa harian.',
    },
    {
      day: 'Kamis',
      theme: 'Belajar Berkebun & Mencintai Alam',
      title: 'Katak Koko Menanam Bunga di Taman Asy Syifa',
      icon: '🐸',
      story: 'Hari Kamis adalah Hari Hijau! Koko Si Katak bersama teman-teman menyiram tanaman, memberi pupuk organik, dan mengamati kupu-kupu yang hinggap di bunga bayam.',
      hadithOrDoa: 'Hadits Menanam: "Tidaklah seorang muslim menanam pohon melainkan bernilai sedekah." (HR. Bukhari)',
      activity: 'Menanam biji kacang hijau & eksperimen sains cilik.',
    },
    {
      day: 'Jumat',
      theme: 'Belajar Sedekah & Berkah Jumat',
      title: 'Anak Ayam Cici Mengisi Kotak Infaq',
      icon: '🐥',
      story: 'Jumat Berkah! Cici Si Anak Ayam membawa koin tabungan untuk dimasukkan ke Kotak Infaq Jumat Ceria. Tabungan ini digunakan untuk membantu anak yatim dan panti asuhan.',
      hadithOrDoa: 'Keutamaan Sedekah: "Sedekah tidak akan mengurangi harta." (HR. Muslim)',
      activity: 'Infaq Jumat Ceria & kisah nabi bergambar.',
    },
    {
      day: 'Sabtu',
      theme: 'Keluarga & Budi Pekerti',
      title: 'Membantu Ibu dan Ayah di Rumah',
      icon: '🏠',
      story: 'Hari Sabtu adalah hari bersama keluarga. Anak-anak TK Asy Syifa berlatih membantu orang tua menyapu rumah, menyapa tetangga dengan ramah, dan beribadah bersama.',
      hadithOrDoa: 'Doa Kedua Orang Tua: "Rabbighfirli waliwalidayya warhamhuma kama rabbayani shaghira"',
      activity: 'Jurnal harian kebaikan bersama Ayah Ibu.',
    },
  ];

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const dayIndex = new Date().getDay();
  // Map index: Sun -> 5 (Sabtu), Mon -> 0 (Senin), Tue -> 1, Wed -> 2, Thu -> 3, Fri -> 4, Sat -> 5
  const defaultIndex = dayIndex === 0 ? 5 : dayIndex - 1;

  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const activeStory = stories[selectedIndex] || stories[0];

  return (
    <section className="bg-gradient-to-br from-amber-50 via-emerald-50/60 to-teal-50 rounded-3xl p-6 sm:p-10 border-2 border-emerald-200/80 shadow-md space-y-6 relative overflow-hidden">
      {/* Decorative Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs text-xl">
            📖
          </span>
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Kisah Harian Cilik (Daily Story)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Cerita & Hikmah Karakter Islami
            </h3>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white/80 p-1.5 rounded-2xl border border-stone-200">
          {stories.map((s, idx) => (
            <button
              key={s.day}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition transform ${
                selectedIndex === idx
                  ? 'bg-emerald-700 text-white shadow-xs scale-105'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {s.day}
            </button>
          ))}
        </div>
      </div>

      {/* Story Content Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-3 flex flex-col items-center justify-center bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center space-y-2">
          <span className="text-6xl animate-bounce">{activeStory.icon}</span>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Tema: {activeStory.day}
          </span>
          <p className="text-xs font-extrabold text-slate-800">{activeStory.theme}</p>
        </div>

        <div className="md:col-span-9 space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-extrabold text-emerald-900">
              {activeStory.title}
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-2xs">
              {activeStory.story}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 bg-emerald-100/90 rounded-2xl border border-emerald-300 text-emerald-950 font-bold space-y-1">
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-800">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Hadits / Doa Pilihan
              </span>
              <p className="italic">{activeStory.hadithOrDoa}</p>
            </div>

            <div className="p-3 bg-amber-100/90 rounded-2xl border border-amber-300 text-amber-950 font-bold space-y-1">
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Kegiatan Pembiasaan
              </span>
              <p>{activeStory.activity}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
