import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
  BookOpen,
  Heart,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';
import { AIAsyCharacterState } from '../assistant/AIAsyCharacterAssetRegistry';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface DashboardRealStats {
  studentsCount: number;
  teachersCount: number;
  hadirCount: number;
  totalPresensi: number;
  sppPercent: number;
  sppLunasCount: number;
  sppTotalCount: number;
  ppdbCount: number;
  pendingPPDB: number;
  approvedPPDB: number;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'asy';
  text: string;
  sources?: { title: string; category?: string }[];
  actionModule?: string;
  actionLabel?: string;
  timestamp: Date;
}

interface Props {
  stats: DashboardRealStats;
  selectedPerspective: UserRole;
  onSelectModule: (moduleId: string) => void;
}

export const AsyDashboardCompanion: React.FC<Props> = ({
  stats,
  selectedPerspective,
  onSelectModule,
}) => {
  const { activeRole, userProfile } = useAuth();
  const [activeVariant, setActiveVariant] = useState<'ASY' | 'ASYAH'>('ASY');
  const [characterState, setCharacterState] = useState<AIAsyCharacterState>('greeting');
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial canonical welcome
  const [messages, setMessages] = useState<MessageItem[]>(() => [
    {
      id: 'welcome-01',
      sender: 'asy',
      text: `Assalamu'alaikum warahmatullahi wabarakatuh! Halo ${userProfile?.nama || 'Bunda & Ustadzah'}, saya Asy, sahabat cerdas TK ASY SYIFA. Silakan tanyakan informasi data siswa, profil sekolah, kehadiran, atau panduan kegiatan hari ini!`,
      timestamp: new Date()
    }
  ]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Speech helper
  const speakText = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks or quotes for clean speech
      const cleanText = text.replace(/[*_#"`]/g, '').slice(0, 180);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.pitch = activeVariant === 'ASYAH' ? 1.15 : 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech fails gracefully without affecting UI
    }
  }, [isMuted, activeVariant]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Real data-grounded query resolver
  const resolveQuery = async (query: string): Promise<{
    text: string;
    sources?: { title: string; category?: string }[];
    actionModule?: string;
    actionLabel?: string;
  }> => {
    const q = query.toLowerCase().trim();

    // 1. Direct real-data metrics matching
    if (q.includes('siswa') || q.includes('murid') || q.includes('santri')) {
      if (stats.studentsCount > 0) {
        return {
          text: `Saat ini terdaftar ${stats.studentsCount} siswa aktif di TK ASY SYIFA yang terbagi dalam rombel Kelompok A, Kelompok B, dan TPA. Seluruh data induk tersimpan aman di database sekolah.`,
          actionModule: 'r3',
          actionLabel: 'Buka Data Siswa (R3)'
        };
      } else {
        return {
          text: `Belum ada siswa yang tercatat di database sekolah saat ini. Bunda/Ustadzah dapat menambahkan data siswa baru melalui modul Data Siswa.`,
          actionModule: 'r3',
          actionLabel: 'Tambah Data Siswa (R3)'
        };
      }
    }

    if (q.includes('guru') || q.includes('ustadz') || q.includes('ustadzah') || q.includes('pendidik')) {
      return {
        text: `Tercatat ${stats.teachersCount} guru dan tenaga pendidik aktif di TK ASY SYIFA. Seluruh PTK memiliki penugasan kelas dan jadwal pembelajaran sentra.`,
        actionModule: 'r4',
        actionLabel: 'Buka Direktori Guru (R4)'
      };
    }

    if (q.includes('presensi') || q.includes('hadir') || q.includes('absen') || q.includes('kehadiran')) {
      if (stats.totalPresensi > 0) {
        const hadirPct = Math.round((stats.hadirCount / stats.totalPresensi) * 100);
        return {
          text: `Rekap absensi hari ini: ${stats.hadirCount} dari ${stats.totalPresensi} siswa hadir (${hadirPct}%). Data terverifikasi langsung dari input presensi guru kelas.`,
          actionModule: 'r6',
          actionLabel: 'Lihat Presensi Siswa (R6)'
        };
      } else {
        return {
          text: `Hari ini belum ada data presensi yang diinput oleh guru kelas. Mohon lakukan pencatatan kehadiran pagi agar wali murid mendapatkan pembaruan realtime.`,
          actionModule: 'r6',
          actionLabel: 'Input Presensi Hari Ini (R6)'
        };
      }
    }

    if (q.includes('spp') || q.includes('tagihan') || q.includes('keuangan') || q.includes('bayar')) {
      if (stats.sppTotalCount > 0) {
        return {
          text: `Informasi Keuangan SPP: Dari total ${stats.sppTotalCount} tagihan bulan ini, ${stats.sppLunasCount} tagihan telah lunas (${stats.sppPercent}%). Terdapat ${stats.sppTotalCount - stats.sppLunasCount} tagihan yang masih dalam proses verifikasi atau menunggu pembayaran.`,
          actionModule: 'r10',
          actionLabel: 'Buka Tagihan SPP (R10)'
        };
      } else {
        return {
          text: `Belum ada tagihan SPP yang diterbitkan untuk periode aktif ini. Petugas tata usaha/keuangan dapat menerbitkan tagihan secara otomatis melalui Modul SPP.`,
          actionModule: 'r10',
          actionLabel: 'Kelola SPP (R10)'
        };
      }
    }

    if (q.includes('ppdb') || q.includes('daftar') || q.includes('pendaftar') || q.includes('calon')) {
      try {
        const ppdbCfg = await DataService.getPPDBLifecycleConfig();
        const statusEval = DataService.checkPPDBStatus(ppdbCfg);
        if (!statusEval.isOpen) {
          return {
            text: `Status PPDB Online saat ini sedang ${statusEval.status === 'NOT_STARTED' ? 'BELUM DIBUKA' : statusEval.status === 'EXPIRED' ? 'TELAH BERAKHIR' : 'DITUTUP'} untuk Tahun Ajaran ${ppdbCfg.academicYear}. ${statusEval.message} Admin operasional dapat mengaktifkan pendaftaran atau mengatur kuota langsung melalui kontrol PPDB di Dashboard SIM.`,
            actionModule: 'r13',
            actionLabel: 'Kelola PPDB (R13)'
          };
        }
        return {
          text: `Status PPDB Online sedang AKTIF (DIBUKA) [${ppdbCfg.currentWave} TA ${ppdbCfg.academicYear}]. Total ${stats.ppdbCount} calon siswa telah mendaftar dari target kuota ${ppdbCfg.targetQuota} kursi. Rincian: ${stats.approvedPPDB} diterima/lulus verifikasi, dan ${stats.pendingPPDB} berkas sedang menunggu verifikasi administrasi. Sistem menerapkan aturan 1 Calon Siswa = 1 Pendaftaran (pencegahan duplikasi aktif).`,
          actionModule: 'r13',
          actionLabel: 'Verifikasi PPDB (R13)'
        };
      } catch (err) {
        console.warn('PPDB lifecycle fetch in companion:', err);
        return {
          text: `Status PPDB Online: Total ${stats.ppdbCount} calon siswa telah mendaftar. Rincian: ${stats.approvedPPDB} diterima/lulus verifikasi, dan ${stats.pendingPPDB} berkas sedang menunggu verifikasi administrasi.`,
          actionModule: 'r13',
          actionLabel: 'Verifikasi PPDB (R13)'
        };
      }
    }

    // 2. Query Knowledge Engine (SOP, Profile, Documents, Guidelines)
    try {
      const summary = await DataService.buildKnowledgeSummary(
        query,
        selectedPerspective || activeRole || 'GURU',
        userProfile?.uid
      );

      if (summary && summary.totalResults > 0) {
        return {
          text: summary.summaryText,
          sources: summary.sources.slice(0, 3).map(s => ({ title: s.title, category: s.category })),
          actionModule: 'r16',
          actionLabel: 'Buka Smart Document (R16)'
        };
      } else if (summary && summary.schoolProfile) {
        const prof = summary.schoolProfile;
        return {
          text: `${prof.name || prof.namaSekolah || 'TK Asy Syifa Tanggul'}: ${prof.vision || prof.visi || 'Mewujudkan Generasi Muslim PAUD/TK yang Berkarakter Islami, Cerdas, Kreatif, dan Berakhlak Mulia'}. Beralamat di ${prof.address || prof.alamat || 'Jl. Raya Tanggul No. 88, Tanggul Barat, Jember, Jawa Timur'}.`,
          actionModule: 'r23',
          actionLabel: 'Profil Sekolah (R23)'
        };
      }
    } catch (err) {
      console.warn('DataService.buildKnowledgeSummary fallback:', err);
    }

    // 3. Honest fallback if no matches found
    return {
      text: `Afwan (maaf), Asy tidak menemukan dokumen atau data spesifik terkait "${query}" dalam pangkalan data sekolah saat ini. Silakan coba kata kunci lain seperti "siswa", "presensi", "SPP", "PPDB", atau pilih menu cepat di bawah ini.`
    };
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isThinking) return;

    // Check offline status
    if (!navigator.onLine) {
      setErrorMessage('Koneksi internet terputus. Mohon periksa jaringan Anda untuk berinteraksi dengan Asy.');
      return;
    }

    setErrorMessage(null);
    setLastQuery(textToSend);
    setInputText('');

    // Add user message
    const userMsg: MessageItem = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // Mascot enters thinking state
    setIsThinking(true);
    setCharacterState('thinking');

    try {
      const result = await resolveQuery(textToSend);

      const asyMsg: MessageItem = {
        id: `msg-${Date.now()}-asy`,
        sender: 'asy',
        text: result.text,
        sources: result.sources,
        actionModule: result.actionModule,
        actionLabel: result.actionLabel,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, asyMsg]);
      setCharacterState('speaking');
      speakText(result.text);

      // Return to happy/idle after speaking
      setTimeout(() => {
        setCharacterState('happy');
      }, 2500);
    } catch (err: any) {
      console.error('Error resolving Asy query:', err);
      setErrorMessage('Terjadi kendala saat membaca pangkalan data sekolah. Silakan coba beberapa saat lagi.');
      setCharacterState('idle');
    } finally {
      setIsThinking(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSendMessage(lastQuery);
    }
  };

  const QUICK_QUESTIONS = [
    'Berapa jumlah siswa aktif?',
    'Status presensi hari ini',
    'Rangkuman pelunasan SPP',
    'Update pendaftar PPDB',
    'Visi dan misi sekolah'
  ];

  return (
    <div
      id="asy-dashboard-companion-card"
      className="bg-gradient-to-br from-emerald-50/90 via-amber-50/40 to-sky-50/80 rounded-3xl p-5 sm:p-6 border-2 border-emerald-200/80 shadow-xs relative overflow-hidden transition-all duration-300"
    >
      {/* Playful Garden Top Accents */}
      <div className="absolute top-2 right-4 flex items-center gap-1.5 opacity-60 pointer-events-none">
        <span className="text-xl">🌸</span>
        <span className="text-sm">🍃</span>
        <span className="text-base">✨</span>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Sahabat Digital {activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'}
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                PANDUAN REALTIME
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Tanya jawab data nyata sekolah, profil kurikulum, dan panduan harian
            </p>
          </div>
        </div>

        {/* Character Gender Variant & Audio Voice Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isOnline
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}
            title={isOnline ? 'Terhubung ke server database sekolah' : 'Koneksi internet terputus'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>Terhubung</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-rose-600" />
                <span>Tidak Terhubung</span>
              </>
            )}
          </div>

          {/* Voice Mute Toggle */}
          <button
            onClick={() => {
              if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setIsMuted(!isMuted);
            }}
            className="p-1.5 rounded-xl bg-white hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 border border-emerald-200 transition cursor-pointer"
            title={isMuted ? 'Nyalakan Suara Asy' : 'Bisukan Suara Asy'}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Character Selector Toggle */}
          <button
            onClick={() => {
              const next = activeVariant === 'ASY' ? 'ASYAH' : 'ASY';
              setActiveVariant(next);
              setCharacterState('greeting');
            }}
            className="px-3 py-1 rounded-xl bg-white hover:bg-emerald-100 text-stone-800 text-xs font-bold border border-emerald-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            title="Ganti karakter pendamping"
          >
            <span>{activeVariant === 'ASY' ? '👦 Dek Asy' : '👧 Dek Syifa'}</span>
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-xl bg-white hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 border border-emerald-200 transition cursor-pointer flex items-center gap-1"
            title={isExpanded ? 'Perkecil tampilan' : 'Buka dialog interaktif'}
            aria-label={isExpanded ? 'Perkecil tampilan pendamping' : 'Buka dialog interaktif pendamping'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-800" /> : <ChevronDown className="w-4 h-4 text-emerald-800" />}
            <span className="text-[11px] font-bold text-emerald-900 hidden sm:inline">
              {isExpanded ? 'Perkecil' : 'Tanya'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Conversation & Character Stage */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4">
        {/* Mascot Visual Canvas Stage (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 border border-emerald-200/80 shadow-2xs text-center relative overflow-hidden">
          {/* Subtle Ambient Garden Background */}
          <div className="w-28 h-32 sm:w-32 sm:h-36 relative flex items-center justify-center">
            <AIAsyCharacterRenderer
              state={characterState}
              genderVariant={activeVariant}
              scale={1.15}
              className="w-full h-full"
            />
          </div>

          <div className="mt-2 space-y-0.5">
            <p className="font-extrabold text-xs text-slate-900">
              {activeVariant === 'ASY' ? 'Asy' : 'Syifa'} Al-Hafidz
            </p>
            <p className="text-[11px] text-emerald-800 font-medium">
              {characterState === 'thinking' ? 'Sedang mengecek database...' : 'Siap membantu kegiatan sekolah'}
            </p>
          </div>

          {/* Mood Action Button */}
          <button
            onClick={() => {
              setCharacterState('celebrate');
              speakText(`Semangat belajar dan mengajar hari ini di TK ASY SYIFA!`);
              setTimeout(() => setCharacterState('happy'), 2000);
            }}
            className="mt-3 px-3 py-1 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer border border-amber-300"
          >
            <Heart className="w-3 h-3 text-rose-600 fill-rose-500" />
            <span>Beri Semangat</span>
          </button>
        </div>

        {/* Conversation & Interactive Search Box (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-3">
          {/* Messages Scroll Area */}
          <div className="h-48 overflow-y-auto pr-1.5 space-y-2.5 text-xs">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'asy' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                    {activeVariant === 'ASY' ? 'A' : 'S'}
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-xs shadow-2xs font-medium'
                      : 'bg-white text-slate-900 rounded-tl-xs border border-emerald-200/90 shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Sources Grounding Tag */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-emerald-100 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-600" /> Sumber:
                      </span>
                      {m.sources.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200"
                        >
                          {s.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Navigation Button */}
                  {m.actionModule && m.actionLabel && (
                    <div className="mt-2.5 pt-1.5">
                      <button
                        onClick={() => onSelectModule(m.actionModule!)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-xl transition cursor-pointer"
                      >
                        <span>{m.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Thinking / Loading indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-stone-600 text-xs p-2.5 bg-white/80 rounded-2xl border border-emerald-200/60 max-w-[200px]"
              >
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="font-semibold text-emerald-800 text-[11px]">Mengecek data sekolah...</span>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Error & Retry Banner */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleRetry}
                className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ulangi</span>
              </button>
            </div>
          )}

          {/* Quick Query Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-500 mr-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-500" /> Tanya Cepat:
            </span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isThinking}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 border border-emerald-200/90 text-[11px] font-medium transition cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Tanya ${activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'} tentang data siswa, SPP, presensi, atau PPDB...`}
                disabled={isThinking}
                className="w-full pl-3.5 pr-4 py-2.5 rounded-2xl bg-white border border-emerald-300 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 shadow-2xs font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isThinking || !inputText.trim()}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              aria-label="Kirim Pertanyaan ke Asy"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};
