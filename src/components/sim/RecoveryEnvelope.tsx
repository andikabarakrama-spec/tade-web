import React, { useState } from 'react';
import {
  Printer,
  ShieldAlert,
  Lock,
  KeyRound,
  QrCode,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Check,
  Building2,
  FileText
} from 'lucide-react';

interface RecoveryEnvelopeProps {
  rootId: string;
  recoveryToken: string;
  generatedDate: string;
  onRotate?: () => void;
}

export const RecoveryEnvelope: React.FC<RecoveryEnvelopeProps> = ({
  rootId,
  recoveryToken,
  generatedDate,
  onRotate
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Air-Gapped Physical Recovery Envelope</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cetak kartu fisik ini dan simpan di brankas fisik tahan api (Air-Gapped Vault).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Token'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen Fisik</span>
          </button>
        </div>
      </div>

      {/* Printable Physical Envelope Card */}
      <div className="p-8 bg-amber-50/40 dark:bg-slate-950 border-2 border-dashed border-amber-600/60 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-xl relative overflow-hidden font-sans">
        {/* Seal Stamp Top Right */}
        <div className="absolute top-6 right-6 border-2 border-red-600 rounded-full w-24 h-24 flex flex-col items-center justify-center text-red-600 font-mono font-black text-[9px] uppercase rotate-12 opacity-80 pointer-events-none text-center p-1">
          <span>TOP SECRET</span>
          <span>AIR-GAPPED</span>
          <span>1-TIME USE</span>
        </div>

        <div className="flex items-center space-x-3 border-b border-amber-300 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-800 dark:text-amber-400 block uppercase">
              TADE CONSTITUTION v12.2 SOVEREIGN VAULT
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              KARTU PEMULIHAN ROOT DARURAT (1-TIME)
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">SOVEREIGN ROOT ID:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{rootId}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">TANGGAL PENERBITAN:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{generatedDate}</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-500/50 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-800 dark:text-amber-400">CRYPTOGRAPHIC RECOVERY SEED:</span>
              <span className="font-mono text-[10px] text-red-600 dark:text-red-400 font-bold">HANGUS SETELAH 1x DIGUNAKAN</span>
            </div>
            <div className="font-mono text-sm bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold select-all tracking-wider text-center break-all">
              {recoveryToken}
            </div>
          </div>

          <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
            <span className="font-bold text-amber-900 dark:text-amber-200 block flex items-center space-x-1">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
              <span>Instruksi Penanganan Dokumen Fisik:</span>
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[10px]">
              <li>Lipat dan masukkan lembar ini ke dalam amplop tertutup bersurat segel lilin/tamper seal.</li>
              <li>Jangan pernah menyimpan foto digital token ini di cloud publik atau aplikasi chatting.</li>
              <li>Jika token ini digunakan untuk login darurat, sistem TADE akan secara otomatis menghanguskannya dan menerbitkan token baru.</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-amber-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>TADE PLATFORM SOVEREIGNTY</span>
          <span>ZERO REGRESSION CERTIFIED</span>
        </div>
      </div>
    </div>
  );
};
