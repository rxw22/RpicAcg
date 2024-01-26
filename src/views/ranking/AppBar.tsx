import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Appbar } from "react-native-paper";

const RankingAppBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  back
}) => {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="排行" />
    </Appbar.Header>
  );
};

export default React.memo(RankingAppBar);
