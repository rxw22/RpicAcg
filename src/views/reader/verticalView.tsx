import {
  StyleSheet,
  ViewToken,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import React, { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import { ComicEpisodePage } from "@/network/types";
import { Text } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import VerticalImage from "./VerticalImage";

interface Props {
  dataSource: ComicEpisodePage[];
  loading: boolean;
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
  ({ dataSource, loading, onPageChange, onScrollYChange }, ref) => {
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
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        estimatedItemSize={(layout.height * 3) / 5}
        estimatedListSize={{ height: layout.height, width: layout.width }}
        estimatedFirstItemOffset={0}
        onScroll={_onScroll}
        renderItem={({ item, index }) => {
          return <VerticalImage item={item} index={index} />;
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
