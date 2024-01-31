import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Appbar, Tooltip } from "react-native-paper";

const CollectBar: React.FC<
  NativeStackHeaderProps & { collect: () => void }
> = ({ navigation, back, collect }) => {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="" />
      <Tooltip title="本地收藏">
        <Appbar.Action
          icon="book-cross"
          onPress={() => {
            collect();
          }}
        />
      </Tooltip>
    </Appbar.Header>
  );
};

export default React.memo(CollectBar);
