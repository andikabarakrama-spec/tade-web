import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Quote, MessageSquare } from 'lucide-react';

interface ParentLetter {
  id: string;
  sender: string;
  childInfo: string;
  salutation: string;
  letterBody: string;
  highlight: string;
  date: string;
}

export const TestimonialWall: React.FC = () => {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  const letters: ParentLetter[] = [
    {
      id: 'l1',
      sender: 'Bunda Rahmatia & Ayah Lukman',
      childInfo: 'Orang Tua Ananda Zaidan (Kelompok B1)',
      salutation: 'Kepada Yth. Ibu Kepala Sekolah & Ustadzah TK Asy Syifa Tanggul,',
      letterBody: 'Assalamu’alaikum Wr. Wb. Rasa syukur tak terhingga kami panjatkan kepada Allah SWT atas bimbingan tulus ustadzah sekalian. Dalam 3 bulan pertama, Zaidan yang tadinya enggan bangun pagi, kini justru bersemangat menuju sekolah setiap hari. Hafalan Surah An-Naba dan pembiasaan sholat Dhuha-nya sungguh menyentuh hati kami di rumah.',
      highlight: 'Ananda Bersemangat Sekolah & Rajin Sholat Dhuha',
      date: 'Tanggul, Jember'
    },
    {
      id: 'l2',
      sender: 'Bunda Dr. Ahmad & Kirana',
      childInfo: 'Orang Tua Ananda Fatimah (Kelompok A1)',
      salutation: 'Untuk Ustadzah Pembimbing yang Penuh Kesabaran,',
      letterBody: 'Sebagai orang tua yang bekerja, keamanan dan gizi anak di sekolah adalah perhatian utama kami. Terima kasih telah menjaga Fatimah dengan kehangatan seperti ibu sendiri. Fatimah yang semula sangat pemalu, sekarang sudah berani tampil bernyanyi dan menyapa teman-temannya dengan ceria.',
      highlight: 'Pengasuhan Penuh Kasih Sayang & Lingkungan Sangat Bersih',
      date: 'Tanggul, Jember'
    },
    {
      id: 'l3',
      sender: 'Ayah Ustadz H. Abdullah',
      childInfo: 'Orang Tua Ananda Umar (Kelompok A2)',
      salutation: 'Assalamu’alaikum Warahmatullahi Wabarakatuh,',
      letterBody: 'Kombinasi Kurikulum Merdeka dan pembentukan adab Islami di TK Asy Syifa terbukti nyata. Umar tidak hanya belajar mengenal huruf, tetapi juga paham adab makan, wudhu mandiri, dan menghormati sesama. Portal SIM R29 juga mempermudah kami memantau rapor dan jurnal harian.',
      highlight: 'Perpaduan Kurikulum Merdeka & Adab Islami yang Seimbang',
      date: 'Tanggul, Jember'
    }
  ];

  const handleLike = (id: string) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 my-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
          <Mail className="w-3.5 h-3.5 text-emerald-700" />
          Surat Singkat Dari Ayah & Bunda
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Ungkapan Hati & Bisikan Syukur Orang Tua
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Kutipan surat jujur dari para orang tua yang telah mengamanahkan pendidikan putra-putrinya bersama TK Asy Syifa Tanggul.
        </p>
      </div>

      {/* Parent Letters Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {letters.map((letItem) => {
          const extraLikes = likesMap[letItem.id] || 0;
          return (
            <div
              key={letItem.id}
              className="bg-amber-50/60 rounded-3xl p-6 border-2 border-amber-200/80 shadow-xs hover:shadow-md transition duration-300 space-y-4 relative flex flex-col justify-between"
            >
              {/* Paper Stamp / Tape Accent */}
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-amber-200 text-amber-950 text-[10px] font-black rounded-md border border-amber-300 rotate-[-1deg] shadow-2xs">
                {letItem.date}
              </div>

              <div className="space-y-3 pt-2">
                <span className="inline-block text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {letItem.highlight}
                </span>

                <p className="text-xs font-bold text-slate-800 italic">
                  "{letItem.salutation}"
                </p>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  "{letItem.letterBody}"
                </p>
              </div>

              {/* Bottom Parent Signature */}
              <div className="pt-4 border-t border-amber-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{letItem.sender}</h4>
                  <p className="text-[10px] text-stone-500 font-medium">
                    {letItem.childInfo}
                  </p>
                </div>

                <button
                  onClick={() => handleLike(letItem.id)}
                  className="flex items-center gap-1.5 text-xs font-extrabold bg-white hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:text-rose-600 transition cursor-pointer"
                  title="Doa & Apresiasi Orang Tua"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{12 + extraLikes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
