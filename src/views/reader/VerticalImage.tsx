import { View, Dimensions, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import {
  Image,
  ImageLoadEventData,
  ImageErrorEventData,
  ImageProgressEventData,
} from "expo-image";
import { Text, useTheme } from "react-native-paper";
import cacheMap from "./cacheMap";
import * as Progress from "react-native-progress";
import { ComicEpisodePage } from "@/network/types";

interface Props {
  item: ComicEpisodePage;
}

const ReaderImage: React.FC<Props> = ({ item }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const { media } = item;
  const lastUri = useRef(`${media.fileServer}/static/${media.path}`);
  const uri = `${media.fileServer}/static/${media.path}`;

  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const height = cacheMap.getHeight(media.path) || (screenHeight * 3) / 5;

  // 图片宽高有缓存使用缓存数据，可以避免抖动
  const initLayout = {
    width: screenWidth,
    height,
  };

  const [layout, setLayout] = useState(initLayout);

  // 重置一些状态
  if (uri !== lastUri.current) {
    lastUri.current = uri;
    setLoading(true);
    setProgress(0);
    setLayout(initLayout);
  }

  const _onLoad = (event: ImageLoadEventData) => {
    const { height, width } = event.source;
    setLayout({ ...layout, height: (screenWidth * height) / width });
    cacheMap.setHeight(media.path, (screenWidth * height) / width);
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
          styles.center,
          {
            ...initLayout,
            position: "relative",
          },
        ]}
      >
        <Progress.Pie
          progress={progress}
          size={44}
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
          recyclingKey={uri}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        ...layout,
        position: "relative",
      }}
    >
      {error && (
        <View
          style={[
            styles.center,
            layout,
            { position: "absolute", top: 0, left: 0, zIndex: 9 },
          ]}
        >
          <Text variant="bodyLarge" style={{ color: "#fff" }}>
            {error}
          </Text>
        </View>
      )}
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri }}
        cachePolicy="disk"
        recyclingKey={uri}
      />
    </View>
  );
};

export default React.memo(ReaderImage);

const styles = StyleSheet.create({
  loadingWarpper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "pink",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
