import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MessageSquare, Share2, Copy, Check, ExternalLink, 
  Sparkles, Smartphone, Globe, ShieldCheck 
} from 'lucide-react';
import { buildTADEDeepLink, buildWhatsAppShareAnnouncementUrl } from '../../services/guardian/whatsappConfig';
import { adoptionAnalyticsService } from '../../services/adoptionAnalyticsService';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  body: string;
  targetTab?: string;
}

export const WhatsAppBroadcastModal: React.FC<WhatsAppBroadcastModalProps> = ({
  isOpen,
  onClose,
  title,
  category = 'Pengumuman Sekolah',
  body,
  targetTab = 'w3'
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const deepLink = buildTADEDeepLink(targetTab);

  const formattedMessage = [
    `📢 *PENGUMUMAN RESMI TK ASY SYIFA TANGGUL*`,
    `🏷️ *Kategori:* ${category}`,
    `📌 *${title}*`,
    `\n${body}`,
    `\n📲 *Buka Langsung di Aplikasi TADE:*`,
    `${deepLink}`,
    `\n🌐 *Akses Web:* https://ais-pre-qlgbvolgn7gg7bswgsywce-237499056783.asia-southeast1.run.app/?tab=${targetTab}`,
    `\n_Wassalamu'alaikum Warahmatullahi Wabarakatuh._`,
    `_Manajemen TK Islam Asy Syifa Tanggul_ ✨`
  ].join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      adoptionAnalyticsService.trackWhatsAppShare('copy_broadcast_text');
    } catch {
      // Fallback
    }
  };

  const handleSendToWhatsApp = () => {
    adoptionAnalyticsService.trackWhatsAppShare('direct_whatsapp_broadcast');
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-emerald-500/30 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Broadcast ke WhatsApp Wali Murid</h3>
                  <p className="text-xs text-emerald-100">Pratinjau format pesan ramah orang tua</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Preview Container */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-4 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span>Pratinjau Tampilan Pesan WhatsApp</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Deep Link Universal Aktif</span>
                </div>
                <pre className="text-xs text-stone-800 dark:text-stone-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {formattedMessage}
                </pre>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Buka otomatis di PWA HP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center gap-2 text-teal-800 dark:text-teal-200">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>Fallback web jika belum pasang</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendToWhatsApp}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Kirim ke WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
