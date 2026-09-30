import { TADENotification, NotificationCategory, NotificationCategoryMeta } from '../types/notification';

export const NOTIFICATION_CATEGORIES: Record<NotificationCategory, NotificationCategoryMeta> = {
  pengumuman: {
    id: 'pengumuman',
    label: 'Pengumuman Sekolah',
    icon: 'Megaphone',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    targetTab: 'w3'
  },
  ppdb: {
    id: 'ppdb',
    label: 'PPDB Online',
    icon: 'UserPlus',
    color: 'text-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    targetTab: 'w4'
  },
  absensi: {
    id: 'absensi',
    label: 'Presensi Siswa',
    icon: 'CalendarCheck',
    color: 'text-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    targetTab: 'r6'
  },
  infaq_spp: {
    id: 'infaq_spp',
    label: 'Infaq / SPP',
    icon: 'CreditCard',
    color: 'text-rose-600',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    targetTab: 'r10'
  },
  tabungan: {
    id: 'tabungan',
    label: 'Tabungan Siswa',
    icon: 'PiggyBank',
    color: 'text-teal-600',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    targetTab: 'r11'
  },
  pesan_guru: {
    id: 'pesan_guru',
    label: 'Pesan Guru',
    icon: 'MessageCircle',
    color: 'text-purple-600',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    targetTab: 'r54'
  },
  agenda: {
    id: 'agenda',
    label: 'Agenda Besok',
    icon: 'Calendar',
    color: 'text-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    targetTab: 'w1'
  },
  tahfidz: {
    id: 'tahfidz',
    label: 'Mutabaah Tahfidz',
    icon: 'BookOpen',
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    targetTab: 'r17'
  }
};

const STORAGE_KEY = 'tade_notifications_store_v1';

const INITIAL_NOTIFICATIONS: TADENotification[] = [
  {
    id: 'notif-1',
    category: 'pengumuman',
    title: 'Peringatan Isra Miraj & Libur Nasional',
    body: 'Kegiatan belajar mengajar diliburkan besok dalam rangka memperingati Isra Miraj Nabi Muhammad SAW.',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    read: false,
    actionTab: 'w3',
    sender: 'Kepala Sekolah TK Asy Syifa'
  },
  {
    id: 'notif-2',
    category: 'tahfidz',
    title: 'Ziyadah Surah An-Naba Ayat 1-10',
    body: 'Alhamdulillah ananda telah menyelesaikan setoran hafalan Surah An-Naba ayat 1-10 dengan predikat Mumtaz.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    read: false,
    actionTab: 'r17',
    sender: 'Ustadzah Halimah (Guru Tahfidz)'
  },
  {
    id: 'notif-3',
    category: 'absensi',
    title: 'Presensi Masuk Terkonfirmasi',
    body: 'Ananda telah tiba di sekolah pukul 07:15 WIB dalam kondisi ceria dan siap belajar.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    read: false,
    actionTab: 'r6',
    sender: 'Sistem Presensi Digital TADE'
  },
  {
    id: 'notif-4',
    category: 'agenda',
    title: 'Agenda Besok: Outing Class Manasik Haji Cilik',
    body: 'Mohon ananda mengenakan pakaian ihram putih dan membawa bekal air minum serta makanan ringan.',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    read: true,
    actionTab: 'w1',
    sender: 'Koordinator Kesiswaan'
  },
  {
    id: 'notif-5',
    category: 'infaq_spp',
    title: 'Kwitansi SPP Bulan Ini Telah Terbit',
    body: 'Pembayaran SPP dan Infaq Pengembangan telah diverifikasi bendahara. Terima kasih atas partisipasi Ayah/Bunda.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    actionTab: 'r10',
    sender: 'Bendahara Sekolah'
  },
  {
    id: 'notif-6',
    category: 'ppdb',
    title: 'Gelombang 1 PPDB 2026/2027 Dibuka',
    body: 'Pendaftaran Peserta Didik Baru Tahun Ajaran 2026/2027 telah dibuka secara daring.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    actionTab: 'w4',
    sender: 'Panitia PPDB'
  }
];

class NotificationService {
  private notifications: TADENotification[] = [];
  private listeners: Array<(notifications: TADENotification[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      } else {
        this.notifications = INITIAL_NOTIFICATIONS;
        this.saveToStorage();
      }
    } catch {
      this.notifications = INITIAL_NOTIFICATIONS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
      this.notifyListeners();
    } catch (e) {
      console.warn('Gagal menyimpan notifikasi ke localStorage:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn([...this.notifications]));
  }

  public subscribe(listener: (notifications: TADENotification[]) => void) {
    this.listeners.push(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getNotifications(): TADENotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(id: string) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.saveToStorage();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.saveToStorage();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
  }

  public clearAll() {
    this.notifications = [];
    this.saveToStorage();
  }

  public addNotification(notification: Omit<TADENotification, 'id' | 'timestamp' | 'read'> & { id?: string; timestamp?: string }) {
    const newNotif: TADENotification = {
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: notification.category,
      title: notification.title,
      body: notification.body,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false,
      actionUrl: notification.actionUrl,
      actionTab: notification.actionTab || NOTIFICATION_CATEGORIES[notification.category]?.targetTab || 'w1',
      sender: notification.sender,
      meta: notification.meta
    };

    this.notifications = [newNotif, ...this.notifications];
    this.saveToStorage();

    // Trigger local audio chime if allowed
    this.playChime();

    return newNotif;
  }

  private playChime() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted before gesture
    }
  }
}

export const notificationService = new NotificationService();
