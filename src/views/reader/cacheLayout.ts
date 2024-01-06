export type LayoutItem = {
  width: number;
  height: number;
};

// 缓存一下加载完成后的图片宽高，防止上滑抖动
class CacheLayout {
  private layoutMap: Record<number, LayoutItem>;
  constructor() {
    this.layoutMap = {};
  }
  initLayout(layouts: Record<number, LayoutItem>) {
    this.layoutMap = layouts;
  }
  setLayout(index: number, layout: LayoutItem) {
    this.layoutMap[index] = layout;
  }
  getLayout(index: number): LayoutItem {
    return this.layoutMap[index];
  }
  getAllLayout() {
    return this.layoutMap;
  }
  clear() {
    this.layoutMap = {};
  }
}

const cacheLayout = new CacheLayout();

export default cacheLayout;
