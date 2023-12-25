import { View, StyleSheet } from "react-native";
import React from "react";
import {
  useTheme,
  Text,
  FAB,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

type Props = React.ComponentProps<typeof View> & {
  loading?: boolean;
  error?: string;
  refresh?(): void;
};

const BgBox: React.FC<Props> = (props) => {
  const theme = useTheme();

  const bgStyle = StyleSheet.create({
    bg: {
      backgroundColor: theme.colors.background,
    },
    center: {
      alignItems: "center",
      justifyContent: "center",
    },
    fab: {
      position: "absolute",
      bottom: 15,
      right: 15,
    },
    loadingWarpper: {
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      height: "100%",
      width: "100%",
      zIndex: 1,
      backgroundColor: "#00000020",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const style = props.style ? [props.style, bgStyle.bg] : bgStyle.bg;
  const errorStyle = props.style
    ? [props.style, bgStyle.bg, bgStyle.center]
    : [bgStyle.bg, bgStyle.center];

  if (props.error) {
    return (
      <View style={errorStyle}>
        <Icon name="alert" size={60} color={theme.colors.onBackground} />
        <Text variant="headlineMedium">{props.error}</Text>
        <Button mode="contained" onPress={() => props.refresh?.()}>
          重新加载
        </Button>
        <FAB
          icon="restore"
          style={bgStyle.fab}
          onPress={() => props.refresh?.()}
          size="medium"
        />
      </View>
    );
  }

  return (
    <View {...props} style={style}>
      {props.children}
      {props.loading && (
        <View style={bgStyle.loadingWarpper}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}
    </View>
  );
};

export default BgBox;
