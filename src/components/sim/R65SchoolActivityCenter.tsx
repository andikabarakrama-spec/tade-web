import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Users,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Shield,
  Download,
  FolderOpen,
  MapPin,
  Award,
  Layers,
  Search,
  Check,
  Send,
  BookOpen,
  Trophy,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface SchoolEvent {
  id: string;
  code: string;
  title: string;
  category: 'STUDY_TOUR' | 'MANASIK' | 'COMPETITION' | 'PARENTING' | 'MEETING' | 'MARKET_DAY' | 'ISLAMIC_EVENT' | 'GRADUATION';
  categoryLabel: string;
  date: string;
  time: string;
  location: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  budgetRAB: number;
  budgetSpent: number;
  totalParticipants: number;
  confirmedAttendance: number;
  timeline: {
    time: string;
    activity: string;
    pic: string;
  }[];
  checklist: {
    id: string;
    task: string;
    role: UserRole;
    done: boolean;
  }[];
  documents: {
    title: string;
    type: string;
    status: 'READY' | 'DRAFT';
  }[];
}

const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-1',
    code: 'EVT-MANASIK-2026',
    title: 'Praktik Manasik Haji Cilik Siswa TK ASY SYIFA',
    category: 'MANASIK',
    categoryLabel: 'Manasik Haji',
    date: '10 September 2026',
    time: '07:30 - 11:30 WIB',
    location: 'Lapangan Alun-Alun Tanggul & Replika Miniatur Kabah',
    status: 'UPCOMING',
    budgetRAB: 6500000,
    budgetSpent: 3200000,
    totalParticipants: 60,
    confirmedAttendance: 54,
    timeline: [
      { time: '07:00 - 07:30', activity: 'Registrasi & Pemeriksaan Seragam Ihram Santri', pic: 'Wali Kelas' },
      { time: '07:30 - 08:00', activity: 'Pemberangkatan Miqat & Niat Ihram Bersama', pic: 'Ustadz Pembimbing' },
      { time: '08:00 - 09:30', activity: 'Thawaf 7 Putaran, Sa\'i Shafa-Marwah & Tahallul', pic: 'Dewan Guru' },
      { time: '09:30 - 10:30', activity: 'Simulasi Wukuf di Padang Arafah & Lempar Jumrah', pic: 'Panitia Khusus' },
      { time: '10:30 - 11:30', activity: 'Penyerahan Sertifikat Manasik & Foto Bersama', pic: 'Kepala Sekolah' }
    ],
    checklist: [
      { id: 'ck-1', task: 'Penyewaan Miniatur Kabah & Sound System Portable', role: 'ADMIN', done: true },
      { id: 'ck-2', task: 'Pengadaan Paket Kain Ihram & Sabuk Cilik Santri', role: 'KEUANGAN', done: true },
      { id: 'ck-3', task: 'Penerbitan Paspor Miniatur & Lembar Panduan Doa Manasik', role: 'GURU', done: true },
      { id: 'ck-4', task: 'Koordinasi Keamanan dengan Polsek/Koramil Tanggul', role: 'KEPALA_SEKOLAH', done: false },
      { id: 'ck-5', task: 'Pengesahan Sambutan & Doa Penutup oleh Ketua Yayasan', role: 'KETUA_YAYASAN', done: false }
    ],
    documents: [
      { title: 'SK Kepanitiaan Manasik Haji 2026', type: 'PDF_RESMI', status: 'READY' },
      { title: 'Buku Saku Panduan Doa Manasik Haji Cilik', type: 'BUKU_PANDUAN', status: 'READY' },
      { title: 'Surat Izin Orang Tua & Format Kwitansi Paket', type: 'FORMULIR', status: 'READY' },
      { title: 'Draf Laporan Pertanggungjawaban (LPJ) Manasik', type: 'DRAF_LPJ', status: 'DRAFT' }
    ]
  },
  {
    id: 'ev-2',
    code: 'EVT-STUDYTOUR-2026',
    title: 'Study Tour Edukatif: Kebun Raya & Pengenalan Flora Sains',
    category: 'STUDY_TOUR',
    categoryLabel: 'Study Tour',
    date: '28 September 2026',
    time: '06:30 - 15:30 WIB',
    location: 'Sentra Agrowisata & Flora Taman Edukasi Jember',
    status: 'UPCOMING',
    budgetRAB: 8500000,
    budgetSpent: 4000000,
    totalParticipants: 75,
    confirmedAttendance: 68,
    timeline: [
      { time: '06:30 - 07:00', activity: 'Kumpul di Halaman Sekolah & Briefing Keselamatan', pic: 'Koordinator Bus' },
      { time: '07:00 - 08:30', activity: 'Perjalanan Menuju Lokasi & Doa Safar Bersama', pic: 'Dewan Guru' },
      { time: '08:30 - 11:30', activity: 'Eksplorasi Kebun Botani & Praktek Menanam Bibit', pic: 'Pemandu Edukasi' },
      { time: '11:30 - 13:00', activity: 'Ishoma (Sholat Dzuhur Berjamaah & Makan Siang Sehat)', pic: 'Tim Konsumsi' },
      { time: '13:00 - 15:30', activity: 'Kuis Edukasi Sains & Perjalanan Pulang ke Sekolah', pic: 'Seluruh Panitia' }
    ],
    checklist: [
      { id: 'ck-1', task: 'Pemesanan 2 Unit Bus Pariwisata Ber-AC Standar Pariwisata', role: 'KEUANGAN', done: true },
      { id: 'ck-2', task: 'Penerbitan Surat Dispensasi Izin Dinas & Asuransi Jiwa', role: 'ADMIN', done: false },
      { id: 'ck-3', task: 'Penyusunan Lembar Observasi Sains Santri Kelompok A & B', role: 'GURU', done: true },
      { id: 'ck-4', task: 'Persetujuan Anggaran Realisasi oleh Ketua Yayasan', role: 'KETUA_YAYASAN', done: false }
    ],
    documents: [
      { title: 'Proposal Kegiatan & Rencana Anggaran Biaya (RAB)', type: 'PROPOSAL', status: 'READY' },
      { title: 'Daftar Pembagian Regu Duduk Bus Santri', type: 'ROSTER', status: 'READY' },
      { title: 'Lembar Kerja Santri (LKS) Pengenalan Tanaman', type: 'MATERI_AJAR', status: 'READY' }
    ]
  },
  {
    id: 'ev-3',
    code: 'EVT-PARENTING-2026',
    title: 'Parenting Akbar: Membangun Generasi Qurani Berakhlak Mulia',
    category: 'PARENTING',
    categoryLabel: 'Parenting',
    date: '15 Oktober 2026',
    time: '08:00 - 11:00 WIB',
    location: 'Aula Serbaguna Yayasan Islam Asy-Syifatan',
    status: 'UPCOMING',
    budgetRAB: 3500000,
    budgetSpent: 1200000,
    totalParticipants: 120,
    confirmedAttendance: 95,
    timeline: [
      { time: '08:00 - 08:30', activity: 'Registrasi Undangan & Penampilan Hadrah Santri', pic: 'Penerima Tamu' },
      { time: '08:30 - 08:45', activity: 'Pembukaan & Sambutan Ketua Yayasan KH. Achmad Shodiq', pic: 'MC' },
      { time: '08:45 - 10:15', activity: 'Pemaparan Materi Parenting oleh Psikolog Anak', pic: 'Narasumber' },
      { time: '10:15 - 11:00', activity: 'Sesi Diskusi Tanya Jawab & Doa Penutup', pic: 'Moderator' }
    ],
    checklist: [
      { id: 'ck-1', task: 'Konfirmasi Kesediaan Narasumber Utama', role: 'KEPALA_SEKOLAH', done: true },
      { id: 'ck-2', task: 'Penyebaran Undangan Digital ke Seluruh Grup Wali Murid', role: 'ADMIN', done: true },
      { id: 'ck-3', task: 'Persiapan Doorprize Buku Islami & Souvenir Peserta', role: 'GURU', done: false }
    ],
    documents: [
      { title: 'Undangan Resmi Parenting Semester Ganjil', type: 'SURAT_UNDANGAN', status: 'READY' },
      { title: 'Slide Presentasi Materi Parenting Islami', type: 'MATERI_PPT', status: 'READY' }
    ]
  }
];

