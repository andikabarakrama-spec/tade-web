import React, { useState, useEffect } from 'react';
import {
  Bot,
  MessageCircle,
  HelpCircle,
  Calendar,
  CreditCard,
  Sparkles,
  Heart,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Coffee,
  RefreshCw,
  Users
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { Student, SPPBill, UserRole } from '../../types';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ChatMessage {
  id: string;
  sender: 'PARENT' | 'AI_ASY';
  text: string;
  timestamp: string;
}

export const AIAsyParentCompanion: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily_summary' | 'chat' | 'faq' | 'reminders'>('daily_summary');
  const [activeVariant, setActiveVariant] = useState<'ASY' | 'SYIFA'>('ASY');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentBills, setStudentBills] = useState<SPPBill[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: 'MSG-01',
      sender: 'AI_ASY',
      text: 'Assalamu’alaikum Ayah/Bunda! Saya pendamping cerdas TK Islam Asy-Syifatan. Ada yang bisa saya bantu terkait jadwal sekolah, status pembayaran SPP, atau capaian ananda hari ini?',
      timestamp: 'Baru saja'
    }
  ]);

  const faqs: FAQItem[] = [
    {
      id: 'FAQ-01',
      category: 'Jadwal & Penjemputan',
      question: 'Jam berapa batas waktu penjemputan santri TK A dan TK B?',
      answer: 'Pembelajaran selesai pukul 11:30 WIB. Penjemputan santri dilayani mulai pukul 11:30 hingga 12:15 WIB di Gate Penjemputan Resmi dengan verifikasi identitas wali murid.'
    },
    {
      id: 'FAQ-02',
      category: 'Seragam Sekolah',
      question: 'Apa ketentuan seragam santri pada hari Jumat?',
      answer: 'Hari Jumat santri mengenakan Seragam Muslim Koko/Gamis putih madrasah lengkap dengan peci/jilbab untuk kegiatan Praktik Sholat Dhuha dan Manasik Mandiri.'
    },
    {
      id: 'FAQ-03',
      category: 'Gizi & PMT',
      question: 'Bagaimana menu PMT (Pemberian Makanan Tambahan) sehat pekan ini?',
      answer: 'Menu PMT pekan ini: Senin (Bubur Kacang Hijau Organik), Rabu (Puding Buah Naga & Susu Kedelai), Jumat (Nasi Bento Sayur Pelangi & Telur Puyuh).'
    },
    {
      id: 'FAQ-04',
      category: 'Administrasi & SPP',
      question: 'Kapan batas waktu pembayaran SPP bulanan?',
      answer: 'Pembayaran SPP dianjurkan sebelum tanggal 10 setiap bulannya melalui rekening resmi madrasah atau loket tata usaha.'
    }
  ];

  // Fetch real students and real SPP bills
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoadingData(true);
      try {
        const students = await DataService.getStudents();
        setStudentsList(students);
        if (students.length > 0) {
          const currentStudent = students[0];
          setSelectedStudent(currentStudent);
          const bills = await DataService.getSPPBillsByStudent(currentStudent.id);
          setStudentBills(bills);
        }
      } catch (err) {
        console.error('Parent companion data fetch error:', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchRealData();
  }, []);

  const handleSelectStudent = async (st: Student) => {
    setSelectedStudent(st);
    try {
      const bills = await DataService.getSPPBillsByStudent(st.id);
      setStudentBills(bills);
    } catch (err) {
      console.error('Error fetching bills for student:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputQuestion.trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'PARENT',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setChatLog(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsSending(true);

    try {
      const q = query.toLowerCase();
      let replyText = '';

      if (q.includes('spp') || q.includes('bayar') || q.includes('tagihan')) {
        if (selectedStudent) {
          const unpaid = studentBills.filter(b => b.status !== 'Lunas');
          if (unpaid.length > 0) {
            const total = unpaid.reduce((sum, b) => sum + (b.sppAmount || b.amount || 0), 0);
            replyText = `Status tagihan untuk ananda ${selectedStudent.name || selectedStudent.nama}: Terdapat ${unpaid.length} tagihan berjalan dengan total Rp ${total.toLocaleString('id-ID')}. Pembayaran dapat dilakukan via transfer rekening resmi atau di loket kasir sekolah.`;
          } else {
            replyText = `Alhamdulillah! Seluruh tagihan SPP untuk ananda ${selectedStudent.name || selectedStudent.nama} sudah LUNAS untuk periode berjalan. Bukti kwitansi resmi tersimpan aman di sistem.`;
          }
        } else {
          replyText = 'Untuk pembayaran SPP dan administrasi, pembayaran dianjurkan sebelum tanggal 10 setiap bulannya melalui rekening madrasah atau loket tata usaha.';
        }
      } else if (q.includes('jemput') || q.includes('pulang') || q.includes('jam')) {
        replyText = 'Santri pulang pukul 11:30 WIB. Ustadzah piket sudah siap menyambut Ayah/Bunda di area lobi penjemputan resmi dengan verifikasi identitas wali murid.';
      } else if (q.includes('makan') || q.includes('pmt') || q.includes('snack')) {
        replyText = 'Menu PMT sehat hari ini adalah Bubur Kacang Hijau Organik dengan sari kurma. Semua santri makan dengan tertib dan diajarkan adab makan Islami!';
      } else {
        // Query Knowledge Context Engine for school procedures & FAQ
        const role = (userProfile?.role || activeRole || 'WALI_MURID') as UserRole;
        const summary = await DataService.buildKnowledgeSummary(query, role, userProfile?.uid);
        if (summary && summary.summaryText) {
          replyText = summary.summaryText;
        } else {
          replyText = `Alhamdulillah, terima kasih atas pertanyaan Ayah/Bunda mengenai "${query}". Informasi lebih lanjut dapat dikonfirmasikan langsung melalui ustadzah kelas atau tata usaha TK Islam Asy-Syifatan.`;
        }
      }

      const botMsg: ChatMessage = {
        id: `BOT-${Date.now()}`,
        sender: 'AI_ASY',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      setChatLog(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error answering parent query:', err);
      const botMsg: ChatMessage = {
        id: `BOT-${Date.now()}`,
        sender: 'AI_ASY',
        text: 'Afwan (maaf), sistem sedang memperbarui pangkalan data. Silakan ulangi pertanyaan Ayah/Bunda.',
        timestamp: 'Baru saja'
      };
      setChatLog(prev => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 font-extrabold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                AI Asy Parent Companion ({activeVariant === 'ASY' ? 'Dek Asy' : 'Dek Syifa'})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono">
                Wali Murid Co-Pilot
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pendamping cerdas ramah keluarga: ringkasan harian ananda, tanya jawab FAQ sekolah terkurasi, serta status SPP real-time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Persona Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveVariant('ASY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'ASY' ? 'bg-white text-purple-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👦 Dek Asy
            </button>
            <button
              onClick={() => setActiveVariant('SYIFA')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeVariant === 'SYIFA' ? 'bg-white text-purple-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              👧 Dek Syifa
            </button>
          </div>

          {/* Student Selector */}
          {studentsList.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 text-xs">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const st = studentsList.find(s => s.id === e.target.value);
                  if (st) handleSelectStudent(st);
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
              >
                {studentsList.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.nama} ({st.kelompok || 'Siswa'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['daily_summary', 'chat', 'faq', 'reminders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'daily_summary' && 'Ringkasan Ananda'}
            {tab === 'chat' && 'Tanya AI Asy'}
            {tab === 'faq' && 'FAQ Sekolah'}
            {tab === 'reminders' && 'Pengingat Aktif'}
          </button>
        ))}
      </div>

      {/* Tab: Daily Summary */}
      {activeTab === 'daily_summary' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-lg border border-white/30 uppercase">
                  {selectedStudent ? selectedStudent.nama.slice(0, 2) : 'AN'}
                </div>
                <div>
                  <h2 className="text-lg font-black">
                    {selectedStudent ? selectedStudent.nama : 'Memuat Data Siswa...'}
                  </h2>
                  <p className="text-purple-100 text-xs">
                    {selectedStudent?.kelompok || 'Kelompok TK A'} • NIS: {selectedStudent?.nis || selectedStudent?.nisn || '3171001'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold font-mono">
                Status: Aktif Terdaftar
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur border border-white/20 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-200">
                <Sparkles className="w-4 h-4" /> Catatan Perkembangan Harian
              </div>
              <p className="text-purple-50 leading-relaxed">
                Alhamdulillah, Ananda {selectedStudent?.name || selectedStudent?.nama || 'Fatih'} mengikuti kegiatan sentra dengan antusias dan tertib. Mampu bekerja sama dengan teman sebaya dan mengawali kegiatan belajar dengan membaca doa bersama.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
                <BookOpen className="w-4 h-4" /> Capaian Karakter & Tahfidz
              </div>
              <div className="text-base font-black text-slate-800">Doa Harian & Adab Makan</div>
              <p className="text-slate-500 text-[11px]">Capaian: Berkembang Sesuai Harapan (BSH)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <Coffee className="w-4 h-4" /> Asupan PMT & Snack Sehat
              </div>
              <div className="text-base font-black text-slate-800">Menu PMT Sehat Sekolah</div>
              <p className="text-slate-500 text-[11px]">Porsi makanan dihabiskan dengan tertib</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                <CreditCard className="w-4 h-4" /> Status Administrasi SPP
              </div>
              <div className="text-base font-black text-slate-800">
                {studentBills.some(b => b.status !== 'Lunas')
                  ? 'Ada Tagihan Berjalan'
                  : 'Lunas Periode Berjalan'}
              </div>
              <p className="text-slate-500 text-[11px]">
                {studentBills.some(b => b.status !== 'Lunas')
                  ? 'Silakan konfirmasi melalui loket sekolah'
                  : 'Kwitansi sah tersimpan di sistem'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Chat Asy AI */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">AI Asy - Smart Companion</div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Siap Menjawab
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
              Air-Gapped Privacy
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatLog.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[80%] ${
                  msg.sender === 'PARENT' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    msg.sender === 'PARENT'
                      ? 'bg-slate-800 text-white'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {msg.sender === 'PARENT' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'PARENT'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === 'PARENT' ? 'text-purple-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ketik pertanyaan terkait jadwal, seragam, atau SPP ananda..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Kirim
            </button>
          </form>
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            Tanya Jawab Terpopuler Seputar Sekolah & Kurikulum
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{faq.question}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                    {faq.category}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reminders */}
      {activeTab === 'reminders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <CreditCard className="w-4 h-4" /> Status Administrasi & SPP
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1 text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {studentBills.some(b => b.status !== 'Lunas')
                  ? `SPP ${selectedStudent?.name || selectedStudent?.nama || 'Siswa'}: Menunggu Pembayaran`
                  : `SPP ${selectedStudent?.name || selectedStudent?.nama || 'Siswa'}: Seluruh Tagihan LUNAS`}
              </div>
              <p className="text-emerald-700 text-[11px]">
                {studentBills.some(b => b.status !== 'Lunas')
                  ? 'Silakan selesaikan pembayaran sebelum tanggal 10 bulan berjalan.'
                  : 'Terima kasih atas kedisiplinan pembayaran SPP ananda.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
              <Calendar className="w-4 h-4" /> Pengingat Agenda Sekolah Terdekat
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 space-y-1 text-xs">
              <div className="font-bold text-purple-900">Parenting & Kajian Bulanan: 22 Agustus 2026</div>
              <p className="text-purple-700 text-[11px]">
                Tema: "Menumbuhkan Fitrah Keimanan Sejak Usia Dini" bersama Ustadz Pembina.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
