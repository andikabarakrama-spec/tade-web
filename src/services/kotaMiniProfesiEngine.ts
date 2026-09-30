/**
 * KOTA MINI PROFESI ASY & SYIFA ENGINE — SPRINT G23
 * 
 * Penanda: G23_KOTA_MINI_PROFESI_VERIFIED
 * 
 * Pondasi Utama:
 * - P1: Peta Kota Mini (7 Area: Klinik Cilik, Pos Pemadam, Perpustakaan, Toko Roti, Kebun Berkah, Bengkel Kereta, Kantor Pos)
 * - P2: Cerita Profesi Singkat (~20 Detik per vignette) dengan adab santun & doa harian
 * - P3: Integrasi Sutradara G22 (Susun otomatis tokoh, tempat, kamera, suara)
 * - P4: Transportasi Ceria bergerak pelan (Bus Sekolah, Mobil Pemadam, Ambulans, Traktor, Kereta Pos)
 * - P5: Belajar Tanpa Kompetisi (Lencana Cita-cita & Kartu Doa tanpa ranking/skor)
 * - P6: Hubungkan ke TV Asy, Buku Cerita, Festival, dan Pusat Aset
 * - P7: Living Event Engine: Mode Hari Profesi Sekolah
 */

import { blackBoxRecorder } from './blackBoxRecorder';
import { sutradaraAjaibEngine, DirectedEpisode, DirectorLocation } from './sutradaraAjaibEngine';
import { asySyifaDnaEngine, DnaSignatureSound } from './asySyifaDnaEngine';
import { CameraMotion } from './magicCameraEngine';
import { CharacterType } from '../components/mascot/CartoonCharacterSvg';

export type ProfessionId = 
  | 'DOKTER' 
  | 'PEMADAM' 
  | 'GURU' 
  | 'KOKI' 
  | 'PETANI' 
  | 'MASINIS' 
  | 'PETUGAS_POS';

export type VehicleId = 
  | 'BUS_SEKOLAH' 
  | 'MOBIL_PEMADAM' 
  | 'AMBULANS_MINI' 
  | 'TRAKTOR_KEBUN' 
  | 'KERETA_POS';

export interface StoryAct {
  narrator: string;
  asySpeech: string;
  syifaSpeech: string;
  asyAction: string;
  syifaAction: string;
  camera: CameraMotion;
  sound: DnaSignatureSound;
}

export interface ProfessionVignette {
  act1: StoryAct; // Pengenalan & Sapaan (~7s)
  act2: StoryAct; // Aksi Kebaikan & Tolong-Menolong (~7s)
  act3: StoryAct; // Hikmah Berkah & Doa (~6s)
}

export interface ProfessionArea {
  id: ProfessionId;
  name: string;
  locationName: string;
  shortTitle: string;
  tagline: string;
  iconEmoji: string;
  badgeTitle: string;
  badgeIcon: string;
  badgeColor: string;
  badgeDescription: string;
  primaryVehicle: VehicleId;
  leadCharacter: CharacterType;
  companionCharacter: CharacterType;
  accentGradient: string;
  roofColor: string;
  wallColor: string;
  duaText: string;
  duaMeaning: string;
  moralMessage: string;
  storyDurationSec: number;
  interactiveProps: string[];
  vignetteStory: ProfessionVignette;
}

export interface CityVehicle {
  id: VehicleId;
  name: string;
  emoji: string;
  color: string;
  soundCue: string;
  assignedProfession: ProfessionId;
  speedMode: 'PELAN' | 'SEDANG';
  purpose: string;
}

export interface EarnedProfessionBadge {
  professionId: ProfessionId;
  badgeTitle: string;
  badgeIcon: string;
  earnedAt: number;
  childName: string;
  duaRecorded: string;
  moralAffirmation: string;
}

export interface CityEngineState {
  isCareerDayActive: boolean;
  unlockedBadges: EarnedProfessionBadge[];
  selectedAreaId: ProfessionId;
  activeVehicleId: VehicleId;
  totalStoriesListened: number;
}

