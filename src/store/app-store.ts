import { create } from "zustand";

interface AppState {
  isMobileMenuOpen: boolean;
  currentTab: "discover" | "matches" | "chat" | "profile";
  notificationCount: number;
  setMobileMenuOpen: (open: boolean) => void;
  setCurrentTab: (tab: AppState["currentTab"]) => void;
  setNotificationCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMobileMenuOpen: false,
  currentTab: "discover",
  notificationCount: 0,
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setCurrentTab: (currentTab) => set({ currentTab }),
  setNotificationCount: (notificationCount) => set({ notificationCount }),
}));
