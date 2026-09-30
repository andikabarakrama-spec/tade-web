import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Compass,
  GraduationCap,
  MapPin,
  Layers,
  Heart,
  DoorOpen,
  BookOpen,
  Camera,
  Trophy,
  Newspaper,
  Maximize2,
  UserCheck
} from 'lucide-react';
import {
  NavigationTransitionRegistry,
  RouteTransitionType,
  TransitionMeta
} from './NavigationTransitionRegistry';

interface JourneyTransitionProps {
  currentTab: string;
  previousTab?: string;
  isNavigating: boolean;
  onTransitionComplete?: () => void;
}

export const JourneyTransition: React.FC<JourneyTransitionProps> = ({
  currentTab,
  previousTab,
  isNavigating,
  onTransitionComplete
}) => {
  const [activeType, setActiveType] = useState<RouteTransitionType>('DEFAULT');
  const [meta, setMeta] = useState<TransitionMeta>(
    NavigationTransitionRegistry.getTransitionMeta('DEFAULT')
  );
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (!isNavigating) {
      setVisible(false);
      return;
    }

    const resolvedType = NavigationTransitionRegistry.resolveTransition(previousTab, currentTab);
    const resolvedMeta = NavigationTransitionRegistry.getTransitionMeta(resolvedType);

    setActiveType(resolvedType);
    setMeta(resolvedMeta);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onTransitionComplete) onTransitionComplete();
    }, prefersReducedMotion ? 300 : resolvedMeta.durationMs);

    return () => clearTimeout(timer);
  }, [currentTab, previousTab, isNavigating, onTransitionComplete, prefersReducedMotion]);

  if (!visible) return null;

  // Render Icon according to meta
  const renderMetaIcon = () => {
    switch (meta.iconName) {
      case 'BookOpen': return <BookOpen className="w-10 h-10 text-amber-300 animate-bounce" />;
      case 'DoorOpen': return <DoorOpen className="w-10 h-10 text-amber-300 animate-pulse" />;
      case 'MapPin': return <MapPin className="w-10 h-10 text-amber-300 animate-ping" />;
      case 'Camera': return <Camera className="w-10 h-10 text-amber-300 animate-bounce" />;
      case 'Trophy': return <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />;
      case 'Newspaper': return <Newspaper className="w-10 h-10 text-amber-300 animate-pulse" />;
      case 'Layers': return <Layers className="w-10 h-10 text-amber-300 animate-spin" />;
      case 'UserCheck': return <UserCheck className="w-10 h-10 text-amber-300 animate-pulse" />;
      case 'Maximize2': return <Maximize2 className="w-10 h-10 text-amber-300 animate-bounce" />;
      case 'Compass':
      default: return <Compass className="w-10 h-10 text-amber-300 animate-spin" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Route Transition Overlay Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
          prefersReducedMotion ? 'animate-none opacity-90' : 'animate-in fade-in duration-300'
        }`}
      />

      {/* Transition Scene Box */}
      <div
        className={`relative z-10 text-center text-white space-y-3 px-6 py-8 rounded-3xl bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-slate-950/90 border-2 border-amber-400/80 shadow-2xl max-w-md w-full mx-4 ${
          prefersReducedMotion
            ? 'opacity-100 scale-100'
            : activeType === 'GATE_OPENING'
            ? 'animate-in zoom-in-95 duration-500'
            : activeType === 'JOURNEY_ZOOM'
            ? 'animate-in zoom-in-90 duration-500'
            : activeType === 'BOOK_REVEAL'
            ? 'animate-in slide-in-from-bottom-8 duration-500'
            : activeType === 'PHOTO_TUNNEL'
            ? 'animate-in zoom-in-110 duration-500'
            : 'animate-in zoom-in-95 duration-400'
        }`}
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-800/90 p-4 border-2 border-emerald-400 flex items-center justify-center shadow-2xl">
          {renderMetaIcon()}
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-400/50 inline-block">
            {activeType.replace('_', ' ')}
          </span>
          <h3 className="text-xl font-black text-white">{meta.title}</h3>
          <p className="text-xs text-amber-200/90 font-medium">{meta.subtitle}</p>
        </div>
      </div>
    </div>
  );
};
