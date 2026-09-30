import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  GraduationCap, 
  Baby, 
  HeartHandshake, 
  PlusCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  School,
  BookOpen
} from 'lucide-react';
import { FamilyTreeData, FamilyRelationMember } from '../../types/alumni';
import { alumniTransitionEngine } from '../../services/alumniTransitionEngine';

interface Props {
  parentUid?: string;
  onOpenPPDB?: () => void;
  onSelectMember?: (member: FamilyRelationMember) => void;
}

export const LegacyFamilyTree: React.FC<Props> = ({ parentUid, onOpenPPDB, onSelectMember }) => {
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddSiblingModal, setShowAddSiblingModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildRelation, setNewChildRelation] = useState<'Adik Kandung' | 'Sepupu'>('Adik Kandung');
  const [newChildProgram, setNewChildProgram] = useState<'TK A' | 'TK B' | 'PAUD TPA'>('TK A');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      setLoading(true);
      try {
        const data = await alumniTransitionEngine.getFamilyTree(parentUid);
        setTreeData(data);
      } catch (err) {
        console.error('Error fetching family tree:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, [parentUid]);

  const handleAddSiblingToPPDB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    if (treeData) {
      const newMember: FamilyRelationMember = {
        id: `mem-custom-${Date.now()}`,
        name: newChildName,
        roleType: 'CALON_PPDB_SEPUPU',
        relationLabel: `${newChildRelation} (Prioritas PPDB)`,
        classOrYear: `Pendaftaran ${newChildProgram} — Jalur Saudara Kandung`,
        gender: 'L',
        statusBadge: 'PPDB Prioritas',
        nisnOrRegNo: `REG-2026-${Math.floor(100 + Math.random() * 900)}`,
        currentMilestone: 'Slot Diprioritaskan via Jalur Keluarga Alumni'
      };

      setTreeData({
        ...treeData,
        totalChildrenInAsySyifa: treeData.totalChildrenInAsySyifa + 1,
        members: [...treeData.members, newMember]
      });

      // Record in Referral Engine
      alumniTransitionEngine.recordReferralShare({
        alumniUid: treeData.parentUid,
        alumniName: treeData.parentName,
        applicantName: newChildName,
        applicantPhone: treeData.parentPhone,
        applicantGender: 'L',
        programInterest: newChildProgram
      });

      setSuccessToast(`Alhamdulillah! Ananda ${newChildName} berhasil didaftarkan ke Jalur Prioritas Keluarga.`);
      setTimeout(() => setSuccessToast(null), 4000);
      setShowAddSiblingModal(false);
      setNewChildName('');
    }
  };

  if (loading || !treeData) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-stone-500 font-bold">Menghubungkan Pohon Silaturahmi Keluarga...</p>
      </div>
    );
  }

  return (
    <div id="legacy-family-tree-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-emerald-500/20 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> SPRINT G10 — POHON SILSILAH KELUARGA
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Legacy Family Tree & Hub Silaturahmi
            </h2>
            <p className="text-xs md:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              Merekam kesinambungan pendidikan Islami lintas generasi keluarga. Dari Kakak Alumni, Adik Santri Aktif, hingga pendaftaran prioritas adik/sepupu santri baru.
            </p>
          </div>

          <button
            id="btn-register-sibling"
            onClick={() => setShowAddSiblingModal(true)}
            className="self-start md:self-auto py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Daftarkan Adik / Sepupu (PPDB Prioritas)
          </button>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-white/5 pointer-events-none">
          <Users className="w-64 h-64" />
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Visual Tree Display */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-8">
        {/* Root Node: Orang Tua */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 border-2 border-amber-400/80 shadow-xl text-center max-w-md w-full relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xl mx-auto mb-2 border border-amber-400/40">
              🏡
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Kepala Keluarga / Wali Murid
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">{treeData.parentName}</h3>
            <p className="text-xs text-stone-300 mt-1">{treeData.address}</p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-around text-[11px] font-mono text-emerald-300">
              <span>{treeData.totalChildrenInAsySyifa} Generasi Santri</span>
              <span>•</span>
              <span>Kontak: {treeData.parentPhone}</span>
            </div>
          </div>

          {/* Trunk SVG Line */}
          <div className="w-1 h-10 bg-gradient-to-b from-amber-400 to-emerald-600 my-1 rounded-full"></div>
          <div className="w-24 h-1 bg-emerald-600 rounded-full"></div>
        </div>

        {/* Child Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {treeData.members.map((member, idx) => {
            const isAlumni = member.roleType === 'ALUMNI_KAKAK';
            const isActive = member.roleType === 'MURID_AKTIF';
            const isPPDB = member.roleType === 'CALON_PPDB_SEPUPU';

            return (
              <div
                key={member.id || idx}
                id={`family-member-card-${idx}`}
                className={`rounded-3xl p-5 border-2 flex flex-col justify-between transition hover:shadow-lg relative overflow-hidden ${
                  isAlumni
                    ? 'bg-amber-50/70 border-amber-300 text-slate-900'
                    : isActive
                    ? 'bg-emerald-50/70 border-emerald-400 text-slate-900'
                    : 'bg-teal-50/70 border-teal-300 text-slate-900'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      isAlumni
                        ? 'bg-amber-200 text-amber-950 border-amber-400'
                        : isActive
                        ? 'bg-emerald-200 text-emerald-950 border-emerald-500'
                        : 'bg-teal-200 text-teal-950 border-teal-400'
                    }`}
                  >
                    {member.statusBadge}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 font-bold">
                    {member.nisnOrRegNo}
                  </span>
                </div>

                {/* Body Content */}
                <div className="py-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-sm ${
                        isAlumni
                          ? 'bg-amber-600'
                          : isActive
                          ? 'bg-emerald-600'
                          : 'bg-teal-600'
                      }`}
                    >
                      {isAlumni ? <GraduationCap className="w-5 h-5" /> : isActive ? <School className="w-5 h-5" /> : <Baby className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                        {member.relationLabel}
                      </p>
                      <h4 className="text-base font-extrabold text-slate-900">{member.name}</h4>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-stone-700 bg-white/80 p-2.5 rounded-xl border border-stone-200">
                    {member.classOrYear}
                  </p>

                  <div className="flex items-start gap-2 text-xs text-stone-600 pt-1">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{member.currentMilestone}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-stone-200/80">
                  {isAlumni && (
                    <button
                      onClick={() => onSelectMember && onSelectMember(member)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5" /> Buka Paspor Alumni
                    </button>
                  )}
                  {isActive && (
                    <button
                      onClick={() => onSelectMember && onSelectMember(member)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Lihat Catatan Karakter
                    </button>
                  )}
                  {isPPDB && (
                    <button
                      onClick={onOpenPPDB}
                      className="w-full py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" /> Status Berkas PPDB
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sibling PPDB Priority Modal */}
      {showAddSiblingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-stone-200 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🌱
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Pendaftaran PPDB Jalur Saudara Kandung
                  </h3>
                  <p className="text-xs text-stone-500">
                    Prioritas kuota langsung untuk keluarga alumni & santri aktif.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddSiblingToPPDB} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Lengkap Calon Santri
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Yusuf Ibrahim"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hubungan Keluarga
                  </label>
                  <select
                    value={newChildRelation}
                    onChange={(e) => setNewChildRelation(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Adik Kandung">Adik Kandung</option>
                    <option value="Sepupu">Adik Sepupu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pilihan Jenjang
                  </label>
                  <select
                    value={newChildProgram}
                    onChange={(e) => setNewChildProgram(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="TK A">TK A (Usia 4-5 Th)</option>
                    <option value="TK B">TK B (Usia 5-6 Th)</option>
                    <option value="PAUD TPA">PAUD / Daycare TPA</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" /> Fasilitas Jalur Keluarga Asy Syifa:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                  <li>Bebas biaya formulir pendaftaran PPDB.</li>
                  <li>Jaminan kuota kelas tanpa antrean kuota umum.</li>
                  <li>Prioritas pemilihan sesi kelas & sentra belajar.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSiblingModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
                >
                  Simpan & Kunci Prioritas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
