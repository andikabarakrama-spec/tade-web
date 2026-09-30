/**
 * TADE FOUNDER WORKSPACE MEMORY & SMART OFFICE EVOLUTION — SPRINT G5
 * Persists widget positions, favorite workspace pins, split-view mode, GPU quality, and command history.
 * Single Source of Truth: localStorage (tade_founder_workspace_memory_v1)
 */

export interface FounderWidgetPosition {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface FounderWorkspaceMemoryState {
  lastActiveMenu: string;
  lastFilterCategory: string;
  activeBriefTab: 'OVERVIEW' | 'OPERATIONS' | 'INTEGRITY' | 'FINANCE';
  widgetPositions: FounderWidgetPosition[];
  favoriteModules: string[]; // Pinned quick modules
  splitViewEnabled: boolean;
  splitViewSecondaryTab: string;
  gpuQuality: 'HIGH' | 'BALANCED' | 'BATTERY_SAVER';
  animationSchedulerEnabled: boolean;
  notes: string;
  recentSearches: string[];
  lastUpdated: string;
}

const STORAGE_KEY = 'tade_founder_workspace_memory_v1';

const DEFAULT_WIDGETS: FounderWidgetPosition[] = [
  { id: 'daily_brief', title: 'Executive Daily Brief', visible: true, order: 0 },
  { id: 'proactive_suggestions', title: 'Rekomendasi Proaktif Asy & Syifa', visible: true, order: 1 },
  { id: 'founder_quick_actions', title: 'Founder Quick Actions 1-Click', visible: true, order: 2 },
  { id: 'autonomous_voice', title: 'Voice Commander Asy & Syifa', visible: true, order: 3 },
  { id: 'mission_queue', title: 'Mission Queue', visible: true, order: 4 },
  { id: 'readiness_score', title: 'Founder Readiness Score', visible: true, order: 5 },
  { id: 'executive_companion', title: 'Asy & Syifa Executive Companion', visible: true, order: 6 },
  { id: 'cabinet_resolutions', title: 'Cabinet Resolution Tracker', visible: true, order: 7 },
  { id: 'command_recorder', title: 'Founder Command Recorder', visible: true, order: 8 },
  { id: 'tib_labs_preview', title: 'TIB Innovation Labs Hub', visible: true, order: 9 }
];

const DEFAULT_FAVORITES: string[] = ['COCKPIT', 'PASSPORT', 'RECOVERY', 'CREATIVE', 'MEDIA'];

const DEFAULT_STATE: FounderWorkspaceMemoryState = {
  lastActiveMenu: 'r_founder_office',
  lastFilterCategory: 'ALL',
  activeBriefTab: 'OVERVIEW',
  widgetPositions: DEFAULT_WIDGETS,
  favoriteModules: DEFAULT_FAVORITES,
  splitViewEnabled: false,
  splitViewSecondaryTab: 'PASSPORT',
  gpuQuality: 'HIGH',
  animationSchedulerEnabled: true,
  notes: 'Fokus Utama: Stabilisasi adopsi wali murid dan standarisasi arsip media terpadu.',
  recentSearches: ['PPDB 2026', 'Sentra Bahan Alam', 'Laporan Kas Infaq', 'Snapshot Subuh'],
  lastUpdated: new Date().toISOString()
};

export const founderWorkspaceMemory = {
  load(): FounderWorkspaceMemoryState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        widgetPositions: parsed.widgetPositions || DEFAULT_WIDGETS,
        favoriteModules: parsed.favoriteModules || DEFAULT_FAVORITES
      };
    } catch {
      return DEFAULT_STATE;
    }
  },

  save(partial: Partial<FounderWorkspaceMemoryState>): FounderWorkspaceMemoryState {
    try {
      const current = this.load();
      const updated: FounderWorkspaceMemoryState = {
        ...current,
        ...partial,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_STATE;
    }
  },

  setLastMenu(menuId: string) {
    this.save({ lastActiveMenu: menuId });
  },

  setLastFilter(filter: string) {
    this.save({ lastFilterCategory: filter });
  },

  setBriefTab(tab: 'OVERVIEW' | 'OPERATIONS' | 'INTEGRITY' | 'FINANCE') {
    this.save({ activeBriefTab: tab });
  },

  setGpuQuality(gpuQuality: 'HIGH' | 'BALANCED' | 'BATTERY_SAVER') {
    this.save({ gpuQuality });
  },

  setAnimationScheduler(enabled: boolean) {
    this.save({ animationSchedulerEnabled: enabled });
  },

  updateWidgets(widgetPositions: FounderWidgetPosition[]) {
    this.save({ widgetPositions });
  },

  setNotes(notes: string) {
    this.save({ notes });
  },

  toggleFavorite(moduleId: string): string[] {
    const current = this.load();
    const favs = current.favoriteModules || [];
    const updatedFavs = favs.includes(moduleId)
      ? favs.filter(id => id !== moduleId)
      : [...favs, moduleId];
    this.save({ favoriteModules: updatedFavs });
    return updatedFavs;
  },

  setSplitView(enabled: boolean, secondaryTab?: string) {
    this.save({
      splitViewEnabled: enabled,
      ...(secondaryTab ? { splitViewSecondaryTab: secondaryTab } : {})
    });
  },

  addRecentSearch(query: string) {
    if (!query.trim()) return;
    const current = this.load();
    const searches = [query.trim(), ...(current.recentSearches || []).filter(q => q !== query.trim())].slice(0, 8);
    this.save({ recentSearches: searches });
  }
};
