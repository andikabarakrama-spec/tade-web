import React from 'react';
import { motion } from 'motion/react';
import { UserPlus, FileSearch, CheckCircle2, School, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl } from '../../services/guardian/whatsappConfig';

interface PPDBJourneyTimelineProps {
  onStartForm?: () => void;
}

export const PPDBJourneyTimeline: React.FC<PPDBJourneyTimelineProps> = ({ onStartForm }) => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Pengisian Formulir Online',
      timeframe: '5 - 10 Menit',
      icon: <UserPlus className="w-6 h-6 text-emerald-600" />,
      description: 'Isi data calon siswa dan orang tua di formulir online SIM. Ayah & Bunda langsung mendapatkan Nomor Registrasi unik.',
      status: 'Langkah Awal',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      stepNumber: '02',
      title: 'Verifikasi Berkas & Observasi Ramah Anak',
      timeframe: '1 - 2 Hari Kerja',
      icon: <FileSearch className="w-6 h-6 text-amber-600" />,
      description: 'Panitia PPDB memverifikasi kelengkapan berkas dan menjadwalkan perkenalan santai ramah anak bersama pendidik.',
      status: 'Proses Verifikasi',
      badgeBg: 'bg-amber-100 text-amber-900',
    },
    {
      stepNumber: '03',
      title: 'Pengumuman & Registrasi Ulang',
      timeframe: 'Konfirmasi Instan',
      icon: <CheckCircle2 className="w-6 h-6 text-teal-600" />,
      description: 'Pengumuman penerimaan dikirimkan melalui SIM & WhatsApp. Orang tua melakukan daftar ulang dan pengukuran seragam.',
      status: 'Tahap Akhir',
      badgeBg: 'bg-teal-100 text-teal-800',
    },
    {
      stepNumber: '04',
      title: 'Penyambutan Siswa Baru (MOPD)',
      timeframe: 'Awal Tahun Ajaran',
      icon: <School className="w-6 h-6 text-rose-600" />,
      description: 'Hari pertama sekolah yang menyenangkan bersama Dek Syifa, teman-teman baru, dan Ustadzah penuh kasih sayang.',
      status: 'Selamat Datang',
      badgeBg: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-amber-50/30 rounded-3xl p-6 sm:p-10 border-2 border-emerald-200/80 shadow-md my-8 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-emerald-800 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300" /> Alur Pendaftaran Transparan
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          4 Langkah Mudah Menjadi Bagian Asy Syifa
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Proses pendaftaran modern, mudah, dan transparan tanpa proses ruwet.
        </p>
      </div>

      {/* Responsive Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-800/20 group-hover:text-emerald-600/40 transition">
                  {step.stepNumber}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${step.badgeBg}`}>
                  {step.status}
                </span>
              </div>

              <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                {step.icon}
              </div>

              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {step.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Estimasi: {step.timeframe}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stronger Action Bar */}
      <div className="mt-8 pt-6 border-t border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200">
        <div className="text-center sm:text-left space-y-0.5">
          <span className="text-xs font-black text-emerald-900 block">
            Pendaftaran Gelombang 1 Sedang Dibuka!
          </span>
          <span className="text-[11px] text-slate-600">
            Dapatkan potongan biaya pendaftaran awal & jaminan kuota kelas.
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onStartForm && (
            <button
              onClick={onStartForm}
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Isi Formulir Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <a
            href={buildWhatsAppUrl('Assalamu\'alaikum, saya ingin bertanya seputar jadwal dan alur pendaftaran PPDB.')}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Tanya Admin</span>
          </a>
        </div>
      </div>
    </div>
  );
};
