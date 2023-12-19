import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";

const CustomNavigationBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  options,
  back,
}) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default CustomNavigationBar;
