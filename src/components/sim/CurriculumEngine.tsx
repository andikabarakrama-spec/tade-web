import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  Settings2,
  Award,
  Calendar,
  Cpu,
  Bot
} from 'lucide-react';

export interface CurriculumPreset {
  id: string;
  name: string;
  category: 'KURIKULUM_MERDEKA' | 'KURIKULUM_2013' | 'PESANTREN_INTEGRATED' | 'CAMBRIDGE_INTERNATIONAL' | 'ISLAMIC_MONTESSORI';
  applicableLevels: ('PAUD' | 'TK' | 'RA' | 'SD' | 'SMP' | 'SMA' | 'SMK')[];
  description: string;
  gradingStyle: string;
  raportTemplate: string;
  features: string[];
}

export const CURRICULUM_PRESETS: CurriculumPreset[] = [
  {
    id: 'CURR-MERDEKA-PAUD',
    name: 'Kurikulum Merdeka PAUD/TK (Fase Fondasi)',
    category: 'KURIKULUM_MERDEKA',
    applicableLevels: ['PAUD', 'TK', 'RA'],
    description: 'Fokus pada Nilai Agama dan Budi Pekerti, Jati Diri, serta Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (STEAM).',
    gradingStyle: 'Deskriptif Naratif / Capaian Pembelajaran (CP)',
    raportTemplate: 'Rapor Capaian Fondasi P5 Kemendikbudristek',
    features: [
      'Projek Penguatan Profil Pelajar Pancasila (P5)',
      'Asesmen Anekdot & Hasil Karya Foto',
      'Portofolio Perkembangan Motorik & Karakter'
    ]
  },
  {
    id: 'CURR-ISLAMIC-MONTESSORI',
    name: 'Islamic Montessori & Tahfidz Integrated',
    category: 'ISLAMIC_MONTESSORI',
    applicableLevels: ['PAUD', 'TK', 'RA', 'SD'],
    description: 'Integrasi aparatus sensori Montessori dengan pembiasaan adab Islami, hafalan Juz Amma, Hadits pilihan, dan doa harian.',
    gradingStyle: 'Mastery Matrix & Mutabaah Yaumiyyah',
    raportTemplate: 'Rapor Montessori Dual Adab & Tahfidz Record',
    features: [
      'Radar Mutabaah Hafalan Al-Qur\'an',
      'Observasi Sensorial & Practical Life',
      'Sertifikat Kelulusan Uji Tashih'
    ]
  },
  {
    id: 'CURR-MERDEKA-DIKDASMEN',
    name: 'Kurikulum Merdeka SD / SMP / SMA',
    category: 'KURIKULUM_MERDEKA',
    applicableLevels: ['SD', 'SMP', 'SMA'],
    description: 'Pembelajaran intrakurikuler dan kokurikuler berbasis P5 dengan fleksibilitas pemilihan mata pelajaran peminatan pada jenjang SMA.',
    gradingStyle: 'Skala Nilai 0–100 + Deskripsi Ketercapaian TP',
    raportTemplate: 'Rapor Standar e-Rapor Kurikulum Merdeka',
    features: [
      'Modul Ajar & ATP (Alur Tujuan Pembelajaran)',
      'Rubrik Asesmen Formatif & Sumatif',
      'Peminatan & Portofolio Karya Ilmiah Remaja'
    ]
  },
  {
    id: 'CURR-SMK-VOKASI',
    name: 'Kurikulum Merdeka SMK Vokasi & Link and Match IDUKA',
    category: 'KURIKULUM_MERDEKA',
    applicableLevels: ['SMK'],
    description: 'Kurikulum kejuruan selaras standar industri (IDUKA), teaching factory, sertifikasi kompetensi LSP/BNSP, dan praktik kerja lapangan (PKL).',
    gradingStyle: 'Standar Kompetensi Dual (Nilai Teori & Uji Sertifikasi)',
    raportTemplate: 'Rapor Vokasi + Transkrip Kompetensi Keahlian Industri',
    features: [
      'Manajemen Logbook PKL / Magang Industri',
      'Uji Kompetensi Keahlian (UKK) Tracker',
      'Teaching Factory Project Billing Sync'
    ]
  }
];

interface Props {
  selectedLevel?: string;
  currentCurriculum?: string;
  onSelectCurriculum?: (preset: CurriculumPreset) => void;
}

export const CurriculumEngine: React.FC<Props> = ({
  selectedLevel = 'TK',
  currentCurriculum = 'CURR-MERDEKA-PAUD',
  onSelectCurriculum
}) => {
  const [activeCurriculumId, setActiveCurriculumId] = useState(currentCurriculum);

  const availablePresets = CURRICULUM_PRESETS.filter(p =>
    p.applicableLevels.includes(selectedLevel as any)
  );

  const handleSelect = (preset: CurriculumPreset) => {
    setActiveCurriculumId(preset.id);
    onSelectCurriculum?.(preset);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Preset Kurikulum untuk Jenjang {selectedLevel}</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Modul penilaian, rapor, dan asesmen otomatis diselaraskan dengan standar kurikulum terpilih.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          {availablePresets.length} Kurikulum Tersedia
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePresets.map((preset) => {
          const isSelected = activeCurriculumId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 relative ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}

              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {preset.category}
                </span>
                <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                  {preset.name}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sistem Penilaian:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{preset.gradingStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Format Rapor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{preset.raportTemplate}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Fitur Utama:</span>
                <div className="flex flex-wrap gap-1.5">
                  {preset.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