export const PROFESSIONS_DATA: Record<ProfessionId, ProfessionArea> = {
  DOKTER: {
    id: 'DOKTER',
    name: 'Klinik Cilik Ramah Anak',
    locationName: 'Klinik Cilik',
    shortTitle: 'Dokter Cilik Penyayang',
    tagline: 'Membantu sahabat yang sakit dengan lembut, senyuman, dan doa kesembuhan.',
    iconEmoji: '🩺',
    badgeTitle: 'Lencana Dokter Penyayang',
    badgeIcon: '🩹',
    badgeColor: 'from-emerald-500 to-teal-600',
    badgeDescription: 'Penuh empati, gemar menolong teman yang sakit, dan menjaga kebersihan.',
    primaryVehicle: 'AMBULANS_MINI',
    leadCharacter: 'ASY',
    companionCharacter: 'SYIFA',
    accentGradient: 'from-emerald-600 to-teal-700',
    roofColor: '#10b981',
    wallColor: '#ecfdf5',
    duaText: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ اشْفِ أَنْتَ الشَّافِي',
    duaMeaning: 'Ya Allah Tuhan sekalian manusia, hilangkanlah kesusahan ini dan sembuhkanlah, Engkaulah Yang Maha Menyembuhkan.',
    moralMessage: 'Menjenguk dan merawat sahabat yang sakit dengan lemah lembut mendatangkan rahmat dan pahala melimpah.',
    storyDurationSec: 20,
    interactiveProps: ['Stetoskop Ceria', 'Perban Pelangi', 'Termometer Senyum', 'Air Madu Hangat'],
    vignetteStory: {
      act1: {
        narrator: 'Di Klinik Cilik yang bersih dan asri, Dek Asy bersiap memakai stetoskop ceria.',
        asySpeech: 'Assalamu’alaikum! Dokter Asy siap memeriksa sahabat yang lelah!',
        syifaSpeech: 'Mbak Syifa siapkan air hangat dan madu manis untuk teman-teman ya!',
        asyAction: 'Memeriksa boneka kelinci dengan stetoskop',
        syifaAction: 'Tersenyum ramah menyambut pasien cilik',
        camera: 'MENDEKAT',
        sound: 'PLING_BINTANG'
      },
      act2: {
        narrator: 'Seorang teman tersandung saat bermain. Dokter Asy membersihkan lukanya dengan sangat lembut.',
        asySpeech: 'Jangan takut ya, kita bersihkan lukanya pelan-pelan sambil baca bismillah.',
        syifaSpeech: 'Hebat sekali, tidak menangis! Ini perban pelangi kebaikan untukmu.',
        asyAction: 'Menempelkan perban pelangi',
        syifaAction: 'Memberikan pelukan hangat dan senyuman',
        camera: 'FOKUS_ASY',
        sound: 'TEPUK_TANGAN_KECIL'
      },
      act3: {
        narrator: 'Semua tersenyum gembira. Dokter Asy dan Mbak Syifa memimpin doa kesembuhan.',
        asySpeech: 'Syafakallah sahabatku! Semoga lekas sehat dan ceria kembali!',
        syifaSpeech: 'Alhamdulillah, terima kasih ya Allah atas kesembuhan kawan kami.',
        asyAction: 'Mengangkat tangan berdoa santun',
        syifaAction: 'Melambaikan tangan ceria',
        camera: 'MENJAUH',
        sound: 'PLING_BINTANG'
      }
    }
  },
  PEMADAM: {
    id: 'PEMADAM',
    name: 'Pos Pemadam Kebakaran Ceria',
    locationName: 'Pos Pemadam',
    shortTitle: 'Pemadam Cilik Pemberani',
    tagline: 'Sigap menolong, menjaga lingkungan, dan menyelamatkan makhluk ciptaan Allah.',
    iconEmoji: '🚒',
    badgeTitle: 'Lencana Pemadam Pemberani',
    badgeIcon: '🧯',
    badgeColor: 'from-rose-500 to-amber-600',
    badgeDescription: 'Pemberani, sigap menolong, dan menyayangi sesama makhluk hidup.',
    primaryVehicle: 'MOBIL_PEMADAM',
    leadCharacter: 'ASY',
    companionCharacter: 'SYIFA',
    accentGradient: 'from-red-500 to-orange-600',
    roofColor: '#ef4444',
    wallColor: '#fff1f2',
    duaText: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    duaMeaning: 'Mukmin yang kuat dan berani berbuat kebaikan lebih dicintai Allah daripada mukmin yang lemah.',
    moralMessage: 'Keberanian digunakan untuk melindungi kebaikan dan menolong sesama yang membutuhkan bantuan.',
    storyDurationSec: 20,
    interactiveProps: ['Helm Pemadam Merah', 'Selang Air Pelangi', 'Tangga Awan', 'Lonceng Siaga'],
    vignetteStory: {
      act1: {
        narrator: 'Lonceng lembut berbunyi di Pos Pemadam Ceria. Dek Asy memakai helm merah dengan gagah.',
        asySpeech: 'Siaga satu! Mobil pemadam merah siap meluncur membantu kota!',
        syifaSpeech: 'Mbak Syifa pastikan selang air pelangi terisi air bersih dari embun pagi!',
        asyAction: 'Memegang roda kemudi mobil pemadam',
        syifaAction: 'Mengecek selang air pelangi',
        camera: 'MENDEKAT',
        sound: 'POP_BALON'
      },
      act2: {
        narrator: 'Ada seekor anak kucing tersangkut di dahan pohon ceria. Pemadam Asy menaikkan tangga lembut.',
        asySpeech: 'Mimi Kucing jangan takut ya, Asy naik pelan-pelan menjemputmu!',
        syifaSpeech: 'Ayo bismillah... pegang kuat-kuat Dek Asy, Mbak Syifa jaga di bawah.',
        asyAction: 'Mengangkat anak kucing dengan lembut',
        syifaAction: 'Menyambut anak kucing dengan handuk hangat',
        camera: 'NAIK_TURUN',
        sound: 'TEPUK_TANGAN_KECIL'
      },
      act3: {
        narrator: 'Anak kucing selamat dan mengeong gembira. Pohon rindang tersenyum segar.',
        asySpeech: 'Tugas selesai dengan selamat! Alhamdulillah, semua senang!',
        syifaSpeech: 'Menyayangi binatang adalah sunnah Rasulullah yang mulia.',
        asyAction: 'Hormat santun sambil tersenyum',
        syifaAction: 'Mengelus kucing dengan kasih sayang',
        camera: 'MENJAUH',
        sound: 'PLING_BINTANG'
      }
    }
  },
  GURU: {
    id: 'GURU',
    name: 'Perpustakaan & Ruang Belajar Ceria',
    locationName: 'Perpustakaan Ceria',
    shortTitle: 'Guru Cilik Bijaksana',
    tagline: 'Membimbing sahabat membaca Al-Qur’an, buku cerita, dan doa harian.',
    iconEmoji: '📚',
    badgeTitle: 'Lencana Guru Bijaksana',
    badgeIcon: '📖',
    badgeColor: 'from-sky-500 to-indigo-600',
    badgeDescription: 'Pecinta ilmu, sabar membimbing kawan, dan gemar menebarkan kalam kebaikan.',
    primaryVehicle: 'BUS_SEKOLAH',
    leadCharacter: 'SYIFA',
    companionCharacter: 'ASY',
    accentGradient: 'from-blue-500 to-indigo-700',
    roofColor: '#3b82f6',
    wallColor: '#eff6ff',
    duaText: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    duaMeaning: 'Ya Tuhanku, tambahkanlah ilmuku dan anugerahkanlah kepadaku pemahaman yang baik.',
    moralMessage: 'Menuntut ilmu adalah ibadah mulia yang membuka pintu kebahagiaan dunia dan akhirat.',
    storyDurationSec: 20,
    interactiveProps: ['Buku Cerita Asy Bergambar', 'Papan Tulis Hijau', 'Kacamata Bijak', 'Bintang Prestasi'],
    vignetteStory: {
      act1: {
        narrator: 'Di Perpustakaan Ceria, Mbak Syifa menata buku-buku kisah nabi dengan rapi.',
        asySpeech: 'Mbak Syifa, Asy ingin membaca kisah Bahtera Nabi Nuh!',
        syifaSpeech: 'Mari duduk tertib beralaskan karpet empuk, kita buka dengan basmalah.',
        asyAction: 'Duduk manis dengan tangan di pangkuan',
        syifaAction: 'Membuka buku cerita bergambar',
        camera: 'MENDEKAT',
        sound: 'FLIP_BUKU'
      },
      act2: {
        narrator: 'Mbak Syifa mengajari Dek Asy dan santri cilik melafalkan doa pembuka hati dengan tartil.',
        asySpeech: 'Robbisy-rohlii shodrii wa yassirlii amrii...',
        syifaSpeech: 'MasyaAllah, suaramu merdu sekali Dek Asy! Pintar dan santun.',
        asyAction: 'Tersenyum gembira sambil mengangguk',
        syifaAction: 'Memberikan bintang stiker di buku',
        camera: 'FOKUS_SYIFA',
        sound: 'PLING_BINTANG'
      },
      act3: {
        narrator: 'Semua buku dikembalikan ke rak dengan rapi dan tertib.',
        asySpeech: 'Membaca buku membuat kita tahu banyak rahasia ciptaan Allah!',
        syifaSpeech: 'Semoga ilmu kita berkah dan diamalkan setiap hari ya.',
        asyAction: 'Menaruh buku di rak rapi',
        syifaAction: 'Tersenyum ramah dan membungkuk santun',
        camera: 'MENJAUH',
        sound: 'TEPUK_TANGAN_KECIL'
      }
    }
  },
  KOKI: {
    id: 'KOKI',
    name: 'Toko Roti & Dapur Berkah',
    locationName: 'Toko Roti',
    shortTitle: 'Koki Cilik Halal & Sehat',
    tagline: 'Membuat makanan lezat, bergizi, dan halal untuk berbagi kepada sesama.',
    iconEmoji: '🥐',
    badgeTitle: 'Lencana Koki Berkah',
    badgeIcon: '🧁',
    badgeColor: 'from-amber-500 to-orange-600',
    badgeDescription: 'Penyayang makanan berkah, gemar berbagi roti, dan menjaga kehalalan.',
    primaryVehicle: 'BUS_SEKOLAH',
    leadCharacter: 'SYIFA',
    companionCharacter: 'ASY',
    accentGradient: 'from-amber-600 to-yellow-600',
    roofColor: '#f59e0b',
    wallColor: '#fffbeb',
    duaText: 'كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ',
    duaMeaning: 'Makanlah dari rezeki yang baik-baik yang Kami berikan kepadamu dan bersyukurlah kepada Allah.',
    moralMessage: 'Makanan yang halal dan thoyyib menyehatkan akal, raga, dan mendatangkan rida Ilahi.',
    storyDurationSec: 20,
    interactiveProps: ['Topi Koki Putih', 'Cetakan Roti Bintang', 'Pengaduk Adonan Ceria', 'Oven Hangat Harum'],
    vignetteStory: {
      act1: {
        narrator: 'Aroma wangi roti madu semerbak dari Toko Roti Ceria Mbak Syifa.',
        asySpeech: 'Nyam! Baunya harum sekali Mbak Syifa, roti bentuk apa yang kita buat?',
        syifaSpeech: 'Hari ini kita buat Roti Bintang Berkah dengan tepung gandum dan kurma manis!',
        asyAction: 'Memakai celemek koki mini',
        syifaAction: 'Mengaduk adonan dalam mangkuk kayu',
        camera: 'MENDEKAT',
        sound: 'POP_BALON'
      },
      act2: {
        narrator: 'Dek Asy membantu mencetak adonan berbentuk bulan sabit dan bintang bercahaya.',
        asySpeech: 'Bismillah, satu cetakan bintang untuk kakek, satu untuk adik!',
        syifaSpeech: 'Indah sekali Dek Asy! Roti halal ini akan kita bagikan ke tetangga.',
        asyAction: 'Menaburkan kismis di atas roti',
        syifaAction: 'Memasukkan loyang ke dalam oven hangat',
        camera: 'FOKUS_SYIFA',
        sound: 'PLING_BINTANG'
      },
      act3: {
        narrator: 'Roti matang kecokelatan yang lezat siap dibagikan dalam kotak anyaman.',
        asySpeech: 'Makan bersama terasa semakin nikmat karena kita berbagi!',
        syifaSpeech: 'Alhamdulillah, terima kasih ya Allah atas rezeki makanan yang thoyyib.',
        asyAction: 'Mengangkat baki roti dengan gembira',
        syifaAction: 'Melambaikan tangan ceria',
        camera: 'MENJAUH',
        sound: 'TEPUK_TANGAN_KECIL'
      }
    }
  },
  PETANI: {
    id: 'PETANI',
    name: 'Kebun Berkah & Alam Hijau',
    locationName: 'Kebun Berkah',
    shortTitle: 'Petani Cilik Penyayang Bumi',
    tagline: 'Menanam benih sayur segar, menyiram bunga, dan merawat bumi ciptaan Allah.',
    iconEmoji: '🌱',
    badgeTitle: 'Lencana Sahabat Bumi',
    badgeIcon: '🌾',
    badgeColor: 'from-emerald-600 to-green-700',
    badgeDescription: 'Pecinta tanaman, tekun merawat alam, dan bersyukur atas rezeki bumi.',
    primaryVehicle: 'TRAKTOR_KEBUN',
    leadCharacter: 'ASY',
    companionCharacter: 'SYIFA',
    accentGradient: 'from-green-600 to-emerald-800',
    roofColor: '#059669',
    wallColor: '#ecfdf5',
    duaText: 'مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا إِلَّا كَانَ لَهُ صَدَقَةً',
    duaMeaning: 'Tidaklah seorang muslim menanam tanaman melainkan yang dimakan darinya bernilai sedekah baginya.',
    moralMessage: 'Setiap benih yang kita rawat dengan cinta akan tumbuh menjadi berkah dan sedekah berlimpah.',
    storyDurationSec: 20,
    interactiveProps: ['Caping Jerami', 'Penyiram Tanaman Bunga', 'Sekop Kecil Ceria', 'Wortel Raksasa'],
    vignetteStory: {
      act1: {
        narrator: 'Di Kebun Berkah, embun pagi berkilauan di atas daun bayam dan buah semangka.',
        asySpeech: 'Dek Asy naik traktor kebun hijau! Siap gemburkan tanah subur!',
        syifaSpeech: 'Mbak Syifa bawa bibit jagung manis dan penyiram air sejuk.',
        asyAction: 'Menyetir traktor kebun mini',
        syifaAction: 'Menaburkan benih ke tanah gembur',
        camera: 'MENDEKAT',
        sound: 'PLING_BINTANG'
      },
      act2: {
        narrator: 'Matahari pagi bersinar hangat. Hujan rintik berkah turun membasahi kebun.',
        asySpeech: 'Lihat Mbak Syifa, tunas wortel dan tomat kita sudah tumbuh tinggi!',
        syifaSpeech: 'Subhanallah, Allah Maha Menumbuhkan segala tanaman di muka bumi.',
        asyAction: 'Melompat ceria melihat sayuran segar',
        syifaAction: 'Menyiram bunga matahari dengan lembut',
        camera: 'NAIK_TURUN',
        sound: 'TEPUK_TANGAN_KECIL'
      },
      act3: {
        narrator: 'Hasil panen sayur segar dikumpulkan dalam gerobak kebaikan.',
        asySpeech: 'Sayur ini renyah dan sehat, siap dimasak untuk santri ceria!',
        syifaSpeech: 'Mari kita jaga tanaman kita agar bumi selalu hijau dan asri.',
        asyAction: 'Mengangkat keranjang wortel',
        syifaAction: 'Melambaikan tangan ceria ke arah kebun',
        camera: 'MENJAUH',
        sound: 'PLING_BINTANG'
      }
    }
  },
  MASINIS: {
    id: 'MASINIS',
    name: 'Bengkel & Stasiun Kereta Pelangi',
    locationName: 'Bengkel Kereta',
    shortTitle: 'Masinis Cilik Tangguh',
    tagline: 'Memeriksa roda kereta cerita, meniup peluit keberangkatan, dan mengantar santri berkeliling.',
    iconEmoji: '🚂',
    badgeTitle: 'Lencana Masinis Tangguh',
    badgeIcon: '🚆',
    badgeColor: 'from-cyan-500 to-blue-700',
    badgeDescription: 'Disiplin, bertanggung jawab menjaga keselamatan penumpang, dan penuh semangat.',
    primaryVehicle: 'KERETA_POS',
    leadCharacter: 'ASY',
    companionCharacter: 'SYIFA',
    accentGradient: 'from-sky-600 to-cyan-800',
    roofColor: '#0284c7',
    wallColor: '#f0f9ff',
    duaText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    duaMeaning: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya.',
    moralMessage: 'Keselamatan dan ketertiban adalah amanah mulia seorang masinis yang menjaga seluruh penumpang.',
    storyDurationSec: 20,
    interactiveProps: ['Topi Masinis Biru', 'Peluit Kereta Emas', 'Kunci Pas Ceria', 'Lampu Sinyal Hijau'],
    vignetteStory: {
      act1: {
        narrator: 'Di Bengkel Kereta Stasiun Ceria, lokomotif pelangi bersinar bersih dan kokoh.',
        asySpeech: 'Tut-tuuut! Masinis Asy memeriksa roda dan baut kereta dengan teliti!',
        syifaSpeech: 'Mbak Syifa pastikan lampu sinyal hijau menyala terang dan gerbong bersih!',
        asyAction: 'Mengetuk roda kereta dengan kunci pas mini',
        syifaAction: 'Mengelap jendela gerbong penumpang',
        camera: 'MENDEKAT',
        sound: 'TUT_TUT_KERETA'
      },
      act2: {
        narrator: 'Semua santri naik ke gerbong dengan antre tertib dan membaca doa naik kendaraan.',
        asySpeech: 'Pintu ditutup rapat... semuanya sudah duduk manis?',
        syifaSpeech: 'Bismillah... siap masinis! Kereta Cerita melaju melintasi bukit pelangi!',
        asyAction: 'Meniup peluit masinis tut-tut',
        syifaAction: 'Melambaikan bendera hijau sinyal aman',
        camera: 'GESER_PELAN',
        sound: 'TUT_TUT_KERETA'
      },
      act3: {
        narrator: 'Kereta meluncur lembut di atas rel awan. Angin semilir menyapa wajah gembira para santri.',
        asySpeech: 'Perjalanan aman dan menyenangkan berkat doa dan ketertiban kita semua!',
        syifaSpeech: 'Alhamdulillah, tiba di stasiun tujuan dengan selamat dan hati riang.',
        asyAction: 'Memberi hormat santun masinis',
        syifaAction: 'Tersenyum menyambut penumpang turun',
        camera: 'MENJAUH',
        sound: 'PLING_BINTANG'
      }
    }
  },
  PETUGAS_POS: {
    id: 'PETUGAS_POS',
    name: 'Kantor Pos & Surat Senyuman Asy',
    locationName: 'Kantor Pos Asy',
    shortTitle: 'Sahabat Pos Ceria',
    tagline: 'Mengantarkan surat doa, kartu ucapan bahagia, dan bingkisan kasih sayang ke seluruh kota.',
    iconEmoji: '✉️',
    badgeTitle: 'Lencana Sahabat Pos Ceria',
    badgeIcon: '📬',
    badgeColor: 'from-violet-500 to-purple-700',
    badgeDescription: 'Jujur, tepat waktu menyampaikan amanah surat, dan menyebarkan kabar gembira.',
    primaryVehicle: 'KERETA_POS',
    leadCharacter: 'ASY',
    companionCharacter: 'SYIFA',
    accentGradient: 'from-purple-600 to-indigo-800',
    roofColor: '#7c3aed',
    wallColor: '#faf5ff',
    duaText: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    duaMeaning: 'Senyum manismu di hadapan saudaramu bernilai sedekah bagimu.',
    moralMessage: 'Menjaga amanah surat dan menyebarkan pesan kedamaian mempererat tali persaudaraan.',
    storyDurationSec: 20,
    interactiveProps: ['Tas Pos Kulit Cokelat', 'Perangko Bintang', 'Cap Pos Senyum', 'Sepeda Pos Biru'],
    vignetteStory: {
      act1: {
        narrator: 'Di Kantor Pos Asy, surat-surat doa beramplop warna-warni tertata rapi di loket.',
        asySpeech: 'Assalamu’alaikum! Petugas Pos Asy siap mengantar surat kebahagiaan!',
        syifaSpeech: 'Mbak Syifa sudah stempel semua amplop dengan cap bintang berkah.',
        asyAction: 'Memasukkan surat ke tas pos selempang',
        syifaAction: 'Mengecap perangko senyuman',
        camera: 'MENDEKAT',
        sound: 'FLIP_BUKU'
      },
      act2: {
        narrator: 'Petugas Pos Asy mengayuh sepeda pos birunya melewati jembatan pelangi kota mini.',
        asySpeech: 'Surat untuk Nenek dan Ustadzah tercinta sudah sampai di kotak pos!',
        syifaSpeech: 'Lihat, mereka tersenyum bahagia membaca kartu ucapan doa dari santri.',
        asyAction: 'Memasukkan surat ke kotak pos merah',
        syifaAction: 'Melambaikan tangan menyapa warga',
        camera: 'GESER_PELAN',
        sound: 'PLING_BINTANG'
      },
      act3: {
        narrator: 'Setiap surat yang terkirim membawa kabar damai dan senyuman di seluruh kota.',
        asySpeech: 'Menjaga amanah surat tuntas tanpa ada yang tertinggal!',
        syifaSpeech: 'Alhamdulillah, terima kasih ya Allah atas kesempatan berbuat kebaikan.',
        asyAction: 'Tersenyum lebar dengan jempol terangkat',
        syifaAction: 'Mengucapkan salam dengan santun',
        camera: 'MENJAUH',
        sound: 'PLING_BINTANG'
      }
    }
  }
};

