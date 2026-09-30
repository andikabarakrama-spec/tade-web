import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Phone, X, Sparkles } from 'lucide-react';
import { getWhatsAppConfig, buildWhatsAppUrl } from '../../services/guardian/whatsappConfig';
import { GuardianWelcomeCard } from './GuardianWelcomeCard';

export const WhatsAppGuardianButton: React.FC = () => {
  const config = getWhatsAppConfig();
  const [isWelcomeCardOpen, setIsWelcomeCardOpen] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-minimize Dek Syifa's greeting bubble after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingBubble(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleMainButtonClick = () => {
    // Open Guardian Welcome Card Modal for topic selection
    setIsWelcomeCardOpen((prev) => !prev);
    setShowGreetingBubble(false);
  };

  return (
    <>
      {/* Floating Widget Wrapper — Positioned on Bottom Left on Desktop/Mobile to avoid overlapping AI Asy on Right */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-40 pointer-events-none flex flex-col items-start gap-2 font-sans print:hidden">
        
        {/* Dek Syifa Mascot Greeting Bubble */}
        <AnimatePresence>
          {showGreetingBubble && !isWelcomeCardOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-3 shadow-2xl border border-emerald-400/50 max-w-[260px] sm:max-w-xs relative backdrop-blur-md"
            >
              <button
                onClick={() => setShowGreetingBubble(false)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 text-stone-300 hover:text-white flex items-center justify-center text-xs border border-stone-600 cursor-pointer"
                aria-label="Tutup Pesan Menyambut"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  👶
                </div>
                <div className="text-xs">
                  <div className="font-extrabold text-amber-300 flex items-center gap-1">
                    <span>Dek Syifa Guardian</span>
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  </div>
                  <p className="text-stone-100 text-[11px] leading-snug mt-0.5">
                    {config.greetingText}
                  </p>
                </div>
              </div>

              {/* Chat CTA Link inside bubble */}
              <button
                onClick={handleMainButtonClick}
                className="mt-2 w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black py-1 px-2 rounded-xl transition cursor-pointer"
              >
                Pilih Topik Chat 💬
              </button>

              {/* Arrow Indicator */}
              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-emerald-950 border-b border-l border-emerald-400/50 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {isHovered && !showGreetingBubble && !isWelcomeCardOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pointer-events-none bg-slate-900 text-emerald-300 font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap"
            >
              Butuh bantuan? Chat WhatsApp.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Emerald WhatsApp Trigger Button */}
        <div className="pointer-events-auto relative">
          {/* Gentle Pulse Glow Aura */}
          <div className="absolute -inset-1 bg-emerald-500 rounded-full blur-md opacity-75 animate-pulse pointer-events-none" />

          <button
            onClick={handleMainButtonClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white shadow-2xl hover:brightness-110 flex items-center justify-center transition transform active:scale-95 border-2 border-emerald-300/80 cursor-pointer group"
            aria-label="Butuh bantuan? Chat WhatsApp Sekretariat TK Asy Syifa"
            title="Butuh bantuan? Chat WhatsApp."
          >
            {/* Phone/WhatsApp Icon */}
            <Phone className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-white transform group-hover:scale-110 transition duration-300" />

            {/* Notification Dot */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-emerald-800"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Modal / Backdrop overlay for Welcome Card */}
      <AnimatePresence>
        {isWelcomeCardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
            <div
              className="absolute inset-0"
              onClick={() => setIsWelcomeCardOpen(false)}
            />
            <GuardianWelcomeCard onClose={() => setIsWelcomeCardOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
