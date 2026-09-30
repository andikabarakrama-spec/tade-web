import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Users,
  BookOpen,
  Send,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Radio,
  FileText,
  Clock,
  Check,
  RotateCcw
} from 'lucide-react';

export const LivingTeacherWorld: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [activeVoiceMode, setActiveVoiceMode] = useState<'ATTENDANCE' | 'TAHFIDZ' | 'ANECDOTE'>('ATTENDANCE');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

  const sampleCommands = {
    ATTENDANCE: 'Catat presensi kelas TK-A: 14 anak hadir lengkap, Ananda Farhan izin sakit flu.',
    TAHFIDZ: 'Catat Tahfidz Ananda Rayyan: Surah An-Naba ayat 1-10 lancar, makhraj fasih, nilai Mumtaz.',
    ANECDOTE: 'Catat Anekdot Sentra Balok: Ananda Aisyah membantu temannya membereskan balok dengan ikhlas.'
  };

  const handleStartVoice = (mode: 'ATTENDANCE' | 'TAHFIDZ' | 'ANECDOTE') => {
    setActiveVoiceMode(mode);
    setIsRecording(true);
    setTranscribedText('Mendengarkan suara Ustadzah...');

    setTimeout(() => {
      setTranscribedText(sampleCommands[mode]);
      setIsRecording(false);
      if (mode === 'ATTENDANCE') {
        setAiSuggestion('AI Asy mendeteksi: 14 Hadir, 1 Izin Sakit. Data siap disimpan ke R6 Presensi Siswa.');
      } else if (mode === 'TAHFIDZ') {
        setAiSuggestion('AI Asy mendeteksi: Hafalan Surah An-Naba tercatat. +1 Bintang Kebaikan dikirim ke Orang Tua.');
      } else {
        setAiSuggestion('AI Asy mendeteksi: Catatan Anekdot tervalidasi. Siap masuk E-Rapor Semester 1.');
      }
    }, 2000);
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Command Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  LIVING TEACHER WORLD
                </span>
                <span className="text-xs text-slate-400">Pusat Efisiensi Guru Kelas & Sentra</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Voice Assistant & Ruang Kerja Guru Cerdas
              </h1>
              <p className="text-sm text-teal-100/80 mt-0.5">
                Input presensi, setoran tahfidz, dan catatan anekdot harian secepat berbicara dengan bantuan AI Asy.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-teal-500/30 rounded-xl p-3 text-xs flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Voice Recognition Bahasa Indonesia Aktif</span>
          </div>
        </div>
      </div>

      {/* Grid: 3 Quick Voice Stations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Voice Attendance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              1. Voice Presensi Siswa
            </span>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
              Super Cepat
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Ucapkan kehadiran siswa satu kelas sekaligus tanpa klik manual satu per satu.
          </p>
          <button
            onClick={() => handleStartVoice('ATTENDANCE')}
            disabled={isRecording}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition"
          >
            <Mic className={`w-4 h-4 ${isRecording && activeVoiceMode === 'ATTENDANCE' ? 'animate-bounce text-amber-300' : ''}`} />
            {isRecording && activeVoiceMode === 'ATTENDANCE' ? 'Sedang Merekam...' : 'Ucapkan Presensi Kelas'}
          </button>
        </div>

        {/* 2. Voice Tahfidz */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              2. Voice Setoran Tahfidz
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Juz 30
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Catat ayat, nama ananda, dan kelancaran tajwid langsung tersinkron ke Buku Penghubung.
          </p>
          <button
            onClick={() => handleStartVoice('TAHFIDZ')}
            disabled={isRecording}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition"
          >
            <Mic className={`w-4 h-4 ${isRecording && activeVoiceMode === 'TAHFIDZ' ? 'animate-bounce text-amber-300' : ''}`} />
            {isRecording && activeVoiceMode === 'TAHFIDZ' ? 'Sedang Merekam...' : 'Ucapkan Setoran Hafalan'}
          </button>
        </div>

        {/* 3. Voice Anecdote */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              3. Voice Catatan Anekdot
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              E-Rapor
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Rekam perilaku terpuji atau kejadian unik siswa di sentra tanpa mengetik panjang.
          </p>
          <button
            onClick={() => handleStartVoice('ANECDOTE')}
            disabled={isRecording}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition"
          >
            <Mic className={`w-4 h-4 ${isRecording && activeVoiceMode === 'ANECDOTE' ? 'animate-bounce text-amber-300' : ''}`} />
            {isRecording && activeVoiceMode === 'ANECDOTE' ? 'Sedang Merekam...' : 'Ucapkan Catatan Anekdot'}
          </button>
        </div>
      </div>

      {/* Live Voice Transcription & AI Dispatch Box */}
      {transcribedText && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hasil Transkripsi & Validasi AI Asy
              </h3>
            </div>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Akurasi Suara 99.4%
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-mono">
            "{transcribedText}"
          </div>

          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 rounded-lg flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>{aiSuggestion}</span>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setTranscribedText('')}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold hover:bg-slate-100"
            >
              Reset
            </button>
            <button
              onClick={() => {
                alert('Data berhasil disimpan ke sistem dan otomatis tersinkron!');
                setTranscribedText('');
              }}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              Simpan & Sinkronisasi
            </button>
          </div>
        </div>
      )}

      {/* Quick Broadcast Station */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Quick Broadcast ke Seluruh Orang Tua Kelas TK-A
            </h3>
            <p className="text-xs text-slate-500">Kirim pengumuman sentra harian atau pengingat membawa perlengkapan</p>
          </div>

          <button
            onClick={handleBroadcast}
            disabled={broadcastSent}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition"
          >
            {broadcastSent ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
            {broadcastSent ? 'Terkirim ke 15 Wali Murid!' : 'Kirim Siaran 1-Klik'}
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
          "Assalamu'alaikum Ayah/Bunda TK-A. Besok ada kegiatan Sentra Eksplorasi Sains. Ananda diharapkan membawa 1 buah botol plastik bekas bersih untuk praktek filter air alami. Terima kasih! 🙏"
        </div>
      </div>
    </div>
  );
};
