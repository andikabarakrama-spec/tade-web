import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Megaphone,
  UserPlus,
  CalendarCheck,
  CreditCard,
  PiggyBank,
  MessageCircle,
  Calendar,
  BookOpen,
  CheckCircle2,
  Info
} from 'lucide-react';
import { notificationService, NOTIFICATION_CATEGORIES } from '../../services/notificationService';
import { TADENotification, NotificationCategory } from '../../types/notification';
import { triggerTestPushNotification, requestFCMToken } from '../../firebase/messaging';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [notifications, setNotifications] = useState<TADENotification[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [testingCategory, setTestingCategory] = useState<NotificationCategory>('pengumuman');
  const [testSent, setTestSent] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = activeCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === activeCategory);

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'pengumuman': return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'ppdb': return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'absensi': return <CalendarCheck className="w-4 h-4 text-blue-600" />;
      case 'infaq_spp': return <CreditCard className="w-4 h-4 text-rose-600" />;
      case 'tabungan': return <PiggyBank className="w-4 h-4 text-teal-600" />;
      case 'pesan_guru': return <MessageCircle className="w-4 h-4 text-purple-600" />;
      case 'agenda': return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'tahfidz': return <BookOpen className="w-4 h-4 text-emerald-700" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (item: TADENotification) => {
    notificationService.markAsRead(item.id);
    if (item.actionTab) {
      onSelectTab(item.actionTab);
      onClose();
    }
  };

  const handleSendTestPush = async () => {
    const meta = NOTIFICATION_CATEGORIES[testingCategory];
    const testTitles: Record<NotificationCategory, { title: string; body: string }> = {
      pengumuman: {
        title: 'Pengumuman: Jadwal Ekstrakurikuler',
        body: 'Ekstrakurikuler Tahfidz dan Robotic semester genap dimulai hari Senin mendatang.'
      },
      ppdb: {
        title: 'PPDB Online: Dokumen Terverifikasi',
        body: 'Berkas formulir PPDB ananda telah diverifikasi oleh tim panitia penerimaan siswa baru.'
      },
      absensi: {
        title: 'Presensi: Ananda Tiba di Sekolah',
        body: 'Ananda telah hadir di kelas dengan senyum ceria pada pukul 07:10 WIB.'
      },
      infaq_spp: {
        title: 'Infaq/SPP: Verifikasi Pembayaran',
        body: 'Alhamdulillah kwitansi pembayaran SPP bulan ini telah divalidasi oleh bendahara.'
      },
      tabungan: {
        title: 'Tabungan: Setoran Berhasil',
        body: 'Setoran tabungan ananda sebesar Rp 25.000 telah masuk ke buku tabungan digital.'
      },
      pesan_guru: {
        title: 'Pesan Guru: Ustadzah Fatimah',
        body: 'Mohon ananda membawa krayon warna untuk kegiatan kreasi seni kolase besok pagi.'
      },
      agenda: {
        title: 'Agenda Besok: Upacara & Senam Ceria',
        body: 'Besok pagi ada agenda senam ceria nusantara, mohon gunakan seragam olahraga.'
      },
      tahfidz: {
        title: 'Tahfidz: Hafalan An-Naas & Al-Falaq',
        body: 'Alhamdulillah hafalan surat pendek ananda bertambah lancar dengan makhraj yang baik.'
      }
    };

    const target = testTitles[testingCategory] || { title: 'Uji Push TADE', body: 'Ini adalah uji notifikasi FCM.' };
    await triggerTestPushNotification(testingCategory, target.title, target.body, meta.targetTab);
    
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleRequestPermission = async () => {
    const res = await requestFCMToken();
    if (res.success) {
      setPermissionStatus('granted');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="tade-notification-center-modal"
        className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight">Notification Center</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-black bg-rose-500 text-white rounded-full">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-200/80 font-medium">
                  Pusat Siaran & Informasi Resmi TK Asy Syifa Tanggul
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Tutup Notification Center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Permission Banner if not granted */}
          {permissionStatus !== 'granted' && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notifikasi push browser belum diaktifkan di perangkat ini.</span>
              </div>
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
              >
                Aktifkan Push
              </button>
            </div>
          )}

          {/* Category Filter Chips */}
          <div className="px-4 sm:px-6 py-3 border-b border-stone-200 bg-stone-50 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Semua ({notifications.length})
            </button>
            {Object.values(NOTIFICATION_CATEGORIES).map((cat) => {
              const count = notifications.filter(n => n.category === cat.id).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                      : 'bg-white text-slate-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {cat.label}
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-emerald-900 text-emerald-100' : 'bg-stone-200 text-slate-700'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Toolbar */}
          <div className="px-4 sm:px-6 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan {filteredNotifications.length} notifikasi</span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={() => notificationService.markAllAsRead()}
                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tandai Semua Dibaca</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => notificationService.clearAll()}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* Notifications List Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Tidak Ada Notifikasi</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Semua informasi penting sekolah telah dibaca atau belum ada siaran baru untuk kategori ini.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const categoryMeta = NOTIFICATION_CATEGORIES[item.category] || NOTIFICATION_CATEGORIES.pengumuman;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition relative group ${
                      item.read
                        ? 'bg-white border-stone-200/90 text-slate-700'
                        : 'bg-emerald-50/40 border-emerald-300 shadow-2xs text-slate-900'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!item.read && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    )}

                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="flex-1 pr-6">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryMeta.badgeBg}`}>
                            {categoryMeta.label}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {item.sender && (
                            <span className="text-[10px] text-slate-500 font-medium italic">
                              · {item.sender}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {item.body}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleNotificationClick(item)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <span>Buka Modul Terkait</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          {!item.read && (
                            <button
                              onClick={() => notificationService.markAsRead(item.id)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                            >
                              Tandai Dibaca
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FCM Live Test Dispatcher */}
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">Uji Push FCM:</span>
              <select
                value={testingCategory}
                onChange={(e) => setTestingCategory(e.target.value as NotificationCategory)}
                className="text-xs bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-emerald-600 cursor-pointer"
              >
                {Object.values(NOTIFICATION_CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSendTestPush}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testSent ? '✓ Notifikasi Terkirim!' : 'Kirim Uji ke HP/Browser'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
