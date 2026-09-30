import React from 'react';
import { motion } from 'motion/react';
import { ActivityType } from './AIAsyActivity';
import { EventCategory } from './AIAsyLivingSchool';

interface AIAsyActivityItemsProps {
  activity: ActivityType;
  eventCategory?: EventCategory;
}

export const AIAsyActivityItems: React.FC<AIAsyActivityItemsProps> = ({ activity, eventCategory }) => {
  // If a special School Event Category is active (other than ACADEMIC_GENERAL), prioritize event prop
  if (eventCategory && eventCategory !== 'ACADEMIC_GENERAL') {
    switch (eventCategory) {
      case 'COMPETITION':
        return (
          <motion.g
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Cheering Flag */}
            <line x1="86" y1="98" x2="86" y2="68" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M86 68 L106 74 L86 82 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
            <circle cx="86" cy="67" r="2" fill="#fbbf24" />
          </motion.g>
        );

      case 'FIELD_TRIP':
        return (
          <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 1.5, repeat: Infinity }}>
            {/* Mini Camera & Strap */}
            <path d="M78 80 L88 70" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="84" y="80" width="22" height="16" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="95" cy="88" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            <rect x="88" y="77" width="6" height="3" fill="#ef4444" />
          </motion.g>
        );

      case 'LUNCH_TOGETHER':
        return (
          <motion.g animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ duration: 2, repeat: Infinity }}>
            {/* Bento Lunch Box */}
            <rect x="80" y="80" width="26" height="18" rx="4" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            <rect x="83" y="83" width="9" height="12" rx="2" fill="#ffffff" />
            <circle cx="87.5" cy="89" r="2.5" fill="#f43f5e" />
            <rect x="94" y="83" width="9" height="12" rx="2" fill="#fbbf24" />
          </motion.g>
        );

      case 'BIRTHDAY':
        return (
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
            {/* Cupcake with Candle */}
            <path d="M84 86 L86 98 L100 98 L102 86 Z" fill="#d97706" />
            <path d="M82 86 C82 78, 104 78, 104 86 Z" fill="#f472b6" />
            <rect x="92" y="72" width="2" height="8" fill="#38bdf8" />
            <circle cx="93" cy="70" r="2.5" fill="#fbbf24" />
          </motion.g>
        );

      case 'TEACHER_DAY':
        return (
          <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>
            {/* Flower Bouquet */}
            <path d="M86 96 L94 80 L102 96 Z" fill="#15803d" />
            <circle cx="88" cy="76" r="5" fill="#f43f5e" />
            <circle cx="96" cy="74" r="5" fill="#fbbf24" />
            <circle cx="92" cy="80" r="5" fill="#ec4899" />
          </motion.g>
        );

      case 'GRADUATION':
        return (
          <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            {/* Diploma Scroll */}
            <rect x="80" y="82" width="28" height="12" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="91" y="80" width="5" height="16" fill="#dc2626" />
          </motion.g>
        );

      case 'SPORTS':
        return (
          <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
            {/* Football / Soccer Ball */}
            <circle cx="94" cy="88" r="10" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="94,82 98,85 96,90 92,90 90,85" fill="#0f172a" />
          </motion.g>
        );

      case 'DRAWING':
        return (
          <motion.g animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1.5, repeat: Infinity }}>
            {/* Artist Palette & Brush */}
            <ellipse cx="94" cy="86" rx="14" ry="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="86" cy="84" r="2" fill="#ef4444" />
            <circle cx="92" cy="82" r="2" fill="#3b82f6" />
            <circle cx="98" cy="84" r="2" fill="#10b981" />
            <circle cx="92" cy="90" r="2" fill="#fbbf24" />
            <line x1="82" y1="96" x2="102" y2="76" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        );

      case 'GARDENING':
        return (
          <motion.g animate={{ y: [0, 2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            {/* Watering Can */}
            <rect x="82" y="82" width="18" height="14" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <path d="M100 85 L108 81" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="108" cy="81" r="2" fill="#38bdf8" />
          </motion.g>
        );

      case 'CLEANING':
        return (
          <motion.g animate={{ x: [-2, 2, -2] }} transition={{ duration: 1, repeat: Infinity }}>
            {/* Small Broom */}
            <line x1="84" y1="72" x2="96" y2="92" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M92 88 L104 94 L98 100 L88 94 Z" fill="#d97706" />
          </motion.g>
        );

      case 'RAMADAN':
        return (
          <motion.g animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity }}>
            {/* Ketupat Decoration */}
            <polygon points="94,74 104,84 94,94 84,84" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            <line x1="94" y1="74" x2="94" y2="94" stroke="#a7f3d0" strokeWidth="1" />
            <line x1="84" y1="84" x2="104" y2="84" stroke="#a7f3d0" strokeWidth="1" />
          </motion.g>
        );

      case 'INDEPENDENCE':
        return (
          <motion.g animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1, repeat: Infinity }}>
            {/* Red & White Flag */}
            <line x1="86" y1="98" x2="86" y2="68" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="86" y="68" width="20" height="7" fill="#ef4444" />
            <rect x="86" y="75" width="20" height="7" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          </motion.g>
        );

      default:
        break;
    }
  }

  // Fallback to Standard Activity Props
  switch (activity) {
    case 'SEARCHING':
      return (
        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: [0, 4, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="98" cy="42" r="10" stroke="#f59e0b" strokeWidth="3" fill="none" />
          <line x1="90" y1="50" x2="82" y2="58" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="98" cy="42" r="7" fill="#60a5fa" opacity="0.3" />
        </motion.g>
      );

    case 'READING':
    case 'IDLE':
      return (
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <path d="M82 82 L102 78 L102 96 L82 100 Z" fill="#0284c7" />
          <path d="M102 78 L114 82 L114 100 L102 96 Z" fill="#38bdf8" />
          <line x1="102" y1="78" x2="102" y2="96" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="86" y1="87" x2="98" y2="85" stroke="#ffffff" strokeWidth="1" />
          <line x1="86" y1="92" x2="98" y2="90" stroke="#ffffff" strokeWidth="1" />
        </motion.g>
      );

    case 'TYPING':
      return (
        <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
          <rect x="80" y="80" width="22" height="26" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <line x1="85" y1="86" x2="97" y2="86" stroke="#78350f" strokeWidth="1" />
          <line x1="85" y1="90" x2="97" y2="90" stroke="#78350f" strokeWidth="1" />
          <line x1="85" y1="94" x2="93" y2="94" stroke="#78350f" strokeWidth="1" />
          <path d="M98 72 L106 66 L108 68 L100 74 Z" fill="#ef4444" />
        </motion.g>
      );

    case 'UPLOADING':
    case 'DOWNLOADING':
      return (
        <motion.g
          animate={{ y: activity === 'UPLOADING' ? [4, -4, 4] : [-4, 4, -4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M82 78 L90 78 L94 82 L108 82 L108 98 L82 98 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <path
            d={activity === 'UPLOADING' ? "M95 94 L95 86 M91 89 L95 85 L99 89" : "M95 85 L95 93 M91 90 L95 94 L99 90"}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      );

    case 'PRINTING':
      return (
        <motion.g animate={{ y: [0, 2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          <rect x="82" y="76" width="22" height="26" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="86" y1="82" x2="98" y2="82" stroke="#64748b" strokeWidth="1.5" />
          <line x1="86" y1="87" x2="98" y2="87" stroke="#94a3b8" strokeWidth="1" />
          <line x1="86" y1="92" x2="94" y2="92" stroke="#94a3b8" strokeWidth="1" />
        </motion.g>
      );

    case 'BACKUP':
    case 'RESTORE':
      return (
        <motion.g animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 2, repeat: Infinity }}>
          <rect x="80" y="80" width="28" height="22" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          <rect x="78" y="76" width="32" height="6" rx="1.5" fill="#d97706" />
          <circle cx="94" cy="91" r="3" fill="#fef3c7" stroke="#78350f" strokeWidth="1" />
        </motion.g>
      );

    case 'APPROVAL':
      return (
        <motion.g animate={{ rotate: [0, -15, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <path d="M88 74 L98 74 L95 86 L91 86 Z" fill="#dc2626" />
          <rect x="85" y="86" width="16" height="8" rx="2" fill="#1e293b" />
          <circle cx="93" cy="70" r="4" fill="#ef4444" />
        </motion.g>
      );

    case 'QR':
      return (
        <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <rect x="82" y="76" width="24" height="24" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="85" y="79" width="6" height="6" fill="#0f172a" />
          <rect x="97" y="79" width="6" height="6" fill="#0f172a" />
          <rect x="85" y="91" width="6" height="6" fill="#0f172a" />
          <rect x="94" y="91" width="3" height="3" fill="#0f172a" />
        </motion.g>
      );

    case 'DASHBOARD':
      return (
        <motion.g animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }}>
          <rect x="80" y="74" width="28" height="22" rx="2" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M84 90 L89 84 L94 87 L102 78" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
        </motion.g>
      );

    case 'NOTIFICATION':
      return (
        <motion.g animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 0.5, repeat: Infinity }}>
          <path d="M90 76 C90 70, 102 70, 102 76 L104 88 L88 88 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="96" cy="91" r="2.5" fill="#b45309" />
        </motion.g>
      );

    case 'OFFLINE':
      return (
        <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <circle cx="94" cy="80" r="10" fill="#f43f5e" />
          <path d="M88 86 L100 74 M88 74 L100 86" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      );

    default:
      return null;
  }
};
