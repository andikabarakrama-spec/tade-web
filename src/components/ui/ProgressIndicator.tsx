import React from 'react';
import { motion } from 'motion/react';

interface ProgressIndicatorProps {
  isLoading: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      id="tade-top-progress-indicator"
      className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-transparent overflow-hidden pointer-events-none"
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: 'easeInOut'
        }}
        className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(52,211,153,0.8)]"
      />
    </div>
  );
};
