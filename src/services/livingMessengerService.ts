/**
 * TADE LIVING MESSENGER SERVICE — SPRINT G7 (P3)
 * Signature Sovereign Messaging Engine with Butterfly Delivery,
 * Asy & Syifa Reactions, Voice Bubbles, Smart Replies, and Islamic Emoji Pack.
 */

export interface LivingReaction {
  id: string;
  name: string;
  emoji: string;
  avatarType?: 'ASY' | 'SYIFA' | 'ISLAMIC';
  count: number;
  users: string[];
}

export interface LivingVoiceNote {
  durationSec: number;
  waveform: number[]; // e.g. [30, 60, 90, 45, 80, ...]
  audioUrl?: string;
}

export type LivingMessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';

export interface LivingChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: 'WALI_MURID' | 'GURU' | 'KEPSEK' | 'YAYASAN' | 'ADMIN' | 'AI_ASY';
  senderAvatar: string;
  text?: string;
  voiceNote?: LivingVoiceNote;
  stickerUrl?: string;
  stickerLabel?: string;
  reactions: LivingReaction[];
  timestamp: string;
  status: LivingMessageStatus;
  isButterflyDelivered?: boolean;
  replyTo?: {
    senderName: string;
    text: string;
  };
}

export interface LivingChatChannel {
  id: string;
  name: string;
  type: 'BROADCAST' | 'CLASS_PAGUYUBAN' | 'TEACHER_ROOM' | 'PARENT_BENCH' | 'DIRECT';
  avatar: string;
  tagline: string;
  unreadCount: number;
  lastMessageText: string;
  lastTimestamp: string;
  memberCount: number;
  requiresApproval?: boolean;
  isApproved?: boolean;
}

export const ISLAMIC_EMOJI_PACK = [
  { id: 'emo-masjid', char: '🕌', label: 'Masjid Berkah' },
  { id: 'emo-doa', char: '🤲', label: 'Doa Munajat' },
  { id: 'emo-tasbih', char: '📿', label: 'Tasbih Dzikir' },
  { id: 'emo-quran', char: '📖', label: 'Al-Qur\'an Al-Karim' },
  { id: 'emo-hilal', char: '🌙', label: 'Bulan Sabit' },
  { id: 'emo-heart', char: '💚', label: 'Cinta Kasih Sayang' },
  { id: 'emo-leaf', char: '🌿', label: 'Berkah Kehidupan' },
  { id: 'emo-star', char: '✨', label: 'Cahaya Iman' },
  { id: 'emo-flower', char: '🌸', label: 'Alhamdulillah' },
  { id: 'emo-sun', char: '☀️', label: 'Semangat Pagi' }
];

export const ASY_SYIFA_REACTIONS = [
  { id: 'rx-asy-thumb', name: 'Asy Jempol', emoji: '👍', avatarType: 'ASY' as const },
  { id: 'rx-asy-smile', name: 'Asy Senyum', emoji: '😊', avatarType: 'ASY' as const },
  { id: 'rx-syifa-flower', name: 'Syifa Bunga', emoji: '🌸', avatarType: 'SYIFA' as const },
  { id: 'rx-syifa-star', name: 'Syifa Bintang', emoji: '⭐', avatarType: 'SYIFA' as const },
  { id: 'rx-asy-doa', name: 'Asy Munajat', emoji: '🤲', avatarType: 'ASY' as const },
  { id: 'rx-asy-love', name: 'Asy Kasih Sayang', emoji: '💚', avatarType: 'ASY' as const }
];

export const SMART_REPLY_TEMPLATES = [
  "Wa'alaikumsalam wr. wb. Terima kasih ustadzah 🙏",
  "Alhamdulillah, insya Allah ananda siap hadir ✨",
  "Jazakillahu khairan katsiran atas bimbingannya 🌸",
  "Mohon izin hari ini ananda kurang sehat, izin istirahat 🌿",
  "Aamiin Ya Rabbal 'Alamin, mohon doanya 🤲",
  "Terima kasih informasinya ustadz/ustadzah 💚"
];

