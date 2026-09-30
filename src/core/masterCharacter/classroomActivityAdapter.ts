/**
 * TADE v9.6.0-MCA6 — R961
 * CLASSROOM ACTIVITY ADAPTER
 * 
 * Maps PAUD/TK Islam classroom learning contexts into living character behaviors:
 * - TAHFIDZ (Tilawah Iqro & hafalan surat pendek)
 * - MEWARNAI (Kreativitas seni & motorik halus)
 * - BERNYANYI (Nasyid edukatif & puji-pujian islami)
 * - SENAM (Gerak tubuh sehat ceria santri)
 * - BERMAIN (Eksplorasi sensori & kebersamaan)
 * - ISTIRAHAT (Adab makan snack & minum duduk)
 */

import { LivingBehaviorState } from './livingBehaviorEngine';
import { MasterEmotionType } from './emotionController';
import { MasterClipName } from './animationClipRegistry';

export type ClassroomActivityType = 
  | 'TAHFIDZ'
  | 'MEWARNAI'
  | 'BERNYANYI'
  | 'SENAM'
  | 'BERMAIN'
  | 'ISTIRAHAT';

export interface ClassroomActivityProfile {
  type: ClassroomActivityType;
  title: string;
  category: 'KOGNITIF' | 'SENI' | 'MOTORIK' | 'ADAB' | 'SOSIAL';
  primaryBehavior: LivingBehaviorState;
  suggestedClip: MasterClipName;
  emotion: MasterEmotionType;
  motionIntensity: number; // 0.1 (very calm) to 1.0 (very dynamic)
  attentionTarget: string;
  bannerQuotes: {
    asy: string;
    syifa: string;
  };
  islamicValue: string;
}

export const CLASSROOM_ACTIVITY_PROFILES: Record<ClassroomActivityType, ClassroomActivityProfile> = {
  TAHFIDZ: {
    type: 'TAHFIDZ',
    title: 'Tahfidz & Muroja\'ah Al-Qur\'an',
    category: 'KOGNITIF',
    primaryBehavior: 'read_iqro',
    suggestedClip: 'readIqro',
    emotion: 'focused',
    motionIntensity: 0.25,
    attentionTarget: 'Mushaf & Iqro Suci',
    bannerQuotes: {
      asy: 'Bismillah, mari kita baca makhraj huruf dengan tartil dan tenang.',
      syifa: 'Simak bacaan ustadzah dan tirukan dengan suara merdu ya teman-teman.'
    },
    islamicValue: 'Sebaik-baik kalian adalah yang belajar Al-Qur\'an dan mengajarkannya.'
  },
  MEWARNAI: {
    type: 'MEWARNAI',
    title: 'Mewarnai & Seni Kreatif',
    category: 'SENI',
    primaryBehavior: 'observe',
    suggestedClip: 'lookAround',
    emotion: 'curious',
    motionIntensity: 0.4,
    attentionTarget: 'Lembar Kreasi Gambar',
    bannerQuotes: {
      asy: 'Pilih warna yang rapi, warnai dari tepi ke tengah ya.',
      syifa: 'Subhanallah, gambar masjid dan tamannya menjadi indah berwarna-warni!'
    },
    islamicValue: 'Allah itu Maha Indah dan menyukai keindahan (kesenian yang baik).'
  },
  BERNYANYI: {
    type: 'BERNYANYI',
    title: 'Nasyid & Lagu Anak Sholeh',
    category: 'SENI',
    primaryBehavior: 'celebrate',
    suggestedClip: 'celebrate',
    emotion: 'happy',
    motionIntensity: 0.7,
    attentionTarget: 'Ustadzah & Melodi Bersama',
    bannerQuotes: {
      asy: 'Mari bertepuk tangan berirama sambil melantunkan puji-pujian.',
      syifa: 'Senandung asmaul husna dan rukun iman bersama sahabat sholihah.'
    },
    islamicValue: 'Menanamkan tauhid dan cinta rasul lewat senandung gembira.'
  },
  SENAM: {
    type: 'SENAM',
    title: 'Senam Irama Santri Ceria',
    category: 'MOTORIK',
    primaryBehavior: 'celebrate',
    suggestedClip: 'wave',
    emotion: 'happy',
    motionIntensity: 0.9,
    attentionTarget: 'Gerakan Instruktur Senam',
    bannerQuotes: {
      asy: 'Rentangkan tangan, angkat kaki, santri sehat disukai Allah!',
      syifa: 'Ikuti irama satu dua tiga, badan bugar hati riang gembira!'
    },
    islamicValue: 'Mukmin yang kuat dan sehat lebih dicintai Allah daripada mukmin yang lemah.'
  },
  BERMAIN: {
    type: 'BERMAIN',
    title: 'Bermain & Eksplorasi Bersama',
    category: 'SOSIAL',
    primaryBehavior: 'butterfly',
    suggestedClip: 'butterfly',
    emotion: 'curious',
    motionIntensity: 0.8,
    attentionTarget: 'Alat Peraga & Teman Sebaya',
    bannerQuotes: {
      asy: 'Mari berbagi mainan dan bergantian secara tertib dan rukun.',
      syifa: 'Bermain balok kayu dan puzzle bersama sahabat sangat menyenangkan.'
    },
    islamicValue: 'Ukhuwah islamiyah dan saling tolong menolong dalam kebaikan.'
  },
  ISTIRAHAT: {
    type: 'ISTIRAHAT',
    title: 'Adab Snack & Rehat Dhuha',
    category: 'ADAB',
    primaryBehavior: 'sit_rest',
    suggestedClip: 'sitSwing',
    emotion: 'calm',
    motionIntensity: 0.2,
    attentionTarget: 'Bekal Sehat & Air Minum',
    bannerQuotes: {
      asy: 'Cuci tangan sebelum makan, baca bismillah, dan gunakan tangan kanan.',
      syifa: 'Duduk dengan tenang, habiskan rezeki berkah, lalu ucap alhamdulillah.'
    },
    islamicValue: 'Mempraktikkan adab makan dan minum sesuai sunnah Rasulullah SAW.'
  }
};

export class ClassroomActivityAdapter {
  private currentActivity: ClassroomActivityType = 'TAHFIDZ';

  public setActivity(activity: ClassroomActivityType): ClassroomActivityProfile {
    this.currentActivity = activity;
    return CLASSROOM_ACTIVITY_PROFILES[activity];
  }

  public getActivityProfile(activity?: ClassroomActivityType): ClassroomActivityProfile {
    return CLASSROOM_ACTIVITY_PROFILES[activity || this.currentActivity];
  }

  public getCurrentActivity(): ClassroomActivityType {
    return this.currentActivity;
  }
}

export const defaultClassroomActivityAdapter = new ClassroomActivityAdapter();
