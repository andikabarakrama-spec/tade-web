import React from 'react';

export const CloudSectionDivider: React.FC = () => (
  <div className="relative w-full overflow-hidden leading-none z-10 -my-1 pointer-events-none">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 sm:h-16 text-white fill-current">
      <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,30 L1200,120 L0,120 Z"></path>
    </svg>
  </div>
);

export const GrassSectionDivider: React.FC = () => (
  <div className="relative w-full overflow-hidden leading-none z-10 -my-1 pointer-events-none">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 sm:h-16 text-emerald-800 fill-current">
      <path d="M0,60 Q30,10 60,60 Q90,0 120,60 Q150,10 180,60 Q210,0 240,60 Q270,10 300,60 Q330,0 360,60 Q390,10 420,60 Q450,0 480,60 Q510,10 540,60 Q570,0 600,60 Q630,10 660,60 Q690,0 720,60 Q750,10 780,60 Q810,0 840,60 Q870,10 900,60 Q930,0 960,60 Q990,10 1020,60 Q1050,0 1080,60 Q1110,10 1140,60 Q1170,0 1200,60 L1200,120 L0,120 Z"></path>
    </svg>
  </div>
);

export const PaperCutSectionDivider: React.FC = () => (
  <div className="relative w-full overflow-hidden leading-none z-10 -my-1 pointer-events-none">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 sm:h-14 text-amber-100 fill-current">
      <path d="M0,0 Q100,50 200,20 Q300,80 400,30 Q500,70 600,20 Q700,90 800,40 Q900,80 1000,10 Q1100,60 1200,0 L1200,120 L0,120 Z"></path>
    </svg>
  </div>
);

export const RainbowSectionDivider: React.FC = () => (
  <div className="w-full h-3 bg-gradient-to-r from-red-400 via-amber-400 via-emerald-400 via-sky-400 to-purple-400 shadow-xs my-4 rounded-full opacity-80" />
);
