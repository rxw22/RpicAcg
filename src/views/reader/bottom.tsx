import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import { useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";

interface Props {
  position: SharedValue<number>;
  onSlidingComplete(value: number): void;
  maximumValue: number;
}

const Bottom: React.FC<Props> = ({ position, onSlidingComplete, maximumValue }) => {
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
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={maximumValue}
        step={1}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.secondary}
        thumbTintColor={theme.colors.primary}
        onSlidingComplete={onSlidingComplete}
      />
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  opts: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
