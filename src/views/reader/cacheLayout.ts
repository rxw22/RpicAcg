type LayoutItem = {
  width: number;
  height: number;
};

// 缓存一下加载完成后的图片宽高，防止上滑抖动
class CacheLayout {
  private layoutMap: Record<number, LayoutItem>;
  constructor() {
    this.layoutMap = {};
  }
  setLayout(index: number, layout: LayoutItem) {
    this.layoutMap[index] = layout;
  }
  getLayout(index: number): LayoutItem {
    return this.layoutMap[index];
  }
  clear() {
    this.layoutMap = {};
  }
}

const cacheLayout = new CacheLayout();

export default cacheLayout;
