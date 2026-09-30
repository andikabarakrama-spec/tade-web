/**
 * TADE v9.6.0-MCA6 — R969
 * INSTITUTIONAL LEARNING HOOKS ADAPTER
 * 
 * Maps classroom milestones into the existing SchoolEventHooks & LivingBehaviorEngine:
 * - TAHFIDZ_SESSION_START (Halaqah tilawah dimulai)
 * - CALISTHENICS_START (Waktu senam irama santri bugar)
 * - COLORING_SESSION (Sesi seni mewarnai)
 * - CLASS_CLOSING (Doa kafaratul majlis dan hamdalah penutup)
 */

import { defaultSchoolEventHooks, SchoolEventType } from './schoolEventHooks';
import { defaultClassroomActivityAdapter, ClassroomActivityType } from './classroomActivityAdapter';
import { defaultLivingBehaviorEngine } from './livingBehaviorEngine';
import { defaultLearningGestureController, LearningGestureType } from './learningGestureController';

export interface LearningScheduleEvent {
  id: string;
  label: string;
  activityType: ClassroomActivityType;
  associatedSchoolEvent: SchoolEventType;
  suggestedGesture: LearningGestureType;
  announcementText: string;
}

export const LEARNING_SCHEDULE_EVENTS: LearningScheduleEvent[] = [
  {
    id: 'EV_TAHFIDZ_START',
    label: 'Tahfidz Al-Qur\'an Dimulai',
    activityType: 'TAHFIDZ',
    associatedSchoolEvent: 'TAHFIDZ_HALAQAH_START',
    suggestedGesture: 'OPEN_IQRO',
    announcementText: 'Ustadzah membuka halaqah tahfidz. Asy & Syifa menyimak tilawah dengan khusyuk.'
  },
  {
    id: 'EV_SENAM_START',
    label: 'Senam Pagi Santri Bugar',
    activityType: 'SENAM',
    associatedSchoolEvent: 'SCHOOL_ANNOUNCEMENT_BROADCAST',
    suggestedGesture: 'RHYTHMIC_BODY',
    announcementText: 'Musik senam santri ceria berputar. Semua santri bergerak bugar dan ceria.'
  },
  {
    id: 'EV_COLORING_START',
    label: 'Sesi Mewarnai & Seni',
    activityType: 'MEWARNAI',
    associatedSchoolEvent: 'GALLERY_PHOTO_PUBLISHED',
    suggestedGesture: 'LOOK_TEACHER',
    announcementText: 'Krayon dan kertas gambar dibagikan. Santri mengekspresikan kreativitas islami.'
  },
  {
    id: 'EV_CLASS_CLOSING',
    label: 'Doa Penutup & Hamdalah',
    activityType: 'ISTIRAHAT',
    associatedSchoolEvent: 'SCHOOL_ANNOUNCEMENT_BROADCAST',
    suggestedGesture: 'CLAP_APPRECIATE',
    announcementText: 'Subhanakallahumma wa bihamdika, asyhadu alla ilaha illa anta astaghfiruka wa atubu ilaik.'
  }
];

export class LearningHooksAdapter {
  public triggerLearningEvent(eventId: string): LearningScheduleEvent | null {
    const ev = LEARNING_SCHEDULE_EVENTS.find(e => e.id === eventId);
    if (!ev) return null;

    // 1. Update classroom activity
    defaultClassroomActivityAdapter.setActivity(ev.activityType);

    // 2. Trigger institutional school event hook
    defaultSchoolEventHooks.triggerEvent(ev.associatedSchoolEvent);

    // 3. Trigger learning gesture
    defaultLearningGestureController.triggerGesture(ev.suggestedGesture);

    // 4. Update living behavior
    const prof = defaultClassroomActivityAdapter.getActivityProfile(ev.activityType);
    defaultLivingBehaviorEngine.triggerState(
      prof.primaryBehavior, 
      `Sesi Pembelajaran: ${ev.label}`,
      prof.emotion
    );

    return ev;
  }
}

export const defaultLearningHooksAdapter = new LearningHooksAdapter();
