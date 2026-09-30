import { ActivityType } from './AIAsyActivity';
import { EmotionType } from './AIAsyEmotion';
import { VirtualLocation, VIRTUAL_LOCATIONS } from './AIAsyLocations';
import { BackpackItem, getBehaviorForModule } from './AIAsyBehaviorMirror';
import { getCurrentScheduleRule, ScheduleRule } from './AIAsySchedule';
import { DailyRoutineTime, EventCategory } from './AIAsyLivingSchool';
import { LicenseEngine } from '../../services/license/LicenseEngine';

export interface WorldEngineInput {
  activeTabCode: string;
  userActivity: ActivityType;
  isInputFocused: boolean;
  isIdle: boolean;
  dailyRoutine: DailyRoutineTime;
  eventCategory: EventCategory;
  isBubbleOpen: boolean;
  customEventTitle?: string;
}

export interface InterruptionSnapshot {
  previousLocation: VirtualLocation;
  previousActivity: ActivityType;
  previousEmotion: EmotionType;
  previousProp: BackpackItem;
  previousSpeech: string;
  interruptedAt: number;
}

export interface WorldEngineOutput {
  location: VirtualLocation;
  activity: ActivityType;
  emotion: EmotionType;
  activeProp: BackpackItem;
  speech: string;
  microAction: string;
  priorityLevel: number;
  locationLabel: string;
  ambientEmoji: string;
}

class AIAsyWorldEngineClass {
  private interruptionHistory: InterruptionSnapshot | null = null;
  private lastSpeechUsed: string = '';

