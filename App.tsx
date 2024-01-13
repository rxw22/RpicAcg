import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MainStacks from "@/navigations/mainStacks";
import useCustomTheme from "@/hooks/useCustomTheme";
import NetworkProvider from "@/network/utilsProvider";
import { navigationRef } from "@/navigations/RootNavigation";
import Toast, { ToastRef } from "@/components/Toast";

export default function App() {
  const { paperTheme, navTheme } = useCustomTheme();
  const [isHidden, setIsHidden] = useState(false);
  const toastRef = useRef<ToastRef>({
    show() {},
    hide() {},
  });
  const [fontsLoaded] = useFonts({
    font1: require("@/assets/fonts/Poppins-Regular.ttf"),
  });

  // 防止加载太快出现闪屏现象
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 600);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isHidden) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHidden]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer
          theme={navTheme}
          onReady={onLayoutRootView}
          ref={navigationRef}
        >
          <NetworkProvider Toast={toastRef.current}>
            <MainStacks />
            <StatusBar style="auto" translucent={true} />
            <Toast ref={toastRef} />
          </NetworkProvider>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
