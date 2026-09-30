/**
 * TADE v9.7.0-MCA7 — R979
 * SCHOOL JOURNEY HOOKS & CAMPUS WAYPOINT SYNCHRONIZER
 * 
 * Maps school day milestones into campus waypoints & character itineraries:
 * 1. KEDATANGAN_PAGI (Gerbang Utama)
 * 2. SENAM_HALAMAN (Halaman Baris)
 * 3. SENTRA_KELAS (Ruang Belajar Ceria)
 * 4. HALAQAH_TAHFIDZ (Pojok Tahfidz Muroja'ah)
 * 5. KREASI_GALERI (Galeri Santri & Pameran)
 * 6. PULANG_SEKOLAH (Gerbang Penjemputan Santun)
 */

import { defaultSchoolWorldAdapter, SchoolAreaType } from './schoolWorldAdapter';
import { defaultSoftWalkingComposer } from './softWalkingComposer';
import { defaultSchoolEventHooks, SchoolEventType } from './schoolEventHooks';
import { defaultLivingBehaviorEngine } from './livingBehaviorEngine';

export interface SchoolJourneyStep {
  id: string;
  label: string;
  targetArea: SchoolAreaType;
  targetXAsy: number;
  targetXSyifa: number;
  associatedSchoolEvent: SchoolEventType;
  narrativeText: string;
}

export const SCHOOL_JOURNEY_STEPS: SchoolJourneyStep[] = [
  {
    id: 'JOURNEY_1_ARRIVAL',
    label: '1. Sambutan Pagi Gerbang',
    targetArea: 'GERBANG',
    targetXAsy: 28,
    targetXSyifa: 72,
    associatedSchoolEvent: 'PPDB_REGISTRATION_OPEN',
    narrativeText: 'Asy & Syifa berdiri di gerbang menyambut teman-teman dengan salam dan senyuman.'
  },
  {
    id: 'JOURNEY_2_HALAMAN',
    label: '2. Baris & Senam Halaman',
    targetArea: 'HALAMAN',
    targetXAsy: 35,
    targetXSyifa: 65,
    associatedSchoolEvent: 'SCHOOL_ANNOUNCEMENT_BROADCAST',
    narrativeText: 'Berbaris rapi di halaman hijau mengikuti ketukan irama senam santri ceria.'
  },
  {
    id: 'JOURNEY_3_KELAS',
    label: '3. Masuk Sentra Kelas',
    targetArea: 'KELAS',
    targetXAsy: 32,
    targetXSyifa: 68,
    associatedSchoolEvent: 'GALLERY_PHOTO_PUBLISHED',
    narrativeText: 'Duduk tertib di meja sentra belajar, menyiapkan krayon dan lembar kreasi.'
  },
  {
    id: 'JOURNEY_4_TAHFIDZ',
    label: '4. Halaqah Tahfidz & Iqro',
    targetArea: 'TAHFIDZ_CORNER',
    targetXAsy: 30,
    targetXSyifa: 70,
    associatedSchoolEvent: 'TAHFIDZ_HALAQAH_START',
    narrativeText: 'Bersila khusyuk di atas karpet halaqah, melantunkan ayat suci dengan tartil.'
  },
  {
    id: 'JOURNEY_5_GALERI',
    label: '5. Apresiasi Galeri Santri',
    targetArea: 'GALERI',
    targetXAsy: 26,
    targetXSyifa: 74,
    associatedSchoolEvent: 'GALLERY_PHOTO_PUBLISHED',
    narrativeText: 'Mengagumi karya seni dan kaligrafi sahabat di papan pameran sekolah.'
  },
  {
    id: 'JOURNEY_6_DEPARTURE',
    label: '6. Penjemputan Santun & Doa Pulang',
    targetArea: 'GERBANG',
    targetXAsy: 30,
    targetXSyifa: 70,
    associatedSchoolEvent: 'SCHOOL_ANNOUNCEMENT_BROADCAST',
    narrativeText: 'Mengucapkan salam penutup, merapikan tas, dan menunggu jemputan dengan tertib.'
  }
];

export class SchoolJourneyHooks {
  private activeStepIndex: number = 0;

  public triggerJourneyStep(stepId: string): SchoolJourneyStep | null {
    const step = SCHOOL_JOURNEY_STEPS.find(s => s.id === stepId);
    if (!step) return null;

    this.activeStepIndex = SCHOOL_JOURNEY_STEPS.indexOf(step);

    // 1. Update Area Profile
    const prof = defaultSchoolWorldAdapter.setArea(step.targetArea);

    // 2. Animate Soft Walking to new coordinates
    defaultSoftWalkingComposer.moveTo('ASY', step.targetXAsy, 2000);
    defaultSoftWalkingComposer.moveTo('SYIFA', step.targetXSyifa, 2000);

    // 3. Trigger Institutional School Event
    defaultSchoolEventHooks.triggerEvent(step.associatedSchoolEvent);

    // 4. Trigger Living Behavior
    defaultLivingBehaviorEngine.triggerState(
      prof.primaryBehavior,
      `Perjalanan Sekolah: ${step.label}`,
      prof.emotion
    );

    return step;
  }

  public getActiveStep(): SchoolJourneyStep {
    return SCHOOL_JOURNEY_STEPS[this.activeStepIndex];
  }
}

export const defaultSchoolJourneyHooks = new SchoolJourneyHooks();
