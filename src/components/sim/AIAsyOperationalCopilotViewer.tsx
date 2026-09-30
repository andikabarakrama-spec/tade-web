import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Lightbulb, 
  BookOpen, 
  ArrowRight, 
  MessageSquare, 
  UserCheck,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface AdviceCard {
  id: string;
  topic: string;
  technicalError: string;
  humanExplanation: string;
  priorityAction: string;
  guruRamahAdvice: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export const AIAsyOperationalCopilotViewer: React.FC = () => {
  const [guruRamahMode, setGuruRamahMode] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('PPDB_SYNC');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'USER' | 'AI_ASY'; text: string; time: string }>>([
    {
      sender: 'AI_ASY',
      text: 'Assalamu’alaikum Warahmatullahi Wabarakatuh. Saya AI Asy, pendamping operasional sistem TADE Anda. Semua modul terpantau aman dan terkendali. Ada yang bisa saya bantu jelaskan dengan bahasa yang santai dan mudah dipahami?',
      time: '08:00'
    }
  ]);

  const knowledgeBase: Record<string, AdviceCard> = {
    PPDB_SYNC: {
      id: 'PPDB_SYNC',
      topic: 'Sinkronisasi Berkas PPDB',
      technicalError: 'PPDB_WAL_BUFFER_DIRTY: 4 uncommitted batch writes on index mutation.',
      humanExplanation: 'Ada 4 formulir calon siswa baru yang baru saja diinput oleh wali murid dan sedang dalam proses antrean simpan otomatis agar datanya tidak hilang.',
      priorityAction: 'Biarkan sistem menyelesaikan antrean otomatis selama 3 detik. Operator tidak perlu input ulang formulir.',
      guruRamahAdvice: 'Tenang ya Bapak/Ibu Guru, data pendaftaran ananda calon siswa sudah tersimpan aman di memori cadangan. Sambil menunggu, silakan periksa kelengkapan pas foto berkas yang lain.',
      severity: 'INFO'
    },
    PERMISSION_ALERT: {
      id: 'PERMISSION_ALERT',
      topic: 'Upaya Akses Menu Keuangan',
      technicalError: 'SELINUX_MAC_VIOLATION: Role GURU attempted write access on /kernel/keuangan/ledger.',
      humanExplanation: 'Seorang akun dengan hak akses Guru mencoba membuka menu laporan kas besar yayasan yang khusus diperuntukkan bagi Bendahara dan Ketua Yayasan.',
      priorityAction: 'Akses otomatis dicegah oleh Guardian Security. Pastikan akun guru bersangkutan tidak meminjamkan password kepada pihak lain.',
      guruRamahAdvice: 'Sistem pengawal kami sudah menjaga brankas keuangan agar tetap tertib dan sesuai amanah. Jika Bapak/Ibu Guru membutuhkan data operasional kelas, silakan buka menu BOS & Kas Kelas saja ya.',
      severity: 'WARNING'
    },
    MEMORY_PRESSURE: {
      id: 'MEMORY_PRESSURE',
      topic: 'Lonjakan Penggunaan Memori Browser',
      technicalError: 'BROWSER_HEAP_THRESHOLD_EXCEEDED: Heap allocated 142MB > budget 120MB.',
      humanExplanation: 'Banyak halaman atau tab data rapor siswa yang sedang dibuka bersamaan di komputer operator, sehingga browser terasa sedikit berat.',
      priorityAction: 'AI Asy secara otomatis mengosongkan riwayat tampilan lama (cache) agar aplikasi kembali ringan dan lancar.',
      guruRamahAdvice: 'Alhamdulillah sistem baru saja merapikan meja kerja digital kita. Aplikasi sekarang sudah ringan kembali tanpa perlu me-refresh halaman atau khawatir data hilang.',
      severity: 'INFO'
    },
    WATCHDOG_HEALING: {
      id: 'WATCHDOG_HEALING',
      topic: 'Pemulihan Layanan CCTV Kampus',
      technicalError: 'WATCHDOG_TIMEOUT: CCTV stream socket latency exceeded 4500ms.',
      humanExplanation: 'Koneksi jaringan ke kamera CCTV lapangan sempat terputus sebentar karena gangguan kabel/sinyal WiFi.',
      priorityAction: 'Kernel secara otomatis menyambungkan ulang aliran video kamera tanpa mengganggu modul absensi atau rapor.',
      guruRamahAdvice: 'Kamera pengawas sudah tersambung kembali secara otomatis. Seluruh pantauan lingkungan sekolah aman dan tertib.',
      severity: 'INFO'
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const userText = customQuestion;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatHistory(prev => [...prev, { sender: 'USER', text: userText, time: timeStr }]);
    setCustomQuestion('');

    setTimeout(() => {
      let reply = '';
      if (guruRamahMode) {
        reply = `Terima kasih atas pertanyaannya. Terkait hal tersebut, sistem TADE sudah memiliki perlindungan mandiri dan pemulihan otomatis 24/7. Anda tidak perlu khawatir karena seluruh data sekolah terlindungi dengan enkripsi berlapis. Langkah terbaik selanjutnya adalah melanjutkan verifikasi data siswa seperti biasa ya! 😊`;
      } else {
        reply = `Status Operasional: Stabil. Telemetri mengonfirmasi bahwa seluruh pilar isolasi berjalan sesuai SOP. Tindakan mitigasi mandiri siap dieksekusi dalam latensi < 5ms tanpa interupsi operasional.`;
      }

      setChatHistory(prev => [...prev, { sender: 'AI_ASY', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  const activeCard = knowledgeBase[selectedTopic] || knowledgeBase.PPDB_SYNC;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                R577 &bull; AI ASY COPILOT
              </span>
              <span className="text-xs text-slate-400 font-mono">Right-Hand Dual Cognition &bull; Operational Companion</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">AI Asy Operational Copilot &amp; Guru Ramah</h2>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuruRamahMode(!guruRamahMode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition ${
              guruRamahMode
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {guruRamahMode ? 'MODE GURU RAMAH (AKTIF)' : 'MODE TEKNIS FORMAL'}
          </button>
        </div>
      </div>

      {/* Grid: Topics Translation & Interactive Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Situational Diagnosis in Plain Language */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Pilih Contoh Status / Insiden Operasional:
            </span>
          </div>

          {/* Quick Select Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
            {Object.values(knowledgeBase).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTopic(item.id)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedTopic === item.id
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="block text-[10px] text-slate-400 font-bold uppercase">{item.severity}</span>
                <span className="font-bold text-xs truncate block">{item.topic}</span>
              </button>
            ))}
          </div>

          {/* Active Card Translation */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                  Topik: {activeCard.topic}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Diterjemahkan oleh AI Asy
              </span>
            </div>

            {/* Technical Error Box */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold">Log Teknis Kernel Asli:</span>
              <p className="text-slate-400 text-[11px]">{activeCard.technicalError}</p>
            </div>

            {/* Plain Indonesian Human Explanation */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Penjelasan Bahasa Manusia (Mudah Dimengerti):
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {activeCard.humanExplanation}
              </p>
            </div>

            {/* Mode Guru Ramah or Priority Action */}
            {guruRamahMode ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Pesan Pendampingan Guru Ramah:
                </span>
                <p className="text-sm text-emerald-100 leading-relaxed font-sans italic">
                  "{activeCard.guruRamahAdvice}"
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/60 space-y-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Langkah Tindakan Prioritas Operator:
                </span>
                <p className="text-sm text-indigo-100 leading-relaxed font-sans">
                  {activeCard.priorityAction}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Interactive Operational Q&A */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-mono border-b border-slate-700 pb-3">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Tanya AI Asy Langsung
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl space-y-1 ${
                    chat.sender === 'AI_ASY'
                      ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-100 mr-4'
                      : 'bg-slate-700/60 border border-slate-600 text-slate-200 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-75">
                    <span>{chat.sender === 'AI_ASY' ? 'AI Asy (Pendamping)' : 'Operator Sekolah'}</span>
                    <span>{chat.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-sans">{chat.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAskQuestion} className="space-y-2 pt-2 border-t border-slate-700">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ketik pertanyaan atau kendala..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Bot className="w-3.5 h-3.5" />
              Kirim ke AI Asy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
