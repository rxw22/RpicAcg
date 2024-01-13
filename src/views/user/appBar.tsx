import { useAppConfigStore } from "@/store/appConfigStore";
import React from "react";
import { StyleSheet } from "react-native";
import { Appbar, Dialog, Portal, Text, Button } from "react-native-paper";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUserStore } from "@/store/userStore";

interface Props {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootBottomTabsParamList, "user", undefined>,
    NativeStackNavigationProp<RootStackParamList>
  >;
}

function UserAppBar({ navigation }: Props) {
  const { setMode, mode } = useAppConfigStore();
  const { clearToken } = useUserStore();
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const logout = () => {
    showDialog();
  };

  const clearCache = () => {
    clearToken();
    navigation.replace("login");
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="我的" />
        <Appbar.Action
          icon="lead-pencil"
          onPress={() => {
            setMode(mode === "light" ? "dark" : "light");
          }}
        />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
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
