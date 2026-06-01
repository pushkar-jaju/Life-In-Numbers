import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type DailyStatsState = {
  keyboardPresses: number;
  tabsOpened: number;
  browsingTimeMinutes: number;
  sessionDurationMinutes: number;
  activeTimeMinutes: number;
};

export type UserState = {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

export type UIState = {
  darkMode: boolean;
  sidebarOpen: boolean;
  selectedTimeRange: 'day' | 'week' | 'month';
};

// Store
export type AppStore = {
  // User state
  user: UserState;
  setUser: (user: UserState) => void;
  clearUser: () => void;

  // Daily stats
  dailyStats: DailyStatsState;
  setDailyStats: (stats: Partial<DailyStatsState>) => void;
  updateKeyboardPresses: (count: number) => void;
  updateTabsOpened: (count: number) => void;

  // UI state
  ui: UIState;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setTimeRange: (range: 'day' | 'week' | 'month') => void;

  // Tracking settings
  trackingEnabled: boolean;
  setTrackingEnabled: (enabled: boolean) => void;

  // Reset
  reset: () => void;
};

const initialUserState: UserState = {
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
};

const initialStatsState: DailyStatsState = {
  keyboardPresses: 0,
  tabsOpened: 0,
  browsingTimeMinutes: 0,
  sessionDurationMinutes: 0,
  activeTimeMinutes: 0,
};

const initialUIState: UIState = {
  darkMode: true,
  sidebarOpen: true,
  selectedTimeRange: 'day',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // User state
      user: initialUserState,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: initialUserState }),

      // Daily stats
      dailyStats: initialStatsState,
      setDailyStats: (stats) =>
        set((state) => ({
          dailyStats: { ...state.dailyStats, ...stats },
        })),
      updateKeyboardPresses: (count) =>
        set((state) => ({
          dailyStats: {
            ...state.dailyStats,
            keyboardPresses: count,
          },
        })),
      updateTabsOpened: (count) =>
        set((state) => ({
          dailyStats: {
            ...state.dailyStats,
            tabsOpened: count,
          },
        })),

      // UI state
      ui: initialUIState,
      toggleDarkMode: () =>
        set((state) => ({
          ui: {
            ...state.ui,
            darkMode: !state.ui.darkMode,
          },
        })),
      toggleSidebar: () =>
        set((state) => ({
          ui: {
            ...state.ui,
            sidebarOpen: !state.ui.sidebarOpen,
          },
        })),
      setTimeRange: (range) =>
        set((state) => ({
          ui: {
            ...state.ui,
            selectedTimeRange: range,
          },
        })),

      // Tracking settings
      trackingEnabled: true,
      setTrackingEnabled: (enabled) => set({ trackingEnabled: enabled }),

      // Reset
      reset: () =>
        set({
          user: initialUserState,
          dailyStats: initialStatsState,
          ui: initialUIState,
          trackingEnabled: true,
        }),
    }),
    {
      name: 'app-store',
      version: 1,
      partialize: (state) => ({
        ui: state.ui,
        trackingEnabled: state.trackingEnabled,
      }),
    }
  )
);

// Hooks for easy access
export const useUser = () => useAppStore((state) => state.user);
export const useSetUser = () => useAppStore((state) => state.setUser);
export const useClearUser = () => useAppStore((state) => state.clearUser);

export const useDailyStats = () => useAppStore((state) => state.dailyStats);
export const useSetDailyStats = () => useAppStore((state) => state.setDailyStats);
export const useUpdateKeyboardPresses = () =>
  useAppStore((state) => state.updateKeyboardPresses);
export const useUpdateTabsOpened = () =>
  useAppStore((state) => state.updateTabsOpened);

export const useUIState = () => useAppStore((state) => state.ui);
export const useToggleDarkMode = () =>
  useAppStore((state) => state.toggleDarkMode);
export const useToggleSidebar = () => useAppStore((state) => state.toggleSidebar);
export const useSetTimeRange = () => useAppStore((state) => state.setTimeRange);

export const useTrackingEnabled = () =>
  useAppStore((state) => state.trackingEnabled);
export const useSetTrackingEnabled = () =>
  useAppStore((state) => state.setTrackingEnabled);

export const useReset = () => useAppStore((state) => state.reset);
