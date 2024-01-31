import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { limitProperties } from "@/utils";

export type ComicRecord = {
  order: number;
  page: number;
  y: number | undefined;
};

export type readRecord = {
  comicRecord: Record<string, ComicRecord | undefined>;
  saveComicRecord(id: string, record: ComicRecord): void;
};

export const useReadStore = create(
  persist<readRecord>(
    (set) => ({
      comicRecord: {},
      saveComicRecord(id, record) {
        return set((state) => {
          const obj = { ...state.comicRecord, [id]: record };
          const limitObj = limitProperties(obj);
          return {
            comicRecord: limitObj,
          };
        });
      },
    }),
    {
      name: "read-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
