/**
 * TADE RC99 — R815: Story Studio Express Engine
 * Editor kreatif ringan untuk pembuatan Story 9:16, Reels, Banner Website 16:9, dan Feed 1:1.
 * Mode Express & Creative dengan template Islami & Asy Chibi elements.
 */

export type StoryAspectRatio = '9:16' | '16:9' | '1:1' | '4:3';
export type StoryMode = 'EXPRESS' | 'CREATIVE';

export interface StoryFrameStyle {
  id: string;
  name: string;
  gradientClass: string;
  borderClass: string;
  accentColor: string;
  badgeBg: string;
  textColor: string;
}

export interface StoryProject {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  dateText: string;
  photoUrl: string;
  aspectRatio: StoryAspectRatio;
  mode: StoryMode;
  frameStyleId: string;
  showMascotStamp: boolean;
  showSchoolLogo: boolean;
  filterPreset: 'NORMAL' | 'VIBRANT' | 'WARM' | 'EMERALD_GLOW';
  resolutionPreset: 'PREVIEW' | 'HD_1080' | 'FULL_HD_2K' | 'ULTRA_4K_READY';
}

export class StoryStudioEngine {
  private static instance: StoryStudioEngine | null = null;

  public static readonly FRAME_STYLES: StoryFrameStyle[] = [
    {
      id: 'emerald-islamic',
      name: 'Zamrud Islami Asy',
      gradientClass: 'from-emerald-950/80 via-emerald-900/40 to-slate-950/90',
      borderClass: 'border-emerald-500/40',
      accentColor: '#10b981',
      badgeBg: 'bg-emerald-500 text-slate-950 font-bold',
      textColor: 'text-emerald-100'
    },
    {
      id: 'gold-prestasi',
      name: 'Emas Juara & Wisuda',
      gradientClass: 'from-amber-950/80 via-amber-900/40 to-slate-950/90',
      borderClass: 'border-amber-400/50',
      accentColor: '#f59e0b',
      badgeBg: 'bg-amber-400 text-slate-950 font-bold',
      textColor: 'text-amber-100'
    },
    {
      id: 'pastel-ceria',
      name: 'Pastel Ceria Santri',
      gradientClass: 'from-sky-950/80 via-indigo-900/40 to-slate-950/90',
      borderClass: 'border-sky-400/40',
      accentColor: '#38bdf8',
      badgeBg: 'bg-sky-400 text-slate-950 font-bold',
      textColor: 'text-sky-100'
    },
    {
      id: 'minimalist-clean',
      name: 'Clean White Modern',
      gradientClass: 'from-slate-900/60 via-transparent to-slate-950/90',
      borderClass: 'border-white/30',
      accentColor: '#ffffff',
      badgeBg: 'bg-white text-slate-900 font-bold',
      textColor: 'text-white'
    }
  ];

  public static getInstance(): StoryStudioEngine {
    if (!StoryStudioEngine.instance) {
      StoryStudioEngine.instance = new StoryStudioEngine();
    }
    return StoryStudioEngine.instance;
  }

  public createDefaultProject(initialPhotoUrl?: string): StoryProject {
    return {
      id: `story-${Date.now()}`,
      title: 'Semarak Santri Ceria TK Asy Syifa',
      subtitle: 'Belajar, Berdoa, dan Berkarya Penuh Inspirasi',
      badgeText: '✨ KEGIATAN UNGGULAN',
      dateText: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      photoUrl: initialPhotoUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      aspectRatio: '9:16',
      mode: 'EXPRESS',
      frameStyleId: 'emerald-islamic',
      showMascotStamp: true,
      showSchoolLogo: true,
      filterPreset: 'EMERALD_GLOW',
      resolutionPreset: 'HD_1080'
    };
  }

  public getResolutionDimensions(ratio: StoryAspectRatio, preset: StoryProject['resolutionPreset']): { width: number; height: number; label: string } {
    const multiplier = preset === 'ULTRA_4K_READY' ? 2 : preset === 'FULL_HD_2K' ? 1.33 : preset === 'HD_1080' ? 1 : 0.5;

    switch (ratio) {
      case '9:16':
        return {
          width: Math.round(1080 * multiplier),
          height: Math.round(1920 * multiplier),
          label: `${Math.round(1080 * multiplier)} × ${Math.round(1920 * multiplier)} (Story 9:16)`
        };
      case '16:9':
        return {
          width: Math.round(1920 * multiplier),
          height: Math.round(1080 * multiplier),
          label: `${Math.round(1920 * multiplier)} × ${Math.round(1080 * multiplier)} (Banner 16:9)`
        };
      case '1:1':
        return {
          width: Math.round(1080 * multiplier),
          height: Math.round(1080 * multiplier),
          label: `${Math.round(1080 * multiplier)} × ${Math.round(1080 * multiplier)} (Square 1:1)`
        };
      case '4:3':
        return {
          width: Math.round(1440 * multiplier),
          height: Math.round(1080 * multiplier),
          label: `${Math.round(1440 * multiplier)} × ${Math.round(1080 * multiplier)} (Klasik 4:3)`
        };
    }
  }
}
