import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Comic } from "@/network/types";
import { limitProperties } from "@/utils";

export type ComicRecord = {
  order: number;
  page: number;
  y: number | undefined;
};

export type readRecord = {
  localCollect: Comic[];
  browses: Comic[];
  addRecord(record: Comic | undefined, flag: "localCollect" | "browses"): void;
  comicRecord: Record<string, ComicRecord | undefined>;
  saveComicRecord(id: string, record: ComicRecord): void;
};

export const useReadStore = create(
  persist<readRecord>(
    (set) => ({
      localCollect: [],
      browses: [],
      addRecord: (record, flag) => {
        if (!record) {
          return;
        }
        return set((state) => {
          const rest = state[flag].filter((item) => item._id !== record._id);
          return { [flag]: [record, ...rest] };
        });
      },
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
