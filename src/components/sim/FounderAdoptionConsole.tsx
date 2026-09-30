import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, Bell, Share2, Link2, Send, CheckCircle2, 
  Users, Activity, Sparkles, ArrowUpRight, BarChart3, 
  RefreshCw, Clock, ShieldCheck, Eye 
} from 'lucide-react';
import { adoptionAnalyticsService, AdoptionMetrics } from '../../services/adoptionAnalyticsService';
import { notificationService } from '../../services/notificationService';
import { WhatsAppBroadcastModal } from '../common/WhatsAppBroadcastModal';

interface FounderAdoptionConsoleProps {
  onSelectTab?: (tab: string) => void;
}

export const FounderAdoptionConsole: React.FC<FounderAdoptionConsoleProps> = ({
  onSelectTab
}) => {
  const [metrics, setMetrics] = useState<AdoptionMetrics>(adoptionAnalyticsService.getMetrics());
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = adoptionAnalyticsService.subscribe(setMetrics);
    return () => unsubscribe();
  }, []);

  const handleSimulateDeepLink = (tab: string) => {
    adoptionAnalyticsService.trackDeepLinkOpened(tab, 'founder_console_simulation');
  };

  const handleSimulateBroadcastPush = () => {
    notificationService.addNotification({
      category: 'pengumuman',
      title: 'Uji Coba Push Broadcast Go-Live',
      body: 'Notifikasi real-time berhasil diterima di HP wali murid via Service Worker.',
      actionTab: 'w3',
      sender: 'Founder Adoption Engine'
    });
    adoptionAnalyticsService.trackNotificationDelivered(1);
  };

  const readRatio = metrics.notificationsDelivered > 0
    ? Math.round((metrics.notificationsOpened / metrics.notificationsDelivered) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-emerald-800/80 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-600/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                G206 • Founder Adoption Console
              </span>
              <span className="text-xs text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Parent Adoption & Operational Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Observabilitas adopsi digital wali murid: status instalasi PWA di smartphone, penerimaan Push Notification, dan lalu lintas Universal Deep Link sekolah.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Broadcast WhatsApp
            </button>
            <button
              onClick={handleSimulateBroadcastPush}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              Test Push Notif
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Adoption Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. PWA Installs */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">PWA Terpasang</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-white">
            {metrics.pwaInstalls}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Di Layar HP Wali Murid
          </p>
        </div>

        {/* 2. Notification Permissions */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">Izin Notifikasi</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-white">
            {metrics.notificationsEnabled}
          </p>
          <p className="text-[10px] text-teal-600 font-semibold">
            Token FCM Terdaftar
          </p>
        </div>

        {/* 3. WhatsApp Shares */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">Share WhatsApp</span>
            <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-white">
            {metrics.whatsAppShares}
          </p>
          <p className="text-[10px] text-green-600 font-semibold">
            Dibagikan ke Paguyuban
          </p>
        </div>

        {/* 4. Deep Links Opened */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">Deep Link Hits</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-white">
            {metrics.deepLinksOpened}
          </p>
          <p className="text-[10px] text-sky-600 font-semibold">
            Routing Instan ke Tab
          </p>
        </div>

        {/* 5. Read Rate Ratio */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">Open Rate Notif</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-white">
            {readRatio}%
          </p>
          <p className="text-[10px] text-amber-600 font-semibold">
            {metrics.notificationsOpened} dari {metrics.notificationsDelivered} Dibaca
          </p>
        </div>

        {/* 6. Daily Active Parents */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase">Wali Murid DAP</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 dark:text-white">
            {metrics.dailyActiveParents}
          </p>
          <p className="text-[10px] text-purple-600 font-semibold">
            Kunjungan Hari Ini
          </p>
        </div>
      </div>

      {/* Breakdown & Recent Live Stream Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Deep Link Distribution */}
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Distribusi Universal Deep Link
            </h3>
            <span className="text-[11px] text-stone-400">Total {metrics.deepLinksOpened} kunjungan</span>
          </div>

          <div className="space-y-3">
            {[
              { tab: 'w3', label: 'Pengumuman Sekolah (W3)', count: metrics.deepLinksByTab.w3 || 0, color: 'bg-amber-500' },
              { tab: 'w4', label: 'Portal PPDB Online (W4)', count: metrics.deepLinksByTab.w4 || 0, color: 'bg-emerald-500' },
              { tab: 'r6', label: 'Presensi Digital Santri (R6)', count: metrics.deepLinksByTab.r6 || 0, color: 'bg-blue-500' },
              { tab: 'r17', label: 'Mutabaah Tahfidz & Doa (R17)', count: metrics.deepLinksByTab.r17 || 0, color: 'bg-teal-500' },
              { tab: 'r10', label: 'Infaq & SPP Sekolah (R10)', count: metrics.deepLinksByTab.r10 || 0, color: 'bg-rose-500' }
            ].map(item => {
              const pct = metrics.deepLinksOpened > 0 ? Math.round((item.count / metrics.deepLinksOpened) * 100) : 0;
              return (
                <div key={item.tab} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-700 dark:text-stone-300">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 dark:text-white font-bold">{item.count} hits</span>
                      <button
                        onClick={() => handleSimulateDeepLink(item.tab)}
                        className="text-[10px] text-emerald-600 hover:underline cursor-pointer"
                      >
                        +Uji
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Adoption Event Log */}
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Aliran Event Adopsi Terkini
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Sovereign Log
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {metrics.recentEvents.slice(0, 8).map(event => (
              <div
                key={event.id}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                    {event.type}
                  </span>
                  <span className="text-stone-400">
                    {new Date(event.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 font-medium">
                  {event.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Preview Modal */}
      <WhatsAppBroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Pemberitahuan Kegiatan Sentra & Doa Bersama"
        category="Pengumuman Sekolah"
        body="Assalamu'alaikum Ayah & Bunda. Kami mengundang seluruh ananda untuk hadir tepat waktu mengenakan seragam rapi dan membawa bekal sehat."
        targetTab="w3"
      />
    </div>
  );
};
