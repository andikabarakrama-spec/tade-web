import React, { createContext, useContext, useState, useEffect } from 'react';

export type TimeOfDay = 'Pagi' | 'Siang' | 'Sore' | 'Malam';
export type ThemePreset = 'garden-ceria' | 'emerald' | 'pastel' | 'ramadhan' | 'hari-guru' | 'agustus' | 'ppdb' | 'minimal' | 'night';

export interface GardenSettings {
  isQuietMode: boolean; // Mode Tenang (disable ambient particles/animations)
  skyEngineEnabled: boolean;
  animalsEnabled: boolean;
  vehiclesEnabled: boolean;
  mascotEnabled: boolean;
  bubblesEnabled: boolean;
  doodlesEnabled: boolean;
  stickersEnabled: boolean;
  balloonsEnabled: boolean;
  rainbowEnabled: boolean;
  grassEnabled: boolean;
  flowersEnabled: boolean;
  storiesEnabled: boolean;
  pathConnectorsEnabled: boolean;
  sunEnabled: boolean;
  cloudsEnabled: boolean;
  birdsEnabled: boolean;
  butterfliesEnabled: boolean;
  beesEnabled: boolean;
  busEnabled: boolean;
  lanternsEnabled: boolean;
  firefliesEnabled: boolean;
  starsEnabled: boolean;
  moonEnabled: boolean;
  rainEnabled: boolean;
  snowEnabled: boolean;
  activeThemePreset: ThemePreset;
  artDirectorPreset: string;
  timeOverride: TimeOfDay | null; // null for live browser time
  reducedMotion: boolean;
}

interface LivingGardenContextType {
  settings: GardenSettings;
  timeOfDay: TimeOfDay;
  isBatteryLow: boolean;
  isTabActive: boolean;
  toggleQuietMode: () => void;
  updateGardenSettings: (newSettings: Partial<GardenSettings>) => void;
  setThemePreset: (preset: ThemePreset) => void;
  getPrayerTimes: () => { name: string; time: string; active: boolean }[];
  getHijriDate: () => string;
}

const defaultSettings: GardenSettings = {
  isQuietMode: false,
  skyEngineEnabled: true,
  animalsEnabled: true,
  vehiclesEnabled: true,
  mascotEnabled: true,
  bubblesEnabled: true,
  doodlesEnabled: true,
  stickersEnabled: true,
  balloonsEnabled: true,
  rainbowEnabled: true,
  grassEnabled: true,
  flowersEnabled: true,
  storiesEnabled: true,
  pathConnectorsEnabled: true,
  sunEnabled: true,
  cloudsEnabled: true,
  birdsEnabled: true,
  butterfliesEnabled: true,
  beesEnabled: true,
  busEnabled: true,
  lanternsEnabled: true,
  firefliesEnabled: true,
  starsEnabled: true,
  moonEnabled: true,
  rainEnabled: false,
  snowEnabled: false,
  activeThemePreset: 'garden-ceria',
  artDirectorPreset: 'default',
  timeOverride: null,
  reducedMotion: false,
};

const LivingGardenContext = createContext<LivingGardenContextType | undefined>(undefined);

export const LivingGardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GardenSettings>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('asy_syifa_garden_settings');
        if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse garden settings', e);
    }
    return defaultSettings;
  });

  const [isBatteryLow, setIsBatteryLow] = useState<boolean>(false);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('asy_syifa_garden_settings', JSON.stringify(settings));
      }
    } catch (e) {
      console.warn('Failed to save garden settings', e);
    }
  }, [settings]);

  // Tab visibility listener (Battery Saver / Performance)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Battery status API check (if supported)
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setIsBatteryLow(battery.level <= 0.20 && !battery.charging);
        battery.addEventListener('levelchange', () => {
          setIsBatteryLow(battery.level <= 0.20 && !battery.charging);
        });
      }).catch(() => {});
    }
  }, []);

  // Derive current time of day based on browser local hour or override
  const getTimeOfDay = (): TimeOfDay => {
    if (settings.timeOverride) return settings.timeOverride;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Pagi';
    if (hour >= 11 && hour < 15) return 'Siang';
    if (hour >= 15 && hour < 18) return 'Sore';
    return 'Malam';
  };

  const timeOfDay = getTimeOfDay();

  const toggleQuietMode = () => {
    setSettings((prev) => ({ ...prev, isQuietMode: !prev.isQuietMode }));
  };

  const updateGardenSettings = (newSettings: Partial<GardenSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setThemePreset = (preset: ThemePreset) => {
    setSettings((prev) => ({ ...prev, activeThemePreset: preset }));
  };

  // Prayer times for Tanggul - Jember
  const getPrayerTimes = () => {
    const currentHour = new Date().getHours();
    const currentMin = new Date().getMinutes();
    const timeInMins = currentHour * 60 + currentMin;

    return [
      { name: 'Subuh', time: '04:22', active: timeInMins >= 262 && timeInMins < 360 },
      { name: 'Terbit', time: '05:38', active: false },
      { name: 'Dzuhur', time: '11:42', active: timeInMins >= 702 && timeInMins < 900 },
      { name: 'Ashar', time: '15:01', active: timeInMins >= 901 && timeInMins < 1065 },
      { name: 'Maghrib', time: '17:45', active: timeInMins >= 1065 && timeInMins < 1130 },
      { name: 'Isya', time: '18:55', active: timeInMins >= 1130 || timeInMins < 262 },
    ];
  };

  // Simplified estimated Islamic / Hijri Date
  const getHijriDate = () => {
    const now = new Date();
    const day = now.getDate();
    // Rough estimation for display or standard Islamic calendar string
    return `${day} Safar 1448 H`;
  };

  return (
    <LivingGardenContext.Provider
      value={{
        settings,
        timeOfDay,
        isBatteryLow,
        isTabActive,
        toggleQuietMode,
        updateGardenSettings,
        setThemePreset,
        getPrayerTimes,
        getHijriDate,
      }}
    >
      {children}
    </LivingGardenContext.Provider>
  );
};

export const useLivingGarden = () => {
  const context = useContext(LivingGardenContext);
  if (!context) {
    throw new Error('useLivingGarden must be used within a LivingGardenProvider');
  }
  return context;
};
