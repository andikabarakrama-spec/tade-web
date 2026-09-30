import React from 'react';
import { EventType } from './AIAsyEvents';

interface AIAsyCostumesProps {
  eventType: EventType;
}

export const AIAsyCostumes: React.FC<AIAsyCostumesProps> = ({ eventType }) => {
  switch (eventType) {
    case 'INDEPENDENCE_DAY':
      return (
        <g id="costume-independence-day">
          {/* Merah-Putih Headband */}
          <rect x="36" y="24" width="48" height="6" rx="2" fill="#dc2626" />
          <rect x="36" y="27" width="48" height="3" rx="1" fill="#ffffff" />
          {/* Ribbon Tie on Side */}
          <path d="M84 24 L90 20 L86 28 L92 30 Z" fill="#dc2626" />

          {/* Indonesian Hand Flag */}
          <g transform="translate(98, 22)">
            <line x1="0" y1="0" x2="0" y2="30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <rect x="0" y="0" width="16" height="6" fill="#dc2626" />
            <rect x="0" y="6" width="16" height="6" fill="#ffffff" />
          </g>
        </g>
      );

    case 'GRADUATION':
      return (
        <g id="costume-graduation">
          {/* Toga Mortarboard Cap */}
          <path d="M60 8 L100 20 L60 32 L20 20 Z" fill="#0f172a" />
          <rect x="42" y="22" width="36" height="10" rx="3" fill="#1e293b" />
          {/* Tassel Button */}
          <circle cx="60" cy="20" r="2.5" fill="#fbbf24" />
          {/* Yellow Tassel */}
          <path d="M60 20 C68 22, 78 28, 78 36" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
          <circle cx="78" cy="37" r="2" fill="#fbbf24" />

          {/* Graduation Scroll in Hand */}
          <g transform="translate(90, 48) rotate(-15)">
            <rect x="0" y="0" width="18" height="8" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="7" y="0" width="4" height="8" fill="#ef4444" />
          </g>
        </g>
      );

    case 'SCHOOL_TRIP':
      return (
        <g id="costume-school-trip">
          {/* Explorer / Safari Hat */}
          <path d="M30 26 C30 14, 90 14, 90 26 Z" fill="#b45309" />
          <ellipse cx="60" cy="26" rx="38" ry="6" fill="#d97706" />
          <rect x="36" y="22" width="48" height="4" fill="#78350f" />

          {/* Backpack Straps */}
          <path d="M42 68 C38 80, 36 98, 44 110" stroke="#78350f" strokeWidth="3.5" fill="none" />
          <path d="M78 68 C82 80, 84 98, 76 110" stroke="#78350f" strokeWidth="3.5" fill="none" />

          {/* Water Bottle hanging */}
          <g transform="translate(68, 80)">
            <rect x="0" y="0" width="10" height="18" rx="3" fill="#0284c7" />
            <rect x="2" y="-4" width="6" height="4" rx="1" fill="#38bdf8" />
            <path d="M-6 -10 Q5 -4 16 -10" stroke="#ef4444" strokeWidth="1.5" fill="none" />
          </g>
        </g>
      );

    case 'SCHOOL_BIRTHDAY':
    case 'STUDENT_BIRTHDAY':
    case 'FOUNDATION_ANNIVERSARY':
      return (
        <g id="costume-birthday">
          {/* Party Cone Hat */}
          <path d="M60 4 L82 32 L38 32 Z" fill="#f43f5e" />
          {/* Polka Dots */}
          <circle cx="58" cy="18" r="2" fill="#fbbf24" />
          <circle cx="68" cy="26" r="2.5" fill="#38bdf8" />
          <circle cx="48" cy="28" r="2" fill="#34d399" />
          {/* Pom-pom top */}
          <circle cx="60" cy="4" r="4" fill="#fbbf24" />

          {/* Party Horn in Hand */}
          <g transform="translate(94, 38) rotate(-20)">
            <polygon points="0,0 20,-6 20,10" fill="#3b82f6" />
            <rect x="-4" y="0" width="4" height="4" fill="#f59e0b" />
          </g>
        </g>
      );

    case 'TEACHERS_DAY':
    case 'TEACHER_BIRTHDAY':
      return (
        <g id="costume-teachers-day">
          {/* Flower Bouquet in Hand */}
          <g transform="translate(86, 38)">
            {/* Wrapper */}
            <polygon points="0,15 -10,-10 10,-10" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
            {/* Flowers */}
            <circle cx="-5" cy="-14" r="5" fill="#f43f5e" />
            <circle cx="5" cy="-14" r="5" fill="#ec4899" />
            <circle cx="0" cy="-20" r="6" fill="#fbbf24" />
            <circle cx="0" cy="-20" r="2" fill="#ffffff" />
            {/* Bow */}
            <path d="M-4 12 Q0 8 4 12 Q0 16 -4 12 Z" fill="#ec4899" />
          </g>
        </g>
      );

    case 'RAMADAN':
    case 'EID_FITR':
      return (
        <g id="costume-ramadan">
          {/* Crescent Moon Emblem on Peci */}
          <path d="M62 16 A 6 6 0 1 0 62 26 A 4.5 4.5 0 1 1 62 16 Z" fill="#fbbf24" />

          {/* Ketupat Ornament Hanging */}
          <g transform="translate(24, 76) rotate(45)">
            <rect x="0" y="0" width="10" height="10" fill="#10b981" stroke="#fef08a" strokeWidth="1" />
            <line x1="0" y1="5" x2="10" y2="5" stroke="#fef08a" strokeWidth="0.8" />
            <line x1="5" y1="0" x2="5" y2="10" stroke="#fef08a" strokeWidth="0.8" />
          </g>
        </g>
      );

    case 'MANASIK':
      return (
        <g id="costume-manasik">
          {/* White Ihram Sash */}
          <path d="M36 68 L78 108 L86 102 L44 64 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        </g>
      );

    case 'COLORING_COMPETITION':
    case 'ART_PERFORMANCE':
      return (
        <g id="costume-art">
          {/* Painter Beret */}
          <ellipse cx="58" cy="22" rx="22" ry="8" fill="#8b5cf6" />
          <circle cx="58" cy="14" r="2" fill="#a78bfa" />

          {/* Paintbrush in hand */}
          <g transform="translate(94, 32) rotate(30)">
            <rect x="0" y="0" width="3" height="22" fill="#b45309" />
            <rect x="0" y="-4" width="3" height="4" fill="#94a3b8" />
            <polygon points="0,-4 3,-4 1.5,-10" fill="#ec4899" />
          </g>
        </g>
      );

    case 'PPDB_PERIOD':
    case 'NEW_ACADEMIC_YEAR':
      return (
        <g id="costume-ppdb">
          {/* Cute Smart Glasses */}
          <g transform="translate(42, 35)">
            <circle cx="7" cy="5" r="6" stroke="#0284c7" strokeWidth="2" fill="none" />
            <circle cx="29" cy="5" r="6" stroke="#0284c7" strokeWidth="2" fill="none" />
            <line x1="13" y1="5" x2="23" y2="5" stroke="#0284c7" strokeWidth="2" />
          </g>
        </g>
      );

    default:
      return null;
  }
};
