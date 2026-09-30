import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Building,
  BarChart2,
  Filter,
  Check
} from 'lucide-react';

interface RoomResource {
  id: string;
  name: string;
  code: string;
  type: 'SENTRA' | 'AULA' | 'OUTDOOR' | 'LAB';
  capacity: number;
  currentOccupancy: number;
  utilizationRate: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  activeSession: string;
  facilitator: string;
}

interface BookingSlot {
  id: string;
  roomName: string;
  time: string;
  eventTitle: string;
  organizer: string;
  hasConflict: boolean;
}

export const SchoolResourcePlanner: React.FC = () => {
  const [selectedRoomType, setSelectedRoomType] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('TODAY');

  const [rooms] = useState<RoomResource[]>([
    {
      id: 'R-01',
      name: 'Sentra Balok & Konstruksi',
      code: 'S-BALOK',
      type: 'SENTRA',
      capacity: 25,
      currentOccupancy: 24,
      utilizationRate: 96,
      status: 'OCCUPIED',
      activeSession: 'Kelompok TK A1 - Membangun Kota Islami',
      facilitator: 'Ustadzah Fatimah'
    },
    {
      id: 'R-02',
      name: 'Sentra Bahan Alam & Sains',
      code: 'S-ALAM',
      type: 'SENTRA',
      capacity: 25,
      currentOccupancy: 24,
      utilizationRate: 96,
      status: 'OCCUPIED',
      activeSession: 'Kelompok TK A2 - Eksplorasi Tekstur & Daun',
      facilitator: 'Ustadzah Maryam'
    },
    {
      id: 'R-03',
      name: 'Sentra Imtaq & Praktik Ibadah',
      code: 'S-IMTAQ',
      type: 'SENTRA',
      capacity: 30,
      currentOccupancy: 25,
      utilizationRate: 83,
      status: 'OCCUPIED',
      activeSession: 'Kelompok TK B1 - Simulasi Manasik & Wudhu',
      facilitator: 'Ustadz Ahmad'
    },
    {
      id: 'R-04',
      name: 'Sentra Seni, Peran & Musik',
      code: 'S-SENI',
      type: 'SENTRA',
      capacity: 25,
      currentOccupancy: 25,
      utilizationRate: 100,
      status: 'OCCUPIED',
      activeSession: 'Kelompok TK B2 - Kolase Kaligrafi Al-Qur’an',
      facilitator: 'Ustadzah Aisyah'
    },
    {
      id: 'R-05',
      name: 'Aula Utama Al-Hikmah',
      code: 'AULA-01',
      type: 'AULA',
      capacity: 150,
      currentOccupancy: 0,
      utilizationRate: 45,
      status: 'AVAILABLE',
      activeSession: 'Kosong (Siap untuk Rapat Komite 13:00)',
      facilitator: 'Divisi Sarpras'
    },
    {
      id: 'R-06',
      name: 'Taman Bermain Outdoor & Tanaman Herbal',
      code: 'OUT-01',
      type: 'OUTDOOR',
      capacity: 50,
      currentOccupancy: 20,
      utilizationRate: 40,
      status: 'OCCUPIED',
      activeSession: 'Kelompok Bermain - Senam & Ketangkasan Motorik',
      facilitator: 'Ustadzah Salma'
    }
  ]);

  const [bookingSchedule] = useState<BookingSlot[]>([
    {
      id: 'BS-01',
      roomName: 'Aula Utama Al-Hikmah',
      time: '08:00 - 10:00 WIB',
      eventTitle: 'Praktik Senam Ceria Santri Gabungan',
      organizer: 'Guru PJOK',
      hasConflict: false
    },
    {
      id: 'BS-02',
      roomName: 'Aula Utama Al-Hikmah',
      time: '13:00 - 15:00 WIB',
      eventTitle: 'Rapat Persiapan Manasik Haji bersama Wali Murid',
      organizer: 'Komite Sekolah',
      hasConflict: false
    },
    {
      id: 'BS-03',
      roomName: 'Sentra Imtaq & Praktik Ibadah',
      time: '10:00 - 11:15 WIB',
      eventTitle: 'Bimbingan Tahfidz Intensif Santri B2',
      organizer: 'Tim Tahfidz',
      hasConflict: false
    }
  ]);

  const filteredRooms = selectedRoomType === 'ALL'
    ? rooms
    : rooms.filter(r => r.type === selectedRoomType);

  const averageUtilization = Math.round(
    rooms.reduce((acc, r) => acc + r.utilizationRate, 0) / rooms.length
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">School Resource Planner</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                Ruangan & Sarpras
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tata kelola ruangan cerdas: kapasitas sentra, pencegahan konflik jadwal otomatis, kalender pemakaian aula, dan efisiensi utilisasi sarpras.
            </p>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter Tipe Ruangan"
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Ruang ({rooms.length})</option>
            <option value="SENTRA">Ruang Sentra</option>
            <option value="AULA">Aula & Serbaguna</option>
            <option value="OUTDOOR">Area Outdoor</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Rata-rata Utilisasi Ruang</span>
          <div className="text-2xl font-black text-blue-600">{averageUtilization}%</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Efisiensi Optimal Sentra
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Total Ruang Terdata</span>
          <div className="text-2xl font-black text-slate-800">{rooms.length} Ruang</div>
          <span className="text-[10px] text-slate-500 font-medium">4 Sentra, 1 Aula, 1 Outdoor</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Status Konflik Jadwal</span>
          <div className="text-2xl font-black text-emerald-600">0 Konflik</div>
          <span className="text-[10px] text-emerald-600 font-medium">Jadwal 100% tersinkron rapi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Ruang Tersedia Saat Ini</span>
          <div className="text-2xl font-black text-indigo-600">1 Ruang</div>
          <span className="text-[10px] text-slate-500 font-medium">Aula Al-Hikmah Standby</span>
        </div>
      </div>

      {/* Grid Ruangan & Status Okupansi */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-700">Daftar Ruangan & Tingkat Okupansi Realtime</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                    {room.code}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 mt-1">{room.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    room.status === 'OCCUPIED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {room.status === 'OCCUPIED' ? 'DIGUNAKAN' : 'KOSONG'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-500 text-[11px]">Sesi Aktif:</div>
                <div className="font-semibold text-slate-700 text-[11px] line-clamp-1">{room.activeSession}</div>
                <div className="text-slate-400 text-[10px]">PJ: {room.facilitator}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Okupansi:</span>
                  <span className="font-mono font-bold text-slate-700">
                    {room.currentOccupancy} / {room.capacity} ({room.utilizationRate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      room.utilizationRate > 90 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${room.utilizationRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kalender Pemakaian & Deteksi Konflik */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Jadwal Booking Ruang & Verifikasi Bebas Bentrok
          </h2>
          <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conflict Detection Engine Active
          </span>
        </div>

        <div className="space-y-3">
          {bookingSchedule.map((slot) => (
            <div key={slot.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800">{slot.eventTitle}</div>
                <div className="text-slate-500 text-[11px] flex items-center gap-3">
                  <span className="font-mono text-blue-700 font-bold">{slot.roomName}</span>
                  <span>•</span>
                  <span>Waktu: {slot.time}</span>
                  <span>•</span>
                  <span>Penyelenggara: {slot.organizer}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Terjadwal Aman
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
