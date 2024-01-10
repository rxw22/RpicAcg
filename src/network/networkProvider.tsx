import { useUserStore } from "@/store/userStore";
import HttpRequest from "./httpRequest";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { navigate } from "@/navigations/RootNavigation";
import { Icon, Portal, Surface, Text } from "react-native-paper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

type ContextType = {
  httpRequest: HttpRequest;
  Toast: {
    show(content: string, status?: "success" | "info" | "error"): void;
    hide(): void;
  };
};

const Context = React.createContext<ContextType>({
  httpRequest: new HttpRequest({}),
  Toast: { show: () => {}, hide: () => {} },
});

type Props = React.ComponentProps<typeof Context.Provider>;

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

// 问题很大，需要重新构思一下
const NetworkProvider: React.FC<Omit<Props, "value">> = (props) => {
  const { token } = useUserStore();
  const httpRequest = useMemo(
    () =>
      new HttpRequest({
        headers: { authorization: token },
        async refreshToken() {
          navigate("login", undefined);
        },
      }),
    [token]
  );

  const { width: ScreenWidth } = useWindowDimensions();
  const width = useSharedValue(0);
  const top = useSharedValue(0);
  const [iconInfo, setIconInfo] = useState({
    source: IconSource.info,
    color: IconColor.info,
  });
  const [content, setContent] = useState("");
  const [isShow, setIsShow] = useState(false);

  const ref = useRef(() => {
    setIsShow(false);
  });

  const hide = useCallback(() => {
    width.value = withTiming(0, {
      duration: 200,
    });
    top.value = withTiming(0, {
      duration: 200
    })
    let timer = setTimeout(() => {
      ref.current();
      clearTimeout(timer);
    }, 200);
  }, []);

  const show = useCallback(
    (content: string, status: "success" | "info" | "error" = "info") => {
      setIsShow(true);
      setContent(content);
      setIconInfo({
        source: IconSource[status],
        color: IconColor[status],
      });
      width.value = withTiming(ScreenWidth * 0.6, {
        duration: 200,
      });
      top.value = withTiming(70, {
        duration: 200
      });
      let timer = setTimeout(() => {
        hide();
        clearTimeout(timer);
      }, 3000);
    },
    [hide]
  );

  const Toast = useMemo(
    () => ({
      show,
      hide,
    }),
    [hide, show]
  );

  return (
    <Context.Provider {...props} value={{ httpRequest, Toast }}>
      {props.children}
      <Portal>
        {isShow && (
          <Animated.View
            style={{
              width,
              top,
              ...styles.toast,
              left: ScreenWidth * 0.2,
              right: ScreenWidth * 0.2,
            }}
          >
            <Surface elevation={4} style={styles.surface}>
              <View style={{ width: 15 }} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ color: "#000" }}>
                  {content}
                </Text>
              </View>
              <Icon size={24} {...iconInfo} />
              <View style={{ width: 15 }} />
            </Surface>
          </Animated.View>
        )}
      </Portal>
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    height: 60,
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

export default NetworkProvider;

export const useNetworkProvider = () => {
  const { httpRequest, Toast } = useContext(Context);
  return {
    httpRequest,
    Toast,
  };
};
