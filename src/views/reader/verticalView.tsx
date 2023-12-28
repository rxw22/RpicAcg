import { StyleSheet, FlatList, ViewToken } from "react-native";
import React, { useState, useRef } from "react";
import Image from "./Image";
import { ComicEpisodePage } from "@/network/types";

interface Props {
  dataSource: ComicEpisodePage[];
}

let rows = {}; 
const VerticalView: React.FC<Props> = ({ dataSource }) => {
  const onViewRef = useRef<any>(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length <= 0) {
        return;
      }
    }
  );
  const onViewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 })

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={dataSource}
      keyExtractor={(item) => item._id}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={onViewabilityConfig.current}
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