export const VEHICLES_DATA: Record<VehicleId, CityVehicle> = {
  BUS_SEKOLAH: {
    id: 'BUS_SEKOLAH',
    name: 'Bus Sekolah Ceria',
    emoji: '🚌',
    color: '#eab308',
    soundCue: 'tut-tut ramah',
    assignedProfession: 'GURU',
    speedMode: 'PELAN',
    purpose: 'Mengantar santri pergi dan pulang sekolah dengan riang dan bernyanyi doa.'
  },
  MOBIL_PEMADAM: {
    id: 'MOBIL_PEMADAM',
    name: 'Mobil Pemadam Merah',
    emoji: '🚒',
    color: '#ef4444',
    soundCue: 'wi-uu ceria',
    assignedProfession: 'PEMADAM',
    speedMode: 'PELAN',
    purpose: 'Sigap membantu kucing tersangkut dan menyiram tanaman kota di kala panas.'
  },
  AMBULANS_MINI: {
    id: 'AMBULANS_MINI',
    name: 'Ambulans Mini Kasih Sayang',
    emoji: '🚑',
    color: '#10b981',
    soundCue: 'din-din lembut',
    assignedProfession: 'DOKTER',
    speedMode: 'PELAN',
    purpose: 'Membawa perlengkapan P3K, madu manis, dan kotak obat untuk sahabat.'
  },
  TRAKTOR_KEBUN: {
    id: 'TRAKTOR_KEBUN',
    name: 'Traktor Kebun Hijau',
    emoji: '🚜',
    color: '#22c55e',
    soundCue: 'brum-brum halus',
    assignedProfession: 'PETANI',
    speedMode: 'PELAN',
    purpose: 'Menggemburkan tanah subur dan mengangkut keranjang semangka panen berkah.'
  },
  KERETA_POS: {
    id: 'KERETA_POS',
    name: 'Kereta Pos & Cerita',
    emoji: '🚂',
    color: '#3b82f6',
    soundCue: 'tut-tut-tut peluit ceria',
    assignedProfession: 'MASINIS',
    speedMode: 'PELAN',
    purpose: 'Mengantarkan surat doa, bingkisan kawan, dan mengajak santri berpetualang.'
  }
};

