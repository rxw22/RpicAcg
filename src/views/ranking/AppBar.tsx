import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Appbar } from "react-native-paper";

const RankingAppBar: React.FC<BottomTabHeaderProps> = ({
  navigation,
  route,
}) => {
  return (
    <Appbar.Header>
      <Appbar.Content title="排行" />
    </Appbar.Header>
  );
};

export default React.memo(RankingAppBar);
