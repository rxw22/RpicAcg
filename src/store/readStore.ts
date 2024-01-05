import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Comic } from "@/network/types";
import { LayoutItem } from "@/views/reader/cacheLayout";

type ComicRecord = {
  order: number;
  page: number;
  y: number;
  layout: Record<number, LayoutItem>
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
          return {
            comicRecord: { ...state.comicRecord, [id]: record },
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
