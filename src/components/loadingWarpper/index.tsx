import { StyleSheet, View, StatusBar } from "react-native";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

import React from "react";
import BgBox from "../bgBox";

interface Props {
  loading: boolean;
  errorMsg?: string;
  retry?(): void;
}

const LoadingWarpper: React.FC<Props> = ({ loading, errorMsg, retry }) => {
  const statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight + 64
    : 64;
  if (errorMsg) {
    return (
      <BgBox style={[styles.errorContainer, { top: statusBarHeight }]}>
        <Text variant="bodyLarge">{errorMsg}</Text>
      </BgBox>
    );
  }

  return loading ? (
    <View style={[styles.container, { top: statusBarHeight }]}>
      <Surface elevation={4} style={styles.surface}>
        <ActivityIndicator animating={true} size="large" />
        <View
          style={{
            marginTop: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="bodyMedium">加载中...</Text>
        </View>
      </Surface>
    </View>
  ) : null;
};

export default LoadingWarpper;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "#00000010",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  surface: {
    height: 110,
    width: 110,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});
