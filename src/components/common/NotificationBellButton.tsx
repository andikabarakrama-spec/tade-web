import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationBellButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'light' | 'dark' | 'floating';
}

export const NotificationBellButton: React.FC<NotificationBellButtonProps> = ({
  onClick,
  className = '',
  variant = 'light'
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notifications) => {
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    });
    return () => unsubscribe();
  }, []);

  const baseStyles = variant === 'dark'
    ? 'bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700/60 shadow-xs'
    : variant === 'floating'
    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-900/30'
    : 'bg-stone-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-stone-200 shadow-2xs';

  return (
    <button
      id="tade-notification-bell-btn"
      onClick={onClick}
      aria-label={`Notifikasi TADE (${unreadCount} belum dibaca)`}
      title="Buka Pusat Notifikasi TADE"
      className={`relative p-2.5 rounded-2xl transition transform active:scale-95 flex items-center justify-center cursor-pointer ${baseStyles} ${className}`}
    >
      <Bell className="w-4 h-4 sm:w-5 sm:h-5" />

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
