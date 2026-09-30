import React from 'react';
import { DoodleSun, DoodleCloud, DoodleRainbow, DoodlePencil, DoodlePaperAirplane, DoodleKite, DoodleBlocks, DoodleHandprint, DoodleCrayon } from './ChildDoodleDecorations';

interface LivingPageDecoratorProps {
  pageName: 'Beranda' | 'Profil' | 'Program' | 'Guru' | 'Galeri' | 'PPDB' | 'Kontak' | 'Footer';
}

export const LivingPageDecorator: React.FC<LivingPageDecoratorProps> = ({ pageName }) => {
  switch (pageName) {
    case 'Beranda':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-4 left-6 opacity-40 animate-spin-slow">
            <DoodleSun className="w-16 h-16 text-amber-400" />
          </div>
          <div className="absolute top-12 right-10 opacity-30 animate-float-slow">
            <DoodlePaperAirplane className="w-12 h-12" />
          </div>
          <div className="absolute bottom-16 left-12 opacity-30 animate-bounce">
            <DoodleRainbow className="w-20 h-12" />
          </div>
        </div>
      );

    case 'Profil':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-6 left-8 opacity-40 animate-sway">
            <DoodlePencil className="w-10 h-10" />
          </div>
          <div className="absolute top-10 right-12 opacity-30 animate-pulse">
            <span className="text-4xl">📚</span>
          </div>
          <div className="absolute bottom-20 left-10 opacity-30">
            <span className="text-4xl">🌍</span>
          </div>
          <div className="absolute bottom-10 right-16 opacity-30">
            <span className="text-4xl">🌳</span>
          </div>
        </div>
      );

    case 'Program':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-6 left-10 opacity-40">
            <DoodleBlocks className="w-12 h-12" />
          </div>
          <div className="absolute top-8 right-12 opacity-30 animate-bounce">
            <DoodleCrayon className="w-10 h-10" />
          </div>
          <div className="absolute bottom-16 left-8 opacity-30">
            <span className="text-4xl">🎨</span>
          </div>
          <div className="absolute bottom-12 right-14 opacity-30 animate-pulse">
            <span className="text-4xl">🧩</span>
          </div>
        </div>
      );

    case 'Guru':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-4 left-8 opacity-30">
            <span className="text-4xl">🏫</span>
          </div>
          <div className="absolute top-8 right-10 opacity-30 animate-sway">
            <span className="text-4xl">🌸</span>
          </div>
          <div className="absolute bottom-14 left-10 opacity-30 animate-float-slow">
            <span className="text-4xl">🍃</span>
          </div>
        </div>
      );

    case 'Galeri':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-6 left-6 opacity-30 animate-pulse">
            <span className="text-4xl">📷</span>
          </div>
          <div className="absolute top-10 right-8 opacity-30 animate-bounce">
            <DoodleHandprint className="w-10 h-10 text-rose-400" />
          </div>
          <div className="absolute bottom-16 left-12 opacity-30">
            <span className="text-4xl">🖼️</span>
          </div>
          <div className="absolute bottom-10 right-12 opacity-30 animate-sway">
            <span className="text-4xl">✨</span>
          </div>
        </div>
      );

    case 'PPDB':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-6 left-8 opacity-40 animate-bounce">
            <DoodleKite className="w-12 h-16" />
          </div>
          <div className="absolute top-8 right-10 opacity-30 animate-pulse">
            <span className="text-4xl">⭐</span>
          </div>
          <div className="absolute bottom-16 left-10 opacity-30">
            <span className="text-4xl">🎈</span>
          </div>
          <div className="absolute bottom-8 right-12 opacity-30 animate-sway">
            <span className="text-4xl">🎉</span>
          </div>
        </div>
      );

    case 'Kontak':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-6 left-8 opacity-30 animate-float-slow">
            <span className="text-4xl">🐦</span>
          </div>
          <div className="absolute top-10 right-10 opacity-40">
            <DoodlePaperAirplane className="w-12 h-12" />
          </div>
          <div className="absolute bottom-12 left-12 opacity-30">
            <span className="text-4xl">🚌</span>
          </div>
        </div>
      );

    case 'Footer':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-4 left-10 opacity-40 animate-pulse">
            <span className="text-4xl">🌙</span>
          </div>
          <div className="absolute top-6 right-12 opacity-30 animate-bounce">
            <span className="text-3xl">✨</span>
          </div>
          <div className="absolute bottom-8 left-16 opacity-30">
            <span className="text-3xl">🏮</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
