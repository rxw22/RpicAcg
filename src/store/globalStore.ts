import { create } from "zustand";
import { ComicSort } from "@/network/types";

interface GlobalStore {
  /**
   * 漫画排序
   */
  comicSort: ComicSort;
  setComicSort(comicSort: ComicSort): void;
  /**
   * 搜索漫画排序
   */
  searchSort: ComicSort;
  setSearchSort(comicSort: ComicSort): void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  comicSort: ComicSort.Default,
  setComicSort(comicSort) {
    set({ comicSort });
  },
  searchSort: ComicSort.NewToOld,
  setSearchSort(searchSort) {
    set({ searchSort });
  },
}));
