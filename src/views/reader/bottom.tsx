import { View, StyleSheet } from "react-native";
import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import { useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";

interface Props {
  position: SharedValue<number>;
  currentPage: number;
  max: number;
  scrollToIndexBySlider: (value: number) => void;
}

const Bottom: React.FC<Props> = ({
  position,
  currentPage,
  max,
  scrollToIndexBySlider,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: position,
          backgroundColor: theme.colors.secondaryContainer,
        },
      ]}
    >
      <View style={styles.opts}>
        <View style={{ width: "100%" }}>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={max}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#000000C0"
            value={currentPage}
            onSlidingComplete={(value) => {
              scrollToIndexBySlider(value);
            }}
          />
        </View>
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
