import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Comic } from "@/network/types";
import { LayoutItem } from "@/views/reader/cacheLayout";

type ComicRecord = {
  order: number;
  page: number;
  y: number;
  layout: Record<number, LayoutItem>;
};

export type readRecord = {
  localCollect: Comic[];
  browses: Comic[];
  addRecord(record: Comic | undefined, flag: "localCollect" | "browses"): void;
  comicRecord: Record<string, ComicRecord | undefined>;
  saveComicRecord(id: string, record: ComicRecord): void;
};

// 限制一下comicRecord的储存大小,最多储存maxPropertiesLength条历史记录
function limitProperties(
  obj: Record<string, ComicRecord | undefined>,
  maxPropertiesLength: number = 500
) {
  let keys = Object.keys(obj);
  if (keys.length > maxPropertiesLength) {
    let oldestKey = keys[0];
    delete obj[oldestKey];
  }
  return obj;
}

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
