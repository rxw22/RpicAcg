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

type Props = NativeStackScreenProps<RootStackParamList, "reader">;

const Reader: React.FC<Props> = ({ route, navigation }) => {
  const { comicId, order, title } = route.params;
  const { httpRequest } = useNetworkProvider();
  const headerPosition = useSharedValue(-64);
  const bottomPosition = useSharedValue(-90);
  const { data, loading, refresh, run } = useRequest(
    httpRequest.fetchComicEpisodePages.bind(httpRequest),
    {
      defaultParams: [comicId, order],
      onError(e) {
        console.log(e);
      },
    }
  );
  const listRef = useRef<Ref>(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header position={headerPosition} navigation={navigation} title={title}/>
    })
  }, []);

  // 退出阅读界面 清除图片宽高缓存
  useEffect(() => {
    return () => {
      cacheLayout.clear();
    };
  }, []);

  // 手势处理
  const gesture = Gesture.Tap().onEnd(() => {
    console.log("点击了屏幕enbd");
    headerPosition.value = withTiming(headerPosition.value === 0 ? -64 : 0);
    bottomPosition.value = withTiming(bottomPosition.value === 0 ? -90 : 0);
  });

  // 滑块回调
  const onSlidingComplete = (value: number) => {
    // listRef.current?.scrollToIndex(value);
  }

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <StatusBar style="light" animated hidden/>
        <View style={{ height: "100%", width: "100%" }}>
          <VerticalView dataSource={data || []} loading={loading} ref={listRef}/>
        </View>
        <Bottom position={bottomPosition} onSlidingComplete={onSlidingComplete} maximumValue={data?.length || 0}/>
      </View>
    </GestureDetector>
  );
};

export default React.memo(Reader);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    position: "relative"
  },
  loadingContainer: {
    backgroundColor: "#000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
