import { View, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { Comic } from "@/network/types";
import { Text, ActivityIndicator } from "react-native-paper";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import Item from "./Item";

interface Props {
  dataSource: Comic[];
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "collect",
    undefined
  >;
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

  const renderFooterComponent = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}
      >
        {loading ? (
          <ActivityIndicator animating={loading} size={26} hidesWhenStopped />
        ) : (
          <Text variant="bodyMedium">到底了...</Text>
        )}
      </View>
    );
  };

  const renderItem: ListRenderItem<Comic> = ({ item }) => {
    return <Item item={item} navigation={navigation} />;
  };

  return (
    <FlashList
      keyExtractor={(item) => item._id}
      data={dataSource}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={1}
      onEndReached={loadMore}
      ListFooterComponent={renderFooterComponent}
      estimatedItemSize={220}
      estimatedListSize={{ width: layout.width - 10, height: layout.height }}
      renderItem={renderItem}
    />
  );
};

export default React.memo(CommonList);
