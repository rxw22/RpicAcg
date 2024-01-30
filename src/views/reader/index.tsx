import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import { useRequest, useUpdate } from "ahooks";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { ActivityIndicator, FAB, Text } from "react-native-paper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
// import HorizontalView from "./horizontalView";
import VerticalView, { Ref } from "./verticalView";
import Header from "./header";
import Bottom from "./bottom";
import { useReadStore } from "@/store/readStore";
import CacheUtils from "@/utils/CacheUtils";

type Props = NativeStackScreenProps<RootStackParamList, "reader">;

const Reader: React.FC<Props> = ({ route, navigation }) => {
  const { comicId, order, title, record, isScratch, hasNext, chapterLength } =
    route.params;
  const { httpRequest } = useUtilsProvider();
  const headerPosition = useSharedValue(-120);
  const bottomPosition = useSharedValue(-90);
  const { saveComicRecord, comicRecord } = useReadStore();
  const recordRef = useRef({
    page: 0,
    y: record?.y,
  });
  const currentOrder = useRef(order);
  const fabBottom = useSharedValue(-90);
  const { width: ScreenWidth } = useWindowDimensions();
  const update = useUpdate();
  const [initLoading, setInitLoading] = useState(true);
  const cacheUtilsRef = useRef(new CacheUtils(comicId));

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

  const init = async () => {
    try {
      setInitLoading(true);
      await cacheUtilsRef.current.init();
    } catch (error) {
    } finally {
      setInitLoading(false);
    }
  };

  // 可以大幅降低上滑抖动
  useEffect(() => {
    init();
    return () => {
      cacheUtilsRef.current?.commit();
      // 保存阅读记录
      saveComicRecord(comicId, {
        order: currentOrder.current,
        page: recordRef.current.page,
        y: recordRef.current.y,
      });
    };
  }, []);

  // 跳转到指定offset
  useEffect(() => {
    const page = comicRecord[comicId]?.page || 0;
    if (
      !loading &&
      !initLoading &&
      !isScratch &&
      currentOrder.current === order
    ) {
      setTimeout(() => {
        listRef.current?.scrollToIndex(page);
      }, 150);
    }
  }, [loading]);

  // 手势处理
  const gesture = Gesture.Tap()
    .hitSlop({
      left: -ScreenWidth * 0.25,
      width: ScreenWidth * 0.5,
    })
    .onEnd(() => {
      headerPosition.value = withTiming(headerPosition.value === 0 ? -120 : 0);
      bottomPosition.value = withTiming(bottomPosition.value === 0 ? -90 : 0);
    });

  // 翻页回调
  const onPageChange = useCallback(
    (page: number) => {
      recordRef.current.page = page;
      update();
      if (
        page >= (data?.length || 1) - 1 &&
        hasNext &&
        currentOrder.current < chapterLength
      ) {
        fabBottom.value = withTiming(0, {
          duration: 300,
        });
      } else if (fabBottom.value === 0) {
        fabBottom.value = withTiming(-90, {
          duration: 300,
        });
      }
    },
    [update, hasNext, data, chapterLength]
  );

  // 滑动回调
  const onScrollYChange = useCallback((y: number) => {
    recordRef.current.y = y;
  }, []);

  // 下一章
  const flip = () => {
    if (hasNext) {
      currentOrder.current++;
      recordRef.current = {
        page: 0,
        y: 0,
      };
      fabBottom.value = withTiming(-90, {
        duration: 300,
      });
      run(comicId, currentOrder.current);
    }
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <StatusBar style="light" animated />
        <View
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {loading || initLoading ? (
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
              cacheUtils={cacheUtilsRef.current}
            />
            // <HorizontalView
            //   dataSource={data || []}
            //   page={y ? comicRecord[comicId]?.page || 0 : 0}
            //   onPageChange={onPageChange}
            // />
          )}
          {data?.length && !loading && (
            <View style={styles.countPage}>
              <Text variant="bodyMedium" style={{ color: "#fff" }}>
                第 {currentOrder.current} 章: {recordRef.current.page + 1}/
                {data?.length}
              </Text>
            </View>
          )}
        </View>
        <Animated.View style={[styles.fab, { bottom: fabBottom }]}>
          <FAB
            icon="skip-next"
            onPress={() => {
              flip();
            }}
          />
        </Animated.View>
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: -90,
  },
  countPage: {
    position: "absolute",
    bottom: 8,
    left: 20,
  },
});
