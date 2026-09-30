import React, { useState, useEffect } from 'react';
import {
  Bot,
  Search,
  BookOpen,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Send,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  Tag
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASY';
  text: string;
  sources?: { title: string; category?: string }[];
  actionModule?: string;
  actionLabel?: string;
}

interface KnowledgeCard {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const AIAsyKnowledgeAssistant: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [activeVariant, setActiveVariant] = useState<'ASY' | 'SYIFA'>('ASY');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingList, setIsSearchingList] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ASY',
      text: 'Assalamu’alaikum Warahmatullahi Wabarakatuh! Saya Asisten Pengetahuan TK Islam Asy-Syifatan. Silakan tanyakan SOP sekolah, ketentuan pembayaran SPP, panduan kurikulum PAUD, jadwal kegiatan, atau data resmi sekolah.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // Canonical base knowledge items for TK Islam Asy-Syifatan
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeCard[]>([
    {
      id: 'KB-01',
      category: 'FAQ',
      question: 'Bagaimana tata cara pembayaran SPP bulanan siswa?',
      answer: 'Wali murid dapat melakukan transfer melalui rekening resmi atau pembayaran tunai di kasir tata usaha sekolah. Setiap pembayaran yang terverifikasi akan langsung menerbitkan kwitansi digital bertanda tangan QR resmi di Modul Pembayaran & Kwitansi.'
    },
    {
      id: 'KB-02',
      category: 'SOP',
      question: 'SOP Penanganan Siswa Sakit saat Jam Belajar Sentra',
      answer: '1. Guru kelas segera mendampingi ananda ke ruang UKS. 2. Hubungi petugas medis sekolah untuk pemeriksaan suhu dan pertolongan pertama. 3. Catat status di SIM agar wali murid menerima notifikasi real-time. 4. Apabila suhu tubuh >38°C, petugas mengonfirmasi penjemputan oleh wali murid.'
    },
    {
      id: 'KB-03',
      category: 'GURU',
      question: 'Panduan Penilaian Capaian Belajar PAUD / TK Kurikulum Merdeka',
      answer: 'Penilaian harian dilakukan secara berkala melalui observasi, catatan anekdot, dan hasil karya. Kategori capaian mengacu pada: Belum Berkembang (BB), Mulai Berkembang (MB), Berkembang Sesuai Harapan (BSH), dan Berkembang Sangat Baik (BSB).'
    },
    {
      id: 'KB-04',
      category: 'ADMIN',
      question: 'Prosedur Verifikasi Dokumen Calon Siswa Baru (PPDB)',
      answer: 'Petugas panitia PPDB memeriksa kelengkapan berkas (Akta Kelahiran, Kartu Keluarga, KTP Orang Tua) melalui Modul PPDB. Sistem secara otomatis menerapkan validasi 1 Calon Siswa = 1 Berkas untuk mencegah duplikasi.'
    },
    {
      id: 'KB-05',
      category: 'SOP',
      question: 'SOP Penjemputan Santri & Keamanan Gerbang',
      answer: 'Penjemputan dimulai pukul 11:30 WIB. Wali murid atau pengantar wajib menunjukkan Kartu Penjemputan resmi atau identitas yang telah terdaftar pada pihak sekolah demi keamanan dan keselamatan ananda.'
    }
  ]);

  // Load knowledge documents from DataService on mount
  useEffect(() => {
    const loadRealKnowledge = async () => {
      try {
        const role = (userProfile?.role || activeRole || 'GURU') as UserRole;
        const realDocs = await DataService.searchKnowledge('', role, userProfile?.uid);
        if (realDocs && realDocs.length > 0) {
          const adapted: KnowledgeCard[] = realDocs.map((doc, idx) => ({
            id: `DOC-${idx + 1}`,
            category: doc.category || 'DOKUMEN',
            question: doc.title,
            answer: doc.description || 'Dokumen resmi terdaftar dalam pangkalan arsip digital TK Islam Asy-Syifatan.'
          }));
          setKnowledgeBase(prev => [...adapted, ...prev]);
        }
      } catch (err) {
        console.warn('Load real knowledge warning:', err);
      }
    };
    loadRealKnowledge();
  }, [userProfile?.uid, activeRole]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputQuery.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: query
    };
    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const role = (userProfile?.role || activeRole || 'GURU') as UserRole;
      const lower = query.toLowerCase();

      // Check if this is an Admin/Governance operational query
      if (
        lower.includes('backup') ||
        lower.includes('cadangan') ||
        lower.includes('arsip') ||
        lower.includes('ganda') ||
        lower.includes('duplikat') ||
        lower.includes('ppdb')
      ) {
        const adminAns = await DataService.answerAdminAssistantQuery(query);
        if (adminAns && adminAns.answer) {
          const asyMsg: ChatMessage = {
            id: `asy-${Date.now()}`,
            sender: 'ASY',
            text: adminAns.answer,
            sources: [{ title: `Status Sistem: ${adminAns.category}`, category: adminAns.statusBadge }],
            actionLabel: adminAns.actionableSteps?.[0]
          };
          setChatMessages(prev => [...prev, asyMsg]);
          setIsLoading(false);
          return;
        }
      }

      // Check real metrics directly
      if (lower.includes('siswa') || lower.includes('murid')) {
        const students = await DataService.getStudents();
        const asyMsg: ChatMessage = {
          id: `asy-${Date.now()}`,
          sender: 'ASY',
          text: `Berdasarkan database induk sekolah, saat ini terdaftar ${students.length} siswa aktif di TK Islam Asy-Syifatan. Semua data terverifikasi dan tersimpan dengan enkripsi keamanan.`,
          sources: [{ title: 'Pangkalan Data Siswa (R3)', category: 'MASTER_DATA' }],
          actionModule: 'r3',
          actionLabel: 'Buka Data Siswa (R3)'
        };
        setChatMessages(prev => [...prev, asyMsg]);
        setIsLoading(false);
        return;
      }

      if (lower.includes('guru') || lower.includes('pendidik') || lower.includes('ustadz')) {
        const teachers = await DataService.getTeachers();
        const asyMsg: ChatMessage = {
          id: `asy-${Date.now()}`,
          sender: 'ASY',
          text: `Tercatat ${teachers.length} guru dan tenaga kependidikan aktif di TK Islam Asy-Syifatan yang bertugas pada rombel Kelompok A, Kelompok B, dan sentra kegiatan.`,
          sources: [{ title: 'Direktori Pendidik (R4)', category: 'PTK' }],
          actionModule: 'r4',
          actionLabel: 'Buka Direktori Guru (R4)'
        };
        setChatMessages(prev => [...prev, asyMsg]);
        setIsLoading(false);
        return;
      }

      // Query Knowledge Context Engine
      const summary = await DataService.buildKnowledgeSummary(query, role, userProfile?.uid);
      if (summary && summary.summaryText) {
        const asyMsg: ChatMessage = {
          id: `asy-${Date.now()}`,
          sender: 'ASY',
          text: summary.summaryText,
          sources: summary.sources?.slice(0, 3).map(s => ({ title: s.title, category: s.category })),
          actionLabel: summary.sources?.length ? 'Buka Pangkalan Arsip' : undefined
        };
        setChatMessages(prev => [...prev, asyMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: `asy-${Date.now()}`,
          sender: 'ASY',
          text: `Afwan (maaf), informasi spesifik mengenai "${query}" belum ditemukan di arsip dokumen aktif TK Islam Asy-Syifatan. Silakan tanyakan topik lain seperti pembayaran SPP, profil sekolah, panduan kurikulum, atau penjemputan.`
        };
        setChatMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.error('Knowledge assistant query error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ASY',
        text: 'Terjadi kendala saat membaca pangkalan data sekolah. Silakan ulangi pertanyaan Anda.'
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredKnowledge = knowledgeBase.filter(
    k =>
      (selectedTopic === 'ALL' || k.category === selectedTopic) &&
      (k.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 text-violet-700 rounded-2xl border border-violet-100 font-extrabold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Pusat Pengetahuan & Asisten {activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 text-[11px] font-extrabold flex items-center gap-1 border border-violet-200">
                <Sparkles className="w-3 h-3 text-violet-600" />
                Data Terverifikasi
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Pencarian SOP resmi, panduan kurikulum TK Islam Asy-Syifatan, FAQ orang tua, dan tata kelola madrasah berbasis data nyata.
            </p>
          </div>
        </div>

        {/* Mascot Gender Variant Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveVariant('ASY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'ASY' ? 'bg-white text-violet-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👦 Dek Asy
            </button>
            <button
              onClick={() => setActiveVariant('SYIFA')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'SYIFA' ? 'bg-white text-violet-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👧 Dek Syifa
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Knowledge Base List & Interactive Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Searchable SOP & Knowledge Cards */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-600" />
              Katalog Prosedur & Panduan Resmi
            </h2>
            <span className="text-xs text-stone-500 font-mono font-semibold">{filteredKnowledge.length} Entri</span>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'FAQ', label: 'FAQ Umum' },
              { id: 'SOP', label: 'SOP Sekolah' },
              { id: 'GURU', label: 'Panduan Guru' },
              { id: 'ADMIN', label: 'Panduan Admin' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedTopic(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedTopic === cat.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari SOP, pedoman kurikulum, atau aturan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredKnowledge.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-stone-50/70 hover:bg-stone-50 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 text-violet-900 border border-violet-200">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">{item.id}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">{item.question}</h3>
                <p className="text-stone-700 leading-relaxed text-xs">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Data-Grounded Chat Dialog */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-extrabold text-slate-900">
                  Tanya Jawab {activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Koneksi Database Riil
              </span>
            </div>

            {/* Chat message list */}
            <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 text-xs ${
                    msg.sender === 'USER' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ASY' && (
                    <div className="w-7 h-7 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 font-extrabold">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'USER'
                        ? 'bg-violet-600 text-white rounded-tr-none'
                        : 'bg-stone-50 text-slate-900 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                        {msg.sources.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100/80 text-violet-900"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {s.title}
                          </span>
                        ))}
                      </div>
                    )}
                    {msg.actionLabel && (
                      <div className="mt-2">
                        <span className="text-[11px] font-extrabold text-violet-700 flex items-center gap-1">
                          👉 {msg.actionLabel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 text-xs justify-start">
                  <div className="w-7 h-7 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 bg-stone-50 text-stone-600 rounded-2xl border border-slate-200 text-xs italic">
                    {activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'} sedang memeriksa database sekolah...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {[
              'Berapa jumlah siswa aktif?',
              'Berapa jumlah guru saat ini?',
              'Bagaimana SOP penanganan siswa sakit?',
              'Ketentuan pembayaran SPP'
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputQuery(q);
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-slate-900 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder={`Tanyakan pada ${activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'}...`}
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-all flex items-center justify-center shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
