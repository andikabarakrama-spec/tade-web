import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, UserPlus, CreditCard, Calendar, MapPin, Clock, X, ExternalLink, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { getWhatsAppConfig, buildWhatsAppUrl, WhatsAppTopic } from '../../services/guardian/whatsappConfig';

interface GuardianWelcomeCardProps {
  onClose: () => void;
}

export const GuardianWelcomeCard: React.FC<GuardianWelcomeCardProps> = ({ onClose }) => {
  const config = getWhatsAppConfig();

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserPlus': return <UserPlus className="w-5 h-5 text-emerald-600" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-rose-600" />;
      default: return <MessageSquare className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleSelectTopic = (topic: WhatsAppTopic) => {
    const url = buildWhatsAppUrl(topic.prefilledText);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden max-w-sm sm:max-w-md w-full font-sans text-slate-800 relative z-50 pointer-events-auto"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Tutup Pusat Bantuan WhatsApp"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
            💬
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              WhatsApp Guardian Assistant
            </div>
            <h3 className="text-base font-black text-white tracking-tight">
              Pusat Layanan Chat Sekretariat
            </h3>
          </div>
        </div>

        <p className="mt-2 text-xs text-emerald-100 leading-relaxed">
          {config.greetingText}
        </p>
      </div>

      {/* Operating Hours Info Badge */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center gap-2 font-medium">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Jam Resepsionis: <strong>{config.operatingHours}</strong></span>
        </div>
        <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
          <ShieldCheck className="w-3 h-3" /> Respon Cepat
        </span>
      </div>

      {/* Topics Selection Grid */}
      <div className="p-4 space-y-2.5 max-h-[340px] overflow-y-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
          Pilih Topik Konsultasi Ayah & Bunda:
        </span>

        {config.welcomeTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleSelectTopic(topic)}
            className="w-full text-left bg-stone-50 hover:bg-emerald-50/80 border border-stone-200 hover:border-emerald-300 rounded-2xl p-3 flex items-start gap-3 transition transform active:scale-[0.98] group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center shrink-0 group-hover:bg-emerald-100/60 transition">
              {getTopicIcon(topic.iconName)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black text-slate-900 group-hover:text-emerald-800 transition truncate">
                  {topic.title}
                </span>
                {topic.badge && (
                  <span className="text-[9px] font-black uppercase bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full shrink-0">
                    {topic.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mt-0.5 line-clamp-2">
                {topic.description}
              </p>
            </div>

            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-1" />
          </button>
        ))}
      </div>

      {/* Direct General Chat Footer CTA */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col gap-2">
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition transform active:scale-[0.98] text-center"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>{config.ctaLabel} ({config.formattedDisplayNumber})</span>
        </a>

        <p className="text-[10px] text-slate-500 text-center leading-snug">
          100% Bebas Biaya • Pesan otomatis disambut sistem sebelum admin merespons.
        </p>
      </div>
    </motion.div>
  );
};
