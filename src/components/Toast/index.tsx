import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Surface, Text, Icon, ActivityIndicator } from "react-native-paper";

enum IconSource {
  success = "check-circle",
  error = "close-circle",
  info = "alert-circle",
}

enum IconColor {
  success = "green",
  error = "red",
  info = "#000",
}

export type ToastRef = {
  show(content: string, status?: "success" | "info" | "error"): void;
  hide(): void;
};

type Props = {};

const Toast = forwardRef<ToastRef, Props>((_, ref) => {
  const { width: ScreenWidth } = useWindowDimensions();
  const width = useSharedValue(0);
  const [iconInfo, setIconInfo] = useState({
    source: IconSource.info,
    color: IconColor.info,
  });
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const hide = useCallback(() => {
    width.value = withTiming(0, {
      duration: 130,
    });
    setLoading(false);
  }, [setLoading]);

  const show = useCallback(
    (content: string, status: "success" | "info" | "error" = "info") => {
      setContent(content);
      setIconInfo({
        source: IconSource[status],
        color: IconColor[status],
      });
      width.value = withTiming(ScreenWidth * 0.6, {
        duration: 130,
      });
      let timer = setTimeout(() => {
        hide();
        clearTimeout(timer);
      }, 3000);
    },
    [hide]
  );

  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    };
  });

  return (
    <Animated.View
      style={{
        ...styles.toast,
        left: ScreenWidth * 0.2,
        right: ScreenWidth * 0.2,
        width,
        top: 70,
      }}
    >
      <Surface elevation={4} style={styles.surface}>
        <View style={{ width: 15 }} />
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyMedium"
            style={{ color: "#000" }}
            numberOfLines={1}
          >
            {content}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator animating size={24} />
        ) : (
          <Icon size={24} {...iconInfo} />
        )}
        <View style={{ width: 15 }} />
      </Surface>
    </Animated.View>
  );
});

export default React.memo(Toast);

const styles = StyleSheet.create({
  toast: {
    height: 60,
    position: "absolute",
  },
  surface: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
});
