import { StyleSheet, View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";

import { useBearStore } from "@/store/bearStore";

import type { RootStackParamList } from "@/navigations/mainStacks/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "login">;

const Login: React.FC<Props> = ({ navigation }) => {
  const { bears, increasePopulation, removeAllBears } = useBearStore();
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineMedium">bears: {bears}</Text>
      <Button onPress={() => increasePopulation()} mode="contained">
        Add
      </Button>
      <Button onPress={() => removeAllBears()} mode="contained">
        RemoveAll
      </Button>
      <Button onPress={() => navigation.replace("main")} mode="contained">
        navigate
      </Button>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
