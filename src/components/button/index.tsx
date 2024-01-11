import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface Props extends React.ComponentProps<typeof Pressable> {
  rippleColor?: string;
  icon?: any;
  iconSize?: number;
  iconColor?: string;
  title: string | number | undefined;
  textProps?: Omit<React.ComponentProps<typeof Text>, "children">;
  loading?: boolean;
}

const PressableButton: React.FC<Props> = ({
  rippleColor = "#00000020",
  style,
  icon,
  iconSize = 20,
  iconColor,
  title,
  textProps = { variant: "bodyMedium" },
  loading,
  ...rest
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? rippleColor : "#00000000",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style ? style : styles.nullView,
      ]}
      {...rest}
    >
      {!loading ? (
        icon && <Icon name={icon} size={iconSize} color={iconColor} />
      ) : (
        <ActivityIndicator animating size={22} />
      )}
      <View style={{ marginLeft: 8 }}>
        <Text {...textProps}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(PressableButton);

const styles = StyleSheet.create({
  nullView: {},
});
