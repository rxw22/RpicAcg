import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import React from "react";

const CategoryAppBar: React.FC<BottomTabHeaderProps> = ({
  navigation,
  route,
  options,
}) => {
  const title = getHeaderTitle(options, route.name);
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Appbar.Action
        icon="magnify"
        onPress={() => {
          navigation.navigate("search");
        }}
      />
      <Appbar.Action
        icon="cog-outline"
        onPress={() => {
          navigation.navigate("settings");
        }}
      />
    </Appbar.Header>
  );
};

export default React.memo(CategoryAppBar);
