import { StyleSheet, ViewToken, FlatList, View } from "react-native";
import React, { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import Image from "./Image";
import { ComicEpisodePage } from "@/network/types";
import { useUpdate } from "ahooks";
import { ActivityIndicator, Text } from "react-native-paper";

interface Props {
  dataSource: ComicEpisodePage[];
  loading: boolean;
}

export interface Ref {
  scrollToIndex(index: number): void;
}

let lastIndex = 0;
const VerticalView = forwardRef<Ref, Props>(({ dataSource, loading }, ref) => {
  const update = useUpdate();
  const listRef = useRef<FlatList<any>>(null);
  const _onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    if (viewableItems.length <= 0) {
      return;
    }
    const last = viewableItems.at(-1);
    const index = last?.index || 0;
    lastIndex = index;
    update();
  };
  const onViewRef = useRef(_onViewableItemsChanged);
  const onViewConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const renderFooterComponent = useMemo(() => {
    return (
      <View style={styles.listFooter}>
        <Text
          variant="bodyLarge"
          style={{ color: "#fff", textAlign: "center" }}
        >
          {loading ? "加载中..." : "到底了..."}
        </Text>
      </View>
    );
  }, [loading]);

  useImperativeHandle(ref, () => {
    return {
      scrollToIndex(index: number) {
        listRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      },
    };
  });

  return (
    <FlatList
      ref={listRef}
      showsVerticalScrollIndicator={false}
      data={dataSource}
      keyExtractor={(item) => item._id}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={onViewConfig.current}
      initialNumToRender={8}
      ListFooterComponent={renderFooterComponent}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 700));
        wait.then(() => {
          listRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
      }}
      renderItem={({ item, index }) => {
        const mount = index <= lastIndex + 2 && index >= lastIndex - 3;
        const { media } = item;
        return (
          <Image
            index={index}
            shouldLoad={mount}
            uri={`${media.fileServer}/static/${media.path}`}
            contentFit="cover"
          />
        );
      }}
    />
  );
});

export default React.memo(VerticalView);

const styles = StyleSheet.create({
  listFooter: {
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
