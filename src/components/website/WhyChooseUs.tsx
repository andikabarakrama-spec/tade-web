import React from 'react';
import { ShieldCheck, GraduationCap, HeartHandshake, Palette, Smartphone, Users, Sparkles, CheckCircle2, Heart, ArrowRight } from 'lucide-react';

interface StoryPillar {
  id: string;
  statementFrom: string;
  statementTo: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
  color: string;
}

export const WhyChooseUs: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const storyPillars: StoryPillar[] = [
    {
      id: 'sp1',
      statementFrom: 'Bukan sekadar tempat belajar membaca,',
      statementTo: 'tetapi tempat tumbuh rasa percaya diri & keberanian alami.',
      icon: <GraduationCap className="w-6 h-6 text-emerald-700" />,
      title: 'Kemandirian & Kepercayaan Diri',
      description: 'Di TK Asy Syifa, ananda tidak dituntut menghafal secara kaku. Melalui metoda Play-based & 5 Sentra PAUD, anak belajar mengambil keputusan, berekspresi, dan merasa bangga atas setiap karya kecilnya.',
      highlight: 'Ananda Berani Berbicara & Bersosialisasi',
      color: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
    },
    {
      id: 'sp2',
      statementFrom: 'Bukan sekadar menghafal ayat,',
      statementTo: 'tetapi menumbuhkan kecintaan yang mendalam pada Al-Qur’an.',
      icon: <HeartHandshake className="w-6 h-6 text-amber-700" />,
      title: 'Pembiasaan Karakter & Tahfidz Cilik',
      description: 'Hafalan Juz 30 dan doa harian tidak disampaikan dengan tekanan, melainkan melalui irama gembira, keteladanan ustadzah, dan kebiasaan wudhu serta sholat Dhuha bersama setiap pagi.',
      highlight: 'Al-Qur’an Menjadi Sahabat Karib Ananda',
      color: 'bg-amber-50/80 border-amber-200 text-amber-950',
    },
    {
      id: 'sp3',
      statementFrom: 'Bukan sekadar penitipan anak,',
      statementTo: 'tetapi rumah kedua yang aman, bersih, dan penuh kasih sayang.',
      icon: <ShieldCheck className="w-6 h-6 text-teal-700" />,
      title: 'Keamanan Lingkungan & Pengasuhan Tulus',
      description: 'Dengan pagar keliling tertutup, pemantauan CCTV 24 jam, lingkungan bebas asap rokok, dan rasio ideal 1 guru : 10 murid, Ayah & Bunda bisa beraktivitas dengan hati yang tenang.',
      highlight: 'Tenang Meninggalkan Anak Setiap Pagi',
      color: 'bg-teal-50/80 border-teal-200 text-teal-950',
    },
    {
      id: 'sp4',
      statementFrom: 'Bukan sekadar laporan berkala,',
      statementTo: 'tetapi koneksi nyata perkembangan ananda langsung di HP Ayah & Bunda.',
      icon: <Smartphone className="w-6 h-6 text-sky-700" />,
      title: 'Portal Digital SIM R29 Transparan',
      description: 'Orang tua dapat memantau jurnal harian, foto aktivitas, laporan presensi, hingga e-rapor perkembangan karakter tanpa rasa cemas dan tanpa perlu menunggu akhir semester.',
      highlight: 'Transparansi Penuh untuk Orang Tua',
      color: 'bg-sky-50/80 border-sky-200 text-sky-950',
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 my-8">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Kisah & Komitmen Pengasuhan
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          Mengapa Ayah & Bunda Memilih TK Asy Syifa?
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Pendidikan usia dini bukan tentang mempercepat anak menjadi dewasa, melainkan menjaga binar kebahagiaan dan menanamkan fondasi akhlak terbaik.
        </p>
      </div>

      {/* Grid Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storyPillars.map((p) => (
          <div
            key={p.id}
            className={`rounded-3xl p-6 sm:p-7 border shadow-2xs hover:shadow-md transition duration-300 space-y-4 flex flex-col justify-between ${p.color}`}
          >
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-2xl w-fit shadow-2xs border border-stone-200/80">
                {p.icon}
              </div>

              {/* Contrast Narrative */}
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-stone-500 italic">
                  "{p.statementFrom}"
                </p>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                  "{p.statementTo}"
                </p>
              </div>

              <h3 className="font-extrabold text-xs uppercase tracking-wider text-emerald-800 pt-1">
                {p.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {p.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-extrabold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {p.highlight}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gentle Section Invitation */}
      <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm sm:text-base text-amber-300 flex items-center justify-center sm:justify-start gap-2">
            <Heart className="w-4 h-4 fill-amber-300 text-amber-300" /> Rasakan Suasana Sekolah Secara Langsung
          </h4>
          <p className="text-xs text-emerald-100 font-medium">
            Yuk, datang berkunjung dan lihat betapa bahagianya senyum siswa cilik kami di TK Asy Syifa Tanggul.
          </p>
        </div>
        {onTabChange && (
          <button
            onClick={() => onTabChange('w5')}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
          >
            Jadwalkan Kunjungan <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
