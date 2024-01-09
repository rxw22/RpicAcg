import { StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { Comic } from "@/network/types";
import { Text, ActivityIndicator } from "react-native-paper";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image as ExpoImage } from "expo-image";

import Item from "./Item";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

interface Props {
  dataSource: Comic[];
  navigation: CompositeNavigationProp<
  BottomTabNavigationProp<RootBottomTabsParamList, "ranking", undefined>,
  NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >
>;
  loading: boolean;
}

const CommonList: React.FC<Props> = ({
  dataSource,
  navigation,
  loading,
}) => {
  const renderItem: ListRenderItem<Comic> = ({ item }) => {
    return <Item item={item} navigation={navigation} />;
  };

  const renderEmptyComponent = useCallback(() => {
    const styles = StyleSheet.create({
      emptyWarpper: {
        marginHorizontal: 8,
        height: "100%",
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
      estimatedItemSize={190}
      ListEmptyComponent={renderEmptyComponent}
      renderItem={renderItem}
    />
  );
};

export default React.memo(CommonList);
