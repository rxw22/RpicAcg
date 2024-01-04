import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import React, { useCallback } from "react";
import { Comic } from "@/network/types";
import {
  Card,
  useTheme,
  Text,
  Icon,
  ActivityIndicator,
} from "react-native-paper";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image } from "expo-image";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

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
  const theme = useTheme();
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

  const renderItem: ListRenderItem<Comic> = useCallback(({ item }) => {
    const { thumb, author, title, totalLikes, totalViews, categories } = item;
    return (
      <Pressable
        style={({ pressed }) => [
          pressed
            ? {
                backgroundColor: `#00000020`,
              }
            : {},
          styles.itemContainer,
        ]}
        onPress={() => {
          navigation.navigate("details", { comicId: item._id });
        }}
      >
        <View
          style={[
            styles.full,
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <Card style={styles.itemWarpper} mode="contained">
            <Image
              style={styles.full}
              source={{ uri: `${thumb.fileServer}/static/${thumb.path}` }}
            />
          </Card>
          <View style={styles.itemDescription}>
            <View>
              <Text variant="titleMedium" numberOfLines={2}>
                {title}
              </Text>
              <Text variant="labelSmall">{author}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                paddingVertical: 8,
                overflow: "hidden",
              }}
            >
              {categories.map((item) => (
                <View
                  key={item}
                  style={{
                    padding: 6,
                    backgroundColor: theme.colors.secondaryContainer,
                    borderRadius: 6,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text variant="labelMedium">{item}</Text>
                </View>
              ))}
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                  justifyContent: "space-between",
                }}
              >
                <Text variant="labelSmall">{totalLikes} </Text>
                <Icon source="heart" size={12} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                  justifyContent: "space-between",
                }}
              >
                <Text variant="labelSmall">{totalViews} </Text>
                <Icon source="eye" size={12} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }, []);

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

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 210,
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
  },
  itemWarpper: {
    width: 142,
    height: 200,
    overflow: "hidden",
  },
  itemDescription: {
    flex: 1,
    marginLeft: 8,
    height: "100%",
    justifyContent: "space-between",
  },
  full: {
    width: "100%",
    height: "100%",
  },
});
