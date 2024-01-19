import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { List, useTheme, Text, Surface, Icon, Menu } from "react-native-paper";
import { useAppConfigStore, Colors } from "@/store/appConfigStore";

function SwitchDark() {
  const { themeMode, setThemeMode } = useAppConfigStore();
  const [visible, setVisible] = useState(false);
  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);
  const theme = useTheme();
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  return (
    <>
      <Menu visible={visible} onDismiss={hideMenu} anchor={anchor}>
        {Colors.map((item) => {
          return (
            <Menu.Item
              key={item}
              onPress={() => {
                setThemeMode(item);
                hideMenu();
              }}
              title={item}
              trailingIcon={themeMode === item ? "check" : undefined}
            />
          );
        })}
      </Menu>
      <List.Item
        title="颜色主题"
        style={styles.listItem}
        left={() => <List.Icon icon="palette" />}
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
              <Text variant="bodyMedium">{themeMode}</Text>
              <Icon source="menu-down" size={20} />
            </Surface>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

export default React.memo(SwitchDark);

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 12,
  },
});
