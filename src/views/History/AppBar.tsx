import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Appbar,
  Dialog,
  Tooltip,
  Text,
  Button,
  Portal,
} from "react-native-paper";

const HistoryAppBar: React.FC<
  NativeStackHeaderProps & { clearAll: () => void }
> = ({ navigation, route, back, clearAll }) => {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="浏览记录" />
      <Tooltip title="清空浏览记录">
        <Appbar.Action
          icon="delete-outline"
          onPress={() => {
            showDialog();
          }}
        />
      </Tooltip>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>提示</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">确定要清空浏览记录吗？</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>取消</Button>
            <Button
              onPress={() => {
                clearAll();
                hideDialog();
              }}
            >
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Appbar.Header>
  );
};

export default React.memo(HistoryAppBar);
