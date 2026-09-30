import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, Phone, MapPin, Heart, ChevronRight, LogIn, Sparkles, ShieldCheck, Lock, User, LogOut } from 'lucide-react';
import { LivingSkyEngine } from '../garden/LivingSkyEngine';
import { useLivingGarden } from '../../context/LivingGardenContext';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from './AuthModal';
import { NotificationBellButton } from './NotificationBellButton';
import { NotificationCenterModal } from './NotificationCenterModal';
import { DataService } from '../../services/db';
import { PPDBLifecycleConfig } from '../../types';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HeaderNavbar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [ppdbConfig, setPpdbConfig] = useState<PPDBLifecycleConfig | null>(null);
  const { userProfile, logout } = useAuth();
  const { timeOfDay, toggleQuietMode, settings } = useLivingGarden();

  useEffect(() => {
    let isMounted = true;
    DataService.getPPDBLifecycleConfig().then((cfg) => {
      if (isMounted) setPpdbConfig(cfg);
    }).catch(console.error);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoDoubleClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const showPPDB = ppdbConfig ? ppdbConfig.showInPublicNav !== false : true;

  const navItems = [
    { id: 'w1', label: 'Beranda' },
    { id: 'w2', label: 'Profil & Program' },
    { id: 'w3', label: 'Berita & Galeri' },
    ...(showPPDB ? [{ id: 'w4', label: 'PPDB Online' }] : []),
    { id: 'w5', label: 'Kontak & Lokasi' },
    { id: 'w_alumni', label: 'Taman Alumni' },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs relative">
      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Living Sky Atmospheric Banner */}
      <LivingSkyEngine mode="banner" />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* Brand Logo with Double Click Gesture */}
        <button
          onClick={() => onTabChange('w1')}
          onDoubleClick={handleLogoDoubleClick}
          title="Klik 2x untuk Akses Super Admin"
          className="flex items-center space-x-3 text-left focus:outline-hidden group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-emerald-950 tracking-tight leading-none group-hover:text-emerald-700 transition flex items-center gap-2">
              <span>TK ASY SYIFA</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">TANGGUL</span>
            </h1>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              Taman Belajar Islami & Qurani
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA to PPDB & SIM Portal */}
        <div className="hidden lg:flex items-center space-x-2.5">
          {/* Notification Bell with live unread badge */}
          <NotificationBellButton onClick={() => setShowNotificationCenter(true)} />

          {showPPDB && (
            <button
              onClick={() => onTabChange('w4')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-xs transition transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-stone-900 fill-stone-900" />
              Daftar PPDB Online
            </button>
          )}
          
          {userProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTabChange('r1')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                {userProfile.nama || userProfile.name}
              </button>
              <button
                onClick={logout}
                title="Keluar"
                className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login / Masuk
            </button>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="md:hidden flex items-center gap-2">
          <NotificationBellButton onClick={() => setShowNotificationCenter(true)} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-700 hover:bg-stone-200'
              }`}
            >
              {item.label}
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          ))}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            {showPPDB && (
              <button
                onClick={() => {
                  onTabChange('w4');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl bg-amber-500 text-stone-900 font-bold text-sm shadow-xs"
              >
                Daftar PPDB Online {ppdbConfig?.academicYear || '2026/2027'}
              </button>
            )}
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow-xs"
            >
              Masuk Portal SIM R1–R32
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal for Production Firebase Login / Registration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
        onTabChange={onTabChange}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onSelectTab={onTabChange}
      />
    </header>
  );
};
