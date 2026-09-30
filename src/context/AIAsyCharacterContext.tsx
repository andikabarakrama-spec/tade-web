import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIAsyCharacterState, AI_ASY_ASSET_REGISTRY } from '../components/assistant/AIAsyCharacterAssetRegistry';

export type AIAsyPageKey =
  | 'w1Hero'
  | 'w2Program'
  | 'w3Galeri'
  | 'w4PPDB'
  | 'w5Kontak'
  | 'footer'
  | 'dashboardGuru'
  | 'dashboardAdmin'
  | 'dashboardKepsek'
  | 'dashboardYayasan'
  | 'dashboardParent';

export type AIAsyPosition = 'LEFT' | 'CENTER' | 'RIGHT';
export type AIAsyAnimationType = 'NONE' | 'GENTLE_BREATHING' | 'FLOAT_SUBTLE' | 'CELEBRATE_BOUNCE';

export interface AIAsyPageConfig {
  state: AIAsyCharacterState;
  position: AIAsyPosition;
  isVisible: boolean;
  scale: number; // 0.8 to 1.3
  greeting: string;
  animation: AIAsyAnimationType;
}

export interface AIAsyMasterConfig {
  isEnabled: boolean;
  genderVariant: 'ASY' | 'ASYAH';
  globalScale: number;
  timeScheduleSync: boolean;
  pages: Record<AIAsyPageKey, AIAsyPageConfig>;
}

export const DEFAULT_AI_ASY_MASTER_CONFIG: AIAsyMasterConfig = {
  isEnabled: true,
  genderVariant: 'ASY',
  globalScale: 1.0,
  timeScheduleSync: true,
  pages: {
    w1Hero: {
      state: 'idle',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Assalamu'alaikum Ayah & Bunda! Selamat datang di Taman Ceria TK Asy Syifa Tanggul 👋",
      animation: 'GENTLE_BREATHING',
    },
    w2Program: {
      state: 'reading',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Mari belajar bersama di Sentra Kurikulum Merdeka Islami! Buku & alat lukis sudah siap.",
      animation: 'FLOAT_SUBTLE',
    },
    w3Galeri: {
      state: 'camera',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Subhanallah! Ceria sekali momen kegiatan santri cilik kita di sekolah 📸",
      animation: 'GENTLE_BREATHING',
    },
    w4PPDB: {
      state: 'guide',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.05,
      greeting: "Selamat datang Ayah & Bunda! Pendaftaran PPDB 2026/2027 siap kami bantu dengan hangat.",
      animation: 'GENTLE_BREATHING',
    },
    w5Kontak: {
      state: 'point',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Mari berkunjung langsung ke TK Asy Syifa! Lokasinya persis di depan Alun-alun Tanggul.",
      animation: 'GENTLE_BREATHING',
    },
    footer: {
      state: 'wave',
      position: 'LEFT',
      isVisible: true,
      scale: 1.0,
      greeting: "Terima kasih sudah berkunjung. Semoga kami dapat menyambut Ayah & Bunda di TK Asy Syifa.",
      animation: 'GENTLE_BREATHING',
    },
    dashboardGuru: {
      state: 'guide',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Assalamu'alaikum Ustadz/Ustadzah! AI Asy siap membantu menyusun RPP & Jurnal Kelas.",
      animation: 'GENTLE_BREATHING',
    },
    dashboardAdmin: {
      state: 'thinking',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Siap mendampingi kelancaran data PPDB, CMS Website, dan Administrasi Sekolah.",
      animation: 'GENTLE_BREATHING',
    },
    dashboardKepsek: {
      state: 'point',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Laporan Kinerja Operasional & Akreditasi Sekolah terpantau optimal dan aman.",
      animation: 'GENTLE_BREATHING',
    },
    dashboardYayasan: {
      state: 'guide',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Laporan Ringkasan Eksekutif Keuangan & Kemajuan Yayasan Asy Syifa Tanggul.",
      animation: 'GENTLE_BREATHING',
    },
    dashboardParent: {
      state: 'reading',
      position: 'RIGHT',
      isVisible: true,
      scale: 1.0,
      greeting: "Assalamu'alaikum Ayah/Bunda! Ananda hari ini sangat ceria belajar hafalan surah.",
      animation: 'GENTLE_BREATHING',
    },
  },
};

interface AIAsyCharacterContextType {
  config: AIAsyMasterConfig;
  updateMasterConfig: (newConfig: Partial<AIAsyMasterConfig>) => void;
  updatePageConfig: (pageKey: AIAsyPageKey, pageConfig: Partial<AIAsyPageConfig>) => void;
  resetToDefault: () => void;
  setGenderVariant: (variant: 'ASY' | 'ASYAH') => void;
}

const AIAsyCharacterContext = createContext<AIAsyCharacterContextType | undefined>(undefined);

export const AIAsyCharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AIAsyMasterConfig>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('asy_syifa_ai_asy_character_core_cms');
        if (saved) return { ...DEFAULT_AI_ASY_MASTER_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse AI Asy Character Master CMS config', e);
    }
    return DEFAULT_AI_ASY_MASTER_CONFIG;
  });

  // Save to LocalStorage & Dispatch Storage Event for Live Sync
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('asy_syifa_ai_asy_character_core_cms', JSON.stringify(config));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.warn('Failed to save AI Asy Character Master CMS config', e);
    }
  }, [config]);

  const updateMasterConfig = (newConfig: Partial<AIAsyMasterConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const updatePageConfig = (pageKey: AIAsyPageKey, pageConfig: Partial<AIAsyPageConfig>) => {
    setConfig((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: {
          ...prev.pages[pageKey],
          ...pageConfig,
        },
      },
    }));
  };

  const setGenderVariant = (variant: 'ASY' | 'ASYAH') => {
    setConfig((prev) => ({ ...prev, genderVariant: variant }));
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_AI_ASY_MASTER_CONFIG);
  };

  return (
    <AIAsyCharacterContext.Provider
      value={{
        config,
        updateMasterConfig,
        updatePageConfig,
        resetToDefault,
        setGenderVariant,
      }}
    >
      {children}
    </AIAsyCharacterContext.Provider>
  );
};

export const useAIAsyCharacter = () => {
  const context = useContext(AIAsyCharacterContext);
  if (!context) {
    throw new Error('useAIAsyCharacter must be used within an AIAsyCharacterProvider');
  }
  return context;
};
