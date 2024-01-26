import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Text, Card } from "react-native-paper";
import { useRequest } from "ahooks";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";

import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import { Category as CategoryInterface, ComicSort } from "@/network/types";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import React, { useEffect } from "react";
import { useRequestStore } from "@/store/requestStore";
import { useGlobalStore } from "@/store/globalStore";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "category">,
  NativeStackScreenProps<RootStackParamList>
>;

interface FixCatItem {
  img: string;
  title: string;
  navigator: () => void;
}

const Category: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();
  const layout = useWindowDimensions();
  const { categories, setCategories } = useRequestStore();
  const { setComicSort } = useGlobalStore();
  const fixCats: FixCatItem[] = [
    {
      img: require("@/assets/imgs/ranking.jpg"),
      title: "哔咔排行榜",
      navigator: () => {
        navigation.navigate("ranking");
      },
    },
    {
      img: require("@/assets/imgs/cat_forum.jpg"),
      title: "哔咔留言板",
      navigator: () => {
        navigation.navigate("comment", {
          comicId: "5822a6e3ad7ede654696e482",
        });
      },
    },
    {
      img: require("@/assets/imgs/cat_latest.jpg"),
      title: "最新更新",
      navigator: () => {
        setComicSort(ComicSort.NewToOld);
        navigation.navigate("comics", {
          knight: "最新更新",
        });
      },
    },
    {
      img: require("@/assets/imgs/cat_random.jpg"),
      title: "随机本子",
      navigator: () => {
        navigation.navigate("random");
      },
    },
  ];

  const { data, loading, error, refresh, run } = useRequest(
    httpRequest.fetchCategories.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess(result) {
        setCategories(result);
      },
    }
  );

  // 这个分类变动不大，有值得话就不请求
  useEffect(() => {
    if (!categories.length) {
      run();
    }
  }, []);

  const dataSource = [
    ...fixCats,
    ...(data || categories).filter((item) => !item.active || !item.isWeb),
  ];

  return (
    <BgBox style={styles.container} error={error?.message} refresh={refresh}>
      <View style={{ height: "100%", width: "100%" }}>
        <FlashList
          data={dataSource}
          keyExtractor={(item) => item.title}
          numColumns={3}
          estimatedItemSize={layout.width / 3 + 24}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refresh}
          renderItem={({ item }) => {
            if (
              ["哔咔排行榜", "最新更新", "哔咔留言板", "随机本子"].includes(
                item.title
              )
            ) {
              const { img, navigator, title } = item as FixCatItem;
              return (
                <View
                  style={{
                    height: layout.width / 3 + 24,
                    width: layout.width / 3,
                    padding: 8,
                  }}
                >
                  <Card
                    mode="contained"
                    style={{
                      height: layout.width / 3 - 16,
                      width: "100%",
                      overflow: "hidden",
                    }}
                    onPress={() => {
                      navigator();
                    }}
                  >
                    <Image
                      source={img}
                      recyclingKey={title}
                      transition={100}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </Card>
                  <View
                    style={{
                      height: 40,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text variant="labelLarge">{title}</Text>
                  </View>
                </View>
              );
            }
            const { thumb, title } = item as CategoryInterface;
            let uri = thumb.fileServer.includes("static")
              ? `${thumb.fileServer}${thumb.path}`
              : `${thumb.fileServer}/static/${thumb.path}`;
            if (item.title === "大濕推薦") {
              uri = require("@/assets/imgs/dashituijian.jpg");
            }
            return (
              <View
                style={{
                  height: layout.width / 3 + 24,
                  width: layout.width / 3,
                  padding: 8,
                }}
              >
                <Card
                  mode="contained"
                  style={{
                    height: layout.width / 3 - 16,
                    width: "100%",
                    overflow: "hidden",
                  }}
                  onPress={() => {
                    navigation.navigate("comics", {
                      c: title,
                    });
                  }}
                >
                  <Image
                    source={uri}
                    recyclingKey={title}
                    transition={100}
                    style={{ height: "100%", width: "100%" }}
                  />
                </Card>
                <View
                  style={{
                    height: 40,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text variant="labelLarge">{title}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </BgBox>
  );
};

export default React.memo(Category);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
