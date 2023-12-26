import {
  Image,
  ImageProgressEventData,
  ImageProps,
  ImageErrorEventData,
} from "expo-image";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface Props extends ImageProps {}

const ExpoImage: React.FC<Props> = ({ ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

  const _onProgress = (event: ImageProgressEventData) => {};

  const _onLoadStart = () => {
    setError("");
    setLoading(true);
  };

  const _onError = (event: ImageErrorEventData) => {
    const { error } = event;
    console.log("image: ", error);
    setError(error);
  };

  const _onLoadEnd = () => {
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.progressView}>
          <ActivityIndicator animating={true} size={40} />
        </View>
      )}
      {!loading && error && (
        <View style={styles.progressView}>
          <Icon
            name="alert-circle"
            size={32}
            color={theme.colors.onBackground}
          />
        </View>
      )}
      <Image
        transition={300}
        {...props}
        onError={_onError}
        onLoadEnd={_onLoadEnd}
        onLoadStart={_onLoadStart}
        cachePolicy="disk"
      />
    </View>
  );
};

export default React.memo(ExpoImage);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressView: {
    position: "absolute",
    zIndex: 1,
  },
});
