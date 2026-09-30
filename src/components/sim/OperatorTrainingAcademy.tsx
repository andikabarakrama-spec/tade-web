import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Laptop
} from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  difficulty: 'DASAR' | 'MENENGAH' | 'MAHIR';
  completed: boolean;
  summary: string;
  steps: string[];
}

interface RoleTrack {
  roleId: string;
  roleName: string;
  icon: any;
  description: string;
  modules: TrainingModule[];
}

const TRAINING_TRACKS: RoleTrack[] = [
  {
    roleId: 'KETUA_YAYASAN',
    roleName: 'Ketua Yayasan (Executive)',
    icon: Award,
    description: 'Panduan navigasi Living Workspace R63, 1-click persetujuan anggaran, dan Executive Mission Control R70.',
    modules: [
      {
        id: 'y1',
        title: 'Mengenal Living Workspace R63 & Morning Companion',
        duration: '5 Menit',
        difficulty: 'DASAR',
        completed: true,
        summary: 'Membaca ringkasan pagi, memeriksa kehadiran siswa & guru, serta memantau status kas yayasan.',
        steps: ['Buka Tab R63 di menu samping.', 'Dengarkan atau baca Morning Companion Briefing.', 'Lihat ringkasan kehadiran siswa hari ini.']
      },
      {
        id: 'y2',
        title: '1-Click Digital Signature & Tanda Tangan SK',
        duration: '7 Menit',
        difficulty: 'MENENGAH',
        completed: true,
        summary: 'Melakukan review dan memberikan persetujuan dokumen dengan stempel cryptographic seal TADE.',
        steps: ['Buka antrean Pending Approvals.', 'Review detail proposal anggaran sarpras.', 'Klik Tanda Tangan & Approve dengan cryptographic seal.']
      },
      {
        id: 'y3',
        title: 'Meluncurkan Mandat Autonomous di Mission Control R70',
        duration: '10 Menit',
        difficulty: 'MAHIR',
        completed: false,
        summary: 'Memicu 1-click mission yang otomatis membuat checklist, kalender, notifikasi, dan folder arsip.',
        steps: ['Pilih template misi (misal: Manasik Haji Cilik).', 'Tinjau delegasi otomatis PIC Kepala Sekolah & Panitia.', 'Klik Launch Mission & Pantau Real-Time SLA.']
      }
    ]
  },
  {
    roleId: 'KEPALA_SEKOLAH',
    roleName: 'Kepala Sekolah (Akademik & Manajerial)',
    icon: GraduationCap,
    description: 'Manajemen kurikulum merdeka, supervisi guru, approval RPP, dan penyelenggaraan kegiatan sekolah.',
    modules: [
      {
        id: 'k1',
        title: 'Supervisi Pembelajaran Sentra & Kurikulum',
        duration: '8 Menit',
        difficulty: 'DASAR',
        completed: true,
        summary: 'Memantau capaian tahfidz, hafalan doa harian, dan keterlibatan siswa di sentra.',
        steps: ['Buka menu R17 Tahfidz & Doa.', 'Cek progres hafalan juz 30 per kelompok kelas.', 'Beri catatan apresiasi untuk guru pembimbing.']
      },
      {
        id: 'k2',
        title: 'Penyelenggaraan Event Sekolah di Activity Center R65',
        duration: '10 Menit',
        difficulty: 'MENENGAH',
        completed: false,
        summary: 'Membuat rundown, memantau kehadiran peserta QR, anggaran, dan mencetak LPJ instan.',
        steps: ['Buka R65 School Activity Center.', 'Pilih event aktif.', 'Verifikasi kehadiran peserta via barcode/QR scanner.']
      }
    ]
  },
  {
    roleId: 'ADMIN',
    roleName: 'Admin & Tata Usaha',
    icon: Laptop,
    description: 'Task Inbox cepat R68, verifikasi berkas PPDB, cetak tanda bukti, dan manajemen sarpras.',
    modules: [
      {
        id: 'a1',
        title: 'Operasi Cepat Task Inbox & Pintasan Keyboard 1-4',
        duration: '6 Menit',
        difficulty: 'DASAR',
        completed: true,
        summary: 'Memproses tiket dan antrean harian tanpa mouse menggunakan keyboard shortcut.',
        steps: ['Tekan angka 1 untuk Task Inbox.', 'Tekan angka 2 untuk antrean PPDB.', 'Gunakan tombol Enter untuk Quick Action.']
      },
      {
        id: 'a2',
        title: 'Verifikasi Berkas & Penerimaan Siswa Baru (PPDB)',
        duration: '8 Menit',
        difficulty: 'MENENGAH',
        completed: false,
        summary: 'Memvalidasi akta lahir, KK, bukti bayar pendaftaran dan menerbitkan NISN sementara.',
        steps: ['Buka Tab R13 Verifikasi PPDB.', 'Cek kelengkapan dokumen.', 'Klik Verifikasi & Kirim WhatsApp Notifikasi ke Wali Murid.']
      }
    ]
  },
  {
    roleId: 'GURU',
    roleName: 'Guru & Pendidik Sentra',
    icon: BookOpen,
    description: 'Presensi harian, jurnal anekdot, penilaian e-Rapor PAUD, dan buku penghubung wali murid.',
    modules: [
      {
        id: 'g1',
        title: 'Presensi Siswa Cepat & Mode Offline',
        duration: '5 Menit',
        difficulty: 'DASAR',
        completed: true,
        summary: 'Mencatat presensi hadir, izin, sakit secara instan bahkan ketika jaringan internet terputus.',
        steps: ['Buka R6 Presensi Siswa.', 'Pilih Kelompok A / B.', 'Centang kehadiran, sistem auto-sync saat online.']
      },
      {
        id: 'g2',
        title: 'Input Catatan Anekdot & Foto Perkembangan Siswa',
        duration: '7 Menit',
        difficulty: 'MENENGAH',
        completed: false,
        summary: 'Merekam perilaku unik anak di sentra dan menyusun narasi capaian perkembangan.',
        steps: ['Buka R9 Anekdot & Capaian.', 'Pilih nama siswa.', 'Tuliskan deskripsi peristiwa & tagging capaian profil pelajar Pancasila.']
      }
    ]
  },
  {
    roleId: 'WALI_MURID',
    roleName: 'Wali Murid (Orang Tua)',
    icon: Users,
    description: 'Portal wali murid PWA, QR penjemputan anak, buku penghubung digital, dan pembayaran SPP.',
    modules: [
      {
        id: 'w1',
        title: 'Akses Portal & Menampilkan QR Penjemputan Resmi',
        duration: '4 Menit',
        difficulty: 'DASAR',
        completed: true,
        summary: 'Menunjukkan QR code di gerbang sekolah saat menjemput ananda tercinta.',
        steps: ['Buka Portal Wali Murid R29 di HP.', 'Klik tombol QR Penjemputan Saya.', 'Tunjukkan ke kamera scanner guru piket di gerbang.']
      },
      {
        id: 'w2',
        title: 'Pembayaran SPP & Unduh Kwitansi Digital Otomatis',
        duration: '5 Menit',
        difficulty: 'DASAR',
        completed: true,
        summary: 'Membayar SPP dengan transfer/QRIS dan mengunduh kwitansi resmi ber-QR code.',
        steps: ['Pilih tagihan SPP bulan berjalan.', 'Lakukan transfer dan upload bukti bayar.', 'Unduh invoice resmi tersertifikasi yayasan.']
      }
    ]
  }
];

