import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  UserCheck, 
  X
} from 'lucide-react';
import { Student } from '../../types';
import { AlumniProfile } from '../../types/alumni';
import { alumniTransitionEngine } from '../../services/alumniTransitionEngine';
import { DataService } from '../../services/db';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (alumni: AlumniProfile) => void;
  currentRole?: string;
  operatorUid?: string;
}

export const AlumniTransitionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  currentRole = 'SUPER_ADMIN',
  operatorUid = 'usr-admin-01'
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [destinationSchool, setDestinationSchool] = useState<string>('SDIT Harapan Umat Tanggul');
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear());
  const [customNote, setCustomNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultAlumni, setResultAlumni] = useState<AlumniProfile | null>(null);
  const [parentTransitioned, setParentTransitioned] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchActiveStudents = async () => {
        try {
          const all = await DataService.getStudents();
          // Filter students who are 'Aktif'
          const activeOnly = all.filter(s => s.status === 'Aktif' || !s.status);
          setStudents(activeOnly);
          if (activeOnly.length > 0) {
            setSelectedStudentId(activeOnly[0].id);
          }
        } catch (e) {
          console.error('Failed to load students:', e);
        }
      };
      fetchActiveStudents();
      setResultAlumni(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setErrorMsg('Pilih santri yang akan diwisuda.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await alumniTransitionEngine.transitionStudentToAlumni({
        studentId: selectedStudentId,
        graduationYear,
        destinationSchool,
        customNote,
        operatorUid,
        operatorRole: currentRole
      });

      if (res.success) {
        setResultAlumni(res.alumniProfile);
        setParentTransitioned(res.parentRoleTransitioned);
        if (onSuccess) {
          onSuccess(res.alumniProfile);
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat memproses transisi wisuda.');
    } finally {
      setLoading(false);
    }
  };

  const selectedStudentObj = students.find(s => s.id === selectedStudentId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 border border-stone-200 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg">
                Engine Transisi Kelulusan Santri (P1)
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Otomasi Status Alumni • Paspor Digital • RBAC Family Transition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {resultAlumni ? (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-black text-sm">Transisi Kelulusan Berhasil Disahkan!</h4>
                  <p className="text-xs text-emerald-800">
                    Santri <strong>{resultAlumni.studentName}</strong> resmi menjadi bagian dari Alumni Universe Asy Syifa.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Nomor Paspor:</span>
                  <strong>{resultAlumni.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Angkatan:</span>
                  <strong>{resultAlumni.cohortName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Status Peran Wali Murid:</span>
                  <strong className={parentTransitioned ? 'text-teal-700' : 'text-emerald-700'}>
                    {parentTransitioned ? 'Beralih ke ALUMNI_FAMILY' : 'Tetap (Memiliki Santri Aktif Lain)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Hash QR Seal:</span>
                  <strong className="text-slate-600 truncate max-w-[200px]">{resultAlumni.certificateQrHash}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pilih Santri yang Wisuda
              </label>
              {students.length === 0 ? (
                <div className="p-3 text-xs bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                  Tidak ada santri aktif yang dapat diwisuda saat ini.
                </div>
              ) : (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nis || 'NIS -'} / {s.rombel || s.kelompok || 'Kelompok B'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedStudentObj && (
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Orang Tua / Wali:</span>
                  <strong className="text-slate-900">{selectedStudentObj.parentName || selectedStudentObj.namaOrangTua || 'Wali Terdaftar'}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Target Transisi Peran:</span>
                  <strong className="text-emerald-700">WALI_MURID → ALUMNI_FAMILY (Auto-Check)</strong>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tahun Kelulusan
                </label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Sekolah Lanjutan (SD/MI)
                </label>
                <input
                  type="text"
                  placeholder="SDIT Harapan Umat / MI Al-Hidayah"
                  value={destinationSchool}
                  onChange={(e) => setDestinationSchool(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Catatan Doa / Rekam Prestasi Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Juara tartil Qur'an & khatam juz 30 mutqin..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Jaminan Integritas Heritage:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                <li>Riwayat tabungan, penilaian sentra, dan foto kenangan tetap tersimpan utuh.</li>
                <li>Paspor Digital diterbitkan dengan tanda tangan digital tanpa watermark luar.</li>
                <li>Bila orang tua tidak memiliki santri aktif lain, hak akses dialihkan aman ke Alumni Universe.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || students.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                {loading ? 'Memproses Wisuda...' : 'Sahkan Kelulusan & Terbitkan Paspor'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
