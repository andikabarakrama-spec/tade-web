/**
 * TADE CREATIVE STUDIO ENGINE — SPRINT G5 EVOLUTION
 * Self-reliant graphics generation factory adhering 100% to Pure Brand Constitution.
 * Provides live Brand DNA validation, print safe zones, batch exports (4:5, 16:9, 9:16),
 * project history persistence, and favorite template management.
 */

import { brandDnaEngine, BrandValidationResult } from './brandDnaEngine';
import { smartMediaPipeline } from './smartMediaPipeline';
import { founderCommandRecorder } from './founderCommandRecorder';

export type CreativeTemplateType =
  | 'POSTER_PPDB'
  | 'BANNER_SENTRA'
  | 'STORY_MOMENT_HARI_INI'
  | 'PENGUMUMAN_WALI'
  | 'SERTIFIKAT_TAHFIDZ'
  | 'KARTU_SPP_INFAQ';

export interface CreativeTemplateConfig {
  id: string;
  type: CreativeTemplateType;
  title: string;
  subtitle: string;
  badgeText: string;
  highlightText: string;
  dateText: string;
  contactText: string;
  themeColor: string;
  accentColor: string;
  width: number;
  height: number;
  aspectRatio: '4:5' | '16:9' | '9:16' | '1:1';
  showSafeMargins?: boolean;
  showBleedLines?: boolean;
  isFavorite?: boolean;
}

export interface ProjectDraft {
  id: string;
  title: string;
  templateType: CreativeTemplateType;
  thumbnailDataUrl: string;
  timestamp: string;
  config: CreativeTemplateConfig;
}

export interface BatchExportResult {
  format: 'POSTER_4_5' | 'BANNER_16_9' | 'STORY_9_16';
  label: string;
  width: number;
  height: number;
  dataUrl: string;
}

export const DEFAULT_TEMPLATES: Record<CreativeTemplateType, CreativeTemplateConfig> = {
  POSTER_PPDB: {
    id: 'tpl-ppdb-2026',
    type: 'POSTER_PPDB',
    title: 'Penerimaan Peserta Didik Baru',
    subtitle: 'Tahun Ajaran 2026/2027 • TK Islam Asy Syifa Tanggul',
    badgeText: 'KUOTA TERBATAS',
    highlightText: 'Kurikulum Sentra Islami & Tahfidz Quran',
    dateText: 'Pendaftaran Gelombang 1 Dibuka',
    contactText: 'Info & Pendaftaran: 0812-3456-7890 (Kantor Yayasan)',
    themeColor: '#064e3b', // emerald-900
    accentColor: '#f59e0b', // amber-500
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    showSafeMargins: false,
    showBleedLines: false,
    isFavorite: true
  },
  BANNER_SENTRA: {
    id: 'tpl-sentra-balok',
    type: 'BANNER_SENTRA',
    title: 'Sentra Balok & Rancang Bangun',
    subtitle: 'Mengembangkan Spasial, Kreativitas, & Akhlak Mulia',
    badgeText: 'SENTRA UNGGULAN',
    highlightText: 'Belajar Bermakna Sesuai Tahap Perkembangan',
    dateText: 'Kegiatan Belajar Sentra Pekan Ini',
    contactText: 'TK Islam Asy-Syifa Tanggul Jember',
    themeColor: '#0f172a', // slate-900
    accentColor: '#10b981', // emerald-500
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    showSafeMargins: false,
    showBleedLines: false,
    isFavorite: true
  },
  STORY_MOMENT_HARI_INI: {
    id: 'tpl-story-tahfidz',
    type: 'STORY_MOMENT_HARI_INI',
    title: 'Murojaah Pagi & Doa Harian',
    subtitle: 'Ceria Belajar & Menghafal Al-Quran Bersama Ustadzah',
    badgeText: 'MOMENT OF THE DAY',
    highlightText: 'Santri Kelompok B — Hafalan Surat An-Nas',
    dateText: 'Hari Ini di TK Islam Asy Syifa',
    contactText: '#TKIslamAsySyifa #GenerasiQurani',
    themeColor: '#134e4a', // teal-900
    accentColor: '#fbbf24', // amber-400
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    showSafeMargins: false,
    showBleedLines: false,
    isFavorite: false
  },
  PENGUMUMAN_WALI: {
    id: 'tpl-pengumuman-resmi',
    type: 'PENGUMUMAN_WALI',
    title: 'Pemberitahuan Agenda Manasik Haji',
    subtitle: 'Panduan Pelaksanaan & Seragam Santri',
    badgeText: 'RESMI KEPALA SEKOLAH',
    highlightText: 'Sabtu, 14 Maret 2026 • Lapangan Utama',
    dateText: 'Pukul 07.30 WIB s/d Selesai',
    contactText: 'Mohon hadir tepat waktu dengan pakaian ihram putih.',
    themeColor: '#1e293b', // slate-800
    accentColor: '#38bdf8', // sky-400
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    showSafeMargins: false,
    showBleedLines: false,
    isFavorite: false
  },
  SERTIFIKAT_TAHFIDZ: {
    id: 'tpl-sertifikat-juz30',
    type: 'SERTIFIKAT_TAHFIDZ',
    title: 'Syahadah Tahfidz Juz 30',
    subtitle: 'Diberikan Atas Kelulusan Ujian Munaqosyah Al-Quran',
    badgeText: 'PRESTASI SANTRI',
    highlightText: 'Mumtaz (Sangat Baik) — Nilai Rata-rata 96.5',
    dateText: 'Tanggul, 20 Februari 2026',
    contactText: 'Kepala Sekolah: Ustadzah Nurul Farida, S.Pd.',
    themeColor: '#022c22', // emerald-950
    accentColor: '#d97706', // amber-600
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    showSafeMargins: true,
    showBleedLines: true,
    isFavorite: true
  },
  KARTU_SPP_INFAQ: {
    id: 'tpl-kartu-infaq',
    type: 'KARTU_SPP_INFAQ',
    title: 'Tanda Bukti Infaq & SPP Santri',
    subtitle: 'Layanan Keuangan Terpadu Baitul Mal Asy Syifa',
    badgeText: 'LUNAS TERCATAT',
    highlightText: 'Alhamdulillah, Jazakumullah Khairan Katsiran',
    dateText: 'Tercatat di SSoT Kas: 05 Maret 2026',
    contactText: 'Bendahara Yayasan: Ibu Siti Rahmah',
    themeColor: '#1e1b4b', // indigo-950
    accentColor: '#34d399', // emerald-400
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    showSafeMargins: false,
    showBleedLines: false,
    isFavorite: false
  }
};

