import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function Ranking() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Ranking!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});