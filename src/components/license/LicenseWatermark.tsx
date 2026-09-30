import React from 'react';
import { LicenseEngine } from '../../services/license/LicenseEngine';
import { ShieldAlert, Sparkles } from 'lucide-react';

export const LicenseWatermark: React.FC = () => {
  const license = LicenseEngine.getLicense();

  // Show watermark if manually enabled or if in TRIAL, READ_ONLY, or EXPIRED mode
  const isTrial = license.licenseType === 'TRIAL' || license.status === 'TRIAL';
  const isReadOnly = license.status === 'READ_ONLY' || license.status === 'EXPIRED';
  const isWatermarkActive = license.watermarkEnabled || isTrial || isReadOnly;

  if (!isWatermarkActive) {
    return null;
  }

  const label = isReadOnly
    ? 'SAFE MODE: READ-ONLY (DATA TERLINDUNGI)'
    : isTrial
    ? `TADE TRIAL EDITION - ${license.schoolName.toUpperCase()}`
    : `TADE ENTERPRISE WATERMARK - ${license.schoolName.toUpperCase()}`;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden flex items-center justify-center opacity-15 select-none">
      <div className="transform -rotate-12 flex flex-col items-center justify-center text-center space-y-2 border-4 border-dashed border-slate-700 p-8 rounded-3xl bg-slate-950/20 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-black text-2xl tracking-widest font-mono">
          {isReadOnly ? <ShieldAlert className="w-8 h-8 text-amber-500" /> : <Sparkles className="w-8 h-8 text-sky-500" />}
          <span>{label}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-bold text-sm tracking-wider uppercase font-mono">
          SIM TK ASY SYIFA TADE v1.0.5 LTS • Lisensi ID: {license.licenseId}
        </p>
      </div>
    </div>
  );
};
