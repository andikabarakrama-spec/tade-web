import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Heart, BookOpen, MessageSquare, Sparkles, PhoneCall } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  highlight?: string;
}

export const ParentFAQSection: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [openId, setOpenId] = useState<string>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'Keamanan & Lingkungan',
      question: 'Apakah lingkungan sekolah aman bagi anak yang baru pertama kali terpisah dari orang tua?',
      answer: 'Sangat aman. TK Asy Syifa Tanggul dilengkapi pagar keliling tertutup, CCTV 24 jam, area bermain outdoor berstandar keamanan tinggi, dan bebas asap rokok. Di minggu-minggu awal, ustadzah memberikan pendampingan emosional ekstra agar ananda merasa tenang dan terlindungi.',
      highlight: 'Sistem Keamanan CCTV & Pengasuhan Bebas Cemas'
    },
    {
      id: 'faq-2',
      category: 'Keamanan & Lingkungan',
      question: 'Bagaimana jika anak saya tipe yang pemalu atau belum pernah ikut sekolah formal?',
      answer: 'Itu adalah hal yang sangat wajar bagi anak usia dini. Para ustadzah kami yang berijazah S.Pd.AUD berpengalaman dalam membimbing transisi emosional anak secara perlahan tanpa pemaksaan. Kami menggunakan pendekatan kasih sayang (heart-to-heart approach) sampai anak dengan sendirinya merasa nyaman dan ceria.',
      highlight: 'Pendampingan Individual Berbasis Kasih Sayang'
    },
    {
      id: 'faq-3',
      category: 'Kurikulum & Akhlak',
      question: 'Bagaimana keseimbangan antara pelajaran umum (baca/tulis) dan hafalan Qur’an?',
      answer: 'Kami memadukan Kurikulum Merdeka PAUD berbasis bermain (Play-based Learning) dengan pembiasaan karakter Islami. Pelajaran calistung diajarkan melalui permainan sentra tanpa beban, sementara hafalan Qur’an (Juz 30) dan doa harian dipraktikkan secara konsisten setiap pagi dengan irama gembira.',
      highlight: 'Bukan Pemaksaan, Tetapi Pembiasaan yang Menyenangkan'
    },
    {
      id: 'faq-4',
      category: 'Kurikulum & Akhlak',
      question: 'Apakah ananda diajarkan wudhu dan sholat sejak usia dini?',
      answer: 'Ya. Pembiasaan wudhu mandiri dan sholat Dhuha berjamaah dilakukan setiap hari di musholla sekolah dengan panduan ramah anak. Ananda belajar mempraktikkan gerakan ibadah dengan bangga dan rasa senang.',
      highlight: 'Latihan Wudhu & Sholat Dhuha Berjamaah Harian'
    },
    {
      id: 'faq-5',
      category: 'Komunikasi Orang Tua',
      question: 'Bagaimana saya mengetahui perkembangan dan kegiatan harian anak di sekolah?',
      answer: 'Orang tua mendapatkan akses ke Portal Digital SIM R29. Melalui portal ini, Ayah & Bunda bisa melihat laporan kebiasaan harian, foto kegiatan, jurnal perkembangan anak, hingga e-rapor dan pemberitahuan resmi sekolah dari mana saja.',
      highlight: 'Pantau Perkembangan Anak Secara Transparan dari HP'
    },
    {
      id: 'faq-6',
      category: 'PPDB & Pendaftaran',
      question: 'Bagaimana alur pendaftaran PPDB dan berapa kuota yang tersedia?',
      answer: 'Pendaftaran PPDB Online dapat dilakukan langsung melalui Website Portal ini dalam hitungan menit. Setelah mengisi formulir singkat, Ayah & Bunda akan dihubungi oleh Panitia PPDB untuk jadwal pemetaan perkembangan gembira (tanpa tes calistung berat). Kuota murid dibatasi agar rasio kelas tetap ideal (1 guru : 10 murid).',
      highlight: 'Proses Pendaftaran Cepat, Ramah & Tanpa Mendorong Stres Anak'
    }
  ];

  const categories = ['Semua', 'Keamanan & Lingkungan', 'Kurikulum & Akhlak', 'Komunikasi Orang Tua', 'PPDB & Pendaftaran'];

  const filteredFaqs = activeCategory === 'Semua' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 my-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs border border-emerald-200">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          Pertanyaan Ringan Ayah & Bunda
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Menjawab Keraguan Sebelum Memilih Sekolah
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Kami memahami setiap kekhawatiran orang tua ketika melepas buah hati ke jenjang sekolah pertama. Berikut adalah beberapa jawaban jujur dari tim pengasuh TK Asy Syifa.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? '' : item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs ${isOpen ? 'bg-emerald-800 text-amber-300' : 'bg-stone-200 text-stone-600'}`}>
                    ?
                  </div>
                  <span>{item.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-800' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-emerald-100">
                  <p>{item.answer}</p>
                  {item.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      {item.highlight}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Soft CTA */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 max-w-2xl mx-auto text-center space-y-2">
        <p className="text-xs sm:text-sm font-bold text-amber-950">
          Masih ada pertanyaan lain yang ingin Ayah & Bunda diskusikan secara langsung?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20TK%20Asy%20Syifa,%20saya%20ingin%20bertanya%20seputar%20sekolah"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Chat Langsung dengan Ibu Guru
          </a>
          {onTabChange && (
            <button
              onClick={() => onTabChange('w4')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition cursor-pointer"
            >
              Lihat Informasi PPDB Online
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
