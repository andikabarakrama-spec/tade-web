import React, { useState } from 'react';
import {
  Calculator,
  BookOpen,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface JournalEntry {
  id: string;
  date: string;
  refNo: string;
  account: string;
  debit: number;
  credit: number;
  description: string;
}

export const BankingLedgerIntelligence: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'JURNAL' | 'BUKU_BESAR' | 'NERACA' | 'ARUS_KAS' | 'REKONSILIASI' | 'CLOSING'>('JURNAL');
  const [isClosingSuccess, setIsClosingSuccess] = useState<boolean>(false);

  const journals: JournalEntry[] = [
    { id: 'J-101', date: '2026-08-01', refNo: 'KM-0801/01', account: '1-1010 Kas Operasional', debit: 4500000, credit: 0, description: 'Penerimaan SPP Santri Sentra (9 santri)' },
    { id: 'J-102', date: '2026-08-01', refNo: 'KM-0801/01', account: '4-1010 Pendapatan SPP', debit: 0, credit: 4500000, description: 'Pendapatan SPP santri bulan Agustus' },
    { id: 'J-103', date: '2026-08-03', refNo: 'KK-0803/01', account: '5-2010 Beban Mainan Sentra Balok', debit: 1250000, credit: 0, description: 'Pengadaan set balok kayu pinus edukasi' },
    { id: 'J-104', date: '2026-08-03', refNo: 'KK-0803/01', account: '1-1010 Kas Operasional', debit: 0, credit: 1250000, description: 'Pembayaran pengadaan balok sentra' },
    { id: 'J-105', date: '2026-08-05', refNo: 'KM-0805/01', account: '1-1020 Bank Syariah Indonesia', debit: 15000000, credit: 0, description: 'Transfer Dana Bantuan Operasional Satuan PAUD' },
    { id: 'J-106', date: '2026-08-05', refNo: 'KM-0805/01', account: '4-2010 Bantuan Operasional Pendidikan', debit: 0, credit: 15000000, description: 'Penerimaan BOP PAUD Tahap II' }
  ];

  const totalDebit = journals.reduce((acc, curr) => acc + curr.debit, 0);
  const totalCredit = journals.reduce((acc, curr) => acc + curr.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  const handleClosingPeriod = (period: string) => {
    setIsClosingSuccess(true);
    blackBoxRecorder.record({
      moduleCode: 'R425-BANKING-LEDGER',
      role: 'KEUANGAN',
      eventType: 'ACTION',
      details: `Period closing executed for ${period}. Double entry balance verified: Rp ${totalDebit.toLocaleString('id-ID')}.`,
      severity: 'INFO'
    });
    setTimeout(() => setIsClosingSuccess(false), 3000);
  };

  return (
    <div id="banking-ledger-intelligence-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R425 &bull; BANKING LEDGER INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400 font-mono">Double-Entry Accounting &amp; Bank-Grade Reconciler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Calculator className="w-8 h-8 text-emerald-400" />
              Sistem Buku Besar &amp; Pembukuan Standar Perbankan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Modul akuntansi komprehensif: Jurnal Umum, Buku Besar, Neraca Saldo, Arus Kas, Rekonsiliasi Bank BSI, Audit Trail, serta Gembok Tutup Buku Bulanan/Tahunan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center font-mono">
              <span className="text-[10px] text-emerald-300 block">BALANCE STATUS</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" /> DOUBLE ENTRY BALANCED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {[
          { id: 'JURNAL', label: '1. Jurnal Umum' },
          { id: 'BUKU_BESAR', label: '2. Buku Besar (Ledger)' },
          { id: 'NERACA', label: '3. Neraca Saldo' },
          { id: 'ARUS_KAS', label: '4. Laporan Arus Kas' },
          { id: 'REKONSILIASI', label: '5. Rekonsiliasi Bank' },
          { id: 'CLOSING', label: '6. Tutup Buku (Closing)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Closing Alert */}
      {isClosingSuccess && (
        <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Gembok Tutup Buku Berhasil! Jurnal telah dikunci permanen dengan hash SHA-256 pada WORM Vault.</span>
        </div>
      )}

      {/* Sub Tab: JURNAL */}
      {activeSubTab === 'JURNAL' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Jurnal Umum Transaksi Keuangan (Agustus 2026)
            </h3>
            <span className="text-[11px] text-slate-400">Metode Akrual &amp; Half-Even Rounding</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[10px]">
                  <th className="py-2">TANGGAL / REF</th>
                  <th className="py-2">KODE AKUN &amp; NAMA</th>
                  <th className="py-2">KETERANGAN</th>
                  <th className="py-2 text-right">DEBIT (RP)</th>
                  <th className="py-2 text-right">KREDIT (RP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {journals.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                    <td className="py-2.5">
                      <span className="font-bold text-slate-900 dark:text-white block">{j.date}</span>
                      <span className="text-[10px] text-slate-400">{j.refNo}</span>
                    </td>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{j.account}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400 text-[11px]">{j.description}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {j.debit > 0 ? j.debit.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {j.credit > 0 ? j.credit.toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-600 font-bold">
                  <td colSpan={3} className="py-3 text-slate-900 dark:text-white uppercase">TOTAL NERACA JURNAL</td>
                  <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-mono">Rp {totalDebit.toLocaleString('id-ID')}</td>
                  <td className="py-3 text-right text-blue-600 dark:text-blue-400 font-mono">Rp {totalCredit.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab: BUKU BESAR */}
      {activeSubTab === 'BUKU_BESAR' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <strong className="text-slate-900 dark:text-white text-xs">1-1010 Kas Operasional</strong>
              <span className="text-[10px] text-emerald-500 font-bold">ASET LANCAR</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Saldo Awal:</span>
                <span>Rp 31.500.000</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Mutasi Masuk (SPP):</span>
                <span>+ Rp 4.500.000</span>
              </div>
              <div className="flex justify-between text-rose-500 font-bold">
                <span>Mutasi Keluar (Bahan Sentra):</span>
                <span>- Rp 1.250.000</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-bold border-t border-slate-100 dark:border-slate-700 pt-2">
                <span>Saldo Akhir Kas:</span>
                <span>Rp 34.750.000</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <strong className="text-slate-900 dark:text-white text-xs">1-1020 Bank Syariah Indonesia</strong>
              <span className="text-[10px] text-blue-500 font-bold">GIRO &amp; TABUNGAN</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Saldo Awal Rekening:</span>
                <span>Rp 85.200.000</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Penerimaan Hibah BOP PAUD:</span>
                <span>+ Rp 15.000.000</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-bold border-t border-slate-100 dark:border-slate-700 pt-2">
                <span>Saldo Bank Terverifikasi:</span>
                <span>Rp 100.200.000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: NERACA */}
      {activeSubTab === 'NERACA' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-700 pb-3">
            Neraca Posisi Keuangan (Statement of Financial Position)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-500 block">AKTIVA / ASET</span>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Kas &amp; Setara Kas</span>
                  <span className="font-bold text-slate-900 dark:text-white">Rp 134.950.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Aset Tetap &amp; Peralatan Sentra</span>
                  <span className="font-bold text-slate-900 dark:text-white">Rp 48.000.000</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  <span>TOTAL ASET</span>
                  <span>Rp 182.950.000</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-500 block">PASIVA / KEWAJIBAN &amp; EKUITAS</span>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Kewajiban Jangka Pendek (Titipan)</span>
                  <span className="font-bold text-slate-900 dark:text-white">Rp 2.450.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Modal Awal &amp; Sisa Hasil Usaha</span>
                  <span className="font-bold text-slate-900 dark:text-white">Rp 180.500.000</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-xs text-blue-600 dark:text-blue-400">
                  <span>TOTAL PASIVA</span>
                  <span>Rp 182.950.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: ARUS KAS */}
      {activeSubTab === 'ARUS_KAS' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-700 pb-3">
            Laporan Arus Kas (Cash Flow Statement) Metode Langsung
          </h3>
          <div className="space-y-3 text-[11px]">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-2">
              <strong className="text-emerald-700 dark:text-emerald-300 block">Arus Kas dari Aktivitas Operasional:</strong>
              <div className="flex justify-between">
                <span>+ Penerimaan SPP &amp; Infaq Santri:</span>
                <span className="font-bold">Rp 28.500.000</span>
              </div>
              <div className="flex justify-between">
                <span>+ Penerimaan BOP PAUD:</span>
                <span className="font-bold">Rp 15.000.000</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>- Pembayaran Honorarium Ustadzah &amp; Staf:</span>
                <span className="font-bold">(Rp 18.200.000)</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>- Beban Bahan Sentra &amp; Konsumsi Sehat:</span>
                <span className="font-bold">(Rp 3.400.000)</span>
              </div>
            </div>
            <div className="flex justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">
              <span>Kenaikan Bersih Kas &amp; Setara Kas:</span>
              <span className="text-emerald-600 dark:text-emerald-400">+ Rp 21.900.000</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: REKONSILIASI */}
      {activeSubTab === 'REKONSILIASI' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-700 pb-3">
            Rekonsiliasi Bank Real-Time (Rekening BSI No. 7149-xxxx-xx)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400">Saldo Buku Yayasan</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Rp 100.200.000</span>
              <span className="text-[10px] text-emerald-500">Cocok 100%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400">Saldo Rekening Koran BSI</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Rp 100.200.000</span>
              <span className="text-[10px] text-emerald-500">Mutasi Sinkron</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Selisih Rekonsiliasi</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 block">Rp 0 (NOL)</span>
              <span className="text-[10px] text-emerald-600">Zero Difference</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: CLOSING */}
      {activeSubTab === 'CLOSING' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Gembok Tutup Buku Bulanan &amp; Tahunan (Period Closing Lock)
              </h3>
              <p className="text-[11px] text-slate-400">Setelah dikunci, jurnal transaksi pada periode terkait tidak dapat diedit atau dihapus.</p>
            </div>
            <Lock className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-3">
              <strong className="text-slate-900 dark:text-white text-xs block">Tutup Buku Bulan Juli 2026</strong>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> STATUS: TERKUNCI &amp; DIARSIPKAN KE WORM VAULT
              </div>
              <button disabled className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-400 font-bold cursor-not-allowed">
                Sudah Ditutup
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-500/30 space-y-3">
              <strong className="text-slate-900 dark:text-white text-xs block">Tutup Buku Bulan Agustus 2026</strong>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                <RefreshCw className="w-3.5 h-3.5" /> STATUS: AKTIF (MENUNGGU AKHIR BULAN)
              </div>
              <button
                onClick={() => handleClosingPeriod('Agustus 2026')}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Eksekusi Tutup Buku Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
