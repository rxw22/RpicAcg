import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Checkbox, Dialog, List, Portal } from "react-native-paper";
import { useAppConfigStore } from "@/store/appConfigStore";

function SwitchTheme() {
  const { mode, setMode } = useAppConfigStore();
  const [digVisible, setDigVisible] = useState(false);
  const showDialog = () => setDigVisible(true);
  const hideDialog = () => setDigVisible(false);

  return (
    <>
      <Portal>
        <Dialog visible={digVisible} onDismiss={hideDialog}>
          <Dialog.Title>主题</Dialog.Title>
          <Dialog.Content style={{ position: "relative" }}>
            <Checkbox.Item
              mode="ios"
              label="跟随系统"
              status={mode === "system" ? "checked" : "unchecked"}
              onPress={() => {
                setMode("system");
              }}
            />
            <Checkbox.Item
              mode="ios"
              label="明亮"
              status={mode === "light" ? "checked" : "unchecked"}
              onPress={() => {
                setMode("light");
              }}
            />
            <Checkbox.Item
              mode="ios"
              label="暗色"
              status={mode === "dark" ? "checked" : "unchecked"}
              onPress={() => {
                setMode("dark");
              }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
      <List.Item
        title="主题切换"
        style={styles.listItem}
        left={() => <List.Icon icon="theme-light-dark" />}
        onPress={() => {
          showDialog();
        }}
      />
    </>
  );
}

export default React.memo(SwitchTheme);

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 12,
  },
});
