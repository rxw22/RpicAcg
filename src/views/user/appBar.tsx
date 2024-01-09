import { useAppConfigStore } from "@/store/appConfigStore";
import React, { useEffect } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Image } from "expo-image";

interface Props {
  flag: boolean;
  uri: string;
  name: string;
}

function UserAppBar({ flag, uri, name }: Props) {
  const { setMode } = useAppConfigStore();
  const statusBarHeight = StatusBar.currentHeight || 0;
  const le = (statusBarHeight + 64) * -1;
  const common = useSharedValue(le);
  const transparent = useSharedValue(0);

  useEffect(() => {
    if (flag) {
      transparent.value = withTiming(0, {
        duration: 100,
      });
      common.value = withTiming(le, {
        duration: 100,
      });
    } else {
      transparent.value = withTiming(le, {
        duration: 100,
      });
      common.value = withTiming(0, {
        duration: 100,
      });
    }
  }, [flag]);

  return (
    <>
      <Animated.View
        style={{ top: transparent, position: "absolute", width: "100%" }}
      >
        <Appbar.Header style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
          <Appbar.Content title="我的" color="#fff" />
          <Appbar.Action
            icon="lead-pencil"
            onPress={() => {
              setMode("dark");
            }}
            color="#fff"
          />
        </Appbar.Header>
      </Animated.View>
      <Animated.View
        style={{ top: common, position: "absolute", width: "100%" }}
      >
        <Appbar.Header>
          <Appbar.Content title="我的" />
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              left: 80,
              alignItems: "center",
              width: 130,
            }}
          >
            <Image
              source={uri}
              contentPosition="top center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 8,
              }}
              placeholder={require("@/assets/imgs/user.png")}
            />
            <Text variant="labelMedium" numberOfLines={1}>
              {name}
            </Text>
          </View>
          <Appbar.Action
            icon="lead-pencil"
            onPress={() => {
              setMode("light");
            }}
          />
        </Appbar.Header>
      </Animated.View>
    </>
  );
}

export default React.memo(UserAppBar);

const styles = StyleSheet.create({});
