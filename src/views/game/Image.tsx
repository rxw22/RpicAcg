import { StyleSheet, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import { Image, ImageProps, ImageLoadEventData } from "expo-image";

interface Props extends ImageProps {
  fixedHeight: number;
}

const ShotImage: React.FC<Props> = ({ fixedHeight, style = {}, ...props }) => {
  const [layout, setLayout] = useState({
    width: 152,
    height: fixedHeight,
  });

  const _onLoad = (event: ImageLoadEventData) => {
    const { height, width } = event.source;
    setLayout({ height: fixedHeight, width: (width * fixedHeight) / height });
  };

  return (
    <Image
      {...props}
      onLoad={_onLoad}
      cachePolicy="disk"
      style={[style, layout]}
    />
  );
};

export default React.memo(ShotImage);

const styles = StyleSheet.create({});
