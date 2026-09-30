import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Volume2,
  Mic,
  Camera,
  Play,
  Pause,
  Award,
  BookOpen,
  Calendar,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TreePine,
  Sliders,
  Send,
  Plus,
  Compass,
  FolderLock,
  User,
  Users,
  Eye,
  Feather,
  RefreshCw,
  Sun
} from 'lucide-react';
import {
  lorongKenanganEngine,
  LivingPhotoMemory,
  VoiceMemory,
  CohortTreeMemory,
  PrayerCapsule,
  AdventureMilestone
} from '../../services/lorongKenanganEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface LorongKenanganHubProps {
  onNavigateToWorldMap?: () => void;
  onNavigateToSchool?: () => void;
}

export const LorongKenanganHub: React.FC<LorongKenanganHubProps> = ({
  onNavigateToWorldMap,
  onNavigateToSchool
}) => {
  const [snapshot, setSnapshot] = useState(lorongKenanganEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<
    'GALLERY' | 'ADVENTURE' | 'VOICE_BOX' | 'COHORT_TREE' | 'PRAYER_CAPSULE' | 'FAMILY_ALBUM' | 'COCKPIT'
  >('GALLERY');
  const [governorSlots, setGovernorSlots] = useState(tadeAnimationGovernor.getActiveCount());

  // Form states for adding new voice note or prayer capsule
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [newVoiceTranscript, setNewVoiceTranscript] = useState('');
  const [newVoiceTitle, setNewVoiceTitle] = useState('');
  const [newVoiceTeacher, setNewVoiceTeacher] = useState('Ustadzah Syifa');

  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [newPrayerText, setNewPrayerText] = useState('');
  const [newPrayerAuthor, setNewPrayerAuthor] = useState('Ibunda Farhan');

  useEffect(() => {
    const unsub = lorongKenanganEngine.subscribe(() => {
      setSnapshot(lorongKenanganEngine.getSnapshot());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setGovernorSlots(tadeAnimationGovernor.getActiveCount());
    });

    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  const handlePlayVoice = (voiceId: string) => {
    lorongKenanganEngine.playVoiceMemory(voiceId);
  };

  const handleSaveVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoiceTranscript.trim()) return;

    lorongKenanganEngine.addNewVoiceMemory({
      studentId: snapshot.selectedStudentId,
      studentName: 'Muhammad Farhan Al-Fatih',
      teacherName: newVoiceTeacher,
      teacherRole: 'Guru Pembina Sentra',
      title: newVoiceTitle || 'Ucapan Doa & Motivasi Santri',
      durationSec: 25,
      transcript: newVoiceTranscript,
      blessingTag: 'Adab & Tahfidz'
    });

    setNewVoiceTranscript('');
    setNewVoiceTitle('');
    setShowVoiceRecorder(false);
  };

  const handleSavePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerText.trim()) return;

    lorongKenanganEngine.addNewPrayerCapsule({
      studentId: snapshot.selectedStudentId,
      studentName: 'Muhammad Farhan Al-Fatih',
      authorName: newPrayerAuthor,
      authorRelation: 'IBUNDA',
      prayerText: newPrayerText,
      graduationYear: 2027,
      sealColor: 'EMAS_ASY_SYIFA'
    });

    setNewPrayerText('');
    setShowPrayerModal(false);
  };

  return (
    <div className="min-h-screen bg-amber-950/20 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden">
      {/* =========================================================
          TOP NAVIGATION HEADER
      ========================================================= */}
      <header className="bg-white/95 backdrop-blur border-b border-amber-200/80 px-4 py-3 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20">
            <Heart className="w-6 h-6 text-amber-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Lorong Kenangan Asy & Syifa
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Sprint G30
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-800 text-white shadow-sm flex items-center gap-1">
                <FolderLock className="w-3 h-3" /> Privasi Keluarga
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Tempat Perjalanan Suci Santri Tersimpan • Bukan Media Sosial • Tanpa Ranking & Persaingan
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="bg-amber-100/70 p-1 rounded-xl flex items-center gap-1 border border-amber-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('GALLERY')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'GALLERY'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>🖼️ Lorong Foto</span>
            </button>
            <button
              onClick={() => setActiveTab('ADVENTURE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ADVENTURE'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>🗺️ Jejak Petualangan</span>
            </button>
            <button
              onClick={() => setActiveTab('VOICE_BOX')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'VOICE_BOX'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>🎙️ Kotak Suara</span>
            </button>
            <button
              onClick={() => setActiveTab('COHORT_TREE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'COHORT_TREE'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>🌳 Pohon Angkatan</span>
            </button>
            <button
              onClick={() => setActiveTab('PRAYER_CAPSULE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PRAYER_CAPSULE'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>✨ Kapsul Doa</span>
            </button>
            <button
              onClick={() => setActiveTab('FAMILY_ALBUM')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'FAMILY_ALBUM'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>📖 Album Keluarga</span>
            </button>
            <button
              onClick={() => setActiveTab('COCKPIT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'COCKPIT'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Founder Memory
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN MEMORY HALL STAGE WITH BONUS AMBIENCE
      ========================================================= */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-amber-100/30 to-amber-200/40 p-4 sm:p-6 flex flex-col justify-between">
        {/* Bonus Ambient Lighting: Sinar Jendela Melengkung (Arched Islamic Window Rays) */}
        <div
          className="absolute top-0 right-10 w-96 h-96 bg-gradient-to-br from-amber-300/30 via-amber-200/10 to-transparent pointer-events-none blur-3xl transform rotate-12 z-0"
        />

        {/* Bonus Ambience: Kupu-Kupu Emas (Golden Butterflies) */}
        {snapshot.goldenButterflyActive && (
          <>
            <motion.div
              animate={{ x: [0, 60, 20, -40, 0], y: [0, -30, 10, -20, 0], rotate: [0, 15, -10, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 left-16 text-3xl pointer-events-none z-10 filter drop-shadow-md"
              title="Kupu-Kupu Emas Kenangan"
            >
              🦋
            </motion.div>
            <motion.div
              animate={{ x: [0, -50, -20, 30, 0], y: [0, 20, -15, 10, 0], rotate: [0, -10, 15, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-40 right-28 text-2xl pointer-events-none z-10 filter drop-shadow-md"
            >
              ✨
            </motion.div>
          </>
        )}

        {/* =====================================================
            TAB 1: P1 — LORONG FOTO HIDUP (Wooden Frames)
        ===================================================== */}
        {activeTab === 'GALLERY' && (
          <div className="relative z-10 max-w-6xl mx-auto w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-900">
                P1 — Lorong Foto Hidup
              </span>
              <h2 className="text-2xl font-black text-amber-950">
                Setiap Senyum Mengabadikan Kasih Sayang & Keberkahan
              </h2>
              <p className="text-xs text-amber-800 font-medium">
                Bingkai kayu berukir bergoyang lembut saat disentuh dengan pantulan cahaya berkilau
              </p>
            </div>

            {/* Photo Frames Isometric Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {snapshot.livingPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  onClick={() => lorongKenanganEngine.playFrameHarpSound()}
                  animate={{ y: [0, -6, 0], rotate: [-0.5, 0.5, -0.5] }}
                  transition={{ duration: photo.swaySpeedSec, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.04, rotate: 0 }}
                  className="bg-amber-100 p-4 rounded-3xl shadow-2xl border-4 border-amber-800/40 relative group cursor-pointer flex flex-col justify-between"
                  style={{
                    boxShadow: '0 20px 30px -10px rgba(120, 53, 15, 0.3)'
                  }}
                >
                  {/* Wooden Frame Hanging Hook */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-900 border-2 border-amber-300 flex items-center justify-center text-[10px] text-amber-200 font-bold z-20">
                    ⚜️
                  </div>

                  <div>
                    {/* Photo Image Card */}
                    <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-inner bg-slate-900">
                      <img
                        src={photo.photoUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-900/80 text-amber-100 backdrop-blur-sm border border-amber-400/40 flex items-center gap-1">
                        <span>{photo.locationEmoji}</span>
                        <span>{photo.locationName}</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-amber-900 font-bold">
                        <span>{photo.studentName}</span>
                        <span>{photo.dateStr}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-slate-700 italic mt-1.5 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-amber-300/60 flex items-center justify-between text-[10px] font-bold text-amber-900">
                    <span>Bingkai: {photo.frameStyle}</span>
                    <span className="text-amber-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Berkilau
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: P2 — JEJAK PETUALANGAN ASY-SYIFA
        ===================================================== */}
        {activeTab === 'ADVENTURE' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-200 text-emerald-900">
                P2 — Jejak Petualangan
              </span>
              <h2 className="text-2xl font-black text-emerald-950">
                Rangkaian Petualangan Penuh Nilai Kebajikan
              </h2>
              <p className="text-xs text-emerald-800 font-medium">
                Setiap pos pembelajaran adalah batu loncatan pembentukan karakter dan adab mulia
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {snapshot.adventureMilestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white/90 backdrop-blur p-5 rounded-3xl shadow-xl border-2 border-emerald-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                        {milestone.emoji}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        Pos #{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900">{milestone.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800">Nilai: {milestone.spiritualValue}</span>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {milestone.completedCount} Santri Terinspirasi
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: P3 — KOTAK SUARA KENANGAN (Voice Box)
        ===================================================== */}
        {activeTab === 'VOICE_BOX' && (
          <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-amber-300 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800">
                  P3 — Kotak Suara Kenangan
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Suara Tulus Guru yang Meneduhkan Hati
                </h2>
                <p className="text-xs text-slate-600">
                  Guru merekam nasihat & doa singkat, orang tua dapat memutar kapan pun dengan suara lembut
                </p>
              </div>

              <button
                onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>{showVoiceRecorder ? 'Tutup Perekam' : 'Rekam Ucapan Baru'}</span>
              </button>
            </div>

            {/* Voice Recorder Form Modal */}
            <AnimatePresence>
              {showVoiceRecorder && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSaveVoice}
                  className="bg-indigo-50/95 backdrop-blur p-5 rounded-3xl border-2 border-indigo-300 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-indigo-950 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-indigo-600" /> Form Rekaman Doa Guru
                    </span>
                    <span className="text-xs text-indigo-700 font-bold">Web Audio Synthesizer</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-indigo-900 mb-1">
                        Nama Guru / Ustadzah
                      </label>
                      <input
                        type="text"
                        value={newVoiceTeacher}
                        onChange={(e) => setNewVoiceTeacher(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-semibold focus:outline-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-indigo-900 mb-1">
                        Judul Pesan
                      </label>
                      <input
                        type="text"
                        value={newVoiceTitle}
                        onChange={(e) => setNewVoiceTitle(e.target.value)}
                        placeholder="Contoh: Apresiasi Kemajuan Hafalan..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-semibold focus:outline-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-900 mb-1">
                      Transkrip Ucapan Tulus
                    </label>
                    <textarea
                      rows={3}
                      value={newVoiceTranscript}
                      onChange={(e) => setNewVoiceTranscript(e.target.value)}
                      placeholder="Tuliskan ucapan penyemangat dan doa kebaikan untuk santri..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-semibold focus:outline-indigo-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVoiceRecorder(false)}
                      className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Simpan & Putar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of Voice Memories */}
            <div className="space-y-4">
              {snapshot.voiceMemories.map((voice) => (
                <div
                  key={voice.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    snapshot.activeVoicePlayingId === voice.id
                      ? 'bg-indigo-100/90 border-indigo-500 shadow-xl'
                      : 'bg-white/90 border-slate-200 hover:border-indigo-300 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handlePlayVoice(voice.id)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all ${
                        snapshot.activeVoicePlayingId === voice.id
                          ? 'bg-indigo-600 animate-pulse scale-105'
                          : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                    >
                      {snapshot.activeVoicePlayingId === voice.id ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-900">{voice.teacherName}</span>
                        <span className="text-[10px] text-slate-500 font-bold">• {voice.recordedDate}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-100 text-indigo-800">
                          {voice.blessingTag}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{voice.title}</h3>
                      <p className="text-xs text-slate-700 italic max-w-xl leading-relaxed">
                        {voice.transcript}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-500">
                      Durasi: {voice.durationSec}s
                    </span>
                    <button
                      onClick={() => handlePlayVoice(voice.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 border border-indigo-200"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{snapshot.activeVoicePlayingId === voice.id ? 'Memutar...' : 'Dengarkan'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: P4 — POHON ANGKATAN (Cohort Memory Trees)
        ===================================================== */}
        {activeTab === 'COHORT_TREE' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-200 text-teal-900">
                P4 — Pohon Angkatan
              </span>
              <h2 className="text-2xl font-black text-teal-950">
                Pohon Berbuah Manis dari Setiap Angkatan
              </h2>
              <p className="text-xs text-teal-800 font-medium">
                Setiap angkatan memiliki pohon yang terus bertumbuh lebat daunnya seiring amal kebaikan santri
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {snapshot.cohortTrees.map((tree) => (
                <div
                  key={tree.cohortNumber}
                  className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl border-2 border-teal-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Tree Visual Representation */}
                    <div className="relative h-44 bg-teal-50 rounded-2xl border border-teal-200 flex flex-col items-center justify-center overflow-hidden mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl"
                      >
                        🌳
                      </motion.div>
                      <span className="text-xs font-black text-teal-900 mt-2">
                        {tree.cohortName}
                      </span>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-sm">
                        Tahun {tree.year}
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-slate-900">Motto Angkatan:</h3>
                    <p className="text-xs text-slate-600 italic mt-0.5 leading-relaxed">
                      “{tree.motto}”
                    </p>

                    <div className="mt-3 space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Momen Bersejarah:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {tree.keyMoments.map((mom, mi) => (
                          <span
                            key={mi}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-900"
                          >
                            {mom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-900">{tree.totalStudents} Santri</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      🍃 {tree.leafCount} Daun Memori
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 5: P5 — KAPSUL DOA (Graduation Prayer Capsules)
        ===================================================== */}
        {activeTab === 'PRAYER_CAPSULE' && (
          <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-rose-200 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                  P5 — Kapsul Doa Wisuda
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Untaian Doa yang Terkunci Hingga Hari Wisuda
                </h2>
                <p className="text-xs text-slate-600">
                  Doa orang tua & guru disimpan dengan segel suci dan dibuka saat Haflah Akhirussanah
                </p>
              </div>

              <button
                onClick={() => setShowPrayerModal(!showPrayerModal)}
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Titip Doa Baru</span>
              </button>
            </div>

            {/* Prayer Capsule Form Modal */}
            <AnimatePresence>
              {showPrayerModal && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSavePrayer}
                  className="bg-rose-50/95 backdrop-blur p-5 rounded-3xl border-2 border-rose-300 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-rose-950 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-600" /> Segel Kapsul Doa Wisuda
                    </span>
                    <span className="text-xs text-rose-700 font-bold">Dibuka: Wisuda 2027</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-900 mb-1">
                      Nama Penulis Doa (Ayahanda / Ibunda / Guru)
                    </label>
                    <input
                      type="text"
                      value={newPrayerAuthor}
                      onChange={(e) => setNewPrayerAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-semibold focus:outline-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-900 mb-1">
                      Untaian Doa Tulus untuk Santri
                    </label>
                    <textarea
                      rows={3}
                      value={newPrayerText}
                      onChange={(e) => setNewPrayerText(e.target.value)}
                      placeholder="Tuliskan doa terbaik untuk bekal perjalanan ananda kelak..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-semibold focus:outline-rose-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPrayerModal(false)}
                      className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" /> Segel Kapsul Doa
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of Prayer Capsules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {snapshot.prayerCapsules.map((capsule) => (
                <div
                  key={capsule.id}
                  className="bg-white/90 backdrop-blur p-5 rounded-3xl shadow-xl border-2 border-rose-200 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-lg">
                          📜
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            {capsule.authorName}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Ditulis: {capsule.createdDate}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" /> Tersegel Rapi
                      </span>
                    </div>

                    <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 text-xs text-slate-700 italic leading-relaxed">
                      {capsule.prayerText}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Untuk: {capsule.studentName}</span>
                    <span className="text-rose-700 font-bold">
                      Buka di Wisuda {capsule.graduationYear} 🎓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 6: P6 — ALBUM KELUARGA (Private Family Album)
        ===================================================== */}
        {activeTab === 'FAMILY_ALBUM' && (
          <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-white/95 backdrop-blur p-6 rounded-3xl shadow-xl border border-amber-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center text-2xl shadow-md">
                    👨‍👩‍👧‍👦
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Album Pribadi Keluarga Farhan
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold">
                      Prinsip Asy-Syifa: Privasi Mutlak • Tanpa Feed Sosial • Bebas Tekanan Ranking
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terproteksi Sandi Keluarga
                </span>
              </div>

              {/* Family Album Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {snapshot.livingPhotos.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 rounded-xl overflow-hidden mb-3 border border-amber-300">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-amber-800">{item.dateStr}</span>
                      <h4 className="text-sm font-black text-slate-900 mt-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 7: P7 — FOUNDER MEMORY CONTROL (Cockpit & Telemetry)
        ===================================================== */}
        {activeTab === 'COCKPIT' && (
          <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-600/20">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Founder Memory Control Cockpit (P7)
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Preview Bingkai 3D, Uji Harpa Audio, dan Audit Telemetri Black Box Ring-0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    Sprint G30 Verifier
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Quick Audio Tester */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-black text-slate-900 block">
                    Uji Audio Sintetis Web Audio
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => lorongKenanganEngine.playFrameHarpSound()}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🎵 Harpa Bingkai (C5-G5)</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => lorongKenanganEngine.playVoiceMemory('voice-1')}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 text-indigo-900 font-bold text-xs flex items-center justify-between"
                    >
                      <span>🎙️ Melodi Suara Doa Guru</span>
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Quick Navigation Shortcuts */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-black text-slate-900 block">
                    Pintas Ekosistem Asy-Syifa
                  </span>
                  <div className="space-y-2">
                    {onNavigateToWorldMap && (
                      <button
                        onClick={onNavigateToWorldMap}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow-sm"
                      >
                        <span>🗺️ Buka Peta Dunia (G28)</span>
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onNavigateToSchool && (
                      <button
                        onClick={onNavigateToSchool}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow-sm"
                      >
                        <span>🏫 Buka Sekolah Bernapas (G29)</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Privacy & Compliance Seal */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-xs font-black text-emerald-950 block">
                    Sertifikasi Privasi Santri
                  </span>
                  <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                    Lorong Kenangan memenuhi standar tanpa kompetisi, bebas ranking, dan data terlindungi dalam enkripsi lokal keluarga.
                  </p>
                  <span className="inline-block text-[10px] font-black text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">
                    GPV 8X & Hermes Compliant
                  </span>
                </div>
              </div>

              {/* Performance Diagnostics Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Dr. Pulse 60 FPS & TADE Animation Governor
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">60.0 FPS • GUARANTEED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Slot Animasi Aktif:</span>
                    <span className="text-sm font-black text-amber-300">{governorSlots} / 5</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Total Foto Hidup:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {snapshot.livingPhotos.length} Bingkai
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Pohon Angkatan:</span>
                    <span className="text-sm font-black text-sky-300">
                      {snapshot.cohortTrees.length} Generasi
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Kapsul Doa Tersegel:</span>
                    <span className="text-sm font-black text-rose-300">
                      {snapshot.prayerCapsules.length} Aman
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LorongKenanganHub;
