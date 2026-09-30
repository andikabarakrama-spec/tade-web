export type NotificationCategory = 
  | 'pengumuman'   // Pengumuman Sekolah
  | 'ppdb'         // PPDB
  | 'absensi'      // Absensi
  | 'infaq_spp'    // Infaq/SPP
  | 'tabungan'     // Tabungan
  | 'pesan_guru'   // Pesan Guru
  | 'agenda'       // Agenda Besok
  | 'tahfidz';     // Tahfidz

export interface TADENotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timestamp: string; // ISO string
  read: boolean;
  actionUrl?: string;
  actionTab?: string;
  sender?: string;
  meta?: Record<string, any>;
}

export interface NotificationCategoryMeta {
  id: NotificationCategory;
  label: string;
  icon: string;
  color: string;
  badgeBg: string;
  targetTab: string;
}

export interface FCMDeviceTokenDoc {
  id?: string;
  token: string;
  platform: string;
  browser: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  lastSeenAt?: string;
  userAgent?: string;
}
