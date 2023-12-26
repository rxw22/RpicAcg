import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Button, Card, Text } from "react-native-paper";
import { Comic, UserFavouriteResponse } from "@/network/types";
import Image from "@/components/image";

interface Props {
  dataSource: UserFavouriteResponse | undefined;
  title: string;
}

const HorizontalList: React.FC<Props> = ({ dataSource, title }) => {
  const screenWidth = Dimensions.get("window").width;
  // 记录当前应该请求几张图片
  const [currentRenderIndex, setCurrentRenderIndex] = useState(
    Math.ceil(screenWidth / 136)
  );

  // 滚动时计算该请求第几张图片了, 不知道这样能不能优化性能？
  const _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    const { x } = contentOffset;
    const rest = 136 - (screenWidth % 136);
    const number =
      (x % 136 > rest ? Math.ceil(x / 136) + 1 : Math.ceil(x / 136)) +
      Math.ceil(screenWidth / 136);
    if (number > currentRenderIndex) {
      setCurrentRenderIndex(number);
    }
  };

  return (
    <View style={{ height: 300 }}>
      <View style={styles.title}>
        <Text variant="headlineSmall" style={{ lineHeight: 40 }}>
          {title}
        </Text>
        <Button icon="unfold-more-vertical" onPress={() => {}}>
          更多 ({dataSource?.data.comics.total || 0})
        </Button>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={dataSource?.data.comics.docs || []}
        keyExtractor={(item) => item._id}
        getItemLayout={(_, index) => ({
          length: 136,
          offset: 136 * index,
          index,
        })}
        onScroll={_onScroll}
        renderItem={({ item, index }) => {
          const shouldLoad = index + 1 <= currentRenderIndex;
          return <ItemComponent shouldLoad={shouldLoad} item={item} />;
        }}
      />
    </View>
  );
};

type ItemComponentProps = {
  shouldLoad: boolean;
  item: Comic;
};

const ItemComponent: React.FC<ItemComponentProps> = React.memo(
  ({ item, shouldLoad }) => {
    return (
      <View style={styles.itemWarpper}>
        <Card style={styles.itemCard} mode="contained" onPress={() => {}}>
          <Image
            source={
              shouldLoad
                ? {
                    uri: `${item.thumb.fileServer}/static/${item.thumb.path}`,
                  }
                : {}
            }
            style={styles.itemImage}
            contentFit="cover"
          />
        </Card>
        <View style={styles.itemTitleView}>
          <Text variant="bodyMedium" numberOfLines={4}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  title: {
    height: 40,
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },
  itemWarpper: {
    width: 120,
    height: 260,
    marginHorizontal: 8,
  },
  itemCard: {
    width: 120,
    height: 170,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: 170,
  },
  itemTitleView: {
    width: 120,
    height: 90,
    alignItems: "center",
    marginTop: 5,
  },
});

export default React.memo(HorizontalList);
