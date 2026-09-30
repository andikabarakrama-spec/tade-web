/**
 * CITY VISUALS & 3D CARTOON GRAPHICS — SPRINT G23
 * 
 * High quality SVG vector art for:
 * - 7 Profession Buildings (Klinik Cilik, Pos Pemadam, Perpustakaan, Toko Roti, Kebun Berkah, Bengkel Kereta, Kantor Pos)
 * - 5 Moving Vehicles (Bus Sekolah, Mobil Pemadam, Ambulans Mini, Traktor Kebun, Kereta Pos)
 * - Profession Badges & Career Day Ornaments
 */

import React from 'react';
import { ProfessionId, VehicleId } from '../../services/kotaMiniProfesiEngine';

interface BuildingSvgProps {
  professionId: ProfessionId;
  isSelected?: boolean;
  isCareerDay?: boolean;
  className?: string;
}

export const BuildingSvg: React.FC<BuildingSvgProps> = ({
  professionId,
  isSelected = false,
  isCareerDay = false,
  className = "w-full h-full"
}) => {
  switch (professionId) {
    case 'DOKTER':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#0f766e" fillOpacity="0.15" />
          
          {/* Building Base */}
          <rect x="35" y="60" width="130" height="105" rx="16" fill="#ecfdf5" stroke="#10b981" strokeWidth="3.5" />
          
          {/* Roof */}
          <path d="M25 65 Q100 15 175 65 Z" fill="#10b981" stroke="#047857" strokeWidth="3" />
          <path d="M25 65 Q100 25 175 65" stroke="#34d399" strokeWidth="4" fill="none" strokeLinecap="round" />
          
          {/* Stethoscope / Cross Emblem */}
          <circle cx="100" cy="48" r="18" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
          <path d="M100 36 V60 M88 48 H112" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          
          {/* Windows with eyes */}
          <rect x="50" y="80" width="28" height="28" rx="8" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
          <circle cx="60" cy="92" r="3" fill="#065f46" />
          <circle cx="68" cy="92" r="3" fill="#065f46" />
          <path d="M60 98 Q64 102 68 98" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />

          <rect x="122" y="80" width="28" height="28" rx="8" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
          <circle cx="132" cy="92" r="3" fill="#065f46" />
          <circle cx="140" cy="92" r="3" fill="#065f46" />
          <path d="M132 98 Q136 102 140 98" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" />

          {/* Door */}
          <rect x="85" y="115" width="30" height="50" rx="8" fill="#34d399" stroke="#047857" strokeWidth="2" />
          <circle cx="92" cy="140" r="3" fill="#ffffff" />
          <path d="M90 125 H110" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

          {/* Career Day Bunting Banner */}
          {isCareerDay && (
            <g>
              <path d="M25 68 Q100 95 175 68" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              <polygon points="45,76 53,88 61,77" fill="#ef4444" />
              <polygon points="75,82 83,95 91,83" fill="#3b82f6" />
              <polygon points="105,84 113,97 121,85" fill="#10b981" />
              <polygon points="135,80 143,92 151,80" fill="#ec4899" />
            </g>
          )}

          {isSelected && (
            <circle cx="100" cy="10" r="8" fill="#facc15" stroke="#ca8a04" strokeWidth="2" className="animate-bounce" />
          )}
        </svg>
      );

    case 'PEMADAM':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#991b1b" fillOpacity="0.15" />
          
          {/* Building */}
          <rect x="35" y="55" width="130" height="110" rx="16" fill="#fff1f2" stroke="#ef4444" strokeWidth="3.5" />
          
          {/* Fire Station Tower & Roof */}
          <rect x="75" y="15" width="50" height="40" rx="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />
          <circle cx="100" cy="30" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          <path d="M96 30 Q100 23 104 30 Q100 37 96 30 Z" fill="#ef4444" />
          
          {/* Roof Brim */}
          <rect x="25" y="50" width="150" height="14" rx="7" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          
          {/* Big Garage Shutter Door */}
          <rect x="65" y="90" width="70" height="75" rx="10" fill="#fecdd3" stroke="#e11d48" strokeWidth="2.5" />
          <line x1="68" y1="105" x2="132" y2="105" stroke="#fb7185" strokeWidth="2" />
          <line x1="68" y1="120" x2="132" y2="120" stroke="#fb7185" strokeWidth="2" />
          <line x1="68" y1="135" x2="132" y2="135" stroke="#fb7185" strokeWidth="2" />
          <line x1="68" y1="150" x2="132" y2="150" stroke="#fb7185" strokeWidth="2" />

          {/* Lantern Light */}
          <circle cx="48" cy="80" r="8" fill="#facc15" stroke="#b45309" strokeWidth="2" />
          <circle cx="152" cy="80" r="8" fill="#facc15" stroke="#b45309" strokeWidth="2" />

          {isCareerDay && (
            <g>
              <circle cx="35" cy="40" r="10" fill="#ef4444" />
              <circle cx="165" cy="40" r="10" fill="#f59e0b" />
              <path d="M35 50 Q30 70 35 90" stroke="#cbd5e1" strokeWidth="1.5" />
              <path d="M165 50 Q170 70 165 90" stroke="#cbd5e1" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      );

    case 'GURU':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#1e3a8a" fillOpacity="0.15" />
          
          <rect x="35" y="60" width="130" height="105" rx="16" fill="#eff6ff" stroke="#3b82f6" strokeWidth="3.5" />
          
          {/* Triangular Gable Roof with Book Symbol */}
          <polygon points="100,12 25,60 175,60" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <path d="M85 45 Q100 38 115 45 M85 45 L85 52 Q100 45 115 52 L115 45 M100 40 V50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Bookshelf Windows */}
          <rect x="48" y="78" width="32" height="34" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
          <path d="M52 104 H76 M56 94 H72 M54 84 H74" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />

          <rect x="120" y="78" width="32" height="34" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
          <path d="M124 104 H148 M128 94 H144 M126 84 H146" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />

          {/* Arch Door */}
          <path d="M85 165 V125 Q100 110 115 125 V165 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2.5" />
          <circle cx="92" cy="142" r="3" fill="#ffffff" />
        </svg>
      );

    case 'KOKI':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#78350f" fillOpacity="0.15" />
          
          <rect x="35" y="65" width="130" height="100" rx="16" fill="#fffbeb" stroke="#f59e0b" strokeWidth="3.5" />
          
          {/* Striped Canopy Awning */}
          <path d="M25 65 Q100 40 175 65 L170 85 Q100 65 30 85 Z" fill="#f59e0b" />
          <path d="M45 61 L42 81 M75 54 L72 74 M105 52 L102 72 M135 56 L132 76 M160 62 L157 82" stroke="#ffffff" strokeWidth="6" />

          {/* Chef Hat on Roof */}
          <path d="M90 35 C80 35 80 20 90 20 C92 10 108 10 110 20 C120 20 120 35 110 35 Z" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
          <rect x="90" y="32" width="20" height="8" rx="2" fill="#ffffff" stroke="#d97706" strokeWidth="2" />

          {/* Bread Display Window */}
          <rect x="48" y="98" width="45" height="40" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="70" cy="120" rx="14" ry="9" fill="#d97706" />
          <path d="M63 116 Q70 112 77 116" stroke="#fef3c7" strokeWidth="2" />

          {/* Door */}
          <rect x="110" y="98" width="38" height="67" rx="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="118" cy="132" r="3" fill="#78350f" />
        </svg>
      );

    case 'PETANI':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#064e3b" fillOpacity="0.15" />
          
          {/* Barn House Base */}
          <rect x="40" y="65" width="120" height="100" rx="14" fill="#ecfdf5" stroke="#059669" strokeWidth="3.5" />
          
          {/* Barn Roof */}
          <polygon points="100,18 30,68 170,68" fill="#059669" stroke="#047857" strokeWidth="3" />
          
          {/* Sprout Logo */}
          <circle cx="100" cy="45" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
          <path d="M100 52 V40 M100 44 C95 38 90 44 94 47 C98 50 100 44 100 44 M100 42 C105 36 110 42 106 45 C102 48 100 42 100 42" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="#86efac" />

          {/* Carrot & Veggie Garden Box */}
          <rect x="48" y="125" width="40" height="35" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          <path d="M56 122 Q58 110 62 122 M70 122 Q72 110 76 122" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

          {/* Barn Door */}
          <rect x="102" y="98" width="42" height="67" rx="6" fill="#34d399" stroke="#047857" strokeWidth="2.5" />
          <line x1="105" y1="102" x2="141" y2="162" stroke="#047857" strokeWidth="2" />
          <line x1="105" y1="162" x2="141" y2="102" stroke="#047857" strokeWidth="2" />
        </svg>
      );

    case 'MASINIS':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#0c4a6e" fillOpacity="0.15" />
          
          <rect x="35" y="65" width="130" height="100" rx="16" fill="#f0f9ff" stroke="#0284c7" strokeWidth="3.5" />
          
          {/* Station Arch Canopy */}
          <path d="M25 65 Q100 20 175 65" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
          <circle cx="100" cy="42" r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          {/* Clock Hands */}
          <circle cx="100" cy="42" r="2" fill="#0284c7" />
          <line x1="100" y1="42" x2="100" y2="34" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="42" x2="106" y2="42" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />

          {/* Ticket Windows */}
          <rect x="48" y="85" width="34" height="42" rx="8" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
          <circle cx="65" cy="98" r="4" fill="#0369a1" />

          {/* Turnstile Gate */}
          <rect x="96" y="105" width="54" height="60" rx="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
          <path d="M102 135 H144" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'PETUGAS_POS':
      return (
        <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="170" rx="75" ry="10" fill="#4c1d95" fillOpacity="0.15" />
          
          <rect x="35" y="60" width="130" height="105" rx="16" fill="#faf5ff" stroke="#7c3aed" strokeWidth="3.5" />
          
          {/* Mansard Roof */}
          <polygon points="100,18 25,60 175,60" fill="#7c3aed" stroke="#6d28d9" strokeWidth="3" />
          
          {/* Envelope Icon */}
          <rect x="85" y="32" width="30" height="20" rx="3" fill="#ffffff" stroke="#5b21b6" strokeWidth="1.5" />
          <path d="M85 32 L100 44 L115 32" stroke="#5b21b6" strokeWidth="1.5" fill="none" />

          {/* Letter Drop Slot Box (Red Postbox outside) */}
          <rect x="48" y="105" width="26" height="50" rx="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          <rect x="52" y="115" width="18" height="4" rx="2" fill="#ffffff" />
          <circle cx="61" cy="135" r="3" fill="#facc15" />

          {/* Glass Door */}
          <rect x="90" y="85" width="60" height="80" rx="10" fill="#e9d5ff" stroke="#6d28d9" strokeWidth="2" />
          <line x1="120" y1="85" x2="120" y2="165" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="112" cy="125" r="3" fill="#5b21b6" />
          <circle cx="128" cy="125" r="3" fill="#5b21b6" />
        </svg>
      );
  }
};

