import { EmotionType } from './AIAsyEmotion';
import { VirtualLocation } from './AIAsyLocations';
import { BackpackItem } from './AIAsyBehaviorMirror';

export type ScheduleActivity =
  | 'MORNING_ARRIVAL'
  | 'GREETING'
  | 'PRAYER'
  | 'STUDY'
  | 'READING'
  | 'DRAWING'
  | 'WRITING'
  | 'PLAYING'
  | 'SPORTS'
  | 'SNACK'
  | 'LUNCH'
  | 'CLEANING'
  | 'GARDENING'
  | 'LIBRARY'
  | 'STORY_TIME'
  | 'GOING_HOME';

export interface ScheduleRule {
  id: ScheduleActivity;
  label: string;
  hourStart: number;
  hourEnd: number;
  priority: number; // 1-5 (Higher = precedence)
  emotion: EmotionType;
  location: VirtualLocation;
  allowedProps: BackpackItem[];
  speechList: string[];
}

export const KINDERGARTEN_SCHEDULE: ScheduleRule[] = [
  {
    id: 'MORNING_ARRIVAL',
    label: 'Kedatangan Pagi Santri',
    hourStart: 6,
    hourEnd: 7,
    priority: 3,
    emotion: 'HAPPY',
    location: 'SCHOOL_GATE',
    allowedProps: ['SCHOOL_FLAG', 'WATER_BOTTLE'],
    speechList: [
      "Assalamu'alaikum! Selamat pagi ceria di sekolah tercinta!",
      "Semangat menyambut hari baru yang penuh ilmu dan kebaikan!"
    ]
  },
  {
    id: 'GREETING',
    label: 'Ikrar Pagi & Senyum Santri',
    hourStart: 7,
    hourEnd: 8,
    priority: 3,
    emotion: 'EXCITED',
    location: 'SCHOOL_GATE',
    allowedProps: ['SCHOOL_FLAG'],
    speechList: [
      "Bismillah! Asy siap baris dan ikrar pagi bersama teman-teman!",
      "Mari kita buka hari dengan senyum santun dan membaca Bismillah."
    ]
  },
  {
    id: 'PRAYER',
    label: 'Sholat Dhuha & Murajaah',
    hourStart: 8,
    hourEnd: 9,
    priority: 4,
    emotion: 'PRAYING',
    location: 'PRAYER_AREA',
    allowedProps: ['STORYBOOK'],
    speechList: [
      "Waktu Sholat Dhuha dan muraja'ah surat-surat pendek Al-Qur'an.",
      "Allahumma innaa adh-dhuhā'a dhuhā'uk... Bismillah penuh khusyuk."
    ]
  },
  {
    id: 'STUDY',
    label: 'Jam Belajar Tematik',
    hourStart: 9,
    hourEnd: 10,
    priority: 3,
    emotion: 'FOCUSED',
    location: 'CLASSROOM',
    allowedProps: ['NOTEBOOK', 'CRAYONS', 'STORYBOOK'],
    speechList: [
      "Saatnya belajar tematik interaktif bersama Ustadz dan Ustadzah!",
      "Asy tekun mencatat dan memperhatikan penjelasan di kelas."
    ]
  },
  {
    id: 'SNACK',
    label: 'Istirahat Snack Sehat',
    hourStart: 10,
    hourEnd: 11,
    priority: 3,
    emotion: 'HAPPY',
    location: 'PLAYGROUND',
    allowedProps: ['WATER_BOTTLE', 'CAKE'],
    speechList: [
      "Waktu istirahat dan makan buah sehat bersama!",
      "Cuci tangan pakai sabun dulu ya sebelum makan."
    ]
  },
  {
    id: 'READING',
    label: 'Literasi & Membaca Buku',
    hourStart: 11,
    hourEnd: 12,
    priority: 3,
    emotion: 'READING',
    location: 'LIBRARY',
    allowedProps: ['STORYBOOK', 'MAGNIFYING_GLASS'],
    speechList: [
      "Asy membaca cerita keteladanan para Nabi di perpustakaan.",
      "Membaca buku membuka jendela pengetahuan dunia!"
    ]
  },
  {
    id: 'LUNCH',
    label: 'Makan Siang Bersama',
    hourStart: 12,
    hourEnd: 13,
    priority: 4,
    emotion: 'THANKFUL',
    location: 'CLASSROOM',
    allowedProps: ['WATER_BOTTLE'],
    speechList: [
      "Allahumma baarik lanaa fii maa razaqtanaa wa qinaa 'adzaaban naar.",
      "Alhamdulillahirobbil 'alamin, rezeki makan siang yang halal dan nikmat!"
    ]
  },
  {
    id: 'PLAYING',
    label: 'Bermain Bebas Outdoor',
    hourStart: 13,
    hourEnd: 14,
    priority: 2,
    emotion: 'PLAYFUL',
    location: 'PLAYGROUND',
    allowedProps: ['SOCCER_BALL', 'BALLOON'],
    speechList: [
      "Bermain ayunan dan bola bersama teman-teman!",
      "Selalu berbagi mainan dan menjaga keselamatan bersama."
    ]
  },
  {
    id: 'CLEANING',
    label: 'Operasi Semut & Kebersihan',
    hourStart: 14,
    hourEnd: 15,
    priority: 3,
    emotion: 'PROUD',
    location: 'CLASSROOM',
    allowedProps: ['FLOWER'],
    speechList: [
      "An-nazhafatu minal iiman! Kebersihan sebagian dari iman.",
      "Mari rapikan mainan dan kelas agar selalu bersih dan nyaman."
    ]
  },
  {
    id: 'GOING_HOME',
    label: 'Penutupan & Pulang',
    hourStart: 15,
    hourEnd: 23,
    priority: 3,
    emotion: 'CALM',
    location: 'SCHOOL_GATE',
    allowedProps: ['SCHOOL_FLAG'],
    speechList: [
      "Alhamdulillah, rangkaian belajar hari ini selesai dengan lancar.",
      "Assalamu'alaikum, sampai jumpa besok pagi insya Allah!"
    ]
  }
];

export const getCurrentScheduleRule = (date: Date = new Date()): ScheduleRule => {
  const currentHour = date.getHours();
  const rule = KINDERGARTEN_SCHEDULE.find(
    (s) => currentHour >= s.hourStart && currentHour < s.hourEnd
  );
  return rule || KINDERGARTEN_SCHEDULE[KINDERGARTEN_SCHEDULE.length - 1];
};