export const R65SchoolActivityCenter: React.FC = () => {
  const { userProfile } = useAuth();
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>('ev-1');
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'CHECKLIST' | 'DOCS' | 'BUDGET' | 'PARTICIPANTS'>('TIMELINE');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingLPJ, setIsGeneratingLPJ] = useState(false);
  const [lpjSuccess, setLpjSuccess] = useState<string | null>(null);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleToggleChecklist = (eventId: string, checklistId: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          checklist: ev.checklist.map(c => (c.id === checklistId ? { ...c, done: !c.done } : c))
        };
      })
    );
  };

  const handleGenerateLPJ = (evTitle: string) => {
    setIsGeneratingLPJ(true);
    setTimeout(() => {
      setIsGeneratingLPJ(false);
      setLpjSuccess(`Draf Laporan Pertanggungjawaban (LPJ) untuk "${evTitle}" berhasil dibuat secara otomatis dan diarsipkan ke Smart Vault!`);
      setTimeout(() => setLpjSuccess(null), 5000);
    }, 1200);
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-teal-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
              <Calendar className="w-8 h-8 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Phase 7 School Activity Hub
                </span>
                <span className="text-xs text-teal-200/80 font-bold">• Manasik, Tour, Parenting, Market Day & Haflah</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">Event & School Activity Center</h2>
              <p className="text-sm text-teal-100/80 font-medium">
                Pusat Pengelolaan Seluruh Agenda Sekolah: Otomatisasi Jadwal, Kepanitiaan, RAB, Roster Peserta, Presensi, & Draf LPJ.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleGenerateLPJ(selectedEvent.title)}
            disabled={isGeneratingLPJ}
            className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg flex items-center gap-2 transition cursor-pointer min-h-[44px] shrink-0 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingLPJ ? 'animate-spin' : ''}`} />
            {isGeneratingLPJ ? 'Menyusun LPJ...' : 'Generate Draf LPJ Otomatis'}
          </button>
        </div>
      </div>

      {lpjSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{lpjSuccess}</span>
        </div>
      )}

      {/* Main Grid: Event List + Interactive Detail Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Events Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Daftar Kegiatan ({filteredEvents.length})
              </h3>
              <span className="text-xs bg-stone-100 text-stone-600 font-bold px-2.5 py-1 rounded-full">
                Semester Ganjil 2026/2027
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-3">
              {filteredEvents.map(ev => {
                const isSelected = ev.id === selectedEventId;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-200/50 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 uppercase">
                        {ev.categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                        {ev.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{ev.title}</h4>

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {ev.date}
                      </span>
                      <span className="font-bold text-emerald-700">
                        {ev.confirmedAttendance}/{ev.totalParticipants} Peserta
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Event Multi-Module View */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEvent && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              {/* Event Header Info */}
              <div className="space-y-2 pb-4 border-b border-stone-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900">
                    {selectedEvent.code}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900">{selectedEvent.title}</h3>

                <div className="flex items-center gap-4 text-xs font-medium text-stone-600 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Calendar className="w-4 h-4 text-teal-600" /> {selectedEvent.date} ({selectedEvent.time})
                  </span>
                  <span>•</span>
                  <span>RAB: <strong>Rp {selectedEvent.budgetRAB.toLocaleString('id-ID')}</strong></span>
                  <span>•</span>
                  <span>Realisasi: <strong className="text-emerald-700">Rp {selectedEvent.budgetSpent.toLocaleString('id-ID')}</strong></span>
                </div>
              </div>

              {/* Sub-Tab Navigation */}
              <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl overflow-x-auto text-xs">
                {[
                  { key: 'TIMELINE', label: 'Rundown Acara', icon: Clock },
                  { key: 'CHECKLIST', label: 'Checklist Panitia', icon: CheckCircle2 },
                  { key: 'DOCS', label: 'Dokumen & SK', icon: FileText },
                  { key: 'BUDGET', label: 'RAB & Keuangan', icon: DollarSign },
                  { key: 'PARTICIPANTS', label: 'Peserta & Presensi', icon: Users }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Rundown */}
              {activeTab === 'TIMELINE' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                    Jadwal Susunan Acara (Rundown Terstruktur)
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-black text-teal-800 bg-teal-100 px-2.5 py-1 rounded-lg shrink-0">
                            {item.time}
                          </span>
                          <span className="font-bold text-slate-900">{item.activity}</span>
                        </div>
                        <span className="font-semibold text-stone-500 shrink-0">PIC: {item.pic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Checklist */}
              {activeTab === 'CHECKLIST' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                    Checklist Persiapan Kepanitiaan ({selectedEvent.checklist.filter(c => c.done).length}/{selectedEvent.checklist.length} Selesai)
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.checklist.map(chk => (
                      <div
                        key={chk.id}
                        onClick={() => handleToggleChecklist(selectedEvent.id, chk.id)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          chk.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              chk.done ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300'
                            }`}
                          >
                            {chk.done && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-bold ${chk.done ? 'text-stone-500 line-through' : 'text-slate-900'}`}>
                            {chk.task}
                          </span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                          {chk.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Documents */}
              {activeTab === 'DOCS' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                    Berkas & Dokumen Kegiatan Resmi (Smart Vault Terhubung)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEvent.documents.map((doc, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                            {doc.type}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              doc.status === 'READY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 line-clamp-2">{doc.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Budget */}
              {activeTab === 'BUDGET' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-xs font-bold text-stone-500">RAB Disetujui Yayasan</span>
                      <div className="text-lg font-black text-slate-900 mt-1">
                        Rp {selectedEvent.budgetRAB.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-800">Realisasi Pengeluaran</span>
                      <div className="text-lg font-black text-emerald-900 mt-1">
                        Rp {selectedEvent.budgetSpent.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 font-medium italic">
                    * Seluruh kuitansi pengeluaran telah tervalidasi dan diverifikasi oleh Bendahara Sekolah & Smart Approval Yayasan.
                  </p>
                </div>
              )}

              {/* Tab 5: Participants */}
              {activeTab === 'PARTICIPANTS' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                      Rekap Kehadiran Santri & Wali ({selectedEvent.confirmedAttendance} dari {selectedEvent.totalParticipants} Terkonfirmasi)
                    </h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {Math.round((selectedEvent.confirmedAttendance / selectedEvent.totalParticipants) * 100)}% Presensi
                    </span>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Kelompok A (Usia 4-5 Thn):</span>
                      <span>28 Santri (100% Konfirmasi)</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Kelompok B (Usia 5-6 Thn):</span>
                      <span>26 Santri (Konfirmasi Bertahap)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
