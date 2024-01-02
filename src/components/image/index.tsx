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
import * as Progress from "react-native-progress";

interface Props extends ImageProps {
  size?: number;
  pageLoading?: boolean;
  showLoading?: boolean;
}

const ExpoImage: React.FC<Props> = ({
  size = 40,
  pageLoading,
  showLoading = true,
  source,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  const _onProgress = (event: ImageProgressEventData) => {
    const { loaded, total } = event;
    const progress = Number((loaded / total).toFixed(1));
    setProgress(progress);
  };

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
      {loading && showLoading && (
        <View style={styles.progressView}>
          <Progress.Pie
            progress={progress}
            size={size}
            color={theme.colors.primary}
          />
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
        source={pageLoading ? {} : source}
        onError={_onError}
        onLoadEnd={_onLoadEnd}
        onLoadStart={_onLoadStart}
        onProgress={_onProgress}
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
