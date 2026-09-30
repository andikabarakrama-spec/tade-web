import React, { useState } from 'react';
import { 
  Bot, 
  Eye, 
  Hand, 
  Move, 
  Sparkles, 
  MessageSquare, 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  Play, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { OneHandUXValidator } from './OneHandUXValidator';
import { PeekIntelligenceEngine } from '../../core/mascot3d/peekIntelligenceEngine';
import { ThumbAwarenessEngine } from '../../core/mascot3d/thumbAwarenessEngine';
import { SmartEdgeSittingEngine } from '../../core/mascot3d/smartEdgeSittingEngine';
import { TinyReactionEngine } from '../../core/mascot3d/tinyReactionEngine';
import { DynamicBubbleIntelligence } from '../../core/mascot3d/dynamicBubbleIntelligence';
import { GesturePolishEngine } from '../../core/mascot3d/gesturePolishEngine';
import { MobileSafeAreaGuardian } from '../../core/mascot3d/mobileSafeAreaGuardian';
import { PerformanceMicroOptimizer } from '../../core/mascot3d/performanceMicroOptimizer';

interface RC98LivingAsyWarRoomViewerProps {
  initialTab?: 'peek' | 'thumb' | 'edge' | 'reactions' | 'bubble' | 'gesture' | 'performance' | 'validator';
}

export const RC98LivingAsyWarRoomViewer: React.FC<RC98LivingAsyWarRoomViewerProps> = ({
  initialTab = 'validator'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const peekEngine = PeekIntelligenceEngine.getInstance();
  const thumbEngine = ThumbAwarenessEngine.getInstance();
  const edgeEngine = SmartEdgeSittingEngine.getInstance();
  const reactionEngine = TinyReactionEngine.getInstance();
  const bubbleIntelligence = DynamicBubbleIntelligence.getInstance();
  const gestureEngine = GesturePolishEngine.getInstance();
  const safeAreaGuardian = MobileSafeAreaGuardian.getInstance();
  const perfOptimizer = PerformanceMicroOptimizer.getInstance();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                v7.6.0-RC98
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ENTERPRISE PRODUCTION • ONE-HAND MOBILE MASTERPIECE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Bot className="w-8 h-8 text-emerald-400" />
              Asy Micro-Interaction War Room
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Pusat komando orkestrasi micro-interaction, kecerdasan intip bertahap, kesadaran jempol mobile, 
              duduk tepi card, reaksi mikro instan, dan kepatuhan One-Hand Founder Test.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                peekEngine.triggerStagedEntrance();
                reactionEngine.trigger('MILESTONE', 'RC98 Aktif!');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Uji Orkestrasi Penuh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3">
        {[
          { id: 'validator', label: 'One-Hand UX Validator (R809)', icon: ShieldCheck },
          { id: 'peek', label: 'Peek Intelligence (R801)', icon: Eye },
          { id: 'thumb', label: 'Thumb Awareness (R802)', icon: Hand },
          { id: 'edge', label: 'Edge Sitting (R803)', icon: Move },
          { id: 'reactions', label: 'Tiny Reactions (R804)', icon: Sparkles },
          { id: 'bubble', label: 'Dynamic Bubble (R805)', icon: MessageSquare },
          { id: 'gesture', label: 'Gesture & Safe Area (R806/807)', icon: Smartphone },
          { id: 'performance', label: 'Performance Micro (R808)', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'validator' && (
        <div className="space-y-6">
          <OneHandUXValidator />
        </div>
      )}

      {activeTab === 'peek' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R801 — Peek Intelligence Engine</h3>
              <p className="text-xs text-slate-400">
                Kemunculan bertahap 300–500ms di HP: Mata muncul dulu → Kepala keluar → Naik sedikit
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <button
              onClick={() => peekEngine.triggerStagedEntrance('RIGHT_BOTTOM')}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-left transition cursor-pointer"
            >
              <span className="text-emerald-400 font-bold block mb-1">1. Staged Entrance Kanan</span>
              Mata muncul di sudut kanan bawah lalu naik ke dock penuh (420ms).
            </button>

            <button
              onClick={() => peekEngine.hideToPeek()}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-left transition cursor-pointer"
            >
              <span className="text-amber-400 font-bold block mb-1">2. Peek Mode (Mengintip)</span>
              Menyusut ke tepi layar saat pengguna sedang mengetik form penting.
            </button>

            <button
              onClick={() => peekEngine.resetToFullDock()}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-left transition cursor-pointer"
            >
              <span className="text-cyan-400 font-bold block mb-1">3. Reset Posisi Dock</span>
              Mengembalikan ke status dock normal.
            </button>
          </div>
        </div>
      )}

      {activeTab === 'thumb' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Hand className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R802 — Thumb Awareness Engine</h3>
              <p className="text-xs text-slate-400">
                Menghindari area ibu jari, memberi ruang saat FAB aktif, dan bergeser otomatis saat keyboard muncul.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            <button
              onClick={() => thumbEngine.setKeyboardPresence(true)}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
            >
              Simulasi Keyboard Muncul (+120px)
            </button>
            <button
              onClick={() => thumbEngine.setKeyboardPresence(false)}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
            >
              Simulasi Keyboard Tutup
            </button>
            <button
              onClick={() => thumbEngine.setFABPresence(true)}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
            >
              Simulasi FAB Aktif (+56px)
            </button>
            <button
              onClick={() => thumbEngine.setFABPresence(false)}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
            >
              Simulasi FAB Nonaktif
            </button>
          </div>
        </div>
      )}

      {activeTab === 'edge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Move className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R803 — Smart Edge Sitting Engine</h3>
              <p className="text-xs text-slate-400">
                Asy duduk manis di tepi panel tanpa menutupi konten dan otomatis kembali ke dock saat pengguna scroll.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <button
              onClick={() => edgeEngine.sitOnCard('Kartu PPDB Santri', 'TOP_RIGHT', 7)}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-left"
            >
              <span className="text-emerald-400 font-bold block mb-1">Duduk Tepi Kanan Atas</span>
              Duduk di sudut atas kartu PPDB selama 7 detik.
            </button>
            <button
              onClick={() => edgeEngine.sitOnCard('Laporan Keuangan SPP', 'TOP_LEFT', 7)}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-left"
            >
              <span className="text-cyan-400 font-bold block mb-1">Duduk Tepi Kiri Atas</span>
              Duduk di sudut kiri atas panel keuangan.
            </button>
            <button
              onClick={() => edgeEngine.returnToDock()}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-left"
            >
              <span className="text-rose-400 font-bold block mb-1">Kembali Ke Dock</span>
              Segera kembali ke posisi dock utama.
            </button>
          </div>
        </div>
      )}

      {activeTab === 'reactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R804 — Tiny Reaction Engine</h3>
              <p className="text-xs text-slate-400">
                Reaksi mikro instan (&lt;500ms) tanpa modal atau popup besar pemblokir layar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
            <button
              onClick={() => reactionEngine.trigger('SAVE_SUCCESS')}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-center transition cursor-pointer"
            >
              <div className="text-xl mb-1">👍</div>
              <div className="text-xs font-bold text-emerald-400">Save Berhasil</div>
            </button>
            <button
              onClick={() => reactionEngine.trigger('UPLOAD_COMPLETE')}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-center transition cursor-pointer"
            >
              <div className="text-xl mb-1">✨</div>
              <div className="text-xs font-bold text-blue-400">Upload Berkas</div>
            </button>
            <button
              onClick={() => reactionEngine.trigger('QR_SUCCESS')}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-center transition cursor-pointer"
            >
              <div className="text-xl mb-1">😊</div>
              <div className="text-xs font-bold text-purple-400">QR Valid</div>
            </button>
            <button
              onClick={() => reactionEngine.trigger('TOGGLE_ACTIVE')}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-center transition cursor-pointer"
            >
              <div className="text-xl mb-1">🙏</div>
              <div className="text-xs font-bold text-amber-400">Toggle Aktif</div>
            </button>
            <button
              onClick={() => reactionEngine.trigger('MILESTONE')}
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-center transition cursor-pointer"
            >
              <div className="text-xl mb-1">🎉</div>
              <div className="text-xs font-bold text-pink-400">Milestone</div>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'bubble' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R805 — Dynamic Bubble Intelligence</h3>
              <p className="text-xs text-slate-400">
                Penempatan cerdas speech bubble: Prioritas Atas → Kiri → Diagonal, zero viewport overflow di layar 360–430px.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-2">
            <p>✓ Menghitung sisa batas viewport horizontal dan vertikal secara dinamis.</p>
            <p>✓ Auto-dismiss 3–4 detik atau tekan ESC untuk menutup.</p>
            <p>✓ Menyesuaikan max-width otomatis pada layar HP sempit (360px).</p>
          </div>
        </div>
      )}

      {activeTab === 'gesture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R806 / R807 — Gesture Polish & Safe Area Guardian</h3>
              <p className="text-xs text-slate-400">
                Ayunan bahu alami, nafas bertahap, head-follow kursor/touch, serta kepatuhan env safe area inset.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 block mb-1">R806 Gesture Polish:</span>
              Ayunan bahu 1.8°, kurva nafas sinusoidal 1.02, dan pelacakan koordinat kursor berspring halus.
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
              <span className="font-bold text-cyan-400 block mb-1">R807 Safe Area Guardian:</span>
              Bebas bentrok gesture Android 3-tombol, iPhone Home Indicator, dan Dynamic Island.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">R808 — Performance Micro Optimizer</h3>
              <p className="text-xs text-slate-400">
                Idle CPU ≈ 0%, VRAM &lt; 10MB, 30 FPS di HP menengah, dan 60 FPS di desktop.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <div className="text-xl font-bold text-emerald-400 font-mono">0% CPU</div>
              <div className="text-[11px] text-slate-400 mt-1">Background Tab Suspended</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <div className="text-xl font-bold text-cyan-400 font-mono">&lt; 5 MB</div>
              <div className="text-[11px] text-slate-400 mt-1">VRAM Vector Asset</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <div className="text-xl font-bold text-amber-400 font-mono">30 / 60 FPS</div>
              <div className="text-[11px] text-slate-400 mt-1">Dynamic Throttling</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
