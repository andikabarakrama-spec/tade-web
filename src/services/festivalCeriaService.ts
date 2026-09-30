/**
 * TADE FESTIVAL CERIA SERVICE (SPRINT G18 — FESTIVAL CERIA ASY & SYIFA)
 * 
 * Manages:
 * P1 — Gerbang Festival (Balon, Bendera, Pita, Bunga, Asy & Syifa menyambut)
 * P2 — Panggung Ceria (Pentas seni, Hafalan, Menyanyi, Wisuda; Asy MC, Syifa tepuk tangan)
 * P3 — Karnaval Kampung (20-second parade: Kereta Cerita, Bus Sekolah, Balon, Kupu-kupu, Sahabat)
 * P4 — Balon Harapan (Balon interaktif terbang dengan untaian doa dan kata mutiara)
 * P5 — Stan Ceria (Stan Buku, Bunga, Balon, Buah, Mainan — bagian dari narasi cerita)
 * P6 — Foto Bersama (Spot foto Asy, Syifa & sahabat, background adaptif acara, ekspor Creative Studio)
 * P7 — Penutup Festival (Semua tokoh berkumpul mengucapkan "Terima kasih!", hujan konfeti)
 * 
 * Automation & Event-Driven:
 * - Terintegrasi dengan LivingEventEngine (PPDB, Milad TK, Wisuda, Ramadhan, Kemerdekaan, dll)
 * - Black Box Recorder (Ring 2) Logging
 * - Dr. Pulse Performance (Max 5 active animations, 60 FPS target)
 */

import { LivingEventEngine, SchoolEventType, SchoolEventTheme } from './livingEventEngine';
import { blackBoxRecorder } from './blackBoxRecorder';
import { tadeSoundEngine } from './tadeSoundEngine';

export interface WishBalloon {
  id: string;
  color: string;
  emoji: string;
  quote: string;
  author: string;
  isPoppedOrFlown?: boolean;
}

export interface StagePerformance {
  id: string;
  category: 'HAFALAN' | 'PENTAS_SENI' | 'MENYANYI' | 'WISUDA';
  title: string;
  performer: string;
  description: string;
  characterEmoji: string;
  speechText: string;
  mcAnnouncement: string;
  audioKey?: string;
}

export interface FestivalBooth {
  id: string;
  title: string;
  category: 'BUKU' | 'BUNGA' | 'BALON' | 'BUAH' | 'MAINAN';
  keeper: string;
  icon: string;
  color: string;
  storySnippet: string;
  wholesomeMessage: string;
}

export interface FestivalPhotoCard {
  id: string;
  eventName: string;
  timestamp: string;
  caption: string;
  frameStyle: string;
  participants: string[];
}

const STORAGE_FESTIVAL_PHOTOS = 'tade_g18_festival_photos_v1';
const STORAGE_FESTIVAL_STATE = 'tade_g18_festival_state_v1';

export class FestivalCeriaService {
  private static instance: FestivalCeriaService | null = null;
  private livingEventEngine: LivingEventEngine;

  private isFestivalActive: boolean = false;
  private activeEventOverride: SchoolEventType | null = null;
  private isCarnivalRunning: boolean = false;
  private carnivalProgress: number = 0; // 0 - 100%
  private carnivalTimer: any = null;
  private isClosingCeremonyActive: boolean = false;
  private listeners: (() => void)[] = [];

  public static getInstance(): FestivalCeriaService {
    if (!FestivalCeriaService.instance) {
      FestivalCeriaService.instance = new FestivalCeriaService();
    }
    return FestivalCeriaService.instance;
  }

  private constructor() {
    this.livingEventEngine = LivingEventEngine.getInstance();
    this.initStatus();
  }

  private initStatus() {
    try {
      const saved = localStorage.getItem(STORAGE_FESTIVAL_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.isFestivalActive = parsed.isFestivalActive ?? false;
        this.activeEventOverride = parsed.activeEventOverride ?? null;
      } else {
        // Auto-check if current living event is an active event
        const currentEvent = this.livingEventEngine.getActiveEvent();
        if (currentEvent && currentEvent.eventId !== 'REGULAR_DAY') {
          this.isFestivalActive = true;
        }
      }
    } catch {
      this.isFestivalActive = false;
    }
  }

