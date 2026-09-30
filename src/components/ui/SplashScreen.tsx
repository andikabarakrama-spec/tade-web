import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  return (
    <motion.div
      id="tade-splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white select-none overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none translate-y-20" />

      <div className="relative flex flex-col items-center text-center px-6 max-w-sm">
        {/* Animated Brand Logo Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 p-1 shadow-2xl shadow-emerald-900/60 border border-emerald-400/40 flex items-center justify-center">
            <img
              src="/assets/mascot/asy/ASY_MASTER.png"
              alt="TADE Master"
              className="w-full h-full object-contain rounded-2xl drop-shadow"
              onError={(e) => {
                // If png fails fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5"
        >
          TADE <span className="text-emerald-400 text-lg sm:text-xl font-medium">v9.7.1</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mb-6"
        >
          TK Asy Syifa Tanggul · Ekosistem Digital Islami
        </motion.p>

        {/* Dynamic Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-48 sm:w-56 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-emerald-500/20 relative mb-4"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full"
          />
        </motion.div>

        {/* Security & Go-Live Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-mono"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GO-LIVE SECURE · ZERO DRIFT</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
