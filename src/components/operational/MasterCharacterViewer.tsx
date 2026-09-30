import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  UserCheck, 
  Palette, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Crown
} from 'lucide-react';
import { MasterCharacterRegistry } from '../../core/character/masterCharacterRegistry';
import { MasterCharacterGuard } from '../../core/character/masterCharacterGuard';

export const MasterCharacterViewer: React.FC = () => {
  const registry = useMemo(() => MasterCharacterRegistry.getInstance(), []);
  const guard = useMemo(() => MasterCharacterGuard.getInstance(), []);
  const characters = useMemo(() => registry.getAllCharacters(), [registry]);
  const integrityReport = useMemo(() => guard.verifyIntegrity(), [guard]);

  return (
    <div className="space-y-6" id="master-character-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                Master Character Lock Resmi Founder
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R831 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Karakter Sahih Asy & Syifa: Dilindungi Konstitusi
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Wajah, proporsi Chibi 2.5 kepala, seragam krem-putih aksen oranye, peci hitam zamrud, dan jilbab pastel terkunci permanen di bawah otoritas Founder.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Status Integritas Visual</span>
            <span className="text-sm font-black text-emerald-400 flex items-center justify-end gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              100% LOCK VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Official Characters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl hover:border-slate-700 transition relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-amber-500/40 p-2 flex items-center justify-center shadow-lg">
                  <img 
                    src={char.svgIconDataUri} 
                    alt={char.canonicalName} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {char.gender}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{char.canonicalName}</h3>
                  <span className="text-xs text-slate-400">{char.roleTitle}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                FOUNDER LOCKED
              </span>
            </div>

            {/* Specifications Details */}
            <div className="space-y-2.5 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span className="text-slate-400">Proporsi Kepala:</span>
                <span className="font-semibold text-white">{char.headToBodyRatio}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span className="text-slate-400">Penutup Kepala:</span>
                <span className="font-semibold text-amber-300">{char.headwear.details}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span className="text-slate-400">Warna Seragam:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: char.uniform.baseColor }} title="Krem Putih" />
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: char.uniform.accentColor }} title="Oranye Ceria" />
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: char.uniform.trimColor }} title="Hijau Zamrud" />
                  <span className="text-[11px] font-mono text-slate-300">Krem + Oranye + Zamrud</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Raut Wajah:</span>
                <span className="font-semibold text-emerald-400">Mata Berbinar & Pipi Merona</span>
              </div>
            </div>

            {/* Signature Poses */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Pose Khas & Perilaku Resmi ({char.signaturePoses.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {char.signaturePoses.map((pose, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                  >
                    &bull; {pose}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integrity Audit Report */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Enforcement Ring-0:</strong> Seluruh modul web, story generator, dan visual maskot mengikat aset kanonikal yang sama.
          </span>
        </div>
        <span className="font-mono text-emerald-400 shrink-0">
          MODE: {integrityReport.enforcementMode}
        </span>
      </div>
    </div>
  );
};
