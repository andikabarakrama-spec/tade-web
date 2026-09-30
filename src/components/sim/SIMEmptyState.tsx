import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, PlusCircle, UserPlus, DollarSign, Bell, Inbox } from 'lucide-react';

interface SIMEmptyStateProps {
  type?: 'students' | 'payments' | 'announcements' | 'presensi' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const SIMEmptyState: React.FC<SIMEmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'students':
        return {
          icon: <UserPlus className="w-10 h-10 text-emerald-600" />,
          title: title || 'Belum Ada Data Siswa Terdaftar',
          description: description || 'Data murid TK Asy Syifa belum dimasukkan atau belum terdaftar di SIM. Tambahkan murid baru melalui Pendaftaran PPDB atau Form Siswa Master.',
          actionLabel: actionLabel || 'Tambah Murid Baru',
          badge: 'TADE Student Master',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'payments':
        return {
          icon: <DollarSign className="w-10 h-10 text-amber-600" />,
          title: title || 'Belum Ada Transaksi Pembayaran SPP',
          description: description || 'Belum ada riwayat pembayaran SPP atau kwitansi digital tercatat untuk periode ini. Kwitansi yang terverifikasi akan langsung muncul di sini.',
          actionLabel: actionLabel || 'Buat Tagihan / Verifikasi SPP',
          badge: 'TADE Payment Core',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
        };
      case 'announcements':
        return {
          icon: <Bell className="w-10 h-10 text-teal-600" />,
          title: title || 'Belum Ada Pengumuman Internal',
          description: description || 'Pusat pengumuman internal masih kosong. Pengumuman seputar kegiatan sekolah, libur, atau imbauan wali murid dapat dibuat di sini.',
          actionLabel: actionLabel || 'Buat Pengumuman Baru',
          badge: 'TADE Communication Hub',
          badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
        };
      case 'presensi':
        return {
          icon: <Inbox className="w-10 h-10 text-sky-600" />,
          title: title || 'Belum Ada Catatan Presensi Hari Ini',
          description: description || 'Belum ada data kehadiran siswa atau guru yang diinput untuk hari ini. Lakukan input presensi melalui Portal Guru atau Presensi Siswa.',
          actionLabel: actionLabel || 'Input Presensi Sekarang',
          badge: 'TADE Attendance Engine',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
        };
      default:
        return {
          icon: <Sparkles className="w-10 h-10 text-emerald-600" />,
          title: title || 'Belum Ada Data Ditemukan',
          description: description || 'Tidak ada catatan yang memenuhi kriteria pencarian atau filter saat ini. Coba sesuaikan kata kunci pencarian Anda.',
          actionLabel: actionLabel || 'Refresh Data',
          badge: 'TADE Smart System',
          badgeBg: 'bg-stone-100 text-stone-800 border-stone-200',
        };
    }
  };

  const content = getDefaultContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-stone-50/80 rounded-3xl p-8 border-2 border-dashed border-stone-300 text-center space-y-4 my-4 max-w-2xl mx-auto shadow-2xs font-sans"
    >
      <div className="w-20 h-20 rounded-3xl bg-white border border-stone-200 shadow-sm flex items-center justify-center mx-auto relative group">
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping"></div>
        {content.icon}
      </div>

      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs mx-auto ${content.badgeBg}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{content.badge}</span>
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          {content.title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {content.description}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {onAction && (
          <button
            onClick={onAction}
            className="w-full sm:w-auto py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{content.actionLabel}</span>
          </button>
        )}

        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="w-full sm:w-auto py-2.5 px-4 bg-white hover:bg-stone-100 text-slate-800 font-bold text-xs rounded-xl border border-stone-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
            <span>{secondaryActionLabel || 'Reset Filter'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
