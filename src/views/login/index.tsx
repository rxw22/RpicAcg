import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";

import { useBearStore } from "@/store/bearStore";
import BgBox from "@/components/bgBox";

import type { RootStackParamList } from "@/navigations/mainStacks/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppConfigStore } from "@/store/appConfigStore";

type Props = NativeStackScreenProps<RootStackParamList, "login">;

const Login: React.FC<Props> = ({ navigation }) => {
  const { bears, increasePopulation, removeAllBears } = useBearStore();
  const { mode, setMode } = useAppConfigStore();

  return (
    <BgBox style={styles.container}>
      <Text variant="headlineMedium">bears: {bears}</Text>
      <Text variant="headlineMedium">mode: {mode}</Text>
      <Button onPress={() => increasePopulation()} mode="contained">
        Add
      </Button>
      <Button onPress={() => removeAllBears()} mode="contained">
        RemoveAll
      </Button>
      <Button onPress={() => navigation.replace("main")} mode="contained">
        navigate
      </Button>
      <View style={styles.devider}>
        <Button onPress={() => setMode("system")} mode="contained">
          system
        </Button>
        <Button onPress={() => setMode("light")} mode="contained">
          light
        </Button>
        <Button onPress={() => setMode("dark")} mode="contained">
          dark
        </Button>
      </View>
    </BgBox>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  devider: {
    marginTop: 15,
    flexDirection: "row",
  },
});
