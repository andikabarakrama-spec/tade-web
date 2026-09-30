import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Sparkles,
  Sliders,
  Palette,
  CheckCircle2,
  Bot,
  Calendar,
  Layers,
  Award,
  Users,
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';
import { CurriculumEngine, CURRICULUM_PRESETS, CurriculumPreset } from './CurriculumEngine';

export type EducationLevel = 'PAUD' | 'TK' | 'RA' | 'SD' | 'SMP' | 'SMA' | 'SMK';

export interface TenantEducationDNA {
  tenantId: string;
  schoolName: string;
  npsn: string;
  educationLevel: EducationLevel;
  curriculumType: string;
  gradingSystem: string;
  academicCalendar: string;
  academicYear: string;
  primaryThemeColor: string;
  logoUrl?: string;
  roleDefaults: {
    principalTitle: string;
    teacherTitle: string;
    studentTitle: string;
    parentTitle: string;
  };
  aiAsyPersona: {
    name: string;
    tone: string;
    avatarBadge: string;
    greetingTemplate: string;
  };
}

export const SAMPLE_TENANT_DNAS: Record<string, TenantEducationDNA> = {
  'asy-syifa-01': {
    tenantId: 'asy-syifa-01',
    schoolName: 'TK Islam Asy-Syifa (Pusat)',
    npsn: '69812345',
    educationLevel: 'TK',
    curriculumType: 'Islamic Montessori & Tahfidz Integrated',
    gradingSystem: 'Deskriptif Naratif / Capaian Pembelajaran Fase Fondasi',
    academicCalendar: 'Semester Ganjil/Genap (2 Semester)',
    academicYear: '2026/2027',
    primaryThemeColor: '#059669', // Emerald
    roleDefaults: {
      principalTitle: 'Kepala TK',
      teacherTitle: 'Ustadzah / Guru Sentra',
      studentTitle: 'Santri Cilik',
      parentTitle: 'Ayah / Bunda'
    },
    aiAsyPersona: {
      name: 'Dek Asy Ramah & Ceria',
      tone: 'Ceria, santun, penyemangat anak usia dini dan ramah ayah bunda',
      avatarBadge: 'MASCOT_DEK_ASY_GOLDEN',
      greetingTemplate: 'Assalamu’alaikum Ayah Bunda & Sobat Asy-Syifa! Selamat datang di TK Islam Asy-Syifa.'
    }
  },
  'alfatih-sd-06': {
    tenantId: 'alfatih-sd-06',
    schoolName: 'SD Islam Terpadu Al-Fatih',
    npsn: '20199812',
    educationLevel: 'SD',
    curriculumType: 'Kurikulum Merdeka SD (Fase A, B, C)',
    gradingSystem: 'Skala 0–100 + Deskripsi Ketercapaian TP',
    academicCalendar: 'Semester Ganjil/Genap',
    academicYear: '2026/2027',
    primaryThemeColor: '#2563eb', // Blue
    roleDefaults: {
      principalTitle: 'Kepala SDIT',
      teacherTitle: 'Guru Kelas & Guru Bidang Studi',
      studentTitle: 'Siswa / Siswi',
      parentTitle: 'Orang Tua / Wali'
    },
    aiAsyPersona: {
      name: 'Kakak Asy Mentor Teladan',
      tone: 'Inspiratif, edukatif, mendukung kemandirian literasi & numerasi',
      avatarBadge: 'MASCOT_KAKAK_ASY_BLUE',
      greetingTemplate: 'Halo pejuang Al-Fatih! Siap meraih prestasi gemilang hari ini bersama SDIT Al-Fatih?'
    }
  },
  'nusantara-smk-07': {
    tenantId: 'nusantara-smk-07',
    schoolName: 'SMK Vokasi Teknologi Nusantara',
    npsn: '20144901',
    educationLevel: 'SMK',
    curriculumType: 'Kurikulum Merdeka SMK Vokasi & Link IDUKA',
    gradingSystem: 'Standar Kompetensi Dual (Teori & Uji Sertifikasi BNSP)',
    academicCalendar: 'Semester + Blok Praktik Kerja Lapangan (PKL)',
    academicYear: '2026/2027',
    primaryThemeColor: '#7c3aed', // Purple
    roleDefaults: {
      principalTitle: 'Kepala Sekolah SMK',
      teacherTitle: 'Instruktur Kejuruan & Guru Produktif',
      studentTitle: 'Taruna / Siswa Vokasi',
      parentTitle: 'Wali Murid & Rekan Industri'
    },
    aiAsyPersona: {
      name: 'Asy Enterprise Industry Advisor',
      tone: 'Profesional, berorientasi industri, siap kerja dan kompetensi teknis',
      avatarBadge: 'MASCOT_ASY_PRO_PURPLE',
      greetingTemplate: 'Selamat datang di Hub Vokasi SMK Nusantara. Sistem siap untuk monitoring kompetensi dan teaching factory.'
    }
  }
};