class CreativeStudioEngine {
  private static instance: CreativeStudioEngine | null = null;

  public static getInstance(): CreativeStudioEngine {
    if (!CreativeStudioEngine.instance) {
      CreativeStudioEngine.instance = new CreativeStudioEngine();
    }
    return CreativeStudioEngine.instance;
  }

  public renderToCanvas(
    canvas: HTMLCanvasElement,
    config: CreativeTemplateConfig,
    userImage?: HTMLImageElement | null
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = config.width;
    const h = config.height;
    canvas.width = w;
    canvas.height = h;

    // 1. Background Fill
    ctx.fillStyle = config.themeColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Geometric Islamic Pattern / Gradient Overlay
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 3. User Uploaded Image Container / Central Frame
    if (userImage) {
      ctx.save();
      const frameX = w * 0.08;
      const frameY = h * 0.22;
      const frameW = w * 0.84;
      const frameH = h * 0.42;

      // Rounded clipping frame
      const radius = 28;
      ctx.beginPath();
      ctx.moveTo(frameX + radius, frameY);
      ctx.lineTo(frameX + frameW - radius, frameY);
      ctx.quadraticCurveTo(frameX + frameW, frameY, frameX + frameW, frameY + radius);
      ctx.lineTo(frameX + frameW, frameY + frameH - radius);
      ctx.quadraticCurveTo(frameX + frameW, frameY + frameH, frameX + frameW - radius, frameY + frameH);
      ctx.lineTo(frameX + radius, frameY + frameH);
      ctx.quadraticCurveTo(frameX, frameY + frameH, frameX, frameY + frameH - radius);
      ctx.lineTo(frameX, frameY + radius);
      ctx.quadraticCurveTo(frameX, frameY, frameX + radius, frameY);
      ctx.closePath();
      ctx.clip();

      // Cover scaling math
      const scale = Math.max(frameW / userImage.width, frameH / userImage.height);
      const iw = userImage.width * scale;
      const ih = userImage.height * scale;
      const ix = frameX + (frameW - iw) / 2;
      const iy = frameY + (frameH - ih) / 2;
      ctx.drawImage(userImage, ix, iy, iw, ih);
      ctx.restore();

      // Frame Accent Border
      ctx.save();
      ctx.strokeStyle = config.accentColor;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(frameX + radius, frameY);
      ctx.lineTo(frameX + frameW - radius, frameY);
      ctx.quadraticCurveTo(frameX + frameW, frameY, frameX + frameW, frameY + radius);
      ctx.lineTo(frameX + frameW, frameY + frameH - radius);
      ctx.quadraticCurveTo(frameX + frameW, frameY + frameH, frameX + frameW - radius, frameY + frameH);
      ctx.lineTo(frameX + radius, frameY + frameH);
      ctx.quadraticCurveTo(frameX, frameY + frameH, frameX, frameY + frameH - radius);
      ctx.lineTo(frameX, frameY + radius);
      ctx.quadraticCurveTo(frameX, frameY, frameX + radius, frameY);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    } else {
      // Placeholder illustration container
      const frameX = w * 0.08;
      const frameY = h * 0.22;
      const frameW = w * 0.84;
      const frameH = h * 0.42;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(frameX, frameY, frameW, frameH);

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '600 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🖼️ Klik "Sisipkan Foto Kegiatan" untuk menampilkan santri', w / 2, frameY + frameH / 2);
      ctx.restore();
    }

