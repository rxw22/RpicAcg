import { View, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

type Props = React.ComponentProps<typeof View>;

const BgBox: React.FC<Props> = (props) => {
  const theme = useTheme();

  const bgStyle = StyleSheet.create({
    bg: {
      backgroundColor: theme.colors.background,
    },
  });

  const style = props.style ? [props.style, bgStyle.bg] : bgStyle.bg;

  return <View {...props} style={style} />;
};

export default BgBox;