  private saveStatus() {
    try {
      localStorage.setItem(STORAGE_FESTIVAL_STATE, JSON.stringify({
        isFestivalActive: this.isFestivalActive,
        activeEventOverride: this.activeEventOverride
      }));
    } catch (e) {
      console.warn('Failed to save festival state', e);
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- Core Event Detection & Festival Control ---

  public getCurrentTheme(): SchoolEventTheme {
    return this.livingEventEngine.getActiveEvent();
  }

  public isFestivalOpen(): boolean {
    // If explicitly turned on or living event is active school event
    const current = this.getCurrentTheme();
    return this.isFestivalActive || (current && current.eventId !== 'REGULAR_DAY');
  }

  public toggleFestivalStatus(active: boolean, eventType?: SchoolEventType) {
    this.isFestivalActive = active;
    if (eventType) {
      this.activeEventOverride = eventType;
      this.livingEventEngine.setManualOverride(eventType);
    }
    this.saveStatus();

    if (active) {
      blackBoxRecorder.record({
        moduleCode: 'FESTIVAL-CERIA',
        category: 'ACTION',
        eventType: 'ACTION',
        details: `Festival Ceria Asy & Syifa resmi dibuka untuk acara: ${this.getCurrentTheme().title}`,
        severity: 'INFO',
        route: '/garden/festival'
      });
      tadeSoundEngine.playFx('PARADE_MARCH');
    } else {
      blackBoxRecorder.record({
        moduleCode: 'FESTIVAL-CERIA',
        category: 'ACTION',
        eventType: 'ACTION',
        details: 'Festival Ceria Asy & Syifa ditutup, suasana kembali normal.',
        severity: 'INFO',
        route: '/garden/festival'
      });
    }

    this.notify();
  }

  // --- P1: Gerbang Festival ---
  public getGerbangDetails() {
    const theme = this.getCurrentTheme();
    return {
      title: `Gerbang Pesta: ${theme.title}`,
      badge: theme.badge,
      decorations: ['🎈 Balon Pelangi', '🚩 Bendera Warna-Warni', '🎀 Pita Emas', '🌸 Bunga Melati Mekar'],
      asyWelcome: `“Ahlan wa Sahlan di ${theme.title}! Selamat datang adik-adik dan asatidz tercinta!”`,
      syifaGreeting: `“Assalamu’alaikum! Mari kita semarakkan festival dengan hati gembira dan penuh berkah!”`,
      themeBg: theme.bgGradient,
      accentColor: theme.accentColor
    };
  }

  // --- P2: Panggung Ceria ---
  public getStagePerformances(): StagePerformance[] {
    const theme = this.getCurrentTheme();
    return [
      {
        id: 'perf_hafalan',
        category: 'HAFALAN',
        title: 'Lantunan Surat Pendek & Doa Pilihan',
        performer: 'Santri Cilik Asy & Sahabat',
        description: 'Pembacaan Surat An-Nas, Al-Falaq, Al-Ikhlas dengan tartil merdu dan penuh adab.',
        characterEmoji: '👦📖',
        speechText: '“Bismillahir-rahmanir-rahim... Qul huwallahu ahad. Allahus-samad...”',
        mcAnnouncement: '“Masya Allah, tepuk tangan yang meriah untuk lantunan hafalan Al-Qur’an ananda santri cilik kita!”',
        audioKey: 'MASJID_BELL'
      },
      {
        id: 'perf_pentas_seni',
        category: 'PENTAS_SENI',
        title: 'Gerak & Lagu Sahabat Kampung Ceria',
        performer: 'Bubu, Gogo, Mimi, Dodo, Titi, Rara',
        description: 'Tarian gerak ceria mengajak anak-anak bersyukur dan menjaga alam semesta.',
        characterEmoji: '🐰🐻🐝',
        speechText: '“Satu satu aku sayang Allah, dua dua juga sayang Rasulullah, tiga tiga sayang Ayah Ibu!”',
        mcAnnouncement: '“Lihat betapa kompaknya Bubu, Gogo, Mimi, dan seluruh sahabat menari dengan riang gembira!”',
        audioKey: 'MAGIC_SPARKLE'
      },
      {
        id: 'perf_menyanyi',
        category: 'MENYANYI',
        title: 'Nasyid Mars TK Asy Syifa Tanggul',
        performer: 'Paduan Suara Santriwati Cilik',
        description: 'Lagu kebanggaan sekolah tentang semangat menuntut ilmu, berakhlak mulia, dan cinta tanah air.',
        characterEmoji: '👧🎶',
        speechText: '“TK Asy Syifa tempat kami belajar, menyemai iman dan budi pekerti luhur nan bersinar!”',
        mcAnnouncement: '“Alhamdulillah, suara merdu ananda menghangatkan seluruh panggung festival hari ini!”',
        audioKey: 'TV_JINGLE'
      },
      {
        id: 'perf_wisuda',
        category: 'WISUDA',
        title: 'Prosesi Pengalungan Medali & Doa Kelulusan',
        performer: 'Kepala Sekolah & Wisudawan Cilik',
        description: 'Momen penuh haru dan doa berkah untuk santri cilik yang siap melangkah ke jenjang selanjutnya.',
        characterEmoji: '🎓⭐',
        speechText: '“Kami berjanji akan selalu rajin sholat, taat pada orang tua, dan cinta Al-Qur’an selamanya.”',
        mcAnnouncement: '“Selamat atas kelulusan santriwan-santriwati tercinta! Semoga ilmu ananda menjadi berkah dunia akhirat.”',
        audioKey: 'PARADE_FANFARE'
      }
    ];
  }

  public recordStagePerformance(perfId: string) {
    blackBoxRecorder.record({
      moduleCode: 'FESTIVAL-CERIA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Pertunjukan panggung ditampilkan: ${perfId}`,
      severity: 'INFO',
      route: '/garden/festival'
    });
  }

  // --- P3: Karnaval Kampung (20 Detik) ---
  public startCarnival(): void {
    if (this.isCarnivalRunning) return;

    this.isCarnivalRunning = true;
    this.carnivalProgress = 0;
    tadeSoundEngine.playFx('PARADE_MARCH');

    blackBoxRecorder.record({
      moduleCode: 'FESTIVAL-CERIA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Karnaval 20 detik Kampung Ceria resmi dimulai melintasi rute festival.',
      severity: 'INFO',
      route: '/garden/festival'
    });

    this.notify();

    // 20-second parade timeline (update progress every 200ms -> 100 steps)
    const stepTime = 200;
    const totalSteps = (20 * 1000) / stepTime;
    let stepCount = 0;

    if (this.carnivalTimer) clearInterval(this.carnivalTimer);

    this.carnivalTimer = setInterval(() => {
      stepCount++;
      this.carnivalProgress = Math.min(100, Math.round((stepCount / totalSteps) * 100));
      this.notify();

      if (stepCount >= totalSteps) {
        clearInterval(this.carnivalTimer);
        this.carnivalTimer = null;
        this.isCarnivalRunning = false;
        tadeSoundEngine.playFx('CELEBRATION');
        this.notify();
      }
    }, stepTime);
  }

  public stopCarnival(): void {
    if (this.carnivalTimer) {
      clearInterval(this.carnivalTimer);
      this.carnivalTimer = null;
    }
    this.isCarnivalRunning = false;
    this.carnivalProgress = 100;
    this.notify();
  }

  public getCarnivalStatus(): { isRunning: boolean; progress: number } {
    return {
      isRunning: this.isCarnivalRunning,
      progress: this.carnivalProgress
    };
  }

  // --- P4: Balon Harapan ---
  public getWishBalloons(): WishBalloon[] {
    return [
      { id: 'b1', color: 'from-rose-400 to-red-500', emoji: '🎈', quote: 'Semangat belajar setiap hari!', author: 'Asy' },
      { id: 'b2', color: 'from-amber-400 to-orange-500', emoji: '🌟', quote: 'Rajin berdoa & bersyukur selalu.', author: 'Syifa' },
      { id: 'b3', color: 'from-emerald-400 to-teal-500', emoji: '🌱', quote: 'Suka berbagi sayur & kebaikan.', author: 'Bubu' },
      { id: 'b4', color: 'from-sky-400 to-blue-600', emoji: '🕊️', quote: 'Sayang teman, sabar, dan tolong-menolong.', author: 'Gogo' },
      { id: 'b5', color: 'from-pink-400 to-rose-500', emoji: '🍯', quote: 'Berkata yang baik atau diam santun.', author: 'Mimi' },
      { id: 'b6', color: 'from-yellow-400 to-amber-500', emoji: '🦆', quote: 'Disiplin dan jaga kebersihan lingkungan.', author: 'Dodo' },
      { id: 'b7', color: 'from-indigo-400 to-purple-500', emoji: '🐢', quote: 'Istiqomah dan pantang menyerah.', author: 'Titi' },
      { id: 'b8', color: 'from-teal-400 to-cyan-600', emoji: '🦜', quote: 'Gemar melantunkan sholawat Nabi.', author: 'Rara' }
    ];
  }

  public recordWishReleased(balloon: WishBalloon) {
    blackBoxRecorder.record({
      moduleCode: 'FESTIVAL-CERIA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Balon harapan terbang: "${balloon.quote}" oleh ${balloon.author}`,
      severity: 'INFO',
      route: '/garden/festival'
    });
    tadeSoundEngine.playFx('MAGIC_SPARKLE');
  }

  // --- P5: Stan Ceria (Storytelling) ---
  public getFestivalBooths(): FestivalBooth[] {
    return [
      {
        id: 'booth_buku',
        title: 'Stan Buku Cerita Islami',
        category: 'BUKU',
        keeper: 'Ustadzah & Syifa',
        icon: '📚',
        color: 'from-blue-500 to-indigo-600',
        storySnippet: 'Membaca kisah 25 Nabi dan teladan para sahabat yang penuh hikmah dan keberanian.',
        wholesomeMessage: 'Buku adalah jendela kebaikan dan sahabat terbaik penuntut ilmu.'
      },
      {
        id: 'booth_bunga',
        title: 'Stan Bunga Melati Asri',
        category: 'BUNGA',
        keeper: 'Mimi si Lebah Manis',
        icon: '🌸',
        color: 'from-pink-500 to-rose-600',
        storySnippet: 'Mimi merawat bunga-bunga dengan kasih sayang dan membagikan keharumannya ke penjuru kampung.',
        wholesomeMessage: 'Hati yang bersih senantiasa menebarkan wangi kebaikan kepada sesama.'
      },
      {
        id: 'booth_balon',
        title: 'Stan Balon Harapan Pelangi',
        category: 'BALON',
        keeper: 'Pak Badut Sahabat & Rara',
        icon: '🎈',
        color: 'from-amber-400 to-orange-500',
        storySnippet: 'Setiap balon membawa cita-cita mulia santri cilik yang melambung tinggi ke angkasa.',
        wholesomeMessage: 'Gantungkan cita-citamu setinggi bintang, kokohkan dengan doa dan adab.'
      },
      {
        id: 'booth_buah',
        title: 'Stan Buah Segar Kebun Berkah',
        category: 'BUAH',
        keeper: 'Bubu & Dodo',
        icon: '🍎',
        color: 'from-emerald-500 to-teal-600',
        storySnippet: 'Apel manis, pisang ranum, dan wortel renyah dipetik langsung dari kebun sekolah yang subur.',
        wholesomeMessage: 'Makanan halal dan bergizi membuat badan sehat, cerdas, dan kuat beribadah.'
      },
      {
        id: 'booth_mainan',
        title: 'Stan Mainan Edukasi Kayu',
        category: 'MAINAN',
        keeper: 'Gogo & Titi',
        icon: '🧩',
        color: 'from-purple-500 to-violet-600',
        storySnippet: 'Balok kayu susun huruf Hijaiyah, puzzle hewan, dan kereta kayu buatan tangan.',
        wholesomeMessage: 'Bermain bersama sahabat melatih kerjasama, kesabaran, dan rasa saling menghargai.'
      }
    ];
  }

  // --- P6: Foto Bersama (Photo Spot) ---
  public getSavedPhotos(): FestivalPhotoCard[] {
    try {
      const data = localStorage.getItem(STORAGE_FESTIVAL_PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public savePhotoCard(caption: string, frameStyle: string): FestivalPhotoCard {
    const theme = this.getCurrentTheme();
    const newCard: FestivalPhotoCard = {
      id: `photo_${Date.now()}`,
      eventName: theme.title,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      caption: caption || 'Momen Bahagia Festival Ceria Asy & Syifa',
      frameStyle,
      participants: ['Asy', 'Syifa', 'Bubu', 'Gogo', 'Mimi', 'Dodo', 'Titi', 'Rara']
    };

    const list = this.getSavedPhotos();
    list.unshift(newCard);
    try {
      localStorage.setItem(STORAGE_FESTIVAL_PHOTOS, JSON.stringify(list.slice(0, 20)));
    } catch (e) {
      console.warn('Failed to persist photo', e);
    }

    blackBoxRecorder.record({
      moduleCode: 'FESTIVAL-CERIA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `Foto festival dibuat: "${newCard.caption}" pada acara ${theme.title}`,
      severity: 'INFO',
      route: '/garden/festival'
    });

    tadeSoundEngine.playFx('STICKER_UNLOCK');
    this.notify();
    return newCard;
  }

  // --- P7: Penutup Festival ---
  public triggerClosingCeremony(): void {
    this.isClosingCeremonyActive = true;
    tadeSoundEngine.playFx('CELEBRATION');
    this.notify();

    blackBoxRecorder.record({
      moduleCode: 'FESTIVAL-CERIA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: 'Upacara penutupan festival dilangsungkan dengan ucapan terima kasih dan hujan konfeti.',
      severity: 'INFO',
      route: '/garden/festival'
    });

    // Auto-close after celebration (6 seconds)
    setTimeout(() => {
      this.isClosingCeremonyActive = false;
      this.notify();
    }, 6000);
  }

  public isClosingActive(): boolean {
    return this.isClosingCeremonyActive;
  }
}

export const festivalCeriaService = FestivalCeriaService.getInstance();
