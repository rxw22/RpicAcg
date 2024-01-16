import { StyleSheet, View } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";
import { useRequest } from "ahooks";
import BgBox from "@/components/bgBox";
import React from "react";
import { useUtilsProvider } from "@/network/utilsProvider";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Doc } from "@/network/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "game">,
  NativeStackScreenProps<RootStackParamList>
>;

function Game({ navigation }: Props) {
  const { httpRequest } = useUtilsProvider();
  const { data, loading, refresh, error } = useRequest(
    httpRequest.fecthGames.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
      },
    }
  );

  const renderItem: ListRenderItem<Doc> = ({ item }) => {
    const { icon, title, publisher, _id } = item;
    const uri = `${icon.fileServer}/static/${icon.path}`;
    return (
      <TouchableRipple
        onPress={() => {
          navigation.navigate("game-details", {
            gameId: _id,
            title: title,
          });
        }}
        rippleColor="rgba(0, 0, 0, .2)"
      >
        <View style={styles.listItem}>
          <Card mode="contained" style={styles.imageWarpper}>
            <Image
              style={{ height: "100%", width: "100%" }}
              source={uri}
              recyclingKey={_id}
              transition={150}
            />
          </Card>
          <View>
            <Text
              variant="titleMedium"
              style={{ textAlign: "center" }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text variant="labelMedium" style={{ textAlign: "center" }}>
              {publisher}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  return (
    <BgBox
      style={styles.container}
      loading={loading}
      refresh={refresh}
      error={error?.message}
    >
      <View style={styles.warpper}>
        <FlashList
          data={data}
          keyExtractor={(item) => item._id}
          estimatedItemSize={210}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      </View>
    </BgBox>
  );
}

export default React.memo(Game);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  warpper: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 8,
  },
  listItem: {
    height: 210,
    width: "100%",
    padding: 8,
  },
  imageWarpper: {
    width: "100%",
    height: 150,
    overflow: "hidden",
  },
});
