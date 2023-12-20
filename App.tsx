import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from "react";

import MainStacks from "@/navigations/mainStacks";
import useCustomTheme from "@/hooks/useCustomTheme";

export default function App() {
  const { paperTheme, navTheme } = useCustomTheme();
  const [fontsLoaded] = useFonts({
    'font1': require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme} onReady={onLayoutRootView}>
        <MainStacks />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