  /**
   * Main Evaluation Function for Centralized Rule Engine
   */
  public evaluateWorldState(input: WorldEngineInput): WorldEngineOutput {
    const scheduleRule: ScheduleRule = getCurrentScheduleRule();
    const moduleBehavior = getBehaviorForModule(
      input.activeTabCode,
      input.userActivity,
      input.dailyRoutine,
      input.eventCategory
    );

    // Rule Priority 1: User Focus & Active System Operations (Priority 5)
    if (input.userActivity === 'APPROVAL' || input.userActivity === 'QR') {
      return {
        location: 'ADMIN_OFFICE',
        activity: input.userActivity,
        emotion: 'FOCUSED',
        activeProp: 'STAMP',
        speech: 'Asy bantu verifikasi persetujuan data sekolah.',
        microAction: 'Memegang stempel persetujuan berkas.',
        priorityLevel: 5,
        locationLabel: VIRTUAL_LOCATIONS.ADMIN_OFFICE.indonesianLabel,
        ambientEmoji: VIRTUAL_LOCATIONS.ADMIN_OFFICE.ambientEmoji
      };
    }

    // Rule Priority 2: User Active Input & Searching (Priority 4)
    if (input.isInputFocused || input.userActivity === 'SEARCHING' || input.userActivity === 'TYPING') {
      // Save Interruption Snapshot if not already saved
      if (!this.interruptionHistory) {
        this.interruptionHistory = {
          previousLocation: scheduleRule.location,
          previousActivity: scheduleRule.id === 'PRAYER' ? 'IDLE' : 'READING',
          previousEmotion: scheduleRule.emotion,
          previousProp: scheduleRule.allowedProps[0] || 'NOTEBOOK',
          previousSpeech: scheduleRule.speechList[0],
          interruptedAt: Date.now()
        };
      }

      return {
        location: 'ADMIN_OFFICE',
        activity: input.userActivity,
        emotion: 'CURIOUS',
        activeProp: 'MAGNIFYING_GLASS',
        speech: 'Asy bantu perhatikan ketikan dan pencarian Ayah/Bunda.',
        microAction: 'Menggunakan kaca pembesar untuk memperhatikan detail.',
        priorityLevel: 4,
        locationLabel: VIRTUAL_LOCATIONS.ADMIN_OFFICE.indonesianLabel,
        ambientEmoji: VIRTUAL_LOCATIONS.ADMIN_OFFICE.ambientEmoji
      };
    }

    // Rule Priority 3: Special School Event Override (Priority 3)
    if (input.eventCategory !== 'ACADEMIC_GENERAL') {
      const eventLocation: VirtualLocation =
        input.eventCategory === 'SPORTS' || input.eventCategory === 'INDEPENDENCE'
          ? 'PLAYGROUND'
          : input.eventCategory === 'RAMADAN'
          ? 'PRAYER_AREA'
          : input.eventCategory === 'GRADUATION' || input.eventCategory === 'SCHOOL_ANNIVERSARY'
          ? 'HALL'
          : 'CLASSROOM';

      return {
        location: eventLocation,
        activity: moduleBehavior.activity,
        emotion: 'EXCITED',
        activeProp: moduleBehavior.primaryProp,
        speech: moduleBehavior.mirrorSpeech[0] || 'Asy dukung penuh kegiatan sekolah kita!',
        microAction: moduleBehavior.microAction,
        priorityLevel: 3,
        locationLabel: VIRTUAL_LOCATIONS[eventLocation].indonesianLabel,
        ambientEmoji: VIRTUAL_LOCATIONS[eventLocation].ambientEmoji
      };
    }

    // Rule Priority 4: Resume From Interruption History when user finishes input
    if (this.interruptionHistory && !input.isInputFocused && !input.isBubbleOpen) {
      const resumed = this.interruptionHistory;
      this.interruptionHistory = null; // Reset interruption stack

      return {
        location: resumed.previousLocation,
        activity: resumed.previousActivity,
        emotion: resumed.previousEmotion,
        activeProp: resumed.previousProp,
        speech: `Alhamdulillah, Asy kembali melanjutkan kegiatan di ${VIRTUAL_LOCATIONS[resumed.previousLocation].indonesianLabel}.`,
        microAction: 'Melanjutkan kembali aktivitas sekolah dengan tertib.',
        priorityLevel: 2,
        locationLabel: VIRTUAL_LOCATIONS[resumed.previousLocation].indonesianLabel,
        ambientEmoji: VIRTUAL_LOCATIONS[resumed.previousLocation].ambientEmoji
      };
    }

    // Rule Priority 5: Standard Schedule Engine & Idle (Priority 1-2)
    const licenseNotif = LicenseEngine.getNotification();
    const activeProp = moduleBehavior.primaryProp || scheduleRule.allowedProps[0] || 'STORYBOOK';
    const speechOptions = moduleBehavior.mirrorSpeech.length > 0 ? moduleBehavior.mirrorSpeech : scheduleRule.speechList;
    
    // Pick speech avoiding exact repetition
    let selectedSpeech = speechOptions[Math.floor(Math.random() * speechOptions.length)];

    // Inject license advice if license is in warning/critical state
    if (licenseNotif.severity === 'CRITICAL' || licenseNotif.severity === 'WARNING') {
      selectedSpeech = licenseNotif.aiSpeechSuggestion;
    } else if (selectedSpeech === this.lastSpeechUsed && speechOptions.length > 1) {
      selectedSpeech = speechOptions[(speechOptions.indexOf(selectedSpeech) + 1) % speechOptions.length];
    }
    this.lastSpeechUsed = selectedSpeech;

    const currentLicStatus = LicenseEngine.getLicense().status;
    const computedEmotion: EmotionType =
      currentLicStatus === 'READ_ONLY' || currentLicStatus === 'EXPIRED'
        ? 'CALM'
        : currentLicStatus === 'GRACE_PERIOD'
        ? 'THINKING'
        : input.isIdle
        ? 'CALM'
        : moduleBehavior.defaultEmotion;

    return {
      location: scheduleRule.location,
      activity: input.isIdle ? 'IDLE' : moduleBehavior.activity,
      emotion: computedEmotion,
      activeProp: activeProp,
      speech: selectedSpeech,
      microAction: moduleBehavior.microAction,
      priorityLevel: 1,
      locationLabel: VIRTUAL_LOCATIONS[scheduleRule.location].indonesianLabel,
      ambientEmoji: VIRTUAL_LOCATIONS[scheduleRule.location].ambientEmoji
    };
  }
}

export const AIAsyWorldEngine = new AIAsyWorldEngineClass();
