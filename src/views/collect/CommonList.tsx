import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, { useCallback } from "react";
import { Comic } from "@/network/types";
import { ActivityIndicator } from "react-native-paper";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image as ExpoImage } from "expo-image";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import Item from "./Item";

interface Props {
  dataSource: Comic[];
  navigation: NativeStackNavigationProp<RootStackParamList>;
  loadMore(): void;
  loading: boolean;
}

const CommonList: React.FC<Props> = ({
  dataSource,
  navigation,
  loadMore,
  loading,
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
    return <Item item={item} navigation={navigation} />;
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
        <ExpoImage
          source={require("@/assets/imgs/empty.svg")}
          style={{ height: 200, width: 200 }}
          placeholder={require("@/assets/imgs/empty.svg")}
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
      estimatedItemSize={190}
      ListEmptyComponent={renderEmptyComponent}
      renderItem={renderItem}
    />
  );
};

export default React.memo(CommonList);
