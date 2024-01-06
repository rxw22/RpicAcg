import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Card, Text } from "react-native-paper";
import { Comic } from "@/network/types";
import Image from "@/components/image";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { Image as ExpoImage } from "expo-image";

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  "details",
  undefined
>;

interface Props {
  dataSource: Comic[];
  navigation: Navigation; // navigation传递了三层，后续修改
}

const HorizontalList: React.FC<Props> = ({ dataSource, navigation }) => {
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

  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={[styles.emptyWarpper, { width: screenWidth - 32 }]}>
        <ExpoImage
          source={require("@/assets/imgs/empty.svg")}
          style={{ height: 150, width: 150 }}
          placeholder={require("@/assets/imgs/empty.svg")}
        />
      </View>
    );
  }, []);

  return (
    <View style={{ height: 260 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={dataSource || []}
        keyExtractor={(item) => item._id}
        getItemLayout={(_, index) => ({
          length: 136,
          offset: 136 * index,
          index,
        })}
        onScroll={_onScroll}
        ListEmptyComponent={renderEmptyComponent}
        renderItem={({ item, index }) => {
          const shouldLoad = index + 1 <= currentRenderIndex;
          return (
            <ItemComponent
              shouldLoad={shouldLoad}
              item={item}
              navigation={navigation}
            />
          );
        }}
      />
    </View>
  );
};

type ItemComponentProps = {
  shouldLoad: boolean;
  item: Comic;
  navigation: Navigation;
};

const ItemComponent: React.FC<ItemComponentProps> = React.memo(
  ({ item, shouldLoad, navigation }) => {
    return (
      <View style={styles.itemWarpper}>
        <Card
          style={styles.itemCard}
          mode="contained"
          onPress={() => {
            navigation.push("details", { comicId: item._id });
          }}
        >
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
          <Text variant="bodySmall" numberOfLines={3}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
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
  emptyWarpper: {
    marginHorizontal: 8,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(HorizontalList);
