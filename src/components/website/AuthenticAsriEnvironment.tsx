import React, { useState } from 'react';
import { Trees, Sun, Heart, Sparkles, Compass, ShieldCheck, MapPin, ArrowRight, CheckCircle2, CloudSun } from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

interface EnvironmentPillar {
  id: string;
  title: string;
  badge: string;
  image: string;
  icon: string;
  description: string;
  benefitForChild: string;
  parentPeaceOfMind: string;
}

export const AuthenticAsriEnvironment: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars: EnvironmentPillar[] = [
    {
      id: 'env-1',
      title: 'Hamparan Sawah & Udara Segar Tanggul',
      badge: 'Lingkungan Asri & Bebas Polusi',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
      icon: '🌾',
      description: 'Berada di kawasan pedesaan Tanggul yang tenang, dikelilingi pemandangan sawah hijau menguning dan gemericik air irigasi yang jernih. Anak-anak menghirup udara murni tanpa paparan asap kendaraan berat.',
      benefitForChild: 'Paru-paru sehat, imun tubuh lebih kuat, dan fokus belajar meningkat.',
      parentPeaceOfMind: 'Ayah & Bunda tenang karena anak bersekolah di lingkungan yang bersih dan menenangkan.'
    },
    {
      id: 'env-2',
      title: 'Taman Sekolah & Kebun Edukasi Hijau',
      badge: 'Laboratorium Alam Ciptaan Allah',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1000',
      icon: '🌱',
      description: 'Taman hijau yang ditanami Bunga Kamboja, Pepohonan Rindang, Tanaman Bumbu, dan Kebun Sayur. Anak-anak praktik menyiram benih, mengamati kupu-kupu, dan belajar tawadhu pada alam.',
      benefitForChild: 'Mengenal kebesaran Allah melalui tumbuh-tumbuhan dan menumbuhkan rasa kepekaan lingkungan.',
      parentPeaceOfMind: 'Membangun kecintaan anak pada lingkungan sejak dini, bukan gadget atau layar HP.'
    },
    {
      id: 'env-3',
      title: 'Halaman Bermain Luas & Rumput Hijau Sehat',
      badge: 'Gerak Motorik Kasar Bebas & Aman',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1000',
      icon: '🛝',
      description: 'Halaman bermain outdoor beralas rumput sintetis dan rumput gajah mini yang empuk, dilengkapi pagar tertutup 24 jam. Anak bebas berlari, melompat, dan perosotan dengan risiko cedera minim.',
      benefitForChild: 'Melatih keseimbangan fisik, pelepasan emosi positif, dan keceriaan alami.',
      parentPeaceOfMind: 'Area bermain tertutup pagar rapat dan terpantau CCTV demi keamanan penuh.'
    },
    {
      id: 'env-4',
      title: 'Kolam Ikan Koi & Suasana Alami',
      badge: 'Ketenangan Jiwa & Kasih Sayang Satwa',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1000',
      icon: '🐟',
      description: 'Di sudut taman terdapat kolam kecil berisi ikan koi warna-warni. Suara gemercik air kolam memberikan terapi ketenangan alami bagi ananda yang sedang beradaptasi.',
      benefitForChild: 'Menumbuhkan kasih sayang pada hewan dan meredakan kecemasan anak baru.',
      parentPeaceOfMind: 'Suasana rileks membuat anak cepat kerasan dan selalu rindu berangkat sekolah.'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-300/80 shadow-2xl space-y-8 my-8 relative overflow-hidden">
      {/* Background Subtle Leaf Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-800/40 via-transparent to-black/40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Trees className="w-4 h-4 text-emerald-900" />
          Suasana Asri & Alami • TK Asy Syifa Tanggul
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
          Belajar di Tengah Alam Tanggul yang Hijau & Tenang
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
          Bukan di pusat keramaian kota, melainkan di lingkungan asri pedesaan yang sejuk. Ananda dapat belajar, bermain, dan menghafal Al-Qur'an dengan suasana hati yang damai.
        </p>
      </div>

      {/* AI Asy Nature Companion Scene */}
      <div className="relative z-10 bg-emerald-950/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-14 h-16 shrink-0">
          <AIAsyCharacterRenderer state="reading" scale={0.8} />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-black text-amber-300">AI Asy • Sahabat Taman Asy Syifa</span>
            <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md font-bold">Karakter Lingkungan</span>
          </div>
          <p className="text-xs text-emerald-100 italic leading-relaxed">
            "Assalamu'alaikum Ayah & Bunda! Di TK Asy Syifa, setiap pagi Asy menemani teman-teman menyiram Bunga Kamboja, memberi makan Ikan Koi, dan mendengar burung berkicau. Alam di sini indah sekali ciptaan Allah!"
          </p>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="relative z-10 flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {pillars.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === index
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/50'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.title.split('&')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Pillar Card Display */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-emerald-950/90 rounded-3xl p-6 border-2 border-emerald-500/50 shadow-xl">
        <div className="lg:col-span-6 space-y-4">
          <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/40 rounded-full text-xs font-extrabold">
            {pillars[activeTab].badge}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {pillars[activeTab].title}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/50">
            {pillars[activeTab].description}
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-300">Manfaat Bagi Anak: </span>
                <span className="text-emerald-100 font-medium">{pillars[activeTab].benefitForChild}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-emerald-300">Ketenangan Orang Tua: </span>
                <span className="text-emerald-100 font-medium">{pillars[activeTab].parentPeaceOfMind}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-lg group h-64 sm:h-80">
          <img
            src={pillars[activeTab].image}
            alt={pillars[activeTab].title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-500/40 flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" /> Tanggul, Jember
            </span>
            <span className="text-[10px] text-emerald-200 font-bold">
              Kondisi Asli Lingkungan Sekolah
            </span>
          </div>
        </div>
      </div>

      {/* Gentle Section Invitation */}
      <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-800/80">
        <p className="text-xs text-emerald-200 font-bold text-center sm:text-left">
          Ingin mengajak ananda merasakan kesejukan dan keindahan sekolah kami secara langsung?
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('w5')}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shrink-0 shadow-md flex items-center gap-1.5 border border-amber-300"
          >
            Jadwalkan Kunjungan Langsung <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
