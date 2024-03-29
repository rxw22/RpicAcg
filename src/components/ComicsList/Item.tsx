import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Comic } from "@/network/types";
import {
  Card,
  Icon,
  Text,
  useTheme,
  TouchableRipple,
  Menu,
} from "react-native-paper";
import { Image } from "expo-image";

type Props = {
  item: Comic;
  navigate: (name: string, params: any) => void;
  longPress?: (_id: string) => void;
};

const Item: React.FC<Props> = ({ item, navigate, longPress }) => {
  const theme = useTheme();
  const {
    thumb,
    author,
    title,
    totalLikes,
    totalViews,
    categories,
    pagesCount,
    likesCount,
  } = item;
  const uri = `${thumb.fileServer}/static/${thumb.path}`;

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [anchor, setAnchor] = useState({
    x: 0,
    y: 0,
  });

  return (
    <TouchableRipple
      style={styles.itemContainer}
      rippleColor="rgba(0, 0, 0, .2)"
      onPress={() => {
        navigate("details", { comicId: item._id });
      }}
      onLongPress={(e) => {
        if (longPress) {
          const { pageX, pageY } = e.nativeEvent;
          setAnchor({
            x: pageX,
            y: pageY,
          });
          openMenu();
        }
      }}
    >
      <View
        style={[
          styles.full,
          {
            flexDirection: "row",
            alignItems: "center",
          },
        ]}
      >
        <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
          <Menu.Item
            onPress={() => {
              if (longPress) {
                longPress(item._id);
                closeMenu();
              }
            }}
            title="移除当前项"
          />
        </Menu>
        <Card style={styles.itemWarpper} mode="contained">
          <Image
            style={styles.full}
            source={{ uri }}
            recyclingKey={uri}
            transition={150}
          />
        </Card>
        <View style={styles.itemDescription}>
          <View>
            <Text variant="titleMedium" numberOfLines={2}>
              [{pagesCount}P]{title}
            </Text>
            <Text variant="labelSmall" numberOfLines={1}>
              {author}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              paddingVertical: 4,
              overflow: "hidden",
            }}
          >
            {categories.map((item) => (
              <View
                key={item}
                style={{
                  padding: 4,
                  backgroundColor: theme.colors.secondaryContainer,
                  borderRadius: 6,
                  marginRight: 4,
                  marginBottom: 4,
                }}
              >
                <Text variant="labelSmall">{item}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Icon source="heart" size={12} color={theme.colors.primary} />
              <View style={{ width: 5 }} />
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.primary }}
              >
                {totalLikes || likesCount}
              </Text>
            </View>
            <View style={{ width: 15 }} />
            {(totalViews || totalViews === 0) && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Icon source="eye" size={12} color={theme.colors.primary} />
                <View style={{ width: 5 }} />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.primary }}
                >
                  {totalViews}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

export default React.memo(Item);

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 150,
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
  },
  itemWarpper: {
    width: 99,
    height: 140,
    overflow: "hidden",
    position: "relative",
  },
  itemDescription: {
    flex: 1,
    marginLeft: 8,
    height: "100%",
    justifyContent: "space-between",
  },
  full: {
    width: "100%",
    height: "100%",
  },
});