const INITIAL_CHANNELS: LivingChatChannel[] = [
  {
    id: 'chan-broadcast-yayasan',
    name: '📢 Warta Resmi Yayasan Asy Syifa',
    type: 'BROADCAST',
    avatar: '🏛️',
    tagline: 'Saluran resmi Maklumat & Kebijakan Lembaga',
    unreadCount: 0,
    lastMessageText: 'Kalender Akademik Semester Ganjil 2026/2027 telah disahkan.',
    lastTimestamp: '10:15 WIB',
    memberCount: 148
  },
  {
    id: 'chan-paguyuban-tk-b1',
    name: '🌸 Paguyuban TK B1 (Utsman bin Affan)',
    type: 'CLASS_PAGUYUBAN',
    avatar: '🎨',
    tagline: 'Wali Murid & Ustadzah Kelas Sentra Balok',
    unreadCount: 2,
    lastMessageText: 'Ustadzah Fatimah: Dokumentasi Sentra Main Peran sudah diunggah.',
    lastTimestamp: '11:30 WIB',
    memberCount: 22
  },
  {
    id: 'chan-paguyuban-tk-a1',
    name: '🌱 Paguyuban TK A1 (Abu Bakar Ash-Shiddiq)',
    type: 'CLASS_PAGUYUBAN',
    avatar: '🌟',
    tagline: 'Wali Murid & Ustadzah Kelas Sentra Alam',
    unreadCount: 0,
    lastMessageText: 'Ustadzah Sarah: Besok ananda membawa botol minum sendiri ya bunda.',
    lastTimestamp: '08:45 WIB',
    memberCount: 20
  },
  {
    id: 'chan-dewan-guru',
    name: '👩‍🏫 Ruang Musyawarah Dewan Guru',
    type: 'TEACHER_ROOM',
    avatar: '📚',
    tagline: 'Koordinasi RPP, Anekdot & Evaluasi Sentra',
    unreadCount: 0,
    lastMessageText: 'Kepsek: Rapat pleno asesmen bulanan jam 13:30 di Aula.',
    lastTimestamp: '09:00 WIB',
    memberCount: 16
  },
  {
    id: 'chan-dm-ustadzah-fatimah',
    name: 'Ustadzah Fatimah, S.Pd (Wali Kelas TK B1)',
    type: 'DIRECT',
    avatar: '🧕',
    tagline: 'Komunikasi Santun Terproteksi (Direct Message)',
    unreadCount: 1,
    lastMessageText: 'Assalamu\'alaikum bunda, Ananda Farhan hari ini sangat aktif di Sentra Balok!',
    lastTimestamp: '12:05 WIB',
    memberCount: 2,
    isApproved: true
  }
];

