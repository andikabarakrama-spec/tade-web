import React, { useState } from 'react';
import { 
  Sparkles, Compass, Clock, Heart, BookOpen, Volume2, 
  Check, Bell, Shield, Calendar, Sun, Moon, Star
} from 'lucide-react';
import { useLivingGarden } from '../../context/LivingGardenContext';

export const IslamicExperienceEngine: React.FC = () => {
  const { getHijriDate, getPrayerTimes } = useLivingGarden();
  const hijriDate = getHijriDate();
  const prayerTimes = getPrayerTimes();

  const [activeDoaIndex, setActiveDoaIndex] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const doaList = [
    {
      title: 'Doa Sebelum Belajar',
      arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
      latin: 'Rabbi zidnii \'ilman warzuqnii fahman',
      meaning: 'Ya Allah, tambahkanlah aku ilmu dan berilah aku pemahaman yang baik.'
    },
    {
      title: 'Doa Untuk Kedua Orang Tua',
      arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      latin: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa',
      meaning: 'Ya Allah, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka sebagaimana mereka merawatku sewaktu kecil.'
    },
    {
      title: 'Doa Kebaikan Dunia Akhirat',
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      latin: 'Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa \'adzaaban-naar',
      meaning: 'Ya Allah, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa neraka.'
    }
  ];

  const activeDoa = doaList[activeDoaIndex];

  const handleToggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <section className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 text-amber-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-400/90 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Top Islamic Atmosphere Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕌</span>
            <div>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md">
                JUM'AT MUBAROK • TANGGUL JEMBER
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight mt-0.5">
                Suasana Islami & Doa Harian Ananda
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-amber-200">
            <span className="bg-emerald-900/90 border border-amber-400/50 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{hijriDate}</span>
            </span>
            <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-xl flex items-center gap-1.5 font-black shadow-xs">
              <Compass className="w-3.5 h-3.5 text-slate-950" />
              <span>Jadwal Sholat Tanggul Verified</span>
            </span>
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {prayerTimes.map((p, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-2xl border text-center transition ${
                p.active
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg font-black ring-2 ring-amber-300'
                  : 'bg-emerald-900/70 text-amber-100 border-emerald-700/60 font-semibold'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider block opacity-90">{p.name}</span>
              <span className="text-sm font-black mt-0.5 block">{p.time} WIB</span>
              {p.active && (
                <span className="inline-block mt-1 bg-slate-950 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full">
                  Waktu Sekarang
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Doa Harian Reader */}
        <div className="bg-amber-50 text-slate-900 rounded-2xl p-5 sm:p-6 border-2 border-amber-300 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                Doa Harian Anak Sholeh TK Asy Syifa
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {doaList.map((d, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDoaIndex(index)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                    activeDoaIndex === index
                      ? 'bg-emerald-800 text-amber-300 shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Doa {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <h3 className="text-base font-black text-slate-900">{activeDoa.title}</h3>
            
            {/* Arabic Font Text */}
            <div className="p-4 bg-emerald-900 text-amber-200 rounded-2xl text-xl sm:text-2xl font-serif text-center leading-loose tracking-wide shadow-inner">
              {activeDoa.arabic}
            </div>

            <p className="text-xs font-bold text-emerald-900 italic">
              "{activeDoa.latin}"
            </p>

            <p className="text-xs text-stone-700 font-medium">
              <span className="font-bold text-slate-900">Artinya: </span>
              {activeDoa.meaning}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
