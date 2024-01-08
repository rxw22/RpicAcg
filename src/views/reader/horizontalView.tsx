import { View, StyleSheet, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import { ComicEpisodePage } from "@/network/types";
// import PagerView from "react-native-pager-view";
// import Image from "./VerticalImage";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";

interface Props {
  dataSource: ComicEpisodePage[];
  page?: number;
  onPageChange: (page: number) => void;
}

const HorizontalView: React.FC<Props> = ({
  dataSource,
  page = 0,
  onPageChange,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [layout, setLayout] = useState({
    width: screenWidth,
    height: (screenHeight * 3) / 5,
  });

  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      data={dataSource}
      horizontal
      pagingEnabled
      keyExtractor={(item) => item._id}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      estimatedItemSize={(layout.height * 3) / 5}
      estimatedListSize={{ height: layout.height, width: layout.width }}
      estimatedFirstItemOffset={0}
      renderItem={({ item, index }) => {
        const uri = `${item.media.fileServer}/static/${item.media.path}`;
        return (
          <View style={{ width: screenWidth, height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Image
              style={{ ...layout }}
              source={uri}
              recyclingKey={uri}
              onLoad={(e) => {
                const { width, height } = e.source;
                setLayout({
                  width: screenWidth,
                  height: (screenWidth * height) / width,
                });
              }}
            />
          </View>
        );
      }}
    />
  );
};

export default React.memo(HorizontalView);

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  pageItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
