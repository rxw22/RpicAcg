import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

import { useAppConfigStore } from "@/store/appConfigStore";
import { customThemes } from "@/themes";

const useCustomTheme = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const { darkMode, themeMode } = useAppConfigStore();

  const darkTheme = { ...MD3DarkTheme, colors: theme.dark };
  const lightTheme = { ...MD3LightTheme, colors: theme.light };

  const themes = {
    Dynamic: {
      darkTheme,
      lightTheme,
    },
    Purple: {
      darkTheme: MD3DarkTheme,
      lightTheme: MD3LightTheme,
    },
    ...customThemes,
  };

  const appTheme = themes[themeMode];

  let paperTheme;

  if (darkMode === "system") {
    paperTheme =
      colorScheme === "dark" ? appTheme.darkTheme : appTheme.lightTheme;
  } else if (darkMode === "light") {
    paperTheme = appTheme.lightTheme;
  } else {
    paperTheme = appTheme.darkTheme;
  }

  return {
    paperTheme,
  };
};

export default useCustomTheme;
