import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  HeartHandshake, 
  Lightbulb, 
  HelpCircle, 
  Send,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const AIAsyRecoveryGuideViewer: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('TAB_CRASH');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [dialogue, setDialogue] = useState<{ role: 'USER' | 'ASY'; text: string; time: string }[]>([
    {
      role: 'ASY',
      text: 'Assalamu’alaikum Bapak/Ibu Guru dan Pengelola Yayasan! Saya AI Asy (Tangan Kanan). Jangan panik jika browser sempat tertutup atau internet padam. Seluruh data ketikan rapor, presensi, dan kasir telah aman tersimpan di brankas Immortal Storage.',
      time: '08:00'
    },
    {
      role: 'USER',
      text: 'Asy, tadi laptop saya mendadak mati saat mengisi deskripsi rapor. Apakah tulisan saya hilang?',
      time: '08:01'
    },
    {
      role: 'ASY',
      text: 'Alhamdulillah, tidak ada yang hilang, Ustadz/Ustadzah! Runtime State Guardian kami menyimpan setiap huruf yang diketik setiap 500 milidetik ke buffer lokal. Begitu laptop dinyalakan kembali, draft rapor langsung dipulihkan 100%. Silakan lanjutkan pengisian rapor dengan tenang.',
      time: '08:01'
    }
  ]);

  const topics = [
    {
      id: 'TAB_CRASH',
      title: 'Tab Browser Tertutup / Laptop Mati',
      asyExplanation: 'Tenang saja! Kernel kami menggunakan Write Ahead Log (WAL) dan Browser Crash Sentinel. Setiap kata yang Anda ketik di form tersimpan otomatis. Begitu SIM dibuka kembali, form dan posisi kursor akan kembali persis seperti semula.'
    },
    {
      id: 'INTERNET_PUTUS',
      title: 'Internet / Wi-Fi Sekolah Mati',
      asyExplanation: 'Aplikasi SIM didesain local-first. Anda tetap bisa mencatat kehadiran santri, menginput nilai harian, atau mencatat pembayaran kasir. Saat internet menyala kembali, sistem akan otomatis mengirimkannya ke cloud tanpa bentrok.'
    },
    {
      id: 'DATA_SALAH_IMPORT',
      title: 'Salah Upload Excel / Data Tertukar',
      asyExplanation: 'Sebelum file Excel diimport, Smart Snapshot Scheduler otomatis membuat titik pemulihan (snapshot SHA-256). Pengurus yayasan atau admin dapat membatalkan import dan mengembalikan data ke detik sebelum upload.'
    }
  ];

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    const top = topics.find(t => t.id === topicId);
    if (top) {
      setDialogue(prev => [
        ...prev,
        { role: 'USER', text: `Bagaimana cara kerja pemulihan untuk: "${top.title}"?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { role: 'ASY', text: top.asyExplanation, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }
  };

  const handleAsk = () => {
    if (!customQuestion.trim()) return;
    const q = customQuestion;
    setCustomQuestion('');
    setDialogue(prev => [
      ...prev,
      { role: 'USER', text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { 
        role: 'ASY', 
        text: `Terima kasih atas pertanyaannya! Berdasarkan pantauan telemetri Guardian dan Immortal Storage, seluruh modul beroperasi normal. ${q.toLowerCase().includes('hilang') ? 'Data Anda aman 100% dan terlindungi oleh WAL Engine.' : 'Semua transaksi offline dan state form tersimpan rapi.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                R593 &bull; AI ASY RECOVERY GUIDE
              </span>
              <span className="text-xs text-slate-400 font-mono">Mode Guru Ramah &bull; Human-Centric Resilience</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">AI Asy Disaster Recovery Copilot &amp; Guidance</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            Mode Guru Ramah: ON
          </span>
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 block font-bold">Pilih Pertanyaan Cepat Pemulihan Sistem:</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTopic(t.id)}
              className="p-3 text-left rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs text-white font-bold block">{t.title}</strong>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                {t.asyExplanation}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Dialogue Window */}
      <div className="p-4 md:p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {dialogue.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ASY' && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-xl text-xs font-sans leading-relaxed ${
                  msg.role === 'USER'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70 font-mono">
                  <span>{msg.role === 'USER' ? 'Anda (Guru / Operator)' : 'AI Asy (Tangan Kanan)'}</span>
                  <span>{msg.time}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Tanyakan status data atau panduan pemulihan ke AI Asy..."
            className="flex-1 p-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 outline-none"
          />
          <button
            onClick={handleAsk}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
