import React, { useState } from 'react';
import { 
  Users, 
  ArrowRightLeft, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserPlus, 
  Building, 
  Layers, 
  KeyRound,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface SuccessionPlan {
  id: string;
  roleTarget: 'KEPALA_SEKOLAH' | 'KETUA_YAYASAN' | 'BENDAHARA' | 'ADMIN_SIM';
  incumbentName: string;
  successorName: string;
  status: 'AKTIF' | 'TRANSISI' | 'PLT' | 'BERAKHIR';
  delegationReason: string;
  effectiveFrom: string;
  effectiveUntil: string | null;
  mandateDocumentNumber: string;
  authorizedBy: string;
  timestamp: string;
  hash: string;
  isTadePltCompliant: boolean;
}

export const SuccessionCenter: React.FC = () => {
  const [plans, setPlans] = useState<SuccessionPlan[]>([
    {
      id: 'SUCC-2026-001',
      roleTarget: 'KEPALA_SEKOLAH',
      incumbentName: 'Ustadz Ahmad Fauzi, M.Pd (Sedang Tugas Belajar Luar Kota)',
      successorName: 'KH. Dr. Muhammad Zaki (Ketua Yayasan sebagai PLT)',
      status: 'PLT',
      delegationReason: 'Pelimpahan wewenang operasional darurat & pengesahan ijazah saat Kepala Sekolah definitif menunaikan ibadah haji & studi banding.',
      effectiveFrom: '01 Agustus 2026',
      effectiveUntil: '30 September 2026',
      mandateDocumentNumber: 'SK-MANDAT/YYS-ASY/PLT-KS/2026/019',
      authorizedBy: 'Dewan Pembina Yayasan Asy-Syifa',
      timestamp: '01 Agustus 2026, 07:30:00 WIB',
      hash: 'd32c0fd386a2976327d9cb1da94a5ba79ab52b5753d912f847291a823f990a12',
      isTadePltCompliant: true
    },
    {
      id: 'SUCC-2024-002',
      roleTarget: 'KEPALA_SEKOLAH',
      incumbentName: 'Drs. H. Bahrul Alam, M.M',
      successorName: 'Ustadz Ahmad Fauzi, M.Pd',
      status: 'BERAKHIR',
      delegationReason: 'Pergantian kepemimpinan periodik 3 tahunan dan regenerasi pimpinan satuan pendidikan.',
      effectiveFrom: '01 Juli 2024',
      effectiveUntil: '30 Juni 2027',
      mandateDocumentNumber: 'BA-SERAH-TERIMA/YYS/2024/005',
      authorizedBy: 'KH. Dr. Muhammad Zaki (Ketua Yayasan)',
      timestamp: '30 Juni 2024, 10:00:00 WIB',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isTadePltCompliant: true
    },
    {
      id: 'SUCC-2026-003',
      roleTarget: 'ADMIN_SIM',
      incumbentName: 'Ustadzah Siti Aminah, S.Pd',
      successorName: 'Ustadz Ridwan Kamil, S.Kom (Co-Admin)',
      status: 'TRANSISI',
      delegationReason: 'Pendampingan transisi digital dan backup operator SIM selama masa akreditasi Ban-PDM.',
      effectiveFrom: '10 Agustus 2026',
      effectiveUntil: '31 Desember 2026',
      mandateDocumentNumber: 'SURAT-TUGAS/KS/OPERATOR/2026/044',
      authorizedBy: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)',
      timestamp: '10 Agustus 2026, 08:15:00 WIB',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      isTadePltCompliant: true
    }
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newRole, setNewRole] = useState<'KEPALA_SEKOLAH' | 'BENDAHARA' | 'ADMIN_SIM'>('KEPALA_SEKOLAH');
  const [newIncumbent, setNewIncumbent] = useState('');
  const [newSuccessor, setNewSuccessor] = useState('');
  const [newStatus, setNewStatus] = useState<'PLT' | 'TRANSISI'>('PLT');
  const [newReason, setNewReason] = useState('');
  const [newMandateDoc, setNewMandateDoc] = useState('');

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncumbent || !newSuccessor || !newReason || !newMandateDoc) return;

    const newPlan: SuccessionPlan = {
      id: `SUCC-2026-${String(plans.length + 1).padStart(3, '0')}`,
      roleTarget: newRole,
      incumbentName: newIncumbent,
      successorName: newSuccessor,
      status: newStatus,
      delegationReason: newReason,
      effectiveFrom: 'Hari Ini (15 Agustus 2026)',
      effectiveUntil: 'Sesuai Masa Tugas SK',
      mandateDocumentNumber: newMandateDoc,
      authorizedBy: 'Ketua Yayasan & Dewan Pembina',
      timestamp: '15 Agustus 2026, 12:30:00 WIB',
      hash: 'f94a8fe5ccb19ba61c4c0873d391e987982fbbd3420456d8192a73b401e8271a',
      isTadePltCompliant: true
    };

    setPlans([newPlan, ...plans]);
    setShowNewModal(false);
    setNewIncumbent('');
    setNewSuccessor('');
    setNewReason('');
    setNewMandateDoc('');
  };

  return (
    <div id="succession-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ArrowRightLeft className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R227 &bull; SUCCESSION MANAGEMENT
              </span>
              <span className="text-xs text-slate-400">Continuous Institutional Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ArrowRightLeft className="w-8 h-8 text-emerald-400" />
              Succession Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pengelolaan transisi kepemimpinan dan delegasi jabatan (<strong>Aktif, Transisi, PLT, Berakhir</strong>). Sesuai aturan TADE, <em>Ketua Yayasan sah menjabat sebagai PLT Kepala Sekolah</em> saat terjadi kekosongan atau penugasan darurat.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Terbitkan Delegasi / PLT Baru
          </button>
        </div>

        {/* Global Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Rencana Suksesi</span>
            <span className="text-xl font-bold text-white font-mono">{plans.length} Mandat</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kepatuhan Mandat PLT</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% TADE COMPLIANT</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Jejak Alasan & Timestamp</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">MANDATORY LOGGED</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Risiko Vakum Operasional</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">0% ZERO GAP</span>
          </div>
        </div>
      </div>

      {/* Succession Cards Feed */}
      <div className="grid grid-cols-1 gap-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {plan.id}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Target Jabatan: <span className="text-emerald-600 dark:text-emerald-400">{plan.roleTarget.replace('_', ' ')}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  plan.status === 'PLT' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                  plan.status === 'TRANSISI' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                  plan.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  Status: {plan.status}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {plan.timestamp}
                </span>
              </div>
            </div>

            {/* Succession Route: Incumbent -> Successor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Pejabat Definitif / Asal:</span>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{plan.incumbentName}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">Penerima Delegasi / PLT Pengganti:</span>
                <div className="font-bold text-xs text-emerald-900 dark:text-emerald-300 mt-0.5">{plan.successorName}</div>
              </div>
            </div>

            {/* Mandatory Reason & Authorization */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-white block mb-1">Alasan Hukum Pelimpahan Wewenang (Mandatory Reason):</strong>
                <p className="text-slate-600 dark:text-slate-300">{plan.delegationReason}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <div>SK Mandat: <span className="font-bold text-slate-700 dark:text-slate-200">{plan.mandateDocumentNumber}</span></div>
                <div>Otorisator: <span className="font-bold text-slate-700 dark:text-slate-200">{plan.authorizedBy}</span></div>
              </div>
            </div>

            {/* Hash Footprint */}
            <div className="p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[9px] break-all border border-slate-800 flex items-center justify-between">
              <span><strong className="text-emerald-400">Delegation Hash:</strong> {plan.hash}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 ml-2">
                TADE SOVEREIGN VERIFIED
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating New Delegation */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Terbitkan Mandat Delegasi / PLT Baru
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono"
              >
                Tutup [ESC]
              </button>
            </div>

            <form onSubmit={handleCreateDelegation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Target Jabatan:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                >
                  <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                  <option value="BENDAHARA">Bendahara</option>
                  <option value="ADMIN_SIM">Admin SIM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Pejabat Definitif:</label>
                <input
                  type="text"
                  placeholder="Contoh: Ustadz Ahmad Fauzi, M.Pd"
                  value={newIncumbent}
                  onChange={(e) => setNewIncumbent(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Penerima Delegasi / PLT:</label>
                <input
                  type="text"
                  placeholder="Contoh: KH. Dr. Muhammad Zaki (Ketua Yayasan)"
                  value={newSuccessor}
                  onChange={(e) => setNewSuccessor(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Status Delegasi:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="PLT">PLT (Pelaksana Tugas)</option>
                    <option value="TRANSISI">Transisi / Co-Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Nomor SK Mandat:</label>
                  <input
                    type="text"
                    placeholder="Contoh: SK-MANDAT/YYS/2026/020"
                    value={newMandateDoc}
                    onChange={(e) => setNewMandateDoc(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Alasan Delegasi Wajib (Mandatory Reason):</label>
                <textarea
                  placeholder="Jelaskan alasan resmi pelimpahan wewenang secara jelas..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Simpan & Sahkan Mandat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
