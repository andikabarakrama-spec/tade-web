import React, { useEffect, useState } from 'react';
import { SchoolProfile, ArticleCMS, WebsiteHomepageConfig } from '../../types';
import { DataService } from '../../services/db';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';
import { LivingGardenElements } from '../garden/LivingGardenElements';
import { AnimalLifeEngine } from '../garden/AnimalLifeEngine';
import { VehicleAnimation } from '../garden/VehicleAnimation';
import { DailyStoryEngine } from '../garden/DailyStoryEngine';
import { DailyTimelineEngine } from '../garden/DailyTimelineEngine';
import { FirstDayJourney } from './FirstDayJourney';
import { FoundationShowcase } from './FoundationShowcase';
import { WhyChooseUs } from './WhyChooseUs';
import { LivingClassroomExperience } from './LivingClassroomExperience';
import { InteractiveSchoolMap } from './InteractiveSchoolMap';
import { TeacherSpotlight } from './TeacherSpotlight';
import { ParentExperienceOverview } from './ParentExperienceOverview';
import { LivingEventCalendar } from './LivingEventCalendar';
import { ArtCornerGallery } from './ArtCornerGallery';
import { EmotionalCTABanner } from './EmotionalCTABanner';
import { VirtualSchoolTour } from './VirtualSchoolTour';
import { AchievementWall } from './AchievementWall';
import { TestimonialWall } from './TestimonialWall';
import { ParentDashboardPreview } from './ParentDashboardPreview';
import { SmartGallery } from './SmartGallery';
import { ChildActivitiesShowcase } from './ChildActivitiesShowcase';
import { ImagineYourChildSmile } from './ImagineYourChildSmile';
import { DayInTheLifeTimeline } from './DayInTheLifeTimeline';
import { LivingPageDecorator } from '../garden/LivingPageDecorator';
import { Story365Engine } from '../garden/Story365Engine';
import { SeasonEngine } from '../garden/SeasonEngine';
import { FoundationPresentationMode } from '../garden/FoundationPresentationMode';
import { DoodleSun, DoodleCloud, DoodleRainbow, DoodlePencil, DoodlePaperAirplane, DoodleHandprint, InteractiveKindergartenPlayground } from '../garden/ChildDoodleDecorations';
import { CloudSectionDivider, GrassSectionDivider, PaperCutSectionDivider, RainbowSectionDivider } from '../garden/SectionDividers';
import { StorybookPathConnector } from '../garden/StorybookPathConnector';
import { AuthenticPAUDShowcase } from './AuthenticPAUDShowcase';
import { EmotionalStoryEngine } from '../garden/EmotionalStoryEngine';
import { AIWebsiteArtDirector } from '../garden/AIWebsiteArtDirector';
import { FoundationWowSurprises } from '../garden/FoundationWowSurprises';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { ParentFAQSection } from './ParentFAQSection';
import { ParentTrustSection } from './ParentTrustSection';
import { AuthenticAsriEnvironment } from './AuthenticAsriEnvironment';
import { AuthenticVillageMorningScene } from './AuthenticVillageMorningScene';
import { DuniaAsySyifaWorldPath } from '../garden/DuniaAsySyifaWorldPath';
import { LivingSchoolEngine } from '../garden/LivingSchoolEngine';
import { TodayIsSpecialHeart } from '../garden/TodayIsSpecialHeart';
import { MasterDigitalHomeEcosystem } from '../garden/MasterDigitalHomeEcosystem';
import { RumahAIAsyExperience } from '../garden/RumahAIAsyExperience';
import { RumahAsySyifaHub } from '../garden/RumahAsySyifaHub';
import { ImmersiveWorldLandscape, ScrapbookPaperFrame, WoodenBoardFrame, StoneSteppingPathDivider, WoodenFenceDivider } from '../garden/ImmersiveWorldLandscape';

// Sprint P3 Living Kindergarten Engines
import { LivingClassroomScene } from '../garden/LivingClassroomScene';
import { LivingActivityEngine } from '../garden/LivingActivityEngine';
import { IslamicExperienceEngine } from '../garden/IslamicExperienceEngine';
import { StudentPortfolioEngine } from '../garden/StudentPortfolioEngine';
import { SmartGalleryEngine } from '../garden/SmartGalleryEngine';

// Sprint W27 Core Engines
import { SEOAutomationEngine } from './SEOAutomationEngine';
import { SmartSeasonalEngine } from './SmartSeasonalEngine';
import { SmartRotationEngine } from './SmartRotationEngine';
import { PublicStatsEngine } from './PublicStatsEngine';
import { PhotoExperienceEngine } from './PhotoExperienceEngine';

