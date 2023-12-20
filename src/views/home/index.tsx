import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import BgBox from "@/components/bgBox";

export default function Home() {
  return (
    <BgBox style={styles.container}>
      <Text variant="headlineMedium">Home!</Text>
    </BgBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
