import { ComicSort } from "@/network/types";
import { useGlobalStore } from "@/store/globalStore";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Appbar, Menu } from "react-native-paper";

const ComicsAppBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  back,
}) => {
  const { c = "", knight = "", a = "", ct = "" } = route.params as any;
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState({
    x: 0,
    y: 0,
  });
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { comicSort, setComicSort } = useGlobalStore();

  const options = [
    {
      label: "默认",
      value: ComicSort.Default,
    },
    {
      label: "新到旧",
      value: ComicSort.NewToOld,
    },
    {
      label: "旧到新",
      value: ComicSort.OldToNew,
    },
    {
      label: "最多爱心",
      value: ComicSort.Like,
    },
    {
      label: "最多观看",
      value: ComicSort.View,
    },
  ];

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={`${c}${knight}${a}${ct}`} />
      <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
        {options.map((item) => {
          return (
            <Menu.Item
              onPress={() => {
                setComicSort(item.value);
              }}
              title={item.label}
              key={item.label}
              trailingIcon={comicSort === item.value ? "check" : undefined}
            />
          );
        })}
      </Menu>
      <Appbar.Action
        icon="sort"
        // @ts-ignore
        onPress={(e) => {
          const { pageX, pageY } = e.nativeEvent;
          setAnchor({ x: pageX, y: pageY });
          openMenu();
        }}
      />
    </Appbar.Header>
  );
};

export default ComicsAppBar;
