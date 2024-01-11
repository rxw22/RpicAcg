import { StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useRequest } from "ahooks";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { ActivityIndicator } from "react-native-paper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
// import HorizontalView from "./horizontalView";
import VerticalView, { Ref } from "./verticalView";
import cacheMap from "./cacheMap";
import Header from "./header";
import Bottom from "./bottom";
import { useReadStore } from "@/store/readStore";

type Props = NativeStackScreenProps<RootStackParamList, "reader">;

const Reader: React.FC<Props> = ({ route, navigation }) => {
  const { comicId, order, title, record, isScratch } = route.params;
  const { httpRequest } = useUtilsProvider();
  const headerPosition = useSharedValue(-64);
  const bottomPosition = useSharedValue(-90);
  const { saveComicRecord, comicRecord } = useReadStore();
  const recordRef = useRef({
    page: 0,
    y: record?.y,
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

  // 可以大幅降低上滑抖动
  useEffect(() => {
    if (!isScratch) {
      cacheMap.initCacheMap(record?.layout);
    }
    return () => {
      // 保存阅读记录
      saveComicRecord(comicId, {
        order,
        page: recordRef.current.page,
        y: recordRef.current.y,
        layout: cacheMap.getCacheMap(),
      });
      // 清除图片宽高缓存
      cacheMap.clear();
    };
  }, []);

  // 跳转到指定offset
  useEffect(() => {
    const page = comicRecord[comicId]?.page || 0;
    if (!loading && !isScratch) {
      setTimeout(() => {
        // listRef.current?.scrollToOffset(y);
        listRef.current?.scrollToIndex(page);
      }, 180);
    }
  }, [loading]);

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
        <View
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {loading ? (
            <View
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator animating size="large" />
            </View>
          ) : (
            <VerticalView
              dataSource={data || []}
              loading={loading}
              ref={listRef}
              onPageChange={onPageChange}
              onScrollYChange={onScrollYChange}
            />
            // <HorizontalView
            //   dataSource={data || []}
            //   page={y ? comicRecord[comicId]?.page || 0 : 0}
            //   onPageChange={onPageChange}
            // />
          )}
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
