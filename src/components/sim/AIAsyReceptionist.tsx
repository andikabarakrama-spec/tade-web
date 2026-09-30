import React, { useState } from 'react';
import {
  Bot,
  Tv,
  Users,
  Mic,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  HelpCircle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Check,
  Play
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

interface VisitorQueueItem {
  id: string;
  queueNo: string;
  name: string;
  purpose: string;
  destination: string;
  timeIn: string;
  status: 'WAITING' | 'SERVING' | 'COMPLETED';
}

export const AIAsyReceptionist: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [visitorName, setVisitorName] = useState('');
  const [purpose, setPurpose] = useState('Pendaftaran Siswa Baru (PPDB)');
  const [destination, setDestination] = useState('Ruang Tata Usaha (Admin)');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePersona, setActivePersona] = useState<'SYIFA' | 'ASY'>('SYIFA');
  const [currentAnnouncement, setCurrentAnnouncement] = useState(
    'Selamat Datang di TK ASY SYIFA. Silakan ambil nomor antrean dan menuju ruang tunggu lobby.'
  );

  const [queues, setQueues] = useState<VisitorQueueItem[]>([
    { id: 'q-1', queueNo: 'A-01', name: 'Bunda Sarah (Wali Calon Siswa)', purpose: 'Konsultasi PPDB Sentra', destination: 'Ruang Kepala Sekolah', timeIn: '08:15 WIB', status: 'SERVING' },
    { id: 'q-2', queueNo: 'A-02', name: 'Bapak Hendra (Pengawas Dinas)', purpose: 'Visitasi Akreditasi', destination: 'Ruang Yayasan R63', timeIn: '08:30 WIB', status: 'WAITING' },
    { id: 'q-3', queueNo: 'B-01', name: 'Ibu Ningsih (Wali Murid TK-B)', purpose: 'Pengambilan Rapor & Konsultasi', destination: 'Ruang Guru Sentra', timeIn: '08:45 WIB', status: 'WAITING' }
  ]);

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const nextNum = `A-0${queues.length + 1}`;
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newItem: VisitorQueueItem = {
      id: `q-${Date.now()}`,
      queueNo: nextNum,
      name: visitorName.trim(),
      purpose,
      destination,
      timeIn: timeNow,
      status: 'WAITING'
    };

    setQueues(prev => [...prev, newItem]);
    const announceMsg = `Nomor antrean ${nextNum}, Bapak Ibu ${visitorName.trim()}, dipersilakan menuju ${destination}.`;
    setCurrentAnnouncement(announceMsg);
    setVisitorName('');

    try {
      await DataService.logAction(
        userProfile?.nama || userProfile?.name || 'Front Desk Lobby',
        activeRole || 'STAF',
        'LOBBY_VISITOR_REGISTERED',
        `Registrasi Tamu: ${newItem.name} (${nextNum}) - Tujuan: ${destination} (${purpose})`
      );
    } catch (err) {
      console.warn('Could not log visitor registration:', err);
    }

    handleSpeak(announceMsg);
  };

  const handleUpdateStatus = (id: string, newStatus: 'WAITING' | 'SERVING' | 'COMPLETED') => {
    setQueues(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  const handleSpeak = (textToSpeak?: string) => {
    const text = textToSpeak || currentAnnouncement;
    setIsSpeaking(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.92;
        utterance.pitch = activePersona === 'SYIFA' ? 1.15 : 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
    // Fallback if not supported
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  LOBBY AI RECEPTIONIST
                </span>
                <span className="text-xs text-slate-400">Integrated with School TV & Dek Syifa</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                AI Asy Lobby Receptionist & Queue Master
              </h1>
              <p className="text-sm text-purple-100/80 mt-0.5">
                Menyambut tamu sekolah, memandu ke ruangan tujuan secara ramah Islami, dan menyiarkan status antrean ke Layar TV Lobby.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Persona Switcher */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-purple-500/30">
              <button
                type="button"
                onClick={() => setActivePersona('SYIFA')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activePersona === 'SYIFA'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Dek Syifa
              </button>
              <button
                type="button"
                onClick={() => setActivePersona('ASY')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activePersona === 'ASY'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Dek Asy
              </button>
            </div>

            <button
              onClick={() => handleSpeak()}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition ${
                isSpeaking
                  ? 'bg-purple-500 text-slate-950 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isSpeaking ? 'Sedang Bersuara...' : `Suara Sambutan (${activePersona === 'SYIFA' ? 'Dek Syifa' : 'Dek Asy'})`}
            </button>
          </div>
        </div>

        {/* Live Audio & TV Status */}
        <div className="mt-5 p-3.5 bg-slate-950/70 border border-purple-500/20 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <Tv className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Siaran TV Lobby: <strong className="text-white">"{currentAnnouncement}"</strong></span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px]">
            TV SYNC 100%
          </span>
        </div>
      </div>

      {/* Grid: Registration Desk & Live Queue Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Receptionist Kiosk Input */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Registrasi Tamu / Kunjungan Baru</h3>
            </div>
            <p className="text-xs text-slate-500">
              Input data tamu di tablet front desk atau scan QR Pass Tamu
            </p>

            <form onSubmit={handleRegisterVisitor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Tamu
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Contoh: Bunda Farida / Bapak Irfan..."
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keperluan Kunjungan
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option>Pendaftaran Siswa Baru (PPDB)</option>
                  <option>Konsultasi Perkembangan Siswa</option>
                  <option>Kunjungan Dinas Pendidikan / Pengawas</option>
                  <option>Pembayaran Administrasi SPP / Sarpras</option>
                  <option>Tamu Khusus Yayasan / Kerjasama</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ruangan / Tujuan
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option>Ruang Tata Usaha (Admin)</option>
                  <option>Ruang Kepala Sekolah</option>
                  <option>Ruang Yayasan (Ketua Yayasan R63)</option>
                  <option>Ruang Guru & Sentra Belajar</option>
                  <option>Ruang Konsultasi Psikologi / BK</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition"
              >
                <QrCode className="w-4 h-4" />
                Terbitkan Nomor Antrean & Pass Tamu
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Cols: Live Queue Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Papan Antrean & Pelayanan Lobby Hari Ini</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {queues.length} Tamu Terdaftar
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {queues.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-sm shrink-0">
                      {item.queueNo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'SERVING' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse' :
                          item.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Keperluan: <strong>{item.purpose}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-500" />
                        <span>Tujuan: {item.destination}</span>
                        <span>•</span>
                        <span>Tiba: {item.timeIn}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                    <button
                      onClick={() => {
                        const msg = `Nomor antrean ${item.queueNo}, ${item.name}, silakan menuju ${item.destination}.`;
                        setCurrentAnnouncement(msg);
                        handleSpeak(msg);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                      Panggil
                    </button>

                    {item.status === 'WAITING' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'SERVING')}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition cursor-pointer"
                      >
                        Layani
                      </button>
                    )}

                    {item.status === 'SERVING' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'COMPLETED')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-emerald-700" /> Selesai
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
