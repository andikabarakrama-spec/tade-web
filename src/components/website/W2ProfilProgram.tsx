import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SchoolProfile, MediaItem } from '../../types';
import { DataService } from '../../services/db';
import { FoundationShowcase } from './FoundationShowcase';
import { TeacherSpotlight } from './TeacherSpotlight';
import { VirtualSchoolTour } from './VirtualSchoolTour';
import { AchievementWall } from './AchievementWall';
import { LivingPageDecorator } from '../garden/LivingPageDecorator';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { ImmersiveWorldLandscape } from '../garden/ImmersiveWorldLandscape';
import { DepthCard } from '../interactions/DepthCard';
import { MorphMedia } from '../interactions/MorphMedia';
import { InteractiveFlow, FlowItem } from '../interactions/InteractiveFlow';
import { ExpandMedia } from '../interactions/ExpandMedia';
import {
  BookOpen,
  Award,
  CheckCircle,
  Building,
  Sparkles,
  Heart,
  Palette,
  Music,
  Smile,
  ShieldCheck,
  Video
} from 'lucide-react';

export const W2ProfilProgram: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  useEffect(() => {
    DataService.getSchoolProfile().then(setProfile);
    DataService.getMedia().then(setMediaList);
  }, []);

  const sentraFlowItems: FlowItem[] = [
    {
      id: 's1',
      title: 'Sentra Bahan Alam & Sains',
      category: 'Eksplorasi STEAM',
      subtitle: 'Praktik sensorik, pasir, air & hidroponik',
      description: 'Menstimulasi pancaindra, rasa ingin tahu, dan pengenalan sains sederhana.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      badge: 'Sentra Utama'
    },
    {
      id: 's2',
      title: 'Sentra Main Peran & Mikro',
      category: 'Sosialisasi & Bahasa',
      subtitle: 'Simulasi profesi, toko, & rumah tangga',
      description: 'Melatih kemampuan berkomunikasi, empati, dan pemahaman norma sosial.',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
      badge: 'Favorit Anak'
    },
    {
      id: 's3',
      title: 'Sentra Balok & Konstruksi',
      category: 'Spasial & Logika',
      subtitle: 'Rancang bangun, pola, & arsitektur cilik',
      description: 'Mengembangkan penalaran spasial, pemecahan masalah, dan motorik halus.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      badge: 'Kreativitas'
    },
    {
      id: 's4',
      title: 'Sentra Seni & Kreativitas',
      category: 'Seni Rupa & Motorik',
      subtitle: 'Melukis, kerajinan tangan & batik jemparing',
      description: 'Wadah mengekspresikan imajinasi dan apresiasi keindahan warna.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      badge: 'Ekspresi Bebas'
    },
    {
      id: 's5',
      title: 'Sentra Ibadah & Tahfidz',
      category: 'Spiritual Islami',
      subtitle: 'Praktik sholat, wudhu, & murajaah Juz 30',
      description: 'Pembiasaan ibadah rutin sejak dini dengan bimbingan lembut ustadzah.',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      badge: 'Inti Karakter'
    }
  ];

  return (
    <ImmersiveWorldLandscape>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative">
        <LivingPageDecorator pageName="Profil" />
        
        {/* Page Header - Book Reveal Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-3 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden border-4 border-amber-300"
        >
          <div className="relative z-10 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-slate-950/80 px-4 py-1.5 rounded-full border-2 border-amber-300 shadow-md inline-flex items-center gap-1.5">
              <span>🏡 LOKASI WORLD: RUANG GURU & SENTRA BELAJAR</span>
              <span>• Profil & Program Pendidikan Islam Ceria</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Profil & Program Unggulan
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm max-w-2xl mx-auto font-medium leading-relaxed">
              Mengenal Visi, Misi, Bimbingan Karakter Islami, Kurikulum Merdeka PAUD 5 Sentra, serta Sarana Lengkap TK Asy Syifa Tanggul.
            </p>
          </div>
        </motion.div>

        {/* AI Asy Living Character Scene in Sentra / Program */}
        <AIAsyCharacterScene pageContext="w2Program" />

        {/* 3D CoverFlow Sentra Gallery - Growth/Stagger Motion */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="text-center space-y-1">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-full">
              Interactive 3D Flow Sentra
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              5 Sentra Pembelajaran Utama TK Asy Syifa
            </h2>
            <p className="text-xs text-stone-600 font-bold">Geser atau klik sentra untuk menjelajahi lingkungan belajar ananda</p>
          </div>
          <InteractiveFlow items={sentraFlowItems} autoPlay />
        </motion.section>

        {/* Yayasan Foundation Showcase */}
        <FoundationShowcase />

        {/* Visi & Misi - Book / Depth Reveal */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <DepthCard depth={10}>
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/60 rounded-3xl p-8 border-4 border-emerald-300 shadow-md space-y-4 relative overflow-hidden h-full">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm uppercase tracking-wider">
                <Award className="w-5 h-5 text-emerald-700" /> Visi Sekolah
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 leading-relaxed italic border-l-4 border-emerald-600 pl-4 bg-white/90 py-4 rounded-r-2xl shadow-xs">
                "{profile?.vision || 'Mewujudkan Generasi Muslim PAUD/TK yang Berkarakter Islami, Cerdas, Kreatif, Berakhlak Mulia, dan Siap Memimpin Masa Depan.'}"
              </p>
              <div className="pt-2 text-xs text-stone-700 font-extrabold flex items-center gap-2 bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-700" /> Terdaftar Resmi Kemendikbudristek | NPSN: 20567812 | Akreditasi A
              </div>
            </div>
          </DepthCard>

          <DepthCard depth={10}>
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50/60 rounded-3xl p-8 border-4 border-amber-300 shadow-md space-y-4 relative overflow-hidden h-full">
              <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wider">
                <BookOpen className="w-5 h-5 text-amber-700" /> Misi Utama Bimbingan
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-800 font-medium">
                {profile?.missions.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-2xl border border-amber-200 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DepthCard>
        </motion.section>


        {/* Program Unggulan Detail */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-4 py-1.5 rounded-full border border-amber-300">
              Kurikulum & Pembiasaan Islami
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Program Pembelajaran PAUD & Bimbingan Karakter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DepthCard depth={8}>
              <div className="bg-gradient-to-br from-emerald-100/90 via-teal-50 to-emerald-50 p-6 rounded-3xl border-4 border-emerald-300 shadow-md space-y-3 relative overflow-hidden group h-full">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center font-black shadow-md border-2 border-emerald-800">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900">Kurikulum Merdeka PAUD</h3>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  Eksplorasi minat anak, proyek berbasis STEAM (Science, Tech, Engineering, Arts, Math), dan stimulasi sensorik-motorik terstruktur.
                </p>
              </div>
            </DepthCard>

            <DepthCard depth={8}>
              <div className="bg-gradient-to-br from-amber-100/90 via-yellow-50 to-amber-50 p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-3 relative overflow-hidden group h-full">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md border-2 border-amber-600">
                  <Heart className="w-6 h-6 text-slate-950" />
                </div>
                <h3 className="text-base font-black text-slate-900">Tahfidz & Budi Pekerti</h3>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  Target hafalan surah pendek juz 30, doa harian, sholat Dhuha berjamaah, dan penanaman adab kesopanan kepada orang tua & guru.
                </p>
              </div>
            </DepthCard>

            <DepthCard depth={8}>
              <div className="bg-gradient-to-br from-sky-100/90 via-blue-50 to-sky-50 p-6 rounded-3xl border-4 border-sky-300 shadow-md space-y-3 relative overflow-hidden group h-full">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-md border-2 border-sky-700">
                  <Smile className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900">Pendidikan Inklusif & Karakter</h3>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  Memahami keunikan setiap anak. Pendampingan emosional, stimulasi keunikan individu, dan konseling tumbuh kembang.
                </p>
              </div>
            </DepthCard>
          </div>
        </section>

        {/* MorphMedia Interactive Section */}
        <section className="space-y-4 max-w-2xl mx-auto">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full">
              Morph Media Info Quick Card
            </span>
            <h3 className="text-xl font-black text-slate-900">Sistem Pembelajaran Shift Pagi & Sentra</h3>
          </div>
          <MorphMedia
            compactTitle="Jadwal Pembelajaran Shift Ceria PAUD"
            compactSubtitle="Klik untuk melihat jam operasional & tata tertib penjemputan"
            badge="Info Jam Belajar"
            icon={<BookOpen className="w-5 h-5" />}
            expandedTitle="Jadwal & Tata Tertib Pembelajaran TK Asy Syifa"
            expandedDescription="Pembelajaran diselenggarakan Hari Senin hingga Jumat pukul 07.30 - 10.30 WIB dengan pembiasaan Sholat Dhuha & Murajaah Juz 30 pada awal jam belajar."
            details={[
              { label: 'Shift Pagi Utama', value: '07.30 - 10.30 WIB' },
              { label: 'Lokasi Sekolah', value: 'Tanggul Wetan, Jember' },
              { label: 'Pakaian Seragam', value: 'Baju Kurung / Koko Orange' },
              { label: 'Penjemputan', value: 'Wajib Menunjukkan Kartu Wali' }
            ]}
            ctaText="Pahami Tata Tertib"
          />
        </section>

        {/* Teacher Spotlight */}
        <TeacherSpotlight />

        {/* Virtual School Tour */}
        <VirtualSchoolTour />

        {/* Achievement Wall */}
        <AchievementWall />

        {/* Galeri & Fasilitas with ExpandMedia */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Fasilitas & Dokumentasi Galeri
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaList.map((m) => (
              <DepthCard key={m.id} depth={6}>
                <ExpandMedia
                  src={m.url}
                  alt={m.title}
                  title={m.title}
                  subtitle={m.category}
                  description={m.description}
                  category={m.category}
                />
              </DepthCard>
            ))}
          </div>
        </section>
      </div>
    </ImmersiveWorldLandscape>
  );
};
