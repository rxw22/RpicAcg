import { RootStackParamList } from "@/navigations/mainStacks/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useUserStore } from "@/store/userStore";

type Props = NativeStackScreenProps<RootStackParamList, "webview">;

const userAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";

const WebViewPage: React.FC<Props> = ({ navigation, route }) => {
  const {
    uri,
    source,
    injectedJavaScript,
    userAgent: Agent = userAgent,
  } = route.params;
  const { saveUserInfo } = useUserStore();
  useEffect(() => {
    navigation.setOptions({
      title: source,
    });
  }, []);
  return (
    <WebView
      style={styles.container}
      source={{ uri }}
      userAgent={Agent}
      originWhitelist={["*"]}
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      injectedJavaScript={injectedJavaScript}
      onMessage={(event) => {
        if (source === "登录" && injectedJavaScript) {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            saveUserInfo({ token: data.token, email: "", password: "" });
            // navigation.replace("main");
          } catch {}
        }
      }}
    />
  );
};

export default React.memo(WebViewPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
