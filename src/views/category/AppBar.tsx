import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";

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
        icon="cog-outline"
        onPress={() => {
          navigation.navigate("settings");
        }}
      />
    </Appbar.Header>
  );
};

export default CategoryAppBar;