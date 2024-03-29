import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Icon, List, Menu, Surface, useTheme, Text } from "react-native-paper";
import {
  ImageQuality,
  useAppConfigStore,
  Qualitys,
  DisplayImageQuality,
} from "@/store/appConfigStore";

function PictureQuality() {
  const { imageQuality, setImageQuality } = useAppConfigStore();
  const [visible, setVisible] = useState(false);
  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);
  const theme = useTheme();
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  return (
    <>
      <Menu visible={visible} onDismiss={hideMenu} anchor={anchor}>
        {Qualitys.map((item) => {
          return (
            <Menu.Item
              title={item}
              key={item}
              onPress={() => {
                setImageQuality(ImageQuality[item]);
                hideMenu();
              }}
              trailingIcon={
                imageQuality === ImageQuality[item] ? "check" : undefined
              }
            />
          );
        })}
      </Menu>
      <List.Item
        title="图片质量"
        style={styles.listItem}
        left={() => <List.Icon icon="image-filter-hdr" />}
        right={() => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={(e) => {
              setAnchor({
                x: e.nativeEvent.pageX,
                y: e.nativeEvent.pageY,
              });
              showMenu();
            }}
          >
            <Surface
              style={{
                width: 110,
                height: 36,
                backgroundColor: theme.colors.secondaryContainer,
                paddingHorizontal: 8,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              elevation={2}
            >
              <Text variant="bodyMedium">{DisplayImageQuality[imageQuality]}</Text>
              <Icon source="menu-down" size={20} />
            </Surface>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

export default React.memo(PictureQuality);

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 12,
  },
});
