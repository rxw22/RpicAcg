import AsyncStorage from "@react-native-async-storage/async-storage";
import { limitProperties } from ".";

export type Layout = Record<string, number>;
export const COMICS_LAYOUT = "comics_layout";

class CacheUtils {
  private layout: Layout;
  private _comicId: string;

  constructor(comicId: string) {
    this.layout = {};
    this._comicId = comicId;
    this.init();
  }

  async init() {
    try {
      const result = await AsyncStorage.getItem(COMICS_LAYOUT);
      if (result !== null) {
        const value = JSON.parse(result) as Record<string, Layout>;
        this.layout = value[this._comicId] || {};
      }
    } catch (error) {
      console.log("cache error:", error);
    }
  }

  getHeight(path: string) {
    return this.layout[path];
  }

  setHeight(path: string, height: number) {
    if (height) {
      this.layout[path] = height;
    }
  }

  getLayout() {
    return this.layout;
  }

  async commit() {
    try {
      const result = await AsyncStorage.getItem(COMICS_LAYOUT);
      const value = result ? JSON.parse(result) : {} as Record<string, Layout>;
      await AsyncStorage.setItem(
        COMICS_LAYOUT,
        JSON.stringify(
          limitProperties({
            ...value,
            [this._comicId]: this.layout,
          })
        )
      );
    } catch (error) {
      console.log("setCache error", error);
    }
  }
}

export default CacheUtils;
