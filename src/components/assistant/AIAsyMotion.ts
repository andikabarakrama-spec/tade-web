import { Variants } from 'motion/react';
import { PerformanceMode } from './AIAsyContext';

// Walking sway variants for full/normal performance mode
export const getWalkingVariants = (walkDistancePx: number, mode: PerformanceMode): Variants => {
  if (mode === 'LIGHT') {
    return {
      idle: { x: 0, y: 0, rotate: 0 }
    };
  }

  return {
    idle: {
      x: [0, walkDistancePx / 2, 0, -walkDistancePx / 2, 0],
      rotate: [0, 1.5, 0, -1.5, 0],
      transition: {
        duration: mode === 'FULL' ? 8 : 12,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
};

// Breathing body bounce animation
export const getBreathingVariants = (mode: PerformanceMode): Variants => {
  if (mode === 'LIGHT') {
    return {
      breath: { scaleY: 1, y: 0 }
    };
  }

  return {
    breath: {
      scaleY: [1, 1.025, 1],
      y: [0, -1.5, 0],
      transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
};

// Blinking eye variants
export const getBlinkVariants = (mode: PerformanceMode): Variants => {
  if (mode === 'LIGHT') {
    return {
      open: { scaleY: 1 }
    };
  }

  return {
    blink: {
      scaleY: [1, 1, 0.1, 1, 1, 1, 1, 0.1, 1],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        times: [0, 0.45, 0.48, 0.51, 0.85, 0.92, 0.94, 0.96, 1]
      }
    }
  };
};

// Waving hand gesture
export const wavingHandVariants: Variants = {
  wave: {
    rotate: [0, 18, -6, 18, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatDelay: 4,
      ease: 'easeInOut'
    }
  }
};

// Floating speech bubble entry & spring bounce float animation
export const getBubbleVariants = (mode: PerformanceMode): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 12
    },
    visible: {
      opacity: 1,
      scale: [0.8, 1.05, 1],
      y: mode === 'LIGHT' ? 0 : [0, -4, 0],
      transition: {
        opacity: { duration: 0.25 },
        scale: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] },
        y: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.38
        }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.82,
      y: 10,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };
};
