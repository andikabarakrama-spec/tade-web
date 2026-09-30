/**
 * TADE RC99 — R818: Creator Download Center
 * Pusat ekspor & unduhan aset kreatif (Story, Poster Kegiatan, Foto Ter-enhance, Galeri).
 * Mendukung opsi Preview, HD, Full HD, Adaptive Export, serta siap menerima resolusi masa depan.
 */

export type ExportResolutionType = 'PREVIEW_SD' | 'HD_1080' | 'FULL_HD_2K' | 'ULTRA_4K' | 'CUSTOM';
export type ExportFileFormat = 'WEBP' | 'PNG' | 'JPEG' | 'PDF_ARCHIVE';

export interface ResolutionProfile {
  id: ExportResolutionType;
  label: string;
  description: string;
  multiplier: number;
  recommendedFor: string;
  estimatedSizeMb: number;
  isAvailable: boolean;
}

export interface CreatorExportJob {
  id: string;
  assetTitle: string;
  assetCategory: string;
  resolution: ExportResolutionType;
  format: ExportFileFormat;
  dimensions: { width: number; height: number };
  fileSizeBytes: number;
  downloadUrl: string;
  createdAt: string;
  status: 'READY' | 'GENERATING' | 'DOWNLOADED';
}

export class CreatorDownloadCenter {
  private static instance: CreatorDownloadCenter | null = null;
  private exportJobs: CreatorExportJob[] = [];
  private listeners: Set<(jobs: CreatorExportJob[]) => void> = new Set();

  public static readonly RESOLUTION_PROFILES: ResolutionProfile[] = [
    {
      id: 'PREVIEW_SD',
      label: 'Preview Ringan (SD 720p)',
      description: 'Ukuran sangat hemat, cocok untuk kirim cepat via WhatsApp',
      multiplier: 0.67,
      recommendedFor: 'WhatsApp Chat & Status Cepat',
      estimatedSizeMb: 0.35,
      isAvailable: true
    },
    {
      id: 'HD_1080',
      label: 'Standar HD (1080p)',
      description: 'Kualitas tajam optimal untuk Instagram Feed & Story',
      multiplier: 1.0,
      recommendedFor: 'Instagram, Facebook, Website',
      estimatedSizeMb: 0.95,
      isAvailable: true
    },
    {
      id: 'FULL_HD_2K',
      label: 'High-Res Full HD (2K Master)',
      description: 'Detail sangat jernih untuk banner website & cetak piagam',
      multiplier: 1.5,
      recommendedFor: 'Cetak Foto, Banner Website, Smart TV Lobi',
      estimatedSizeMb: 2.4,
      isAvailable: true
    },
    {
      id: 'ULTRA_4K',
      label: 'Ultra 4K Archival Master',
      description: 'Resolusi masa depan untuk arsip akreditasi dan layar raksasa',
      multiplier: 2.0,
      recommendedFor: 'Arsip Abadi Akreditasi BAN-PAUD & Cetak Spanduk',
      estimatedSizeMb: 5.8,
      isAvailable: true
    }
  ];

  public static getInstance(): CreatorDownloadCenter {
    if (!CreatorDownloadCenter.instance) {
      CreatorDownloadCenter.instance = new CreatorDownloadCenter();
    }
    return CreatorDownloadCenter.instance;
  }

  public getExportJobs(): CreatorExportJob[] {
    return [...this.exportJobs];
  }

  public subscribe(listener: (jobs: CreatorExportJob[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getExportJobs());
    return () => this.listeners.delete(listener);
  }

  public createExportJob(
    assetTitle: string,
    assetCategory: string,
    resolution: ExportResolutionType,
    format: ExportFileFormat,
    baseWidth = 1080,
    baseHeight = 1920,
    sourceUrl?: string
  ): CreatorExportJob {
    const profile = CreatorDownloadCenter.RESOLUTION_PROFILES.find(p => p.id === resolution) || CreatorDownloadCenter.RESOLUTION_PROFILES[1];
    const width = Math.round(baseWidth * profile.multiplier);
    const height = Math.round(baseHeight * profile.multiplier);
    const fileSizeBytes = Math.round(profile.estimatedSizeMb * 1024 * 1024);

    const job: CreatorExportJob = {
      id: `exp-${Date.now()}`,
      assetTitle,
      assetCategory,
      resolution,
      format,
      dimensions: { width, height },
      fileSizeBytes,
      downloadUrl: sourceUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1080&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      status: 'READY'
    };

    this.exportJobs = [job, ...this.exportJobs.slice(0, 19)];
    this.notify();
    return job;
  }

  public triggerDownload(jobId: string): void {
    const job = this.exportJobs.find(j => j.id === jobId);
    if (!job) return;

    // Simulate instant safe download trigger
    const link = document.createElement('a');
    link.href = job.downloadUrl;
    link.download = `${job.assetTitle.replace(/\s+/g, '_')}_${job.resolution}.${job.format.toLowerCase()}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.exportJobs = this.exportJobs.map(j => j.id === jobId ? { ...j, status: 'DOWNLOADED' } : j);
    this.notify();
  }

  private notify(): void {
    const data = this.getExportJobs();
    this.listeners.forEach(l => l(data));
  }
}
