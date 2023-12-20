import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

import { useAppConfigStore } from "@/store/appConfigStore";

const { LightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  reactNavigationDark: DarkTheme,
});

const useCustomTheme = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const { mode } = useAppConfigStore();

  const darkTheme = { ...MD3DarkTheme, colors: theme.dark };
  const lightTheme = { ...MD3LightTheme, colors: theme.light };

  const paperTheme = colorScheme === "dark" ? darkTheme : lightTheme;

  const navTheme =
    colorScheme === "dark" || mode === "dark" ? NavDarkTheme : LightTheme;

  return {
    paperTheme:
      mode === "system"
        ? paperTheme
        : mode === "light"
        ? lightTheme
        : darkTheme,
    navTheme,
    mode: mode === "system" ? colorScheme : mode,
  };
};

export default useCustomTheme;
