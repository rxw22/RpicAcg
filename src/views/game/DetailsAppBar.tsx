import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Appbar } from "react-native-paper";

const RankingAppBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  back
}) => {
  const { title = "" } = route.params as { title: string; gameId: string };
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default React.memo(RankingAppBar);
