import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Users,
  Image as ImageIcon,
  Plus,
  Sparkles,
  MapPin,
  ListTodo,
  CheckSquare
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  targetAudience: string;
  location: string;
  confirmedAttendees: number;
  totalInvited: number;
  daysRemaining: number;
  checklist: { task: string; done: boolean }[];
  photos: string[];
}

export const SchoolEventCommand: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'EVT-01',
      title: 'Peragaan Manasik Haji Cilik Santri PAUD & TK',
      date: 'Sabtu, 22 Agustus 2026',
      targetAudience: 'Santri TK A, TK B & Seluruh Wali Murid',
      location: 'Miniatur Ka’bah & Halaman Utama Asysyakur',
      confirmedAttendees: 218,
      totalInvited: 246,
      daysRemaining: 7,
      checklist: [
        { task: 'Penyediaan pakaian ihram cilik untuk seluruh santri', done: true },
        { task: 'Setting audio sound system & rekaman talbiyah', done: true },
        { task: 'Pemasangan tenda transit & pos kesehatan UKS', done: false },
        { task: 'Konfirmasi konsumsi snack sehat & kurma', done: false }
      ],
      photos: [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'EVT-02',
      title: 'Parenting Talkshow: Membangun Adab Islami Sejak Usia Dini',
      date: 'Sabtu, 05 September 2026',
      targetAudience: 'Wali Murid & Masyarakat Umum',
      location: 'Aula Graha Asysyakur',
      confirmedAttendees: 145,
      totalInvited: 200,
      daysRemaining: 21,
      checklist: [
        { task: 'Konfirmasi pemateri parenting nasional', done: true },
        { task: 'Penerbitan e-sertifikat & handout materi digital', done: false },
        { task: 'Penyusunan tim dokumentasi live streaming', done: false }
      ],
      photos: []
    }
  ]);

  const [selectedEventId, setSelectedEventId] = useState<string>('EVT-01');
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  const toggleTask = (eventId: string, taskIdx: number) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const newChecklist = [...e.checklist];
        newChecklist[taskIdx].done = !newChecklist[taskIdx].done;
        return { ...e, checklist: newChecklist };
      }
      return e;
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">School Event Command</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Event Operations
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat komando agenda & perayaan sekolah: linimasa kegiatan, checklist persiapan, hitung mundur acara, dan dokumentasi.
            </p>
          </div>
        </div>
      </div>

      {/* Events Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => {
          const isSelected = evt.id === selectedEventId;
          const completedTasks = evt.checklist.filter(t => t.done).length;

          return (
            <div
              key={evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                isSelected
                  ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-200'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {evt.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {evt.daysRemaining} Hari Lagi
                </span>
              </div>

              <div>
                <h2 className="font-bold text-slate-800 text-sm">{evt.title}</h2>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>Checklist: {completedTasks}/{evt.checklist.length} Siap</span>
                <span>RSVP: {evt.confirmedAttendees}/{evt.totalInvited} Hadir</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
              Detail Komando Acara
            </span>
            <h2 className="text-lg font-bold text-slate-800">{activeEvent.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal: {activeEvent.date} • Lokasi: {activeEvent.location}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Konfirmasi Hadir</span>
              <span className="text-sm font-bold text-emerald-600">
                {activeEvent.confirmedAttendees} Orang ({Math.round((activeEvent.confirmedAttendees / activeEvent.totalInvited) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preparation Checklist */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-amber-600" />
              Checklist Kesiapan Logistik & Teknis
            </h2>

            <div className="space-y-2">
              {activeEvent.checklist.map((task, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleTask(activeEvent.id, idx)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-all ${
                    task.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    readOnly
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span className={task.done ? 'line-through text-slate-400 font-medium' : 'font-medium text-slate-700'}>
                    {task.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery & Documentation */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-600" />
              Dokumentasi & Arsip Visual Acara
            </h2>

            {activeEvent.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {activeEvent.photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Dokumentasi Acara"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-1">
                <ImageIcon className="w-6 h-6 mx-auto text-slate-300" />
                <p>Dokumentasi foto akan diunggah setelah acara selesai berlangsung.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
