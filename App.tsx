import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

import MainStacks from "@/navigations/mainStacks";
import useCustomTheme from "@/hooks/useCustomTheme";

export default function App() {
  const { paperTheme, navTheme } = useCustomTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <MainStacks />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
