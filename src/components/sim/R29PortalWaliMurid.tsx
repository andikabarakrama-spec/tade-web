import React, { useEffect, useState } from 'react';
import { Award, CalendarCheck, DollarSign, MessageSquare, UserCheck, ShieldCheck } from 'lucide-react';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { DailySmartBriefCard } from '../parent/DailySmartBriefCard';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import { Student } from '../../types';

interface Props {
  onSelectModule: (mod: string) => void;
}

export const R29PortalWaliMurid: React.FC<Props> = ({ onSelectModule }) => {
  const { currentUser, userProfile } = useAuth();
  const [childrenList, setChildrenList] = useState<Student[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadAuthorizedChildren = async () => {
      try {
        const students = await DataService.getStudents(
          userProfile?.role || 'WALI_MURID',
          currentUser?.uid,
          userProfile?.email
        );
        if (isMounted) {
          setChildrenList(students);
          setLoading(false);
        }
      } catch (e) {
        console.warn('Failed loading authorized children in R29:', e);
        if (isMounted) setLoading(false);
      }
    };
    loadAuthorizedChildren();
    return () => { isMounted = false; };
  }, [currentUser?.uid, userProfile?.role, userProfile?.email]);

  const activeChild = childrenList[selectedChildIndex] || null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-8 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-emerald-800/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Module R29 - Portal Wali Murid
          </span>
          {childrenList.length > 0 && (
            <span className="text-xs text-emerald-200 bg-emerald-800/50 px-3 py-1 rounded-full">
              {childrenList.length} Ananda Terdaftar
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Portal Khusus Orang Tua / Wali Murid</h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mt-1">
            {loading ? (
              'Memuat data ananda terverifikasi...'
            ) : activeChild ? (
              `Akses ringkas informasi perkembangan ananda ${activeChild.namaLengkap || activeChild.name} (${activeChild.classGroup || activeChild.kelompok || 'Siswa Asy Syifa'}).`
            ) : (
              'Selamat datang Ayah & Bunda. Data ananda terverifikasi akan ditampilkan secara otomatis setelah pendaftaran/sinkronisasi.'
            )}
          </p>
        </div>

        {/* Multi-Child Selector */}
        {childrenList.length > 1 && (
          <div className="pt-2 flex items-center gap-2 overflow-x-auto border-t border-emerald-800/60">
            <span className="text-xs text-emerald-200 font-medium whitespace-nowrap">Pilih Ananda:</span>
            {childrenList.map((child, idx) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedChildIndex === idx
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'bg-emerald-800/70 text-emerald-100 hover:bg-emerald-700/80'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                {child.nickname || child.name.split(' ')[0]} ({child.classGroup})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* G203: Daily Smart Brief for Parents */}
      <DailySmartBriefCard activeStudent={activeChild} onSelectModule={onSelectModule} />

      {/* AI Asy Companion for Parents */}
      <AIAsyCharacterScene pageContext="dashboardParent" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onSelectModule('r8')}
          className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 text-left space-y-2 transition group"
        >
          <Award className="w-8 h-8 text-emerald-600 group-hover:scale-105 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">Lihat E-Rapor PAUD</h3>
          <p className="text-xs text-stone-500">
            {activeChild ? `Capaian semester ${activeChild.nickname || activeChild.name}` : 'Capaian perkembangan semester ini'}
          </p>
        </button>

        <button
          onClick={() => onSelectModule('r6')}
          className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 text-left space-y-2 transition group"
        >
          <CalendarCheck className="w-8 h-8 text-sky-600 group-hover:scale-105 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">Presensi Ananda</h3>
          <p className="text-xs text-stone-500">Rekap kehadiran harian di sekolah</p>
        </button>

        <button
          onClick={() => onSelectModule('r10')}
          className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 text-left space-y-2 transition group"
        >
          <DollarSign className="w-8 h-8 text-amber-600 group-hover:scale-105 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">Status SPP Bulanan</h3>
          <p className="text-xs text-stone-500">Informasi pembayaran & kwitansi digital</p>
        </button>

        <button
          onClick={() => onSelectModule('r16')}
          className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-500 text-left space-y-2 transition group"
        >
          <MessageSquare className="w-8 h-8 text-purple-600 group-hover:scale-105 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">Buku Penghubung</h3>
          <p className="text-xs text-stone-500">Komunikasi harian dengan guru kelas</p>
        </button>
      </div>
    </div>
  );
};
