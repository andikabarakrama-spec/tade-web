import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  FileText,
  Clock,
  CheckCheck,
  AlertTriangle,
  Sparkles,
  Shield,
  Smartphone,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface BroadcastRecord {
  id: string;
  recipientGroup: string;
  templateName: string;
  totalRecipients: number;
  deliveredCount: number;
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
  status: 'DELIVERED' | 'QUEUED' | 'SENDING';
  timestamp: string;
}

export const SmartCommunicationCenter: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('tpl-spp');
  const [targetGroup, setTargetGroup] = useState<string>('ALL_PARENTS');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [customText, setCustomText] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState<BroadcastRecord[]>([
    {
      id: 'BC-2026-081',
      recipientGroup: 'Wali Murid TK A & TK B',
      templateName: 'Pemberitahuan Agenda Manasik Haji Santri',
      totalRecipients: 124,
      deliveredCount: 124,
      priority: 'HIGH',
      status: 'DELIVERED',
      timestamp: 'Hari Ini, 07:45 WIB'
    },
    {
      id: 'BC-2026-080',
      recipientGroup: 'Seluruh Wali Murid PAUD',
      templateName: 'Konfirmasi Penerimaan SPP Periode Agustus',
      totalRecipients: 246,
      deliveredCount: 242,
      priority: 'NORMAL',
      status: 'DELIVERED',
      timestamp: 'Kemarin, 14:20 WIB'
    },
    {
      id: 'BC-2026-079',
      recipientGroup: 'Dewan Guru & Pengajar Sentra',
      templateName: 'Briefing Evaluasi Kurikulum Merdeka Pekan ke-3',
      totalRecipients: 18,
      deliveredCount: 18,
      priority: 'NORMAL',
      status: 'DELIVERED',
      timestamp: '12 Agu 2026, 16:00 WIB'
    }
  ]);

  const templates = [
    {
      id: 'tpl-spp',
      name: 'Pengingat Pembayaran SPP Bulanan',
      category: 'Keuangan',
      content: 'Assalamu’alaikum Ayah/Bunda [Nama_Wali], kami menginformasikan tagihan SPP ananda [Nama_Santri] bulan [Bulan] sebesar [Nominal]. Terima kasih atas kerjasamanya.'
    },
    {
      id: 'tpl-event',
      name: 'Undangan Kegiatan Sekolah & Parenting',
      category: 'Akademik',
      content: 'Assalamu’alaikum Warahmatullahi Wabarakatuh. Mengundang Ayah/Bunda untuk menghadiri [Nama_Acara] pada hari [Hari], [Tanggal] pukul [Waktu] di Aula Utama.'
    },
    {
      id: 'tpl-presensi',
      name: 'Konfirmasi Presensi & Penjemputan Santri',
      category: 'Operasional',
      content: 'Alhamdulillah, ananda [Nama_Santri] telah selesai mengikuti kegiatan belajar hari ini dan siap dijemput pada gerbang utama. Wassalamu’alaikum.'
    }
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      const templateObj = templates.find(t => t.id === selectedTemplate);
      const newRecord: BroadcastRecord = {
        id: `BC-2026-0${Math.floor(Math.random() * 900) + 100}`,
        recipientGroup: targetGroup === 'ALL_PARENTS' ? 'Seluruh Wali Murid (246)' : 'Kelompok Guru Sentra (18)',
        templateName: templateObj ? templateObj.name : 'Pesan Kustom Sekolah',
        totalRecipients: targetGroup === 'ALL_PARENTS' ? 246 : 18,
        deliveredCount: targetGroup === 'ALL_PARENTS' ? 246 : 18,
        priority: priority,
        status: 'DELIVERED',
        timestamp: 'Baru saja'
      };

      setBroadcastLog([newRecord, ...broadcastLog]);
      setIsSending(false);
      setCustomText('');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Smart Communication Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                WhatsApp Guardian Integrated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat orkestrasi pesan broadcast, template notifikasi resmi sekolah, prioritas antrean, dan riwayat pengiriman aman.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Gateway: Ready
          </span>
        </div>
      </div>

      {/* Grid: Broadcast Composer & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" />
            Kirim Broadcast & Notifikasi Terpadu
          </h2>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Pilih Target Penerima:</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
              >
                <option value="ALL_PARENTS">Seluruh Wali Murid PAUD & TK (246 Kontak)</option>
                <option value="TK_A">Khusus Wali Murid Sentra TK A (118 Kontak)</option>
                <option value="TK_B">Khusus Wali Murid Sentra TK B (128 Kontak)</option>
                <option value="TEACHERS">Seluruh Dewan Guru & Staf (18 Kontak)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Gunakan Template Pesan Resmi:</label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  const t = templates.find(item => item.id === e.target.value);
                  if (t) setCustomText(t.content);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>[{t.category}] {t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Prioritas Pesan:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['NORMAL', 'HIGH', 'URGENT'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl font-bold text-center border transition-all ${
                      priority === p
                        ? p === 'URGENT'
                          ? 'bg-rose-100 border-rose-300 text-rose-800'
                          : p === 'HIGH'
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Isi Pesan (Pratinjau / Kustom):</label>
              <textarea
                rows={4}
                value={customText || (templates.find(t => t.id === selectedTemplate)?.content ?? '')}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Tulis pesan resmi..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-sans focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              {isSending ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Mengirimkan Broadcast...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Broadcast Sekarang
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dispatch Log & Templates Library */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              Riwayat Pengiriman & Delivery Log
            </h2>

            <div className="space-y-3">
              {broadcastLog.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-[10px]">
                      {log.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {log.status} ({log.deliveredCount}/{log.totalRecipients})
                    </span>
                  </div>

                  <div className="font-bold text-slate-800">{log.templateName}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target: {log.recipientGroup}</span>
                    <span className="text-[10px] font-mono">{log.timestamp}</span>
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