import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Heart,
  ArrowRight,
  ShieldCheck,
  Video,
  Quote,
  Star,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface Props {
  onTabChange: (tab: string) => void;
}

export const W1Beranda: React.FC<Props> = ({ onTabChange }) => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [articles, setArticles] = useState<ArticleCMS[]>([]);
  const [hpConfig, setHpConfig] = useState<WebsiteHomepageConfig | null>(null);

  useEffect(() => {
    DataService.getSchoolProfile().then(setProfile);
    DataService.getArticles().then(setArticles);
    DataService.getHomepageConfig().then(setHpConfig);
  }, []);

  const headline = hpConfig?.headline || 'Mewujudkan Generasi Muslim Cerdas, Qurani, & Berkarakter';
  const subtitle = hpConfig?.subtitle || 'Taman Kanak-Kanak Islam Moderen berbasis Kurikulum Merdeka PAUD & Pembiasaan Karakter Islami. Lingkungan belajar yang ramah anak, aman, dan penuh kasih sayang.';
  const ctaText = hpConfig?.ctaText || 'Daftar PPDB Online 2026/2027';
  const heroImage = hpConfig?.heroImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600';

  return (
    <ImmersiveWorldLandscape>
      <div className="space-y-12 pb-12 relative">
        {/* SEO Engine */}
        <SEOAutomationEngine
          seo={{
            title: `TK Asy Syifa Tanggul | ${headline}`,
            description: subtitle
          }}
        />

        {/* Foundation Presentation Wow Surprises Overlay */}
        <FoundationWowSurprises />

        {/* Smart Seasonal Engine Banner */}
        <div className="mx-4 sm:mx-6 lg:mx-8 pt-2">
          <SmartSeasonalEngine />
        </div>

        {/* Storybook World Path Navigation ("Dunia TK Asy Syifa") */}
        <div id="gerbang-utama">
          <DuniaAsySyifaWorldPath onTabChange={onTabChange} />
        </div>

      {/* Hero Section - Digital Kindergarten Gate Entrance (Gerbang Utama Kampus Hijau) */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 shadow-2xl border-4 border-emerald-600/40">
        {/* Living Garden Interactive Overlay */}
        <LivingGardenElements type="hero" />

        {/* School Gate Archway Top Banner Accent */}
        <div className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 py-2 px-4 text-center text-xs font-black tracking-wider uppercase border-b border-amber-500 flex items-center justify-center gap-2 shadow-sm z-20 relative">
          <Sparkles className="w-4 h-4 text-emerald-900 animate-spin-slow" />
          <span>Selamat Datang di Gerbang Utama Digital • TK Asy Syifa Tanggul, Jember</span>
          <Sparkles className="w-4 h-4 text-emerald-900 animate-spin-slow" />
        </div>

        {/* Floating Doodle Decorations */}
        <div className="absolute top-10 left-10 pointer-events-none opacity-30 hidden sm:block z-10">
          <DoodleSun className="w-16 h-16 text-amber-300 animate-spin-slow" />
        </div>
        <div className="absolute top-12 right-28 pointer-events-none opacity-30 hidden sm:block z-10">
          <DoodlePaperAirplane className="w-12 h-12 text-teal-200" />
        </div>

        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url('${heroImage}')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-950/70 pointer-events-none"></div>

        {/* School Gate Entrance Visual Frame */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-amber-300 text-xs font-black tracking-wide backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Langkah Pertama Memasuki Taman Belajar • Suasana Penyambutan Hangat
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {headline}
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base max-w-xl font-medium leading-relaxed opacity-95">
              {subtitle}
            </p>

            {/* Direct Journey Entrance Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onTabChange('w4')}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                {ctaText}
              </button>
              <button
                onClick={() => onTabChange('w2')}
                className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-sm backdrop-blur-xs transition flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                Jelajahi Sentra & Program
              </button>
              <button
                onClick={() => onTabChange('r29')}
                className="px-5 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-500/60 text-emerald-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Portal Wali Murid
              </button>
            </div>

            <div className="pt-5 border-t border-emerald-800/80 flex flex-wrap gap-5 text-xs text-emerald-200 font-bold">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/50">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Terakreditasi A (Unggul)
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/50">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Tahfidz Cilik Juz 30
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/50">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Pengasuhan Penuh Kasih Sayang
              </span>
            </div>
          </div>

          {/* Right Column: School Gate Pillar Scene */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-amber-300/80 shadow-2xl bg-emerald-900/60 backdrop-blur-md group">
              <img
                src={heroImage}
                alt="Gerbang Sekolah TK Asy Syifa"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent pointer-events-none" />
              
              {/* Gate Welcome Banner Overlay */}
              <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-emerald-300 shadow-xl flex items-center gap-3 text-slate-800">
                <div className="w-10 h-12 shrink-0">
                  <AIAsyCharacterRenderer state="wave" scale={0.7} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <span>AI Asy • Maskot Resmi</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-extrabold">Gerbang Utama</span>
                  </p>
                  <p className="text-[11px] text-stone-700 font-semibold leading-snug">
                    "Assalamu'alaikum Ayah & Bunda! Selamat datang di gerbang sekolah kami."
                  </p>
                </div>
              </div>

              {/* Bottom Gate Indicators */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="bg-emerald-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-400/50 font-extrabold flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" /> 60 Siswa Cilik
                </span>
                <span className="bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-black shadow-md flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Kampus Hijau
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Asy Living Storybook Mascot Inhabitant Scene */}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <AIAsyCharacterScene pageContext="w1Hero" onActionClick={() => onTabChange('w4')} />
      </div>

      {/* Sprint G15: TV Asy Syifa, Serial Harian & Rumah Asy & Syifa */}
      <RumahAsySyifaHub onTabChange={onTabChange} />

      {/* Smart Rotation Engine (Daily Quotes & Inspirations) */}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <SmartRotationEngine />
      </div>

      {/* Public Live Data Engine (Live SIM Statistics Sync) */}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <PublicStatsEngine />
      </div>

      {/* Parent Trust Section (Data Security, Easy PPDB, WhatsApp Guardian, Islamic Environment) */}
      <ParentTrustSection onTabChange={onTabChange} />

      {/* Authentic Asri Environment (Sawah, Rice Fields, Green Garden & Fresh Air) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthenticAsriEnvironment onTabChange={onTabChange} />
      </div>

      {/* Authentic Village Morning Scene (Antar Naik Motor/Sepeda, Salam Guru, Udara Pagi Sawah) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthenticVillageMorningScene onTabChange={onTabChange} />
      </div>

      {/* Living School Engine (WR-16: Daily Missions, Photo AI, Story AI, Timeline, Season Engine, CMS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LivingSchoolEngine onTabChange={onTabChange} />
      </div>

      {/* Today Is Special & The Digital Heart of TK Asy Syifa (WR-20) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TodayIsSpecialHeart onTabChange={onTabChange} />
      </div>

      {/* TADE Master Ecosystem: The Digital Home of TK Asy Syifa (WR-MASTER) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MasterDigitalHomeEcosystem onTabChange={onTabChange} />
      </div>

      {/* Sprint P3 Islamic Experience & Prayer Times */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IslamicExperienceEngine />
      </div>

      {/* Sprint P3 Living Classroom Scene */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LivingClassroomScene onTabChange={onTabChange} />
      </div>

      {/* Sprint P3 Living Activity Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LivingActivityEngine onTabChange={onTabChange} />
      </div>

      {/* Sprint P3 Student Portfolio Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentPortfolioEngine />
      </div>

      {/* Sprint P3 Smart Gallery Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartGalleryEngine />
      </div>

      {/* WR-24 Interactive Rumah AI Asy Experience */}
      <div id="rumah-ai-asy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RumahAIAsyExperience onTabChange={onTabChange} />
      </div>

      {/* Living Page Decorator & Foundation Presentation Mode */}
      <LivingPageDecorator pageName="Beranda" />
      <FoundationPresentationMode />

      {/* AI Website Art Director Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AIWebsiteArtDirector />
      </div>

      {/* Storybook Path Connector 1: Hero -> Program */}
      <StorybookPathConnector
        fromSection="Hero Utama"
        toSection="Program Unggulan"
        pathLabel="Jalan Setapak Menuju Sentra Belajar Ceria ↗️"
        icon="🌱"
        theme="emerald"
      />

      {/* Dynamic Season & Event Engine Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SeasonEngine />
      </div>

      {/* Authentic PAUD Activities Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthenticPAUDShowcase />
      </div>

      {/* Emotional Story Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmotionalStoryEngine />
      </div>

      {/* Interactive Kindergarten Playground */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveKindergartenPlayground />
      </div>

      {/* 365 Micro Stories Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Story365Engine />
      </div>

      {/* Vehicle Animation Trail */}
      <VehicleAnimation />

      <CloudSectionDivider />

      {/* Sambutan Kepala Sekolah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-3xl p-8 sm:p-10 border-2 border-emerald-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md relative overflow-hidden">
          {/* Tape Accent */}
          <div className="absolute -top-3 left-10 w-20 h-5 bg-amber-200/90 border border-amber-300 -rotate-2 z-10 rounded-xs pointer-events-none shadow-2xs" />

          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                alt="Kepala Sekolah"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-black text-slate-900">{profile?.kepalaSekolah || 'Hj. Nurul Aini, S.Pd.AUD'}</h3>
            <p className="text-xs text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-full mt-1">Kepala Sekolah TK Asy Syifa Tanggul</p>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-3.5 py-1 rounded-full shadow-xs">
              <Quote className="w-3.5 h-3.5 text-slate-950" /> Sambutan Hangat Ibu Kepala Sekolah
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              Selamat Datang di Portal Digital Kampus Hijau Asy Syifa
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
              Assalamu’alaikum Warahmatullahi Wabarakatuh. Puji syukur ke hadirat Allah SWT. Pendidikan usia dini merupakan fondasi utama dalam pembentukan akhlak, kecerdasan emosional, dan karakter anak. Di TK Asy Syifa Tanggul, kami memadukan stimulasi Kurikulum Merdeka PAUD dengan nilai-nilai luhur Al-Qur'an dan Sunnah, sehingga anak-anak tumbuh menjadi pribadi yang berakhlak mulia, percaya diri, dan mencintai Al-Qur'an.
            </p>
            <p className="text-emerald-900 text-xs font-extrabold italic bg-emerald-100/80 p-3 rounded-2xl border border-emerald-300">
              “Setiap anak adalah bintang yang unik, tugas kita menyinarinya dengan bimbingan penuh kasih sayang.”
            </p>
          </div>
        </div>
      </section>

      {/* Child Activities Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChildActivitiesShowcase />
      </div>

      {/* Imagine Your Child's Smile Storybook Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImagineYourChildSmile />
      </div>

      {/* Day In The Life Interactive Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DayInTheLifeTimeline onTabChange={onTabChange} />
      </div>

      <PaperCutSectionDivider />

      {/* Interactive First Day Journey */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FirstDayJourney />
      </div>

      {/* Animal Life Garden Interactive Trail */}
      <AnimalLifeEngine />

      {/* Daily Story Islamic Character Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DailyStoryEngine />
      </div>

      {/* Foundation Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FoundationShowcase />
      </div>

      {/* Why Choose TK Asy Syifa Premium Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhyChooseUs onTabChange={onTabChange} />
      </div>

      {/* Interactive Living Classroom Simulation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LivingClassroomExperience />
      </div>

      {/* Interactive School Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveSchoolMap />
      </div>

      {/* Storybook Path Connector 2: Program -> Guru */}
      <StorybookPathConnector
        fromSection="Sentra Belajar"
        toSection="Guru & Pendidik Teladan"
        pathLabel="Jejak Langkah Menuju Ibu Guru Penuh Kasih Sayang"
        icon="Heart"
        theme="rose"
      />

      {/* Teacher Spotlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeacherSpotlight />
      </div>

      {/* Parent Experience Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ParentExperienceOverview />
      </div>

      {/* Living Event Calendar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LivingEventCalendar />
      </div>

      {/* Art Corner Scrapbook Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArtCornerGallery />
      </div>

      {/* Virtual School Tour */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VirtualSchoolTour />
      </div>

      {/* Daily Timeline Schedule Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DailyTimelineEngine />
      </div>

      {/* Achievement Wall */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AchievementWall />
      </div>

      {/* Parent Dashboard SIM Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ParentDashboardPreview />
      </div>

      {/* Smart Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartGallery />
      </div>

      {/* Latest News & Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Kabar Terbaru
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Berita & Pengumuman Sekolah
            </h2>
          </div>
          <button
            onClick={() => onTabChange('w3')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-4 py-2 rounded-xl"
          >
            Lihat Semua Artikel <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => onTabChange('w3')}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {art.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" />
                  {art.date}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {art.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parent FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ParentFAQSection onTabChange={onTabChange} />
      </div>

      {/* Testimonial Wall */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialWall />
      </div>

      {/* Emotional CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmotionalCTABanner onTabChange={onTabChange} />
      </div>
    </div>
  </ImmersiveWorldLandscape>
  );
};

