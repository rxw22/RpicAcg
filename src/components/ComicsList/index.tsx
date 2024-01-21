import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, { useCallback } from "react";
import { Comic } from "@/network/types";
import { ActivityIndicator } from "react-native-paper";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import LottieView from "lottie-react-native";
import Item from "./Item";

interface Props {
  dataSource: Comic[];
  navigate: (name: string, params: any) => void;
  loadMore(): void;
  loading: boolean;
  CustomItem?: any;
}

const CommonList: React.FC<Props> = ({
  dataSource,
  navigate,
  loadMore,
  loading,
  CustomItem,
}) => {
  const layout = useWindowDimensions();
  const renderFooter = () => {
    return loading ? (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        <ActivityIndicator size="small" animating />
      </View>
    ) : null;
  };

  const renderItem: ListRenderItem<Comic> = ({ item }) => {
    return CustomItem ? (
      <CustomItem item={item} navigate={navigate} />
    ) : (
      <Item item={item} navigate={navigate} />
    );
  };

  const renderEmptyComponent = useCallback(() => {
    const styles = StyleSheet.create({
      emptyWarpper: {
        height: layout.height * 0.7,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      },
    });
    return (
      <View style={[styles.emptyWarpper]}>
        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
          }}
          source={require("@/assets/lottie/empty.json")}
        />
      </View>
    );
  }, []);

  return (
    <FlashList
      keyExtractor={(item) => item._id}
      data={dataSource}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={1}
      onEndReached={loadMore}
      ListFooterComponent={renderFooter}
      estimatedItemSize={160}
      ListEmptyComponent={renderEmptyComponent}
      renderItem={renderItem}
    />
  );
};

export default React.memo(CommonList);
