export interface WhatsAppTopic {
  id: string;
  title: string;
  iconName: string;
  badge?: string;
  description: string;
  prefilledText: string;
}

export interface WhatsAppCMSConfig {
  whatsappNumber: string; // e.g. "6281234567890"
  formattedDisplayNumber: string; // e.g. "+62 812-3456-7890"
  greetingText: string;
  operatingHours: string;
  ctaLabel: string;
  welcomeTopics: WhatsAppTopic[];
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppCMSConfig = {
  whatsappNumber: '6281234567890',
  formattedDisplayNumber: '+62 812-3456-7890',
  greetingText: '🌼 Assalamualaikum, ada yang bisa kami bantu di TK Asy Syifa?',
  operatingHours: 'Senin - Sabtu: 07.00 - 14.00 WIB',
  ctaLabel: 'Chat WhatsApp Sekretariat',
  welcomeTopics: [
    {
      id: 'ppdb',
      title: 'Pendaftaran PPDB',
      iconName: 'UserPlus',
      badge: 'Populer',
      description: 'Info syarat, formulir, dan kuota pendaftaran murid baru.',
      prefilledText: 'Assalamu\'alaikum Admin TK Asy Syifa, saya ingin bertanya mengenai Pendaftaran Murid Baru (PPDB).',
    },
    {
      id: 'biaya',
      title: 'Informasi Biaya & SPP',
      iconName: 'CreditCard',
      description: 'Rincian biaya masuk, SPP bulanan, dan seragam.',
      prefilledText: 'Assalamu\'alaikum Admin TK Asy Syifa, boleh minta informasi rincian biaya SPP dan pendaftaran?',
    },
    {
      id: 'jadwal',
      title: 'Jadwal Sekolah & Kegiatan',
      iconName: 'Calendar',
      description: 'Jam belajar harian, intrakurikuler, dan ekstrakurikuler.',
      prefilledText: 'Assalamu\'alaikum Admin TK Asy Syifa, saya ingin tahu jadwal kegiatan dan jam belajar siswa.',
    },
    {
      id: 'lokasi',
      title: 'Lokasi & Kunjungan Direct',
      iconName: 'MapPin',
      description: 'Petunjuk arah kampus, jam kantor, dan janji temu.',
      prefilledText: 'Assalamu\'alaikum Admin TK Asy Syifa, saya ingin melakukan kunjungan/silaturahmi ke sekolah.',
    },
    {
      id: 'admin',
      title: 'Hubungi Admin Sekretariat',
      iconName: 'MessageSquare',
      badge: 'Layanan Utama',
      description: 'Bicara langsung dengan staf sekretariat TK Asy Syifa.',
      prefilledText: 'Assalamu\'alaikum Admin TK Asy Syifa, saya ingin berkonsultasi mengenai layanan sekolah.',
    },
  ],
};

/**
 * Gets CMS-ready WhatsApp configuration with fallback defaults.
 * Dynamic and expandable without database migrations.
 */
export function getWhatsAppConfig(): WhatsAppCMSConfig {
  try {
    const customConfigStr = localStorage.getItem('tade_whatsapp_config');
    if (customConfigStr) {
      const parsed = JSON.parse(customConfigStr);
      return {
        ...DEFAULT_WHATSAPP_CONFIG,
        ...parsed,
        welcomeTopics: parsed.welcomeTopics || DEFAULT_WHATSAPP_CONFIG.welcomeTopics,
      };
    }
  } catch (err) {
    console.warn('WhatsApp Config parse fallback:', err);
  }
  return DEFAULT_WHATSAPP_CONFIG;
}

/**
 * Constructs clean wa.me Click-to-Chat URL.
 */
export function buildWhatsAppUrl(prefilledText?: string, rawNumber?: string): string {
  const config = getWhatsAppConfig();
  const num = (rawNumber || config.whatsappNumber).replace(/[^0-9]/g, '');
  const text = prefilledText || config.greetingText;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

/**
 * G105: Constructs universal deep-link URL into TADE for sharing on WhatsApp.
 * Supports fallback to live web app if not installed as PWA.
 */
export function buildTADEDeepLink(tab: string = 'w3', params?: Record<string, string>): string {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://ais-pre-qlgbvolgn7gg7bswgsywce-237499056783.asia-southeast1.run.app';

  const searchParams = new URLSearchParams({ tab, ref: 'wa_share' });
  if (params) {
    Object.entries(params).forEach(([k, v]) => searchParams.set(k, v));
  }
  return `${origin}/?${searchParams.toString()}`;
}

/**
 * G105: Constructs WhatsApp forward/broadcast URL for school announcements.
 */
export function buildWhatsAppShareAnnouncementUrl(title: string, tab: string = 'w3', summary?: string): string {
  const deepLink = buildTADEDeepLink(tab);
  const textLines = [
    `📢 *Pengumuman TK Asy Syifa Tanggul*`,
    `📌 *${title}*`,
    summary ? `\n${summary}` : '',
    `\n📲 *Buka di Aplikasi / Web TADE:*`,
    deepLink,
    `\n_Semoga bermanfaat untuk Ayah & Bunda._ ✨`
  ].filter(Boolean);

  const fullText = textLines.join('\n');
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
}

/**
 * G105: Trigger native web share or WhatsApp direct share.
 */
export async function shareToWhatsAppOrWeb(title: string, tab: string = 'w3', summary?: string): Promise<boolean> {
  const deepLink = buildTADEDeepLink(tab);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `TK Asy Syifa — ${title}`,
        text: summary || title,
        url: deepLink,
      });
      return true;
    } catch {
      // Fallback to direct WhatsApp URL below
    }
  }
  const waUrl = buildWhatsAppShareAnnouncementUrl(title, tab, summary);
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return true;
}
