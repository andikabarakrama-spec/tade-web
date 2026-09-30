import React, { useState } from 'react';
import {
  Crown,
  X,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FounderOfficeDashboard } from './FounderOfficeDashboard';

interface Props {
  onNavigateTab: (tab: string) => void;
  activeTab: string;
}

export const FounderOfficeOverlay: React.FC<Props> = ({ onNavigateTab, activeTab }) => {
  const { userProfile, activeRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Check if current user is Founder
  const isFounderUser = 
    userProfile?.email === 'andikabarakrama@gmail.com' ||
    userProfile?.role === 'SUPER_ADMIN' ||
    activeRole === 'SUPER_ADMIN';

  if (!isFounderUser) return null;

  return (
    <>
      {/* Floating Founder Quick Badge (Visible when closed) */}
      {!isOpen && activeTab !== 'r_founder_office' && activeTab !== 'r139' && (
        <div className="fixed bottom-24 right-4 z-40 animate-fade-in">
          <button
            onClick={() => setIsOpen(true)}
            title="Buka Founder Office Overlay"
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-950 text-amber-300 border border-amber-500/40 shadow-xl flex items-center gap-2 hover:scale-105 transition transform cursor-pointer text-xs font-black backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <span>Founder Office</span>
          </button>
        </div>
      )}

      {/* Full-Screen / Modal Overlay View */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex flex-col overflow-y-auto">
          {/* Top Sticky Bar */}
          <div className="sticky top-0 z-50 bg-stone-950 border-b border-stone-800 px-6 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-tight">
                  TADE Founder Office Sovereign Overlay
                </h3>
                <span className="text-[10px] text-stone-400">
                  Login Akun Founder (Andika) • Non-Destructive Active Layer
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateTab('r_founder_office');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <span>Buka di SIM View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
                title="Tutup Overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Dashboard Content */}
          <div className="flex-1 bg-stone-100 p-4 sm:p-6">
            <FounderOfficeDashboard onSelectModule={(tab) => {
              setIsOpen(false);
              onNavigateTab(tab);
            }} />
          </div>
        </div>
      )}
    </>
  );
};
