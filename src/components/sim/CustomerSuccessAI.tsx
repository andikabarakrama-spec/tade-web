import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Circle,
  PlayCircle,
  MessageCircle,
  HelpCircle,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  QrCode
} from 'lucide-react';

interface OnboardingTask {
  id: string;
  title: string;
  category: 'SETUP' | 'DATA' | 'WHATSAPP' | 'FINANCE';
  completed: boolean;
  guideText: string;
}

const INITIAL_TASKS: OnboardingTask[] = [
  {
    id: 'TSK-01',
    title: 'Lengkapi Profil & Identitas Sekolah',
    category: 'SETUP',
    completed: true,
    guideText: 'Nama TK, NPSN, alamat, dan logo sekolah sudah tersimpan di database.'
  },
  {
    id: 'TSK-02',
    title: 'Impor / Input Santri & Guru Kelas',
    category: 'DATA',
    completed: true,
    guideText: 'Data santri aktif telah terdaftar pada rombel kelas TK A dan TK B.'
  },
  {
    id: 'TSK-03',
    title: 'Hubungkan WhatsApp Gateway Notifikasi',
    category: 'WHATSAPP',
    completed: false,
    guideText: 'Scan QR WhatsApp Guardian untuk mengirim bukti pembayaran & presensi otomatis.'
  },
  {
    id: 'TSK-04',
    title: 'Konfigurasi Tagihan SPP & Rekening Sekolah',
    category: 'FINANCE',
    completed: false,
    guideText: 'Tentukan tarif SPP bulanan dan nomor rekening tujuan yayasan.'
  },
  {
    id: 'TSK-05',
    title: 'Uji Coba Notifikasi Presensi Santri',
    category: 'WHATSAPP',
    completed: false,
    guideText: 'Lakukan 1x tap presensi masuk untuk menerima pesan simulasi WhatsApp ke wali murid.'
  }
];

export const CustomerSuccessAI: React.FC = () => {
  const [tasks, setTasks] = useState<OnboardingTask[]>(INITIAL_TASKS);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-lg">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    MODULE R147
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    CUSTOMER SUCCESS AI
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Customer Success AI & Asy Onboarding Center
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Pendamping cerdas interaktif Dek Asy yang memastikan setiap sekolah baru berhasil melakukan setup, menghubungkan WhatsApp, dan siap melayani wali murid dalam hari pertama implementasi.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-purple-500/30 text-center shrink-0 min-w-[140px]">
            <span className="text-[10px] text-slate-400 font-mono block">PROGRESS ONBOARDING</span>
            <span className="text-2xl font-black text-purple-400 font-mono">{progressPercent}%</span>
            <span className="text-[10px] text-slate-500 block">{completedCount} dari {tasks.length} Selesai</span>
          </div>
        </div>
      </div>

      {/* Interactive Dek Asy Onboarding Assistant Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>Saran Dek Asy Hari Ini: Hubungkan WhatsApp Gateway</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                PRIORITAS TINGGI
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              "Halo Admin Sekolah! Hanya tersisa 3 langkah lagi agar wali murid santri bisa langsung menerima notifikasi WhatsApp saat anak hadir di sekolah dan saat SPP terverifikasi!"
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Membuka asisten WhatsApp Guardian Setup...')}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Pandu Saya Hubungkan WA</span>
        </button>
      </div>

      {/* Onboarding Checklist & Video Guides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist Left 2 Cols */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Checklist Kesiapan Operasional Sekolah (Go-Live)</span>
          </h4>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                  task.completed
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                }`}
              >
                <div className="pt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-xs ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {task.guideText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video & Direct Help Right Col */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <PlayCircle className="w-4 h-4 text-purple-500" />
              <span>Video Pemandu Singkat (1 Menit)</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div
                onClick={() => setActiveVideoTitle('Cara Input Santri Cepat via Excel')}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 cursor-pointer transition-all flex items-center justify-between"
              >
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  1. Cara Input Santri Cepat via Excel
                </span>
                <PlayCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>

              <div
                onClick={() => setActiveVideoTitle('Cara Scan QR WhatsApp Notifikasi')}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 cursor-pointer transition-all flex items-center justify-between"
              >
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  2. Cara Scan QR WhatsApp Notifikasi
                </span>
                <PlayCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>

              <div
                onClick={() => setActiveVideoTitle('Cara Set Tarif SPP & Infaq')}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 cursor-pointer transition-all flex items-center justify-between"
              >
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  3. Cara Set Tarif SPP & Infaq Bulanan
                </span>
                <PlayCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Bantuan Pendampingan Langsung</span>
            </h4>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
              Tim Customer Success TADE siap membantu setup sekolah Anda melalui Zoom atau WhatsApp Call bebas biaya.
            </p>
            <button
              onClick={() => alert('Menghubungkan ke Tim Support TADE via WhatsApp...')}
              className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
            >
              Hubungi CS TADE WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Simulator */}
      {activeVideoTitle && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-300 dark:border-purple-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-purple-600" />
                <span>{activeVideoTitle}</span>
              </h3>
              <button
                onClick={() => setActiveVideoTitle(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-white space-y-2 border border-slate-800">
              <PlayCircle className="w-12 h-12 text-purple-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-300">Memutar Video Tutorial Dek Asy...</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tutorial interaktif 60 detik ini menjelaskan langkah-langkah praktis tanpa istilah teknis yang membingungkan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
