import { View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Button, Card, Text } from "react-native-paper";
import { Image } from "expo-image";
import { UserFavouriteResponse } from "@/network/types";

interface Props {
  dataSource: UserFavouriteResponse | undefined;
  title: string;
}

const HorizontalList: React.FC<Props> = ({ dataSource, title }) => {
  return (
    <>
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
        renderItem={({ item }) => {
          return (
            <View style={styles.itemWarpper}>
              <Card style={styles.itemCard}>
                <Image
                  source={{
                    uri: `${item.thumb.fileServer}/static/${item.thumb.path}`,
                  }}
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
        }}
      />
    </>
  );
};

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
