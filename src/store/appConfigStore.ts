import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system"; // 系统主题

export type AppConfigStore = {
  mode: ThemeMode;
  setMode(mode: ThemeMode): void;
};

export const useAppConfigStore = create(
  persist<AppConfigStore>(
    (set) => ({
      mode: "system",
      setMode: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: "app-config-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
