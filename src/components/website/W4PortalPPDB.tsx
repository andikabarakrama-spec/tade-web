import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PPDBRecord, PPDBLifecycleConfig } from '../../types';
import { DataService } from '../../services/db';
import { LivingPageDecorator } from '../garden/LivingPageDecorator';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { ImmersiveWorldLandscape } from '../garden/ImmersiveWorldLandscape';
import {
  Heart,
  CheckCircle,
  Search,
  FileText,
  DollarSign,
  Download,
  AlertCircle,
  UserPlus,
  Calendar,
  Lock
} from 'lucide-react';

import { PPDBJourneyTimeline } from './PPDBJourneyTimeline';

export const W4PortalPPDB: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'check' | 'fees'>('form');
  const [lifecycle, setLifecycle] = useState<PPDBLifecycleConfig | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    DataService.getPPDBLifecycleConfig().then((cfg) => {
      if (mounted) setLifecycle(cfg);
    }).catch(console.error);
    return () => {
      mounted = false;
    };
  }, []);

  const ppdbStatus = React.useMemo(() => {
    return DataService.checkPPDBStatus(lifecycle || undefined);
  }, [lifecycle]);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    nickname: '',
    nik: '',
    birthPlace: 'Jember',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    groupChoice: 'Kelompok A' as 'Kelompok A' | 'Kelompok B' | 'PAUD/TPA',
    fatherName: '',
    fatherJob: '',
    motherName: '',
    motherJob: '',
    address: '',
    phone: '',
    distanceKm: 1.0
  });

  const [createdRegNo, setCreatedRegNo] = useState<string | null>(null);

  // Status Search State
  const [searchNo, setSearchNo] = useState('');
  const [searchResult, setSearchResult] = useState<PPDBRecord | null>(null);
  const [searchSearched, setSearchSearched] = useState(false);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppdbStatus.isOpen) {
      alert(`Mohon maaf: ${ppdbStatus.message}`);
      return;
    }

    if (!formData.studentName || !formData.nik || !formData.phone) {
      alert('Mohon lengkapi Nama Calon Siswa, NIK, dan No Whatsapp.');
      return;
    }

    const newRegNo = `PPDB-${lifecycle?.academicYear.split('/')[0] || '2026'}-${String(Math.floor(100 + Math.random() * 900))}`;
    const newRecord: PPDBRecord = {
      id: 'ppdb-' + Date.now(),
      registrationNo: newRegNo,
      studentName: formData.studentName,
      nickname: formData.nickname || formData.studentName.split(' ')[0],
      nik: formData.nik,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate || '2021-01-01',
      gender: formData.gender,
      religion: 'Islam',
      address: formData.address || 'Tanggul Jember',
      distanceKm: Number(formData.distanceKm),
      groupChoice: formData.groupChoice,
      fatherName: formData.fatherName,
      fatherJob: formData.fatherJob,
      motherName: formData.motherName,
      motherJob: formData.motherJob,
      phone: formData.phone,
      status: 'Menunggu',
      registeredAt: new Date().toISOString().split('T')[0],
      wave: lifecycle?.currentWave || 'Gelombang 1',
      isPaidFee: false,
      notes: `Pendaftaran via Portal PPDB TA ${lifecycle?.academicYear || '2026/2027'}`
    };

    const saved = await DataService.savePPDBRecord(newRecord);
    if (saved && saved.registrationNo !== newRegNo) {
      setDuplicateNotice(
        `Calon siswa ini telah terdaftar sebelumnya dengan Nomor Registrasi: ${saved.registrationNo}. Sesuai prinsip integritas (1 Calon Siswa = 1 Pendaftaran), sistem menampilkan berkas registrasi resmi yang telah tercatat.`
      );
      setCreatedRegNo(saved.registrationNo);
    } else {
      setDuplicateNotice(null);
      setCreatedRegNo(newRegNo);
    }
  };

  const handleCheckStatus = async () => {
    if (!searchNo) return;
    const list = await DataService.getPPDBRecords();
    const found = list.find(r => r.registrationNo.toLowerCase() === searchNo.trim().toLowerCase() || r.nik === searchNo.trim());
    setSearchResult(found || null);
    setSearchSearched(true);
  };

  return (
    <ImmersiveWorldLandscape>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      <LivingPageDecorator pageName="PPDB" />
      {/* Page Title & Kindergarten Welcome Gate Header - Journey Step Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl text-center space-y-4 relative overflow-hidden border-2 border-amber-400/80"
      >
        <div className="absolute top-4 left-6 text-2xl animate-float-slow opacity-80">🎈</div>
        <div className="absolute top-8 right-8 text-2xl animate-bounce opacity-80 duration-1000">🎈</div>
        <div className="absolute -bottom-8 left-1/3 text-4xl opacity-20 pointer-events-none">🏫</div>

        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-950 bg-amber-400 px-4 py-1.5 rounded-full shadow-md border-2 border-amber-300">
          <UserPlus className="w-4 h-4 text-slate-950" />
          LOKASI WORLD: GERBANG PENDAFTARAN & POS REGISTRASI
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Selamat Datang Calon Bintang Asy Syifa!
        </h1>
        <p className="text-stone-200 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Daftarkan putra-putri tercinta di TK Asy Syifa Tanggul secara online, cepat, dan transparan. Dek Syifa siap menyambut teman-teman baru dengan senyuman hangat!
        </p>

        {/* Dek Syifa Mascot Greeting Card */}
        <div className="max-w-xl mx-auto bg-emerald-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-400/50 text-left flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shrink-0 font-bold">
            👶
          </div>
          <p className="text-xs text-amber-200 italic leading-snug">
            “Ayah & Bunda, tempat belajar dan bermainku sangat seru dan nyaman. Mari bergabung bersama Dek Syifa!”
          </p>
        </div>

        {/* AI Asy Character Mascot Welcoming Scene */}
        <AIAsyCharacterScene pageContext="w4PPDB" />

        {/* Tab Subnav */}
        <div className="inline-flex flex-wrap items-center justify-center bg-emerald-950/90 p-2 rounded-2xl border border-emerald-700/80 mt-4 gap-2 shadow-inner">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'form' ? 'bg-amber-400 text-slate-950 shadow-md scale-105' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" /> 1. Formulir Pendaftaran
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'check' ? 'bg-amber-400 text-slate-950 shadow-md scale-105' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" /> 2. Cek Status Verifikasi
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'fees' ? 'bg-amber-400 text-slate-950 shadow-md scale-105' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" /> 3. Rincian Biaya & Brosur
          </button>
        </div>
      </motion.div>

      {/* PPDB Journey Timeline & Progress Visualization */}
      <PPDBJourneyTimeline onStartForm={() => setActiveTab('form')} />

      {/* Tab 1: Formulir Pendaftaran */}
      {activeTab === 'form' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-5xl mx-auto space-y-8">
          {/* PPDB Interactive Stepper Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">1</span>
              <span className="text-xs font-bold text-emerald-900">Data Calon Siswa</span>
            </div>
            <div className="h-0.5 w-12 bg-emerald-300"></div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">2</span>
              <span className="text-xs font-bold text-emerald-900">Data Orang Tua</span>
            </div>
            <div className="h-0.5 w-12 bg-emerald-300"></div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">3</span>
              <span className="text-xs font-bold text-emerald-900">Konfirmasi</span>
            </div>
          </div>

          {createdRegNo ? (
            <div className="text-center py-10 space-y-6 bg-gradient-to-b from-amber-50 via-white to-emerald-50 p-8 rounded-3xl border-2 border-amber-300 shadow-xl relative overflow-hidden">
              <div className="absolute top-4 left-6 text-3xl animate-bounce">🎉</div>
              <div className="absolute top-6 right-8 text-3xl animate-bounce delay-300">🎈</div>
              <div className="absolute bottom-4 left-10 text-3xl animate-pulse">⭐</div>
              <div className="absolute bottom-6 right-12 text-3xl animate-pulse delay-500">✨</div>

              <div className="w-20 h-20 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg text-4xl border-2 border-amber-300">
                👶
              </div>

              <div className="space-y-2">
                <span className="bg-emerald-800 text-amber-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                  Pendaftaran PPDB Berhasil!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Selamat Datang Calon Bintang Asy Syifa!
                </h2>
                <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto font-bold leading-relaxed">
                  Dek Syifa & Ustadzah di sekolah sangat senang dan tidak sabar ingin belajar bersama Ananda!
                </p>
              </div>

              <div className="inline-block bg-white border-4 border-amber-400 px-8 py-4 rounded-3xl text-2xl sm:text-3xl font-black text-emerald-900 tracking-wider shadow-md">
                {createdRegNo}
              </div>

              {duplicateNotice && (
                <div className="p-4 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-semibold max-w-lg mx-auto text-left flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <p>{duplicateNotice}</p>
                </div>
              )}

              <p className="text-xs text-stone-600 max-w-md mx-auto font-medium">
                Simpan nomor registrasi di atas untuk melakukan pengecekan status verifikasi & jadwal observasi.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setCreatedRegNo(null);
                    setFormData({
                      studentName: '',
                      nickname: '',
                      nik: '',
                      birthPlace: 'Jember',
                      birthDate: '',
                      gender: 'Laki-laki',
                      groupChoice: 'Kelompok A',
                      fatherName: '',
                      fatherJob: '',
                      motherName: '',
                      motherJob: '',
                      address: '',
                      phone: '',
                      distanceKm: 1.0
                    });
                  }}
                  className="px-6 py-3 rounded-2xl bg-stone-200 hover:bg-stone-300 text-slate-900 text-xs font-black transition shadow-xs"
                >
                  Daftar Siswa Lain
                </button>
                <button
                  onClick={() => setActiveTab('check')}
                  className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 text-xs font-black transition shadow-md border-2 border-amber-400"
                >
                  Cek Status Pendaftaran
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Input */}
              <form onSubmit={handleSubmitForm} className="lg:col-span-8 space-y-6">
                {/* PPDB Lifecycle Status Banner */}
                {!ppdbStatus.isOpen ? (
                  <div className="p-5 rounded-3xl bg-stone-100 border-2 border-stone-300 space-y-2">
                    <div className="flex items-center gap-2 text-stone-800">
                      <Lock className="w-5 h-5 text-stone-600" />
                      <h3 className="font-extrabold text-sm sm:text-base">
                        {ppdbStatus.status === 'NOT_STARTED'
                          ? 'Pendaftaran PPDB Online Belum Dibuka'
                          : ppdbStatus.status === 'EXPIRED'
                          ? 'Pendaftaran PPDB Online Periode Ini Telah Ditutup'
                          : 'Pendaftaran PPDB Online Saat Ini Sedang Ditutup'}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {ppdbStatus.message}
                    </p>
                    {lifecycle?.notes && (
                      <p className="text-[11px] text-stone-500 italic bg-stone-200/60 p-2.5 rounded-xl">
                        Catatan Panitia PPDB: {lifecycle.notes}
                      </p>
                    )}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('check')}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Cek Status Berkas Pendaftaran Sebelumnya
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs text-emerald-900">
                      <UserPlus className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        <strong>Pendaftaran Dibuka:</strong> {lifecycle?.currentWave || 'Gelombang 1'} Tahun Ajaran {lifecycle?.academicYear || '2026/2027'} (Sisa Kuota Terbuka).
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                      Aktif
                    </span>
                  </div>
                )}

                <div className="border-b border-stone-200 pb-3">
                  <h2 className="text-base font-bold text-slate-900">1. Data Calon Siswa</h2>
                  <p className="text-xs text-stone-500">Isi data lengkap calon siswa sesuai Akta Kelahiran/Kartu Keluarga.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Nama Lengkap Siswa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Rayyan Al-Fatih"
                      value={formData.studentName}
                      onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Nama Panggilan *</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rayyan"
                      value={formData.nickname}
                      onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">NIK (Nomor Induk Kependudukan) *</label>
                    <input
                      type="text"
                      required
                      placeholder="16 digit NIK Anak di KK"
                      value={formData.nik}
                      onChange={e => setFormData({ ...formData, nik: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Jenis Kelamin</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Tempat / Tanggal Lahir</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Tempat"
                        value={formData.birthPlace}
                        onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-stone-300"
                      />
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Pilihan Kelompok Belajar</label>
                    <select
                      value={formData.groupChoice}
                      onChange={e => setFormData({ ...formData, groupChoice: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Kelompok A">Kelompok A (Usia 4 - 5 Tahun)</option>
                      <option value="Kelompok B">Kelompok B (Usia 5 - 6 Tahun)</option>
                      <option value="PAUD/TPA">PAUD / TPA (Usia 2.5 - 4 Tahun)</option>
                    </select>
                  </div>
                </div>

                <div className="border-b border-stone-200 pb-3 pt-4">
                  <h2 className="text-base font-bold text-slate-900">2. Data Orang Tua & Kontak</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Nama Ayah Kandung</label>
                    <input
                      type="text"
                      placeholder="Nama Ayah"
                      value={formData.fatherName}
                      onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Pekerjaan Ayah</label>
                    <input
                      type="text"
                      placeholder="Wiraswasta / PNS / Swasta"
                      value={formData.fatherJob}
                      onChange={e => setFormData({ ...formData, fatherJob: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Nama Ibu Kandung</label>
                    <input
                      type="text"
                      placeholder="Nama Ibu"
                      value={formData.motherName}
                      onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">No. WhatsApp Aktif *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Alamat Tempat Tinggal Lengkap</label>
                    <textarea
                      rows={2}
                      placeholder="Alamat RT/RW, Dusun, Desa, Kecamatan Tanggul"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {!ppdbStatus.isOpen ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        disabled
                        className="w-full py-3.5 bg-stone-300 text-stone-500 font-bold text-sm rounded-2xl cursor-not-allowed shadow-none flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>
                          {ppdbStatus.status === 'NOT_STARTED'
                            ? 'Pendaftaran Belum Dibuka'
                            : ppdbStatus.status === 'EXPIRED'
                            ? 'Pendaftaran Telah Ditutup'
                            : 'Pendaftaran PPDB Ditutup'}
                        </span>
                      </button>
                      <p className="text-[11px] text-center text-stone-500">
                        {ppdbStatus.message}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
                    >
                      Kirim Formulir Pendaftaran PPDB Online
                    </button>
                  )}
                </div>
              </form>

              {/* Live Preview Card */}
              <div className="lg:col-span-4 bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl border border-emerald-700/80 shadow-xl space-y-4 sticky top-24">
                <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
                    Kartu Draf PPDB
                  </span>
                  <span className="text-xl">🎒</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase block">Calon Siswa</span>
                    <h3 className="text-base font-extrabold text-amber-300">
                      {formData.studentName || 'Nama Siswa'}
                    </h3>
                    <p className="text-[11px] text-emerald-200">
                      Panggilan: {formData.nickname || '-'} ({formData.gender})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/80">
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Pilihan Kelas</span>
                      <strong className="text-white text-xs">{formData.groupChoice}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Status Gelombang</span>
                      <strong className="text-amber-300 text-xs">{lifecycle?.currentWave || 'Gelombang 1'}</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-emerald-200">
                    <p><strong>NIK:</strong> {formData.nik || '---'}</p>
                    <p><strong>Orang Tua:</strong> {formData.fatherName || formData.motherName || '---'}</p>
                    <p><strong>No WA:</strong> {formData.phone || '---'}</p>
                    <p className="truncate"><strong>Alamat:</strong> {formData.address || 'Tanggul Jember'}</p>
                  </div>

                  <div className="pt-2 text-[10px] text-emerald-300 italic text-center border-t border-emerald-800">
                    * Kartu ini terverifikasi otomatis setelah formulir disubmit.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cek Status Pendaftaran */}
      {activeTab === 'check' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900 text-center">Cek Status Verifikasi PPDB</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan No Registrasi (PPDB-2026-xxx) atau NIK"
              value={searchNo}
              onChange={e => setSearchNo(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs"
            />
            <button
              onClick={handleCheckStatus}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
            >
              Cari Status
            </button>
          </div>

          {searchSearched && (
            <div className="pt-4 border-t border-stone-200">
              {searchResult ? (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-bold text-emerald-900">{searchResult.registrationNo}</span>
                    <span className={`px-2.5 py-1 rounded-md font-bold text-white ${
                      searchResult.status === 'Diterima' ? 'bg-emerald-600' :
                      searchResult.status === 'Verifikasi' ? 'bg-amber-500' : 'bg-slate-500'
                    }`}>
                      Status: {searchResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-stone-700">
                    <p><strong>Nama Siswa:</strong> {searchResult.studentName}</p>
                    <p><strong>Pilihan:</strong> {searchResult.groupChoice}</p>
                    <p><strong>Gelombang:</strong> {searchResult.wave}</p>
                    <p><strong>Orang Tua:</strong> {searchResult.fatherName || searchResult.motherName}</p>
                  </div>

                  {searchResult.notes && (
                    <p className="bg-white p-3 rounded-xl border border-emerald-200 text-stone-600">
                      <strong>Catatan Panitia:</strong> {searchResult.notes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-stone-500 text-xs">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  Data pendaftaran tidak ditemukan. Pastikan No Registrasi / NIK sudah benar.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Rincian Biaya & Brosur */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Rincian Infaq & Biaya Gelombang 1 - 3</h2>
            <p className="text-xs text-stone-500">
              Biaya pendidikan terjangkau dengan fasilitas sarana prasarana modern & Islami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/50 space-y-3">
              <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                GELOMBANG 1 (Mei - Juni 2026)
              </span>
              <h3 className="text-base font-bold text-slate-900">Diskon Khusus Pendaftar Awal</h3>
              <ul className="text-xs text-stone-600 space-y-1.5 border-t border-emerald-200 pt-2">
                <li>• Formulir Pendaftaran: Rp 50.000</li>
                <li>• Infaq Gedung/Sarpras: Rp 1.200.000</li>
                <li>• Seragam (4 Stel): Rp 550.000</li>
                <li>• SPP Bulan Pertama: Rp 180.000</li>
              </ul>
            </div>

            <div className="border border-amber-200 rounded-2xl p-5 bg-amber-50/50 space-y-3">
              <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">
                GELOMBANG 2 (Juli 2026)
              </span>
              <h3 className="text-base font-bold text-slate-900">Gelombang Reguler</h3>
              <ul className="text-xs text-stone-600 space-y-1.5 border-t border-amber-200 pt-2">
                <li>• Formulir Pendaftaran: Rp 50.000</li>
                <li>• Infaq Gedung/Sarpras: Rp 1.400.000</li>
                <li>• Seragam (4 Stel): Rp 550.000</li>
                <li>• SPP Bulan Pertama: Rp 180.000</li>
              </ul>
            </div>

            <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50 space-y-3">
              <span className="text-[10px] font-bold bg-slate-700 text-white px-2 py-0.5 rounded">
                GELOMBANG 3 (Susulan)
              </span>
              <h3 className="text-base font-bold text-slate-900">Gelombang Akhir</h3>
              <ul className="text-xs text-stone-600 space-y-1.5 border-t border-stone-200 pt-2">
                <li>• Formulir Pendaftaran: Rp 50.000</li>
                <li>• Infaq Gedung/Sarpras: Rp 1.500.000</li>
                <li>• Seragam (4 Stel): Rp 550.000</li>
                <li>• SPP Bulan Pertama: Rp 180.000</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 text-center">
            <a
              href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md"
            >
              <Download className="w-4 h-4" /> Download Brosur Panduan PPDB 2026 (PDF)
            </a>
          </div>
        </div>
      )}
    </div>
  </ImmersiveWorldLandscape>
  );
};
