import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, MessageSquare, Heart, Sparkles, CheckCircle, Lock, Compass, Award } from 'lucide-react';
import { buildWhatsAppUrl } from '../../services/guardian/whatsappConfig';

interface ParentTrustSectionProps {
  onTabChange?: (tab: string) => void;
}

export const ParentTrustSection: React.FC<ParentTrustSectionProps> = ({ onTabChange }) => {
  const trustPillars = [
    {
      id: 'keamanan-data',
      title: 'Keamanan Data & Privasi SIM',
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
      badge: 'Protected',
      bgGradient: 'from-emerald-50 to-teal-50/60',
      borderColor: 'border-emerald-200',
      description: 'Seluruh data ananda, dokumen keluarga, dan kwitansi SPP tersimpan aman dalam sistem SIM terenkripsi dengan standar perlindungan privasi tertinggi.',
    },
    {
      id: 'ppdb-mudah',
      title: 'Proses PPDB Mudah & Transparan',
      icon: <UserCheck className="w-6 h-6 text-amber-600" />,
      badge: 'Digital SIM',
      bgGradient: 'from-amber-50 to-orange-50/60',
      borderColor: 'border-amber-200',
      description: 'Pendaftaran murid baru dapat dilakukan 100% secara online dengan verifikasi berkas cepat, tanpa proses ruwet atau biaya tersembunyi.',
    },
    {
      id: 'komunikasi-wa',
      title: 'Komunikasi Instan via WhatsApp',
      icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
      badge: '100% Free',
      bgGradient: 'from-teal-50 to-emerald-50/60',
      borderColor: 'border-teal-200',
      description: 'Layanan konsultasi orang tua didampingi WhatsApp Guardian Assistant gratis untuk informasi jadwal, kegiatan, dan konsultasi pendaftaran.',
    },
    {
      id: 'lingkungan-islami',
      title: 'Lingkungan Islami & Ramah Anak',
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      badge: 'Karakter',
      bgGradient: 'from-rose-50 to-pink-50/60',
      borderColor: 'border-rose-200',
      description: 'Pembiasaan adab harian, hafalan doa & surah pendek, serta taman bermain asri ramah anak yang membentuk pondasi akhlak mulia.',
    },
    {
      id: 'perkembangan-anak',
      title: 'Pantau Perkembangan Berkala',
      icon: <Award className="w-6 h-6 text-sky-600" />,
      badge: 'E-Rapor',
      bgGradient: 'from-sky-50 to-indigo-50/60',
      borderColor: 'border-sky-200',
      description: 'Orang tua dapat mengakses e-Rapor dan catatan tumbuh kembang ananda secara berkala melalui Portal Orang Tua SIM TK Asy Syifa.',
    },
  ];

  return (
    <section 
      aria-label="Seksi Kepercayaan dan Komitmen Orang Tua"
      className="my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Section Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border-2 border-emerald-400/40">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Jaminan Kualitas & Kepercayaan Orang Tua</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mengapa Ratusan Orang Tua Mempercayakan Ananda di TK Asy Syifa?
          </h2>

          <p className="text-sm text-stone-200 leading-relaxed">
            Komitmen kami adalah menghadirkan pendidikan anak usia dini berbasis nilai Qurani dengan dukungan sistem digital yang transparan, aman, dan memudahkan Ayah & Bunda.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 relative z-10">
          {trustPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`bg-white text-slate-900 rounded-2xl p-5 border-2 ${pillar.borderColor} shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pillar.bgGradient} flex items-center justify-center border border-stone-200 shadow-2xs`}>
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-300 px-2.5 py-0.5 rounded-full">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standar Mutu Terjamin</span>
              </div>
            </motion.div>
          ))}

          {/* Interactive CTA Card */}
          <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 text-slate-950 rounded-2xl p-6 border-2 border-amber-600/40 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Konsultasi PPDB
              </div>

              <h3 className="text-lg font-black text-slate-950 leading-snug">
                Siap Bergabung dengan Keluarga Besar Asy Syifa?
              </h3>

              <p className="text-xs text-slate-900 font-medium leading-relaxed">
                Konsultasikan kebutuhan pendidikan Ananda sekarang melalui Portal PPDB Online atau WhatsApp Sekretariat.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => onTabChange && onTabChange('ppdb')}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Daftar PPDB Online Now</span>
                <Compass className="w-4 h-4 text-amber-400" />
              </button>

              <a
                href={buildWhatsAppUrl('Assalamu\'alaikum, saya berminat mendaftarkan anak ke TK Asy Syifa.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span>Tanya via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
