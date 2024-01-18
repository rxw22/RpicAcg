import { StyleSheet, View } from "react-native";
import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Surface, Text, Icon } from "react-native-paper";

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

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

const Toast = forwardRef<ToastRef, Props>((_, ref) => {
  const top = useSharedValue(-60);
  const [iconInfo, setIconInfo] = useState({
    source: IconSource.info,
    color: IconColor.info,
  });
  const [content, setContent] = useState("");

  const hide = useCallback(() => {
    top.value = withTiming(-60, {
      duration: 130,
    });
  }, []);

  const show = useCallback(
    (content: string, status: "success" | "info" | "error" = "info") => {
      setContent(content);
      setIconInfo({
        source: IconSource[status],
        color: IconColor[status],
      });
      top.value = withTiming(60, {
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
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 99,
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <AnimatedSurface
        elevation={4}
        style={[styles.surface, { top }]}
      >
        <View style={{ width: 15 }} />
        <Icon size={24} {...iconInfo} />
        <View style={{ width: 15 }} />
        <View>
          <Text
            variant="bodyMedium"
            style={{ color: "#000" }}
            numberOfLines={1}
          >
            {content}
          </Text>
        </View>
        <View style={{ width: 15 }} />
      </AnimatedSurface>
    </View>
  );
});

export default React.memo(Toast);

const styles = StyleSheet.create({
  surface: {
    position: "absolute",
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
});
