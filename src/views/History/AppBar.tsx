import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Appbar, Tooltip } from "react-native-paper";

const HistoryAppBar: React.FC<
  NativeStackHeaderProps & { clearAll: () => void }
> = ({ navigation, route, back, clearAll }) => {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="浏览记录" />
      <Tooltip title="清空浏览记录">
        <Appbar.Action
          icon="delete-outline"
          onPress={() => {
            clearAll();
          }}
        />
      </Tooltip>
    </Appbar.Header>
  );
};

export default React.memo(HistoryAppBar);
