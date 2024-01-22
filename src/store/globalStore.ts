import { create } from "zustand";
import { ComicSort, User } from "@/network/types";

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
  /**
   * 个人信息接口信息缓存
   */
  user: User | undefined;
  setUser(user: User): void;
  /**
   * 大家都在搜缓存
   */
  keywords: string[] | undefined;
  setKeywords(keywords: string[] | undefined): void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  comicSort: ComicSort.NewToOld,
  setComicSort(comicSort) {
    set({ comicSort });
  },

  searchSort: ComicSort.NewToOld,
  setSearchSort(searchSort) {
    set({ searchSort });
  },

  user: undefined,
  setUser(user) {
    set({ user });
  },

  keywords: undefined,
  setKeywords(keywords) {
    set({ keywords });
  },
}));
