import React, { useState } from 'react';
import { Sun, Heart, Sparkles, ShieldCheck, CheckCircle2, Bike, Smile, MapPin, Trees, ArrowRight } from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

interface MorningMoment {
  id: string;
  time: string;
  transportIcon: string;
  transportTitle: string;
  title: string;
  description: string;
  atmosphereNote: string;
  childEmotion: string;
  parentFeeling: string;
  image: string;
  colorTag: string;
}

export const AuthenticVillageMorningScene: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [selectedMoment, setSelectedMoment] = useState<number>(0);

  const moments: MorningMoment[] = [
    {
      id: 'm1',
      time: '06.45 - 07.15 WIB',
      transportIcon: '🛵',
      transportTitle: 'Sepeda Motor & Sepeda Pedesaan',
      title: 'Antar Jemput Hangat Jalur Desa Tanggul',
      description: 'Ayah atau Bunda mengantar ananda membelah angin pagi yang sejuk melewati hamparan sawah hijau Tanggul. Ananda duduk manis memakai tas ransel ciliknya, menikmati pemandangan alam dan kicauan burung.',
      atmosphereNote: 'Suasana tenang tanpa hiruk pikuk klakson mobil mewah atau polusi kota.',
      childEmotion: 'Ananda tersenyum ceria menikmati keindahan pagi.',
      parentFeeling: 'Perjalanan singkat yang mempererat ikatan batin Ayah/Bunda dan anak.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
      colorTag: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      id: 'm2',
      time: '07.15 - 07.25 WIB',
      transportIcon: '🤝',
      transportTitle: 'Penyambutan 5S Ibu Guru',
      title: 'Salam & Salim Penuh Kasih di Gerbang Hijau',
      description: 'Ibu Guru berpakaian rapi dan bersenyum tulus menunggu di depan halaman. Ananda mencium tangan ustadzah dengan penuh takzim (salim) sambil mengucapkan "Assalamu’alaikum".',
      atmosphereNote: 'Bukan formalitas kaku, tetapi kehangatan layaknya keluarga sendiri.',
      childEmotion: 'Merasakan rasa aman dan dihargai sejak detik pertama tiba.',
      parentFeeling: 'Bunda bernapas lega meninggalkan anak pada pengasuh yang tepat.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      colorTag: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'm3',
      time: '07.25 - 07.30 WIB',
      transportIcon: '🦋',
      transportTitle: 'Taman Kebun & AI Asy',
      title: 'Menyiram Bunga & Sapaan AI Asy',
      description: 'Sebelum masuk kelas, ananda berjalan melintasi jalan setapak diiringi kupu-kupu. AI Asy hadir menyapa di dekat kolam koi sambil mengajak anak-anak bersyukur atas ciptaan Allah.',
      atmosphereNote: 'Suara gemercik air kolam dan harum Bunga Kamboja yang menenangkan.',
      childEmotion: 'Penasaran, gembira, dan bersemangat memulai aktivitas.',
      parentFeeling: 'Melatih kepekaan rasa dan kecintaan pada alam sekitar.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      colorTag: 'bg-teal-100 text-teal-900 border-teal-300'
    },
    {
      id: 'm4',
      time: '07.30 WIB',
      transportIcon: '🕌',
      transportTitle: 'Musholla Asy Syifa',
      title: 'Wudhu Mandiri & Sholat Dhuha Berjamaah',
      description: 'Ananda melepas sepatu mandiri di rak kayu, mengambil wudhu dengan bimbingan lembut, dan berbaris rapi di musholla untuk sholat Dhuha serta ikrar pagi.',
      atmosphereNote: 'Gema lantunan surah pendek Juz 30 berirama merdu.',
      childEmotion: 'Bangga bisa sholat dan berdoa bersama teman-teman.',
      parentFeeling: 'Ketenangan batin terbesar melihat anak terbiasa beribadah sejak dini.',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      colorTag: 'bg-sky-100 text-sky-900 border-sky-300'
    }
  ];

  const current = moments[selectedMoment];

  return (
    <section className="bg-gradient-to-br from-emerald-50 via-amber-50/70 to-teal-50 rounded-3xl p-6 sm:p-10 border-4 border-emerald-200 shadow-xl space-y-8 my-8 relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800 text-amber-300 font-black text-xs shadow-md border border-amber-300">
          <Trees className="w-4 h-4 text-amber-300" />
          Potret Pagi Asli Pedesaan • TK Asy Syifa Tanggul
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          Kehangatan Suasana Pagi Saat Ayah & Bunda Mengantar Ananda
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Bukan deretan mobil mewah di tengah kemacetan kota, melainkan senyuman hangat di tepi jalan desa yang asri, udara bersih persawahan, dan sapaan tulus para ustadzah.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {moments.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setSelectedMoment(idx)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-2 ${
              selectedMoment === idx
                ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-emerald-600'
                : 'bg-white text-stone-700 hover:bg-emerald-100/80 border border-stone-200'
            }`}
          >
            <span>{m.transportIcon}</span>
            <span>{m.transportTitle.split('&')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Spotlight Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Image & AI Asy Greeting */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-md group">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Time Badge Overlay */}
            <div className="absolute top-3 left-3 bg-emerald-900/90 text-amber-300 px-3 py-1 rounded-full text-xs font-black border border-emerald-400/50 shadow-xs flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-300" /> {current.time}
            </div>

            {/* Location Tag */}
            <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-amber-300" /> Pedesaan Tanggul, Jember
              </span>
              <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md">
                Lingkungan Asri
              </span>
            </div>
          </div>

          {/* AI Asy Mascot Mini Scene */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-12 shrink-0">
              <AIAsyCharacterRenderer state="wave" scale={0.7} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-black text-emerald-950">AI Asy • Karakter Sahabat Anak</p>
              <p className="text-[11px] text-emerald-800 italic leading-snug font-medium">
                "Setiap pagi Asy senang sekali berdiri dekat pintu gerbang menyapa teman-teman yang diantar naik motor bersama Ayah & Bunda!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Moment Narrative & Emotion */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${current.colorTag}`}>
              {current.transportTitle}
            </span>
            <span className="text-xs text-stone-500 font-bold">
              • Momen Kehidupan Pagi
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium bg-stone-50 p-4 rounded-2xl border border-stone-200">
            {current.description}
          </p>

          {/* Atmosphere & Emotional Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-emerald-600" /> Perasaan Anak:
              </span>
              <p className="text-xs text-emerald-950 font-extrabold leading-snug">
                {current.childEmotion}
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" /> Ketenangan Orang Tua:
              </span>
              <p className="text-xs text-amber-950 font-extrabold leading-snug">
                {current.parentFeeling}
              </p>
            </div>
          </div>

          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{current.atmosphereNote}</span>
          </div>
        </div>
      </div>

      {/* Gentle Bottom Callout */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-200">
        <p className="text-xs text-stone-700 font-bold text-center sm:text-left">
          Ingin merasakan kehangatan penyambutan pagi ini secara langsung bersama ananda?
        </p>
        {onTabChange && (
          <button
            onClick={() => onTabChange('w4')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            Daftar Observasi / Trial Class <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
