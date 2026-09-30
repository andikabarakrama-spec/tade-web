import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArticleCMS,
  MediaItem,
  WebsiteHomepageConfig,
  WebsiteProgram,
  WebsiteTeacherPublic,
  WebsiteAchievement,
  WebsiteAnnouncement,
  WebsiteFAQ,
  WebsiteEventItem,
  UserRole
} from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import { SIMEmptyState } from './SIMEmptyState';
import {
  Globe,
  Layout,
  FileText,
  Calendar,
  Image as ImageIcon,
  Award,
  Users,
  BookOpen,
  HelpCircle,
  Plus,
  Edit2,
  Save,
  CheckCircle2,
  Sparkles,
  MoveUp,
  MoveDown,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  X,
  Info
} from 'lucide-react';

import { ProductionLockManager } from './ProductionLockManager';
import { AIWebsiteAdvisor2 } from './AIWebsiteAdvisor2.0';
import { FinalReleaseCandidateReport } from './FinalReleaseCandidateReport';

export const R22CMSWebsite: React.FC = () => {
  const { user, userProfile, activeRole } = useAuth();
  const actorName = userProfile?.nama || userProfile?.name || user?.displayName || 'Admin CMS';

  // Fail-closed canonical role resolution
  const canonicalRole = (activeRole || userProfile?.role || null) as UserRole | null;
  const canManage =
    !!canonicalRole &&
    ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(canonicalRole);

  const [activeTab, setActiveTab] = useState<'homepage' | 'news' | 'events' | 'programs' | 'teachers' | 'achievements' | 'gallery' | 'faq' | 'selfcheck'>('homepage');

  // Loading & Async Lock States
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Data States
  const [homepageConfig, setHomepageConfig] = useState<WebsiteHomepageConfig | null>(null);
  const [articles, setArticles] = useState<ArticleCMS[]>([]);
  const [events, setEvents] = useState<WebsiteEventItem[]>([]);
  const [programs, setPrograms] = useState<WebsiteProgram[]>([]);
  const [teachers, setTeachers] = useState<WebsiteTeacherPublic[]>([]);
  const [achievements, setAchievements] = useState<WebsiteAchievement[]>([]);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [faqs, setFaqs] = useState<WebsiteFAQ[]>([]);
  const [, setAnnouncements] = useState<WebsiteAnnouncement[]>([]);

  // Standard In-App Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modal / Form States
  const [editingArticle, setEditingArticle] = useState<Partial<ArticleCMS> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<WebsiteEventItem> | null>(null);
  const [editingProgram, setEditingProgram] = useState<Partial<WebsiteProgram> | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Partial<WebsiteTeacherPublic> | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Partial<WebsiteAchievement> | null>(null);
  const [editingMedia, setEditingMedia] = useState<Partial<MediaItem> | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<Partial<WebsiteFAQ> | null>(null);

  // Self-check results state
  const [selfCheckReport, setSelfCheckReport] = useState<{
    score: number;
    issues: { level: 'error' | 'warning' | 'pass'; title: string; desc: string }[];
  } | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [hp, art, ev, pr, tc, ac, me, fq, an] = await Promise.all([
        DataService.getHomepageConfig(),
        DataService.getArticles(),
        DataService.getWebsiteEvents(),
        DataService.getWebsitePrograms(),
        DataService.getWebsiteTeachersPublic(),
        DataService.getWebsiteAchievements(),
        DataService.getMedia(),
        DataService.getWebsiteFAQs(),
        DataService.getWebsiteAnnouncements()
      ]);
      setHomepageConfig(hp);
      setArticles(art || []);
      setEvents(ev || []);
      setPrograms(pr || []);
      setTeachers(tc || []);
      setAchievements(ac || []);
      setGallery(me || []);
      setFaqs(fq || []);
      setAnnouncements(an || []);
    } catch (e: any) {
      console.error('Error loading website CMS data:', e);
      setFeedback({
        type: 'error',
        message: `Gagal memuat data CMS Website: ${e?.message || 'Terjadi gangguan sinkronisasi.'}`
      });
    } finally {
      setLoading(false);
    }
  };

  // 1. Save Homepage Config
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !canManage || !canonicalRole || !homepageConfig) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah konfigurasi beranda CMS.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      await DataService.saveHomepageConfig(homepageConfig);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_HOMEPAGE_UPDATE',
        'Pusat CMS - Memperbarui Konfigurasi Hero & Urutan Beranda Website'
      );
      setFeedback({
        type: 'success',
        message: 'Konfigurasi Hero & Beranda berhasil disimpan ke Firestore!'
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan konfigurasi beranda: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder Sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!canManage || !canonicalRole || !homepageConfig) return;
    const newOrder = [...homepageConfig.sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setHomepageConfig({ ...homepageConfig, sectionOrder: newOrder });
  };

  // 2. Save News Article
  const handleSaveArticle = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingArticle?.title) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk menerbitkan atau mengedit artikel berita.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: ArticleCMS = {
        id: editingArticle.id || 'art-' + Date.now(),
        title: editingArticle.title || '',
        slug: (editingArticle.title || '').toLowerCase().replace(/\s+/g, '-'),
        body: editingArticle.body || '',
        category: (editingArticle.category as any) || 'Berita',
        image: editingArticle.image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
        author: editingArticle.author || actorName,
        date: editingArticle.date || new Date().toISOString().split('T')[0],
        isPublished: editingArticle.isPublished ?? true
      };
      await DataService.saveArticle(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_ARTICLE_SAVE',
        `Pusat CMS - Menyimpan Artikel Berita '${item.title}' (${item.category})`
      );
      const updated = await DataService.getArticles();
      setArticles(updated || []);
      setEditingArticle(null);
      setFeedback({
        type: 'success',
        message: `Artikel '${item.title}' berhasil diterbitkan!`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan artikel: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Save Event
  const handleSaveEvent = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingEvent?.title) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk menyimpan agenda madrasah.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: WebsiteEventItem = {
        id: editingEvent.id || 'evt-' + Date.now(),
        title: editingEvent.title || '',
        date: editingEvent.date || new Date().toISOString().split('T')[0],
        time: editingEvent.time || '08:00 WIB',
        location: editingEvent.location || 'Halaman TK Asy Syifa Tanggul',
        category: (editingEvent.category as any) || 'Market Day',
        description: editingEvent.description || '',
        isPast: editingEvent.isPast || false
      };
      await DataService.saveWebsiteEvent(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_EVENT_SAVE',
        `Pusat CMS - Menyimpan Agenda Sekolah '${item.title}' (${item.date})`
      );
      const updated = await DataService.getWebsiteEvents();
      setEvents(updated || []);
      setEditingEvent(null);
      setFeedback({
        type: 'success',
        message: `Agenda '${item.title}' berhasil disimpan!`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan agenda: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Save Program
  const handleSaveProgram = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingProgram?.title) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah program sentra.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: WebsiteProgram = {
        id: editingProgram.id || 'prog-' + Date.now(),
        title: editingProgram.title || '',
        category: editingProgram.category || 'Sentra Belajar',
        description: editingProgram.description || '',
        icon: editingProgram.icon || '📚',
        ageGroup: editingProgram.ageGroup || '4-6 Tahun',
        schedule: editingProgram.schedule || 'Senin - Jumat',
        isFeatured: editingProgram.isFeatured ?? true
      };
      await DataService.saveWebsiteProgram(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_PROGRAM_SAVE',
        `Pusat CMS - Menyimpan Sentra Belajar '${item.title}'`
      );
      const updated = await DataService.getWebsitePrograms();
      setPrograms(updated || []);
      setEditingProgram(null);
      setFeedback({
        type: 'success',
        message: `Program Sentra '${item.title}' berhasil disimpan!`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan program sentra: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Save Teacher Public Profile
  const handleSaveTeacher = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingTeacher?.name) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah profil pendidik publik.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: WebsiteTeacherPublic = {
        id: editingTeacher.id || 'tch-' + Date.now(),
        name: editingTeacher.name || '',
        title: editingTeacher.title || 'S.Pd.',
        position: editingTeacher.position || 'Guru Sentra Belajar',
        quote: editingTeacher.quote || 'Mendidik dengan kasih sayang dan keteladanan.',
        photoUrl: editingTeacher.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
        experienceYears: editingTeacher.experienceYears || 3
      };
      await DataService.saveWebsiteTeacherPublic(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_TEACHER_SAVE',
        `Pusat CMS - Menyimpan Profil Guru Publik '${item.name}'`
      );
      const updated = await DataService.getWebsiteTeachersPublic();
      setTeachers(updated || []);
      setEditingTeacher(null);
      setFeedback({
        type: 'success',
        message: `Profil Guru '${item.name}' berhasil disimpan!`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan profil guru: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Save Achievement
  const handleSaveAchievement = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingAchievement?.title) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk memperbarui prestasi madrasah.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: WebsiteAchievement = {
        id: editingAchievement.id || 'ach-' + Date.now(),
        title: editingAchievement.title || '',
        winnerName: editingAchievement.winnerName || 'Santri TK Asy Syifa',
        category: editingAchievement.category || 'Tahfidz & Keagamaan',
        year: editingAchievement.year || new Date().getFullYear().toString(),
        level: editingAchievement.level || 'Tingkat Kabupaten',
        badgeIcon: editingAchievement.badgeIcon || '🏆'
      };
      await DataService.saveWebsiteAchievement(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_ACHIEVEMENT_SAVE',
        `Pusat CMS - Menyimpan Data Prestasi '${item.title}' (${item.winnerName})`
      );
      const updated = await DataService.getWebsiteAchievements();
      setAchievements(updated || []);
      setEditingAchievement(null);
      setFeedback({
        type: 'success',
        message: `Prestasi '${item.title}' berhasil disimpan!`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan prestasi: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 7. Save Media Photo
  const handleSaveMedia = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingMedia?.title || !editingMedia?.url) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengunggah media galeri.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: MediaItem = {
        id: editingMedia.id || 'med-' + Date.now(),
        title: editingMedia.title || '',
        url: editingMedia.url || '',
        type: editingMedia.type || 'gallery',
        category: editingMedia.category || 'Kegiatan Ceria',
        description: editingMedia.description || '',
        isPublished: editingMedia.isPublished ?? true,
        dateAdded: editingMedia.dateAdded || new Date().toISOString().split('T')[0]
      };
      await DataService.saveMedia(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_MEDIA_SAVE',
        `Pusat CMS - Menambahkan Media Galeri '${item.title}'`
      );
      const updated = await DataService.getMedia();
      setGallery(updated || []);
      setEditingMedia(null);
      setFeedback({
        type: 'success',
        message: `Foto Galeri '${item.title}' berhasil ditambahkan!`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan media galeri: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 8. Save FAQ
  const handleSaveFAQ = async () => {
    if (isSaving || !canManage || !canonicalRole || !editingFAQ?.question || !editingFAQ?.answer) {
      if (!canManage || !canonicalRole) {
        setFeedback({
          type: 'error',
          message: 'Akses Ditolak: Anda tidak memiliki wewenang untuk menyimpan tanya jawab FAQ.'
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const item: WebsiteFAQ = {
        id: editingFAQ.id || 'faq-' + Date.now(),
        question: editingFAQ.question || '',
        answer: editingFAQ.answer || '',
        category: editingFAQ.category || 'Umum'
      };
      await DataService.saveWebsiteFAQ(item);
      await DataService.logAction(
        actorName,
        canonicalRole,
        'R22_FAQ_SAVE',
        `Pusat CMS - Menyimpan Tanya Jawab FAQ '${item.question}'`
      );
      const updated = await DataService.getWebsiteFAQs();
      setFaqs(updated || []);
      setEditingFAQ(null);
      setFeedback({
        type: 'success',
        message: 'Tanya Jawab (FAQ) berhasil disimpan!'
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Gagal menyimpan FAQ: ${err?.message || 'Gangguan koneksi'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  // DYNAMIC SELF-CHECK ENGINE (Zero Mock, Evaluates Actual Live Data)
  const runWebsiteSelfCheck = () => {
    const issues: { level: 'error' | 'warning' | 'pass'; title: string; desc: string }[] = [];
    let passedChecks = 0;
    const totalChecks = 8;

    // Check 1: Hero Configuration
    if (homepageConfig?.headline && homepageConfig.headline.trim().length >= 8) {
      issues.push({
        level: 'pass',
        title: 'Konfigurasi Hero & Headline Beranda',
        desc: `Headline aktif: "${homepageConfig.headline}". Sub-judul terisi ${homepageConfig.subtitle?.length || 0} karakter.`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'Konfigurasi Hero Perlu Dilengkapi',
        desc: 'Headline beranda masih singkat atau belum diisi dengan lengkap.'
      });
    }

    // Check 2: Running Text Header
    if (homepageConfig?.runningText && homepageConfig.runningText.trim().length > 0) {
      issues.push({
        level: 'pass',
        title: 'Teks Berita Berjalan (Running Header)',
        desc: `Pesan header aktif: "${homepageConfig.runningText}".`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'Running Text Belum Diatur',
        desc: 'Disarankan mengisi pesan pengumuman berjalan untuk informasi cepat wali murid.'
      });
    }

    // Check 3: Articles & News
    const publishedArticles = articles.filter(a => a.isPublished);
    if (publishedArticles.length >= 3) {
      issues.push({
        level: 'pass',
        title: 'Ketersediaan Berita & Informasi',
        desc: `${publishedArticles.length} artikel terbit siap tampil pada portal beranda dan arsip berita.`
      });
      passedChecks++;
    } else if (publishedArticles.length > 0) {
      issues.push({
        level: 'warning',
        title: 'Jumlah Berita Terbit Minimal',
        desc: `Hanya ada ${publishedArticles.length} artikel terbit. Disarankan minimal 3 artikel untuk tata letak beranda optimal.`
      });
    } else {
      issues.push({
        level: 'error',
        title: 'Belum Ada Artikel Berita Terbit',
        desc: 'Tidak ada artikel berita aktif untuk disajikan ke pengunjung publik.'
      });
    }

    // Check 4: Events & Calendar
    if (events.length >= 2) {
      issues.push({
        level: 'pass',
        title: 'Agenda Kegiatan Sekolah',
        desc: `${events.length} agenda kegiatan (Market Day, Manasik, PHBI, dsb.) aktif terdaftar.`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'Agenda Sekolah Terbatas',
        desc: `Tercatat ${events.length} agenda. Tambahkan agenda semester berjalan agar kalender publik lebih hidup.`
      });
    }

    // Check 5: Programs & Sentra
    if (programs.length >= 3) {
      issues.push({
        level: 'pass',
        title: 'Program Unggulan & Sentra Belajar',
        desc: `${programs.length} sentra pembelajaran PAUD Merdeka terkonfigurasi dengan ikon dan jadwal lengkap.`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'Program Sentra Perlu Ditambahkan',
        desc: `Hanya ${programs.length} sentra terdaftar. Tambahkan program sentra utama TK Asy Syifa Tanggul.`
      });
    }

    // Check 6: Public Teachers Profile
    if (teachers.length >= 4) {
      issues.push({
        level: 'pass',
        title: 'Profil Pendidik & Tenaga Kependidikan',
        desc: `${teachers.length} profil guru dan tenaga kependidikan terdaftar dengan kutipan keteladanan.`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'Profil Guru Belum Lengkap',
        desc: `Tercatat ${teachers.length} guru di profil publik. Lengkapi profil seluruh ustadzah pengajar.`
      });
    }

    // Check 7: Media Gallery
    if (gallery.length >= 4) {
      issues.push({
        level: 'pass',
        title: 'Galeri Foto & Album Dokumentasi',
        desc: `${gallery.length} foto kegiatan santri siap dinikmati di album galeri ceria.`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'Galeri Foto Masih Terbatas',
        desc: `Hanya ada ${gallery.length} foto galeri. Unggah foto kegiatan santri untuk membangun kepercayaan publik.`
      });
    }

    // Check 8: FAQs
    if (faqs.length >= 3) {
      issues.push({
        level: 'pass',
        title: 'Pusat Tanya Jawab (FAQ)',
        desc: `${faqs.length} butir pertanyaan umum orang tua terjawab secara jelas dan informatif.`
      });
      passedChecks++;
    } else {
      issues.push({
        level: 'warning',
        title: 'FAQ Perlu Ditambahkan',
        desc: `Tersedia ${faqs.length} FAQ. Lengkapi pertanyaan seputar PPDB, seragam, dan jadwal sekolah.`
      });
    }

    // Calculate factual score (0 - 100)
    const score = Math.round((passedChecks / totalChecks) * 100);

    setSelfCheckReport({
      score,
      issues
    });

    setFeedback({
      type: 'info',
      message: `Pemindaian mandiri selesai: Skor Kualitas Aktual ${score}/100 (${passedChecks}/${totalChecks} kriteria terpenuhi).`
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SIMSkeletonLoader type="dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CMS Header Section with AI Asy & Syifa */}
      <div className="bg-slate-900 border border-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Globe className="w-3.5 h-3.5" /> CMS Website Resmi
              </span>
              <span className="text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                TK ASY SYIFA TANGGUL
              </span>
              <span className="text-xs font-semibold text-stone-400">
                Operator: <strong className="text-stone-200">{actorName}</strong> ({canonicalRole || 'GUEST'})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pusat Pengelolaan Konten Website Resmi
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Kelola seluruh informasi publik madrasah: Beranda Hero, Berita, Agenda, Program Sentra, Profil Guru, Galeri, dan FAQ dengan sinkronisasi langsung ke Firestore.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={runWebsiteSelfCheck}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-2xl shadow-md flex items-center gap-2 text-xs transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-950" />
              Pindai Kualitas (Self Check)
            </button>
            <button
              type="button"
              onClick={loadAllData}
              disabled={loading || isSaving}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-2xl border border-stone-700 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Mascot Character Integration */}
        <div className="mt-6 pt-4 border-t border-stone-800/80">
          <AIAsyCharacterScene pageContext="dashboardAdmin" />
        </div>
      </div>

      {/* In-App Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : feedback.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
              {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />}
              {feedback.type === 'info' && <Info className="w-4 h-4 text-blue-700 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Production Lock Control Bar */}
      <ProductionLockManager />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200">
        {[
          { id: 'homepage', label: '1. Hero & Beranda', icon: Layout },
          { id: 'news', label: `2. Berita (${articles.length})`, icon: FileText },
          { id: 'events', label: `3. Agenda (${events.length})`, icon: Calendar },
          { id: 'programs', label: `4. Sentra (${programs.length})`, icon: BookOpen },
          { id: 'teachers', label: `5. Guru Publik (${teachers.length})`, icon: Users },
          { id: 'achievements', label: `6. Prestasi (${achievements.length})`, icon: Award },
          { id: 'gallery', label: `7. Galeri (${gallery.length})`, icon: ImageIcon },
          { id: 'faq', label: `8. FAQ (${faqs.length})`, icon: HelpCircle },
          { id: 'selfcheck', label: '9. Audit Kualitas', icon: ShieldCheck },
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HOMEPAGE BUILDER */}
      {activeTab === 'homepage' && homepageConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveHomepage} className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Layout className="w-5 h-5 text-emerald-700" /> Pengaturan Konten Hero & Identitas Utama
            </h3>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Judul Utama (Headline Hero)</label>
              <input
                type="text"
                value={homepageConfig.headline}
                onChange={e => setHomepageConfig({ ...homepageConfig, headline: e.target.value })}
                className="w-full p-3 border border-stone-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Sub-Judul / Deskripsi Hero</label>
              <textarea
                rows={3}
                value={homepageConfig.subtitle}
                onChange={e => setHomepageConfig({ ...homepageConfig, subtitle: e.target.value })}
                className="w-full p-3 border border-stone-300 rounded-xl text-stone-700 leading-relaxed focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">URL Foto Hero Utama</label>
                <input
                  type="text"
                  value={homepageConfig.heroImage}
                  onChange={e => setHomepageConfig({ ...homepageConfig, heroImage: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">URL Video Youtube Profil</label>
                <input
                  type="text"
                  value={homepageConfig.youtubeUrl}
                  onChange={e => setHomepageConfig({ ...homepageConfig, youtubeUrl: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Teks Tombol CTA Utama</label>
                <input
                  type="text"
                  value={homepageConfig.ctaText}
                  onChange={e => setHomepageConfig({ ...homepageConfig, ctaText: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Link CTA Utama</label>
                <input
                  type="text"
                  value={homepageConfig.ctaLink}
                  onChange={e => setHomepageConfig({ ...homepageConfig, ctaLink: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Teks Berita Berjalan (Running Text Header)</label>
              <input
                type="text"
                value={homepageConfig.runningText}
                onChange={e => setHomepageConfig({ ...homepageConfig, runningText: e.target.value })}
                className="w-full p-3 border border-stone-300 rounded-xl bg-amber-50 text-amber-950 font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Menyimpan ke Firestore...' : 'Simpan Perubahan Hero Homepage'}
            </button>
          </form>

          {/* Section Reorder Control Box */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900 border-b pb-2 flex items-center gap-2">
              <MoveUp className="w-4 h-4 text-emerald-700" /> Homepage Section Builder (Drag/Reorder)
            </h3>
            <p className="text-stone-500">
              Atur urutan modul tampilan pada beranda utama sekolah:
            </p>

            <div className="space-y-2">
              {homepageConfig.sectionOrder.map((sec, idx) => (
                <div key={sec} className="p-3 bg-white border border-stone-200 rounded-2xl flex items-center justify-between shadow-xs font-bold text-slate-800 capitalize">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {sec} Section
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === homepageConfig.sectionOrder.length - 1}
                      className="p-1 rounded-lg hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tips Homepage Builder
              </span>
              <p className="text-[11px] leading-relaxed text-emerald-900">
                Perubahan urutan akan langsung tersinkronisasi ke seluruh pengunjung website tanpa perlu penataan ulang manual.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BERITA & PENGUMUMAN */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" /> Kelola Artikel Berita Publik ({articles.length})
                </h3>
                <p className="text-stone-500 text-xs">Berita yang diterbitkan langsung tayang di portal beranda & arsip informasi sekolah.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle({ title: '', body: '', category: 'Berita', author: actorName })}
                className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tulis Berita Baru
              </button>
            </div>

            {/* Article Modal Form */}
            {editingArticle && (
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-3 text-xs">
                <h4 className="font-extrabold text-sm text-slate-900">{editingArticle.id ? 'Edit Artikel' : 'Tulis Artikel Berita Baru'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Judul Artikel</label>
                    <input
                      type="text"
                      value={editingArticle.title || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white font-bold"
                      placeholder="Masukkan judul berita ceria..."
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Kategori</label>
                    <select
                      value={editingArticle.category || 'Berita'}
                      onChange={e => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                      className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                    >
                      <option value="Berita">Berita Utama</option>
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Edukasi">Edukasi Parenting</option>
                      <option value="Kegiatan">Kegiatan Santri</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Isi Berita / Artikel</label>
                  <textarea
                    rows={4}
                    value={editingArticle.body || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, body: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white leading-relaxed"
                    placeholder="Tuliskan berita lengkap..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">URL Gambar Sampul</label>
                    <input
                      type="text"
                      value={editingArticle.image || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Penulis</label>
                    <input
                      type="text"
                      value={editingArticle.author || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, author: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveArticle}
                    disabled={isSaving || !editingArticle.title}
                    className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Menerbitkan...' : 'Terbitkan Berita'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {articles.length === 0 ? (
              <SIMEmptyState
                title="Belum Ada Artikel Berita"
                description="Belum ada artikel berita yang diterbitkan. Tulis artikel pertama untuk menyajikan kabar terkini madrasah."
                actionLabel="Tulis Berita Baru"
                onAction={() => setEditingArticle({ title: '', body: '', category: 'Berita', author: actorName })}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">Judul Artikel</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Penulis</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {articles.map(a => (
                      <tr key={a.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-slate-900">{a.title}</td>
                        <td className="p-3 font-semibold text-emerald-800">{a.category}</td>
                        <td className="p-3 text-stone-500 font-mono">{a.date}</td>
                        <td className="p-3 text-stone-600">{a.author}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => setEditingArticle(a)}
                            className="p-1.5 rounded-lg bg-stone-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AGENDA & ACARA */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" /> Agenda & Acara Sekolah ({events.length})
              </h3>
              <p className="text-stone-500">Agenda sekolah (Market Day, Manasik, Outing, Lomba, PHBI) langsung terisi ke beranda & kalender.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingEvent({ title: '', category: 'Market Day', time: '08:00 WIB', location: 'Halaman TK Asy Syifa Tanggul' })}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" /> Tambah Agenda Baru
            </button>
          </div>

          {editingEvent && (
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Form Agenda Sekolah</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Nama Acara / Agenda</label>
                  <input
                    type="text"
                    value={editingEvent.title || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                    placeholder="Contoh: Manasik Haji Cilik 1447 H"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kategori Agenda</label>
                  <select
                    value={editingEvent.category || 'Market Day'}
                    onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                  >
                    <option value="Market Day">Market Day</option>
                    <option value="Manasik">Manasik Haji Cilik</option>
                    <option value="Outing">Outing Class & Kunjungan</option>
                    <option value="Lomba">Lomba & Prestasi</option>
                    <option value="PHBI">PHBI (Hari Besar Islam)</option>
                    <option value="Hari Nasional">Hari Nasional / Kemerdekaan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editingEvent.date || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Waktu</label>
                  <input
                    type="text"
                    value={editingEvent.time || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                    placeholder="08:00 WIB"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={editingEvent.location || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={editingEvent.description || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                  placeholder="Keterangan agenda..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  disabled={isSaving || !editingEvent.title}
                  className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Agenda'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer hover:bg-stone-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {events.length === 0 ? (
            <SIMEmptyState
              title="Belum Ada Agenda Terdaftar"
              description="Belum ada agenda sekolah yang dicatat. Tambahkan agenda perdana untuk kalender akademik publik."
              actionLabel="Tambah Agenda Baru"
              onAction={() => setEditingEvent({ title: '', category: 'Market Day', time: '08:00 WIB', location: 'Halaman TK Asy Syifa Tanggul' })}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(ev => (
                <div key={ev.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                      {ev.category}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">{ev.date} • {ev.time}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">{ev.title}</h4>
                  <p className="text-stone-600 text-xs">{ev.description}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 font-semibold border-t border-stone-200">
                    <span>📍 {ev.location}</span>
                    <button
                      type="button"
                      onClick={() => setEditingEvent(ev)}
                      className="p-1 text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROGRAM & SENTRA */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" /> Program Unggulan & Sentra Belajar ({programs.length})
              </h3>
              <p className="text-stone-500">Kelola daftar sentra belajar KBM Kurikulum Merdeka PAUD TK Asy Syifa.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingProgram({ title: '', category: 'Sentra Belajar', icon: '🎨', ageGroup: '4-6 Tahun', schedule: 'Senin - Jumat' })}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" /> Tambah Sentra Baru
            </button>
          </div>

          {editingProgram && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Form Program Sentra</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Nama Sentra / Program</label>
                  <input
                    type="text"
                    value={editingProgram.title || ''}
                    onChange={e => setEditingProgram({ ...editingProgram, title: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                    placeholder="Contoh: Sentra Bahan Alam & Sains Cilik"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Ikon Emoji</label>
                  <input
                    type="text"
                    value={editingProgram.icon || '📖'}
                    onChange={e => setEditingProgram({ ...editingProgram, icon: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white text-center font-bold text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Deskripsi Kegiatan</label>
                <textarea
                  rows={2}
                  value={editingProgram.description || ''}
                  onChange={e => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                  placeholder="Kegiatan eksplorasi..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveProgram}
                  disabled={isSaving || !editingProgram.title}
                  className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Sentra'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProgram(null)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer hover:bg-stone-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {programs.length === 0 ? (
            <SIMEmptyState
              title="Belum Ada Program Sentra"
              description="Belum ada program sentra yang didaftarkan. Tambahkan sentra belajar untuk kurikulum PAUD."
              actionLabel="Tambah Sentra Baru"
              onAction={() => setEditingProgram({ title: '', category: 'Sentra Belajar', icon: '🎨', ageGroup: '4-6 Tahun', schedule: 'Senin - Jumat' })}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {programs.map(pr => (
                <div key={pr.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-3xl block">{pr.icon}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-2">{pr.title}</h4>
                    <p className="text-stone-600 text-xs leading-relaxed mt-1">{pr.description}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-800 font-bold border-t border-stone-200">
                    <span>{pr.ageGroup}</span>
                    <button
                      type="button"
                      onClick={() => setEditingProgram(pr)}
                      className="text-stone-500 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PROFIL GURU PUBLIK */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" /> Profil Pendidik & Tenaga Kependidikan Publik ({teachers.length})
              </h3>
              <p className="text-stone-500">Kelola profil ustadzah dan tenaga kependidikan yang tampil di halaman profil website.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingTeacher({ name: '', title: 'S.Pd.', position: 'Guru Sentra', photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400', quote: 'Mendidik dengan kasih sayang.' })}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" /> Tambah Profil Guru
            </button>
          </div>

          {editingTeacher && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Form Profil Pendidik</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={editingTeacher.name || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                    placeholder="Ustadzah..."
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Peran / Jabatan</label>
                  <input
                    type="text"
                    value={editingTeacher.position || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, position: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                    placeholder="Kepala Sekolah / Guru Sentra..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">URL Foto Profil</label>
                  <input
                    type="text"
                    value={editingTeacher.photoUrl || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, photoUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kutipan / Motto Pendidik</label>
                  <input
                    type="text"
                    value={editingTeacher.quote || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, quote: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                    placeholder="Motto pendidikan islami..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveTeacher}
                  disabled={isSaving || !editingTeacher.name}
                  className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Profil Guru'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer hover:bg-stone-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {teachers.length === 0 ? (
            <SIMEmptyState
              title="Belum Ada Profil Guru Publik"
              description="Belum ada data pendidik yang ditambahkan. Daftarkan profil guru pengajar TK Asy Syifa."
              actionLabel="Tambah Profil Guru"
              onAction={() => setEditingTeacher({ name: '', title: 'S.Pd.', position: 'Guru Sentra', photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400', quote: 'Mendidik dengan kasih sayang.' })}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teachers.map(t => (
                <div key={t.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center text-center space-y-2">
                  <img src={t.photoUrl} alt={t.name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-600 shadow-xs" />
                  <h4 className="font-extrabold text-sm text-slate-900 mt-1">{t.name}</h4>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {t.position}
                  </span>
                  {t.quote && (
                    <p className="text-stone-500 italic text-[11px] leading-relaxed">"{t.quote}"</p>
                  )}
                  <div className="pt-2 w-full flex justify-end border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingTeacher(t)}
                      className="text-stone-500 hover:text-emerald-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PRESTASI SANTRI */}
      {activeTab === 'achievements' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" /> Prestasi & Penghargaan Santri ({achievements.length})
              </h3>
              <p className="text-stone-500">Catatan raihan prestasi kejuaraan santri (Tahfidz, Mewarnai, Dai Cilik, dsb.)</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingAchievement({ title: '', category: 'Tahfidz & Keagamaan', year: new Date().getFullYear().toString(), winnerName: 'Santri Ceria', level: 'Tingkat Kabupaten', badgeIcon: '🏆' })}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" /> Tambah Prestasi
            </button>
          </div>

          {editingAchievement && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Form Prestasi Santri</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Nama Kejuaraan / Prestasi</label>
                  <input
                    type="text"
                    value={editingAchievement.title || ''}
                    onChange={e => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                    placeholder="Contoh: Juara 1 Lomba Tahfidz Juz 30"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Santri Peraih</label>
                  <input
                    type="text"
                    value={editingAchievement.winnerName || ''}
                    onChange={e => setEditingAchievement({ ...editingAchievement, winnerName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tingkat / Level</label>
                  <input
                    type="text"
                    value={editingAchievement.level || ''}
                    onChange={e => setEditingAchievement({ ...editingAchievement, level: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                    placeholder="Tingkat Kabupaten / Kecamatan"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tahun Perolehan</label>
                  <input
                    type="text"
                    value={editingAchievement.year || ''}
                    onChange={e => setEditingAchievement({ ...editingAchievement, year: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                    placeholder="2026"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Ikon Badge</label>
                  <input
                    type="text"
                    value={editingAchievement.badgeIcon || '🏆'}
                    onChange={e => setEditingAchievement({ ...editingAchievement, badgeIcon: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white text-center font-bold text-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAchievement}
                  disabled={isSaving || !editingAchievement.title}
                  className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Prestasi'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAchievement(null)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer hover:bg-stone-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {achievements.length === 0 ? (
            <SIMEmptyState
              title="Belum Ada Rekaman Prestasi"
              description="Belum ada data prestasi yang dicatat. Tambahkan kejuaraan santri untuk dipublikasikan."
              actionLabel="Tambah Prestasi"
              onAction={() => setEditingAchievement({ title: '', category: 'Tahfidz & Keagamaan', year: new Date().getFullYear().toString(), winnerName: 'Santri Ceria', level: 'Tingkat Kabupaten', badgeIcon: '🏆' })}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(a => (
                <div key={a.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{a.badgeIcon}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{a.title}</h4>
                      <p className="text-emerald-800 font-bold text-xs mt-0.5">{a.winnerName}</p>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">{a.level} • {a.year}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingAchievement(a)}
                    className="text-stone-500 hover:text-emerald-800 p-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: GALERI FOTO & ALBUM */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" /> Galeri Foto & Album Kegiatan ({gallery.length})
              </h3>
              <p className="text-stone-500">Unggah foto dokumentasi kegiatan santri untuk publikasi website & wali murid.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingMedia({ title: '', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800', category: 'Kegiatan Ceria' })}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" /> Tambah Foto Galeri
            </button>
          </div>

          {editingMedia && (
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Upload & Kelola Galeri Foto</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Judul / Caption Foto</label>
                  <input
                    type="text"
                    value={editingMedia.title || ''}
                    onChange={e => setEditingMedia({ ...editingMedia, title: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white font-bold"
                    placeholder="Contoh: Senyum Ceria Manasik Haji"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kategori / Album</label>
                  <input
                    type="text"
                    value={editingMedia.category || 'Kegiatan Ceria'}
                    onChange={e => setEditingMedia({ ...editingMedia, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">URL Foto Gambar</label>
                <input
                  type="text"
                  value={editingMedia.url || ''}
                  onChange={e => setEditingMedia({ ...editingMedia, url: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                />
              </div>

              {editingMedia.url && (
                <div className="p-3 bg-white border rounded-xl flex items-center gap-4">
                  <img src={editingMedia.url} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-xs" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold block text-emerald-900">Pratinjau Foto Valid</span>
                    <p className="text-stone-500">Rasio otomatis disesuaikan untuk tampilan album beranda & galeri.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveMedia}
                  disabled={isSaving || !editingMedia.title || !editingMedia.url}
                  className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Foto Galeri'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer hover:bg-stone-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {gallery.length === 0 ? (
            <SIMEmptyState
              title="Belum Ada Foto di Galeri"
              description="Belum ada foto yang diunggah. Tambahkan dokumentasi foto kegiatan pertama madrasah."
              actionLabel="Tambah Foto Galeri"
              onAction={() => setEditingMedia({ title: '', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800', category: 'Kegiatan Ceria' })}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(med => (
                <div key={med.id} className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden group shadow-xs flex flex-col justify-between">
                  <div className="h-32 bg-stone-200 relative overflow-hidden">
                    <img src={med.url} alt={med.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-2 left-2 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded-full font-mono">
                      {med.category}
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 truncate">{med.title}</h5>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">{med.dateAdded}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingMedia(med)}
                      className="p-1 text-stone-500 hover:text-emerald-800 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: TANYA JAWAB (FAQ) */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700" /> Pusat Tanya Jawab (FAQ) ({faqs.length})
              </h3>
              <p className="text-stone-500">Kelola daftar pertanyaan yang sering diajukan calon wali murid seputar PPDB dan kurikulum.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingFAQ({ question: '', answer: '', category: 'Umum' })}
              className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" /> Tambah FAQ Baru
            </button>
          </div>

          {editingFAQ && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-300 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Form Pertanyaan & Jawaban</h4>
              <div>
                <label className="block font-bold mb-1">Pertanyaan (Question)</label>
                <input
                  type="text"
                  value={editingFAQ.question || ''}
                  onChange={e => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white font-bold"
                  placeholder="Contoh: Bagaimana prosedur pendaftaran santri baru?"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Jawaban Lengkap (Answer)</label>
                <textarea
                  rows={3}
                  value={editingFAQ.answer || ''}
                  onChange={e => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white leading-relaxed"
                  placeholder="Tuliskan penjelasan resmi..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveFAQ}
                  disabled={isSaving || !editingFAQ.question || !editingFAQ.answer}
                  className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan FAQ'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFAQ(null)}
                  className="px-4 py-2.5 bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer hover:bg-stone-300"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {faqs.length === 0 ? (
            <SIMEmptyState
              title="Belum Ada FAQ"
              description="Belum ada daftar tanya jawab yang dicatat. Buat FAQ untuk memudahkan calon wali murid."
              actionLabel="Tambah FAQ Baru"
              onAction={() => setEditingFAQ({ question: '', answer: '', category: 'Umum' })}
            />
          ) : (
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={f.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-start gap-2">
                      <span className="text-emerald-700 font-black">Q{i + 1}.</span> {f.question}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingFAQ(f)}
                      className="text-stone-500 hover:text-emerald-800 p-1 cursor-pointer shrink-0"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed pl-6">{f.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 9: AUDIT HEALTH & QUALITY (SELF CHECK) */}
      {activeTab === 'selfcheck' && (
        <div className="space-y-6">
          {/* AI Website Advisor 2.0 */}
          <AIWebsiteAdvisor2 />

          {/* Self Check Health Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Pemeriksaan Mutu Konten Aktual
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" /> Website Quality & Health Audit
                </h3>
                <p className="text-stone-500">Pemeriksaan integritas dan kelengkapan konten website resmi berdasarkan basis data terkini.</p>
              </div>

              <button
                type="button"
                onClick={runWebsiteSelfCheck}
                className="px-6 py-3 bg-emerald-800 text-white font-extrabold rounded-2xl shadow-md hover:bg-emerald-700 cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Mulai Pemindaian Konten
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-3xl font-black text-emerald-900 block">
                  {selfCheckReport ? `${selfCheckReport.score}/100` : 'Siap'}
                </span>
                <span className="text-stone-600 font-bold text-[11px]">Skor Kelengkapan Aktual</span>
              </div>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200">
                <span className="text-3xl font-black text-teal-900 block">{articles.length}</span>
                <span className="text-stone-600 font-bold text-[11px]">Artikel Berita Terbit</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-3xl font-black text-amber-900 block">{events.length}</span>
                <span className="text-stone-600 font-bold text-[11px]">Agenda Kegiatan Aktif</span>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="text-3xl font-black text-purple-900 block">{gallery.length}</span>
                <span className="text-stone-600 font-bold text-[11px]">Foto Galeri Terdokumentasi</span>
              </div>
            </div>

            {selfCheckReport && (
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-sm text-slate-900">Rincian Hasil Evaluasi Konten:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selfCheckReport.issues.map((iss, i) => (
                    <div key={i} className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3">
                      {iss.level === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                      {iss.level === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                      {iss.level === 'error' && <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">{iss.title}</h5>
                        <p className="text-stone-600 text-[11px] leading-relaxed mt-0.5">{iss.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Final Release Candidate Audit Report */}
          <FinalReleaseCandidateReport />
        </div>
      )}
    </div>
  );
};
