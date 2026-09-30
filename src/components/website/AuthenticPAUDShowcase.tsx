import React, { useState } from 'react';
import { BookOpen, Palette, Sparkles, Heart, Utensils, Trees, Fish, Shield, Sun, CheckCircle2 } from 'lucide-react';

interface PAUDActivity {
  id: string;
  title: string;
  category: string;
  icon: string;
  image: string;
  desc: string;
  benefit: string;
  hadithOrValue: string;
  bgGrad: string;
  borderColor: string;
}

export const AuthenticPAUDShowcase: React.FC = () => {
  const activities: PAUDActivity[] = [
    {
      id: 'paud-1',
      title: 'Sholat Dhuha & Tahfidz Surah Cilik',
      category: 'Karakter & Ibadah',
      icon: '🕌',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      desc: 'Pembiasaan sholat berjamaah, hafalan juz 30 dengan metode tartil gembira, dan melafalkan doa harian.',
      benefit: 'Membentuk kedisiplinan spiritual & kecintaan pada Al-Qur’an sejak usia dini.',
      hadithOrValue: '“Sebaik-baik kalian adalah yang mempelajari Al-Qur’an dan mengajarkannya.” (HR. Bukhari)',
      bgGrad: 'from-emerald-100 via-teal-50 to-emerald-200/60',
      borderColor: 'border-emerald-400',
    },
    {
      id: 'paud-2',
      title: 'Pojok Baca & Dongeng Kisah Nabi',
      category: 'Literasi & Imajinasi',
      icon: '📖',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      desc: 'Ananda menyimak dongeng pahlawan Islam, membaca buku bergambar, dan bercerita kembali di depan teman-teman.',
      benefit: 'Meningkatkan kosakata, daya kritis, keberanian tampil, dan empati emosional.',
      hadithOrValue: 'Membangun kebiasaan literasi emas sejak usia 3-6 tahun.',
      bgGrad: 'from-amber-100 via-yellow-50 to-amber-200/60',
      borderColor: 'border-amber-400',
    },
    {
      id: 'paud-3',
      title: 'Mewarnai & Kreasi Seni Krayon',
      category: 'Seni & Kreativitas',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800',
      desc: 'Eksplorasi warna krayon, cat air jari (finger painting), menggunting kertas lipat, dan kolase bahan alam.',
      benefit: 'Melatih koordinasi mata-tangan, motorik halus, serta kebebasan berekspresi.',
      hadithOrValue: 'Mendorong daya imajinasi visual tanpa batas.',
      bgGrad: 'from-pink-100 via-rose-50 to-pink-200/60',
      borderColor: 'border-pink-400',
    },
    {
      id: 'paud-4',
      title: 'Konstruksi Balok & Lego Edukatif',
      category: 'Sains & Logika STEAM',
      icon: '🧱',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800',
      desc: 'Menyusun istana balok kayu, merancang jembatan Lego, serta eksperimen bentuk geometri dan keseimbangan.',
      benefit: 'Pengenalan awal dasar matematika, pemecahan masalah, dan pemikiran spasial.',
      hadithOrValue: 'Merangsang kemampuan Problem Solving cilik.',
      bgGrad: 'from-sky-100 via-blue-50 to-sky-200/60',
      borderColor: 'border-sky-400',
    },
    {
      id: 'paud-5',
      title: 'Fun Cooking Ceria & Bekal Sehat',
      category: 'Kemandirian & Nutrisi',
      icon: '🧁',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
      desc: 'Praktik membuat bekal buah, menghias roti tawar, mengenal bumbu dapur, dan adab cuci tangan bersih.',
      benefit: 'Melatih kemandirian, apresiasi makanan halal, dan kebersihan diri.',
      hadithOrValue: 'Membiasakan makan makanan Thayyib & Halal.',
      bgGrad: 'from-orange-100 via-amber-50 to-orange-200/60',
      borderColor: 'border-orange-400',
    },
    {
      id: 'paud-6',
      title: 'Berkebun & Memberi Makan Ikan Koi',
      category: 'Sains Alam & Kasih Sayang Satwa',
      icon: '🌱',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      desc: 'Menyiram benih sayur di kebun sekolah, memberi pelet ikan koi, dan mengamati proses tumbuh tanaman.',
      benefit: 'Menumbuhkan rasa sayang pada mahluk ciptaan Allah dan pemahaman ekosistem.',
      hadithOrValue: '“Sayangilah yang ada di bumi, niscaya yang di langit menyayangimu.” (HR. Tirmidzi)',
      bgGrad: 'from-teal-100 via-emerald-50 to-teal-200/60',
      borderColor: 'border-teal-400',
    },
    {
      id: 'paud-7',
      title: 'Sensory Sand Play & Arena Pasir',
      category: 'Stimulasi Sensorik',
      icon: '🏖️',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
      desc: 'Bermain pasir kinetik dan pasir pantai bersih yang terverifikasi aman bagi kulit sensitif anak.',
      benefit: 'Menstimulasi taktil sensorik, meredakan emosi, dan melatih konsentrasi.',
      hadithOrValue: 'Keseimbangan sensorik untuk tumbuh kembang optimal.',
      bgGrad: 'from-amber-100 via-orange-50 to-yellow-200/60',
      borderColor: 'border-amber-400',
    },
    {
      id: 'paud-8',
      title: 'Senam Pagi & Olahraga Motorik Kasar',
      category: 'Kebugaran Fisik',
      icon: '🏃',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
      desc: 'Gerak lagu ceria di bawah sinar matahari pagi, melompati rintangan busa, dan permainan estafet bola.',
      benefit: 'Menguatkan imun tubuh, otot kaki tangan, daya tahan tubuh, dan keceriaan.',
      hadithOrValue: '“Mukmin yang kuat lebih dicintai Allah.” (HR. Muslim)',
      bgGrad: 'from-purple-100 via-indigo-50 to-purple-200/60',
      borderColor: 'border-purple-400',
    },
  ];

  const [activeTab, setActiveTab] = useState<string>('Semua');

  const filtered = activeTab === 'Semua' 
    ? activities 
    : activities.filter(a => a.category.includes(activeTab));

  return (
    <section className="bg-gradient-to-br from-amber-50/90 via-emerald-50/80 to-teal-50/90 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-xl space-y-8 relative overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute top-2 left-6 text-2xl animate-bounce">🎈</div>
      <div className="absolute top-3 right-8 text-2xl animate-pulse">✨</div>
      <div className="absolute bottom-3 left-8 text-2xl">🧸</div>
      <div className="absolute bottom-3 right-10 text-2xl">🎨</div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b-2 border-amber-200 pb-6 relative">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800 text-amber-300 font-black text-xs shadow-md border-2 border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Dokumentasi Otentik PAUD Ceria Asy Syifa</span>
            <span className="text-base">🧸</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Kegiatan Nyata & Pembiasaan Karakter Siswa Cilik
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-medium">
            Potret keceriaan hari demi hari ananda saat beribadah, belajar, berkebun, dan bermain bersama guru serta teman.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-amber-200 shadow-2xs">
          {(['Semua', 'Ibadah', 'Literasi', 'Seni', 'Sains'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === cat
                  ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-500 scale-105'
                  : 'text-stone-700 hover:bg-amber-100/60'
              }`}
            >
              {cat === 'Semua' ? '🌈 Semua Kegiatan' : cat === 'Ibadah' ? '🕌 Ibadah' : cat === 'Literasi' ? '📖 Literasi' : cat === 'Seni' ? '🎨 Seni' : '🌱 Sains & Alam'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Cards Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((act) => (
          <div
            key={act.id}
            className={`bg-gradient-to-br ${act.bgGrad} rounded-3xl p-5 border-4 ${act.borderColor} shadow-md hover:shadow-2xl transition duration-300 space-y-3 relative overflow-hidden flex flex-col justify-between group`}
          >
            {/* Scrapbook Photo Frame with Washi Tape */}
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-stone-100">
                {/* Washi Tape Accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/90 border border-amber-300 -rotate-2 z-10 rounded-xs shadow-2xs pointer-events-none" />
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase text-slate-950 bg-amber-300 px-2.5 py-0.5 rounded-md border border-amber-400 shadow-xs">
                  {act.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-emerald-900 transition flex items-center gap-1.5">
                  <span className="text-xl">{act.icon}</span>
                  <span>{act.title}</span>
                </h3>
                <p className="text-[11px] text-stone-700 leading-relaxed font-medium mt-1">
                  {act.desc}
                </p>
              </div>
            </div>

            {/* Benefit Box */}
            <div className="pt-2 border-t border-stone-200/80 space-y-1.5 text-[10px]">
              <div className="p-2 bg-white/90 rounded-xl border border-stone-200 text-stone-800 font-extrabold flex items-start gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{act.benefit}</span>
              </div>
              <p className="italic text-emerald-900 font-bold bg-emerald-100/70 p-1.5 rounded-lg border border-emerald-200">
                {act.hadithOrValue}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
