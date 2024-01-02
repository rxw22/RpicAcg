import { StyleSheet, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRequest } from "ahooks";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useNetworkProvider } from "@/network/networkProvider";
import { ComicEpisodePage } from "@/network/types";
// import HorizontalView from "./horizontalView";
import VerticalView from "./verticalView";
import cacheLayout from "./cacheLayout";

type Props = NativeStackScreenProps<RootStackParamList, "reader">;

const Reader: React.FC<Props> = ({ route, navigation }) => {
  const { page, comicId, order } = route.params;
  const { httpRequest } = useNetworkProvider();
  const pageInfo = useRef({
    currentPage: page,
    totalPage: 0,
  });
  const [dataSource, setDataSource] = useState<ComicEpisodePage[]>([]);

  const { data, loading, refresh, run } = useRequest(
    httpRequest.fetchComicEpisodePages.bind(httpRequest),
    {
      defaultParams: [comicId, order, page],
      onSuccess(result, [, , page]) {
        pageInfo.current.currentPage = page;
        const { pages } = result.data;
        pageInfo.current.totalPage = pages.pages;
        setDataSource([...dataSource, ...pages.docs]);
      },
      onError(e) {
        console.log(e);
      },
    }
  );

  const loadMore = () => {
    if (pageInfo.current.currentPage < pageInfo.current.totalPage) {
      run(comicId, order, pageInfo.current.currentPage + 1);
    }
  };

  // 退出阅读界面 清除图片宽高缓存
  useEffect(() => {
    return () => {
      cacheLayout.clear();
    };
  }, []);

  // 手势处理
  const gesture = Gesture.Tap().onEnd(() => {
    console.log("点击了屏幕enbd");
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <StatusBar style="light" animated hidden />
        <View style={{ height: "100%", width: "100%" }}>
          <VerticalView
            dataSource={dataSource || []}
            loadMore={loadMore}
            loading={loading}
          />
        </View>
      </View>
    </GestureDetector>
  );
};

export default React.memo(Reader);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  loadingContainer: {
    backgroundColor: "#000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
