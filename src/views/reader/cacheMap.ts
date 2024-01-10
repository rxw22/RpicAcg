export type Layout = Record<string, number>;

// 缓存一下加载完成后的图片宽高，防止上滑抖动
class CacheMap {
  private layoutMap: Layout;
  constructor() {
    this.layoutMap = {};
  }
  initCacheMap(layouts: Layout = {}) {
    this.layoutMap = layouts;
  }
  setHeight(path: string, height: number) {
    this.layoutMap[path] = height;
  }
  getHeight(path: string): number {
    return this.layoutMap[path];
  }
  getCacheMap() {
    return this.layoutMap;
  }
  clear() {
    this.layoutMap = {};
  }
}

const cacheMap = new CacheMap();

export default cacheMap;
