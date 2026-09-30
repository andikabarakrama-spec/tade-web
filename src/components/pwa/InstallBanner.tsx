import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Share2, PlusSquare, Smartphone, CheckCircle, Sparkles } from 'lucide-react';

interface InstallBannerProps {
  forceShow?: boolean;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({ forceShow = false }) => {
  const {
    isIOS,
    isInstalled,
    isStandalone,
    shouldShowBanner,
    promptInstall,
    dismissBanner
  } = usePWAInstall();

  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success'>('idle');

  // If already standalone / installed and not forced, do not render
  if ((!shouldShowBanner && !forceShow) || (isStandalone && !forceShow) || (isInstalled && !forceShow)) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    setInstallStatus('installing');
    const result = await promptInstall();
    if (result === 'accepted') {
      setInstallStatus('success');
      setTimeout(() => {
        dismissBanner();
      }, 2500);
    } else {
      setInstallStatus('idle');
    }
  };

  return (
    <aside
      id="pwa-install-banner"
      aria-label="PWA Install Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-emerald-950/40 ring-1 ring-white/10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Close Button */}
        <button
          id="btn-pwa-dismiss-top"
          onClick={() => dismissBanner()}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Tutup Banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Banner Content */}
        <div className="flex items-start gap-3.5">
          {/* App Icon Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 p-0.5 shadow-md shrink-0 flex items-center justify-center border border-emerald-400/30">
            <img
              src="/assets/mascot/asy/ASY_MASTER.png"
              alt="TADE Icon"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                // Fallback to vector icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Texts */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 id="pwa-banner-title" className="font-bold text-sm text-white flex items-center gap-1">
                📲 Pasang TADE di Layar Utama
              </h3>
            </div>
            <p id="pwa-banner-desc" className="text-xs text-slate-300 leading-relaxed">
              Supaya lebih mudah, cukup tekan ikon TADE seperti membuka aplikasi biasa.
            </p>
          </div>
        </div>

        {/* iOS Step-by-Step Instructions Modal / Accordion */}
        {showIOSGuide && (
          <div
            id="pwa-ios-guide-box"
            className="mt-3.5 pt-3 border-t border-slate-800 bg-slate-950/60 -mx-4 -mb-4 p-4 rounded-b-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                Langkah Pasang di iPhone / iPad:
              </span>
              <button
                id="btn-close-ios-guide"
                onClick={() => setShowIOSGuide(false)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Tutup Panduan
              </button>
            </div>
            <ol className="space-y-2 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[11px] flex items-center justify-center shrink-0 border border-emerald-800">
                  1
                </span>
                <span>
                  Tekan tombol <strong className="text-white inline-flex items-center gap-1">Bagikan <Share2 className="w-3 h-3 text-blue-400 inline" /></strong> di bilah bawah Safari.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[11px] flex items-center justify-center shrink-0 border border-emerald-800">
                  2
                </span>
                <span>
                  Gulir ke bawah dan pilih <strong className="text-white inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3 h-3 text-emerald-400 inline" /></strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[11px] flex items-center justify-center shrink-0 border border-emerald-800">
                  3
                </span>
                <span>
                  Tekan <strong className="text-white">Add / Tambah</strong> di pojok kanan atas.
                </span>
              </li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        {!showIOSGuide && (
          <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              id="btn-pwa-dismiss"
              onClick={() => dismissBanner()}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              Nanti Saja
            </button>

            <button
              id="btn-pwa-install"
              onClick={handleInstallClick}
              disabled={installStatus === 'installing'}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-70"
            >
              {installStatus === 'success' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  Berhasil Dipasang!
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Pasang TADE
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
