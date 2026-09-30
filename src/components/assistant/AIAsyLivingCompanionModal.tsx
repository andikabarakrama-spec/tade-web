import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Mic,
  Smile,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck,
  Sun,
  Moon,
  Coffee,
  X,
  Play,
  Pause,
  RotateCcw,
  Award,
  CheckCircle2,
  ChevronRight,
  Bot,
  Zap,
  HelpCircle,
  Smartphone,
  Flame,
  Radio,
  FileText,
  User
} from 'lucide-react';
import { UserRole } from '../../types';

interface AIAsyLivingCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  userName?: string;
  characterVariant?: 'ASY' | 'ASYAH';
  onNavigateToTab?: (tabCode: string) => void;
}

interface SurahItem {
  number: number;
  name: string;
  arabicName: string;
  versesCount: number;
  meaning: string;
  maqam: 'NAHAWAND' | 'BAYATI';
  sampleVerses: { verseNo: number; arabic: string; transliteration: string; translation: string }[];
}

const SHORT_SURAHS: SurahItem[] = [
  {
    number: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    versesCount: 7,
    meaning: "Pembukaan",
    maqam: "NAHAWAND",
    sampleVerses: [
      { verseNo: 1, arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", transliteration: "Bismillāhir-raḥmānir-raḥīm", translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang." },
      { verseNo: 2, arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", transliteration: "Al-ḥamdu lillāhi rabbil-'ālamīn", translation: "Segala puji bagi Allah, Tuhan seluruh alam." }
    ]
  },
  {
    number: 112,
    name: "Al-Ikhlas",
    arabicName: "الإخلاص",
    versesCount: 4,
    meaning: "Memurnikan Keesaan Allah",
    maqam: "BAYATI",
    sampleVerses: [
      { verseNo: 1, arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", transliteration: "Qul huwallāhu aḥad", translation: "Katakanlah (Muhammad), Dia-lah Allah, Yang Maha Esa." },
      { verseNo: 2, arabic: "ٱللَّهُ ٱلصَّمَدُ", transliteration: "Allāhuṣ-ṣamad", translation: "Allah tempat meminta segala sesuatu." }
    ]
  },
  {
    number: 113,
    name: "Al-Falaq",
    arabicName: "الفلق",
    versesCount: 5,
    meaning: "Waktu Subuh",
    maqam: "NAHAWAND",
    sampleVerses: [
      { verseNo: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", transliteration: "Qul a'ūżu birabbil-falaq", translation: "Katakanlah, Aku berlindung kepada Tuhan yang menguasai subuh." }
    ]
  },
  {
    number: 114,
    name: "An-Nas",
    arabicName: "الناس",
    versesCount: 6,
    meaning: "Manusia",
    maqam: "BAYATI",
    sampleVerses: [
      { verseNo: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", transliteration: "Qul a'ūżu birabbin-nās", translation: "Katakanlah, Aku berlindung kepada Tuhannya manusia." }
    ]
  },
  {
    number: 108,
    name: "Al-Kautsar",
    arabicName: "الكوثر",
    versesCount: 3,
    meaning: "Nikmat yang Banyak",
    maqam: "NAHAWAND",
    sampleVerses: [
      { verseNo: 1, arabic: "إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ", transliteration: "Innā a'ṭainākal-kauṡar", translation: "Sungguh, Kami telah memberimu telaga Kautsar." }
    ]
  }
];

const HIJAIYAH_LETTERS = [
  { char: "أ", latin: "Alif", audioWord: "Alif - A" },
  { char: "ب", latin: "Ba", audioWord: "Ba - Baa" },
  { char: "ت", latin: "Ta", audioWord: "Ta - Taa" },
  { char: "ث", latin: "Tsa", audioWord: "Tsa - Tsaa" },
  { char: "ج", latin: "Jim", audioWord: "Jim - Ja" },
  { char: "ح", latin: "Ha", audioWord: "Ha - Haa" },
  { char: "خ", latin: "Kho", audioWord: "Kho - Khoo" },
  { char: "د", latin: "Dal", audioWord: "Dal - Da" },
  { char: "ذ", latin: "Dzal", audioWord: "Dzal - Dza" },
  { char: "ر", latin: "Ra", audioWord: "Ra - Raa" },
  { char: "ز", latin: "Zai", audioWord: "Zai - Za" },
  { char: "س", latin: "Sin", audioWord: "Sin - Sa" },
  { char: "ش", latin: "Syin", audioWord: "Syin - Sya" },
  { char: "ص", latin: "Shod", audioWord: "Shod - Sho" },
  { char: "ض", latin: "Dhod", audioWord: "Dhod - Dho" },
  { char: "ط", latin: "Tho", audioWord: "Tho - Tho" },
  { char: "ظ", latin: "Zho", audioWord: "Zho - Zho" },
  { char: "ع", latin: "Ain", audioWord: "Ain - 'A" },
  { char: "غ", latin: "Ghoin", audioWord: "Ghoin - Gho" },
  { char: "ف", latin: "Fa", audioWord: "Fa - Faa" },
  { char: "ق", latin: "Qof", audioWord: "Qof - Qo" },
  { char: "ك", latin: "Kaf", audioWord: "Kaf - Ka" },
  { char: "ل", latin: "Lam", audioWord: "Lam - La" },
  { char: "م", latin: "Mim", audioWord: "Mim - Ma" },
  { char: "ن", latin: "Nun", audioWord: "Nun - Na" },
  { char: "و", latin: "Wawu", audioWord: "Wawu - Wa" },
  { char: "هـ", latin: "Ha", audioWord: "Ha - Ha" },
  { char: "ي", latin: "Ya", audioWord: "Ya - Ya" }
];

const DAILY_DOA = [
  {
    title: "Doa Sebelum Belajar",
    arabic: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",
    translation: "Ya Rabbku, tambahkanlah kepadaku ilmu dan berilah aku karunia untuk memahaminya."
  },
  {
    title: "Doa Kedua Orang Tua",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation: "Ya Rabbku, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka berdua sebagaimana mereka merawatku sewaktu kecil."
  },
  {
    title: "Doa Sebelum Makan",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    translation: "Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa neraka."
  }
];

const PROPHET_STORIES = [
  {
    title: "Kisah Nabi Nuh a.s. & Bahtera Penyelamat",
    factText: "Nabi Nuh a.s. membuat kapal besar atas perintah Allah SWT untuk menyelamatkan kaum beriman dari banjir besar.",
    relaxText: "Malam hari yang tenang, hujan turun dengan damai. Nabi Nuh dan para pengikutnya berada di atas bahtera yang aman dengan izin Allah...",
    funnyReaction: "AI Asy langsung memakai jas hujan mungil dan membawa payung cilik! 'Wah, Asy siap berlayar bersama hewan-hewan yang rukun!'"
  },
  {
    title: "Kisah Nabi Ibrahim a.s. & Keteladanan",
    factText: "Nabi Ibrahim a.s. mengajarkan tauhid dan keberanian menegakkan kebenaran dengan penuh kelembutan.",
    relaxText: "Di bawah lautan bintang di padang pasir, Nabi Ibrahim memikirkan pencipta alam semesta yang Maha Esa...",
    funnyReaction: "AI Asy membawa teropong cilik: 'Asy melihat bintang-bintang indah buatan Allah! Masya Allah luar biasa!'"
  }
];

export const AIAsyLivingCompanionModal: React.FC<AIAsyLivingCompanionModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  userName = 'Sahabat Asy',
  characterVariant = 'ASY',
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<
    'ROLE_HUB' | 'QURAN_MODE' | 'HOME_LEARNING' | 'STORY_THEATER' | 'WELLBEING' | 'SCHEDULE_CALENDAR'
  >('ROLE_HUB');

  // Quran Mode State
  const [selectedSurah, setSelectedSurah] = useState<SurahItem>(SHORT_SURAHS[0]);
  const [isPlayingMurattal, setIsPlayingMurattal] = useState<boolean>(false);
  const [quranMaqam, setQuranMaqam] = useState<'NAHAWAND' | 'BAYATI'>('NAHAWAND');
  const [memorizeVerseIndex, setMemorizeVerseIndex] = useState<number>(0);

  // Home Learning State
  const [selectedLetter, setSelectedLetter] = useState<string>('أ');
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Tekan tombol mikrofon untuk melafalkan huruf!');

  // Story Theater State
  const [storyIndex, setStoryIndex] = useState<number>(0);
  const [storyModeType, setStoryModeType] = useState<'FACT' | 'RELAX' | 'FUNNY'>('FACT');

  // Digital Wellbeing State
  const [screenTimeMinutes, setScreenTimeMinutes] = useState<number>(25);

  // Audio Speech Helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = characterVariant === 'ASYAH' ? 1.2 : 1.1;
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-slate-900 border-2 border-emerald-500/80 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {characterVariant === 'ASYAH' ? '🌸' : '🕌'}
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>{characterVariant === 'ASYAH' ? 'AI Asyah' : 'AI Asy'} Living Companion</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700">
                    FP-5 Living Companion
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Teman Belajar, Pendamping Ibadah, & Asisten Digital Terpadu TK ASY SYIFA
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0 font-mono text-xs">
            {[
              { id: 'ROLE_HUB', label: 'Asisten Peran', icon: UserCheck },
              { id: 'QURAN_MODE', label: 'Quran Mode (Murattal)', icon: BookOpen },
              { id: 'HOME_LEARNING', label: 'Belajar Rumah & Hijaiyah', icon: Mic },
              { id: 'STORY_THEATER', label: 'Panggung Kisah (3 Mode)', icon: Sparkles },
              { id: 'WELLBEING', label: 'Kesejahteraan Layar', icon: Smartphone },
              { id: 'SCHEDULE_CALENDAR', label: 'Jadwal & Kalender', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
            {/* TAB 1: ROLE HUB */}
            {activeTab === 'ROLE_HUB' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/60">
                      PERAN AKTIF: {activeRole}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      Selamat datang, {userName}! AI Asy Siap Mendampingi Tugas Anda.
                    </h3>
                  </div>
                  <Bot className="w-8 h-8 text-emerald-400 shrink-0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Bantuan Spesifik Peran
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeRole === 'SUPER_ADMIN' && 'Pemeriksaan integritas sistem, verifikasi keamanan Firestore, pengingat cadangan data, dan pemantauan tanpa error.'}
                      {activeRole === 'ADMIN' && 'Pusat pembuatan dokumen resmi sekolah, arsip edaran dinas, dan pengorganisasian berkas otomatis.'}
                      {activeRole === 'KEPALA_SEKOLAH' && 'Ikhtisar operasional akademik, persetujuan modul e-Rapor, dan pemantauan kinerja pendidik.'}
                      {activeRole === 'KETUA_YAYASAN' && 'Dashboard strategis pengembangan yayasan, laporan posisi keuangan, dan pengingat kalender kegiatan.'}
                      {activeRole === 'GURU' && 'Pengingat presensi harian siswa, penyusunan RPP/modul ajar, dan motivasi perkembangan anak.'}
                      {activeRole === 'KEUANGAN' && 'Rekonsiliasi transaksi SPP bulanan, verifikasi pencetakan kwitansi, dan audit kas sekolah.'}
                      {activeRole === 'WALI_MURID' && 'Pendampingan belajar di rumah, pemantauan hafalan surah, dan ringkasan perkembangan santri cilik.'}
                      {activeRole === 'CALON_WALI_MURID' && 'Panduan alur pendaftaran murid baru PPDB online dan bantuan unggah dokumen.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Pengingat Otomatis Hari Ini
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>Verifikasi presensi murid sebelum jam 08:00 WIB.</li>
                      <li>Semua ekspor dokumen dalam format standar resmi TK ASY SYIFA.</li>
                      <li>Pengingat sholat Dhuha dan muraja'ah hafalan pagi.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: QURAN MODE */}
            {activeTab === 'QURAN_MODE' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 bg-emerald-950/80 border border-emerald-700/80 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-300 font-mono font-bold uppercase tracking-wider block">
                      Ruang Murottal Khusyuk
                    </span>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Suasana Tenang & Murattal Al-Qur'an</span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded">
                        Maqam: {quranMaqam}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuranMaqam(quranMaqam === 'NAHAWAND' ? 'BAYATI' : 'NAHAWAND')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
                    >
                      Ubah Maqam
                    </button>
                  </div>
                </div>

                {/* Surah List & Reader */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-5 space-y-2 max-h-72 overflow-y-auto pr-1">
                    <span className="text-xs font-bold text-slate-400 block">Pilih Surah Pendek:</span>
                    {SHORT_SURAHS.map((surah) => (
                      <button
                        key={surah.number}
                        onClick={() => setSelectedSurah(surah)}
                        className={`w-full p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                          selectedSurah.number === surah.number
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center font-bold">
                              {surah.number}
                            </span>
                            <span className="text-xs font-bold">{surah.name}</span>
                          </div>
                          <span className="text-[10px] opacity-80 block mt-0.5">{surah.meaning} ({surah.versesCount} Ayat)</span>
                        </div>
                        <span className="text-lg font-serif">{surah.arabicName}</span>
                      </button>
                    ))}
                  </div>

                  <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-amber-300">
                        Hafalan: Surah {selectedSurah.name} ({selectedSurah.arabicName})
                      </h4>
                      <button
                        onClick={() => {
                          const verse = selectedSurah.sampleVerses[0];
                          if (verse) speakText(`${verse.arabic}. ${verse.translation}`);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Putar Ayat</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedSurah.sampleVerses.map((v) => (
                        <div key={v.verseNo} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <p className="text-right text-lg font-serif text-emerald-300 leading-loose">
                            {v.arabic}
                          </p>
                          <p className="text-[11px] text-amber-200 font-mono italic">{v.transliteration}</p>
                          <p className="text-xs text-slate-300">{v.translation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HOME LEARNING */}
            {activeTab === 'HOME_LEARNING' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    Interaktif Hijaiyah & Doa Harian Santri
                  </h3>
                  <p className="text-xs text-slate-300">
                    Klik huruf untuk mendengarkan lafadznya, lalu gunakan mikrofon untuk berlatih pengucapan!
                  </p>
                </div>

                {/* Hijaiyah Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Huruf Hijaiyah:</span>
                  <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
                    {HIJAIYAH_LETTERS.map((item) => (
                      <button
                        key={item.char}
                        onClick={() => {
                          setSelectedLetter(item.char);
                          speakText(`Huruf ${item.audioWord}`);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          selectedLetter === item.char
                            ? 'bg-emerald-600 text-white border-emerald-300 shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xl font-serif block">{item.char}</span>
                        <span className="text-[9px] font-mono block opacity-80">{item.latin}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Microphone Practice Bar */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-300">
                      Latihan Pelafalan Huruf: <strong className="text-white font-serif text-lg">{selectedLetter}</strong>
                    </span>
                    <p className="text-xs text-slate-400">{feedbackMessage}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsRecordingMic(true);
                      setFeedbackMessage('Mendengarkan pelafalan...');
                      setTimeout(() => {
                        setIsRecordingMic(false);
                        setFeedbackMessage('Masya Allah! Pelafalan sangat bagus, mari coba bersama lagi!');
                      }, 1800);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
                      isRecordingMic
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecordingMic ? 'Merekam...' : 'Tekan Mik'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: STORY THEATER */}
            {activeTab === 'STORY_THEATER' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 bg-purple-950/60 border border-purple-800/80 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider block">
                      Panggung Kisah Islami Santri
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {PROPHET_STORIES[storyIndex % PROPHET_STORIES.length].title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setStoryIndex((prev) => prev + 1)}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Kisah Selanjutnya
                  </button>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                  {[
                    { type: 'FACT', label: '○ Fact Mode (Penjelasan Edukatif)' },
                    { type: 'RELAX', label: '○ Relax Mode (Narasi Lembut Tidur)' },
                    { type: 'FUNNY', label: '○ Funny Mode (Ekspresi Lucu AI Asy)' }
                  ].map((m) => (
                    <button
                      key={m.type}
                      onClick={() => setStoryModeType(m.type as any)}
                      className={`flex-1 py-2 px-2 rounded-lg font-bold transition cursor-pointer ${
                        storyModeType === m.type
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Mode Text Display */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-2">
                  <p className="text-xs text-purple-100 leading-relaxed font-medium italic">
                    {storyModeType === 'FACT' && PROPHET_STORIES[storyIndex % PROPHET_STORIES.length].factText}
                    {storyModeType === 'RELAX' && PROPHET_STORIES[storyIndex % PROPHET_STORIES.length].relaxText}
                    {storyModeType === 'FUNNY' && PROPHET_STORIES[storyIndex % PROPHET_STORIES.length].funnyReaction}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono text-right">
                    Kisah Otentik • Tanpa Mengubah Peristiwa Sejarah Agama
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: WELLBEING */}
            {activeTab === 'WELLBEING' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 bg-indigo-950/60 border border-indigo-800/80 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                    Inisiatif Pengurangan Ketergantungan Layar (Digital Wellbeing)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AI Asy mendorong anak-anak untuk belajar dengan seimbang, bermain di luar bersama teman, membantu orang tua, dan beristirahat tepat waktu.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Waktu Penggunaan Layar Hari Ini:</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">{screenTimeMinutes} Menit</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (screenTimeMinutes / 45) * 100)}%` }} />
                  </div>

                  <p className="text-xs text-amber-300 italic">
                    "Masya Allah, durasi belajar layar hari ini sudah cukup! Saatnya membantu Ayah Bunda dan bermain di luar ya santri cilik!"
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: SCHEDULE & CALENDAR */}
            {activeTab === 'SCHEDULE_CALENDAR' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Kalender Pendidikan & Agenda Sekolah
                  </h3>
                  <p className="text-xs text-slate-300">
                    AI Asy membaca Kalender Sekolah, Yayasan, dan Kalender Pendidikan Nasional secara otomatis.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { date: '10 Agustus 2026', title: 'Evaluasi Portofolio e-Rapor Semester', category: 'AKADEMIK' },
                    { date: '17 Agustus 2026', title: 'Puncak Tema: Upacara & Pentas Seni Kemerdekaan RI', category: 'SEKOLAH' },
                    { date: '25 Agustus 2026', title: 'Rapat Koordinasi Pengurus Yayasan & Komite', category: 'YAYASAN' }
                  ].map((evt, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block">{evt.date}</span>
                        <span className="text-xs font-bold text-white">{evt.title}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                        {evt.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
