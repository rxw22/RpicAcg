import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import BgBox from "@/components/bgBox";
import usePicaHttp from "@/services/http";
import { useEffect } from "react";

export default function Category() {
  const { fetchCategories } = usePicaHttp();
  const getCategories = async () => {
    try {
      const result = await fetchCategories();
      console.log(JSON.stringify(result));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // getCategories();
  }, []);

  return (
    <BgBox style={styles.container}>
      <Text variant="headlineMedium">Category!</Text>
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
