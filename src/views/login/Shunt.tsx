import { StyleSheet } from "react-native";
import React from "react";
import { Portal, Dialog, Checkbox, IconButton } from "react-native-paper";

import { AppChannel, useAppConfigStore } from "@/store/appConfigStore";
import { useNetworkDelay } from "@/hooks/useNetworkDelay";

const Shunt = () => {
  const { setAppChannel, appChannel } = useAppConfigStore();
  const [digVisible, setDigVisible] = React.useState(false);
  const showDialog = () => setDigVisible(true);
  const hideDialog = () => setDigVisible(false);
  const { start, netState } = useNetworkDelay();
  return (
    <>
      <IconButton
        icon="wifi-cog"
        style={styles.cogBtn}
        size={22}
        onPress={() => {
          showDialog();
          start();
        }}
      />
      <Portal>
        <Dialog visible={digVisible} onDismiss={hideDialog}>
          <Dialog.Title>分流 (延迟只能做参考)</Dialog.Title>
          <Dialog.Content>
            <Checkbox.Item
              mode="ios"
              label={`分流一 (${netState.分流一})`}
              status={
                appChannel === AppChannel.分流一 ? "checked" : "unchecked"
              }
              onPress={() => {
                setAppChannel(AppChannel.分流一);
              }}
            />
            <Checkbox.Item
              mode="ios"
              label={`分流二 (${netState.分流二})`}
              status={
                appChannel === AppChannel.分流二 ? "checked" : "unchecked"
              }
              onPress={() => {
                setAppChannel(AppChannel.分流二);
              }}
            />
            <Checkbox.Item
              mode="ios"
              label={`分流三 (${netState.分流三})`}
              status={
                appChannel === AppChannel.分流三 ? "checked" : "unchecked"
              }
              onPress={() => {
                setAppChannel(AppChannel.分流三);
              }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

export default React.memo(Shunt);

const styles = StyleSheet.create({
  cogBtn: {
    position: "absolute",
    top: 35,
    right: 0,
    margin: 16,
  },
});
