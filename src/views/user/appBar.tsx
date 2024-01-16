import { useAppConfigStore } from "@/store/appConfigStore";
import React from "react";
import { StyleSheet } from "react-native";
import { Appbar, Dialog, Portal, Text, Button } from "react-native-paper";
import { useUserStore } from "@/store/userStore";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";

function UserAppBar({ navigation }: BottomTabHeaderProps) {
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
    // @ts-ignore
    navigation.replace("login");
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="我的" />
        <Appbar.Action icon="lead-pencil" onPress={() => {}} />
        <Appbar.Action icon="comment-multiple" onPress={() => {}} />
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