const INITIAL_MESSAGES: Record<string, LivingChatMessage[]> = {
  'chan-broadcast-yayasan': [
    {
      id: 'm-by-1',
      channelId: 'chan-broadcast-yayasan',
      senderId: 'usr-yayasan',
      senderName: 'Sekretariat Yayasan Asy Syifa Tanggul',
      senderRole: 'YAYASAN',
      senderAvatar: '🏛️',
      text: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh. Disampaikan kepada seluruh civitas madrasah, pelaksanaan Pawai Ta\'aruf dan Milad Ke-15 TK Islam Asy Syifa akan digelar secara khidmat.',
      timestamp: '10:00 WIB',
      status: 'READ',
      reactions: [
        { id: 'rx-1', name: 'Alhamdulillah', emoji: '🌸', count: 18, users: ['usr-1', 'usr-2'] },
        { id: 'rx-2', name: 'Munajat', emoji: '🤲', count: 24, users: ['usr-3'] }
      ]
    },
    {
      id: 'm-by-2',
      channelId: 'chan-broadcast-yayasan',
      senderId: 'usr-yayasan',
      senderName: 'Sekretariat Yayasan Asy Syifa Tanggul',
      senderRole: 'YAYASAN',
      senderAvatar: '🏛️',
      text: 'Kalender Akademik Semester Ganjil 2026/2027 telah disahkan oleh Dewan Pembina dan Pengawas BAN-PAUD.',
      timestamp: '10:15 WIB',
      status: 'READ',
      reactions: [
        { id: 'rx-3', name: 'Berkah', emoji: '💚', count: 15, users: ['usr-4'] }
      ]
    }
  ],
  'chan-paguyuban-tk-b1': [
    {
      id: 'm-b1-1',
      channelId: 'chan-paguyuban-tk-b1',
      senderId: 'usr-ust-fatimah',
      senderName: 'Ustadzah Fatimah (Wali Kelas B1)',
      senderRole: 'GURU',
      senderAvatar: '🧕',
      text: 'Assalamu\'alaikum bunda-bunda shalihah, ananda hari ini belajar tema "Menyayangi Ciptaan Allah" di Sentra Alam. Semua ananda berhasil menanam biji kacang hijau dengan riang! 🌱',
      timestamp: '11:00 WIB',
      status: 'READ',
      reactions: [
        { id: 'rx-4', name: 'Asy Jempol', emoji: '👍', avatarType: 'ASY', count: 9, users: ['usr-5'] },
        { id: 'rx-5', name: 'Syifa Bunga', emoji: '🌸', avatarType: 'SYIFA', count: 12, users: ['usr-6'] }
      ]
    },
    {
      id: 'm-b1-2',
      channelId: 'chan-paguyuban-tk-b1',
      senderId: 'usr-ust-fatimah',
      senderName: 'Ustadzah Fatimah (Wali Kelas B1)',
      senderRole: 'GURU',
      senderAvatar: '🧕',
      voiceNote: {
        durationSec: 8,
        waveform: [20, 45, 80, 100, 75, 90, 60, 40, 70, 85, 30, 20]
      },
      text: 'Pesan Suara: Ucapan terima kasih untuk bunda ananda Farhan atas infaq kurma manis untuk kudapan sehat ananda.',
      timestamp: '11:30 WIB',
      status: 'READ',
      reactions: [
        { id: 'rx-6', name: 'Asy Kasih Sayang', emoji: '💚', avatarType: 'ASY', count: 14, users: ['usr-7'] }
      ]
    }
  ],
  'chan-dm-ustadzah-fatimah': [
    {
      id: 'm-dm-1',
      channelId: 'chan-dm-ustadzah-fatimah',
      senderId: 'usr-ust-fatimah',
      senderName: 'Ustadzah Fatimah, S.Pd',
      senderRole: 'GURU',
      senderAvatar: '🧕',
      text: 'Assalamu\'alaikum bunda, Ananda Farhan hari ini sangat aktif di Sentra Balok! Hafalan Surah An-Naba ayat 1-15 juga terdengar sangat tartil dan mutqin. Masya Allah.',
      timestamp: '12:05 WIB',
      status: 'READ',
      reactions: [
        { id: 'rx-7', name: 'Munajat', emoji: '🤲', count: 2, users: ['usr-parent'] }
      ]
    }
  ]
};

const STORAGE_KEY = 'tade_living_messenger_store_v10_4';

class LivingMessengerService {
  private static instance: LivingMessengerService | null = null;
  private channels: LivingChatChannel[];
  private messages: Record<string, LivingChatMessage[]>;
  private listeners: Array<() => void> = [];

  private constructor() {
    const loaded = this.loadFromStorage();
    this.channels = loaded.channels;
    this.messages = loaded.messages;
  }

