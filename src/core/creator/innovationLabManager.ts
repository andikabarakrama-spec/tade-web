/**
 * TADE RC99 — R819: Innovation Lab Manager
 * Ruang eksperimen fitur creator masa depan.
 * Status: EXPERIMENTAL -> TESTING -> FOUNDER_REVIEW -> PRODUCTION_READY.
 * Fitur eksperimen tidak aktif ke publik sampai melewati verifikasi Founder.
 */

export type InnovationFeatureStatus = 'EXPERIMENTAL' | 'TESTING' | 'FOUNDER_REVIEW' | 'PRODUCTION_READY';

export interface InnovationFeatureItem {
  id: string;
  name: string;
  codename: string;
  description: string;
  targetCategory: string;
  status: InnovationFeatureStatus;
  stabilityScore: number; // 0 - 100
  founderReviewNotes?: string;
  isSandboxEnabled: boolean;
  author: string;
  createdDate: string;
  version: string;
}

export class InnovationLabManager {
  private static instance: InnovationLabManager | null = null;
  private listeners: Set<(features: InnovationFeatureItem[]) => void> = new Set();

  private features: InnovationFeatureItem[] = [
    {
      id: 'inn-001',
      name: 'Smart Audio Noise Cleanser',
      codename: 'PROJECT_WHISPER_CALM',
      description: 'Filter frekuensi pembersih suara bising angin & gaung mikrofon saat upacara / senam luar ruangan.',
      targetCategory: 'AUDIO_PROCESSING',
      status: 'TESTING',
      stabilityScore: 88,
      founderReviewNotes: 'Bagus untuk dokumentasi luar ruangan. Uji respons latensi pada HP spek rendah.',
      isSandboxEnabled: true,
      author: 'AI Audio Specialist',
      createdDate: '2026-08-18',
      version: 'v0.9.2-alpha'
    },
    {
      id: 'inn-002',
      name: 'Multi-Angle Photo Series Stitcher',
      codename: 'PROJECT_PANORAMA_SANTRI',
      description: 'Menjahit 3 foto berurutan menjadi foto lanskap panggung wisuda lebar tanpa distorsi wajah.',
      targetCategory: 'COMPOSITING',
      status: 'FOUNDER_REVIEW',
      stabilityScore: 94,
      founderReviewNotes: 'Fitur siap diajukan ke produksi setelah final checking batas memori VRAM < 12MB.',
      isSandboxEnabled: true,
      author: 'Optics & Canvas Engineer',
      createdDate: '2026-08-17',
      version: 'v1.0.0-rc1'
    },
    {
      id: 'inn-003',
      name: 'Haptic Feedback on Story Navigation',
      codename: 'PROJECT_VIBRO_TOUCH',
      description: 'Getaran haptic halus (10ms) saat berganti slide story di browser mobile Android/iOS.',
      targetCategory: 'INTERACTION',
      status: 'PRODUCTION_READY',
      stabilityScore: 99,
      founderReviewNotes: 'Sangat halus dan meningkatkan engagement wali murid saat melihat story kegiatan.',
      isSandboxEnabled: true,
      author: 'Mobile UX Specialist',
      createdDate: '2026-08-16',
      version: 'v1.0.0-stable'
    },
    {
      id: 'inn-004',
      name: 'Dynamic Islamic Calligraphy Watermark',
      codename: 'PROJECT_KHAT_SHIELD',
      description: 'Stempel air kaligrafi digital semi-transparan untuk melindungi hak cipta foto dokumentasi sekolah.',
      targetCategory: 'WATERMARK_SECURITY',
      status: 'EXPERIMENTAL',
      stabilityScore: 78,
      founderReviewNotes: 'Eksperimen awal penempatan stempel otomatis agar tidak menutupi wajah santri.',
      isSandboxEnabled: false,
      author: 'Brand Identity Designer',
      createdDate: '2026-08-15',
      version: 'v0.8.0-dev'
    }
  ];

  public static getInstance(): InnovationLabManager {
    if (!InnovationLabManager.instance) {
      InnovationLabManager.instance = new InnovationLabManager();
    }
    return InnovationLabManager.instance;
  }

  public getFeatures(): InnovationFeatureItem[] {
    return [...this.features];
  }

  public subscribe(listener: (features: InnovationFeatureItem[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getFeatures());
    return () => this.listeners.delete(listener);
  }

  public toggleSandbox(id: string): void {
    this.features = this.features.map(f => {
      if (f.id === id) {
        return { ...f, isSandboxEnabled: !f.isSandboxEnabled };
      }
      return f;
    });
    this.notify();
  }

  public updateStatus(id: string, status: InnovationFeatureStatus, notes?: string): void {
    this.features = this.features.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status,
          founderReviewNotes: notes !== undefined ? notes : f.founderReviewNotes
        };
      }
      return f;
    });
    this.notify();
  }

  private notify(): void {
    const data = this.getFeatures();
    this.listeners.forEach(l => l(data));
  }
}
