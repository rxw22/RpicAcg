import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system"; // 系统主题

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

export type AppConfigStore = {
  mode: ThemeMode;
  setMode(mode: ThemeMode): void;
  appChannel: AppChannel;
  setAppChannel(appChannel: AppChannel): void;
  imageQuality: ImageQuality;
  setImageQuality(imageQuality: ImageQuality): void;
};

export const useAppConfigStore = create(
  persist<AppConfigStore>(
    (set) => ({
      mode: "system",
      setMode: (mode: ThemeMode) => set({ mode }),
      appChannel: AppChannel.分流一,
      setAppChannel: (appChannel) => set({ appChannel }),
      imageQuality: ImageQuality.原图,
      setImageQuality: (imageQuality) => set({ imageQuality }),
    }),
    {
      name: "app-config-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
