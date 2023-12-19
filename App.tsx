import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

import MainStacks from "@/navigations/mainStacks";

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <MainStacks />
      </PaperProvider>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