    // 4. Header Badge Pill
    ctx.save();
    const badgeX = w * 0.08;
    const badgeY = h * 0.06;
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(badgeX, badgeY, 260, 48);

    ctx.fillStyle = '#0f172a'; // slate-900 for high contrast
    ctx.font = '800 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(config.badgeText, badgeX + 130, badgeY + 31);
    ctx.restore();

    // 5. Typography: Title & Subtitle
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 46px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(config.title, w * 0.08, h * 0.16);

    ctx.fillStyle = '#cbd5e1'; // slate-300
    ctx.font = '600 24px sans-serif';
    ctx.fillText(config.subtitle, w * 0.08, h * 0.195);
    ctx.restore();

    // 6. Highlight Card Container
    ctx.save();
    const cardY = h * 0.68;
    const cardH = h * 0.18;
    const cardX = w * 0.08;
    const cardW = w * 0.84;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    ctx.fillStyle = config.accentColor;
    ctx.font = '800 24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`★  ${config.dateText}`, cardX + 32, cardY + 44);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 30px sans-serif';
    ctx.fillText(config.highlightText, cardX + 32, cardY + 92);
    ctx.restore();

    // 7. Footer Seal & Contact Line
    ctx.save();
    const footerY = h * 0.92;
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '600 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(config.contactText, w * 0.08, footerY);

    // Official Seal Emblem (Pure Vector Octagram from Brand DNA)
    brandDnaEngine.drawOfficialSeal(ctx, w * 0.92 - 18, footerY - 8, 16, config.accentColor);

    // Official Seal Watermark (Pure Asy Syifa Canon)
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('OFFICIAL CANON • TK ISLAM ASY SYIFA', w * 0.92 - 44, footerY);
    ctx.restore();