export const OperatorTrainingAcademy: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('KETUA_YAYASAN');
  const [activeModuleId, setActiveModuleId] = useState<string>('y1');
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [practiceStepIndex, setPracticeStepIndex] = useState<number>(0);

  const currentTrack = TRAINING_TRACKS.find(t => t.roleId === selectedRole) || TRAINING_TRACKS[0];
  const activeModule = currentTrack.modules.find(m => m.id === activeModuleId) || currentTrack.modules[0];

  const totalCompleted = TRAINING_TRACKS.reduce(
    (acc, t) => acc + t.modules.filter(m => m.completed).length,
    0
  );
  const totalModules = TRAINING_TRACKS.reduce((acc, t) => acc + t.modules.length, 0);
  const overallProgress = Math.round((totalCompleted / totalModules) * 100);

  const handleStartPractice = () => {
    setPracticeMode(true);
    setPracticeStepIndex(0);
  };

  const handleNextStep = () => {
    if (practiceStepIndex < activeModule.steps.length - 1) {
      setPracticeStepIndex(prev => prev + 1);
    } else {
      setPracticeMode(false);
      activeModule.completed = true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  TADE ACADEMY & SIMULATOR
                </span>
                <span className="text-xs text-slate-400">Interactive Operator Onboarding</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Operator Training Academy & Practice Mode
              </h1>
              <p className="text-sm text-blue-100/80 mt-0.5">
                Pelatihan interaktif mandiri untuk seluruh 5 peran pemangku kepentingan sekolah demi adopsi digital tanpa stres.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-blue-500/30 rounded-xl p-3.5 flex items-center gap-3 min-w-[200px]">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Progres Pelatihan</div>
              <div className="text-base font-bold text-blue-300">{totalCompleted} dari {totalModules} Modul</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-blue-400 flex items-center justify-center font-bold text-xs text-blue-300">
              {overallProgress}%
            </div>
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="mt-6 pt-4 border-t border-blue-500/20 flex flex-wrap gap-2">
          {TRAINING_TRACKS.map(track => {
            const Icon = track.icon;
            const isSelected = selectedRole === track.roleId;
            return (
              <button
                key={track.roleId}
                onClick={() => {
                  setSelectedRole(track.roleId);
                  setActiveModuleId(track.modules[0].id);
                  setPracticeMode(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  isSelected
                    ? 'bg-blue-500 text-slate-950 shadow-md'
                    : 'bg-slate-900/60 border border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {track.roleName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Track Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Module List for this Role */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Kurikulum {currentTrack.roleName}</h3>
            <p className="text-xs text-slate-500 mb-3">{currentTrack.description}</p>

            <div className="space-y-2">
              {currentTrack.modules.map(mod => (
                <div
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleId(mod.id);
                    setPracticeMode(false);
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    activeModuleId === mod.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{mod.title}</span>
                    {mod.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{mod.duration}</span>
                    <span>•</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{mod.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Selected Module Content or Interactive Practice Mode */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            {!practiceMode ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      MODUL: {activeModule.difficulty} ({activeModule.duration})
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">{activeModule.title}</h2>
                  </div>
                  {activeModule.completed && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Lulus Modul
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeModule.summary}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    Langkah-Langkah Praktek Pembelajaran:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pl-2">
                    {activeModule.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleStartPractice}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow transition"
                  >
                    <Play className="w-4 h-4" />
                    Mulai Mode Simulasi Interaktif
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Practice Simulator */
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Mode Simulasi: Langkah {practiceStepIndex + 1} dari {activeModule.steps.length}
                    </h3>
                  </div>
                  <button
                    onClick={() => setPracticeMode(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Keluar Simulasi
                  </button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-slate-900 dark:text-white">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
                    Instruksi AI Asy:
                  </div>
                  <div className="text-base font-bold">
                    {activeModule.steps[practiceStepIndex]}
                  </div>
                </div>

                {/* Simulated Playground Window */}
                <div className="p-6 bg-slate-950 text-white rounded-xl border border-slate-800 text-center space-y-4">
                  <div className="text-xs text-slate-400">Sandbox Playground Area</div>
                  <div className="w-full py-4 border border-dashed border-blue-500/40 rounded-lg flex items-center justify-center text-xs text-blue-300">
                    [ Simulasi Tombol Aksi Nyata Berhasil Diaktifkan ]
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-lg transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {practiceStepIndex < activeModule.steps.length - 1 ? 'Langkah Selesai & Lanjut' : 'Selesaikan Modul Ini'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
