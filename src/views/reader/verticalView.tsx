import {
  StyleSheet,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { ComicEpisodePage } from "@/network/types";
import { FlashList } from "@shopify/flash-list";
import VerticalImage from "./VerticalImage";
import CacheUtils from "@/utils/CacheUtils";

interface Props {
  dataSource: ComicEpisodePage[];
  loading: boolean;
  cacheUtils: CacheUtils;
  onPageChange: (page: number) => void;
  onScrollYChange: (y: number) => void;
}

export interface Ref {
  scrollToIndex(index: number): void;
  scrollToOffset(y: number): void;
}

interface ViewableParams {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const VerticalView = forwardRef<Ref, Props>(
  ({ dataSource, loading, onPageChange, onScrollYChange, cacheUtils }, ref) => {
    const listRef = useRef<FlashList<any>>(null);
    const layout = useWindowDimensions();

    const _onViewableItemsChanged = ({ viewableItems }: ViewableParams) => {
      if (viewableItems.length <= 0 || !viewableItems) {
        return;
      }
      const last = viewableItems.at(-1);
      const second = viewableItems.at(-2);
      const index = last?.index || second?.index || 0;
      onPageChange(index);
    };

    useImperativeHandle(ref, () => {
      return {
        scrollToIndex(index: number) {
          listRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        },
        scrollToOffset(scrollY: number) {
          listRef.current?.scrollToOffset({
            offset: scrollY,
            animated: true,
          });
        },
      };
    });

    const _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { y } = event.nativeEvent.contentOffset;
      onScrollYChange(y);
    };

    return (
      <FlashList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        data={dataSource}
        keyExtractor={(item) => item._id}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}
        estimatedItemSize={(layout.height * 3) / 5}
        estimatedListSize={{ height: layout.height, width: layout.width }}
        estimatedFirstItemOffset={0}
        overrideItemLayout={(layout, item) => {
          const size = cacheUtils?.getHeight?.(item.media.path);
          if (size) {
            layout.size = size;
          }
        }}
        onScroll={_onScroll}
        renderItem={({ item }) => {
          return <VerticalImage item={item} cacheUtils={cacheUtils} />;
        }}
      />
    );
  }
);

export default React.memo(VerticalView);

const styles = StyleSheet.create({
  listFooter: {
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