    // 8. Safe Print Margins Guide (If toggled)
    if (config.showSafeMargins) {
      brandDnaEngine.drawSafePrintMargins(ctx, w, h, true);
    }
  }

  /**
   * Validate current template config against Brand DNA
   */
  public validateConfig(config: CreativeTemplateConfig): BrandValidationResult {
    return brandDnaEngine.validateBrandCompliance(
      [
        config.title,
        config.subtitle,
        config.badgeText,
        config.highlightText,
        config.dateText,
        config.contactText
      ],
      config.themeColor,
      config.width,
      config.height
    );
  }

  /**
   * Batch Export: Generates 4:5 Poster, 16:9 Banner, and 9:16 Story simultaneously
   */
  public generateBatchExport(
    config: CreativeTemplateConfig,
    userImage?: HTMLImageElement | null
  ): BatchExportResult[] {
    const results: BatchExportResult[] = [];
    const ratios: {
      format: BatchExportResult['format'];
      label: string;
      w: number;
      h: number;
      aspect: CreativeTemplateConfig['aspectRatio'];
    }[] = [
      { format: 'POSTER_4_5', label: 'Poster Feed Instagram (4:5)', w: 1080, h: 1350, aspect: '4:5' },
      { format: 'BANNER_16_9', label: 'Banner Web / TV Sentra (16:9)', w: 1920, h: 1080, aspect: '16:9' },
      { format: 'STORY_9_16', label: 'Story WhatsApp / IG (9:16)', w: 1080, h: 1920, aspect: '9:16' }
    ];

    const tempCanvas = document.createElement('canvas');

    for (const r of ratios) {
      const cfg: CreativeTemplateConfig = {
        ...config,
        width: r.w,
        height: r.h,
        aspectRatio: r.aspect
      };
      this.renderToCanvas(tempCanvas, cfg, userImage);
      results.push({
        format: r.format,
        label: r.label,
        width: r.w,
        height: r.h,
        dataUrl: tempCanvas.toDataURL('image/jpeg', 0.92)
      });
    }

    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Creative Studio Factory',
      `Batch export 3 format (4:5, 16:9, 9:16) berhasil diproses untuk ${config.title}.`
    );

    return results;
  }

  /**
   * Project History & Drafts Storage
   */
  public getProjectHistory(): ProjectDraft[] {
    try {
      const raw = localStorage.getItem('tade_creative_studio_drafts_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveProjectDraft(config: CreativeTemplateConfig, thumbnailDataUrl: string): void {
    try {
      const current = this.getProjectHistory().filter(d => d.id !== config.id);
      const draft: ProjectDraft = {
        id: config.id || `draft-${Date.now()}`,
        title: config.title,
        templateType: config.type,
        thumbnailDataUrl,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' • ' + new Date().toLocaleDateString('id-ID'),
        config
      };
      current.unshift(draft);
      localStorage.setItem('tade_creative_studio_drafts_v1', JSON.stringify(current.slice(0, 10)));
    } catch (e) {
      console.warn('Failed to save project draft:', e);
    }
  }

  public deleteProjectDraft(draftId: string): void {
    try {
      const filtered = this.getProjectHistory().filter(d => d.id !== draftId);
      localStorage.setItem('tade_creative_studio_drafts_v1', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to delete draft:', e);
    }
  }

  /**
   * Presets Storage
   */
  public getSavedPresets(): CreativeTemplateConfig[] {
    try {
      const raw = localStorage.getItem('tade_creative_studio_presets_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public savePreset(preset: CreativeTemplateConfig): void {
    try {
      const current = this.getSavedPresets().filter(p => p.id !== preset.id);
      current.unshift(preset);
      localStorage.setItem('tade_creative_studio_presets_v1', JSON.stringify(current.slice(0, 15)));
    } catch (e) {
      console.warn('Failed to save preset:', e);
    }
  }

  public deletePreset(id: string): void {
    try {
      const filtered = this.getSavedPresets().filter(p => p.id !== id);
      localStorage.setItem('tade_creative_studio_presets_v1', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to delete preset:', e);
    }
  }

  /**
   * Save canvas output directly to Smart Media Pipeline archive
   */
  public exportToMediaArchive(
    canvas: HTMLCanvasElement,
    config: CreativeTemplateConfig
  ): string {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const smartName = smartMediaPipeline.generateSmartName('DOKUMEN');

    smartMediaPipeline.saveAsset({
      id: `studio-${Date.now()}`,
      originalName: `${config.type.toLowerCase()}_template.jpg`,
      smartName,
      category: 'DOKUMEN',
      mimeType: 'image/jpeg',
      sizeBytes: Math.round(dataUrl.length * 0.75),
      width: config.width,
      height: config.height,
      aspectRatio: config.aspectRatio,
      sharpnessScore: 99,
      isBlurry: false,
      isDuplicate: false,
      qualityBadge: 'HD_OPTIMAL',
      optimizedDataUrl: dataUrl,
      watermarkMode: 'RESMI_YAYASAN',
      targetDestinations: {
        galeri: true,
        berita: false,
        arsip: true,
        whatsApp: true,
        story: config.type === 'STORY_MOMENT_HARI_INI'
      },
      isPublished: false,
      uploadedAt: new Date().toISOString(),
      hash: `studio-hash-${Date.now()}`
    });

    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Creative Studio Factory',
      `Materi grafis ${config.title} berhasil diekspor ke Smart Media Archive.`
    );

    return dataUrl;
  }
}

export const creativeStudioEngine = CreativeStudioEngine.getInstance();
