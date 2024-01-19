import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DarkMode = "light" | "dark" | "system"; // 系统主题
export type ThemeMode =
  | "Dynamic"
  | "Purple"
  | "Orange"
  | "Blue"
  | "Pink"
  | "Green";

export const Colors = [
  "Dynamic",
  "Purple",
  "Orange",
  "Blue",
  "Pink",
  "Green",
] as const;

export const Qualitys = ["原图", "高", "中", "低"] as const;

// 服务器分流
export enum AppChannel {
  分流一 = "1",
  分流二 = "2",
  分流三 = "3",
}

// 图片质量
export enum ImageQuality {
  原图 = "original",
  低 = "low",
  中 = "medium",
  高 = "high",
}

export enum DisplayImageQuality {
  "original" = "原图",
  "low" = "低",
  "medium" = "中",
  "high" = "高",
}

export enum DarkModes {
  system = "跟随系统",
  light = "关闭",
  dark = "开启",
}

export type AppConfigStore = {
  darkMode: DarkMode;
  setDarkMode(mode: DarkMode): void;

  themeMode: ThemeMode;
  setThemeMode(mode: ThemeMode): void;

  appChannel: AppChannel;
  setAppChannel(appChannel: AppChannel): void;

  imageQuality: ImageQuality;
  setImageQuality(imageQuality: ImageQuality): void;
};

export const useAppConfigStore = create(
  persist<AppConfigStore>(
    (set) => ({
      // 深色模式
      darkMode: "system",
      setDarkMode: (mode: DarkMode) => set({ darkMode: mode }),

      // 颜色主题
      themeMode: "Dynamic",
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),

      // 图片分流
      appChannel: AppChannel.分流一,
      setAppChannel: (appChannel) => set({ appChannel }),

      // 图片质量
      imageQuality: ImageQuality.原图,
      setImageQuality: (imageQuality) => set({ imageQuality }),
    }),
    {
      name: "app-config-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
