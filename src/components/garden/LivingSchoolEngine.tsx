import React, { useState } from 'react';
import { 
  Sparkles, Camera, Award, CheckCircle2, AlertCircle, RefreshCw, 
  BookOpen, Calendar, Image as ImageIcon, Zap, Sliders, ShieldCheck, 
  Flame, Heart, Feather, Layers, Eye, Send, Check, Star, Sun, Moon, 
  Compass, ArrowRight, CheckCheck, UploadCloud
} from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

export interface MemoryStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  day: string;
  photoUrl: string;
  category: string;
  tags: string[];
  freshnessTag: string;
  featuredWeek?: boolean;
  featuredMonth?: boolean;
  qualityScore: number;
}

export const LivingSchoolEngine: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  // Active Tab inside Living School Engine Dashboard
  const [activeTab, setActiveTab] = useState<'mission' | 'photo_ai' | 'story_ai' | 'timeline' | 'season' | 'cms_control'>('mission');

  // Freshness Score State
  const [lastUpdateDaysAgo, setLastUpdateDaysAgo] = useState<number>(0);
  const [activityPoints, setActivityPoints] = useState<number>(185);
  const [isMissionCompleted, setIsMissionCompleted] = useState<boolean>(false);

  // Photo Quality AI State
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800'
  );
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState<boolean>(false);
  const [photoAnalysis, setPhotoAnalysis] = useState({
    sharpness: 94,
    lighting: 88,
    composition: 92,
    resolution: '2048 x 1536 px (HD)',
    orientation: 'Lanskap',
    noise: 'Sangat Rendah',
    aiAdvice: 'Pencahayaan sangat alami dan ekspresi anak terlihat sangat ceria. Siap dipublikasikan!'
  });

  // AI Story Writer State
  const [briefInput, setBriefInput] = useState<string>('Anak-anak kelompok A belajar menanam biji kacang hijau di kebun sekolah.');
  const [generatedTitle, setGeneratedTitle] = useState<string>('Tangan-Tangan Mungil Menanam Benih Kebajikan di Kebun TK Asy Syifa');
  const [generatedSummary, setGeneratedSummary] = useState<string>(
    'Anak-anak belajar mengenal kebesaran Allah melalui tanaman. Dengan antusias, mereka menyiram tanah dan meletakkan biji kacang hijau.'
  );
  const [generatedContent, setGeneratedContent] = useState<string>(
    'Pagi ini di bawah naungan pohon kamboja dan udara sejuk pedesaan Tanggul, anak-anak kelompok A berkumpul di Kebun Edukasi Asy Syifa. Didampingi Ibu Guru, mereka memegang cangkul cilik dan menyiram benih dengan lembut. Kegiatan ini menumbuhkan rasa syukur, kesabaran, dan kecintaan pada alam ciptaan Allah SWT.'
  );
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string>('');

  // Season Engine Active Theme
  const [activeSeason, setActiveSeason] = useState<string>('normal');

  // Memory Timeline Stories List
  const [memoryStories, setMemoryStories] = useState<MemoryStory[]>([
    {
      id: 'mem-1',
      title: 'Keceriaan Menyiram Bunga Kamboja & Berdoa Pagi',
      summary: 'Ananda diajak mengenali keindahan tanaman ciptaan Allah sambil belajar disiplin dan kebersihan.',
      content: 'Suasana pagi di halaman TK Asy Syifa terasa sangat sejuk. Anak-anak dengan gembira mengambil gembor air dan menyiram Bunga Kamboja di taman sekolah.',
      date: 'Hari ini, 07:30 WIB',
      day: 'Jumat',
      photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      category: 'Karakter & Alam',
      tags: ['Cinta Alam', 'Karakter Islami', 'Kegiatan Pagi'],
      freshnessTag: 'Terbaru',
      featuredWeek: true,
      featuredMonth: true,
      qualityScore: 96
    },
    {
      id: 'mem-2',
      title: 'Sentra Balok: Membangun Masjid Tanggul Impian',
      summary: 'Anak-anak melatih imajinasi, kolaborasi, dan matematika spasial dengan susunan balok kayu.',
      content: 'Di ruang Sentra Balok, kelompok B saling bekerjasama menyusun menara dan kubah masjid. Terlihat senyum bangga saat bangunan masjid cilik mereka berdiri kokoh.',
      date: 'Kemarin, 09:15 WIB',
      day: 'Kamis',
      photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      category: 'Sentra Balok',
      tags: ['Motorik Halus', 'Kerjasama', 'Kreativitas'],
      freshnessTag: '2 Hari Lalu',
      featuredWeek: true,
      featuredMonth: false,
      qualityScore: 92
    },
    {
      id: 'mem-3',
      title: 'Sholat Dhuha Berjamaah & Murojaah Surah An-Naba',
      summary: 'Melatih kekhusyukan dan kelancaran hafalan Juz 30 dalam suasana penuh keberkahan.',
      content: 'Ananda berbaris rapi di atas sajadah di Musholla Asy Syifa. Didampingi Ustadzah, suara jernih anak-anak melantunkan ayat suci Al-Qur\'an.',
      date: '3 Hari Lalu',
      day: 'Rabu',
      photoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      category: 'Tahfidz & Ibadah',
      tags: ['Tahfidz Cilik', 'Sholat Dhuha', 'Adab Islami'],
      freshnessTag: 'Pekan Ini',
      featuredWeek: false,
      featuredMonth: true,
      qualityScore: 95
    }
  ]);

  // Calculate Freshness Score
  const calculateFreshnessScore = () => {
    let score = 100 - (lastUpdateDaysAgo * 12);
    if (memoryStories.length >= 3) score += 10;
    return Math.min(100, Math.max(35, score));
  };

  const freshnessScore = calculateFreshnessScore();

  // Daily Missions Map by Day
  const dailyMissions = [
    { day: 'Senin', task: 'Foto Apel Pagi & Penghormatan Bendera / Doa Pagi', points: 25, icon: '🌅' },
    { day: 'Selasa', task: 'Foto Kreasi Susunan Balok & Kolaborasi Sentra Balok', points: 25, icon: '🧱' },
    { day: 'Rabu', task: 'Foto Lukisan Jari & Mewarnai Sentra Seni', points: 25, icon: '🎨' },
    { day: 'Kamis', task: 'Foto Olahraga & Bermain Bebas di Rumput Hijau', points: 25, icon: '🛝' },
    { day: 'Jumat', task: 'Foto Infaq Jumat Ceria & Sholat Dhuha Berjamaah', points: 25, icon: '🕌' },
    { day: 'Sabtu', task: 'Foto Kerja Bakti & Kebersihan Taman Sekolah', points: 25, icon: '🌱' },
  ];

  const currentDayMission = dailyMissions[4]; // Friday mission default

  // Simulate Photo Analysis Trigger
  const handleAnalyzePhoto = (url: string) => {
    setUploadedPhotoUrl(url);
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setPhotoAnalysis({
        sharpness: Math.floor(Math.random() * 10) + 90,
        lighting: Math.floor(Math.random() * 10) + 88,
        composition: Math.floor(Math.random() * 8) + 91,
        resolution: '2048 x 1536 px (HD)',
        orientation: 'Lanskap',
        noise: 'Sangat Rendah',
        aiAdvice: 'Analisis AI Asy: Foto sangat bersih! Pencahayaan hangat dari matahari pagi Tanggul sudah optimal. Sangat layak untuk Halaman Utama.'
      });
    }, 800);
  };

  // Simulate AI Story Generation
  const handleGenerateStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      setIsGeneratingStory(false);
      setGeneratedTitle(`Kisah Kehangatan: ${briefInput.slice(0, 40)}...`);
      setGeneratedSummary(`Catatan momen indah ananda saat ${briefInput.toLowerCase()} di TK Asy Syifa.`);
      setGeneratedContent(
        `Alhamdulillah, hari ini anak-anak TK Asy Syifa Tanggul mengikuti kegiatan yang penuh makna. ${briefInput} Didampingi oleh Ibu Guru dengan bimbingan lembut, ananda tidak hanya belajar keterampilan fisik, tetapi juga memupuk rasa percaya diri, kasih sayang pada sesama, dan rasa bersyukur kepada Allah SWT.`
      );
    }, 1000);
  };

  // Handle Publish Story to Website
  const handlePublishToWebsite = () => {
    const newStory: MemoryStory = {
      id: `mem-${Date.now()}`,
      title: generatedTitle,
      summary: generatedSummary,
      content: generatedContent,
      date: 'Baru saja dipublikasikan',
      day: 'Hari Ini',
      photoUrl: uploadedPhotoUrl,
      category: 'Aktivitas Harian',
      tags: ['Terbaru', 'Kegiatan Sekolah', 'Karakter Islami'],
      freshnessTag: 'Terbaru',
      featuredWeek: true,
      featuredMonth: false,
      qualityScore: photoAnalysis.sharpness
    };

    setMemoryStories([newStory, ...memoryStories]);
    setLastUpdateDaysAgo(0);
    if (!isMissionCompleted) {
      setIsMissionCompleted(true);
      setActivityPoints(activityPoints + 25);
    }
    setPublishSuccessMessage('Alhamdulillah! Cerita & Foto Berhasil Dipublikasikan Otomatis ke Homepage, Galeri, dan Timeline Sekolah.');
    setTimeout(() => setPublishSuccessMessage(''), 5000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Engine Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-emerald-300">
          <Sparkles className="w-64 h-64" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" /> Living School Engine • SPRINT WR-16
              </span>
              <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 font-extrabold text-xs px-3 py-1 rounded-full">
                Sistem Website Selalu Hidup
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Mesin Kehidupan Digital TK Asy Syifa
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
              Website ini bergerak secara dinamis sesuai aktivitas harian sekolah: Misi Foto Harian, Quality AI, Auto Story Generator, Memory Timeline, dan Season Engine.
            </p>
          </div>

          {/* Freshness Score Card */}
          <div className="bg-emerald-950/90 p-5 rounded-2xl border-2 border-emerald-400/60 shadow-xl flex items-center gap-5 shrink-0 w-full lg:w-auto">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-emerald-900" fill="transparent" />
                <circle
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6"
                  className="text-amber-400 transition-all duration-1000"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * freshnessScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm font-black text-amber-300">{freshnessScore}%</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Website Freshness Score
              </div>
              <div className="text-sm font-black text-white">
                {freshnessScore >= 80 ? 'Sangat Segar & Aktif' : 'Membutuhkan Update Baru'}
              </div>
              <p className="text-[11px] text-emerald-200 font-medium">
                Poin Aktivitas: <span className="font-bold text-amber-300">{activityPoints} Pts</span>
              </p>
            </div>
          </div>
        </div>

        {/* AI Asy Friendly Reminder Banner */}
        <div className="mt-6 pt-4 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-12 shrink-0">
              <AIAsyCharacterRenderer state="wave" scale={0.65} />
            </div>
            <p className="text-xs text-emerald-100 italic font-medium leading-snug">
              "Assalamu'alaikum Bu Guru! AI Asy siap membantu memeriksa kualitas foto dan merangkai cerita kehangatan anak-anak hari ini!"
            </p>
          </div>

          <button
            onClick={() => setActiveTab('mission')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer shrink-0 border border-amber-300 flex items-center gap-1.5"
          >
            <span>Buka Misi Harian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Tabs Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { key: 'mission', label: 'Modul 1: Misi Harian', icon: '🎯' },
          { key: 'photo_ai', label: 'Modul 2 & 3: Quality AI & Optimizer', icon: '📸' },
          { key: 'story_ai', label: 'Modul 4 & 5: AI Story & Auto Update', icon: '✍️' },
          { key: 'timeline', label: 'Modul 6 & 7: Memory Timeline', icon: '📖' },
          { key: 'season', label: 'Modul 9: Season Engine', icon: '🌙' },
          { key: 'cms_control', label: 'Modul 10: CMS Control Panel', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-2 border ${
              activeTab === tab.key
                ? 'bg-emerald-900 text-amber-300 border-amber-400 shadow-md scale-105'
                : 'bg-white text-stone-700 hover:bg-emerald-50 border-stone-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Success Notification Alert */}
      {publishSuccessMessage && (
        <div className="p-4 bg-emerald-800 text-white rounded-2xl border-2 border-emerald-400 shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{publishSuccessMessage}</p>
        </div>
      )}

      {/* TAB 1: DAILY MISSION ENGINE */}
      {activeTab === 'mission' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Modul 1 • Daily Mission Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Misi Harian Dokumentasi Sekolah
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Status Misi Hari Ini:</span>
              {isMissionCompleted ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-700" /> Selesai (+25 Pts)
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full border border-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" /> Siap Dikerjakan (+25 Pts)
                </span>
              )}
            </div>
          </div>

          {/* Today's Featured Mission Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl border-2 border-emerald-400 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentDayMission.icon}</span>
                <span className="text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md">
                  Misi Hari {currentDayMission.day}
                </span>
                <span className="text-xs font-bold text-emerald-300">Reward: +{currentDayMission.points} Website Activity Points</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                "{currentDayMission.task}"
              </h3>

              <p className="text-xs text-emerald-100 font-medium">
                Pilih foto terbaik kegiatan ananda hari ini, lalu gunakan Quality AI untuk memvalidasi kejernihan foto sebelum dipublikasikan.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('photo_ai')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-lg cursor-pointer shrink-0 border border-amber-300 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Kerjakan Misi & Upload Foto</span>
            </button>
          </div>

          {/* Weekly Mission Schedule Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500">
              Jadwal Misi Harian Satu Pekan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyMissions.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition ${
                    m.day === 'Jumat'
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>{m.icon}</span> {m.day}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                      +{m.points} Pts
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-700 leading-snug">
                    {m.task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHOTO QUALITY AI & SMART IMAGE OPTIMIZER */}
      {activeTab === 'photo_ai' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Modul 2 & 3 • Photo Quality AI & Smart Image Optimizer
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Validasi Kualitas Foto & Kompresi Otomatis
            </h2>
          </div>

          {/* Photo Selector Samples */}
          <div className="space-y-3">
            <label className="text-xs font-black text-stone-700 block">
              Pilih / Simulasi Upload Foto Kegiatan Sekolah:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Menanam Bunga', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800' },
                { label: 'Sentra Balok', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800' },
                { label: 'Halaman Rumput', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800' },
                { label: 'Sholat Dhuha', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnalyzePhoto(item.url)}
                  className={`p-2 rounded-2xl border text-left transition cursor-pointer overflow-hidden group ${
                    uploadedPhotoUrl === item.url ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50' : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <div className="h-24 rounded-xl overflow-hidden mb-2">
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Photo Preview & Optimizer Specs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-md h-64 sm:h-72">
                <img src={uploadedPhotoUrl} alt="Uploaded" className="w-full h-full object-cover" />
                {isAnalyzingPhoto && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <RefreshCw className="w-8 h-8 text-amber-300 animate-spin" />
                    <span className="text-xs font-black">Photo Quality AI Sedang Memeriksa...</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm p-3 rounded-xl text-white text-xs flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> WebP Auto-Compressed (-68%)
                  </span>
                  <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md font-extrabold text-[10px]">
                    Lazy Loading Ready
                  </span>
                </div>
              </div>

              {/* Multi-Format Specs Badge */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 block">THUMBNAIL</span>
                  <span className="text-xs font-black text-emerald-900">300x225 (18 KB)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 block">MEDIUM</span>
                  <span className="text-xs font-black text-emerald-900">800x600 (62 KB)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 block">HD FULL</span>
                  <span className="text-xs font-black text-emerald-900">1920x1080 (140 KB)</span>
                </div>
              </div>
            </div>

            {/* AI Quality Report */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-700" /> Skor Kualitas Foto AI:
                  </span>
                  <span className="text-lg font-black text-emerald-800">
                    {photoAnalysis.sharpness}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Ketajaman & Fokus:</span>
                    <span className="font-bold text-emerald-800">{photoAnalysis.sharpness}% (Sangat Tajam)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Pencahayaan Natural:</span>
                    <span className="font-bold text-emerald-800">{photoAnalysis.lighting}% (Optimal)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Komposisi Subjek:</span>
                    <span className="font-bold text-emerald-800">{photoAnalysis.composition}% (Seimbang)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Resolusi Asli:</span>
                    <span className="font-bold text-slate-900">{photoAnalysis.resolution}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-semibold space-y-1">
                  <span className="font-extrabold text-emerald-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Saran AI Asy:
                  </span>
                  <p className="italic text-emerald-900">{photoAnalysis.aiAdvice}</p>
                </div>

                <button
                  onClick={() => setActiveTab('story_ai')}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Modul AI Story Writer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI STORY WRITER & AUTO WEBSITE UPDATE */}
      {activeTab === 'story_ai' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Modul 4 & 5 • AI Story Writer & Auto Website Update
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Penulis Cerita AI & Publikasi Serentak
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-700 block">
                  Catatan Singkat Aktivitas Hari Ini dari Bu Guru:
                </label>
                <textarea
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  placeholder="Contoh: Anak-anak belajar membuat jembatan kayu di sentra balok..."
                />
              </div>

              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingStory}
                className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-amber-300 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2 border border-teal-600"
              >
                {isGeneratingStory ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI Sedang Merangkai Cerita...</span>
                  </>
                ) : (
                  <>
                    <Feather className="w-4 h-4 text-amber-300" />
                    <span>Rangkai Artikel Otomatis dengan AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Review Column */}
            <div className="lg:col-span-7 bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                Hasil Generasi Cerita Islami & Warm SEO:
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Judul Artikel:</label>
                  <input
                    type="text"
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Ringkasan:</label>
                  <input
                    type="text"
                    value={generatedSummary}
                    onChange={(e) => setGeneratedSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Isi Cerita Lengkap:</label>
                  <textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
                <span className="text-[11px] text-stone-500 font-semibold">
                  Akan muncul otomatis di: Homepage, Galeri, News & Timeline.
                </span>

                <button
                  onClick={handlePublishToWebsite}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer shrink-0 border border-amber-300 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publikasikan ke Website Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MEMORY TIMELINE & FEATURED MEMORY */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Modul 6 & 7 • Memory Timeline & Featured Memory
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Jejak Kenangan Sekolah & Sorotan Unggulan
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {memoryStories.map((story) => (
              <div key={story.id} className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={story.photoUrl} alt={story.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-emerald-900 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                      {story.category}
                    </span>
                    {story.featuredWeek && (
                      <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 text-slate-950 fill-slate-950" /> Sorotan Pekan Ini
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-bold text-stone-500 flex items-center justify-between">
                      <span>{story.day}, {story.date}</span>
                      <span className="text-emerald-800 font-extrabold">Quality AI: {story.qualityScore}%</span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 font-medium">
                      {story.content}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-stone-200/60">
                  <div className="flex flex-wrap gap-1">
                    {story.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SEASON ENGINE */}
      {activeTab === 'season' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Modul 9 • Season Engine Switcher
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Transformasi Tema Suasana Musim & Hari Besar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'ramadan', name: 'Suasana Ramadan', icon: '🌙', themeColor: 'bg-emerald-900 text-amber-300' },
              { id: 'fitri', name: 'Hari Raya Idul Fitri', icon: '🕌', themeColor: 'bg-teal-900 text-emerald-200' },
              { id: 'kemerdekaan', name: '17 Agustus Kemerdekaan', icon: '🇮🇩', themeColor: 'bg-rose-900 text-white' },
              { id: 'hari_guru', name: 'Hari Guru Nasional', icon: '👩‍🏫', themeColor: 'bg-amber-900 text-amber-100' },
            ].map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.id)}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between h-32 ${
                  activeSeason === season.id
                    ? `${season.themeColor} border-amber-400 shadow-lg scale-105 font-black`
                    : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100 font-bold'
                }`}
              >
                <span className="text-3xl">{season.icon}</span>
                <div>
                  <span className="text-xs block">{season.name}</span>
                  <span className="text-[10px] opacity-80">
                    {activeSeason === season.id ? '✓ Tema Aktif' : 'Klik untuk Aktifkan'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CMS CONTROL PANEL */}
      {activeTab === 'cms_control' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Modul 10 • CMS Control Panel
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Pengaturan Mesin Kehidupan Sekolah Tanpa Coding
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Otomatisasi Daily Mission Engine', status: 'Aktif Setiap Pagi', desc: 'Sistem memberikan misi harian otomatis saat Admin login.' },
              { label: 'Validation Level Photo Quality AI', status: 'Tinggi (Rekomendasi)', desc: 'Memeriksa ketajaman dan cahaya sebelum publikasi.' },
              { label: 'Smart Image Optimizer WebP', status: 'Aktif (-65% Ukuran)', desc: 'Mengubah format ke WebP dan membuat thumbnail responsif.' },
              { label: 'Auto Website Update Broadcast', status: 'Aktif', desc: 'Publikasi serentak ke Homepage, Galeri, dan Timeline.' },
            ].map((cfg, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="space-y-1 max-w-xs">
                  <span className="text-xs font-black text-slate-900 block">{cfg.label}</span>
                  <span className="text-[11px] text-stone-600 font-medium block">{cfg.desc}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-800 text-amber-300 rounded-full text-[10px] font-black shrink-0">
                  {cfg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
