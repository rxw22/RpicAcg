import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Text, Card } from "react-native-paper";
import { useRequest } from "ahooks";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";

import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import React, { useEffect } from "react";
import { useRequestStore } from "@/store/requestStore";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "category">,
  NativeStackScreenProps<RootStackParamList>
>;

const Category: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();
  const layout = useWindowDimensions();
  const { categories, setCategories } = useRequestStore();

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

  return (
    <BgBox style={styles.container} error={error?.message} refresh={refresh}>
      <View style={{ height: "100%", width: "100%" }}>
        <FlashList
          data={(data || categories).filter((item) => !item.active)}
          keyExtractor={(item) => item.title}
          numColumns={3}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refresh}
          renderItem={({ item }) => {
            const { thumb, title } = item;
            const uri = thumb.fileServer.includes("static")
              ? `${thumb.fileServer}${thumb.path}`
              : `${thumb.fileServer}/static/${thumb.path}`;
            return (
              <View
                style={{
                  height: layout.width / 3 + 40,
                  width: layout.width / 3,
                  padding: 8,
                }}
              >
                <Card
                  mode="contained"
                  style={{
                    height: layout.width / 3,
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
                    source={{ uri }}
                    recyclingKey={uri}
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
                  <Text variant="bodyMedium">{title}</Text>
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
