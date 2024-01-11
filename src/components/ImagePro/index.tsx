import { View, Text } from "react-native";
import React, { useState } from "react";
import { Image, ImageProps } from "expo-image";

const ImagePro: React.FC<ImageProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const _onLoadStart = () => {
    setLoading(true);
    setError("");
  };

  const _onLoadEnd = () => {
    setLoading(false);
  };

  const _onLoad = () => {
    
  }

  return <Image onLoadStart={_onLoadStart} onLoadEnd={_onLoadEnd} {...props} />;
};

export default React.memo(ImagePro);
