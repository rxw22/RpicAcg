import { View, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Image,
  ImageProps,
  ImageLoadEventData,
  ImageErrorEventData,
} from "expo-image";
import { ActivityIndicator, Text } from "react-native-paper";

interface Props extends ImageProps {
  uri: string;
  shouldLoad: boolean;
}

const ReaderImage: React.FC<Props> = ({ shouldLoad, uri, ...props }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [layout, setLayout] = useState({
    width: screenWidth,
    height: (screenHeight * 3) / 4,
  });

  const _onLoad = (event: ImageLoadEventData) => {
    const { height, width } = event.source;
    setLayout({ ...layout, height: (screenWidth * height) / width });
  };

  const _onLoadStart = () => {
    setLoading(true);
    setError("");
  };

  const _onLoadEnd = () => {
    setLoading(false);
  };

  const _onError = (event: ImageErrorEventData) => {
    const { error } = event;
    setError(error);
    console.log(error);
  };

  return (
    <View style={{ ...layout, position: "relative" }}>
      {!loading && error && (
        <View style={styles.loadingWarpper}>
          <Text variant="bodyLarge" style={{ color: "#fff" }}>
            {error}
          </Text>
        </View>
      )}
      <Image
        style={{ width: "100%", height: "100%" }}
        source={shouldLoad ? { uri } : {}}
        {...props}
        onLoadStart={_onLoadStart}
        onLoadEnd={_onLoadEnd}
        onError={_onError}
        onLoad={_onLoad}
        cachePolicy="disk"
        placeholder={require("@/assets/imgs/loading.gif")}
      />
    </View>
  );
};

export default React.memo(ReaderImage);

const styles = StyleSheet.create({
  // loadingWarpper: {
  //   width: "100%",
  //   height: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   position: "absolute",
  //   left: 0,
  //   top: 0,
  //   zIndex: 1,
  // },
  loadingWarpper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
