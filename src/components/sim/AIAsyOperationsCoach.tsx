import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Shield,
  Lightbulb,
  Clock,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface GuidedTopic {
  id: string;
  roleTarget: string;
  title: string;
  question: string;
  solutionSteps: string[];
  tips: string;
}

export const AIAsyOperationsCoach: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('GURU');
  const [activeVariant, setActiveVariant] = useState<'ASY' | 'SYIFA'>('ASY');
  const [activeTopic, setActiveTopic] = useState<GuidedTopic | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'USER' | 'COACH'; text: string; steps?: string[] }>>([
    {
      sender: 'COACH',
      text: 'Assalamu’alaikum Warahmatullahi Wabarakatuh! Saya Dek Asy, pendamping operasional harian Anda di TK Islam Asy-Syifatan. Silakan tanyakan panduan modul atau alur kerja harian yang ingin dipelajari langkah demi langkah.'
    }
  ]);

  const guidedTopics: GuidedTopic[] = [
    {
      id: 'tp-1',
      roleTarget: 'GURU',
      title: 'Cara Mengisi Presensi & Capaian Harian Siswa',
      question: 'Bagaimana langkah mencatat kehadiran siswa dan hafalan doa agar orang tua menerima info realtime?',
      solutionSteps: [
        '1. Buka modul "Presensi Siswa" (R6) di sidebar SIM.',
        '2. Pilih rombel kelas (Kelompok A, Kelompok B, atau TPA) dan tanggal hari ini.',
        '3. Tandai status: Hadir, Sakit, Izin, atau Alpa.',
        '4. Klik "Simpan Presensi". Data otomatis tersinkron ke ringkasan sekolah dan buku penghubung wali murid.'
      ],
      tips: 'Lakukan absensi di awal jam sentra (pukul 07:30 - 08:00 WIB) agar rekap presensi harian langsung terisi.'
    },
    {
      id: 'tp-2',
      roleTarget: 'KEUANGAN',
      title: 'Rekonsiliasi Pembayaran SPP & Verifikasi Kwitansi',
      question: 'Bagaimana cara memastikan tagihan SPP dan bukti bayar terverifikasi sah?',
      solutionSteps: [
        '1. Buka modul "Pembayaran & Kwitansi" (R11) atau "Tagihan SPP" (R10).',
        '2. Periksa daftar pembayaran yang masuk dengan bukti transfer atau setor tunai.',
        '3. Klik tombol "Verifikasi & Terbitkan Kwitansi".',
        '4. Sistem otomatis membuat nomor kwitansi sah dengan QR code autentikasi digital.'
      ],
      tips: 'Setiap kwitansi yang diterbitkan otomatis tercatat di Laporan Keuangan (R12).'
    },
    {
      id: 'tp-3',
      roleTarget: 'KEPALA_SEKOLAH',
      title: 'Otorisasi Pendaftaran Siswa Baru (PPDB)',
      question: 'Di mana melihat berkas pendaftar baru yang memerlukan persetujuan kepala sekolah?',
      solutionSteps: [
        '1. Buka modul "Verifikasi PPDB" (R13) atau widget PPDB di Dashboard SIM.',
        '2. Tinjau kelengkapan berkas fisik dan identitas calon santri.',
        '3. Ubah status berkas menjadi "APPROVED" untuk menerbitkan surat penerimaan resmi.',
        '4. Data yang disetujui dapat langsung ditransisikan ke Data Siswa Induk (R3).'
      ],
      tips: 'Gunakan filter status PENDING untuk melihat berkas pendaftaran yang belum diproses.'
    }
  ];

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = customQuestion.trim();
    if (!query || isThinking) return;

    setChatHistory(prev => [...prev, { sender: 'USER', text: query }]);
    setCustomQuestion('');
    setIsThinking(true);

    try {
      const lower = query.toLowerCase();
      let replyText = '';
      let steps: string[] = [];

      // Check real admin assistant query if relevant
      if (
        lower.includes('backup') ||
        lower.includes('arsip') ||
        lower.includes('ppdb') ||
        lower.includes('spp') ||
        lower.includes('ganda')
      ) {
        const adminAns = await DataService.answerAdminAssistantQuery(query);
        if (adminAns && adminAns.answer) {
          replyText = adminAns.answer;
          steps = adminAns.actionableSteps || [];
        }
      }

      if (!replyText) {
        // Query knowledge summary
        const role = selectedRole as UserRole;
        const summary = await DataService.buildKnowledgeSummary(query, role, userProfile?.uid);

        if (summary && summary.summaryText) {
          replyText = summary.summaryText;
          steps = [
            '1. Akses menu terkait melalui navigasi samping SIM.',
            '2. Lakukan input data sesuai petunjuk formulir.',
            '3. Klik "Simpan" untuk memastikan data tersimpan permanen di database.',
            '4. Periksa kembali riwayat perubahan pada Audit Log jika diperlukan.'
          ];
        } else {
          replyText = `Panduan untuk "${query}":`;
          steps = [
            '1. Pastikan Anda telah login dengan peranan yang sesuai (' + selectedRole + ').',
            '2. Cari modul terkait di navigasi samping atau gunakan bilah pencarian cepat.',
            '3. Masukkan data yang diperlukan dan periksa kelengkapannya.',
            '4. Hubungi administrator madrasah jika memerlukan kewenangan akses tambahan.'
          ];
        }
      }

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'COACH',
          text: replyText,
          steps: steps.length > 0 ? steps : undefined
        }
      ]);
    } catch (err) {
      console.error('Operations coach error:', err);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'COACH',
          text: 'Terjadi kendala saat membaca pangkalan data panduan sekolah. Silakan ulangi pertanyaan Anda.'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">AI Asy Operations Coach</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Bahasa Alami & Bebas Jargon
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pendamping pintar guru dan staf sekolah untuk memandu alur kerja harian langkah demi langkah dengan penjelasan yang ramah dan mudah dipahami.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Persona Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveVariant('ASY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'ASY' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👦 Dek Asy
            </button>
            <button
              onClick={() => setActiveVariant('SYIFA')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'SYIFA' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👧 Dek Syifa
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Peran:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="GURU">Guru & Wali Kelas</option>
              <option value="KEUANGAN">Bendahara / TU</option>
              <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
              <option value="KETUA_YAYASAN">Pengurus Yayasan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Fast Guides */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800">Panduan Populer Sesuai Peran Anda</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guidedTopics.map(topic => (
            <div
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/50 hover:border-emerald-200 cursor-pointer transition space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  {topic.roleTarget}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800">{topic.title}</h3>
              <p className="text-slate-500 text-[11px] line-clamp-2">{topic.question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Modal/Drawer or Detail */}
      {activeTopic && (
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Panduan Langkah Demi Langkah</span>
              <h3 className="text-base font-bold text-white">{activeTopic.title}</h3>
            </div>
            <button
              onClick={() => setActiveTopic(null)}
              className="px-3 py-1 rounded-lg bg-emerald-800 text-emerald-200 hover:text-white text-xs font-semibold"
            >
              Tutup
            </button>
          </div>

          <div className="space-y-2 text-xs bg-emerald-950/40 p-4 rounded-xl border border-emerald-700/50">
            {activeTopic.solutionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-emerald-300 bg-emerald-800/40 p-3 rounded-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span><strong>Tips Praktis:</strong> {activeTopic.tips}</span>
          </div>
        </div>
      )}

      {/* Interactive Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-600" />
          Tanya Panduan Lain ke AI Asy
        </h2>

        {/* Chat History */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs space-y-2 ${
                  msg.sender === 'USER'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                {msg.steps && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    {msg.steps.map((st, si) => (
                      <div key={si} className="text-[11px] text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="p-3 bg-stone-50 border border-slate-200 rounded-2xl text-xs text-stone-600 flex items-center gap-2 italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                {activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'} sedang menyusun panduan operasional...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleAskCoach} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder={`Tanyakan panduan kepada ${activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'} (contoh: cara verifikasi PPDB)...`}
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            disabled={isThinking}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isThinking || !customQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
