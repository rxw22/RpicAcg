import { StyleSheet, View } from "react-native";
import React from "react";
import { Portal, Dialog, Checkbox, IconButton, Text } from "react-native-paper";

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
          <Dialog.Title>分流</Dialog.Title>
          <Dialog.Content style={{ position: "relative" }}>
            <Checkbox.Item
              mode="ios"
              label="分流一"
              status={
                appChannel === AppChannel.分流一 ? "checked" : "unchecked"
              }
              onPress={() => {
                setAppChannel(AppChannel.分流一);
              }}
            />
            <View style={styles.one}>
              <Text variant="bodySmall">{netState.分流一}</Text>
            </View>
            <Checkbox.Item
              mode="ios"
              label="分流二"
              status={
                appChannel === AppChannel.分流二 ? "checked" : "unchecked"
              }
              onPress={() => {
                setAppChannel(AppChannel.分流二);
              }}
            />
            <View style={styles.two}>
              <Text variant="bodySmall">{netState.分流二}</Text>
            </View>
            <Checkbox.Item
              mode="ios"
              label="分流三"
              status={
                appChannel === AppChannel.分流三 ? "checked" : "unchecked"
              }
              onPress={() => {
                setAppChannel(AppChannel.分流三);
              }}
            />
            <View style={styles.three}>
              <Text variant="bodySmall">{netState.分流三}</Text>
            </View>
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
  one: {
    position: "absolute",
    top: 17,
    left: 150,
  },
  two: {
    position: "absolute",
    top: 69,
    left: 150,
  },
  three: {
    position: "absolute",
    top: 121,
    left: 150,
  },
});
