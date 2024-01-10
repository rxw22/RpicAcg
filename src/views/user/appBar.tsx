import { useAppConfigStore } from "@/store/appConfigStore";
import React, { useEffect } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { Appbar, Dialog, Portal, Text, Button } from "react-native-paper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Image } from "expo-image";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUserStore } from "@/store/userStore";

interface Props {
  flag: boolean;
  uri: string;
  name: string;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootBottomTabsParamList, "user", undefined>,
    NativeStackNavigationProp<RootStackParamList>
  >;
}

function UserAppBar({ flag, uri, name, navigation }: Props) {
  const { setMode } = useAppConfigStore();
  const { clearToken } = useUserStore();
  const statusBarHeight = StatusBar.currentHeight || 0;
  const le = (statusBarHeight + 64) * -1;
  const common = useSharedValue(le);
  const transparent = useSharedValue(0);
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

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

  const logout = () => {
    showDialog();
  };

  const clearCache = () => {
    clearToken();
    navigation.replace("login");
  };

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
          <Appbar.Action icon="logout" onPress={logout} color="#fff" />
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
          <Appbar.Action
            icon="logout"
            onPress={() => {
              setMode("light");
            }}
          />
        </Appbar.Header>
      </Animated.View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>提示</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">确定要退出登录吗？</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideDialog();
              }}
            >
              取消
            </Button>
            <Button
              onPress={() => {
                clearCache();
              }}
            >
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default React.memo(UserAppBar);

const styles = StyleSheet.create({});
