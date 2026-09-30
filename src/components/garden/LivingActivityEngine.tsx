import React, { useState } from 'react';
import { 
  Sparkles, Heart, Sun, BookOpen, Volume2, CheckCircle2, ArrowRight,
  RefreshCw, Smile, Feather, Layers, Star
} from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  photoUrl: string;
  badge: string;
  shortDesc: string;
  fullNarrative: string;
  motorSkills: string[];
  characterAspect: string;
}

export const LivingActivityEngine: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const activities: ActivityItem[] = [
    {
      id: 'belajar_hijaiyah',
      title: 'Mengenal Huruf Hijaiyah Ceria',
      category: 'Ibadah & Al-Qur\'an',
      icon: '📖',
      photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      badge: 'Tahfidz Cilik',
      shortDesc: 'Mengenal bunyi dan bentuk huruf Al-Qur\'an lewat lagu riang dan peragaan visual.',
      fullNarrative: 'Hari ini di TK Asy Syifa, ananda diajak melantunkan irama huruf Hijaiyah. Dengan bimbingan Ustadzah yang lembut, ananda mengenali huruf Kha, Dal, dan Dzal lewat media kartu bergambar warna-warni.',
      motorSkills: ['Sensori Visual', 'Irama Pendengaran', 'Lafal Bahasa'],
      characterAspect: 'Kecintaan Pada Al-Qur\'an'
    },
    {
      id: 'cap_daun_kreatif',
      title: 'Cap Daun & Lukisan Finger Painting',
      category: 'Seni & Motorik Halus',
      icon: '🎨',
      photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
      badge: 'Motorik Halus',
      shortDesc: 'Menggunakan bahan pewarna makanan alami untuk mencetak tulang daun di atas kertas.',
      fullNarrative: 'Anak-anak memetik daun kamboja kering di taman sekolah, lalu mencelupkannya ke dalam pewarna makanan alami. Tangan-tangan mungil mereka mengusap lembut hingga tercetak tekstur daun yang sangat indah.',
      motorSkills: ['Kekuatan Jemari', 'Koordinasi Mata-Tangan', 'Eksplorasi Tekstur'],
      characterAspect: 'Kreativitas & Apresiasi Alam'
    },
    {
      id: 'sentra_balok_masjid',
      title: 'Menyusun Balok Kayu & Arsitektur Cilik',
      category: 'Sentra Balok',
      icon: '🧱',
      photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      badge: 'Sentra Balok',
      shortDesc: 'Membangun miniatur menara, jembatan, dan masjid dengan balok kayu presisi.',
      fullNarrative: 'Dalam Sentra Balok, ananda bekerja sama kelompok menyusun 50 balok kayu jati belanda. Mereka belajar keseimbangan gaya gravitasi dan konsep spasial secara alami sambil saling berbagi tugas.',
      motorSkills: ['Keseimbangan Spasial', 'Logika Ukuran', 'Seni Bangunan'],
      characterAspect: 'Gotong Royong & Sabar'
    },
    {
      id: 'sholat_dhuha_berjamaah',
      title: 'Sholat Dhuha & Murojaah Surah An-Naba',
      category: 'Praktik Ibadah',
      icon: '🕌',
      photoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      badge: 'Ibadah Harian',
      shortDesc: 'Praktik wudhu mandiri, merapikan sajadah, dan melantunkan bacaan sholat dhuha.',
      fullNarrative: 'Ananda memakai mukena dan peci cilik dengan bangga. Setelah berwudhu bersama di kran ramah anak, mereka berbaris tertib mengikuti gerakan ruku\' dan sujud dalam suasana khusyuk dan damai.',
      motorSkills: ['Koordinasi Wudhu', 'Disiplin Baris', 'Ketertiban Mandiri'],
      characterAspect: 'Keakraban Dengan Allah'
    },
    {
      id: 'outdoor_kebun_sekolah',
      title: 'Menyiram Bunga & Kebun Edukasi',
      category: 'Outdoor Learning',
      icon: '🌱',
      photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
      badge: 'Outdoor Learning',
      shortDesc: 'Menyiram bibit sayur dan mengamati tanaman tumbuh subur di kebun sekolah.',
      fullNarrative: 'Di bawah naungan pepohonan rindang Tanggul, ananda memegang gembor air cilik. Mereka menghirup udara segar pedesaan sambil menyapa kupu-kupu dan mengamati proses tumbuhnya bibit kangkung.',
      motorSkills: ['Motorik Kasar', 'Ketahanan Fisik', 'Keterampilan Kebun'],
      characterAspect: 'Peduli Lingkungan'
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('belajar_hijaiyah');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const activeActivity = activities.find(a => a.id === selectedId) || activities[0];

  const handleSimulateNarration = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400/80 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Title & Badge Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" /> LIVING ACTIVITY ENGINE v3.0
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
              Aktivitas Ceria Harian Ananda TK Asy Syifa
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Setiap hari diisi dengan pembelajaran berbasis mainan edukatif, nilai keislaman, dan stimulasi motorik aktif.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateNarration}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg border ${
                isPlayingAudio 
                  ? 'bg-amber-300 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300 border-emerald-600'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? '🔊 AI Asy Membaca Narasi...' : '🔊 Dengarkan Narasi AI Asy'}</span>
            </button>
          </div>
        </div>

        {/* Activity Selection Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {activities.map((act) => (
            <button
              key={act.id}
              onClick={() => setSelectedId(act.id)}
              className={`p-3.5 rounded-2xl transition cursor-pointer flex flex-col items-center text-center gap-2 border ${
                selectedId === act.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl ring-4 ring-amber-300 scale-105'
                  : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700/60'
              }`}
            >
              <span className="text-3xl">{act.icon}</span>
              <span className="text-xs font-black leading-tight">{act.title}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                selectedId === act.id ? 'bg-slate-950 text-amber-300' : 'bg-emerald-900 text-emerald-200'
              }`}>
                {act.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Active Activity Showcase Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
          
          {/* Activity Image Frame */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border-4 border-amber-300 shadow-lg h-60 sm:h-72">
            <img 
              src={activeActivity.photoUrl} 
              alt={activeActivity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
              {activeActivity.category}
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 text-amber-200 backdrop-blur-xs p-2.5 rounded-xl text-xs font-bold border border-amber-400/50">
              🌟 {activeActivity.characterAspect}
            </div>
          </div>

          {/* Activity Narrative Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Aktivitas Pilihan Hari Ini
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeActivity.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 font-serif italic bg-amber-50 p-4 rounded-2xl border-l-4 border-amber-400 leading-relaxed">
              "{activeActivity.fullNarrative}"
            </p>

            {/* Stimulated Motor Skills Badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-stone-800 uppercase tracking-wider block">
                🧠 Aspek Stimulasi Motorik & Perkembangan:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeActivity.motorSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-800 text-amber-300 text-xs font-bold shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {onTabChange && (
              <div className="pt-2">
                <button
                  onClick={() => onTabChange('w2ProfilProgram')}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black rounded-2xl text-xs transition shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span>Lihat Seluruh Kurikulum Sentra Belajar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
