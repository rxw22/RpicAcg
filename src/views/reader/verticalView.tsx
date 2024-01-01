import { StyleSheet, ViewToken, FlatList } from "react-native";
import React, { useCallback, useRef } from "react";
import Image from "./Image";
import { ComicEpisodePage } from "@/network/types";
import { useUpdate } from "ahooks";

interface Props {
  dataSource: ComicEpisodePage[];
  loadMore(): void;
}

let lastIndex = 0;
const VerticalView: React.FC<Props> = ({ dataSource, loadMore }) => {
  const update = useUpdate();
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
    if (lastIndex < index) {
      lastIndex = index;
      update();
    }
  };
  const onViewRef = useRef(_onViewableItemsChanged);
  const onViewConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const getItem = useCallback((item: ComicEpisodePage, mount: boolean) => {
    const { media } = item;
    return (
      <Image
        shouldLoad={mount}
        uri={`${media.fileServer}/static/${media.path}`}
        contentFit="cover"
      />
    );
  }, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={dataSource}
      keyExtractor={(item) => item._id}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={onViewConfig.current}
      onEndReachedThreshold={3}
      onEndReached={loadMore}
      maxToRenderPerBatch={8}
      windowSize={13}
      renderItem={({ item, index }) => {
        const mount = index <= lastIndex + 2;
        return getItem(item, mount);
      }}
    />
  );
};

export default React.memo(VerticalView);

const styles = StyleSheet.create({});
