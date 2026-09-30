import React, { useState } from 'react';
import {
  Users,
  MessageCircle,
  CalendarCheck2,
  Bell,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

export const ParentEngagementCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'announcements' | 'meetings' | 'chat'>('summary');
  const [replyMessage, setReplyMessage] = useState('');
  const [sentReplies, setSentReplies] = useState<string[]>([]);

  const handleSendResponse = (announcementId: string) => {
    if (!replyMessage.trim()) return;
    setSentReplies(prev => [...prev, `${announcementId}: ${replyMessage}`]);
    setReplyMessage('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Parent Engagement Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                Sinergi Wali & Madrasah
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat interaksi wali murid: ringkasan harian ananda, respon pengumuman resmi, konfirmasi kehadiran kajian/rapat, dan status komunikasi.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['summary', 'announcements', 'meetings', 'chat'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'summary' && 'Ringkasan Anak'}
              {tab === 'announcements' && 'Pengumuman'}
              {tab === 'meetings' && 'Kehadiran Rapat'}
              {tab === 'chat' && 'Komunikasi'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Summary */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-2">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=60"
                alt="Farhan"
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-100"
                referrerPolicy="no-referrer"
              />
              <h2 className="font-bold text-sm text-slate-800">Muhammad Farhan Al-Fatih</h2>
              <p className="text-xs text-slate-500">Kelas TK B1 (Utsman bin Affan)</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                Hadir Hari Ini (07:15 WIB)
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Wali Kelas:</span>
                <span className="font-bold text-slate-800">Ustadzah Nur Aini, S.Pd</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tilawati Hari Ini:</span>
                <span className="font-bold text-slate-800">Jilid 2 Halaman 14</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sentra Hari Ini:</span>
                <span className="font-bold text-slate-800">Sentra Sains & Alam</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Catatan Harian Ustadzah Pembimbing
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                "Alhamdulillah, ananda Farhan hari ini sangat antusias saat praktik eksperimen kapilaritas air dengan sawi putih di Sentra Sains. Mengikuti shalat dhuha dengan tertib dan khusyuk."
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-800">Aktivitas Sekolah Terjadwal Minggu Ini</h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-slate-700">Pentas Seni & Kreasi Santri Cilik</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">Kamis, 08:30 WIB</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-slate-700">Kajian Parenting Tematik: "Adab Gadget pada Anak"</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">Sabtu, 09:00 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-800">Pemberitahuan Puncak Tema & Outbound Edukatif</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">14 Agustus 2026</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diberitahukan kepada seluruh Ayah/Bunda wali murid KB-TK Islam Asy-Syaamil bahwa kegiatan Puncak Tema Semester Ganjil akan diselenggarakan di Agrowisata Buah Naga pada tanggal 28 Agustus 2026. Mohon konfirmasi kesiapan ananda.
            </p>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Tulis respon / tanggapan wali murid..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              />
              <button
                onClick={() => handleSendResponse('ANN-01')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Kirim Respon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Meetings */}
      {activeTab === 'meetings' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
            Konfirmasi Kehadiran Pertemuan & Kajian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-slate-800">Kajian Parenting Bulanan: Mendidik Karakter Qurani</div>
              <p className="text-[11px] text-slate-500">Sabtu, 22 Agustus 2026 • 09:00 - 11:30 WIB • Aula Asy-Syaamil</p>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  Hadir
                </button>
                <button className="flex-1 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                  Izin / Berhalangan
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-slate-800">Konsultasi Rapor Tengah Semester (PTS)</div>
              <p className="text-[11px] text-slate-500">Jumat, 11 September 2026 • Slot Waktu: 09:30 WIB</p>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  Konfirmasi Slot
                </button>
                <button className="flex-1 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                  Ubah Jadwal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Chat Status */}
      {activeTab === 'chat' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Saluran Komunikasi Langsung Pendidik & Wali
            </h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
              WhatsApp Guardian Terhubung
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Seluruh komunikasi formal dan konsultasi perkembangan ananda terenkripsi dan tercatat secara transparan dalam sistem tata kelola sekolah.
          </p>
        </div>
      )}
    </div>
  );
};
