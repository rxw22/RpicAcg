import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import ToastManager from "toastify-react-native";

import MainStacks from "@/navigations/mainStacks";
import useCustomTheme from "@/hooks/useCustomTheme";
import UtilsProvider from "@/network/utilsProvider";
import { navigationRef } from "@/navigations/RootNavigation";
import { useWindowDimensions } from "react-native";

export default function App() {
  const { paperTheme } = useCustomTheme();
  const [isHidden, setIsHidden] = useState(false);
  const [fontsLoaded] = useFonts({
    font1: require("@/assets/fonts/Poppins-Regular.ttf"),
  });
  const { height: ScreenHeight } = useWindowDimensions();

  // 防止加载太快出现闪屏现象
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 650);
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
      <PaperProvider
        theme={paperTheme}
        settings={{
          // @ts-ignore
          icon: (props) => <Icon {...props} />,
        }}
      >
        <NavigationContainer onReady={onLayoutRootView} ref={navigationRef}>
          <UtilsProvider>
            <MainStacks />
            <StatusBar style="auto" translucent={true} />
            <ToastManager positionValue={ScreenHeight - 120} height={60} />
          </UtilsProvider>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
