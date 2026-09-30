import React from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  CalendarCheck, 
  UserPlus, 
  Database, 
  BookOpen, 
  FileText, 
  DollarSign, 
  PieChart, 
  Bell, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  Zap,
  Bot,
  Terminal,
  Building2
} from 'lucide-react';
import { UserRole } from '../../types';

interface SmartQuickActionsProps {
  role: UserRole;
  onNavigate: (module: string) => void;
}

interface ActionItem {
  id: string;
  label: string;
  description: string;
  targetModule: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  colorClass: string;
}

export const SmartQuickActions: React.FC<SmartQuickActionsProps> = ({ role, onNavigate }) => {
  const getActionsForRole = (): ActionItem[] => {
    switch (role) {
      case 'GURU':
        return [
          {
            id: 'guru-presensi',
            label: 'Presensi Siswa Hari Ini',
            description: 'Input & verifikasi absensi kelas harian',
            targetModule: 'r6',
            icon: <CalendarCheck className="w-5 h-5" />,
            badge: 'Harian',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'guru-catatan',
            label: 'Catatan Anekdot & Observasi',
            description: 'Dokumentasikan perkembangan karakter ananda',
            targetModule: 'r9',
            icon: <BookOpen className="w-5 h-5" />,
            badge: 'Karakter',
            badgeColor: 'bg-amber-100 text-amber-900',
            colorClass: 'hover:border-amber-500 hover:bg-amber-50/50 text-amber-700'
          },
          {
            id: 'guru-erapor',
            label: 'Input e-Rapor & Capaian',
            description: 'Penyusunan capaian pembelajaran semester',
            targetModule: 'r8',
            icon: <Award className="w-5 h-5" />,
            colorClass: 'hover:border-teal-500 hover:bg-teal-50/50 text-teal-700'
          },
          {
            id: 'guru-tahfidz',
            label: 'Tahfidz & Doa Harian',
            description: 'Catat hafalan surah pendek dan doa',
            targetModule: 'r17',
            icon: <Sparkles className="w-5 h-5" />,
            badge: 'Qurani',
            badgeColor: 'bg-purple-100 text-purple-800',
            colorClass: 'hover:border-purple-500 hover:bg-purple-50/50 text-purple-700'
          }
        ];

      case 'KEUANGAN':
      case 'BENDAHARA' as any:
        return [
          {
            id: 'fin-verifikasi',
            label: 'Verifikasi Pembayaran SPP',
            description: 'Validasi bukti transfer dan cetak kwitansi digital',
            targetModule: 'r11',
            icon: <DollarSign className="w-5 h-5" />,
            badge: 'Prioritas',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'fin-tagihan',
            label: 'Kelola Tagihan & SPP',
            description: 'Terbitkan tagihan SPP bulanan siswa',
            targetModule: 'r10',
            icon: <FileText className="w-5 h-5" />,
            colorClass: 'hover:border-amber-500 hover:bg-amber-50/50 text-amber-700'
          },
          {
            id: 'fin-laporan',
            label: 'Laporan Arus Kas Keuangan',
            description: 'Rekapitulasi pemasukan, pengeluaran, & neraca',
            targetModule: 'r12',
            icon: <PieChart className="w-5 h-5" />,
            badge: 'Akuntansi',
            badgeColor: 'bg-teal-100 text-teal-800',
            colorClass: 'hover:border-teal-500 hover:bg-teal-50/50 text-teal-700'
          }
        ];

      case 'WALI_MURID':
      case 'CALON_WALI_MURID':
      case 'ALUMNI_FAMILY':
        return [
          {
            id: 'wali-pengumuman',
            label: 'Pengumuman & Agenda',
            description: 'Lihat informasi resmi dari yayasan dan sekolah',
            targetModule: 'r15',
            icon: <Bell className="w-5 h-5" />,
            badge: 'Terbaru',
            badgeColor: 'bg-amber-100 text-amber-900',
            colorClass: 'hover:border-amber-500 hover:bg-amber-50/50 text-amber-700'
          },
          {
            id: 'wali-perkembangan',
            label: 'Pantau Perkembangan Anak',
            description: 'Lihat e-Rapor dan catatan anekdot harian',
            targetModule: 'r29',
            icon: <Award className="w-5 h-5" />,
            badge: 'E-Rapor',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'wali-tagihan',
            label: 'Riwayat Pembayaran & Kwitansi',
            description: 'Periksa status SPP dan unduh bukti sah',
            targetModule: 'r11',
            icon: <DollarSign className="w-5 h-5" />,
            colorClass: 'hover:border-teal-500 hover:bg-teal-50/50 text-teal-700'
          }
        ];

      case 'KEPALA_SEKOLAH':
      case 'KETUA_YAYASAN':
        return [
          {
            id: 'exec-ppdb',
            label: 'Otorisasi & Review PPDB',
            description: 'Verifikasi berkas penerimaan murid baru',
            targetModule: 'r13',
            icon: <UserCheck className="w-5 h-5" />,
            badge: 'PPDB Active',
            badgeColor: 'bg-amber-100 text-amber-900',
            colorClass: 'hover:border-amber-500 hover:bg-amber-50/50 text-amber-700'
          },
          {
            id: 'exec-laporan',
            label: 'Laporan Keuangan Eksekutif',
            description: 'Laporan neraca kas dan realisasi anggaran',
            targetModule: 'r12',
            icon: <PieChart className="w-5 h-5" />,
            badge: 'Audit Ready',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'exec-presensi',
            label: 'Monitoring Presensi Guru & Staf',
            description: 'Rekapitulasi kedisiplinan dan absensi pendidik',
            targetModule: 'r7',
            icon: <CalendarCheck className="w-5 h-5" />,
            colorClass: 'hover:border-teal-500 hover:bg-teal-50/50 text-teal-700'
          },
          {
            id: 'exec-portal',
            label: 'Portal Kepsek Eksekutif',
            description: 'Ringkasan komprehensif seluruh operasional',
            targetModule: 'r31',
            icon: <ShieldCheck className="w-5 h-5" />,
            colorClass: 'hover:border-purple-500 hover:bg-purple-50/50 text-purple-700'
          }
        ];

      case 'SUPER_ADMIN':
        return [
          {
            id: 'super-tower',
            label: 'Kelola Multi-Unit Sekolah',
            description: 'Pemantauan seluruh unit sekolah & analitik terpadu',
            targetModule: 'r119',
            icon: <Building2 className="w-5 h-5" />,
            badge: 'Multi-Unit',
            badgeColor: 'bg-indigo-100 text-indigo-900',
            colorClass: 'hover:border-indigo-500 hover:bg-indigo-50/50 text-indigo-700'
          },
          {
            id: 'super-command',
            label: 'Pusat Operasional Induk',
            description: 'Manajemen operasional sistem & sinkronisasi data',
            targetModule: 'r111',
            icon: <Zap className="w-5 h-5" />,
            badge: 'Operasional',
            badgeColor: 'bg-emerald-100 text-emerald-900',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'super-root',
            label: 'Keamanan Akun & FIDO2 Vault',
            description: 'Pengamanan autentikasi biometrik FIDO2 & hak akses RBAC',
            targetModule: 'r131',
            icon: <ShieldCheck className="w-5 h-5" />,
            badge: 'Keamanan',
            badgeColor: 'bg-teal-100 text-teal-900',
            colorClass: 'hover:border-teal-500 hover:bg-teal-50/50 text-teal-700'
          },
          {
            id: 'super-mission',
            label: 'Asisten Cerdas AI Asy',
            description: 'Pusat bantuan asisten cerdas AI & alur kerja sekolah',
            targetModule: 'r132',
            icon: <Bot className="w-5 h-5" />,
            badge: 'AI Asy',
            badgeColor: 'bg-purple-100 text-purple-900',
            colorClass: 'hover:border-purple-500 hover:bg-purple-50/50 text-purple-700'
          }
        ];

      case 'ADMIN':
      default:
        return [
          {
            id: 'admin-ppdb',
            label: 'Verifikasi PPDB Online',
            description: 'Periksa & setujui pendaftar calon siswa baru',
            targetModule: 'r13',
            icon: <UserCheck className="w-5 h-5" />,
            badge: 'PPDB',
            badgeColor: 'bg-amber-100 text-amber-900',
            colorClass: 'hover:border-amber-500 hover:bg-amber-50/50 text-amber-700'
          },
          {
            id: 'admin-siswa',
            label: 'Data Pokok Siswa',
            description: 'Kelola data induk siswa, rombel, dan mutasi',
            targetModule: 'r3',
            icon: <UserPlus className="w-5 h-5" />,
            badge: 'Kesiswaan',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'admin-keuangan',
            label: 'Verifikasi SPP & Kwitansi',
            description: 'Validasi bukti bayar & penerbitan kwitansi sah',
            targetModule: 'r11',
            icon: <DollarSign className="w-5 h-5" />,
            badge: 'Keuangan',
            badgeColor: 'bg-sky-100 text-sky-800',
            colorClass: 'hover:border-sky-500 hover:bg-sky-50/50 text-sky-700'
          },
          {
            id: 'admin-adoption',
            label: 'Adopsi Layanan Wali Murid',
            description: 'Pantau instalasi PWA, notifikasi, dan sambutan wali murid',
            targetModule: 'r941',
            icon: <Sparkles className="w-5 h-5" />,
            badge: 'Wali Murid',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            colorClass: 'hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700'
          },
          {
            id: 'admin-backup',
            label: 'Cadangan & Pemulihan Sistem',
            description: 'Unduh snapshot database dan audit trail',
            targetModule: 'r35',
            icon: <Database className="w-5 h-5" />,
            badge: 'Pencadangan',
            badgeColor: 'bg-stone-100 text-stone-800',
            colorClass: 'hover:border-stone-500 hover:bg-stone-50/50 text-stone-700'
          }
        ];
    }
  };

  const actions = getActionsForRole();

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-2xs font-sans space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Akses Cepat
            </h3>
            <p className="text-xs text-stone-500">
              Apa yang ingin Anda lakukan hari ini? Tindakan cepat disesuaikan dengan peran: <strong className="uppercase text-emerald-800">{role}</strong>
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
          Sesuai Peran
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            onClick={() => onNavigate(action.targetModule)}
            className={`text-left p-4 rounded-2xl border border-stone-200 bg-stone-50/50 transition duration-200 flex flex-col justify-between group cursor-pointer ${action.colorClass}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center group-hover:scale-105 transition">
                  {action.icon}
                </div>
                {action.badge && (
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${action.badgeColor || 'bg-stone-200 text-stone-800'}`}>
                    {action.badge}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-800 transition leading-snug">
                  {action.label}
                </h4>
                <p className="text-[11px] text-stone-500 leading-snug mt-0.5 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-bold text-stone-400 group-hover:text-emerald-700 transition">
              <span>Buka Modul</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
