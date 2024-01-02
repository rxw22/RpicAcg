import { View, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Image,
  ImageProps,
  ImageLoadEventData,
  ImageErrorEventData,
} from "expo-image";
import { ActivityIndicator, Text } from "react-native-paper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

interface Props extends ImageProps {
  uri: string;
  shouldLoad: boolean;
}

const ReaderImage: React.FC<Props> = ({ shouldLoad, uri, ...props }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState({
    width: screenWidth,
    height: (screenHeight * 3) / 5,
  });
  const imageOpacity = useSharedValue(0);

  const _onLoad = (event: ImageLoadEventData) => {
    const { height, width } = event.source;
    setLayout({ ...layout, height: (screenWidth * height) / width });
    setMounted(true);
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

  // 加载状态
  if (loading) {
    return (
      <View
        style={[
          styles.loadingWarpper,
          {
            width: screenWidth,
            height: (screenHeight * 3) / 5,
            position: "relative",
          },
        ]}
      >
        <ActivityIndicator animating size="large" />
        <Image
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: -1,
            opacity: 0,
          }}
          source={shouldLoad ? { uri } : {}}
          onLoadStart={_onLoadStart}
          onLoadEnd={_onLoadEnd}
          onError={_onError}
          onLoad={_onLoad}
          cachePolicy="disk"
        />
      </View>
    );
  }

  // 加载错误
  if (!loading && error) {
    <View
      style={[
        styles.loadingWarpper,
        {
          width: screenWidth,
          height: (screenHeight * 3) / 5,
        },
      ]}
    >
      <Text variant="bodyLarge">{error}</Text>
    </View>;
  }

  // 加载完成，并且不可见之后
  if (!shouldLoad && mounted && !error) {
    return (
      <View
        style={{ ...layout, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <View style={{ ...layout, position: "relative" }}>
      <Animated.View
        style={{ width: "100%", height: "100%", opacity: imageOpacity }}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={{ uri }}
          {...props}
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
