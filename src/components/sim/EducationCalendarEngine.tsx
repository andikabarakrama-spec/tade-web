import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Users, 
  HeartHandshake, 
  FileText, 
  Award, 
  Clock, 
  Smile, 
  CheckCircle2, 
  ArrowRight,
  Sun,
  Flame
} from 'lucide-react';

export interface EducationPhase {
  id: string;
  kodeFase: string;
  namaFase: string;
  rentangWaktu: string;
  targetSantri: string;
  sapaanAsy: string;
  nasihatKarakter: string;
  warnaTema: string;
  status: 'BERJALAN' | 'MENDATANG' | 'SELESAI';
  fokusAktivitas: string[];
}

export const EducationCalendarEngine: React.FC = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('FASE-01');

  // Education Calendar Phases for KB-TK-TPA Sentra
  const educationPhases: EducationPhase[] = [
    {
      id: 'FASE-01',
      kodeFase: 'EDU-MPLS',
      namaFase: 'Awal Tahun Ajaran & MPLS Ramah Anak',
      rentangWaktu: '14 Juli – 25 Juli 2026',
      targetSantri: 'Santri Baru Kelompok Bermain & TK A/B',
      sapaanAsy: 'Ahlan wa Sahlan Sahabat Asy! Selamat datang di sekolah kedua kita. Di sini kita bermain, belajar, dan bersahabat dengan riang gembira!',
      nasihatKarakter: 'Menumbuhkan rasa percaya diri, mandiri tanpa ditunggui orang tua, dan saling menyayangi teman.',
      warnaTema: 'emerald',
      status: 'BERJALAN',
      fokusAktivitas: ['Tur Sentra Pembelajaran', 'Ice Breaking Islami', 'Pengenalan Ustadz/Ustadzah', 'Simulasi Adab Masuk Kelas']
    },
    {
      id: 'FASE-02',
      kodeFase: 'EDU-PPDB',
      namaFase: 'Pekan PPDB & Observasi Kesiapan Belajar',
      rentangWaktu: '1 Januari – 31 Mei 2026',
      targetSantri: 'Calon Wali Santri & Santri Baru',
      sapaanAsy: 'Mari bergabung bersama keluarga besar KB-TK-TPA Sentra Asy-Syifa! Sentra alam, seni, imtaq, dan balok menanti petualanganmu!',
      nasihatKarakter: 'Kesiapan motorik halus, kematangan emosi, dan fitrah keimanan sejak dini.',
      warnaTema: 'blue',
      status: 'SELESAI',
      fokusAktivitas: ['Pendaftaran Online SIM', 'Observasi Tumbuh Kembang', 'Wawancara Kemitraan Orang Tua', 'Placement Sentra']
    },
    {
      id: 'FASE-03',
      kodeFase: 'EDU-UTS',
      namaFase: 'Pekan Penilaian Capaian & Asesmen Tengah Semester (UTS)',
      rentangWaktu: '22 September – 3 Oktober 2026',
      targetSantri: 'Seluruh Santri KB & TK',
      sapaanAsy: 'Bismillah! Waktunya menunjukkan kreasi hebat di setiap sentra. Ingat, proses belajar yang jujur dan tekun adalah juara sejati!',
      nasihatKarakter: 'Kejujuran, ketelitian, dan sportivitas dalam menyelesaikan tantangan.',
      warnaTema: 'indigo',
      status: 'MENDATANG',
      fokusAktivitas: ['Asesmen Portofolio Sentra', 'Unjuk Keterampilan Mandiri', 'Hafalan Surat Pendek & Doa Harian', 'Pameran Mini Karya']
    },
    {
      id: 'FASE-04',
      kodeFase: 'EDU-UAS-RAPORT',
      namaFase: 'Asesmen Akhir Semester & Pembagian Raport Narasi',
      rentangWaktu: '1 Desember – 15 Desember 2026',
      targetSantri: 'Santri & Wali Santri Sentra',
      sapaanAsy: 'Alhamdulillah! Selamat atas perkembangan luar biasa ananda di semester ini. Setiap santri memiliki keunikan dan kecerdasan masing-masing.',
      nasihatKarakter: 'Rasa syukur, apresiasi atas usaha orang tua dan guru, serta motivasi untuk terus bertumbuh.',
      warnaTema: 'purple',
      status: 'MENDATANG',
      fokusAktivitas: ['Penerbitan Raport Narasi', 'Konsultasi Perkembangan Anak (KPA)', 'Refleksi Guru Sentra', 'Penyerahan Buku Penghubung']
    },
    {
      id: 'FASE-05',
      kodeFase: 'EDU-LIBUR',
      namaFase: 'Libur Semester & Waktu Berkualitas Bersama Keluarga',
      rentangWaktu: '16 Desember 2026 – 4 Januari 2027',
      targetSantri: 'Seluruh Keluarga Besar Asy-Syifa',
      sapaanAsy: 'Selamat menikmati liburan bersama Ayah dan Bunda! Tetap jaga sholat 5 waktu dan bantu orang tua di rumah ya teman-teman!',
      nasihatKarakter: 'Birrul walidain (berbakti kepada orang tua), menjaga kebersihan, dan cinta lingkungan.',
      warnaTema: 'amber',
      status: 'MENDATANG',
      fokusAktivitas: ['Jurnal Liburan Islami', 'Family Bonding Task', 'Eksplorasi Alam Sekitar', 'Membaca Buku Cerita Harian']
    },
    {
      id: 'FASE-06',
      kodeFase: 'EDU-WISUDA-HAFLAH',
      namaFase: 'Wisuda Tahfidz & Haflah Akhirussanah',
      rentangWaktu: '20 Juni – 26 Juni 2027',
      targetSantri: 'Santri Kelulusan TK B & Santri TPA',
      sapaanAsy: 'Barakallah Fii Umrik wisudawan dan wisudawati cilik! Terbanglah tinggi meraih cita-cita mulia dengan akhlak Al-Qur\'an di dadamu!',
      nasihatKarakter: 'Mahkota kemuliaan bagi orang tua, istiqomah menjaga hafalan, dan siap melangkah ke jenjang SD/MI.',
      warnaTema: 'rose',
      status: 'MENDATANG',
      fokusAktivitas: ['Uji Publik Tahfidz Juz 30', 'Pentas Seni Budaya Sentra', 'Pengalungan Gordon Wisuda', 'Doa Bersama Yayasan']
    },
    {
      id: 'FASE-07',
      kodeFase: 'EDU-PARENTING-BAKSOS',
      namaFase: 'Parenting Akbar & Bakti Sosial Berbagi Berkah',
      rentangWaktu: 'Pekan Kedua Setiap Triwulan',
      targetSantri: 'Komite Sekolah, Wali Santri & Masyarakat Sekitar',
      sapaanAsy: 'Tangan di atas lebih baik daripada tangan di bawah. Mari bergandengan tangan menumbuhkan generasi sholeh pembangun peradaban!',
      nasihatKarakter: 'Empati sosial, kedermawanan, dan sinergi pendidikan antara rumah dan madrasah.',
      warnaTema: 'teal',
      status: 'MENDATANG',
      fokusAktivitas: ['Seminar Parenting Ahli Psikologi', 'Santunan Yatim & Dhuafa', 'Bazar Sembako Murah', 'Pasar Amal Sentra']
    }
  ];

  const activePhase = educationPhases.find(p => p.id === selectedPhaseId) || educationPhases[0];

  return (
    <div id="education-calendar-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
              R239 &bull; EDUCATION CALENDAR ENGINE
            </span>
            <span className="text-xs text-slate-400">Academic Lifecycle &amp; Contextual Guidance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            Education Calendar Engine
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Sinkronisasi ekspresi dan bimbingan Maskot Asy dengan tahapan kalender akademik madrasah: <strong>MPLS &rarr; UTS &rarr; UAS &rarr; Raport &rarr; Liburan &rarr; Wisuda &amp; Haflah &rarr; Parenting</strong>.
          </p>
        </div>
      </div>

      {/* Main Grid: Phase Timeline + Context Detail Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Interactive Academic Timeline */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Fase Kalender Akademik
            </h3>
            <span className="text-[10px] font-mono text-slate-400">7 Fase Utama</span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {educationPhases.map((phase) => {
              const isSelected = phase.id === selectedPhaseId;
              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 shadow-sm ring-1 ring-emerald-400'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700/60 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {phase.kodeFase}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      phase.status === 'BERJALAN' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 animate-pulse'
                        : phase.status === 'SELESAI'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    }`}>
                      {phase.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {phase.namaFase}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {phase.rentangWaktu}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Living Mascot Greeting & Character Focus */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sapaan Kontekstual Asy Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-bold">{activePhase.kodeFase}</span>
                <span className="text-slate-400">&bull; {activePhase.rentangWaktu}</span>
              </div>
              <span className="text-slate-400">Target: {activePhase.targetSantri}</span>
            </div>

            <div className="my-6 flex flex-col md:flex-row items-center gap-6">
              {/* Mascot Bubble Avatar */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-1 shadow-2xl flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-emerald-400/40">
                  <span className="text-4xl animate-bounce">🐱</span>
                  <span className="text-[8px] font-mono font-bold text-emerald-300">ASY GURU</span>
                </div>
              </div>

              {/* Dynamic Greeting Bubble */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-sm text-slate-100 relative w-full">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1.5 font-mono">
                  <Sparkles className="w-4 h-4" />
                  Sapaan Motivasi Maskot Asy:
                </div>
                <p className="leading-relaxed italic text-emerald-100">
                  &ldquo;{activePhase.sapaanAsy}&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200">
              <span className="font-bold flex items-center gap-1 text-emerald-300 mb-1 font-mono">
                <Award className="w-3.5 h-3.5" /> Nilai Karakter &amp; Akhlak Fase Ini:
              </span>
              {activePhase.nasihatKarakter}
            </div>
          </div>

          {/* Focus Activities Checklist */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Aktivitas Utama Fase {activePhase.namaFase}:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePhase.fokusAktivitas.map((act, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
