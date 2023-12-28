import { StyleSheet, ViewToken, Dimensions } from "react-native";
import React from "react";
import Image from "./Image";
import { ComicEpisodePage } from "@/network/types";
import { FlashList } from "@shopify/flash-list";

interface Props {
  dataSource: ComicEpisodePage[];
}

const VerticalView: React.FC<Props> = ({ dataSource }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const _onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    if (viewableItems.length <= 0) {
      return;
    }
  };

  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      data={dataSource}
      keyExtractor={(item) => item._id}
      onViewableItemsChanged={_onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      estimatedItemSize={(screenHeight * 3) / 4}
      estimatedListSize={{ height: screenHeight, width: screenWidth }}
      renderItem={({ item, index }) => {
        return (
          <Image
            shouldLoad={true}
            uri={`${item.media.fileServer}/static/${item.media.path}`}
            contentFit="cover"
          />
        );
      }}
    />
  );
};

export default React.memo(VerticalView);

const styles = StyleSheet.create({});
