import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  User,
  GraduationCap,
  Heart,
  Award,
  BookOpen,
  Eye
} from 'lucide-react';
import { founderWorkspaceMemory } from '../../services/founderWorkspaceMemory';
import { livingEventEngine } from '../../services/livingEventEngine';

interface LivingProfileEntranceProps {
  name: string;
  roleTitle: string;
  avatarUrl?: string;
  isFounder?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const LivingProfileEntrance: React.FC<LivingProfileEntranceProps> = ({
  name,
  roleTitle,
  avatarUrl = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
  isFounder = false,
  className = '',
  children
}) => {
  const memory = founderWorkspaceMemory.load();
  const isBatterySaver = memory.gpuQuality === 'BATTERY_SAVER';
  const activeEvent = livingEventEngine.getActiveEvent();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group p-4 sm:p-5 rounded-3xl bg-white border transition-all duration-500 transform ${
        isFounder
          ? 'border-amber-400/80 shadow-emerald-950/10 shadow-xl ring-2 ring-emerald-500/20'
          : 'border-stone-200 shadow-sm hover:shadow-md'
      } ${!isBatterySaver ? 'hover:-translate-y-1' : ''} ${className}`}
    >
      {/* P6: Ambient Butterfly / Leaf Decorator (GPU-Friendly) */}
      {!isBatterySaver && isHovered && (
        <div className="absolute -top-3 -right-2 text-base animate-bounce pointer-events-none z-20">
          {activeEvent.eventId === 'RAMADHAN' ? '🌙' : '🦋'}
        </div>
      )}

      {/* Profile Header Block */}
      <div className="flex items-center gap-3.5">
        {/* Avatar with living emerald border */}
        <div className="relative shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border-2 transition-all duration-300 ${
              isFounder
                ? 'border-amber-400 ring-2 ring-emerald-500/40'
                : 'border-emerald-500/60'
            } ${!isBatterySaver && isHovered ? 'scale-105 shadow-md' : ''}`}
          >
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {isFounder && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] shadow">
              <Crown className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-black text-stone-900 truncate">{name}</h4>
            {isFounder && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-900">
                FOUNDER
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 font-medium truncate">{roleTitle}</p>
          <div className="text-[10px] font-mono text-teal-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Living Profile Active</span>
          </div>
        </div>
      </div>

      {children && <div className="mt-3 pt-3 border-t border-stone-100">{children}</div>}
    </div>
  );
};
