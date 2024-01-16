import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Checkbox, Dialog, List, Portal } from "react-native-paper";
import { ImageQuality, useAppConfigStore } from "@/store/appConfigStore";

function PictureQuality() {
  const { imageQuality, setImageQuality } = useAppConfigStore();
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
              label="原图"
              status={
                imageQuality === ImageQuality.原图 ? "checked" : "unchecked"
              }
              onPress={() => {
                setImageQuality(ImageQuality.原图);
              }}
            />
            <Checkbox.Item
              mode="ios"
              label="高"
              status={
                imageQuality === ImageQuality.高 ? "checked" : "unchecked"
              }
              onPress={() => {
                setImageQuality(ImageQuality.高);
              }}
            />
            <Checkbox.Item
              mode="ios"
              label="中"
              status={
                imageQuality === ImageQuality.中 ? "checked" : "unchecked"
              }
              onPress={() => {
                setImageQuality(ImageQuality.中);
              }}
            />
            <Checkbox.Item
              mode="ios"
              label="低"
              status={
                imageQuality === ImageQuality.低 ? "checked" : "unchecked"
              }
              onPress={() => {
                setImageQuality(ImageQuality.低);
              }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
      <List.Item
        title="图片质量"
        style={styles.listItem}
        left={() => <List.Icon icon="image-edit" />}
        onPress={() => {
          showDialog();
        }}
      />
    </>
  );
}

export default React.memo(PictureQuality);

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 12,
  },
});