interface VehicleSvgProps {
  vehicleId: VehicleId;
  className?: string;
  isMoving?: boolean;
}

export const VehicleSvg: React.FC<VehicleSvgProps> = ({
  vehicleId,
  className = "w-full h-full",
  isMoving = true
}) => {
  switch (vehicleId) {
    case 'BUS_SEKOLAH':
      return (
        <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wheels */}
          <g className={isMoving ? "animate-spin origin-[35px_80px]" : ""}>
            <circle cx="35" cy="80" r="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
            <circle cx="35" cy="80" r="6" fill="#e2e8f0" />
          </g>
          <g className={isMoving ? "animate-spin origin-[125px_80px]" : ""}>
            <circle cx="125" cy="80" r="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
            <circle cx="125" cy="80" r="6" fill="#e2e8f0" />
          </g>

          {/* Bus Body */}
          <rect x="15" y="25" width="130" height="55" rx="16" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          <rect x="15" y="55" width="130" height="8" fill="#eab308" />

          {/* Front Windshield with Eyes */}
          <path d="M110 32 H135 Q142 32 142 42 V54 H110 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <circle cx="128" cy="42" r="3.5" fill="#0369a1" />
          <circle cx="136" cy="42" r="3.5" fill="#0369a1" />

          {/* Windows with smiling kids silhouette */}
          <rect x="30" y="32" width="22" height="20" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="41" cy="42" r="4" fill="#38bdf8" />

          <rect x="58" y="32" width="22" height="20" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="69" cy="42" r="4" fill="#fb7185" />

          <rect x="84" y="32" width="22" height="20" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="95" cy="42" r="4" fill="#4ade80" />

          {/* Smile Grille */}
          <path d="M138 65 Q144 70 138 75" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="140" cy="62" r="4" fill="#ffffff" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );

    case 'MOBIL_PEMADAM':
      return (
        <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ladder on top */}
          <rect x="30" y="16" width="75" height="8" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          <line x1="45" y1="16" x2="45" y2="24" stroke="#64748b" strokeWidth="1.5" />
          <line x1="60" y1="16" x2="60" y2="24" stroke="#64748b" strokeWidth="1.5" />
          <line x1="75" y1="16" x2="75" y2="24" stroke="#64748b" strokeWidth="1.5" />
          <line x1="90" y1="16" x2="90" y2="24" stroke="#64748b" strokeWidth="1.5" />

          {/* Soft Siren Light */}
          <circle cx="118" cy="18" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" className="animate-pulse" />

          {/* Wheels */}
          <circle cx="38" cy="80" r="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="38" cy="80" r="6" fill="#e2e8f0" />
          <circle cx="122" cy="80" r="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="122" cy="80" r="6" fill="#e2e8f0" />

          {/* Body */}
          <path d="M15 40 Q15 26 28 26 H105 V32 H135 Q145 32 145 45 V78 H15 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
          <rect x="15" y="58" width="130" height="6" fill="#ffffff" />

          {/* Windows */}
          <rect x="110" y="36" width="28" height="20" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <circle cx="120" cy="46" r="3.5" fill="#0369a1" />
          <circle cx="128" cy="46" r="3.5" fill="#0369a1" />

          {/* Hose Reel */}
          <circle cx="45" cy="50" r="10" fill="#facc15" stroke="#b45309" strokeWidth="2" />
          <circle cx="45" cy="50" r="4" fill="#ef4444" />
        </svg>
      );

    case 'AMBULANS_MINI':
      return (
        <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Siren */}
          <circle cx="115" cy="18" r="5" fill="#4ade80" stroke="#16a34a" strokeWidth="2" className="animate-pulse" />

          {/* Wheels */}
          <circle cx="38" cy="80" r="13" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="38" cy="80" r="5" fill="#e2e8f0" />
          <circle cx="122" cy="80" r="13" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="122" cy="80" r="5" fill="#e2e8f0" />

          {/* Body */}
          <path d="M15 42 Q15 28 28 28 H105 V32 H135 Q145 32 145 45 V78 H15 Z" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
          <rect x="15" y="56" width="130" height="8" fill="#10b981" />

          {/* Green Crescent & Star / Care Symbol */}
          <circle cx="65" cy="52" r="9" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
          <path d="M65 46 V58 M59 52 H71" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {/* Window */}
          <rect x="110" y="36" width="28" height="18" rx="5" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5" />
          <circle cx="120" cy="45" r="3.5" fill="#047857" />
          <circle cx="128" cy="45" r="3.5" fill="#047857" />
        </svg>
      );

    case 'TRAKTOR_KEBUN':
      return (
        <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Big Rear Wheel */}
          <circle cx="42" cy="72" r="20" fill="#334155" stroke="#0f172a" strokeWidth="3.5" />
          <circle cx="42" cy="72" r="9" fill="#facc15" />

          {/* Small Front Wheel */}
          <circle cx="125" cy="78" r="12" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="125" cy="78" r="5" fill="#facc15" />

          {/* Traktor Hood & Cabin */}
          <rect x="30" y="30" width="30" height="35" rx="6" fill="#16a34a" stroke="#14532d" strokeWidth="2.5" />
          <path d="M60 48 H135 Q142 48 142 58 V76 H60 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />

          {/* Exhaust Chimney with Puffs */}
          <rect x="110" y="28" width="6" height="20" rx="2" fill="#64748b" />
          <circle cx="113" cy="20" r="4" fill="#e2e8f0" opacity="0.8" />
          <circle cx="116" cy="12" r="6" fill="#e2e8f0" opacity="0.6" />

          {/* Steering Wheel */}
          <path d="M52 40 L62 48" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

          {/* Cute Eyes on Front Grille */}
          <circle cx="132" cy="58" r="3.5" fill="#052e16" />
          <circle cx="138" cy="58" r="3.5" fill="#052e16" />
        </svg>
      );

    case 'KERETA_POS':
      return (
        <svg viewBox="0 0 160 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 3 Small Wheels with Rainbow Spoke Hubs */}
          <circle cx="35" cy="80" r="12" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="35" cy="80" r="5" fill="#ec4899" />
          <circle cx="75" cy="80" r="12" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="75" cy="80" r="5" fill="#facc15" />
          <circle cx="118" cy="80" r="12" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="118" cy="80" r="5" fill="#38bdf8" />

          {/* Engine Body */}
          <rect x="18" y="36" width="45" height="38" rx="8" fill="#0284c7" stroke="#0369a1" strokeWidth="2.5" />
          <path d="M63 45 H125 Q135 45 135 55 V74 H63 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />

          {/* Smokestack & Steam */}
          <rect x="108" y="28" width="12" height="17" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <circle cx="114" cy="20" r="4" fill="#bae6fd" opacity="0.9" />
          <circle cx="120" cy="12" r="6" fill="#bae6fd" opacity="0.6" />

          {/* Cab Window with Driver Cap Icon */}
          <rect x="25" y="42" width="22" height="18" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="36" cy="51" r="3.5" fill="#0369a1" />

          {/* Cowcatcher Front Grill */}
          <polygon points="135,74 150,74 135,60" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        </svg>
      );
  }
};
