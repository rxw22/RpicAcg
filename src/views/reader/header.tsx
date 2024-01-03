import { StyleSheet } from "react-native";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import Animated, { SharedValue } from "react-native-reanimated";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

type Props = {
  position: SharedValue<number>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "reader",
    undefined
  >;
  title: string;
};

const Header: React.FC<Props> = ({ position, navigation, title }) => {
  const theme = useTheme();
  return (
    <Animated.View style={[styles.warpper, { top: position }]}>
      <Appbar.Header
        style={{ backgroundColor: `${theme.colors.secondaryContainer}C0` }}
      >
        {navigation.canGoBack() ? (
          <Appbar.BackAction onPress={navigation.goBack} />
        ) : null}
        <Appbar.Content title={title} />
        <Appbar.Action
          icon="cog-outline"
          onPress={() => {
            // navigation.navigate("settings");
          }}
        />
      </Appbar.Header>
    </Animated.View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  warpper: {
    top: -64,
  },
});
