import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Send,
  Filter,
  Search,
  Check,
  X,
  Pin,
  Flame,
  Radio,
  FileCheck,
  RefreshCw,
  Sparkles,
  Inbox,
  CheckSquare
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'BILLING' | 'ACADEMIC' | 'SYSTEM' | 'APPROVAL' | 'SECURITY';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  pinned: boolean;
  actionRequired?: boolean;
  tenantId: string;
}

interface ApprovalItem {
  id: string;
  title: string;
  applicant: string;
  role: string;
  type: string;
  nominal?: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string;
}

export const GlobalNotificationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'approvals' | 'broadcast' | 'outbox'>('inbox');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-001',
      category: 'BILLING',
      priority: 'HIGH',
      title: 'Pembayaran SPP Santri Masuk (Ahmad Fadhil)',
      description: 'Transfer otomatis via VA Bank Syariah Indonesia sebesar Rp 350.000 telah diverifikasi sistem.',
      timestamp: '5 menit lalu',
      read: false,
      pinned: true,
      actionRequired: false,
      tenantId: 'asy-syifa-pusat'
    },
    {
      id: 'NOTIF-002',
      category: 'APPROVAL',
      priority: 'HIGH',
      title: 'Pengajuan Dispensasi Biaya Seragam',
      description: 'Wali murid Siti Aisyah (Kelas B1) mengajukan cicilan 3x untuk biaya seragam dan buku.',
      timestamp: '25 menit lalu',
      read: false,
      pinned: false,
      actionRequired: true,
      tenantId: 'asy-syifa-pusat'
    },
    {
      id: 'NOTIF-003',
      category: 'ACADEMIC',
      priority: 'NORMAL',
      title: 'Setoran Hafalan Tahfidz Surat An-Naba',
      description: 'Ustadzah Fatimah telah mencatat capaian hafalan 15 santri Kelompok B.',
      timestamp: '1 jam lalu',
      read: true,
      pinned: false,
      actionRequired: false,
      tenantId: 'asy-syifa-pusat'
    },
    {
      id: 'NOTIF-004',
      category: 'SYSTEM',
      priority: 'INFO',
      title: 'Sinkronisasi Otomatis Database Selesai',
      description: 'Backup harian terenkripsi berhasil disimpan ke Google Cloud Storage Coldline.',
      timestamp: '3 jam lalu',
      read: true,
      pinned: false,
      actionRequired: false,
      tenantId: 'asy-syifa-pusat'
    },
    {
      id: 'NOTIF-005',
      category: 'SECURITY',
      priority: 'CRITICAL',
      title: 'Upaya Login Diluar Jam Kerja',
      description: 'Guardian mendeteksi 1 percobaan akses akun TU dari IP tidak dikenal, otomatis ditahan.',
      timestamp: 'Kemarin, 22:15 WIB',
      read: true,
      pinned: true,
      actionRequired: false,
      tenantId: 'asy-syifa-pusat'
    }
  ]);

  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: 'APP-101',
      title: 'Permohonan Cuti Guru (Ustadzah Nurul)',
      applicant: 'Nurul Hidayati, S.Pd',
      role: 'Guru Kelas A2',
      type: 'Cuti Sakit / Pemulihan (2 Hari)',
      date: '18 - 19 Agustus 2026',
      status: 'PENDING',
      notes: 'Surat dokter telah dilampirkan via dokumen pendukung.'
    },
    {
      id: 'APP-102',
      title: 'Pengadaan APE Luar Ruangan (Perosotan TK)',
      applicant: 'Budi Santoso',
      role: 'Staf Sarana Prasarana',
      type: 'Pengadaan Sarpras',
      nominal: 'Rp 4.250.000',
      date: '15 Agustus 2026',
      status: 'PENDING',
      notes: 'Penggantian wahana bermain yang aus demi keselamatan santri.'
    },
    {
      id: 'APP-103',
      title: 'Keringanan SPP Yatim Piatu',
      applicant: 'Keuangan Sekolah',
      role: 'Bagian Administrasi',
      type: 'Diskon 100% SPP',
      nominal: 'Rp 350.000/bln',
      date: 'Tahun Ajaran 2026/2027',
      status: 'APPROVED',
      notes: 'Disetujui Ketua Yayasan atas nama santri Muhammad Bilal.'
    }
  ]);

  // Broadcast state
  const [broadcastTarget, setBroadcastTarget] = useState<'ALL' | 'TEACHERS' | 'PARENTS' | 'STAFF'>('PARENTS');
  const [broadcastPriority, setBroadcastPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('NORMAL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Offline queue state
  const offlineQueue = [
    { id: 'OUT-01', recipient: 'Orang Tua (WA Broadcast)', type: 'Kwitansi SPP Otomatis', items: 42, status: 'SYNCED', time: '10:00 WIB' },
    { id: 'OUT-02', recipient: 'Kemenag EMIS / Dapodik', type: 'Sinkronisasi Absensi Mingguan', items: 1, status: 'QUEUED', time: 'Menunggu Jadwal 23:00' }
  ];

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleTogglePin = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const handleApproval = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    
    // Add to notifications
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      category: 'ACADEMIC',
      priority: broadcastPriority === 'CRITICAL' ? 'CRITICAL' : broadcastPriority === 'HIGH' ? 'HIGH' : 'NORMAL',
      title: `[Pengumuman] ${broadcastTitle}`,
      description: broadcastBody,
      timestamp: 'Baru saja',
      read: false,
      pinned: broadcastPriority === 'CRITICAL',
      tenantId: 'asy-syifa-pusat'
    };

    setNotifications([newNotif, ...notifications]);
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastBody('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const filteredNotifs = notifications.filter(n => {
    const matchCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
    const matchPriority = priorityFilter === 'ALL' || n.priority === priorityFilter;
    const matchQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPriority && matchQuery;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Pusat Notifikasi Terpadu & Approval Hub
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                  {unreadCount} Baru
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kotak masuk terintegrasi, alur persetujuan pimpinan, siaran pengumuman multi-kanal, dan antrean pengiriman offline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" /> Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'inbox' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Semua Notifikasi ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
            activeTab === 'approvals' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Antrean Persetujuan ({pendingApprovalsCount})
          {pendingApprovalsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'broadcast' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          Siaran Pengumuman
        </button>
        <button
          onClick={() => setActiveTab('outbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'outbox' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Antrean Pengiriman Offline ({offlineQueue.length})
        </button>
      </div>

      {/* TAB: Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari notifikasi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="BILLING">Keuangan & SPP</option>
                <option value="ACADEMIC">Akademik & Santri</option>
                <option value="APPROVAL">Persetujuan</option>
                <option value="SYSTEM">Sistem & Backup</option>
                <option value="SECURITY">Keamanan</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">Semua Prioritas</option>
                <option value="CRITICAL">Kritis / Mendesak</option>
                <option value="HIGH">Tinggi</option>
                <option value="NORMAL">Normal</option>
                <option value="INFO">Informasi</option>
              </select>
            </div>
          </div>

          {/* List Notifications */}
          <div className="space-y-2.5">
            {filteredNotifs.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                Tidak ada notifikasi yang cocok dengan filter pencarian.
              </div>
            ) : (
              filteredNotifs.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                    !item.read
                      ? 'bg-indigo-50/30 border-indigo-200 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      item.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                      item.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                      item.category === 'BILLING' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {item.priority === 'CRITICAL' ? <Flame className="w-4 h-4" /> :
                       item.priority === 'HIGH' ? <AlertTriangle className="w-4 h-4" /> :
                       <Info className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          item.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.category}
                        </span>
                        <h2 className="text-xs font-bold text-slate-800">{item.title}</h2>
                        {item.pinned && (
                          <Pin className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                        <Clock className="w-3 h-3" /> {item.timestamp}
                        <span>•</span>
                        <span className="font-mono">{item.tenantId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-start">
                    <button
                      onClick={() => handleTogglePin(item.id)}
                      className={`p-1.5 rounded-lg transition ${
                        item.pinned ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title={item.pinned ? 'Lepas Pin' : 'Sematkan Notifikasi'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleRead(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                      title={item.read ? 'Tandai Belum Dibaca' : 'Tandai Selesai Dibaca'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-1">Daftar Pengajuan Butuh Persetujuan Pimpinan</h2>
            <p className="text-xs text-slate-500 mb-5">Validasi pengajuan izin cuti, permohonan anggaran sarpras, dan keringanan SPP santri.</p>

            <div className="space-y-4">
              {approvals.map(app => (
                <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {app.id}
                        </span>
                        <h2 className="text-xs font-bold text-slate-900">{app.title}</h2>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Pemohon: <strong>{app.applicant}</strong> ({app.role})</p>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                      app.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {app.status === 'PENDING' ? 'Menunggu Keputusan' : app.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400">Jenis Pengajuan:</span>
                      <p className="font-semibold text-slate-800">{app.type}</p>
                    </div>
                    {app.nominal && (
                      <div>
                        <span className="text-slate-400">Nominal:</span>
                        <p className="font-semibold text-emerald-600">{app.nominal}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400">Tanggal / Periode:</span>
                      <p className="font-semibold text-slate-800">{app.date}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    "{app.notes}"
                  </p>

                  {app.status === 'PENDING' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleApproval(app.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Tolak
                      </button>
                      <button
                        onClick={() => handleApproval(app.id, 'APPROVED')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Setujui & Terbitkan SK
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Broadcast */}
      {activeTab === 'broadcast' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-1">Kirim Siaran Pengumuman Massal</h2>
          <p className="text-xs text-slate-500 mb-6">Siaran langsung ke aplikasi wali murid, guru, atau staf sekolah via Push Notification & WhatsApp.</p>

          {broadcastSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Siaran berhasil diterbitkan dan masuk ke antrean kirim otomatis.
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Penerima</label>
                <select
                  value={broadcastTarget}
                  onChange={e => setBroadcastTarget(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="PARENTS">Semua Wali Murid (248 Kontak)</option>
                  <option value="TEACHERS">Seluruh Dewan Guru & Pendidik (18 Guru)</option>
                  <option value="STAFF">Staf Tata Usaha & Karyawan</option>
                  <option value="ALL">Seluruh Sivitas Akademika TK Asy-Syifa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Prioritas</label>
                <select
                  value={broadcastPriority}
                  onChange={e => setBroadcastPriority(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="NORMAL">Normal (Info Harian / Kalender)</option>
                  <option value="HIGH">Tinggi (Pemberitahuan Penting / SPP)</option>
                  <option value="CRITICAL">Kritis / Mendesak (Libur Dadakan / Darurat)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman</label>
              <input
                type="text"
                placeholder="Contoh: Jadwal Kegiatan Manasik Haji Santri 2026"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pesan Siaran</label>
              <textarea
                rows={4}
                placeholder="Tuliskan detail pengumuman secara santun dan jelas..."
                value={broadcastBody}
                onChange={e => setBroadcastBody(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Format WhatsApp otomatis disesuaikan dengan header dan salam islami.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" /> Terbitkan & Kirim Sekarang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: Outbox */}
      {activeTab === 'outbox' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Antrean Pengiriman Offline & Background Dispatch</h2>
              <p className="text-xs text-slate-500">Pesan otomatis yang dijadwalkan atau menunggu koneksi internet stabil.</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Sinkronkan Sekarang
            </button>
          </div>

          <div className="space-y-3">
            {offlineQueue.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{item.type}</div>
                  <div className="text-[11px] text-slate-500">Target: {item.recipient} • {item.items} Item Terjadwal</div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    item.status === 'SYNCED' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {item.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