export const EducationProfileEngine: React.FC = () => {
  const [selectedTenantKey, setSelectedTenantKey] = useState<string>('asy-syifa-01');
  const [currentDNA, setCurrentDNA] = useState<TenantEducationDNA>(SAMPLE_TENANT_DNAS['asy-syifa-01']);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states for wizard or edit
  const [tempName, setTempName] = useState(currentDNA.schoolName);
  const [tempLevel, setTempLevel] = useState<EducationLevel>(currentDNA.educationLevel);
  const [tempColor, setTempColor] = useState(currentDNA.primaryThemeColor);
  const [tempYear, setTempYear] = useState(currentDNA.academicYear);

  const handleSelectTenant = (key: string) => {
    setSelectedTenantKey(key);
    const dna = SAMPLE_TENANT_DNAS[key] || SAMPLE_TENANT_DNAS['asy-syifa-01'];
    setCurrentDNA(dna);
    setTempName(dna.schoolName);
    setTempLevel(dna.educationLevel);
    setTempColor(dna.primaryThemeColor);
    setTempYear(dna.academicYear);
  };

  const handleLevelChange = (level: EducationLevel) => {
    setTempLevel(level);
    // Auto-reconfigure role defaults and AI persona based on level
    let teacher = 'Guru Kelas';
    let student = 'Siswa';
    let personaName = 'Asy Asisten Edukasi';
    let tone = 'Santun dan komunikatif';

    if (level === 'PAUD' || level === 'TK' || level === 'RA') {
      teacher = 'Ustadzah / Guru Sentra';
      student = 'Santri Cilik';
      personaName = 'Dek Asy Ramah & Ceria';
      tone = 'Ceria, santun, penyemangat anak usia dini';
    } else if (level === 'SMK') {
      teacher = 'Instruktur Kejuruan & Guru Produktif';
      student = 'Taruna / Siswa Kejuruan';
      personaName = 'Asy Enterprise Advisor';
      tone = 'Profesional dan berorientasi industri';
    } else if (level === 'SMA' || level === 'SMP') {
      teacher = 'Guru Mata Pelajaran';
      student = 'Siswa / Siswi';
      personaName = 'Kakak Asy Mentor Akademik';
      tone = 'Inspiratif dan akademis';
    }

    setCurrentDNA(prev => ({
      ...prev,
      educationLevel: level,
      roleDefaults: {
        ...prev.roleDefaults,
        teacherTitle: teacher,
        studentTitle: student
      },
      aiAsyPersona: {
        ...prev.aiAsyPersona,
        name: personaName,
        tone: tone
      }
    }));
  };

  const handleSaveDNA = () => {
    const updated: TenantEducationDNA = {
      ...currentDNA,
      schoolName: tempName,
      educationLevel: tempLevel,
      primaryThemeColor: tempColor,
      academicYear: tempYear
    };
    setCurrentDNA(updated);
    SAMPLE_TENANT_DNAS[selectedTenantKey] = updated;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-lg">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    MODULE R134 / R135
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    EDUCATION DNA PLATFORM
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Universal Education Profile & Curriculum DNA Engine
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              TADE mendukung seluruh jenjang pendidikan (PAUD, TK, RA, SD, SMP, SMA, SMK). Setiap sekolah memiliki <strong>Education DNA</strong> independen yang mengatur kurikulum, format rapor, sebutan peran, dan persona AI Asy secara dinamis.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsWizardMode(!isWizardMode)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-900/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isWizardMode ? 'Tutup Setup Wizard' : 'Jalankan Setup Wizard Baru'}</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">Education DNA sekolah berhasil diperbarui dan disinkronkan ke seluruh modul!</span>
        </div>
      )}

      {/* Switcher Sekolah / Tenant */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-indigo-500" />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Pilih Konfigurasi Tenant Sekolah:</h4>
            <span className="text-xs text-slate-500">Melihat atau mengedit DNA institusi aktif</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {Object.entries(SAMPLE_TENANT_DNAS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => handleSelectTenant(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedTenantKey === key
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {item.schoolName} ({item.educationLevel})
            </button>
          ))}
        </div>
      </div>

      {/* Main DNA Overview & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: DNA Identity Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ backgroundColor: currentDNA.primaryThemeColor }}
              >
                {currentDNA.educationLevel}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{currentDNA.schoolName}</h3>
                <span className="text-xs text-slate-500 font-mono">NPSN: {currentDNA.npsn}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentDNA.academicYear}
            </span>
          </div>

          {/* Persona AI Asy Badge */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              <Bot className="w-4 h-4" />
              <span>Persona AI Asy Adaptif ({currentDNA.aiAsyPersona.name})</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "{currentDNA.aiAsyPersona.greetingTemplate}"
            </p>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
              <strong>Tone:</strong> {currentDNA.aiAsyPersona.tone}
            </div>
          </div>

          {/* Role Naming Adaptations */}
          <div className="space-y-2.5 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Adaptasi Nomenklatur Peran (Role Defaults):</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Pimpinan:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentDNA.roleDefaults.principalTitle}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Pengajar:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentDNA.roleDefaults.teacherTitle}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Peserta Didik:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentDNA.roleDefaults.studentTitle}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Wali:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentDNA.roleDefaults.parentTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: DNA Customizer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Konfigurasi Cepat Profil & Jenjang Pendidikan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Nama Lengkap Institusi / Sekolah</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Jenjang Selector */}
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-2 font-semibold text-xs">
                Pilih Jenjang Pendidikan (TADE Universal Multi-Level):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {(['PAUD', 'TK', 'RA', 'SD', 'SMP', 'SMA', 'SMK'] as EducationLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      tempLevel === lvl
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Color Selector */}
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-2 font-semibold text-xs flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Warna Identitas Sekolah:</span>
              </label>
              <div className="flex items-center space-x-3">
                {[
                  { name: 'Emerald', hex: '#059669' },
                  { name: 'Blue', hex: '#2563eb' },
                  { name: 'Purple', hex: '#7c3aed' },
                  { name: 'Indigo', hex: '#4f46e5' },
                  { name: 'Amber', hex: '#d97706' },
                  { name: 'Rose', hex: '#e11d48' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setTempColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      tempColor === c.hex ? 'scale-125 ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-100' : 'hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveDNA}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-900/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Perubahan DNA Sekolah</span>
              </button>
            </div>
          </div>

          {/* Curriculum Engine Presets for Current Selected Level */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <CurriculumEngine
              selectedLevel={tempLevel}
              currentCurriculum={currentDNA.curriculumType}
              onSelectCurriculum={(preset) => {
                setCurrentDNA(prev => ({
                  ...prev,
                  curriculumType: preset.name,
                  gradingSystem: preset.gradingStyle
                }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
