import { View, Dimensions, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import {
  Image,
  ImageLoadEventData,
  ImageErrorEventData,
  ImageProgressEventData,
} from "expo-image";
import { Text, useTheme } from "react-native-paper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import cacheLayout, { LayoutItem } from "./cacheLayout";
import * as Progress from "react-native-progress";
import { ComicEpisodePage } from "@/network/types";

interface Props {
  item: ComicEpisodePage;
  index: number;
  imageLayout: Record<number, LayoutItem> | undefined;
}

const ReaderImage: React.FC<Props> = ({ item, index, imageLayout }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  // 图片宽高有缓存使用缓存数据，可以避免抖动
  const initLayout = cacheLayout.getLayout(index) || imageLayout?.[index];
  const [layout, setLayout] = useState(
    initLayout
      ? initLayout
      : {
          width: screenWidth,
          height: (screenHeight * 3) / 5,
        }
  );
  const imageOpacity = useSharedValue(0);

  const { media } = item;
  const lastUri = useRef(`${media.fileServer}/static/${media.path}`);
  const uri = `${media.fileServer}/static/${media.path}`;
  // 重置一些状态
  if (uri !== lastUri.current) {
    lastUri.current = uri;
    setLoading(true);
    setProgress(0);
    setError("");
    setLayout(
      initLayout
        ? initLayout
        : {
            width: screenWidth,
            height: (screenHeight * 3) / 5,
          }
    );
    imageOpacity.value = 0;
  }

  const _onLoad = (event: ImageLoadEventData) => {
    const { height, width } = event.source;
    setLayout({ ...layout, height: (screenWidth * height) / width });
    cacheLayout.setLayout(index, {
      ...layout,
      height: (screenWidth * height) / width,
    });
    imageOpacity.value = withTiming(imageOpacity.value + 1, { duration: 400 });
  };

  const _onLoadStart = () => {
    setLoading(true);
    setError("");
  };

  const _onLoadEnd = () => {
    setLoading(false);
  };

  const _onError = (event: ImageErrorEventData) => {
    const { error } = event;
    setError(error);
    console.log(error);
  };

  const _onProgress = (event: ImageProgressEventData) => {
    const { loaded, total } = event;
    const progress = Number((loaded / total).toFixed(1));
    setProgress(progress);
  };

  // 加载状态
  if (loading) {
    return (
      <View
        style={[
          styles.loadingWarpper,
          {
            ...layout,
            position: "relative",
          },
        ]}
      >
        <Progress.Pie
          progress={progress}
          size={50}
          color={theme.colors.primary}
        />
        <Image
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: -1,
            opacity: 0,
          }}
          source={{ uri }}
          onLoadStart={_onLoadStart}
          onLoadEnd={_onLoadEnd}
          onError={_onError}
          onLoad={_onLoad}
          onProgress={_onProgress}
          cachePolicy="disk"
        />
      </View>
    );
  }

  // 加载错误
  if (!loading && error) {
    <View style={[styles.loadingWarpper, layout]}>
      <Text variant="bodyLarge">{error}</Text>
    </View>;
  }

  return (
    <View
      style={{
        ...layout,
        position: "relative",
      }}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          opacity: imageOpacity,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={{ uri }}
          cachePolicy="disk"
        />
      </Animated.View>
    </View>
  );
};

export default React.memo(ReaderImage);

const styles = StyleSheet.create({
  loadingWarpper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
