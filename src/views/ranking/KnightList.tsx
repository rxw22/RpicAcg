import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, { useCallback } from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Knight } from "@/network/types";
import LottieView from "lottie-react-native";
import { Card, Divider, Text, TouchableRipple } from "react-native-paper";
import { Image } from "expo-image";

interface Props {
  dataSource: Knight[];
  navigate: (name: string, params: any) => void;
}

const KnightList: React.FC<Props> = ({ dataSource, navigate }) => {
  const layout = useWindowDimensions();
  const renderItem: ListRenderItem<Knight> = ({ item }) => {
    const { avatar, name, level, title, slogan, comicsUploaded, _id } = item;
    const uri = avatar
      ? `${avatar.fileServer}/static/${avatar.path}`
      : require("@/assets/imgs/user.png");

    return (
      <TouchableRipple
        onPress={() => {
          navigate("comics", {
            ca: _id,
            knight: name,
          });
        }}
        rippleColor="rgba(0, 0, 0, .2)"
      >
        <View style={styles.itemWarpper}>
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            <Card
              style={[styles.avatar, { overflow: "hidden" }]}
              mode="contained"
            >
              <Image
                style={styles.avatar}
                source={uri}
                recyclingKey={_id}
                transition={150}
              />
            </Card>
          </View>
          <View style={styles.contentWarpper}>
            <Text variant="titleMedium">{name}</Text>
            <View style={{ height: 5 }} />
            <Text variant="labelLarge">
              Lv. {level} ({title})
            </Text>
            <View style={{ height: 5 }} />
            <Text variant="bodyMedium">{slogan}</Text>
          </View>
          <View style={styles.uploadNumber}>
            <Text variant="bodySmall">{comicsUploaded}本</Text>
          </View>
        </View>
      </TouchableRipple>
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
      data={dataSource}
      keyExtractor={(item) => item._id}
      estimatedItemSize={135}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Divider />}
      ListEmptyComponent={renderEmptyComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default React.memo(KnightList);

const styles = StyleSheet.create({
  separator: {
    height: 5,
  },
  itemWarpper: {
    width: "100%",
    flexDirection: "row",
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contentWarpper: {
    flex: 1,
    paddingRight: 10,
    paddingVertical: 7,
  },
  uploadNumber: {
    position: "absolute",
    top: 7,
    right: 10,
  },
});
