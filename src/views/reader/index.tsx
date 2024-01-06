import { StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useRequest } from "ahooks";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useNetworkProvider } from "@/network/networkProvider";
// import HorizontalView from "./horizontalView";
import VerticalView, { Ref } from "./verticalView";
import cacheLayout from "./cacheLayout";
import Header from "./header";
import Bottom from "./bottom";
import { useReadStore } from "@/store/readStore";

type Props = NativeStackScreenProps<RootStackParamList, "reader">;

const Reader: React.FC<Props> = ({ route, navigation }) => {
  const { comicId, order, title, y } = route.params;
  const { httpRequest } = useNetworkProvider();
  const headerPosition = useSharedValue(-64);
  const bottomPosition = useSharedValue(-90);
  const { saveComicRecord, comicRecord } = useReadStore();
  const recordRef = useRef({
    page: 0,
    y,
  });

  const { data, loading, refresh, run } = useRequest(
    httpRequest.fetchComicEpisodePages.bind(httpRequest),
    {
      defaultParams: [comicId, order],
      onError(e) {
        console.log("Reader Error", e);
      },
    }
  );
  const listRef = useRef<Ref>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          position={headerPosition}
          navigation={navigation}
          title={title}
        />
      ),
    });
  }, []);

  useEffect(() => {
    // 初始化赋值之前保存的各别图片的宽高, 如果是继续阅读才初始化
    // if (y) {
    //   cacheLayout.initLayout(comicRecord[comicId]?.layout || {});
    // }
    return () => {
      // 保存阅读记录
      saveComicRecord(comicId, {
        order,
        page: recordRef.current.page,
        y: recordRef.current.y,
        layout: cacheLayout.getAllLayout(),
      });
      // 清除图片宽高缓存
      cacheLayout.clear();
    };
  }, []);

  // 跳转到指定offset
  // useEffect(() => {
  //   if (!loading && y) {
  //     setTimeout(() => {
  //       listRef.current?.scrollToOffset(y);
  //     }, 180);
  //   }
  // }, [loading]);

  // 手势处理
  const gesture = Gesture.Tap().onEnd(() => {
    headerPosition.value = withTiming(headerPosition.value === 0 ? -64 : 0);
    bottomPosition.value = withTiming(bottomPosition.value === 0 ? -90 : 0);
  });

  const onPageChange = (page: number) => {
    recordRef.current.page = page;
  };

  const onScrollYChange = (y: number) => {
    recordRef.current.y = y;
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <StatusBar style="light" animated hidden />
        <View style={{ height: "100%", width: "100%" }}>
          <VerticalView
            dataSource={data || []}
            loading={loading}
            ref={listRef}
            onPageChange={onPageChange}
            onScrollYChange={onScrollYChange}
          />
        </View>
        <Bottom position={bottomPosition} />
      </View>
    </GestureDetector>
  );
};

export default React.memo(Reader);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    backgroundColor: "#000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
