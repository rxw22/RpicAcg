import { StyleSheet } from "react-native";
import { Checkbox, Dialog, List, Portal, Text } from "react-native-paper";

import BgBox from "@/components/bgBox";
import { useState } from "react";
import { useAppConfigStore } from "@/store/appConfigStore";

export default function Settings() {
  const { mode, setMode } = useAppConfigStore();
  const [digVisible, setDigVisible] = useState(false);
  const showDialog = () => setDigVisible(true);
  const hideDialog = () => setDigVisible(false);
  return (
    <BgBox style={styles.container}>
      <List.Section>
        <List.Subheader>外观</List.Subheader>
        <List.Item
          title="主题切换"
          style={styles.listItem}
          left={() => <List.Icon icon="theme-light-dark" />}
          onPress={() => {
            showDialog()
          }}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>浏览</List.Subheader>
        <List.Item
          title="切换分流"
          style={styles.listItem}
          left={() => <List.Icon icon="wifi-cog" />}
          onPress={() => {
            showDialog()
          }}
        />
        <List.Item
          title="图片质量"
          style={styles.listItem}
          left={() => <List.Icon icon="camera-image" />}
          onPress={() => {
            showDialog()
          }}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>缓存</List.Subheader>
        <List.Item
          title="切换分流"
          style={styles.listItem}
          left={() => <List.Icon icon="wifi-cog" />}
          onPress={() => {
            showDialog()
          }}
        />
        <List.Item
          title="图片质量"
          style={styles.listItem}
          left={() => <List.Icon icon="camera-image" />}
          onPress={() => {
            showDialog()
          }}
        />
      </List.Section>
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
    </BgBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    paddingHorizontal: 12,
  },
});