const STORAGE_KEY_CITY_STATE = 'tade_g23_city_state_v1';
const STORAGE_KEY_BADGES = 'tade_g23_earned_badges_v1';

export class KotaMiniProfesiEngine {
  private static instance: KotaMiniProfesiEngine;
  private state: CityEngineState;

  private constructor() {
    this.state = this.loadInitialState();
  }

  public static getInstance(): KotaMiniProfesiEngine {
    if (!KotaMiniProfesiEngine.instance) {
      KotaMiniProfesiEngine.instance = new KotaMiniProfesiEngine();
    }
    return KotaMiniProfesiEngine.instance;
  }

  private loadInitialState(): CityEngineState {
    const defaultState: CityEngineState = {
      isCareerDayActive: false,
      unlockedBadges: [],
      selectedAreaId: 'DOKTER',
      activeVehicleId: 'AMBULANS_MINI',
      totalStoriesListened: 0
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_CITY_STATE);
        const savedBadges = localStorage.getItem(STORAGE_KEY_BADGES);
        if (saved) {
          const parsed = JSON.parse(saved);
          defaultState.isCareerDayActive = !!parsed.isCareerDayActive;
          defaultState.selectedAreaId = parsed.selectedAreaId || 'DOKTER';
          defaultState.activeVehicleId = parsed.activeVehicleId || 'AMBULANS_MINI';
          defaultState.totalStoriesListened = parsed.totalStoriesListened || 0;
        }
        if (savedBadges) {
          defaultState.unlockedBadges = JSON.parse(savedBadges);
        }
      }
    } catch {
      // Fallback
    }

    return defaultState;
  }

  private persistState(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const toSave = {
          isCareerDayActive: this.state.isCareerDayActive,
          selectedAreaId: this.state.selectedAreaId,
          activeVehicleId: this.state.activeVehicleId,
          totalStoriesListened: this.state.totalStoriesListened
        };
        localStorage.setItem(STORAGE_KEY_CITY_STATE, JSON.stringify(toSave));
        localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(this.state.unlockedBadges));
      }
    } catch {
      // Ignore
    }
  }

  public getState(): CityEngineState {
    return { ...this.state };
  }

  public toggleCareerDay(forceState?: boolean): boolean {
    const nextState = typeof forceState === 'boolean' ? forceState : !this.state.isCareerDayActive;
    this.state.isCareerDayActive = nextState;
    this.persistState();

    blackBoxRecorder.record({
      moduleCode: 'KOTA_MINI_PROFESI',
      role: 'GURU',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G23_KOTA_MINI_PROFESI_VERIFIED] Hari Profesi Toggled: ${nextState ? 'ACTIVE' : 'INACTIVE'}`,
      route: '/city-hub',
      severity: 'INFO'
    });

    return this.state.isCareerDayActive;
  }

  public selectArea(profId: ProfessionId): ProfessionArea {
    this.state.selectedAreaId = profId;
    const area = PROFESSIONS_DATA[profId];
    this.state.activeVehicleId = area.primaryVehicle;
    this.persistState();
    return area;
  }

  public selectVehicle(vId: VehicleId): CityVehicle {
    this.state.activeVehicleId = vId;
    this.persistState();
    return VEHICLES_DATA[vId];
  }

  public awardBadge(profId: ProfessionId, childName: string = 'Santri Teladan'): EarnedProfessionBadge {
    const area = PROFESSIONS_DATA[profId];
    
    // Check if already earned by this name
    const existingIndex = this.state.unlockedBadges.findIndex(
      b => b.professionId === profId && b.childName.toLowerCase() === childName.toLowerCase()
    );

    const badge: EarnedProfessionBadge = {
      professionId: profId,
      badgeTitle: area.badgeTitle,
      badgeIcon: area.badgeIcon,
      earnedAt: Date.now(),
      childName: childName.trim() || 'Santri Ceria',
      duaRecorded: area.duaText,
      moralAffirmation: area.moralMessage
    };

    if (existingIndex >= 0) {
      this.state.unlockedBadges[existingIndex] = badge;
    } else {
      this.state.unlockedBadges.push(badge);
    }

    this.state.totalStoriesListened += 1;
    this.persistState();

    // Trigger audio cue
    asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');

    blackBoxRecorder.record({
      moduleCode: 'KOTA_MINI_PROFESI',
      role: 'GURU',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G23_KOTA_MINI_PROFESI_VERIFIED] Awarded Badge ${area.badgeTitle} to ${badge.childName}`,
      route: '/city-hub/badge',
      severity: 'INFO'
    });

    return badge;
  }

  /**
   * P3 Integration: Automatically compiles a G22 Sutradara Episode from this profession
   * and saves it to TV Asy, Buku Cerita, Festival, and Asset Center.
   */
  public generateAndExportDirectorEpisode(profId: ProfessionId): DirectedEpisode {
    const area = PROFESSIONS_DATA[profId];

    // Map profession to DirectorLocation
    let mappedLoc: DirectorLocation = 'KAMPUNG_CERIA';
    if (profId === 'DOKTER' || profId === 'GURU') mappedLoc = 'RUMAH_ASY';
    else if (profId === 'MASINIS') mappedLoc = 'STASIUN';
    else if (profId === 'KOKI') mappedLoc = 'PASAR_CERIA';
    else if (profId === 'PETANI') mappedLoc = 'TAMAN';
    else if (profId === 'PEMADAM') mappedLoc = 'KAMPUNG_CERIA';
    else if (profId === 'PETUGAS_POS') mappedLoc = 'FESTIVAL';

    const customTitle = `Kisah ${area.shortTitle}: ${area.tagline}`;
    
    // Compose via G22 engine
    const episode = sutradaraAjaibEngine.composeEpisode('PROFESI', {
      customLocation: mappedLoc,
      titleOverride: customTitle,
      customLead: area.leadCharacter
    });

    // Save and export
    sutradaraAjaibEngine.saveEpisode(episode);

    blackBoxRecorder.record({
      moduleCode: 'KOTA_MINI_PROFESI',
      role: 'GURU',
      tenant: 'TK_ASY_SYIFA',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[G23_KOTA_MINI_PROFESI_VERIFIED] Generated G22 Episode: ${episode.title} (${episode.code})`,
      route: '/city-hub/director-export',
      severity: 'INFO'
    });

    return episode;
  }

  public getAllProfessions(): ProfessionArea[] {
    return Object.values(PROFESSIONS_DATA);
  }

  public getAllVehicles(): CityVehicle[] {
    return Object.values(VEHICLES_DATA);
  }

  public getUnlockedBadges(): EarnedProfessionBadge[] {
    return [...this.state.unlockedBadges];
  }

  public resetBadges(): void {
    this.state.unlockedBadges = [];
    this.persistState();
  }
}

export const kotaMiniProfesiEngine = KotaMiniProfesiEngine.getInstance();
