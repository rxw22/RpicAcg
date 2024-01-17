import { View, StyleSheet } from "react-native";
import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import { useTheme } from "react-native-paper";

interface Props {
  position: SharedValue<number>;
}

const Bottom: React.FC<Props> = ({ position }) => {
  const theme = useTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: position,
          backgroundColor: `${theme.colors.secondaryContainer}F0`,
        },
      ]}
    >
      <View style={styles.opts}>
        <View></View>
        <View></View>
      </View>
    </Animated.View>
  );
};

export default React.memo(Bottom);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: -90,
    left: 0,
    right: 0,
    width: "100%",
    height: 90,
    padding: 12,
  },
  opts: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
