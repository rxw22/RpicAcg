import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";

const CommentAppBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  options,
  back
}) => {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default React.memo(CommentAppBar);