  public static getInstance(): LivingMessengerService {
    if (!LivingMessengerService.instance) {
      LivingMessengerService.instance = new LivingMessengerService();
    }
    return LivingMessengerService.instance;
  }

  private loadFromStorage(): { channels: LivingChatChannel[]; messages: Record<string, LivingChatMessage[]> } {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { channels: [...INITIAL_CHANNELS], messages: { ...INITIAL_MESSAGES } };
      const parsed = JSON.parse(raw);
      return {
        channels: parsed.channels || [...INITIAL_CHANNELS],
        messages: parsed.messages || { ...INITIAL_MESSAGES }
      };
    } catch {
      return { channels: [...INITIAL_CHANNELS], messages: { ...INITIAL_MESSAGES } };
    }
  }

  public getChannels(): LivingChatChannel[] {
    return [...this.channels];
  }

  public getMessages(channelId: string): LivingChatMessage[] {
    return [...(this.messages[channelId] || [])];
  }

  public sendMessage(
    channelId: string,
    payload: {
      text?: string;
      voiceNote?: LivingVoiceNote;
      stickerUrl?: string;
      stickerLabel?: string;
      replyTo?: { senderName: string; text: string };
      senderRole?: 'WALI_MURID' | 'GURU' | 'KEPSEK' | 'YAYASAN' | 'ADMIN';
      senderName?: string;
    }
  ): LivingChatMessage {
    const newMsg: LivingChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      channelId,
      senderId: 'usr-current-user',
      senderName: payload.senderName || 'Bunda Farhan (Wali Murid)',
      senderRole: payload.senderRole || 'WALI_MURID',
      senderAvatar: '🧕',
      text: payload.text,
      voiceNote: payload.voiceNote,
      stickerUrl: payload.stickerUrl,
      stickerLabel: payload.stickerLabel,
      replyTo: payload.replyTo,
      reactions: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'SENT',
      isButterflyDelivered: true
    };

    if (!this.messages[channelId]) {
      this.messages[channelId] = [];
    }
    this.messages[channelId].push(newMsg);

    // Update channel snippet
    this.channels = this.channels.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          lastMessageText: payload.text || (payload.voiceNote ? '🎤 Pesan Suara' : '🎨 Stiker Berkah'),
          lastTimestamp: newMsg.timestamp
        };
      }
      return c;
    });

    this.persist();

    // Simulate real-time delivery & read
    setTimeout(() => {
      this.updateMessageStatus(channelId, newMsg.id, 'DELIVERED');
    }, 600);

    setTimeout(() => {
      this.updateMessageStatus(channelId, newMsg.id, 'READ');
    }, 1500);

    return newMsg;
  }

  public addReaction(channelId: string, messageId: string, emoji: string, name: string, avatarType?: 'ASY' | 'SYIFA'): void {
    const list = this.messages[channelId];
    if (!list) return;

    this.messages[channelId] = list.map(m => {
      if (m.id === messageId) {
        const existing = m.reactions.find(r => r.emoji === emoji);
        let updatedReactions: LivingReaction[];
        if (existing) {
          updatedReactions = m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r);
        } else {
          updatedReactions = [
            ...m.reactions,
            { id: `rx-${Date.now()}`, emoji, name, avatarType, count: 1, users: ['usr-current'] }
          ];
        }
        return { ...m, reactions: updatedReactions };
      }
      return m;
    });

    this.persist();
  }

  public updateMessageStatus(channelId: string, messageId: string, status: LivingMessageStatus): void {
    const list = this.messages[channelId];
    if (!list) return;

    this.messages[channelId] = list.map(m => (m.id === messageId ? { ...m, status } : m));
    this.persist();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private persist(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          channels: this.channels,
          messages: this.messages
        })
      );
      this.notify();
    } catch (e) {
      console.warn('Failed to persist Living Messenger data:', e);
    }
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Messenger listener error:', err);
      }
    });
  }
}

export const livingMessengerService = LivingMessengerService.getInstance();
