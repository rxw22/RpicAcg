import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { ComicEpisodePage } from "@/network/types";
import PagerView from "react-native-pager-view";
import Image from "./VerticalImage";

interface Props {
  dataSource: ComicEpisodePage[];
}

const HorizontalView: React.FC<Props> = ({ dataSource }) => {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <PagerView
      style={styles.viewPager}
      initialPage={0}
      onPageScroll={(e) => {
        if (currentPage < e.nativeEvent.position + 2) {
          setCurrentPage(e.nativeEvent.position + 2);
        }
      }}
    >
      {dataSource.map((item, index) => {
        return (
          <View style={styles.pageItem} key={item._id}>
            <Image
              shouldLoad={currentPage >= index}
              uri={`${item.media.fileServer}/static/${item.media.path}`}
              contentFit="cover"
            />
          </View>
        );
      })}
    </PagerView>
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
